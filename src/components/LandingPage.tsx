
import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, ArrowRight, Sun, Moon, ChevronDown, ChevronUp, Zap, Scan } from 'lucide-react';
import { Logo } from './Logo';
import Navigation from './Navigation';
import Footer from './Footer';
import type { AppLanguage } from '../types';
import { translations } from '../translations';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
  onGoHome: () => void;
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

const LandingPage: React.FC<LandingPageProps> = ({ 
  onStart, 
  onLogin, 
  onGoHome, 
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
  const t = translations[appLanguage].landing;
  const tn = translations[appLanguage].nav;
  const tFaq = (translations[appLanguage] as any).faq;
  const tCta = (translations[appLanguage] as any).cta;
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [ctaMousePos, setCtaMousePos] = useState({ x: 0, y: 0 });

  const handleCtaMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCtaMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        position="fixed"
        appLanguage={appLanguage}
        onSetLanguage={onSetLanguage}
      />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Logo size={14} className="text-primary-600 dark:text-primary-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">{t.heroBadge}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 text-slate-900 dark:text-white">
            {appLanguage === 'English' ? (
                <>Revolutionize Your <br /> <span className="text-primary-600 dark:text-primary-500 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-600">E-commerce</span> Imagery</>
            ) : (
                t.heroTitle
            )}
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            {t.heroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <button onClick={onStart} className="w-full sm:w-auto px-10 py-4 bg-primary-600 hover:bg-primary-500 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 group transition-all shadow-2xl shadow-primary-500/30 active:scale-[0.98] text-white">
              <span>{t.btnStart}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            {/* <button className="w-full sm:w-auto px-10 py-4 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 transition-all text-slate-900 dark:text-white">
              <Play size={20} fill="currentColor" />
              <span>{t.btnDemo}</span>
            </button> */}
          </div>
        </div>

        {/* Hero Image Container */}
        <div className="max-w-6xl mx-auto mt-24 relative px-6 animate-in fade-in zoom-in-95 duration-1000 delay-500">
          <div className="relative aspect-[16/9] rounded-[40px] overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-[#161b26]">
            <div 
              className="w-full h-full bg-cover bg-center bg-fixed dark:opacity-80 transition-all duration-700"
              style={{ backgroundImage: 'url("/images/screenshots/screenshot-landing.png")' }}
              role="img"
              aria-label="High-end sneaker studio render"
            />
            <div className="absolute bottom-10 left-10 p-6 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10 flex items-center gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <Scan size={24} className="text-primary-600 dark:text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{(t as any).floatingCardTitle}</h4>
                <p className="text-[10px] text-slate-500 dark:text-gray-400">{(t as any).floatingCardDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Efficiency Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight text-slate-900 dark:text-white">
              {t.efficiencyTitle}
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-lg mb-12 leading-relaxed">
              {t.efficiencySubtitle}
            </p>
            
            <div className="space-y-6">
              <div className="p-8 rounded-[32px] bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/5 flex gap-6 group hover:bg-white/80 dark:hover:bg-white/[0.08] transition-all shadow-sm backdrop-blur-2xl hover:shadow-xl hover:-translate-y-1 duration-300">
                <div className="w-16 h-16 shrink-0 rounded-full bg-primary-500/10 dark:bg-primary-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-primary-500/10 dark:border-primary-500/20">
                  <Zap size={24} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{t.feature1Title}</h4>
                  <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">{t.feature1Desc}</p>
                </div>
              </div>
              <div className="p-8 rounded-[32px] bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/5 flex gap-6 group hover:bg-white/80 dark:hover:bg-white/[0.08] transition-all shadow-sm backdrop-blur-2xl hover:shadow-xl hover:-translate-y-1 duration-300">
                <div className="w-16 h-16 shrink-0 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-emerald-500/10 dark:border-emerald-500/20">
                  <CheckCircle2 size={24} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{t.feature2Title}</h4>
                  <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">{t.feature2Desc}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 dark:bg-[#161b26]/80 backdrop-blur-3xl p-12 rounded-[48px] border border-white/40 dark:border-white/5 relative overflow-hidden group shadow-2xl hover:shadow-primary-500/10 transition-all duration-500">

            
            <div className="grid grid-cols-2 gap-4 mb-12 relative z-0">
              <div className="aspect-square bg-slate-100 dark:bg-primary-900/20 rounded-3xl border border-white/60 dark:border-primary-500/10 overflow-hidden shadow-inner transform group-hover:scale-[1.02] transition-transform duration-500 delay-75">
                <img src="/images/generated-1.png" className="w-full h-full object-cover" alt="AI Generated Variation 1" />
              </div>
              <div className="aspect-square bg-slate-100 dark:bg-primary-900/20 rounded-3xl border border-white/60 dark:border-primary-500/10 overflow-hidden shadow-inner transform group-hover:scale-[1.02] transition-transform duration-500 delay-100">
                <img src="/images/generated-2.png" className="w-full h-full object-cover" alt="AI Generated Variation 2" />
              </div>
              <div className="aspect-square bg-slate-100 dark:bg-primary-900/20 rounded-3xl border border-white/60 dark:border-primary-500/10 overflow-hidden shadow-inner transform group-hover:scale-[1.02] transition-transform duration-500 delay-150">
                <img src="/images/generated-3.png" className="w-full h-full object-cover" alt="AI Generated Variation 3" />
              </div>
              <div className="aspect-square bg-slate-100 dark:bg-primary-900/20 rounded-3xl border border-white/60 dark:border-primary-500/10 overflow-hidden shadow-inner transform group-hover:scale-[1.02] transition-transform duration-500 delay-200">
                <img src="/images/generated-4.png" className="w-full h-full object-cover" alt="AI Generated Variation 4" />
              </div>
              
              {/* Decorative gradient blob behind images */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[40px] blur-3xl -z-10"></div>
            </div>

            <div className="text-center relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-gray-500 mb-3">{t.benchmark}</p>
              <h3 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 mb-3 drop-shadow-sm">60.2 Seconds</h3>
              <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">{t.timeToGen}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-[#0f111a]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">{tFaq?.title}</h2>
              <p className="text-slate-500 dark:text-gray-400">{tFaq?.subtitle}</p>
          </div>

          <div className="space-y-4">
              {(tFaq?.questions || []).map((item: any, i: number) => (
                <div key={i} className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:shadow-md">
                  <button 
                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                    className="w-full px-8 py-6 flex items-center justify-between gap-4 text-left"
                  >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors duration-300 ${
                            openFaqIndex === i 
                            ? 'bg-primary-600 text-white' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                        }`}>
                            Q
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.q}</h3>
                      </div>
                      {openFaqIndex === i ? (
                        <ChevronUp className="text-slate-400 dark:text-slate-300 shrink-0" size={20} />
                      ) : (
                        <ChevronDown className="text-slate-400 dark:text-slate-300 shrink-0" size={20} />
                      )}
                  </button>
                  <div 
                    className={`px-8 transition-all duration-300 ease-in-out overflow-hidden ${openFaqIndex === i ? 'max-h-96 opacity-100 pb-8' : 'max-h-0 opacity-0'}`}
                  >
                      <div className="pl-12 text-slate-500 dark:text-slate-300 leading-relaxed text-sm">
                        {item.a}
                      </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div 
            className="relative rounded-[48px] overflow-hidden bg-slate-900 dark:bg-indigo-950 text-white p-12 md:p-24 text-center shadow-2xl group cursor-default isolate"
            onMouseMove={handleCtaMouseMove}
          >
            <style>{`
              @keyframes morph-blob {
                0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: rotate(0deg); }
                50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; transform: rotate(180deg); }
                100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: rotate(360deg); }
              }
            `}</style>

            {/* Interactive Mouse Gradient */}
            <div 
              className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                left: ctaMousePos.x,
                top: ctaMousePos.y,
                width: '400px',
                height: '400px',
                transform: 'translate(-50%, -50%)',
                mixBlendMode: 'screen'
              }}
            >
               {/* Core Light */}
               <div 
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-[80px] opacity-40"
                  style={{
                    animation: 'morph-blob 10s infinite linear'
                  }}
               />
               {/* Secondary Light (Reverse rotation for randomness) */}
               <div 
                  className="absolute inset-0 bg-gradient-to-tr from-blue-400 via-cyan-400 to-teal-400 blur-[60px] opacity-30"
                  style={{
                    animation: 'morph-blob 8s infinite linear reverse',
                    transformOrigin: '40% 60%'
                  }}
               />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                  {appLanguage === 'English' ? (
                    <>Ready to elevate your <br /> E-commerce visuals?</>
                  ) : (
                    tCta?.title
                  )}
                </h2>
                <p className="text-lg md:text-xl text-slate-300 dark:text-indigo-100 mb-10 font-medium">
                  {tCta?.subtitle}
                </p>
                <button 
                  onClick={onStart}
                  className="px-10 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:scale-105 transition-all shadow-xl flex items-center gap-2 mx-auto relative z-20"
                >
                  <span>{tCta?.button}</span>
                  <ArrowRight size={18} />
                </button>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer 
        onGoGenerator={onStart}
        onGoPricing={onGoPricing}
        onGoPrivacyPolicy={onGoPrivacyPolicy}
        onGoTermsOfService={onGoTermsOfService}
        onGoAboutUs={onGoAboutUs}
        appLanguage={appLanguage}
        activePage="landing"
      />
    </div>
  );
};

export default LandingPage;
