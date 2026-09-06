import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Contact } from '../components/Contact';
import { PersonalInfo } from '../types/portfolio';
import { useTheme } from '../context/ThemeContext';
import { Clock, Shield, CheckCircle2, MessageSquare } from 'lucide-react';

interface ContactPageProps {
  personalInfo: PersonalInfo;
}

export const ContactPage: React.FC<ContactPageProps> = ({ personalInfo }) => {
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
            <span className={theme === 'orange' ? 'text-amber-300/70' : 'text-slate-400'}>Contact</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            CONTACT &amp; INQUIRIES
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
            Direct channels and inquiry form for data entry contracts, spreadsheet development, and ad-hoc administrative support.
          </p>
        </div>
      </div>

      {/* Main Contact Component */}
      <Contact personalInfo={personalInfo} />

      {/* Reassurance & Working Hours Section */}
      <section
        className={`py-16 border-t ${
          theme === 'dark'
            ? 'bg-[#09101f] border-slate-800 text-slate-100'
            : theme === 'orange'
            ? 'bg-[#0a0704] border-orange-950 text-amber-50'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className={`p-6 rounded-2xl border ${
                theme === 'orange'
                  ? 'bg-[#181109]/90 border-orange-900/60 shadow-md'
                  : theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700/80 shadow-md'
                  : 'bg-slate-50 border-slate-200 shadow-sm'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  theme === 'orange'
                    ? 'bg-orange-500/10 text-orange-400'
                    : 'bg-blue-500/10 text-blue-600 dark:text-cyan-400'
                }`}
              >
                <Clock className="w-5 h-5" />
              </div>
              <h4
                className={`text-base font-black tracking-tight mb-1 ${
                  theme === 'dark' || theme === 'orange' ? 'text-white' : 'text-slate-950'
                }`}
              >
                Guaranteed Response
              </h4>
              <p
                className={`text-xs leading-relaxed font-medium ${
                  theme === 'orange'
                    ? 'text-amber-200/80'
                    : theme === 'dark'
                    ? 'text-slate-300'
                    : 'text-slate-600'
                }`}
              >
                All communications and project requests receive a response within 12–24 business hours.
              </p>
            </div>

            <div
              className={`p-6 rounded-2xl border ${
                theme === 'orange'
                  ? 'bg-[#181109]/90 border-orange-900/60 shadow-md'
                  : theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700/80 shadow-md'
                  : 'bg-slate-50 border-slate-200 shadow-sm'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h4
                className={`text-base font-black tracking-tight mb-1 ${
                  theme === 'dark' || theme === 'orange' ? 'text-white' : 'text-slate-950'
                }`}
              >
                Strict Confidentiality
              </h4>
              <p
                className={`text-xs leading-relaxed font-medium ${
                  theme === 'orange'
                    ? 'text-amber-200/80'
                    : theme === 'dark'
                    ? 'text-slate-300'
                    : 'text-slate-600'
                }`}
              >
                Willing to sign non-disclosure agreements (NDAs) prior to reviewing proprietary company data.
              </p>
            </div>

            <div
              className={`p-6 rounded-2xl border ${
                theme === 'orange'
                  ? 'bg-[#181109]/90 border-orange-900/60 shadow-md'
                  : theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700/80 shadow-md'
                  : 'bg-slate-50 border-slate-200 shadow-sm'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  theme === 'orange'
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'bg-cyan-500/10 text-blue-600 dark:text-cyan-400'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4
                className={`text-base font-black tracking-tight mb-1 ${
                  theme === 'dark' || theme === 'orange' ? 'text-white' : 'text-slate-950'
                }`}
              >
                Flexible Engagements
              </h4>
              <p
                className={`text-xs leading-relaxed font-medium ${
                  theme === 'orange'
                    ? 'text-amber-200/80'
                    : theme === 'dark'
                    ? 'text-slate-300'
                    : 'text-slate-600'
                }`}
              >
                Available for hourly freelance tasks, fixed milestone deliveries, or dedicated monthly retainer.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
