import { LORE_DICTIONARY } from '../data/loreDictionary';

// Build a list of all terms sorted by length (descending) to avoid partial term collision
const dictionaryTerms = Object.values(LORE_DICTIONARY).map(entry => ({
  id: entry.id,
  term: entry.term,
  pattern: entry.term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') // escape regex characters
})).sort((a, b) => b.term.length - a.term.length);

/**
 * Dynamically scans a block of text, finds any references to terms in the LORE_DICTIONARY,
 * and wraps them in <LoreLink> tags while preserving existing tags, casing, and nested logic.
 *
 * @param {string} text The raw text to process
 * @returns {string} The processed text with inline <LoreLink> tags
 */
export const autoLinkTerminology = (text) => {
  if (!text || typeof text !== 'string') return text;

  // Quick sanity check to avoid regex processing if no terms exist in the string
  let hasMatch = false;
  const textLower = text.toLowerCase();
  for (const item of dictionaryTerms) {
    if (textLower.includes(item.term.toLowerCase())) {
      hasMatch = true;
      break;
    }
  }
  if (!hasMatch) return text;

  // Split by HTML tags to only process plain text content outside of tags
  const tokenRegex = /(<[^>]+>)/g;
  const parts = text.split(tokenRegex);

  const processedParts = parts.map(part => {
    // If it's an HTML tag, leave it untouched
    if (part.startsWith('<') && part.endsWith('>')) {
      return part;
    }

    let temp = part;
    const placeholders = [];

    for (const item of dictionaryTerms) {
      try {
        // Match exact whole words using lookbehind and lookahead
        const regex = new RegExp(`(?<![a-zA-Z0-9])(${item.pattern})(?![a-zA-Z0-9])`, 'gi');
        temp = temp.replace(regex, (match) => {
          const placeholder = `__LORE_PLACEHOLDER_${placeholders.length}__`;
          placeholders.push({
            placeholder,
            html: `<LoreLink termId="${item.id}">${match}</LoreLink>`
          });
          return placeholder;
        });
      } catch (e) {
        // Fallback for environments where lookbehinds are not supported
        const regex = new RegExp(`\\b(${item.pattern})\\b`, 'gi');
        temp = temp.replace(regex, (match) => {
          const placeholder = `__LORE_PLACEHOLDER_${placeholders.length}__`;
          placeholders.push({
            placeholder,
            html: `<LoreLink termId="${item.id}">${match}</LoreLink>`
          });
          return placeholder;
        });
      }
    }

    // Restore the placeholders in reverse order
    for (let i = placeholders.length - 1; i >= 0; i--) {
      temp = temp.replace(placeholders[i].placeholder, placeholders[i].html);
    }

    return temp;
  });

  return processedParts.join('');
};
