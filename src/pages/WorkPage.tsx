import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { SampleWork } from '../components/SampleWork';
import { useTheme } from '../context/ThemeContext';
import { FileSpreadsheet, ArrowRight, CheckCircle2 } from 'lucide-react';

export const WorkPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="pt-20">
      {/* Page Header */}
      <div
        className={`py-12 border-b ${
          theme === 'dark'
            ? 'bg-[#090e1a] border-slate-800 text-slate-100'
            : theme === 'orange'
            ? 'bg-[#140d07] border-orange-950 text-amber-50'
            : 'bg-[#f1f5f9] border-slate-200 text-slate-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center gap-2 text-xs font-semibold mb-2 font-mono ${
              theme === 'orange' ? 'text-orange-400' : 'text-blue-500'
            }`}
          >
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className={theme === 'orange' ? 'text-amber-300/70' : 'text-slate-400'}>Sample Work</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            MY SAMPLE WORK
          </h1>
          <p
            className={`text-sm sm:text-base mt-2 max-w-2xl leading-relaxed ${
              theme === 'orange'
                ? 'text-amber-200/80'
                : theme === 'dark'
                ? 'text-slate-300'
                : 'text-slate-600'
            }`}
          >
            Explore interactive spreadsheets, sanitized datasets, formula audits, and document conversion samples.
          </p>
        </div>
      </div>

      {/* Main Sample Work Gallery with Live Modal Preview & "ADD YOUR SAMPLE HERE" card */}
      <SampleWork />

      {/* Collaboration CTA */}
      <section
        className={`py-16 border-t ${
          theme === 'dark'
            ? 'bg-[#0b1120] border-slate-800 text-white'
            : theme === 'orange'
            ? 'bg-[#0c0905] border-orange-950 text-amber-50'
            : 'bg-slate-50 border-slate-200 text-slate-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-black tracking-tight">Need a custom sample or pilot test?</h3>
            <p
              className={`text-xs mt-1 font-medium ${
                theme === 'orange'
                  ? 'text-amber-200/70'
                  : theme === 'dark'
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              Send a test batch of 10–20 records to verify speed, accuracy, and formatting compliance before signing off.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-colors shadow-sm ${
                theme === 'orange'
                  ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/30'
                  : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              Order Pilot Batch / Contact →
            </Link>
            <Link
              to="/experience"
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-colors ${
                theme === 'orange'
                  ? 'border-orange-900/70 bg-[#1f140a] hover:bg-orange-950 text-amber-200'
                  : theme === 'dark'
                  ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800'
              }`}
            >
              Check Experience
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
