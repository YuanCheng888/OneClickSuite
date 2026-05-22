import { useState } from 'react';
import { supabase } from '../supabaseClient';
import type { AppLanguage } from '../types';

interface UseCreemCheckoutProps {
  user?: any;
  profile?: any;
  onLogin?: () => void;
  appLanguage?: AppLanguage;
}

export const useCreemCheckout = ({ user, profile, onLogin, appLanguage = 'English' }: UseCreemCheckoutProps) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (priceId: string) => {
    if (!supabase) {
        console.error('Supabase client not initialized');
        alert('System error: Database connection missing.');
        return;
    }

    // Check for existing active subscription if user is buying a subscription plan
    // Centralized business logic
    const isSubscription = ['price_starter', 'price_pro', 'price_enterprise'].includes(priceId);
    if (isSubscription && profile && profile.tier && profile.tier !== 'free') {
        const msg = appLanguage === 'Chinese' 
            ? '您已拥有有效的订阅。如需更多积分，请使用积分充值。' 
            : 'You already have an active subscription. Please use top-up credits.';
        alert(msg);
        return;
    }

    setLoading(true);

    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
            console.error('Session error:', sessionError);
            if (onLogin) onLogin();
            else alert('Please log in first.');
            return;
        }

        if (!session) {
            if (onLogin) onLogin();
            else alert('Please log in first.');
            return;
        }

        const response = await fetch('/api/creem_checkout', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ priceId }),
        });

        // Check content type before parsing JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
             // Try to read text if possible for error detail
            const text = await response.text().catch(() => '');
            throw new Error(`API Error: ${response.status} ${response.statusText} ${text ? ` - ${text}` : ''}`);
        }

        const { url, error: apiError } = await response.json();
        
        if (!response.ok) {
            if (response.status === 401) {
                console.error('Session expired or invalid token');
                await supabase.auth.signOut();
                if (onLogin) onLogin();
                else alert('Session expired. Please log in again.');
                return;
            }
            throw new Error(apiError || 'Payment initiation failed');
        }
        
        if (!url) {
            throw new Error('No checkout URL returned');
        }

        // Redirect to Creem checkout
        window.location.href = url;

    } catch (error: any) {
        console.error('Checkout exception:', error);
        const errorMsg = error.message || 'Failed to start checkout process.';
        alert(errorMsg);
    } finally {
        setLoading(false);
    }
  };

  return { handleCheckout, loading };
};
