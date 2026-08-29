import React, { useState, useEffect, useMemo, useRef } from 'react';
import useCustomLineageStore, { LINEAGE_TEMPLATE, PRESET_LINEAGES } from '../../store/customLineageStore';
import useWorldStore from '../../store/worldStore';
import { REGION_POLYGONS } from '../../data/regionPolygons';
import { SUBREGIONS } from '../../data/subregions';
import { getCustomMaps } from '../../data/subregionMaps';
import { showConfirm } from '../../utils/dialogService';
import './CustomLineageWizard.css';

const STEPS = [
  { id: 'identity', label: '1. Identity & Essence', icon: 'fa-id-card' },
  { id: 'lore', label: '2. Lore & Cosmology', icon: 'fa-book-atlas' },
  { id: 'stats', label: '3. Stats & Traits', icon: 'fa-chart-simple' },
  { id: 'abilities', label: '4. Passives & AP Actions', icon: 'fa-wand-magic-sparkles' },
  { id: 'tradeoffs', label: '5. Flaws & Subraces', icon: 'fa-scale-unbalanced' },
  { id: 'preview', label: '6. Review & Save', icon: 'fa-check-double' }
];

const ABILITY_KEYS = ['STR', 'AGI', 'CON', 'INT', 'SPI', 'CHA'];

const CustomLineageWizard = ({ isOpen, onClose, initialData = null }) => {
  const { isWizardOpen, wizardDraft, closeWizard, saveLineage, deleteLineage, setWizardDraft } = useCustomLineageStore();
  const { regions } = useWorldStore();
  
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [form, setForm] = useState(initialData || LINEAGE_TEMPLATE);
  const stepButtonRefs = useRef([]);

  useEffect(() => {
    if (stepButtonRefs.current[currentStepIdx]) {
      stepButtonRefs.current[currentStepIdx].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentStepIdx]);

  const activeOpen = isOpen !== undefined ? isOpen : isWizardOpen;

  // Dynamically load all canonical regions, canonical subregions, and custom worlds/maps
  const availableOrigins = useMemo(() => {
    // 1. Continents & Realms
    const canonicalRealms = Object.entries(REGION_POLYGONS || {}).map(([key, reg]) => ({
      id: key,
      name: reg.name || key
    }));

    // 2. Canonical Subregions
    const canonicalSubs = Object.entries(SUBREGIONS || {}).map(([key, sub]) => ({
      id: key,
      name: `${sub.name || key} (${sub.regionId || 'Subregion'})`
    }));

    // 3. User Custom Maps & Custom Worlds
    let customMapsList = [];
    try {
      const customMaps = getCustomMaps();
      customMapsList = Object.values(customMaps || {}).map((cm) => ({
        id: cm.id,
        name: cm.name || cm.id
      }));
    } catch (e) {}

    // 4. Custom WorldStore regions if any
    const storeRegions = (regions || []).filter((r) => !REGION_POLYGONS[r.id]).map((r) => ({
      id: r.id,
      name: r.name || r.id
    }));

    return {
      canonicalRealms,
      canonicalSubs,
      customMapsList,
      storeRegions
    };
  }, [regions]);

  useEffect(() => {
    if (wizardDraft) {
      setForm(wizardDraft);
    } else if (initialData) {
      setForm(initialData);
    } else {
      setForm(LINEAGE_TEMPLATE);
    }
  }, [wizardDraft, initialData]);

  if (!activeOpen) return null;

  const handleClose = () => {
    if (onClose) onClose();
    else closeWizard();
  };

  const updateField = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    setWizardDraft(updated);
  };

  const updateBaseTrait = (field, value) => {
    const updated = {
      ...form,
      baseTraits: { ...(form.baseTraits || {}), [field]: value }
    };
    setForm(updated);
    setWizardDraft(updated);
  };

  const updateAbilityMod = (key, val) => {
    const num = parseInt(val, 10) || 0;
    const updated = {
      ...form,
      abilityModifiers: { ...(form.abilityModifiers || {}), [key]: num }
    };
    setForm(updated);
    setWizardDraft(updated);
  };

  const handleLoadPreset = (presetId) => {
    const preset = PRESET_LINEAGES.find((p) => p.id === presetId);
    if (preset) {
      const copy = JSON.parse(JSON.stringify(preset));
      delete copy.isPreset;
      setForm(copy);
      setWizardDraft(copy);
    }
  };

  // Passive & Action management
  const addPassive = () => {
    const passives = [...(form.racialPassives || []), { id: `passive_${Date.now()}`, name: 'New Passive', description: '' }];
    updateField('racialPassives', passives);
  };

  const updatePassive = (idx, updates) => {
    const passives = [...(form.racialPassives || [])];
    passives[idx] = { ...passives[idx], ...updates };
    updateField('racialPassives', passives);
  };

  const removePassive = (idx) => {
    const passives = (form.racialPassives || []).filter((_, i) => i !== idx);
    updateField('racialPassives', passives);
  };

  const addAction = () => {
    const actions = [
      ...(form.racialAbilities || []),
      {
        id: `action_${Date.now()}`,
        name: 'New AP Action',
        actionPointCost: 2,
        cooldownType: 'encounter',
        damage: '1d6 Ember',
        range: '30ft',
        description: ''
      }
    ];
    updateField('racialAbilities', actions);
  };

  const updateAction = (idx, updates) => {
    const actions = [...(form.racialAbilities || [])];
    actions[idx] = { ...actions[idx], ...updates };
    updateField('racialAbilities', actions);
  };

  const removeAction = (idx) => {
    const actions = (form.racialAbilities || []).filter((_, i) => i !== idx);
    updateField('racialAbilities', actions);
  };

  const addSubrace = () => {
    const subraces = [...(form.subraces || []), { id: `sub_${Date.now()}`, name: 'New Subrace', description: '', abilityBonus: {} }];
    updateField('subraces', subraces);
  };

  const updateSubrace = (idx, updates) => {
    const subraces = [...(form.subraces || [])];
    subraces[idx] = { ...subraces[idx], ...updates };
    updateField('subraces', subraces);
  };

  const removeSubrace = (idx) => {
    const subraces = (form.subraces || []).filter((_, i) => i !== idx);
    updateField('subraces', subraces);
  };

  const handleSave = () => {
    if (!form.name || form.name.trim() === '') {
      alert('Please provide a name for your lineage.');
      setCurrentStepIdx(0);
      return;
    }
    saveLineage(form);
    handleClose();
  };

  return (
    <div className="lineage-wizard-overlay" onClick={handleClose}>
      <div className="lineage-wizard-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="lineage-wizard-header">
          <div className="lineage-wizard-title-group">
            <i className="fas fa-dna lineage-wizard-icon"></i>
            <div>
              <h3>Custom Lineage & Culture Builder</h3>
              <span className="lineage-wizard-subtitle">Forge a playable dark-fantasy species native to Mythrill</span>
            </div>
          </div>
          
          <div className="lineage-wizard-preset-selector">
            <span>Inspiration Presets:</span>
            {PRESET_LINEAGES.map((preset) => (
              <button 
                key={preset.id} 
                className="lineage-preset-btn"
                onClick={() => handleLoadPreset(preset.id)}
                title={`Load "${preset.name}" template`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          <button className="lineage-wizard-close-btn" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Step Navigation Bar */}
        <div className="lineage-wizard-steps">
          {STEPS.map((s, idx) => (
            <button
              key={s.id}
              ref={(el) => (stepButtonRefs.current[idx] = el)}
              className={`lineage-step-btn ${currentStepIdx === idx ? 'active' : ''} ${idx < currentStepIdx ? 'completed' : ''}`}
              onClick={() => setCurrentStepIdx(idx)}
            >
              <i className={`fas ${s.icon}`}></i>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Wizard Content Body */}
        <div className="lineage-wizard-body">
          {/* STEP 1: IDENTITY */}
          {currentStepIdx === 0 && (
            <div className="lineage-form-section">
              <h4>Identity & Visual Essence</h4>
              <p className="lineage-hint">Define the core identity, visual presentation, and evocative tagline of your lineage.</p>

              <div className="lineage-grid-2">
                <div className="lineage-field">
                  <label>Lineage / Species Name *</label>
                  <input
                    type="text"
                    value={form.name || ''}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="e.g. Pyre-Dwarf, Frost-Corvani, Groven-Kin"
                  />
                </div>
                <div className="lineage-field">
                  <label>Essence Title</label>
                  <input
                    type="text"
                    value={form.essence || ''}
                    onChange={(e) => updateField('essence', e.target.value)}
                    placeholder="e.g. The Magma-Forged, The Chill-Winged"
                  />
                </div>
              </div>

              <div className="lineage-field">
                <label>Card Flavor Tagline</label>
                <input
                  type="text"
                  value={form.cardFlavor || ''}
                  onChange={(e) => updateField('cardFlavor', e.target.value)}
                  placeholder="Short, punchy 1-sentence description for the Character Wizard card"
                />
              </div>

              <div className="lineage-field">
                <label>Visual Description</label>
                <textarea
                  rows={3}
                  value={form.visualDescription || ''}
                  onChange={(e) => updateField('visualDescription', e.target.value)}
                  placeholder="Physical appearance, skin, eyes, height, silhouettes, clothing traditions..."
                />
              </div>

              <div className="lineage-grid-2">
                <div className="lineage-field">
                  <label>Illustration Image URL (optional)</label>
                  <input
                    type="text"
                    value={form.illustration || ''}
                    onChange={(e) => updateField('illustration', e.target.value)}
                    placeholder="/assets/images/races/... or https://..."
                  />
                </div>
                <div className="lineage-field">
                  <label>Origin World, Region or Subregion</label>
                  <select
                    value={form.originRegionId || 'frostwood-reach'}
                    onChange={(e) => updateField('originRegionId', e.target.value)}
                  >
                    <optgroup label="Mythrill Continents & Realms">
                      {availableOrigins.canonicalRealms.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </optgroup>
                    {availableOrigins.customMapsList.length > 0 && (
                      <optgroup label="Custom Worlds & User Maps">
                        {availableOrigins.customMapsList.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </optgroup>
                    )}
                    {availableOrigins.storeRegions.length > 0 && (
                      <optgroup label="Living World Regions">
                        {availableOrigins.storeRegions.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </optgroup>
                    )}
                    <optgroup label="Canonical Subregions & Territories">
                      {availableOrigins.canonicalSubs.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="lineage-field">
                <label>Native Homeland / Settlement Note (Optional)</label>
                <input
                  type="text"
                  value={form.homeland || ''}
                  onChange={(e) => updateField('homeland', e.target.value)}
                  placeholder="e.g. Ironheart Vales, Ember-Keep, High Fjord of Skalvyr, or custom territory..."
                />
              </div>
            </div>
          )}

          {/* STEP 2: LORE & COSMOLOGY */}
          {currentStepIdx === 1 && (
            <div className="lineage-form-section">
              <h4>Folklore, Culture & The Sun's Death</h4>
              <p className="lineage-hint">How did this people respond when Sol was entombed and Keth-Amar circled the dying sky?</p>

              <div className="lineage-field">
                <label>Relation to Sol's Binding & The Cosmic Bargains</label>
                <textarea
                  rows={3}
                  value={form.relationToSunDeath || ''}
                  onChange={(e) => updateField('relationToSunDeath', e.target.value)}
                  placeholder="Did their ancestors capitulate to Keth-Amar, hide in fae fog like Viridane, or bind themselves to geothermal heat?"
                />
              </div>

              <div className="lineage-field">
                <label>Cultural Background & Traditions</label>
                <textarea
                  rows={4}
                  value={form.culturalBackground || ''}
                  onChange={(e) => updateField('culturalBackground', e.target.value)}
                  placeholder="Societal hierarchy, sacred rites, taboos, architectural style, burial customs..."
                />
              </div>

              <div className="lineage-field">
                <label>Full Narrative History</label>
                <textarea
                  rows={5}
                  value={form.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Comprehensive lore article describing their centuries on Mythrill..."
                />
              </div>
            </div>
          )}

          {/* STEP 3: STATS & TRAITS */}
          {currentStepIdx === 2 && (
            <div className="lineage-form-section">
              <h4>6-Ability Modifiers & Physical Traits</h4>
              <p className="lineage-hint">Mythrill uses STR, AGI, CON, INT, SPI, and CHA. Net balance is typically +2 to +3 with an appropriate tradeoff.</p>

              <div className="lineage-ability-grid">
                {ABILITY_KEYS.map((stat) => (
                  <div key={stat} className="lineage-ability-card">
                    <span className="ability-name">{stat}</span>
                    <input
                      type="number"
                      min="-2"
                      max="3"
                      value={form.abilityModifiers?.[stat] ?? 0}
                      onChange={(e) => updateAbilityMod(stat, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              {/* Vitals: HP, Mana, AP */}
              <div style={{ background: 'rgba(255, 255, 255, 0.75)', border: '1.5px solid rgba(139, 69, 19, 0.25)', borderRadius: '8px', padding: '12px 14px', marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#5d381c', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <i className="fas fa-heart-pulse" style={{ color: '#c0392b', marginRight: '6px' }}></i> Racial Base Vitals & Combat Budget
                </label>
                <div className="lineage-grid-3">
                  <div className="lineage-field" style={{ margin: 0 }}>
                    <label style={{ fontSize: '11px' }}>Base HP</label>
                    <input
                      type="number"
                      min="10"
                      max="60"
                      value={form.baseTraits?.baseHp ?? 25}
                      onChange={(e) => updateBaseTrait('baseHp', parseInt(e.target.value, 10) || 25)}
                    />
                  </div>
                  <div className="lineage-field" style={{ margin: 0 }}>
                    <label style={{ fontSize: '11px' }}>Base Mana</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={form.baseTraits?.baseMana ?? 15}
                      onChange={(e) => updateBaseTrait('baseMana', parseInt(e.target.value, 10) || 15)}
                    />
                  </div>
                  <div className="lineage-field" style={{ margin: 0 }}>
                    <label style={{ fontSize: '11px' }}>Action Points (AP)</label>
                    <input
                      type="number"
                      min="2"
                      max="4"
                      value={form.baseTraits?.baseAp ?? 3}
                      onChange={(e) => updateBaseTrait('baseAp', parseInt(e.target.value, 10) || 3)}
                    />
                  </div>
                </div>
              </div>

              <div className="lineage-grid-3">
                <div className="lineage-field">
                  <label>Size Category</label>
                  <select
                    value={form.baseTraits?.size || 'Medium'}
                    onChange={(e) => updateBaseTrait('size', e.target.value)}
                  >
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>
                <div className="lineage-field">
                  <label>Base Speed (ft)</label>
                  <input
                    type="number"
                    value={form.baseTraits?.baseSpeed ?? 30}
                    onChange={(e) => updateBaseTrait('baseSpeed', parseInt(e.target.value, 10) || 30)}
                  />
                </div>
                <div className="lineage-field">
                  <label>Lifespan</label>
                  <input
                    type="text"
                    value={form.baseTraits?.lifespan || '60-100 years'}
                    onChange={(e) => updateBaseTrait('lifespan', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PASSIVES & AP ACTIONS */}
          {currentStepIdx === 3 && (
            <div className="lineage-form-section">
              <h4>Racial Passives & Action Point (AP) Abilities</h4>
              <p className="lineage-hint">In Mythrill's Action Point combat system, racial active abilities typically cost 1–2 AP with encounter cooldowns.</p>

              <div className="lineage-sub-section">
                <div className="sub-section-header">
                  <h5>Passive Traits</h5>
                  <button className="lineage-add-btn" onClick={addPassive}><i className="fas fa-plus"></i> Add Passive</button>
                </div>
                {(form.racialPassives || []).map((p, idx) => (
                  <div key={p.id || idx} className="lineage-item-row">
                    <input
                      type="text"
                      className="lineage-item-name-input"
                      value={p.name}
                      onChange={(e) => updatePassive(idx, { name: e.target.value })}
                      placeholder="Passive Name"
                    />
                    <input
                      type="text"
                      className="lineage-item-desc-input"
                      value={p.description}
                      onChange={(e) => updatePassive(idx, { description: e.target.value })}
                      placeholder="Mechanical benefit / resistance / saving throw bonus..."
                    />
                    <button className="lineage-item-delete-btn" onClick={() => removePassive(idx)}><i className="fas fa-trash"></i></button>
                  </div>
                ))}
              </div>

              <div className="lineage-sub-section">
                <div className="sub-section-header">
                  <h5>Active AP Abilities</h5>
                  <button className="lineage-add-btn" onClick={addAction}><i className="fas fa-plus"></i> Add AP Action</button>
                </div>
                {(form.racialAbilities || []).map((a, idx) => (
                  <div key={a.id || idx} className="lineage-action-card">
                    <div className="action-card-top">
                      <input
                        type="text"
                        value={a.name}
                        onChange={(e) => updateAction(idx, { name: e.target.value })}
                        placeholder="Ability Name"
                      />
                      <div className="action-meta-inputs">
                        <label>AP:</label>
                        <input
                          type="number"
                          min="1"
                          max="4"
                          value={a.actionPointCost ?? 2}
                          onChange={(e) => updateAction(idx, { actionPointCost: parseInt(e.target.value, 10) || 1 })}
                        />
                        <label>Mana:</label>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={a.manaCost ?? 0}
                          onChange={(e) => updateAction(idx, { manaCost: parseInt(e.target.value, 10) || 0 })}
                        />
                        <label>School:</label>
                        <select
                          value={a.school || 'Physical'}
                          onChange={(e) => updateAction(idx, { school: e.target.value })}
                        >
                          <option value="Physical">Physical</option>
                          <option value="Rime">Rime (Cold)</option>
                          <option value="Ember">Ember (Fire)</option>
                          <option value="Void">Void (Dark)</option>
                          <option value="Radiant">Radiant (Holy)</option>
                          <option value="Arcane">Arcane (Force)</option>
                          <option value="Tempest">Tempest (Lightning)</option>
                          <option value="Venom">Venom (Poison)</option>
                        </select>
                        <label>Cooldown:</label>
                        <select
                          value={a.cooldownType || 'encounter'}
                          onChange={(e) => updateAction(idx, { cooldownType: e.target.value })}
                        >
                          <option value="encounter">1 / Encounter</option>
                          <option value="at_will">At-Will</option>
                          <option value="short_rest">1 / Short Rest</option>
                          <option value="long_rest">1 / Long Rest</option>
                          <option value="2_rounds">Cooldown: 2 Rounds</option>
                        </select>
                        <button className="lineage-item-delete-btn" onClick={() => removeAction(idx)}><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                    <div className="action-card-mid">
                      <input
                        type="text"
                        value={a.damage || ''}
                        onChange={(e) => updateAction(idx, { damage: e.target.value })}
                        placeholder="Damage / Formula (e.g. 1d8 Physical + 1d6 Rime)"
                      />
                      <input
                        type="text"
                        value={a.range || ''}
                        onChange={(e) => updateAction(idx, { range: e.target.value })}
                        placeholder="Range (e.g. Self, 30ft, 15ft Cone)"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={a.description || ''}
                      onChange={(e) => updateAction(idx, { description: e.target.value })}
                      placeholder="Combat effect, save type, and tactical application..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: FLAWS & SUBRACES */}
          {currentStepIdx === 4 && (
            <div className="lineage-form-section">
              <h4>Meaningful Tradeoffs & Regional Bloodlines</h4>
              <p className="lineage-hint">Every sapient in Mythrill carries a vulnerability or consequence born from the Sun's death.</p>

              <div className="lineage-field">
                <label>Meaningful Tradeoff / Flaw *</label>
                <textarea
                  rows={3}
                  value={form.meaningfulTradeoffs || ''}
                  onChange={(e) => updateField('meaningfulTradeoffs', e.target.value)}
                  placeholder="e.g. Vulnerability (+25%) to Rime damage; cannot recover mana in extreme sunlight..."
                />
              </div>

              <div className="lineage-sub-section">
                <div className="sub-section-header">
                  <h5>Regional Subraces / Bloodlines</h5>
                  <button className="lineage-add-btn" onClick={addSubrace}><i className="fas fa-plus"></i> Add Subrace</button>
                </div>
                {(form.subraces || []).map((sub, idx) => (
                  <div key={sub.id || idx} className="lineage-item-row">
                    <input
                      type="text"
                      className="lineage-item-name-input"
                      value={sub.name}
                      onChange={(e) => updateSubrace(idx, { name: e.target.value })}
                      placeholder="Subrace Name"
                    />
                    <input
                      type="text"
                      className="lineage-item-desc-input"
                      value={sub.description}
                      onChange={(e) => updateSubrace(idx, { description: e.target.value })}
                      placeholder="Description & specialization perks..."
                    />
                    <button className="lineage-item-delete-btn" onClick={() => removeSubrace(idx)}><i className="fas fa-trash"></i></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: PREVIEW & REVIEW */}
          {currentStepIdx === 5 && (
            <div className="lineage-form-section">
              <h4>Character Wizard Live Card Preview</h4>
              <p className="lineage-hint">This is how your lineage will look in Step 02 of the Character Creation Wizard.</p>

              <div className="lineage-preview-card">
                <div className="preview-card-header">
                  <div className="preview-title-block">
                    <h3>{form.name || 'Untitled Lineage'}</h3>
                    <span className="preview-essence">{form.essence || 'The Unbound'}</span>
                  </div>
                  <span className="preview-custom-badge"><i className="fas fa-sparkles"></i> Custom Lineage</span>
                </div>

                <div className="preview-card-content">
                  <p className="preview-card-flavor">{form.cardFlavor || 'A custom playable lineage forged for Mythrill VTT.'}</p>

                  {/* Vitals Chips */}
                  <div className="preview-vitals-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                    <span className="stat-chip" style={{ background: 'rgba(192, 57, 43, 0.15)', border: '1px solid #c0392b', color: '#922b21' }}>
                      <i className="fas fa-heart" style={{ marginRight: '4px' }}></i> {form.baseTraits?.baseHp || 25} HP
                    </span>
                    <span className="stat-chip" style={{ background: 'rgba(41, 128, 185, 0.15)', border: '1px solid #2980b9', color: '#1f618d' }}>
                      <i className="fas fa-droplet" style={{ marginRight: '4px' }}></i> {form.baseTraits?.baseMana || 15} MANA
                    </span>
                    <span className="stat-chip" style={{ background: 'rgba(212, 175, 55, 0.2)', border: '1px solid #b8860b', color: '#7d5a08' }}>
                      <i className="fas fa-bolt" style={{ marginRight: '4px' }}></i> {form.baseTraits?.baseAp || 3} AP
                    </span>
                    <span className="stat-chip neutral">Speed {form.baseTraits?.baseSpeed || 30}ft</span>
                    <span className="stat-chip neutral">{form.baseTraits?.size || 'Medium'}</span>
                  </div>

                  {/* Ability Modifiers */}
                  <div className="preview-stat-chips">
                    {ABILITY_KEYS.map((k) => {
                      const mod = form.abilityModifiers?.[k] || 0;
                      if (mod === 0) return null;
                      return (
                        <span key={k} className={`stat-chip ${mod > 0 ? 'pos' : 'neg'}`}>
                          {k} {mod > 0 ? `+${mod}` : mod}
                        </span>
                      );
                    })}
                  </div>

                  <div className="preview-abilities">
                    <h5>Racial Abilities:</h5>
                    {(form.racialPassives || []).map((p, i) => (
                      <div key={i} className="preview-ability-item">
                        <strong>{p.name}:</strong> <span>{p.description}</span>
                      </div>
                    ))}
                    {(form.racialAbilities || []).map((a, i) => (
                      <div key={i} className="preview-ability-item active-ability">
                        <strong>{a.name} ({a.actionPointCost || 2} AP{a.manaCost ? `, ${a.manaCost} Mana` : ''}{a.school ? ` • ${a.school}` : ''}{a.cooldownType ? ` • ${a.cooldownType.replace('_', ' ')}` : ''}):</strong> <span>{a.description}</span>
                      </div>
                    ))}
                  </div>

                  {form.meaningfulTradeoffs && (
                    <div className="preview-tradeoff">
                      <i className="fas fa-triangle-exclamation"></i>
                      <span><strong>Tradeoff:</strong> {form.meaningfulTradeoffs}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="lineage-wizard-footer">
          <button
            className="lineage-footer-btn back"
            disabled={currentStepIdx === 0}
            onClick={() => setCurrentStepIdx((i) => Math.max(0, i - 1))}
          >
            ← Previous
          </button>

          <div className="lineage-footer-right" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {form?.id && form?.isCustom && (
              <button
                type="button"
                className="lineage-footer-btn delete"
                style={{ background: 'rgba(231, 76, 60, 0.12)', border: '1px solid rgba(231, 76, 60, 0.4)', color: '#c0392b', marginRight: 'auto' }}
                onClick={async () => {
                  const confirmed = await showConfirm({
                    title: 'Delete Custom Lineage',
                    message: `Are you sure you want to delete "${form.name}"?`,
                    subMessage: 'This custom species will be removed from your world and character creator.',
                    confirmText: 'Delete Lineage',
                    cancelText: 'Cancel',
                    isDestructive: true
                  });
                  if (confirmed) {
                    deleteLineage(form.id);
                    closeWizard();
                  }
                }}
                title="Delete this custom lineage"
              >
                <i className="fas fa-trash-alt"></i> Delete Lineage
              </button>
            )}
            {currentStepIdx < STEPS.length - 1 ? (
              <button
                className="lineage-footer-btn next"
                onClick={() => setCurrentStepIdx((i) => Math.min(STEPS.length - 1, i + 1))}
              >
                Next Step →
              </button>
            ) : (
              <button className="lineage-footer-btn save" onClick={handleSave}>
                <i className="fas fa-check"></i> Save & Enable Lineage
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomLineageWizard;
