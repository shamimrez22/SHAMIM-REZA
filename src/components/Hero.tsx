import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Mail,
  CheckCircle2,
  Shield,
  Sparkles,
  Download,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';
import { PersonalInfo } from '../types/portfolio';
import { useTheme } from '../context/ThemeContext';
import { usePortfolio } from '../context/PortfolioContext';

interface HeroProps {
  personalInfo: PersonalInfo;
  onUpdatePhoto?: (url: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ personalInfo }) => {
  const { theme } = useTheme();
  const { openCVModal, openJDModal } = usePortfolio();
  const [photoError, setPhotoError] = useState(false);
  const [fallbackToSvg, setFallbackToSvg] = useState(false);

  const displayPhoto = fallbackToSvg
    ? '/profile-photo.svg'
    : personalInfo.profilePhotoUrl || '/profile-photo.svg';

  const headlineWords = personalInfo.headline.split(' ');
  const nameWords = (personalInfo.name || 'Shamim Reza').toUpperCase().split(' ');

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className={`relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden transition-colors duration-500 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-[#05080f] via-[#0b1120] to-[#0f172a] text-slate-100'
          : theme === 'orange'
          ? 'bg-gradient-to-b from-[#0c0905] via-[#140d07] to-[#1c130b] text-amber-50'
          : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900'
      }`}
    >
      {/* Subtle Background Lighting & Technical Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-700 ${
            theme === 'orange'
              ? 'bg-orange-600'
              : theme === 'dark'
              ? 'bg-blue-600'
              : 'bg-blue-200'
          }`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-15 transition-all duration-700 ${
            theme === 'orange'
              ? 'bg-amber-500'
              : theme === 'dark'
              ? 'bg-cyan-500'
              : 'bg-cyan-100'
          }`}
        />
        {/* Crisp grid lines for high-precision data aesthetic */}
        <div
          className={`absolute inset-0 ${
            theme === 'dark' || theme === 'orange' ? 'opacity-[0.04]' : 'opacity-[0.03]'
          }`}
          style={{
            backgroundImage:
              theme === 'orange'
                ? 'linear-gradient(to right, #ea580c 1px, transparent 1px), linear-gradient(to bottom, #ea580c 1px, transparent 1px)'
                : 'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ================= LEFT COLUMN: Introduction & Typography ================= */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6">
            
            {/* Status Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider w-fit border shadow-sm ${
                theme === 'orange'
                  ? 'border-orange-500/40 bg-[#1c1209]/90 text-amber-300'
                  : theme === 'dark'
                  ? 'border-blue-500/40 bg-slate-900/80 text-sky-300'
                  : 'border-blue-200 bg-blue-50/90 text-blue-700'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{personalInfo.availability}</span>
            </motion.div>

            {/* Greeting Kicker */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="flex items-center gap-2 pt-1"
            >
              <span
                className={`text-sm sm:text-base font-black uppercase tracking-widest ${
                  theme === 'orange'
                    ? 'text-orange-400'
                    : theme === 'dark'
                    ? 'text-cyan-400'
                    : 'text-blue-600'
                }`}
              >
                HELLO, I&apos;M
              </span>
            </motion.div>

            {/* VERY LARGE PROMINENT NAME HEADLINE (Word-by-word reveal) */}
            <div className="overflow-hidden py-1">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[1.02] flex flex-wrap gap-x-3 sm:gap-x-5">
                {nameWords.map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.15 + index * 0.12,
                      ease: [0.2, 0.65, 0.3, 0.9],
                    }}
                    className={`inline-block ${
                      index === nameWords.length - 1
                        ? theme === 'orange'
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600'
                          : theme === 'dark'
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500'
                          : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700'
                        : theme === 'dark' || theme === 'orange'
                        ? 'text-white'
                        : 'text-slate-950'
                    }`}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
            </div>

            {/* Specialization / Role Title: GARMENTS IE REPORT & DATA ENTRY EXECUTIVE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
            >
              <h2
                className={`text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-wide leading-snug ${
                  theme === 'orange'
                    ? 'text-amber-300'
                    : theme === 'dark'
                    ? 'text-sky-300'
                    : 'text-blue-700'
                }`}
              >
                {personalInfo.headline || personalInfo.title}
              </h2>
            </motion.div>

            {/* Subtitle / Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
              className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${
                theme === 'orange'
                  ? 'text-orange-400/90'
                  : theme === 'dark'
                  ? 'text-cyan-400/90'
                  : 'text-blue-600'
              }`}
            >
              {personalInfo.tagline}
            </motion.p>

            {/* Short Professional Introduction (Clean, compact, smaller size) */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
              className={`text-xs sm:text-[13px] leading-relaxed max-w-2xl font-medium uppercase tracking-wide ${
                theme === 'orange'
                  ? 'text-amber-100/80'
                  : theme === 'dark'
                  ? 'text-slate-300'
                  : 'text-slate-600'
              }`}
            >
              {personalInfo.intro}
            </motion.p>

            {/* Key Trust Signals */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="flex flex-wrap gap-4 pt-1"
            >
              <div
                className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider ${
                  theme === 'dark' || theme === 'orange' ? 'text-stone-200' : 'text-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>100% ACCURACY GUARANTEE</span>
              </div>
              <div
                className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider ${
                  theme === 'dark' || theme === 'orange' ? 'text-stone-200' : 'text-slate-700'
                }`}
              >
                <Shield
                  className={`w-4 h-4 flex-shrink-0 ${
                    theme === 'orange' ? 'text-orange-500' : 'text-blue-500'
                  }`}
                />
                <span>STRICT CONFIDENTIALITY &amp; NDA COMPLIANT</span>
              </div>
              <div
                className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider ${
                  theme === 'dark' || theme === 'orange' ? 'text-stone-200' : 'text-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>RAPID TURNAROUND TIME</span>
              </div>
            </motion.div>

            {/* Premium CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75, ease: 'easeOut' }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              {/* Button 1: VIEW MY WORK */}
              <Link
                to="/work"
                id="hero-btn-view-work"
                className={`group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-bold tracking-wider uppercase text-white active:scale-[0.98] rounded-xl shadow-lg transition-all duration-200 ${
                  theme === 'orange'
                    ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/30'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                }`}
              >
                <span>VIEW MY WORK</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Button 2: DOWNLOAD CV */}
              <button
                type="button"
                onClick={openCVModal}
                id="hero-btn-download-cv"
                title="Download CV / View High Quality Templates"
                className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold tracking-wider uppercase rounded-xl border active:scale-[0.98] transition-all duration-200 ${
                  theme === 'orange'
                    ? 'border-orange-500/50 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20 shadow-md'
                    : theme === 'dark'
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 shadow-md'
                    : 'border-blue-500/40 bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-sm'
                }`}
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>DOWNLOAD CV</span>
              </button>

              {/* Button 3: CONTACT ME */}
              <Link
                to="/contact"
                id="hero-btn-contact-me"
                className={`inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-bold tracking-wider uppercase rounded-xl border active:scale-[0.98] transition-all duration-200 ${
                  theme === 'orange'
                    ? 'border-orange-900/80 bg-[#1a120a]/90 text-white hover:bg-orange-950 hover:border-orange-700 shadow-md'
                    : theme === 'dark'
                    ? 'border-slate-700 bg-slate-800/80 text-white hover:bg-slate-700 hover:border-slate-600 shadow-md'
                    : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 shadow-sm'
                }`}
              >
                <Mail className={`w-4 h-4 ${theme === 'orange' ? 'text-orange-400' : 'text-blue-500'}`} />
                <span>CONTACT ME</span>
              </Link>

              {/* Button 4: JOB DESCRIPTION */}
              <button
                type="button"
                onClick={openJDModal}
                id="hero-btn-job-description"
                title="View Full Garments IE, ERP & Data Entry Job Description"
                className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold tracking-wider uppercase rounded-xl border active:scale-[0.98] transition-all duration-200 ${
                  theme === 'orange'
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 shadow-md'
                    : theme === 'dark'
                    ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 shadow-md'
                    : 'border-blue-500/40 bg-blue-50 text-blue-800 hover:bg-blue-100 shadow-sm'
                }`}
              >
                <Briefcase className={`w-4 h-4 ${theme === 'orange' ? 'text-amber-400' : 'text-cyan-400'}`} />
                <span>JOB DESCRIPTION</span>
              </button>
            </motion.div>
          </div>

          {/* ================= RIGHT COLUMN: VERY LARGE PROFILE PICTURE ================= */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative group"
            >
              {/* Outer Decorative Ambient Rings & Glow */}
              <div
                className={`absolute -inset-4 rounded-full opacity-60 blur-xl transition-all duration-700 group-hover:opacity-90 ${
                  theme === 'orange'
                    ? 'bg-gradient-to-tr from-orange-600/40 via-amber-500/30 to-red-600/30'
                    : theme === 'dark'
                    ? 'bg-gradient-to-tr from-blue-600/40 via-cyan-500/30 to-indigo-600/40'
                    : 'bg-gradient-to-tr from-blue-400/30 via-cyan-300/30 to-blue-300/30'
                }`}
              />

              {/* Glowing Outline Ring */}
              <div
                className={`relative p-2 rounded-full shadow-2xl profile-glow bg-gradient-to-tr ${
                  theme === 'orange'
                    ? 'from-orange-600 via-amber-400 to-orange-500'
                    : 'from-blue-600 via-cyan-400 to-blue-500'
                }`}
              >
                
                {/* 400-500px Responsive Container */}
                <div
                  className={`w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] lg:w-[460px] lg:h-[460px] rounded-full overflow-hidden relative border-4 flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02] shadow-2xl ${
                    theme === 'orange'
                      ? 'bg-[#140d07] border-orange-700/60'
                      : theme === 'dark'
                      ? 'bg-slate-900 border-slate-700/60'
                      : 'bg-white border-blue-200 shadow-blue-500/10'
                  }`}
                >
                  
                  {displayPhoto && !photoError ? (
                    <img
                      src={displayPhoto}
                      alt={`${personalInfo.name} - Garments IE Executive`}
                      onError={() => {
                        if (!fallbackToSvg && displayPhoto !== '/profile-photo.svg') {
                          setFallbackToSvg(true);
                        } else {
                          setPhotoError(true);
                        }
                      }}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    /* High-End Labeled Placeholder Area: "YOUR PROFILE PHOTO" */
                    <div
                      className={`w-full h-full flex flex-col items-center justify-center p-8 text-center relative select-none ${
                        theme === 'orange'
                          ? 'bg-gradient-to-br from-[#1a1209] via-[#140d07] to-amber-950 text-amber-50'
                          : theme === 'dark'
                          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-slate-100'
                          : 'bg-gradient-to-br from-white via-slate-50 to-blue-50/70 text-slate-900'
                      }`}
                    >
                      {/* Geometric Holographic Backdrop */}
                      <div
                        className={`absolute inset-0 opacity-20 ${
                          theme === 'orange'
                            ? 'bg-[radial-gradient(#f97316_1px,transparent_1px)]'
                            : theme === 'dark'
                            ? 'bg-[radial-gradient(#38bdf8_1px,transparent_1px)]'
                            : 'bg-[radial-gradient(#2563eb_1px,transparent_1px)]'
                        } [background-size:16px_16px]`}
                      />
                      
                      {/* Executive Monogram & Badge */}
                      <div
                        className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 mb-4 shadow-xl flex items-center justify-center bg-gradient-to-tr ${
                          theme === 'orange'
                            ? 'from-orange-600 to-amber-500 shadow-orange-500/20'
                            : 'from-blue-600 to-cyan-500 shadow-blue-500/20'
                        }`}
                      >
                        <div
                          className={`w-full h-full rounded-full flex items-center justify-center ${
                            theme === 'orange'
                              ? 'bg-[#0f0b07]'
                              : theme === 'dark'
                              ? 'bg-slate-950'
                              : 'bg-white shadow-md'
                          }`}
                        >
                          <span
                            className={`text-3xl sm:text-4xl font-black ${
                              theme === 'orange'
                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300'
                                : theme === 'dark'
                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300'
                                : 'text-blue-600'
                            }`}
                          >
                            {personalInfo.name
                              ? personalInfo.name
                                  .split(' ')
                                  .filter(Boolean)
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)
                                  .toUpperCase()
                              : 'IE'}
                          </span>
                        </div>
                      </div>

                      {/* Explicitly Labeled Placeholder Text */}
                      <span
                        className={`text-xs uppercase font-black tracking-widest mb-1 ${
                          theme === 'orange'
                            ? 'text-orange-400'
                            : theme === 'dark'
                            ? 'text-cyan-400'
                            : 'text-blue-600'
                        }`}
                      >
                        GARMENTS IE EXECUTIVE
                      </span>
                      <h3
                        className={`text-lg sm:text-xl font-black tracking-tight mb-2 ${
                          theme === 'dark' || theme === 'orange' ? 'text-white' : 'text-slate-950'
                        }`}
                      >
                        OFFICIAL PROFILE
                      </h3>
                      <p
                        className={`text-xs max-w-[250px] leading-relaxed mb-4 font-semibold ${
                          theme === 'orange'
                            ? 'text-amber-200/80'
                            : theme === 'dark'
                            ? 'text-slate-300'
                            : 'text-slate-600'
                        }`}
                      >
                        Garments IE Report, ERP &amp; Data Entry Executive
                      </p>

                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border ${
                          theme === 'orange'
                            ? 'bg-orange-500/10 border-orange-500/30 text-orange-300'
                            : theme === 'dark'
                            ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                            : 'bg-slate-100 border-slate-300 text-slate-700'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Secured • Managed via Admin Panel</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
