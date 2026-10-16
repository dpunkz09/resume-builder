"use client";

import { Basics } from "@/types";
import { useState, useRef } from "react";
import Image from "next/image";
import { optimizeResumePhoto, validateImageFile, formatFileSize } from "@/lib/image-optimizer";
import { uploadResumePhoto, deleteResumePhoto, extractPathFromUrl, deleteOldResumePhotos } from "@/lib/supabase-storage";
import { Loader2 } from "lucide-react";

type BasicsEditorProps = {
  basics: Basics;
  onChange: (basics: Basics) => void;
  userId: string;
  resumeId: string;
};

const SOCIAL_PLATFORMS = [
  { id: 'linkedin', label: 'LinkedIn', iconPath: '/social-icons/linkedin.png', baseUrl: 'https://linkedin.com/in/', placeholder: 'johndoe' },
  { id: 'github', label: 'GitHub', iconPath: '/social-icons/github-sign.png', baseUrl: 'https://github.com/', placeholder: 'johndoe' },
  { id: 'twitter', label: 'Twitter', iconPath: '/social-icons/twitter.png', baseUrl: 'https://twitter.com/', placeholder: 'johndoe' },
  { id: 'instagram', label: 'Instagram', iconPath: '/social-icons/instagram.png', baseUrl: 'https://instagram.com/', placeholder: 'johndoe' },
  { id: 'youtube', label: 'YouTube', iconPath: '/social-icons/video.png', baseUrl: 'https://youtube.com/@', placeholder: 'johndoe' },
  { id: 'email', label: 'Email', iconPath: '/social-icons/gmail.png', baseUrl: 'mailto:', placeholder: 'john@example.com' },
  { id: 'facebook', label: 'Facebook', iconPath: '/social-icons/facebook.png', baseUrl: 'https://facebook.com/', placeholder: 'johndoe' },
  { id: 'custom', label: 'Other', iconPath: '/social-icons/others.png', baseUrl: 'https://', placeholder: 'yourlink.com' },
] as const;

export function BasicsEditor({ basics, onChange, userId, resumeId }: BasicsEditorProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [optimizationInfo, setOptimizationInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof Basics, value: string | undefined) => {
    onChange({ ...basics, [field]: value });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error!);
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setOptimizationInfo(`Optimizing ${formatFileSize(file.size)}...`);

    try {
      // Optimize image (resize to 400x400, compress)
      const optimized = await optimizeResumePhoto(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.85,
        format: 'jpeg',
      });

      setOptimizationInfo(
        `Optimized: ${optimized.width}×${optimized.height}, ${formatFileSize(optimized.size)}`
      );

      // Upload to Supabase Storage
      const uploadResult = await uploadResumePhoto(
        optimized.blob,
        userId,
        resumeId,
        'jpeg'
      );

      if ('error' in uploadResult) {
        setUploadError(uploadResult.error);
        setIsUploading(false);
        return;
      }

      // Delete old photos (keep only the new one)
      await deleteOldResumePhotos(userId, resumeId, uploadResult.path);

      // Update resume with storage URL
      updateField("photo", uploadResult.url);
      
      setTimeout(() => {
        setOptimizationInfo(null);
      }, 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = async () => {
    if (!basics.photo) return;

    // Extract path from URL and delete from storage
    const path = extractPathFromUrl(basics.photo);
    if (path) {
      await deleteResumePhoto(path);
    }

    updateField("photo", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setOptimizationInfo(null);
  };

  const addLink = () => {
    onChange({
      ...basics,
      links: [...basics.links, { label: "", url: "", platform: "" }],
    });
  };

  const updateLink = (index: number, field: "label" | "url" | "platform", value: string) => {
    const newLinks = [...basics.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    
    // Auto-update label when platform changes
    if (field === "platform" && value) {
      const platformConfig = SOCIAL_PLATFORMS.find(p => p.id === value);
      if (platformConfig) {
        newLinks[index].label = platformConfig.label;
      }
    }
    
    onChange({ ...basics, links: newLinks });
  };

  const buildFullUrl = (platform: string, username: string): string => {
    const platformConfig = SOCIAL_PLATFORMS.find(p => p.id === platform);
    if (!platformConfig) return username;
    
    // If username already contains http/https, return as is
    if (username.startsWith('http://') || username.startsWith('https://')) {
      return username;
    }
    
    // If username starts with the domain, add https://
    if (username.startsWith(platformConfig.baseUrl.replace('https://', ''))) {
      return `https://${username}`;
    }
    
    // Build full URL from username
    return `${platformConfig.baseUrl}${username.replace(/^\/+/, '')}`;
  };

  const removeLink = (index: number) => {
    onChange({
      ...basics,
      links: basics.links.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Photo
          <span className="ml-2 text-xs text-gray-500">(For Executive & White Clean templates)</span>
        </label>
        
        {basics.photo ? (
          <div className="flex items-start gap-4">
            <div className="relative h-32 w-32 overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-50">
              <Image
                src={basics.photo}
                alt="Profile photo"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  'Change Photo'
                )}
              </button>
              <button
                type="button"
                onClick={removePhoto}
                disabled={isUploading}
                className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove Photo
              </button>
              {optimizationInfo && (
                <p className="text-xs text-green-600">{optimizationInfo}</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 hover:border-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <div className="text-center">
                    <svg
                      className="mx-auto h-8 w-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="mt-1 text-xs">Upload</span>
                  </div>
                )}
              </button>
              <div className="text-sm text-gray-500">
                <p className="font-medium">Upload a professional photo</p>
                <p className="text-xs mt-1">• Max size: 5MB (will be optimized)</p>
                <p className="text-xs">• Optimized to: 400×400px</p>
                <p className="text-xs">• Formats: JPG, PNG, WebP</p>
              </div>
            </div>
            {optimizationInfo && (
              <p className="mt-2 text-sm text-green-600">{optimizationInfo}</p>
            )}
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          disabled={isUploading}
          className="hidden"
        />
        
        {uploadError && (
          <p className="mt-2 text-sm text-red-600">{uploadError}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name *</label>
        <input
          type="text"
          value={basics.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Professional Headline</label>
        <input
          type="text"
          value={basics.headline}
          onChange={(e) => updateField("headline", e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Senior Software Engineer"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={basics.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={basics.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={basics.location}
            onChange={(e) => updateField("location", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="San Francisco, CA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Website</label>
          <input
            type="url"
            value={basics.website}
            onChange={(e) => updateField("website", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="https://johndoe.com"
          />
        </div>
      </div>

      {/* Social Links - New compact design */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Social Links</label>
        
        {/* Platform icons grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {SOCIAL_PLATFORMS.map((platform) => {
            const existingLink = basics.links.find((link: any) => link.platform === platform.id);
            const isActive = !!existingLink;
            
            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => {
                  if (isActive) {
                    // If already added, don't toggle off - user can remove via input below
                  } else {
                    // Add new link
                    onChange({
                      ...basics,
                      links: [...basics.links, { label: platform.label, url: platform.baseUrl, platform: platform.id }],
                    });
                  }
                }}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 p-3 transition-all ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
                title={platform.label}
              >
                <Image 
                  src={platform.iconPath} 
                  alt={platform.label} 
                  width={24} 
                  height={24} 
                  className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}
                />
                <span className={`text-xs font-medium ${isActive ? 'text-blue-700' : 'text-gray-600'}`}>
                  {platform.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Input fields for active links */}
        {basics.links.length > 0 && (
          <div className="space-y-3">
            {basics.links.map((link, index) => {
              const platform = SOCIAL_PLATFORMS.find(p => p.id === (link as any).platform);
              if (!platform) return null;
              
              return (
                <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Image 
                      src={platform.iconPath} 
                      alt={platform.label} 
                      width={20} 
                      height={20}
                      className="shrink-0"
                    />
                    <span className="text-sm font-medium text-gray-700">{platform.label}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {platform.id === 'email' ? 'Email Address' : 
                         platform.id === 'custom' ? 'URL' : 
                         'Username or Profile Path'}
                      </label>
                      <div className="relative">
                        {platform.id !== 'custom' && platform.id !== 'email' && (
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                            {platform.baseUrl.replace('https://', '')}
                          </span>
                        )}
                        <input
                          type="text"
                          value={link.url ? link.url.replace(platform.baseUrl || '', '') : ''}
                          onChange={(e) => {
                            const username = e.target.value;
                            const fullUrl = buildFullUrl((link as any).platform, username);
                            updateLink(index, "url", fullUrl);
                          }}
                          placeholder={platform.placeholder}
                          className={`block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                            platform.id !== 'custom' && platform.id !== 'email' ? 'pl-32' : ''
                          }`}
                        />
                      </div>
                      {link.url && link.url !== platform.baseUrl && (
                        <p className="mt-1 text-xs text-gray-500">
                          Full URL: <span className="font-mono">{link.url}</span>
                        </p>
                      )}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="w-full rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
