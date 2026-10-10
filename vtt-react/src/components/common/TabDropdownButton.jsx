import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import useTabOverflow from './useTabOverflow';

const isIconUrl = icon => /^(https?:|\/|data:|\.\/|\.\.\/)/.test(icon);

const TabIcon = ({ icon }) => {
  if (!icon) return null;
  if (React.isValidElement(icon)) return icon;
  if (typeof icon === 'string') {
    if (isIconUrl(icon)) {
      return <img src={icon} alt="" className="tab-icon-img" />;
    }
    const iconClass = icon.startsWith('fa-') ? `fas ${icon}` : icon;
    return <i className={`${iconClass} tab-icon-glyph`} aria-hidden="true"></i>;
  }
  return null;
};

const TabDropdownButton = ({
  tabs,
  activeTab,
  onTabClick,
  onDropdownTabClick,
  className = '',
  beforeTabs = null,
  afterTabs = null,
  iconOnly = false
}) => {
  const handleDropdownSelect = onDropdownTabClick || onTabClick;

  const tabItems = useMemo(() => {
    if (!Array.isArray(tabs)) return [];
    return tabs.map(tab => {
      if (typeof tab === 'string') {
        return { id: tab, label: tab, icon: null };
      }
      return {
        id: tab.id,
        label: tab.label !== undefined ? tab.label : (tab.title !== undefined ? tab.title : (tab.name !== undefined ? tab.name : tab.id)),
        icon: tab.icon || null,
        iconOnly: tab.iconOnly || false,
        badge: tab.badge !== undefined ? tab.badge : (tab.count !== undefined ? tab.count : undefined),
        tooltip: tab.tooltip || tab.title || tab.label,
        disabled: Boolean(tab.disabled)
      };
    });
  }, [tabs]);

  const itemIds = useMemo(() => tabItems.map(t => t.id), [tabItems]);
  const itemMap = useMemo(() => new Map(tabItems.map(t => [t.id, t])), [tabItems]);

  const { containerRef, visibleIds, hiddenIds } = useTabOverflow({ itemIds, triggerWidth: 36 });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const openTimerRef = useRef(null);
  const closeTimerRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (openTimerRef.current) { clearTimeout(openTimerRef.current); openTimerRef.current = null; }
    if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
  }, []);

  const openMenu = useCallback(() => {
    clearTimers();
    const rect = triggerRef.current ? triggerRef.current.getBoundingClientRect() : null;
    if (rect) {
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - 230));
      setMenuPos({ top: rect.bottom + 4, left });
    }
    setIsMenuOpen(true);
  }, [clearTimers]);

  const closeMenu = useCallback(() => {
    clearTimers();
    setIsMenuOpen(false);
  }, [clearTimers]);

  const scheduleOpen = useCallback(() => {
    if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
    if (openTimerRef.current || isMenuOpen) return;
    openTimerRef.current = setTimeout(() => {
      openTimerRef.current = null;
      openMenu();
    }, 120);
  }, [isMenuOpen, openMenu]);

  const scheduleClose = useCallback(() => {
    if (openTimerRef.current) { clearTimeout(openTimerRef.current); openTimerRef.current = null; }
    if (closeTimerRef.current || !isMenuOpen) return;
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      setIsMenuOpen(false);
    }, 220);
  }, [isMenuOpen]);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    if (hiddenIds.length === 0) setIsMenuOpen(false);
  }, [hiddenIds.length]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const handlePointerDown = e => {
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      if (triggerRef.current && triggerRef.current.contains(e.target)) return;
      closeMenu();
    };
    const handleKeyDown = e => {
      if (e.key === 'Escape') closeMenu();
    };
    const handleReposition = () => closeMenu();
    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [isMenuOpen, closeMenu]);

  return (
    <div ref={containerRef} className={`spellbook-tab-container tab-overflow-root ${className}`.trim()}>
      {beforeTabs}
      {visibleIds.map(id => {
        const tab = itemMap.get(id);
        if (!tab) return null;
        const hasIcon = Boolean(tab.icon);
        const showIconOnly = Boolean(iconOnly || tab.iconOnly);
        const isActive = id === activeTab;
        return (
          <button
            key={id}
            type="button"
            data-overflow-id={id}
            className={`spellbook-tab-button ${showIconOnly && hasIcon ? 'tab-icon-only' : ''} ${isActive ? 'active' : ''}`}
            onClick={() => onTabClick && onTabClick(id)}
            title={tab.tooltip || tab.label}
            aria-label={tab.label}
            aria-pressed={isActive}
            disabled={tab.disabled}
          >
            {hasIcon && <TabIcon icon={tab.icon} />}
            {(!showIconOnly || !hasIcon) && tab.label && <span className="tab-text">{tab.label}</span>}
            {tab.badge !== undefined && <span className="tab-badge">{tab.badge}</span>}
          </button>
        );
      })}

      {hiddenIds.length > 0 && (
        <button
          ref={triggerRef}
          type="button"
          data-overflow-trigger=""
          className={[
            'tab-overflow-trigger',
            isMenuOpen ? 'open' : '',
            hiddenIds.indexOf(activeTab) !== -1 ? 'has-active' : ''
          ].filter(Boolean).join(' ')}
          onClick={() => (isMenuOpen ? closeMenu() : openMenu())}
          onMouseEnter={scheduleOpen}
          onMouseLeave={scheduleClose}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          aria-label="More tabs"
          title="More tabs"
        >
          ⋮
        </button>
      )}
      {afterTabs}

      {isMenuOpen && hiddenIds.length > 0 &&
        createPortal(
          <div
            ref={menuRef}
            className="tab-dropdown-menu tab-dropdown-menu-scrollable tab-overflow-menu adventurer-menu"
            style={menuPos ? { position: 'fixed', top: menuPos.top, left: menuPos.left, minWidth: 200 } : { position: 'fixed', minWidth: 200 }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            role="menu"
          >
            {hiddenIds.map(id => {
              const tab = itemMap.get(id);
              if (!tab) return null;
              const isActive = id === activeTab;
              return (
                <button
                  key={id}
                  type="button"
                  role="menuitem"
                  className={`tab-dropdown-item ${isActive ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (handleDropdownSelect) handleDropdownSelect(id);
                    closeMenu();
                  }}
                >
                  {tab.icon && <TabIcon icon={tab.icon} />}
                  <span style={{ marginLeft: tab.icon ? 8 : 0 }}>{tab.label}</span>
                  {tab.badge !== undefined && <span className="tab-badge" style={{ marginLeft: 'auto' }}>{tab.badge}</span>}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
};

export default TabDropdownButton;
