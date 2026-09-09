import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import { StatItem } from '../types/portfolio';

// Counting Number Component
const AnimatedCounter: React.FC<{
  targetValue: number;
  suffix: string;
  prefix?: string;
  duration?: number;
}> = ({ targetValue, suffix, prefix = '', duration = 2000 }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-30px' });

  useEffect(() => {
    if (!isInView) {
      setCurrentValue(0);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const updateCounter = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCurrentValue(Math.floor(easeProgress * targetValue));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      } else {
        setCurrentValue(targetValue);
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, targetValue, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {currentValue.toLocaleString()}
      {suffix}
    </span>
  );
};

export const Statistics: React.FC = () => {
  const { theme } = useTheme();
  const { statistics } = usePortfolio();

  return (
    <section
      id="statistics"
      className={`relative py-6 sm:py-8 transition-colors duration-500 border-y ${
        theme === 'dark'
          ? 'bg-[#05080f] border-slate-800 text-white'
          : theme === 'orange'
          ? 'bg-[#0f0b07] border-orange-950 text-amber-50'
          : 'bg-slate-50 border-slate-200 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statistics.map((stat: StatItem, index: number) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`p-4 sm:p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                theme === 'orange'
                  ? 'bg-[#181109]/95 border-orange-900/60 hover:border-orange-500/60 shadow-lg shadow-black/30'
                  : theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700/80 hover:border-blue-500/60 shadow-lg shadow-black/20'
                  : 'bg-white border-slate-200 hover:border-blue-500 shadow-md shadow-slate-200/60'
              }`}
            >
              {/* Large Animated Number */}
              <div
                className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text mb-2 ${
                  theme === 'orange'
                    ? 'bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600'
                    : 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 dark:from-blue-400 dark:via-cyan-300 dark:to-blue-500'
                }`}
              >
                <AnimatedCounter
                  targetValue={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  duration={2200}
                />
              </div>

              {/* Label */}
              <h3
                className={`text-xs sm:text-sm font-black uppercase tracking-wider mb-1 ${
                  theme === 'dark' || theme === 'orange' ? 'text-white' : 'text-slate-900'
                }`}
              >
                {stat.label}
              </h3>

              {/* Description */}
              <p
                className={`text-xs leading-relaxed font-medium ${
                  theme === 'orange'
                    ? 'text-amber-200/75'
                    : theme === 'dark'
                    ? 'text-slate-300'
                    : 'text-slate-600'
                }`}
              >
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
