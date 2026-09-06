import { ThemeMode } from '../types/portfolio';
import { PortfolioFullState } from '../context/PortfolioContext';

/**
 * Generates the complete TypeScript source code for src/data/portfolioData.ts
 * so that when deployed to Vercel or Cloudflare, ALL devices immediately load
 * with the exact theme, profile photo, job description, and custom edits configured by Admin.
 */
export function generatePortfolioDataSourceCode(state: PortfolioFullState, masterTheme: ThemeMode): string {
  // Ensure profilePhotoUrl has a reliable value
  const cleanPersonalInfo = {
    ...state.personalInfo,
    profilePhotoUrl: state.personalInfo.profilePhotoUrl || '/profile-photo.svg',
  };

  return `import {
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
} from '../types/portfolio';

/**
 * ============================================================================
 * CENTRAL CONFIGURATION DATA FILE (EXPORTED FROM ADMIN PANEL)
 * Configured for: GARMENTS SECTOR INDUSTRIAL ENGINEERING (IE) REPORT & DATA ENTRY EXECUTIVE
 * Master Theme: ${masterTheme.toUpperCase()}
 * Profile Photo: ${cleanPersonalInfo.profilePhotoUrl ? 'CONFIGURED' : 'DEFAULT ASSET'}
 * ============================================================================
 */

export const defaultMasterTheme: 'orange' | 'dark' | 'light' = '${masterTheme}';

export const personalInfo: PersonalInfo = ${JSON.stringify(cleanPersonalInfo, null, 2)};

export const statistics: StatItem[] = ${JSON.stringify(state.statistics, null, 2)};

export const skills: SkillItem[] = ${JSON.stringify(state.skills, null, 2)};

export const tools: ToolItem[] = ${JSON.stringify(state.tools, null, 2)};

export const services: ServiceItem[] = ${JSON.stringify(state.services, null, 2)};

export const workProcess: ProcessStep[] = ${JSON.stringify(state.workProcessSteps, null, 2)};

export const whyChooseMe: WhyChooseItem[] = ${JSON.stringify(state.whyChooseMeItems, null, 2)};

export const sampleWorkProjects: SampleProject[] = ${JSON.stringify(state.sampleWorkProjects, null, 2)};

export const experiences: ExperienceItem[] = ${JSON.stringify(state.experiences, null, 2)};

export const educations: EducationItem[] = ${JSON.stringify(state.educations, null, 2)};

export const certifications: CertificationItem[] = ${JSON.stringify(state.certifications, null, 2)};

export const testimonials: TestimonialItem[] = ${JSON.stringify(state.testimonials, null, 2)};
`;
}

/**
 * Triggers a browser download of portfolioData.ts file
 */
export function downloadPortfolioDataSource(state: PortfolioFullState, masterTheme: ThemeMode): void {
  const code = generatePortfolioDataSourceCode(state, masterTheme);
  const blob = new Blob([code], { type: 'text/typescript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'portfolioData.ts';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads the user's uploaded base64 photo as a local PNG/JPG file
 * to place in public/profile-photo.png for permanent deployment
 */
export function downloadProfilePhotoFile(photoDataUrl: string, fileName = 'profile-photo.png'): void {
  if (!photoDataUrl) return;

  if (photoDataUrl.startsWith('data:')) {
    const link = document.createElement('a');
    link.href = photoDataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // It's a URL, open in new tab to save
    window.open(photoDataUrl, '_blank');
  }
}
