import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sun, Moon, Flame, FileSpreadsheet, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PersonalInfo } from '../types/portfolio';

interface NavbarProps {
  personalInfo: PersonalInfo;
}

const navLinks = [
  { name: 'HOME', path: '/' },
  { name: 'ABOUT', path: '/about' },
  { name: 'SKILLS', path: '/skills' },
  { name: 'SERVICES', path: '/services' },
  { name: 'WORK', path: '/work' },
  { name: 'EXPERIENCE', path: '/experience' },
  { name: 'CONTACT', path: '/contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ personalInfo }) => {
  const { theme, setTheme, adminMasterTheme } = useTheme();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // Calculate scroll progress percentage on current page
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navThemeBg = () => {
    if (isScrolled) {
      if (theme === 'dark') {
        return 'bg-[#05080f]/95 border-b border-slate-800/90 shadow-xl shadow-black/40 glass-nav py-3';
      }
      if (theme === 'orange') {
        return 'bg-[#0f0b07]/95 border-b border-orange-950/80 shadow-xl shadow-black/50 glass-nav py-3';
      }
      return 'bg-white/95 border-b border-slate-200 shadow-md shadow-slate-200/50 glass-nav py-3';
    }
    if (theme === 'dark') {
      return 'bg-[#05080f]/80 backdrop-blur-md border-b border-slate-800/60 py-4';
    }
    if (theme === 'orange') {
      return 'bg-[#0c0905]/80 backdrop-blur-md border-b border-orange-950/50 py-4';
    }
    return 'bg-white/85 backdrop-blur-md border-b border-slate-200/60 py-4';
  };

  const progressBarGradient =
    theme === 'orange'
      ? 'from-orange-600 via-amber-400 to-orange-500 shadow-orange-500/50'
      : 'from-blue-600 via-cyan-400 to-blue-500 shadow-blue-500/50';

  const brandIconGradient =
    theme === 'orange'
      ? 'from-orange-600 to-amber-500 shadow-orange-600/30'
      : 'from-blue-600 to-cyan-500 shadow-blue-600/30';

  const brandSubtitleClass =
    theme === 'orange'
      ? 'text-orange-400'
      : theme === 'dark'
      ? 'text-cyan-400'
      : 'text-blue-600';

  return (
    <>
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-transparent z-50 pointer-events-none">
        <motion.div
          className={`h-full bg-gradient-to-r ${progressBarGradient} shadow-sm`}
          style={{ width: `${scrollProgress}%` }}
          transition={{ ease: 'easeOut', duration: 0.1 }}
        />
      </div>

      {/* Sticky Navigation Bar */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${navThemeBg()}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo - Direct Gateway to Admin Panel ("LOGOTO CLICK KORLEI ADMIN PANEL DHUKBE") */}
          <Link
            to="/admin"
            className="flex items-center gap-2.5 group cursor-pointer"
            id="nav-brand-link"
            title="🛡️ Admin Panel (লোগোতে ক্লিক করে সরাসরি অ্যাডমিন প্যানেলে প্রবেশ করুন)"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${brandIconGradient} flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all overflow-hidden border border-white/10`}
            >
              <img
                src={personalInfo.profilePhotoUrl || '/profile-photo.jpg'}
                alt={personalInfo.name}
                loading="eager"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.currentTarget.src = '/profile-photo.jpg';
                }}
              />
            </div>

            <div className="flex flex-col">
              <span
                className={`text-base font-extrabold tracking-tight transition-colors ${
                  theme === 'dark'
                    ? 'text-white group-hover:text-cyan-300'
                    : theme === 'orange'
                    ? 'text-white group-hover:text-orange-300'
                    : 'text-slate-950 group-hover:text-blue-600'
                }`}
              >
                {personalInfo.name}
              </span>
              <span className={`text-[10px] font-bold tracking-wider uppercase ${brandSubtitleClass}`}>
                Data Entry Executive
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              let linkClasses = '';
              if (isActive) {
                if (theme === 'dark') {
                  linkClasses = 'text-white bg-slate-800/90 border border-slate-700/70 shadow-xs';
                } else if (theme === 'orange') {
                  linkClasses = 'text-amber-200 bg-orange-950/70 border border-orange-800/70 shadow-xs';
                } else {
                  linkClasses = 'text-blue-700 bg-blue-50 border border-blue-200/80 shadow-xs';
                }
              } else {
                if (theme === 'dark') {
                  linkClasses = 'text-slate-300 hover:text-white hover:bg-slate-800/70';
                } else if (theme === 'orange') {
                  linkClasses = 'text-stone-300 hover:text-white hover:bg-orange-950/50';
                } else {
                  linkClasses = 'text-slate-700 hover:text-slate-950 hover:bg-slate-100';
                }
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`px-3.5 py-1.5 text-xs font-bold tracking-wider transition-all relative rounded-lg ${linkClasses}`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full ${
                        theme === 'orange' ? 'bg-orange-500' : 'bg-blue-500'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area: 3-Theme Switcher + Contact CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 3-Theme Switcher: Black (Dark) | White (Light) | Orange */}
            <div
              className={`flex items-center p-1 rounded-xl border transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700/80 shadow-xs'
                  : theme === 'orange'
                  ? 'bg-[#181109] border-orange-900/70 shadow-xs'
                  : 'bg-slate-100 border-slate-300/80 shadow-xs'
              }`}
              role="group"
              aria-label="Theme Selector"
            >
              {/* Black / Dark Theme */}
              <button
                type="button"
                onClick={() => setTheme('dark')}
                id="btn-theme-black"
                title="Black Theme (Dark)"
                aria-pressed={theme === 'dark'}
                className={`px-2 sm:px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px] font-bold transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-white shadow-xs border border-slate-600/60'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-sky-400' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">Black</span>
              </button>

              {/* White / Light Theme */}
              <button
                type="button"
                onClick={() => setTheme('light')}
                id="btn-theme-white"
                title="White Theme (Light)"
                aria-pressed={theme === 'light'}
                className={`px-2 sm:px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px] font-bold transition-all ${
                  theme === 'light'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">White</span>
              </button>

              {/* Orange Theme */}
              <button
                type="button"
                onClick={() => setTheme('orange')}
                id="btn-theme-orange"
                title="Orange Theme"
                aria-pressed={theme === 'orange'}
                className={`px-2 sm:px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px] font-bold transition-all ${
                  theme === 'orange'
                    ? 'bg-orange-600 text-white shadow-xs border border-orange-500'
                    : 'text-stone-400 hover:text-orange-400'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${theme === 'orange' ? 'text-amber-200' : 'text-orange-400/70'}`} />
                <span className="hidden sm:inline">Orange</span>
              </button>
            </div>

            {/* Desktop Contact CTA Button */}
            <Link
              to="/contact"
              id="nav-cta-contact"
              className={`hidden lg:inline-flex items-center justify-center px-4 py-2 text-xs font-bold tracking-wide uppercase text-white rounded-lg shadow-sm transition-all active:scale-95 ${
                theme === 'orange'
                  ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/30'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
              }`}
            >
              Hire Me
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="btn-mobile-menu"
              aria-label="Toggle navigation menu"
              className={`md:hidden p-2 rounded-xl border transition-colors ${
                theme === 'dark'
                  ? 'border-slate-800 bg-slate-900 text-slate-200'
                  : theme === 'orange'
                  ? 'border-orange-900/60 bg-[#181109] text-amber-200'
                  : 'border-slate-200 bg-slate-100 text-slate-800'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className={`md:hidden border-b overflow-hidden px-4 py-4 ${
                theme === 'dark'
                  ? 'bg-[#070b14] border-slate-800'
                  : theme === 'orange'
                  ? 'bg-[#120c08] border-orange-950'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col space-y-1.5">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-semibold tracking-wider transition-colors flex items-center justify-between ${
                        isActive
                          ? theme === 'orange'
                            ? 'bg-orange-600/20 text-orange-400 font-bold'
                            : theme === 'dark'
                            ? 'bg-blue-600/20 text-blue-400 font-bold'
                            : 'bg-blue-50 text-blue-600 font-bold'
                          : theme === 'dark'
                          ? 'text-slate-300 hover:bg-slate-800'
                          : theme === 'orange'
                          ? 'text-stone-300 hover:bg-orange-950/50'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{link.name}</span>
                      {isActive && (
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            theme === 'orange' ? 'bg-orange-500' : 'bg-blue-500'
                          }`}
                        />
                      )}
                    </Link>
                  );
                })}

                {/* Mobile Theme Selection Row */}
                <div
                  className={`pt-3 mt-2 border-t flex flex-col gap-2 ${
                    theme === 'dark'
                      ? 'border-slate-800'
                      : theme === 'orange'
                      ? 'border-orange-950'
                      : 'border-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Select Theme
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                        theme === 'dark'
                          ? 'bg-slate-800 text-white border-slate-600'
                          : 'bg-slate-900/50 text-slate-400 border-slate-800'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5 text-sky-400" />
                      <span>Black</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                        theme === 'light'
                          ? 'bg-white text-slate-900 border-slate-300 shadow-xs'
                          : 'bg-slate-200/50 text-slate-600 border-slate-300'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>White</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('orange')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                        theme === 'orange'
                          ? 'bg-orange-600 text-white border-orange-500 shadow-xs'
                          : 'bg-stone-900/50 text-stone-400 border-orange-950'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-200" />
                      <span>Orange</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/40 flex flex-col gap-2">
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full py-2.5 px-3 text-xs font-bold text-center rounded-lg border flex items-center justify-center gap-2 ${
                      theme === 'orange'
                        ? 'border-orange-500/30 text-orange-300 bg-orange-500/10'
                        : 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>🛡️ Admin Panel (মাস্টার কন্ট্রোল)</span>
                  </Link>

                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white rounded-lg shadow-sm ${
                      theme === 'orange' ? 'bg-orange-600' : 'bg-blue-600'
                    }`}
                  >
                    Contact Me
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
