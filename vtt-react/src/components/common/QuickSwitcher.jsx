import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import universalEntityService from '../../services/universalEntityService';
import useInteractiveMapStore from '../../store/interactiveMapStore';
import useFamilyTreeStore from '../../store/familyTreeStore';
import useShareableStore from '../../store/shareableStore';
import './QuickSwitcher.css';

const QUICK_ACTIONS = [
  { id: 'act-new-note', title: 'Create New Journal Note', type: 'action', icon: 'fa-file-circle-plus', color: '#3498db', category: 'Action' },
  { id: 'act-open-map', title: 'Open Planetary & Realm Atlas', type: 'action', icon: 'fa-globe', color: '#1abc9c', category: 'Action' },
  { id: 'act-open-board', title: 'Open Knowledge Mindmap Board', type: 'action', icon: 'fa-diagram-project', color: '#d4af37', category: 'Action' },
  { id: 'act-open-campaign', title: 'Open Campaign Manager', type: 'action', icon: 'fa-chess-rook', color: '#e74c3c', category: 'Action' }
];

const CATEGORY_TABS = [
  { id: 'all', label: 'All', icon: 'fa-asterisk' },
  { id: 'note', label: 'Notes', icon: 'fa-sticky-note' },
  { id: 'npc', label: 'NPCs', icon: 'fa-user-ninja' },
  { id: 'quest', label: 'Quests', icon: 'fa-scroll' },
  { id: 'places', label: 'Places & Maps', icon: 'fa-map-location-dot' },
  { id: 'lore', label: 'Lore & Factions', icon: 'fa-shield-halved' }
];

export const QuickSwitcher = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Search results from UniversalEntityService
  const results = useMemo(() => {
    let typeFilter = null;
    if (activeCategory === 'note') typeFilter = ['note', 'orb'];
    else if (activeCategory === 'npc') typeFilter = ['npc'];
    else if (activeCategory === 'quest') typeFilter = ['quest', 'plot'];
    else if (activeCategory === 'places') typeFilter = ['map', 'map_pin', 'campaign_location', 'world_lore'];
    else if (activeCategory === 'lore') typeFilter = ['world_lore', 'faction', 'lineage', 'dynasty'];

    const entityResults = universalEntityService.searchAll(query, {
      types: typeFilter,
      limit: 30
    });

    if (!query.trim() && activeCategory === 'all') {
      return [...QUICK_ACTIONS, ...entityResults];
    }
    return entityResults;
  }, [query, activeCategory]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global hotkey handler (Ctrl+K / Cmd+K / Ctrl+O)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K' || e.key === 'o' || e.key === 'O')) {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          window.dispatchEvent(new CustomEvent('mythrill_toggle_quick_switcher'));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Modal keyboard navigation
  const handleInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1 < results.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleSelect = (item) => {
    if (!item) return;

    if (item.type === 'action') {
      if (item.id === 'act-new-note') {
        const noteId = useShareableStore.getState().addNote('Untitled Note', '');
        window.dispatchEvent(new CustomEvent('mythrill_navigate_journal', { detail: { noteId } }));
      } else if (item.id === 'act-open-map') {
        window.dispatchEvent(new CustomEvent('mythrill_navigate_map', { detail: { defaultView: true } }));
      } else if (item.id === 'act-open-board') {
        window.dispatchEvent(new CustomEvent('mythrill_navigate_journal', { detail: { section: 'board' } }));
      } else if (item.id === 'act-open-campaign') {
        window.dispatchEvent(new CustomEvent('mythrill_navigate_campaign', { detail: { section: 'overview' } }));
      }
      onClose();
      return;
    }

    // Entity Navigation
    if (item.type === 'map' || item.type === 'map_pin') {
      useInteractiveMapStore.getState().openStudio(item.mapId || item.id, item.type === 'map_pin' ? item.id : null);
    } else if (item.type === 'dynasty') {
      useFamilyTreeStore.getState().openStudio(item.id);
    } else if (item.type === 'note' || item.type === 'orb') {
      window.dispatchEvent(new CustomEvent('mythrill_navigate_journal', { detail: { noteId: item.raw?.id || item.id, section: item.type === 'orb' ? 'board' : 'notes' } }));
    } else if (item.type === 'npc' || item.type === 'quest' || item.type === 'campaign_location' || item.type === 'plot') {
      window.dispatchEvent(new CustomEvent('mythrill_navigate_campaign', { detail: { entityType: item.type, entityId: item.id } }));
    } else {
      window.dispatchEvent(new CustomEvent('mythrill_open_world_dossier', { detail: item }));
    }

    if (onNavigate) onNavigate(item);
    onClose();
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="quick-switcher-overlay" onClick={onClose}>
      <div className="quick-switcher-modal" onClick={e => e.stopPropagation()}>
        {/* Search Bar Header */}
        <div className="quick-switcher-header">
          <i className="fas fa-search quick-switcher-search-icon"></i>
          <input
            ref={inputRef}
            type="text"
            className="quick-switcher-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type to search notes, NPCs, quests, places, maps... (or Esc to exit)"
          />
          <span className="quick-switcher-badge-esc">ESC</span>
        </div>

        {/* Filter Category Tabs */}
        <div className="quick-switcher-tabs">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.id}
              className={`quick-tab-btn ${activeCategory === tab.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(tab.id)}
            >
              <i className={`fas ${tab.icon}`}></i> {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="quick-switcher-list" ref={listRef}>
          {results.length > 0 ? (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={`${item.type}-${item.id}-${idx}`}
                  className={`quick-switcher-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="quick-item-icon" style={{ color: item.color || '#d4af37' }}>
                    <i className={`fas ${item.icon || 'fa-bookmark'}`}></i>
                  </div>
                  <div className="quick-item-details">
                    <div className="quick-item-title-row">
                      <span className="quick-item-title">{item.title}</span>
                      <span className="quick-item-type-tag">{item.category || item.type}</span>
                    </div>
                    <span className="quick-item-subtitle">{item.summary || item.subtitle}</span>
                  </div>
                  {isSelected && <span className="quick-item-enter-hint"><i className="fas fa-turn-down-left"></i> Enter</span>}
                </div>
              );
            })
          ) : (
            <div className="quick-switcher-empty">
              <i className="fas fa-feather-pointed"></i>
              <p>No matching entities found for "{query}"</p>
              <button
                className="quick-create-prompt-btn"
                onClick={() => {
                  const noteId = useShareableStore.getState().addNote(query, '');
                  window.dispatchEvent(new CustomEvent('mythrill_navigate_journal', { detail: { noteId } }));
                  onClose();
                }}
              >
                <i className="fas fa-plus"></i> Create new note "{query}"
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="quick-switcher-footer">
          <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
          <span><kbd>↵</kbd> to select</span>
          <span><kbd>esc</kbd> to dismiss</span>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default QuickSwitcher;
