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
  VaultDocument,
} from '../types/portfolio';
import { initialJobDescriptionData } from '../data/jobDescriptionData';
import { initialVaultDocuments } from '../data/defaultVaultData';
import { triggerFileDownload } from '../utils/fileDownloader';
import { downloadCVAsDirectPDF, downloadJobDescriptionAsDirectPDF } from '../utils/documentExport';
import {
  fetchGlobalProfileData,
  saveGlobalProfileData,
  subscribeToGlobalProfileData,
  normalizeSlots,
  savePortfolioContentToCloud,
  fetchPortfolioContentFromCloud,
  subscribeToPortfolioContent,
} from '../utils/cloudSync';
import {
  saveCloudFile,
  fetchCloudFile,
  subscribeToCloudFile,
  deleteCloudFile,
  saveVaultDocumentToCloud,
  subscribeToVaultDocumentsFromCloud,
  deleteVaultDocumentFromCloud,
  downloadAnyCloudFile,
} from '../utils/cloudFileManager';
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
  vaultDocuments?: VaultDocument[];
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
  vaultDocuments: VaultDocument[];

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

  // DATA Vault Actions
  addVaultDocument: (doc: VaultDocument) => void;
  updateVaultDocument: (id: string, updated: Partial<VaultDocument>) => void;
  deleteVaultDocument: (id: string) => void;
  downloadVaultDocument: (docOrId: VaultDocument | string) => void;

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

  // Education
  addEducation: (edu: EducationItem) => void;
  updateEducation: (id: string, updated: EducationItem) => void;
  deleteEducation: (id: string) => void;

  // Certifications
  addCertification: (cert: CertificationItem) => void;
  updateCertification: (id: string, updated: CertificationItem) => void;
  deleteCertification: (id: string) => void;

  // Real-Time Universal Cloud Sync
  cloudSyncStatus: 'synced' | 'syncing' | 'error' | 'idle';
  lastSyncedTime: string;
  syncAllToCloud: () => Promise<boolean>;

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
  vaultDocuments: initialVaultDocuments,
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

    // Check separate vault documents key
    let loadedVaultDocs = initialVaultDocuments;
    try {
      const separateVault = JSON.parse(localStorage.getItem('portfolio_vault_documents_v1') || '[]');
      if (Array.isArray(separateVault) && separateVault.length > 0) {
        loadedVaultDocs = separateVault;
      }
    } catch {
      // ignore
    }

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

        const parsedVault = Array.isArray(parsed.vaultDocuments) && parsed.vaultDocuments.length > 0
          ? parsed.vaultDocuments
          : loadedVaultDocs;

        return {
          ...defaultState,
          ...parsed,
          vaultDocuments: parsedVault,
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

  // Real-Time Global Cloud Synchronization State
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'idle'>('idle');
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('');
  const isIncomingCloudSyncRef = React.useRef(false);
  const lastSavedStateJsonRef = React.useRef<string>('');

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
  // the live executive profile photo, 5 photo presets, uploaded CV, uploaded JD, and Data Vault files.
  useEffect(() => {
    let isMounted = true;

    // 0. Universal Master Portfolio Content (Personal Info, Skills, Experiences, Educations, Certs, etc.)
    fetchPortfolioContentFromCloud().then((cloudContent) => {
      if (!isMounted) return;
      if (cloudContent && cloudContent.personalInfo) {
        isIncomingCloudSyncRef.current = true;
        setState((prev) => {
          const mergedPersonalInfo = {
            ...prev.personalInfo,
            ...(cloudContent.personalInfo || {}),
            // Preserve local active CV and JD URLs if already populated from cloud files
            cvUrl: prev.personalInfo.cvUrl || cloudContent.personalInfo?.cvUrl,
            cvFileName: prev.personalInfo.cvFileName || cloudContent.personalInfo?.cvFileName,
            cvFileSize: prev.personalInfo.cvFileSize || cloudContent.personalInfo?.cvFileSize,
            cvLastUpdated: prev.personalInfo.cvLastUpdated || cloudContent.personalInfo?.cvLastUpdated,
            jdUrl: prev.personalInfo.jdUrl || cloudContent.personalInfo?.jdUrl,
            jdFileName: prev.personalInfo.jdFileName || cloudContent.personalInfo?.jdFileName,
            jdFileSize: prev.personalInfo.jdFileSize || cloudContent.personalInfo?.jdFileSize,
            jdLastUpdated: prev.personalInfo.jdLastUpdated || cloudContent.personalInfo?.jdLastUpdated,
            profilePhotoUrl: cloudContent.personalInfo?.profilePhotoUrl || prev.personalInfo.profilePhotoUrl,
            profilePhotoSlots: cloudContent.personalInfo?.profilePhotoSlots || prev.personalInfo.profilePhotoSlots,
            activePhotoSlot: typeof cloudContent.personalInfo?.activePhotoSlot === 'number'
              ? cloudContent.personalInfo.activePhotoSlot
              : prev.personalInfo.activePhotoSlot,
          };

          return {
            ...prev,
            personalInfo: mergedPersonalInfo,
            jobDescriptionData: cloudContent.jobDescriptionData ? {
              ...(prev.jobDescriptionData || initialJobDescriptionData),
              ...cloudContent.jobDescriptionData,
            } : prev.jobDescriptionData,
            statistics: Array.isArray(cloudContent.statistics) && cloudContent.statistics.length > 0 ? cloudContent.statistics : prev.statistics,
            skills: Array.isArray(cloudContent.skills) && cloudContent.skills.length > 0 ? cloudContent.skills : prev.skills,
            tools: Array.isArray(cloudContent.tools) && cloudContent.tools.length > 0 ? cloudContent.tools : prev.tools,
            services: Array.isArray(cloudContent.services) && cloudContent.services.length > 0 ? cloudContent.services : prev.services,
            workProcessSteps: Array.isArray(cloudContent.workProcessSteps) && cloudContent.workProcessSteps.length > 0 ? cloudContent.workProcessSteps : prev.workProcessSteps,
            whyChooseMeItems: Array.isArray(cloudContent.whyChooseMeItems) && cloudContent.whyChooseMeItems.length > 0 ? cloudContent.whyChooseMeItems : prev.whyChooseMeItems,
            sampleWorkProjects: Array.isArray(cloudContent.sampleWorkProjects) && cloudContent.sampleWorkProjects.length > 0 ? cloudContent.sampleWorkProjects : prev.sampleWorkProjects,
            experiences: Array.isArray(cloudContent.experiences) && cloudContent.experiences.length > 0 ? cloudContent.experiences : prev.experiences,
            educations: Array.isArray(cloudContent.educations) && cloudContent.educations.length > 0 ? cloudContent.educations : prev.educations,
            certifications: Array.isArray(cloudContent.certifications) && cloudContent.certifications.length > 0 ? cloudContent.certifications : prev.certifications,
            testimonials: Array.isArray(cloudContent.testimonials) && cloudContent.testimonials.length > 0 ? cloudContent.testimonials : prev.testimonials,
          };
        });
        setCloudSyncStatus('synced');
        setLastSyncedTime(new Date().toLocaleTimeString());
      } else {
        // Seed Firestore if fresh
        savePortfolioContentToCloud(defaultState).then(() => {
          setCloudSyncStatus('synced');
          setLastSyncedTime(new Date().toLocaleTimeString());
        });
      }
    });

    // Real-Time Listener for Content Changes from other devices
    const unsubContent = subscribeToPortfolioContent((cloudContent, isFromOtherDevice) => {
      if (!isMounted || !cloudContent) return;
      if (isFromOtherDevice) {
        isIncomingCloudSyncRef.current = true;
        setState((prev) => {
          return {
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              ...(cloudContent.personalInfo || {}),
              cvUrl: prev.personalInfo.cvUrl || cloudContent.personalInfo?.cvUrl,
              cvFileName: prev.personalInfo.cvFileName || cloudContent.personalInfo?.cvFileName,
              cvFileSize: prev.personalInfo.cvFileSize || cloudContent.personalInfo?.cvFileSize,
              cvLastUpdated: prev.personalInfo.cvLastUpdated || cloudContent.personalInfo?.cvLastUpdated,
              jdUrl: prev.personalInfo.jdUrl || cloudContent.personalInfo?.jdUrl,
              jdFileName: prev.personalInfo.jdFileName || cloudContent.personalInfo?.jdFileName,
              jdFileSize: prev.personalInfo.jdFileSize || cloudContent.personalInfo?.jdFileSize,
              jdLastUpdated: prev.personalInfo.jdLastUpdated || cloudContent.personalInfo?.jdLastUpdated,
              profilePhotoUrl: cloudContent.personalInfo?.profilePhotoUrl || prev.personalInfo.profilePhotoUrl,
              profilePhotoSlots: cloudContent.personalInfo?.profilePhotoSlots || prev.personalInfo.profilePhotoSlots,
              activePhotoSlot: typeof cloudContent.personalInfo?.activePhotoSlot === 'number'
                ? cloudContent.personalInfo.activePhotoSlot
                : prev.personalInfo.activePhotoSlot,
            },
            jobDescriptionData: cloudContent.jobDescriptionData ? {
              ...(prev.jobDescriptionData || initialJobDescriptionData),
              ...cloudContent.jobDescriptionData,
            } : prev.jobDescriptionData,
            statistics: Array.isArray(cloudContent.statistics) && cloudContent.statistics.length > 0 ? cloudContent.statistics : prev.statistics,
            skills: Array.isArray(cloudContent.skills) && cloudContent.skills.length > 0 ? cloudContent.skills : prev.skills,
            tools: Array.isArray(cloudContent.tools) && cloudContent.tools.length > 0 ? cloudContent.tools : prev.tools,
            services: Array.isArray(cloudContent.services) && cloudContent.services.length > 0 ? cloudContent.services : prev.services,
            workProcessSteps: Array.isArray(cloudContent.workProcessSteps) && cloudContent.workProcessSteps.length > 0 ? cloudContent.workProcessSteps : prev.workProcessSteps,
            whyChooseMeItems: Array.isArray(cloudContent.whyChooseMeItems) && cloudContent.whyChooseMeItems.length > 0 ? cloudContent.whyChooseMeItems : prev.whyChooseMeItems,
            sampleWorkProjects: Array.isArray(cloudContent.sampleWorkProjects) && cloudContent.sampleWorkProjects.length > 0 ? cloudContent.sampleWorkProjects : prev.sampleWorkProjects,
            experiences: Array.isArray(cloudContent.experiences) && cloudContent.experiences.length > 0 ? cloudContent.experiences : prev.experiences,
            educations: Array.isArray(cloudContent.educations) && cloudContent.educations.length > 0 ? cloudContent.educations : prev.educations,
            certifications: Array.isArray(cloudContent.certifications) && cloudContent.certifications.length > 0 ? cloudContent.certifications : prev.certifications,
            testimonials: Array.isArray(cloudContent.testimonials) && cloudContent.testimonials.length > 0 ? cloudContent.testimonials : prev.testimonials,
          };
        });
        setCloudSyncStatus('synced');
        setLastSyncedTime(new Date().toLocaleTimeString());
      } else {
        setCloudSyncStatus('synced');
        setLastSyncedTime(new Date().toLocaleTimeString());
      }
    });

    // 1. Initial fetch & real-time listener for profile data & photos
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

    const unsubProfile = subscribeToGlobalProfileData((liveData) => {
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

    // 2. Real-time listener for Universal Cloud CV
    const unsubCV = subscribeToCloudFile('cv_main', (cloudCV) => {
      if (!isMounted) return;
      if (cloudCV && cloudCV.fileData) {
        setState((prev) => {
          if (
            prev.personalInfo.cvUrl === cloudCV.fileData &&
            prev.personalInfo.cvFileName === cloudCV.fileName
          ) {
            return prev;
          }
          return {
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              cvUrl: cloudCV.fileData,
              cvFileName: cloudCV.fileName,
              cvFileSize: cloudCV.fileSize,
              cvLastUpdated: cloudCV.uploadedAt || prev.personalInfo.cvLastUpdated,
            },
          };
        });
      } else if (cloudCV === null) {
        // If removed from cloud by another device
        setState((prev) => {
          if (!prev.personalInfo.cvUrl) return prev;
          return {
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              cvUrl: undefined,
              cvFileName: undefined,
              cvFileSize: undefined,
              cvLastUpdated: undefined,
            },
          };
        });
      }
    });

    // 3. Real-time listener for Universal Cloud Job Description
    const unsubJD = subscribeToCloudFile('jd_main', (cloudJD) => {
      if (!isMounted) return;
      if (cloudJD && cloudJD.fileData) {
        setState((prev) => {
          if (
            prev.personalInfo.jdUrl === cloudJD.fileData &&
            prev.personalInfo.jdFileName === cloudJD.fileName
          ) {
            return prev;
          }
          return {
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              jdUrl: cloudJD.fileData,
              jdFileName: cloudJD.fileName,
              jdFileSize: cloudJD.fileSize,
              jdLastUpdated: cloudJD.uploadedAt || prev.personalInfo.jdLastUpdated,
            },
          };
        });
      } else if (cloudJD === null) {
        // If removed from cloud
        setState((prev) => {
          if (!prev.personalInfo.jdUrl) return prev;
          return {
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              jdUrl: undefined,
              jdFileName: undefined,
              jdFileSize: undefined,
              jdLastUpdated: undefined,
            },
          };
        });
      }
    });

    // 4. Real-time listener for Data Vault documents
    const unsubVault = subscribeToVaultDocumentsFromCloud((cloudDocs) => {
      if (!isMounted) return;
      if (Array.isArray(cloudDocs) && cloudDocs.length > 0) {
        setState((prev) => ({
          ...prev,
          vaultDocuments: cloudDocs,
        }));
      }
    });

    return () => {
      isMounted = false;
      unsubContent();
      unsubProfile();
      unsubCV();
      unsubJD();
      unsubVault();
    };
  }, []);

  // Universal Auto-Save to Firebase Cloud with Debounce (700ms)
  // Ensures ANY edit (text, number, skill, job description, experience, stats)
  // is immediately stored in Firestore and broadcasts live to all devices!
  useEffect(() => {
    if (isIncomingCloudSyncRef.current) {
      isIncomingCloudSyncRef.current = false;
      return;
    }

    const payloadToCompare = {
      personalInfo: state.personalInfo,
      jobDescriptionData: state.jobDescriptionData,
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
    };

    const jsonStr = JSON.stringify(payloadToCompare);
    if (jsonStr === lastSavedStateJsonRef.current) {
      return;
    }

    setCloudSyncStatus('syncing');
    const timer = setTimeout(async () => {
      lastSavedStateJsonRef.current = jsonStr;
      const ok = await savePortfolioContentToCloud(payloadToCompare);
      if (ok) {
        setCloudSyncStatus('synced');
        setLastSyncedTime(new Date().toLocaleTimeString());
      } else {
        setCloudSyncStatus('error');
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [
    state.personalInfo,
    state.jobDescriptionData,
    state.statistics,
    state.skills,
    state.tools,
    state.services,
    state.workProcessSteps,
    state.whyChooseMeItems,
    state.sampleWorkProjects,
    state.experiences,
    state.educations,
    state.certifications,
    state.testimonials,
  ]);

  // Instant explicit manual sync trigger
  const syncAllToCloud = async (): Promise<boolean> => {
    setCloudSyncStatus('syncing');
    const payload = {
      personalInfo: state.personalInfo,
      jobDescriptionData: state.jobDescriptionData,
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
    };
    lastSavedStateJsonRef.current = JSON.stringify(payload);
    const ok = await savePortfolioContentToCloud(payload);
    if (ok) {
      setCloudSyncStatus('synced');
      setLastSyncedTime(new Date().toLocaleTimeString());
    } else {
      setCloudSyncStatus('error');
    }
    return ok;
  };

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
    const formattedDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const sizeStr = fileSize || 'Document File';

    // Optimistic local state update for instant UI feedback
    updatePersonalInfo({
      cvUrl: fileData,
      cvFileName: fileName,
      cvFileSize: sizeStr,
      cvLastUpdated: formattedDate,
    });

    // Cloud Firebase persistence: ensures file is immediately live across all devices
    saveCloudFile({
      fileId: 'cv_main',
      fileName,
      fileSize: sizeStr,
      fileType: 'cv',
      fileData,
      title: `${state.personalInfo.name} - Executive CV`,
      category: 'Curriculum Vitae',
    });
  };

  const removeCV = () => {
    updatePersonalInfo({
      cvUrl: undefined,
      cvFileName: undefined,
      cvFileSize: undefined,
      cvLastUpdated: undefined,
    });
    deleteCloudFile('cv_main');
  };

  const downloadCV = async () => {
    try {
      if (state.personalInfo.cvUrl) {
        // User uploaded custom file - download exact uploaded file with exact extension and raw bytes
        await triggerFileDownload(
          state.personalInfo.cvUrl,
          state.personalInfo.cvFileName || `${state.personalInfo.name.replace(/\s+/g, '_')}_CV.pdf`
        );
        return;
      }

      // Check if it exists in Firebase Cloud File storage first
      const cloudCV = await fetchCloudFile('cv_main');
      if (cloudCV && cloudCV.fileData) {
        // Update local state cache for instant subsequent clicks
        updatePersonalInfo({
          cvUrl: cloudCV.fileData,
          cvFileName: cloudCV.fileName,
          cvFileSize: cloudCV.fileSize,
        });
        await triggerFileDownload(cloudCV.fileData, cloudCV.fileName || 'CV.pdf');
        return;
      }

      // Fallback: Generate high-resolution executive vector A4 PDF
      downloadCVAsDirectPDF(
        state.personalInfo,
        state.statistics,
        state.skills,
        state.experiences,
        state.educations,
        state.certifications,
        state.personalInfo.cvTemplatePreference || 'Modern_Executive'
      );
    } catch (err) {
      console.error('downloadCV failed, falling back to direct PDF:', err);
      downloadCVAsDirectPDF(
        state.personalInfo,
        state.statistics,
        state.skills,
        state.experiences,
        state.educations,
        state.certifications,
        'Modern_Executive'
      );
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
    const formattedDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const sizeStr = fileSize || 'Document File';

    // Optimistic local state update
    updatePersonalInfo({
      jdUrl: fileData,
      jdFileName: fileName,
      jdFileSize: sizeStr,
      jdLastUpdated: formattedDate,
    });

    // Cloud Firebase persistence
    saveCloudFile({
      fileId: 'jd_main',
      fileName,
      fileSize: sizeStr,
      fileType: 'job_description',
      fileData,
      title: `${state.personalInfo.name} - Job Description`,
      category: 'Scope of Responsibilities',
    });
  };

  const removeJobDescription = () => {
    updatePersonalInfo({
      jdUrl: undefined,
      jdFileName: undefined,
      jdFileSize: undefined,
      jdLastUpdated: undefined,
    });
    deleteCloudFile('jd_main');
  };

  const downloadJobDescription = async () => {
    try {
      if (state.personalInfo.jdUrl) {
        // User uploaded custom file - download exact uploaded file with exact extension and raw bytes
        await triggerFileDownload(
          state.personalInfo.jdUrl,
          state.personalInfo.jdFileName || `${state.personalInfo.name.replace(/\s+/g, '_')}_Job_Description.pdf`
        );
        return;
      }

      const cloudJD = await fetchCloudFile('jd_main');
      if (cloudJD && cloudJD.fileData) {
        // Update local state cache for instant subsequent clicks
        updatePersonalInfo({
          jdUrl: cloudJD.fileData,
          jdFileName: cloudJD.fileName,
          jdFileSize: cloudJD.fileSize,
        });
        await triggerFileDownload(cloudJD.fileData, cloudJD.fileName || 'Job_Description.pdf');
        return;
      }

      const jd = state.jobDescriptionData || initialJobDescriptionData;
      downloadJobDescriptionAsDirectPDF(
        jd,
        state.personalInfo.name || 'Md. Shamim Reza',
        'Executive_Report'
      );
    } catch (err) {
      console.error('downloadJobDescription failed, falling back to direct PDF:', err);
      const jd = state.jobDescriptionData || initialJobDescriptionData;
      downloadJobDescriptionAsDirectPDF(
        jd,
        state.personalInfo.name || 'Md. Shamim Reza',
        'Executive_Report'
      );
    }
  };

  // DATA Vault Actions
  const addVaultDocument = (doc: VaultDocument) => {
    setState((prev) => {
      const existing = prev.vaultDocuments || initialVaultDocuments;
      const updatedDocs = [doc, ...existing];
      try {
        localStorage.setItem('portfolio_vault_documents_v1', JSON.stringify(updatedDocs));
      } catch (e) {
        console.warn('LocalStorage quota warning for vault documents:', e);
      }
      return {
        ...prev,
        vaultDocuments: updatedDocs,
      };
    });
    // Cloud Firebase persistence
    saveVaultDocumentToCloud(doc);
  };

  const updateVaultDocument = (id: string, updated: Partial<VaultDocument>) => {
    setState((prev) => {
      const existing = prev.vaultDocuments || initialVaultDocuments;
      const updatedDocs = existing.map((d) => (d.id === id ? { ...d, ...updated } : d));
      try {
        localStorage.setItem('portfolio_vault_documents_v1', JSON.stringify(updatedDocs));
      } catch (e) {
        console.warn('LocalStorage quota warning for vault documents:', e);
      }
      const targetDoc = updatedDocs.find((d) => d.id === id);
      if (targetDoc) {
        saveVaultDocumentToCloud(targetDoc);
      }
      return {
        ...prev,
        vaultDocuments: updatedDocs,
      };
    });
  };

  const deleteVaultDocument = (id: string) => {
    setState((prev) => {
      const existing = prev.vaultDocuments || initialVaultDocuments;
      const updatedDocs = existing.filter((d) => d.id !== id);
      try {
        localStorage.setItem('portfolio_vault_documents_v1', JSON.stringify(updatedDocs));
      } catch (e) {
        console.warn('LocalStorage quota warning for vault documents:', e);
      }
      return {
        ...prev,
        vaultDocuments: updatedDocs,
      };
    });
    // Cloud deletion
    deleteVaultDocumentFromCloud(id);
  };

  const downloadVaultDocument = (docOrId: VaultDocument | string) => {
    const doc = typeof docOrId === 'string'
      ? (state.vaultDocuments || initialVaultDocuments).find((d) => d.id === docOrId)
      : docOrId;

    if (doc) {
      downloadAnyCloudFile(doc, doc.fileName || doc.title);
    } else if (typeof docOrId === 'string') {
      downloadAnyCloudFile(docOrId);
    } else {
      console.warn('Document or file data not found for download');
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

  // Education Actions
  const addEducation = (edu: EducationItem) => {
    setState((prev) => ({
      ...prev,
      educations: [edu, ...prev.educations],
    }));
  };

  const updateEducation = (id: string, updated: EducationItem) => {
    setState((prev) => ({
      ...prev,
      educations: prev.educations.map((e) => (e.id === id ? updated : e)),
    }));
  };

  const deleteEducation = (id: string) => {
    setState((prev) => ({
      ...prev,
      educations: prev.educations.filter((e) => e.id !== id),
    }));
  };

  // Certification Actions
  const addCertification = (cert: CertificationItem) => {
    setState((prev) => ({
      ...prev,
      certifications: [cert, ...prev.certifications],
    }));
  };

  const updateCertification = (id: string, updated: CertificationItem) => {
    setState((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) => (c.id === id ? updated : c)),
    }));
  };

  const deleteCertification = (id: string) => {
    setState((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
  };

  // Global Actions
  const resetToDefaults = () => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('portfolio_user_info');
    savePortfolioContentToCloud(defaultState);
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
      const nextState = {
        ...defaultState,
        ...parsed,
      };
      setState(nextState);
      savePortfolioContentToCloud(nextState);
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
        vaultDocuments: state.vaultDocuments || initialVaultDocuments,

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

        addVaultDocument,
        updateVaultDocument,
        deleteVaultDocument,
        downloadVaultDocument,

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

        addEducation,
        updateEducation,
        deleteEducation,

        addCertification,
        updateCertification,
        deleteCertification,

        cloudSyncStatus,
        lastSyncedTime,
        syncAllToCloud,

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
