/**
 * Security utility functions for sanitizing user input
 */

/**
 * Sanitizes image URLs to prevent XSS attacks
 * Only allows HTTP/HTTPS protocols and data URLs for images
 * Blocks dangerous protocols like javascript:, data:text/html, etc.
 * 
 * @param url - The URL to sanitize
 * @returns The sanitized URL or null if invalid/dangerous
 */
export function sanitizeImageUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Trim whitespace
  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return null;
  }

  try {
    // Check for dangerous protocols
    const lowerUrl = trimmedUrl.toLowerCase();

    // Block javascript: protocol
    if (lowerUrl.startsWith('javascript:')) {
      console.warn('Blocked javascript: protocol in image URL');
      return null;
    }

    // Block vbscript: protocol
    if (lowerUrl.startsWith('vbscript:')) {
      console.warn('Blocked vbscript: protocol in image URL');
      return null;
    }

    // Block data: URLs (including data:text/html and other dangerous data URLs)
    // Only allow image data URLs with specific check
    if (lowerUrl.startsWith('data:')) {
      // Only allow image data URLs
      if (!lowerUrl.startsWith('data:image/')) {
        console.warn('Blocked non-image data URL');
        return null;
      }
      // Allow image data URLs (base64 encoded images)
      return trimmedUrl;
    }

    // Block file: and other dangerous protocols
    const dangerousProtocols = ['file:', 'about:'];
    if (dangerousProtocols.some(protocol => lowerUrl.startsWith(protocol))) {
      console.warn('Blocked dangerous protocol in image URL');
      return null;
    }

    // Parse URL to validate structure
    const urlObj = new URL(trimmedUrl, window.location.origin);

    // Only allow http, https protocols
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      console.warn(`Blocked unsupported protocol: ${urlObj.protocol}`);
      return null;
    }

    // Return the sanitized URL
    return trimmedUrl;
  } catch (error) {
    // If URL parsing fails, it might be a relative URL
    // Try to validate it as a relative path
    if (!trimmedUrl.includes(':')) {
      // Relative URLs without protocol are generally safe
      // but we should still check for obvious XSS attempts
      if (trimmedUrl.includes('<script') || trimmedUrl.includes('javascript:')) {
        console.warn('Blocked potential XSS in relative URL');
        return null;
      }
      return trimmedUrl;
    }

    console.warn('Invalid URL format:', error);
    return null;
  }
}

/**
 * Sanitizes text content to prevent XSS
 * Escapes HTML special characters
 * 
 * @param text - The text to sanitize
 * @returns The sanitized text
 */
export function sanitizeText(text: string | null | undefined): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
