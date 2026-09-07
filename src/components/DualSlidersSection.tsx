import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import {
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  Database,
  Flame,
  Calculator,
  CheckCircle2,
} from 'lucide-react';

interface ReportSlideItem {
  id: string;
  name: string;
  bangla: string;
  category: 'ERP' | 'IE' | 'QUALITY' | 'LEAN 5S' | 'PLANNING';
  formula?: string;
  freq: string;
  details: string;
  highlight?: boolean;
}

const reportSlidesList: ReportSlideItem[] = [
  {
    id: 'erp-entry',
    name: 'GARMENTS ERP PRODUCTION DATA ENTRY',
    bangla: 'গার্মেন্টস ইআরপি প্রোডাকশন মডিউল এন্ট্রি',
    category: 'ERP',
    highlight: true,
    formula: 'LIVE ERP SYSTEM POSTING & PRODUCTION MODULE SYNC',
    freq: 'LIVE ERP',
    details: 'কাটিং, সুইং ও ফিনিশিং কার্টুন প্যাকিং ডাটা সরাসরি ফ্যাক্টরি ERP সফটওয়্যারে দ্রুত এন্ট্রি প্রদান।',
  },
  {
    id: 'eff',
    name: 'LINE EFFICIENCY % REPORT',
    bangla: 'লাইনের দৈনিক এফিসিয়েন্সি হিসাব',
    category: 'IE',
    highlight: true,
    formula: 'EFF % = (PRODUCED PCS × STYLE SMV) / (OPERATORS × MINUTES) × 100',
    freq: 'DAILY SHIFT',
    details: 'উৎপাদিত পিস ও এসএমভি দিয়ে অর্জিত মিনিট হিসাব করে লাইনের শতভাগ নির্ভুল এফিসিয়েন্সি বের করা।',
  },
  {
    id: 'dpr',
    name: 'DAILY PRODUCTION REPORT (DPR)',
    bangla: 'দৈনিক প্রোডাকশন রিপোর্ট ও শিফট সামারি',
    category: 'IE',
    highlight: true,
    formula: 'TOTAL OUTPUT VS MASTER TARGET & OVERTIME VARIANCE',
    freq: 'DAILY DISPATCH',
    details: 'ফ্লোরের সকল লাইনের আউটপুট, টার্গেট ভ্যারিয়েন্স ও রি-ওয়ার্কের বিস্তারিত সামারি শিট প্রস্তুত।',
  },
  {
    id: 'erp-wip',
    name: 'ERP BUNDLE CARD & WIP BARCODE TRACKER',
    bangla: 'ইআরপি বান্ডিল কার্ড ও বারকোড ট্র্যাকিং',
    category: 'ERP',
    highlight: true,
    formula: 'BUNDLE TICKET BARCODE SCANNING & SEWING WIP BALANCE',
    freq: 'HOURLY BATCH',
    details: 'কাটিং বান্ডিল কার্ড বারকোড স্ক্যান ও কিউসি পাস পোস্টিং নিশ্চিতকরণ।',
  },
  {
    id: 'hpr',
    name: 'HOURLY PRODUCTION REPORT (HPR)',
    bangla: 'ঘন্টায় ঘন্টায় প্রোডাকশন ট্র্যাকিং',
    category: 'PLANNING',
    highlight: true,
    formula: 'HOURLY TARGET = DAILY SHIFT TARGET / WORKING HOURS',
    freq: 'HOURLY',
    details: 'প্রতি ঘন্টায় উৎপাদিত পিস সংগ্রহ ও লাইনের বোতলনেক তাৎক্ষণিক সমাধান।',
  },
  {
    id: 'smv',
    name: 'SMV / SAM TIME STUDY REPORT',
    bangla: 'এস.এম.ভি ও টাইম স্টাডি মোশন অ্যানালাইসিস',
    category: 'IE',
    formula: 'SAM = BASIC CYCLE TIME × (1 + RATING %) × (1 + ALLOWANCES %)',
    freq: 'STYLE CHANGEOVER',
    details: 'স্টপওয়াচ দিয়ে সেলাই অপারেশনের সাইকেল সময় পরিমাপ ও স্ট্যান্ডার্ড মিনিট ভ্যালু নির্ধারণ।',
  },
  {
    id: 'balance',
    name: 'LINE BALANCING & PITCH DIAGRAM REPORT',
    bangla: 'সুইং লাইন ব্যালান্সিং ও পিচ ডায়াগ্রাম',
    category: 'IE',
    formula: 'BALANCING EFF % = TOTAL SAM / (WORKSTATIONS × PITCH TIME) × 100',
    freq: 'LINE SETUP',
    details: '৪০-৭০ জন অপারেটরের কাজের মধ্যে নিখুঁত ভারসাম্য বজায় রাখা ও অলস সময় দূরীকরণ।',
  },
  {
    id: 'skill',
    name: 'OPERATOR SKILL MATRIX REPORT',
    bangla: 'অপারেটর স্কিল ম্যাট্রিক্স (GRADE A/B/C)',
    category: 'IE',
    formula: 'MULTI-MACHINE OPERATOR SPEED & COMPETENCY INDEX',
    freq: 'WEEKLY AUDIT',
    details: 'সিঙ্গল নিডেল, ওভারলক, ফ্ল্যাটলক ও কানসাই মেশিনে অপারেটরদের দক্ষতা মূল্যায়ন।',
  },
  {
    id: 'erp-order',
    name: 'ERP BUYER ORDER & SHIPMENT REPORT',
    bangla: 'ইআরপি বায়ার অর্ডার ক্যাপাসিটি ও শিপমেন্ট',
    category: 'ERP',
    highlight: true,
    formula: 'BUYER ORDER QTY VS PACKED CARTONS & DISPATCH BALANCE',
    freq: 'DAILY LOG',
    details: 'অর্ডার বুকিংয়ের বিপরীতে কাটিং, সেলাই ও কার্টুন প্যাকিং ব্যালান্স মনিটরিং।',
  },
  {
    id: 'dhu',
    name: 'DHU QUALITY DEFECT & RE-WORK REPORT',
    bangla: 'ডি.এইচ.ইউ কোয়ালিটি রি-ওয়ার্ক রিপোর্ট',
    category: 'QUALITY',
    formula: 'DHU % = (TOTAL DEFECTS FOUND / TOTAL PIECES INSPECTED) × 100',
    freq: 'CONTINUOUS',
    details: 'এন্ড-লাইন কিউসি থেকে স্টিচিং অল্টারের পরিসংখ্যান সংরক্ষণ ও ডিফেক্ট কমানো।',
  },
  {
    id: 'downtime',
    name: 'MACHINE DOWNTIME & PM REPORT',
    bangla: 'মেশিন ডাউনটাইম ও ব্রেকডাউন লগ',
    category: 'PLANNING',
    formula: 'AVAILABILITY % = (TOTAL TIME - DOWNTIME MINUTES) / TOTAL TIME × 100',
    freq: 'DAILY LOG',
    details: 'মেশিন নষ্ট, নিডেল ভাঙা বা বৈদ্যুতিক গোলযোগে অপচয়কৃত সময়ের হিসাব রাখা।',
  },
  {
    id: 'wip',
    name: 'CUTTING TO FINISHING WIP REPORT',
    bangla: 'কাটিং টু ফিনিশিং ডব্লিউ.আই.পি রিপোর্ট',
    category: 'PLANNING',
    formula: 'WIP RATIO = CURRENT UNFINISHED BUNDLES / DAILY OUTPUT',
    freq: 'DAILY',
    details: 'কাটিং থেকে সুইং, ওয়াশিং ও প্যাকিং পর্যন্ত নির্বিঘ্ন বান্ডিল প্রবাহ নিশ্চিতকরণ।',
  },
  {
    id: 'incentive',
    name: 'OPERATOR PERFORMANCE INCENTIVE SHEET',
    bangla: 'অপারেটর ইনসেনটিভ ও বোনাস শিট',
    category: 'IE',
    formula: 'EARNED STANDARD HOURS (ESH) VS CLOCK ATTENDED HOURS (CAH)',
    freq: 'PAYROLL CLOSE',
    details: 'টার্গেটের বেশি উৎপাদনকারী লাইন ও অপারেটরদের বোনাসের সঠিক হিসাব তৈরি।',
  },
  {
    id: 'bulletin',
    name: 'OPERATION BULLETIN (TECH-PACK)',
    bangla: 'গার্মেন্টস অপারেশন বুলেটিন ও গাইড',
    category: 'IE',
    formula: 'SEQUENTIAL OPERATIONS + MACHINE TYPE + TARGET PPH',
    freq: 'PRE-PRODUCTION',
    details: 'টেক-প্যাক অনুযায়ী অপারেশনাল ক্রম, মেশিন টাইপ ও ফোল্ডার/গাইড স্পেসিফিকেশন।',
  },
  {
    id: 'lean-5s',
    name: '5S LEAN AUDIT & VISUAL MANAGEMENT',
    bangla: '৫এস লিন ফ্লোর অডিট ও ভিজ্যুয়াল ম্যানেজমেন্ট',
    category: 'LEAN 5S',
    highlight: true,
    formula: '1S SORT, 2S SET IN ORDER, 3S SHINE, 4S STANDARDIZE, 5S SUSTAIN',
    freq: 'DAILY AUDIT',
    details: 'ফ্লোর থেকে অপ্রয়োজনীয় জিনিস ছাঁটাই (Red Tag), শ্যাডো বোর্ড ও কালার কোডিং।',
  },
];

// Rapid 2.0-second auto-slide interval as requested by user
const SLIDE_DURATION_MS = 2000;

export const DualSlidersSection: React.FC = () => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = reportSlidesList.length;
  const currentReport = reportSlidesList[currentIndex];

  const handleNext = () => {
    setSlideDirection('right');
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setSlideDirection('left');
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Fast auto-sliding effect (2 seconds)
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSlideDirection('right');
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, SLIDE_DURATION_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, totalSlides, currentIndex]);

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'ERP':
        return 'bg-emerald-500 text-slate-950 font-black border border-emerald-400';
      case 'IE':
        return theme === 'orange'
          ? 'bg-orange-500 text-slate-950 font-black border border-orange-400'
          : 'bg-blue-600 text-white font-black border border-blue-400';
      case 'QUALITY':
        return 'bg-purple-500 text-white font-black border border-purple-400';
      case 'LEAN 5S':
        return 'bg-amber-500 text-slate-950 font-black border border-amber-400';
      case 'PLANNING':
        return 'bg-cyan-500 text-slate-950 font-black border border-cyan-400';
      default:
        return 'bg-slate-500 text-white font-bold';
    }
  };

  return (
    <section
      id="report-slide-banner"
      aria-label="IE and ERP Reports Slide Banner"
      className={`border-b relative overflow-hidden py-1.5 sm:py-2 transition-colors duration-300 select-none ${
        theme === 'orange'
          ? 'bg-[#150d07] border-orange-950/80 text-white'
          : theme === 'dark'
          ? 'bg-[#090e1c] border-slate-800 text-white'
          : 'bg-slate-100 border-slate-300 text-slate-900'
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Compact, low-height banner card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`relative rounded-xl border px-3 sm:px-4 py-2 sm:py-2.5 shadow-md backdrop-blur-md overflow-hidden transition-all duration-300 ${
            theme === 'orange'
              ? 'bg-[#1d120a]/95 border-orange-700/50 shadow-orange-950/40'
              : theme === 'dark'
              ? 'bg-[#0f172a]/95 border-slate-700 shadow-black/40'
              : 'bg-white/95 border-slate-300 shadow-slate-200'
          }`}
        >
          {/* Main Content Layout in a single sleek flex container */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
            
            {/* Left: Branding Chip & Slide Tracker */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-black uppercase tracking-wider ${
                  theme === 'orange'
                    ? 'bg-orange-950/80 border-orange-600/50 text-orange-300'
                    : theme === 'dark'
                    ? 'bg-slate-900 border-cyan-500/50 text-cyan-300'
                    : 'bg-blue-50 border-blue-300 text-blue-800'
                }`}
              >
                <Database className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="hidden md:inline">IE &amp; ERP REPORT</span>
                <span className="md:hidden">REPORTS</span>
              </div>

              {/* Slide Counter (e.g. 01/15) */}
              <span
                className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${
                  theme === 'orange'
                    ? 'bg-black/40 border-orange-900/60 text-amber-300'
                    : theme === 'dark'
                    ? 'bg-black/40 border-slate-700 text-cyan-300'
                    : 'bg-slate-100 border-slate-300 text-slate-700'
                }`}
              >
                {String(currentIndex + 1).padStart(2, '0')}/{String(totalSlides).padStart(2, '0')}
              </span>

              {/* Category pill */}
              <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wide ${getCategoryBadgeClass(currentReport.category)}`}>
                {currentReport.category}
              </span>
            </div>

            {/* Middle: Rapidly transitioning report details (Low-height, sleek) */}
            <div className="flex-1 min-w-0 overflow-hidden relative py-0.5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReport.id}
                  initial={{ opacity: 0, y: slideDirection === 'right' ? 8 : -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: slideDirection === 'right' ? -8 : 8 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="w-full flex flex-col justify-center min-w-0"
                >
                  {/* Row 1: Report Name & Bengali subtitle */}
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-xs sm:text-sm font-black uppercase tracking-tight truncate text-balance">
                      {currentReport.name}
                    </span>
                    <span className="opacity-40 text-xs hidden lg:inline">•</span>
                    <span
                      className={`text-[11px] sm:text-xs font-semibold truncate hidden sm:inline ${
                        theme === 'orange'
                          ? 'text-amber-300/95'
                          : theme === 'dark'
                          ? 'text-cyan-300/95'
                          : 'text-blue-700'
                      }`}
                    >
                      {currentReport.bangla}
                    </span>
                  </div>

                  {/* Row 2: Standard Formula or Operational Detail */}
                  <div className="flex items-center gap-2 text-[10px] sm:text-[11px] truncate opacity-75 mt-0.5">
                    {currentReport.formula ? (
                      <span className="font-mono font-bold text-emerald-400 truncate flex items-center gap-1">
                        <Calculator className="w-2.5 h-2.5 shrink-0 opacity-70" />
                        <span className="truncate">{currentReport.formula}</span>
                      </span>
                    ) : (
                      <span className="truncate">{currentReport.details}</span>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Compact Prev, Pause/Play, Next controls + dots */}
            <div className="flex items-center justify-between sm:justify-end gap-1.5 shrink-0 pt-1 sm:pt-0 border-t border-white/5 sm:border-t-0">
              {/* Micro-dot navigation (Active dot highlighted) */}
              <div className="hidden lg:flex items-center gap-1 mr-2">
                {reportSlidesList.map((rep, idx) => (
                  <button
                    key={rep.id}
                    type="button"
                    onClick={() => {
                      setSlideDirection(idx > currentIndex ? 'right' : 'left');
                      setCurrentIndex(idx);
                    }}
                    title={`${idx + 1}. ${rep.name}`}
                    className={`h-1.5 transition-all duration-200 rounded-full ${
                      idx === currentIndex
                        ? theme === 'orange'
                          ? 'w-5 bg-orange-500'
                          : theme === 'dark'
                          ? 'w-5 bg-cyan-400'
                          : 'w-5 bg-blue-600'
                        : 'w-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1 ml-auto sm:ml-0">
                <button
                  type="button"
                  onClick={handlePrev}
                  title="Previous Report"
                  aria-label="Previous Report"
                  className={`p-1 sm:p-1.5 rounded-lg border text-xs transition-colors active:scale-95 flex items-center justify-center ${
                    theme === 'orange'
                      ? 'bg-orange-950/80 border-orange-800 text-orange-300 hover:bg-orange-900'
                      : theme === 'dark'
                      ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-cyan-300'
                      : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  title={isPaused ? 'Play' : 'Pause'}
                  aria-label={isPaused ? 'Play' : 'Pause'}
                  className={`p-1 sm:p-1.5 rounded-lg border text-xs transition-colors active:scale-95 flex items-center justify-center ${
                    theme === 'orange'
                      ? 'bg-orange-950/80 border-orange-800 text-amber-300 hover:bg-orange-900'
                      : theme === 'dark'
                      ? 'bg-slate-900 border-slate-700 text-cyan-300 hover:bg-slate-800'
                      : 'bg-slate-100 border-slate-300 text-blue-700 hover:bg-slate-200'
                  }`}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  title="Next Report"
                  aria-label="Next Report"
                  className={`p-1 sm:p-1.5 rounded-lg border text-xs transition-colors active:scale-95 flex items-center justify-center ${
                    theme === 'orange'
                      ? 'bg-orange-950/80 border-orange-800 text-orange-300 hover:bg-orange-900'
                      : theme === 'dark'
                      ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-cyan-300'
                      : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Micro Visual Time Progress Bar (Fast 2.0s timing) */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5 overflow-hidden">
            <motion.div
              key={`${currentIndex}-${isPaused}`}
              initial={{ width: '0%' }}
              animate={{ width: isPaused ? '0%' : '100%' }}
              transition={{ duration: SLIDE_DURATION_MS / 1000, ease: 'linear' }}
              className={`h-full ${
                theme === 'orange'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-400'
                  : theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-400'
                  : 'bg-gradient-to-r from-blue-500 to-emerald-500'
              }`}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Re-export alias
export const ReportSlideBanner = DualSlidersSection;
