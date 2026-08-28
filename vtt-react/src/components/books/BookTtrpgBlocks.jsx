import React, { useState } from 'react';
import RichLoreText from '../common/RichLoreText';
import UnifiedSpellCard from '../spellcrafting-wizard/components/common/UnifiedSpellCard';
import { SpellLibraryProvider } from '../spellcrafting-wizard/context/SpellLibraryContext';
import ItemTooltip from '../item-generation/ItemTooltip';

/**
 * Standard danger level normalization helper
 * Ensures "CR" is never rendered and maps legacy values to Danger Levels.
 */
export const normalizeDangerLevel = (dangerLevel, cr) => {
  if (dangerLevel && typeof dangerLevel === 'string' && dangerLevel.trim()) {
    const clean = dangerLevel.replace(/^CR\s*/i, '').trim();
    if (clean.toLowerCase() === 'low' || clean === '1/4' || clean === '1/2' || clean === '1') return 'Low';
    if (clean.toLowerCase() === 'medium' || clean === '2') return 'Medium';
    if (clean.toLowerCase() === 'high' || clean === '3' || clean === '4' || clean === '5' || clean === '6') return 'High';
    if (clean.toLowerCase() === 'very high' || clean === '7' || clean === '8' || clean === '9' || clean === '10') return 'Very High';
    if (clean.toLowerCase() === 'extreme' || clean === '11' || clean === '12' || clean === '13' || clean === '14') return 'Extreme';
    if (clean.toLowerCase() === 'apex' || clean >= '15') return 'Apex';
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }
  if (cr !== undefined && cr !== null && String(cr).trim()) {
    const clean = String(cr).replace(/^CR\s*/i, '').trim();
    const num = parseFloat(clean);
    if (num <= 1) return 'Low';
    if (num <= 2) return 'Medium';
    if (num <= 6) return 'High';
    if (num <= 10) return 'Very High';
    if (num <= 14) return 'Extreme';
    return 'Apex';
  }
  return 'Medium';
};

const getModifier = (val) => {
  const mod = Math.floor((Number(val || 10) - 10) / 2);
  return mod >= 0 ? '+' + mod : '' + mod;
};

// Descension Preset Bestiary
export const CREATURE_PRESETS = [
  {
    name: 'Frost Wyrd Stalker',
    creatureType: 'Medium Elemental / Undead, Neutral Evil',
    dangerLevel: 'High',
    hp: 92,
    mana: 40,
    ap: 3,
    speed: '35 ft., climb 25 ft.',
    stats: { strength: 16, agility: 18, constitution: 14, intelligence: 12, spirit: 16, charisma: 8 },
    resistances: 'Immune: Rime (Frost), Poison; Vulnerable: Ember (Fire)',
    traits: [
      { name: 'Glacial Cloak', desc: 'Ranged attacks against the stalker suffer disadvantage when in sub-zero terrain or blizzard conditions.' },
      { name: 'Rime Aura', desc: 'Creatures starting their turn within 10 ft. take 1d6 Rime damage and lose 5 ft. of movement.' }
    ],
    actions: [
      { name: 'Frostbite Rend', desc: 'Melee Strike: +7 to hit, reach 5 ft. Deals 2d8+4 Physical damage plus 2d6 Rime damage.' },
      { name: 'Wyrd Freeze (1 AP, 10 Mana)', desc: 'The stalker exhales arcane frost in a 20-ft cone. Targets make a DC 15 Spirit save or become Frozen for 1 round.' }
    ]
  },
  {
    name: 'Ember-Spire Wyrmling',
    creatureType: 'Large Dragon / Primordial, Chaotic Neutral',
    dangerLevel: 'Very High',
    hp: 135,
    mana: 60,
    ap: 4,
    speed: '30 ft., fly 60 ft.',
    stats: { strength: 20, agility: 14, constitution: 18, intelligence: 14, spirit: 14, charisma: 16 },
    resistances: 'Immune: Ember (Fire); Vulnerable: Rime (Frost)',
    traits: [
      { name: 'Magma Scales', desc: 'Melee attackers taking physical hits suffer 1d6 Ember backlash.' }
    ],
    actions: [
      { name: 'Molten Cleave', desc: 'Melee Strike: +8 to hit, reach 10 ft. Deals 3d6+5 Physical + 2d8 Ember damage.' },
      { name: 'Infernal Breath (2 AP, 20 Mana)', desc: '30-ft cone of flame. 6d8 Ember damage (DC 16 Agility save for half).' }
    ]
  },
  {
    name: 'Gravebound Dread Revenant',
    creatureType: 'Medium Undead / Wyrd Spirit, Lawful Evil',
    dangerLevel: 'Extreme',
    hp: 180,
    mana: 80,
    ap: 4,
    speed: '30 ft.',
    stats: { strength: 18, agility: 12, constitution: 20, intelligence: 16, spirit: 18, charisma: 14 },
    resistances: 'Immune: Necrotic, Poison; Resistant: Physical, Void',
    traits: [
      { name: 'Undying Resolve', desc: 'When reduced to 0 HP, rolls DC 15 Constitution check to drop to 1 HP instead.' }
    ],
    actions: [
      { name: 'Graveblade Strike', desc: 'Melee Strike: +9 to hit. Deals 2d10+4 Physical + 3d8 Void damage.' },
      { name: 'Soul Siphon (2 AP, 15 Mana)', desc: 'Ranged spell: 60 ft. Target takes 4d8 Wyrd damage and Revenant regains half as HP.' }
    ]
  }
];

// Descension Preset Spells
export const SPELL_PRESETS = [
  {
    name: 'Glacial Shard Lance',
    category: 'damage',
    damageTypes: ['rime'],
    tier: 'T2',
    spellType: 'ACTION',
    ap: 2,
    manaCost: 15,
    range: '60 ft.',
    duration: 'Instantaneous',
    targetingMode: 'single',
    effect: 'A crystalline lance of compressed frost impales the target for 3d8 piercing damage and slows their movement by 10 ft for 1 round.',
    empower: 'Each additional 5 Mana increases damage by 1d8.',
    primaryDamage: { dice: '3d8', flat: 4 },
    tags: ['offensive', 'damage', 'rime', 'utility']
  },
  {
    name: 'Flame Surge Torrent',
    category: 'damage',
    damageTypes: ['ember'],
    tier: 'T2',
    spellType: 'ACTION',
    ap: 2,
    manaCost: 20,
    range: '45 ft.',
    duration: 'Instantaneous',
    targetingMode: 'cone',
    effect: 'A roaring cone of liquid fire deals 4d6 Ember damage to all creatures in a 20-ft cone (Agility save for half).',
    empower: 'Each additional 5 Mana increases damage by 1d6 and extends cone by 5 ft.',
    primaryDamage: { dice: '4d6', flat: 0 },
    tags: ['offensive', 'damage', 'ember', 'aoe']
  },
  {
    name: 'Aegis of the Sunwell',
    category: 'buff',
    damageTypes: ['radiant'],
    tier: 'T1',
    spellType: 'ACTION',
    ap: 1,
    manaCost: 12,
    range: '30 ft.',
    duration: '1 Minute',
    targetingMode: 'single',
    effect: 'Bathes an ally in blessed golden light, granting +3 Armor Value and immunity to fear effects for the duration.',
    empower: 'Each additional 5 Mana targets 1 additional ally within 15 ft.',
    primaryDamage: { dice: '0', flat: 0 },
    tags: ['buff', 'radiant', 'protective']
  },
  {
    name: 'Void Siphon Miasma',
    category: 'control',
    damageTypes: ['void'],
    tier: 'T3',
    spellType: 'ACTION',
    ap: 2,
    manaCost: 25,
    range: '60 ft.',
    duration: 'Concentration (up to 1 min)',
    targetingMode: 'sphere',
    effect: 'Conjures a 15-ft radius sphere of shadow. Enemies inside suffer 2d8 Void damage per turn and have disadvantage on spellcasting checks.',
    empower: 'Each additional 10 Mana expands radius by 5 ft.',
    primaryDamage: { dice: '2d8', flat: 0 },
    tags: ['control', 'void', 'hazard']
  }
];

/**
 * Creature Statblock Block
 * - Write Mode: Full-featured, unconstrained authoring studio to edit all vitals, stats, traits & actions
 * - Read Mode: Authentic, publication-grade Creature Statblock with parchment cards & golden rules
 */
export const CreatureStatblockBlock = ({
  block,
  isWrite = false,
  onUpdate = () => {}
}) => {
  const [showPresets, setShowPresets] = useState(false);
  const stats = block.stats || { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 };
  const hp = typeof block.hp === 'object' ? (block.hp.max || block.hp.current || 75) : (block.hp || 75);
  const traits = Array.isArray(block.traits) ? block.traits : [];
  const actions = Array.isArray(block.actions) ? block.actions : [];
  const danger = normalizeDangerLevel(block.dangerLevel, block.cr);

  const applyPreset = (preset) => {
    onUpdate({
      name: preset.name,
      dangerLevel: preset.dangerLevel,
      cr: undefined,
      creatureType: preset.creatureType,
      hp: preset.hp,
      mana: preset.mana,
      ap: preset.ap,
      speed: preset.speed,
      stats: preset.stats,
      resistances: preset.resistances,
      traits: preset.traits,
      actions: preset.actions
    });
    setShowPresets(false);
  };

  const handleStatChange = (key, val) => {
    const num = parseInt(val, 10) || 10;
    onUpdate({
      stats: { ...stats, [key]: num }
    });
  };

  const handleTraitChange = (index, field, value) => {
    const updated = [...traits];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ traits: updated });
  };

  const handleAddTrait = () => {
    onUpdate({ traits: [...traits, { name: 'New Trait', desc: 'Trait description...' }] });
  };

  const handleDeleteTrait = (index) => {
    onUpdate({ traits: traits.filter((_, i) => i !== index) });
  };

  const handleActionChange = (index, field, value) => {
    const updated = [...actions];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ actions: updated });
  };

  const handleAddAction = () => {
    onUpdate({ actions: [...actions, { name: 'New Action', desc: 'Action details and damage...' }] });
  };

  const handleDeleteAction = (index) => {
    onUpdate({ actions: actions.filter((_, i) => i !== index) });
  };

  // WRITE MODE: Full Authoring Studio
  if (isWrite) {
    return (
      <div className="book-creature-authoring-box">
        <div className="authoring-header-bar">
          <div className="authoring-title-wrap">
            <i className="fas fa-dragon"></i>
            <input
              type="text"
              className="statblock-input-title"
              value={block.name || ''}
              placeholder="Creature / NPC Name..."
              onChange={(e) => onUpdate({ name: e.target.value })}
            />
          </div>
          <div className="authoring-header-actions">
            <select
              value={danger}
              onChange={(e) => onUpdate({ dangerLevel: e.target.value, cr: undefined })}
              className="quick-select"
              title="Danger Level"
            >
              <option value="Low">Low Danger</option>
              <option value="Medium">Medium Danger</option>
              <option value="High">High Danger</option>
              <option value="Very High">Very High Danger</option>
              <option value="Extreme">Extreme Danger</option>
              <option value="Apex">Apex Danger</option>
            </select>
            <button
              type="button"
              className="statblock-preset-btn"
              onClick={() => setShowPresets(!showPresets)}
              title="Load Game Creature Preset"
            >
              <i className="fas fa-book-sparkles"></i> Presets
            </button>
          </div>
        </div>

        {showPresets && (
          <div className="statblock-presets-dropdown">
            <div className="preset-drop-title">Select Descension Creature:</div>
            {CREATURE_PRESETS.map((p) => (
              <div key={p.name} className="preset-drop-item" onClick={() => applyPreset(p)}>
                <strong>{p.name}</strong> ({p.dangerLevel}) • <em>{p.creatureType}</em>
              </div>
            ))}
          </div>
        )}

        <div className="authoring-sub-field">
          <input
            type="text"
            className="statblock-input-sub"
            value={block.creatureType || ''}
            placeholder="Size, Heritage, Origin (e.g. Medium Elemental / Undead, Neutral Evil)..."
            onChange={(e) => onUpdate({ creatureType: e.target.value })}
          />
        </div>

        {/* Vitals Form Grid */}
        <div className="authoring-form-grid">
          <div className="author-field">
            <label><i className="fas fa-heart"></i> Hit Points:</label>
            <input
              type="number"
              value={hp}
              onChange={(e) => onUpdate({ hp: parseInt(e.target.value, 10) || 10 })}
            />
          </div>
          <div className="author-field">
            <label><i className="fas fa-droplet"></i> Mana:</label>
            <input
              type="number"
              value={block.mana ?? 20}
              onChange={(e) => onUpdate({ mana: parseInt(e.target.value, 10) || 0 })}
            />
          </div>
          <div className="author-field">
            <label><i className="fas fa-bolt"></i> Action Points:</label>
            <input
              type="number"
              value={block.ap ?? 3}
              onChange={(e) => onUpdate({ ap: parseInt(e.target.value, 10) || 3 })}
            />
          </div>
          <div className="author-field">
            <label><i className="fas fa-person-running"></i> Speed:</label>
            <input
              type="text"
              value={block.speed || '30 ft.'}
              placeholder="e.g. 30 ft., fly 60 ft."
              onChange={(e) => onUpdate({ speed: e.target.value })}
            />
          </div>
        </div>

        <div className="author-field full-width">
          <label><i className="fas fa-shield"></i> Resistances &amp; Affinities:</label>
          <input
            type="text"
            value={block.resistances || ''}
            placeholder="e.g. Immune: Rime (Frost); Vulnerable: Ember (Fire)"
            onChange={(e) => onUpdate({ resistances: e.target.value })}
          />
        </div>

        {/* Core Attributes Inputs */}
        <div className="author-stats-editor">
          <div className="author-stats-label">Core Ability Scores:</div>
          <div className="author-stats-grid">
            {[
              { key: 'strength', abbr: 'STR' },
              { key: 'agility', abbr: 'AGI' },
              { key: 'constitution', abbr: 'CON' },
              { key: 'intelligence', abbr: 'INT' },
              { key: 'spirit', abbr: 'SPI' },
              { key: 'charisma', abbr: 'CHA' }
            ].map((s) => (
              <div key={s.key} className="author-stat-box">
                <span className="stat-tag">{s.abbr}</span>
                <input
                  type="number"
                  value={stats[s.key] ?? 10}
                  onChange={(e) => handleStatChange(s.key, e.target.value)}
                />
                <span className="stat-mod-tag">{getModifier(stats[s.key] ?? 10)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traits Editor */}
        <div className="author-sublist-section">
          <div className="sublist-head">
            <span>Special Traits &amp; Passives ({traits.length})</span>
            <button type="button" className="btn-add-item" onClick={handleAddTrait}>
              <i className="fas fa-plus"></i> Add Trait
            </button>
          </div>
          {traits.map((t, idx) => (
            <div key={idx} className="sublist-item-row">
              <input
                type="text"
                className="sublist-name-input"
                value={t.name || ''}
                placeholder="Trait Name..."
                onChange={(e) => handleTraitChange(idx, 'name', e.target.value)}
              />
              <input
                type="text"
                className="sublist-desc-input"
                value={t.desc || ''}
                placeholder="Trait effect description..."
                onChange={(e) => handleTraitChange(idx, 'desc', e.target.value)}
              />
              <button
                type="button"
                className="btn-del-item"
                onClick={() => handleDeleteTrait(idx)}
                title="Remove Trait"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        {/* Actions Editor */}
        <div className="author-sublist-section">
          <div className="sublist-head">
            <span>Abilities &amp; Actions ({actions.length})</span>
            <button type="button" className="btn-add-item" onClick={handleAddAction}>
              <i className="fas fa-plus"></i> Add Action
            </button>
          </div>
          {actions.map((a, idx) => (
            <div key={idx} className="sublist-item-row">
              <input
                type="text"
                className="sublist-name-input"
                value={a.name || ''}
                placeholder="Action Name..."
                onChange={(e) => handleActionChange(idx, 'name', e.target.value)}
              />
              <input
                type="text"
                className="sublist-desc-input"
                value={a.desc || ''}
                placeholder="Damage, attack bonus, and effects..."
                onChange={(e) => handleActionChange(idx, 'desc', e.target.value)}
              />
              <button
                type="button"
                className="btn-del-item"
                onClick={() => handleDeleteAction(idx)}
                title="Remove Action"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // READ MODE: Publication Creature Statblock
  return (
    <div className="book-statblock-wrapper">
      <div className="statblock-header">
        <div className="statblock-title-row">
          <h3 className="statblock-name">{block.name || 'Unnamed Adversary'}</h3>
          <div className="statblock-header-right">
            <span className={'statblock-danger-badge danger-' + String(danger).toLowerCase().replace(/\s+/g, '-')}>
              <i className="fas fa-skull"></i> <span>{danger}</span>
            </span>
          </div>
        </div>
        <div className="statblock-sub-row">
          <span className="statblock-type-line">{block.creatureType || 'Medium Creature, Native'}</span>
        </div>
      </div>

      <div className="statblock-taper-rule" />

      {/* Descension Vitals Bar */}
      <div className="statblock-vitals-strip">
        <div className="statblock-vital-pill vital-hp">
          <i className="fas fa-heart"></i>
          <span className="vital-lbl">Hit Points:</span>
          <strong>{hp}</strong>
        </div>
        <div className="statblock-vital-pill vital-mana">
          <i className="fas fa-droplet"></i>
          <span className="vital-lbl">Mana:</span>
          <strong>{block.mana ?? 20}</strong>
        </div>
        <div className="statblock-vital-pill vital-ap">
          <i className="fas fa-bolt"></i>
          <span className="vital-lbl">Action Points:</span>
          <strong>{block.ap ?? 3} AP</strong>
        </div>
        <div className="statblock-vital-pill vital-speed">
          <i className="fas fa-person-running"></i>
          <span className="vital-lbl">Speed:</span>
          <strong>{block.speed || '30 ft.'}</strong>
        </div>
      </div>

      {block.resistances && (
        <div className="statblock-resistances-strip">
          <i className="fas fa-shield"></i>
          <span className="resist-lbl">Resistances &amp; Affinities:</span>
          <span className="resist-val">{block.resistances}</span>
        </div>
      )}

      <div className="statblock-taper-rule" />

      {/* Core 6 Ability Scores Grid */}
      <div className="statblock-stats-grid">
        {[
          { key: 'strength', abbr: 'STR' },
          { key: 'agility', abbr: 'AGI' },
          { key: 'constitution', abbr: 'CON' },
          { key: 'intelligence', abbr: 'INT' },
          { key: 'spirit', abbr: 'SPI' },
          { key: 'charisma', abbr: 'CHA' }
        ].map((s) => {
          const val = stats[s.key] ?? 10;
          return (
            <div key={s.key} className="stat-tile">
              <span className="stat-abbr">{s.abbr}</span>
              <span className="stat-num">{val}</span>
              <span className="stat-mod">({getModifier(val)})</span>
            </div>
          );
        })}
      </div>

      <div className="statblock-taper-rule" />

      {/* Traits Section */}
      {traits.length > 0 && (
        <div className="statblock-section">
          {traits.map((trait, idx) => (
            <div key={idx} className="statblock-trait-item">
              <strong className="trait-name">{trait.name}.</strong>{' '}
              <span className="trait-desc">
                <RichLoreText text={trait.desc} className="parchment-theme" />
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Actions Section */}
      {actions.length > 0 && (
        <div className="statblock-section actions-section">
          <h4 className="statblock-section-heading">Abilities &amp; Actions</h4>
          {actions.map((act, idx) => (
            <div key={idx} className="statblock-action-item">
              <strong className="action-name">{act.name}.</strong>{' '}
              <span className="action-desc">
                <RichLoreText text={act.desc} className="parchment-theme" />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Authentic In-Game Spell Card Block
 * - Write Mode: Full-featured, unconstrained authoring studio to edit all spell parameters & effects
 * - Read Mode: Authentic in-game UnifiedSpellCard with Descension badge styling & Empower bar
 */
export const SpellFormulaBlock = ({
  block,
  isWrite = false,
  onUpdate = () => {}
}) => {
  const [showPresets, setShowPresets] = useState(false);

  const applyPreset = (preset) => {
    onUpdate({
      name: preset.name,
      category: preset.category,
      damageTypes: preset.damageTypes,
      tier: preset.tier,
      spellType: preset.spellType || 'ACTION',
      ap: preset.ap ?? 2,
      manaCost: preset.manaCost ?? 15,
      range: preset.range || '60 ft.',
      duration: preset.duration || 'Instantaneous',
      targetingMode: preset.targetingMode || 'single',
      effect: preset.effect,
      description: preset.effect,
      empower: preset.empower,
      primaryDamage: preset.primaryDamage,
      tags: preset.tags
    });
    setShowPresets(false);
  };

  const primaryDamageType = (Array.isArray(block.damageTypes) && block.damageTypes[0]) || 'rime';
  const mana = Number(block.manaCost ?? block.resourceCosts?.mana?.baseAmount ?? 15);
  const ap = Number(block.ap ?? block.resourceCosts?.action_points?.baseAmount ?? 2);
  const rangeVal = block.range ? (typeof block.range === 'number' ? block.range : parseInt(block.range, 10) || 60) : 60;
  const rangeDisplay = typeof block.range === 'string' && block.range.trim() ? block.range : `${rangeVal} ft`;

  // Format spell data for UnifiedSpellCard and useResourceFormatters
  const normalizedSpell = {
    id: block.spellId || block.id || 'spell-doc',
    name: block.name || 'Glacial Shard Lance',
    description: block.effect || block.description || 'A crystalline lance of compressed frost impales the target for 3d8 piercing damage and slows their movement by 10 ft.',
    category: block.category || 'damage',
    spellType: block.spellType || 'ACTION',
    damageTypes: block.damageTypes || [primaryDamageType],
    primaryDamage: typeof block.primaryDamage === 'object' ? block.primaryDamage : { dice: block.primaryDamage || '3d8', flat: 0 },
    // Complete resourceCost structure consumed by useResourceFormatters & UnifiedSpellCard
    resourceCost: {
      resourceTypes: ['mana', 'actionPoints'],
      resourceValues: { mana: mana, actionPoints: ap },
      mana: mana,
      actionPoints: ap
    },
    resourceConfig: {
      resourceType: 'mana',
      resourceAmount: mana
    },
    resourceCosts: {
      mana: { baseAmount: mana },
      action_points: { baseAmount: ap }
    },
    manaCost: mana,
    actionPointCost: ap,
    range: rangeVal,
    rangeDisplay: rangeDisplay,
    rangeType: 'ranged',
    targetingMode: block.targetingMode || 'single',
    castTimeType: 'instant',
    castTimeValue: 0,
    cooldownValue: block.cooldownValue || 0,
    cooldownUnit: 'rounds',
    flavorText: block.flavorText || '',
    empowerText: block.empower || '',
    tags: block.tags || ['offensive', 'damage', primaryDamageType]
  };

  // WRITE MODE: Full Authoring Studio
  if (isWrite) {
    return (
      <div className="book-spell-authoring-box">
        <div className="authoring-header-bar">
          <div className="authoring-title-wrap">
            <i className="fas fa-wand-magic-sparkles"></i>
            <input
              type="text"
              className="spell-input-title"
              value={block.name || ''}
              placeholder="Spell Name..."
              onChange={(e) => onUpdate({ name: e.target.value })}
            />
          </div>
          <div className="authoring-header-actions">
            <select
              value={block.category || 'damage'}
              onChange={(e) => onUpdate({ category: e.target.value })}
              className="quick-select"
            >
              <option value="damage">Damage</option>
              <option value="healing">Healing</option>
              <option value="utility">Utility</option>
              <option value="control">Control</option>
              <option value="buff">Buff</option>
            </select>
            <button
              type="button"
              className="spell-preset-btn"
              onClick={() => setShowPresets(!showPresets)}
              title="Load In-Game Spell Preset"
            >
              <i className="fas fa-book-sparkles"></i> Presets
            </button>
          </div>
        </div>

        {showPresets && (
          <div className="spell-presets-dropdown">
            <div className="preset-drop-title">Select In-Game Spell:</div>
            {SPELL_PRESETS.map((p) => (
              <div key={p.name} className="preset-drop-item" onClick={() => applyPreset(p)}>
                <strong>{p.name}</strong> • <em>{p.category.toUpperCase()} ({(p.damageTypes || []).join(', ').toUpperCase()})</em>
              </div>
            ))}
          </div>
        )}

        {/* Spell Form Grid */}
        <div className="authoring-form-grid">
          <div className="author-field">
            <label><i className="fas fa-fire-flame-curved"></i> Damage Type:</label>
            <select
              value={primaryDamageType}
              onChange={(e) => onUpdate({ damageTypes: [e.target.value] })}
              className="quick-select"
            >
              <option value="rime">Rime (Frost)</option>
              <option value="ember">Ember (Fire)</option>
              <option value="blight">Blight (Toxic)</option>
              <option value="wyrd">Wyrd (Arcane)</option>
              <option value="storm">Storm (Lightning)</option>
              <option value="radiant">Radiant (Holy)</option>
              <option value="void">Void (Shadow)</option>
              <option value="physical">Physical</option>
            </select>
          </div>

          <div className="author-field">
            <label><i className="fas fa-clock"></i> Action Type:</label>
            <select
              value={block.spellType || 'ACTION'}
              onChange={(e) => onUpdate({ spellType: e.target.value })}
              className="quick-select"
            >
              <option value="ACTION">Action</option>
              <option value="BONUS">Bonus Action</option>
              <option value="REACTION">Reaction</option>
              <option value="CHANNEL">Channel</option>
              <option value="FREE">Free</option>
            </select>
          </div>

          <div className="author-field">
            <label><i className="fas fa-droplet"></i> Mana Cost:</label>
            <input
              type="number"
              value={block.manaCost ?? 15}
              onChange={(e) => onUpdate({
                manaCost: parseInt(e.target.value, 10) || 0,
                resourceCosts: { ...(block.resourceCosts || {}), mana: { baseAmount: parseInt(e.target.value, 10) || 0 } }
              })}
            />
          </div>

          <div className="author-field">
            <label><i className="fas fa-bolt"></i> AP Cost:</label>
            <input
              type="number"
              value={block.ap ?? 2}
              onChange={(e) => onUpdate({
                ap: parseInt(e.target.value, 10) || 1,
                resourceCosts: { ...(block.resourceCosts || {}), action_points: { baseAmount: parseInt(e.target.value, 10) || 1 } }
              })}
            />
          </div>
        </div>

        <div className="authoring-form-grid">
          <div className="author-field">
            <label><i className="fas fa-location-crosshairs"></i> Range:</label>
            <input
              type="text"
              value={block.range ? (typeof block.range === 'number' ? (block.range + ' ft') : block.range) : '60 ft'}
              placeholder="e.g. Touch, 60 ft, 120 ft"
              onChange={(e) => onUpdate({ range: e.target.value })}
            />
          </div>

          <div className="author-field">
            <label><i className="fas fa-bullseye"></i> Targeting Mode:</label>
            <select
              value={block.targetingMode || 'single'}
              onChange={(e) => onUpdate({ targetingMode: e.target.value })}
              className="quick-select"
            >
              <option value="single">Single Target</option>
              <option value="sphere">AoE Sphere</option>
              <option value="cone">Cone</option>
              <option value="line">Line</option>
              <option value="multi">Multi-Target</option>
            </select>
          </div>

          <div className="author-field">
            <label><i className="fas fa-dice-d20"></i> Damage / Formula:</label>
            <input
              type="text"
              value={block.primaryDamage?.dice || (typeof block.primaryDamage === 'string' ? block.primaryDamage : '3d8')}
              placeholder="e.g. 3d8 + 4"
              onChange={(e) => onUpdate({
                primaryDamage: { ...(block.primaryDamage || {}), dice: e.target.value }
              })}
            />
          </div>
        </div>

        {/* Empower Scaling */}
        <div className="author-field full-width">
          <label><i className="fas fa-bolt-lightning"></i> Empower Scaling:</label>
          <input
            type="text"
            value={block.empower || ''}
            placeholder="e.g. Each additional 5 Mana increases damage by 1d8 and expands radius by 5 ft."
            onChange={(e) => onUpdate({ empower: e.target.value })}
          />
        </div>

        {/* Prose Description Textarea */}
        <div className="author-field full-width">
          <label><i className="fas fa-scroll"></i> Spell Description &amp; Effects:</label>
          <textarea
            rows={3}
            className="spell-textarea"
            value={block.effect || block.description || ''}
            placeholder="Detailed description of spell incantation, mechanics and visual effects..."
            onChange={(e) => onUpdate({ effect: e.target.value, description: e.target.value })}
          />
        </div>
      </div>
    );
  }

  // READ MODE: Authentic In-Game UnifiedSpellCard + Dedicated Empower Callout
  return (
    <div className="book-spellcard-container">
      <div className="book-unified-spell-card-wrap">
        <SpellLibraryProvider>
          <UnifiedSpellCard
            spell={normalizedSpell}
            variant="wizard"
            showActions={false}
            showDescription={true}
            showStats={true}
            showTags={true}
          />
        </SpellLibraryProvider>
      </div>
      {block.empower && (
        <div className="spell-empower-callout">
          <div className="empower-badge">
            <i className="fas fa-bolt-lightning"></i>
            <span>EMPOWER SCALING</span>
          </div>
          <p className="empower-text">{block.empower}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Campaign Location & Point of Interest Showcase Block
 */
export const LocationShowcaseBlock = ({
  block,
  isWrite = false,
  onUpdate = () => {}
}) => {
  return (
    <div className="book-location-showcase-wrapper">
      <div className="location-showcase-header">
        <div className="loc-icon-badge">
          <i className="fas fa-landmark"></i>
        </div>
        <div className="loc-title-wrap">
          {isWrite ? (
            <input
              type="text"
              className="loc-input-name"
              value={block.name || ''}
              placeholder="Location or Realm Name..."
              onChange={(e) => onUpdate({ name: e.target.value })}
            />
          ) : (
            <h3 className="loc-name">{block.name || 'Unnamed Realm Location'}</h3>
          )}
          <div className="loc-meta-sub">
            <span className="loc-danger-tag">Danger: {block.dangerLevel || 'Moderate'}</span>
            {block.faction && (
              <span className="loc-faction-badge">
                <i className="fas fa-flag"></i> {block.faction}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="loc-divider" />

      {block.landmarks && (
        <div className="loc-landmarks-strip">
          <span className="landmarks-lbl">Notable Features:</span> {block.landmarks}
        </div>
      )}

      <div className="loc-desc-prose">
        {isWrite ? (
          <textarea
            className="loc-input-desc"
            rows={3}
            value={block.description || ''}
            placeholder="Atmospheric prose and tactical terrain details..."
            onChange={(e) => onUpdate({ description: e.target.value })}
          />
        ) : (
          <RichLoreText text={block.description || 'A prominent region in the chronicles.'} className="parchment-theme" />
        )}
      </div>

      {block.secrets && (
        <div className="loc-secrets-box">
          <div className="secrets-header">
            <i className="fas fa-eye-slash"></i> <strong>GM Secret:</strong>
          </div>
          <div className="secrets-content">
            {isWrite ? (
              <input
                type="text"
                value={block.secrets}
                onChange={(e) => onUpdate({ secrets: e.target.value })}
                placeholder="Hidden DM lore..."
              />
            ) : (
              block.secrets
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * NPC & Persona Dossier Block
 */
export const NpcDossierBlock = ({
  block,
  isWrite = false,
  onUpdate = () => {}
}) => {
  return (
    <div className="book-npc-dossier-wrapper">
      <div className="npc-dossier-header">
        <div className="npc-avatar-badge">
          <i className="fas fa-user-shield"></i>
        </div>
        <div className="npc-title-group">
          {isWrite ? (
            <input
              type="text"
              className="npc-input-name"
              value={block.name || ''}
              placeholder="NPC Name & Title..."
              onChange={(e) => onUpdate({ name: e.target.value })}
            />
          ) : (
            <h3 className="npc-name">{block.name || 'Dossier Entry'}</h3>
          )}
          <div className="npc-meta-sub">
            <span className="npc-disp-pill">{block.disposition || 'Neutral'}</span>
            {block.faction && (
              <span className="npc-faction-pill">
                <i className="fas fa-crown"></i> {block.faction}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="npc-divider" />

      {block.personality && (
        <div className="npc-personality-bar">
          <strong>Personality:</strong> {block.personality}
        </div>
      )}

      <div className="npc-desc-prose">
        {isWrite ? (
          <textarea
            className="npc-input-desc"
            rows={3}
            value={block.description || ''}
            placeholder="NPC background, mannerisms, and goals..."
            onChange={(e) => onUpdate({ description: e.target.value })}
          />
        ) : (
          <RichLoreText text={block.description || 'An important figure in the realm.'} className="parchment-theme" />
        )}
      </div>

      {block.quote && (
        <blockquote className="npc-quote">"{block.quote}"</blockquote>
      )}
    </div>
  );
};

/**
 * Quest & Narrative Hook Block
 */
export const QuestHookBlock = ({
  block,
  isWrite = false,
  onUpdate = () => {}
}) => {
  const objectives = Array.isArray(block.objectives) ? block.objectives : [];

  return (
    <div className="book-quest-hook-wrapper">
      <div className="quest-hook-header">
        <div className="quest-icon-badge">
          <i className="fas fa-scroll-old"></i>
        </div>
        <div className="quest-title-wrap">
          {isWrite ? (
            <input
              type="text"
              className="quest-input-title"
              value={block.title || ''}
              placeholder="Quest or Plot Hook Title..."
              onChange={(e) => onUpdate({ title: e.target.value })}
            />
          ) : (
            <h3 className="quest-title">{block.title || 'Quest Hook'}</h3>
          )}
          <div className="quest-meta-sub">
            <span className="quest-status-badge">Status: {block.status || 'Active'}</span>
            {block.reward && (
              <span className="quest-reward-badge">
                <i className="fas fa-coins"></i> {block.reward}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="quest-divider" />

      {objectives.length > 0 && (
        <div className="quest-objectives-list">
          <span className="objectives-heading">Key Objectives:</span>
          {objectives.map((obj, i) => (
            <div key={i} className={'quest-objective-item ' + (obj.completed ? 'is-complete' : '')}>
              <i className={'fas ' + (obj.completed ? 'fa-check-circle' : 'fa-circle-dot')}></i>
              <span>{obj.text || obj}</span>
            </div>
          ))}
        </div>
      )}

      {block.description && (
        <div className="quest-desc-prose">
          <RichLoreText text={block.description} className="parchment-theme" />
        </div>
      )}
    </div>
  );
};

export const normalizeBookItemData = (block = {}) => {
  if (!block) return { name: 'Unnamed Item', quality: 'common', type: 'miscellaneous' };

  const rawQuality = (block.quality || block.rarity || 'common').toLowerCase();
  let quality = rawQuality;
  if (rawQuality === 'very-rare' || rawQuality === 'very rare') quality = 'epic';

  // Determine standard item type
  let type = block.type && block.type !== 'item_card' ? block.type : undefined;
  if (!type) {
    const rawType = (block.subtype || block.itemType || '').toLowerCase();
    if (rawType.includes('weapon') || block.damage || block.weaponStats) type = 'weapon';
    else if (rawType.includes('armor') || rawType.includes('shield') || block.armor) type = 'armor';
    else if (rawType.includes('potion') || rawType.includes('consumable')) type = 'consumable';
    else if (rawType.includes('ring') || rawType.includes('cloak') || rawType.includes('amulet') || rawType.includes('accessory')) type = 'accessory';
    else if (rawType.includes('container') || rawType.includes('bag')) type = 'container';
    else type = 'miscellaneous';
  }

  // Parse legacy currency strings (e.g. "750 gp", "5,000 gp")
  let value = block.value;
  if (typeof value === 'string') {
    const gpMatch = value.match(/([\d,]+)\s*gp/i);
    const spMatch = value.match(/([\d,]+)\s*sp/i);
    const cpMatch = value.match(/([\d,]+)\s*cp/i);
    const ppMatch = value.match(/([\d,]+)\s*pp/i);
    if (gpMatch || spMatch || cpMatch || ppMatch) {
      value = {
        platinum: ppMatch ? parseInt(ppMatch[1].replace(/,/g, ''), 10) : 0,
        gold: gpMatch ? parseInt(gpMatch[1].replace(/,/g, ''), 10) : 0,
        silver: spMatch ? parseInt(spMatch[1].replace(/,/g, ''), 10) : 0,
        copper: cpMatch ? parseInt(cpMatch[1].replace(/,/g, ''), 10) : 0
      };
    }
  }

  const weaponStats = block.weaponStats || (block.damage ? {
    baseDamage: block.damage,
    weaponType: block.itemType || 'Weapon'
  } : undefined);

  return {
    ...block,
    id: block.id || 'book-item-' + (block.name || 'item'),
    name: block.name || 'Unnamed Relic',
    quality: quality,
    type: type,
    subtype: block.subtype || block.itemType || '',
    description: block.description || '',
    flavor: block.flavor || block.flavorText || '',
    iconId: block.iconId || (block.icon && !block.icon.startsWith('fa-') ? block.icon : 'inv_sword_04'),
    imageUrl: block.imageUrl || null,
    durability: block.durability || (['weapon', 'armor', 'accessory'].includes(type) ? 'd8' : undefined),
    maxDurability: block.maxDurability || (['weapon', 'armor', 'accessory'].includes(type) ? 'd8' : undefined),
    value: value || { gold: 0, silver: 0, copper: 0, platinum: 0 },
    baseStats: block.baseStats || {},
    combatStats: block.combatStats || {},
    utilityStats: block.utilityStats || {},
    weaponStats: weaponStats,
    properties: block.properties || ''
  };
};

/**
 * Item & Relic Card Block
 * Renders the authentic in-game ItemTooltip layout inside book documents.
 */
export const ItemRelicBlock = ({
  block,
  isWrite = false,
  onUpdate = () => {},
  onOpenStudio = () => {}
}) => {
  const itemData = normalizeBookItemData(block);

  return (
    <div className="book-item-block-container">
      <div className="book-item-tooltip-embed">
        <ItemTooltip item={itemData} />
      </div>

      {isWrite && (
        <div className="item-block-write-actions">
          <button
            type="button"
            className="book-item-action-btn"
            onClick={() => onOpenStudio(itemData)}
            title="Configure in Item Studio & Wizard"
          >
            <i className="fas fa-wand-magic-sparkles"></i> Open in Item Wizard
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Image & Illustration Block
 */
export const BookImageBlock = ({
  block,
  isWrite = false,
  onUpdate = () => {},
  onOpenPicker = () => {}
}) => {
  const align = block.align || 'center';
  const frame = block.frameStyle || 'gold-frame';
  const widthPercent = block.width || 100;

  return (
    <div className={'book-image-wrapper align-' + align + ' frame-' + frame} style={{ width: widthPercent + '%' }}>
      <div className="book-image-container">
        <img
          src={block.url || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'}
          alt={block.caption || 'Book illustration'}
          className="book-image"
        />
        {isWrite && (
          <div className="image-inline-toolbar">
            <button
              type="button"
              className="img-tool-btn"
              onClick={() => onOpenPicker(block)}
              title="Change Image"
            >
              <i className="fas fa-images"></i> Change
            </button>
          </div>
        )}
      </div>
      {block.caption && (
        <p className="book-image-caption">
          {isWrite ? (
            <input
              type="text"
              value={block.caption}
              className="caption-inline-input"
              onChange={(e) => onUpdate({ caption: e.target.value })}
            />
          ) : (
            block.caption
          )}
        </p>
      )}
    </div>
  );
};

/**
 * Callout Block
 */
export const BookCalloutBlock = ({
  block,
  isWrite = false,
  onUpdate = () => {},
  onOpenLorePicker = () => {}
}) => {
  const type = block.calloutType || 'info';

  return (
    <div className={'book-callout-block callout-' + type}>
      <div className="callout-header">
        <div className="callout-title-wrap">
          <i className="fas fa-bookmark"></i>
          {isWrite ? (
            <input
              type="text"
              className="callout-input-title"
              value={block.title || 'Historical Note'}
              onChange={(e) => onUpdate({ title: e.target.value })}
            />
          ) : (
            <h4 className="callout-title">{block.title || 'Historical Note'}</h4>
          )}
        </div>
        {isWrite && (
          <div className="callout-header-actions">
            <select
              value={type}
              onChange={(e) => onUpdate({ calloutType: e.target.value })}
              className="callout-type-select"
            >
              <option value="info">Lore Note</option>
              <option value="secret">Secret Lore</option>
              <option value="warning">Tactical Warning</option>
              <option value="readaloud">Read-Aloud</option>
            </select>
            <button
              type="button"
              className="callout-import-lore-btn"
              onClick={() => onOpenLorePicker(block)}
              title="Import Lore from World & Campaign Dossiers"
            >
              <i className="fas fa-feather-pointed"></i> Import Lore
            </button>
          </div>
        )}
      </div>
      <div className="callout-content">
        {isWrite ? (
          <textarea
            className="callout-textarea"
            rows={3}
            value={block.text || block.content || ''}
            placeholder="Chronicle lore, DM notes, historical excerpt..."
            onChange={(e) => onUpdate({ text: e.target.value, content: e.target.value })}
          />
        ) : (
          <RichLoreText text={block.text || block.content || 'Chronicle notes.'} className="parchment-theme" />
        )}
      </div>
    </div>
  );
};

/**
 * Map Embed Block
 */
export const MapEmbedBlock = ({
  block,
  isWrite = false,
  onUpdate = () => {}
}) => {
  return (
    <div className="book-map-embed-card">
      <div
        className="map-embed-banner"
        style={{
          backgroundImage: 'url(' + (block.thumbnailUrl || 'https://images.unsplash.com/photo-1524654458049-e36be0721fa2?auto=format&fit=crop&w=1200&q=80') + ')'
        }}
      >
        <div className="map-embed-overlay">
          <span className="map-embed-badge">Interactive Map</span>
          <h4 className="map-embed-title">{block.title || 'World Map Atlas'}</h4>
        </div>
      </div>
      <div className="map-embed-footer">
        <span>Linked to VTT Map Canvas</span>
        <button type="button" className="map-explore-btn">
          <i className="fas fa-compass"></i> Open Map
        </button>
      </div>
    </div>
  );
};

/**
 * Table of Contents Block
 */
export const TableOfContentsBlock = ({
  book,
  onNavigate = () => {}
}) => {
  return (
    <div className="book-toc-block">
      <div className="toc-title-header">
        <h3 className="toc-main-heading">Table of Contents</h3>
        <div className="toc-header-flourish">◆ ◆ ◆</div>
      </div>
      <div className="toc-list">
        {(book.chapters || []).map((ch, chIdx) => (
          <React.Fragment key={ch.id}>
            <div
              className="toc-chapter-line"
              onClick={() => onNavigate({ chapterId: ch.id, pageId: ch.pages?.[0]?.id })}
            >
              <span className="toc-ch-title">{ch.title}</span>
              <span className="toc-leader-dots" />
              <span className="toc-page-number">Page {ch.pages?.[0]?.pageNumber || 1}</span>
            </div>
            {(ch.pages || []).slice(1).map((pg) => (
              <div
                key={pg.id}
                className="toc-sub-line"
                onClick={() => onNavigate({ chapterId: ch.id, pageId: pg.id })}
              >
                <span className="toc-pg-title">{pg.headerTitle || ('Section ' + pg.pageNumber)}</span>
                <span className="toc-leader-dots" />
                <span className="toc-page-number">Page {pg.pageNumber}</span>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
