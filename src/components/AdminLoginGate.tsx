import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  LogIn,
  KeyRound,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import {
  verifyAdminLogin,
  DEFAULT_ADMIN_USERNAME,
  DEFAULT_ADMIN_PASSWORD,
} from '../utils/adminAuth';

interface AdminLoginGateProps {
  onLoginSuccess: (username: string) => void;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({ onLoginSuccess }) => {
  const { theme } = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const result = verifyAdminLogin(username, password);

      if (result.success) {
        setSuccessAnimation(true);
        setTimeout(() => {
          setIsSubmitting(false);
          onLoginSuccess(result.username || username);
        }, 500);
      } else {
        setIsSubmitting(false);
        setErrorMessage(result.message);
      }
    }, 300);
  };

  const handleFillDefaults = () => {
    setUsername(DEFAULT_ADMIN_USERNAME);
    setPassword(DEFAULT_ADMIN_PASSWORD);
    setErrorMessage(null);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 relative overflow-hidden ${
        theme === 'orange'
          ? 'bg-[#0f0a05] text-amber-100'
          : theme === 'dark'
          ? 'bg-slate-950 text-slate-100'
          : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Background Decorative Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            theme === 'orange'
              ? 'bg-orange-600'
              : theme === 'dark'
              ? 'bg-blue-600'
              : 'bg-indigo-400'
          }`}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Top Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 text-xs font-bold transition-all px-3 py-1.5 rounded-lg border ${
              theme === 'orange'
                ? 'border-orange-500/20 text-orange-400 hover:bg-orange-500/10'
                : theme === 'dark'
                ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ওয়েবসাইটে ফিরে যান</span>
          </Link>

          <span
            className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${
              theme === 'orange'
                ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                : theme === 'dark'
                ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                : 'bg-white border-slate-200 text-slate-600 shadow-sm'
            }`}
          >
            Security Gate v2.5
          </span>
        </div>

        {/* Main Card */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all ${
            theme === 'orange'
              ? 'bg-[#181109]/95 border-orange-900/60 shadow-orange-950/40'
              : theme === 'dark'
              ? 'bg-slate-900/95 border-slate-800 shadow-black/60'
              : 'bg-white/95 border-slate-200 shadow-slate-200/80'
          }`}
        >
          {/* Header */}
          <div className="text-center mb-7">
            <div
              className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center border shadow-lg ${
                theme === 'orange'
                  ? 'bg-orange-500/10 border-orange-500/30 text-orange-500 shadow-orange-500/10'
                  : theme === 'dark'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-blue-500/10'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-indigo-100'
              }`}
            >
              {successAnimation ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-500 animate-bounce" />
              ) : (
                <ShieldCheck className="w-8 h-8" />
              )}
            </div>

            <h1
              className={`text-2xl font-black tracking-tight ${
                theme === 'dark' || theme === 'orange' ? 'text-white' : 'text-slate-900'
              }`}
            >
              অ্যাডমিন প্যানেল সিকিউরিটি
            </h1>
            <p
              className={`text-xs sm:text-sm mt-1.5 font-medium ${
                theme === 'orange'
                  ? 'text-amber-200/70'
                  : theme === 'dark'
                  ? 'text-slate-400'
                  : 'text-slate-500'
              }`}
            >
              মাস্টার কন্ট্রোল প্যানেলে প্রবেশ করতে আপনার ইউজারনেম ও পাসওয়ার্ড দিন।
            </p>
          </div>

          {/* Error Alert */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 p-3.5 rounded-xl border flex items-center gap-3 bg-red-500/10 border-red-500/30 text-red-400 text-xs font-bold"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label
                htmlFor="admin-username"
                className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                  theme === 'orange'
                    ? 'text-amber-300'
                    : theme === 'dark'
                    ? 'text-slate-300'
                    : 'text-slate-700'
                }`}
              >
                ইউজারনেম (Username)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. SHAMIM"
                  autoComplete="username"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold tracking-wide border transition-all outline-none ${
                    theme === 'orange'
                      ? 'bg-black/40 border-orange-900/60 text-white placeholder-amber-200/30 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                      : theme === 'dark'
                      ? 'bg-slate-950/70 border-slate-800 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="admin-password"
                  className={`block text-xs font-bold uppercase tracking-wider ${
                    theme === 'orange'
                      ? 'text-amber-300'
                      : theme === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-700'
                  }`}
                >
                  পাসওয়ার্ড (Password)
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড দিন"
                  autoComplete="current-password"
                  required
                  className={`w-full pl-10 pr-12 py-3 rounded-xl text-sm font-semibold tracking-wide border transition-all outline-none ${
                    theme === 'orange'
                      ? 'bg-black/40 border-orange-900/60 text-white placeholder-amber-200/30 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                      : theme === 'dark'
                      ? 'bg-slate-950/70 border-slate-800 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  tabIndex={-1}
                  title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Security Notice: Always Required */}
            <div className={`flex items-center gap-2.5 py-2 px-3 rounded-xl border text-[11px] font-semibold ${
              theme === 'orange'
                ? 'bg-orange-500/10 border-orange-500/20 text-amber-200/90'
                : theme === 'dark'
                ? 'bg-blue-500/10 border-blue-500/20 text-blue-300'
                : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}>
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>নিরাপত্তা সুরক্ষা: অ্যাডমিন প্যানেলে প্রতিবার প্রবেশের সময় পাসওয়ার্ড প্রয়োজন।</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-5 rounded-xl font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl transition-all duration-200 active:scale-[0.98] ${
                theme === 'orange'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-orange-950/40'
                  : theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-400/30'
              } ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>যাচাই করা হচ্ছে...</span>
                </>
              ) : successAnimation ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>প্রবেশ অনুমোদিত!</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>অ্যাডমিন প্যানেলে প্রবেশ করুন</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Default Helper Pill */}
          <div
            className={`mt-6 pt-5 border-t text-center ${
              theme === 'orange'
                ? 'border-orange-900/40'
                : theme === 'dark'
                ? 'border-slate-800'
                : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium text-[11px]">
                <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  ডিফল্ট লগইন:{' '}
                  <strong className="text-white font-mono">{DEFAULT_ADMIN_USERNAME}</strong> /{' '}
                  <strong className="text-white font-mono">{DEFAULT_ADMIN_PASSWORD}</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={handleFillDefaults}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all border ${
                  theme === 'orange'
                    ? 'border-orange-500/30 text-orange-400 bg-orange-500/10 hover:bg-orange-500/20'
                    : theme === 'dark'
                    ? 'border-blue-500/30 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20'
                    : 'border-indigo-300 text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                }`}
                title="ডিফল্ট ইউজারনেম ও পাসওয়ার্ড পূরণ করুন"
              >
                <Sparkles className="w-3 h-3" />
                <span>অটো ফিল (Auto Fill)</span>
              </button>
            </div>
            <p
              className={`text-[10px] mt-2.5 ${
                theme === 'orange'
                  ? 'text-amber-200/50'
                  : theme === 'dark'
                  ? 'text-slate-500'
                  : 'text-slate-400'
              }`}
            >
              প্যানেলে প্রবেশের পর যে কোনো সময় আপনার পছন্দমতো ইউজারনেম ও পাসওয়ার্ড পরিবর্তন করতে পারবেন।
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
