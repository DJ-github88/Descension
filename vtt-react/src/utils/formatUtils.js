/**
 * Shared formatting utilities used across the application
 */

/**
 * Format resource type names from snake_case to readable format
 * @param {string} resourceType - The resource type in snake_case
 * @returns {string} Formatted resource name
 */
export function formatResourceName(resourceType) {
  if (!resourceType) return 'Resource';

  switch (resourceType) {
    case 'action_points':
      return 'Action Points';
    case 'combo_points':
      return 'Combo Points';
    case 'soul_shards':
      return 'Soul Shards';
    case 'holy_power':
      return 'Holy Power';
    case 'astral_power':
      return 'Astral Power';
    case 'mana':
      return 'Mana';
    case 'health':
      return 'Health';
    case 'rage':
      return 'Rage';
    case 'energy':
      return 'Energy';
    case 'focus':
      return 'Focus';
    default:
      // Convert snake_case to Title Case
      return resourceType
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  }
}

/**
 * Format parameter names for display
 * @param {string} paramName - The parameter name
 * @returns {string} Formatted parameter name
 */
export function formatParameterName(paramName) {
  if (!paramName) return '';

  // Handle special cases
  const specialCases = {
    'dc': 'DC',
    'ac': 'AC',
    'hp': 'HP',
    'mp': 'MP',
    'xp': 'XP'
  };

  if (specialCases[paramName.toLowerCase()]) {
    return specialCases[paramName.toLowerCase()];
  }

  // Convert camelCase to Title Case with spaces
  return paramName
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, str => str.toUpperCase());
}

/**
 * Format numbers with appropriate units
 * @param {number} value - The number to format
 * @param {string} type - The type of formatting ('damage', 'healing', 'default')
 * @returns {string} Formatted number
 */
export function formatNumbers(value, type = 'default') {
  if (value === null || value === undefined) return '0';

  const num = Number(value);
  if (isNaN(num)) return String(value);

  switch (type) {
    case 'damage':
      return num > 0 ? `${num} damage` : '0 damage';
    case 'healing':
      return num > 0 ? `${num} healing` : '0 healing';
    case 'percentage':
      return `${num}%`;
    case 'currency':
      return num.toLocaleString();
    default:
      return num.toString();
  }
}

/**
 * Format keywords in text (capitalize properly)
 * @param {string} text - Text to format
 * @returns {string} Formatted text
 */
export function formatKeywords(text) {
  if (!text) return '';

  // List of keywords that should be capitalized
  const keywords = [
    'and', 'or', 'the', 'a', 'an', 'of', 'in', 'on', 'at', 'to', 'for', 'with',
    'by', 'from', 'into', 'onto', 'upon', 'over', 'under', 'above', 'below',
    'before', 'after', 'during', 'while', 'since', 'until', 'through', 'across'
  ];

  return text
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      // Always capitalize first word and words not in keywords list
      if (index === 0 || !keywords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
}
