
import React, { useEffect, useState } from 'react';
import { Camera, Layers, Image as ImageIcon, Sun, Moon, LogIn, Sparkles } from 'lucide-react';
import { AppStep } from '../types';
import type { AppLanguage } from '../types';
import Navigation from './Navigation';
import Footer from './Footer';
import { translations } from '../translations';

interface LayoutProps {
  currentStep?: AppStep;
  currentStepIndex?: number;
  onShowLogin: () => void;
  onGoHome: () => void;
  onStart?: () => void;
  children: React.ReactNode;
  user?: any;
  profile?: any;
  onLogout?: () => void;
  onShowPayment?: () => void;
  onGoPricing?: () => void;
  onGoMemberCenter?: () => void;
  onGoHistory?: () => void;
  onGoPrivacyPolicy?: () => void;
  onGoTermsOfService?: () => void;
  onGoAboutUs?: () => void;
  showSteps?: boolean;
  activePage?: 'studio' | 'showcase' | 'pricing' | 'memberCenter' | 'history' | 'privacyPolicy' | 'termsOfService' | 'aboutUs';
  appLanguage?: AppLanguage;
  onSetLanguage?: (lang: AppLanguage) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  currentStep, 
  currentStepIndex = 1,
  onShowLogin, 
  onGoHome, 
  onStart,
  children, 
  user, 
  profile, 
  onLogout, 
  onShowPayment, 
  onGoPricing, 
  onGoMemberCenter,
  onGoHistory,
  onGoPrivacyPolicy,
  onGoTermsOfService,
  onGoAboutUs,
  showSteps = true,
  activePage = 'studio',
  appLanguage = 'English',
  onSetLanguage
}) => {
  const t = translations[appLanguage].studio;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500 flex flex-col">
      {/* Grid Background Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-10 dark:opacity-20 transition-opacity"
           style={{ backgroundImage: `linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
      </div>

      <Navigation
        onGoHome={onGoHome}
        onLogin={onShowLogin}
        onStart={onStart}
        user={user}
        profile={profile}
        onLogout={onLogout}
        onShowPayment={onShowPayment}
        onGoPricing={onGoPricing}
        onGoMemberCenter={onGoMemberCenter}
        onGoHistory={onGoHistory}
        activePage={activePage}
        position="fixed"
        appLanguage={appLanguage}
        onSetLanguage={onSetLanguage}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
        {children}
      </main>

      <Footer 
        onGoGenerator={onStart || onGoHome}
        onGoPricing={onGoPricing || (() => {})}
        onGoPrivacyPolicy={onGoPrivacyPolicy}
        onGoTermsOfService={onGoTermsOfService}
        onGoAboutUs={onGoAboutUs}
        appLanguage={appLanguage}
        activePage={activePage}
      />
    </div>
  );
};

export default Layout;
