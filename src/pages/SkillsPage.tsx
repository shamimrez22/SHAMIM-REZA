import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Skills } from '../components/Skills';
import { Tools } from '../components/Tools';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, CheckCircle2, Cpu } from 'lucide-react';

export const SkillsPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="pt-16">
      {/* Page Header */}
      <div
        className={`py-3 sm:py-3.5 border-b ${
          theme === 'dark'
            ? 'bg-[#090e1a] border-slate-800 text-slate-100'
            : theme === 'orange'
            ? 'bg-[#140d07] border-orange-950 text-amber-50'
            : 'bg-[#f1f5f9] border-slate-200 text-slate-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center gap-2 text-[11px] font-semibold mb-1 font-mono ${
              theme === 'orange' ? 'text-orange-400' : 'text-blue-500'
            }`}
          >
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className={theme === 'orange' ? 'text-amber-300/70' : 'text-slate-400'}>Skills &amp; Tools</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
            SKILLS &amp; TOOLS
          </h1>
          <p
            className={`text-xs sm:text-sm mt-0.5 max-w-2xl leading-normal ${
              theme === 'orange'
                ? 'text-amber-200/80'
                : theme === 'dark'
                ? 'text-slate-300'
                : 'text-slate-600'
            }`}
          >
            Comprehensive breakdown of 15 data processing proficiencies, formula modeling, and daily software suites.
          </p>
        </div>
      </div>

      {/* 15 Skills Component with Category Filters */}
      <Skills />

      {/* Tools & Software Suites */}
      <Tools />

      {/* CTA to Sample Work */}
      <section
        className={`py-5 sm:py-6 border-t ${
          theme === 'dark'
            ? 'bg-[#0b1120] border-slate-800 text-white'
            : theme === 'orange'
            ? 'bg-[#0c0905] border-orange-950 text-amber-50'
            : 'bg-slate-50 border-slate-200 text-slate-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-black tracking-tight">See these skills in real projects</h3>
            <p
              className={`text-xs mt-1 font-medium ${
                theme === 'orange'
                  ? 'text-amber-200/70'
                  : theme === 'dark'
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              Inspect sanitized spreadsheets, OCR conversions, and database audits in my Sample Work gallery.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/work"
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-colors shadow-sm ${
                theme === 'orange'
                  ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/30'
                  : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              Inspect Sample Work →
            </Link>
            <Link
              to="/services"
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-colors ${
                theme === 'orange'
                  ? 'border-orange-900/70 bg-[#1f140a] hover:bg-orange-950 text-amber-200'
                  : theme === 'dark'
                  ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800'
              }`}
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
