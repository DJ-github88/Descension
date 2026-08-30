import React, { useState, useRef } from 'react';
import RichLoreText from '../common/RichLoreText';
import UnifiedSpellCard from '../spellcrafting-wizard/components/common/UnifiedSpellCard';
import { SpellLibraryProvider } from '../spellcrafting-wizard/context/SpellLibraryContext';
import ItemTooltip from '../item-generation/ItemTooltip';
import { getIconUrl } from '../../utils/assetManager';
import StylusDrawingCanvas from '../common/StylusDrawingCanvas';

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
    tokenIcon: 'inv_misc_questionmark',
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
    tokenIcon: 'inv_misc_questionmark',
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
    tokenIcon: 'inv_misc_questionmark',
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
  }
];

/**
 * Authentic Descension Creature Statblock Block
 * - Write Mode: Full authoring studio with direct link to official Creature Wizard
 * - Read Mode: Authentic, publication-grade Creature Statblock with parchment card & golden rules
 */
export const CreatureStatblockBlock = ({
  block,
  isWrite = false,
  compact = false,
  onUpdate = () => {},
  onOpenWizard = () => {}
}) => {
  const [showPresets, setShowPresets] = useState(false);
  const stats = block.stats || { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 };
  const hp = typeof block.hp === 'object' ? (block.hp.max || block.hp.current || 75) : (block.hp || 75);
  const traits = Array.isArray(block.traits) ? block.traits : [];
  const actions = Array.isArray(block.actions) ? block.actions : [];
  const danger = normalizeDangerLevel(block.dangerLevel, block.cr);
  const isCompact = compact || block.sizePreset === 'half';

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
      tokenIcon: preset.tokenIcon || 'inv_misc_questionmark',
      tokenIcon: preset.tokenIcon,
      stats: { ...preset.stats },
      resistances: preset.resistances,
      traits: [...preset.traits],
      actions: [...preset.actions]
    });
    setShowPresets(false);
  };

  const handleAddTrait = () => {
    onUpdate({ traits: [...traits, { name: 'New Trait', desc: 'Mechanical description of trait...' }] });
  };

  const handleTraitChange = (index, field, val) => {
    const updated = traits.map((t, i) => i === index ? { ...t, [field]: val } : t);
    onUpdate({ traits: updated });
  };

  const handleDeleteTrait = (index) => {
    onUpdate({ traits: traits.filter((_, i) => i !== index) });
  };

  const handleAddAction = () => {
    onUpdate({ actions: [...actions, { name: 'Strike (1 AP)', desc: 'Attack: 1d8+2 Physical damage.' }] });
  };

  const handleActionChange = (index, field, val) => {
    const updated = actions.map((a, i) => i === index ? { ...a, [field]: val } : a);
    onUpdate({ actions: updated });
  };

  const handleDeleteAction = (index) => {
    onUpdate({ actions: actions.filter((_, i) => i !== index) });
  };

  // WRITE MODE: Authoring Studio with Official Creature Wizard Hook
  if (isWrite) {
    return (
      <div className={`book-creature-authoring-box ${isCompact ? 'compact-authoring' : ''}`}>
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
            <button
              type="button"
              className="book-creature-wizard-btn"
              onClick={() => onOpenWizard(block)}
              title="Open full 5-step Creature Wizard studio"
            >
              <i className="fas fa-wand-magic-sparkles"></i> Open in Creature Wizard
            </button>
            <button
              type="button"
              className="statblock-browse-btn"
              onClick={() => onOpenPicker(block)}
              title="Browse Descension Bestiary Catalog"
            >
              <i className="fas fa-book-open"></i> Bestiary
            </button>
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
              title="Load Preset"
            >
              <i className="fas fa-sparkles"></i> Presets
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
          <div className="author-stats-label">
            <i className="fas fa-dice-d20"></i> Core Ability Scores
          </div>
          <div className="author-stats-grid">
            {[
              { key: 'strength', abbr: 'STR' },
              { key: 'agility', abbr: 'AGI' },
              { key: 'constitution', abbr: 'CON' },
              { key: 'intelligence', abbr: 'INT' },
              { key: 'spirit', abbr: 'SPI' },
              { key: 'charisma', abbr: 'CHA' }
            ].map(({ key, abbr }) => {
              const val = stats[key] ?? 10;
              const mod = Math.floor((val - 10) / 2);
              return (
                <div key={key} className="stat-input-cell">
                  <span className="stat-abbr-label">{abbr}</span>
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => handleStatChange(key, e.target.value)}
                  />
                  <span className="stat-mod-badge">{mod >= 0 ? `+${mod}` : mod}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traits Editor */}
        <div className="authoring-section-editor">
          <div className="section-editor-header">
            <div className="section-title-wrap">
              <i className="fas fa-sparkles"></i>
              <span>Passives &amp; Traits ({traits.length})</span>
            </div>
            <button type="button" className="add-sub-btn" onClick={handleAddTrait}>
              <i className="fas fa-plus"></i> Add Trait
            </button>
          </div>
          {traits.length === 0 ? (
            <div className="section-editor-empty" onClick={handleAddTrait}>
              <i className="fas fa-feather-pointed"></i> No passives or traits yet. Click to add one.
            </div>
          ) : (
            traits.map((t, idx) => (
              <div key={idx} className="sub-entry-row">
                <input
                  type="text"
                  className="sub-name-input"
                  placeholder="Trait Name..."
                  value={t.name || ''}
                  onChange={(e) => handleTraitChange(idx, 'name', e.target.value)}
                />
                <textarea
                  className="sub-desc-input"
                  placeholder="Mechanical effect, passive trigger, or aura..."
                  value={t.desc || ''}
                  rows={2}
                  onChange={(e) => handleTraitChange(idx, 'desc', e.target.value)}
                />
                <button type="button" className="del-sub-btn" onClick={() => handleDeleteTrait(idx)} title="Delete Trait">
                  <i className="fas fa-trash-can"></i>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Actions Editor */}
        <div className="authoring-section-editor">
          <div className="section-editor-header">
            <div className="section-title-wrap">
              <i className="fas fa-hand-fist"></i>
              <span>Actions &amp; Strikes ({actions.length})</span>
            </div>
            <button type="button" className="add-sub-btn" onClick={handleAddAction}>
              <i className="fas fa-plus"></i> Add Action
            </button>
          </div>
          {actions.length === 0 ? (
            <div className="section-editor-empty" onClick={handleAddAction}>
              <i className="fas fa-bolt"></i> No actions or strikes yet. Click to add one.
            </div>
          ) : (
            actions.map((act, idx) => (
              <div key={idx} className="sub-entry-row">
                <input
                  type="text"
                  className="sub-name-input"
                  placeholder="Action Name (e.g. Glacial Rend 1 AP)..."
                  value={act.name || ''}
                  onChange={(e) => handleActionChange(idx, 'name', e.target.value)}
                />
                <textarea
                  className="sub-desc-input"
                  placeholder="Attack roll, reach, damage dice, and saving throws..."
                  value={act.desc || ''}
                  rows={2}
                  onChange={(e) => handleActionChange(idx, 'desc', e.target.value)}
                />
                <button type="button" className="del-sub-btn" onClick={() => handleDeleteAction(idx)} title="Delete Action">
                  <i className="fas fa-trash-can"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // READ MODE: Publication Statblock Card
  return (
    <div className={`book-creature-statblock ${isCompact ? 'compact-statblock' : ''}`}>
      <div className="statblock-header-band">
        <div className="statblock-header-left">
          {block.tokenIcon && (
            <div className="statblock-token-mini">
              <img
                src={getIconUrl(block.tokenIcon)}
                alt=""
                onError={(e) => { e.target.src = '/assets/icons/inv_misc_questionmark.png'; }}
              />
            </div>
          )}
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
 */
export const SpellFormulaBlock = ({
  block,
  isWrite = false,
  onUpdate = () => {}
}) => {
  const [showPresets, setShowPresets] = useState(false);

  const normalizedSpell = {
    name: block.name || 'Unnamed Spell',
    category: block.category || 'damage',
    damageTypes: Array.isArray(block.damageTypes) ? block.damageTypes : (block.damageType ? [block.damageType] : ['arcane']),
    tier: block.tier ? `T${block.tier}`.replace('TT', 'T') : 'T1',
    spellType: block.spellType || 'ACTION',
    ap: block.ap || block.resourceCosts?.action_points?.baseAmount || 2,
    manaCost: block.manaCost || block.resourceCosts?.mana?.baseAmount || 10,
    range: typeof block.range === 'number' ? `${block.range} ft.` : (block.range || '30 ft.'),
    duration: block.duration || 'Instantaneous',
    targetingMode: block.targetingMode || 'single',
    effect: block.effect || block.description || 'Deals magical force to the targeted foe.',
    description: block.effect || block.description || 'Deals magical force to the targeted foe.',
    mechanics: block.effect || block.description || 'Deals magical force to the targeted foe.',
    damageEffects: [
      {
        id: 'dmg-1',
        damageType: (block.damageTypes && block.damageTypes[0]) || block.damageType || 'rime',
        formula: block.primaryDamage?.dice ? `${block.primaryDamage.dice} + ${block.primaryDamage.flat || 0}` : '3d8 + 4'
      }
    ],
    empower: block.empower || '',
    primaryDamage: block.primaryDamage || { dice: '2d6', flat: 0 },
    tags: Array.isArray(block.tags) ? block.tags : ['arcane', 'spell']
  };

  const applyPreset = (preset) => {
    onUpdate({
      name: preset.name,
      category: preset.category,
      damageTypes: preset.damageTypes,
      tier: preset.tier ? parseInt(String(preset.tier).replace(/\D/g, ''), 10) || 1 : 1,
      ap: preset.ap,
      manaCost: preset.manaCost,
      range: preset.range,
      duration: preset.duration,
      targetingMode: preset.targetingMode,
      effect: preset.effect,
      empower: preset.empower,
      primaryDamage: preset.primaryDamage,
      tags: preset.tags
    });
    setShowPresets(false);
  };

  if (isWrite) {
    return (
      <div className="book-spell-authoring-box">
        <div className="authoring-header-bar">
          <div className="authoring-title-wrap">
            <i className="fas fa-wand-magic-sparkles"></i>
            <input
              type="text"
              className="statblock-input-title"
              value={block.name || ''}
              placeholder="Spell Formula Name..."
              onChange={(e) => onUpdate({ name: e.target.value })}
            />
          </div>
          <div className="authoring-header-actions">
            <button
              type="button"
              className="statblock-preset-btn"
              onClick={() => setShowPresets(!showPresets)}
              title="Load Preset Spell"
            >
              <i className="fas fa-scroll"></i> Presets
            </button>
          </div>
        </div>

        {showPresets && (
          <div className="statblock-presets-dropdown">
            <div className="preset-drop-title">Select Descension Spell:</div>
            {SPELL_PRESETS.map((p) => (
              <div key={p.name} className="preset-drop-item" onClick={() => applyPreset(p)}>
                <strong>{p.name}</strong> ({p.tier}) • <em>{p.category}</em>
              </div>
            ))}
          </div>
        )}

        <div className="authoring-form-grid">
          <div className="author-field">
            <label>Mana Cost:</label>
            <input
              type="number"
              value={normalizedSpell.manaCost}
              onChange={(e) => onUpdate({ manaCost: parseInt(e.target.value, 10) || 0 })}
            />
          </div>
          <div className="author-field">
            <label>AP Cost:</label>
            <input
              type="number"
              value={normalizedSpell.ap}
              onChange={(e) => onUpdate({ ap: parseInt(e.target.value, 10) || 1 })}
            />
          </div>
          <div className="author-field">
            <label>Range:</label>
            <input
              type="text"
              value={normalizedSpell.range}
              onChange={(e) => onUpdate({ range: e.target.value })}
            />
          </div>
          <div className="author-field">
            <label>Duration:</label>
            <input
              type="text"
              value={normalizedSpell.duration}
              onChange={(e) => onUpdate({ duration: e.target.value })}
            />
          </div>
        </div>

        <div className="author-field full-width">
          <label>Spell Effect &amp; Mechanics:</label>
          <textarea
            className="author-textarea"
            rows={3}
            value={block.effect || block.description || ''}
            placeholder="Detailed mechanical damage, saving throw, and conditions..."
            onChange={(e) => onUpdate({ effect: e.target.value, description: e.target.value })}
          />
        </div>

        <div className="author-field full-width">
          <label><i className="fas fa-bolt-lightning"></i> Empower Scaling Effect:</label>
          <input
            type="text"
            value={block.empower || ''}
            placeholder="e.g. Each additional 5 Mana increases damage by 1d8..."
            onChange={(e) => onUpdate({ empower: e.target.value })}
          />
        </div>
      </div>
    );
  }

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
 * Custom Lineage & Bloodline Showcase Block
 */
export const LineageShowcaseBlock = ({
  block,
  isWrite = false,
  onUpdate = () => {},
  onOpenPicker = () => {}
}) => {
  const abilityModifiers = block.abilityModifiers || { STR: 0, AGI: 0, CON: 0, INT: 0, SPI: 0, CHA: 0 };
  const baseTraits = block.baseTraits || { size: 'Medium', baseSpeed: 30, baseHp: 25, baseMana: 15, languages: ['Common'], lifespan: '60-100 yrs' };
  const passives = Array.isArray(block.racialPassives) ? block.racialPassives : [];
  const abilities = Array.isArray(block.racialAbilities) ? block.racialAbilities : [];
  const subraces = Array.isArray(block.subraces) ? block.subraces : [];

  return (
    <div className="book-lineage-showcase-box">
      <div className="lineage-header">
        <div className="lineage-icon-badge">
          <i className="fas fa-dna"></i>
        </div>
        <div className="lineage-title-wrap">
          {isWrite ? (
            <input
              type="text"
              className="lineage-input-title"
              value={block.name || ''}
              placeholder="Lineage / Ancestry Name..."
              onChange={(e) => onUpdate({ name: e.target.value })}
            />
          ) : (
            <h3 className="lineage-title">{block.name || 'Custom Lineage'}</h3>
          )}
          <div className="lineage-essence-tag">
            {isWrite ? (
              <input
                type="text"
                className="lineage-input-essence"
                value={block.essence || ''}
                placeholder="Essence / Tagline (e.g. The Cinder-Bound)..."
                onChange={(e) => onUpdate({ essence: e.target.value })}
              />
            ) : (
              <em>{block.essence || 'A forged bloodline of Mythrill'}</em>
            )}
          </div>
        </div>
        {isWrite && (
          <button
            type="button"
            className="lineage-import-btn"
            onClick={() => onOpenPicker(block)}
            title="Import from World & Custom Lineage Studio"
          >
            <i className="fas fa-feather-pointed"></i> Import Lineage
          </button>
        )}
      </div>

      <div className="lineage-divider" />

      {/* Ability Modifiers Bar */}
      <div className="lineage-modifiers-strip">
        {Object.entries(abilityModifiers).map(([k, v]) => (
          <div key={k} className={`mod-pill ${Number(v) > 0 ? 'pos' : Number(v) < 0 ? 'neg' : ''}`}>
            <span className="mod-label">{k}</span>
            <span className="mod-val">{Number(v) > 0 ? `+${v}` : v}</span>
          </div>
        ))}
      </div>

      {/* Base Vitals Summary */}
      <div className="lineage-traits-summary">
        <span><strong>Speed:</strong> {baseTraits.baseSpeed || 30} ft.</span>
        <span><strong>Size:</strong> {baseTraits.size || 'Medium'}</span>
        <span><strong>Base HP:</strong> {baseTraits.baseHp || 25}</span>
        <span><strong>Base Mana:</strong> {baseTraits.baseMana || 15}</span>
      </div>

      {/* Prose Lore */}
      <div className="lineage-desc-prose">
        {isWrite ? (
          <textarea
            className="lineage-textarea"
            rows={2}
            value={block.description || block.cardFlavor || ''}
            placeholder="Racial history, physiological features, and world origins..."
            onChange={(e) => onUpdate({ description: e.target.value })}
          />
        ) : (
          <RichLoreText text={block.description || block.cardFlavor || 'A unique heritage walking the lands.'} className="parchment-theme" />
        )}
      </div>

      {/* Racial Passives */}
      {passives.length > 0 && (
        <div className="lineage-feature-section">
          <h4 className="feature-section-title"><i className="fas fa-shield-heart"></i> Bloodline Passives</h4>
          {passives.map((p, idx) => (
            <div key={idx} className="lineage-passive-item">
              <strong>{p.name}:</strong> <span>{p.description || p.desc}</span>
            </div>
          ))}
        </div>
      )}

      {/* Unique Racial Actions */}
      {abilities.length > 0 && (
        <div className="lineage-feature-section">
          <h4 className="feature-section-title"><i className="fas fa-hand-sparkles"></i> Unique Lineage Abilities</h4>
          {abilities.map((a, idx) => (
            <div key={idx} className="lineage-ability-item">
              <div className="ability-item-head">
                <strong>{a.name}</strong>
                {a.actionPointCost && <span className="ap-badge">{a.actionPointCost} AP</span>}
                {a.manaCost ? <span className="mana-badge">{a.manaCost} Mana</span> : null}
              </div>
              <p className="ability-item-desc">{a.description || a.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Meaningful Tradeoff */}
      {block.meaningfulTradeoffs && (
        <div className="lineage-tradeoff-callout">
          <i className="fas fa-triangle-exclamation"></i>
          <div>
            <strong>Bloodline Strain:</strong> {block.meaningfulTradeoffs}
          </div>
        </div>
      )}

      {/* Subraces */}
      {subraces.length > 0 && (
        <div className="lineage-subraces-strip">
          <span className="subraces-label">Regional Bloodlines:</span>
          {subraces.map((s, idx) => (
            <span key={idx} className="subrace-chip">{s.name}</span>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Dynasty Tree & Relationship Web Block
 */
export const DynastyTreeBlock = ({
  block,
  isWrite = false,
  onUpdate = () => {},
  onOpenPicker = () => {}
}) => {
  const nodes = Array.isArray(block.nodes) ? block.nodes : [];
  const relationships = Array.isArray(block.relationships) ? block.relationships : [];

  const handleAddMember = () => {
    const newId = `node-${Date.now()}`;
    const nextNodes = [
      ...nodes,
      { id: newId, name: 'New Noble Scion', title: 'Heir / Scion', lifespan: 'Present', role: 'House Member', gender: 'male' }
    ];
    onUpdate({ nodes: nextNodes });
  };

  const handleRemoveMember = (nodeId) => {
    const nextNodes = nodes.filter((n) => n.id !== nodeId);
    const nextRels = relationships.filter((r) => r.fromId !== nodeId && r.toId !== nodeId);
    onUpdate({ nodes: nextNodes, relationships: nextRels });
  };

  return (
    <div className="book-dynasty-block">
      <div className="dynasty-header">
        <div className="dynasty-icon-badge">
          <i className="fas fa-sitemap"></i>
        </div>
        <div className="dynasty-title-wrap">
          {isWrite ? (
            <input
              type="text"
              className="dynasty-input-title"
              value={block.name || block.title || ''}
              placeholder="Dynasty / Bloodline Tree Name..."
              onChange={(e) => onUpdate({ name: e.target.value, title: e.target.value })}
            />
          ) : (
            <h3 className="dynasty-title">{block.name || block.title || 'Noble Dynasty'}</h3>
          )}
          <span className="dynasty-badge">{nodes.length} Members • {relationships.length} Connections</span>
        </div>
        {isWrite && (
          <div className="dynasty-header-actions">
            <button
              type="button"
              className="dynasty-import-btn"
              onClick={() => onOpenPicker(block)}
              title="Import from Family Tree Studio or Faction Webs"
            >
              <i className="fas fa-feather-pointed"></i> Import Tree
            </button>
            <button
              type="button"
              className="dynasty-add-btn"
              onClick={handleAddMember}
              title="Add family member"
            >
              + Add Member
            </button>
          </div>
        )}
      </div>

      {block.description && (
        <div className="dynasty-desc-prose">
          <RichLoreText text={block.description} className="parchment-theme" />
        </div>
      )}

      {/* Member Cards Grid */}
      {nodes.length > 0 && (
        <div className="dynasty-members-grid">
          {nodes.map((node) => (
            <div key={node.id} className="dynasty-member-card">
              <div className="member-portrait-slot">
                {node.portraitUrl ? (
                  <img src={node.portraitUrl} alt={node.name} />
                ) : (
                  <i className={`fas ${node.gender === 'female' ? 'fa-user-nurse' : 'fa-user-tie'}`}></i>
                )}
              </div>
              <div className="member-details">
                <h5 className="member-name">{node.name}</h5>
                {node.title && <div className="member-title">{node.title}</div>}
                {node.lifespan && <div className="member-lifespan">({node.lifespan})</div>}
                {node.role && <div className="member-role">{node.role}</div>}
              </div>
              {isWrite && (
                <button
                  type="button"
                  className="member-delete-btn"
                  onClick={() => handleRemoveMember(node.id)}
                  title="Remove member"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Relationships Breakdown */}
      {relationships.length > 0 && (
        <div className="dynasty-relations-strip">
          <span className="relations-label"><i className="fas fa-link"></i> Dynastic Ties:</span>
          {relationships.map((rel, idx) => {
            const fromNode = nodes.find((n) => n.id === rel.fromId);
            const toNode = nodes.find((n) => n.id === rel.toId);
            const fromName = fromNode?.name || rel.fromName || 'Member';
            const toName = toNode?.name || rel.toName || 'Member';
            return (
              <span key={idx} className="dynasty-rel-tag">
                {fromName} <em>({rel.type || 'linked'})</em> {toName}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * Campaign Plot Thread & Narrative Arc Block
 */
export const PlotThreadBlock = ({
  block,
  isWrite = false,
  onUpdate = () => {},
  onOpenPicker = () => {}
}) => {
  const beats = Array.isArray(block.beats) ? block.beats : [];
  const completedBeatsCount = beats.filter((b) => b.completed || b.done).length;
  const progressPercent = beats.length > 0 ? Math.round((completedBeatsCount / beats.length) * 100) : 0;

  const toggleBeat = (index) => {
    const next = beats.map((b, i) => {
      if (i !== index) return b;
      return { ...b, completed: !(b.completed || b.done) };
    });
    onUpdate({ beats: next });
  };

  const handleAddBeat = () => {
    const next = [...beats, { title: `Story Milestone ${beats.length + 1}`, description: '', completed: false }];
    onUpdate({ beats: next });
  };

  const handleRemoveBeat = (index) => {
    const next = beats.filter((_, i) => i !== index);
    onUpdate({ beats: next });
  };

  const formatPlotType = (type) => {
    if (!type || type === 'plot_thread' || type === 'plot') return 'Plot Arc';
    return String(type)
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="book-plot-thread-block">
      <div className="plot-thread-header">
        <div className="plot-icon-badge">
          <i className="fas fa-diagram-project"></i>
        </div>
        <div className="plot-title-wrap">
          {isWrite ? (
            <input
              type="text"
              className="plot-input-title"
              value={block.title || ''}
              placeholder="Plot Arc / Story Thread Title..."
              onChange={(e) => onUpdate({ title: e.target.value })}
            />
          ) : (
            <h3 className="plot-title">{block.title || 'Campaign Plot Thread'}</h3>
          )}
          <div className="plot-meta-badges">
            <span className="plot-type-pill">{formatPlotType(block.type)}</span>
            <span className={`plot-status-pill status-${(block.status || 'active').toLowerCase()}`}>
              {block.status || 'Active'}
            </span>
            {block.act && <span className="plot-act-pill">Act {block.act}</span>}
          </div>
        </div>
        {isWrite && (
          <div className="plot-header-actions">
            <button
              type="button"
              className="plot-import-btn"
              onClick={() => onOpenPicker(block)}
              title="Import from Campaign Plot Threads"
            >
              <i className="fas fa-feather-pointed"></i> Import Plot
            </button>
          </div>
        )}
      </div>

      {block.theme && (
        <div className="plot-theme-line">
          <strong>Theme:</strong> <em>{block.theme}</em>
        </div>
      )}

      {/* Conflict / Summary Prose */}
      <div className="plot-summary-prose">
        {isWrite ? (
          <textarea
            className="plot-textarea"
            rows={2}
            value={block.summary || block.coreConflict || ''}
            placeholder="Core dramatic conflict, stakes, and narrative progression..."
            onChange={(e) => onUpdate({ summary: e.target.value, coreConflict: e.target.value })}
          />
        ) : (
          <RichLoreText text={block.summary || block.coreConflict || 'A major story arc unfolding in the campaign.'} className="parchment-theme" />
        )}
      </div>

      {/* Story Beats Timeline */}
      <div className="plot-beats-timeline">
        <div className="beats-head-row">
          <h4 className="beats-heading">
            <i className="fas fa-timeline"></i> Story Beats &amp; Milestones ({completedBeatsCount}/{beats.length})
          </h4>
          {isWrite && (
            <button type="button" className="add-beat-inline-btn" onClick={handleAddBeat}>
              + Add Beat
            </button>
          )}
        </div>

        {beats.length > 0 && (
          <div className="plot-progress-bar-container">
            <div className="plot-progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        )}

        <div className="beats-list">
          {beats.map((beat, idx) => {
            const isDone = beat.completed || beat.done;
            return (
              <div key={idx} className={`beat-step-card ${isDone ? 'completed' : ''}`}>
                <span
                  className="beat-check-trigger"
                  onClick={() => toggleBeat(idx)}
                  title="Toggle beat complete"
                >
                  <i className={isDone ? 'fas fa-circle-check' : 'fa-regular fa-circle'}></i>
                </span>
                <div className="beat-index-marker">{idx + 1}</div>
                <div className="beat-body">
                  <strong>{beat.title || `Beat ${idx + 1}`}</strong>
                  {beat.description && <p>{beat.description}</p>}
                </div>
                {isWrite && (
                  <button
                    type="button"
                    className="beat-remove-btn"
                    onClick={() => handleRemoveBeat(idx)}
                    title="Remove beat"
                  >
                    &times;
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export const BookPlotThreadBlock = PlotThreadBlock;

/**
 * Campaign Location & Point of Interest Showcase Block
 */
export const LocationShowcaseBlock = ({
  block,
  isWrite = false,
  onUpdate = () => {},
  onOpenPicker = () => {}
}) => {
  const dangerRating = block.dangerRating || block.dangerLevel || 'Moderate';
  const dangerClass = dangerRating.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="book-location-showcase-wrapper">
      {/* Optional Location Banner Artwork */}
      {block.imageUrl && (
        <div
          className="location-banner-slot"
          style={{ backgroundImage: `url(${block.imageUrl})` }}
        >
          <div className="location-banner-overlay">
            <span className="location-type-badge">{block.locationType || 'Sanctuary / Landmark'}</span>
          </div>
        </div>
      )}

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
            <span className={`loc-danger-tag danger-${dangerClass}`}>
              <i className="fas fa-skull"></i> {dangerRating}
            </span>
            {block.region && (
              <span className="loc-region-badge">
                <i className="fas fa-map-location-dot"></i> {block.region}
              </span>
            )}
            {block.faction && (
              <span className="loc-faction-badge">
                <i className="fas fa-shield"></i> {block.faction}
              </span>
            )}
          </div>
        </div>
        {isWrite && (
          <button
            type="button"
            className="loc-import-btn"
            onClick={() => onOpenPicker(block)}
            title="Import from World Locations & Settlements"
          >
            <i className="fas fa-feather-pointed"></i> Import Location
          </button>
        )}
      </div>

      <div className="loc-divider" />

      {block.landmarks && (
        <div className="loc-landmarks-strip">
          <span className="landmarks-lbl"><i className="fas fa-compass"></i> Notable Features:</span> {block.landmarks}
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
            <i className="fas fa-eye-slash"></i> <strong>GM Secret &amp; Hidden Lore:</strong>
          </div>
          <div className="secrets-content">
            {isWrite ? (
              <input
                type="text"
                className="loc-input-secrets"
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
  onUpdate = () => {},
  onOpenPicker = () => {}
}) => {
  const dispClass = (block.disposition || 'neutral').toLowerCase();
  const avatarUrl = block.portraitUrl || block.avatarUrl || block.imageUrl;

  return (
    <div className="book-npc-dossier-wrapper">
      <div className="npc-dossier-header">
        <div className="npc-avatar-badge">
          {avatarUrl ? (
            <img src={avatarUrl} alt={block.name || 'NPC'} className="npc-avatar-img" />
          ) : (
            <i className="fas fa-user-shield"></i>
          )}
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
            {block.role && <span className="npc-role-tag">{block.role}</span>}
            <span className={`npc-disp-pill disp-${dispClass}`}>
              {block.disposition || 'Neutral'}
            </span>
            {block.faction && (
              <span className="npc-faction-pill">
                <i className="fas fa-crown"></i> {block.faction}
              </span>
            )}
          </div>
        </div>
        {isWrite && (
          <button
            type="button"
            className="npc-import-btn"
            onClick={() => onOpenPicker(block)}
            title="Import from World NPC Catalog"
          >
            <i className="fas fa-feather-pointed"></i> Import NPC
          </button>
        )}
      </div>

      <div className="npc-divider" />

      {block.personality && (
        <div className="npc-personality-bar">
          <i className="fas fa-masks-theater"></i>
          <div>
            <strong>Mannerisms:</strong> {block.personality}
          </div>
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
        <blockquote className="npc-quote">
          <i className="fas fa-quote-left quote-flourish"></i>
          <span>{block.quote}</span>
        </blockquote>
      )}
    </div>
  );
};

/**
 * Quest & Narrative Hook Block
 */
/**
 * Quest & Narrative Hook Block
 * Matches authentic in-game quest layout with Level badges, difficulty pills,
 * quest giver metadata, interactive objectives checklist, and reward chips.
 */
export const QuestHookBlock = ({
  block,
  isWrite = false,
  onUpdate = () => {},
  onOpenPicker = () => {}
}) => {
  const objectives = Array.isArray(block.objectives) ? block.objectives : [];
  const rewards = block.rewards || (block.reward ? { customReward: block.reward } : null);

  const toggleObjective = (index) => {
    const next = objectives.map((obj, i) => {
      if (i !== index) return obj;
      if (typeof obj === 'string') return { text: obj, completed: true };
      return { ...obj, completed: !obj.completed };
    });
    onUpdate({ objectives: next });
  };

  const handleAddObjective = () => {
    const next = [...objectives, { text: 'New quest milestone or task', completed: false }];
    onUpdate({ objectives: next });
  };

  const handleUpdateObjectiveText = (index, newText) => {
    const next = objectives.map((obj, i) => {
      if (i !== index) return obj;
      return typeof obj === 'string' ? { text: newText, completed: false } : { ...obj, text: newText };
    });
    onUpdate({ objectives: next });
  };

  const handleRemoveObjective = (index) => {
    const next = objectives.filter((_, i) => i !== index);
    onUpdate({ objectives: next });
  };

  const diffClass = (block.difficulty || 'Medium').toLowerCase();

  return (
    <div className={`book-quest-hook-wrapper diff-${diffClass}`}>
      {/* Header Band */}
      <div className="quest-hook-header">
        <div className="quest-icon-badge">
          <i className="fas fa-scroll"></i>
        </div>
        <div className="quest-title-wrap">
          <div className="quest-title-row">
            {isWrite ? (
              <input
                type="text"
                className="quest-input-title"
                value={block.title || ''}
                placeholder="Quest or Adventure Title..."
                onChange={(e) => onUpdate({ title: e.target.value })}
              />
            ) : (
              <h3 className="quest-title">{block.title || 'The Lost Key of Drunhold'}</h3>
            )}
          </div>

          <div className="quest-meta-sub">
            <span className={`quest-difficulty-badge diff-${diffClass}`}>
              {block.difficulty || 'Medium'}
            </span>
            <span className="quest-level-pill">
              <i className="fas fa-shield-halved"></i> Lvl {block.level || 3}
            </span>
            {block.giver && (
              <span className="quest-giver-pill">
                <i className="fas fa-feather-pointed"></i> {block.giver}
              </span>
            )}
            <span className="quest-status-badge">
              {block.status || 'Active'}
            </span>
          </div>
        </div>

        {isWrite && (
          <div className="quest-header-actions">
            <button
              type="button"
              className="quest-browse-catalog-btn"
              onClick={() => onOpenPicker(block)}
              title="Browse Fantasy Quests &amp; Campaign Hooks"
            >
              <i className="fas fa-scroll"></i> Browse Quests
            </button>
          </div>
        )}
      </div>

      {/* Description / Story Briefing */}
      {(block.description || isWrite) && (
        <div className="quest-desc-section">
          {isWrite ? (
            <textarea
              className="quest-desc-textarea"
              rows={3}
              value={block.description || ''}
              placeholder="Quest briefing, story premise, or background lore..."
              onChange={(e) => onUpdate({ description: e.target.value })}
            />
          ) : (
            <div className="quest-desc-prose">
              <RichLoreText text={block.description} className="parchment-theme" />
            </div>
          )}
        </div>
      )}

      {/* Objectives Checklist */}
      <div className="quest-objectives-block">
        <div className="objectives-head-row">
          <span className="objectives-heading">
            <i className="fas fa-list-check"></i> Objectives &amp; Milestones:
          </span>
          {isWrite && (
            <button
              type="button"
              className="add-obj-inline-btn"
              onClick={handleAddObjective}
            >
              + Add Objective
            </button>
          )}
        </div>

        {objectives.length > 0 ? (
          <div className="quest-objectives-list">
            {objectives.map((obj, i) => {
              const isDone = typeof obj === 'object' ? !!obj.completed : false;
              const text = typeof obj === 'object' ? obj.text : obj;
              return (
                <div
                  key={i}
                  className={`quest-objective-item ${isDone ? 'is-complete' : ''}`}
                >
                  <span
                    className="obj-check-trigger"
                    onClick={() => toggleObjective(i)}
                    title="Toggle objective complete"
                  >
                    <i className={isDone ? "fas fa-circle-check" : "fa-regular fa-circle"}></i>
                  </span>

                  {isWrite ? (
                    <div className="obj-edit-row">
                      <input
                        type="text"
                        className="obj-edit-input"
                        value={text}
                        onChange={(e) => handleUpdateObjectiveText(i, e.target.value)}
                      />
                      <button
                        type="button"
                        className="remove-obj-btn"
                        onClick={() => handleRemoveObjective(i)}
                        title="Remove objective"
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <span className="obj-text" onClick={() => toggleObjective(i)}>
                      {text}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          !isWrite && (
            <p className="quest-no-objectives">No specific milestones documented for this quest.</p>
          )
        )}
      </div>

      {/* Rewards Strip */}
      {rewards && (
        <div className="quest-rewards-strip">
          <span className="rewards-lbl"><i className="fas fa-sack-dollar"></i> Rewards:</span>
          <div className="rewards-items-row">
            {rewards.experience && (
              <span className="quest-reward-chip xp-chip">
                <i className="fas fa-sparkles"></i> +{rewards.experience} XP
              </span>
            )}
            {rewards.currency && (
              <span className="quest-reward-chip gold-chip">
                <i className="fas fa-coins"></i>
                {rewards.currency.gold ? ` ${rewards.currency.gold}g` : ''}
                {rewards.currency.silver ? ` ${rewards.currency.silver}s` : ''}
              </span>
            )}
            {rewards.item && (
              <span className="quest-reward-chip item-chip">
                <i className="fas fa-gem"></i> {rewards.item}
              </span>
            )}
            {rewards.customReward && !rewards.experience && !rewards.currency && (
              <span className="quest-reward-chip custom-chip">
                <i className="fas fa-award"></i> {rewards.customReward}
              </span>
            )}
          </div>
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
  compact = false,
  onUpdate = () => {},
  onOpenStudio = () => {}
}) => {
  const itemData = normalizeBookItemData(block);

  return (
    <div className={`book-item-block-container ${compact || block.sizePreset === 'half' ? 'compact-item' : ''}`}>
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
 * Callout Block (5 Thematic Chronicle Callout Styles)
 */
export const BookCalloutBlock = ({
  block,
  isWrite = false,
  onUpdate = () => {},
  onOpenLorePicker = () => {}
}) => {
  const type = block.calloutType || 'info';

  const CALLOUT_ICONS = {
    info: 'fa-book-bookmark',
    secret: 'fa-eye-slash',
    warning: 'fa-triangle-exclamation',
    readaloud: 'fa-feather-pointed',
    divine: 'fa-sun'
  };

  const iconClass = CALLOUT_ICONS[type] || 'fa-bookmark';

  return (
    <div className={`book-callout-block callout-${type}`}>
      <div className="callout-header">
        <div className="callout-title-wrap">
          <div className="callout-icon-badge">
            <i className={`fas ${iconClass}`}></i>
          </div>
          {isWrite ? (
            <input
              type="text"
              className="callout-input-title"
              value={block.title || ''}
              placeholder="Callout Title (e.g. Arcane Rule, Lore Secret)..."
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
              <option value="divine">Sacred Decree</option>
            </select>
            <button
              type="button"
              className="callout-import-lore-btn"
              onClick={() => onOpenLorePicker(block)}
              title="Import Lore from World &amp; Campaign Dossiers"
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
            placeholder="Chronicle lore, DM notes, historical excerpt, read-aloud boxed text..."
            onChange={(e) => onUpdate({ text: e.target.value, content: e.target.value })}
          />
        ) : (
          <RichLoreText text={block.text || block.content || 'Chronicle notes.'} className="parchment-theme" />
        )}
      </div>
    </div>
  );
};

export const PIN_ICON_PRESETS = [
  { id: 'fa-location-dot', name: 'Waypoint' },
  { id: 'fa-fort-awesome', name: 'Keep / City' },
  { id: 'fa-skull', name: 'Lair / Danger' },
  { id: 'fa-campground', name: 'Camp / Outpost' },
  { id: 'fa-dungeon', name: 'Dungeon / Crypt' },
  { id: 'fa-mountain', name: 'Mountain' },
  { id: 'fa-water', name: 'Water / Port' },
  { id: 'fa-tree', name: 'Forest' },
  { id: 'fa-gem', name: 'Relic / Mine' },
  { id: 'fa-landmark', name: 'Shrine / Temple' },
  { id: 'fa-eye', name: 'Lookout' },
  { id: 'fa-crosshairs', name: 'Target' },
  { id: 'fa-shield-halved', name: 'Sanctuary' },
  { id: 'fa-fire', name: 'Beacon' },
  { id: 'fa-anchor', name: 'Harbor' },
  { id: 'fa-compass', name: 'Discovery' }
];

export const PIN_COLOR_PRESETS = [
  '#ffd700',
  '#ef4444',
  '#10b981',
  '#3b82f6',
  '#a855f7',
  '#f97316',
  '#f5f5f4'
];

/**
 * Map & Image Showcase Block
 * Rich interactive cartography & visual region showcase card with zoom/pan focal points,
 * map dragging, draggable pins with icon & color selection, trail & route drawing,
 * multi-layout orientation (stacked, left, right), image/map picking, and rich prose writing.
 */
export const MapEmbedBlock = ({
  block = {},
  isWrite = false,
  onUpdate = () => {},
  onOpenPicker = () => {},
  onOpenImagePicker = () => {},
  onNavigateMap
}) => {
  const title = block.title || 'Frostwood Reach & Surrounding Lands';
  const subtitle = block.subtitle || block.caption || '';
  const description = block.description || block.content || block.notes || '';
  const buttonText = block.buttonText || 'Open Map';
  const heightStyle = block.heightStyle || 'standard';
  const layoutStyle = block.layoutStyle || 'stacked'; // 'stacked' | 'side-left' | 'side-right'
  const imageUrl = block.imageUrl || block.thumbnailUrl || block.url || '/assets/images/backgrounds/nordhalla.jpeg';

  const defaultLocations = [
    { id: 'loc-all', name: 'Overview', focalPoint: { x: 50, y: 50 }, zoom: 1.0, description: 'Complete regional overview of the charted territory.' },
    { id: 'loc-skald', name: "Skald's Peaks", focalPoint: { x: 52, y: 38 }, zoom: 1.85, description: 'Jagged mountain range guarding the northern pass.' },
    { id: 'loc-midhofn', name: 'Midhöfn', focalPoint: { x: 38, y: 46 }, zoom: 2.1, description: 'Harbor citadel connecting the frozen waterways.' },
    { id: 'loc-taiga', name: 'Frostwood Taiga', focalPoint: { x: 74, y: 32 }, zoom: 1.75, description: 'Dense pine forest shrouded in arcane mist.' }
  ];

  const locations = Array.isArray(block.locations) && block.locations.length > 0
    ? block.locations
    : defaultLocations;

  const trails = Array.isArray(block.trails) ? block.trails : [
    {
      id: 'trail-1',
      name: "King's Pass Route",
      color: '#ffd700',
      strokeWidth: 3,
      dashed: true,
      points: [{ x: 38, y: 46 }, { x: 44, y: 42 }, { x: 52, y: 38 }, { x: 62, y: 35 }, { x: 74, y: 32 }]
    }
  ];

  const markers = Array.isArray(block.markers) ? block.markers : [
    { id: 'pin-1', x: 38, y: 46, icon: 'fa-fort-awesome', color: '#ffd700' },
    { id: 'pin-2', x: 52, y: 38, icon: 'fa-skull', color: '#ef4444' },
    { id: 'pin-3', x: 74, y: 32, icon: 'fa-campground', color: '#10b981' }
  ];

  const [activeLocId, setActiveLocId] = useState(block.activeLocationId || locations[0]?.id || 'loc-all');
  const [currentZoom, setCurrentZoom] = useState(block.zoom || 1.0);
  const [currentFocal, setCurrentFocal] = useState(block.focalPoint || { x: 50, y: 50 });
  const [drawMode, setDrawMode] = useState('idle'); // 'idle' | 'trail' | 'pin'
  const [draftTrailPoints, setDraftTrailPoints] = useState([]);
  const [hoveredPin, setHoveredPin] = useState(null);
  const [selectedPinId, setSelectedPinId] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState('fa-location-dot');
  const [selectedColor, setSelectedColor] = useState('#ffd700');

  // Dragging states
  const [isPanningMap, setIsPanningMap] = useState(false);
  const [panStart, setPanStart] = useState(null);
  const [draggingPinId, setDraggingPinId] = useState(null);
  const viewportRef = useRef(null);

  const activeLocation = locations.find((l) => l.id === activeLocId) || locations[0];

  const handleSelectLocation = (loc) => {
    setActiveLocId(loc.id);
    const focal = loc.focalPoint || { x: 50, y: 50 };
    const zoom = loc.zoom || 1.0;
    setCurrentFocal(focal);
    setCurrentZoom(zoom);
    onUpdate({ activeLocationId: loc.id, focalPoint: focal, zoom });
  };

  const handleAddLocationFromCurrentView = () => {
    const newLocId = `loc-${Date.now()}`;
    const newLocName = `Area ${locations.length + 1}`;
    const nextLocations = [
      ...locations,
      {
        id: newLocId,
        name: newLocName,
        focalPoint: { ...currentFocal },
        zoom: currentZoom,
        description: 'Featured point of interest.'
      }
    ];
    onUpdate({ locations: nextLocations, activeLocationId: newLocId });
    setActiveLocId(newLocId);
  };

  const handleRemoveLocation = (locId, e) => {
    if (e) e.stopPropagation();
    const nextLocations = locations.filter((l) => l.id !== locId);
    onUpdate({ locations: nextLocations });
    if (activeLocId === locId && nextLocations.length > 0) {
      handleSelectLocation(nextLocations[0]);
    }
  };

  const handleZoomChange = (delta) => {
    const nextZoom = Math.min(3.5, Math.max(1.0, parseFloat((currentZoom + delta).toFixed(2))));
    setCurrentZoom(nextZoom);
    onUpdate({ zoom: nextZoom });
  };

  const handleResetZoom = () => {
    setCurrentZoom(1.0);
    setCurrentFocal({ x: 50, y: 50 });
    onUpdate({ zoom: 1.0, focalPoint: { x: 50, y: 50 } });
  };

  // Convert screen mouse coordinates into exact map image percentage coordinates
  const getMapCoordsFromMouseEvent = (e) => {
    if (!viewportRef.current) return { x: 50, y: 50 };
    const rect = viewportRef.current.getBoundingClientRect();
    const screenX = ((e.clientX - rect.left) / rect.width) * 100;
    const screenY = ((e.clientY - rect.top) / rect.height) * 100;
    const translateX = (currentFocal.x - 50) * (currentZoom - 1);
    const translateY = (currentFocal.y - 50) * (currentZoom - 1);
    const mapX = 50 + translateX + (screenX - 50) / currentZoom;
    const mapY = 50 + translateY + (screenY - 50) / currentZoom;
    return {
      x: Math.min(99, Math.max(1, Math.round(mapX * 10) / 10)),
      y: Math.min(99, Math.max(1, Math.round(mapY * 10) / 10))
    };
  };

  // Map viewport mouse interactions (pan & trail point placement)
  const handleMouseDownViewport = (e) => {
    if (!viewportRef.current) return;
    const point = getMapCoordsFromMouseEvent(e);

    if (isWrite && drawMode === 'trail') {
      setDraftTrailPoints((prev) => [...prev, point]);
    } else if (isWrite && drawMode === 'pin') {
      const newPin = {
        id: `pin-${Date.now()}`,
        x: point.x,
        y: point.y,
        icon: selectedIcon,
        color: selectedColor
      };
      onUpdate({ markers: [...markers, newPin] });
      setSelectedPinId(newPin.id);
      setDrawMode('idle');
    } else {
      setSelectedPinId(null);
      setIsPanningMap(true);
      setPanStart({
        mouseX: e.clientX,
        mouseY: e.clientY,
        focalX: currentFocal.x,
        focalY: currentFocal.y
      });
    }
  };

  const handleMouseMoveViewport = (e) => {
    if (!viewportRef.current) return;

    if (draggingPinId && isWrite) {
      const point = getMapCoordsFromMouseEvent(e);
      const nextMarkers = markers.map((m) =>
        m.id === draggingPinId ? { ...m, x: point.x, y: point.y } : m
      );
      onUpdate({ markers: nextMarkers });
    } else if (isPanningMap && panStart) {
      const rect = viewportRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - panStart.mouseX) / rect.width) * (100 / currentZoom);
      const deltaY = ((e.clientY - panStart.mouseY) / rect.height) * (100 / currentZoom);
      const nextFocal = {
        x: Math.min(100, Math.max(0, Math.round((panStart.focalX - deltaX) * 10) / 10)),
        y: Math.min(100, Math.max(0, Math.round((panStart.focalY - deltaY) * 10) / 10))
      };
      setCurrentFocal(nextFocal);
    }
  };

  const handleMouseUpViewport = () => {
    if (draggingPinId) {
      setDraggingPinId(null);
    }
    if (isPanningMap) {
      setIsPanningMap(false);
      setPanStart(null);
      onUpdate({ focalPoint: currentFocal });
    }
  };

  const handleRemovePin = (pinId, e) => {
    if (e) e.stopPropagation();
    const nextMarkers = markers.filter((m) => m.id !== pinId);
    onUpdate({ markers: nextMarkers });
    if (hoveredPin?.id === pinId) setHoveredPin(null);
    if (selectedPinId === pinId) setSelectedPinId(null);
  };

  const handleUpdatePinIcon = (pinId, icon) => {
    setSelectedIcon(icon);
    const nextMarkers = markers.map((m) =>
      m.id === pinId ? { ...m, icon } : m
    );
    onUpdate({ markers: nextMarkers });
  };

  const handleUpdatePinColor = (pinId, color) => {
    setSelectedColor(color);
    const nextMarkers = markers.map((m) =>
      m.id === pinId ? { ...m, color } : m
    );
    onUpdate({ markers: nextMarkers });
  };

  const handleClearPins = () => {
    onUpdate({ markers: [] });
    setHoveredPin(null);
    setSelectedPinId(null);
  };

  const handleClearTrails = () => {
    onUpdate({ trails: [] });
    setDraftTrailPoints([]);
  };

  const handleUndoTrailPoint = () => {
    setDraftTrailPoints((prev) => prev.slice(0, -1));
  };

  const handleCancelTrail = () => {
    setDraftTrailPoints([]);
    setDrawMode('idle');
  };

  const handleFinishTrail = () => {
    if (draftTrailPoints.length >= 2) {
      const newTrail = {
        id: `trail-${Date.now()}`,
        name: `Route ${trails.length + 1}`,
        color: '#ffd700',
        strokeWidth: 3,
        dashed: true,
        points: draftTrailPoints
      };
      onUpdate({ trails: [...trails, newTrail] });
    }
    setDraftTrailPoints([]);
    setDrawMode('idle');
  };

  const handleOpenMap = (e) => {
    if (e) e.stopPropagation();
    const rawMapId = block.mapId || 'frostwood-reach';
    const mapTarget = !rawMapId || rawMapId === 'mythril'
      ? '/worldmap'
      : (/^\//.test(rawMapId) ? rawMapId : `/worldmap/${rawMapId}`);

    if (typeof onNavigateMap === 'function') {
      onNavigateMap(mapTarget, block);
      return;
    }
    if (typeof window !== 'undefined') {
      try {
        window.location.href = mapTarget;
      } catch (_) {}
    }
  };

  const handlePickAsset = () => {
    const callback = (imgData) => {
      const newUrl = imgData?.url || imgData?.imageUrl || imgData?.thumbnail;
      if (newUrl) {
        onUpdate({
          imageUrl: newUrl,
          url: newUrl,
          thumbnailUrl: newUrl,
          caption: imgData.caption || subtitle
        });
      }
    };

    if (typeof onOpenImagePicker === 'function') {
      onOpenImagePicker({ block, customCallback: callback });
    } else if (typeof onOpenPicker === 'function') {
      onOpenPicker({ block, customCallback: callback });
    }
  };

  const translateX = (currentFocal.x - 50) * (currentZoom - 1);
  const translateY = (currentFocal.y - 50) * (currentZoom - 1);
  const selectedPin = markers.find((m) => m.id === selectedPinId);

  // Render Map/Image Viewport Element
  const renderViewport = () => (
    <div
      ref={viewportRef}
      className={`map-viewport-container ${isPanningMap ? 'is-panning' : ''}`}
      onMouseDown={handleMouseDownViewport}
      onMouseMove={handleMouseMoveViewport}
      onMouseUp={handleMouseUpViewport}
      onMouseLeave={handleMouseUpViewport}
      style={{
        cursor: isWrite && drawMode !== 'idle'
          ? 'crosshair'
          : (isPanningMap ? 'grabbing' : 'grab')
      }}
    >
      <div
        className="map-transform-layer"
        style={{
          backgroundImage: `url(${imageUrl})`,
          transform: `scale(${currentZoom}) translate(${-translateX}%, ${-translateY}%)`
        }}
      >
        {/* SVG Overlay for Trails and Routes */}
        <svg className="map-svg-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
          {trails.map((trail) => {
            const pointsStr = (trail.points || []).map((p) => `${p.x},${p.y}`).join(' ');
            return (
              <polyline
                key={trail.id}
                points={pointsStr}
                fill="none"
                stroke={trail.color || '#ffd700'}
                strokeWidth={trail.strokeWidth ? trail.strokeWidth * 0.4 : 1.2}
                strokeDasharray={trail.dashed ? '1.5,1' : 'none'}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="map-svg-trail-line"
              />
            );
          })}

          {/* In-Progress Draft Trail */}
          {draftTrailPoints.length > 0 && (
            <polyline
              points={draftTrailPoints.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#ff4757"
              strokeWidth="1.5"
              strokeDasharray="2,1"
              className="map-svg-draft-line"
            />
          )}
        </svg>

        {/* POI Markers & Pins (Clean Icon-Only Aesthetic with Scale Compensation) */}
        {markers.map((marker) => {
          const isSelected = selectedPinId === marker.id;
          const pinScale = Math.max(0.45, Math.min(1.0, 1 / Math.sqrt(currentZoom || 1)));
          return (
            <div
              key={marker.id}
              className={`map-poi-pin ${isSelected ? 'selected' : ''} ${
                hoveredPin?.id === marker.id ? 'active' : ''
              } ${draggingPinId === marker.id ? 'is-dragging' : ''}`}
              style={{
                left: `${marker.x}%`,
                top: `${marker.y}%`,
                transform: `translate(-50%, -100%) scale(${pinScale * (isSelected ? 1.15 : 1.0)})`
              }}
              onMouseDown={(e) => {
                if (isWrite) {
                  e.stopPropagation();
                  setDraggingPinId(marker.id);
                  setSelectedPinId(marker.id);
                }
              }}
              onMouseEnter={() => setHoveredPin(marker)}
              onMouseLeave={() => {
                if (!draggingPinId) setHoveredPin(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (isWrite) {
                  setSelectedPinId(isSelected ? null : marker.id);
                }
              }}
            >
              <div className="poi-pin-head" style={{ backgroundColor: marker.color || '#ffd700' }}>
                <i className={`fas ${marker.icon || 'fa-location-dot'}`}></i>
                {isWrite && (
                  <button
                    type="button"
                    className="pin-remove-btn"
                    onClick={(e) => handleRemovePin(marker.id, e)}
                    title="Delete pin"
                    aria-label="Delete pin"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pin Icon & Color Selection Inspector Bar */}
      {isWrite && selectedPin && (
        <div className="pin-inspector-bar" onClick={(e) => e.stopPropagation()}>
          <div className="pin-inspector-section">
            <span className="inspector-label">Icon:</span>
            <div className="pin-icon-palette">
              {PIN_ICON_PRESETS.map((ico) => (
                <button
                  key={ico.id}
                  type="button"
                  className={`pin-ico-opt-btn ${selectedPin.icon === ico.id ? 'active' : ''}`}
                  onClick={() => handleUpdatePinIcon(selectedPin.id, ico.id)}
                  title={ico.name}
                >
                  <i className={`fas ${ico.id}`}></i>
                </button>
              ))}
            </div>
          </div>

          <div className="pin-inspector-section">
            <span className="inspector-label">Color:</span>
            <div className="pin-color-palette">
              {PIN_COLOR_PRESETS.map((col) => (
                <button
                  key={col}
                  type="button"
                  className={`pin-col-opt-btn ${selectedPin.color === col ? 'active' : ''}`}
                  style={{ backgroundColor: col }}
                  onClick={() => handleUpdatePinColor(selectedPin.id, col)}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            className="pin-inspector-close-btn"
            onClick={() => setSelectedPinId(null)}
            title="Done"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );

  // Render Writing / Lore / Showcase Information Area
  const renderWritingArea = () => (
    <div className="map-writing-section">
      {/* Title & Layout Controls */}
      <div className="map-title-row">
        <div className="map-title-wrap">
          {isWrite ? (
            <input
              type="text"
              className="map-input-title"
              value={title}
              placeholder="Showcase Title or Landmark Name..."
              onChange={(e) => onUpdate({ title: e.target.value })}
            />
          ) : (
            <h3 className="map-display-title">{title}</h3>
          )}
        </div>

        {isWrite && (
          <div className="map-layout-selector" title="Choose layout orientation">
            <button
              type="button"
              className={`layout-btn ${layoutStyle === 'stacked' ? 'active' : ''}`}
              onClick={() => onUpdate({ layoutStyle: 'stacked' })}
              title="Image on top, writing below"
            >
              <i className="fas fa-table-columns fa-rotate-270"></i> Below
            </button>
            <button
              type="button"
              className={`layout-btn ${layoutStyle === 'side-left' ? 'active' : ''}`}
              onClick={() => onUpdate({ layoutStyle: 'side-left' })}
              title="Image on left, writing on right"
            >
              <i className="fas fa-table-columns"></i> Left
            </button>
            <button
              type="button"
              className={`layout-btn ${layoutStyle === 'side-right' ? 'active' : ''}`}
              onClick={() => onUpdate({ layoutStyle: 'side-right' })}
              title="Writing on left, image on right"
            >
              <i className="fas fa-table-columns fa-flip-horizontal"></i> Right
            </button>
          </div>
        )}
      </div>

      {/* Subtitle / Notes Input */}
      {isWrite ? (
        <input
          type="text"
          className="map-input-subtitle"
          value={subtitle}
          placeholder="Subtitle, territorial claim, or directions..."
          onChange={(e) => onUpdate({ subtitle: e.target.value, caption: e.target.value })}
        />
      ) : subtitle ? (
        <div className="map-display-subtitle">{subtitle}</div>
      ) : null}

      {/* Rich Multi-line Writing Prose */}
      {isWrite ? (
        <textarea
          className="map-input-prose"
          value={description}
          placeholder="Add detailed lore writing, expedition notes, geographical descriptions, or directions..."
          rows={layoutStyle === 'stacked' ? 3 : 5}
          onChange={(e) => onUpdate({ description: e.target.value, content: e.target.value })}
        />
      ) : description ? (
        <div className="map-display-prose">
          {description.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      ) : null}

      {/* Active Location Info Highlight */}
      {!isWrite && activeLocation && activeLocation.id !== 'loc-all' && (
        <div className="map-active-loc-card">
          <div className="active-loc-head">
            <i className="fas fa-location-dot"></i>
            <strong>{activeLocation.name}</strong>
          </div>
          {activeLocation.description && (
            <p className="active-loc-desc">{activeLocation.description}</p>
          )}
        </div>
      )}

      {/* Location Showcase Switcher Bar & Explore Button */}
      <div className="map-location-chips-bar" onClick={(e) => e.stopPropagation()}>
        <span className="location-chips-label">
          <i className="fas fa-location-crosshairs"></i> Showcase:
        </span>
        <div className="location-chips-list">
          {locations.map((loc) => {
            const isActive = activeLocId === loc.id;
            return (
              <div key={loc.id} className="location-chip-wrap">
                <button
                  type="button"
                  className={`map-location-chip-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectLocation(loc)}
                  title={loc.description || `Focus on ${loc.name}`}
                >
                  <i className={`fas ${loc.id === 'loc-all' ? 'fa-map' : 'fa-location-dot'}`}></i>
                  <span>{loc.name}</span>
                </button>
                {isWrite && locations.length > 1 && loc.id !== 'loc-all' && (
                  <button
                    type="button"
                    className="remove-loc-chip-btn"
                    onClick={(e) => handleRemoveLocation(loc.id, e)}
                    title="Remove location"
                  >
                    &times;
                  </button>
                )}
              </div>
            );
          })}

          {isWrite && (
            <button
              type="button"
              className="add-location-chip-btn"
              onClick={handleAddLocationFromCurrentView}
              title="Save current map zoom &amp; position as a new showcase location"
            >
              + Add Current View
            </button>
          )}
        </div>

        <button
          type="button"
          className="map-explore-btn"
          onClick={handleOpenMap}
          title={`Open ${title} in World Map Canvas`}
        >
          <i className="fas fa-compass"></i> {buttonText}
        </button>
      </div>
    </div>
  );

  // Render Integrated Card Header with Tools & Zoom Controls
  const renderCardHeader = () => (
    <div className="map-card-header" onClick={(e) => e.stopPropagation()}>
      <div className="map-header-left">
        {isWrite ? (
          <div className="map-header-tools">
            <button
              type="button"
              className="map-header-chip-btn"
              onClick={handlePickAsset}
              title="Choose Map / Illustration Image"
              aria-label="Choose Map Image"
            >
              <i className="fas fa-image"></i>
            </button>

            <button
              type="button"
              className={`map-header-chip-btn ${drawMode === 'trail' ? 'active' : ''}`}
              onClick={() => {
                if (drawMode === 'trail') handleFinishTrail();
                else {
                  setDrawMode('trail');
                  setDraftTrailPoints([]);
                }
              }}
              title={drawMode === 'trail' ? 'Finish drawing trail' : 'Draw a trail route on map'}
              aria-label="Draw Trail"
            >
              <i className={`fas ${drawMode === 'trail' ? 'fa-check' : 'fa-route'}`}></i>
            </button>

            {drawMode === 'trail' && (
              <>
                {draftTrailPoints.length > 0 && (
                  <button
                    type="button"
                    className="map-header-chip-btn"
                    onClick={handleUndoTrailPoint}
                    title="Undo last point"
                    aria-label="Undo trail point"
                  >
                    <i className="fas fa-rotate-left"></i>
                  </button>
                )}
                <button
                  type="button"
                  className="map-header-chip-btn"
                  onClick={handleCancelTrail}
                  title="Cancel drawing trail"
                  aria-label="Cancel drawing trail"
                >
                  <i className="fas fa-xmark"></i>
                </button>
              </>
            )}

            {trails.length > 0 && drawMode === 'idle' && (
              <button
                type="button"
                className="map-header-chip-btn text-danger"
                onClick={handleClearTrails}
                title="Clear all drawn trails"
                aria-label="Clear trails"
              >
                <i className="fas fa-trash-can"></i>
              </button>
            )}

            <button
              type="button"
              className={`map-header-chip-btn ${drawMode === 'pin' ? 'active' : ''}`}
              onClick={() => setDrawMode(drawMode === 'pin' ? 'idle' : 'pin')}
              title="Click on map to place a location pin"
              aria-label="Place Pin"
            >
              <i className="fas fa-location-dot"></i>
            </button>

            {markers.length > 0 && drawMode === 'idle' && (
              <button
                type="button"
                className="map-header-chip-btn text-danger"
                onClick={handleClearPins}
                title="Clear all location pins"
                aria-label="Clear all pins"
              >
                <i className="fas fa-trash-can"></i>
              </button>
            )}
          </div>
        ) : (
          <div className="map-header-title-wrap">
            <i className="fas fa-map-location-dot header-icon"></i>
            <span className="map-header-title">Regional Cartography</span>
          </div>
        )}
      </div>

      <div className="map-header-right">
        <div className="map-zoom-btn-group">
          <button
            type="button"
            className="map-zoom-mini-btn"
            onClick={() => handleZoomChange(-0.3)}
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <i className="fas fa-minus"></i>
          </button>
          <span className="map-zoom-level-indicator">{Math.round(currentZoom * 100)}%</span>
          <button
            type="button"
            className="map-zoom-mini-btn"
            onClick={() => handleZoomChange(0.3)}
            title="Zoom In"
            aria-label="Zoom In"
          >
            <i className="fas fa-plus"></i>
          </button>
          <button
            type="button"
            className="map-zoom-mini-btn"
            onClick={handleResetZoom}
            title="Reset View"
            aria-label="Reset View"
          >
            <i className="fas fa-arrows-rotate"></i>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`book-map-embed-card layout-${layoutStyle} height-${heightStyle} ${
        isWrite ? 'is-write-mode' : 'is-read-mode'
      }`}
    >
      {renderCardHeader()}
      <div className="map-card-body-row">
        {layoutStyle === 'side-right' ? (
          <>
            {renderWritingArea()}
            {renderViewport()}
          </>
        ) : (
          <>
            {renderViewport()}
            {renderWritingArea()}
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Universal Side-by-Side Split Row Block
 * Places arbitrary blocks (Item, Creature, NPC, Quest, Lineage, Plot Arc, Image, Prose)
 * next to each other within any column or page spread!
 */
export const SideBySideBlock = ({
  block = {},
  isWrite = false,
  onUpdate = () => {},
  onOpenImagePicker = () => {},
  onOpenItemStudio = () => {},
  onOpenCreatureWizard = () => {},
  onOpenQuestPicker = () => {},
  onOpenLorePicker = () => {},
  onOpenMapPicker = () => {},
  onNavigateMap
}) => {
  const ratio = block.ratio || '50-50'; // '50-50' | '40-60' | '60-40' | '30-70' | '70-30'
  const left = block.left || { type: 'image', url: '/assets/images/races/merryn_illustration.png', caption: 'Merryn Wave-Rider' };
  const right = block.right || { type: 'paragraph', text: 'Across the misty frontiers, legends are written in iron and frost...' };

  const handleSwap = () => {
    onUpdate({ left: right, right: left });
  };

  const handleRatioChange = (newRatio) => {
    onUpdate({ ratio: newRatio });
  };

  const updateSide = (side, patch) => {
    if (side === 'left') {
      onUpdate({ left: { ...left, ...patch } });
    } else {
      onUpdate({ right: { ...right, ...patch } });
    }
  };

  const handleSlotTypeChange = (side, newType) => {
    const defaults = {
      paragraph: { type: 'paragraph', text: 'Add descriptive chronicle text...' },
      image: { type: 'image', url: '/assets/images/races/solari_illustration.png', caption: 'Illustration' },
      item_card: {
        type: 'item_card',
        name: 'Rime-Forged Dagger',
        quality: 'rare',
        itemType: 'Dagger',
        damage: '1d4+2 Piercing',
        durability: 'd8',
        properties: 'Finesse, Light, Frostbound'
      },
      creature_statblock: { type: 'creature_statblock', name: 'Frost Wyrd Stalker', dangerLevel: 'High', hp: 92, mana: 40, ap: 3 },
      npc_dossier: { type: 'npc_dossier', name: 'Gref the Memory-Merchant', role: 'Guide & Trader' },
      quest_hook: {
        type: 'quest_hook',
        id: 'quest-drunhold-key',
        title: 'The Lost Key of Drunhold',
        level: 3,
        difficulty: 'Medium',
        status: 'Active',
        giver: 'Elder Moira',
        description: 'Ancient wards seal the sunken crypts beneath Drunhold. Recover the ancestral runic key before the thaw breaks the seals.',
        objectives: [
          { id: 'obj-1', text: 'Seek out Gref near the crossroads to trade for rumors', completed: true },
          { id: 'obj-2', text: 'Descend into the Rime-Spire Catacombs beneath Drunhold', completed: false },
          { id: 'obj-3', text: 'Defeat the Frost Wyrd Stalker and claim the Drunhold Seal', completed: false }
        ],
        rewards: {
          experience: 450,
          currency: { gold: 25, silver: 50 },
          item: 'Frostward Key'
        }
      },
      lineage_showcase: { type: 'lineage_showcase', name: 'Solari', essence: 'The Cinder-Bound' },
      plot_thread: { type: 'plot_thread', title: 'The Shadow of Greymark', status: 'Active' },
      map_embed: {
        type: 'map_embed',
        title: 'Frostwood Reach & Surrounding Lands',
        mapId: 'frostwood-reach',
        badge: 'Regional Map',
        subtitle: "The Mist-Archivists' Forest",
        imageUrl: '/assets/images/backgrounds/Mythril.jpeg',
        buttonText: 'Open Map',
        heightStyle: 'compact'
      }
    };
    const target = defaults[newType] || { type: newType, text: '' };
    if (side === 'left') {
      onUpdate({ left: target });
    } else {
      onUpdate({ right: target });
    }
  };

  const isItemSlotType = (t) => {
    return [
      'item_card',
      'item',
      'weapon',
      'armor',
      'accessory',
      'consumable',
      'container',
      'relic',
      'miscellaneous',
      'currency'
    ].includes(String(t || '').toLowerCase());
  };

  const isCreatureSlotType = (t) => {
    return ['creature_statblock', 'creature', 'monster', 'npc'].includes(String(t || '').toLowerCase());
  };

  const getSelectSlotType = (slot) => {
    const t = slot?.type || 'paragraph';
    if (isItemSlotType(t)) return 'item_card';
    if (isCreatureSlotType(t)) return 'creature_statblock';
    if (t === 'image') return 'image';
    if (t === 'quest_hook' || t === 'quest') return 'quest_hook';
    if (t === 'lineage_showcase' || t === 'lineage') return 'lineage_showcase';
    if (t === 'plot_thread' || t === 'plot') return 'plot_thread';
    if (t === 'map_embed' || t === 'map') return 'map_embed';
    return 'paragraph';
  };

  const renderSlotContent = (slotData, side) => {
    const slotType = slotData.type || (typeof slotData === 'string' ? 'text' : 'paragraph');

    if (slotType === 'image') {
      return (
        <div className="side-slot-image-wrap">
          <div className="side-slot-image-container">
            <img src={slotData.url || '/assets/images/races/solari_illustration.png'} alt={slotData.caption || 'Illustration'} className="side-slot-img" />
            {isWrite && (
              <div className="side-slot-img-overlay">
                <button
                  type="button"
                  className="side-img-change-btn"
                  onClick={() => onOpenImagePicker(slotData, (newImg) => updateSide(side, newImg))}
                >
                  <i className="fas fa-image"></i> Change Art
                </button>
              </div>
            )}
          </div>
          {slotData.caption && <div className="side-slot-caption"><em>{slotData.caption}</em></div>}
        </div>
      );
    }

    if (isItemSlotType(slotType)) {
      const norm = normalizeBookItemData(slotData);
      return (
        <div className="side-slot-item-wrap">
          <ItemTooltip item={norm} />
          {isWrite && (
            <button
              type="button"
              className="side-item-change-btn"
              onClick={() => onOpenItemStudio(norm, (newItem) => updateSide(side, { ...newItem, type: 'item_card' }))}
            >
              <i className="fas fa-gem"></i> Change Item
            </button>
          )}
        </div>
      );
    }

    if (isCreatureSlotType(slotType)) {
      return (
        <div className="side-slot-creature-wrap">
          <CreatureStatblockBlock
            block={slotData}
            isWrite={false}
            compact={true}
            onUpdate={(patch) => updateSide(side, patch)}
            onOpenWizard={(b) => onOpenCreatureWizard(b, (newC) => updateSide(side, { ...newC, type: 'creature_statblock' }))}
          />
          {isWrite && (
            <button
              type="button"
              className="side-item-change-btn"
              onClick={() => onOpenCreatureWizard(slotData, (newC) => updateSide(side, { ...newC, type: 'creature_statblock' }))}
            >
              <i className="fas fa-dragon"></i> Edit Creature
            </button>
          )}
        </div>
      );
    }

    if (slotType === 'lineage_showcase') {
      return (
        <div className="side-slot-lineage-wrap">
          <LineageShowcaseBlock
            block={slotData}
            isWrite={false}
            onUpdate={(patch) => updateSide(side, patch)}
          />
        </div>
      );
    }

    if (slotType === 'plot_thread') {
      return (
        <div className="side-slot-plot-wrap">
          <PlotThreadBlock
            block={slotData}
            isWrite={false}
            onUpdate={(patch) => updateSide(side, patch)}
          />
        </div>
      );
    }

    if (slotType === 'quest_hook' || slotType === 'quest') {
      return (
        <div className="side-slot-quest-wrap">
          <QuestHookBlock
            block={slotData}
            isWrite={false}
            onUpdate={(patch) => updateSide(side, patch)}
            onOpenPicker={(q) => onOpenQuestPicker(q, (newQ) => updateSide(side, { ...newQ, type: 'quest_hook' }))}
          />
          {isWrite && (
            <button
              type="button"
              className="side-item-change-btn"
              onClick={() => onOpenQuestPicker(slotData, (newQ) => updateSide(side, { ...newQ, type: 'quest_hook' }))}
            >
              <i className="fas fa-scroll"></i> Change Quest
            </button>
          )}
        </div>
      );
    }

    if (slotType === 'map_embed' || slotType === 'map') {
      return (
        <div className="side-slot-map-wrap">
          <MapEmbedBlock
            block={slotData}
            isWrite={false}
            onUpdate={(patch) => updateSide(side, patch)}
            onOpenPicker={(m) => onOpenMapPicker(m, (newM) => updateSide(side, { ...newM, type: 'map_embed' }))}
            onNavigateMap={onNavigateMap}
          />
          {isWrite && (
            <button
              type="button"
              className="side-item-change-btn"
              onClick={() => onOpenMapPicker(slotData, (newM) => updateSide(side, { ...newM, type: 'map_embed' }))}
            >
              <i className="fas fa-map-location-dot"></i> Change Map
            </button>
          )}
        </div>
      );
    }

    // Default: Editable Rich Text / Paragraph
    const textContent = slotData.text !== undefined ? slotData.text : (typeof slotData === 'string' ? slotData : slotData.content || '');

    return (
      <div className="side-slot-text-pane">
        {slotData.title && (
          <h4 className="side-text-title">
            {isWrite ? (
              <input
                type="text"
                value={slotData.title}
                onChange={(e) => updateSide(side, { title: e.target.value })}
                className="side-text-title-input"
                placeholder="Section / Subsection Title..."
              />
            ) : (
              slotData.title
            )}
          </h4>
        )}
        {isWrite ? (
          <textarea
            className="side-text-textarea"
            value={textContent}
            onChange={(e) => updateSide(side, { text: e.target.value })}
            placeholder="Type companion prose, lore, tactical notes, or stats..."
            rows={5}
          />
        ) : (
          <div className="side-text-rendered">
            <RichLoreText text={textContent} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`book-side-by-side-block ratio-${ratio}`}>
      {isWrite && (
        <div className="side-by-side-toolbar" onClick={(e) => e.stopPropagation()}>
          <div className="ratio-selector-group">
            {['50-50', '40-60', '60-40', '30-70', '70-30'].map((r) => (
              <button
                key={r}
                type="button"
                className={`ratio-btn ${ratio === r ? 'active' : ''}`}
                onClick={() => handleRatioChange(r)}
                title={`Split Ratio: ${r.replace('-', ' / ')}`}
              >
                {r.replace('-', ':')}
              </button>
            ))}
          </div>

          <div className="side-slot-types-bar">
            <span className="slot-type-lbl">L:</span>
            <select
              value={getSelectSlotType(left)}
              onChange={(e) => handleSlotTypeChange('left', e.target.value)}
              className="slot-type-select"
            >
              <option value="paragraph">Prose Text</option>
              <option value="image">Illustration</option>
              <option value="item_card">Item Card</option>
              <option value="creature_statblock">Creature Statblock</option>
              <option value="quest_hook">Quest Hook</option>
              <option value="lineage_showcase">Lineage</option>
              <option value="plot_thread">Plot Arc</option>
              <option value="map_embed">Map Atlas</option>
            </select>

            <span className="slot-type-lbl">R:</span>
            <select
              value={getSelectSlotType(right)}
              onChange={(e) => handleSlotTypeChange('right', e.target.value)}
              className="slot-type-select"
            >
              <option value="paragraph">Prose Text</option>
              <option value="image">Illustration</option>
              <option value="item_card">Item Card</option>
              <option value="creature_statblock">Creature Statblock</option>
              <option value="quest_hook">Quest Hook</option>
              <option value="lineage_showcase">Lineage</option>
              <option value="plot_thread">Plot Arc</option>
              <option value="map_embed">Map Atlas</option>
            </select>

            <button
              type="button"
              className="swap-sides-btn"
              onClick={handleSwap}
              title="Swap Left and Right Slots"
            >
              <i className="fas fa-arrows-rotate"></i> Swap
            </button>
          </div>
        </div>
      )}

      <div className="side-by-side-columns">
        <div className="side-slot side-slot-left">
          {renderSlotContent(left, 'left')}
        </div>
        <div className="side-slot side-slot-right">
          {renderSlotContent(right, 'right')}
        </div>
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

/**
 * Hand-Drawn Stylus Illustration / Cartographic Sketch Block
 */
export const BookSketchBlock = ({
  block,
  isEditMode = false,
  onChange = () => {}
}) => {
  const [isAnnotating, setIsAnnotating] = useState(false);
  const strokes = block.strokes || [];
  const bgTheme = block.bgTheme || 'parchment';
  const title = block.title || 'Cartographic Sketch';
  const caption = block.caption || '';

  const handleCanvasChange = ({ strokes: newStrokes, bgTheme: newBgTheme }) => {
    onChange({
      ...block,
      strokes: newStrokes,
      bgTheme: newBgTheme || bgTheme
    });
  };

  return (
    <div className="book-sketch-block-wrapper">
      {isEditMode ? (
        <div className="book-sketch-edit-container">
          <div className="book-sketch-meta-inputs">
            <input
              type="text"
              className="book-sketch-title-input"
              value={title}
              onChange={(e) => onChange({ ...block, title: e.target.value })}
              placeholder="Illustration / Map Title..."
            />
            <input
              type="text"
              className="book-sketch-caption-input"
              value={caption}
              onChange={(e) => onChange({ ...block, caption: e.target.value })}
              placeholder="Optional caption or scholar notes..."
            />
          </div>
          <StylusDrawingCanvas
            initialStrokes={strokes}
            defaultBg={bgTheme}
            title={title}
            onChange={handleCanvasChange}
            aspectRatio="16/9"
            minHeight={220}
          />
        </div>
      ) : (
        <div className="book-sketch-view-container">
          <div className="book-sketch-view-header">
            {title && <h4 className="book-sketch-view-title">{title}</h4>}
            <button
              type="button"
              className={`book-sketch-annotate-toggle ${isAnnotating ? 'active' : ''}`}
              onClick={() => setIsAnnotating(!isAnnotating)}
              title={isAnnotating ? "Lock Inks" : "Enable Scribe Inking / Annotation"}
            >
              <i className={`fas ${isAnnotating ? 'fa-lock' : 'fa-pen-nib'}`}></i>
              <span>{isAnnotating ? 'Done Annotating' : 'Annotate / Doodle'}</span>
            </button>
          </div>
          <StylusDrawingCanvas
            initialStrokes={strokes}
            defaultBg={bgTheme}
            readOnly={!isAnnotating}
            title={title}
            onChange={handleCanvasChange}
            aspectRatio="16/9"
            minHeight={200}
          />
          {caption && <p className="book-sketch-view-caption">{caption}</p>}
        </div>
      )}
    </div>
  );
};

