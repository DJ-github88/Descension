import React, { useState, useMemo, useEffect } from 'react';
import UnifiedSpellCard from '../spellcrafting-wizard/components/common/UnifiedSpellCard';
import { SpellLibraryProvider } from '../spellcrafting-wizard/context/SpellLibraryContext';
import {
  loadLibraryFromStorage,
  saveLibraryToStorage,
  getDefaultLibrary
} from '../spellcrafting-wizard/core/utils/libraryManager';
import { SPELL_PRESETS } from './BookTtrpgBlocks';
import './BookDocumentEditor.css';
import './BookAtmosphere.css';

const EXTRA_DESCENSION_SPELLS = [
  {
    id: 'spell-preset-wyrd-shackles',
    name: 'Chains of the Wyrd',
    category: 'debuff',
    damageTypes: ['wyrd'],
    tier: 'T2',
    spellType: 'ACTION',
    ap: 2,
    manaCost: 18,
    range: '45 ft.',
    duration: '3 Rounds',
    targetingMode: 'single',
    effect: 'Spectral runic chains bind the target. They must pass a DC 15 Spirit save or be Restrained and take 2d6 Wyrd damage at the start of each turn.',
    empower: 'Each additional 6 Mana binds 1 additional target within 15 ft.',
    primaryDamage: { dice: '2d6', flat: 0 },
    tags: ['debuff', 'control', 'wyrd']
  },
  {
    id: 'spell-preset-cinder-nova',
    name: 'Chromatic Cinder-Burst',
    category: 'damage',
    damageTypes: ['ember'],
    tier: 'T3',
    spellType: 'ACTION',
    ap: 3,
    manaCost: 28,
    range: '60 ft.',
    duration: 'Instantaneous',
    targetingMode: 'aoe',
    effect: 'Detonates a prism of molten obsidian in a 15-ft radius, dealing 6d6 Ember damage and igniting flammable terrain (DC 16 Agility save for half).',
    empower: 'Each additional 8 Mana adds 2d6 Ember damage.',
    primaryDamage: { dice: '6d6', flat: 4 },
    tags: ['offensive', 'damage', 'ember', 'aoe']
  },
  {
    id: 'spell-preset-mist-veil',
    name: 'Shroud of the Frostwood',
    category: 'utility',
    damageTypes: ['rime'],
    tier: 'T1',
    spellType: 'REACTION',
    ap: 1,
    manaCost: 10,
    range: 'Self (15-ft aura)',
    duration: '2 Rounds',
    targetingMode: 'aoe',
    effect: 'Conjures dense thermal mist around the caster, granting half-cover against ranged strikes and extinguishing non-magical flames.',
    empower: 'Spend +5 Mana to allow allies within the mist to Step 10 ft without provoking reactions.',
    primaryDamage: { dice: '0', flat: 0 },
    tags: ['utility', 'defensive', 'rime', 'mist']
  },
  {
    id: 'spell-preset-mend-ichor',
    name: 'Sovereign Mending Draught',
    category: 'healing',
    damageTypes: ['sacred'],
    tier: 'T2',
    spellType: 'ACTION',
    ap: 2,
    manaCost: 16,
    range: '30 ft.',
    duration: 'Instantaneous',
    targetingMode: 'single',
    effect: 'Weaves golden threads of vitality into a wounded ally, restoring 3d8 + 6 Hit Points and cleansing 1 stack of Bleeding or Frostbite.',
    empower: 'Each additional 5 Mana restores +1d8 HP.',
    primaryDamage: { dice: '3d8', flat: 6 },
    tags: ['healing', 'restoration', 'sacred']
  }
];

export const normalizeBookSpellData = (raw = {}) => {
  const category = (raw.category || (Array.isArray(raw.effectTypes) && raw.effectTypes[0]) || 'damage').toLowerCase();
  const isDamage = category === 'damage';
  const isHealing = category === 'healing';
  const damageType = (raw.damageTypes && raw.damageTypes[0]) || raw.damageType || (isDamage ? 'ember' : 'sacred');
  const damageTypes = Array.isArray(raw.damageTypes) && raw.damageTypes.length > 0 ? raw.damageTypes : [damageType];
  const primaryDice = raw.primaryDamage?.dice || raw.damageConfig?.formula || (isDamage ? '4d6' : '2d8');
  const primaryFlat = raw.primaryDamage?.flat || 0;
  const formulaStr = primaryFlat ? `${primaryDice} + ${primaryFlat}` : String(primaryDice);
  const tierRaw = String(raw.tier || 'T1').toUpperCase();
  const tier = tierRaw.startsWith('T') ? tierRaw : `T${tierRaw}`;
  const rangeStr = typeof raw.range === 'number' ? `${raw.range} ft.` : (raw.range || '45 ft.');
  const effectText = raw.effect || raw.description || raw.mechanics || 'Channels arcane energy into a focused manifestation.';

  return {
    id: raw.id || `spell-${(raw.name || 'formula').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    linkedEntityId: raw.linkedEntityId || raw.id || null,
    syncMode: raw.syncMode || 'live',
    name: raw.name || 'Unnamed Spell Formula',
    category,
    damageType,
    damageTypes,
    tier,
    spellType: raw.spellType || 'ACTION',
    ap: Number(raw.ap ?? raw.resourceCosts?.action_points?.baseAmount ?? 2),
    manaCost: Number(raw.manaCost ?? raw.resourceCosts?.mana?.baseAmount ?? 15),
    range: rangeStr,
    duration: raw.duration || 'Instantaneous',
    targetingMode: raw.targetingMode || 'single',
    effect: effectText,
    description: effectText,
    mechanics: effectText,
    empower: raw.empower || '',
    primaryDamage: { dice: String(primaryDice).replace(/\s*\+\s*\d+$/, ''), flat: Number(primaryFlat) || 0 },
    effectTypes: [category],
    tags: Array.isArray(raw.tags) && raw.tags.length > 0 ? raw.tags : [category, damageType, 'descension'],
    damageConfig: isDamage
      ? {
          formula: formulaStr,
          damageType,
          damageTypes,
          resolution: 'DICE',
          targeting: raw.targetingMode || 'single',
          range: rangeStr,
          description: effectText
        }
      : null,
    healingConfig: isHealing
      ? {
          formula: formulaStr,
          healingType: 'instant',
          resolution: 'DICE',
          description: effectText
        }
      : null,
    damageEffects: isDamage ? [{ id: 'dmg-1', damageType, formula: formulaStr }] : []
  };
};

const CATEGORY_FILTERS = [
  { value: 'all', label: 'All Schools & Effects' },
  { value: 'damage', label: 'Offensive / Damage' },
  { value: 'healing', label: 'Restoration / Healing' },
  { value: 'buff', label: 'Blessing / Buff' },
  { value: 'debuff', label: 'Curse / Control' },
  { value: 'utility', label: 'Arcane Utility' }
];

const BookSpellPickerModal = ({
  isOpen,
  onClose,
  initialData = {},
  onSelectSpell
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [mode, setMode] = useState('browse'); // 'browse' | 'forge'
  const [syncMode, setSyncMode] = useState(initialData?.syncMode || 'live');

  const librarySpells = useMemo(() => {
    try {
      const stored = loadLibraryFromStorage?.() || getDefaultLibrary?.();
      const rawList = Array.isArray(stored?.spells) ? stored.spells : [];
      const presets = [...SPELL_PRESETS, ...EXTRA_DESCENSION_SPELLS];
      const byName = new Map();
      [...rawList, ...presets].forEach((sp) => {
        if (sp && sp.name) {
          const norm = normalizeBookSpellData(sp);
          byName.set(norm.name.toLowerCase(), norm);
        }
      });
      return Array.from(byName.values());
    } catch {
      return [...SPELL_PRESETS, ...EXTRA_DESCENSION_SPELLS].map(normalizeBookSpellData);
    }
  }, [isOpen]);

  const [selectedSpell, setSelectedSpell] = useState(() =>
    initialData?.name ? normalizeBookSpellData(initialData) : (librarySpells[0] || normalizeBookSpellData(SPELL_PRESETS[0]))
  );

  const [draftSpell, setDraftSpell] = useState(() => normalizeBookSpellData(initialData?.name ? initialData : SPELL_PRESETS[0]));

  useEffect(() => {
    if (isOpen && initialData?.name) {
      const norm = normalizeBookSpellData(initialData);
      setSelectedSpell(norm);
      setDraftSpell(norm);
      setSyncMode(initialData.syncMode || 'live');
    }
  }, [isOpen, initialData]);

  const filteredSpells = useMemo(() => {
    return librarySpells.filter((sp) => {
      const matchesCat = categoryFilter === 'all' || sp.category === categoryFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        sp.name.toLowerCase().includes(q) ||
        (sp.effect || '').toLowerCase().includes(q) ||
        (sp.damageType || '').toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [librarySpells, categoryFilter, searchQuery]);

  if (!isOpen) return null;

  const handleConfirmSelection = (spellObj) => {
    const normalized = normalizeBookSpellData({
      ...spellObj,
      syncMode,
      linkedEntityId: spellObj.id
    });

    if (mode === 'forge' && syncMode === 'live') {
      try {
        const currentLib = loadLibraryFromStorage?.() || getDefaultLibrary?.() || { spells: [] };
        const spells = Array.isArray(currentLib.spells) ? [...currentLib.spells] : [];
        const existingIdx = spells.findIndex((s) => s.id === normalized.id || s.name?.toLowerCase() === normalized.name.toLowerCase());
        if (existingIdx >= 0) {
          spells[existingIdx] = { ...spells[existingIdx], ...normalized };
        } else {
          spells.unshift(normalized);
        }
        saveLibraryToStorage?.({ ...currentLib, spells });
      } catch (e) {
        console.debug('Spell library sync skipped:', e);
      }
    }

    onSelectSpell(normalized);
    onClose();
  };

  const activePreview = mode === 'forge' ? normalizeBookSpellData(draftSpell) : selectedSpell;

  return (
    <div className="book-modal-backdrop" onClick={onClose}>
      <div
        className="book-creature-picker-modal book-spell-picker-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Arcane Spell Grimoire & Formula Studio"
      >
        <div className="picker-modal-header">
          <div className="picker-header-title-group">
            <i className="fas fa-wand-sparkles"></i>
            <div>
              <h3>Arcane Grimoire &amp; Spellcrafting Studio</h3>
              <p>Inscribe a Descension spell formula from your Spellbook or forge a custom incantation</p>
            </div>
          </div>

          <div className="picker-header-actions">
            <div className="book-sync-mode-pill-group" title="Choose whether changes stay linked with your global Spellbook">
              <button
                type="button"
                className={`sync-pill-btn ${syncMode === 'live' ? 'active' : ''}`}
                onClick={() => setSyncMode('live')}
              >
                <i className="fas fa-link"></i> Live Sync
              </button>
              <button
                type="button"
                className={`sync-pill-btn ${syncMode === 'snapshot' ? 'active' : ''}`}
                onClick={() => setSyncMode('snapshot')}
              >
                <i className="fas fa-thumbtack"></i> Snapshot
              </button>
            </div>

            <button
              type="button"
              className={`launch-wizard-header-btn ${mode === 'forge' ? 'active' : ''}`}
              onClick={() => {
                if (mode === 'browse') {
                  setDraftSpell(selectedSpell || normalizeBookSpellData(SPELL_PRESETS[0]));
                  setMode('forge');
                } else {
                  setMode('browse');
                }
              }}
            >
              <i className={`fas ${mode === 'forge' ? 'fa-book-atlas' : 'fa-hat-wizard'}`}></i>
              {mode === 'forge' ? 'Browse Spell Library' : 'Forge Custom Spell'}
            </button>
            <button type="button" className="modal-close-x" onClick={onClose} aria-label="Close Spell Studio">
              &times;
            </button>
          </div>
        </div>

        <div className="picker-modal-split-body">
          {mode === 'browse' ? (
            <div className="picker-catalog-pane">
              <div className="picker-filter-bar">
                <div className="picker-search-input-wrap">
                  <i className="fas fa-magnifying-glass"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search spells by name, element (rime, ember, wyrd), or effect..."
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="picker-filter-select"
                >
                  {CATEGORY_FILTERS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>

              <div className="picker-catalog-list">
                {filteredSpells.map((sp) => {
                  const isSelected = selectedSpell?.name === sp.name;
                  return (
                    <div
                      key={sp.id || sp.name}
                      className={`picker-catalog-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedSpell(sp)}
                      onDoubleClick={() => handleConfirmSelection(sp)}
                    >
                      <div className="creature-fallback-badge">
                        <i className="fas fa-scroll"></i>
                      </div>
                      <div className="catalog-row-info">
                        <div className="catalog-row-name">{sp.name}</div>
                        <div className="catalog-row-sub">
                          {sp.tier} • {sp.category.toUpperCase()} • {sp.manaCost} Mana • {sp.ap} AP
                        </div>
                      </div>
                      <span className="catalog-danger-pill">{sp.damageType}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="picker-catalog-pane spell-forge-pane" style={{ padding: '18px 20px', overflowY: 'auto' }}>
              <div className="authoring-form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="author-field" style={{ gridColumn: '1 / -1' }}>
                  <label>Incantation Title</label>
                  <input
                    type="text"
                    value={draftSpell.name}
                    onChange={(e) => setDraftSpell({ ...draftSpell, name: e.target.value })}
                    placeholder="e.g. Sovereign Rime-Lance"
                  />
                </div>
                <div className="author-field">
                  <label>Category</label>
                  <select
                    value={draftSpell.category}
                    onChange={(e) => setDraftSpell({ ...draftSpell, category: e.target.value })}
                  >
                    <option value="damage">Damage</option>
                    <option value="healing">Healing</option>
                    <option value="buff">Blessing / Buff</option>
                    <option value="debuff">Curse / Debuff</option>
                    <option value="utility">Utility</option>
                  </select>
                </div>
                <div className="author-field">
                  <label>Element / Affinity</label>
                  <select
                    value={draftSpell.damageType}
                    onChange={(e) =>
                      setDraftSpell({
                        ...draftSpell,
                        damageType: e.target.value,
                        damageTypes: [e.target.value]
                      })
                    }
                  >
                    <option value="rime">Rime (Frost)</option>
                    <option value="ember">Ember (Fire)</option>
                    <option value="wyrd">Wyrd (Arcane/Eldritch)</option>
                    <option value="sacred">Sacred (Radiant)</option>
                    <option value="void">Void (Shadow)</option>
                    <option value="storm">Storm (Lightning)</option>
                    <option value="physical">Physical (Force)</option>
                  </select>
                </div>
                <div className="author-field">
                  <label>Tier</label>
                  <select
                    value={draftSpell.tier}
                    onChange={(e) => setDraftSpell({ ...draftSpell, tier: e.target.value })}
                  >
                    <option value="T1">Tier 1 (Novice)</option>
                    <option value="T2">Tier 2 (Adept)</option>
                    <option value="T3">Tier 3 (Magister)</option>
                    <option value="T4">Tier 4 (Archmage)</option>
                    <option value="T5">Tier 5 (Sovereign)</option>
                  </select>
                </div>
                <div className="author-field">
                  <label>Dice Formula</label>
                  <input
                    type="text"
                    value={draftSpell.primaryDamage?.dice || '3d8'}
                    onChange={(e) =>
                      setDraftSpell({
                        ...draftSpell,
                        primaryDamage: { ...(draftSpell.primaryDamage || {}), dice: e.target.value }
                      })
                    }
                    placeholder="e.g. 3d8, 4d6"
                  />
                </div>
                <div className="author-field">
                  <label>Mana Cost</label>
                  <input
                    type="number"
                    value={draftSpell.manaCost}
                    onChange={(e) => setDraftSpell({ ...draftSpell, manaCost: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>
                <div className="author-field">
                  <label>AP Cost</label>
                  <input
                    type="number"
                    value={draftSpell.ap}
                    onChange={(e) => setDraftSpell({ ...draftSpell, ap: parseInt(e.target.value, 10) || 1 })}
                  />
                </div>
                <div className="author-field">
                  <label>Range</label>
                  <input
                    type="text"
                    value={draftSpell.range}
                    onChange={(e) => setDraftSpell({ ...draftSpell, range: e.target.value })}
                  />
                </div>
                <div className="author-field">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={draftSpell.duration}
                    onChange={(e) => setDraftSpell({ ...draftSpell, duration: e.target.value })}
                  />
                </div>
                <div className="author-field" style={{ gridColumn: '1 / -1' }}>
                  <label>Mechanical Effect &amp; Saving Throw</label>
                  <textarea
                    rows={3}
                    value={draftSpell.effect}
                    onChange={(e) =>
                      setDraftSpell({ ...draftSpell, effect: e.target.value, description: e.target.value })
                    }
                  />
                </div>
                <div className="author-field" style={{ gridColumn: '1 / -1' }}>
                  <label>Empower Scaling</label>
                  <input
                    type="text"
                    value={draftSpell.empower || ''}
                    onChange={(e) => setDraftSpell({ ...draftSpell, empower: e.target.value })}
                    placeholder="e.g. Each additional 5 Mana adds +1d8 damage..."
                  />
                </div>
              </div>
            </div>
          )}

          <div className="picker-preview-pane">
            {activePreview && (
              <div className="picker-preview-scroll">
                <SpellLibraryProvider>
                  <UnifiedSpellCard
                    spell={activePreview}
                    variant="wizard"
                    showActions={false}
                    showDescription={true}
                    showStats={true}
                    showTags={true}
                  />
                </SpellLibraryProvider>
                <div className="picker-preview-footer" style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    className="confirm-select-creature-btn"
                    onClick={() => handleConfirmSelection(activePreview)}
                  >
                    <i className="fas fa-check"></i> Inscribe Formula into Page
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSpellPickerModal;
