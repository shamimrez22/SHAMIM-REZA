import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { DualSlidersSection } from '../components/DualSlidersSection';
import { Statistics } from '../components/Statistics';
import { PersonalInfo } from '../types/portfolio';
import { useTheme } from '../context/ThemeContext';
import { services, skills, sampleWorkProjects } from '../data/portfolioData';
import {
  ArrowRight,
  CheckCircle2,
  Table,
  Layers,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  FileCheck,
  Send,
} from 'lucide-react';

interface HomePageProps {
  personalInfo: PersonalInfo;
  onUpdatePhoto?: (url: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ personalInfo }) => {
  const { theme } = useTheme();

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero personalInfo={personalInfo} />

      {/* 2. Garments IE Reports & 5S Dual Sliders Section */}
      <DualSlidersSection />

      {/* 3. Featured Services Overview */}
      <section
        className={`py-20 section-transition border-t ${
          theme === 'dark'
            ? 'bg-[#0f172a] border-slate-800 text-slate-100'
            : theme === 'orange'
            ? 'bg-[#140d07] border-orange-950/80 text-amber-50'
            : 'bg-slate-50 border-slate-200 text-slate-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-2 border ${
                  theme === 'orange'
                    ? 'text-orange-400 bg-orange-500/10 border-orange-500/20'
                    : 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20'
                }`}
              >
                WHAT I DELIVER
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                FEATURED SERVICES
              </h2>
              <p
                className={`text-sm mt-2 max-w-xl font-medium ${
                  theme === 'orange'
                    ? 'text-amber-200/80'
                    : theme === 'dark'
                    ? 'text-slate-300'
                    : 'text-slate-600'
                }`}
              >
                High-precision data processing, spreadsheet modeling, and administrative support.
              </p>
            </div>

            <Link
              to="/services"
              className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:underline group ${
                theme === 'orange' ? 'text-orange-400' : 'text-blue-600 dark:text-cyan-400'
              }`}
            >
              <span>View All Services &amp; Methodology</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.slice(0, 3).map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  theme === 'orange'
                    ? 'bg-[#1c120a]/90 border-orange-900/60 hover:border-orange-500/60 shadow-lg'
                    : theme === 'dark'
                    ? 'bg-slate-900/90 border-slate-700/80 hover:border-blue-500/50 shadow-lg'
                    : 'bg-white border-slate-200 hover:border-blue-500 shadow-md shadow-slate-200/50'
                }`}
              >
                <div>
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border ${
                      theme === 'orange'
                        ? 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                        : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-cyan-400'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black tracking-tight mb-2">{service.title}</h3>
                  <p
                    className={`text-xs leading-relaxed mb-4 font-medium ${
                      theme === 'orange'
                        ? 'text-amber-200/75'
                        : theme === 'dark'
                        ? 'text-slate-300'
                        : 'text-slate-600'
                    }`}
                  >
                    {service.description}
                  </p>
                </div>

                <div
                  className={`pt-4 border-t flex items-center justify-between text-xs ${
                    theme === 'orange'
                      ? 'border-orange-950 text-amber-300/70'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <span className="font-mono text-[11px] font-semibold">
                    {service.deliverables.length} Deliverables Included
                  </span>
                  <Link
                    to="/services"
                    className={`font-bold hover:underline ${
                      theme === 'orange' ? 'text-orange-400' : 'text-blue-600 dark:text-cyan-400'
                    }`}
                  >
                    Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Top Skills Snapshot */}
      <section
        className={`py-20 section-transition border-t ${
          theme === 'dark'
            ? 'bg-[#0b1120] border-slate-800 text-slate-100'
            : theme === 'orange'
            ? 'bg-[#0c0905] border-orange-950 text-amber-50'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-2 border ${
                  theme === 'orange'
                    ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                    : 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
                }`}
              >
                CORE PROFICIENCIES
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                PRIMARY SKILLS &amp; TOOLS
              </h2>
              <p
                className={`text-sm mt-2 max-w-xl font-medium ${
                  theme === 'orange'
                    ? 'text-amber-200/80'
                    : theme === 'dark'
                    ? 'text-slate-300'
                    : 'text-slate-600'
                }`}
              >
                15 specialized technical skills across spreadsheets, document conversion, and database administration.
              </p>
            </div>

            <Link
              to="/skills"
              className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:underline group ${
                theme === 'orange' ? 'text-orange-400' : 'text-blue-600 dark:text-cyan-400'
              }`}
            >
              <span>Explore All 15 Skills &amp; Tools Suite</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {skills.slice(0, 6).map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className={`p-4 rounded-xl border text-center transition-all ${
                  theme === 'orange'
                    ? 'bg-[#181109]/90 border-orange-950 hover:border-orange-500/50'
                    : theme === 'dark'
                    ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50'
                    : 'bg-slate-50 border-slate-200 hover:border-blue-500 shadow-sm'
                }`}
              >
                <div
                  className={`text-xl font-black mb-1 ${
                    theme === 'orange' ? 'text-orange-400' : 'text-blue-600 dark:text-cyan-400'
                  }`}
                >
                  {skill.proficiency}%
                </div>
                <div className="text-xs font-bold truncate">{skill.name}</div>
                <div
                  className={`text-[10px] mt-1 uppercase font-semibold tracking-wider ${
                    theme === 'orange' ? 'text-amber-400/70' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {skill.category}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Sample Work Preview Banner */}
      <section
        className={`py-20 section-transition border-t ${
          theme === 'dark'
            ? 'bg-[#0f172a] border-slate-800 text-slate-100'
            : theme === 'orange'
            ? 'bg-[#140d07] border-orange-950/80 text-amber-50'
            : 'bg-slate-50 border-slate-200 text-slate-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-2 border ${
                  theme === 'orange'
                    ? 'text-orange-400 bg-orange-500/10 border-orange-500/20'
                    : 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20'
                }`}
              >
                WORK ARTIFACTS
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                SAMPLE WORK PREVIEW
              </h2>
              <p
                className={`text-sm mt-2 max-w-xl font-medium ${
                  theme === 'orange'
                    ? 'text-amber-200/80'
                    : theme === 'dark'
                    ? 'text-slate-300'
                    : 'text-slate-600'
                }`}
              >
                Inspected datasets, audit reports, and converted spreadsheets.
              </p>
            </div>

            <Link
              to="/work"
              className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:underline group ${
                theme === 'orange' ? 'text-orange-400' : 'text-blue-600 dark:text-cyan-400'
              }`}
            >
              <span>Inspect All Work Samples &amp; Data Sets</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleWorkProjects.slice(0, 2).map((project) => (
              <div
                key={project.id}
                className={`p-6 rounded-2xl border transition-all ${
                  theme === 'orange'
                    ? 'bg-[#1c120a]/90 border-orange-900/60 hover:border-orange-500/40 shadow-lg'
                    : theme === 'dark'
                    ? 'bg-slate-900/90 border-slate-700/80 hover:border-blue-500/40 shadow-lg'
                    : 'bg-white border-slate-200 hover:border-blue-400 shadow-md shadow-slate-200/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      theme === 'orange'
                        ? 'bg-orange-500/15 text-orange-400'
                        : 'bg-blue-500/10 text-blue-600 dark:text-cyan-400'
                    }`}
                  >
                    {project.category}
                  </span>
                  <Table className="w-4 h-4 text-stone-400" />
                </div>
                <h3 className="text-lg font-black tracking-tight mb-2">{project.title}</h3>
                <p
                  className={`text-xs leading-relaxed mb-4 font-medium ${
                    theme === 'orange'
                      ? 'text-amber-200/75'
                      : theme === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  {project.description}
                </p>
                <Link
                  to="/work"
                  className={`inline-flex items-center gap-1.5 text-xs font-bold hover:underline ${
                    theme === 'orange' ? 'text-orange-400' : 'text-blue-600 dark:text-cyan-400'
                  }`}
                >
                  <span>Open Interactive Spreadsheet Viewer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Quick Multi-Page Navigation Hub / CTA */}
      <section
        className={`py-16 border-t ${
          theme === 'orange'
            ? 'bg-gradient-to-r from-[#1c120a] via-[#140d07] to-[#1e140b] border-orange-950 text-white'
            : theme === 'dark'
            ? 'bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 border-slate-800 text-white'
            : 'bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50/50 border-slate-200 text-slate-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <span
                className={`text-xs font-extrabold uppercase tracking-widest block mb-1 ${
                  theme === 'orange' ? 'text-orange-400' : 'text-blue-600 dark:text-cyan-400'
                }`}
              >
                SEPARATE DEDICATED PORTFOLIO SECTIONS
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                Explore The Complete Professional Portfolio
              </h3>
              <p
                className={`text-xs sm:text-sm mt-2 max-w-xl leading-relaxed font-medium ${
                  theme === 'orange'
                    ? 'text-amber-200/80'
                    : theme === 'dark'
                    ? 'text-slate-300'
                    : 'text-slate-600'
                }`}
              >
                Browse detailed information on dedicated pages: career history, 15 technical skills, interactive spreadsheet tables, formal credentials, and direct contact forms.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/about"
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border shadow-xs ${
                  theme === 'orange'
                    ? 'bg-[#22170d] hover:bg-orange-950 text-white border-orange-900/60'
                    : theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                }`}
              >
                About Me
              </Link>
              <Link
                to="/skills"
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border shadow-xs ${
                  theme === 'orange'
                    ? 'bg-[#22170d] hover:bg-orange-950 text-white border-orange-900/60'
                    : theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                }`}
              >
                Skills &amp; Tools
              </Link>
              <Link
                to="/services"
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border shadow-xs ${
                  theme === 'orange'
                    ? 'bg-[#22170d] hover:bg-orange-950 text-white border-orange-900/60'
                    : theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                }`}
              >
                Services &amp; Process
              </Link>
              <Link
                to="/work"
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border shadow-xs ${
                  theme === 'orange'
                    ? 'bg-[#22170d] hover:bg-orange-950 text-white border-orange-900/60'
                    : theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                }`}
              >
                Sample Work
              </Link>
              <Link
                to="/experience"
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border shadow-xs ${
                  theme === 'orange'
                    ? 'bg-[#22170d] hover:bg-orange-950 text-white border-orange-900/60'
                    : theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                }`}
              >
                Experience &amp; Certs
              </Link>
              <Link
                to="/contact"
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-colors shadow-md ${
                  theme === 'orange'
                    ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/30'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
                }`}
              >
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Key Professional Statistics (Moved to the very bottom as requested) */}
      <Statistics />
    </div>
  );
};
