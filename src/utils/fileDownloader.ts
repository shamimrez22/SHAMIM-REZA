import { VaultFileType } from '../types/portfolio';

/**
 * Downloads a file with its exact original filename and content
 */
export async function triggerFileDownload(fileData: string, fileName: string): Promise<void> {
  if (!fileData) {
    console.warn('triggerFileDownload: No file data provided');
    return;
  }

  try {
    // If it's a data URL or blob URL
    if (fileData.startsWith('data:') || fileData.startsWith('blob:')) {
      const link = document.createElement('a');
      link.href = fileData;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // If it's an HTTP/HTTPS URL, fetch as blob so the browser strictly uses fileName
    const res = await fetch(fileData);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
  } catch (err) {
    console.warn('Direct blob fetch failed, falling back to basic link download', err);
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
