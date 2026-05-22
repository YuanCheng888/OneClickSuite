import { creem } from './_utils/creem.js';
import { supabaseAdmin } from './_utils/supabase.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Auth Check
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  
  if (authError || !user) {
    console.error('Auth verification failed:', authError?.message);
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { priceId } = req.body;

  if (!priceId || typeof priceId !== 'string' || priceId.trim() === '') {
    return res.status(400).json({ error: 'Invalid or missing priceId' });
  }

  // Fetch package details from DB
  const { data: packageData, error: packageError } = await supabaseAdmin
    .from('credit_packages')
    .select('*')
    .eq('id', priceId)
    .single();

  if (packageError || !packageData || !packageData.creem_product_id) {
    console.error('Invalid price ID or missing product mapping:', priceId);
    return res.status(400).json({ error: 'Invalid price ID' });
  }

  // Check for existing active subscription ONLY if user is buying a subscription plan (has tier)
  if (packageData.tier) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('tier')
        .eq('id', user.id)
        .single();

      if (profile && profile.tier && profile.tier !== 'free') {
          return res.status(400).json({ error: 'You already have an active subscription. Please manage or cancel your existing plan first.' });
      }
  }

  const productId = packageData.creem_product_id;

  try {
    const requestId = crypto.randomUUID(); // Ensure uniqueness
    const checkout = await creem.checkouts.create({
      requestId: requestId,
      productId: productId,
      customer: {
        email: user.email,
      },
      successUrl: `${req.headers.origin}/?success=true`,
      cancelUrl: `${req.headers.origin}/?canceled=true`,
      metadata: {
        userId: user.id,
        priceId: priceId, // Store internal package ID
      },
    });

    if (!checkout.checkoutUrl) {
        throw new Error('Failed to generate checkout URL');
    }

    // Create pending order record
    const { error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
            user_id: user.id,
            provider: 'creem',
            provider_order_id: checkout.id, // Store checkout ID as the initial reference
            package_id: priceId,
            external_product_id: productId, // Store the Creem product ID
            status: 'pending',
            metadata: {
                checkout_url: checkout.checkoutUrl
            }
        });

    if (orderError) {
        console.error('Failed to create order record:', orderError);
        // We still return the URL, but logging failed. 
        // In strict mode, we might fail the request, but for better UX, let them pay.
    }

    return res.status(200).json({ url: checkout.checkoutUrl });
  } catch (err: any) {
    console.error('Creem Checkout Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
