import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  User,
  FileText,
  Briefcase,
  Layers,
  BarChart3,
  GraduationCap,
  Save,
  Upload,
  Download,
  Trash2,
  Plus,
  Edit3,
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  Clock,
  Activity,
  AlertCircle,
  Palette,
  Sun,
  Moon,
  Flame,
  Sparkles,
  HelpCircle,
  FileUp,
  Camera,
  X,
  Globe,
  Copy,
  Check,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import {
  SampleProject,
  SkillItem,
  StatItem,
  ExperienceItem,
  ThemeMode,
  JobDescriptionData,
} from '../types/portfolio';
import {
  downloadCVAsWordDoc,
  downloadJobDescriptionAsWordDoc,
} from '../utils/documentExport';
import {
  downloadPortfolioDataSource,
  downloadProfilePhotoFile,
  generatePortfolioDataSourceCode,
} from '../utils/sourceExport';

type AdminTab =
  | 'profile'
  | 'theme'
  | 'deploy'
  | 'cv'
  | 'job-description'
  | 'work'
  | 'skills'
  | 'stats'
  | 'experience'
  | 'backup';

export const AdminPage: React.FC = () => {
  const { theme, adminMasterTheme, setAdminMasterTheme } = useTheme();
  const {
    state: portfolioFullState,
    personalInfo,
    statistics,
    skills,
    sampleWorkProjects,
    experiences,
    educations,
    certifications,
    jobDescriptionData,
    updatePersonalInfo,
    updateProfilePhoto,
    removeProfilePhoto,
    uploadCV,
    removeCV,
    downloadCV,
    updateJobDescriptionData,
    uploadJobDescription,
    removeJobDescription,
    downloadJobDescription,
    openCVModal,
    openJDModal,
    addWorkSample,
    updateWorkSample,
    deleteWorkSample,
    addSkill,
    updateSkill,
    deleteSkill,
    updateStatistics,
    addExperience,
    updateExperience,
    deleteExperience,
    resetToDefaults,
    exportBackup,
    importBackup,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<AdminTab>('profile');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile Form state
  const [profileForm, setProfileForm] = useState(personalInfo);
  const [photoPreview, setPhotoPreview] = useState<string>(personalInfo.profilePhotoUrl || '');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const jdInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  // Job Description Form state
  const [jdForm, setJdForm] = useState<JobDescriptionData>(jobDescriptionData);

  useEffect(() => {
    setJdForm(jobDescriptionData);
  }, [jobDescriptionData]);

  // Work Sample Form Modal state
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [editingSampleId, setEditingSampleId] = useState<string | null>(null);
  const [sampleFormData, setSampleFormData] = useState<SampleProject>({
    id: '',
    title: '',
    category: 'Garments IE Reporting',
    description: '',
    tools: ['Microsoft Excel', 'IE Efficiency Formula'],
    sampleType: 'spreadsheet',
    sampleData: {
      headers: ['Line #', 'Buyer / Brand', 'Style', 'Operators', 'Target', 'Actual', 'Efficiency %'],
      rows: [
        ['Line 01', 'H&M', 'Polo Shirt', 42, 1200, 1180, '68.4%'],
        ['Line 02', 'Zara', 'Basic T-Shirt', 34, 1500, 1540, '72.1%'],
      ],
      notes: 'Line efficiency calculated using standard IE SMV parameters.',
      metrics: [
        { label: 'Total Output', value: '2,720 Pcs' },
        { label: 'Avg Efficiency', value: '70.2%' },
      ],
    },
  });

  // New Skill state
  const [newSkill, setNewSkill] = useState<{
    name: string;
    category: 'core' | 'software' | 'operations';
    description: string;
    proficiency: number;
    iconName: string;
  }>({
    name: '',
    category: 'core',
    description: '',
    proficiency: 95,
    iconName: 'Activity',
  });

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Vercel & Cloudflare Live Deployment Handlers
  const [copiedSource, setCopiedSource] = useState(false);
  const [photoDirectUrl, setPhotoDirectUrl] = useState(personalInfo.profilePhotoUrl || '');

  const handleDownloadSourceCode = () => {
    downloadPortfolioDataSource(portfolioFullState, adminMasterTheme);
    showToast('✅ portfolioData.ts ডাউনলোড হয়েছে! src/data/portfolioData.ts ফাইলে এটি বসান।');
  };

  const handleCopySourceCode = () => {
    const code = generatePortfolioDataSourceCode(portfolioFullState, adminMasterTheme);
    navigator.clipboard.writeText(code).then(() => {
      setCopiedSource(true);
      showToast('✅ সম্পূর্ণ সোর্স কোড ক্লিপবোর্ডে কপি হয়েছে!');
      setTimeout(() => setCopiedSource(false), 3000);
    });
  };

  const handleDownloadPhotoAsset = () => {
    const photoToDownload = personalInfo.profilePhotoUrl || photoPreview;
    if (photoToDownload) {
      downloadProfilePhotoFile(photoToDownload, 'profile-photo.png');
      showToast('✅ profile-photo.png ডাউনলোড হয়েছে! এটি public/ ফোল্ডারে রাখুন।');
    } else {
      showToast('⚠️ কোনো ছবি পাওয়া যায়নি।');
    }
  };

  const handleSaveDirectPhotoUrl = () => {
    if (!photoDirectUrl.trim()) {
      showToast('⚠️ অনুগ্রহ করে একটি সঠিক ইমেজ লিংক প্রবেশ করান।');
      return;
    }
    updateProfilePhoto(photoDirectUrl.trim());
    setProfileForm((prev) => ({ ...prev, profilePhotoUrl: photoDirectUrl.trim() }));
    setPhotoPreview(photoDirectUrl.trim());
    showToast('✅ প্রোফাইল ছবির লিংক সেভ হয়েছে!');
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('⚠️ Please upload an image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      setProfileForm((prev) => ({ ...prev, profilePhotoUrl: result }));
      updateProfilePhoto(result);
      showToast('✅ Profile photo updated successfully!');
    };
    reader.readAsDataURL(file);
  };

  // Handle Photo Remove
  const handlePhotoRemove = () => {
    setPhotoPreview('');
    setProfileForm((prev) => ({ ...prev, profilePhotoUrl: '' }));
    removeProfilePhoto();
    showToast('Profile photo removed.');
  };

  // Handle CV Upload
  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      uploadCV(result, file.name, fileSizeStr);
      showToast(`✅ CV "${file.name}" uploaded successfully!`);
    };
    reader.readAsDataURL(file);
  };

  // Handle Job Description Upload
  const handleJDUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      uploadJobDescription(result, file.name, fileSizeStr);
      showToast(`✅ Job Description "${file.name}" uploaded successfully!`);
    };
    reader.readAsDataURL(file);
  };

  // Save Job Description Form Changes
  const handleSaveJD = (e: React.FormEvent) => {
    e.preventDefault();
    updateJobDescriptionData(jdForm);
    showToast('✅ Job Description configuration saved successfully!');
  };

  // Save Profile Changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updatePersonalInfo(profileForm);
    showToast('✅ Personal information saved successfully!');
  };

  // Open Add Work Sample
  const handleOpenAddSample = () => {
    setEditingSampleId(null);
    setSampleFormData({
      id: `sample-${Date.now()}`,
      title: '',
      category: 'Garments IE Reporting',
      description: '',
      tools: ['Microsoft Excel', 'IE Efficiency Formula'],
      sampleType: 'spreadsheet',
      sampleData: {
        headers: ['Line #', 'Buyer / Brand', 'Item Style', 'Target', 'Actual', 'Efficiency %'],
        rows: [
          ['Line 01', 'H&M', 'Basic Polo', 1200, 1150, '67.5%'],
          ['Line 02', 'Target', 'Cargo Shorts', 900, 890, '66.2%'],
        ],
        notes: '',
        metrics: [
          { label: 'Total Output', value: '2,040 Pcs' },
          { label: 'Avg Efficiency', value: '66.8%' },
        ],
      },
    });
    setIsSampleModalOpen(true);
  };

  // Open Edit Work Sample
  const handleOpenEditSample = (sample: SampleProject) => {
    setEditingSampleId(sample.id);
    setSampleFormData(JSON.parse(JSON.stringify(sample)));
    setIsSampleModalOpen(true);
  };

  // Save Work Sample
  const handleSaveSample = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sampleFormData.title.trim()) {
      showToast('⚠️ Please enter a title for the work sample.');
      return;
    }

    if (editingSampleId) {
      updateWorkSample(editingSampleId, sampleFormData);
      showToast('✅ Work sample updated successfully!');
    } else {
      addWorkSample(sampleFormData);
      showToast('✅ New work sample added to portfolio!');
    }
    setIsSampleModalOpen(false);
  };

  // Delete Work Sample
  const handleDeleteSample = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteWorkSample(id);
      showToast('Work sample deleted.');
    }
  };

  // Add Skill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    const skillItem: SkillItem = {
      id: `skill-${Date.now()}`,
      name: newSkill.name.trim(),
      category: newSkill.category,
      description: newSkill.description.trim() || 'Core industrial engineering & data entry competency.',
      proficiency: Number(newSkill.proficiency),
      iconName: newSkill.iconName || 'Activity',
    };

    addSkill(skillItem);
    setNewSkill({
      name: '',
      category: 'core',
      description: '',
      proficiency: 95,
      iconName: 'Activity',
    });
    showToast(`✅ Added skill: ${skillItem.name}`);
  };

  // Backup Import
  const handleImportBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const success = importBackup(content);
      if (success) {
        showToast('✅ Backup imported and restored successfully!');
      } else {
        showToast('❌ Failed to import backup. Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  // Container styling based on active theme
  const pageBgClass =
    theme === 'dark'
      ? 'bg-[#060a12] text-slate-100'
      : theme === 'orange'
      ? 'bg-[#0a0704] text-amber-50'
      : 'bg-slate-50 text-slate-900';

  const cardBgClass =
    theme === 'dark'
      ? 'bg-slate-900/95 border-slate-800 shadow-xl shadow-black/40'
      : theme === 'orange'
      ? 'bg-[#140e08]/95 border-orange-950 shadow-xl shadow-black/40'
      : 'bg-white border-slate-200 shadow-lg shadow-slate-200/50';

  const inputClass =
    theme === 'dark'
      ? 'bg-slate-950 border-slate-700 text-white focus:border-blue-500'
      : theme === 'orange'
      ? 'bg-[#1a120a] border-orange-900 text-amber-100 focus:border-orange-500'
      : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600';

  const primaryBtnClass =
    theme === 'orange'
      ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-600/30'
      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30';

  const accentTextClass =
    theme === 'orange' ? 'text-orange-400' : 'text-blue-600 dark:text-cyan-400';

  return (
    <div className={`min-h-screen pt-24 pb-20 transition-colors duration-300 ${pageBgClass}`}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 sm:right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header / Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800/40">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
              <Link to="/" className="hover:text-blue-500 flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
              </Link>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Control Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
              <div
                className={`p-2 rounded-xl text-white ${
                  theme === 'orange' ? 'bg-orange-600' : 'bg-blue-600'
                }`}
              >
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span>ADMIN PANEL</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              সম্পূর্ণ পোর্টফোলিও কন্ট্রোল সেন্টার: প্রোফাইল ফটো, সিভি (CV) আপলোড, ওয়ার্ক স্যাম্পল যোগ ও সম্পাদনা, দক্ষতা এবং ব্যক্তিগত তথ্য যেকোনো সময় পরিবর্তন করুন।
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('deploy')}
              title="Vercel & Cloudflare Live Deployment & Sync Center"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-md shadow-orange-600/20 transition-all active:scale-95"
            >
              <Globe className="w-4 h-4 text-white animate-pulse" />
              <span>🚀 Live Deploy Sync</span>
            </button>

            <Link
              to="/"
              target="_blank"
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${
                theme === 'dark' || theme === 'orange'
                  ? 'border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-white'
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Preview Site</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            <button
              type="button"
              onClick={exportBackup}
              title="Export complete portfolio as JSON file"
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all ${
                theme === 'dark' || theme === 'orange'
                  ? 'border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200'
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-2 overflow-x-auto py-5 border-b border-slate-800/40 no-scrollbar">
          {[
            { id: 'profile', label: '1. Profile & Photo', icon: User },
            { id: 'theme', label: '2. Master Theme (কালার থিম)', icon: Palette, badge: adminMasterTheme.toUpperCase() },
            { id: 'deploy', label: '3. 🚀 Live Deploy (Vercel/Cloudflare)', icon: Globe, badge: 'Live Sync' },
            { id: 'cv', label: '4. CV & Resume (Upload / Auto)', icon: FileUp, badge: personalInfo.cvUrl ? 'File Uploaded' : 'Auto Ready' },
            { id: 'job-description', label: '5. Job Description (Upload / Auto)', icon: Briefcase, badge: personalInfo.jdUrl ? 'File Uploaded' : 'Auto Ready' },
            { id: 'work', label: `6. Work Samples (${sampleWorkProjects.length})`, icon: FileSpreadsheet },
            { id: 'skills', label: `7. Skills (${skills.length})`, icon: Layers },
            { id: 'stats', label: '8. Key Stats', icon: BarChart3 },
            { id: 'experience', label: '9. Experience', icon: Briefcase },
            { id: 'backup', label: '10. Backup & Reset', icon: RefreshCw },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all whitespace-nowrap border ${
                  isActive
                    ? theme === 'orange'
                      ? 'bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-600/20'
                      : 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                    : theme === 'dark' || theme === 'orange'
                    ? 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                      tab.badge === 'Active'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="mt-8">
          {/* ================= TAB 1: PROFILE & PHOTO ================= */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Photo Management Column */}
              <div className="lg:col-span-4">
                <div className={`p-6 rounded-2xl border ${cardBgClass} sticky top-28`}>
                  <h3 className="text-base font-extrabold mb-4 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-blue-500" />
                    <span>Profile Photo (প্রোফাইল ছবি)</span>
                  </h3>

                  {/* Photo Preview Container */}
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-44 h-44 rounded-full overflow-hidden border-4 shadow-xl mb-4 relative flex items-center justify-center ${
                        theme === 'orange'
                          ? 'border-orange-600 bg-orange-950/40'
                          : 'border-blue-500 bg-slate-800'
                      }`}
                    >
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Profile Preview"
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4">
                          <User className="w-16 h-16 text-slate-400 mb-1" />
                          <span className="text-xs font-bold text-slate-400">No Image Uploaded</span>
                        </div>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <input
                      type="file"
                      ref={photoInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="flex flex-col gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className={`w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${primaryBtnClass}`}
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload New Photo</span>
                      </button>

                      {photoPreview && (
                        <button
                          type="button"
                          onClick={handlePhotoRemove}
                          className="w-full py-2 px-4 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-rose-500/20"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 mt-3">
                      JPG, PNG, or WebP. Changes reflect immediately on Home &amp; About sections.
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information Form */}
              <div className="lg:col-span-8">
                <form onSubmit={handleSaveProfile} className={`p-6 sm:p-8 rounded-2xl border ${cardBgClass}`}>
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/40">
                    <div>
                      <h3 className="text-lg font-extrabold">Executive Profile Details</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        These details automatically update across all pages and contact forms.
                      </p>
                    </div>
                    <button
                      type="submit"
                      className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${primaryBtnClass}`}
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Full Name */}
                    <div>
                      <label className="block font-bold mb-1.5 uppercase tracking-wider text-slate-400">
                        Full Name (আপনার নাম) *
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-colors ${inputClass}`}
                      />
                    </div>

                    {/* Executive Title */}
                    <div>
                      <label className="block font-bold mb-1.5 uppercase tracking-wider text-slate-400">
                        Designation / Role Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.title}
                        onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-colors ${inputClass}`}
                      />
                    </div>

                    {/* Tagline */}
                    <div className="sm:col-span-2">
                      <label className="block font-bold mb-1.5 uppercase tracking-wider text-slate-400">
                        Headline Tagline (মেইন স্লোগান)
                      </label>
                      <input
                        type="text"
                        value={profileForm.tagline}
                        onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-colors ${inputClass}`}
                      />
                    </div>

                    {/* Hero Introduction */}
                    <div className="sm:col-span-2">
                      <label className="block font-bold mb-1.5 uppercase tracking-wider text-slate-400">
                        Hero Introduction (হোমপেজ ইন্ট্রো)
                      </label>
                      <textarea
                        rows={3}
                        value={profileForm.intro}
                        onChange={(e) => setProfileForm({ ...profileForm, intro: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-normal outline-none transition-colors ${inputClass}`}
                      />
                    </div>

                    {/* About Narrative */}
                    <div className="sm:col-span-2">
                      <label className="block font-bold mb-1.5 uppercase tracking-wider text-slate-400">
                        About Me Narrative (অ্যাবাউট টেক্সট)
                      </label>
                      <textarea
                        rows={4}
                        value={profileForm.aboutText}
                        onChange={(e) => setProfileForm({ ...profileForm, aboutText: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-normal outline-none transition-colors ${inputClass}`}
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block font-bold mb-1.5 uppercase tracking-wider text-slate-400">
                        Location (ঠিকানা / লোকেশন)
                      </label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-colors ${inputClass}`}
                      />
                    </div>

                    {/* Experience Years */}
                    <div>
                      <label className="block font-bold mb-1.5 uppercase tracking-wider text-slate-400">
                        Experience Text (অভিজ্ঞতা)
                      </label>
                      <input
                        type="text"
                        value={profileForm.experienceYears}
                        onChange={(e) => setProfileForm({ ...profileForm, experienceYears: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-colors ${inputClass}`}
                      />
                    </div>

                    {/* Availability */}
                    <div>
                      <label className="block font-bold mb-1.5 uppercase tracking-wider text-slate-400">
                        Availability Status
                      </label>
                      <input
                        type="text"
                        value={profileForm.availability}
                        onChange={(e) => setProfileForm({ ...profileForm, availability: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-colors ${inputClass}`}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block font-bold mb-1.5 uppercase tracking-wider text-slate-400">
                        Official Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-colors ${inputClass}`}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block font-bold mb-1.5 uppercase tracking-wider text-slate-400">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-colors ${inputClass}`}
                      />
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="block font-bold mb-1.5 uppercase tracking-wider text-slate-400">
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={profileForm.whatsapp}
                        onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-colors ${inputClass}`}
                      />
                    </div>

                    {/* LinkedIn */}
                    <div className="sm:col-span-2">
                      <label className="block font-bold mb-1.5 uppercase tracking-wider text-slate-400">
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="text"
                        value={profileForm.linkedin}
                        onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-colors ${inputClass}`}
                      />
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-800/40 flex justify-end">
                    <button
                      type="submit"
                      className={`inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${primaryBtnClass}`}
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ================= TAB 2: MASTER DEFAULT COLOR THEME ================= */}
          {activeTab === 'theme' && (
            <div className="max-w-4xl mx-auto">
              <div className={`p-8 rounded-2xl border ${cardBgClass}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800/40 gap-4">
                  <div>
                    <h3 className="text-xl font-black flex items-center gap-2">
                      <Palette className="w-6 h-6 text-blue-500" />
                      <span>Website Master Default Theme (মাস্টার ডিফল্ট কালার থিম)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-2xl">
                      অ্যাডমিন প্যানেল থেকে আপনি যে কালারটি নির্বাচন করবেন, সেটিই পোর্টফোলিওর <strong>স্থায়ী মূল ডিফল্ট কালার</strong> হিসেবে সেভ থাকবে। হোমপেজে কোনো ভিজিটর সাময়িকভাবে কালার পরিবর্তন করে দেখলেও, পেজ রিলোড বা নতুন করে সাইটে ঢুকলে আপনার সিলেক্ট করা মূল কালারেই সাইট চালু হবে।
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">Current Master:</span>
                    <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {adminMasterTheme}
                    </span>
                  </div>
                </div>

                {/* Theme Selector Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                  {/* Option 1: Black (Dark) */}
                  <div
                    onClick={() => {
                      setAdminMasterTheme('dark');
                      showToast('মাস্টার ডিফল্ট কালার হিসেবে Midnight Black থিম সেভ হয়েছে!');
                    }}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative flex flex-col justify-between ${
                      adminMasterTheme === 'dark'
                        ? 'border-sky-500 bg-slate-900/90 shadow-xl shadow-sky-500/10'
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                    }`}
                  >
                    {adminMasterTheme === 'dark' && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sky-500 text-white shadow-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active Master</span>
                      </div>
                    )}
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-sky-400 mb-3 shadow-inner">
                        <Moon className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-black text-white">Midnight Black</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        ডার্ক ব্ল্যাক ও নেভি ব্যাকগ্রাউন্ড (#05080f), সিয়ান এবং স্কাই ব্লু নিওন অ্যাকসেন্ট।
                      </p>
                    </div>

                    {/* Preview Swatches */}
                    <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-[#05080f] border border-slate-700" title="Background #05080f" />
                        <div className="w-4 h-4 rounded-full bg-[#0f172a] border border-slate-700" title="Card #0f172a" />
                        <div className="w-4 h-4 rounded-full bg-[#0ea5e9]" title="Accent Sky" />
                      </div>
                      <button
                        type="button"
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                          adminMasterTheme === 'dark'
                            ? 'bg-sky-500 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {adminMasterTheme === 'dark' ? 'Selected' : 'Set as Master'}
                      </button>
                    </div>
                  </div>

                  {/* Option 2: White (Light) */}
                  <div
                    onClick={() => {
                      setAdminMasterTheme('light');
                      showToast('মাস্টার ডিফল্ট কালার হিসেবে Clean White থিম সেভ হয়েছে!');
                    }}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative flex flex-col justify-between ${
                      adminMasterTheme === 'light'
                        ? 'border-blue-600 bg-slate-900/90 shadow-xl shadow-blue-600/10'
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                    }`}
                  >
                    {adminMasterTheme === 'light' && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active Master</span>
                      </div>
                    )}
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-amber-500 mb-3 shadow-inner">
                        <Sun className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-black text-white">Clean White</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        উজ্জ্বল কর্পোরেট হোয়াইট ব্যাকগ্রাউন্ড (#ffffff), ডিপ স্লেট টেক্সট এবং ক্লাসিক ব্লু হাইলাইটস।
                      </p>
                    </div>

                    {/* Preview Swatches */}
                    <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-[#ffffff] border border-slate-300" title="Background #ffffff" />
                        <div className="w-4 h-4 rounded-full bg-[#f8fafc] border border-slate-300" title="Card #f8fafc" />
                        <div className="w-4 h-4 rounded-full bg-[#2563eb]" title="Accent Blue" />
                      </div>
                      <button
                        type="button"
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                          adminMasterTheme === 'light'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {adminMasterTheme === 'light' ? 'Selected' : 'Set as Master'}
                      </button>
                    </div>
                  </div>

                  {/* Option 3: Orange (Amber) */}
                  <div
                    onClick={() => {
                      setAdminMasterTheme('orange');
                      showToast('মাস্টার ডিফল্ট কালার হিসেবে Industrial Orange থিম সেভ হয়েছে!');
                    }}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative flex flex-col justify-between ${
                      adminMasterTheme === 'orange'
                        ? 'border-orange-500 bg-slate-900/90 shadow-xl shadow-orange-500/10'
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                    }`}
                  >
                    {adminMasterTheme === 'orange' && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-600 text-white shadow-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active Master</span>
                      </div>
                    )}
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-[#0c0905] border border-orange-900/60 flex items-center justify-center text-orange-400 mb-3 shadow-inner">
                        <Flame className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-black text-white">Industrial Orange</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        গাঢ় চারকোল ব্যাকগ্রাউন্ড (#0c0905), ওয়ার্ম অ্যাম্বার ও ফায়ারি অরেঞ্জ গ্রেডিয়েন্ট।
                      </p>
                    </div>

                    {/* Preview Swatches */}
                    <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-[#0c0905] border border-orange-900" title="Background #0c0905" />
                        <div className="w-4 h-4 rounded-full bg-[#181109] border border-orange-900" title="Card #181109" />
                        <div className="w-4 h-4 rounded-full bg-[#ea580c]" title="Accent Orange" />
                      </div>
                      <button
                        type="button"
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                          adminMasterTheme === 'orange'
                            ? 'bg-orange-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {adminMasterTheme === 'orange' ? 'Selected' : 'Set as Master'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Detailed Instruction Note */}
                <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white mb-1">মাস্টার কালার থিম কার্যপদ্ধতি:</h5>
                    <p className="text-slate-400">
                      ১. অ্যাডমিন প্যানেলে আপনি যে কালার সিলেক্ট করবেন, সেটি ব্রাউজারের <strong className="text-slate-200">portfolio_admin_master_theme</strong> এ স্থায়ীভাবে সংরক্ষণ করা হয়।
                      <br />
                      ২. হোমপেজে যেকোনো ভিজিটর চাইলে সাময়িকভাবে Black, White বা Orange ক্লিক করে দেখতে পারবেন।
                      <br />
                      ৩. কিন্তু তারা পেজটি রিলোড দিলে বা ব্রাউজার বন্ধ করে আবার নতুন করে ঢুকলে, স্বয়ংক্রিয়ভাবে আপনার সিলেক্ট করা মূল কালারেই পুরো ওয়েবসাইট চালু হবে।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: VERCEL & CLOUDFLARE LIVE DEPLOYMENT ================= */}
          {activeTab === 'deploy' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header Box */}
              <div className={`p-6 sm:p-8 rounded-2xl border ${cardBgClass}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/40">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 inline-flex items-center gap-1.5 mb-2">
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      VERCEL &amp; CLOUDFLARE LIVE SYNC ENGINE
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                      লাইভ সাইট ডিপ্লয়মেন্ট ও পার্মানেন্ট সিঙ্ক সেন্টার
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                      Vercel বা Cloudflare-এ সাইট লাইভ করার পর যেকোনো ডিভাইসে (মোবাইল, ল্যাপটপ, ট্যাবলেট) আপনার সাজানো প্রোফাইল ছবি ও পছন্দের থিম যাতে ১০০% স্থায়ীভাবে থাকে—তার জন্য নিচের সহজ ধাপগুলো অনুসরণ করুন।
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadSourceCode}
                      className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download portfolioData.ts</span>
                    </button>
                  </div>
                </div>

                {/* Status Overview 3-Card Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                  {/* Master Theme Status */}
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                      <span>মাস্টার লাইভ থিম</span>
                      <Palette className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="text-base font-black text-white flex items-center gap-2 mt-1">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          adminMasterTheme === 'orange'
                            ? 'bg-amber-500 shadow-xs shadow-amber-500'
                            : adminMasterTheme === 'dark'
                            ? 'bg-slate-400'
                            : 'bg-blue-400'
                        }`}
                      />
                      <span className="uppercase">{adminMasterTheme} THEME</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      সব নতুন ডিভাইস এই থিমে ওপেন হবে।
                    </p>
                    <div className="mt-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setAdminMasterTheme('orange');
                          showToast('Master theme set to Industrial Orange');
                        }}
                        className={`text-[10px] font-bold px-2 py-1 rounded-md border ${
                          adminMasterTheme === 'orange'
                            ? 'bg-amber-600/20 text-amber-300 border-amber-500/50'
                            : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        Orange
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAdminMasterTheme('dark');
                          showToast('Master theme set to Deep Black');
                        }}
                        className={`text-[10px] font-bold px-2 py-1 rounded-md border ${
                          adminMasterTheme === 'dark'
                            ? 'bg-slate-700 text-white border-slate-600'
                            : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        Dark
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAdminMasterTheme('light');
                          showToast('Master theme set to Clean White');
                        }}
                        className={`text-[10px] font-bold px-2 py-1 rounded-md border ${
                          adminMasterTheme === 'light'
                            ? 'bg-blue-600/20 text-blue-300 border-blue-500/50'
                            : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        White
                      </button>
                    </div>
                  </div>

                  {/* Profile Photo Status */}
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                      <span>প্রোফাইল ফটো স্ট্যাটাস</span>
                      <Camera className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <img
                        src={personalInfo.profilePhotoUrl || photoPreview || '/profile-photo.svg'}
                        alt="Preview"
                        className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/50 shadow-md"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-white">
                          {personalInfo.profilePhotoUrl?.startsWith('data:')
                            ? 'Custom Uploaded'
                            : personalInfo.profilePhotoUrl?.startsWith('http')
                            ? 'Hosted URL'
                            : 'Default Asset'}
                        </div>
                        <span className="text-[10px] text-emerald-400 font-medium">Ready for deployment</span>
                      </div>
                    </div>
                  </div>

                  {/* Candidate Identity */}
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                      <span>প্রার্থী ও ডেটা রেকর্ড</span>
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-xs font-bold text-white mt-1.5">{personalInfo.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{personalInfo.title}</div>
                    <div className="text-[10px] text-slate-500 mt-2">
                      {sampleWorkProjects.length} Work Samples • {skills.length} Skills
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 1: ONE-CLICK SOURCE CODE DOWNLOAD (CRITICAL STEP) */}
              <div className="p-6 sm:p-8 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 backdrop-blur-sm space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white font-black text-sm shrink-0 mt-0.5">
                    ১
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="text-base sm:text-lg font-black text-white">
                        আপডেট করা portfolioData.ts ফাইল ডাউনলোড বা কপি করুন (মূল পদক্ষেপ)
                      </h4>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto">
                        100% Guaranteed Fidelity
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Vercel বা Cloudflare যখন আপনার সাইটটি অনলাইনে বিল্ড করে, তখন এটি <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono text-[11px]">src/data/portfolioData.ts</code> ফাইল থেকে সমস্ত তথ্য গ্রহণ করে। আপনি অ্যাডমিন প্যানেলে যে তথ্য, ছবি বা থিম কালার ঠিক করেছেন, তা এক ক্লিকে সরাসরি সোর্স কোড ফাইলে রূপান্তরিত করে নিন।
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadSourceCode}
                    className="px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-600/30 flex items-center gap-2 transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download portfolioData.ts (ফাইল ডাউনলোড)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopySourceCode}
                    className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95 border ${
                      copiedSource
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    }`}
                  >
                    {copiedSource ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSource ? 'সোর্স কোড কপি হয়েছে!' : 'Copy Source Code (কোড কপি)'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-black/30 border border-emerald-500/20 text-xs text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>পদ্ধতি:</strong> ডাউনলোড করা <code className="text-amber-300">portfolioData.ts</code> ফাইলটি আপনার প্রোজেক্টের <code className="text-amber-300">src/data/portfolioData.ts</code> ফাইলে পেস্ট বা রিপ্লেস করুন।
                  </span>
                </div>
              </div>

              {/* STEP 2: PROFILE PHOTO ASSET SETUP */}
              <div className={`p-6 sm:p-8 rounded-2xl border ${cardBgClass} space-y-5`}>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-600 text-white font-black text-sm shrink-0 mt-0.5">
                    ২
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-white">
                      প্রোফাইল ছবি যেকোনো ডিভাইসে পার্মানেন্ট করার উপায়
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      ছবিটি যাতে যেকোনো কম্পিউটারে কোনো ত্রুটি ছাড়াই লোড হয়, তার জন্য নিচের যেকোনো একটি অপশন ব্যবহার করুন:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option A: Direct Hosted URL */}
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>অপশন ক: অনলাইন ইমেজ লিংক (সবচেয়ে সহজ)</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        আপনার ছবি যদি Imgur, Cloudinary, GitHub বা অনলাইনে কোথাও হোস্ট করা থাকে, তার লিংক এখানে দিন:
                      </p>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="https://i.imgur.com/your-photo.jpg"
                        value={photoDirectUrl}
                        onChange={(e) => setPhotoDirectUrl(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-mono outline-none ${inputClass}`}
                      />
                      <button
                        type="button"
                        onClick={handleSaveDirectPhotoUrl}
                        className="w-full py-2 px-3 rounded-lg text-xs font-bold uppercase bg-amber-600 hover:bg-amber-500 text-white transition-colors"
                      >
                        Save Image Link
                      </button>
                    </div>
                  </div>

                  {/* Option B: Download for Public Folder */}
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                        <Camera className="w-3.5 h-3.5" />
                        <span>অপশন খ: ছবি ডাউনলোড করে public/ এ রাখুন</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        অ্যাডমিনে আপনার আপলোড করা ছবিটি ডাউনলোড করে সরাসরি আপনার প্রোজেক্টের <code className="text-amber-300 font-mono">public/profile-photo.png</code> ফোল্ডারে রাখুন:
                      </p>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={handleDownloadPhotoAsset}
                        className="w-full py-2 px-3 rounded-lg text-xs font-bold uppercase bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download profile-photo.png</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 3: 3-STEP VERCEL & CLOUDFLARE DEPLOYMENT GUIDE */}
              <div className={`p-6 sm:p-8 rounded-2xl border ${cardBgClass} space-y-4`}>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-600 text-white font-black text-sm shrink-0 mt-0.5">
                    ৩
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-white">
                      Vercel ও Cloudflare লাইভ ডিপ্লয়মেন্ট চেকলিস্ট
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Git বা GitHub এর মাধ্যমে লাইভ করার জন্য এই ৩টি সহজ ধাপ সম্পন্ন করুন:
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                      ১
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong className="text-white">ফাইল রিপ্লেস:</strong> ডাউনলোড করা <code className="text-amber-300">portfolioData.ts</code> ফাইলটি প্রোজেক্টের <code className="text-amber-300 font-mono">src/data/portfolioData.ts</code> ফাইলে পেস্ট করে সেভ করুন।
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                      ২
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong className="text-white">ছবি নিশ্চিতকরণ:</strong> আপনার প্রোফাইল ছবিটিকে প্রজেক্টের <code className="text-amber-300 font-mono">public/</code> ফোল্ডারে রাখুন অথবা অনলাইনে হোস্ট করা লিংক ব্যবহার করুন (যা ডিফল্টভাবে <code className="text-amber-300 font-mono">/profile-photo.svg</code> হিসেবে দেওয়া আছে)।
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                      ৩
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong className="text-white">Git Push &amp; Live:</strong> কমান্ড লাইনে <code className="text-emerald-400 font-mono px-1.5 py-0.5 bg-black/40 rounded">git add . &amp;&amp; git commit -m "Update portfolio config" &amp;&amp; git push</code> করুন।
                      <br />
                      <span className="text-slate-400 mt-1 block">
                        Vercel বা Cloudflare Pages সাথে সাথে ১ মিনিটের মধ্যে সাইটটি বিল্ড করে ফেলবে এবং যেকোনো ডিভাইসে এটি হুবহু আপনার অ্যাডমিন কনফিগারেশন অনুযায়ী স্থায়ীভাবে লোড হবে!
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CLOUDFLARE PAGES / WORKERS SPECIFIC CONFIGURATION CARD */}
              <div className="p-6 sm:p-8 rounded-2xl border border-amber-500/30 bg-amber-950/10 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-600 text-white font-black text-sm shrink-0 mt-0.5">
                    ⚡
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      <span>Cloudflare বিল্ড ও ডিপ্লয় সেটিং নির্দেশিকা (সমস্যার স্থায়ী সমাধান)</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Cloudflare Fixed
                      </span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Cloudflare-এ <strong>"Installing ❌"</strong> এরর হওয়ার মূল কারণ ছিল প্রজেক্টে <code className="text-amber-300">bun.lock</code> থাকা এবং Node ভার্সন সেট না থাকা। আমরা তা সম্পূর্ণ ফিক্স করে দিয়েছি:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 text-xs">
                    <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider mb-1">
                      Cloudflare Pages সেটিংস (সুপারিশকৃত):
                    </span>
                    <ul className="space-y-1 text-slate-200">
                      <li>• <strong>Framework preset:</strong> <code className="text-amber-300">Vite</code></li>
                      <li>• <strong>Build command:</strong> <code className="text-emerald-400 font-mono">npm run build</code></li>
                      <li>• <strong>Build output directory:</strong> <code className="text-emerald-400 font-mono">dist</code></li>
                      <li>• <strong>Root directory:</strong> <code className="text-slate-400 font-mono">/</code></li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 text-xs">
                    <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider mb-1">
                      Cloudflare Environment Variables:
                    </span>
                    <p className="text-slate-300 text-[11px] mb-2">
                      যদি Cloudflare ড্যাশবোর্ডে Environment Variables অপশন থাকে:
                    </p>
                    <div className="p-2 rounded bg-slate-900 border border-slate-700 font-mono text-[11px] text-amber-300">
                      NODE_VERSION = 20
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      (প্রজেক্টে <code className="text-slate-300">.nvmrc</code> ও <code className="text-slate-300">.node-version</code> ফাইল যোগ করায় Cloudflare স্বয়ংক্রিয়ভাবেই Node 20 পাবে)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: CV / RESUME UPLOAD (CB UPLOAD) ================= */}
          {activeTab === 'cv' && (
            <div className="max-w-4xl mx-auto">
              <div className={`p-8 rounded-2xl border ${cardBgClass}`}>
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800/40">
                  <div>
                    <h3 className="text-xl font-black flex items-center gap-2">
                      <FileUp className="w-6 h-6 text-emerald-400" />
                      <span>CV &amp; Resume Management (সিভি আপলোড ও নিয়ন্ত্রণ)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      আপনার নিজস্ব কারিকুলাম ভিটা (CV/Resume) PDF বা Word ফরম্যাটে আপলোড করুন। ওয়েবসাইট থেকে ভিজিটর ও রিক্রুটাররা এটি এক ক্লিকেই ডাউনলোড করতে পারবেন।
                    </p>
                  </div>
                </div>

                {/* Current CV Status Card */}
                <div
                  className={`p-6 rounded-xl border mb-8 ${
                    personalInfo.cvUrl
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-amber-500/30 bg-amber-500/5'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          personalInfo.cvUrl
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        <FileText className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold tracking-tight">
                            {personalInfo.cvFileName || 'No Custom CV Uploaded Yet'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              personalInfo.cvUrl
                                ? 'bg-emerald-500 text-white'
                                : 'bg-amber-500 text-slate-950'
                            }`}
                          >
                            {personalInfo.cvUrl ? 'Active CV' : 'Default Generator Active'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {personalInfo.cvUrl
                            ? `File Size: ${personalInfo.cvFileSize || 'Document'} • Uploaded: ${personalInfo.cvLastUpdated || 'Recently'}`
                            : 'Currently generating a live Garments IE formatted executive resume file on download.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={downloadCV}
                        className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
                          theme === 'orange'
                            ? 'bg-orange-600 hover:bg-orange-500 text-white'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                      >
                        <Download className="w-4 h-4" />
                        <span>Download &amp; Test CV</span>
                      </button>

                      {personalInfo.cvUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to remove the uploaded CV?')) {
                              removeCV();
                              showToast('Uploaded CV removed. Default IE CV restored.');
                            }
                          }}
                          className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-rose-500/20"
                          title="Remove uploaded CV"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upload Drag & Drop Dropzone */}
                <input
                  type="file"
                  ref={cvInputRef}
                  onChange={handleCVUpload}
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                />

                <div
                  onClick={() => cvInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all group ${
                    theme === 'orange'
                      ? 'border-orange-800 hover:border-orange-500 bg-orange-950/20'
                      : 'border-slate-700 hover:border-blue-500 bg-slate-900/40 hover:bg-blue-500/5'
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform mx-auto flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-extrabold tracking-tight mb-1">
                    Click to browse or drag and drop your CV file here
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                    Supported formats: <strong>PDF (.pdf)</strong>, <strong>Word (.docx, .doc)</strong>. Max recommended size: 5 MB.
                  </p>
                  <span
                    className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl ${primaryBtnClass}`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Select CV File from Computer</span>
                  </span>
                </div>

                {/* Auto-Generated High-Quality CV Section */}
                <div
                  className={`mt-8 p-6 rounded-2xl border ${
                    theme === 'orange'
                      ? 'bg-orange-950/20 border-orange-900/60'
                      : 'bg-slate-900/50 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/60 mb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          Auto-Engine
                        </span>
                        <h4 className="text-base font-extrabold text-white">
                          স্বয়ংক্রিয় প্রফেশনাল সিভি জেনারেটর (3 High-Quality Templates)
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                        অ্যাডমিন প্যানেলে আপনার দেওয়া নাম, অভিজ্ঞতা, দক্ষতা ও রিপোর্টের ভিত্তিতে সিস্টেম স্বয়ংক্রিয়ভাবে যেকোনো সময় রেডিমেড হাই-কোয়ালিটি সিভি প্রস্তুত করে।
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={openCVModal}
                        className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all text-white ${
                          theme === 'orange' ? 'bg-orange-600 hover:bg-orange-500' : 'bg-blue-600 hover:bg-blue-500'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                        <span>Live Preview &amp; Print (A4)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          downloadCVAsWordDoc(
                            personalInfo,
                            statistics,
                            skills,
                            experiences,
                            educations,
                            certifications
                          )
                        }
                        className="px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Word Doc (.doc)</span>
                      </button>
                    </div>
                  </div>

                  {/* 3 Template Selection Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        id: 'modern',
                        name: 'Modern Executive',
                        desc: 'Clean corporate navy accents, spacious layout with skill progress indicators.',
                        badge: 'Recommended',
                      },
                      {
                        id: 'corporate',
                        name: 'Corporate ATS',
                        desc: 'Black & white minimalist format optimized for HR tracking systems and fast scanning.',
                        badge: 'ATS Compliant',
                      },
                      {
                        id: 'technical',
                        name: 'Technical IE Matrix',
                        desc: 'Engineered layout highlighting factory metrics, daily production data & SMV tools.',
                        badge: 'Industry Standard',
                      },
                    ].map((tpl) => {
                      const isSelected = (personalInfo.cvTemplatePreference || 'modern') === tpl.id;
                      return (
                        <div
                          key={tpl.id}
                          onClick={() => {
                            updatePersonalInfo({ cvTemplatePreference: tpl.id as any });
                            showToast(`Selected CV Template: ${tpl.name}`);
                          }}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? theme === 'orange'
                                ? 'border-orange-500 bg-orange-600/10 shadow-md ring-1 ring-orange-500/40'
                                : 'border-blue-500 bg-blue-600/10 shadow-md ring-1 ring-blue-500/40'
                              : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-white">{tpl.name}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${
                                isSelected
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {tpl.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{tpl.desc}</p>
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                            <span>{isSelected ? '✓ Default Template' : 'Click to Set Default'}</span>
                            <span className="underline">View</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: JOB DESCRIPTION (UPLOAD & AUTO-GENERATOR) ================= */}
          {activeTab === 'job-description' && (
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Main Container */}
              <div className={`p-8 rounded-2xl border ${cardBgClass}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800/40">
                  <div>
                    <h3 className="text-xl font-black flex items-center gap-2.5">
                      <Briefcase className="w-6 h-6 text-cyan-400" />
                      <span>Job Description Management (জব ডেসক্রিপশন আপলোড ও প্রস্তুতকরণ)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                      সিভির মতোই এখানে নিজস্ব জব ডেসক্রিপশন ডকুমেন্ট আপলোড করতে পারবেন, অথবা সিস্টেমের স্বয়ংক্রিয় স্ট্যান্ডার্ড আরএমজি ইন্ডাস্ট্রিয়াল ইঞ্জিনিয়ারিং রেসপনসিবিলিটি ফরম্যাট কাস্টমাইজ করে হাই-কোয়ালিটি ওয়ার্ড/পিডিএফ হিসেবে ডাউনলোড করতে পারবেন।
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={openJDModal}
                      className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all text-white ${
                        theme === 'orange'
                          ? 'bg-orange-600 hover:bg-orange-500'
                          : 'bg-blue-600 hover:bg-blue-500'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>Live Preview Modal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        downloadJobDescriptionAsWordDoc(jdForm)
                      }
                      className="px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Word (.doc)</span>
                    </button>
                  </div>
                </div>

                {/* Section 1: Custom Upload Status */}
                <div
                  className={`p-6 rounded-xl border mb-8 ${
                    personalInfo.jdUrl
                      ? 'border-cyan-500/30 bg-cyan-500/5'
                      : 'border-slate-800 bg-slate-900/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          personalInfo.jdUrl
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <FileText className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold tracking-tight text-white">
                            {personalInfo.jdFileName || 'No Custom Job Description File Uploaded'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              personalInfo.jdUrl
                                ? 'bg-cyan-500 text-slate-950 font-black'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {personalInfo.jdUrl ? 'Uploaded File Active' : 'Auto Generator Mode'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {personalInfo.jdUrl
                            ? `File Size: ${personalInfo.jdFileSize || 'Document'} • Uploaded: ${personalInfo.jdLastUpdated || 'Recently'}`
                            : 'Currently using the built-in standard Garments IE Scope of Responsibilities.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={downloadJobDescription}
                        className="px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                      >
                        <Download className="w-4 h-4 text-cyan-400" />
                        <span>Download &amp; Test File</span>
                      </button>

                      {personalInfo.jdUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to remove the uploaded Job Description?')) {
                              removeJobDescription();
                              showToast('Uploaded Job Description removed.');
                            }
                          }}
                          className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-rose-500/20"
                          title="Remove uploaded file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upload Drag & Drop Dropzone for Job Description */}
                <input
                  type="file"
                  ref={jdInputRef}
                  onChange={handleJDUpload}
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                />

                <div
                  onClick={() => jdInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all group mb-8 ${
                    theme === 'orange'
                      ? 'border-orange-800 hover:border-orange-500 bg-orange-950/20'
                      : 'border-slate-700 hover:border-cyan-500 bg-slate-900/40 hover:bg-cyan-500/5'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform mx-auto flex items-center justify-center mb-3">
                    <Upload className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold tracking-tight mb-1 text-white">
                    Click to browse or drag &amp; drop your Job Description file
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mb-3">
                    Supported formats: <strong>PDF (.pdf)</strong>, <strong>Word (.docx, .doc)</strong>. Max size: 5 MB.
                  </p>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl ${primaryBtnClass}`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Select JD File from Device</span>
                  </span>
                </div>

                {/* Section 2: Editable Auto-Generated Job Description Configuration */}
                <div className="pt-6 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        Structured Editor
                      </span>
                      <h4 className="text-base font-extrabold text-white">
                        Standard Job Description Parameters (পদ্ধতিগত তথ্য এডিটর)
                      </h4>
                    </div>
                  </div>

                  <form onSubmit={handleSaveJD} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Job Title (পদের নাম)
                        </label>
                        <input
                          type="text"
                          value={jdForm.jobTitle}
                          onChange={(e) => setJdForm({ ...jdForm, jobTitle: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${inputClass}`}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Department (বিভাগ)
                        </label>
                        <input
                          type="text"
                          value={jdForm.department}
                          onChange={(e) => setJdForm({ ...jdForm, department: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${inputClass}`}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Industry Type (শিল্প খাত)
                        </label>
                        <input
                          type="text"
                          value={jdForm.industry}
                          onChange={(e) => setJdForm({ ...jdForm, industry: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${inputClass}`}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Reporting Authority (রিপোর্টিং লাইন)
                        </label>
                        <input
                          type="text"
                          value={jdForm.reportingTo}
                          onChange={(e) => setJdForm({ ...jdForm, reportingTo: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${inputClass}`}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Role Purpose &amp; Operational Objective (মূল দায়িত্ব ও উদ্দেশ্যের বিবরণ)
                      </label>
                      <textarea
                        rows={3}
                        value={jdForm.rolePurpose}
                        onChange={(e) => setJdForm({ ...jdForm, rolePurpose: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${inputClass}`}
                        required
                      />
                    </div>

                    {/* SECTION: JOB RESPONSIBILITIES (IMAGE 2) */}
                    <div className="pt-4 border-t border-slate-800">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                            OFFICIAL FACTORY SPREADSHEET (IMAGE 2)
                          </span>
                          <h5 className="text-sm font-bold text-white uppercase tracking-wider">
                            JOB RESPONSIBILITIES: ({jdForm.responsibilities?.length || 0} Key Responsibilities)
                          </h5>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newResp = {
                              id: `resp-${Date.now()}`,
                              sl: (jdForm.responsibilities?.length || 0) + 1,
                              text: '',
                            };
                            setJdForm({
                              ...jdForm,
                              responsibilities: [...(jdForm.responsibilities || []), newResp],
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Responsibility</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {jdForm.responsibilities?.map((resp, idx) => (
                          <div
                            key={resp.id || idx}
                            className="flex items-center gap-2 p-2 rounded-xl border border-slate-800 bg-slate-900/40"
                          >
                            <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                              {resp.sl}
                            </span>
                            <input
                              type="text"
                              value={resp.text}
                              onChange={(e) => {
                                const updated = [...(jdForm.responsibilities || [])];
                                updated[idx] = { ...updated[idx], text: e.target.value };
                                setJdForm({ ...jdForm, responsibilities: updated });
                              }}
                              placeholder="Enter responsibility statement..."
                              className={`flex-1 px-3 py-2 rounded-lg border text-xs font-medium ${inputClass}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = jdForm.responsibilities
                                  ?.filter((_, i) => i !== idx)
                                  .map((item, i) => ({ ...item, sl: i + 1 }));
                                setJdForm({ ...jdForm, responsibilities: updated });
                              }}
                              className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                              title="Delete responsibility"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION: JOB DESCRIPTION DAILY TASKS (IMAGE 1) */}
                    <div className="pt-4 border-t border-slate-800">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                            DAILY TASK TIME STUDY BREAKDOWN (IMAGE 1)
                          </span>
                          <h5 className="text-sm font-bold text-white uppercase tracking-wider">
                            JOB DESCRIPTION: ({jdForm.dailyTasks?.length || 0} Core Daily Tasks)
                          </h5>
                          <p className="text-[11px] text-slate-400">
                            মোট দৈনিক সময়: <strong className="text-amber-400 font-mono">{jdForm.totalDailyMinutes || 530} MIN</strong> (~{((jdForm.totalDailyMinutes || 530) / 60).toFixed(1)} ঘণ্টা)
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newTask = {
                              id: `task-${Date.now()}`,
                              sl: (jdForm.dailyTasks?.length || 0) + 1,
                              taskDescription: '',
                              repeatPerDay: 1,
                              takenTime: '30MIN',
                              totalTime: '30MIN',
                            };
                            setJdForm({
                              ...jdForm,
                              dailyTasks: [...(jdForm.dailyTasks || []), newTask],
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 flex items-center gap-1 self-start sm:self-auto"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Daily Task</span>
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-slate-800 text-xs text-left">
                          <thead>
                            <tr className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800">
                              <th className="p-2 w-10 text-center">SL#</th>
                              <th className="p-2">TASK DESCRIPTION</th>
                              <th className="p-2 w-28 text-center">REPEAT/DAY</th>
                              <th className="p-2 w-24 text-center">TAKEN TIME</th>
                              <th className="p-2 w-24 text-center">TOTAL TIME</th>
                              <th className="p-2 w-10 text-center"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {jdForm.dailyTasks?.map((task, idx) => (
                              <tr key={task.id || idx} className="hover:bg-slate-900/30">
                                <td className="p-1.5 text-center font-bold text-slate-400">
                                  {task.sl}
                                </td>
                                <td className="p-1.5">
                                  <input
                                    type="text"
                                    value={task.taskDescription}
                                    onChange={(e) => {
                                      const updated = [...(jdForm.dailyTasks || [])];
                                      updated[idx] = { ...updated[idx], taskDescription: e.target.value };
                                      setJdForm({ ...jdForm, dailyTasks: updated });
                                    }}
                                    className={`w-full px-2.5 py-1.5 rounded-lg border text-xs ${inputClass}`}
                                    placeholder="Task description..."
                                  />
                                </td>
                                <td className="p-1.5 text-center">
                                  <input
                                    type="text"
                                    value={task.repeatPerDay}
                                    onChange={(e) => {
                                      const updated = [...(jdForm.dailyTasks || [])];
                                      updated[idx] = { ...updated[idx], repeatPerDay: e.target.value };
                                      setJdForm({ ...jdForm, dailyTasks: updated });
                                    }}
                                    className={`w-16 mx-auto px-2 py-1.5 rounded-lg border text-xs text-center ${inputClass}`}
                                  />
                                </td>
                                <td className="p-1.5 text-center">
                                  <input
                                    type="text"
                                    value={task.takenTime}
                                    onChange={(e) => {
                                      const updated = [...(jdForm.dailyTasks || [])];
                                      updated[idx] = { ...updated[idx], takenTime: e.target.value };
                                      setJdForm({ ...jdForm, dailyTasks: updated });
                                    }}
                                    className={`w-20 mx-auto px-2 py-1.5 rounded-lg border text-xs text-center font-mono ${inputClass}`}
                                  />
                                </td>
                                <td className="p-1.5 text-center">
                                  <input
                                    type="text"
                                    value={task.totalTime}
                                    onChange={(e) => {
                                      const updated = [...(jdForm.dailyTasks || [])];
                                      updated[idx] = { ...updated[idx], totalTime: e.target.value };
                                      setJdForm({ ...jdForm, dailyTasks: updated });
                                    }}
                                    className={`w-20 mx-auto px-2 py-1.5 rounded-lg border text-xs text-center font-mono font-bold text-amber-400 ${inputClass}`}
                                  />
                                </td>
                                <td className="p-1.5 text-center">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = jdForm.dailyTasks
                                        ?.filter((_, i) => i !== idx)
                                        .map((item, i) => ({ ...item, sl: i + 1 }));
                                      setJdForm({ ...jdForm, dailyTasks: updated });
                                    }}
                                    className="p-1 text-slate-500 hover:text-red-400"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Operational Duties Preview */}
                    <div className="pt-4 border-t border-slate-800">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        5 Core Operational Duty Modules (ফ্যাক্টরি অপারেশনের ৫টি মূল দায়িত্বের তালিকা)
                      </label>
                      <div className="space-y-3">
                        {jdForm.duties.map((duty, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/30 flex items-start gap-3"
                          >
                            <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                              0{duty.dutyNumber}
                            </span>
                            <div className="flex-1">
                              <h5 className="text-xs font-bold text-white flex items-center gap-2">
                                <span>{duty.title}</span>
                                <span className="text-slate-400 font-normal">({duty.banglaTitle})</span>
                              </h5>
                              <ul className="mt-1 space-y-1">
                                {duty.items.slice(0, 2).map((item, itemIdx) => (
                                  <li key={itemIdx} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                      <button
                        type="submit"
                        className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md ${primaryBtnClass}`}
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Job Description Settings</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5: WORK SAMPLES (WORK SAMPLE ADD / EDIT / DELETE) ================= */}
          {activeTab === 'work' && (
            <div>
              {/* Header with "Add New Work Sample" button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-black tracking-tight">
                    Work Samples &amp; Industrial Engineering Reports
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage sample spreadsheets, DMR reports, SMV breakdowns, and floor tracking data shown on the portfolio.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddSample}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${primaryBtnClass}`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Work Sample</span>
                </button>
              </div>

              {/* Grid of Work Samples */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sampleWorkProjects.map((sample, idx) => (
                  <div
                    key={sample.id}
                    className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${cardBgClass}`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                            theme === 'orange'
                              ? 'text-orange-400 border-orange-500/30 bg-orange-500/10'
                              : 'text-blue-500 border-blue-500/30 bg-blue-500/10'
                          }`}
                        >
                          {sample.category}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          #{idx + 1} • {sample.sampleType.toUpperCase()}
                        </span>
                      </div>

                      <h4 className="text-base font-extrabold tracking-tight mb-2">
                        {sample.title}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                        {sample.description}
                      </p>

                      {/* Tools Preview */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {sample.tools.map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Metrics preview */}
                      {sample.sampleData.metrics && (
                        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 mb-4 text-xs">
                          {sample.sampleData.metrics.map((m, i) => (
                            <div key={i}>
                              <div className="text-[10px] text-slate-400">{m.label}</div>
                              <div className="font-bold text-emerald-400">{m.value}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-slate-800/40 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {sample.sampleData.rows.length} Data Rows
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditSample(sample)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSample(sample.id, sample.title)}
                          className="p-1.5 text-xs font-semibold rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                          title="Delete this sample"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 4: SKILLS & TOOLS ================= */}
          {activeTab === 'skills' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Add New Skill Form */}
              <div className="lg:col-span-4">
                <form
                  onSubmit={handleAddSkill}
                  className={`p-6 rounded-2xl border ${cardBgClass} sticky top-28`}
                >
                  <h3 className="text-base font-extrabold mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Add New Skill (নতুন দক্ষতা যোগ)</span>
                  </h3>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold mb-1 uppercase tracking-wider text-slate-400">
                        Skill Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Line Balancing (Pitch Time)"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border text-sm font-semibold outline-none ${inputClass}`}
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1 uppercase tracking-wider text-slate-400">
                        Category
                      </label>
                      <select
                        value={newSkill.category}
                        onChange={(e) =>
                          setNewSkill({
                            ...newSkill,
                            category: e.target.value as 'core' | 'software' | 'operations',
                          })
                        }
                        className={`w-full px-3 py-2 rounded-xl border text-sm font-semibold outline-none ${inputClass}`}
                      >
                        <option value="core">Garments IE &amp; Production Data</option>
                        <option value="software">Excel &amp; Factory Software</option>
                        <option value="operations">Typing, Mailing &amp; Office IT</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-bold uppercase tracking-wider text-slate-400">
                          Proficiency Rating
                        </label>
                        <span className="font-extrabold text-blue-400">{newSkill.proficiency}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={newSkill.proficiency}
                        onChange={(e) =>
                          setNewSkill({ ...newSkill, proficiency: Number(e.target.value) })
                        }
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1 uppercase tracking-wider text-slate-400">
                        Description / Work Scope
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Brief summary of how this skill applies on the factory floor"
                        value={newSkill.description}
                        onChange={(e) =>
                          setNewSkill({ ...newSkill, description: e.target.value })
                        }
                        className={`w-full px-3 py-2 rounded-xl border text-sm outline-none ${inputClass}`}
                      />
                    </div>

                    <button
                      type="submit"
                      className={`w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${primaryBtnClass}`}
                    >
                      + Add Skill to Portfolio
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Skills List */}
              <div className="lg:col-span-8">
                <div className={`p-6 rounded-2xl border ${cardBgClass}`}>
                  <h3 className="text-lg font-black mb-4">
                    Active Skills List ({skills.length})
                  </h3>

                  <div className="space-y-3">
                    {skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="p-4 rounded-xl border border-slate-800/70 bg-slate-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm tracking-tight">{skill.name}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold uppercase">
                              {skill.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                            {skill.description}
                          </p>

                          {/* Progress bar */}
                          <div className="w-full max-w-md h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-emerald-400">
                            {skill.proficiency}%
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete skill "${skill.name}"?`)) {
                                deleteSkill(skill.id);
                                showToast(`Skill "${skill.name}" removed.`);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                            title="Delete skill"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5: KEY STATISTICS ================= */}
          {activeTab === 'stats' && (
            <div className="max-w-4xl mx-auto">
              <div className={`p-6 sm:p-8 rounded-2xl border ${cardBgClass}`}>
                <h3 className="text-lg font-black mb-1">Key Performance Statistics</h3>
                <p className="text-xs text-slate-400 mb-6">
                  These 4 benchmark statistics are prominently displayed in the Hero banner and About sections.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {statistics.map((stat, idx) => (
                    <div
                      key={stat.id}
                      className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/40 text-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold uppercase text-blue-400">Metric #{idx + 1}</span>
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-slate-400 uppercase">Label</label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const updated = [...statistics];
                            updated[idx] = { ...updated[idx], label: e.target.value };
                            updateStatistics(updated);
                          }}
                          className={`w-full px-3 py-2 rounded-xl border font-bold text-sm ${inputClass}`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold mb-1 text-slate-400 uppercase">Numeric Value</label>
                          <input
                            type="number"
                            value={stat.value}
                            onChange={(e) => {
                              const updated = [...statistics];
                              updated[idx] = { ...updated[idx], value: Number(e.target.value) };
                              updateStatistics(updated);
                            }}
                            className={`w-full px-3 py-2 rounded-xl border font-bold text-sm ${inputClass}`}
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1 text-slate-400 uppercase">Suffix (%, +, WPM)</label>
                          <input
                            type="text"
                            value={stat.suffix}
                            onChange={(e) => {
                              const updated = [...statistics];
                              updated[idx] = { ...updated[idx], suffix: e.target.value };
                              updateStatistics(updated);
                            }}
                            className={`w-full px-3 py-2 rounded-xl border font-bold text-sm ${inputClass}`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-slate-400 uppercase">Subtext Description</label>
                        <input
                          type="text"
                          value={stat.description}
                          onChange={(e) => {
                            const updated = [...statistics];
                            updated[idx] = { ...updated[idx], description: e.target.value };
                            updateStatistics(updated);
                          }}
                          className={`w-full px-3 py-2 rounded-xl border ${inputClass}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => showToast('✅ Statistics saved successfully!')}
                    className={`inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl ${primaryBtnClass}`}
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Statistics</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 6: EXPERIENCE & WORK HISTORY ================= */}
          {activeTab === 'experience' && (
            <div className="max-w-4xl mx-auto">
              <div className={`p-6 sm:p-8 rounded-2xl border ${cardBgClass}`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-black">Professional Experience Entries</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Garments factory experience and data entry executive history.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {experiences.map((exp, idx) => (
                    <div
                      key={exp.id}
                      className="p-5 rounded-xl border border-slate-800/80 bg-slate-950/40 text-xs space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold mb-1 text-slate-400 uppercase">Job Title</label>
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => {
                              updateExperience(exp.id, { ...exp, title: e.target.value });
                            }}
                            className={`w-full px-3 py-2 rounded-xl border font-bold text-sm ${inputClass}`}
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1 text-slate-400 uppercase">Company / Factory Name</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              updateExperience(exp.id, { ...exp, company: e.target.value });
                            }}
                            className={`w-full px-3 py-2 rounded-xl border font-bold text-sm ${inputClass}`}
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1 text-slate-400 uppercase">Employment Period</label>
                          <input
                            type="text"
                            value={exp.period}
                            onChange={(e) => {
                              updateExperience(exp.id, { ...exp, period: e.target.value });
                            }}
                            className={`w-full px-3 py-2 rounded-xl border ${inputClass}`}
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1 text-slate-400 uppercase">Location</label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => {
                              updateExperience(exp.id, { ...exp, location: e.target.value });
                            }}
                            className={`w-full px-3 py-2 rounded-xl border ${inputClass}`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-slate-400 uppercase">
                          Key Responsibilities (One per line)
                        </label>
                        <textarea
                          rows={4}
                          value={exp.responsibilities.join('\n')}
                          onChange={(e) => {
                            updateExperience(exp.id, {
                              ...exp,
                              responsibilities: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                            });
                          }}
                          className={`w-full px-3 py-2 rounded-xl border ${inputClass}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => showToast('✅ Experience records updated!')}
                    className={`inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl ${primaryBtnClass}`}
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Experience Changes</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 7: BACKUP & RESTORE ================= */}
          {activeTab === 'backup' && (
            <div className="max-w-3xl mx-auto">
              <div className={`p-8 rounded-2xl border ${cardBgClass} space-y-8`}>
                <div>
                  <h3 className="text-xl font-black mb-1">Portfolio Data Management &amp; Backups</h3>
                  <p className="text-xs text-slate-400">
                    Export your customized portfolio data as a JSON file to keep a safe backup on your computer, or restore anytime.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Export */}
                  <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-950/40 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm mb-1 flex items-center gap-2">
                        <Download className="w-4 h-4 text-emerald-400" />
                        <span>Export Backup (JSON)</span>
                      </h4>
                      <p className="text-xs text-slate-400 mb-4">
                        Download your full portfolio configuration including custom work samples, CV, and profile info into a portable JSON file.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={exportBackup}
                      className="w-full py-2.5 px-4 text-xs font-bold uppercase rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                    >
                      Download JSON Backup
                    </button>
                  </div>

                  {/* Import */}
                  <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-950/40 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm mb-1 flex items-center gap-2">
                        <Upload className="w-4 h-4 text-blue-400" />
                        <span>Restore from Backup</span>
                      </h4>
                      <p className="text-xs text-slate-400 mb-4">
                        Upload a previously saved portfolio JSON backup to instantly restore all data.
                      </p>
                    </div>
                    <input
                      type="file"
                      ref={backupInputRef}
                      onChange={handleImportBackupFile}
                      accept=".json,application/json"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => backupInputRef.current?.click()}
                      className="w-full py-2.5 px-4 text-xs font-bold uppercase rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                    >
                      Select JSON File to Restore
                    </button>
                  </div>
                </div>

                {/* Reset to Defaults */}
                <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-extrabold text-sm text-rose-400">Reset to Initial Factory Defaults</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Reset all settings back to the default Garments IE Executive template.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          '⚠️ Are you sure you want to reset everything back to initial Garments IE template defaults? All unsaved custom edits will be cleared.'
                        )
                      ) {
                        resetToDefaults();
                        showToast('Reset back to factory defaults.');
                      }
                    }}
                    className="px-4 py-2.5 text-xs font-bold uppercase rounded-xl text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors whitespace-nowrap"
                  >
                    Reset to Defaults
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL: ADD / EDIT WORK SAMPLE ================= */}
      <AnimatePresence>
        {isSampleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 sm:p-8 ${cardBgClass}`}
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/40">
                <div>
                  <h3 className="text-lg font-black">
                    {editingSampleId ? 'Edit Work Sample / Report' : 'Add New Work Sample / Report'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Enter details for this industrial engineering project or data report.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSampleModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSample} className="space-y-4 text-xs">
                {/* Title */}
                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-slate-400">
                    Sample Report Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Daily Sewing Line Efficiency Report (DMR)"
                    value={sampleFormData.title}
                    onChange={(e) =>
                      setSampleFormData({ ...sampleFormData, title: e.target.value })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none ${inputClass}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block font-bold mb-1 uppercase tracking-wider text-slate-400">
                      Category *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Garments IE Reporting, Industrial Engineering"
                      value={sampleFormData.category}
                      onChange={(e) =>
                        setSampleFormData({ ...sampleFormData, category: e.target.value })
                      }
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none ${inputClass}`}
                    />
                  </div>

                  {/* Sample Type */}
                  <div>
                    <label className="block font-bold mb-1 uppercase tracking-wider text-slate-400">
                      Display Format Type
                    </label>
                    <select
                      value={sampleFormData.sampleType}
                      onChange={(e) =>
                        setSampleFormData({
                          ...sampleFormData,
                          sampleType: e.target.value as any,
                        })
                      }
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none ${inputClass}`}
                    >
                      <option value="spreadsheet">Spreadsheet Table</option>
                      <option value="cleaning">Data Cleaning (Before / After)</option>
                      <option value="conversion">Conversion &amp; Document</option>
                      <option value="research">Research &amp; Mailing</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-slate-400">
                    Description &amp; Operational Context *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Explain what was measured, monitored, or calculated in this report."
                    value={sampleFormData.description}
                    onChange={(e) =>
                      setSampleFormData({ ...sampleFormData, description: e.target.value })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${inputClass}`}
                  />
                </div>

                {/* Tools Used */}
                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-slate-400">
                    Tools Used (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Microsoft Excel, IE Efficiency Formula, SUMIFS"
                    value={sampleFormData.tools.join(', ')}
                    onChange={(e) =>
                      setSampleFormData({
                        ...sampleFormData,
                        tools: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${inputClass}`}
                  />
                </div>

                {/* Table Headers */}
                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-slate-400">
                    Table Columns / Headers (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={sampleFormData.sampleData.headers.join(', ')}
                    onChange={(e) => {
                      const newHeaders = e.target.value.split(',').map((h) => h.trim());
                      setSampleFormData({
                        ...sampleFormData,
                        sampleData: {
                          ...sampleFormData.sampleData,
                          headers: newHeaders,
                        },
                      });
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${inputClass}`}
                  />
                </div>

                {/* Table Data Rows Preview / Quick Editor */}
                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-slate-400">
                    Table Data Rows (Each line = one row, values separated by comma or pipe | )
                  </label>
                  <textarea
                    rows={4}
                    value={sampleFormData.sampleData.rows
                      .map((r) => r.join(' | '))
                      .join('\n')}
                    onChange={(e) => {
                      const newRows = e.target.value
                        .split('\n')
                        .filter((line) => line.trim().length > 0)
                        .map((line) =>
                          line.includes('|')
                            ? line.split('|').map((c) => c.trim())
                            : line.split(',').map((c) => c.trim())
                        );
                      setSampleFormData({
                        ...sampleFormData,
                        sampleData: {
                          ...sampleFormData.sampleData,
                          rows: newRows,
                        },
                      });
                    }}
                    placeholder="Line 01 | H&M | Polo Shirt | 42 | 1200 | 1180 | 68.4%"
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs outline-none ${inputClass}`}
                  />
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1 uppercase tracking-wider text-slate-400">
                      Metric 1 (Label &amp; Value)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Label (e.g. Total Output)"
                        value={sampleFormData.sampleData.metrics?.[0]?.label || ''}
                        onChange={(e) => {
                          const curMetrics = sampleFormData.sampleData.metrics || [
                            { label: '', value: '' },
                            { label: '', value: '' },
                          ];
                          curMetrics[0] = { ...curMetrics[0], label: e.target.value };
                          setSampleFormData({
                            ...sampleFormData,
                            sampleData: { ...sampleFormData.sampleData, metrics: curMetrics },
                          });
                        }}
                        className={`w-1/2 px-3 py-2 rounded-xl border text-xs ${inputClass}`}
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 5,520 Pcs)"
                        value={sampleFormData.sampleData.metrics?.[0]?.value || ''}
                        onChange={(e) => {
                          const curMetrics = sampleFormData.sampleData.metrics || [
                            { label: '', value: '' },
                            { label: '', value: '' },
                          ];
                          curMetrics[0] = { ...curMetrics[0], value: e.target.value };
                          setSampleFormData({
                            ...sampleFormData,
                            sampleData: { ...sampleFormData.sampleData, metrics: curMetrics },
                          });
                        }}
                        className={`w-1/2 px-3 py-2 rounded-xl border text-xs font-bold ${inputClass}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 uppercase tracking-wider text-slate-400">
                      Metric 2 (Label &amp; Value)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Label (e.g. Avg Efficiency)"
                        value={sampleFormData.sampleData.metrics?.[1]?.label || ''}
                        onChange={(e) => {
                          const curMetrics = sampleFormData.sampleData.metrics || [
                            { label: '', value: '' },
                            { label: '', value: '' },
                          ];
                          curMetrics[1] = { ...curMetrics[1], label: e.target.value };
                          setSampleFormData({
                            ...sampleFormData,
                            sampleData: { ...sampleFormData.sampleData, metrics: curMetrics },
                          });
                        }}
                        className={`w-1/2 px-3 py-2 rounded-xl border text-xs ${inputClass}`}
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 68.4%)"
                        value={sampleFormData.sampleData.metrics?.[1]?.value || ''}
                        onChange={(e) => {
                          const curMetrics = sampleFormData.sampleData.metrics || [
                            { label: '', value: '' },
                            { label: '', value: '' },
                          ];
                          curMetrics[1] = { ...curMetrics[1], value: e.target.value };
                          setSampleFormData({
                            ...sampleFormData,
                            sampleData: { ...sampleFormData.sampleData, metrics: curMetrics },
                          });
                        }}
                        className={`w-1/2 px-3 py-2 rounded-xl border text-xs font-bold ${inputClass}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Notes / Formulas */}
                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-slate-400">
                    IE Technical Notes / Formula Breakdown
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Line efficiency formula: (Actual Output × SMV) ÷ (Operators × Working Minutes) × 100"
                    value={sampleFormData.sampleData.notes || ''}
                    onChange={(e) =>
                      setSampleFormData({
                        ...sampleFormData,
                        sampleData: { ...sampleFormData.sampleData, notes: e.target.value },
                      })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${inputClass}`}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="pt-4 border-t border-slate-800/40 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSampleModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider ${primaryBtnClass}`}
                  >
                    {editingSampleId ? 'Update Work Sample' : 'Save & Publish Sample'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
