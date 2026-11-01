/**
 * Unified Image Service
 * 
 * Central abstraction layer for image URL resolution, validation, and future CDN/Cloudinary upload.
 * All image operations across the application go through this single file.
 */

/**
 * Validates whether a given string is a valid URL or a local public path
 * @param {string} url
 * @returns {boolean}
 */
export function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
    return true; // Local static asset
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Resolves an image URL to a safe display URL with fallback
 * @param {string} url - Source image URL or local path
 * @param {string} [fallback='/brand/logo-cropped.png'] - Fallback image
 * @returns {string}
 */
export function resolveImageUrl(url, fallback = '/brand/logo-cropped.png') {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return fallback;
  }
  const trimmed = url.trim();
  return trimmed;
}

/**
 * Image upload stub - currently returns the provided URL as-is.
 * When Cloudinary or another storage provider is integrated in the future,
 * only this function needs to be updated with the direct upload API call.
 * 
 * @param {File|Blob|string} fileOrUrl
 * @returns {Promise<string>}
 */
export async function uploadImage(fileOrUrl) {
  if (typeof fileOrUrl === 'string') {
    return fileOrUrl.trim();
  }
  // Future: Cloudinary or S3 unsigned upload logic here.
  throw new Error('Direct file upload is not configured yet. Please paste an image URL.');
}

/**
 * Normalizes an array of product image URLs
 * @param {string|string[]} images
 * @returns {string[]}
 */
export function normalizeImageList(images) {
  if (!images) return [];
  if (Array.isArray(images)) {
    return images.filter(img => typeof img === 'string' && img.trim().length > 0).map(s => s.trim());
  }
  if (typeof images === 'string') {
    return [images.trim()];
  }
  return [];
}

