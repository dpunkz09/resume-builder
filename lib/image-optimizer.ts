/**
 * Client-side image optimization for resume photos
 * Optimizes images before upload to Supabase Storage
 */

export interface OptimizeImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'webp';
}

export interface OptimizedImage {
  blob: Blob;
  width: number;
  height: number;
  size: number;
  format: string;
}

/**
 * Optimize image for resume templates
 * - Executive template: 156px × 182px sidebar
 * - White Clean template: circular, ~200px diameter
 * Target: 400px × 400px at 0.85 quality (good for both templates)
 */
export async function optimizeResumePhoto(
  file: File,
  options: OptimizeImageOptions = {}
): Promise<OptimizedImage> {
  const {
    maxWidth = 400,
    maxHeight = 400,
    quality = 0.85,
    format = 'jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read file'));
    
    reader.onload = (e) => {
      if (!e.target?.result) {
        reject(new Error('No file data'));
        return;
      }
      
      img.src = e.target.result as string;
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    
    img.onload = () => {
      try {
        // Calculate dimensions maintaining aspect ratio
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          
          if (width > height) {
            width = maxWidth;
            height = Math.round(width / aspectRatio);
          } else {
            height = maxHeight;
            width = Math.round(height * aspectRatio);
          }
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }

            resolve({
              blob,
              width,
              height,
              size: blob.size,
              format: blob.type,
            });
          },
          format === 'webp' ? 'image/webp' : 'image/jpeg',
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  // Check file size (max 5MB for upload - will be optimized)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Image must be less than 5MB' };
  }

  // Check supported formats
  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!supportedFormats.includes(file.type)) {
    return { valid: false, error: 'Supported formats: JPG, PNG, WebP' };
  }

  return { valid: true };
}

/**
 * Get optimized file size estimate
 */
export function getOptimizedSizeEstimate(originalSize: number): string {
  // Rough estimate: 400x400 JPEG at 0.85 quality ≈ 30-80KB
  const estimatedSize = Math.min(80 * 1024, originalSize * 0.1);
  return formatFileSize(estimatedSize);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
