import { createOrbDragElement, setOrbDragImage } from '../itemDragUtils';
import { RARITY_COLORS } from '../../constants/itemConstants';

// Mock document for headless environments
if (typeof document === 'undefined') {
  global.document = {
    createElement: (tag) => {
      const el = {
        tagName: tag.toUpperCase(),
        style: {},
        children: [],
        appendChild: (child) => {
          el.children.push(child);
          child.parentNode = el;
          return child;
        },
        querySelector: (selector) => {
          if (selector === 'img') {
            return el.children.find(c => c.tagName === 'IMG') || null;
          }
          if (selector === 'span') {
            return el.children.find(c => c.tagName === 'SPAN') || null;
          }
          return null;
        },
        parentNode: null
      };
      return el;
    },
    body: {
      appendChild: (child) => {
        child.parentNode = global.document.body;
        return child;
      },
      removeChild: (child) => {
        child.parentNode = null;
      }
    }
  };
}

describe('itemDragUtils', () => {
  it('creates an orb drag element with proper styles and rarity color', () => {
    const item = {
      id: 'test-item-1',
      name: 'Shadowfang',
      quality: 'rare',
      iconId: 'Weapons/Swords/sword-iron-fine'
    };

    const orb = createOrbDragElement(item, { orbSize: 44 });

    expect(orb).toBeDefined();
    expect(orb.style.width).toBe('44px');
    expect(orb.style.height).toBe('44px');
    expect(orb.style.borderRadius).toBe('50%');
    expect(orb.style.border).toBe(`2px solid ${RARITY_COLORS.rare.border}`);

    const img = orb.querySelector('img');
    expect(img).toBeDefined();
    expect(img.style.borderRadius).toBe('50%');
  });

  it('adds quantity badge when quantity > 1', () => {
    const item = {
      id: 'test-item-2',
      name: 'Health Potion',
      quality: 'common',
      quantity: 5
    };

    const orb = createOrbDragElement(item, { quantity: 5 });
    const badge = orb.querySelector('span');
    expect(badge).toBeDefined();
    expect(badge.textContent).toBe('5');
  });

  it('calls setDragImage with centered coordinates', () => {
    const setDragImageMock = (el, x, y) => {
      setDragImageMock.calls.push([el, x, y]);
    };
    setDragImageMock.calls = [];

    const fakeEvent = {
      dataTransfer: {
        setDragImage: setDragImageMock
      }
    };

    const item = {
      id: 'test-item-3',
      name: 'Arcane Staff',
      quality: 'epic'
    };

    setOrbDragImage(fakeEvent, item, { orbSize: 44 });

    expect(setDragImageMock.calls.length).toBe(1);
    expect(setDragImageMock.calls[0][1]).toBe(22);
    expect(setDragImageMock.calls[0][2]).toBe(22);
  });
});
