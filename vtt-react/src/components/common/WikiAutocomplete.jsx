import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import universalEntityService from '../../services/universalEntityService';
import useShareableStore from '../../store/shareableStore';
import './WikiAutocomplete.css';

const ARCHETYPE_SHORTCUTS = [
  { id: 'note', label: 'Note', icon: 'fa-sticky-note', color: '#3498db' },
  { id: 'npc', label: 'NPC', icon: 'fa-user-ninja', color: '#e74c3c' },
  { id: 'location', label: 'Location', icon: 'fa-landmark', color: '#2ecc71' },
  { id: 'faction', label: 'Faction', icon: 'fa-shield-halved', color: '#e67e22' },
  { id: 'item', label: 'Item / Relic', icon: 'fa-gem', color: '#9b59b6' },
  { id: 'lore', label: 'Lore', icon: 'fa-book-bookmark', color: '#d4af37' }
];

export const WikiAutocomplete = ({ textareaRef, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [matchStartIndex, setMatchStartIndex] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const popoverRef = useRef(null);

  // Search results
  const results = useMemo(() => {
    if (!isOpen) return [];
    const entityMatches = universalEntityService.searchAll(query, { limit: 8 });
    return entityMatches;
  }, [isOpen, query]);

  // Check cursor position and trigger syntax on value or selection change
  useEffect(() => {
    const textarea = textareaRef?.current;
    if (!textarea) return;

    const handleCheckTrigger = () => {
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = value.slice(0, cursorPos);

      // Find the last [[ before cursor that is not closed by ]]
      const lastOpenIdx = textBeforeCursor.lastIndexOf('[[');
      if (lastOpenIdx === -1) {
        setIsOpen(false);
        return;
      }

      const textBetween = textBeforeCursor.slice(lastOpenIdx + 2);
      // If there is a newline or ]] between [[ and cursor, do not open
      if (textBetween.includes('\n') || textBetween.includes(']]')) {
        setIsOpen(false);
        return;
      }

      // Valid [[ trigger active
      setMatchStartIndex(lastOpenIdx);
      setQuery(textBetween.trim());
      setSelectedIndex(0);

      // Calculate approximate position near the textarea
      const rect = textarea.getBoundingClientRect();
      const lines = textBeforeCursor.split('\n');
      const lineIndex = lines.length - 1;
      const currentLineText = lines[lineIndex];
      
      const approxLineHeight = 20;
      const approxCharWidth = 7.5;
      
      const calculatedTop = rect.top + Math.min(rect.height - 40, (lineIndex + 1) * approxLineHeight + 8) + window.scrollY;
      const calculatedLeft = Math.min(window.innerWidth - 340, rect.left + Math.min(rect.width - 200, currentLineText.length * approxCharWidth) + window.scrollX);

      setPosition({
        top: Math.max(10, calculatedTop),
        left: Math.max(10, calculatedLeft)
      });
      setIsOpen(true);
    };

    textarea.addEventListener('keyup', handleCheckTrigger);
    textarea.addEventListener('click', handleCheckTrigger);

    return () => {
      textarea.removeEventListener('keyup', handleCheckTrigger);
      textarea.removeEventListener('click', handleCheckTrigger);
    };
  }, [textareaRef, value]);

  // Keyboard navigation when open
  useEffect(() => {
    const textarea = textareaRef?.current;
    if (!textarea || !isOpen) return;

    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1 < results.length ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        if (results.length > 0 && results[selectedIndex]) {
          e.preventDefault();
          handleSelectEntity(results[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    textarea.addEventListener('keydown', handleKeyDown);
    return () => textarea.removeEventListener('keydown', handleKeyDown);
  }, [textareaRef, isOpen, results, selectedIndex]);

  const handleSelectEntity = (entity) => {
    const textarea = textareaRef?.current;
    if (!textarea || matchStartIndex === -1) return;

    const cursorPos = textarea.selectionStart;
    const before = value.slice(0, matchStartIndex);
    const after = value.slice(cursorPos);

    const insertedText = `[[${entity.title || entity.name}]]`;
    const nextValue = before + insertedText + after;
    const nextCursorPos = before.length + insertedText.length;

    if (onChange) {
      onChange(nextValue, nextCursorPos);
    }

    setIsOpen(false);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(nextCursorPos, nextCursorPos);
    }, 10);
  };

  const handleCreateWithArchetype = (archetype) => {
    const textarea = textareaRef?.current;
    if (!textarea || !query.trim() || matchStartIndex === -1) return;

    const entityTitle = query.trim();
    // 1. Add note to store with chosen archetype
    const addNote = useShareableStore.getState().addNote;
    const noteId = addNote(entityTitle, `Draft article for ${entityTitle}.`, { archetype });

    // 2. Insert [[Title]] into text
    const cursorPos = textarea.selectionStart;
    const before = value.slice(0, matchStartIndex);
    const after = value.slice(cursorPos);

    const insertedText = `[[${entityTitle}]]`;
    const nextValue = before + insertedText + after;
    const nextCursorPos = before.length + insertedText.length;

    if (onChange) {
      onChange(nextValue, nextCursorPos);
    }

    // 3. Dispatch quick peek so user can preview or draft it immediately
    window.dispatchEvent(new CustomEvent('mythrill_quick_peek', {
      detail: {
        id: noteId,
        title: entityTitle,
        type: 'note',
        archetype,
        raw: { id: noteId, title: entityTitle, archetype, content: '' }
      }
    }));

    setIsOpen(false);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(nextCursorPos, nextCursorPos);
    }, 10);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div 
      ref={popoverRef}
      className="wiki-autocomplete-popover" 
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="wiki-autocomplete-header">
        <span className="wiki-autocomplete-title">
          <i className="fas fa-bookmark" style={{ color: '#d4af37', marginRight: '5px' }}></i>
          Link to Lore Entity
        </span>
        <span className="wiki-autocomplete-hint">Tab / ↵ to insert</span>
      </div>

      <div className="wiki-autocomplete-list">
        {results.length > 0 ? (
          results.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`wiki-autocomplete-item ${idx === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSelectEntity(item)}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              <div className="wiki-item-icon" style={{ color: item.color || '#d4af37' }}>
                <i className={`fas ${item.icon || 'fa-scroll'}`}></i>
              </div>
              <div className="wiki-item-info">
                <div className="wiki-item-title-row">
                  <span className="wiki-item-title">{item.title}</span>
                  <span className="wiki-item-badge">{item.category || item.type}</span>
                </div>
                <span className="wiki-item-subtitle">{item.subtitle || item.summary?.slice(0, 45)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="wiki-autocomplete-empty">
            <span>No matching lore entity found</span>
          </div>
        )}
      </div>

      {query.trim().length > 0 && (
        <div className="wiki-autocomplete-create-section">
          <div className="wiki-create-heading">
            <i className="fas fa-plus-circle" style={{ color: '#e67e22', marginRight: '4px' }}></i>
            Create <strong>"{query}"</strong> as:
          </div>
          <div className="wiki-create-archetypes">
            {ARCHETYPE_SHORTCUTS.map(arch => (
              <button
                key={arch.id}
                type="button"
                className="wiki-create-arch-btn"
                onClick={() => handleCreateWithArchetype(arch.id)}
                title={`Create "${query}" as ${arch.label}`}
              >
                <i className={`fas ${arch.icon}`} style={{ color: arch.color }}></i>
                <span>{arch.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

export default WikiAutocomplete;
