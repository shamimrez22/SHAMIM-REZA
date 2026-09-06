import React from 'react';
import { motion } from 'motion/react';
import { workProcess } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';
import { ProcessStep } from '../types/portfolio';
import { Check, Clock } from 'lucide-react';

export const WorkProcess: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section
      id="process"
      className={`relative py-24 section-transition border-t ${
        theme === 'dark'
          ? 'bg-[#0b1120] border-slate-800 text-slate-100'
          : theme === 'orange'
          ? 'bg-[#0e0a06] border-orange-950 text-amber-50'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Scroll Reveal */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3 border ${
              theme === 'orange'
                ? 'text-orange-400 bg-orange-500/10 border-orange-500/20'
                : 'text-blue-600 dark:text-cyan-400 bg-blue-500/10 border-blue-500/20'
            }`}
          >
            SYSTEMATIC EXECUTION
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-3xl sm:text-5xl font-black tracking-tight ${
              theme === 'dark' || theme === 'orange' ? 'text-white' : 'text-slate-950'
            }`}
          >
            WORK PROCESS TIMELINE
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`w-20 h-1 mx-auto mt-4 rounded-full ${
              theme === 'orange'
                ? 'bg-gradient-to-r from-orange-500 to-amber-400'
                : 'bg-gradient-to-r from-blue-500 to-cyan-400'
            }`}
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className={`text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed font-medium ${
              theme === 'orange'
                ? 'text-amber-200/80'
                : theme === 'dark'
                ? 'text-slate-300'
                : 'text-slate-600'
            }`}
          >
            A 5-stage quality-assured methodology guaranteeing zero data loss, flawless precision, and punctual handover.
          </motion.p>
        </div>

        {/* Process Timeline with Connecting Line */}
        <div className="relative">
          
          {/* Connecting Line for Desktop */}
          <div
            className={`hidden lg:block absolute top-1/2 left-8 right-8 -translate-y-12 h-1 overflow-hidden z-0 ${
              theme === 'orange'
                ? 'bg-orange-950'
                : theme === 'dark'
                ? 'bg-slate-800'
                : 'bg-slate-200'
            }`}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className={`h-full origin-left ${
                theme === 'orange'
                  ? 'bg-gradient-to-r from-orange-600 via-amber-400 to-orange-500'
                  : 'bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
            {workProcess.map((step: ProcessStep, index: number) => (
              <motion.div
                key={step.stepNumber}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                  ease: 'easeOut',
                }}
                className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between group ${
                  theme === 'orange'
                    ? 'bg-[#181109]/90 border-orange-900/60 hover:border-orange-500/60 shadow-lg shadow-black/30'
                    : theme === 'dark'
                    ? 'bg-slate-900/90 border-slate-700/80 hover:border-blue-500/50 shadow-lg shadow-black/20'
                    : 'bg-slate-50 border-slate-200 hover:border-blue-500 shadow-md shadow-slate-200/50'
                }`}
              >
                <div>
                  {/* Step Header with Monogram Number */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl text-white font-black text-sm flex items-center justify-center shadow-md group-hover:scale-110 transition-transform ${
                        theme === 'orange'
                          ? 'bg-gradient-to-tr from-orange-600 to-amber-500 shadow-orange-600/30'
                          : 'bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-blue-500/30'
                      }`}
                    >
                      {step.stepNumber}
                    </div>

                    <div
                      className={`flex items-center gap-1 text-[10px] font-bold ${
                        theme === 'orange'
                          ? 'text-amber-400/70'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Clock
                        className={`w-3 h-3 ${
                          theme === 'orange' ? 'text-orange-400' : 'text-blue-600 dark:text-cyan-400'
                        }`}
                      />
                      <span>{step.durationEstimate}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-sm font-black tracking-tight mb-2 uppercase transition-colors ${
                      theme === 'orange'
                        ? 'text-white group-hover:text-orange-400'
                        : theme === 'dark'
                        ? 'text-white group-hover:text-cyan-300'
                        : 'text-slate-950 group-hover:text-blue-600'
                    }`}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-xs leading-relaxed font-medium ${
                      theme === 'orange'
                        ? 'text-amber-200/70'
                        : theme === 'dark'
                        ? 'text-slate-300'
                        : 'text-slate-600'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Key Action Pill */}
                <div
                  className={`mt-5 pt-3 border-t flex items-center gap-1.5 text-[11px] font-bold ${
                    theme === 'orange'
                      ? 'border-orange-950 text-orange-400'
                      : theme === 'dark'
                      ? 'border-slate-800 text-cyan-400'
                      : 'border-slate-200 text-blue-600'
                  }`}
                >
                  <Check
                    className={`w-3.5 h-3.5 shrink-0 ${
                      theme === 'orange' ? 'text-orange-400' : 'text-emerald-500'
                    }`}
                  />
                  <span className="truncate">{step.keyAction}</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
