import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback, useDeferredValue, memo } from 'react';
import { createPortal } from 'react-dom';
import useItemStore from '../../store/itemStore';
import ItemTooltip from '../item-generation/ItemTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import { getIconUrl } from '../item-generation/wowIcons';
import { RARITY_COLORS } from '../../constants/itemConstants';
import '../creature-wizard/styles/ShopConfiguration.css';

const EMPTY_ITEMS = [];
const QUALITY_ORDER = { poor: 0, common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
const TOOLTIP_OFFSET_X = 16;
const TOOLTIP_PAD_X = 16;
const TOOLTIP_PAD_Y = 24;

// Same placement rules as useTooltipPosition (right of cursor, flip left on
// overflow, lifted so it never trails off the bottom) but as a pure function so
// the tooltip can be moved without going through React state.
const computeTooltipPosition = (pos, width, height) => {
  const vw = window.innerWidth || 1920;
  const vh = window.innerHeight || 1080;

  let x = pos.x + TOOLTIP_OFFSET_X;
  if (x + width > vw - TOOLTIP_PAD_X) {
    const leftX = pos.x - width - TOOLTIP_OFFSET_X;
    x = leftX >= TOOLTIP_PAD_X ? leftX : Math.max(TOOLTIP_PAD_X, vw - width - TOOLTIP_PAD_X);
  }
  if (x < TOOLTIP_PAD_X) x = TOOLTIP_PAD_X;

  const targetY = pos.y > vh * 0.45
    ? pos.y - height * 0.75
    : pos.y - Math.min(40, height * 0.25);
  const maxY = Math.max(TOOLTIP_PAD_Y, vh - height - TOOLTIP_PAD_Y);
  const y = Math.max(TOOLTIP_PAD_Y, Math.min(targetY, maxY));

  return { x, y };
};

// Follows the cursor by writing a transform straight to the DOM node. Mouse
// movement never re-renders React, so sweeping across hundreds of icons stays
// cheap. React only re-renders this when the hovered item changes.
const FollowCursorTooltip = ({ item, startX, startY }) => {
  const elRef = useRef(null);
  const posRef = useRef({ x: startX, y: startY });
  const sizeRef = useRef({ width: 300, height: 300 });
  const rafRef = useRef(0);

  const place = useCallback(() => {
    rafRef.current = 0;
    const el = elRef.current;
    if (!el) return;
    const { x, y } = computeTooltipPosition(posRef.current, sizeRef.current.width, sizeRef.current.height);
    el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
  }, []);

  const schedulePlace = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(place);
  }, [place]);

  // Measure + place before paint whenever the hovered item changes
  useLayoutEffect(() => {
    const el = elRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        sizeRef.current = { width: rect.width, height: rect.height };
      }
    }
    place();
  }, [item, place]);

  // Track the cursor + re-measure if the tooltip content resizes itself
  useEffect(() => {
    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      schedulePlace();
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    let observer = null;
    if (typeof ResizeObserver !== 'undefined' && elRef.current) {
      observer = new ResizeObserver((entries) => {
        const box = entries[0]?.contentRect;
        if (box && box.width > 0 && box.height > 0) {
          sizeRef.current = { width: box.width, height: box.height };
          schedulePlace();
        }
      });
      observer.observe(elRef.current);
    }

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (observer) observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [schedulePlace]);

  return (
    <div
      ref={elRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        willChange: 'transform'
      }}
    >
      <ItemTooltip item={item} />
    </div>
  );
};

// One icon in the grid. Memoised so hovering/typing elsewhere never re-renders it.
const ItemIconCard = memo(({ item, index }) => {
  const qualityColor = RARITY_COLORS[item.quality?.toLowerCase() || 'common']?.text || '#a08c70';
  return (
    <div
      className="item-icon-card"
      data-index={index}
      role="button"
      aria-label={item.name}
    >
      <div
        className="item-icon-only"
        style={{
          backgroundImage: `url(${getIconUrl(item.iconId || 'inv_misc_questionmark', 'items')})`,
          borderColor: qualityColor
        }}
      />
    </div>
  );
});
ItemIconCard.displayName = 'ItemIconCard';

const ItemSelectionModal = ({ isOpen, onClose, onSelectItem }) => {
  const items = useItemStore(state => state.items) || EMPTY_ITEMS;
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [qualityFilter, setQualityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [hovered, setHovered] = useState(null); // { item, x, y } – changes only when the icon under the cursor changes
  const hoveredIndexRef = useRef(-1);
  const modalRef = useRef(null);

  // Keep typing responsive: the grid filters against a deferred copy of the query
  const deferredQuery = useDeferredValue(searchQuery);

  // Get unique item types and qualities for filters
  const itemTypes = useMemo(
    () => ['all', ...new Set(items.map(item => item.type).filter(Boolean))],
    [items]
  );
  const itemQualities = useMemo(
    () => ['all', ...new Set(items.map(item => item.quality).filter(Boolean))],
    [items]
  );

  // Filter and sort items (only when the inputs actually change, not on every hover)
  const filteredItems = useMemo(() => {
    const query = deferredQuery.toLowerCase();
    return items
      .filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(query);
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        const matchesQuality = qualityFilter === 'all' || item.quality === qualityFilter;
        return matchesSearch && matchesType && matchesQuality;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'type':
            return (a.type || '').localeCompare(b.type || '');
          case 'quality':
            return (QUALITY_ORDER[a.quality] || 0) - (QUALITY_ORDER[b.quality] || 0);
          default:
            return 0;
        }
      });
  }, [items, deferredQuery, typeFilter, qualityFilter, sortBy]);

  // Memoised icon elements: React skips the whole grid when only hover state changes
  const iconCards = useMemo(
    () => filteredItems.map((item, index) => (
      <ItemIconCard key={`${item.id}-${index}`} item={item} index={index} />
    )),
    [filteredItems]
  );

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Drop any stale hover when the list changes underneath the cursor
  useEffect(() => {
    hoveredIndexRef.current = -1;
    setHovered(null);
  }, [filteredItems, isOpen]);

  const getCardIndex = (target) => {
    const card = target && target.closest ? target.closest('.item-icon-card') : null;
    if (!card) return -1;
    const index = Number(card.dataset.index);
    return Number.isInteger(index) ? index : -1;
  };

  // Delegated handlers: one set on the grid instead of three closures per icon
  const handleGridClick = (e) => {
    const index = getCardIndex(e.target);
    if (index < 0 || !filteredItems[index]) return;
    onSelectItem(filteredItems[index]);
    onClose();
  };

  const handleGridMouseOver = (e) => {
    const index = getCardIndex(e.target);
    if (index === hoveredIndexRef.current) return;
    hoveredIndexRef.current = index;
    if (index < 0 || !filteredItems[index]) {
      setHovered(null);
      return;
    }
    setHovered({ item: filteredItems[index], x: e.clientX, y: e.clientY });
  };

  const handleGridMouseLeave = () => {
    if (hoveredIndexRef.current === -1) return;
    hoveredIndexRef.current = -1;
    setHovered(null);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay item-selector-overlay" onClick={onClose}>
      <div className="item-selector-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select Item to Add</h3>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Search:</label>
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <label>Type:</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="filter-select"
              >
                {itemTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Quality:</label>
              <select
                value={qualityFilter}
                onChange={(e) => setQualityFilter(e.target.value)}
                className="filter-select"
              >
                {itemQualities.map(quality => (
                  <option key={quality} value={quality}>
                    {quality === 'all' ? 'All Qualities' : quality.charAt(0).toUpperCase() + quality.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="filter-row">
            <div className="filter-group">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name">Name</option>
                <option value="type">Type</option>
                <option value="quality">Quality</option>
              </select>
            </div>
            <div className="filter-group">
              <span className="item-count">Showing {filteredItems.length} items</span>
            </div>
          </div>
        </div>

        {!items || items.length === 0 ? (
          <div className="no-items-message">
            <p>No items available in the library.</p>
            <p style={{ fontSize: '12px', color: '#666' }}>
              Items count: {items ? items.length : 'undefined'}
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="no-items-message">
            <p>No items found matching your criteria.</p>
            <p style={{ fontSize: '12px', color: '#666' }}>
              Total items: {items.length}, Filtered: {filteredItems.length}
            </p>
          </div>
        ) : (
          <div
            className="items-grid"
            onClick={handleGridClick}
            onMouseOver={handleGridMouseOver}
            onMouseLeave={handleGridMouseLeave}
          >
            {iconCards}
          </div>
        )}
      </div>

      {/* Tooltip Portal */}
      {hovered && (
        <TooltipPortal>
          <FollowCursorTooltip item={hovered.item} startX={hovered.x} startY={hovered.y} />
        </TooltipPortal>
      )}
    </div>,
    document.body
  );
};

export default ItemSelectionModal;
