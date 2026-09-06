import React from 'react';
import { motion } from 'motion/react';
import { educations, certifications } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';
import { GraduationCap, Award, CheckCircle, BookOpen } from 'lucide-react';

export const Education: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section
      id="education"
      className={`relative py-24 section-transition border-t ${
        theme === 'dark'
          ? 'bg-[#09101f] border-slate-800 text-slate-100'
          : theme === 'orange'
          ? 'bg-[#0a0704] border-orange-950 text-amber-50'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Scroll Reveal */}
        <div className="text-center max-w-3xl mx-auto mb-16">
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
            QUALIFICATIONS &amp; TRAINING
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
            EDUCATION &amp; CERTIFICATIONS
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
            Formal academic background and ongoing industry certifications verifying spreadsheet prowess and office administration.
          </motion.p>
        </div>

        {/* Dual Grid: Education & Certifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Column 1: Academic Education & Training */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                  theme === 'orange'
                    ? 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                    : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-cyan-400'
                }`}
              >
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3
                className={`text-xl font-black tracking-tight ${
                  theme === 'dark' || theme === 'orange' ? 'text-white' : 'text-slate-950'
                }`}
              >
                Formal Education
              </h3>
            </div>

            {educations.map((edu) => (
              <div
                key={edu.id}
                className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 ${
                  theme === 'orange'
                    ? 'bg-[#181109]/95 border-orange-900/60 hover:border-orange-500/60 shadow-xl shadow-black/40'
                    : theme === 'dark'
                    ? 'bg-slate-900/90 border-slate-700/80 hover:border-blue-500/50 shadow-xl shadow-black/30'
                    : 'bg-slate-50 border-slate-200 hover:border-blue-500 shadow-md shadow-slate-200/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-bold font-mono ${
                      theme === 'orange'
                        ? 'text-orange-400'
                        : 'text-blue-600 dark:text-cyan-400'
                    }`}
                  >
                    {edu.period}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      theme === 'orange'
                        ? 'bg-orange-950 text-amber-300 border border-orange-900/50'
                        : theme === 'dark'
                        ? 'bg-blue-950 text-blue-300'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    Degree
                  </span>
                </div>
                <h4
                  className={`text-lg font-black tracking-tight mb-1 ${
                    theme === 'dark' || theme === 'orange' ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  {edu.degree}
                </h4>
                <p
                  className={`text-xs font-bold mb-3 ${
                    theme === 'orange' ? 'text-amber-300/70' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {edu.institution}
                </p>
                <p
                  className={`text-xs leading-relaxed font-medium ${
                    theme === 'orange'
                      ? 'text-amber-200/80'
                      : theme === 'dark'
                      ? 'text-slate-200'
                      : 'text-slate-700'
                  }`}
                >
                  {edu.details}
                </p>
              </div>
            ))}

            {/* Additional Professional Courses Card */}
            <div
              className={`p-6 rounded-2xl border ${
                theme === 'orange'
                  ? 'bg-[#181109]/90 border-orange-900/60 shadow-md'
                  : theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700/80 shadow-md'
                  : 'bg-slate-50 border-slate-200 shadow-xs'
              }`}
            >
              <div
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-3 ${
                  theme === 'orange'
                    ? 'text-orange-400'
                    : 'text-blue-600 dark:text-cyan-400'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Professional Development &amp; Training</span>
              </div>
              <ul className="space-y-2 text-xs font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle
                    className={`w-3.5 h-3.5 shrink-0 ${
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
                    Advanced Spreadsheet Auditing &amp; Error Handling Masterclass
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle
                    className={`w-3.5 h-3.5 shrink-0 ${
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
                    Executive Virtual Administration &amp; Time Management
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle
                    className={`w-3.5 h-3.5 shrink-0 ${
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
                    Data Protection, GDPR &amp; Document Privacy Protocol Training
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Column 2: Industry Certifications */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                  theme === 'orange'
                    ? 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                    : 'bg-cyan-500/10 border-cyan-500/20 text-blue-600 dark:text-cyan-400'
                }`}
              >
                <Award className="w-5 h-5" />
              </div>
              <h3
                className={`text-xl font-black tracking-tight ${
                  theme === 'dark' || theme === 'orange' ? 'text-white' : 'text-slate-950'
                }`}
              >
                Certifications &amp; Credentials
              </h3>
            </div>

            <div className="space-y-4">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className={`p-6 rounded-2xl border transition-all duration-300 flex items-start justify-between gap-4 ${
                    theme === 'orange'
                      ? 'bg-[#181109]/95 border-orange-900/60 hover:border-orange-500/60 shadow-xl shadow-black/40'
                      : theme === 'dark'
                      ? 'bg-slate-900/90 border-slate-700/80 hover:border-cyan-500/50 shadow-xl shadow-black/30'
                      : 'bg-slate-50 border-slate-200 hover:border-cyan-500 shadow-md shadow-slate-200/50'
                  }`}
                >
                  <div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                        theme === 'orange'
                          ? 'text-orange-400'
                          : 'text-blue-600 dark:text-cyan-400'
                      }`}
                    >
                      {cert.issuer}
                    </span>
                    <h4
                      className={`text-base font-black tracking-tight mb-2 ${
                        theme === 'dark' || theme === 'orange' ? 'text-white' : 'text-slate-950'
                      }`}
                    >
                      {cert.name}
                    </h4>
                    {cert.credentialId && (
                      <span
                        className={`text-[10px] font-mono font-semibold ${
                          theme === 'orange'
                            ? 'text-amber-300/70'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        ID: {cert.credentialId}
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                      theme === 'orange'
                        ? 'bg-[#22150a] border border-orange-950 text-amber-200'
                        : theme === 'dark'
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    {cert.year}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
