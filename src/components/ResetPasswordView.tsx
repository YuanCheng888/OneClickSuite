import React, { useState } from 'react';
import { Lock, ArrowLeft, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import type { AppLanguage } from '../types';
import { translations } from '../translations';

interface ResetPasswordViewProps {
  onBack: () => void;
  appLanguage?: AppLanguage;
  onSuccess: () => void;
}

const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({ onBack, appLanguage = 'English', onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const t = translations[appLanguage].login; // Reuse login translations where possible

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword || !confirmPassword) {
      setError((t as any).errFillAllFields);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError((t as any).errPasswordsDoNotMatch);
      return;
    }

    if (newPassword.length < 6) {
      setError(t.errPasswordLength);
      return;
    }

    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasDigit = /\d/.test(newPassword);

    if (!hasLowerCase || !hasUpperCase || !hasDigit) {
      setError((t as any).passwordRequirements);
      return;
    }

    setLoading(true);

    try {
      if (!supabase) throw new Error("Supabase client not initialized");

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);

    } catch (err: any) {
      setError(err.message || (t as any).errResetFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1115] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#161b26] rounded-[2rem] p-8 md:p-12 shadow-2xl border border-white/20 dark:border-[#2d3648] relative overflow-hidden">
          
          <div className="text-center mb-10 relative">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              {(t as any).resetPasswordTitle}
            </h1>
            <p className="text-slate-500 dark:text-gray-400">
              {(t as any).msgEnterNewPassword}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-2">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center py-8 animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {(t as any).msgPasswordResetSuccess}
              </h3>
              <p className="text-slate-500 dark:text-gray-400">
                {(t as any).msgRedirecting}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-widest mb-2 px-1">
                  {(t as any).lblNewPassword}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-[#1c2230] border border-slate-200 dark:border-[#2d3648] text-slate-900 dark:text-white px-12 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 transition-all placeholder-slate-400 dark:placeholder-gray-600 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-widest mb-2 px-1">
                  {(t as any).lblConfirmPassword}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-[#1c2230] border border-slate-200 dark:border-[#2d3648] text-slate-900 dark:text-white px-12 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 transition-all placeholder-slate-400 dark:placeholder-gray-600 shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/20 active:scale-[0.98] transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <span>{(t as any).btnResetPassword}</span>
                )}
              </button>
            </form>
          )}

          <button
            onClick={onBack}
            className="mt-8 mx-auto flex items-center space-x-2 text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white transition-all font-medium"
          >
            <ArrowLeft size={20} />
            <span>{(t as any).btnBackToHome}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordView;
