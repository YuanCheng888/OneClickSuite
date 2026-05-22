import { supabaseAdmin } from '../_utils/supabase.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const { error } = await supabaseAdmin.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      }
    });

    if (error) throw error;

    return res.status(200).json({ message: 'Verification code sent' });
  } catch (error: any) {
    console.error('Send Code Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send code' });
  }
}
