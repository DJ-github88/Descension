import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import useCreatureStore from '../../store/creatureStore';
import { CreatureLibraryProvider } from '../creature-wizard/context/CreatureLibraryContext';
import { CreatureWizardProvider } from '../creature-wizard/context/CreatureWizardContext';
import { CREATURE_PRESETS, normalizeDangerLevel } from './BookTtrpgBlocks';
import staticCreaturesData from '../../data/creatureData.json';
import { getIconUrl } from '../../utils/assetManager';
import './BookDocumentEditor.css';

const CreatureWizardApp = lazy(() => import('../creature-wizard/CreatureWizardApp'));

const DANGER_FILTERS = [
  { value: 'all', label: 'All Danger Levels' },
  { value: 'low', label: 'Low', color: '#27ae60' },
  { value: 'medium', label: 'Medium', color: '#3498db' },
  { value: 'high', label: 'High', color: '#e67e22' },
  { value: 'very high', label: 'Very High', color: '#e74c3c' },
  { value: 'extreme', label: 'Extreme', color: '#9b59b6' },
  { value: 'apex', label: 'Apex', color: '#d35400' }
];

const TYPE_FILTERS = [
  { value: 'all', label: 'All Types' },
  { value: 'humanoid', label: 'Humanoid' },
  { value: 'undead', label: 'Undead' },
  { value: 'elemental', label: 'Elemental' },
  { value: 'dragon', label: 'Dragon' },
  { value: 'beast', label: 'Beast' },
  { value: 'fiend', label: 'Fiend' },
  { value: 'monstrosity', label: 'Monstrosity' },
  { value: 'fey', label: 'Fey' },
  { value: 'aberration', label: 'Aberration' }
];

const getCreatureTypeIcon = (typeStr = '', name = '') => {
  const s = `${typeStr} ${name}`.toLowerCase();
  if (s.includes('dragon') || s.includes('wyrm')) return 'fa-dragon';
  if (s.includes('undead') || s.includes('revenant') || s.includes('skeleton') || s.includes('zombie')) return 'fa-skull';
  if (s.includes('elemental') || s.includes('fire') || s.includes('frost') || s.includes('rime')) return 'fa-fire-flame-curved';
  if (s.includes('beast') || s.includes('wolf') || s.includes('bear') || s.includes('spider')) return 'fa-paw';
  if (s.includes('fiend') || s.includes('demon') || s.includes('devil')) return 'fa-skull-crossbones';
  if (s.includes('fey') || s.includes('spirit') || s.includes('fairy')) return 'fa-feather';
  if (s.includes('humanoid') || s.includes('goblin') || s.includes('orc') || s.includes('guard')) return 'fa-user-shield';
  if (s.includes('aberration') || s.includes('monstrosity')) return 'fa-ghost';
  return 'fa-dragon';
};

const CreatureAvatar = ({ creature, className = '' }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const typeIcon = getCreatureTypeIcon(creature?.creatureType || creature?.type, creature?.name);

  const rawSrc = creature?.illustration || creature?.image || creature?.imageUrl || creature?.token || (creature?.tokenIcon !== 'inv_misc_questionmark' ? creature?.tokenIcon : null) || (creature?.icon !== 'inv_misc_questionmark' ? creature?.icon : null);
  const resolvedSrc = rawSrc ? (rawSrc.startsWith('/') || rawSrc.startsWith('http') ? rawSrc : getIconUrl(rawSrc)) : null;

  if (!resolvedSrc || imgFailed) {
    return (
      <div className={`creature-fallback-badge ${className}`}>
        <i className={`fas ${typeIcon}`}></i>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={creature?.name || 'Creature'}
      className={`creature-avatar-img ${className}`}
      onError={(e) => {
        e.target.onerror = null;
        setImgFailed(true);
      }}
    />
  );
};

export const normalizeBookCreatureData = (c = {}) => {
  if (!c) return { name: 'Unnamed Creature', dangerLevel: 'Medium', creatureType: 'Humanoid', hp: 75 };

  const stats = c.stats || {
    strength: c.strength || 10,
    agility: c.agility || 10,
    constitution: c.constitution || 10,
    intelligence: c.intelligence || 10,
    spirit: c.spirit || 10,
    charisma: c.charisma || 10
  };

  const hp = typeof c.hp === 'object'
    ? (c.hp.max || c.hp.current || 75)
    : (c.stats?.maxHp || c.hp || 75);

  const mana = typeof c.mana === 'object'
    ? (c.mana.max || c.mana.current || 20)
    : (c.stats?.maxMana || c.mana || 20);

  const ap = typeof c.ap === 'number'
    ? c.ap
    : (c.stats?.maxActionPoints || c.maxActionPoints || 3);

  const traits = Array.isArray(c.traits)
    ? c.traits
    : Array.isArray(c.abilities)
      ? c.abilities.filter((a) => a.type === 'passive' || !a.actionPointCost).map((a) => ({ name: a.name || a.title, desc: a.description || a.desc || '' }))
      : [];

  const actions = Array.isArray(c.actions)
    ? c.actions
    : Array.isArray(c.abilities)
      ? c.abilities.filter((a) => a.type !== 'passive' && a.actionPointCost).map((a) => ({
          name: `${a.name || a.title}${a.actionPointCost ? ` (${a.actionPointCost} AP)` : ''}`,
          desc: a.description || a.desc || ''
        }))
      : [];

  const danger = normalizeDangerLevel(c.dangerLevel || c.danger || c.challenge, c.cr);
  const imageSource = c.illustration || c.image || c.imageUrl || c.token || c.tokenIcon || c.icon || '';

  return {
    id: c.id || `creature-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: c.name || c.title || 'Unnamed Creature',
    dangerLevel: danger,
    creatureType: c.creatureType || c.type || 'Medium Humanoid',
    hp: Number(hp) || 75,
    mana: Number(mana) || 20,
    ap: Number(ap) || 3,
    speed: c.speed || (c.stats?.speed ? `${c.stats.speed} ft.` : '30 ft.'),
    tokenIcon: imageSource || 'inv_misc_questionmark',
    image: imageSource,
    illustration: c.illustration || imageSource,
    tokenBorder: c.tokenBorder || '#d4af37',
    stats: {
      strength: Number(stats.strength) || 10,
      agility: Number(stats.agility) || 10,
      constitution: Number(stats.constitution) || 10,
      intelligence: Number(stats.intelligence) || 10,
      spirit: Number(stats.spirit) || 10,
      charisma: Number(stats.charisma) || 10
    },
    resistances: typeof c.resistances === 'string'
      ? c.resistances
      : (Array.isArray(c.resistances) ? c.resistances.join(', ') : ''),
    vulnerabilities: typeof c.vulnerabilities === 'string'
      ? c.vulnerabilities
      : (Array.isArray(c.vulnerabilities) ? c.vulnerabilities.join(', ') : ''),
    traits,
    actions,
    description: c.description || c.lore || '',
    tactics: c.tactics || null
  };
};

const BookCreaturePickerModal = ({
  isOpen,
  onClose,
  initialData = {},
  onSave
}) => {
  const customCreatures = useCreatureStore((s) => s.customCreatures || []);

  const allAvailableCreatures = useMemo(() => {
    const list = [];
    const seenNames = new Set();

    // 1. User custom creatures
    if (Array.isArray(customCreatures)) {
      customCreatures.forEach((c) => {
        if (c && c.name && !seenNames.has(c.name.toLowerCase())) {
          seenNames.add(c.name.toLowerCase());
          list.push({ ...c, isUserCreated: true });
        }
      });
    }

    // 2. Built-in presets
    CREATURE_PRESETS.forEach((c) => {
      if (c && c.name && !seenNames.has(c.name.toLowerCase())) {
        seenNames.add(c.name.toLowerCase());
        list.push({ ...c, isPreset: true });
      }
    });

    // 3. Static bestiary compendium
    if (staticCreaturesData?.regions) {
      staticCreaturesData.regions.forEach((r) => {
        (r.creatures || []).forEach((c) => {
          if (c && c.name && !seenNames.has(c.name.toLowerCase())) {
            seenNames.add(c.name.toLowerCase());
            list.push({
              ...c,
              creatureType: `${c.size || 'Medium'} ${c.type || 'Monstrosity'}`,
              dangerLevel: normalizeDangerLevel(c.challenge || c.dangerLevel, c.cr)
            });
          }
        });
      });
    }

    return list;
  }, [customCreatures]);

  const [searchQuery, setSearchQuery] = useState('');
  const [dangerFilter, setDangerFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedCreature, setSelectedCreature] = useState(() => {
    if (initialData && initialData.name) {
      return normalizeBookCreatureData(initialData);
    }
    return allAvailableCreatures[0] ? normalizeBookCreatureData(allAvailableCreatures[0]) : null;
  });

  const [showCreatureWizard, setShowCreatureWizard] = useState(() => {
    return Boolean(initialData && initialData.openWizardDirectly);
  });
  const [wizardCreatureId, setWizardCreatureId] = useState(() => initialData?.id || null);
  const [wizardInitialCreature, setWizardInitialCreature] = useState(() => {
    if (initialData && (initialData.name || initialData.id)) {
      return normalizeBookCreatureData(initialData);
    }
    return null;
  });

  // Sync initial selection
  useEffect(() => {
    if (initialData && (initialData.name || initialData.id)) {
      const normalized = normalizeBookCreatureData(initialData);
      setSelectedCreature(normalized);
      if (initialData.openWizardDirectly) {
        setWizardCreatureId(normalized.id || null);
        setWizardInitialCreature(normalized);
        setShowCreatureWizard(true);
      }
    }
  }, [initialData]);

  // Filter creatures
  const filteredCreatures = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allAvailableCreatures.filter((c) => {
      const nameMatch = !q || (c.name || '').toLowerCase().includes(q) ||
        (c.creatureType || c.type || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q);

      const danger = normalizeDangerLevel(c.dangerLevel || c.challenge, c.cr).toLowerCase();
      const dangerMatch = dangerFilter === 'all' || danger === dangerFilter;

      const typeStr = (c.creatureType || c.type || '').toLowerCase();
      const typeMatch = typeFilter === 'all' || typeStr.includes(typeFilter);

      return nameMatch && dangerMatch && typeMatch;
    });
  }, [allAvailableCreatures, searchQuery, dangerFilter, typeFilter]);

  if (!isOpen) return null;

  const handleLaunchCreateWizard = () => {
    setWizardCreatureId(null);
    setWizardInitialCreature(null);
    setShowCreatureWizard(true);
  };

  const handleLaunchEditWizard = () => {
    setWizardCreatureId(selectedCreature?.id || null);
    setWizardInitialCreature(selectedCreature || null);
    setShowCreatureWizard(true);
  };

  const handleWizardSaved = (creatureData) => {
    setShowCreatureWizard(false);
    if (creatureData) {
      const normalized = normalizeBookCreatureData(creatureData);
      onSave(normalized);
      onClose();
    }
  };

  const handleConfirmSelect = (creature = selectedCreature) => {
    if (!creature) return;
    const normalized = normalizeBookCreatureData(creature);
    onSave(normalized);
    onClose();
  };

  return (
    <div className="book-modal-overlay" onClick={onClose}>
      <div className="book-creature-picker-modal" onClick={(e) => e.stopPropagation()}>
        {showCreatureWizard ? (
          <div className="wizard-modal-view">
            <div className="wizard-modal-top-bar">
              <div className="modal-title-wrap">
                <i className="fas fa-dragon"></i>
                <h3>Creature &amp; NPC Wizard</h3>
              </div>
              <button
                type="button"
                className="close-wizard-btn"
                onClick={() => setShowCreatureWizard(false)}
                title="Return to Creature Picker"
              >
                <i className="fas fa-arrow-left"></i> Back to Browser
              </button>
            </div>
            <div className="wizard-modal-body">
              <CreatureLibraryProvider>
                <CreatureWizardProvider>
                  <Suspense fallback={<div className="wizard-loading-spinner"><i className="fas fa-spinner fa-spin"></i> Loading Creature Wizard...</div>}>
                    <CreatureWizardApp
                      editMode={Boolean(wizardInitialCreature || wizardCreatureId)}
                      creatureId={wizardCreatureId}
                      initialCreature={wizardInitialCreature}
                      onSave={handleWizardSaved}
                      onCancel={() => setShowCreatureWizard(false)}
                    />
                  </Suspense>
                </CreatureWizardProvider>
              </CreatureLibraryProvider>
            </div>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-title-wrap">
                <i className="fas fa-dragon"></i>
                <h3>Select or Author Bestiary Creature / NPC</h3>
              </div>
              <div className="modal-header-actions">
                <button
                  type="button"
                  className="launch-wizard-hero-btn"
                  onClick={handleLaunchCreateWizard}
                  title="Open the official full 5-step Creature Wizard"
                >
                  <i className="fas fa-wand-magic-sparkles"></i> Open in Creature Wizard
                </button>
                <button type="button" className="close-modal-btn" onClick={onClose}>&times;</button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="creature-picker-filters-row">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search monsters, NPCs, abilities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                value={dangerFilter}
                onChange={(e) => setDangerFilter(e.target.value)}
                className="filter-select"
                title="Filter by Danger Level"
              >
                {DANGER_FILTERS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="filter-select"
                title="Filter by Creature Category"
              >
                {TYPE_FILTERS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Main Browser View: List + Live Preview Pane */}
            <div className="creature-picker-main-grid">
              {/* Left Column: Filtered List */}
              <div className="creatures-cards-list">
                {filteredCreatures.map((c) => {
                  const norm = normalizeBookCreatureData(c);
                  const isSelected = selectedCreature?.name === norm.name;
                  return (
                    <div
                      key={norm.id || norm.name}
                      className={`creature-list-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedCreature(norm)}
                      onDoubleClick={() => handleConfirmSelect(norm)}
                    >
                      <div className="c-card-icon-slot">
                        <CreatureAvatar creature={norm} />
                      </div>
                      <div className="c-card-info">
                        <div className="c-card-title-row">
                          <span className="c-name">{norm.name}</span>
                          <span className={`c-danger-badge danger-${norm.dangerLevel.toLowerCase().replace(/\s+/g, '-')}`}>
                            {norm.dangerLevel}
                          </span>
                        </div>
                        <div className="c-card-sub">{norm.creatureType}</div>
                        <div className="c-card-vitals">
                          <span><strong>HP</strong> {norm.hp}</span>
                          <span><strong>Mana</strong> {norm.mana}</span>
                          <span><strong>AP</strong> {norm.ap}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredCreatures.length === 0 && (
                  <div className="creature-empty-state">
                    <i className="fas fa-dragon"></i>
                    <p>No matching creatures found.</p>
                    <button type="button" className="create-new-btn" onClick={handleLaunchCreateWizard}>
                      <i className="fas fa-plus"></i> Create in Creature Wizard
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Live Inspect Preview */}
              <div className="creature-preview-pane">
                {selectedCreature ? (
                  <div className="creature-inspect-card">
                    <div className="inspect-head">
                      <div className="inspect-token">
                        <CreatureAvatar creature={selectedCreature} />
                      </div>
                      <div className="inspect-meta">
                        <h3>{selectedCreature.name}</h3>
                        <div className="inspect-type-tag">
                          <em>{selectedCreature.creatureType}</em> • <span className="danger-text">{selectedCreature.dangerLevel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="inspect-vitals-row">
                      <div className="vital-badge"><i className="fas fa-heart"></i> {selectedCreature.hp} HP</div>
                      <div className="vital-badge"><i className="fas fa-bolt"></i> {selectedCreature.mana} Mana</div>
                      <div className="vital-badge"><i className="fas fa-shield"></i> {selectedCreature.ap} AP</div>
                      <div className="vital-badge"><i className="fas fa-person-running"></i> {selectedCreature.speed || '30 ft.'}</div>
                    </div>

                    <div className="inspect-stats-grid">
                      {['STR', 'AGI', 'CON', 'INT', 'SPI', 'CHA'].map((k) => {
                        const val = selectedCreature.stats?.[k.toLowerCase()] || 10;
                        const mod = Math.floor((val - 10) / 2);
                        return (
                          <div key={k} className="stat-pill">
                            <span className="stat-label">{k}</span>
                            <span className="stat-value">{val}</span>
                            <span className="stat-mod">{mod >= 0 ? `+${mod}` : mod}</span>
                          </div>
                        );
                      })}
                    </div>

                    {selectedCreature.traits && selectedCreature.traits.length > 0 && (
                      <div className="inspect-section">
                        <h4>Passives &amp; Traits</h4>
                        {selectedCreature.traits.map((t, idx) => (
                          <div key={idx} className="inspect-item">
                            <strong>{t.name}:</strong> <span>{t.desc}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedCreature.actions && selectedCreature.actions.length > 0 && (
                      <div className="inspect-section">
                        <h4>Actions &amp; Strikes</h4>
                        {selectedCreature.actions.map((a, idx) => (
                          <div key={idx} className="inspect-item">
                            <strong>{a.name}:</strong> <span>{a.desc}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="inspect-modal-actions">
                      <button
                        type="button"
                        className="btn-edit-wizard"
                        onClick={handleLaunchEditWizard}
                        title="Edit in full 5-step Creature Wizard"
                      >
                        <i className="fas fa-pen-to-square"></i> Edit in Creature Wizard
                      </button>
                      <button
                        type="button"
                        className="btn-insert-creature"
                        onClick={() => handleConfirmSelect(selectedCreature)}
                      >
                        <i className="fas fa-check"></i> Insert into Book
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="inspect-placeholder">
                    <i className="fas fa-dragon"></i>
                    <p>Select a creature from the catalog to preview its statblock and abilities.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookCreaturePickerModal;
