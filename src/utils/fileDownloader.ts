import { VaultFileType } from '../types/portfolio';

/**
 * Downloads a file with its exact original filename, extension, and 100% unaltered byte-for-byte binary content.
 * Converts Data URLs directly into native binary Blobs to guarantee reliable downloads across all devices,
 * browsers, and sandboxed iframes.
 */
export async function triggerFileDownload(fileData: string, fileName: string): Promise<void> {
  if (!fileData) {
    console.warn('triggerFileDownload: No file data provided');
    return;
  }

  try {
    let blob: Blob;

    if (fileData.startsWith('data:')) {
      // Decode Base64 Data URL to pristine binary Uint8Array
      const parts = fileData.split(',');
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
      const b64 = parts[1] || '';
      const byteCharacters = atob(b64);
      const byteNumbers = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      blob = new Blob([byteNumbers], { type: mime });
    } else if (fileData.startsWith('blob:')) {
      const res = await fetch(fileData);
      blob = await res.blob();
    } else if (fileData.startsWith('http://') || fileData.startsWith('https://')) {
      const res = await fetch(fileData);
      blob = await res.blob();
    } else {
      // Plain base64 without prefix or text
      try {
        const byteCharacters = atob(fileData);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        blob = new Blob([byteNumbers], { type: 'application/octet-stream' });
      } catch {
        blob = new Blob([fileData], { type: 'text/plain;charset=utf-8' });
      }
    }

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(objectUrl);
    }, 2500);
  } catch (err) {
    console.warn('Blob conversion failed, attempting direct link fallback:', err);
    try {
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = fileData;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 2500);
    } catch (fallbackErr) {
      console.error('All download mechanisms failed:', fallbackErr);
    }
  }
}

/**
 * Detects file category based on filename extension and MIME type
 */
export function detectFileType(fileName: string, mimeType: string = ''): {
  type: VaultFileType;
  extension: string;
} {
  const ext = fileName.includes('.')
    ? fileName.split('.').pop()?.toLowerCase() || ''
    : '';

  if (['xls', 'xlsx', 'xlsm', 'csv', 'tsv', 'ods'].includes(ext) || mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) {
    return { type: 'excel', extension: ext ? `.${ext}` : '.xlsx' };
  }

  if (['doc', 'docx', 'rtf', 'odt'].includes(ext) || mimeType.includes('word') || mimeType.includes('msword')) {
    return { type: 'word', extension: ext ? `.${ext}` : '.docx' };
  }

  if (ext === 'pdf' || mimeType.includes('pdf')) {
    return { type: 'pdf', extension: '.pdf' };
  }

  if (['ppt', 'pptx', 'odp'].includes(ext) || mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
    return { type: 'presentation', extension: ext ? `.${ext}` : '.pptx' };
  }

  if (['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'bmp'].includes(ext) || mimeType.startsWith('image/')) {
    return { type: 'image', extension: ext ? `.${ext}` : '.png' };
  }

  if (['txt', 'json', 'xml', 'md', 'html', 'css', 'js', 'ts'].includes(ext) || mimeType.startsWith('text/')) {
    return { type: 'text', extension: ext ? `.${ext}` : '.txt' };
  }

  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) || mimeType.includes('zip') || mimeType.includes('compressed')) {
    return { type: 'archive', extension: ext ? `.${ext}` : '.zip' };
  }

  return { type: 'other', extension: ext ? `.${ext}` : '' };
}

/**
 * Formats bytes to readable size (KB / MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes <= 0 || isNaN(bytes)) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
