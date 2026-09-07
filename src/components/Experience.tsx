import React from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import { ExperienceItem } from '../types/portfolio';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export const Experience: React.FC = () => {
  const { theme } = useTheme();
  const { experiences } = usePortfolio();

  return (
    <section
      id="experience"
      className={`relative py-24 section-transition border-t ${
        theme === 'dark'
          ? 'bg-[#0b1120] border-slate-800 text-slate-100'
          : theme === 'orange'
          ? 'bg-[#0c0905] border-orange-950 text-amber-50'
          : 'bg-slate-50 border-slate-200 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Scroll Reveal */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3 border ${
              theme === 'orange'
                ? 'text-orange-400 bg-orange-500/10 border-orange-500/20'
                : 'text-blue-600 dark:text-cyan-400 bg-blue-500/10 border-blue-500/20'
            }`}
          >
            CAREER TRAJECTORY
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`text-3xl sm:text-5xl font-black tracking-tight ${
              theme === 'dark' || theme === 'orange' ? 'text-white' : 'text-slate-950'
            }`}
          >
            PROFESSIONAL EXPERIENCE
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

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed font-medium ${
              theme === 'orange'
                ? 'text-amber-200/80'
                : theme === 'dark'
                ? 'text-slate-300'
                : 'text-slate-600'
            }`}
          >
            Detailed work history and responsibility logs. Easily customizable in portfolioData.ts.
          </motion.p>
        </div>

        {/* Timeline Container */}
        <div className="max-w-4xl mx-auto relative">
          
          {/* Vertical Timeline Guide Line */}
          <div
            className={`absolute top-4 bottom-4 left-4 sm:left-1/2 sm:-translate-x-1/2 w-0.5 ${
              theme === 'orange'
                ? 'bg-orange-950'
                : theme === 'dark'
                ? 'bg-slate-800'
                : 'bg-slate-200'
            }`}
          />

          <div className="space-y-12">
            {experiences.map((item: ExperienceItem, index: number) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  } gap-8 pl-10 sm:pl-0`}
                >
                  {/* Center Node / Dot */}
                  <div
                    className={`absolute left-2.5 sm:left-1/2 -translate-x-1/2 top-4 w-5 h-5 rounded-full z-10 flex items-center justify-center ${
                      theme === 'orange'
                        ? 'bg-orange-600 ring-4 ring-orange-500/20'
                        : 'bg-blue-600 ring-4 ring-blue-600/20 dark:ring-cyan-500/20'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>

                  {/* Content Card (Takes half width on sm+) */}
                  <div className="w-full sm:w-1/2 sm:px-6">
                    <div
                      className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 ${
                        theme === 'orange'
                          ? 'bg-[#181109]/95 border-orange-900/60 hover:border-orange-500/60 shadow-xl shadow-black/40'
                          : theme === 'dark'
                          ? 'bg-slate-900/90 border-slate-700/80 hover:border-blue-500/50 shadow-xl shadow-black/30'
                          : 'bg-white border-slate-200 hover:border-blue-500 shadow-md shadow-slate-200/60'
                      }`}
                    >
                      {/* Job Period & Location */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-bold font-mono ${
                            theme === 'orange'
                              ? 'text-orange-400'
                              : 'text-blue-600 dark:text-cyan-400'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          {item.period}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                            theme === 'orange'
                              ? 'text-amber-300/70'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <MapPin className="w-3 h-3" />
                          {item.location}
                        </span>
                      </div>

                      {/* Job Title */}
                      <h3
                        className={`text-lg sm:text-xl font-black tracking-tight ${
                          theme === 'dark' || theme === 'orange' ? 'text-white' : 'text-slate-950'
                        }`}
                      >
                        {item.title}
                      </h3>

                      {/* Company Name */}
                      <div
                        className={`flex items-center gap-1.5 text-sm font-bold mt-1 mb-4 ${
                          theme === 'orange'
                            ? 'text-amber-200'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <Briefcase
                          className={`w-4 h-4 ${
                            theme === 'orange'
                              ? 'text-orange-400'
                              : 'text-blue-600 dark:text-cyan-400'
                          }`}
                        />
                        <span>{item.company}</span>
                      </div>

                      {/* Responsibilities Bullets */}
                      <div
                        className={`space-y-2.5 pt-3 border-t ${
                          theme === 'orange'
                            ? 'border-orange-950'
                            : 'border-slate-100 dark:border-slate-800'
                        }`}
                      >
                        {item.responsibilities.map((resp, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-2.5 text-xs font-medium">
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                theme === 'orange'
                                  ? 'text-orange-400'
                                  : 'text-blue-600 dark:text-cyan-400'
                              }`}
                            />
                            <span
                              className={`leading-relaxed ${
                                theme === 'orange'
                                  ? 'text-amber-100/90'
                                  : theme === 'dark'
                                  ? 'text-slate-200'
                                  : 'text-slate-700'
                              }`}
                            >
                              {resp}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Placeholder Notice */}
                      {item.isPlaceholder && (
                        <div
                          className={`mt-4 pt-2 border-t border-dashed text-[10px] italic ${
                            theme === 'orange'
                              ? 'border-orange-900/60 text-amber-400/60'
                              : 'border-slate-200 dark:border-slate-800 text-slate-400'
                          }`}
                        >
                          Add your professional experience here in portfolioData.ts
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
