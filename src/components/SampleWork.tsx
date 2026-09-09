import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import { SampleProject } from '../types/portfolio';
import {
  FileSpreadsheet,
  X,
  ExternalLink,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  Table as TableIcon,
  ShieldCheck,
} from 'lucide-react';

export const SampleWork: React.FC = () => {
  const { theme } = useTheme();
  const { sampleWorkProjects } = usePortfolio();
  const [activeSample, setActiveSample] = useState<SampleProject | null>(null);

  return (
    <section
      id="work"
      className={`relative py-4 sm:py-6 section-transition border-t ${
        theme === 'dark'
          ? 'bg-[#0b1120] border-slate-800 text-slate-100'
          : theme === 'orange'
          ? 'bg-[#0c0905] border-orange-950 text-amber-50'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quick Admin Access */}
        <div className="mb-4 flex items-center justify-end">
          <Link
            to="/admin"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
              theme === 'orange'
                ? 'border-orange-500/40 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20'
                : 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-cyan-300 hover:bg-blue-500/20'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Add / Manage Work Samples in Admin</span>
          </Link>
        </div>

        {/* Sample Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {sampleWorkProjects.map((project: SampleProject, index: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 38 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                theme === 'orange'
                  ? 'bg-[#181109]/95 border-orange-900/60 hover:border-orange-500/60 shadow-xl shadow-black/40'
                  : theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700/80 hover:border-blue-500/50 shadow-xl shadow-black/30'
                  : 'bg-slate-50 border-slate-200 hover:border-blue-500 shadow-md shadow-slate-200/50'
              }`}
            >
              <div>
                {/* Category & Preview Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border ${
                      theme === 'orange'
                        ? 'bg-orange-950/80 text-orange-400 border-orange-800/60'
                        : 'bg-blue-500/10 text-blue-600 dark:text-cyan-400 border-blue-500/20'
                    }`}
                  >
                    {project.category}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      theme === 'orange'
                        ? 'bg-[#25180d] text-amber-300 group-hover:text-orange-400'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-cyan-400'
                    }`}
                  >
                    <TableIcon className="w-4 h-4" />
                  </div>
                </div>

                {/* Project Title */}
                <h3
                  className={`text-xl font-black tracking-tight mb-2.5 transition-colors ${
                    theme === 'orange'
                      ? 'text-white group-hover:text-orange-400'
                      : theme === 'dark'
                      ? 'text-white group-hover:text-cyan-300'
                      : 'text-slate-950 group-hover:text-blue-600'
                  }`}
                >
                  {project.title}
                </h3>

                {/* Short Description */}
                <p
                  className={`text-xs sm:text-sm leading-relaxed mb-6 font-medium ${
                    theme === 'orange'
                      ? 'text-amber-200/75'
                      : theme === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  {project.description}
                </p>

                {/* Tools Used Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tools.map((tool, tIdx) => (
                    <span
                      key={tIdx}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                        theme === 'orange'
                          ? 'bg-[#22150a] border-orange-950 text-amber-300/80'
                          : theme === 'dark'
                          ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* VIEW SAMPLE Button */}
              <button
                type="button"
                onClick={() => setActiveSample(project)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm ${
                  theme === 'orange'
                    ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/30'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
                }`}
              >
                <span>VIEW SAMPLE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}

          {/* Explicitly Requested Placeholder Card: "ADD YOUR SAMPLE HERE" */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: 0.5 }}
            className={`p-6 sm:p-7 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center ${
              theme === 'orange'
                ? 'border-orange-900/60 bg-[#140d07]/60 text-amber-200/80 hover:border-orange-500'
                : theme === 'dark'
                ? 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-blue-500/50'
                : 'border-slate-300 bg-slate-50/80 text-slate-700 hover:border-blue-500'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                theme === 'orange'
                  ? 'bg-orange-500/15 text-orange-400'
                  : 'bg-blue-500/10 text-blue-600 dark:text-cyan-400'
              }`}
            >
              <PlusCircle className="w-6 h-6" />
            </div>
            <h4
              className={`text-base font-black tracking-tight uppercase mb-1 ${
                theme === 'dark' || theme === 'orange' ? 'text-white' : 'text-slate-950'
              }`}
            >
              ADD YOUR SAMPLE HERE
            </h4>
            <p
              className={`text-xs max-w-[220px] mb-4 font-medium ${
                theme === 'orange'
                  ? 'text-amber-200/70'
                  : theme === 'dark'
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              Add your client case studies, custom macro spreadsheets, or data audits to portfolioData.ts
            </p>
            <span
              className={`text-[10px] uppercase tracking-widest font-mono font-bold ${
                theme === 'orange' ? 'text-orange-400' : 'text-blue-600 dark:text-cyan-400'
              }`}
            >
              SAMPLE SLOT READY
            </span>
          </motion.div>
        </div>

      </div>

      {/* Interactive Sample View Modal */}
      <AnimatePresence>
        {activeSample && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSample(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className={`relative w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden z-10 my-8 ${
                theme === 'orange'
                  ? 'bg-[#150e08] border-orange-950 text-amber-50'
                  : theme === 'dark'
                  ? 'bg-slate-900 border-slate-700 text-slate-100'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Modal Header */}
              <div
                className={`p-5 sm:p-6 border-b flex items-center justify-between ${
                  theme === 'orange'
                    ? 'border-orange-950'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl text-white flex items-center justify-center ${
                      theme === 'orange' ? 'bg-orange-600' : 'bg-blue-600'
                    }`}
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest ${
                        theme === 'orange' ? 'text-orange-400' : 'text-blue-500'
                      }`}
                    >
                      LIVE SAMPLE PREVIEW
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                      {activeSample.title}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveSample(null)}
                  className={`p-2 rounded-xl transition-colors ${
                    theme === 'orange'
                      ? 'text-amber-300 hover:text-white hover:bg-orange-950'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <p
                  className={`text-xs sm:text-sm ${
                    theme === 'orange'
                      ? 'text-amber-200/80'
                      : 'text-slate-500 dark:text-slate-300'
                  }`}
                >
                  {activeSample.description}
                </p>

                {/* Metrics Banner */}
                {activeSample.sampleData.metrics && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {activeSample.sampleData.metrics.map((metric, mIdx) => (
                      <div
                        key={mIdx}
                        className={`p-3 rounded-xl border text-left ${
                          theme === 'orange'
                            ? 'bg-orange-950/40 border-orange-900/50'
                            : 'bg-blue-500/10 border-blue-500/20'
                        }`}
                      >
                        <span
                          className={`text-[10px] font-bold uppercase block ${
                            theme === 'orange' ? 'text-amber-400/70' : 'text-slate-400'
                          }`}
                        >
                          {metric.label}
                        </span>
                        <span
                          className={`text-base font-extrabold ${
                            theme === 'orange'
                              ? 'text-orange-400'
                              : 'text-blue-500 dark:text-cyan-400'
                          }`}
                        >
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tabular Dataset Simulation */}
                <div
                  className={`rounded-xl border overflow-hidden shadow-inner ${
                    theme === 'orange'
                      ? 'border-orange-950'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse font-mono">
                      <thead>
                        <tr
                          className={`border-b ${
                            theme === 'orange'
                              ? 'bg-[#221509] border-orange-950 text-amber-200'
                              : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {activeSample.sampleData.headers.map((header, hIdx) => (
                            <th
                              key={hIdx}
                              className="px-4 py-3 font-bold tracking-wider uppercase text-[11px]"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody
                        className={`divide-y ${
                          theme === 'orange'
                            ? 'divide-orange-950/70'
                            : 'divide-slate-100 dark:divide-slate-800'
                        }`}
                      >
                        {activeSample.sampleData.rows.map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            className={`transition-colors ${
                              theme === 'orange'
                                ? 'hover:bg-orange-950/40'
                                : 'hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
                            }`}
                          >
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`px-4 py-2.5 whitespace-nowrap ${
                                  String(cell).includes('✓') || String(cell).includes('Match')
                                    ? 'text-emerald-500 font-bold'
                                    : String(cell).includes('[REMOVED]')
                                    ? 'text-rose-400 italic'
                                    : ''
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Notes */}
                {activeSample.sampleData.notes && (
                  <div
                    className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                      theme === 'orange'
                        ? 'bg-[#1b1108] border-orange-950 text-amber-200/80'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        theme === 'orange' ? 'text-orange-400' : 'text-blue-500'
                      }`}
                    />
                    <span>{activeSample.sampleData.notes}</span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div
                className={`p-4 sm:p-5 border-t flex items-center justify-between ${
                  theme === 'orange'
                    ? 'border-orange-950 bg-[#110b06]'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50'
                }`}
              >
                <span
                  className={`text-xs ${
                    theme === 'orange' ? 'text-amber-400/60' : 'text-slate-400'
                  }`}
                >
                  Verified Sample Artifact
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSample(null)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                    theme === 'orange'
                      ? 'text-amber-200 hover:bg-orange-950'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
