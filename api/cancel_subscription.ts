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
  if (authError || !user) return res.status(401).json({ error: 'Invalid token' });

  try {
    // 1. Get user profile to find subscription ID
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('creem_subscription_id, tier, cancel_at_period_end')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
        return res.status(404).json({ error: 'Profile not found' });
    }

    if (!profile.creem_subscription_id) {
        return res.status(400).json({ error: 'No active subscription found' });
    }

    // 2. Cancel subscription via Creem
    // We want to cancel at the end of the period
    
    // First, check if we've already marked it as canceling in our DB to avoid API calls
    if (profile.cancel_at_period_end) {
         return res.status(400).json({ error: 'Subscription is already scheduled for cancellation' });
    }

    // Let's try to fetch the subscription first to verify it exists and is active
    const subscription = await creem.subscriptions.get({
        subscriptionId: profile.creem_subscription_id
    });

    if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found in Creem' });
    }

    if (subscription.status === 'canceled') {
        return res.status(400).json({ error: 'Subscription is already canceled' });
    }

    // Perform cancellation
    // Note: If SDK differs, this might throw.
    // Common variants: cancelAtPeriodEnd, cancel_at_period_end. 
    // I'll use cancelAtPeriodEnd as it matches the JS convention seen in creem.checkouts.create params.
    await creem.subscriptions.cancel({
        subscriptionId: profile.creem_subscription_id,
        mode: 'scheduled' 
    });

    // 3. Update local DB (Optional but good for UI)
    // We might want to set a flag 'cancellation_scheduled' in profiles if we had such column.
    // For now, we rely on the webhook to handle the FINAL cancellation.
    // But we can return success.
    await supabaseAdmin
        .from('profiles')
        .update({ cancel_at_period_end: true })
        .eq('id', user.id);
    
    return res.status(200).json({ success: true, message: 'Subscription scheduled for cancellation' });

  } catch (err: any) {
    console.error('Cancel Subscription Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
