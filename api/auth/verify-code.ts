import { supabaseAdmin } from '../_utils/supabase.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, code, password } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code are required' });
  }

  try {
    // 1. Verify OTP
    // Try 'email' (Magic Link) first, then 'signup' (Confirmation) as fallback
    let verifyResult = await supabaseAdmin.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });

    if (verifyResult.error) {
      // Fallback: Try verifying as 'signup' (Confirmation Link Code)
      // This handles cases where Supabase triggers a Signup Confirmation email
      const signupResult = await supabaseAdmin.auth.verifyOtp({
        email,
        token: code,
        type: 'signup',
      });

      if (!signupResult.error) {
        verifyResult = signupResult;
      } else {
        // Throw the original error if both fail, or the signup error
        throw verifyResult.error;
      }
    }

    const { data, error: verifyError } = verifyResult;

    if (verifyError) throw verifyError;
    if (!data.session || !data.user) {
        throw new Error('Verification successful but no session returned');
    }

    // 2. Update Password (if provided - Signup Flow)
    if (password) {
        // Note: updateUser requires the user to be logged in or using service_role
        // Since we are using supabaseAdmin (service_role), we can update any user by ID
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            data.user.id,
            { 
                password: password,
                email_confirm: true 
            }
        );
        
        if (updateError) throw updateError;

        // CRITICAL: Changing the password might invalidate the previous session (token revocation).
        // We must re-authenticate to get a fresh, valid session.
        const { data: loginData, error: loginError } = await supabaseAdmin.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError) throw loginError;
        
        return res.status(200).json({ 
            session: loginData.session,
            user: loginData.user 
        });
    }

    // Return the session so the client can log in
    return res.status(200).json({ 
        session: data.session,
        user: data.user 
    });

  } catch (error: any) {
    console.error('Verify Code Error:', error);
    return res.status(400).json({ error: error.message || 'Verification failed' });
  }
}
