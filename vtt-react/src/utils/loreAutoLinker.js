import { getLoadedData } from '../hooks/useGameData';

let cachedTerms = null;
let cachedDictRef = null;

function buildTerms(dictionary) {
  if (cachedDictRef === dictionary) return cachedTerms;
  cachedDictRef = dictionary;
  cachedTerms = Object.values(dictionary)
    .map(entry => ({
      id: entry.id,
      term: entry.term,
      pattern: entry.term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'),
    }))
    .sort((a, b) => b.term.length - a.term.length);
  return cachedTerms;
}

export const autoLinkTerminology = (text) => {
  if (!text || typeof text !== 'string') return text;

  const loreDictionary = getLoadedData('lore');
  if (!loreDictionary) return text;

  const dictionaryTerms = buildTerms(loreDictionary);

  let hasMatch = false;
  const textLower = text.toLowerCase();
  for (const item of dictionaryTerms) {
    if (textLower.includes(item.term.toLowerCase())) {
      hasMatch = true;
      break;
    }
  }
  if (!hasMatch) return text;

  const tokenRegex = /(<[^>]+>)/g;
  const parts = text.split(tokenRegex);

  let insideLoreLink = false;

  const processedParts = parts.map(part => {
    if (part.startsWith('<') && part.endsWith('>')) {
      const lower = part.toLowerCase();
      if (lower.startsWith('<lorelink')) {
        insideLoreLink = true;
      } else if (lower === '</lorelink>') {
        insideLoreLink = false;
      }
      return part;
    }

    if (insideLoreLink) {
      return part;
    }

    let temp = part;
    const placeholders = [];

    for (const item of dictionaryTerms) {
      try {
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
        const hasNonWordChars = /[^a-zA-Z0-9\s]/.test(item.term);
        if (hasNonWordChars) continue;
        try {
          const regex = new RegExp(`\\b(${item.pattern})\\b`, 'gi');
          temp = temp.replace(regex, (match) => {
            const placeholder = `__LORE_PLACEHOLDER_${placeholders.length}__`;
            placeholders.push({
              placeholder,
              html: `<LoreLink termId="${item.id}">${match}</LoreLink>`
            });
            return placeholder;
          });
        } catch (innerE) {
          // skip
        }
      }
    }

    for (let i = placeholders.length - 1; i >= 0; i--) {
      temp = temp.replace(placeholders[i].placeholder, placeholders[i].html);
    }

    return temp;
  });

  return processedParts.join('');
};
