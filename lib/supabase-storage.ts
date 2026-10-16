/**
 * Supabase Storage utilities for resume photos
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const bucketName = process.env.STORAGE_BUCKET_NAME || 'fwresumebuilder';

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload photo to Supabase Storage
 * Path structure: {userId}/resume-photos/{resumeId}/{timestamp}.jpg
 */
export async function uploadResumePhoto(
  blob: Blob,
  userId: string,
  resumeId: string,
  format: 'jpeg' | 'webp' = 'jpeg'
): Promise<{ url: string; path: string } | { error: string }> {
  try {
    const timestamp = Date.now();
    const extension = format === 'webp' ? 'webp' : 'jpg';
    const fileName = `${timestamp}.${extension}`;
    const filePath = `${userId}/resume-photos/${resumeId}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, blob, {
        contentType: format === 'webp' ? 'image/webp' : 'image/jpeg',
        upsert: false,
        cacheControl: '3600', // Cache for 1 hour
      });

    if (error) {
      console.error('Upload error:', error);
      return { error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error('Upload exception:', error);
    return { error: 'Failed to upload photo' };
  }
}

/**
 * Delete photo from Supabase Storage
 */
export async function deleteResumePhoto(
  filePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete exception:', error);
    return { success: false, error: 'Failed to delete photo' };
  }
}

/**
 * Delete old photos for a resume (cleanup)
 */
export async function deleteOldResumePhotos(
  userId: string,
  resumeId: string,
  keepPath?: string
): Promise<{ success: boolean; deletedCount: number }> {
  try {
    const folderPath = `${userId}/resume-photos/${resumeId}`;

    // List all files in the folder
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list(folderPath);

    if (listError || !files) {
      return { success: false, deletedCount: 0 };
    }

    // Filter out the file to keep
    const filesToDelete = files
      .filter((file) => {
        const fullPath = `${folderPath}/${file.name}`;
        return keepPath ? fullPath !== keepPath : true;
      })
      .map((file) => `${folderPath}/${file.name}`);

    if (filesToDelete.length === 0) {
      return { success: true, deletedCount: 0 };
    }

    // Delete old files
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove(filesToDelete);

    if (deleteError) {
      console.error('Cleanup error:', deleteError);
      return { success: false, deletedCount: 0 };
    }

    return { success: true, deletedCount: filesToDelete.length };
  } catch (error) {
    console.error('Cleanup exception:', error);
    return { success: false, deletedCount: 0 };
  }
}

/**
 * Extract file path from Supabase Storage URL
 */
export function extractPathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/object\/public\/[^/]+\/(.+)$/);
    return pathMatch ? pathMatch[1] : null;
  } catch {
    return null;
  }
}
