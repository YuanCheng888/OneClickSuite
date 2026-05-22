import { supabaseAdmin } from '../_utils/supabase.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return res.status(200).json({ 
        session: data.session,
        user: data.user
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    return res.status(401).json({ error: error.message || 'Login failed' });
  }
}
