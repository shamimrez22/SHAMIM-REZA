import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Briefcase,
  Layers,
  Award,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  FileSpreadsheet,
  Cpu,
  BarChart3,
  ShieldCheck,
  Flame,
  FileDown,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePortfolio } from '../context/PortfolioContext';
import { downloadCVAsWordDoc, downloadElementAsDirectPDF } from '../utils/documentExport';

interface CVDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTemplate?: 'modern' | 'corporate' | 'technical';
}

export const CVDownloadModal: React.FC<CVDownloadModalProps> = ({
  isOpen,
  onClose,
  defaultTemplate = 'modern',
}) => {
  const { theme } = useTheme();
  const {
    personalInfo,
    statistics,
    skills,
    experiences,
    educations,
    certifications,
    downloadCV,
  } = usePortfolio();

  const [activeTemplate, setActiveTemplate] = useState<'modern' | 'corporate' | 'technical'>(
    personalInfo.cvTemplatePreference || defaultTemplate
  );
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      document.body.setAttribute('data-modal-open', 'true');
      document.body.classList.add('modal-open-for-print');
    } else {
      document.body.removeAttribute('data-modal-open');
      document.body.classList.remove('modal-open-for-print');
    }
    return () => {
      document.body.removeAttribute('data-modal-open');
      document.body.classList.remove('modal-open-for-print');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    document.body.setAttribute('data-modal-open', 'true');
    document.body.classList.add('modal-open-for-print');
    window.print();
  };

  const handleDownloadDirectPDF = async () => {
    await downloadElementAsDirectPDF(
      'printable-cv-area',
      `${(personalInfo?.name || 'Shamim_Reza').replace(/\s+/g, '_')}_Curriculum_Vitae_${activeTemplate}.pdf`,
      setIsGeneratingPdf
    );
  };

  const handleDownloadDoc = () => {
    downloadCVAsWordDoc(
      personalInfo,
      statistics,
      skills,
      experiences,
      educations,
      certifications
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:static print:block print:w-full print:bg-white print:overflow-visible modal-print-wrapper">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md print:hidden"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className={`relative w-full max-w-5xl rounded-2xl shadow-2xl border overflow-hidden z-10 my-auto print:border-none print:shadow-none print:w-full print:max-w-none print:m-0 print:p-0 print:bg-white print:text-slate-900 modal-print-container ${
            theme === 'orange'
              ? 'bg-[#150e09] border-orange-800/60 text-amber-50'
              : theme === 'dark'
              ? 'bg-[#0b1220] border-slate-700 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header Bar */}
          <div
            className={`px-5 py-4 border-b flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 backdrop-blur-md print:hidden ${
              theme === 'orange'
                ? 'bg-[#1a120b]/95 border-orange-900/60'
                : theme === 'dark'
                ? 'bg-[#0f172a]/95 border-slate-800'
                : 'bg-slate-50/95 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  theme === 'orange'
                    ? 'bg-orange-600/20 text-orange-400 border border-orange-500/30'
                    : 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                }`}
              >
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      theme === 'orange'
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    PROFESSIONAL RESUME ENGINE
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    AUTO-STANDARDIZED
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black tracking-tight mt-0.5">
                  CURRICULUM VITAE (CV) &amp; RESUME
                </h2>
              </div>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadDirectPDF}
                disabled={isGeneratingPdf}
                title="Download high-resolution direct PDF"
                className="px-3 py-1.5 rounded-xl text-xs font-black text-white flex items-center gap-1.5 transition-all shadow-md bg-rose-600 hover:bg-rose-500 active:scale-95 disabled:opacity-60"
              >
                {isGeneratingPdf ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline">Generating...</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                title="Print or Save as PDF"
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  theme === 'orange'
                    ? 'border-orange-800 bg-orange-950/40 text-orange-300 hover:bg-orange-900/60'
                    : theme === 'dark'
                    ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadDoc}
                title="Download as Word Document (.doc)"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-colors ${
                  theme === 'orange'
                    ? 'bg-orange-600 hover:bg-orange-500'
                    : 'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Word (.doc)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className={`p-2 rounded-xl border transition-colors ${
                  theme === 'orange'
                    ? 'border-orange-800/80 text-amber-200 hover:bg-orange-900/50'
                    : theme === 'dark'
                    ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 max-h-[82vh] overflow-y-auto space-y-5 print:max-h-none print:overflow-visible print:p-0 print:m-0 print:bg-white">
            
            {/* 1. Custom Uploaded CV File Download Card (If available) */}
            {personalInfo.cvUrl && (
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden ${
                  theme === 'orange'
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                    : theme === 'dark'
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider">OFFICIAL UPLOADED CV FILE</span>
                      <span className="px-2 py-0.2 rounded text-[9px] font-black bg-emerald-500 text-slate-950">
                        DIRECT ATTACHMENT
                      </span>
                    </div>
                    <p className="text-xs font-bold mt-0.5">{personalInfo.cvFileName || 'Candidate_CV.pdf'}</p>
                    <p className="text-[10px] opacity-75">
                      Size: {personalInfo.cvFileSize || 'Document File'} • Updated: {personalInfo.cvLastUpdated || 'Recently'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={downloadCV}
                  className="px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Uploaded CV</span>
                </button>
              </div>
            )}

            {/* 2. Template Switcher Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10 print:hidden">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  HIGH QUALITY AUTO-GENERATED TEMPLATES
                </span>
                <p className="text-xs opacity-75">
                  এডমিন প্যানেলে দেওয়া তথ্য অনুযায়ী স্বয়ংক্রিয়ভাবে স্ট্যান্ডার্ড প্রফেশনাল ফরমেটে প্রস্তুতকৃত সিভি।
                </p>
              </div>

              {/* Template Radio Buttons */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/20 border border-white/10 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTemplate('modern')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeTemplate === 'modern'
                      ? theme === 'orange'
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-blue-600 text-white shadow-xs'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  Modern Executive
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTemplate('corporate')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeTemplate === 'corporate'
                      ? theme === 'orange'
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-blue-600 text-white shadow-xs'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  Corporate ATS
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTemplate('technical')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeTemplate === 'technical'
                      ? theme === 'orange'
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-blue-600 text-white shadow-xs'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  Technical IE Matrix
                </button>
              </div>
            </div>

            {/* 3. Live Printable CV Document Container */}
            <div
              id="printable-cv-area"
              className="printable-document bg-white text-slate-900 rounded-xl p-6 sm:p-10 shadow-2xl border border-slate-200 font-sans print:p-0 print:m-0 print:border-none print:shadow-none print:rounded-none print:bg-white print:text-slate-900"
            >
              {/* ========================================================= */}
              {/* TEMPLATE 1: MODERN GARMENTS EXECUTIVE */}
              {/* ========================================================= */}
              {activeTemplate === 'modern' && (
                <div className="space-y-6">
                  {/* Top Header */}
                  <div className="border-b-2 border-slate-900 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={personalInfo.profilePhotoUrl || '/profile-photo.jpg'}
                        alt={personalInfo.name}
                        loading="eager"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover object-top border-2 border-slate-300 shadow-sm shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = '/profile-photo.jpg';
                        }}
                      />
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
                          {personalInfo.name}
                        </h1>
                        <div className="text-sm font-extrabold text-blue-700 tracking-wide uppercase mt-0.5">
                          {personalInfo.title}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 max-w-xl">
                          {personalInfo.headline}
                        </p>
                      </div>
                    </div>

                    {/* Contact details */}
                    <div className="text-xs text-slate-700 space-y-1 md:text-right border-t md:border-t-0 pt-2 md:pt-0 border-slate-200">
                      <div className="flex items-center md:justify-end gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-semibold">{personalInfo.email}</span>
                      </div>
                      <div className="flex items-center md:justify-end gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-semibold">{personalInfo.phone}</span>
                      </div>
                      <div className="flex items-center md:justify-end gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-600" />
                        <span>{personalInfo.location}</span>
                      </div>
                      <div className="flex items-center md:justify-end gap-1.5 text-blue-600">
                        <Linkedin className="w-3.5 h-3.5" />
                        <span>{personalInfo.linkedin}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h3 className="text-xs font-black tracking-wider uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
                      Professional Executive Summary
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-700 text-justify">
                      {personalInfo.intro}
                    </p>
                  </div>

                  {/* Garments IE Benchmarks Table */}
                  <div>
                    <h3 className="text-xs font-black tracking-wider uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
                      Factory IE &amp; Performance Benchmarks
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {statistics.map((st) => (
                        <div key={st.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                          <div className="text-base font-black text-blue-700">
                            {st.value}{st.suffix}
                          </div>
                          <div className="text-[10px] font-black uppercase text-slate-800 tracking-tight">
                            {st.label}
                          </div>
                          <div className="text-[9px] text-slate-500 leading-tight mt-0.5">
                            {st.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Core Skills Matrix */}
                  <div>
                    <h3 className="text-xs font-black tracking-wider uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
                      Core Competencies &amp; Technical Garments Skills
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {skills.map((sk) => (
                        <div key={sk.id} className="flex items-start gap-2 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-900">{sk.name}</span>{' '}
                            <span className="text-[10px] font-semibold text-blue-700">({sk.proficiency}%)</span>
                            <p className="text-[11px] text-slate-600">{sk.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Work Experience */}
                  <div>
                    <h3 className="text-xs font-black tracking-wider uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
                      Professional Work Experience
                    </h3>
                    <div className="space-y-4">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="text-xs">
                          <div className="flex flex-wrap items-center justify-between font-bold text-slate-950">
                            <span className="text-sm font-black text-blue-900">{exp.title}</span>
                            <span className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                              {exp.period}
                            </span>
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 mb-1.5">
                            {exp.company} • {exp.location}
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px] pl-1">
                            {exp.responsibilities.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education & Certifications */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                    <div>
                      <h3 className="text-xs font-black tracking-wider uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
                        Education &amp; Qualifications
                      </h3>
                      <div className="space-y-2">
                        {educations.map((ed) => (
                          <div key={ed.id} className="text-xs">
                            <div className="font-bold text-slate-900">{ed.degree}</div>
                            <div className="text-[11px] text-slate-600">{ed.institution} ({ed.period})</div>
                            <div className="text-[10px] text-slate-500">{ed.details}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-black tracking-wider uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
                        Certifications &amp; Courses
                      </h3>
                      <div className="space-y-2">
                        {certifications.map((c) => (
                          <div key={c.id} className="text-xs">
                            <div className="font-bold text-slate-900">{c.name}</div>
                            <div className="text-[11px] text-slate-600">{c.issuer} • {c.year}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TEMPLATE 2: CORPORATE ATS STANDARD */}
              {/* ========================================================= */}
              {activeTemplate === 'corporate' && (
                <div className="space-y-5 text-slate-900">
                  {/* Clean ATS Centered Header */}
                  <div className="text-center border-b pb-4">
                    <h1 className="text-2xl font-bold uppercase tracking-wide text-slate-950">
                      {personalInfo.name}
                    </h1>
                    <div className="text-xs font-bold text-slate-700 mt-1 uppercase">
                      {personalInfo.title}
                    </div>
                    <div className="text-xs text-slate-600 mt-1.5 flex flex-wrap justify-center gap-x-3 gap-y-1">
                      <span>{personalInfo.location}</span>
                      <span>•</span>
                      <span>Phone: {personalInfo.phone}</span>
                      <span>•</span>
                      <span>Email: {personalInfo.email}</span>
                      <span>•</span>
                      <span>LinkedIn: {personalInfo.linkedin}</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h3 className="text-xs font-bold uppercase border-b pb-0.5 mb-1.5 text-slate-900">
                      Professional Profile
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-700">{personalInfo.intro}</p>
                  </div>

                  {/* Key Skills */}
                  <div>
                    <h3 className="text-xs font-bold uppercase border-b pb-0.5 mb-1.5 text-slate-900">
                      Core Skills &amp; Technical Proficiencies
                    </h3>
                    <div className="text-xs text-slate-700 leading-relaxed">
                      {skills.map((s) => `${s.name} (${s.proficiency}%)`).join(' • ')}
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <h3 className="text-xs font-bold uppercase border-b pb-0.5 mb-2 text-slate-900">
                      Professional Experience
                    </h3>
                    <div className="space-y-3">
                      {experiences.map((e) => (
                        <div key={e.id} className="text-xs">
                          <div className="flex justify-between font-bold">
                            <span>{e.title} - {e.company}</span>
                            <span className="font-normal text-slate-600">{e.period}</span>
                          </div>
                          <div className="text-slate-600 text-[11px] mb-1">{e.location}</div>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                            {e.responsibilities.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h3 className="text-xs font-bold uppercase border-b pb-0.5 mb-1.5 text-slate-900">
                      Education
                    </h3>
                    <div className="space-y-1.5 text-xs">
                      {educations.map((ed) => (
                        <div key={ed.id} className="flex justify-between">
                          <div>
                            <strong>{ed.degree}</strong>, {ed.institution}
                          </div>
                          <span className="text-slate-600 text-[11px]">{ed.period}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <h3 className="text-xs font-bold uppercase border-b pb-0.5 mb-1.5 text-slate-900">
                      Certifications
                    </h3>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                      {certifications.map((c) => (
                        <li key={c.id}>
                          <strong>{c.name}</strong> - {c.issuer} ({c.year})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TEMPLATE 3: TECHNICAL IE ENGINEERING MATRIX */}
              {/* ========================================================= */}
              {activeTemplate === 'technical' && (
                <div className="space-y-5 text-slate-900">
                  {/* Technical Header */}
                  <div className="bg-slate-900 text-white p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
                        GARMENTS IE &amp; ERP TECHNICAL DOSSIER
                      </div>
                      <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                        {personalInfo.name}
                      </h1>
                      <div className="text-xs font-bold text-slate-300 mt-0.5">
                        {personalInfo.title}
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-slate-300 space-y-0.5 md:text-right">
                      <div>TEL: {personalInfo.phone}</div>
                      <div>EMAIL: {personalInfo.email}</div>
                      <div>LOC: {personalInfo.location}</div>
                    </div>
                  </div>

                  {/* Technical Formulas & IE Metrics Box */}
                  <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs space-y-2">
                    <div className="font-mono font-bold text-[11px] text-blue-900 uppercase">
                      STANDARDIZED IE FORMULAS &amp; OPERATIONAL BENCHMARKS:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono text-slate-800">
                      <div className="bg-white p-2 rounded border border-slate-200">
                        • <strong>EFFICIENCY %:</strong> (PRODUCED PCS × STYLE SMV) / (OPERATORS × WORKED MINS) × 100
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-200">
                        • <strong>SAM CALCULATION:</strong> BASIC TIME × (1 + RATING %) × (1 + ALLOWANCES %)
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-200">
                        • <strong>LINE BALANCING EFF:</strong> TOTAL SAM / (WORKSTATIONS × PITCH TIME) × 100
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-200">
                        • <strong>DHU % DEFECT:</strong> (TOTAL DEFECTS / CHECKED PIECES) × 100
                      </div>
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider mb-2 border-b pb-1">
                      Floor Implementation &amp; Production Management Experience
                    </h3>
                    <div className="space-y-3">
                      {experiences.map((e) => (
                        <div key={e.id} className="text-xs border-l-2 border-blue-600 pl-3">
                          <div className="font-bold text-slate-950 flex justify-between">
                            <span>{e.title} @ {e.company}</span>
                            <span className="font-mono text-[11px] text-slate-600">{e.period}</span>
                          </div>
                          <ul className="list-disc list-inside text-slate-700 text-[11px] mt-1 space-y-0.5">
                            {e.responsibilities.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div>
                    <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider mb-2 border-b pb-1">
                      Industrial Engineering Skill Matrix
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {skills.map((s) => (
                        <div key={s.id} className="p-2 border rounded bg-slate-50 flex items-center justify-between">
                          <span className="font-bold">{s.name}</span>
                          <span className="font-mono text-[11px] font-black text-blue-700">{s.proficiency}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education & Credentials */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t text-xs">
                    <div>
                      <div className="font-bold uppercase text-slate-900 mb-1">Academic Credentials</div>
                      {educations.map((ed) => (
                        <div key={ed.id} className="text-[11px] text-slate-700 mb-1">
                          <strong>{ed.degree}</strong> - {ed.institution} ({ed.period})
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="font-bold uppercase text-slate-900 mb-1">Technical Certifications</div>
                      {certifications.map((c) => (
                        <div key={c.id} className="text-[11px] text-slate-700 mb-1">
                          <strong>{c.name}</strong> - {c.issuer} ({c.year})
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer Info Note */}
            <div className="p-4 rounded-xl border bg-black/10 border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-80 print:hidden">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  This CV is automatically compiled from live data entered in the Admin Panel and formatted for top-tier apparel factory recruitment.
                </span>
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg border font-bold text-[11px] shrink-0 hover:bg-white/10"
              >
                Print to PDF (A4)
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
