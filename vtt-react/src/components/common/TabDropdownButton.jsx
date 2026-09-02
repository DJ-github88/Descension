import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import useTabOverflow from './useTabOverflow';

const isIconUrl = icon => /^(https?:|\/|data:|\.\/|\.\.\/)/.test(icon);

const TabIcon = ({ icon }) => {
  if (!icon) return null;
  if (isIconUrl(icon)) {
    return <img src={icon} alt="" className="tab-icon-img" />;
  }
  return <i className={`${icon} tab-icon-glyph`}></i>;
};

const TabDropdownButton = ({ tabs, activeTab, onTabClick, onDropdownTabClick, className = '' }) => {
  const handleDropdownSelect = onDropdownTabClick || onTabClick;

  const tabItems = useMemo(() => {
    if (!Array.isArray(tabs)) return [];
    return tabs.map(tab =>
      typeof tab === 'string'
        ? { id: tab, label: tab, icon: null }
        : { id: tab.id, label: tab.label !== undefined ? tab.label : tab.id, icon: tab.icon || null }
    );
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
      {visibleIds.map(id => {
        const tab = itemMap.get(id);
        const hasIcon = Boolean(tab.icon);
        return (
          <button
            key={id}
            type="button"
            data-overflow-id={id}
            className={`spellbook-tab-button ${hasIcon ? 'tab-icon-only' : ''} ${id === activeTab ? 'active' : ''}`}
            onClick={() => onTabClick && onTabClick(id)}
            title={tab.label}
          >
            {hasIcon ? <TabIcon icon={tab.icon} /> : <span className="tab-text">{tab.label}</span>}
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
          title="More tabs"
        >
          ⋮
        </button>
      )}

      {isMenuOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="tab-dropdown-menu tab-dropdown-menu-scrollable tab-overflow-menu"
            style={menuPos ? { top: menuPos.top, left: menuPos.left, minWidth: 200 } : undefined}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            role="menu"
          >
            {hiddenIds.map(id => {
              const tab = itemMap.get(id);
              return (
                <button
                  key={id}
                  type="button"
                  role="menuitem"
                  className={`tab-dropdown-item ${id === activeTab ? 'active' : ''}`}
                  onClick={() => {
                    if (handleDropdownSelect) handleDropdownSelect(id);
                    closeMenu();
                  }}
                >
                  {tab.icon && <TabIcon icon={tab.icon} />}
                  <span style={{ marginLeft: tab.icon ? 8 : 0 }}>{tab.label}</span>
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
