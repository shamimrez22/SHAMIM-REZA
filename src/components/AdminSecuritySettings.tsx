import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  KeyRound,
  User,
  Lock,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Sparkles,
  Check,
  Zap,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import {
  getAdminCredentials,
  updateAdminCredentials,
  resetAdminCredentialsToDefault,
  DEFAULT_ADMIN_USERNAME,
  DEFAULT_ADMIN_PASSWORD,
  AdminCredentials,
} from '../utils/adminAuth';
import { syncAdminCredentialsToCloud } from '../utils/cloudSync';

interface AdminSecuritySettingsProps {
  onLogout: () => void;
  showToast: (msg: string) => void;
  onCredentialsUpdated?: (newUsername: string) => void;
}

export const AdminSecuritySettings: React.FC<AdminSecuritySettingsProps> = ({
  onLogout,
  showToast,
  onCredentialsUpdated,
}) => {
  const { theme } = useTheme();

  const [creds, setCreds] = useState<AdminCredentials>(getAdminCredentials());
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const current = getAdminCredentials();
    setCreds(current);
    setNewUsername(current.username);
  }, []);

  const handleAutoFillCurrentPassword = () => {
    setCurrentPassword(creds.password);
    showToast('Current password filled from active session');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const cleanUser = newUsername.trim();
    const cleanPass = newPassword.trim();
    const cleanCurr = currentPassword.trim();

    if (!cleanUser) {
      setFormError('Please enter a valid username (নতুন ইউজারনেম দিন)।');
      return;
    }

    if (!cleanCurr) {
      setFormError('Please enter your current password to authorize changes (বর্তমান পাসওয়ার্ড দিন)।');
      return;
    }

    if (!cleanPass) {
      setFormError('Please enter your new password (নতুন পাসওয়ার্ড দিন)।');
      return;
    }

    if (cleanPass.length < 3) {
      setFormError('Password must be at least 3 characters long (পাসওয়ার্ড কমপক্ষে ৩ অক্ষরের হতে হবে)।');
      return;
    }

    if (cleanPass !== confirmPassword.trim()) {
      setFormError('New password and confirm password do not match (পাসওয়ার্ড দুটো মেলেনি)!');
      return;
    }

    setIsSaving(true);

    try {
      const res = updateAdminCredentials(cleanCurr, cleanUser, cleanPass);

      if (res.success) {
        // Sync to cloud Firestore
        await syncAdminCredentialsToCloud(cleanUser, cleanPass);

        const updated = getAdminCredentials();
        setCreds(updated);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setFormSuccess('Admin Username & Password successfully updated and synced!');
        showToast('✅ Admin credentials updated successfully!');

        if (onCredentialsUpdated) {
          onCredentialsUpdated(cleanUser);
        }
      } else {
        setFormError(res.message);
      }
    } catch {
      setFormError('An unexpected error occurred while saving credentials.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to reset admin credentials to defaults?\n\nDefault Username: ${DEFAULT_ADMIN_USERNAME}\nDefault Password: ${DEFAULT_ADMIN_PASSWORD}`
    );

    if (confirmed) {
      const res = resetAdminCredentialsToDefault();
      if (res.success) {
        await syncAdminCredentialsToCloud(DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_PASSWORD);
        const updated = getAdminCredentials();
        setCreds(updated);
        setNewUsername(updated.username);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setFormSuccess('Reset to defaults: Username: SHAMIM | Password: 321');
        setFormError(null);
        showToast('🔄 Credentials reset to default');

        if (onCredentialsUpdated) {
          onCredentialsUpdated(DEFAULT_ADMIN_USERNAME);
        }
      }
    }
  };

  const cardBgClass =
    theme === 'orange'
      ? 'bg-[#181109]/95 border-orange-900/60'
      : theme === 'dark'
      ? 'bg-slate-900/90 border-slate-800'
      : 'bg-white border-slate-200 shadow-sm';

  const inputClass =
    theme === 'orange'
      ? 'bg-black/50 border-orange-900/60 text-white placeholder-amber-200/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
      : theme === 'dark'
      ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500';

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Overview Banner */}
      <div className={`p-6 sm:p-7 rounded-2xl border ${cardBgClass} relative overflow-hidden`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg shrink-0 ${
                theme === 'orange'
                  ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                  : theme === 'dark'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-600'
              }`}
            >
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">Admin Security & Password Control</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                Manage and update your admin login username and password anytime. Changes persist locally and in cloud storage.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all active:scale-95 shrink-0"
            title="Logout from admin session"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Current Info Pills */}
        <div className="mt-6 pt-5 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className={`p-3.5 rounded-xl border ${theme === 'orange' ? 'bg-orange-500/5 border-orange-500/20' : 'bg-slate-800/40 border-slate-800'}`}>
            <span className="text-[11px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Active Username</span>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              <span className="text-base font-black font-mono tracking-wider">{creds.username}</span>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border ${theme === 'orange' ? 'bg-orange-500/5 border-orange-500/20' : 'bg-slate-800/40 border-slate-800'}`}>
            <span className="text-[11px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Password Protected</span>
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span className="text-base font-black tracking-wider">••••••••</span>
              <span className="text-[10px] text-slate-400 font-mono">({creds.password.length} Chars)</span>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border ${theme === 'orange' ? 'bg-orange-500/5 border-orange-500/20' : 'bg-slate-800/40 border-slate-800'}`}>
            <span className="text-[11px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Last Modified</span>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-slate-300">
                {creds.updatedAt ? new Date(creds.updatedAt).toLocaleDateString() : 'Default'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Credentials Form */}
      <div className={`p-6 sm:p-8 rounded-2xl border ${cardBgClass}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-black tracking-tight">Change Admin Username & Password</h3>
          </div>
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5"
            title="Reset to default SHAMIM / 321"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>
        </div>

        {/* Feedback Alerts */}
        <AnimatePresence>
          {formError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl border flex items-center gap-3 bg-red-500/10 border-red-500/30 text-red-400 text-xs font-bold"
            >
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{formError}</span>
            </motion.div>
          )}

          {formSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl border flex items-center gap-3 bg-emerald-500/10 border-emerald-500/30 text-emerald-400 text-xs font-bold"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>{formSuccess}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Row 1: Username & Current Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* New Username */}
            <div>
              <label
                htmlFor="new-admin-username"
                className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-300"
              >
                New Username (নতুন ইউজারনেম) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="new-admin-username"
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. SHAMIM"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold tracking-wide border transition-all outline-none ${inputClass}`}
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Case-insensitive during login (যেকোনো কেসে টাইপ করলেই লগইন হবে)।
              </span>
            </div>

            {/* Current Password Verification */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="current-admin-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-300"
                >
                  Current Password (বর্তমান পাসওয়ার্ড) *
                </label>
                <button
                  type="button"
                  onClick={handleAutoFillCurrentPassword}
                  className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                  title="Auto-fill password from current session"
                >
                  <Zap className="w-3 h-3" />
                  <span>Auto-fill Current</span>
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="current-admin-password"
                  type={showCurrentPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password (e.g. 321)"
                  required
                  className={`w-full pl-10 pr-12 py-3 rounded-xl text-sm font-semibold tracking-wide border transition-all outline-none ${inputClass}`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                  tabIndex={-1}
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Required for security verification before saving changes.
              </span>
            </div>
          </div>

          {/* Row 2: New Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-800/40">
            {/* New Password */}
            <div>
              <label
                htmlFor="new-admin-password"
                className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-300"
              >
                New Password (নতুন পাসওয়ার্ড) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="new-admin-password"
                  type={showNewPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className={`w-full pl-10 pr-12 py-3 rounded-xl text-sm font-semibold tracking-wide border transition-all outline-none ${inputClass}`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                  tabIndex={-1}
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Minimum 3 characters or numbers (কমপক্ষে ৩ অক্ষর বা সংখ্যা)।
              </span>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-admin-password"
                className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-300"
              >
                Confirm New Password (পাসওয়ার্ড নিশ্চিতকরণ) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Check className="w-4 h-4" />
                </div>
                <input
                  id="confirm-admin-password"
                  type={showConfirmPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className={`w-full pl-10 pr-12 py-3 rounded-xl text-sm font-semibold tracking-wide border transition-all outline-none ${inputClass}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                  tabIndex={-1}
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Must match the new password exactly.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/40">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-700 hover:bg-slate-800 text-slate-300 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Reset to Default (SHAMIM / 321)</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-3 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
                theme === 'orange'
                  ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/30'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              } ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving &amp; Syncing...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Username &amp; Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Safety & Help Tips */}
      <div
        className={`p-5 rounded-2xl border ${
          theme === 'orange'
            ? 'bg-amber-500/5 border-amber-500/20 text-amber-200/80'
            : 'bg-blue-500/5 border-blue-500/20 text-slate-300'
        } text-xs leading-relaxed space-y-2`}
      >
        <div className="flex items-center gap-2 font-bold text-sm text-white">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Security Tips &amp; Guidance:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-400">
          <li>
            After updating username or password, your active session remains authenticated so you can continue editing.
          </li>
          <li>
            On your next visit or when opening from a new browser tab or device, use your new credentials.
          </li>
          <li>
            If you ever forget your custom password, you can use the &quot;Reset to Default&quot; button to revert back to{' '}
            <strong className="text-white">SHAMIM</strong> / <strong className="text-white">321</strong>.
          </li>
          <li>
            Always click <strong className="text-white">&quot;Logout&quot;</strong> before closing the browser on public or shared computers.
          </li>
        </ul>
      </div>
    </div>
  );
};
