import React from 'react';
import { motion } from 'motion/react';
import { testimonials } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';
import { Quote, Star, UserCheck } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section
      id="testimonials"
      className={`relative py-24 section-transition border-t ${
        theme === 'dark'
          ? 'bg-[#0b1120] border-slate-800 text-slate-100'
          : theme === 'orange'
          ? 'bg-[#0c0905] border-orange-950 text-amber-50'
          : 'bg-white border-slate-200 text-slate-900'
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
            CLIENT REPUTATION
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
            CLIENT TESTIMONIALS
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
            Verified client feedback placeholders. Replace with your actual endorsements in portfolioData.ts.
          </motion.p>
        </div>

        {/* Testimonials Grid with Premium Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.65, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={`p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between relative ${
                theme === 'orange'
                  ? 'bg-[#181109]/95 border-orange-900/60 hover:border-orange-500/60 shadow-xl shadow-black/40'
                  : theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700/80 hover:border-blue-500/50 shadow-xl shadow-black/30'
                  : 'bg-slate-50 border-slate-200 hover:border-blue-500 shadow-md shadow-slate-200/50'
              }`}
            >
              {/* Quote Icon */}
              <div className="mb-6 flex items-center justify-between">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    theme === 'orange'
                      ? 'bg-orange-500/10 text-orange-400'
                      : 'bg-blue-500/10 text-blue-600 dark:text-cyan-400'
                  }`}
                >
                  <Quote className="w-6 h-6" />
                </div>
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
              </div>

              {/* Quote Text */}
              <p
                className={`text-sm sm:text-base leading-relaxed italic mb-8 font-medium ${
                  theme === 'orange'
                    ? 'text-amber-100/90'
                    : theme === 'dark'
                    ? 'text-slate-200'
                    : 'text-slate-800'
                }`}
              >
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Client Info Placeholder */}
              <div
                className={`pt-6 border-t flex items-center justify-between ${
                  theme === 'orange'
                    ? 'border-orange-950'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                      theme === 'orange'
                        ? 'bg-orange-500/15 text-orange-400'
                        : 'bg-blue-500/10 text-blue-600 dark:text-cyan-400'
                    }`}
                  >
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-black tracking-tight ${
                        theme === 'dark' || theme === 'orange' ? 'text-white' : 'text-slate-950'
                      }`}
                    >
                      {item.clientName}
                    </h4>
                    <p
                      className={`text-xs font-medium ${
                        theme === 'orange'
                          ? 'text-amber-300/70'
                          : theme === 'dark'
                          ? 'text-slate-400'
                          : 'text-slate-600'
                      }`}
                    >
                      {item.role} • {item.company}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${
                    theme === 'orange'
                      ? 'bg-orange-950 text-amber-300 border border-orange-900/50'
                      : theme === 'dark'
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  Placeholder
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
