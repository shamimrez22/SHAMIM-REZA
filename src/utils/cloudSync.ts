/**
 * Global Real-Time Cloud Synchronization Powered by Firebase Firestore
 * Ensures executive profile photo & portfolio changes persist permanently
 * and synchronize across all devices, browsers, and mobile phones in real-time.
 */

import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const PORTFOLIO_DOC_ID = 'main';

/**
 * Fetches the globally synchronized profile photo URL from Firebase Firestore.
 * Works from any browser, device, or incognito mode.
 */
export async function fetchGlobalProfilePhoto(): Promise<string | null> {
  try {
    const docRef = doc(db, 'portfolio', PORTFOLIO_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data?.profilePhotoUrl && typeof data.profilePhotoUrl === 'string') {
        const url = data.profilePhotoUrl.trim();
        if (url.length > 0) {
          // Cache locally for instant offline loading
          try {
            localStorage.setItem('portfolio_profile_photo', url);
          } catch {
            // ignore localStorage quota errors
          }
          return url;
        }
      }
    }
    return null;
  } catch (err) {
    console.warn('Firebase fetch profile photo fallback to local cache:', err);
    // Fallback to local storage if offline
    try {
      return localStorage.getItem('portfolio_profile_photo');
    } catch {
      return null;
    }
  }
}

/**
 * Saves the profile photo URL permanently into Firebase Firestore.
 * Instantly broadcasts the new photo to all browsers and devices worldwide.
 */
export async function saveGlobalProfilePhoto(photoUrl: string): Promise<boolean> {
  const cleanUrl = photoUrl.trim();
  try {
    const docRef = doc(db, 'portfolio', PORTFOLIO_DOC_ID);
    await setDoc(
      docRef,
      {
        profilePhotoUrl: cleanUrl,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Save locally
    try {
      localStorage.setItem('portfolio_profile_photo', cleanUrl);
    } catch {
      // ignore
    }

    return true;
  } catch (err) {
    console.error('Failed to sync photo to Firebase Firestore:', err);
    // Even if remote write fails temporarily, save locally
    try {
      localStorage.setItem('portfolio_profile_photo', cleanUrl);
    } catch {
      // ignore
    }
    return false;
  }
}

/**
 * Subscribes in real-time to profile photo changes from Firebase Firestore.
 * When an admin changes the photo on mobile or PC, all other open clients update immediately.
 */
export function subscribeToGlobalProfilePhoto(
  callback: (photoUrl: string) => void
): () => void {
  try {
    const docRef = doc(db, 'portfolio', PORTFOLIO_DOC_ID);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data?.profilePhotoUrl && typeof data.profilePhotoUrl === 'string') {
            const url = data.profilePhotoUrl.trim();
            if (url) {
              callback(url);
            }
          }
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
