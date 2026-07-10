import React, { useState, useMemo, useCallback } from 'react';
import MythrillWindow from '../windows/MythrillWindow';
import CreatureIconSelector from '../creature-wizard/components/common/CreatureIconSelector';
import useCreatureStore from '../../store/creatureStore';
import useCustomSummonStore from '../../store/customSummonStore';
import { resolveClassId } from '../../data/summonableTokens';
import { getCreatureTokenIconUrl } from '../../utils/assetManager';

const SUMMON_CATEGORIES = [
  { value: 'totem', label: 'Totem', desc: 'Stationary, radiates an aura effect' },
  { value: 'trap', label: 'Trap', desc: 'Stationary, triggers on proximity' },
  { value: 'companion', label: 'Companion', desc: 'Loyal ally bonded to you' },
  { value: 'beast', label: 'Beast', desc: 'Mobile creature that fights for you' },
  { value: 'fiend', label: 'Fiend', desc: 'Bound otherworldly creature' },
  { value: 'undead', label: 'Undead', desc: 'Risen servant bound to your will' },
  { value: 'elemental', label: 'Elemental', desc: 'Manifested force of nature' },
  { value: 'construct', label: 'Construct', desc: 'Built engine of war' },
];

const CONTROL_TYPES = [
  { value: 'autonomous', label: 'Autonomous', desc: 'Acts on its own each turn' },
  { value: 'mental', label: 'Mental Command', desc: 'You directly control it' },
  { value: 'verbal', label: 'Verbal Command', desc: 'Controlled by spoken command' },
  { value: 'empathic', label: 'Empathic Bond', desc: 'Linked emotionally, shared intent' },
];

const DURATION_UNITS = [
  { value: 'rounds', label: 'Rounds' },
  { value: 'minutes', label: 'Minutes' },
  { value: 'permanent', label: 'Permanent' },
];

const inputStyle = {
  background: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid #a08c70',
  borderRadius: '4px',
  padding: '4px 8px',
  fontSize: '13px',
  color: '#2a1a0a',
  fontFamily: "'Bookman Old Style', 'Garamond', serif",
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

const labelStyle = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#5a3a20',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '3px',
  display: 'block',
};

const sectionCardStyle = {
  background: 'rgba(240, 230, 210, 0.5)',
  border: '1px solid rgba(160, 140, 112, 0.4)',
  borderRadius: '6px',
  padding: '10px 12px',
};

const CraftCustomSummonModal = ({ isOpen, onClose, character, editTemplate, onCreated }) => {
  const creatures = useCreatureStore((s) => s.creatures);
  const createTemplate = useCustomSummonStore((s) => s.createTemplate);
  const updateTemplate = useCustomSummonStore((s) => s.updateTemplate);

  const isEditing = !!editTemplate;
  const [step, setStep] = useState(isEditing ? 2 : 1);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedCreature, setSelectedCreature] = useState(null);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const [config, setConfig] = useState(() => {
    if (editTemplate) {
      return {
        name: editTemplate.name || '',
        description: editTemplate.description || '',
        category: editTemplate.category || 'companion',
        level: editTemplate.level || 1,
        durationValue: editTemplate.duration?.unit === 'permanent' ? 0 : (editTemplate.duration?.value || 5),
        durationUnit: editTemplate.duration?.unit || 'rounds',
        controlType: editTemplate.controlType || 'autonomous',
        maxHp: editTemplate.creature?.stats?.maxHp || 10,
        speed: editTemplate.creature?.stats?.speed || 0,
        auraRadius: editTemplate.auraRadius || 0,
        quantity: editTemplate.quantity || 1,
        concentration: !!editTemplate.duration?.concentration,
        abilities: editTemplate.creature?.abilities || [],
        tokenIcon: editTemplate.creature?.tokenIcon || '',
      };
    }
    return {
      name: '',
      description: '',
      category: 'companion',
      level: 1,
      durationValue: 5,
      durationUnit: 'rounds',
      controlType: 'autonomous',
      maxHp: 10,
      speed: 30,
      auraRadius: 0,
      quantity: 1,
      concentration: false,
      abilities: [],
      tokenIcon: '',
    };
  });

  const classId = resolveClassId(character?.characterClass);

  const filteredCreatures = useMemo(() => {
    if (!creatures || creatures.length === 0) return [];
    let result = creatures;
    if (typeFilter !== 'all') {
      result = result.filter((c) => (c.type || '').toLowerCase() === typeFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          (c.name || '').toLowerCase().includes(q) ||
          (c.description || '').toLowerCase().includes(q)
      );
    }
    return result.slice(0, 60);
  }, [creatures, typeFilter, searchQuery]);

  const handleSelectCreature = useCallback(
    (creature) => {
      setSelectedCreature(creature);
      setConfig((prev) => ({
        ...prev,
        name: creature.name || prev.name,
        description: creature.description || prev.description,
        maxHp: creature.stats?.maxHp || prev.maxHp,
        speed: creature.stats?.speed || prev.speed,
        abilities: creature.abilities || [],
        tokenIcon: creature.tokenIcon || prev.tokenIcon,
      }));
      setStep(2);
    },
    []
  );

  const updateConfig = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = useCallback(() => {
    const isPermanent = config.durationUnit === 'permanent';
    const templateData = {
      classId,
      characterId: character?.id || character?.characterId,
      name: config.name || 'Custom Summon',
      description: config.description || 'A custom summoned entity.',
      level: config.level || 1,
      category: config.category,
      auraRadius: config.category === 'totem' ? config.auraRadius : undefined,
      creature: {
        name: config.name || 'Custom Summon',
        type: selectedCreature?.type || editTemplate?.creature?.type || 'BEAST',
        size: selectedCreature?.size || editTemplate?.creature?.size || 'MEDIUM',
        stats: {
          maxHp: parseInt(config.maxHp) || 10,
          maxMana: selectedCreature?.stats?.maxMana || editTemplate?.creature?.stats?.maxMana || 0,
          speed: parseInt(config.speed) || 0,
        },
        tokenIcon: config.tokenIcon || selectedCreature?.tokenIcon || editTemplate?.creature?.tokenIcon || '',
        abilities: config.abilities || [],
      },
      quantity: parseInt(config.quantity) || 1,
      duration: {
        value: isPermanent ? 0 : parseInt(config.durationValue) || 1,
        unit: config.durationUnit,
        concentration: config.concentration,
      },
      controlType: config.controlType,
      resourceCost: { actionPoints: 1 },
    };

    if (isEditing) {
      updateTemplate(editTemplate.id, templateData);
    } else {
      const created = createTemplate(templateData);
      if (onCreated) onCreated(created);
    }
    // Reset
    setStep(1);
    setSelectedCreature(null);
    setConfig({
      name: '', description: '', category: 'companion', level: 1,
      durationValue: 5, durationUnit: 'rounds', controlType: 'autonomous',
      maxHp: 10, speed: 30, auraRadius: 0, quantity: 1, concentration: false,
      abilities: [], tokenIcon: '',
    });
    onClose();
  }, [config, selectedCreature, editTemplate, isEditing, classId, character, createTemplate, updateTemplate, onCreated, onClose]);

  if (!isOpen) return null;

  const iconUrl = config.tokenIcon
    ? getCreatureTokenIconUrl(config.tokenIcon, selectedCreature?.type)
    : selectedCreature?.tokenIcon
      ? getCreatureTokenIconUrl(selectedCreature.tokenIcon, selectedCreature.type)
      : null;

  return (
    <>
      <MythrillWindow
        title="Craft Custom Summon"
        isOpen={true}
        onClose={onClose}
        defaultSize={{ width: 520, height: 640 }}
        defaultPosition={{ x: 120, y: 80 }}
        zIndex={21000}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            fontFamily: "'Bookman Old Style', 'Garamond', serif",
            color: '#2a1a0a',
          }}
        >
          {/* Step indicator */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              padding: '6px 10px',
              background: '#e6dcc6',
              borderBottom: '1px solid rgba(160, 140, 112, 0.5)',
            }}
          >
            {[
              { n: 1, label: 'Pick Creature' },
              { n: 2, label: 'Configure' },
              { n: 3, label: 'Review & Save' },
            ].map((s) => (
              <button
                key={s.n}
                onClick={() => setStep(s.n)}
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: step === s.n ? '700' : '500',
                  background: step === s.n ? '#7a3b2e' : 'rgba(240, 230, 210, 0.6)',
                  border: `1px solid ${step === s.n ? '#5e2e23' : 'rgba(160, 140, 112, 0.5)'}`,
                  borderRadius: '4px',
                  color: step === s.n ? '#f0e6d2' : '#3a3a3a',
                  cursor: 'pointer',
                  fontFamily: "'Bookman Old Style', serif",
                  transition: 'all 0.15s ease',
                }}
              >
                {s.n}. {s.label}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
            {/* STEP 1: Creature Picker */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={sectionCardStyle}>
                  <div style={{ fontSize: '13px', color: '#5a3a20', marginBottom: '4px' }}>
                    Choose a base creature from your library, or skip to configure from scratch.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <i
                      className="fas fa-search"
                      style={{
                        position: 'absolute',
                        left: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#a08c70',
                        fontSize: '11px',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Search creatures..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ ...inputStyle, paddingLeft: '26px' }}
                    />
                  </div>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    style={{ ...inputStyle, width: 'auto', minWidth: '100px' }}
                  >
                    <option value="all">All Types</option>
                    <option value="beast">Beast</option>
                    <option value="construct">Construct</option>
                    <option value="dragon">Dragon</option>
                    <option value="elemental">Elemental</option>
                    <option value="fey">Fey</option>
                    <option value="fiend">Fiend</option>
                    <option value="humanoid">Humanoid</option>
                    <option value="monstrosity">Monstrosity</option>
                    <option value="undead">Undead</option>
                  </select>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                  }}
                >
                  {filteredCreatures.map((c) => {
                    const cIcon = c.tokenIcon
                      ? getCreatureTokenIconUrl(c.tokenIcon, c.type)
                      : null;
                    return (
                      <div
                        key={c.id}
                        onClick={() => handleSelectCreature(c)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 8px',
                          background:
                            selectedCreature?.id === c.id
                              ? 'rgba(122, 59, 46, 0.15)'
                              : 'rgba(240, 230, 210, 0.5)',
                          border:
                            selectedCreature?.id === c.id
                              ? '2px solid #7a3b2e'
                              : '1px solid rgba(160, 140, 112, 0.3)',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          transition: 'all 0.12s ease',
                        }}
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            minWidth: '32px',
                            borderRadius: '50%',
                            border: '1px solid #8b7355',
                            backgroundImage: cIcon ? `url(${cIcon})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundColor: '#e6dcc6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: '#7a3b2e',
                          }}
                        >
                          {!cIcon && (c.name || '?').charAt(0)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '13px',
                              fontWeight: 'bold',
                              color: '#2a1a0a',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {c.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#5a3a20' }}>
                            {(c.type || 'unknown').toUpperCase()} | HP{' '}
                            {c.stats?.maxHp || '?'} | Spd{' '}
                            {c.stats?.speed || '?'}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredCreatures.length === 0 && (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: '#a08c70',
                        fontSize: '13px',
                      }}
                    >
                      No creatures found. You can skip to step 2 and configure from scratch.
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setStep(2)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: 'rgba(240, 230, 210, 0.6)',
                    border: '1px solid #a08c70',
                    borderRadius: '4px',
                    color: '#5a3a20',
                    cursor: 'pointer',
                    fontFamily: "'Bookman Old Style', serif",
                  }}
                >
                  Skip — Configure from Scratch &raquo;
                </button>
              </div>
            )}

            {/* STEP 2: Configure */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedCreature && (
                  <div
                    style={{
                      ...sectionCardStyle,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '11px', color: '#5a3a20' }}>
                      Based on: <b>{selectedCreature.name}</b>
                    </span>
                    <button
                      onClick={() => {
                        setSelectedCreature(null);
                        setStep(1);
                      }}
                      style={{
                        fontSize: '10px',
                        background: 'none',
                        border: 'none',
                        color: '#7a3b2e',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Change
                    </button>
                  </div>
                )}

                {/* Icon */}
                <div style={sectionCardStyle}>
                  <label style={labelStyle}>Token Icon</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '2px solid #8b7355',
                        backgroundImage: iconUrl ? `url(${iconUrl})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: '#e6dcc6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#7a3b2e',
                      }}
                    >
                      {!iconUrl && (config.name || '?').charAt(0)}
                    </div>
                    <button
                      onClick={() => setShowIconPicker(true)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '12px',
                        background: 'rgba(122, 59, 46, 0.1)',
                        border: '1px solid #7a3b2e',
                        borderRadius: '4px',
                        color: '#4a2010',
                        cursor: 'pointer',
                        fontFamily: "'Bookman Old Style', serif",
                      }}
                    >
                      <i className="fas fa-image" style={{ marginRight: '4px' }} />
                      Pick Icon
                    </button>
                  </div>
                </div>

                {/* Name + Description */}
                <div style={sectionCardStyle}>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={labelStyle}>Name</label>
                    <input
                      type="text"
                      value={config.name}
                      onChange={(e) => updateConfig('name', e.target.value)}
                      placeholder="Summon name..."
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Description</label>
                    <textarea
                      value={config.description}
                      onChange={(e) => updateConfig('description', e.target.value)}
                      placeholder="Flavor text / description..."
                      rows={2}
                      style={{
                        ...inputStyle,
                        resize: 'vertical',
                        minHeight: '36px',
                      }}
                    />
                  </div>
                </div>

                {/* Category + Control */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ ...sectionCardStyle, flex: 1 }}>
                    <label style={labelStyle}>Category</label>
                    <select
                      value={config.category}
                      onChange={(e) => updateConfig('category', e.target.value)}
                      style={inputStyle}
                    >
                      {SUMMON_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <div style={{ fontSize: '10px', color: '#5a3a20', marginTop: '2px' }}>
                      {SUMMON_CATEGORIES.find((c) => c.value === config.category)?.desc}
                    </div>
                  </div>
                  <div style={{ ...sectionCardStyle, flex: 1 }}>
                    <label style={labelStyle}>Control Type</label>
                    <select
                      value={config.controlType}
                      onChange={(e) => updateConfig('controlType', e.target.value)}
                      style={inputStyle}
                    >
                      {CONTROL_TYPES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Stats grid */}
                <div
                  style={{
                    ...sectionCardStyle,
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: '1 1 80px' }}>
                    <label style={labelStyle}>Max HP</label>
                    <input
                      type="number"
                      value={config.maxHp}
                      onChange={(e) => updateConfig('maxHp', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ flex: '1 1 80px' }}>
                    <label style={labelStyle}>Speed</label>
                    <input
                      type="number"
                      value={config.speed}
                      onChange={(e) => updateConfig('speed', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ flex: '1 1 80px' }}>
                    <label style={labelStyle}>Quantity</label>
                    <input
                      type="number"
                      value={config.quantity}
                      min="1"
                      onChange={(e) => updateConfig('quantity', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ flex: '1 1 80px' }}>
                    <label style={labelStyle}>Level Req</label>
                    <input
                      type="number"
                      value={config.level}
                      min="1"
                      onChange={(e) => updateConfig('level', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Duration */}
                <div style={sectionCardStyle}>
                  <label style={labelStyle}>Duration</label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {config.durationUnit !== 'permanent' && (
                      <input
                        type="number"
                        value={config.durationValue}
                        min="1"
                        onChange={(e) => updateConfig('durationValue', e.target.value)}
                        style={{ ...inputStyle, width: '70px' }}
                      />
                    )}
                    <select
                      value={config.durationUnit}
                      onChange={(e) => updateConfig('durationUnit', e.target.value)}
                      style={{ ...inputStyle, width: 'auto' }}
                    >
                      {DURATION_UNITS.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                    <label
                      style={{
                        fontSize: '12px',
                        color: '#5a3a20',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={config.concentration}
                        onChange={(e) => updateConfig('concentration', e.target.checked)}
                      />
                      Concentration
                    </label>
                  </div>
                </div>

                {/* Aura radius for totems */}
                {config.category === 'totem' && (
                  <div style={sectionCardStyle}>
                    <label style={labelStyle}>Aura Radius (ft)</label>
                    <input
                      type="number"
                      value={config.auraRadius}
                      min="0"
                      onChange={(e) => updateConfig('auraRadius', e.target.value)}
                      style={{ ...inputStyle, width: '100px' }}
                    />
                  </div>
                )}

                {/* Abilities */}
                <div style={sectionCardStyle}>
                  <label style={labelStyle}>Abilities</label>
                  {config.abilities.length === 0 && (
                    <div style={{ fontSize: '11px', color: '#a08c70', marginBottom: '4px' }}>
                      No abilities set. Add one below.
                    </div>
                  )}
                  {config.abilities.map((ability, idx) => {
                    const name = typeof ability === 'string' ? ability : ability.name;
                    const desc = typeof ability === 'string' ? '' : ability.description;
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '6px',
                          marginBottom: '4px',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                              const newAbilities = [...config.abilities];
                              if (typeof newAbilities[idx] === 'string') {
                                newAbilities[idx] = {
                                  name: e.target.value,
                                  description: desc,
                                };
                              } else {
                                newAbilities[idx] = {
                                  ...newAbilities[idx],
                                  name: e.target.value,
                                };
                              }
                              updateConfig('abilities', newAbilities);
                            }}
                            placeholder="Ability name..."
                            style={{ ...inputStyle, fontSize: '12px', marginBottom: '2px' }}
                          />
                          <input
                            type="text"
                            value={desc}
                            onChange={(e) => {
                              const newAbilities = [...config.abilities];
                              if (typeof newAbilities[idx] === 'string') {
                                newAbilities[idx] = {
                                  name: name,
                                  description: e.target.value,
                                };
                              } else {
                                newAbilities[idx] = {
                                  ...newAbilities[idx],
                                  description: e.target.value,
                                };
                              }
                              updateConfig('abilities', newAbilities);
                            }}
                            placeholder="Description..."
                            style={{ ...inputStyle, fontSize: '11px' }}
                          />
                        </div>
                        <button
                          onClick={() => {
                            updateConfig(
                              'abilities',
                              config.abilities.filter((_, i) => i !== idx)
                            );
                          }}
                          style={{
                            padding: '4px 6px',
                            background: 'rgba(178, 34, 34, 0.1)',
                            border: '1px solid #b22222',
                            borderRadius: '3px',
                            color: '#b22222',
                            cursor: 'pointer',
                            fontSize: '11px',
                          }}
                        >
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    );
                  })}
                  <button
                    onClick={() =>
                      updateConfig('abilities', [
                        ...config.abilities,
                        { name: '', description: '' },
                      ])
                    }
                    style={{
                      marginTop: '4px',
                      padding: '3px 8px',
                      fontSize: '11px',
                      background: 'rgba(122, 59, 46, 0.1)',
                      border: '1px solid #7a3b2e',
                      borderRadius: '3px',
                      color: '#4a2010',
                      cursor: 'pointer',
                      fontFamily: "'Bookman Old Style', serif",
                    }}
                  >
                    <i className="fas fa-plus" style={{ marginRight: '4px' }} />
                    Add Ability
                  </button>
                </div>

                <button
                  onClick={() => setStep(3)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: '#7a3b2e',
                    border: '1px solid #5e2e23',
                    borderRadius: '4px',
                    color: '#f0e6d2',
                    cursor: 'pointer',
                    fontFamily: "'Bookman Old Style', serif",
                  }}
                >
                  Review &raquo;
                </button>
              </div>
            )}

            {/* STEP 3: Review & Save */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ ...sectionCardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      border: '2px solid #8b7355',
                      backgroundImage: iconUrl ? `url(${iconUrl})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: '#e6dcc6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      fontWeight: 'bold',
                      color: '#7a3b2e',
                    }}
                  >
                    {!iconUrl && (config.name || '?').charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2a1a0a' }}>
                      {config.name || 'Unnamed Summon'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#5a3a20' }}>
                      {SUMMON_CATEGORIES.find((c) => c.value === config.category)?.label} |{' '}
                      {CONTROL_TYPES.find((c) => c.value === config.controlType)?.label}
                    </div>
                  </div>
                </div>

                <div style={sectionCardStyle}>
                  <div style={{ fontSize: '12px', color: '#5a3a20', lineHeight: '1.6' }}>
                    {config.description || 'No description.'}
                  </div>
                </div>

                <div style={{ ...sectionCardStyle, display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div><span style={{ color: '#a08c70', fontSize: '11px' }}>HP</span> <b>{config.maxHp}</b></div>
                  <div><span style={{ color: '#a08c70', fontSize: '11px' }}>Speed</span> <b>{config.speed}</b></div>
                  <div><span style={{ color: '#a08c70', fontSize: '11px' }}>Qty</span> <b>{config.quantity}</b></div>
                  <div>
                    <span style={{ color: '#a08c70', fontSize: '11px' }}>Duration</span>{' '}
                    <b>
                      {config.durationUnit === 'permanent'
                        ? 'Permanent'
                        : `${config.durationValue} ${config.durationUnit}`}
                    </b>
                  </div>
                  {config.category === 'totem' && (
                    <div><span style={{ color: '#a08c70', fontSize: '11px' }}>Aura</span> <b>{config.auraRadius} ft</b></div>
                  )}
                  {config.concentration && (
                    <div style={{ color: '#b22222', fontSize: '11px' }}><i className="fas fa-brain" /> Concentration</div>
                  )}
                </div>

                {config.abilities.length > 0 && (
                  <div style={sectionCardStyle}>
                    <div style={labelStyle}>Abilities</div>
                    {config.abilities.map((a, i) => {
                      const name = typeof a === 'string' ? a : a.name;
                      const desc = typeof a === 'string' ? '' : a.description;
                      return (
                        <div key={i} style={{ marginBottom: '4px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#2a1a0a' }}>{name}</div>
                          {desc && <div style={{ fontSize: '12px', color: '#3a2a1a' }}>{desc}</div>}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setStep(2)}
                    style={{
                      flex: 1, padding: '6px 12px', fontSize: '12px', fontWeight: '600',
                      background: 'rgba(240, 230, 210, 0.6)', border: '1px solid #a08c70',
                      borderRadius: '4px', color: '#5a3a20', cursor: 'pointer',
                      fontFamily: "'Bookman Old Style', serif",
                    }}
                  >
                    &laquo; Back
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      flex: 2, padding: '6px 12px', fontSize: '13px', fontWeight: '700',
                      background: 'linear-gradient(135deg, #4a7c3a, #3a6b2a)', border: '1px solid #2a5b1a',
                      borderRadius: '4px', color: '#f0e6d2', cursor: 'pointer',
                      fontFamily: "'Bookman Old Style', serif",
                    }}
                  >
                    <i className="fas fa-save" style={{ marginRight: '4px' }} />
                    Save Custom Summon
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              padding: '4px 10px',
              borderTop: '1px solid rgba(160, 140, 112, 0.5)',
              background: '#e6dcc6',
              fontSize: '11px',
              color: '#5a3a20',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>
              Class: <b>{character?.characterClass || 'Unknown'}</b>
            </span>
            <span>Custom summons persist per browser</span>
          </div>
        </div>
      </MythrillWindow>

      {showIconPicker && (
        <CreatureIconSelector
          isOpen={showIconPicker}
          onClose={() => setShowIconPicker(false)}
          currentIcon={config.tokenIcon}
          onSelect={(iconId) => {
            updateConfig('tokenIcon', iconId);
            setShowIconPicker(false);
          }}
        />
      )}
    </>
  );
};

export default CraftCustomSummonModal;
