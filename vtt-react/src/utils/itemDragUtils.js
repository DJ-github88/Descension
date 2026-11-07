import { RARITY_COLORS } from '../constants/itemConstants';
import { getIconUrl } from './assetManager';

/**
 * Creates a styled floating orb DOM element matching the Mythrill VTT loot orb design.
 * Used with DataTransfer.setDragImage for seamless HTML5 dragging.
 *
 * @param {Object} item - The item being dragged
 * @param {Object} [options={}] - Customization options
 * @param {number} [options.orbSize=44] - Diameter of the orb in pixels
 * @param {HTMLElement} [options.sourceElement] - Originating DOM element (e.g. card or row) to reuse loaded icon
 * @param {number} [options.quantity] - Stack quantity to display as a badge
 * @returns {HTMLElement} The styled orb DOM element
 */
export const createOrbDragElement = (item, options = {}) => {
  const orbSize = options.orbSize || 44;
  const qualityLower = (item?.quality || item?.rarity || 'common').toLowerCase();
  const rarityConfig = RARITY_COLORS[qualityLower] || RARITY_COLORS.common;
  const borderColor = rarityConfig.border || '#a08c70';

  const orb = document.createElement('div');
  orb.className = 'grid-item-orb-drag-preview';
  orb.style.width = `${orbSize}px`;
  orb.style.height = `${orbSize}px`;
  orb.style.borderRadius = '50%';
  orb.style.boxSizing = 'border-box';
  orb.style.border = `2px solid ${borderColor}`;
  orb.style.boxShadow = `0 0 12px ${borderColor}b3, 0 0 4px ${borderColor}, inset 0 2px 4px rgba(255, 255, 255, 0.45), inset 0 -2px 4px rgba(0, 0, 0, 0.6)`;
  orb.style.background = 'radial-gradient(circle at 35% 35%, rgba(65, 65, 65, 0.95) 0%, rgba(25, 25, 25, 0.98) 70%, rgba(10, 10, 10, 1) 100%)';
  orb.style.display = 'flex';
  orb.style.alignItems = 'center';
  orb.style.justifyContent = 'center';
  orb.style.position = 'fixed';
  orb.style.top = '-9999px';
  orb.style.left = '-9999px';
  orb.style.pointerEvents = 'none';
  orb.style.zIndex = '-9999';
  orb.style.overflow = 'hidden';

  // Item icon
  const sourceImg = options.sourceElement?.querySelector?.('img');
  const iconImg = document.createElement('img');
  const iconSrc = (sourceImg && sourceImg.src)
    ? sourceImg.src
    : (item?.imageUrl && !item.imageUrl.includes('wow.zamimg.com'))
      ? item.imageUrl
      : (item?.iconId ? getIconUrl(item.iconId, 'items', true) : getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items', true));

  iconImg.src = iconSrc;
  iconImg.style.width = '76%';
  iconImg.style.height = '76%';
  iconImg.style.objectFit = 'contain';
  iconImg.style.borderRadius = '50%';
  iconImg.style.display = 'block';
  iconImg.style.pointerEvents = 'none';
  iconImg.style.position = 'relative';
  iconImg.style.zIndex = '1';
  orb.appendChild(iconImg);

  // Subtle glass orb specular highlight reflection
  const shine = document.createElement('div');
  shine.style.position = 'absolute';
  shine.style.top = '3px';
  shine.style.left = `${Math.round(orbSize * 0.2)}px`;
  shine.style.width = `${Math.round(orbSize * 0.42)}px`;
  shine.style.height = `${Math.round(orbSize * 0.22)}px`;
  shine.style.borderRadius = '50%';
  shine.style.background = 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 80%)';
  shine.style.pointerEvents = 'none';
  shine.style.zIndex = '2';
  orb.appendChild(shine);

  // Quantity badge if stack > 1
  const qty = options.quantity || item?.quantity;
  if (qty && qty > 1) {
    const badge = document.createElement('span');
    badge.textContent = String(qty);
    badge.style.position = 'absolute';
    badge.style.bottom = '1px';
    badge.style.right = '3px';
    badge.style.fontSize = '11px';
    badge.style.fontWeight = 'bold';
    badge.style.color = '#ffffff';
    badge.style.textShadow = '0 0 2px #000, 1px 1px 2px #000';
    badge.style.fontFamily = 'monospace';
    badge.style.lineHeight = '1';
    badge.style.pointerEvents = 'none';
    badge.style.zIndex = '3';
    orb.appendChild(badge);
  }

  return orb;
};

/**
 * Sets the HTML5 drag image to an immediate, seamless loot orb.
 *
 * @param {DragEvent} e - The dragstart event
 * @param {Object} item - The item being dragged
 * @param {Object} [options={}] - Customization options
 */
export const setOrbDragImage = (e, item, options = {}) => {
  if (!e?.dataTransfer?.setDragImage) return;

  try {
    const orbSize = options.orbSize || 44;
    const orb = createOrbDragElement(item, { ...options, orbSize });
    document.body.appendChild(orb);

    const center = Math.round(orbSize / 2);
    e.dataTransfer.setDragImage(orb, center, center);

    setTimeout(() => {
      if (orb.parentNode) {
        orb.parentNode.removeChild(orb);
      }
    }, 0);
  } catch (error) {
    console.warn('Failed to set orb drag image:', error);
  }
};
