import React, { useEffect, useRef } from 'react';
import { Sparkles, Loader2, ArrowLeft, ArrowUp, WandSparkles } from 'lucide-react';
import type { ProjectState, DesignBrief, AppLanguage, User } from '../types';
import { translations } from '../translations';
import { supabase } from '../supabaseClient';
import AnalyzingOverlay from './AnalyzingOverlay';
import ProjectInputPanel from './ProjectInputPanel';
import StepIndicator from './StepIndicator';

interface UploadViewProps {
  state: ProjectState;
  onUpdate: (updates: Partial<ProjectState>) => void;
  onUpdateBrief: (brief: DesignBrief | null) => void;
  onNext: () => void;
  onGoPricing: () => void;
  loading: boolean;
  appLanguage: AppLanguage;
  user: User | null;
  profile: any;
  isAnalyzing: boolean;
  currentStepIndex: number;
  onLogin?: () => void;
}

const UploadView: React.FC<UploadViewProps> = ({ 
  state, 
  onUpdate, 
  onUpdateBrief, 
  onNext, 
  onGoPricing, 
  loading, 
  appLanguage,
  user,
  profile,
  isAnalyzing,
  currentStepIndex,
  onLogin
}) => {
  const t = translations[appLanguage].studio;
  const stepIndicatorRef = useRef<HTMLDivElement>(null);
  const [analyzeCost, setAnalyzeCost] = React.useState<number | null>(null);

  useEffect(() => {
    const fetchAnalyzeCost = async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('credit_rules')
        .select('cost')
        .eq('action_type', 'analyze')
        .single();
      
      if (data && !error) {
        setAnalyzeCost(data.cost);
      }
    };

    fetchAnalyzeCost();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Custom non-linear smooth scroll function
  const scrollToElement = (element: HTMLElement, duration = 700) => {
    const elementRect = element.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    const targetPosition = absoluteElementTop - 100; //(window.innerHeight / 2) + (elementRect.height / 2);
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function: easeInOutCubic
      // t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      const ease = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  useEffect(() => {
    if (isAnalyzing && stepIndicatorRef.current) {
       // Add a small delay to ensure layout is stable
       setTimeout(() => {
          if (stepIndicatorRef.current) {
            scrollToElement(stepIndicatorRef.current);
          }
       }, 100);
    }
  }, [isAnalyzing]);

  const isValid = state.images.length > 0 && state.requirements.trim().length > 0;

  const requiredCredits = state.brief ? (state.batchCount * state.brief.concepts.length) : 0;
  const currentCredits = profile?.credits || 0;
  const isInsufficient = user && currentCredits < requiredCredits; 
  const canGenerate = Math.floor(currentCredits / 1); 

  const handleAnalyze = () => {
    onNext();
  };

  const renderActionButtons = () => (
    <>
      {isInsufficient ? (
        <>
          <button
            onClick={onGoPricing}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-xl shadow-orange-500/20 bg-gradient-to-r from-amber-500 via-orange-600 to-red-500 text-white hover:scale-[1.02] active:scale-95"
          >
            <Sparkles size={20} className="text-white" />
            <span>{t.btnBuyCredits}</span>
          </button>
          <p className="text-center text-[11px] text-red-500 font-medium px-4 mt-2">
            {t.insufficientCredits(requiredCredits, currentCredits, canGenerate)}
          </p>
        </>
      ) : (
        <button
          onClick={handleAnalyze}
          disabled={!isValid || loading}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-xl ${
            isValid && !loading 
              ? 'bg-gradient-to-r from-violet-600 via-primary-500 to-indigo-500 text-white hover:scale-[1.02] active:scale-95 shadow-primary-500/20' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loading && <Loader2 size={24} className="animate-spin" />}
          <span>{t.btnAnalyze}</span>
          {analyzeCost !== null && !loading && (
            <span className="text-sm opacity-80 font-normal ml-1 flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-lg">
              - {analyzeCost} <Sparkles size={14} />
            </span>
          )}
        </button>
      )}


    </>
  );

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      
      <div className="text-center mb-24 mt-20">
        
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
          {t.heroTitle}
        </h1>
        
        <p className="max-w-3xl mx-auto text-gray-500 dark:text-gray-400 text-lg md:text-xl leading-relaxed mb-20">
          {t.heroSubtitle}
        </p>

        <div ref={stepIndicatorRef} className="scroll-mt-32">
          <StepIndicator currentStepIndex={currentStepIndex} appLanguage={appLanguage} />
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-6 transition-all duration-500 ease-in-out ${isAnalyzing ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
        
        <div className="flex flex-col gap-6">
          <ProjectInputPanel
            state={state}
            onUpdate={onUpdate}
            user={user}
            appLanguage={appLanguage}
            profile={profile}
            onGoPricing={onGoPricing}
            loading={loading}
            actionButton={renderActionButtons()}
            readOnly={loading || isAnalyzing}
            onLogin={onLogin}
          />
        </div>

        <div className={`flex flex-col gap-6 h-full ${isAnalyzing ? 'lg:col-span-2' : ''}`}>
          {isAnalyzing ? (
             <AnalyzingOverlay appLanguage={appLanguage} />
          ) : (
            <div className="h-full min-h-[500px] bg-gradient-to-b from-white/95 to-white/90 dark:from-slate-900/95 dark:to-slate-900/90 backdrop-blur-xl rounded-[32px] border border-white/40 dark:border-white/10 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden group transition-all shadow-xl shadow-indigo-500/5">
               {/* Background Pattern */}
               <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
                    style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)` , backgroundSize: '24px 24px' }}>
               </div>
               
               {/* Aurora Glow */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary-500/20 transition-colors duration-700"></div>

               <div className="relative z-10 flex flex-col items-center max-w-sm">
                 <div className="w-24 h-24 bg-gradient-to-br from-white to-white/50 dark:from-white/10 dark:to-white/5 rounded-[24px] flex items-center justify-center mb-8 shadow-2xl shadow-primary-500/10 border border-white/40 dark:border-white/10 ring-1 ring-white/50 dark:ring-white/5 group-hover:scale-110 transition-transform duration-500 backdrop-blur-md">
                    <WandSparkles size={40} className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 transition-colors duration-500 group-hover:animate-wand-wave drop-shadow-sm" strokeWidth={1.5} />
                 </div>
                 
                 <h2 className="text-xl font-bold text-foreground-muted dark:text-gray-400 mb-2 tracking-tight">
                   {appLanguage === 'Chinese' ? '等待数据输入' : 'Awaiting Data'}
                 </h2>
                 
                 <p className="text-foreground-subtle dark:text-gray-500 text-sm leading-relaxed mb-10 max-w-xs mx-auto">
                   {appLanguage === 'Chinese' ? '上传产品图并指定需求以初始化创意推理引擎' : 'Upload images and specify your requirements to initialize the creative reasoning engine.'}
                 </p>

                 <div className="flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-300 bg-white/50 dark:bg-primary-900/30 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full animate-pulse shadow-lg shadow-primary-500/5">
                    <ArrowLeft className="hidden lg:block" size={14} />
                    <ArrowUp className="lg:hidden" size={14} />
                    <span>{appLanguage === 'Chinese' ? '请先在左侧完善信息' : 'Complete setup to proceed'}</span>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadView;
