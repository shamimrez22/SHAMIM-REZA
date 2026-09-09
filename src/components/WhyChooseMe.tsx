import React from 'react';
import { motion } from 'motion/react';
import { whyChooseMe } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';
import { WhyChooseItem } from '../types/portfolio';
import { Check, ShieldCheck, Zap, Lock, Award } from 'lucide-react';

export const WhyChooseMe: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section
      id="why-choose-me"
      className={`relative py-5 sm:py-7 section-transition border-t ${
        theme === 'dark'
          ? 'bg-[#0a0f1d] border-slate-800 text-slate-100'
          : theme === 'orange'
          ? 'bg-[#0a0704] border-orange-950 text-amber-50'
          : 'bg-[#ffffff] border-slate-200 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Scroll Reveal */}
        <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-5">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-1.5 border ${
              theme === 'orange'
                ? 'text-orange-400 bg-orange-500/10 border-orange-500/20'
                : 'text-blue-500 bg-blue-500/10 border-blue-500/20'
            }`}
          >
            CORE VALUE PROPOSITION
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl sm:text-3xl font-black tracking-tight"
          >
            WHY WORK WITH ME?
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`w-16 h-1 mx-auto mt-2 rounded-full ${
              theme === 'orange'
                ? 'bg-gradient-to-r from-orange-500 to-amber-400'
                : 'bg-gradient-to-r from-blue-500 to-cyan-400'
            }`}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed ${
              theme === 'orange'
                ? 'text-amber-200/80'
                : theme === 'dark'
                ? 'text-slate-300'
                : 'text-slate-600'
            }`}
          >
            A disciplined, accuracy-first approach committed to high-quality results, confidential handling, and transparent communication.
          </motion.p>
        </div>

        {/* 8 Animated Checkmark Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseMe.map((item: WhyChooseItem, index: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{
                duration: 0.55,
                delay: index * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between group ${
                theme === 'orange'
                  ? 'bg-[#181109]/90 border-orange-950/90 hover:border-orange-500/50 shadow-lg shadow-black/30'
                  : theme === 'dark'
                  ? 'bg-slate-900/70 border-slate-800 hover:border-emerald-500/50 shadow-lg shadow-black/20'
                  : 'bg-slate-50/80 border-slate-200/90 hover:border-emerald-500 shadow-md shadow-slate-200/50'
              }`}
            >
              <div>
                {/* Checkmark Icon Badge */}
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 ${
                    theme === 'orange'
                      ? 'bg-orange-500/15 border-orange-500/30 text-orange-400 group-hover:bg-orange-600 group-hover:text-white'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white'
                  }`}
                >
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>

                {/* Title */}
                <h3
                  className={`text-base font-bold tracking-tight mb-2 transition-colors ${
                    theme === 'orange' ? 'group-hover:text-orange-400' : 'group-hover:text-emerald-500'
                  }`}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  className={`text-xs leading-relaxed ${
                    theme === 'orange'
                      ? 'text-amber-200/70'
                      : theme === 'dark'
                      ? 'text-slate-400'
                      : 'text-slate-600'
                  }`}
                >
                  {item.description}
                </p>
              </div>

              {/* Status Indicator */}
              <div
                className={`mt-5 pt-3 border-t flex items-center justify-between text-[10px] ${
                  theme === 'orange'
                    ? 'border-orange-950 text-amber-400/60'
                    : 'border-slate-200/60 dark:border-slate-800/80 text-slate-400'
                }`}
              >
                <span>Standard Policy</span>
                <span className={`font-semibold ${theme === 'orange' ? 'text-orange-400' : 'text-emerald-500'}`}>
                  Verified ✓
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Executive Trust Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`mt-14 p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-6 ${
            theme === 'orange'
              ? 'bg-gradient-to-r from-[#1e130a] via-[#150d06] to-[#1e130a] border-orange-900/60 text-white'
              : theme === 'dark'
              ? 'bg-gradient-to-r from-blue-950/40 via-slate-900 to-cyan-950/30 border-blue-900/40'
              : 'bg-gradient-to-r from-blue-50 via-white to-cyan-50 border-blue-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl text-white flex items-center justify-center shrink-0 shadow-md ${
                theme === 'orange' ? 'bg-orange-600' : 'bg-blue-600'
              }`}
            >
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-tight">
                Non-Disclosure &amp; Enterprise Data Privacy Standards
              </h4>
              <p
                className={`text-xs mt-0.5 ${
                  theme === 'orange' ? 'text-amber-200/70' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Client datasets and proprietary records are processed under strict confidentiality agreements.
              </p>
            </div>
          </div>

          <a
            href="#/contact"
            className={`shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-colors shadow-sm ${
              theme === 'orange'
                ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/30'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            Discuss A Project
          </a>
        </motion.div>

      </div>
    </section>
  );
};
