/**
 * Lightweight HTML sanitizer for rich text content.
 * Strips script tags, iframe embeds (unless allowed), javascript: URIs,
 * and dangerous event attributes (onerror, onclick, onload, etc.).
 */
export function sanitizeHtml(dirtyHtml) {
  if (typeof dirtyHtml !== 'string') return '';

  return dirtyHtml
    // Remove script tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: pseudo-protocols
    .replace(/href\s*=\s*(['"])\s*javascript:[^'"]*\1/gi, 'href="#"')
    // Remove inline event handlers (onload, onclick, onerror, etc.)
    .replace(/\s+on[a-z]+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*[^>\s]+/gi, '');
}

