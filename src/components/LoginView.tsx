
import React, { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, ArrowLeft, UserPlus, ArrowRight, Sun, Moon, Loader2, X } from 'lucide-react';
import { Logo } from './Logo';
import { supabase } from '../supabaseClient';
import type { AppLanguage } from '../types';
import { translations } from '../translations';

interface LoginViewProps {
  onBack: () => void;
  appLanguage?: AppLanguage;
  onSetLanguage?: (lang: AppLanguage) => void;
  onSuccess?: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onBack, appLanguage = 'English', onSetLanguage, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  
  const t = translations[appLanguage].login;
  const tn = translations[appLanguage].nav;

  // Auth State
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);

  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setResetMessage({ type: 'error', text: t.errEmailRequired });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
        setResetMessage({ type: 'error', text: t.errEmailInvalid });
        return;
    }

    setResetLoading(true);
    setResetMessage(null);
    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      
      // Use a distinct query parameter to signal the password reset flow.
      // This is more reliable than hash fragments which can be cleared by clients.
      const redirectUrl = new URL(window.location.origin);
      redirectUrl.searchParams.set('flow', 'reset-password');
      
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: redirectUrl.toString(),
      });
      if (error) throw error;
      setResetMessage({ 
        type: 'success', 
        text: (t as any).msgResetEmailSent 
      });
    } catch (err: any) {
      setResetMessage({ type: 'error', text: err.message });
    } finally {
      setResetLoading(false);
    }
  };

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

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (!cleanValue && value !== '') return;

    const char = cleanValue.slice(-1);
    const newCode = [...verificationCode];
    newCode[index] = char;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (char && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/[^0-9]/g, '');
    if (!pastedData) return;

    const newCode = [...verificationCode];
    const chars = pastedData.split('');
    
    chars.forEach((char, i) => {
      if (i < 6) newCode[i] = char;
    });

    setVerificationCode(newCode);

    // Focus the next empty input or the last one
    const nextIndex = Math.min(chars.length, 5);
    const targetInput = document.getElementById(`code-${nextIndex}`);
    targetInput?.focus();
  };

  const handleLogin = async () => {
    if (!supabase) {
      setError(t.errSupabaseMissing);
      return;
    }
    if (!email) {
      setError(t.errEmailRequired);
      return;
    }
    if (!password) {
      setError(t.errPasswordRequired);
      return;
    }
    if (password.length < 6) {
        setError(t.errPasswordLength);
        return;
    }

    setLoading(true);
    setError(null);
    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      // Success
      if (onSuccess) {
        onSuccess();
      } else {
        onBack();
      }
    } catch (err: any) {
      if (err.message === 'Invalid login credentials') {
          setError(t.errInvalidCredentials);
      } else {
          setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGetCode = async () => {
    if (!supabase) {
      setError(t.errSupabaseMissing);
      return;
    }
    if (!email) {
      setError(t.errEmailRequired);
      return;
    }
    // Validate Full Name for Signup
    if (mode === 'signup' && !fullName.trim()) {
      setError(t.errFullNameRequired);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setError(t.errEmailInvalid);
        return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { 
          shouldCreateUser: true,
          data: {
            full_name: fullName.trim()
          }
        }
      });
      if (error) throw error;
      setCodeSent(true);
      setError(t.msgCodeSent);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!supabase) {
      setError(t.errSupabaseMissing);
      return;
    }
    if (!password) {
        setError(t.errPasswordRequired);
        return;
    }
    if (!fullName.trim()) {
        setError(t.errFullNameRequired);
        return;
    }
    if (password.length < 6) {
        setError(t.errPasswordLength);
        return;
    }

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);

    if (!hasLowerCase || !hasUpperCase || !hasDigit) {
        setError((t as any).passwordRequirements);
        return;
    }

    setLoading(true);
    setError(null);
    try {
      const code = verificationCode.join('');
      if (code.length !== 6) throw new Error(t.errCodeRequired);

      // 1. Verify OTP
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code,
        type: 'email'
      });
      
      if (verifyError) {
        // Fallback for 'signup' type if needed, but 'email' usually covers magic link/otp
        const { error: signupError } = await supabase.auth.verifyOtp({
            email: email.trim(),
            token: code,
            type: 'signup'
        });
        if (signupError) throw verifyError; // Throw original or signup error
      }

      // 2. Update Password & Profile
      const { error: updateError } = await supabase.auth.updateUser({ 
        password,
        data: { full_name: fullName.trim() }
      });
      if (updateError) throw updateError;

      // Success
      if (onSuccess) {
        onSuccess();
      } else {
        onBack();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 dark:bg-[#0f111a] font-sans transition-colors duration-500">
      {/* Top Right Controls */}
      <div className="absolute top-8 right-8 flex items-center gap-3 z-50">
        {/* Language Switcher */}
        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
          <button 
            onClick={() => onSetLanguage?.('Chinese')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${appLanguage === 'Chinese' ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300'}`}
          >
            CN
          </button>
          <button 
            onClick={() => onSetLanguage?.('English')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${appLanguage === 'English' ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300'}`}
          >
            EN
          </button>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-white dark:bg-[#161b26] border border-gray-200 dark:border-[#2d3648] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1c2230] transition-all shadow-sm"
        >
          {isDark ? <Moon size={20} className="text-primary-600" /> : <Sun size={20} className="text-yellow-500" />}
        </button>
      </div>

      {/* Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-20"
        style={{
          backgroundImage: isDark 
            ? `linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)`
            : `linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="absolute inset-0 overflow-y-auto">
        <div className="min-h-full flex flex-col items-center justify-center py-24 px-6">
          <div className="relative z-10 w-full max-w-[480px]">
            <div className="bg-white dark:bg-[#161b26] rounded-[40px] p-10 border border-gray-200 dark:border-[#2d3648] shadow-2xl transition-all duration-500">
              {/* Logo Icon */}
              <div className="flex justify-center mb-8">
                <button 
                  onClick={onBack}
                  className="w-16 h-16 bg-slate-50 dark:bg-[#2d3648] rounded-2xl flex items-center justify-center relative overflow-hidden group shadow-lg border border-gray-100 dark:border-transparent active:scale-95 transition-all"
                >
                  <div className="absolute inset-0 bg-primary-500/10 dark:bg-primary-500/20 blur-xl group-hover:bg-primary-500/30 transition-all"></div>
                  <Logo className="text-primary-600 dark:text-primary-400 relative z-10 group-hover:rotate-12 transition-transform" size={32} />
                </button>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {(t.title as any)(mode)}
                </h1>
                <p className="text-slate-500 dark:text-gray-400 text-sm">
                  {(t.subtitle as any)(mode)}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm text-center font-medium">
                  {error}
                </div>
              )}

              {/* Toggle Switch */}
              <div className="bg-slate-100 dark:bg-[#0f111a] p-1.5 rounded-2xl flex mb-8 border border-slate-200 dark:border-[#2d3648]/50">
                <button 
                  onClick={() => { setMode('login'); setError(null); }}
                  className={`flex-1 py-3 font-bold rounded-xl transition-all duration-300 ${mode === 'login' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300'}`}
                >
                  {tn.login}
                </button>
                <button 
                  onClick={() => { setMode('signup'); setError(null); }}
                  className={`flex-1 py-3 font-bold rounded-xl transition-all duration-300 ${mode === 'signup' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300'}`}
                >
                  {(t as any).signUp}
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name (Only for Sign Up) */}
                {mode === 'signup' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-[10px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-widest mb-2 px-1">
                      {t.fullName}
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500">
                        <UserPlus size={18} />
                      </div>
                      <input 
                        type="text" 
                        placeholder={t.fullNamePlaceholder}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#1c2230] border border-slate-200 dark:border-[#2d3648] text-slate-900 dark:text-white px-12 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 transition-all placeholder-slate-400 dark:placeholder-gray-600 shadow-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-widest mb-2 px-1">
                    {t.email}
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500">
                        <Mail size={18} />
                      </div>
                      <input 
                        type="email" 
                        autoComplete="username"
                        placeholder={(t as any).emailPlaceholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#1c2230] border border-slate-200 dark:border-[#2d3648] text-slate-900 dark:text-white px-12 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 transition-all placeholder-slate-400 dark:placeholder-gray-600 shadow-sm"
                      />
                    </div>
                    {mode === 'signup' && (
                      <button 
                        type="button"
                        onClick={handleGetCode}
                        disabled={loading || codeSent}
                        className="px-5 bg-white dark:bg-[#1c2230] border border-slate-200 dark:border-[#2d3648] text-slate-700 dark:text-white rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-[#2d3648] transition-all whitespace-nowrap shadow-sm disabled:opacity-50"
                      >
                        {codeSent ? (t as any).sent : t.getCode}
                      </button>
                    )}
                  </div>
                </div>

                {/* Email Verification Code (Only for Sign Up) */}
                {mode === 'signup' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-[10px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-widest mb-2 px-1">
                      {t.verifyCode}
                    </label>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex gap-2 flex-1">
                        {[0, 1, 2].map((i) => (
                          <input
                            key={i}
                            id={`code-${i}`}
                            type="text"
                            maxLength={1}
                            value={verificationCode[i]}
                            onChange={(e) => handleCodeChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            onPaste={handlePaste}
                            className="w-full bg-slate-50 dark:bg-[#1c2230] border border-slate-200 dark:border-[#2d3648] text-slate-900 dark:text-white text-center py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 transition-all font-bold text-lg shadow-sm"
                          />
                        ))}
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-gray-600 mx-1"></div>
                      <div className="flex gap-2 flex-1">
                        {[3, 4, 5].map((i) => (
                          <input
                            key={i}
                            id={`code-${i}`}
                            type="text"
                            maxLength={1}
                            value={verificationCode[i]}
                            onChange={(e) => handleCodeChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            onPaste={handlePaste}
                            className="w-full bg-slate-50 dark:bg-[#1c2230] border border-slate-200 dark:border-[#2d3648] text-slate-900 dark:text-white text-center py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 transition-all font-bold text-lg shadow-sm"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Password */}
                <div className="relative">
                  <div className="flex justify-between items-center mb-2 px-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-widest">
                      {t.password}
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500">
                      <Lock size={18} />
                    </div>
                    <input 
                      type="password" 
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      placeholder={mode === 'login' ? '••••••••' : (t as any).passwordPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#1c2230] border border-slate-200 dark:border-[#2d3648] text-slate-900 dark:text-white px-12 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 transition-all placeholder-slate-400 dark:placeholder-gray-600 shadow-sm"
                    />
                  </div>
                  {mode === 'login' && (
                    <button 
                      type="button"
                      onClick={() => { setResetEmail(email); setShowForgotPassword(true); setResetMessage(null); }}
                      className="absolute right-1 top-0 text-[10px] font-bold text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-all"
                    >
                      {t.forgot}
                    </button>
                  )}
                  {mode === 'signup' && (
                    <p className="mt-2 text-[10px] text-slate-400 dark:text-gray-500 leading-tight">
                      {(t as any).passwordRequirements}
                    </p>
                  )}
                </div>

                {/* Action Button */}
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/20 active:scale-[0.98] transition-all mt-4 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <span>{mode === 'login' ? t.access : t.create}</span>
                      {mode === 'login' ? <LogIn size={20} /> : <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                    </>
                  )}
                </button>
              </form>

              {/* Footer Links */}
              <div className="mt-10 text-center">
                <p className="text-[10px] text-slate-400 dark:text-gray-500 font-bold uppercase tracking-[0.15em] leading-relaxed">
                  {t.terms}
                </p>
              </div>
            </div>

            {/* Back to Home */}
            <button 
              onClick={onBack}
              className="mt-12 mx-auto flex items-center space-x-2 text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white transition-all font-medium"
            >
              <ArrowLeft size={20} />
              <span>{translations[appLanguage].pricing.back}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm" onClick={() => setShowForgotPassword(false)} />
          <div className="relative bg-white dark:bg-[#161b26] rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100 dark:border-[#2d3648] animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowForgotPassword(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {(t as any).resetPasswordTitle}
            </h3>
            <p className="text-sm text-slate-500 dark:text-gray-400 mb-6">
              {(t as any).resetPasswordDesc}
            </p>

            {resetMessage && (
              <div className={`mb-6 p-3 rounded-xl text-sm font-medium text-center ${
                resetMessage.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' 
                  : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {resetMessage.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-widest mb-2 px-1">
                  {t.email}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder={(t as any).emailPlaceholder}
                    className="w-full bg-slate-50 dark:bg-[#1c2230] border border-slate-200 dark:border-[#2d3648] text-slate-900 dark:text-white px-12 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 transition-all placeholder-slate-400 dark:placeholder-gray-600 shadow-sm"
                  />
                </div>
              </div>

              <button 
                onClick={handleResetPassword}
                disabled={resetLoading || (resetMessage?.type === 'success')}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {resetLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <span>{(t as any).btnSendResetLink}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginView;
