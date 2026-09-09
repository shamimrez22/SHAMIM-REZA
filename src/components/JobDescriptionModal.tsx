import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Briefcase,
  Printer,
  CheckCircle2,
  Download,
  ShieldCheck,
  FileSpreadsheet,
  Copy,
  Check,
  FileText,
  Sparkles,
  Clock,
  Layers,
  Award,
  FileDown,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePortfolio } from '../context/PortfolioContext';
import {
  downloadJobDescriptionAsWordDoc,
  downloadJobDescriptionAsExcelFile,
  downloadElementAsDirectPDF,
  downloadJobDescriptionAsDirectPDF,
} from '../utils/documentExport';
import { initialJobDescriptionData } from '../data/jobDescriptionData';

interface JobDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTemplate?: 'executive-report' | 'excel-sheet' | 'standard-sop';
}

export const JobDescriptionModal: React.FC<JobDescriptionModalProps> = ({
  isOpen,
  onClose,
  defaultTemplate = 'executive-report',
}) => {
  const { theme } = useTheme();
  const { personalInfo, jobDescriptionData, downloadJobDescription } = usePortfolio();

  const jdData = jobDescriptionData || initialJobDescriptionData;

  const [activeView, setActiveView] = useState<'executive-report' | 'excel-sheet' | 'standard-sop'>(
    defaultTemplate
  );
  const [copied, setCopied] = useState(false);
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

  const handlePrint = (viewOverride?: 'executive-report' | 'excel-sheet' | 'standard-sop') => {
    if (viewOverride && viewOverride !== activeView) {
      setActiveView(viewOverride);
      setTimeout(() => {
        document.body.setAttribute('data-modal-open', 'true');
        document.body.classList.add('modal-open-for-print');
        window.print();
      }, 100);
      return;
    }
    document.body.setAttribute('data-modal-open', 'true');
    document.body.classList.add('modal-open-for-print');
    window.print();
  };

  const handlePrintUploadedJD = () => {
    if (personalInfo.jdUrl) {
      const win = window.open(personalInfo.jdUrl, '_blank');
      if (win) {
        win.focus();
      }
    }
  };

  const activeViewName =
    activeView === 'executive-report'
      ? 'Executive Corporate Report'
      : activeView === 'excel-sheet'
      ? 'Factory Spreadsheet Grid'
      : 'HR Standard SOP';

  const handleDownloadDirectPDF = async () => {
    const elementId = activeView === 'excel-sheet' ? 'printable-jd-spreadsheet' : 'printable-jd-area';
    await downloadElementAsDirectPDF(
      elementId,
      `${(personalInfo?.name || 'Shamim_Reza').replace(/\s+/g, '_')}_IE_Job_Description_${activeView}.pdf`,
      setIsGeneratingPdf,
      () => {
        downloadJobDescriptionAsDirectPDF(
          jdData,
          personalInfo?.name || 'Md. Shamim Reza',
          activeView
        );
      }
    );
  };

  const handleDownloadDoc = () => {
    downloadJobDescriptionAsWordDoc(jdData, personalInfo?.name || 'Md. Shamim Reza');
  };

  const handleDownloadExcel = () => {
    downloadJobDescriptionAsExcelFile(jdData, personalInfo?.name || 'Md. Shamim Reza');
  };

  // Copy table as TSV format so it can be pasted directly into Microsoft Excel or Google Sheets
  const handleCopyExcelTSV = () => {
    const lines: string[] = [];
    lines.push('JOB RESPONSIBILITIES:');
    lines.push('SL#\tRESPONSIBILITY');
    jdData.responsibilities?.forEach((r) => {
      lines.push(`${r.sl}\t${r.text}`);
    });
    lines.push('');
    lines.push('JOB DESCRIPTION:');
    lines.push('SL#\tTASK DESCRIPTION\tTASK REPEAT / DAY\tTASK TAKEN TIME\tTOTAL TASK TIME');
    jdData.dailyTasks?.forEach((t) => {
      lines.push(`${t.sl}\t${t.taskDescription}\t${t.repeatPerDay}\t${t.takenTime}\t${t.totalTime}`);
    });
    lines.push(`\tTOTAL DAILY TASK TIME\t\t\t${jdData.totalDailyMinutes || 530} MIN`);

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const totalMinutes = jdData.totalDailyMinutes || 530;
  const totalHours = (totalMinutes / 60).toFixed(1);

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
                    ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                    : 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      theme === 'orange'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    GARMENTS FACTORY OFFICIAL SPECIFICATION
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    VERIFIED RMG TIME STUDY &amp; ERP LOG
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black tracking-tight mt-0.5">
                  JOB DESCRIPTION &amp; SCOPE OF RESPONSIBILITIES
                </h2>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyExcelTSV}
                title="Copy table formatted for Microsoft Excel / Google Sheets"
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  copied
                    ? 'border-emerald-500 bg-emerald-600/20 text-emerald-400'
                    : theme === 'orange'
                    ? 'border-orange-800 bg-orange-950/40 text-orange-300 hover:bg-orange-900/60'
                    : theme === 'dark'
                    ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy TSV'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadDirectPDF}
                disabled={isGeneratingPdf}
                title="Download direct high-resolution PDF identical to website preview"
                className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white flex items-center gap-1.5 transition-all shadow-md bg-rose-600 hover:bg-rose-500 active:scale-95 disabled:opacity-60"
              >
                {isGeneratingPdf ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating PDF...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5" />
                    <span>Download PDF (.pdf)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadExcel}
                title="Download formatted Microsoft Excel (.xls) file"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-colors shadow-sm bg-emerald-700 hover:bg-emerald-600"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Excel (.xls)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadDoc}
                title="Download formatted Word Document (.doc)"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-colors shadow-sm ${
                  theme === 'orange'
                    ? 'bg-amber-600 hover:bg-amber-500'
                    : 'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Word (.doc)</span>
              </button>

              <button
                type="button"
                onClick={() => handlePrint()}
                title={`Print or Save as PDF (${activeViewName})`}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  theme === 'orange'
                    ? 'border-amber-600 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                    : theme === 'dark'
                    ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-200 hover:bg-cyan-500/25'
                    : 'border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100'
                }`}
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Print JD ({activeViewName})</span>
                <span className="sm:hidden">Print</span>
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
            
            {/* 1. Custom Uploaded Job Description File Download Card (If available) */}
            {personalInfo.jdUrl && (
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden ${
                  theme === 'orange'
                    ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                    : theme === 'dark'
                    ? 'bg-blue-950/30 border-blue-500/40 text-blue-200'
                    : 'bg-blue-50 border-blue-300 text-blue-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg border ${
                    /\.(xlsx|xls|xlsm|csv)$/i.test(personalInfo.jdFileName || '')
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {/\.(xlsx|xls|xlsm|csv)$/i.test(personalInfo.jdFileName || '') ? (
                      <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <FileText className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black uppercase tracking-wider">
                        {/\.(xlsx|xls|xlsm|csv)$/i.test(personalInfo.jdFileName || '')
                          ? 'OFFICIAL EXCEL JOB DESCRIPTION'
                          : 'OFFICIAL UPLOADED JOB DESCRIPTION'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                        /\.(xlsx|xls|xlsm|csv)$/i.test(personalInfo.jdFileName || '')
                          ? 'bg-emerald-400 text-slate-950'
                          : 'bg-amber-500 text-slate-950'
                      }`}>
                        {/\.(xlsx|xls|xlsm|csv)$/i.test(personalInfo.jdFileName || '')
                          ? 'EXCEL SPREADSHEET'
                          : 'DIRECT ATTACHMENT'}
                      </span>
                    </div>
                    <p className="text-xs font-bold mt-0.5 font-mono">{personalInfo.jdFileName || 'Job_Description.xlsx'}</p>
                    <p className="text-[10px] opacity-75">
                      Size: {personalInfo.jdFileSize || 'Document File'} • Updated: {personalInfo.jdLastUpdated || 'Recently'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrintUploadedJD}
                    title="Open / Print this uploaded Job Description file"
                    className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded-xl border flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 ${
                      theme === 'orange'
                        ? 'border-amber-500/40 bg-amber-950/50 text-amber-300 hover:bg-amber-900/60'
                        : 'border-blue-600/40 bg-blue-500/15 text-blue-700 dark:text-blue-300 hover:bg-blue-500/25'
                    }`}
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Print / View File</span>
                  </button>

                  <button
                    type="button"
                    onClick={downloadJobDescription}
                    className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 ${
                      /\.(xlsx|xls|xlsm|csv)$/i.test(personalInfo.jdFileName || '')
                        ? 'bg-emerald-600 hover:bg-emerald-500'
                        : 'bg-amber-600 hover:bg-amber-500'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Uploaded JD File</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. View Switcher Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10 print:hidden">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  JOB SPECIFICATION FORMAT SELECTOR
                </span>
                <p className="text-xs opacity-75">
                  প্রফেশনাল এক্সিকিউটিভ রিপোর্ট, ফ্যাক্টরি স্প্রেডশীট গ্রিড ও এইচআর এসওপি ফরম্যাট
                </p>
              </div>

              {/* View Buttons */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/20 border border-white/10 self-start sm:self-auto flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveView('executive-report')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                    activeView === 'executive-report'
                      ? theme === 'orange'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-blue-600 text-white shadow-xs'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Executive Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('excel-sheet')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                    activeView === 'excel-sheet'
                      ? theme === 'orange'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-blue-600 text-white shadow-xs'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Spreadsheet Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('standard-sop')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                    activeView === 'standard-sop'
                      ? theme === 'orange'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-blue-600 text-white shadow-xs'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>HR SOP Specification</span>
                </button>
              </div>
            </div>

            {/* Active Format Action Banner with Direct Print Option */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-900/30 border border-white/10 print:hidden text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-300">Active Format:</span>
                <span className="px-2.5 py-0.5 rounded-full font-black text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {activeViewName}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold hidden sm:inline">✓ A4 Print-Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePrint(activeView)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print {activeViewName} (A4)</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadDirectPDF}
                  disabled={isGeneratingPdf}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95 disabled:opacity-60"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* VIEW 1: EXECUTIVE CORPORATE REPORT (DEFAULT - BEAUTIFUL & ORGANIZED)      */}
            {/* ========================================================================= */}
            {activeView === 'executive-report' && (
              <div
                id="printable-jd-area"
                className="printable-document bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-2xl border border-slate-200 font-sans print:p-0 print:m-0 print:border-none print:shadow-none print:rounded-none print:bg-white print:text-slate-900 relative overflow-hidden"
              >
                {/* In-Document Format Print Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 mb-5 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 print:hidden">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-[#0f2942] text-white tracking-wider">
                      FORMAT 1: EXECUTIVE CORPORATE REPORT
                    </span>
                    <span className="text-xs text-slate-600 font-medium hidden md:inline">Full Letterhead • Metadata Grid • Responsibilities • Signatures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePrint('executive-report')}
                      className="px-3 py-1.5 text-xs font-black rounded-lg bg-[#0f2942] hover:bg-[#163a5d] text-white flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Print Executive Report (A4)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadDirectPDF}
                      className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1 shadow-xs"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
                {/* Official Letterhead Banner */}
                <div className="border-b-2 border-slate-900 pb-5 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#0f2942] text-white">
                          GARMENTS INDUSTRIAL ENGINEERING &amp; PRODUCTION ERP AUDIT
                        </span>
                        <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          VERIFIED WORK STUDY
                        </span>
                      </div>
                      <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight mt-1.5">
                        {jdData.jobTitle}
                      </h1>
                      <p className="text-xs font-bold text-slate-600 mt-0.5">
                        OFFICIAL FACTORY JOB DESCRIPTION &amp; DAILY TIME-STUDY AUDIT REPORT
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-700 min-w-[210px] space-y-1">
                      <div><span className="text-slate-500 font-medium">Candidate:</span> <strong>{personalInfo.name}</strong></div>
                      <div><span className="text-slate-500 font-medium">Document ID:</span> <strong>IE/RMG/JD-{new Date().getFullYear()}</strong></div>
                      <div><span className="text-slate-500 font-medium">Shift Study:</span> <strong className="text-amber-800">{totalMinutes} MIN (~{totalHours} HRS)</strong></div>
                    </div>
                  </div>
                </div>

                {/* Metadata 4-Box Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">Department</span>
                    <strong className="text-xs text-slate-900 leading-snug block">{jdData.department}</strong>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">Industry Sector</span>
                    <strong className="text-xs text-slate-900 leading-snug block">{jdData.industry}</strong>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">Reporting Authority</span>
                    <strong className="text-xs text-slate-900 leading-snug block">{jdData.reportingTo}</strong>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">Experience &amp; Shift</span>
                    <strong className="text-xs text-slate-900 leading-snug block">{jdData.experienceRequired}</strong>
                  </div>
                </div>

                {/* SECTION 1: JOB RESPONSIBILITIES (UNIFIED TABLE) */}
                <div className="mb-8 avoid-break">
                  <div className="rounded-t-xl bg-[#0f2942] px-5 py-3 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                        1. KEY OPERATIONAL RESPONSIBILITIES &amp; ACCOUNTABILITIES (মূল দায়িত্ব ও কর্মপরিধি)
                      </h2>
                    </div>
                    <span className="text-[11px] font-bold text-amber-300">
                      {jdData.responsibilities?.length || 6} Key Duties
                    </span>
                  </div>

                  <div className="border border-t-0 border-slate-200 rounded-b-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <th className="py-2.5 px-4 w-16 text-center border-r border-slate-200">SL#</th>
                          <th className="py-2.5 px-5">RESPONSIBILITY STATEMENT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {jdData.responsibilities?.map((r, idx) => (
                          <tr key={r.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                            <td className="py-3 px-4 text-center font-bold text-[#0f2942] border-r border-slate-200 bg-slate-50/80">
                              {r.sl}
                            </td>
                            <td className="py-3 px-5 text-slate-800 leading-relaxed font-medium">
                              {r.text}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SECTION 2: DAILY TASK BREAKDOWN & TIME-STUDY LOG */}
                <div className="mb-8 avoid-break">
                  <div className="rounded-t-xl bg-[#0f2942] px-5 py-3 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                        2. DAILY JOB DESCRIPTION &amp; TIME-STUDY WORK LOG (১৪টি নিয়মিত দৈনিক কাজ)
                      </h2>
                    </div>
                    <span className="text-[11px] font-bold text-amber-300 font-mono">
                      TOTAL: {totalMinutes} MIN
                    </span>
                  </div>

                  <div className="border border-t-0 border-slate-200 rounded-b-xl overflow-x-auto shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-center">
                          <th className="py-2.5 px-3 w-12 border-r border-slate-200">SL#</th>
                          <th className="py-2.5 px-4 text-left border-r border-slate-200">CORE TASK DESCRIPTION</th>
                          <th className="py-2.5 px-3 w-28 sm:w-36 border-r border-slate-200">REPEAT / DAY</th>
                          <th className="py-2.5 px-3 w-28 border-r border-slate-200">TASK TIME</th>
                          <th className="py-2.5 px-3 w-28">TOTAL TIME</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {jdData.dailyTasks?.map((t, idx) => (
                          <tr key={t.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                            <td className="py-2.5 px-3 text-center font-bold text-[#0f2942] border-r border-slate-200 bg-slate-50/80">
                              {t.sl}
                            </td>
                            <td className="py-2.5 px-4 font-semibold text-slate-900 border-r border-slate-200">
                              {t.taskDescription}
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-slate-700 border-r border-slate-200">
                              {t.repeatPerDay}
                            </td>
                            <td className="py-2.5 px-3 text-center text-slate-600 font-mono border-r border-slate-200">
                              {t.takenTime}
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-[#0f2942] font-mono">
                              {t.totalTime}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-amber-100/90 font-black border-t-2 border-amber-600 text-slate-950">
                          <td colSpan={4} className="py-3 px-4 text-right uppercase tracking-wider text-amber-950">
                            TOTAL DAILY SHIFT TASK WORK TIME (মোট দৈনিক কর্মসময়):
                          </td>
                          <td className="py-3 px-3 text-center font-black text-amber-900 text-sm font-mono">
                            {totalMinutes} MIN (~{totalHours} HRS)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary Quick Stats Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 text-center text-xs avoid-break">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Total Core Tasks</div>
                    <div className="text-base font-black text-slate-900">{jdData.dailyTasks?.length || 14} Tasks</div>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Shift Working Minutes</div>
                    <div className="text-base font-black text-amber-700">{totalMinutes} Minutes</div>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Total Working Hours</div>
                    <div className="text-base font-black text-slate-900">~{totalHours} Hours / Day</div>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Responsibility Items</div>
                    <div className="text-base font-black text-emerald-700">{jdData.responsibilities?.length || 6} Key Points</div>
                  </div>
                </div>

                {/* Role Purpose & Operational Scope */}
                <div className="mb-8 p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/80 avoid-break">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#0f2942] mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Role Purpose &amp; Operational Objective
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-700 text-justify font-normal">
                    {jdData.rolePurpose}
                  </p>
                </div>

                {/* AUTHORIZATION & APPROVALS BLOCK */}
                <div className="pt-8 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-[10px] font-bold text-slate-600 uppercase avoid-break">
                  <div className="space-y-1">
                    <div className="border-b border-slate-400 w-44 mx-auto mb-2 h-10 flex items-end justify-center pb-1">
                      <span className="text-[11px] font-black text-[#0f2942]">{personalInfo.name}</span>
                    </div>
                    <div className="text-slate-900 font-black">PREPARED BY (IE EXECUTIVE)</div>
                    <div className="text-slate-500 font-normal">IE &amp; Production ERP Executive</div>
                  </div>
                  <div className="space-y-1">
                    <div className="border-b border-slate-400 w-44 mx-auto mb-2 h-10" />
                    <div className="text-slate-900 font-black">VERIFIED BY (IE MANAGER)</div>
                    <div className="text-slate-500 font-normal">Industrial Engineering Dept.</div>
                  </div>
                  <div className="space-y-1">
                    <div className="border-b border-slate-400 w-44 mx-auto mb-2 h-10" />
                    <div className="text-slate-900 font-black">APPROVED BY (AGM / GM - FACTORY)</div>
                    <div className="text-slate-500 font-normal">Factory Executive Management</div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 2: FACTORY SPREADSHEET (AS SHOWN IN USER'S IMAGES 1 & 2)             */}
            {/* ========================================================================= */}
            {activeView === 'excel-sheet' && (
              <div
                id="printable-jd-spreadsheet"
                className="printable-document bg-white text-slate-900 rounded-xl p-4 sm:p-8 shadow-2xl border border-slate-300 font-sans print:p-0 print:m-0 print:border-none print:shadow-none print:rounded-none print:bg-white print:text-slate-900 relative overflow-hidden"
              >
                {/* In-Document Format Print Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 mb-5 rounded-xl bg-amber-50 border border-amber-300 text-slate-800 print:hidden relative z-20">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-amber-700 text-white tracking-wider">
                      FORMAT 2: FACTORY SPREADSHEET GRID
                    </span>
                    <span className="text-xs text-amber-900 font-medium hidden md:inline">Shift Task Time Study • Excel Grid • Official Factory Approvals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePrint('excel-sheet')}
                      className="px-3 py-1.5 text-xs font-black rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Factory Sheet (A4)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadExcel}
                      className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-1 shadow-xs"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Excel (.xls)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadDirectPDF}
                      className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1 shadow-xs"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>

                {/* Watermark "Page 1" matching the user's Excel sheet */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 print:hidden"
                >
                  <span className="text-8xl sm:text-9xl font-black text-slate-900/[0.04] dark:text-slate-900/[0.04] tracking-widest uppercase">
                    Page 1
                  </span>
                </div>

                <div className="relative z-10 space-y-8">
                  {/* Top Metadata Header */}
                  <div className="border-b-2 border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <h1 className="text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight">
                        {jdData.jobTitle}
                      </h1>
                      <div className="text-slate-600 font-bold mt-0.5">
                        {jdData.department} • {jdData.industry}
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-slate-600 font-medium">
                      <div><strong>Reporting To:</strong> {jdData.reportingTo}</div>
                      <div><strong>Shift Time Study:</strong> {totalMinutes} MIN ({totalHours} Hours / Shift)</div>
                    </div>
                  </div>

                  {/* ------------------------------------------------------------- */}
                  {/* TABLE 1: JOB RESPONSIBILITIES (IMAGE 2)                       */}
                  {/* ------------------------------------------------------------- */}
                  <div className="space-y-0">
                    {/* Golden Title Header with Double Underline */}
                    <div className="border border-black bg-[#fffef0] py-2 px-4 text-center font-black text-sm sm:text-base tracking-wider text-[#b45309] uppercase border-b-[3px] border-b-black">
                      JOB RESPONSIBILITIES:
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-black text-xs">
                        <thead>
                          <tr className="bg-[#fef9c3] text-[#92400e] font-black text-left">
                            <th className="border border-black px-3 py-2 w-14 text-center">
                              SL#
                            </th>
                            <th className="border border-black px-4 py-2 text-left">
                              RESPONSIBILITY STATEMENT
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {jdData.responsibilities?.map((resp) => (
                            <tr
                              key={resp.id}
                              className="hover:bg-amber-50/60 transition-colors border-b border-black text-slate-900"
                            >
                              <td className="border border-black px-3 py-2.5 text-center font-black text-slate-800 bg-[#fffef7] w-14">
                                {resp.sl}
                              </td>
                              <td className="border border-black px-4 py-2.5 font-medium leading-relaxed">
                                {resp.text}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* ------------------------------------------------------------- */}
                  {/* TABLE 2: JOB DESCRIPTION (IMAGE 1)                            */}
                  {/* ------------------------------------------------------------- */}
                  <div className="space-y-0">
                    {/* Golden Title Header with Double Underline */}
                    <div className="border border-black bg-[#fffef0] py-2 px-4 text-center font-black text-sm sm:text-base tracking-wider text-[#b45309] uppercase border-b-[3px] border-b-black">
                      JOB DESCRIPTION:
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-black text-xs">
                        <thead>
                          <tr className="bg-[#fef9c3] text-[#92400e] font-black uppercase text-center text-[11px] sm:text-xs tracking-tight">
                            <th className="border border-black px-2.5 py-2.5 w-12 text-center">
                              SL#
                            </th>
                            <th className="border border-black px-4 py-2.5 text-left">
                              TASK DESCRIPTION
                            </th>
                            <th className="border border-black px-2.5 py-2.5 w-28 sm:w-36 text-center">
                              TASK REPEAT / DAY
                            </th>
                            <th className="border border-black px-2.5 py-2.5 w-24 sm:w-32 text-center">
                              TASK TAKEN TIME
                            </th>
                            <th className="border border-black px-2.5 py-2.5 w-24 sm:w-32 text-center">
                              TOTAL TASK TIME
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {jdData.dailyTasks?.map((task) => (
                            <tr
                              key={task.id}
                              className="hover:bg-amber-50/60 transition-colors border-b border-black text-slate-900"
                            >
                              <td className="border border-black px-2.5 py-2 text-center font-bold text-slate-800 bg-[#fffef7] w-12">
                                {task.sl}
                              </td>
                              <td className="border border-black px-4 py-2 font-semibold text-slate-900">
                                {task.taskDescription}
                              </td>
                              <td className="border border-black px-2.5 py-2 text-center font-bold text-slate-800">
                                {task.repeatPerDay}
                              </td>
                              <td className="border border-black px-2.5 py-2 text-center font-medium text-slate-700 font-mono">
                                {task.takenTime}
                              </td>
                              <td className="border border-black px-2.5 py-2 text-center font-black text-slate-900 font-mono">
                                {task.totalTime}
                              </td>
                            </tr>
                          ))}

                          {/* Summary Calculation Row */}
                          <tr className="bg-[#fef3c7] font-black text-xs text-slate-950 border-t-2 border-black">
                            <td
                              colSpan={4}
                              className="border border-black px-4 py-2.5 text-right uppercase tracking-wider text-slate-900"
                            >
                              TOTAL DAILY TASK TIME STUDY (মোট দৈনিক কর্মঘণ্টা):
                            </td>
                            <td className="border border-black px-2.5 py-2.5 text-center font-black text-[#92400e] text-sm font-mono">
                              {totalMinutes} MIN
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Summary Quick Stats Banner */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-center text-xs">
                      <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Total Core Tasks</div>
                        <div className="text-base font-black text-slate-900">{jdData.dailyTasks?.length || 14} Tasks</div>
                      </div>
                      <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Shift Working Minutes</div>
                        <div className="text-base font-black text-amber-700">{totalMinutes} Minutes</div>
                      </div>
                      <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Total Working Hours</div>
                        <div className="text-base font-black text-slate-900">~{totalHours} Hours / Day</div>
                      </div>
                      <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Responsibility Items</div>
                        <div className="text-base font-black text-emerald-700">{jdData.responsibilities?.length || 6} Key Points</div>
                      </div>
                    </div>
                  </div>

                  {/* Signatures Row for Factory Approval */}
                  <div className="pt-6 border-t border-slate-300 grid grid-cols-2 sm:grid-cols-3 gap-6 text-[10px] font-bold text-slate-600 uppercase">
                    <div>
                      <div className="border-b border-slate-400 w-36 sm:w-44 mb-1" />
                      PREPARED BY (IE EXECUTIVE)
                    </div>
                    <div>
                      <div className="border-b border-slate-400 w-36 sm:w-44 mb-1" />
                      VERIFIED BY (IE MANAGER)
                    </div>
                    <div className="text-right sm:text-left col-span-2 sm:col-span-1">
                      <div className="border-b border-slate-400 w-36 sm:w-44 mb-1 ml-auto sm:ml-0" />
                      APPROVED BY (AGM / GM - FACTORY)
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 2: FORMAL RMG SOP SPECIFICATION                                      */}
            {/* ========================================================================= */}
            {activeView === 'standard-sop' && (
              <div
                id="printable-jd-area"
                className="printable-document bg-white text-slate-900 rounded-xl p-6 sm:p-10 shadow-2xl border border-slate-200 font-sans print:p-0 print:m-0 print:border-none print:shadow-none print:rounded-none print:bg-white print:text-slate-900 space-y-6"
              >
                {/* In-Document Format Print Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 mb-4 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 print:hidden">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-slate-900 text-white tracking-wider">
                      FORMAT 3: HR STANDARD SOP
                    </span>
                    <span className="text-xs text-slate-600 font-medium hidden md:inline">Key Duties &amp; Scope • Performance KPIs • Software &amp; Tools • Audit Ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePrint('standard-sop')}
                      className="px-3 py-1.5 text-xs font-black rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Print HR SOP (A4)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadDirectPDF}
                      className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1 shadow-xs"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>

                {/* Header Box */}
                <div className="border-b-2 border-slate-900 pb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        OFFICIAL APPOINTMENT SPECIFICATION
                      </span>
                      <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight mt-0.5">
                        {jdData.jobTitle}
                      </h1>
                      <div className="text-xs font-bold text-slate-700 mt-1">
                        Department: {jdData.department}
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 space-y-1 md:text-right border-t md:border-t-0 pt-2 md:pt-0">
                      <div><strong>Industry:</strong> {jdData.industry}</div>
                      <div><strong>Reporting To:</strong> {jdData.reportingTo}</div>
                      <div><strong>Experience:</strong> {jdData.experienceRequired}</div>
                    </div>
                  </div>
                </div>

                {/* Role Purpose */}
                <div>
                  <h3 className="text-xs font-black tracking-wider uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    Role Purpose &amp; Operational Objective
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-700 text-justify">
                    {jdData.rolePurpose}
                  </p>
                </div>

                {/* Duties Section */}
                <div>
                  <h3 className="text-xs font-black tracking-wider uppercase text-slate-900 border-b border-slate-300 pb-1 mb-3">
                    Key Operational Duties &amp; Core Scope of Work
                  </h3>

                  <div className="space-y-4">
                    {jdData.duties.map((duty) => (
                      <div key={duty.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5 border-b border-slate-200 pb-1">
                          <div className="font-black text-slate-900">
                            <span className="px-1.5 py-0.5 rounded bg-blue-700 text-white text-[10px] mr-1.5">
                              DUTY {duty.dutyNumber}
                            </span>
                            {duty.title}
                          </div>
                          <span className="text-[11px] font-semibold text-blue-700">
                            {duty.banglaTitle}
                          </span>
                        </div>

                        <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px] pl-1">
                          {duty.items.map((it, idx) => (
                            <li key={idx}>{it}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KPIs & Metrics */}
                <div>
                  <h3 className="text-xs font-black tracking-wider uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    Key Performance Indicators (KPIs)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {jdData.kpis.map((k) => (
                      <div key={k.id} className="p-2.5 rounded border border-slate-200 bg-slate-50">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>{k.title}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-100 text-emerald-800 font-mono">
                            {k.target}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">{k.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tools & Qualifications */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 text-xs">
                  <div>
                    <h3 className="font-bold uppercase text-slate-900 border-b pb-1 mb-1.5">
                      Operational Software &amp; Tools
                    </h3>
                    <div className="grid grid-cols-2 gap-1.5">
                      {jdData.tools.map((t) => (
                        <div key={t.id} className="p-1.5 rounded border bg-slate-50 text-[11px]">
                          <div className="font-bold text-slate-900">{t.name}</div>
                          <div className="text-[9px] text-slate-500">{t.category}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold uppercase text-slate-900 border-b pb-1 mb-1.5">
                      Candidate Qualifications
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                      {jdData.qualifications.map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Signature Block */}
                <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-[10px] font-bold text-slate-600 uppercase">
                  <div>
                    <div className="border-b border-slate-400 w-48 mb-1" />
                    PREPARED BY (HEAD OF INDUSTRIAL ENGINEERING)
                  </div>
                  <div className="text-right">
                    <div className="border-b border-slate-400 w-48 mb-1 ml-auto" />
                    APPROVED BY (DIRECTOR / GM - OPERATIONS)
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Footer Info Note */}
            <div className="p-4 rounded-xl border bg-black/10 border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-80 print:hidden">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  This Job Description document meets all Bangladesh RMG Industrial Engineering and compliance audit requirements.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handlePrint()}
                className="px-3.5 py-1.5 rounded-lg border font-bold text-[11px] shrink-0 hover:bg-white/10 flex items-center gap-1.5 bg-white/10"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>Print Active JD ({activeViewName})</span>
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
