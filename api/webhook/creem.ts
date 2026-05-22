import { creem } from '../_utils/creem.js';
import { supabaseAdmin } from '../_utils/supabase.js';

// Vercel function config to handle raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to safely convert timestamp to ISO string (Supports both Unix Timestamp and ISO String)
const safeISO = (input: any) => {
  if (!input) return null;
  
  // 1. Try treating as existing Date string/ISO
  if (typeof input === 'string' && (input.includes('T') || input.includes('-'))) {
      const d = new Date(input);
      if (!isNaN(d.getTime())) {
          return d.toISOString();
      }
  }

  // 2. Try treating as Unix Timestamp (Seconds)
  const ts = Number(input);
  if (!isNaN(ts)) {
      const date = new Date(ts * 1000);
      return !isNaN(date.getTime()) ? date.toISOString() : null;
  }
  
  return null;
};

async function buffer(readable: any) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'active', message: 'Creem Webhook Endpoint is working' });
  }

  // Debug: Check env vars
  if (!process.env.CREEM_WEBHOOK_SECRET) {
    console.error('CREEM_WEBHOOK_SECRET is missing');
    // Log to DB even if secret is missing, to warn admin
    await supabaseAdmin.from('transaction_logs').insert({
        action: 'webhook_error',
        status: 'config_error',
        details: { error: 'CREEM_WEBHOOK_SECRET is missing' }
    });
    return res.status(500).json({ error: 'Server configuration error' });
  }

  if (req.method !== 'POST') return res.status(405).end();

  const buf = await buffer(req);
  
  // Standardize signature verification
  const rawSignature = req.headers['creem-signature'];
  const signature = Array.isArray(rawSignature) ? rawSignature[0] : rawSignature;

  // Parse payload for logging
  let payloadLog = null;
  try {
      const bodyStr = buf.toString('utf8');
      payloadLog = JSON.parse(bodyStr);
  } catch (e) {
      console.warn('Failed to parse webhook body for logging', e);
      payloadLog = { raw_truncated: buf.toString('utf8').substring(0, 1000), error: 'JSON Parse Error' };
  }

  // Initial Logging: Receipt
  await supabaseAdmin.from('transaction_logs').insert({
    action: 'webhook_received',
    status: 'pending',
    payload: payloadLog,
    details: { 
        signature_present: !!signature,
        body_length: buf.length,
        content_type: req.headers['content-type']
    }
  });

  if (!signature) {
    console.error('Missing signature.');
    return res.status(400).send('Missing signature');
  }

  try {
    // Note: creem_io SDK handles signature verification inside handleEvents if webhookSecret is provided in config.
    // If it throws "Invalid signature", ensure secret is correct.
    
    try {
      await creem.webhooks.handleEvents(buf, signature as string, {
        onCheckoutCompleted: async (data) => {
          console.log('Checkout Completed:', data.id);
          
          // Log handler entry
          await supabaseAdmin.from('transaction_logs').insert({
              action: 'webhook_handler_start',
              status: 'processing',
              details: { event: 'checkout.completed', id: data.id }
          });
          
          let userId = data.metadata?.userId as string;
          let priceId = data.metadata?.priceId as string; 
  
          // --- ROBUST FALLBACK: If metadata missing, check PENDING order by provider_order_id ---
          if (!userId || !priceId) {
               console.warn('Metadata missing in webhook. Attempting to recover from pending order...');
               const { data: pendingOrder } = await supabaseAdmin
                  .from('orders')
                  .select('user_id, package_id')
                  .eq('provider_order_id', data.id) // data.id is the checkout_id
                  .single();
               
               if (pendingOrder) {
                   userId = userId || pendingOrder.user_id;
                   priceId = priceId || pendingOrder.package_id;
                   console.log(`Recovered metadata from DB: User ${userId}, Price ${priceId}`);
               }
          }
          // -------------------------------------------------------------------------------------
  
          if (!userId) {
              console.error('No userId found in metadata or DB.');
              return;
          }
  
          // --- NEW LOGIC: Skip Checkout Processing for Subscriptions ---
          // Since "subscription.paid" also fires for the first payment, we defer all subscription
          // logic to that event to avoid race conditions and double-crediting.
          // Checkout.completed will ONLY handle one-time purchases (Credit Packs).
                              const productBillingType = data.product && (data.product.billingType || (data.product as any).billing_type);
          if (data.subscription || productBillingType === 'recurring') {
              const subId = typeof data.subscription === 'string' ? data.subscription : data.subscription?.id;
              console.log(`[Idempotency] Skipping checkout.completed for Subscription ${subId || 'unknown'}.`);
              console.log('Reason: Subscription logic is handled exclusively by subscription.paid event.');
              
              // We still log the receipt, but do not process credits/RPC.
              await supabaseAdmin.from('transaction_logs').insert({
                  action: 'checkout_skipped_subscription',
                  status: 'skipped',
                  user_id: userId,
                  details: { reason: 'Handled by subscription.paid', checkout_id: data.id, subscription_id: subId }
              });
              return;
          }
          // -------------------------------------------------------------

          // --- SECURITY CHECK: Prevent Duplicate Subscriptions ---
          // (Legacy check - mostly redundant now if we skip subscriptions above, but good for safety)
          if (data.subscription) {
              const newSubId = typeof data.subscription === 'string' ? data.subscription : data.subscription.id;
              
              // Check if user already has an active subscription in our DB
              const { data: profile } = await supabaseAdmin
                  .from('profiles')
                  .select('creem_subscription_id, tier')
                  .eq('id', userId)
                  .single();
  
              // If user has a subscription ID stored, and it's NOT the one we just processed (and not null)
              // AND user is not on 'free' tier (double check)
              if (profile?.creem_subscription_id && profile.creem_subscription_id !== newSubId && profile.tier !== 'free') {
                  const conflictMsg = `[SECURITY] User ${userId} attempted to subscribe again (Sub: ${newSubId}) while having active subscription ${profile.creem_subscription_id}.`;
                  console.warn(conflictMsg);
                  
                  // Log security block to DB
                  await supabaseAdmin.from('transaction_logs').insert({
                      action: 'checkout_blocked_security',
                      status: 'error',
                      user_id: userId,
                      details: { 
                          reason: 'duplicate_subscription_attempt',
                          existing_sub: profile.creem_subscription_id,
                          new_sub: newSubId,
                          message: conflictMsg
                      }
                  });
  
                  // 1. Cancel the NEW subscription immediately
                  try {
                      // Force cancellation
                      await creem.subscriptions.cancel({ 
                          subscriptionId: newSubId, 
                          mode: 'immediate' 
                      });
                      console.log(`[SECURITY] Successfully canceled unauthorized subscription ${newSubId}`);
                      
                      // Update log with cancellation success
                      await supabaseAdmin.from('transaction_logs').insert({
                          action: 'security_cancellation',
                          status: 'success',
                          user_id: userId,
                          details: { subscription_id: newSubId }
                      });
  
                  } catch (err: any) {
                      console.error(`[SECURITY] Failed to cancel unauthorized subscription ${newSubId}:`, err);
                      
                       // Update log with cancellation failure
                      await supabaseAdmin.from('transaction_logs').insert({
                          action: 'security_cancellation',
                          status: 'error',
                          user_id: userId,
                          details: { subscription_id: newSubId, error: err.message }
                      });
                  }
  
                  // 2. Refund (Best Effort - Log for manual intervention if API fails/missing)
                  console.error(`[ACTION REQUIRED] Please manually REFUND order/subscription ${newSubId} for user ${userId}. Reason: Duplicate Subscription Attempt.`);
                  
                  // 3. Stop processing. Do not grant credits. Do not update profile.
                  return;
              }
          }
          // -------------------------------------------------------
  
          const checkoutMetadata: any = { 
              source: 'webhook_fallback' 
          };
          
          if (data.subscription) {
              checkoutMetadata.subscription_id = typeof data.subscription === 'string' ? data.subscription : data.subscription.id;
              checkoutMetadata.is_initial_checkout = true; 
          }
  
          // 2. Prepare Data for RPC
          
          // Calculate Credits & Tier
          let creditsToGrant = 0;
          let tierToGrant = null;
          let bonusCredits = 0; // This is the POTENTIAL bonus
  
          if (priceId) {
               const { data: packageData } = await supabaseAdmin
                       .from('credit_packages')
                       .select('*')
                       .eq('id', priceId)
                       .single();
                   
               if (packageData) {
                   creditsToGrant = packageData.credits;
                   tierToGrant = packageData.tier;
  
                   // Define potential bonus for tiers
                   // RPC will check has_claimed_bonus flags
                   if (tierToGrant) {
                        const bonusMap: Record<string, number> = {
                            'starter': 25,
                            'pro': 120,
                            'enterprise': 700
                        };
                        bonusCredits = bonusMap[tierToGrant] || 0;
                   }
              }
          }
  
          // --- ATOMIC TRANSACTION VIA RPC ---
          console.log(`Processing Order via Atomic RPC for user ${userId}`);
               
          const subId = data.subscription ? (typeof data.subscription === 'string' ? data.subscription : data.subscription.id) : null;
          let periodStart = null;
          let periodEnd = null;
                    let subscriptionData: any = typeof data.subscription === 'object' ? data.subscription : null;

          // If subscription is just an ID (string), fetch the full object to get dates
          if (subId && !subscriptionData) {
              try {
                  console.log(`Fetching full subscription details for ID: ${subId}`);
                                    subscriptionData = await creem.subscriptions.get({ subscriptionId: subId });
              } catch (fetchErr) {
                  console.error(`Failed to fetch subscription ${subId}:`, fetchErr);
                  // Swallow error to allow processing to continue, but dates will be missing
              }
          }
               
                    // Extract dates safely from the subscription object (either from payload or fetched)
          if (subscriptionData) {
                              periodStart = safeISO(subscriptionData.currentPeriodStartDate || (subscriptionData as any).current_period_start_date);
               periodEnd = safeISO(subscriptionData.currentPeriodEndDate || (subscriptionData as any).current_period_end_date);
               console.log(`Extracted Dates - Start: ${periodStart}, End: ${periodEnd}`);
          }
  
          const orderMetadata = {
               ...checkoutMetadata,
               source: 'webhook_checkout'
          };
  
          const { error: rpcError } = await supabaseAdmin.rpc('process_creem_payment', {
               p_user_id: userId,
               p_provider_order_id: data.id,
               p_package_id: priceId,
               p_external_product_id: typeof data.product === 'string' ? data.product : data.product?.id,
               p_amount: data.order?.amount || 0,
               p_currency: data.order?.currency || 'USD',
               p_status: 'paid',
               p_metadata: orderMetadata,
               
               // Subscription Details
               p_subscription_id: subId,
               p_customer_id: data.customer?.id,
               p_tier: tierToGrant, // Will be null for one-time purchases, so tier remains unchanged
               p_period_start: periodStart,
               p_period_end: periodEnd,
               p_cancel_at_period_end: false, // Default for new subs
               
               // Credit Details
               p_credits_to_add: creditsToGrant,
               p_bonus_credits: bonusCredits,
               p_credit_reason: tierToGrant ? 'Subscription Initial' : 'Credit Pack'
          });
  
          if (rpcError) {
               console.error('RPC process_creem_payment failed:', rpcError);
               throw rpcError;
          }
               
          console.log('Order processed successfully via Atomic RPC.');
        },
    
        // Use subscription.paid for renewals and access activation
        onSubscriptionPaid: async (data) => {
            console.log('Subscription Paid:', data.id);
            
            // Note: We removed the time-based idempotency check.
            // subscription.paid is now the SOLE handler for all subscription payments (Initial + Renewal).
            
            const customerId = typeof data.customer === 'string' ? data.customer : data.customer.id;
            
            let { data: profile } = await supabaseAdmin
              .from('profiles')
              .select('id, tier')
              .eq('creem_customer_id', customerId)
              .single();
  
            // --- ROBUST FALLBACK: If profile not found by customerId, try finding by subscription ID from pending orders ---
            if (!profile) {
                console.warn(`Profile not found for customer ${customerId}. Searching pending orders by subscription...`);
                
                const { data: pendingOrder } = await supabaseAdmin
                  .from('orders')
                  .select('user_id')
                  .contains('metadata', { subscription_id: data.id })
                  .maybeSingle(); 
  
                if (pendingOrder) {
                     console.log(`Found user ${pendingOrder.user_id} via pending order metadata.`);
                     const { data: foundProfile } = await supabaseAdmin
                          .from('profiles')
                          .select('id, tier')
                          .eq('id', pendingOrder.user_id)
                          .single();
                     profile = foundProfile;
                     
                     // Update customer ID link for future (will be handled by RPC too, but good to have)
                }
            }
            // --------------------------------------------------------------------------------------------------------------
  
            if (profile) {
                const productId = typeof data.product === 'string' ? data.product : data.product.id;
  
                const { data: packageData } = await supabaseAdmin
                  .from('credit_packages')
                  .select('*')
                  .eq('creem_product_id', productId)
                  .single();
  
                                if (packageData) {
                     // Extract dates with fallback for snake_case
                                          const pStartRaw = data.currentPeriodStartDate || (data as any).current_period_start_date;
                     const pEndRaw = data.currentPeriodEndDate || (data as any).current_period_end_date;
                     const pStart = safeISO(pStartRaw);
                     const pEnd = safeISO(pEndRaw);

                     // Unique key for this renewal order
                     const uniqueOrderKey = `renewal_${data.id}_${pStartRaw}`;
                     
                     const rpcParams = {
                         p_user_id: profile.id,
                         p_provider_order_id: uniqueOrderKey,
                         p_package_id: packageData.id,
                         p_external_product_id: productId,
                         p_amount: packageData.price || 0,
                         p_currency: 'USD',
                         p_status: 'paid',
                         p_metadata: {
                             type: 'subscription_renewal',
                             subscription_id: data.id,
                             period_start: pStart,
                             period_end: pEnd
                         },
                         
                         // Subscription Details
                         p_subscription_id: data.id,
                         p_customer_id: customerId,
                         p_tier: packageData.tier, // Update tier if changed
                         p_period_start: pStart,
                         p_period_end: pEnd,
                         p_cancel_at_period_end: (data as any).cancelAtPeriodEnd || (data as any).cancel_at_period_end || false,
                         
                         // Credit Details
                         p_credits_to_add: packageData.credits,
                         p_bonus_credits: 0, // No bonus on renewal usually
                         p_credit_reason: 'Subscription Renewal'
                     };
  
          const { error: rpcError } = await supabaseAdmin.rpc('process_creem_payment', rpcParams);
  
                     if (rpcError) {
                         console.error('RPC process_creem_payment (renewal) failed:', rpcError);
                         // Don't throw here? Maybe we should to retry.
                         throw rpcError;
                     }
                     console.log(`Processed renewal for user ${profile.id}`);
                }
            }
        },
        
        onSubscriptionCanceled: async (data) => {
             console.log('Subscription Canceled:', data.id);
             const customerId = typeof data.customer === 'string' ? data.customer : data.customer.id;
             
             // Reuse the atomic cancellation function
             // This handles both "Expired" and "Canceled" states identically:
             // downgrading the user to 'free' and clearing subscription flags.
             await supabaseAdmin.rpc('process_creem_cancellation', {
                 p_customer_id: customerId,
                 p_subscription_id: data.id
             });
        },
  
        onSubscriptionExpired: async (data) => {
             console.log('Subscription Expired:', data.id);
             const customerId = typeof data.customer === 'string' ? data.customer : data.customer.id;
             
             await supabaseAdmin.rpc('process_creem_cancellation', {
                 p_customer_id: customerId,
                 p_subscription_id: data.id
             });
        },
        
        onSubscriptionScheduledCancel: async (data) => {
            console.log('Subscription Scheduled Cancel:', data.id);
            const customerId = typeof data.customer === 'string' ? data.customer : data.customer.id;
            
            // Just update the flag
            const { data: profile } = await supabaseAdmin
              .from('profiles')
              .select('id')
              .eq('creem_customer_id', customerId)
              .single();
  
            if (profile) {
                await supabaseAdmin.from('profiles').update({
                    cancel_at_period_end: true
                }).eq('id', profile.id);
            }
        },
  
        onSubscriptionPaused: async (data) => {
            console.log('Subscription Paused:', data.id);
            const customerId = typeof data.customer === 'string' ? data.customer : data.customer.id;
            
            await supabaseAdmin.rpc('process_creem_cancellation', {
                 p_customer_id: customerId,
                 p_subscription_id: data.id
             });
        },
  
        onSubscriptionUnpaid: async (data) => {
            console.log('Subscription Unpaid:', data.id);
            const customerId = typeof data.customer === 'string' ? data.customer : data.customer.id;
            
            await supabaseAdmin.rpc('process_creem_cancellation', {
                 p_customer_id: customerId,
                 p_subscription_id: data.id
             });
        },
        
        onSubscriptionUpdate: async (data) => {
            console.log('Subscription Updated:', data.id);
            const customerId = typeof data.customer === 'string' ? data.customer : data.customer.id;
            
            // --- SECURITY CHECK: Prevent Upgrade/Downgrade ---
            if (data.product) {
                const newProductId = typeof data.product === 'string' ? data.product : data.product.id;
                
                const { data: profile } = await supabaseAdmin
                  .from('profiles')
                  .select('id, tier')
                  .eq('creem_customer_id', customerId)
                  .single();
                
                // Only enforce if user is already on a paid tier
                if (profile && profile.tier && profile.tier !== 'free') {
                    const { data: currentPackage } = await supabaseAdmin
                      .from('credit_packages')
                      .select('creem_product_id')
                      .eq('tier', profile.tier)
                      .single();
                      
                    // If we found the current package, and its product ID doesn't match the new one from webhook
                    if (currentPackage && currentPackage.creem_product_id !== newProductId) {
                         console.warn(`[SECURITY] User ${profile.id} attempted to change plan from ${profile.tier} to product ${newProductId}. NOT ALLOWED.`);
                         
                         // 1. Cancel the subscription immediately
                         try {
                              await creem.subscriptions.cancel({ 
                                  subscriptionId: data.id, 
                                  mode: 'immediate' 
                              });
                              console.log(`[SECURITY] Canceled subscription ${data.id} due to unauthorized plan change.`);
                         } catch (e) {
                             console.error(`[SECURITY] Failed to cancel subscription ${data.id}:`, e);
                         }
                         
                         // 2. Alert for Refund
                         console.error(`[ACTION REQUIRED] Please manually REFUND subscription ${data.id} for user ${profile.id}. Reason: Unauthorized Plan Change.`);
                         
                         // 3. Downgrade user to free immediately
                         await supabaseAdmin.from('profiles').update({ 
                             tier: 'free',
                             creem_subscription_id: null,
                             period_end: new Date().toISOString() // Expire immediately
                         }).eq('id', profile.id);
                         
                         return; // Stop processing update
                    }
                }
            }
            // -------------------------------------------------
  
            const updatePayload: any = {};
  
            if ((data as any).cancelAtPeriodEnd !== undefined || (data as any).cancel_at_period_end !== undefined) {
                updatePayload.cancel_at_period_end = (data as any).cancelAtPeriodEnd ?? (data as any).cancel_at_period_end;
            }
            
            const pEndRaw = data.currentPeriodEndDate || data.current_period_end_date;
            if (pEndRaw) {
                const isoDate = safeISO(pEndRaw);
                if (isoDate) updatePayload.period_end = isoDate;
            }
            
            const pStartRaw = data.currentPeriodStartDate || data.current_period_start_date;
            if (pStartRaw) {
                const isoDate = safeISO(pStartRaw);
                if (isoDate) updatePayload.period_start = isoDate;
            }
  
            // Note: We intentionally REMOVED the logic that auto-updates 'tier' based on product change,
            // because upgrades/downgrades are now strictly forbidden and handled by the Security Check above.
  
            if (Object.keys(updatePayload).length > 0) {
                const { data: profile } = await supabaseAdmin
                  .from('profiles')
                  .select('id')
                  .eq('creem_customer_id', customerId)
                  .single();
  
                if (profile) {
                    await supabaseAdmin.from('profiles').update(updatePayload).eq('id', profile.id);
                }
            }
        }
      });
    } catch (sdkError: any) {
        // Specifically catch SDK internal errors (like network or parsing) separately from handler logic
        console.error('Creem SDK Handler Error:', sdkError);
        throw sdkError; // Re-throw to be caught by outer catch block for logging
    }

    res.status(200).send('Webhook processed');
  } catch (err: any) {
    console.error('Webhook Error:', err);
    
    let errorType = 'system_error';
    const msg = err.message || '';

    // Classify errors
    if (msg.includes('signature') || msg.includes('Signature')) {
        errorType = 'signature_error';
    } else if (msg.includes('JSON') || msg.includes('payload')) {
        errorType = 'payload_error';
    } else if (msg.includes('RPC') || msg.includes('database')) {
        errorType = 'database_error';
    }

    await supabaseAdmin.from('transaction_logs').insert({
        action: 'webhook_failed',
        status: errorType,
        details: { error: msg, stack: err.stack }
    });

    const status = (errorType === 'signature_error' || errorType === 'payload_error') ? 400 : 500;
    res.status(status).send(`Webhook Error: ${msg}`);
  }
}
