import React, { useState, useEffect, useRef } from 'react';
import useCharacterStore from '../../store/characterStore';
import useDiceStore from '../../store/diceStore';
import { getCustomIconUrl } from '../../utils/assetManager';
import { mapSpellIcon } from '../spellcrafting-wizard/components/common/spellFormatterUtils';
import './SpellActionBar.css';

const DEFAULT_SLOT_COUNT = 10;
const HOTKEY_LABELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

export const getSpellSlotIconUrl = (spell) => {
  if (!spell) return getCustomIconUrl('Utility/Utility', 'abilities');
  const iconId = spell?.typeConfig?.icon || spell?.icon || spell?.damageConfig?.icon || spell?.healingConfig?.icon || null;
  if (!iconId) return getCustomIconUrl('Utility/Utility', 'abilities');
  if (typeof iconId === 'string' && iconId.startsWith('/assets/')) return iconId;
  if (iconId.includes('/') && !iconId.startsWith('http')) return getCustomIconUrl(iconId, 'abilities');
  if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_') || iconId.startsWith('achievement_')) {
    const mapped = mapSpellIcon(iconId);
    if (mapped) return getCustomIconUrl(mapped, 'abilities');
  }
  return getCustomIconUrl('Utility/Utility', 'abilities');
};

export default function SpellActionBar({ characterId, allSpells = [] }) {
  const character = useCharacterStore(state => state.character);
  const activeCharId = characterId || character?.id || 'default';
  const storageKey = `mythrill_spell_action_bar_${activeCharId}`;

  const [slots, setSlots] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === DEFAULT_SLOT_COUNT) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not load spell action bar from storage', e);
    }
    return Array(DEFAULT_SLOT_COUNT).fill(null);
  });

  const [dragOverSlot, setDragOverSlot] = useState(null);
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [quickAssignSlotIndex, setQuickAssignSlotIndex] = useState(null);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dragSourceSlotRef = useRef(null);

  // Save to localStorage when slots change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(slots));
    } catch (e) {
      console.warn('Could not save spell action bar to storage', e);
    }
  }, [slots, storageKey]);

  // Handle Drag Over
  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (dragOverSlot !== index) {
      setDragOverSlot(index);
    }
  };

  const handleDragLeave = (e, index) => {
    if (dragOverSlot === index) {
      setDragOverSlot(null);
    }
  };

  // Handle Drop onto a Slot
  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    setDragOverSlot(null);

    try {
      // Check if dragging from another slot
      if (dragSourceSlotRef.current !== null) {
        const sourceIndex = dragSourceSlotRef.current;
        dragSourceSlotRef.current = null;
        if (sourceIndex === targetIndex) return;

        setSlots(prev => {
          const next = [...prev];
          const temp = next[targetIndex];
          next[targetIndex] = next[sourceIndex];
          next[sourceIndex] = temp;
          return next;
        });
        return;
      }

      // Dropped from SpellLibrary
      const rawData = e.dataTransfer.getData('application/json');
      if (!rawData) return;
      const spellData = JSON.parse(rawData);

      setSlots(prev => {
        const next = [...prev];
        next[targetIndex] = {
          id: spellData.id,
          name: spellData.name,
          icon: spellData.icon || spellData.typeConfig?.icon,
          spellType: spellData.spellType || 'ACTION',
          description: spellData.description || '',
          manaCost: spellData.resourceCost?.mana || spellData.manaCost || 0,
          apCost: spellData.resourceCost?.actionPoints || spellData.apCost || 1,
          damageFormula: spellData.damageConfig?.formula || spellData.primaryDamage?.dice || null,
          healingFormula: spellData.healingConfig?.formula || spellData.healing?.dice || null
        };
        return next;
      });
    } catch (err) {
      console.error('Error dropping spell into action bar:', err);
    }
  };

  // Handle Drag Start from an existing filled slot
  const handleSlotDragStart = (e, index) => {
    if (!slots[index]) return;
    dragSourceSlotRef.current = index;
    e.dataTransfer.setData('application/json', JSON.stringify(slots[index]));
    e.dataTransfer.effectAllowed = 'move';
  };

  // Clear a single slot
  const handleClearSlot = (e, index) => {
    e.stopPropagation();
    setSlots(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  // Clear all slots - opens custom modal
  const handleClearAll = () => {
    setShowClearConfirmModal(true);
  };

  const handleConfirmClear = () => {
    setSlots(Array(DEFAULT_SLOT_COUNT).fill(null));
    setShowClearConfirmModal(false);
  };

  // Assign a spell from quick assign modal
  const handleQuickAssign = (spell) => {
    if (quickAssignSlotIndex === null) return;
    setSlots(prev => {
      const next = [...prev];
      next[quickAssignSlotIndex] = {
        id: spell.id,
        name: spell.name,
        icon: spell.icon || spell.typeConfig?.icon,
        spellType: spell.spellType || 'ACTION',
        description: spell.description || '',
        manaCost: spell.resourceCost?.mana || spell.manaCost || 0,
        apCost: spell.resourceCost?.actionPoints || spell.apCost || 1,
        damageFormula: spell.damageConfig?.formula || spell.primaryDamage?.dice || null,
        healingFormula: spell.healingConfig?.formula || spell.healing?.dice || null
      };
      return next;
    });
    setQuickAssignSlotIndex(null);
    setSearchQuery('');
  };

  // Slot Click: either assign or trigger dice roll
  const handleSlotClick = (index) => {
    const spell = slots[index];
    if (!spell) {
      setQuickAssignSlotIndex(index);
      return;
    }

    // If spell has a damage or healing formula, roll it!
    const formula = spell.damageFormula || spell.healingFormula;
    if (formula && typeof useDiceStore?.getState?.().rollDiceDirectly === 'function') {
      useDiceStore.getState().rollDiceDirectly(formula, `${spell.name} (${spell.spellType})`);
    } else {
      // Trigger notification or event
      console.log(`[SpellActionBar] Cast spell: ${spell.name}`);
    }
  };

  // Filter available spells for quick assign
  const availableSpells = (allSpells && allSpells.length > 0)
    ? allSpells
    : (character?.spells || []);

  const filteredQuickSpells = availableSpells.filter(s => {
    if (!searchQuery) return true;
    return s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           s.spellType?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="spell-action-bar-container">
      <div className="spell-action-bar-header">
        <h4 className="spell-action-bar-title">
          <i className="fas fa-wand-sparkles"></i>
          <span>Prepared Action Bar</span>
        </h4>
        <span className="spell-action-bar-hint">
          Drag spells from your spellbook or tap an empty slot to assign
        </span>
        <div className="spell-action-bar-actions">
          <button
            type="button"
            className="spell-bar-btn"
            onClick={handleClearAll}
            title="Clear Action Bar"
          >
            <i className="fas fa-trash-can"></i>
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className="spell-action-slots-wrapper">
        <div className="spell-action-slots-row">
          {slots.map((spell, index) => {
            const hotkey = HOTKEY_LABELS[index] || (index + 1);
            const isDragOver = dragOverSlot === index;
            const isHovered = hoveredSlot === index;

            return (
              <div
                key={`action-slot-${index}`}
                className={`spell-action-slot ${spell ? 'has-spell' : ''} ${isDragOver ? 'drag-over' : ''}`}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={(e) => handleDragLeave(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                draggable={!!spell}
                onDragStart={(e) => handleSlotDragStart(e, index)}
                onClick={() => handleSlotClick(index)}
                onMouseEnter={() => setHoveredSlot(index)}
                onMouseLeave={() => setHoveredSlot(null)}
                title={spell ? `${spell.name} (${spell.spellType || 'Action'})` : `Slot ${hotkey} (Empty)`}
              >
                <span className="spell-slot-key">{hotkey}</span>

                {spell ? (
                  <>
                    <img
                      src={getSpellSlotIconUrl(spell)}
                      alt={spell.name}
                      className="spell-slot-icon-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                      }}
                    />
                    {spell.manaCost > 0 && (
                      <span className="spell-slot-cost">{spell.manaCost} MP</span>
                    )}
                    <button
                      type="button"
                      className="spell-slot-clear-btn"
                      onClick={(e) => handleClearSlot(e, index)}
                      title="Remove spell"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </>
                ) : (
                  <i className="fas fa-plus spell-slot-empty"></i>
                )}

                {/* Hover Tooltip */}
                {isHovered && spell && (
                  <div className="spell-slot-tooltip">
                    <span className="spell-slot-tooltip-name">{spell.name}</span>
                    <span className="spell-slot-tooltip-type">
                      {spell.spellType || 'Action'} {spell.damageFormula ? `• ${spell.damageFormula}` : ''}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Assign Modal (Mobile & Tap friendly) */}
      {quickAssignSlotIndex !== null && (
        <div className="spell-quick-assign-overlay" onClick={() => setQuickAssignSlotIndex(null)}>
          <div className="spell-quick-assign-modal" onClick={(e) => e.stopPropagation()}>
            <div className="spell-quick-assign-header">
              <h3>Assign Spell to Slot {HOTKEY_LABELS[quickAssignSlotIndex] || (quickAssignSlotIndex + 1)}</h3>
              <button
                type="button"
                className="spell-quick-assign-close"
                onClick={() => setQuickAssignSlotIndex(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="spell-quick-assign-search">
              <input
                type="text"
                className="spell-quick-assign-input"
                placeholder="Search spells by name or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className="spell-quick-assign-list">
              {filteredQuickSpells.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#c4a482', fontStyle: 'italic', padding: '16px' }}>
                  No matching spells found.
                </p>
              ) : (
                filteredQuickSpells.map(s => (
                  <div
                    key={s.id || s.name}
                    className="spell-quick-assign-item"
                    onClick={() => handleQuickAssign(s)}
                  >
                    <img
                      src={getSpellSlotIconUrl(s)}
                      alt={s.name}
                      className="spell-quick-assign-item-icon"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                      }}
                    />
                    <div className="spell-quick-assign-item-info">
                      <p className="spell-quick-assign-item-name">{s.name}</p>
                      <p className="spell-quick-assign-item-desc">
                        {s.spellType || 'Action'} • {s.description || 'Spell ability'}
                      </p>
                    </div>
                    <i className="fas fa-plus" style={{ color: '#ffd700', fontSize: '0.85rem' }}></i>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showClearConfirmModal && (
        <div className="spell-confirm-overlay" onClick={() => setShowClearConfirmModal(false)}>
          <div className="spell-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h4 className="spell-confirm-title">
              <i className="fas fa-triangle-exclamation"></i>
              <span>Clear Action Bar</span>
            </h4>
            <p className="spell-confirm-body">
              Are you sure you want to clear all prepared spells from your action bar?
            </p>
            <div className="spell-confirm-buttons">
              <button
                type="button"
                className="spell-confirm-btn cancel"
                onClick={() => setShowClearConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="spell-confirm-btn confirm"
                onClick={handleConfirmClear}
              >
                Clear Spells
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
