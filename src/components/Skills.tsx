import React, { useState } from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { DynamicIcon } from './DynamicIcon';
import { useTheme } from '../context/ThemeContext';
import { SkillItem } from '../types/portfolio';

export const Skills: React.FC = () => {
  const { theme } = useTheme();
  const { skills } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'software' | 'operations'>('all');

  const filteredSkills =
    selectedCategory === 'all'
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  const categories = [
    { id: 'all', label: `All Skills (${skills.length})` },
    { id: 'core', label: 'Garments IE & Production Data' },
    { id: 'software', label: 'Excel & Factory Software' },
    { id: 'operations', label: 'Typing, Mailing & Office IT' },
  ];

  return (
    <section
      id="skills"
      className={`relative py-24 section-transition border-y ${
        theme === 'dark'
          ? 'bg-[#0b1120] border-slate-800 text-slate-100'
          : theme === 'orange'
          ? 'bg-[#0f0b07] border-orange-950 text-amber-50'
          : 'bg-slate-50 border-slate-200 text-slate-900'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div
          className={`absolute top-10 left-1/3 w-80 h-80 rounded-full blur-3xl ${
            theme === 'orange' ? 'bg-orange-700/20' : 'bg-blue-700/20'
          }`}
        />
        <div
          className={`absolute bottom-10 right-1/4 w-80 h-80 rounded-full blur-3xl ${
            theme === 'orange' ? 'bg-amber-600/20' : 'bg-cyan-600/20'
          }`}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header with Scroll Text Reveal */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3 border ${
              theme === 'orange'
                ? 'text-orange-400 bg-orange-500/10 border-orange-500/20'
                : 'text-blue-600 dark:text-cyan-400 bg-blue-500/10 dark:bg-cyan-500/10 border-blue-500/20 dark:border-cyan-500/20'
            }`}
          >
            VERIFIED EXPERTISE
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
            MY PROFESSIONAL SKILLS
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
            Comprehensive technical proficiency across data transcription, spreadsheet engineering,
            format conversion, and executive administrative coordination.
          </motion.p>
        </div>

        {/* Category Filter Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                selectedCategory === cat.id
                  ? theme === 'orange'
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-600/30 scale-105'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25 scale-105'
                  : theme === 'orange'
                  ? 'bg-[#181109] text-amber-200/90 hover:text-white hover:bg-orange-950/80 border border-orange-900/60'
                  : theme === 'dark'
                  ? 'bg-slate-900 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700'
                  : 'bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-300 shadow-xs'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* 15 Animated Skill Cards (Sequential Staggered Scroll Reveal) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill: SkillItem, index: number) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{
                duration: 0.55,
                delay: Math.min((index % 6) * 0.08, 0.4),
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`group relative p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                theme === 'orange'
                  ? 'bg-[#181109]/95 border-orange-900/60 hover:border-orange-500/60 shadow-xl shadow-black/40'
                  : theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700/80 hover:border-cyan-500/50 shadow-xl shadow-black/30'
                  : 'bg-white border-slate-200 hover:border-blue-500 shadow-md shadow-slate-200/60'
              }`}
            >
              {/* Subtle hover background highlight */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  theme === 'orange'
                    ? 'bg-gradient-to-br from-orange-600/10 to-amber-500/10'
                    : 'bg-gradient-to-br from-blue-600/5 to-cyan-500/5'
                }`}
              />

              <div className="relative z-10">
                {/* Card Top: Icon & Proficiency Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      theme === 'orange'
                        ? 'bg-orange-500/15 border border-orange-500/25 text-orange-400 group-hover:scale-110 group-hover:bg-orange-500/25'
                        : 'bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:border-cyan-400/40'
                    }`}
                  >
                    <DynamicIcon name={skill.iconName} className="w-6 h-6" />
                  </div>

                  <span
                    className={`text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-full ${
                      theme === 'orange'
                        ? 'text-amber-300 bg-orange-950/80 border border-orange-800/60'
                        : theme === 'dark'
                        ? 'text-cyan-300 bg-cyan-950/80 border border-cyan-800/60'
                        : 'text-blue-700 bg-blue-50 border border-blue-200'
                    }`}
                  >
                    {skill.proficiency}% Verified
                  </span>
                </div>

                {/* Skill Name */}
                <h3
                  className={`text-lg font-black transition-colors tracking-tight mb-2 ${
                    theme === 'orange'
                      ? 'text-white group-hover:text-orange-400'
                      : theme === 'dark'
                      ? 'text-white group-hover:text-cyan-300'
                      : 'text-slate-950 group-hover:text-blue-600'
                  }`}
                >
                  {skill.name}
                </h3>

                {/* Short Description */}
                <p
                  className={`text-xs sm:text-sm leading-relaxed font-medium ${
                    theme === 'orange'
                      ? 'text-amber-200/75'
                      : theme === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  {skill.description}
                </p>
              </div>

              {/* Bottom Progress Bar */}
              <div
                className={`relative z-10 mt-6 pt-4 border-t ${
                  theme === 'orange'
                    ? 'border-orange-950'
                    : theme === 'dark'
                    ? 'border-slate-800'
                    : 'border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                  <span
                    className={
                      theme === 'orange'
                        ? 'text-amber-300/70'
                        : theme === 'dark'
                        ? 'text-slate-400'
                        : 'text-slate-600'
                    }
                  >
                    Accuracy Standard
                  </span>
                  <span
                    className={`font-mono ${
                      theme === 'orange'
                        ? 'text-orange-400'
                        : theme === 'dark'
                        ? 'text-cyan-400'
                        : 'text-blue-600'
                    }`}
                  >
                    100% Target
                  </span>
                </div>
                <div
                  className={`w-full h-2 rounded-full overflow-hidden ${
                    theme === 'orange'
                      ? 'bg-orange-950/70'
                      : theme === 'dark'
                      ? 'bg-slate-800'
                      : 'bg-slate-100'
                  }`}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.proficiency}%` }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-full rounded-full ${
                      theme === 'orange'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-400'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
