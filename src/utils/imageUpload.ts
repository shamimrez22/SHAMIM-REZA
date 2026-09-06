/**
 * Image Compression & Cloud Upload Helper
 * Ensures profile images uploaded from any device (smartphones, tablets, cameras, PCs)
 * are optimized, ultra-crisp, and fit safely within storage and memory.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Compresses any user-selected image file on the client side using HTML5 Canvas.
 * Reduces 5MB-15MB mobile photos to ~50KB-90KB without visible quality loss.
 */
export async function compressImageFile(
  file: File,
  options: CompressOptions = {}
): Promise<{ dataUrl: string; sizeKb: number; width: number; height: number }> {
  const { maxWidth = 800, maxHeight = 800, quality = 0.85 } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image into canvas.'));
      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect ratio preserving dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const rawUrl = reader.result as string;
          resolve({
            dataUrl: rawUrl,
            sizeKb: Math.round(rawUrl.length / 1024),
            width: img.width,
            height: img.height,
          });
          return;
        }

        // High quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to high-grade compressed JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        const approxSizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

        resolve({
          dataUrl: compressedDataUrl,
          sizeKb: approxSizeKb,
          width,
          height,
        });
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a base64 or file image to ImgBB free image hosting.
 * Returns the permanent live HTTPS URL.
 */
export async function uploadToImgBB(
  imageData: string | File,
  apiKey?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const key = apiKey || localStorage.getItem('imgbb_api_key') || 'd3a8220f18837e2832810a95c96ae083'; // default fallback key
    const formData = new FormData();
    formData.append('key', key);

    if (typeof imageData === 'string') {
      // Remove data:image/...;base64, prefix if present
      const base64Clean = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
      formData.append('image', base64Clean);
    } else {
      formData.append('image', imageData);
    }

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success && data.data?.display_url) {
      return { success: true, url: data.data.display_url };
    } else if (data.success && data.data?.url) {
      return { success: true, url: data.data.url };
    } else {
      return {
        success: false,
        error: data.error?.message || 'Upload failed on cloud server',
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error while uploading to cloud image host',
    };
  }
}
