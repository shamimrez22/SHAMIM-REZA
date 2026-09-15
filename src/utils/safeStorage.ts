/**
 * Resilient & Safe LocalStorage & IndexedDB Hybrid Storage Manager
 * 
 * Solves "Setting the value of 'portfolio_full_state_v2' exceeded the quota"
 * 
 * Strategy:
 * 1. Lightweight Metadata & Text -> localStorage (instant synchronous boot, ~50KB)
 * 2. Heavy Binary Files (CV PDFs, JD PDFs, Vault Documents, large Base64 images) -> IndexedDB & Firestore
 * 3. Proactive quota recovery: cleans up redundant/bloated keys if quota is threatened.
 */

import { PortfolioFullState } from '../context/PortfolioContext';
import { VaultDocument } from '../types/portfolio';
import { getIdbItem, setIdbItem, removeIdbItem } from './idbStorage';

const IDB_CV_KEY = 'heavy_cv_file';
const IDB_JD_KEY = 'heavy_jd_file';
const IDB_VAULT_PREFIX = 'heavy_vault_doc_';
const MAX_LOCALSTORAGE_STRING_LEN = 40000; // ~40KB per data URL field

/**
 * Checks if a string is a heavy base64 data URL
 */
function isHeavyDataUrl(str: any): boolean {
  return typeof str === 'string' && str.startsWith('data:') && str.length > MAX_LOCALSTORAGE_STRING_LEN;
}

/**
 * Strips heavy data URLs from portfolio state so it fits easily within localStorage's 5MB quota.
 * The heavy binary data is safely stored in IndexedDB and Firebase Firestore.
 */
export function sanitizeStateForLocalStorage(state: PortfolioFullState): any {
  try {
    const cloned = { ...state };

    // 1. Sanitize personalInfo (CV and JD data URLs)
    if (cloned.personalInfo) {
      const pInfo = { ...cloned.personalInfo };

      if (isHeavyDataUrl(pInfo.cvUrl)) {
        // Keep file metadata intact, omit massive base64 payload from localStorage
        pInfo.cvUrl = '';
      }

      if (isHeavyDataUrl(pInfo.jdUrl)) {
        pInfo.jdUrl = '';
      }

      // If photo slots have massive base64 strings, trim them in localStorage copy
      if (Array.isArray(pInfo.profilePhotoSlots)) {
        pInfo.profilePhotoSlots = pInfo.profilePhotoSlots.map((slot) => {
          if (isHeavyDataUrl(slot)) {
            return ''; // Rely on IndexedDB/Firestore/active photo
          }
          return slot;
        });
      }

      if (isHeavyDataUrl(pInfo.profilePhotoUrl)) {
        pInfo.profilePhotoUrl = '';
      }

      cloned.personalInfo = pInfo;
    }

    // 2. Sanitize vaultDocuments (omit fileData base64 strings)
    if (Array.isArray(cloned.vaultDocuments)) {
      cloned.vaultDocuments = cloned.vaultDocuments.map((doc) => {
        if (doc.fileData && doc.fileData.length > 5000) {
          const { fileData, ...meta } = doc;
          return { ...meta, fileData: '' };
        }
        return doc;
      });
    }

    return cloned;
  } catch (err) {
    console.warn('Error sanitizing state for localStorage:', err);
    return state;
  }
}

/**
 * Safely writes a key-value pair to localStorage with automated quota-recovery.
 * Never throws an unhandled QuotaExceededError.
 */
export function safeSetLocalStorage(key: string, value: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;

  try {
    // Some browsers require removing the old key first when quota is tight
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    const isQuotaError =
      err?.name === 'QuotaExceededError' ||
      err?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      err?.code === 22 ||
      err?.code === 1014 ||
      (typeof err?.message === 'string' && err.message.toLowerCase().includes('quota'));

    if (!isQuotaError) {
      console.warn(`Failed to set localStorage key "${key}":`, err);
      return false;
    }

    // Quota exceeded: Perform automated cleanup of redundant / legacy keys
    try {
      console.warn(`LocalStorage quota exceeded on key "${key}". Running automated storage cleanup...`);
      
      // Clean up legacy redundant keys
      window.localStorage.removeItem('portfolio_user_info');
      window.localStorage.removeItem('portfolio_vault_documents_v1');
      window.localStorage.removeItem('portfolio_photo_slots');
      window.localStorage.removeItem('portfolio_profile_photo');

      // Retry after cleanup
      window.localStorage.removeItem(key);
      window.localStorage.setItem(key, value);
      return true;
    } catch (retryErr) {
      console.warn(`LocalStorage still exceeded quota after cleanup for key "${key}". Skipping localStorage cache.`);
      return false;
    }
  }
}

/**
 * Saves heavy binary files asynchronously into IndexedDB without blocking the UI
 * or consuming localStorage quota.
 */
export async function persistHeavyFilesToIndexedDB(state: PortfolioFullState): Promise<void> {
  try {
    // 1. Persist CV
    if (state.personalInfo?.cvUrl && isHeavyDataUrl(state.personalInfo.cvUrl)) {
      await setIdbItem(IDB_CV_KEY, {
        cvUrl: state.personalInfo.cvUrl,
        cvFileName: state.personalInfo.cvFileName,
        cvFileSize: state.personalInfo.cvFileSize,
        cvLastUpdated: state.personalInfo.cvLastUpdated,
      });
    }

    // 2. Persist JD
    if (state.personalInfo?.jdUrl && isHeavyDataUrl(state.personalInfo.jdUrl)) {
      await setIdbItem(IDB_JD_KEY, {
        jdUrl: state.personalInfo.jdUrl,
        jdFileName: state.personalInfo.jdFileName,
        jdFileSize: state.personalInfo.jdFileSize,
        jdLastUpdated: state.personalInfo.jdLastUpdated,
      });
    }

    // 3. Persist Vault Documents with fileData
    if (Array.isArray(state.vaultDocuments)) {
      for (const doc of state.vaultDocuments) {
        if (doc.id && doc.fileData && doc.fileData.length > 5000) {
          await setIdbItem(`${IDB_VAULT_PREFIX}${doc.id}`, doc.fileData);
        }
      }
    }
  } catch (err) {
    console.warn('Failed to persist heavy files to IndexedDB:', err);
  }
}

/**
 * Restores heavy binary files from IndexedDB into the in-memory state.
 */
export async function restoreHeavyFilesFromIndexedDB(
  currentState: PortfolioFullState
): Promise<Partial<PortfolioFullState> | null> {
  try {
    const patches: Partial<PortfolioFullState> = {};
    let hasPatches = false;

    // 1. Restore CV if state currently doesn't have the data URL
    if (!currentState.personalInfo?.cvUrl) {
      const cachedCV = await getIdbItem<{ cvUrl: string; cvFileName?: string; cvFileSize?: string }>(IDB_CV_KEY);
      if (cachedCV?.cvUrl) {
        patches.personalInfo = {
          ...(patches.personalInfo || currentState.personalInfo),
          cvUrl: cachedCV.cvUrl,
          cvFileName: cachedCV.cvFileName || currentState.personalInfo?.cvFileName,
          cvFileSize: cachedCV.cvFileSize || currentState.personalInfo?.cvFileSize,
        };
        hasPatches = true;
      }
    }

    // 2. Restore JD if state currently doesn't have the data URL
    if (!currentState.personalInfo?.jdUrl) {
      const cachedJD = await getIdbItem<{ jdUrl: string; jdFileName?: string; jdFileSize?: string }>(IDB_JD_KEY);
      if (cachedJD?.jdUrl) {
        patches.personalInfo = {
          ...(patches.personalInfo || currentState.personalInfo),
          jdUrl: cachedJD.jdUrl,
          jdFileName: cachedJD.jdFileName || currentState.personalInfo?.jdFileName,
          jdFileSize: cachedJD.jdFileSize || currentState.personalInfo?.jdFileSize,
        };
        hasPatches = true;
      }
    }

    // 3. Restore Vault Documents fileData
    if (Array.isArray(currentState.vaultDocuments)) {
      let vaultUpdated = false;
      const updatedVault = await Promise.all(
        currentState.vaultDocuments.map(async (doc) => {
          if (!doc.fileData && doc.id) {
            const cachedData = await getIdbItem<string>(`${IDB_VAULT_PREFIX}${doc.id}`);
            if (cachedData) {
              vaultUpdated = true;
              return { ...doc, fileData: cachedData };
            }
          }
          return doc;
        })
      );

      if (vaultUpdated) {
        patches.vaultDocuments = updatedVault;
        hasPatches = true;
      }
    }

    return hasPatches ? patches : null;
  } catch (err) {
    console.warn('Failed to restore heavy files from IndexedDB:', err);
    return null;
  }
}

/**
 * Removes CV from IndexedDB
 */
export async function removeHeavyCVFromIndexedDB(): Promise<void> {
  await removeIdbItem(IDB_CV_KEY);
}

/**
 * Removes JD from IndexedDB
 */
export async function removeHeavyJDFromIndexedDB(): Promise<void> {
  await removeIdbItem(IDB_JD_KEY);
}

/**
 * Removes Vault Document from IndexedDB
 */
export async function removeHeavyVaultDocFromIndexedDB(docId: string): Promise<void> {
  await removeIdbItem(`${IDB_VAULT_PREFIX}${docId}`);
}

/**
 * Initial startup cleanup: purges oversized legacy keys from localStorage
 */
export function purgeOversizedLegacyLocalStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const keysToCheck = [
      'portfolio_user_info',
      'portfolio_vault_documents_v1',
      'portfolio_photo_slots',
      'portfolio_profile_photo',
    ];

    for (const key of keysToCheck) {
      try {
        const item = window.localStorage.getItem(key);
        // If an item is larger than 50KB, it's wasting precious localStorage space
        if (item && item.length > 50000) {
          window.localStorage.removeItem(key);
        }
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }
}
