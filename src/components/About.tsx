import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, MapPin, Calendar, CheckCircle, Mail, Briefcase, Copy, Check, FileSpreadsheet, Download } from 'lucide-react';
import { PersonalInfo } from '../types/portfolio';
import { useTheme } from '../context/ThemeContext';
import { usePortfolio } from '../context/PortfolioContext';

interface AboutProps {
  personalInfo: PersonalInfo;
}

export const About: React.FC<AboutProps> = ({ personalInfo }) => {
  const { theme } = useTheme();
  const { openCVModal } = usePortfolio();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const infoRows = [
    { label: 'Name', value: personalInfo.name, icon: User },
    { label: 'Position', value: personalInfo.title, icon: Briefcase },
    { label: 'Location', value: personalInfo.location, icon: MapPin },
    { label: 'Experience', value: personalInfo.experienceYears, icon: Calendar },
    { label: 'Availability', value: personalInfo.availability, icon: CheckCircle },
    { label: 'Email', value: personalInfo.email, icon: Mail, copyable: true },
  ];

  return (
    <section
      id="about"
      className={`relative py-24 section-transition ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-[#0b1120] via-[#0f172a] to-[#0b1120] text-slate-100'
          : theme === 'orange'
          ? 'bg-gradient-to-b from-[#0f0b07] via-[#160f08] to-[#0f0b07] text-amber-50'
          : 'bg-gradient-to-b from-white via-slate-50 to-white text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3 border ${
              theme === 'orange'
                ? 'text-orange-400 bg-orange-500/10 border-orange-500/20'
                : 'text-blue-500 bg-blue-500/10 border-blue-500/20'
            }`}
          >
            Executive Background
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-5xl font-black tracking-tight"
          >
            About Me &amp; Professional Philosophy
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`w-20 h-1 mx-auto mt-4 rounded-full ${
              theme === 'orange'
                ? 'bg-gradient-to-r from-orange-500 to-amber-400'
                : 'bg-gradient-to-r from-blue-500 to-cyan-400'
            }`}
          />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Descriptive Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -35, y: 15 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Industrial Engineering Reporting &amp; Executive Data Entry Specialist
            </h3>

            <p
              className={`text-xs sm:text-sm leading-relaxed font-medium ${
                theme === 'orange'
                  ? 'text-amber-100/90'
                  : theme === 'dark'
                  ? 'text-slate-300'
                  : 'text-slate-700'
              }`}
            >
              {personalInfo.aboutText}
            </p>

            <p
              className={`text-xs sm:text-[13px] leading-relaxed font-normal ${
                theme === 'orange'
                  ? 'text-amber-200/75'
                  : theme === 'dark'
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              Whether compiling factory-wide Daily Production Reports (DPR), calculating SMV and sewing line efficiency %, logging Non-Productive Time (NPT), or executing high-speed typing (65+ WPM), internet research, and daily executive emails, my core focus is delivering 100% data integrity, structured analysis, and reliable reporting for factory leadership.
            </p>

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                  theme === 'orange'
                    ? 'bg-[#181109]/90 border-orange-900/60 text-amber-50'
                    : theme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div
                  className={`p-2 rounded-lg mt-0.5 ${
                    theme === 'orange'
                      ? 'bg-orange-500/10 text-orange-400'
                      : 'bg-blue-500/10 text-blue-500'
                  }`}
                >
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Standardized Workbooks</h4>
                  <p
                    className={`text-xs mt-0.5 ${
                      theme === 'orange' ? 'text-amber-300/70' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Structured schemas, validated cells &amp; formula integrity.
                  </p>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                  theme === 'orange'
                    ? 'bg-[#181109]/90 border-orange-900/60 text-amber-50'
                    : theme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div
                  className={`p-2 rounded-lg mt-0.5 ${
                    theme === 'orange'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-emerald-500/10 text-emerald-500'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Zero-Discrepancy Quality</h4>
                  <p
                    className={`text-xs mt-0.5 ${
                      theme === 'orange' ? 'text-amber-300/70' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Rigorous cross-referencing between raw sources &amp; outputs.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Professional Information Card */}
          <motion.div
            initial={{ opacity: 0, x: 35, y: 15 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div
              className={`p-6 sm:p-8 rounded-2xl border shadow-xl transition-all duration-300 relative overflow-hidden ${
                theme === 'orange'
                  ? 'bg-[#1c120a]/95 border-orange-900/70 shadow-black/40'
                  : theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700/80 shadow-black/40'
                  : 'bg-white border-slate-200 shadow-slate-200/60'
              }`}
            >
              {/* Decorative top gradient stripe */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  theme === 'orange'
                    ? 'bg-gradient-to-r from-orange-600 via-amber-400 to-orange-500'
                    : 'bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500'
                }`}
              />

              <div
                className={`flex items-center justify-between pb-6 border-b ${
                  theme === 'orange'
                    ? 'border-orange-950'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={personalInfo.profilePhotoUrl || '/profile-photo.jpg'}
                    alt={personalInfo.name}
                    loading="eager"
                    className="w-12 h-12 rounded-full object-cover object-top border-2 border-orange-500/60 shadow-md shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = '/profile-photo.jpg';
                    }}
                  />
                  <div>
                    <span
                      className={`text-[11px] font-bold tracking-widest uppercase ${
                        theme === 'orange' ? 'text-orange-400' : 'text-blue-500'
                      }`}
                    >
                      CREDENTIAL SUMMARY
                    </span>
                    <h4 className="text-lg font-extrabold tracking-tight mt-0.5">
                      Executive Profile Card
                    </h4>
                  </div>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ring-4 ${
                    theme === 'orange'
                      ? 'bg-orange-500 ring-orange-500/20'
                      : 'bg-emerald-500 ring-emerald-500/20'
                  }`}
                />
              </div>

              {/* Information Rows */}
              <div
                className={`divide-y mt-2 ${
                  theme === 'orange'
                    ? 'divide-orange-950/70'
                    : 'divide-slate-100 dark:divide-slate-800/80'
                }`}
              >
                {infoRows.map((row, idx) => {
                  const Icon = row.icon;
                  return (
                    <div
                      key={idx}
                      className="py-3.5 flex items-center justify-between gap-4 text-sm group"
                    >
                      <div
                        className={`flex items-center gap-3 min-w-[110px] ${
                          theme === 'orange'
                            ? 'text-amber-200/80'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            theme === 'orange' ? 'text-orange-400' : 'text-blue-600 dark:text-cyan-400'
                          }`}
                        />
                        <span className="font-bold text-xs uppercase tracking-wider">
                          {row.label}:
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-right">
                        <span
                          className={`font-bold tracking-tight ${
                            row.value.startsWith('[')
                              ? 'text-amber-500 dark:text-amber-400'
                              : theme === 'dark' || theme === 'orange'
                              ? 'text-white'
                              : 'text-slate-900'
                          }`}
                        >
                          {row.value}
                        </span>

                        {row.copyable && (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(row.value, row.label)}
                            title="Copy email address"
                            className={`p-1.5 rounded-md transition-colors ${
                              theme === 'orange'
                                ? 'hover:bg-orange-950 text-amber-300 hover:text-orange-400'
                                : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600'
                            }`}
                          >
                            {copiedField === row.label ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Card Footer Action */}
              <div
                className={`pt-6 mt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
                  theme === 'orange'
                    ? 'border-orange-950'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <button
                  type="button"
                  onClick={openCVModal}
                  id="about-card-download-cv-btn"
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                    theme === 'orange'
                      ? 'bg-orange-600 hover:bg-orange-500 text-white border-orange-500'
                      : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Curriculum Vitae</span>
                </button>

                <a
                  href="#/contact"
                  className={`text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1 group ${
                    theme === 'orange' ? 'text-orange-400' : 'text-blue-600 dark:text-cyan-400'
                  }`}
                >
                  <span>Direct Inquiry</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
