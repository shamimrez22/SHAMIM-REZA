export type ThemeMode = 'dark' | 'light' | 'orange';

export interface PersonalInfo {
  name: string;
  title: string;
  headline: string;
  tagline: string;
  intro: string;
  aboutText: string;
  location: string;
  experienceYears: string;
  availability: string;
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  profilePhotoUrl: string;
  cvUrl?: string;
  cvFileName?: string;
  cvFileSize?: string;
  cvLastUpdated?: string;
  cvTemplatePreference?: 'modern' | 'corporate' | 'technical';

  // Job Description file fields
  jdUrl?: string;
  jdFileName?: string;
  jdFileSize?: string;
  jdLastUpdated?: string;
  jdTemplatePreference?: 'standard-sop' | 'executive' | 'floor-summary';
}

export interface DailyTaskItem {
  id: string;
  sl: number | string;
  taskDescription: string;
  repeatPerDay: number | string;
  takenTime: string;
  totalTime: string;
}

export interface JobResponsibilityItem {
  id: string;
  sl: number;
  text: string;
}

export interface JobDescriptionDuty {
  id: string;
  dutyNumber: string;
  title: string;
  banglaTitle: string;
  items: string[];
}

export interface JobDescriptionData {
  jobTitle: string;
  department: string;
  industry: string;
  reportingTo: string;
  experienceRequired: string;
  rolePurpose: string;
  responsibilities: JobResponsibilityItem[];
  dailyTasks: DailyTaskItem[];
  totalDailyMinutes?: number;
  duties: JobDescriptionDuty[];
  kpis: { id: string; title: string; desc: string; target: string }[];
  tools: { id: string; name: string; category: string }[];
  qualifications: string[];
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  description: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'core' | 'software' | 'operations';
  description: string;
  proficiency: number;
  iconName: string;
}

export interface ToolItem {
  id: string;
  name: string;
  category: string;
  description: string;
  level: string;
  iconName: string;
  features: string[];
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  deliverables: string[];
  iconName: string;
}

export interface ProcessStep {
  stepNumber: string;
  title: string;
  description: string;
  durationEstimate: string;
  keyAction: string;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
}

export interface SampleProject {
  id: string;
  title: string;
  category: string;
  description: string;
  tools: string[];
  sampleType: 'spreadsheet' | 'cleaning' | 'conversion' | 'research';
  sampleData: {
    headers: string[];
    rows: (string | number)[][];
    notes?: string;
    metrics?: { label: string; value: string }[];
  };
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
  responsibilities: string[];
  isPlaceholder?: boolean;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  details: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
  credentialId?: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  clientName: string;
  role: string;
  company: string;
  isPlaceholder?: boolean;
}
