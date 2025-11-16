/**
 * Utility to create placeholder icons for testing
 */

/**
 * Create a simple placeholder icon as a data URL
 * @param {string} text - Text to display on icon
 * @param {string} bgColor - Background color (hex)
 * @param {string} textColor - Text color (hex)
 * @param {number} size - Icon size in pixels
 * @returns {string} - Data URL for the icon
 */
export const createPlaceholderIcon = (text = '?', bgColor = '#4a5568', textColor = '#ffffff', size = 64) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // Draw border
  ctx.strokeStyle = '#2d3748';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, size - 2, size - 2);

  // Draw text
  ctx.fillStyle = textColor;
  ctx.font = `bold ${size * 0.4}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size / 2);

  return canvas.toDataURL('image/png');
};

/**
 * Create and download a placeholder icon file
 * @param {string} filename - Name for the downloaded file
 * @param {string} text - Text to display on icon
 * @param {string} bgColor - Background color
 */
export const downloadPlaceholderIcon = (filename, text = '?', bgColor = '#4a5568') => {
  const dataUrl = createPlaceholderIcon(text, bgColor);
  
  // Create download link
  const link = document.createElement('a');
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  link.href = dataUrl;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate common placeholder icons for testing
 */
export const generateTestIcons = () => {
  const icons = [
    { name: 'spell_fire_fireball', text: '🔥', bg: '#dc2626' },
    { name: 'spell_ice_frostbolt', text: '❄️', bg: '#2563eb' },
    { name: 'spell_healing_cure', text: '💚', bg: '#16a34a' },
    { name: 'item_weapon_sword', text: '⚔️', bg: '#6b7280' },
    { name: 'item_armor_helmet', text: '🛡️', bg: '#7c3aed' },
    { name: 'creature_dragon_red', text: '🐉', bg: '#dc2626' },
    { name: 'ui_icon_questionmark', text: '?', bg: '#4a5568' }
  ];

  icons.forEach(icon => {
    setTimeout(() => {
      downloadPlaceholderIcon(icon.name, icon.text, icon.bg);
    }, 100);
  });
};

export default {
  createPlaceholderIcon,
  downloadPlaceholderIcon,
  generateTestIcons
};
