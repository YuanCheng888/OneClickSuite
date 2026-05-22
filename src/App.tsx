import React, { useState, useEffect, useCallback, Suspense, useTransition } from 'react';
import { supabase } from './supabaseClient';
import { AppStep } from './types';
import type { AppLanguage } from './types';
import type { ProjectState, GeneratedAsset, UserProfile } from './types';
import { analyzeProductContext, generateMarketingImage } from './services/api';
import { generateId } from './utils';

// Lazy load all main views for code splitting
const Layout = React.lazy(() => import('./components/Layout'));
const UploadView = React.lazy(() => import('./components/UploadView'));
const PlanningView = React.lazy(() => import('./components/PlanningView'));
const ResultsView = React.lazy(() => import('./components/ResultsView'));
const LoginView = React.lazy(() => import('./components/LoginView'));
const LandingPage = React.lazy(() => import('./components/LandingPage'));

import LoadingScreen from './components/LoadingScreen';
import Toast from './components/Toast';
import type { ToastType } from './components/Toast';

// Lazy load components for performance

const ResetPasswordView = React.lazy(() => import('./components/ResetPasswordView'));
const PricingPage = React.lazy(() => import('./components/PricingPage'));
const PaymentModal = React.lazy(() => import('./components/PaymentModal'));
const MemberCenter = React.lazy(() => import('./components/MemberCenter'));
const HistoryView = React.lazy(() => import('./components/HistoryView'));
const LegalPage = React.lazy(() => import('./components/LegalPage'));

// Initialize Supabase Client
// Imported from supabaseClient.ts

const INITIAL_STATE: ProjectState = {
  images: [],
  requirements: '',
  language: 'English',
  dimension: '1:1',
  clarity: '1K',
  batchCount: 1,
  brief: null,
  assets: [],
};

type View = 'landing' | 'studio' | 'login' | 'pricing' | 'memberCenter' | 'history' | 'privacyPolicy' | 'termsOfService' | 'aboutUs' | 'resetPassword';

// Helper to detect if user was likely logged in to skip loading screen
const getInitialView = (): View => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const projectRef = supabaseUrl.split('//')[1]?.split('.')[0];
    if (projectRef) {
      // Check for Supabase auth token in localStorage
      const key = `sb-${projectRef}-auth-token`;
      const token = localStorage.getItem(key);
      if (token) return 'studio';
    }
  } catch (e) {
    // Ignore error, default to landing
  }
  return 'landing';
};

export default function App() {
  // Capture the URL hash immediately on component mount, before any Supabase client
  // or other effects have a chance to clear it. This is critical for detecting
  // the password recovery flow reliably.
  const isRecoveryFlow = React.useRef(
    window.location.hash.includes('type=recovery') || 
    new URLSearchParams(window.location.search).get('flow') === 'reset-password'
  );

  // view state definition moved down to accommodate the wrapper
  // We need to initialize state hooks first, but `setView` depends on `startTransition`.
  // To avoid circular dependency or hoisting issues, let's restructure slightly.
  
  const [view, setViewInternal] = useState<View>(getInitialView);
  const [isPending, startTransition] = useTransition();

  const setView = useCallback((nextView: View | ((prev: View) => View)) => {
    startTransition(() => {
      setViewInternal(nextView);
    });
  }, []);

  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.UPLOAD);
  const [state, setState] = useState<ProjectState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [appLanguage, setAppLanguage] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('appLanguage');
    return (saved === 'English' || saved === 'Chinese') ? saved : 'English';
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(false); // Non-blocking initial load
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleSetLanguage = (lang: AppLanguage) => {
    setAppLanguage(lang);
    localStorage.setItem('appLanguage', lang);
    if (user && supabase) {
      supabase
        .from('profiles')
        .update({ app_language: lang })
        .eq('id', user.id)
        .then(({ error }) => {
          if (error) console.error('Error updating language preference:', error);
        });
    }
  };

  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) {
      const profileData = data as UserProfile;
      setProfile(profileData);
      // Sync language from profile if it exists
      if (profileData.app_language) {
        setAppLanguage(profileData.app_language);
        localStorage.setItem('appLanguage', profileData.app_language);
      }
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;

    // Get session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        
        // Check if we are in a recovery flow
        // Use the ref captured at mount time as the primary source of truth
        const hasRecoveryParam = new URLSearchParams(window.location.search).get('flow') === 'reset-password';
        if (isRecoveryFlow.current || window.location.hash.includes('type=recovery') || hasRecoveryParam) {
           setView('resetPassword');
        } else {
           setView('studio');
        }
      } else {
        // If optimistic auth failed, revert to landing
        setView(prev => (prev === 'studio' || prev === 'memberCenter' || prev === 'history') ? 'landing' : prev);
      }
      setIsAuthChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Prioritize PASSWORD_RECOVERY event
      if (event === 'PASSWORD_RECOVERY') {
        setUser(session?.user ?? null);
        setView('resetPassword');
        return;
      }

      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
        
        if (event === 'SIGNED_IN') {
          // Double check for recovery flow
          // Use the ref captured at mount time as the primary source of truth
          // Sometimes SIGNED_IN fires before PASSWORD_RECOVERY and the hash might be cleared
          const hasRecoveryParam = new URLSearchParams(window.location.search).get('flow') === 'reset-password';
          if (isRecoveryFlow.current || window.location.hash.includes('type=recovery') || hasRecoveryParam) {
             setView('resetPassword');
             return;
          }

          setView(prev => {
            // Avoid redirecting if already on a valid authenticated/public page
            const preserveViews = ['memberCenter', 'history', 'pricing', 'privacyPolicy', 'termsOfService', 'aboutUs', 'studio', 'resetPassword'];
            if (preserveViews.includes(prev)) {
              return prev;
            }
            return 'studio';
          });
        }
      } else {
        setProfile(null);
      }
      setIsAuthChecking(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // Reload profile when entering Member Center to ensure latest subscription status
  useEffect(() => {
    if (view === 'memberCenter' && user) {
      fetchProfile(user.id);
    }
  }, [view, user, fetchProfile]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const canceled = params.get('canceled');

    if (success === 'true') {
      setToast({
        message: appLanguage === 'Chinese' ? '支付成功！积分已到账。' : 'Payment successful! Credits have been added.',
        type: 'success'
      });
      if (user) fetchProfile(user.id);
      window.history.replaceState({}, '', window.location.pathname);
      setView('studio');
    } else if (canceled === 'true') {
      setToast({
        message: appLanguage === 'Chinese' ? '支付已取消。' : 'Payment canceled.',
        type: 'info'
      });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [user, appLanguage, fetchProfile]);

  const handleLogout = async () => {
    if (!supabase || isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      // Check if we have a valid session before trying to sign out
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.warn("Logout notice:", error.message);
        }
      }
    } catch (error: any) {
      // Suppress network errors during logout as we force local cleanup anyway
      // This avoids alarming "ERR_ABORTED" logs if the user navigates away or network is flaky
      console.warn('Logout notice:', error.message || 'Network request interrupted');
      
      // If network fails, ensure local session is destroyed
      await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
    } finally {
      // Clean up local state strictly AFTER sign out attempt
      setUser(null);
      setProfile(null);
      localStorage.clear(); 
      
      // Finally switch view
      setView('landing');
      setIsLoggingOut(false);
    }
  };

  const updateState = (updates: Partial<ProjectState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleGoHome = () => {
    setView('landing');
  };

  const handleAnalysis = async () => {
    if (state.images.length === 0) return;
    setLoading(true);
    setCurrentStep(AppStep.ANALYZING);
    try {
      const imagePaths = state.images.map(img => img.storagePath).filter(Boolean) as string[];
      if (imagePaths.length === 0) {
        throw new Error("No images uploaded or upload failed.");
      }

      const brief = await analyzeProductContext(
        imagePaths, 
        state.requirements, 
        state.language,
        state.batchCount ?? 4, // Default to 4 if undefined
        appLanguage
      );
      
      updateState({ brief });
      setCurrentStep(AppStep.PLANNING);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to analyze images. Please check your configuration.");
      
      // Check if error is related to safety/NSFW
      if (error.message && (
          error.message.includes("safety") || 
          error.message.includes("NSFW") || 
          error.message.includes("safe") ||
          error.message.includes("安全")
      )) {
          // Clear images as they are likely deleted from backend or invalid
          updateState({ images: [] });
      }
      
      setCurrentStep(AppStep.UPLOAD); // Reset to upload on error
    } finally {
      setLoading(false);
    }
  };

  const handleGeneration = async () => {
    if (!state.brief) return;
    
    // Check credits
    if (profile && profile.credits < state.brief.concepts.length) {
        setShowPayment(true);
        return;
    }

    setCurrentStep(AppStep.GENERATION);
    setLoading(true);

    const newAssets: GeneratedAsset[] = state.brief.concepts.map(concept => ({
      id: generateId(),
      conceptId: concept.id,
      imageUrl: '',
      status: 'loading'
    }));

    updateState({ assets: newAssets });

    // In a real implementation, we should deduct credits on the server side 
    // when calling the API. The API should reject if insufficient credits.
    
    const generationPromises = newAssets.map(async (asset) => {
      try {
        const concept = state.brief!.concepts.find(c => c.id === asset.conceptId)!;
        const referenceImagePaths = state.images
           .map(img => img.storagePath)
           .filter((path): path is string => !!path);

        const result = await generateMarketingImage(
           concept,
           state.brief!.specs,
           state.dimension,
           state.clarity,
           1, // Generate 1 image per concept
           referenceImagePaths
        );

        const newImageUrl = result.temporaryImageUrls?.[0] || result.imageUrl;

        setState(prev => ({
          ...prev,
          assets: prev.assets.map(a => a.id === asset.id ? {
            ...a,
            imageUrl: newImageUrl,
            status: 'success',
            // generationId is now returned at the top level
            generationId: result.generationId,
            // The final asset ID is not available immediately, which is OK for optimistic UI
          } : a)
        }));
        
        // Refresh profile to update credits
        if (user) fetchProfile(user.id);

      } catch (error) {
        setState(prev => ({
            ...prev,
            assets: prev.assets.map(a => a.id === asset.id ? { ...a, status: 'error' } : a)
          }));
      }
    });

    await Promise.all(generationPromises);
    setLoading(false);
    setCurrentStep(AppStep.COMPLETE);
  };

  const handleRegenerateSingle = async (conceptId: string) => {
    const existingAssetIndex = state.assets.findIndex(a => a.conceptId === conceptId);
    if (existingAssetIndex === -1 || !state.brief) return;

    if (profile && profile.credits < 1) {
        setShowPayment(true);
        return;
    }

    const updatedAssets = [...state.assets];
    updatedAssets[existingAssetIndex] = { ...updatedAssets[existingAssetIndex], status: 'loading' };
    updateState({ assets: updatedAssets });

    try {
        const concept = state.brief.concepts.find(c => c.id === conceptId)!;
        const referenceImagePaths = state.images
           .map(img => img.storagePath)
           .filter((path): path is string => !!path);
        
        const result = await generateMarketingImage(
          concept,
          state.brief.specs,
          state.dimension,
          state.clarity,
          1,
          referenceImagePaths
        );
        
        const newImageUrl = result.temporaryImageUrls?.[0] || result.imageUrl;

        setState(prev => ({
            ...prev,
            assets: prev.assets.map((a, i) => i === existingAssetIndex ? {
                ...a,
                imageUrl: newImageUrl,
                status: 'success',
                generationId: result.generationId,
            } : a)
        }));
        if (user) fetchProfile(user.id);
    } catch (e) {
         setState(prev => ({
            ...prev,
            assets: prev.assets.map((a, i) => i === existingAssetIndex ? { ...a, status: 'error' } : a)
        }));
    }
  };

  const handleGoPrivacyPolicy = () => setView('privacyPolicy');
  const handleGoTermsOfService = () => setView('termsOfService');
  const handleGoAboutUs = () => setView('aboutUs');

  const getStepIndex = () => {
    switch(currentStep) {
        case AppStep.UPLOAD: return 1;
        case AppStep.ANALYZING: return 2;
        case AppStep.PLANNING: return 3;
        case AppStep.GENERATION: return 4;
        case AppStep.COMPLETE: return 5;
        default: return 1;
    }
  };

  const currentStepIndex = getStepIndex();

  if (isAuthChecking) {
    return <LoadingScreen transparent={false} />;
  }

  // Common wrapper to inject LoadingScreen overlay
  const withLoadingOverlay = (content: React.ReactNode) => (
    <Suspense fallback={<LoadingScreen transparent={false} />}>
      {isPending && <LoadingScreen transparent={true} />}
      {content}
    </Suspense>
  );

  if (view === 'privacyPolicy' || view === 'termsOfService' || view === 'aboutUs') {
    return withLoadingOverlay(
      <Suspense fallback={<LoadingScreen transparent={false} />}>
        <Layout
          activePage={view}
          onShowLogin={() => setView('login')}
          onGoHome={handleGoHome}
          onStart={() => {
              setView('studio');
              setCurrentStep(AppStep.UPLOAD);
          }}
          user={user}
          profile={profile}
          onLogout={handleLogout}
          onShowPayment={() => setShowPayment(true)}
          onGoPricing={() => setView('pricing')}
          onGoMemberCenter={() => setView('memberCenter')}
          onGoHistory={() => setView('history')}
          onGoPrivacyPolicy={handleGoPrivacyPolicy}
          onGoTermsOfService={handleGoTermsOfService}
          onGoAboutUs={handleGoAboutUs}
          appLanguage={appLanguage}
          onSetLanguage={handleSetLanguage}
          showSteps={false}
        >
          <LegalPage type={view} appLanguage={appLanguage} />
        </Layout>
      </Suspense>
    );
  }

  if (view === 'landing') {
    return withLoadingOverlay(
      <LandingPage 
        onStart={() => setView('studio')} 
        onLogin={() => setView('login')} 
        onGoHome={handleGoHome} 
        onGoPricing={() => setView('pricing')} 
        onGoMemberCenter={() => setView('memberCenter')}
        onGoHistory={() => setView('history')}
        onGoPrivacyPolicy={handleGoPrivacyPolicy}
        onGoTermsOfService={handleGoTermsOfService}
        onGoAboutUs={handleGoAboutUs}
        user={user}
        profile={profile}
        onLogout={handleLogout}
        onShowPayment={() => setShowPayment(true)}
        appLanguage={appLanguage}
        onSetLanguage={handleSetLanguage}
      />
    );
  }

  if (view === 'pricing') {
    return withLoadingOverlay(
      <Suspense fallback={<LoadingScreen transparent={false} />}>
        <PricingPage 
          onGoHome={handleGoHome} 
          onStart={() => setView('studio')} 
          onLogin={() => setView('login')}
          onGoPricing={() => {}} // Already on pricing
          onGoMemberCenter={() => setView('memberCenter')}
          onGoHistory={() => setView('history')}
          onGoPrivacyPolicy={handleGoPrivacyPolicy}
          onGoTermsOfService={handleGoTermsOfService}
          onGoAboutUs={handleGoAboutUs}
          user={user}
          profile={profile}
          onLogout={handleLogout}
          onShowPayment={() => setShowPayment(true)}
          appLanguage={appLanguage}
          onSetLanguage={handleSetLanguage}
        />
      </Suspense>
    );
  }

  if (view === 'resetPassword') {
    return withLoadingOverlay(
      <Suspense fallback={<LoadingScreen />}>
        <ResetPasswordView 
          onBack={handleGoHome}
          appLanguage={appLanguage}
          onSuccess={() => setView('studio')}
        />
      </Suspense>
    );
  }

  if (view === 'login') {
    return withLoadingOverlay(
        <LoginView onBack={handleGoHome} appLanguage={appLanguage} onSetLanguage={handleSetLanguage} onSuccess={() => setView('studio')} />
    );
  }

  if (view === 'memberCenter') {
    return withLoadingOverlay(
      <Suspense fallback={<LoadingScreen />}>
        <Layout
          activePage="memberCenter"
          onShowLogin={() => setView('login')}
          onGoHome={handleGoHome}
          onStart={() => setView('studio')}
          user={user}
          profile={profile}
          onLogout={handleLogout}
          onShowPayment={() => setShowPayment(true)}
          onGoPricing={() => setView('pricing')}
          onGoMemberCenter={() => setView('memberCenter')}
          onGoHistory={() => setView('history')}
          onGoPrivacyPolicy={handleGoPrivacyPolicy}
          onGoTermsOfService={handleGoTermsOfService}
          onGoAboutUs={handleGoAboutUs}
          appLanguage={appLanguage}
          onSetLanguage={handleSetLanguage}
          showSteps={false}
        >
          <MemberCenter 
            user={user}
            profile={profile}
            onShowPayment={() => setShowPayment(true)}
            onGoPricing={() => setView('pricing')}
            onSignOut={handleLogout}
            appLanguage={appLanguage}
          />
        </Layout>
      </Suspense>
    );
  }

  if (view === 'history') {
    return withLoadingOverlay(
      <Suspense fallback={<LoadingScreen transparent={false} />}>
        <Layout
          activePage="history"
          onShowLogin={() => setView('login')}
          onGoHome={handleGoHome}
          onStart={() => setView('studio')}
          user={user}
          profile={profile}
          onLogout={handleLogout}
          onShowPayment={() => setShowPayment(true)}
          onGoPricing={() => setView('pricing')}
          onGoMemberCenter={() => setView('memberCenter')}
          onGoHistory={() => setView('history')}
          onGoPrivacyPolicy={handleGoPrivacyPolicy}
          onGoTermsOfService={handleGoTermsOfService}
          onGoAboutUs={handleGoAboutUs}
          appLanguage={appLanguage}
          onSetLanguage={handleSetLanguage}
          showSteps={false}
        >
          <HistoryView appLanguage={appLanguage} />
        </Layout>
      </Suspense>
    );
  }

  return withLoadingOverlay(
    <Layout 
      currentStep={currentStep} 
      currentStepIndex={currentStepIndex}
      onShowLogin={() => setView('login')}
      onGoHome={handleGoHome}
      onStart={() => setView('studio')}
      user={user}
      profile={profile}
      onLogout={handleLogout}
      onShowPayment={() => setShowPayment(true)}
      onGoPricing={() => setView('pricing')}
      onGoMemberCenter={() => setView('memberCenter')}
      onGoHistory={() => setView('history')}
      onGoPrivacyPolicy={handleGoPrivacyPolicy}
      onGoTermsOfService={handleGoTermsOfService}
      onGoAboutUs={handleGoAboutUs}
      activePage="studio"
      appLanguage={appLanguage}
      onSetLanguage={handleSetLanguage}
    >

      {(currentStep === AppStep.UPLOAD || currentStep === AppStep.ANALYZING) && (
        <UploadView 
          state={state} 
          onUpdate={updateState} 
          onUpdateBrief={(brief) => {
             updateState({ brief });
             if (brief) setCurrentStep(AppStep.PLANNING);
          }}
          onNext={handleAnalysis}
          onGoPricing={() => setView('pricing')}
          loading={loading}
          appLanguage={appLanguage}
          user={user}
          profile={profile}
          isAnalyzing={currentStep === AppStep.ANALYZING}
          currentStepIndex={currentStepIndex}
          onLogin={() => setView('login')}
        />
      )}

      {currentStep === AppStep.PLANNING && (
        <PlanningView
          state={state}
          onUpdateBrief={(brief) => updateState({ brief })}
          onUpdateState={updateState}
          onNext={handleGeneration}
          onBack={() => setCurrentStep(AppStep.UPLOAD)}
          loading={loading}
          appLanguage={appLanguage}
          user={user}
          profile={profile}
          onGoPricing={() => setView('pricing')}
          currentStepIndex={currentStepIndex}
          onLogin={() => setView('login')}
        />
      )}

      {(currentStep === AppStep.GENERATION || currentStep === AppStep.COMPLETE) && (
        <ResultsView 
          state={state}
          onRegenerate={handleRegenerateSingle}
          onRestart={() => {
              setCurrentStep(AppStep.UPLOAD);
              setState(INITIAL_STATE);
          }}
          onBack={() => setCurrentStep(AppStep.PLANNING)}
          appLanguage={appLanguage}
          currentStepIndex={currentStepIndex}
        />
      )}

      {showPayment && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/50" />}>
          <PaymentModal 
            onClose={() => setShowPayment(false)} 
            appLanguage={appLanguage} 
            user={user}
            profile={profile}
            onLogin={() => setView('login')}
          />
        </Suspense>
      )}

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </Layout>
  );
}
