/**
 * Global Real-Time Cloud Synchronization Powered by Firebase Firestore
 * Ensures executive profile photo presets & portfolio changes persist permanently
 * and synchronize across all devices, browsers, and mobile phones in real-time.
 */

import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

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
      const resolvedPhotoUrl = profilePhotoUrl || photoSlots[activePhotoSlot] || '';

      // Cache locally
      try {
        if (resolvedPhotoUrl) localStorage.setItem('portfolio_profile_photo', resolvedPhotoUrl);
        localStorage.setItem('portfolio_photo_slots', JSON.stringify(photoSlots));
        localStorage.setItem('portfolio_active_photo_slot', String(activePhotoSlot));
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
      const cachedPhoto = localStorage.getItem('portfolio_profile_photo') || '';
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

    // Save locally
    try {
      localStorage.setItem('portfolio_profile_photo', cleanUrl);
      localStorage.setItem('portfolio_photo_slots', JSON.stringify(slots));
      localStorage.setItem('portfolio_active_photo_slot', String(activeSlot));
    } catch {
      // ignore
    }

    return true;
  } catch (err) {
    console.error('Failed to sync photo slots to Firebase Firestore:', err);
    try {
      localStorage.setItem('portfolio_profile_photo', cleanUrl);
      localStorage.setItem('portfolio_photo_slots', JSON.stringify(slots));
      localStorage.setItem('portfolio_active_photo_slot', String(activeSlot));
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

