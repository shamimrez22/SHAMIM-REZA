import React from 'react';
import { motion } from 'motion/react';
import { services } from '../data/portfolioData';
import { DynamicIcon } from './DynamicIcon';
import { useTheme } from '../context/ThemeContext';
import { ServiceItem } from '../types/portfolio';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const Services: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section
      id="services"
      className={`relative py-12 sm:py-16 section-transition border-t ${
        theme === 'dark'
          ? 'bg-[#0b1120] border-slate-800 text-slate-100'
          : theme === 'orange'
          ? 'bg-[#0a0704] border-orange-950 text-amber-50'
          : 'bg-slate-50 border-slate-200 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Scroll Reveal */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-2 border ${
              theme === 'orange'
                ? 'text-orange-400 bg-orange-500/10 border-orange-500/20'
                : 'text-blue-500 bg-blue-500/10 border-blue-500/20'
            }`}
          >
            SOLUTIONS &amp; DELIVERABLES
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl sm:text-4xl font-black tracking-tight"
          >
            WHAT I CAN DO FOR YOU
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`w-20 h-1 mx-auto mt-3 rounded-full ${
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
            className={`text-xs sm:text-sm mt-3 max-w-2xl mx-auto leading-relaxed ${
              theme === 'orange'
                ? 'text-amber-200/80'
                : theme === 'dark'
                ? 'text-slate-300'
                : 'text-slate-600'
            }`}
          >
            Specialized executive data services tailored to eliminate operational friction, 
            guarantee data integrity, and liberate valuable internal bandwidth.
          </motion.p>
        </div>

        {/* 6 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {services.map((service: ServiceItem, index: number) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                theme === 'orange'
                  ? 'bg-[#181109]/95 border-orange-900/60 hover:border-orange-500/60 shadow-xl shadow-black/40'
                  : theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700/80 hover:border-blue-500/50 shadow-xl shadow-black/30'
                  : 'bg-white border-slate-200 hover:border-blue-500 shadow-md shadow-slate-200/60'
              }`}
            >
              {/* Subtle top indicator bar on hover */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  theme === 'orange'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-400'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-400'
                }`}
              />

              <div>
                {/* Header: Number & Icon */}
                <div className="flex items-center justify-between mb-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 shadow-sm ${
                      theme === 'orange'
                        ? 'bg-orange-500/15 border-orange-500/25 text-orange-400 group-hover:bg-orange-600 group-hover:text-white'
                        : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-cyan-400 group-hover:bg-blue-600 group-hover:text-white'
                    }`}
                  >
                    <DynamicIcon name={service.iconName} className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xl font-black font-mono ${
                      theme === 'orange'
                        ? 'text-amber-500/40'
                        : 'text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    {service.number}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={`text-lg font-black tracking-tight mb-2 transition-colors ${
                    theme === 'orange'
                      ? 'group-hover:text-orange-400 text-white'
                      : 'group-hover:text-blue-600 dark:group-hover:text-cyan-300'
                  }`}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  className={`text-xs sm:text-[13px] leading-relaxed mb-3.5 font-medium ${
                    theme === 'orange'
                      ? 'text-amber-200/75'
                      : theme === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  {service.description}
                </p>

                {/* Deliverables Checklist */}
                <div
                  className={`space-y-1.5 pt-2.5 border-t ${
                    theme === 'orange'
                      ? 'border-orange-950'
                      : 'border-slate-100 dark:border-slate-800'
                  }`}
                >
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-medium">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          theme === 'orange' ? 'text-orange-400' : 'text-emerald-500'
                        }`}
                      />
                      <span
                        className={
                          theme === 'orange'
                            ? 'text-amber-100/90'
                            : theme === 'dark'
                            ? 'text-slate-200'
                            : 'text-slate-700'
                        }
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Contact Action */}
              <div
                className={`pt-3.5 mt-3.5 border-t flex items-center justify-between ${
                  theme === 'orange'
                    ? 'border-orange-950'
                    : 'border-slate-100 dark:border-slate-800'
                }`}
              >
                <span
                  className={`text-[11px] font-semibold ${
                    theme === 'orange'
                      ? 'text-amber-400/60'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  100% Quality Guaranteed
                </span>
                <a
                  href="#/contact"
                  className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider hover:underline group-hover:translate-x-1 transition-transform ${
                    theme === 'orange'
                      ? 'text-orange-400'
                      : 'text-blue-600 dark:text-cyan-400'
                  }`}
                >
                  <span>Request Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
