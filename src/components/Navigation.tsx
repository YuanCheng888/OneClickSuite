import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, LogIn, User as UserIcon, CircleUser, Sparkles, History, LogOut, Globe, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import type { AppLanguage } from '../types';
import { translations } from '../translations';
import { APP_NAME } from '../constants';

interface NavigationProps {
  onGoHome: () => void;
  onLogin?: () => void;
  onStart?: () => void;
  onGoPricing?: () => void;
  onGoMemberCenter?: () => void;
  onGoHistory?: () => void;
  user?: any;
  profile?: any;
  onLogout?: () => void;
  onShowPayment?: () => void;
  activePage?: 'studio' | 'showcase' | 'pricing' | 'memberCenter' | 'history' | 'aboutUs' | 'privacyPolicy' | 'termsOfService';
  centerContent?: React.ReactNode;
  position?: 'fixed' | 'sticky';
  appLanguage?: AppLanguage;
  onSetLanguage?: (lang: AppLanguage) => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  onGoHome, 
  onLogin, 
  onStart, 
  onGoPricing,
  onGoMemberCenter,
  onGoHistory, 
  user, 
  profile, 
  onLogout, 
  onShowPayment,
  activePage,
  centerContent,
  position = 'fixed',
  appLanguage = 'English',
  onSetLanguage
}) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return document.documentElement.classList.contains('dark');
    }
    return true; 
  });

  // Apply theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to dark if no preference saved, or follow saved preference
    const shouldBeDark = savedTheme ? savedTheme === 'dark' : isSystemDark;
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Scroll detection for hiding/showing navbar
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide when scrolling down and not at the top
      // Show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = translations[appLanguage].nav;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className={`${position} top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0f111a]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 -ml-2 text-foreground-muted dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <button 
              onClick={() => {
                if (position === 'fixed') window.scrollTo({ top: 0, behavior: 'smooth' });
                onGoHome();
              }}
              className="flex items-center space-x-2 group transition-all active:scale-95"
            >
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 group-hover:bg-primary-500 transition-all duration-300">
                <Logo className="text-white" size={24} />
              </div>
              <span className="hidden sm:block text-xl font-black tracking-tighter text-foreground dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{APP_NAME}</span>
            </button>
          </div>
          
          {centerContent ? (
              centerContent
          ) : (
            <nav className="hidden md:flex items-center space-x-8 text-sm font-bold text-foreground-muted dark:text-gray-400">
                <button 
                  onClick={() => {
                    if (activePage === 'studio') return;
                    if (onStart) onStart();
                    else onGoHome();
                  }} 
                  className={`${activePage === 'studio' ? 'text-primary-600 dark:text-white cursor-default' : 'hover:text-primary-600 dark:hover:text-white transition-colors'}`}
                >
                  {t.genesis}
                </button>

                {user && (
                  <button 
                    onClick={() => {
                      if (activePage === 'history') return;
                      if (onGoHistory) onGoHistory();
                    }} 
                    className={`${activePage === 'history' ? 'text-primary-600 dark:text-white cursor-default' : 'hover:text-primary-600 dark:hover:text-white transition-colors'}`}
                  >
                    {translations[appLanguage].history.title}
                  </button>
                )}

                {onGoPricing && (
                  <button 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      if (activePage === 'pricing') return;
                      onGoPricing(); 
                    }} 
                    className={`${activePage === 'pricing' ? 'text-primary-600 dark:text-white cursor-default' : 'hover:text-primary-600 dark:hover:text-white transition-colors'}`}
                  >
                    {t.pricing}
                  </button>
                )}
            </nav>
          )}

          <div className="flex items-center space-x-2 sm:space-x-4 justify-end">
            {onSetLanguage && (
                <div className="h-9 sm:h-10 flex items-center bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10 box-border">
                  <button 
                    onClick={() => onSetLanguage('Chinese')}
                    className={`h-full flex items-center justify-center px-2 sm:px-3 text-[10px] sm:text-xs font-bold rounded-lg transition-all ${appLanguage === 'Chinese' ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-foreground-subtle dark:text-gray-500'}`}
                  >
                    CN
                  </button>
                  <button 
                    onClick={() => onSetLanguage('English')}
                    className={`h-full flex items-center justify-center px-2 sm:px-3 text-[10px] sm:text-xs font-bold rounded-lg transition-all ${appLanguage === 'English' ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-foreground-subtle dark:text-gray-500'}`}
                  >
                    EN
                  </button>
                </div>
            )}

            <button
              onClick={toggleTheme}
              className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-foreground-muted dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10"
              aria-label="Toggle theme"
            >
              {isDark ? <Moon size={18} className="text-primary-600 sm:w-5 sm:h-5" /> : <Sun size={18} className="text-yellow-400 sm:w-5 sm:h-5" />}
            </button>

            {user ? (
                <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-foreground-muted dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10 shadow-sm"
                    >
                      <UserIcon size={20} />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-[#0f111a] rounded-[28px] shadow-2xl border border-slate-200 dark:border-white/10 py-3 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 mb-2 text-left">
                          <p className="font-bold text-foreground dark:text-white truncate text-lg">{profile?.full_name || user.user_metadata?.full_name || 'User'}</p>
                          <p className="text-xs text-foreground-subtle dark:text-gray-500 truncate mt-0.5">{user.email}</p>
                        </div>

                        <div className="px-2 space-y-1">
                          {onGoMemberCenter && (
                            <button 
                                onClick={() => { onGoMemberCenter(); setIsUserMenuOpen(false); }}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-colors group ${activePage === 'memberCenter' ? 'bg-slate-100 dark:bg-white/5 text-foreground dark:text-white' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-foreground-muted dark:text-gray-300'}`}
                            >
                                <CircleUser size={20} className={`${activePage === 'memberCenter' ? 'text-primary-500' : 'text-slate-400'}`} />
                                <span className="font-semibold text-sm">{t.memberCenter}</span>
                            </button>
                          )}
                          
                          <button 
                            onClick={() => { if(onGoPricing) onGoPricing(); setIsUserMenuOpen(false); }}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 text-foreground-muted dark:text-gray-300 transition-colors group"
                          >
                            <Sparkles size={20} className="text-amber-500" />
                            <span className="font-semibold text-sm">{profile?.credits ?? 0} {t.credits}</span>
                          </button>
                          
                          {onGoHistory && (
                            <button 
                                onClick={() => { onGoHistory(); setIsUserMenuOpen(false); }}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-colors group ${activePage === 'history' ? 'bg-slate-100 dark:bg-white/5 text-foreground dark:text-white' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-foreground-muted dark:text-gray-300'}`}
                            >
                                <History size={20} className={`${activePage === 'history' ? 'text-primary-500' : 'text-slate-400'}`} />
                                <span className="font-semibold text-sm">{t.history}</span>
                            </button>
                          )}
                        </div>

                        <div className="px-2 mt-2 pt-2 border-t border-slate-100 dark:border-white/5">
                          <button 
                            onClick={() => { if(onLogout) onLogout(); setIsUserMenuOpen(false); }}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 transition-colors group text-left"
                          >
                            <LogOut size={20} />
                            <span className="font-semibold text-sm">{t.signOut}</span>
                          </button>
                        </div>
                      </div>
                    )}
                </div>
            ) : (
                <>
                    {onLogin && (
                        <button onClick={onLogin} className="bg-primary-600 hover:bg-primary-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xl shadow-primary-500/20 transition-all active:scale-95">
                        {t.getStarted}
                        </button>
                    )}
                </>
            )}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-[#0f111a] border-b border-slate-200 dark:border-white/5 p-4 shadow-xl z-40 animate-in slide-in-from-top-2 flex flex-col gap-2">
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (activePage === 'studio') return;
                if (onStart) onStart();
                else onGoHome();
              }} 
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-bold ${activePage === 'studio' ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-foreground-muted dark:text-gray-400'}`}
            >
              {t.genesis}
            </button>

            {user && (
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (activePage === 'history') return;
                  if (onGoHistory) onGoHistory();
                }} 
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-bold ${activePage === 'history' ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-foreground-muted dark:text-gray-400'}`}
              >
                {translations[appLanguage].history.title}
              </button>
            )}

            {onGoPricing && (
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setIsMobileMenuOpen(false);
                  if (activePage === 'pricing') return;
                  onGoPricing(); 
                }} 
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-bold ${activePage === 'pricing' ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-foreground-muted dark:text-gray-400'}`}
              >
                {t.pricing}
              </button>
            )}
          </div>
        )}
      </header>
  );
};

export default Navigation;
