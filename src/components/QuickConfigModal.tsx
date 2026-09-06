import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, RotateCcw, Sparkles, Image, Check, Info } from 'lucide-react';
import { PersonalInfo } from '../types/portfolio';
import { personalInfo as defaultInfo } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

interface QuickConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentInfo: PersonalInfo;
  onSave: (updated: PersonalInfo) => void;
  onReset: () => void;
}

export const QuickConfigModal: React.FC<QuickConfigModalProps> = ({
  isOpen,
  onClose,
  currentInfo,
  onSave,
  onReset,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<PersonalInfo>(currentInfo);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state whenever modal opens or currentInfo changes
  React.useEffect(() => {
    setFormData(currentInfo);
  }, [currentInfo, isOpen]);

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl z-10 my-8 overflow-hidden ${
              theme === 'orange'
                ? 'bg-[#181109] border-orange-900/80 text-white'
                : 'bg-slate-900 border-slate-700 text-white'
            }`}
          >
            {/* Header */}
            <div
              className={`p-5 border-b flex items-center justify-between ${
                theme === 'orange'
                  ? 'bg-[#0f0a05] border-orange-950'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                    theme === 'orange'
                      ? 'bg-orange-600/20 border-orange-500/30 text-orange-400'
                      : 'bg-blue-600/20 border-blue-500/30 text-cyan-400'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest ${
                      theme === 'orange' ? 'text-orange-400' : 'text-cyan-400'
                    }`}
                  >
                    LIVE CONFIGURATOR
                  </span>
                  <h3 className="text-lg font-bold tracking-tight text-white">
                    Customize Personal Info &amp; Photo
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className={`p-2 rounded-xl transition-colors ${
                  theme === 'orange'
                    ? 'text-amber-300/60 hover:text-white hover:bg-orange-950/60'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Note banner */}
            <div
              className={`p-4 border-b flex items-start gap-3 text-xs ${
                theme === 'orange'
                  ? 'bg-orange-950/30 border-orange-900/30 text-amber-200'
                  : 'bg-blue-950/30 border-blue-900/30 text-blue-200'
              }`}
            >
              <Info
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  theme === 'orange' ? 'text-orange-400' : 'text-cyan-400'
                }`}
              />
              <span>
                All information is organized in <strong>src/data/portfolioData.ts</strong>.
                You can edit the code directly or test live updates immediately using this panel!
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                      theme === 'orange' ? 'text-amber-200/70' : 'text-slate-400'
                    }`}
                  >
                    Your Full Name ([YOUR NAME])
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g. John Doe"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-white outline-none ${
                      theme === 'orange'
                        ? 'bg-[#0e0a06] border-orange-900/60 focus:border-orange-500'
                        : 'bg-slate-950 border-slate-800 focus:border-blue-500'
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                      theme === 'orange' ? 'text-amber-200/70' : 'text-slate-400'
                    }`}
                  >
                    Location ([YOUR LOCATION])
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="e.g. Chicago, IL (Remote Available)"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-white outline-none ${
                      theme === 'orange'
                        ? 'bg-[#0e0a06] border-orange-900/60 focus:border-orange-500'
                        : 'bg-slate-950 border-slate-800 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                    theme === 'orange' ? 'text-amber-200/70' : 'text-slate-400'
                  }`}
                >
                  Profile Photo URL ([YOUR PROFILE PHOTO])
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.profilePhotoUrl}
                    onChange={(e) => handleChange('profilePhotoUrl', e.target.value)}
                    placeholder="https://example.com/your-portrait.jpg (or leave empty for placeholder badge)"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-white outline-none ${
                      theme === 'orange'
                        ? 'bg-[#0e0a06] border-orange-900/60 focus:border-orange-500'
                        : 'bg-slate-950 border-slate-800 focus:border-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleChange('profilePhotoUrl', '')}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl ${
                      theme === 'orange'
                        ? 'bg-orange-950 hover:bg-orange-900 text-amber-200'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    Clear
                  </button>
                </div>
                <span
                  className={`text-[11px] mt-1 block ${
                    theme === 'orange' ? 'text-amber-300/60' : 'text-slate-400'
                  }`}
                >
                  Leave empty to keep the premium &ldquo;YOUR PROFILE PHOTO&rdquo; executive placeholder.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                      theme === 'orange' ? 'text-amber-200/70' : 'text-slate-400'
                    }`}
                  >
                    Email Address ([YOUR EMAIL])
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="e.g. data.executive@email.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-white outline-none ${
                      theme === 'orange'
                        ? 'bg-[#0e0a06] border-orange-900/60 focus:border-orange-500'
                        : 'bg-slate-950 border-slate-800 focus:border-blue-500'
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                      theme === 'orange' ? 'text-amber-200/70' : 'text-slate-400'
                    }`}
                  >
                    Phone Number ([YOUR PHONE])
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="e.g. +1 (555) 019-2834"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-white outline-none ${
                      theme === 'orange'
                        ? 'bg-[#0e0a06] border-orange-900/60 focus:border-orange-500'
                        : 'bg-slate-950 border-slate-800 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                      theme === 'orange' ? 'text-amber-200/70' : 'text-slate-400'
                    }`}
                  >
                    WhatsApp ([YOUR WHATSAPP])
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    placeholder="e.g. +1 (555) 019-2834"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-white outline-none ${
                      theme === 'orange'
                        ? 'bg-[#0e0a06] border-orange-900/60 focus:border-orange-500'
                        : 'bg-slate-950 border-slate-800 focus:border-blue-500'
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                      theme === 'orange' ? 'text-amber-200/70' : 'text-slate-400'
                    }`}
                  >
                    LinkedIn ([YOUR LINKEDIN])
                  </label>
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => handleChange('linkedin', e.target.value)}
                    placeholder="e.g. linkedin.com/in/yourname"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-white outline-none ${
                      theme === 'orange'
                        ? 'bg-[#0e0a06] border-orange-900/60 focus:border-orange-500'
                        : 'bg-slate-950 border-slate-800 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                      theme === 'orange' ? 'text-amber-200/70' : 'text-slate-400'
                    }`}
                  >
                    Experience ([YOUR EXPERIENCE])
                  </label>
                  <input
                    type="text"
                    value={formData.experienceYears}
                    onChange={(e) => handleChange('experienceYears', e.target.value)}
                    placeholder="e.g. 5+ Years Experience"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-white outline-none ${
                      theme === 'orange'
                        ? 'bg-[#0e0a06] border-orange-900/60 focus:border-orange-500'
                        : 'bg-slate-950 border-slate-800 focus:border-blue-500'
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                      theme === 'orange' ? 'text-amber-200/70' : 'text-slate-400'
                    }`}
                  >
                    Availability ([YOUR AVAILABILITY])
                  </label>
                  <input
                    type="text"
                    value={formData.availability}
                    onChange={(e) => handleChange('availability', e.target.value)}
                    placeholder="e.g. Available Immediately / Full-Time"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-white outline-none ${
                      theme === 'orange'
                        ? 'bg-[#0e0a06] border-orange-900/60 focus:border-orange-500'
                        : 'bg-slate-950 border-slate-800 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label
                  className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                    theme === 'orange' ? 'text-amber-200/70' : 'text-slate-400'
                  }`}
                >
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-white outline-none ${
                    theme === 'orange'
                      ? 'bg-[#0e0a06] border-orange-900/60 focus:border-orange-500'
                      : 'bg-slate-950 border-slate-800 focus:border-blue-500'
                  }`}
                />
              </div>

              {/* Modal Actions */}
              <div
                className={`pt-4 border-t flex items-center justify-between ${
                  theme === 'orange' ? 'border-orange-950' : 'border-slate-800'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onReset();
                    setFormData(defaultInfo);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    theme === 'orange'
                      ? 'text-amber-300/70 hover:text-white hover:bg-orange-950/60'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Template</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                      theme === 'orange' ? 'text-amber-300/70 hover:text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all ${
                      theme === 'orange'
                        ? 'bg-orange-600 hover:bg-orange-500 shadow-md shadow-orange-600/30'
                        : 'bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/25'
                    }`}
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Apply Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
