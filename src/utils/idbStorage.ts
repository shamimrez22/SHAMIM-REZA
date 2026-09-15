/**
 * Lightweight IndexedDB Key-Value Store
 * Native browser IndexedDB wrapper with zero dependencies.
 * Provides virtually unlimited storage (~50MB - 1GB+) for large binary payloads
 * such as uploaded CVs, Job Descriptions, and Data Vault documents.
 */

const DB_NAME = 'portfolio_idb_v1';
const STORE_NAME = 'keyval';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB not supported in this environment'));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          console.warn('IndexedDB open error:', request.error);
          reject(request.error);
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  return dbPromise;
}

export async function getIdbItem<T = any>(key: string): Promise<T | null> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => {
        resolve(req.result ?? null);
      };

      req.onerror = () => {
        console.warn(`IndexedDB get error for key "${key}":`, req.error);
        resolve(null);
      };
    });
  } catch {
    return null;
  }
}

export async function setIdbItem<T = any>(key: string, value: T): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);

      req.onsuccess = () => resolve();
      req.onerror = () => {
        console.warn(`IndexedDB put error for key "${key}":`, req.error);
        reject(req.error);
      };
    });
  } catch (err) {
    console.warn(`IndexedDB failed to set item for key "${key}":`, err);
  }
}

export async function removeIdbItem(key: string): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);

      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch {
    // ignore
  }
}
