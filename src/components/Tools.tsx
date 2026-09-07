import React from 'react';
import { motion } from 'motion/react';
import { tools } from '../data/portfolioData';
import { DynamicIcon } from './DynamicIcon';
import { useTheme } from '../context/ThemeContext';
import { ToolItem } from '../types/portfolio';
import { Check } from 'lucide-react';

export const Tools: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section
      id="tools"
      className={`relative py-24 section-transition border-t ${
        theme === 'dark'
          ? 'bg-[#09101f] border-slate-800 text-slate-100'
          : theme === 'orange'
          ? 'bg-[#0b0805] border-orange-950 text-amber-50'
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
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3 border ${
              theme === 'orange'
                ? 'text-orange-400 bg-orange-500/10 border-orange-500/20'
                : 'text-blue-600 dark:text-cyan-400 bg-blue-500/10 border-blue-500/20'
            }`}
          >
            SOFTWARE SUITE &amp; PLATFORMS
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
            TOOLS &amp; SOFTWARE
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
            Daily operational mastery of industry-standard spreadsheet engines, cloud collaboration tools, 
            and precision document conversion software.
          </motion.p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool: ToolItem, index: number) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between group ${
                theme === 'orange'
                  ? 'bg-[#181109]/90 border-orange-900/60 hover:border-orange-500/60 shadow-xl shadow-black/40'
                  : theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700/80 hover:border-blue-500/50 shadow-xl shadow-black/30'
                  : 'bg-slate-50 border-slate-200 hover:border-blue-500 shadow-md shadow-slate-200/50'
              }`}
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                      theme === 'orange'
                        ? 'bg-orange-500/15 border-orange-500/25 text-orange-400 group-hover:scale-105 group-hover:bg-orange-600 group-hover:text-white'
                        : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-cyan-400 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white'
                    }`}
                  >
                    <DynamicIcon name={tool.iconName} className="w-6 h-6" />
                  </div>

                  <span
                    className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border ${
                      theme === 'orange'
                        ? 'bg-orange-950/80 text-amber-300 border-orange-800/40'
                        : theme === 'dark'
                        ? 'bg-blue-950/80 text-blue-300 border border-blue-800/40'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {tool.level}
                  </span>
                </div>

                {/* Tool Name & Category */}
                <span
                  className={`text-[11px] font-bold uppercase tracking-widest block mb-1 ${
                    theme === 'orange'
                      ? 'text-amber-400/60'
                      : theme === 'dark'
                      ? 'text-slate-400'
                      : 'text-slate-500'
                  }`}
                >
                  {tool.category}
                </span>
                <h3
                  className={`text-lg font-black tracking-tight mb-2 transition-colors ${
                    theme === 'orange'
                      ? 'text-white group-hover:text-orange-400'
                      : theme === 'dark'
                      ? 'text-white group-hover:text-cyan-300'
                      : 'text-slate-950 group-hover:text-blue-600'
                  }`}
                >
                  {tool.name}
                </h3>
                <p
                  className={`text-xs leading-relaxed mb-4 font-medium ${
                    theme === 'orange'
                      ? 'text-amber-200/70'
                      : theme === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  {tool.description}
                </p>
              </div>

              {/* Feature Bullet Points */}
              <div
                className={`pt-4 border-t space-y-1.5 ${
                  theme === 'orange'
                    ? 'border-orange-950'
                    : theme === 'dark'
                    ? 'border-slate-800'
                    : 'border-slate-200'
                }`}
              >
                {tool.features.map((feature, fIdx) => (
                  <div
                    key={fIdx}
                    className={`flex items-center gap-2 text-[11px] font-medium ${
                      theme === 'orange'
                        ? 'text-amber-200/90'
                        : theme === 'dark'
                        ? 'text-slate-200'
                        : 'text-slate-700'
                    }`}
                  >
                    <Check
                      className={`w-3.5 h-3.5 shrink-0 ${
                        theme === 'orange' ? 'text-orange-400' : 'text-blue-600 dark:text-cyan-400'
                      }`}
                    />
                    <span className="truncate">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
