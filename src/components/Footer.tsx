import React from 'react';
import { Logo } from './Logo';
import { APP_NAME } from '../constants';
import type { AppLanguage } from '../types';
import { translations } from '../translations';

interface FooterProps {
  onGoGenerator: () => void;
  onGoPricing: () => void;
  onGoPrivacyPolicy?: () => void;
  onGoTermsOfService?: () => void;
  onGoAboutUs?: () => void;
  appLanguage?: AppLanguage;
  activePage?: string;
}

const Footer: React.FC<FooterProps> = ({ 
  onGoGenerator, 
  onGoPricing, 
  onGoPrivacyPolicy,
  onGoTermsOfService,
  onGoAboutUs,
  appLanguage = 'English',
  activePage
}) => {
  const t = translations[appLanguage].footer;
  const tn = translations[appLanguage].nav;

  // Determine if generator link should be disabled or styled differently
  // If activePage is 'studio', 'upload', 'planning', or 'results', consider it as 'studio' context
  const isStudioActive = ['studio', 'upload', 'planning', 'results', 'landing'].includes(activePage || '');

  return (
    <footer className="mt-10 py-12 border-t border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#0f111a]/80 backdrop-blur-md transition-colors relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
        <div className="flex flex-col md:flex-row items-left gap-8 md:gap-20">
          <div className="max-w-sm">
            <div className="flex items-center space-x-2 mb-4">
              <Logo className="text-primary-600 dark:text-primary-500" size={24} />
              <span className="text-xl font-black tracking-tighter text-foreground dark:text-white">{APP_NAME}</span>
            </div>
            <p className="text-foreground-muted dark:text-gray-500 text-xs leading-relaxed">
              {appLanguage === 'English' ? (
                <>The premier AI production house for forward-thinking <br /> e-commerce brands.</>
              ) : (
                t.desc
              )}
            </p>
          </div>
          
          <ul className="flex items-center space-x-8 text-sm text-foreground-muted dark:text-gray-400">
            <li>
              <button 
                onClick={onGoGenerator} 
                className={`${isStudioActive ? 'text-primary-600 dark:text-white cursor-default' : 'hover:text-primary-600 dark:hover:text-white transition-colors'}`}
                disabled={isStudioActive}
              >
                {t.generator}
              </button>
            </li>
            <li>
              <button 
                onClick={onGoPricing} 
                className={`${activePage === 'pricing' ? 'text-primary-600 dark:text-white cursor-default' : 'hover:text-primary-600 dark:hover:text-white transition-colors'}`}
                disabled={activePage === 'pricing'}
              >
                {tn.pricing}
              </button>
            </li>
          </ul>
        </div>
        
        <ul className="flex items-center space-x-6 text-sm text-foreground-muted dark:text-gray-400">
            <li>
               <button
                  onClick={onGoAboutUs}
                  className={`${activePage === 'aboutUs' ? 'text-primary-600 dark:text-white cursor-default' : 'hover:text-primary-600 dark:hover:text-white transition-colors'}`}
                  disabled={activePage === 'aboutUs'}
               >
                  {t.aboutUs}
               </button>
            </li>
            <li>
               <button
                  onClick={onGoPrivacyPolicy}
                  className={`${activePage === 'privacyPolicy' ? 'text-primary-600 dark:text-white cursor-default' : 'hover:text-primary-600 dark:hover:text-white transition-colors'}`}
                  disabled={activePage === 'privacyPolicy'}
               >
                  {t.privacyPolicy}
               </button>
            </li>
            <li>
               <button
                  onClick={onGoTermsOfService}
                  className={`${activePage === 'termsOfService' ? 'text-primary-600 dark:text-white cursor-default' : 'hover:text-primary-600 dark:hover:text-white transition-colors'}`}
                  disabled={activePage === 'termsOfService'}
               >
                  {t.termsOfService}
               </button>
            </li>
          </ul>
      </div>

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:row items-center justify-between pt-8 border-t border-slate-200 dark:border-white/5 text-foreground-subtle dark:text-gray-600 text-[10px] uppercase tracking-[0.2em]">
        <span>{t.rights}</span>
      </div>
    </footer>
  );
};

export default Footer;
