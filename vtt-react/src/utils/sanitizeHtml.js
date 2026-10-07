/**
 * Lightweight client-side HTML sanitizer for the places that render
 * markdown-derived HTML via dangerouslySetInnerHTML.
 *
 * Uses the browser DOM to strip script/style/iframe/object/embed/link/meta
 * elements, all inline event handlers (on*), and javascript:/data: URLs in
 * href/src. Dependency-free (no DOMPurify) and a no-op-safe fallback when a
 * DOM is unavailable (SSR/tests) — in that case tags are stripped entirely.
 */

const DANGEROUS_TAGS = ['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta', 'base', 'form'];
const URL_ATTRS = ['href', 'src', 'xlink:href', 'action', 'formaction'];

export function sanitizeHtml(html) {
  if (typeof html !== 'string' || html.length === 0) {
    return html || '';
  }

  if (typeof window === 'undefined' || typeof window.DOMParser === 'undefined') {
    // No DOM available: strip all tags as a conservative fallback.
    return html.replace(/<[^>]*>/g, '');
  }

  try {
    const doc = new window.DOMParser().parseFromString(html, 'text/html');

    DANGEROUS_TAGS.forEach((tag) => {
      doc.querySelectorAll(tag).forEach((node) => node.remove());
    });

    doc.querySelectorAll('*').forEach((el) => {
      // Copy attributes first since we mutate the list while iterating.
      Array.from(el.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = attr.value || '';

        if (name.startsWith('on')) {
          el.removeAttribute(attr.name);
          return;
        }

        if (URL_ATTRS.includes(name) && /^\s*(javascript|vbscript|data):/i.test(value)) {
          el.removeAttribute(attr.name);
        }
      });
    });

    return doc.body.innerHTML;
  } catch (_e) {
    // On any parse failure, fall back to stripping tags.
    return html.replace(/<[^>]*>/g, '');
  }
}

export default sanitizeHtml;
