import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Calendar, Hash, Crown, Shield, Key, History, 
  ArrowRight, Loader2, CircleUser, Lock, CreditCard, Sparkles, LogOut,
  ChevronLeft, ChevronRight, AlertCircle, Trash2, X, CheckCircle, AlertTriangle, Rocket, Image
} from 'lucide-react';
import { Logo } from './Logo';
import { CountUp } from './CountUp';
import type { AppLanguage, User as UserType, CreditLog, UserProfile } from '../types';
import { translations } from '../translations';
import { supabase } from '../supabaseClient';

interface MemberCenterProps {
  user: UserType | null;
  profile: UserProfile | null;
  appLanguage: AppLanguage;
  onGoPricing: () => void;
  onSignOut: () => void;
  onShowPayment?: () => void;
}

const getActionLabel = (type: string, lang: AppLanguage) => {
  const isChinese = lang === 'Chinese';
  const labels: Record<string, string> = {
    'analyze': isChinese ? '产品分析' : 'Product Analysis',
    'generate': isChinese ? '图片生成' : 'Image Generation',
    'edit': isChinese ? '图片编辑' : 'Image Editing',
    'Subscription': isChinese ? '订阅会员' : 'Subscription',
    'Subscription Initial': isChinese ? '首次订阅' : 'Subscription Initial',
    'Subscription Renewal': isChinese ? '会员续订' : 'Subscription Renewal',
    'Credit Pack': isChinese ? '积分充值' : 'Credit Pack',
    'Subscription Bonus': isChinese ? '首购奖励' : 'Subscription Bonus',
    'Top-up Credits': isChinese ? '积分充值' : 'Top-up Credits',
    'refund_api_error': isChinese ? '系统退款' : 'System Refund',
    // Fallback for old data
    'new_user_bonus': isChinese ? '订阅奖励' : 'Subscription Bonus',
    'subscription_renewal': isChinese ? '会员续订' : 'Subscription Renewal',
    'creem_purchase': isChinese ? '积分充值' : 'Top-up Credits',
    'stripe_topup': isChinese ? '积分充值' : 'Top-up Credits'
  };
  return labels[type] || type;
};

// Aurora Card Component for High-End Visual Effects
const AuroraCard = ({ children, tier, className = "" }: { children: React.ReactNode, tier: string, className?: string }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [normalizedPosition, setNormalizedPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });

    // Calculate normalized coordinates (-1 to 1) for parallax
    const nx = (x / rect.width) * 2 - 1;
    const ny = (y / rect.height) * 2 - 1;
    setNormalizedPosition({ x: nx, y: ny });
  };

  const getTheme = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'starter':
        return {
          glow: "from-emerald-500/20 to-teal-400/20",
          border: "border-emerald-500/20 group-hover:border-emerald-500/40",
          bg: "bg-gradient-to-b from-white/95 to-white/90 dark:from-slate-900/95 dark:to-slate-900/90",
          spotlight: "rgba(16, 185, 129, 0.1)"
        };
      case 'pro':
        return {
          glow: "from-violet-500/20 via-primary-500/20 to-indigo-500/20",
          border: "border-primary-500/20 group-hover:border-primary-500/40",
          bg: "bg-gradient-to-b from-white/95 to-white/90 dark:from-slate-900/95 dark:to-slate-900/90",
          spotlight: "rgba(99, 102, 241, 0.1)"
        };
      case 'enterprise':
        return {
          glow: "from-amber-500/20 via-orange-500/20 to-red-500/20",
          border: "border-amber-500/20 group-hover:border-amber-500/40",
          bg: "bg-gradient-to-b from-white/95 to-white/90 dark:from-slate-900/95 dark:to-slate-900/90",
          spotlight: "rgba(245, 158, 11, 0.1)"
        };
      default:
        return {
          glow: "from-slate-500/20 to-slate-400/20",
          border: "border-slate-200 dark:border-slate-700",
          bg: "bg-white dark:bg-slate-800",
          spotlight: "rgba(255, 255, 255, 0.05)"
        };
    }
  };

  const theme = getTheme(tier);

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`relative group rounded-[32px] border backdrop-blur-2xl overflow-hidden transition-all duration-300 ${theme.border} ${theme.bg} ${className}`}
    >
      {/* 1. Dynamic Aurora Background - Parallax & Multi-layered */}
      <div className="absolute inset-0 transition-opacity duration-700 opacity-60 group-hover:opacity-100 overflow-hidden">
        {/* Top-Left Blob (Parallax: Negative) */}
        <div 
          className={`absolute -top-[50%] -left-[50%] w-[120%] h-[120%] rounded-full bg-gradient-to-br ${theme.glow} blur-[100px] transition-transform duration-100 ease-out will-change-transform`}
          style={{ 
            transform: `translate3d(${normalizedPosition.x * -25}px, ${normalizedPosition.y * -25}px, 0)` 
          }}
        />
        
        {/* Bottom-Right Blob (Parallax: Positive) */}
        <div 
          className={`absolute -bottom-[50%] -right-[50%] w-[120%] h-[120%] rounded-full bg-gradient-to-tl ${theme.glow} blur-[100px] transition-transform duration-100 ease-out will-change-transform`}
          style={{ 
            transform: `translate3d(${normalizedPosition.x * 25}px, ${normalizedPosition.y * 25}px, 0)` 
          }}
        />

        {/* Center Hover Accent (Scaling) */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-gradient-to-r ${theme.glow} blur-[120px] transition-all duration-700 ease-out`}
          style={{
            opacity: isHovering ? 0.6 : 0,
            transform: `translate(-50%, -50%) scale(${isHovering ? 1.2 : 0.8})`
          }}
        />
      </div>

      {/* 2. Moving Spotlight Effect - Richer & Larger */}
      <div 
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(1000px circle at ${mousePosition.x}px ${mousePosition.y}px, ${theme.spotlight}, transparent 50%)`
        }}
      />

      {/* 3. Border Beam / Glow */}
      <div 
        className={`absolute inset-0 rounded-[32px] transition-colors duration-300 pointer-events-none border border-transparent ${theme.border}`}
      />

      {/* 4. Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
      
      {/* 5. Subtle Grain/Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
    </div>
  );
};

const getPlanStyles = (tier: string) => {
  switch (tier?.toLowerCase()) {
    case 'starter':
      return {
        iconBg: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 backdrop-blur-md",
        title: "text-foreground dark:text-white",
        badge: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-1.5 rounded-full text-xl font-black shadow-lg shadow-emerald-500/20 tracking-wider ring-1 ring-white/20",
      };
    case 'pro':
      return {
        iconBg: "bg-gradient-to-br from-primary-500/10 to-indigo-500/10 text-primary-500 dark:text-primary-400 border border-primary-500/30 backdrop-blur-md",
        title: "text-foreground dark:text-white",
        badge: "bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-5 py-1.5 rounded-full text-xl font-black shadow-lg shadow-primary-500/20 tracking-wider ring-1 ring-white/20",
      };
    case 'enterprise':
      return {
        iconBg: "bg-gradient-to-br from-amber-500/10 to-orange-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/30 backdrop-blur-md",
        title: "text-foreground dark:text-white",
        badge: "bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-1.5 rounded-full text-xl font-black shadow-lg shadow-amber-500/20 tracking-wider ring-1 ring-white/20",
      };
    default:
      return {
        iconBg: "bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700",
        title: "text-foreground dark:text-white",
        badge: "bg-slate-100 dark:bg-slate-800 text-foreground-muted dark:text-gray-400 px-3 py-1 rounded-full text-sm font-bold",
      };
  }
};

const getPlanIcon = (tier: string) => {
  switch (tier?.toLowerCase()) {
    case 'starter':
      return <Rocket size={40} className="text-emerald-500 dark:text-emerald-400" />;
    case 'pro':
      return <Logo size={40} className="text-primary-500 dark:text-primary-400" />;
    case 'enterprise':
      return <Crown size={40} className="text-amber-500 dark:text-amber-400" />;
    default:
      return <Sparkles size={40} className="text-slate-400 dark:text-slate-500" />;
  }
};

const MemberCenter: React.FC<MemberCenterProps> = ({ user, profile, appLanguage, onGoPricing, onSignOut, onShowPayment }) => {
  const t = translations[appLanguage].memberCenter;
  const tn = translations[appLanguage].nav;
  const [creditLogs, setCreditLogs] = useState<CreditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;
  const [hasMore, setHasMore] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const [generatedCount, setGeneratedCount] = useState(0);
  
  // New State for Account Management
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showCancelSubscription, setShowCancelSubscription] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [confirmDelete, setConfirmDelete] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [modalMessage, setModalMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const creditLogsAbortControllerRef = React.useRef<AbortController | null>(null);
  const subscriptionAbortControllerRef = React.useRef<AbortController | null>(null);
  
  const currentTier = profile?.tier || profile?.subscription_tier || 'free';
  const planStyles = getPlanStyles(currentTier);

  const planNames: Record<string, string> = {
    starter: appLanguage === 'Chinese' 
      ? `${(translations.English.pricing.plans.subscription.starter as any).title.toUpperCase()} / ${(translations.Chinese.pricing.plans.subscription.starter as any).title}`
      : (translations.English.pricing.plans.subscription.starter as any).title.toUpperCase(),
    pro: appLanguage === 'Chinese'
      ? `${(translations.English.pricing.plans.subscription.pro as any).title.toUpperCase()} / ${(translations.Chinese.pricing.plans.subscription.pro as any).title}`
      : (translations.English.pricing.plans.subscription.pro as any).title.toUpperCase(),
    enterprise: appLanguage === 'Chinese'
      ? `${(translations.English.pricing.plans.subscription.enterprise as any).title.toUpperCase()} / ${(translations.Chinese.pricing.plans.subscription.enterprise as any).title}`
      : (translations.English.pricing.plans.subscription.enterprise as any).title.toUpperCase(),
    free: appLanguage === 'Chinese' ? 'FREE / 无订阅' : 'FREE'
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChangePassword = async () => {
    if (!user) return;
    setModalMessage(null);
    if (!oldPassword || !newPassword || !confirmNewPassword) {
         setModalMessage({ text: appLanguage === 'Chinese' ? '请填写所有字段' : 'Please fill in all fields', type: 'error' });
         return;
    }

    if (newPassword !== confirmNewPassword) {
        setModalMessage({ text: appLanguage === 'Chinese' ? '两次输入的密码不一致' : 'Passwords do not match', type: 'error' });
        return;
    }

    if (newPassword.length < 6) {
      setModalMessage({ text: appLanguage === 'Chinese' ? '密码长度至少为 6 位' : 'Password must be at least 6 characters', type: 'error' });
      return;
    }

    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasDigit = /\d/.test(newPassword);

    if (!hasLowerCase || !hasUpperCase || !hasDigit) {
        setModalMessage({ 
          text: appLanguage === 'Chinese' 
            ? '密码要求：至少6位，包含大写字母、小写字母和数字' 
            : 'Password requirements: Minimum 6 chars, with uppercase, lowercase & digits', 
          type: 'error' 
        });
        return;
    }

    if (newPassword === oldPassword) {
      setModalMessage({ text: appLanguage === 'Chinese' ? '新密码不能与原密码相同' : 'New password should be different from the old password', type: 'error' });
      return;
    }
    
    setActionLoading(true);
    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      // 1. Verify Old Password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email || '',
        password: oldPassword
      });

      if (signInError) {
        throw new Error(appLanguage === 'Chinese' ? '原密码错误' : 'Incorrect old password');
      }

      // 2. Update Password
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      
      setModalMessage({ text: appLanguage === 'Chinese' ? '密码修改成功' : 'Password updated successfully', type: 'success' });
      
      // Close modal after success with delay
      setTimeout(() => {
          setShowChangePassword(false);
          setNewPassword('');
          setOldPassword('');
          setConfirmNewPassword('');
          setModalMessage(null);
      }, 1500);
    } catch (err: any) {
      setModalMessage({ text: err.message || (appLanguage === 'Chinese' ? '修改失败' : 'Update failed'), type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setModalMessage(null);
    if (confirmDelete !== 'DELETE') return;
    
    setActionLoading(true);
    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch('/api/delete_account', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
          }
      });

      if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed');
      }

      setModalMessage({ text: appLanguage === 'Chinese' ? '账户已删除' : 'Account deleted', type: 'success' });
      // Wait a bit then sign out
      setTimeout(async () => {
         await onSignOut();
      }, 1000);
    } catch (err: any) {
      setModalMessage({ text: err.message || (appLanguage === 'Chinese' ? '删除失败' : 'Delete failed'), type: 'error' });
      setActionLoading(false);
    }
  };

  // 1. Fetch Credit Logs (Only when user or page changes)
  useEffect(() => {
    if (user) {
      fetchCreditLogs();
    }
    
    return () => {
        if (creditLogsAbortControllerRef.current) {
            creditLogsAbortControllerRef.current.abort();
        }
    };
  }, [user?.id, page]);

  // 2. Format Expiration Date (UI only)
  useEffect(() => {
      if (profile?.period_end) {
          const date = new Date(profile.period_end);
          setExpirationDate(date.toLocaleDateString(appLanguage === 'Chinese' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
      }
  }, [profile?.period_end, appLanguage]);

  // 3. Fetch Subscription Status (Network)
  // Only fetch if we don't have the period_end from the profile yet (redundancy check)
  useEffect(() => {
    if (user && !profile?.period_end) {
       fetchSubscriptionStatus();
    }
    
    return () => {
        if (subscriptionAbortControllerRef.current) {
            subscriptionAbortControllerRef.current.abort();
        }
    };
  }, [user?.id, profile?.period_end]);

  // 4. Fetch Generated Count
  useEffect(() => {
    if (user?.id) {
        const controller = new AbortController();
        
        // Debounce the fetch to prevent double-requests in React Strict Mode
        const timer = setTimeout(async () => {
            if (!supabase) return;
            try {
                const { count, error } = await supabase
                    .from('generations')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .eq('type', 'generate')
                    .eq('status', 'completed')
                    .abortSignal(controller.signal);

                if (!error && count !== null) {
                    setGeneratedCount(count);
                }
            } catch (e: any) {
                // Ignore abort errors
                if (e.name !== 'AbortError' && e.code !== 20 && !e.message?.includes('AbortError')) {
                    console.error(e);
                }
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }
  }, [user?.id]);

  const fetchSubscriptionStatus = async () => {
    if (!supabase || !user) return;
    
    if (subscriptionAbortControllerRef.current) {
        subscriptionAbortControllerRef.current.abort();
    }
    const controller = new AbortController();
    subscriptionAbortControllerRef.current = controller;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('metadata, created_at')
        .eq('user_id', user.id)
        .eq('status', 'paid')
        .order('created_at', { ascending: false })
        .limit(5)
        .abortSignal(controller.signal);

      if (error) throw error;

      if (data) {
        const subOrder = data.find((o: any) => o.metadata?.period_end);
        if (subOrder) {
            const end = subOrder.metadata.period_end;
            const date = new Date(typeof end === 'number' ? end * 1000 : end);
            setExpirationDate(date.toLocaleDateString(appLanguage === 'Chinese' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
        }
      }
    } catch (e: any) {
      if (e.name !== 'AbortError' && e.code !== 20 && !e.message?.includes('AbortError')) {
        console.error('Error fetching subscription:', e);
      }
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await onSignOut();
    // Component unmounts after signOut (redirects to landing), so no need to set loading false
  };

  const handleCancelSubscription = () => {
    setModalMessage(null);
    setShowCancelSubscription(true);
  };

  const confirmCancelSubscription = async () => {
    setCanceling(true);
    setModalMessage(null);
    try {
        if (!supabase) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const res = await fetch('/api/cancel_subscription', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed');
        }

        setModalMessage({ text: t.cancelSuccess, type: 'success' });
        setTimeout(() => {
            window.location.reload(); 
        }, 1500);
    } catch (e: any) {
        console.error(e);
        setModalMessage({ text: e.message || t.cancelError, type: 'error' });
    } finally {
        setCanceling(false);
    }
  };

  const fetchCreditLogs = async () => {
    if (!supabase || !user) return;
    
    if (creditLogsAbortControllerRef.current) {
        creditLogsAbortControllerRef.current.abort();
    }
    const controller = new AbortController();
    creditLogsAbortControllerRef.current = controller;

    try {
      setLoadingLogs(true);
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await supabase
        .from('credit_logs')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(from, to)
        .abortSignal(controller.signal);

      if (error) throw error;
      
      setCreditLogs(data || []);
      setHasMore(count ? from + data.length < count : false);
    } catch (error: any) {
      if (error.name !== 'AbortError' && error.code !== 20 && !error.message?.includes('AbortError')) {
          console.error('Error fetching credit logs:', error);
      }
    } finally {
      if (!controller.signal.aborted) {
          setLoadingLogs(false);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in duration-500 relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border animate-in slide-in-from-top-4 duration-300 ${
          toast.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      {/* Modals */}
      {showChangePassword && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm" onClick={() => setShowChangePassword(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowChangePassword(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                <Lock size={20} />
              </div>
              {t.changePass}
            </h3>

            {modalMessage && (
                <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm font-medium animate-in slide-in-from-top-2 ${
                    modalMessage.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' 
                        : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                    {modalMessage.type === 'success' ? <CheckCircle size={18} className="shrink-0 mt-0.5" /> : <AlertTriangle size={18} className="shrink-0 mt-0.5" />}
                    <span>{modalMessage.text}</span>
                </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                  {appLanguage === 'Chinese' ? '原密码' : 'Old Password'}
                </label>
                <input 
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 transition-all placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                  {appLanguage === 'Chinese' ? '新密码' : 'New Password'}
                </label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 transition-all placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                  {appLanguage === 'Chinese' ? '确认新密码' : 'Confirm New Password'}
                </label>
                <input 
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 transition-all placeholder-gray-400"
                />
              </div>

              <button 
                onClick={handleChangePassword}
                disabled={actionLoading}
                className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading && <Loader2 size={16} className="animate-spin" />}
                {appLanguage === 'Chinese' ? '确认修改' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteAccount && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteAccount(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowDeleteAccount(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                <Trash2 size={20} />
              </div>
              {t.deleteAccount}
            </h3>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium leading-relaxed">
              {appLanguage === 'Chinese' 
                ? '此操作不可撤销。您的账户及所有数据将被永久删除。请输入 "DELETE" 确认。' 
                : 'This action cannot be undone. Your account and all data will be permanently deleted. Type "DELETE" to confirm.'}
            </p>

            {modalMessage && (
                <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm font-medium animate-in slide-in-from-top-2 ${
                    modalMessage.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' 
                        : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                    {modalMessage.type === 'success' ? <CheckCircle size={18} className="shrink-0 mt-0.5" /> : <AlertTriangle size={18} className="shrink-0 mt-0.5" />}
                    <span>{modalMessage.text}</span>
                </div>
            )}

            <div className="space-y-4">
              <input 
                type="text"
                value={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.value)}
                placeholder="DELETE"
                className="w-full bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-900 dark:text-red-100 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder-red-300"
              />
              <button 
                onClick={handleDeleteAccount}
                disabled={confirmDelete !== 'DELETE' || actionLoading}
                className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {actionLoading && <Loader2 size={16} className="animate-spin" />}
                {appLanguage === 'Chinese' ? '永久删除账户' : 'Permanently Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelSubscription && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelSubscription(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowCancelSubscription(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <AlertCircle size={20} />
              </div>
              {t.cancelSub}
            </h3>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium leading-relaxed">
              {t.cancelConfirm}
            </p>

            {modalMessage && (
                <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm font-medium animate-in slide-in-from-top-2 ${
                    modalMessage.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' 
                        : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                    {modalMessage.type === 'success' ? <CheckCircle size={18} className="shrink-0 mt-0.5" /> : <AlertTriangle size={18} className="shrink-0 mt-0.5" />}
                    <span>{modalMessage.text}</span>
                </div>
            )}

            <div className="flex items-center gap-3">
              <button 
                onClick={confirmCancelSubscription}
                disabled={canceling}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {canceling && <Loader2 size={16} className="animate-spin" />}
                {appLanguage === 'Chinese' ? '确认取消' : 'Confirm'}
              </button>
              <button 
                onClick={() => setShowCancelSubscription(false)}
                disabled={canceling}
                className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary-500/20"
              >
                {appLanguage === 'Chinese' ? '我再想想' : 'Never Mind'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-foreground dark:text-white tracking-tight mb-2">
            {t.title}
          </h1>
          <p className="text-foreground-muted font-medium">
            {t.subtitle}
          </p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
          <p className="text-2xs font-bold text-foreground-subtle uppercase tracking-widest">
            • {t.since} Feb 2026
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Subscription Card */}
        <AuroraCard tier={currentTier} className="flex flex-col items-center justify-center p-12 text-center shadow-2xl">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center border mb-8 relative z-10 ${planStyles.iconBg}:10 shadow-lg shadow-white/10`}>
              {getPlanIcon(currentTier)}
            </div>
            
            <div className="relative z-10 w-full flex flex-col items-center">
              <h2 className={`flex flex-col items-center justify-center tracking-tight ${planStyles.title}`}>
                  <span className="text-sm font-bold mb-2 opacity-80">{t.currentPlan}</span>
                  <span className={planStyles.badge}>{planNames[currentTier.toLowerCase()] || currentTier.toUpperCase()}</span>
              </h2>
              
              <div className="flex flex-col items-center space-y-4 mb-8 w-full mt-6">
                  <p className="text-foreground-muted font-medium max-w-sm leading-relaxed text-xs">
                      {(t.planDescriptions as any)?.[currentTier.toLowerCase()] || t.planDescriptions?.free}
                  </p>
                  
                  {currentTier !== 'free' && (
                    <div className="w-full flex flex-col gap-3 max-w-md mt-10">
                      {/* Credits Count */}
                      <div className="w-full flex flex-col items-center justify-center p-3 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/20 dark:border-white/5 backdrop-blur-md">
                        <span className="text-2xs font-bold text-foreground-subtle uppercase tracking-widest mb-1">
                          {appLanguage === 'Chinese' ? '剩余积分' : 'Credits'}
                        </span>
                        <div className="flex items-center gap-1.5 text-lg font-black text-gray-900 dark:text-white">
                          <Sparkles size={14} className={currentTier === 'enterprise' ? 'text-amber-500' : currentTier === 'pro' ? 'text-primary-500' : 'text-emerald-500'} />
                          <CountUp value={profile?.credits || 0} />
                        </div>
                      </div>

                      <div className="w-full grid grid-cols-2 gap-3">
                        {/* Generated Count */}
                        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/20 dark:border-white/5 backdrop-blur-md">
                          <span className="text-2xs font-bold text-foreground-subtle uppercase tracking-widest mb-1">
                            {appLanguage === 'Chinese' ? '累计创作' : 'Generated'}
                          </span>
                          <div className="flex items-center gap-1.5 text-lg font-black text-gray-900 dark:text-white">
                            <Image size={14} className={currentTier === 'enterprise' ? 'text-amber-500' : currentTier === 'pro' ? 'text-primary-500' : 'text-emerald-500'} />
                            <CountUp value={generatedCount} />
                          </div>
                        </div>

                        {/* Renewal Date */}
                        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/20 dark:border-white/5 backdrop-blur-md">
                          <span className="text-2xs font-bold text-foreground-subtle uppercase tracking-widest mb-1">
                            {profile?.cancel_at_period_end 
                             ? (t as any).expires 
                             : (t as any).renews
                            }
                          </span>
                          <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-white">
                            {expirationDate || '-'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>

              {currentTier !== 'free' && !profile?.cancel_at_period_end ? (
                  <button 
                      onClick={handleCancelSubscription}
                      disabled={canceling}
                      className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-300 border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                  >
                      {canceling ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />}
                      <span>{t.cancelSub}</span>
                  </button>
              ) : currentTier !== 'free' && profile?.cancel_at_period_end ? (
                  <div className="px-5 py-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10 text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-2 animate-in fade-in zoom-in-95 duration-300">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{(t as any).cancellationScheduled}</span>
                  </div>
              ) : (
                  <button 
                      onClick={onGoPricing}
                      className="w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-xl shadow-primary-500/10 bg-primary-600 text-white hover:bg-primary-700 active:scale-95"
                  >
                      <Sparkles size={20} />
                      <span>{t.upgrade}</span>
                  </button>
              )}
            </div>
        </AuroraCard>

        <div className="flex flex-col gap-8">
          {/* Account Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-[32px] border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm flex flex-col">
            <div className="p-8 flex-1">
              <div className="flex items-start justify-between mb-10">
                <div className="flex items-start gap-6">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400">
                    <User size={16} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.profileTitle}</h2>
                    <p className="text-sm text-foreground-muted font-medium">{t.profileDesc}</p>
                  </div>
                </div>
                <button 
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
                  title={tn.signOut}
                >
                  {isSigningOut ? <Loader2 size={22} className="animate-spin" /> : <LogOut size={22} className="group-hover:rotate-12 transition-transform" />}
                </button>
              </div>

              <div className="space-y-8 pl-2">
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400">
                    <CircleUser size={16} />
                  </div>
                  <span className="text-sm font-medium text-foreground-muted">{t.username}</span>
                </div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{profile?.full_name || user.user_metadata?.full_name || 'User'}</p>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400">
                    <Mail size={16} />
                  </div>
                  <span className="text-sm font-medium text-foreground-muted">{t.email}</span>
                </div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{user.email}</p>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400">
                    <Calendar size={16} />
                  </div>
                  <span className="text-sm font-medium text-foreground-muted">{t.joined}</span>
                </div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">Feb 2, 2026</p>
              </div>
            </div>
            </div>
            
            <div className="bg-gray-50/50 dark:bg-gray-900/50 px-8 py-5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center">
              <p className="text-2xs font-mono font-bold text-foreground-subtle">
                ID: {user.id}
              </p>
            </div>
          </div>

          {/* Password & Security Card */}
          <div className="bg-white dark:bg-gray-800 rounded-[32px] border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400">
                <Lock size={16} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.securityTitle}</h2>
                <p className="text-sm text-foreground-muted font-medium">{t.securityDesc}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div 
                onClick={() => setShowChangePassword(true)}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors">
                    <Key size={16} />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground-muted block group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{(t as any).password}</span>
                    <span className="text-xs text-foreground-subtle tracking-widest mt-0.5 block">••••••••••••</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xs font-medium text-foreground-subtle group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{t.changePass}</span>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                </div>
              </div>

              <div 
                onClick={() => setShowDeleteAccount(true)}
                className="w-full flex items-center justify-between p-2 rounded-xl mt-2 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/40 group-hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </div>
                  <span className="text-sm font-medium text-foreground-muted group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{(t as any).deleteAccount}</span>
                </div>
                <div className="flex items-center gap-3">
                   <ChevronRight size={16} className="text-gray-300 group-hover:text-red-500 transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Usage Card */}
      <div className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400">
            <History size={16} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.usageTitle}</h2>
          </div>
        </div>

        {loadingLogs && creditLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={32} className="text-slate-200 dark:text-slate-700 animate-spin mb-4" />
          </div>
        ) : creditLogs.length > 0 ? (
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    <th className="py-3 pl-2 text-2xs font-bold text-foreground-subtle uppercase tracking-widest">{appLanguage === 'Chinese' ? '变动明细' : 'Activity'}</th>
                    <th className="py-3 text-2xs font-bold text-foreground-subtle uppercase tracking-widest">{appLanguage === 'Chinese' ? '日期' : 'Date'}</th>
                    <th className="py-3 pr-2 text-right text-2xs font-bold text-foreground-subtle uppercase tracking-widest">{appLanguage === 'Chinese' ? '积分变动' : 'Change'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {creditLogs.map((log) => {
                    const isPositive = log.change_amount > 0;
                    return (
                      <tr key={log.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 pl-2">
                          <p className="font-bold text-foreground dark:text-white text-sm">
                            {getActionLabel(log.action_type, appLanguage)}
                          </p>
                          {log.metadata && typeof log.metadata === 'object' && (log.metadata as any).package_name && (
                            <p className="text-2xs text-foreground-muted mt-0.5 capitalize font-medium">
                              {(log.metadata as any).package_name}
                            </p>
                          )}
                        </td>
                        <td className="py-4">
                          <p className="text-foreground-muted text-2xs font-medium">
                            {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>
                        <td className="py-4 pr-2 text-right">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-2xs font-bold gap-1 ${
                            isPositive 
                              ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            <Sparkles size={10} />
                            {isPositive ? '+' : ''}{log.change_amount}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-700">
              <button 
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0 || loadingLogs}
                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-500 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all"
              >
                <ChevronLeft size={16} />
                {appLanguage === 'Chinese' ? '上一页' : 'Previous'}
              </button>
              
              <span className="text-xs font-medium text-slate-400">
                {appLanguage === 'Chinese' ? `第 ${page + 1} 页` : `Page ${page + 1}`}
              </span>

              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={!hasMore || loadingLogs}
                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-500 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all"
              >
                {appLanguage === 'Chinese' ? '下一页' : 'Next'}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
             <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4">
               <History size={20} />
             </div>
             <p className="text-slate-400 dark:text-slate-500 font-medium text-sm">
               {appLanguage === 'Chinese' ? '暂无记录' : 'No history available'}
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberCenter;