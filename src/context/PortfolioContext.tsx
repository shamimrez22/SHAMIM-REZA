import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PersonalInfo,
  StatItem,
  SkillItem,
  ToolItem,
  ServiceItem,
  ProcessStep,
  WhyChooseItem,
  SampleProject,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  TestimonialItem,
  JobDescriptionData,
} from '../types/portfolio';
import { initialJobDescriptionData } from '../data/jobDescriptionData';
import {
  fetchGlobalProfileData,
  saveGlobalProfileData,
  subscribeToGlobalProfileData,
  normalizeSlots,
} from '../utils/cloudSync';
import {
  personalInfo as initialPersonalInfo,
  statistics as initialStatistics,
  skills as initialSkills,
  tools as initialTools,
  services as initialServices,
  workProcess as initialProcessSteps,
  whyChooseMe as initialWhyChoose,
  sampleWorkProjects as initialSampleWork,
  experiences as initialExperiences,
  educations as initialEducations,
  certifications as initialCertifications,
  testimonials as initialTestimonials,
} from '../data/portfolioData';

export interface PortfolioFullState {
  personalInfo: PersonalInfo;
  jobDescriptionData?: JobDescriptionData;
  statistics: StatItem[];
  skills: SkillItem[];
  tools: ToolItem[];
  services: ServiceItem[];
  workProcessSteps: ProcessStep[];
  whyChooseMeItems: WhyChooseItem[];
  sampleWorkProjects: SampleProject[];
  experiences: ExperienceItem[];
  educations: EducationItem[];
  certifications: CertificationItem[];
  testimonials: TestimonialItem[];
}

interface PortfolioContextType {
  state: PortfolioFullState;
  personalInfo: PersonalInfo;
  jobDescriptionData: JobDescriptionData;
  statistics: StatItem[];
  skills: SkillItem[];
  tools: ToolItem[];
  services: ServiceItem[];
  workProcessSteps: ProcessStep[];
  whyChooseMeItems: WhyChooseItem[];
  sampleWorkProjects: SampleProject[];
  experiences: ExperienceItem[];
  educations: EducationItem[];
  certifications: CertificationItem[];
  testimonials: TestimonialItem[];

  // Actions
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateProfilePhoto: (urlOrBase64: string) => void;
  removeProfilePhoto: () => void;
  updateProfilePhotoSlot: (slotIndex: number, urlOrBase64: string) => void;
  selectProfilePhotoSlot: (slotIndex: number) => void;
  removeProfilePhotoSlot: (slotIndex: number) => void;
  uploadCV: (fileData: string, fileName: string, fileSize?: string) => void;
  removeCV: () => void;
  downloadCV: () => void;

  // Job Description Actions
  updateJobDescriptionData: (data: Partial<JobDescriptionData>) => void;
  uploadJobDescription: (fileData: string, fileName: string, fileSize?: string) => void;
  removeJobDescription: () => void;
  downloadJobDescription: () => void;

  // Modals
  isCVModalOpen: boolean;
  openCVModal: () => void;
  closeCVModal: () => void;
  isJDModalOpen: boolean;
  openJDModal: () => void;
  closeJDModal: () => void;

  // Work Samples
  addWorkSample: (sample: SampleProject) => void;
  updateWorkSample: (id: string, updated: SampleProject) => void;
  deleteWorkSample: (id: string) => void;

  // Skills
  addSkill: (skill: SkillItem) => void;
  updateSkill: (id: string, updated: SkillItem) => void;
  deleteSkill: (id: string) => void;

  // Statistics
  updateStatistics: (stats: StatItem[]) => void;

  // Experience
  addExperience: (exp: ExperienceItem) => void;
  updateExperience: (id: string, updated: ExperienceItem) => void;
  deleteExperience: (id: string) => void;

  // Global actions
  resetToDefaults: () => void;
  exportBackup: () => void;
  importBackup: (jsonString: string) => boolean;
}

const STORAGE_KEY = 'portfolio_full_state_v2';

const defaultState: PortfolioFullState = {
  personalInfo: initialPersonalInfo,
  jobDescriptionData: initialJobDescriptionData,
  statistics: initialStatistics,
  skills: initialSkills,
  tools: initialTools,
  services: initialServices,
  workProcessSteps: initialProcessSteps,
  whyChooseMeItems: initialWhyChoose,
  sampleWorkProjects: initialSampleWork,
  experiences: initialExperiences,
  educations: initialEducations,
  certifications: initialCertifications,
  testimonials: initialTestimonials,
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [isJDModalOpen, setIsJDModalOpen] = useState(false);

  const [state, setState] = useState<PortfolioFullState>(() => {
    // 0. High priority dedicated profile photo cache
    const dedicatedPhoto = localStorage.getItem('portfolio_profile_photo');
    const defaultSlots = defaultState.personalInfo.profilePhotoSlots && defaultState.personalInfo.profilePhotoSlots.length === 5
      ? defaultState.personalInfo.profilePhotoSlots
      : ['/profile-photo.jpg', '/profile-photo-slot-1.jpg', '', '/profile-photo-slot-3.jpg', '/profile-photo-slot-4.jpg'];

    let cachedSlots: string[] = defaultSlots;
    try {
      const storedSlots = JSON.parse(localStorage.getItem('portfolio_photo_slots') || '[]');
      if (Array.isArray(storedSlots) && storedSlots.some((s) => s && typeof s === 'string' && s.trim() !== '')) {
        cachedSlots = normalizeSlots(storedSlots);
      }
    } catch {
      // ignore
    }
    const cachedActive = parseInt(localStorage.getItem('portfolio_active_photo_slot') || '0', 10);
    const resolvedActive = !isNaN(cachedActive) && cachedActive >= 0 && cachedActive < 5 ? cachedActive : 0;

    const baseDefaultPhoto = defaultState.personalInfo.profilePhotoUrl || '/profile-photo.jpg';

    // 1. Try loading full state from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const savedSlots = normalizeSlots(parsed.personalInfo?.profilePhotoSlots);
        const resolvedSlots = cachedSlots.some((s) => s) ? cachedSlots : (savedSlots.some((s) => s) ? savedSlots : defaultSlots);
        const resolvedPhoto =
          dedicatedPhoto && dedicatedPhoto.trim() !== ''
            ? dedicatedPhoto
            : resolvedSlots[resolvedActive] ||
              (parsed.personalInfo?.profilePhotoUrl && parsed.personalInfo.profilePhotoUrl.trim() !== ''
                ? parsed.personalInfo.profilePhotoUrl
                : baseDefaultPhoto);

        return {
          ...defaultState,
          ...parsed,
          personalInfo: {
            ...defaultState.personalInfo,
            ...parsed.personalInfo,
            profilePhotoUrl: resolvedPhoto,
            profilePhotoSlots: resolvedSlots,
            activePhotoSlot: resolvedActive,
          },
          jobDescriptionData: {
            ...defaultState.jobDescriptionData,
            ...(parsed.jobDescriptionData || {}),
            responsibilities:
              parsed.jobDescriptionData?.responsibilities &&
              parsed.jobDescriptionData.responsibilities.length > 0
                ? parsed.jobDescriptionData.responsibilities
                : defaultState.jobDescriptionData.responsibilities,
            dailyTasks:
              parsed.jobDescriptionData?.dailyTasks &&
              parsed.jobDescriptionData.dailyTasks.length > 0
                ? parsed.jobDescriptionData.dailyTasks
                : defaultState.jobDescriptionData.dailyTasks,
          },
        };
      } catch (e) {
        console.error('Failed to parse saved portfolio state', e);
      }
    }

    // 2. Migration fallback: check legacy portfolio_user_info
    const legacyInfo = localStorage.getItem('portfolio_user_info');
    if (legacyInfo) {
      try {
        const parsedInfo = JSON.parse(legacyInfo);
        const legacyPhoto = parsedInfo.profilePhotoUrl && parsedInfo.profilePhotoUrl.trim() !== ''
          ? parsedInfo.profilePhotoUrl
          : (dedicatedPhoto || baseDefaultPhoto);
        return {
          ...defaultState,
          personalInfo: {
            ...defaultState.personalInfo,
            ...parsedInfo,
            profilePhotoUrl: legacyPhoto,
            profilePhotoSlots: cachedSlots,
            activePhotoSlot: resolvedActive,
          },
        };
      } catch (e) {
        console.error('Failed to parse legacy user info', e);
      }
    }

    // 3. Brand new device (clean cache): immediately render executive portrait asset
    const initialPhoto = dedicatedPhoto && dedicatedPhoto.trim() !== ''
      ? dedicatedPhoto
      : cachedSlots[resolvedActive] || baseDefaultPhoto;

    return {
      ...defaultState,
      personalInfo: {
        ...defaultState.personalInfo,
        profilePhotoUrl: initialPhoto,
        profilePhotoSlots: cachedSlots,
        activePhotoSlot: resolvedActive,
      },
    };
  });

  // Sync to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      // Also sync legacy key for backward compatibility
      localStorage.setItem('portfolio_user_info', JSON.stringify(state.personalInfo));
    } catch (e) {
      console.error('Failed to save portfolio state to localStorage', e);
    }
  }, [state]);

  // Sync document title with current name & title
  useEffect(() => {
    document.title = `${state.personalInfo.name} | ${state.personalInfo.title}`;
  }, [state.personalInfo.name, state.personalInfo.title]);

  // Real-time Global Cloud Synchronization via Firebase Firestore
  // Ensures ANY browser (mobile, new devices, incognito, HR recruiters) immediately receives
  // the live executive profile photo and 5 photo presets even if local storage is blank.
  useEffect(() => {
    let isMounted = true;

    // Initial fetch from Firebase
    fetchGlobalProfileData().then((cloudData) => {
      if (!isMounted || !cloudData) return;

      setState((prev) => {
        const photoChanged = prev.personalInfo.profilePhotoUrl !== cloudData.profilePhotoUrl;
        const slotsChanged = JSON.stringify(prev.personalInfo.profilePhotoSlots) !== JSON.stringify(cloudData.photoSlots);
        const activeChanged = prev.personalInfo.activePhotoSlot !== cloudData.activePhotoSlot;

        if (photoChanged || slotsChanged || activeChanged) {
          return {
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              profilePhotoUrl: cloudData.profilePhotoUrl || prev.personalInfo.profilePhotoUrl,
              profilePhotoSlots: cloudData.photoSlots,
              activePhotoSlot: cloudData.activePhotoSlot,
            },
          };
        }
        return prev;
      });
    });

    // Real-time listener: instantly catches updates from any device or admin tab
    const unsubscribe = subscribeToGlobalProfileData((liveData) => {
      if (!isMounted || !liveData) return;
      setState((prev) => {
        const photoChanged = prev.personalInfo.profilePhotoUrl !== liveData.profilePhotoUrl;
        const slotsChanged = JSON.stringify(prev.personalInfo.profilePhotoSlots) !== JSON.stringify(liveData.photoSlots);
        const activeChanged = prev.personalInfo.activePhotoSlot !== liveData.activePhotoSlot;

        if (photoChanged || slotsChanged || activeChanged) {
          return {
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              profilePhotoUrl: liveData.profilePhotoUrl || prev.personalInfo.profilePhotoUrl,
              profilePhotoSlots: liveData.photoSlots,
              activePhotoSlot: liveData.activePhotoSlot,
            },
          };
        }
        return prev;
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    setState((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        ...info,
      },
    }));
  };

  const updateProfilePhoto = (urlOrBase64: string) => {
    const cleanUrl = urlOrBase64.trim();
    try {
      if (cleanUrl) {
        localStorage.setItem('portfolio_profile_photo', cleanUrl);
      } else {
        localStorage.removeItem('portfolio_profile_photo');
      }
    } catch (e) {
      console.warn('Failed to save to portfolio_profile_photo cache', e);
    }

    setState((prev) => {
      const currentSlots = normalizeSlots(prev.personalInfo.profilePhotoSlots);
      const activeIndex = typeof prev.personalInfo.activePhotoSlot === 'number' ? prev.personalInfo.activePhotoSlot : 0;
      currentSlots[activeIndex] = cleanUrl;

      saveGlobalProfileData({
        profilePhotoUrl: cleanUrl,
        photoSlots: currentSlots,
        activePhotoSlot: activeIndex,
      });

      return {
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          profilePhotoUrl: cleanUrl,
          profilePhotoSlots: currentSlots,
        },
      };
    });
  };

  const updateProfilePhotoSlot = (slotIndex: number, urlOrBase64: string) => {
    if (slotIndex < 0 || slotIndex >= 5) return;
    const cleanVal = (urlOrBase64 || '').trim();

    setState((prev) => {
      const currentSlots = normalizeSlots(prev.personalInfo.profilePhotoSlots);
      currentSlots[slotIndex] = cleanVal;

      const activeIndex = typeof prev.personalInfo.activePhotoSlot === 'number' ? prev.personalInfo.activePhotoSlot : 0;
      const newActivePhoto = activeIndex === slotIndex ? cleanVal || prev.personalInfo.profilePhotoUrl : prev.personalInfo.profilePhotoUrl;

      saveGlobalProfileData({
        profilePhotoUrl: newActivePhoto,
        photoSlots: currentSlots,
        activePhotoSlot: activeIndex,
      });

      return {
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          profilePhotoUrl: newActivePhoto,
          profilePhotoSlots: currentSlots,
        },
      };
    });
  };

  const selectProfilePhotoSlot = (slotIndex: number) => {
    if (slotIndex < 0 || slotIndex >= 5) return;

    setState((prev) => {
      const currentSlots = normalizeSlots(prev.personalInfo.profilePhotoSlots);
      const chosenPhoto = currentSlots[slotIndex] || '';
      const newActivePhoto = chosenPhoto || prev.personalInfo.profilePhotoUrl;

      saveGlobalProfileData({
        profilePhotoUrl: newActivePhoto,
        photoSlots: currentSlots,
        activePhotoSlot: slotIndex,
      });

      return {
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          profilePhotoUrl: newActivePhoto,
          activePhotoSlot: slotIndex,
        },
      };
    });
  };

  const removeProfilePhotoSlot = (slotIndex: number) => {
    if (slotIndex < 0 || slotIndex >= 5) return;

    setState((prev) => {
      const currentSlots = normalizeSlots(prev.personalInfo.profilePhotoSlots);
      currentSlots[slotIndex] = '';

      const activeIndex = typeof prev.personalInfo.activePhotoSlot === 'number' ? prev.personalInfo.activePhotoSlot : 0;
      const newActivePhoto = activeIndex === slotIndex ? '/profile-photo.svg' : prev.personalInfo.profilePhotoUrl;

      saveGlobalProfileData({
        profilePhotoUrl: newActivePhoto,
        photoSlots: currentSlots,
        activePhotoSlot: activeIndex,
      });

      return {
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          profilePhotoUrl: newActivePhoto,
          profilePhotoSlots: currentSlots,
        },
      };
    });
  };

  const removeProfilePhoto = () => {
    try {
      localStorage.removeItem('portfolio_profile_photo');
    } catch (e) {
      console.warn('Failed to remove portfolio_profile_photo cache', e);
    }
    updatePersonalInfo({ profilePhotoUrl: '' });
    saveGlobalProfileData({
      profilePhotoUrl: '',
      photoSlots: normalizeSlots(state.personalInfo.profilePhotoSlots),
      activePhotoSlot: state.personalInfo.activePhotoSlot ?? 0,
    });
  };

  const uploadCV = (fileData: string, fileName: string, fileSize?: string) => {
    updatePersonalInfo({
      cvUrl: fileData,
      cvFileName: fileName,
      cvFileSize: fileSize || 'Document File',
      cvLastUpdated: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    });
  };

  const removeCV = () => {
    updatePersonalInfo({
      cvUrl: undefined,
      cvFileName: undefined,
      cvFileSize: undefined,
      cvLastUpdated: undefined,
    });
  };

  const downloadCV = () => {
    if (state.personalInfo.cvUrl) {
      // User uploaded custom file
      const link = document.createElement('a');
      link.href = state.personalInfo.cvUrl;
      link.download = state.personalInfo.cvFileName || `${state.personalInfo.name.replace(/\s+/g, '_')}_CV.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Generate clean professional IE Resume text file if no file uploaded
      const resumeContent = `=================================================================
CURRICULUM VITAE - ${state.personalInfo.name.toUpperCase()}
${state.personalInfo.title}
=================================================================

Contact Information:
- Email: ${state.personalInfo.email}
- Phone: ${state.personalInfo.phone}
- WhatsApp: ${state.personalInfo.whatsapp}
- Location: ${state.personalInfo.location}
- LinkedIn: ${state.personalInfo.linkedin}

Professional Summary:
${state.personalInfo.intro}

Key Competencies & Garments IE Skills:
${state.skills.map((s) => `• ${s.name} (${s.proficiency}% Proficiency) - ${s.description}`).join('\n')}

Key Performance Benchmarks:
${state.statistics.map((st) => `• ${st.label}: ${st.value}${st.suffix} - ${st.description}`).join('\n')}

Professional Experience:
${state.experiences
  .map(
    (e) => `
[${e.period}] ${e.title}
${e.company} | ${e.location}
Responsibilities:
${e.responsibilities.map((r) => `  - ${r}`).join('\n')}`
  )
  .join('\n')}

Education & Qualifications:
${state.educations.map((ed) => `• ${ed.degree} | ${ed.institution} (${ed.period}) - ${ed.details}`).join('\n')}

Certifications:
${state.certifications.map((c) => `• ${c.name} - Issued by ${c.issuer} (${c.year})`).join('\n')}

=================================================================
Generated via ${state.personalInfo.name} Professional Portfolio
Date: ${new Date().toLocaleDateString('en-GB')}
=================================================================`;

      const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${state.personalInfo.name.replace(/\s+/g, '_')}_Garments_IE_CV.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Job Description Management
  const updateJobDescriptionData = (data: Partial<JobDescriptionData>) => {
    setState((prev) => {
      const currentJD = prev.jobDescriptionData || initialJobDescriptionData;
      return {
        ...prev,
        jobDescriptionData: {
          ...currentJD,
          ...data,
        },
      };
    });
  };

  const uploadJobDescription = (fileData: string, fileName: string, fileSize?: string) => {
    updatePersonalInfo({
      jdUrl: fileData,
      jdFileName: fileName,
      jdFileSize: fileSize || 'Document File',
      jdLastUpdated: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    });
  };

  const removeJobDescription = () => {
    updatePersonalInfo({
      jdUrl: undefined,
      jdFileName: undefined,
      jdFileSize: undefined,
      jdLastUpdated: undefined,
    });
  };

  const downloadJobDescription = () => {
    if (state.personalInfo.jdUrl) {
      const link = document.createElement('a');
      link.href = state.personalInfo.jdUrl;
      link.download =
        state.personalInfo.jdFileName || `${state.personalInfo.name.replace(/\s+/g, '_')}_Job_Description.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const jd = state.jobDescriptionData || initialJobDescriptionData;
      const jdContent = `=================================================================
JOB DESCRIPTION & SCOPE OF RESPONSIBILITIES
${jd.jobTitle}
=================================================================

Department: ${jd.department}
Industry: ${jd.industry}
Reporting To: ${jd.reportingTo}
Experience: ${jd.experienceRequired}

ROLE PURPOSE & OPERATIONAL OBJECTIVE:
${jd.rolePurpose}

KEY OPERATIONAL DUTIES:
${jd.duties
  .map(
    (d) => `
DUTY ${d.dutyNumber}: ${d.title} (${d.banglaTitle})
${d.items.map((it) => `  - ${it}`).join('\n')}`
  )
  .join('\n')}

KEY PERFORMANCE INDICATORS (KPIS):
${jd.kpis.map((k) => `• ${k.title} [Target: ${k.target}]: ${k.desc}`).join('\n')}

TOOLS & OPERATIONAL SOFTWARE:
${jd.tools.map((t) => `• ${t.name} (${t.category})`).join('\n')}

CANDIDATE QUALIFICATIONS:
${jd.qualifications.map((q) => `• ${q}`).join('\n')}

=================================================================
Generated via ${state.personalInfo.name} Professional Portfolio
Date: ${new Date().toLocaleDateString('en-GB')}
=================================================================`;

      const blob = new Blob([jdContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${jd.jobTitle.replace(/[\s,/]+/g, '_')}_Job_Description.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const openCVModal = () => setIsCVModalOpen(true);
  const closeCVModal = () => setIsCVModalOpen(false);
  const openJDModal = () => setIsJDModalOpen(true);
  const closeJDModal = () => setIsJDModalOpen(false);

  // Work Samples
  const addWorkSample = (sample: SampleProject) => {
    setState((prev) => ({
      ...prev,
      sampleWorkProjects: [sample, ...prev.sampleWorkProjects],
    }));
  };

  const updateWorkSample = (id: string, updated: SampleProject) => {
    setState((prev) => ({
      ...prev,
      sampleWorkProjects: prev.sampleWorkProjects.map((p) => (p.id === id ? updated : p)),
    }));
  };

  const deleteWorkSample = (id: string) => {
    setState((prev) => ({
      ...prev,
      sampleWorkProjects: prev.sampleWorkProjects.filter((p) => p.id !== id),
    }));
  };

  // Skills
  const addSkill = (skill: SkillItem) => {
    setState((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
  };

  const updateSkill = (id: string, updated: SkillItem) => {
    setState((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? updated : s)),
    }));
  };

  const deleteSkill = (id: string) => {
    setState((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  // Statistics
  const updateStatistics = (newStats: StatItem[]) => {
    setState((prev) => ({
      ...prev,
      statistics: newStats,
    }));
  };

  // Experience
  const addExperience = (exp: ExperienceItem) => {
    setState((prev) => ({
      ...prev,
      experiences: [exp, ...prev.experiences],
    }));
  };

  const updateExperience = (id: string, updated: ExperienceItem) => {
    setState((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? updated : e)),
    }));
  };

  const deleteExperience = (id: string) => {
    setState((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  };

  // Global Actions
  const resetToDefaults = () => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('portfolio_user_info');
  };

  const exportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importBackup = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.personalInfo || !parsed.personalInfo.name) {
        throw new Error('Invalid portfolio backup format: missing personalInfo');
      }
      setState({
        ...defaultState,
        ...parsed,
      });
      return true;
    } catch (err) {
      console.error('Import failed', err);
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        state,
        personalInfo: state.personalInfo,
        jobDescriptionData: state.jobDescriptionData || initialJobDescriptionData,
        statistics: state.statistics,
        skills: state.skills,
        tools: state.tools,
        services: state.services,
        workProcessSteps: state.workProcessSteps,
        whyChooseMeItems: state.whyChooseMeItems,
        sampleWorkProjects: state.sampleWorkProjects,
        experiences: state.experiences,
        educations: state.educations,
        certifications: state.certifications,
        testimonials: state.testimonials,

        updatePersonalInfo,
        updateProfilePhoto,
        removeProfilePhoto,
        updateProfilePhotoSlot,
        selectProfilePhotoSlot,
        removeProfilePhotoSlot,
        uploadCV,
        removeCV,
        downloadCV,

        updateJobDescriptionData,
        uploadJobDescription,
        removeJobDescription,
        downloadJobDescription,

        isCVModalOpen,
        openCVModal,
        closeCVModal,
        isJDModalOpen,
        openJDModal,
        closeJDModal,

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
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
