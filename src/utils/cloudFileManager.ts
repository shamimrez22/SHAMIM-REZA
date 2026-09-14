/**
 * Universal Cross-Device Cloud File Synchronization Engine
 * Powered by Firebase Firestore
 * 
 * Ensures any file (CV, Job Description, Data Vault spreadsheets, reports, PDFs)
 * uploaded from ANY device (mobile phone, tablet, laptop, PC) is immediately
 * live across the globe and can be downloaded from ANY device in real time.
 */

import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CloudFile, VaultDocument } from '../types/portfolio';
import { triggerFileDownload } from './fileDownloader';

// Chunk size limit: 450,000 chars of base64 string is ~330KB (well under 1MB Firestore limit)
const CHUNK_SIZE = 450000;
const PORTFOLIO_DOC_ID = 'main';

export interface CloudUploadProgress {
  status: 'idle' | 'uploading' | 'chunking' | 'saving' | 'success' | 'error';
  progress: number;
  message?: string;
  error?: string;
}

/**
 * Saves a file to Firebase Firestore under /cloud_files/{fileId}
 * Automatically chunks files larger than 600,000 chars so they never exceed Firestore limits.
 */
export async function saveCloudFile(
  file: {
    fileId: string;
    fileName: string;
    fileSize: string;
    fileSizeBytes?: number;
    fileType: string;
    mimeType?: string;
    fileData: string; // Base64 data URL
    title?: string;
    category?: string;
    description?: string;
  },
  onProgress?: (progress: CloudUploadProgress) => void
): Promise<boolean> {
  try {
    onProgress?.({ status: 'uploading', progress: 10, message: 'Processing file for cloud sync...' });

    const fileDocRef = doc(db, 'cloud_files', file.fileId);
    const dataLen = file.fileData.length;
    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const detectedMime =
      file.mimeType ||
      (file.fileData.startsWith('data:')
        ? file.fileData.match(/data:(.*?);/)?.[1] || 'application/octet-stream'
        : 'application/octet-stream');

    if (dataLen > 600000) {
      // Chunked upload
      onProgress?.({ status: 'chunking', progress: 30, message: 'Optimizing high-resolution document in cloud...' });
      const chunks: string[] = [];
      for (let i = 0; i < dataLen; i += CHUNK_SIZE) {
        chunks.push(file.fileData.slice(i, i + CHUNK_SIZE));
      }

      // Save parent metadata
      await setDoc(
        fileDocRef,
        {
          fileId: file.fileId,
          fileName: file.fileName,
          fileSize: file.fileSize,
          fileSizeBytes: file.fileSizeBytes || dataLen,
          fileType: file.fileType,
          mimeType: detectedMime,
          isChunked: true,
          totalChunks: chunks.length,
          title: file.title || file.fileName,
          category: file.category || 'General',
          description: file.description || '',
          uploadedAt: formattedDate,
          updatedAt: nowIso,
        },
        { merge: true }
      );

      // Save chunk documents
      for (let idx = 0; idx < chunks.length; idx++) {
        const chunkDocRef = doc(db, 'cloud_files', file.fileId, 'chunks', String(idx));
        await setDoc(chunkDocRef, {
          chunkIndex: idx,
          data: chunks[idx],
        });
        const currentPct = 40 + Math.round(((idx + 1) / chunks.length) * 50);
        onProgress?.({ status: 'saving', progress: currentPct, message: `Syncing cloud block ${idx + 1}/${chunks.length}...` });
      }
    } else {
      // Single document upload
      onProgress?.({ status: 'saving', progress: 60, message: 'Writing live document to cloud...' });
      await setDoc(
        fileDocRef,
        {
          fileId: file.fileId,
          fileName: file.fileName,
          fileSize: file.fileSize,
          fileSizeBytes: file.fileSizeBytes || dataLen,
          fileType: file.fileType,
          mimeType: detectedMime,
          fileData: file.fileData,
          isChunked: false,
          totalChunks: 1,
          title: file.title || file.fileName,
          category: file.category || 'General',
          description: file.description || '',
          uploadedAt: formattedDate,
          updatedAt: nowIso,
        },
        { merge: true }
      );
    }

    // If this is CV or JD, also update portfolio/main document for rapid metadata reads
    if (file.fileId === 'cv_main') {
      const portfolioRef = doc(db, 'portfolio', PORTFOLIO_DOC_ID);
      await setDoc(
        portfolioRef,
        {
          cvFileName: file.fileName,
          cvFileSize: file.fileSize,
          cvLastUpdated: formattedDate,
          hasCustomCV: true,
          updatedAt: nowIso,
        },
        { merge: true }
      );
    } else if (file.fileId === 'jd_main') {
      const portfolioRef = doc(db, 'portfolio', PORTFOLIO_DOC_ID);
      await setDoc(
        portfolioRef,
        {
          jdFileName: file.fileName,
          jdFileSize: file.fileSize,
          jdLastUpdated: formattedDate,
          hasCustomJD: true,
          updatedAt: nowIso,
        },
        { merge: true }
      );
    }

    onProgress?.({ status: 'success', progress: 100, message: 'File is now live across all devices!' });
    return true;
  } catch (err: any) {
    console.error('Failed to save cloud file to Firestore:', err);
    onProgress?.({ status: 'error', progress: 0, error: err?.message || 'Cloud file upload failed' });
    return false;
  }
}

/**
 * Fetches a cloud file from Firestore, assembling chunks if necessary
 */
export async function fetchCloudFile(fileId: string): Promise<CloudFile | null> {
  try {
    const fileDocRef = doc(db, 'cloud_files', fileId);
    const snap = await getDoc(fileDocRef);

    if (!snap.exists()) {
      return null;
    }

    const data = snap.data() as CloudFile;

    if (data.isChunked) {
      // Fetch subcollection chunks
      const chunksCol = collection(db, 'cloud_files', fileId, 'chunks');
      const q = query(chunksCol, orderBy('chunkIndex', 'asc'));
      const chunkSnaps = await getDocs(q);

      const chunkArray: { index: number; data: string }[] = [];
      chunkSnaps.forEach((docSnap) => {
        const d = docSnap.data();
        chunkArray.push({ index: d.chunkIndex, data: d.data || '' });
      });

      chunkArray.sort((a, b) => a.index - b.index);
      const reassembled = chunkArray.map((c) => c.data).join('');

      return {
        ...data,
        fileData: reassembled,
      };
    }

    return data;
  } catch (err) {
    console.warn(`Failed to fetch cloud file "${fileId}":`, err);
    return null;
  }
}

/**
 * Subscribes to real-time metadata of a cloud file.
 * Automatically fetches full reassembled data when document is detected/updated.
 */
export function subscribeToCloudFile(
  fileId: string,
  callback: (file: CloudFile | null) => void
): () => void {
  try {
    const fileDocRef = doc(db, 'cloud_files', fileId);
    const unsubscribe = onSnapshot(
      fileDocRef,
      async (snap) => {
        if (!snap.exists()) {
          callback(null);
          return;
        }

        const raw = snap.data() as CloudFile;
        if (raw.isChunked) {
          // Asynchronously fetch full chunked payload
          const full = await fetchCloudFile(fileId);
          callback(full);
        } else {
          callback(raw);
        }
      },
      (err) => {
        console.warn(`Real-time subscription error for cloud file "${fileId}":`, err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn(`Failed to attach subscriber to cloud file "${fileId}":`, err);
    return () => {};
  }
}

/**
 * Removes a file from Firebase Firestore and cleans up its chunks
 */
export async function deleteCloudFile(fileId: string): Promise<boolean> {
  try {
    const fileDocRef = doc(db, 'cloud_files', fileId);
    const snap = await getDoc(fileDocRef);

    if (snap.exists()) {
      const data = snap.data();
      if (data.isChunked) {
        const chunksCol = collection(db, 'cloud_files', fileId, 'chunks');
        const chunkSnaps = await getDocs(chunksCol);
        const batch = writeBatch(db);
        chunkSnaps.forEach((cDoc) => batch.delete(cDoc.ref));
        await batch.commit();
      }
      await deleteDoc(fileDocRef);
    }

    // Clear reference in portfolio/main if CV or JD
    const nowIso = new Date().toISOString();
    if (fileId === 'cv_main') {
      const portfolioRef = doc(db, 'portfolio', PORTFOLIO_DOC_ID);
      await setDoc(
        portfolioRef,
        {
          cvFileName: '',
          cvFileSize: '',
          cvLastUpdated: '',
          hasCustomCV: false,
          updatedAt: nowIso,
        },
        { merge: true }
      );
    } else if (fileId === 'jd_main') {
      const portfolioRef = doc(db, 'portfolio', PORTFOLIO_DOC_ID);
      await setDoc(
        portfolioRef,
        {
          jdFileName: '',
          jdFileSize: '',
          jdLastUpdated: '',
          hasCustomJD: false,
          updatedAt: nowIso,
        },
        { merge: true }
      );
    }

    return true;
  } catch (err) {
    console.warn(`Failed to delete cloud file "${fileId}":`, err);
    return false;
  }
}

/**
 * Saves a Data Vault document to Firestore for cross-device live availability
 */
export async function saveVaultDocumentToCloud(docData: VaultDocument): Promise<boolean> {
  try {
    const docRef = doc(db, 'vault_documents', docData.id);
    const dataLen = (docData.fileData || '').length;
    const nowIso = new Date().toISOString();

    if (dataLen > 600000) {
      // Chunked
      const chunks: string[] = [];
      for (let i = 0; i < dataLen; i += CHUNK_SIZE) {
        chunks.push(docData.fileData.slice(i, i + CHUNK_SIZE));
      }

      await setDoc(
        docRef,
        {
          id: docData.id,
          title: docData.title,
          fileName: docData.fileName,
          fileType: docData.fileType,
          fileExtension: docData.fileExtension,
          fileSize: docData.fileSize,
          fileSizeBytes: docData.fileSizeBytes || dataLen,
          mimeType: docData.mimeType,
          category: docData.category,
          description: docData.description || '',
          uploadDate: docData.uploadDate,
          createdAt: docData.createdAt || Date.now(),
          isChunked: true,
          totalChunks: chunks.length,
          isCloudSynced: true,
          updatedAt: nowIso,
        },
        { merge: true }
      );

      for (let idx = 0; idx < chunks.length; idx++) {
        const chunkDocRef = doc(db, 'vault_documents', docData.id, 'chunks', String(idx));
        await setDoc(chunkDocRef, {
          chunkIndex: idx,
          data: chunks[idx],
        });
      }
    } else {
      await setDoc(
        docRef,
        {
          id: docData.id,
          title: docData.title,
          fileName: docData.fileName,
          fileType: docData.fileType,
          fileExtension: docData.fileExtension,
          fileSize: docData.fileSize,
          fileSizeBytes: docData.fileSizeBytes || dataLen,
          mimeType: docData.mimeType,
          fileData: docData.fileData,
          category: docData.category,
          description: docData.description || '',
          uploadDate: docData.uploadDate,
          createdAt: docData.createdAt || Date.now(),
          isChunked: false,
          totalChunks: 1,
          isCloudSynced: true,
          updatedAt: nowIso,
        },
        { merge: true }
      );
    }
    return true;
  } catch (err) {
    console.error('Failed to sync vault document to Firestore:', err);
    return false;
  }
}

/**
 * Fetches a single vault document and reassembles chunks if needed
 */
export async function fetchVaultDocumentFromCloud(id: string): Promise<VaultDocument | null> {
  try {
    const docRef = doc(db, 'vault_documents', id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return null;
    const data = snap.data() as VaultDocument;

    if (data.isChunked) {
      const chunksCol = collection(db, 'vault_documents', id, 'chunks');
      const q = query(chunksCol, orderBy('chunkIndex', 'asc'));
      const chunkSnaps = await getDocs(q);

      const chunkArray: { index: number; data: string }[] = [];
      chunkSnaps.forEach((docSnap) => {
        const d = docSnap.data();
        chunkArray.push({ index: d.chunkIndex, data: d.data || '' });
      });

      chunkArray.sort((a, b) => a.index - b.index);
      const reassembled = chunkArray.map((c) => c.data).join('');

      return {
        ...data,
        fileData: reassembled,
      };
    }

    return data;
  } catch (err) {
    console.warn(`Failed to fetch vault document "${id}":`, err);
    return null;
  }
}

/**
 * Subscribes to the live collection of Data Vault documents from Firestore
 */
export function subscribeToVaultDocumentsFromCloud(
  callback: (docs: VaultDocument[]) => void
): () => void {
  try {
    const colRef = collection(db, 'vault_documents');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const docs: VaultDocument[] = [];
        snapshot.forEach((snap) => {
          docs.push(snap.data() as VaultDocument);
        });
        // Sort newest first
        docs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        callback(docs);
      },
      (err) => {
        console.warn('Real-time vault documents subscription warning:', err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Failed to subscribe to vault documents collection:', err);
    return () => {};
  }
}

/**
 * Deletes a Data Vault document from Firestore
 */
export async function deleteVaultDocumentFromCloud(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'vault_documents', id);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      if (data.isChunked) {
        const chunksCol = collection(db, 'vault_documents', id, 'chunks');
        const chunkSnaps = await getDocs(chunksCol);
        const batch = writeBatch(db);
        chunkSnaps.forEach((cDoc) => batch.delete(cDoc.ref));
        await batch.commit();
      }
      await deleteDoc(docRef);
    }
    return true;
  } catch (err) {
    console.warn(`Failed to delete vault document "${id}" from cloud:`, err);
    return false;
  }
}

/**
 * Universal file download dispatcher for any device
 * Resolves reassembly if chunked, and triggers high-fidelity browser download.
 * Preserves the exact file name, extension, and unaltered raw byte content.
 */
export async function downloadAnyCloudFile(
  docOrFile: VaultDocument | CloudFile | string,
  fallbackFileName: string = 'document.pdf'
): Promise<void> {
  let fileData = '';
  let fileName = fallbackFileName;

  if (typeof docOrFile === 'string') {
    if (
      docOrFile.startsWith('data:') ||
      docOrFile.startsWith('blob:') ||
      docOrFile.startsWith('http://') ||
      docOrFile.startsWith('https://') ||
      docOrFile.length > 150
    ) {
      // It is already raw file content (data URL, blob URL, or long base64 string)
      fileData = docOrFile;
      fileName = fallbackFileName;
    } else {
      // Treat as document ID: check cloud_files first, then vault_documents
      const cloudFile = await fetchCloudFile(docOrFile);
      if (cloudFile && cloudFile.fileData) {
        fileData = cloudFile.fileData;
        fileName = cloudFile.fileName || fallbackFileName;
      } else {
        const vaultDoc = await fetchVaultDocumentFromCloud(docOrFile);
        if (vaultDoc && vaultDoc.fileData) {
          fileData = vaultDoc.fileData;
          fileName = vaultDoc.fileName || vaultDoc.title || fallbackFileName;
        }
      }
    }
  } else {
    // If it's chunked and doesn't have complete fileData in memory
    if (docOrFile.isChunked && !docOrFile.fileData) {
      const id = 'fileId' in docOrFile ? docOrFile.fileId : docOrFile.id;
      const full = 'fileId' in docOrFile ? await fetchCloudFile(id) : await fetchVaultDocumentFromCloud(id);
      if (full && full.fileData) {
        fileData = full.fileData;
        fileName = full.fileName || ('title' in full ? full.title : '') || fallbackFileName;
      }
    } else {
      fileData = docOrFile.fileData || '';
      fileName = docOrFile.fileName || ('title' in docOrFile ? docOrFile.title : '') || fallbackFileName;
    }
  }

  if (!fileData) {
    console.warn('downloadAnyCloudFile: Unable to find valid file data for', fallbackFileName);
    return;
  }

  await triggerFileDownload(fileData, fileName);
}
