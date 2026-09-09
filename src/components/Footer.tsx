import React from 'react';
import { Link } from 'react-router-dom';
import { FileSpreadsheet, ArrowUp, Mail, MapPin } from 'lucide-react';
import { PersonalInfo } from '../types/portfolio';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  personalInfo: PersonalInfo;
}

const footerLinks = [
  { name: 'HOME', path: '/' },
  { name: 'ABOUT', path: '/about' },
  { name: 'SKILLS', path: '/skills' },
  { name: 'SERVICES', path: '/services' },
  { name: 'WORK', path: '/work' },
  { name: 'EXPERIENCE', path: '/experience' },
  { name: 'CONTACT', path: '/contact' },
];

export const Footer: React.FC<FooterProps> = ({ personalInfo }) => {
  const { theme } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={`py-6 sm:py-8 border-t transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-[#05080f] text-slate-300 border-slate-800'
          : theme === 'orange'
          ? 'bg-[#0c0905] text-amber-200/80 border-orange-950'
          : 'bg-slate-100 text-slate-600 border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col md:flex-row items-center justify-between gap-4 pb-4 sm:pb-5 border-b ${
            theme === 'orange'
              ? 'border-orange-950'
              : theme === 'dark'
              ? 'border-slate-800'
              : 'border-slate-200'
          }`}
        >
          {/* Brand Monogram - Link to Admin Panel */}
          <Link to="/admin" className="flex items-center gap-3 group" title="🛡️ Admin Panel">
            <div
              className={`w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold shadow-sm transition-colors ${
                theme === 'orange'
                  ? 'bg-orange-600 group-hover:bg-orange-500'
                  : 'bg-blue-600 group-hover:bg-blue-500'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <span
                className={`text-sm font-black tracking-tight transition-colors ${
                  theme === 'orange'
                    ? 'text-white group-hover:text-orange-400'
                    : theme === 'dark'
                    ? 'text-white group-hover:text-blue-400'
                    : 'text-slate-950 group-hover:text-blue-600'
                }`}
              >
                {personalInfo.name}
              </span>
              <p
                className={`text-[10px] uppercase tracking-widest font-bold ${
                  theme === 'orange'
                    ? 'text-orange-400'
                    : theme === 'dark'
                    ? 'text-cyan-400'
                    : 'text-blue-600'
                }`}
              >
                Professional Data Entry Executive
              </p>
            </div>
          </Link>

          {/* Quick Nav Links (Individual Pages) */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`transition-colors ${
                  theme === 'orange'
                    ? 'hover:text-orange-400'
                    : 'hover:text-blue-600 dark:hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Scroll to Top */}
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top of page"
            className={`p-2.5 rounded-xl border transition-all group ${
              theme === 'orange'
                ? 'border-orange-900/70 bg-[#1a1209] hover:bg-orange-950 text-amber-200 hover:text-white'
                : theme === 'dark'
                ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white'
                : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-xs'
            }`}
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        <div
          className={`pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium ${
            theme === 'orange'
              ? 'text-stone-400'
              : theme === 'dark'
              ? 'text-slate-400'
              : 'text-slate-600'
          }`}
        >
          <p>
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved. Accuracy &amp; Confidentiality Guaranteed.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <MapPin
                className={`w-3 h-3 ${
                  theme === 'orange' ? 'text-orange-400' : 'text-blue-600 dark:text-cyan-400'
                }`}
              />
              {personalInfo.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail
                className={`w-3 h-3 ${
                  theme === 'orange' ? 'text-orange-400' : 'text-blue-600 dark:text-cyan-400'
                }`}
              />
              {personalInfo.email}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
