import React, { useState, useEffect } from 'react';
import { Check, Zap, Image as ImageIcon, Crown, Box, Globe, Layout as LayoutIcon, Maximize, Cloud, ArrowLeft, Sparkles, Rocket, Shield, Loader2 } from 'lucide-react';
import { Logo } from './Logo';
import Navigation from './Navigation';
import Footer from './Footer';
import type { AppLanguage } from '../types';
import { translations } from '../translations';
import { useCreemCheckout } from '../hooks/useCreemCheckout';

import { supabase } from '../supabaseClient';

interface PricingPageProps {
  onGoHome: () => void;
  onStart: () => void;
  onLogin: () => void;
  onGoPricing: () => void;
  onGoMemberCenter?: () => void;
  onGoHistory?: () => void;
  onGoPrivacyPolicy?: () => void;
  onGoTermsOfService?: () => void;
  onGoAboutUs?: () => void;
  user?: any;
  profile?: any;
  onLogout?: () => void;
  onShowPayment?: () => void;
  appLanguage?: AppLanguage;
  onSetLanguage?: (lang: AppLanguage) => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ 
  onGoHome, 
  onStart, 
  onLogin, 
  onGoPricing,
  onGoMemberCenter,
  onGoHistory,
  onGoPrivacyPolicy,
  onGoTermsOfService,
  onGoAboutUs,
  user, 
  profile, 
  onLogout, 
  onShowPayment,
  appLanguage = 'English',
  onSetLanguage
}) => {
  const [purchasedPlans, setPurchasedPlans] = useState<Set<string>>(new Set());
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const t = translations[appLanguage].pricing;

  const hasTier = profile?.tier && profile.tier !== 'free';
  const pricingMode: 'subscription' | 'points' = hasTier ? 'points' : 'subscription';

  const { handleCheckout } = useCreemCheckout({
    user,
    profile,
    onLogin,
    appLanguage
  });

  const onPlanSelect = async (priceId: string) => {
    if (processingPlan) return;
    setProcessingPlan(priceId);
    try {
      await handleCheckout(priceId);
    } catch (error) {
      // Only reset if there's an error. 
      // If success, we stay in loading state while redirecting to avoid UI flicker.
      setProcessingPlan(null);
    }
  };

  const featuresIcons = [
      <Logo />, <Globe />, <Box />, <Zap />, <LayoutIcon />, <ImageIcon />, <Maximize />, <Cloud />
  ];

  return (
    <div className="bg-slate-50 dark:bg-[#0f111a] text-slate-900 dark:text-white font-sans selection:bg-indigo-500/30 transition-colors duration-500 min-h-screen">
      {/* Grid Background Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-10 dark:opacity-20 transition-opacity"
           style={{ backgroundImage: `linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
      </div>

      {/* Header */}
      <Navigation
        onGoHome={onGoHome}
        onLogin={onLogin}
        onStart={onStart}
        onGoPricing={onGoPricing}
        onGoMemberCenter={onGoMemberCenter}
        onGoHistory={onGoHistory}
        user={user}
        profile={profile}
        onLogout={onLogout}
        onShowPayment={onShowPayment}
        activePage="pricing"
        position="fixed"
        appLanguage={appLanguage}
        onSetLanguage={onSetLanguage}
      />

      {/* Pricing Content */}
      <main className="pt-36 pb-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black mb-6 text-foreground dark:text-white tracking-tight pb-2">{t.title}</h1>
            <p className="text-foreground-muted dark:text-gray-400 text-lg max-w-2xl mx-auto font-medium">
              {t.subtitle}
            </p>
          </div>

          {/* Pricing Mode - 根据用户tier自动设置 */}
          <div className="flex justify-center mb-20 relative z-20">
            <div className="bg-white dark:bg-white/5 p-1.5 rounded-[20px] flex items-center border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div 
                className={`px-10 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${pricingMode === 'subscription' ? 'bg-primary-600 text-white shadow-lg' : 'text-foreground-muted dark:text-gray-400 hover:text-foreground'}`}
              >
                <Crown size={16} />
                {t.subPlans}
              </div>
              <div 
                className={`px-10 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${pricingMode === 'points' ? 'bg-primary-600 text-white shadow-lg' : 'text-foreground-muted dark:text-gray-400 hover:text-foreground'}`}
              >
                <Sparkles size={16} />
                {t.buyCredits}
              </div>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 items-stretch">
            {pricingMode === 'subscription' ? (
              <>
                {/* Entry Plan */}
                <div className={`${(hasTier && profile?.tier === 'starter') ? 'relative bg-white dark:bg-[#1c2230] rounded-[32px] p-8 border-[3px] border-primary-600 dark:border-primary-500 shadow-2xl shadow-primary-500/15 hover:scale-[1.05] transition-all flex flex-col z-10 transform translate-y-[-10px]' : 'bg-white dark:bg-[#1c2230]/50 rounded-[32px] p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/40 dark:shadow-none hover:scale-[1.02] transition-all flex flex-col group'}`}>
                  {hasTier && profile?.tier === 'starter' && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary-600 dark:bg-primary-600 text-white text-3xs font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl border border-white/10">
                      {t.currentPlan}
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-6 pt-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 transition-colors shadow-sm ${(hasTier && profile?.tier === 'starter') ? 'bg-primary-600 dark:bg-primary-600 text-white' : 'bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group-hover:bg-white dark:group-hover:bg-white/10'}`}>
                      <Rocket className={(hasTier && profile?.tier === 'starter') ? 'text-white' : 'text-foreground-subtle'} size={24} />
                    </div>
                    <h3 className="text-xl font-black text-foreground dark:text-white">{(t as any).plans.subscription.starter.title}</h3>
                  </div>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-black text-foreground dark:text-white">{(t as any).plans.subscription.starter.price}</span>
                    <span className="text-foreground-subtle dark:text-gray-500 text-sm font-bold">{(t as any).planDetails?.perMonth || '/mo'}</span>
                  </div>
                  
                  <div className="w-full h-px bg-slate-100 dark:bg-white/5 mb-6"></div>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center gap-3 text-sm font-bold text-foreground dark:text-white">
                      <Sparkles className="text-foreground dark:text-white" size={18} strokeWidth={2.5} />
                      <span>{(t as any).plans.subscription.starter.credits}</span>
                    </li>
                    {!hasTier && (
                      <li className={`p-3 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 text-2xs font-black flex items-center gap-2 italic ${purchasedPlans.has('price_starter') ? 'line-through opacity-50' : ''}`}>
                        <Sparkles size={12} className="animate-pulse" /> {t.bonus} {(t as any).plans.subscription.starter.bonus}
                      </li>
                    )}
                    <li className="flex items-center gap-3 text-sm text-foreground dark:text-white font-medium">
                      <Sparkles className="text-foreground dark:text-white" size={18} />
                      <span>{(t as any).plans.subscription.starter.modelImages}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-foreground dark:text-white font-medium">
                      <Sparkles className="text-foreground dark:text-white" size={18} />
                      <span>{(t as any).plans.subscription.starter.proImages}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-foreground dark:text-white font-medium">
                      <Check className="text-foreground dark:text-white" size={18} />
                      <span>{(t as any).plans.subscription.starter.validity}</span>
                    </li>
                  </ul>

                  {!hasTier && (
                    <button 
                      onClick={() => onPlanSelect('price_starter')}
                      disabled={!!processingPlan}
                      className={`w-full py-5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 font-black text-sm text-foreground dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm ${processingPlan ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {processingPlan === 'price_starter' ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin" size={18} />
                          <span>Processing...</span>
                        </div>
                      ) : t.selectPlan}
                    </button>
                  )}
                </div>

                {/* Pro Plan (Highlighted) */}
                <div className={`${(!hasTier || (hasTier && profile?.tier === 'pro')) ? 'relative bg-white dark:bg-[#1c2230] rounded-[32px] p-8 border-[3px] border-primary-600 dark:border-primary-500 shadow-2xl shadow-primary-500/15 hover:scale-[1.05] transition-all flex flex-col z-10 transform translate-y-[-10px]' : 'bg-white dark:bg-[#1c2230]/50 rounded-[32px] p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/40 dark:shadow-none hover:scale-[1.02] transition-all flex flex-col group'}`}>
                  {!hasTier && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary-600 dark:bg-primary-600 text-white text-3xs font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl border border-white/10">
                      {t.mostPopular}
                    </div>
                  )}
                  {hasTier && profile?.tier === 'pro' && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary-600 dark:bg-primary-600 text-white text-3xs font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl border border-white/10">
                      {t.currentPlan}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 mb-6 pt-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 transition-colors shadow-sm ${(!hasTier || (hasTier && profile?.tier === 'pro')) ? 'bg-primary-600 dark:bg-primary-600 text-white' : 'bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group-hover:bg-white dark:group-hover:bg-white/10'}`}>
                      <Logo className={(!hasTier || (hasTier && profile?.tier === 'pro')) ? 'text-white' : 'text-foreground-subtle'} size={24} />
                    </div>
                    <h3 className="text-xl font-black text-foreground dark:text-white">{(t as any).plans.subscription.pro.title}</h3>
                  </div>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-black text-foreground dark:text-white">{(t as any).plans.subscription.pro.price}</span>
                    <span className="text-foreground-subtle dark:text-gray-500 text-sm font-bold">{(t as any).planDetails?.perMonth || '/mo'}</span>
                  </div>
                  
                  <div className="w-full h-px bg-slate-100 dark:bg-white/5 mb-6"></div>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center gap-3 text-sm font-bold text-foreground dark:text-white">
                      <Sparkles className="text-foreground dark:text-white" size={18} strokeWidth={2.5} />
                      <span>{(t as any).plans.subscription.pro.credits}</span>
                    </li>
                    {!hasTier && (
                      <li className={`p-3 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 text-2xs font-black flex items-center gap-2 italic ${purchasedPlans.has('price_pro') ? 'line-through opacity-50' : ''}`}>
                        <Sparkles size={12} className="animate-pulse" /> {t.bonus} {(t as any).plans.subscription.pro.bonus}
                      </li>
                    )}
                    <li className="flex items-center gap-3 text-sm font-medium text-foreground dark:text-white">
                      <Sparkles className="text-foreground dark:text-white" size={18} strokeWidth={2.5} />
                      <span>{(t as any).plans.subscription.pro.modelImages}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm font-medium text-foreground dark:text-white">
                      <Sparkles className="text-foreground dark:text-white" size={18} strokeWidth={2.5} />
                      <span>{(t as any).plans.subscription.pro.proImages}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm font-medium text-foreground dark:text-white">
                      <Check className="text-foreground dark:text-white" size={18} strokeWidth={2.5} />
                      <span>{(t as any).plans.subscription.pro.validity}</span>
                    </li>
                  </ul>

                  {!hasTier && (
                    <button 
                      onClick={() => onPlanSelect('price_pro')}
                      disabled={!!processingPlan}
                      className={`w-full py-5 rounded-xl bg-primary-600 dark:bg-primary-600 text-white font-black text-sm hover:opacity-90 transition-all shadow-2xl shadow-primary-500/20 active:scale-95 ${processingPlan ? 'opacity-70 cursor-not-allowed active:scale-100' : ''}`}>
                      {processingPlan === 'price_pro' ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin" size={18} />
                          <span>Processing...</span>
                        </div>
                      ) : t.selectPlan}
                    </button>
                  )}
                </div>

                {/* Enterprise Plan */}
                <div className={`${(hasTier && profile?.tier === 'enterprise') ? 'relative bg-white dark:bg-[#1c2230] rounded-[32px] p-8 border-[3px] border-primary-600 dark:border-primary-500 shadow-2xl shadow-primary-500/15 hover:scale-[1.05] transition-all flex flex-col z-10 transform translate-y-[-10px]' : 'bg-white dark:bg-[#1c2230]/50 rounded-[32px] p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/40 dark:shadow-none hover:scale-[1.02] transition-all flex flex-col group'}`}>
                  {hasTier && profile?.tier === 'enterprise' && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary-600 dark:bg-primary-600 text-white text-3xs font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl border border-white/10">
                      {t.currentPlan}
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-6 pt-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 transition-colors shadow-sm ${(hasTier && profile?.tier === 'enterprise') ? 'bg-primary-600 dark:bg-primary-600 text-white' : 'bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group-hover:bg-white dark:group-hover:bg-white/10'}`}>
                      <Crown className={(hasTier && profile?.tier === 'enterprise') ? 'text-white' : 'text-foreground-subtle'} size={24} />
                    </div>
                    <h3 className="text-xl font-black text-foreground dark:text-white">{(t as any).plans.subscription.enterprise.title}</h3>
                  </div>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-black text-foreground dark:text-white">{(t as any).plans.subscription.enterprise.price}</span>
                    <span className="text-foreground-subtle dark:text-gray-500 text-sm font-bold">{(t as any).planDetails?.perMonth || '/mo'}</span>
                  </div>
                  
                  <div className="w-full h-px bg-slate-100 dark:bg-white/5 mb-6"></div>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center gap-3 text-sm font-bold text-foreground dark:text-white">
                      <Sparkles className="text-foreground dark:text-white" size={18} strokeWidth={2.5} />
                      <span>{(t as any).plans.subscription.enterprise.credits}</span>
                    </li>
                    {!hasTier && (
                      <li className={`p-3 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 text-2xs font-black flex items-center gap-2 italic ${purchasedPlans.has('price_enterprise') ? 'line-through opacity-50' : ''}`}>
                        <Sparkles size={12} className="animate-pulse" /> {t.bonus} {(t as any).plans.subscription.enterprise.bonus}
                      </li>
                    )}
                    <li className="flex items-center gap-3 text-sm text-foreground dark:text-white font-medium">
                      <Sparkles className="text-foreground dark:text-white" size={18} />
                      <span>{(t as any).plans.subscription.enterprise.modelImages}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-foreground dark:text-white font-medium">
                      <Sparkles className="text-foreground dark:text-white" size={18} />
                      <span>{(t as any).plans.subscription.enterprise.proImages}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-foreground dark:text-white font-medium">
                      <Check className="text-foreground dark:text-white" size={18} />
                      <span>{(t as any).plans.subscription.enterprise.validity}</span>
                    </li>
                  </ul>

                  {!hasTier && (
                    <button 
                      onClick={() => onPlanSelect('price_enterprise')}
                      disabled={!!processingPlan}
                      className={`w-full py-5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 font-black text-sm text-foreground dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm ${processingPlan ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {processingPlan === 'price_enterprise' ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin" size={18} />
                          <span>Processing...</span>
                        </div>
                      ) : t.selectPlan}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* 250 Credits */}
                <div className="bg-white dark:bg-[#1c2230]/50 rounded-[32px] p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/40 dark:shadow-none hover:scale-[1.02] transition-all flex flex-col group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:bg-white dark:group-hover:bg-white/10 transition-colors shadow-sm">
                      <Sparkles className="text-foreground-subtle" size={24} />
                    </div>
                    <h3 className="text-xl font-black text-foreground dark:text-white">{(t as any).plans.points.small.title}</h3>
                  </div>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-black text-foreground dark:text-white">{(t as any).plans.points.small.price}</span>
                  </div>
                  
                  <div className="w-full h-px bg-slate-100 dark:bg-white/5 mb-6"></div>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center gap-3 text-sm font-bold text-foreground dark:text-white">
                      <Sparkles className="text-foreground dark:text-white" size={18} strokeWidth={2.5} />
                      <span>{(t as any).plans.points.small.credits}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-foreground dark:text-white font-medium">
                      <Sparkles className="text-foreground dark:text-white" size={18} strokeWidth={2.5} />
                      <span>{(t as any).plans.points.small.modelImages}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-foreground dark:text-white font-medium">
                      <Sparkles className="text-foreground dark:text-white" size={18} strokeWidth={2.5} />
                      <span>{(t as any).plans.points.small.proImages}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-foreground dark:text-white font-medium">
                      <Check className="text-foreground dark:text-white" size={18} />
                      <span>{(t as any).plans.points.small.validity}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-foreground dark:text-white font-medium">
                      <Check className="text-foreground dark:text-white" size={18} />
                      <span>{(t as any).plans.points.small.longTerm}</span>
                    </li>
                  </ul>

                  <button 
                    onClick={() => onPlanSelect('price_credits_small')}
                    disabled={!!processingPlan}
                    className={`w-full py-5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 font-black text-sm text-foreground dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm ${processingPlan ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {processingPlan === 'price_credits_small' ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={18} />
                        <span>Processing...</span>
                      </div>
                    ) : t.buyNow}
                  </button>
                </div>

                {/* 1200 Credits (Highlighted) */}
                <div className="relative bg-white dark:bg-[#1c2230] rounded-[32px] p-8 border-[3px] border-primary-600 dark:border-primary-500 shadow-2xl shadow-primary-500/15 hover:scale-[1.05] transition-all flex flex-col z-10 transform translate-y-[-10px]">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary-600 dark:bg-primary-600 text-white text-3xs font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl border border-white/10">
                    {t.mostPopular}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6 pt-2">
                    <div className="w-12 h-12 rounded-xl bg-primary-600 dark:bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                      <Sparkles className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-black text-foreground dark:text-white">{(t as any).plans.points.medium.title}</h3>
                  </div>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-black text-foreground dark:text-white">{(t as any).plans.points.medium.price}</span>
                  </div>
                  
                  <div className="w-full h-px bg-slate-100 dark:bg-white/5 mb-6"></div>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center gap-3 text-sm font-bold text-foreground dark:text-white">
                      <Sparkles className="text-foreground dark:text-white" size={18} strokeWidth={2.5} />
                      <span>{(t as any).plans.points.medium.credits}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-foreground dark:text-white font-medium">
                      <Sparkles className="text-foreground dark:text-white" size={18} strokeWidth={2.5} />
                      <span>{(t as any).plans.points.medium.modelImages}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-foreground dark:text-white font-medium">
                      <Sparkles className="text-foreground dark:text-white" size={18} strokeWidth={2.5} />
                      <span>{(t as any).plans.points.medium.proImages}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-foreground dark:text-white font-medium">
                      <Check className="text-foreground dark:text-white" size={18} />
                      <span>{(t as any).plans.points.medium.validity}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-foreground dark:text-white font-medium">
                      <Check className="text-foreground dark:text-white" size={18} />
                      <span>{(t as any).plans.points.medium.longTerm}</span>
                    </li>
                  </ul>

                  <button 
                    onClick={() => onPlanSelect('price_credits_medium')}
                    disabled={!!processingPlan}
                    className={`w-full py-5 rounded-xl bg-primary-600 dark:bg-primary-600 text-white font-black text-sm hover:opacity-90 transition-all shadow-2xl shadow-primary-500/20 active:scale-95 ${processingPlan ? 'opacity-70 cursor-not-allowed active:scale-100' : ''}`}>
                    {processingPlan === 'price_credits_medium' ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={18} />
                        <span>Processing...</span>
                      </div>
                    ) : t.buyNow}
                  </button>
                </div>

                {/* 7000 Credits */}
                <div className="bg-white dark:bg-[#1c2230]/50 rounded-[32px] p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/40 dark:shadow-none hover:scale-[1.02] transition-all flex flex-col group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:bg-white dark:group-hover:bg-white/10 transition-colors shadow-sm">
                      <Sparkles className="text-foreground-subtle" size={24} />
                    </div>
                    <h3 className="text-xl font-black text-foreground dark:text-white">{(t as any).plans.points.large.title}</h3>
                  </div>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-black text-foreground dark:text-white">{(t as any).plans.points.large.price}</span>
                  </div>
                  
                  <div className="w-full h-px bg-slate-100 dark:bg-white/5 mb-6"></div>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center gap-3 text-sm font-bold text-foreground dark:text-white">
                      <Sparkles className="text-foreground dark:text-white" size={18} strokeWidth={2.5} />
                      <span>{(t as any).plans.points.large.credits}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-foreground dark:text-white font-medium">
                      <Sparkles className="text-foreground dark:text-white" size={18} strokeWidth={2.5} />
                      <span>{(t as any).plans.points.large.modelImages}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-foreground dark:text-white font-medium">
                      <Sparkles className="text-foreground dark:text-white" size={18} strokeWidth={2.5} />
                      <span>{(t as any).plans.points.large.proImages}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-foreground dark:text-white font-medium">
                      <Check className="text-foreground dark:text-white" size={18} />
                      <span>{(t as any).plans.points.large.validity}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-foreground dark:text-white font-medium">
                      <Check className="text-foreground dark:text-white" size={18} />
                      <span>{(t as any).plans.points.large.longTerm}</span>
                    </li>
                  </ul>

                  <button 
                    onClick={() => onPlanSelect('price_credits_large')}
                    disabled={!!processingPlan}
                    className={`w-full py-5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 font-black text-sm text-foreground dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm ${processingPlan ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {processingPlan === 'price_credits_large' ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={18} />
                        <span>Processing...</span>
                      </div>
                    ) : t.buyNow}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Feature Grid Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">{t.includeTitle}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {((t as any).featuresList || []).map((feature: any, i: number) => (
              <div key={i} className="flex items-start gap-5 p-6 rounded-[24px] bg-white/50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 group hover:bg-white dark:hover:bg-white/5 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-none transition-all duration-300">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors border border-slate-100 dark:border-white/10 shadow-sm">
                  {React.cloneElement(featuresIcons[i] as React.ReactElement<any>, { size: 22 })}
                </div>
                <div className="flex-1 pt-0.5">
                  <h4 className="text-sm font-black mb-2 text-foreground dark:text-white uppercase tracking-wider group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{feature.title}</h4>
                  <p className="text-xs text-foreground-muted dark:text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={onGoHome}
            className="mt-24 mx-auto flex items-center space-x-2 text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white transition-all font-bold text-sm uppercase tracking-widest"
          >
            <ArrowLeft size={18} />
            <span>{t.back}</span>
          </button>
        </div>
      </main>

      <Footer 
        onGoGenerator={onStart}
        onGoPricing={onGoPricing}
        onGoPrivacyPolicy={onGoPrivacyPolicy}
        onGoTermsOfService={onGoTermsOfService}
        onGoAboutUs={onGoAboutUs}
        appLanguage={appLanguage}
        activePage="pricing"
      />
    </div>
  );
};

export default PricingPage;
