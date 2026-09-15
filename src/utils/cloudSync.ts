/**
 * Global Real-Time Cloud Synchronization Powered by Firebase Firestore
 * Ensures executive profile photo presets & portfolio changes persist permanently
 * and synchronize across all devices, browsers, and mobile phones in real-time.
 */

import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { safeSetLocalStorage } from './safeStorage';

const PORTFOLIO_DOC_ID = 'main';

export interface GlobalProfileData {
  profilePhotoUrl: string;
  photoSlots: string[];
  activePhotoSlot: number;
}

export const DEFAULT_PHOTO_SLOTS = ['', '', '', '', ''];

/**
 * Normalizes slots array to guarantee exactly 5 items
 */
export function normalizeSlots(slots?: any[]): string[] {
  const result = [...DEFAULT_PHOTO_SLOTS];
  if (Array.isArray(slots)) {
    for (let i = 0; i < 5; i++) {
      if (typeof slots[i] === 'string') {
        result[i] = slots[i];
      }
    }
  }
  return result;
}

/**
 * Fetches the globally synchronized profile data & 5 photo slots from Firebase Firestore.
 */
export async function fetchGlobalProfileData(): Promise<GlobalProfileData | null> {
  try {
    const docRef = doc(db, 'portfolio', PORTFOLIO_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const profilePhotoUrl = typeof data?.profilePhotoUrl === 'string' ? data.profilePhotoUrl.trim() : '';
      const photoSlots = normalizeSlots(data?.photoSlots);
      const activePhotoSlot = typeof data?.activePhotoSlot === 'number' && data.activePhotoSlot >= 0 && data.activePhotoSlot < 5
        ? data.activePhotoSlot
        : 0;

      // If active slot has image but profilePhotoUrl is empty, sync it
      const resolvedPhotoUrl = profilePhotoUrl || photoSlots[activePhotoSlot] || '/profile-photo.jpg';

      // Cache locally with quota safety
      try {
        if (resolvedPhotoUrl && resolvedPhotoUrl.length < 40000) {
          safeSetLocalStorage('portfolio_profile_photo', resolvedPhotoUrl);
        }
        const safeSlots = photoSlots.map((s) => (s && s.length > 40000 ? '' : s));
        safeSetLocalStorage('portfolio_photo_slots', JSON.stringify(safeSlots));
        safeSetLocalStorage('portfolio_active_photo_slot', String(activePhotoSlot));
      } catch {
        // ignore storage error
      }

      return {
        profilePhotoUrl: resolvedPhotoUrl,
        photoSlots,
        activePhotoSlot,
      };
    }
    return null;
  } catch (err) {
    console.warn('Firebase fetch profile data fallback to local cache:', err);
    try {
      const cachedPhoto = localStorage.getItem('portfolio_profile_photo') || '/profile-photo.jpg';
      const cachedSlots = JSON.parse(localStorage.getItem('portfolio_photo_slots') || '[]');
      const cachedActive = parseInt(localStorage.getItem('portfolio_active_photo_slot') || '0', 10);
      return {
        profilePhotoUrl: cachedPhoto,
        photoSlots: normalizeSlots(cachedSlots),
        activePhotoSlot: isNaN(cachedActive) ? 0 : cachedActive,
      };
    } catch {
      return null;
    }
  }
}

/**
 * Legacy compatibility wrapper for fetching single active photo URL
 */
export async function fetchGlobalProfilePhoto(): Promise<string | null> {
  const data = await fetchGlobalProfileData();
  return data?.profilePhotoUrl || null;
}

/**
 * Saves all 5 profile photo slots and active slot selection permanently to Firebase.
 */
export async function saveGlobalProfileData(payload: {
  profilePhotoUrl: string;
  photoSlots?: string[];
  activePhotoSlot?: number;
}): Promise<boolean> {
  const cleanUrl = payload.profilePhotoUrl.trim();
  const slots = normalizeSlots(payload.photoSlots);
  const activeSlot = typeof payload.activePhotoSlot === 'number' ? payload.activePhotoSlot : 0;

  try {
    const docRef = doc(db, 'portfolio', PORTFOLIO_DOC_ID);
    await setDoc(
      docRef,
      {
        profilePhotoUrl: cleanUrl,
        photoSlots: slots,
        activePhotoSlot: activeSlot,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Save locally with quota safety
    try {
      if (cleanUrl && cleanUrl.length < 40000) {
        safeSetLocalStorage('portfolio_profile_photo', cleanUrl);
      }
      const safeSlots = slots.map((s) => (s && s.length > 40000 ? '' : s));
      safeSetLocalStorage('portfolio_photo_slots', JSON.stringify(safeSlots));
      safeSetLocalStorage('portfolio_active_photo_slot', String(activeSlot));
    } catch {
      // ignore
    }

    return true;
  } catch (err) {
    console.error('Failed to sync photo slots to Firebase Firestore:', err);
    try {
      if (cleanUrl && cleanUrl.length < 40000) {
        safeSetLocalStorage('portfolio_profile_photo', cleanUrl);
      }
      const safeSlots = slots.map((s) => (s && s.length > 40000 ? '' : s));
      safeSetLocalStorage('portfolio_photo_slots', JSON.stringify(safeSlots));
      safeSetLocalStorage('portfolio_active_photo_slot', String(activeSlot));
    } catch {
      // ignore
    }
    return false;
  }
}

/**
 * Saves the profile photo URL permanently into Firebase Firestore.
 */
export async function saveGlobalProfilePhoto(
  photoUrl: string,
  photoSlots?: string[],
  activePhotoSlot?: number
): Promise<boolean> {
  return saveGlobalProfileData({
    profilePhotoUrl: photoUrl,
    photoSlots,
    activePhotoSlot,
  });
}

/**
 * Subscribes in real-time to profile photo & 5 slots changes from Firebase Firestore.
 */
export function subscribeToGlobalProfileData(
  callback: (data: GlobalProfileData) => void
): () => void {
  try {
    const docRef = doc(db, 'portfolio', PORTFOLIO_DOC_ID);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const profilePhotoUrl = typeof data?.profilePhotoUrl === 'string' ? data.profilePhotoUrl.trim() : '';
          const photoSlots = normalizeSlots(data?.photoSlots);
          const activePhotoSlot = typeof data?.activePhotoSlot === 'number' && data.activePhotoSlot >= 0 && data.activePhotoSlot < 5
            ? data.activePhotoSlot
            : 0;

          callback({
            profilePhotoUrl: profilePhotoUrl || photoSlots[activePhotoSlot] || '',
            photoSlots,
            activePhotoSlot,
          });
        }
      },
      (err) => {
        console.warn('Firebase onSnapshot warning:', err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Failed to subscribe to Firebase Firestore:', err);
    return () => {};
  }
}

/**
 * Subscribes in real-time to profile photo changes from Firebase Firestore.
 */
export function subscribeToGlobalProfilePhoto(
  callback: (photoUrl: string) => void
): () => void {
  return subscribeToGlobalProfileData((data) => {
    if (data.profilePhotoUrl) {
      callback(data.profilePhotoUrl);
    }
  });
}

/**
 * Saves updated admin credentials to Firebase Firestore for cross-device persistence
 */
export async function syncAdminCredentialsToCloud(username: string, password: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'portfolio', PORTFOLIO_DOC_ID);
    await setDoc(
      docRef,
      {
        adminUsername: username,
        adminPassword: password,
        adminCredentialsUpdatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.warn('Failed to sync admin credentials to Firebase Firestore:', err);
    return false;
  }
}

/**
 * Fetches admin credentials from Firebase Firestore if available
 */
export async function fetchAdminCredentialsFromCloud(): Promise<{ username: string; password: string } | null> {
  try {
    const docRef = doc(db, 'portfolio', PORTFOLIO_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (typeof data?.adminUsername === 'string' && typeof data?.adminPassword === 'string') {
        return {
          username: data.adminUsername,
          password: data.adminPassword,
        };
      }
    }
  } catch (err) {
    console.warn('Failed to fetch admin credentials from cloud:', err);
  }
  return null;
}

/**
 * Unique Device Identifier to track origins and avoid echo feedback loops
 */
export function getDeviceId(): string {
  try {
    let id = localStorage.getItem('portfolio_device_id');
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
      localStorage.setItem('portfolio_device_id', id);
    }
    return id;
  } catch {
    return 'dev_default';
  }
}

export const PORTFOLIO_CONTENT_DOC_ID = 'content';

/**
 * Recursively converts nested arrays into Firestore-compatible objects
 * (since Firestore strictly throws an error if any array contains another array).
 */
export function sanitizeForFirestore(data: any): any {
  if (data === null || data === undefined) return data;
  if (Array.isArray(data)) {
    return data.map((item) => {
      if (Array.isArray(item)) {
        return { _rowValues: sanitizeForFirestore(item) };
      }
      return sanitizeForFirestore(item);
    });
  }
  if (typeof data === 'object') {
    const res: Record<string, any> = {};
    for (const key of Object.keys(data)) {
      res[key] = sanitizeForFirestore(data[key]);
    }
    return res;
  }
  return data;
}

/**
 * Reverses sanitizeForFirestore so the application receives standard nested arrays.
 */
export function restoreFromFirestore(data: any): any {
  if (data === null || data === undefined) return data;
  if (Array.isArray(data)) {
    return data.map((item) => {
      if (item && typeof item === 'object' && Array.isArray(item._rowValues)) {
        return restoreFromFirestore(item._rowValues);
      }
      return restoreFromFirestore(item);
    });
  }
  if (typeof data === 'object') {
    if (Array.isArray(data._rowValues)) {
      return restoreFromFirestore(data._rowValues);
    }
    const res: Record<string, any> = {};
    for (const key of Object.keys(data)) {
      res[key] = restoreFromFirestore(data[key]);
    }
    return res;
  }
  return data;
}

/**
 * Universal Cross-Device Portfolio Content Synchronization
 * Saves personal info, skills, tools, services, experiences, educations,
 * certifications, statistics, work samples, and job description data to Firestore.
 */
export async function savePortfolioContentToCloud(content: {
  personalInfo?: any;
  jobDescriptionData?: any;
  statistics?: any[];
  skills?: any[];
  tools?: any[];
  services?: any[];
  workProcessSteps?: any[];
  whyChooseMeItems?: any[];
  sampleWorkProjects?: any[];
  experiences?: any[];
  educations?: any[];
  certifications?: any[];
  testimonials?: any[];
}): Promise<boolean> {
  try {
    const docRef = doc(db, 'portfolio', PORTFOLIO_CONTENT_DOC_ID);
    const nowIso = new Date().toISOString();
    const deviceId = getDeviceId();

    // Clean personalInfo: avoid duplicating huge base64 data since CV/JD files
    // are stored safely in cloud_files/cv_main and cloud_files/jd_main
    const cleanPersonalInfo = { ...(content.personalInfo || {}) };
    if (typeof cleanPersonalInfo.cvUrl === 'string' && cleanPersonalInfo.cvUrl.length > 50000) {
      delete cleanPersonalInfo.cvUrl;
    }
    if (typeof cleanPersonalInfo.jdUrl === 'string' && cleanPersonalInfo.jdUrl.length > 50000) {
      delete cleanPersonalInfo.jdUrl;
    }

    const payload = {
      personalInfo: cleanPersonalInfo,
      jobDescriptionData: content.jobDescriptionData || null,
      statistics: content.statistics || [],
      skills: content.skills || [],
      tools: content.tools || [],
      services: content.services || [],
      workProcessSteps: content.workProcessSteps || [],
      whyChooseMeItems: content.whyChooseMeItems || [],
      sampleWorkProjects: content.sampleWorkProjects || [],
      experiences: content.experiences || [],
      educations: content.educations || [],
      certifications: content.certifications || [],
      testimonials: content.testimonials || [],
      updatedAt: nowIso,
      updatedByDeviceId: deviceId,
    };

    // Strip any undefined keys and recursively sanitize nested arrays
    const sanitized = sanitizeForFirestore(JSON.parse(JSON.stringify(payload)));

    await setDoc(docRef, sanitized, { merge: true });

    try {
      localStorage.setItem('portfolio_cloud_last_saved', nowIso);
    } catch {
      // ignore
    }

    return true;
  } catch (err) {
    console.error('Failed to save portfolio content to Firebase Firestore:', err);
    return false;
  }
}

/**
 * Fetches the master portfolio content from Firebase Firestore
 */
export async function fetchPortfolioContentFromCloud(): Promise<any | null> {
  try {
    const docRef = doc(db, 'portfolio', PORTFOLIO_CONTENT_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return restoreFromFirestore(docSnap.data());
    }
    return null;
  } catch (err) {
    console.warn('Failed to fetch portfolio content from cloud:', err);
    return null;
  }
}

/**
 * Real-time listener for portfolio content changes from ANY device.
 * Notifies the callback whenever any edit is made in Firestore.
 */
export function subscribeToPortfolioContent(
  callback: (data: any) => void
): () => void {
  try {
    const docRef = doc(db, 'portfolio', PORTFOLIO_CONTENT_DOC_ID);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const rawData = docSnap.data();
          const restored = restoreFromFirestore(rawData);
          callback(restored);
        }
      },
      (err) => {
        console.warn('Portfolio content onSnapshot error:', err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Failed to initialize portfolio content listener:', err);
    return () => {};
  }
}

