import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useEffectPresetStore from '../../store/effectPresetStore';
import useBuffStore from '../../store/buffStore';
import useDebuffStore from '../../store/debuffStore';
import useCreatureStore from '../../store/creatureStore';
import { 
    PRIMARY_STAT_MODIFIERS, 
    SECONDARY_STAT_MODIFIERS, 
    COMBAT_STAT_MODIFIERS,
    UTILITY_STAT_MODIFIERS,
    RESISTANCE_MODIFIERS,
    DAMAGE_TYPE_MODIFIERS
} from '../spellcrafting-wizard/core/data/statModifier';
import './BuffDebuffCreatorModal.css';

// Available damage/element types
const ELEMENT_TYPES = [
    { id: 'physical', name: 'Physical', icon: 'fas fa-fist-raised', color: '#8B4513' },
    { id: 'fire', name: 'Fire', icon: 'fas fa-fire', color: '#FF4500' },
    { id: 'cold', name: 'Cold', icon: 'fas fa-snowflake', color: '#00BFFF' },
    { id: 'lightning', name: 'Lightning', icon: 'fas fa-bolt', color: '#FFD700' },
    { id: 'poison', name: 'Poison', icon: 'fas fa-skull-crossbones', color: '#228B22' },
    { id: 'acid', name: 'Acid', icon: 'fas fa-flask', color: '#9ACD32' },
    { id: 'necrotic', name: 'Necrotic', icon: 'fas fa-skull', color: '#4B0082' },
    { id: 'radiant', name: 'Radiant', icon: 'fas fa-sun', color: '#FFD700' },
    { id: 'psychic', name: 'Psychic', icon: 'fas fa-brain', color: '#9370DB' },
    { id: 'healing', name: 'Healing', icon: 'fas fa-heart', color: '#32CD32' },
    { id: 'arcane', name: 'Arcane', icon: 'fas fa-magic', color: '#4169E1' }
];

// Available icons for effects
const EFFECT_ICONS = [
    { id: 'fas fa-fire', name: 'Fire' },
    { id: 'fas fa-tint', name: 'Blood' },
    { id: 'fas fa-skull-crossbones', name: 'Poison' },
    { id: 'fas fa-snowflake', name: 'Frost' },
    { id: 'fas fa-bolt', name: 'Lightning' },
    { id: 'fas fa-heart', name: 'Heart' },
    { id: 'fas fa-leaf', name: 'Nature' },
    { id: 'fas fa-shield-alt', name: 'Shield' },
    { id: 'fas fa-fist-raised', name: 'Strength' },
    { id: 'fas fa-wind', name: 'Speed' },
    { id: 'fas fa-eye', name: 'Vision' },
    { id: 'fas fa-brain', name: 'Mind' },
    { id: 'fas fa-magic', name: 'Magic' },
    { id: 'fas fa-star', name: 'Star' },
    { id: 'fas fa-sun', name: 'Sun' },
    { id: 'fas fa-moon', name: 'Moon' },
    { id: 'fas fa-dizzy', name: 'Dizzy' },
    { id: 'fas fa-tired', name: 'Tired' },
    { id: 'fas fa-skull', name: 'Skull' },
    { id: 'fas fa-ghost', name: 'Fear' }
];

// Preset categories
const PRESET_CATEGORIES = [
    { id: 'all', name: 'All Presets' },
    { id: 'dot', name: 'Damage Over Time' },
    { id: 'hot', name: 'Healing Over Time' },
    { id: 'stat_buff', name: 'Stat Buffs' },
    { id: 'stat_debuff', name: 'Stat Debuffs' },
    { id: 'resource', name: 'Resource Effects' },
    { id: 'custom', name: 'Custom' }
];

// All available stats for modification (deduplicated)
const ALL_STATS = (() => {
    const seenIds = new Set();
    const stats = [];
    
    const addStats = (arr, category) => {
        arr.forEach(s => {
            if (!seenIds.has(s.id)) {
                seenIds.add(s.id);
                stats.push({ ...s, category });
            }
        });
    };
    
    addStats(PRIMARY_STAT_MODIFIERS, 'Primary');
    addStats(SECONDARY_STAT_MODIFIERS, 'Secondary');
    addStats(COMBAT_STAT_MODIFIERS, 'Combat');
    addStats(DAMAGE_TYPE_MODIFIERS, 'Spell Power');
    addStats(UTILITY_STAT_MODIFIERS, 'Utility');
    addStats(RESISTANCE_MODIFIERS, 'Resistance');
    
    return stats;
})();

const BuffDebuffCreatorModal = ({ 
    isOpen, 
    onClose, 
    tokenId, 
    creature,
    initialType = null // 'buff' or 'debuff' to start with that tab
}) => {
    const modalRef = useRef(null);
    const { addBuff } = useBuffStore();
    const { addDebuff } = useDebuffStore();
    const { tokens } = useCreatureStore();
    const { presets, addPreset, removePreset, initializeBuiltInPresets } = useEffectPresetStore();

    // View state
    const [activeTab, setActiveTab] = useState('create'); // 'create' or 'presets'
    const [presetCategory, setPresetCategory] = useState('all');
    const [presetSearchTerm, setPresetSearchTerm] = useState('');

    // Effect configuration state
    const [effectType, setEffectType] = useState(initialType || 'buff');
    const [effectName, setEffectName] = useState('');
    const [effectDescription, setEffectDescription] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('fas fa-magic');
    const [effectColor, setEffectColor] = useState('#32CD32');
    const [showIconPicker, setShowIconPicker] = useState(false);

    // Duration configuration
    const [durationType, setDurationType] = useState('rounds');
    const [durationValue, setDurationValue] = useState(3);

    // Over-time effect configuration
    const [hasOverTimeEffect, setHasOverTimeEffect] = useState(false);
    const [overTimeType, setOverTimeType] = useState('damage');
    const [overTimeFormula, setOverTimeFormula] = useState('1d4');
    const [overTimeElement, setOverTimeElement] = useState('physical');
    const [tickFrequency, setTickFrequency] = useState('realtime');
    const [tickFrequencyValue, setTickFrequencyValue] = useState(1);
    const [tickFrequencyUnit, setTickFrequencyUnit] = useState('rounds');

    // Stat modifiers
    const [statModifiers, setStatModifiers] = useState([]);
    const [showStatPicker, setShowStatPicker] = useState(false);
    const [selectedStatCategory, setSelectedStatCategory] = useState('Primary');

    // Resource modifiers
    const [resourceModifiers, setResourceModifiers] = useState([]);


    // Initialize built-in presets on mount
    useEffect(() => {
        initializeBuiltInPresets();
    }, [initializeBuiltInPresets]);

    // Update color when effect type changes
    useEffect(() => {
        if (effectType === 'buff') {
            setEffectColor('#32CD32');
        } else {
            setEffectColor('#DC143C');
        }
    }, [effectType]);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialType) {
                setEffectType(initialType);
            }
        }
    }, [isOpen, initialType]);

    if (!isOpen) return null;

    const token = tokens.find(t => t.id === tokenId);
    if (!token) return null;

    // Filter presets based on category and search
    const filteredPresets = presets.filter(preset => {
        const matchesCategory = presetCategory === 'all' || preset.category === presetCategory;
        const matchesSearch = presetSearchTerm === '' || 
            preset.name.toLowerCase().includes(presetSearchTerm.toLowerCase()) ||
            preset.description.toLowerCase().includes(presetSearchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Apply a preset to the form
    const applyPresetToForm = (preset) => {
        setEffectType(preset.effectType);
        setEffectName(preset.name);
        setEffectDescription(preset.description);
        setSelectedIcon(preset.icon);
        setEffectColor(preset.color);
        setDurationType(preset.durationType);
        setDurationValue(preset.durationValue);
        setHasOverTimeEffect(preset.hasOverTimeEffect);
        setOverTimeType(preset.overTimeType || 'damage');
        setOverTimeFormula(preset.overTimeFormula || '1d4');
        setOverTimeElement(preset.overTimeElement || 'physical');
        setTickFrequency(preset.tickFrequency || 'realtime');
        setTickFrequencyValue(preset.tickFrequencyValue || 1);
        setTickFrequencyUnit(preset.tickFrequencyUnit || 'rounds');
        setStatModifiers(preset.statModifiers || []);
        setResourceModifiers(preset.resourceModifiers || []);
        setActiveTab('create');
    };

    // Quick apply preset directly to target
    const quickApplyPreset = (preset) => {
        applyEffect({
            name: preset.name,
            description: preset.description,
            effectType: preset.effectType,
            icon: preset.icon,
            color: preset.color,
            durationType: preset.durationType,
            durationValue: preset.durationValue,
            hasOverTimeEffect: preset.hasOverTimeEffect,
            overTimeType: preset.overTimeType,
            overTimeFormula: preset.overTimeFormula,
            overTimeElement: preset.overTimeElement,
            tickFrequency: preset.tickFrequency,
            tickFrequencyValue: preset.tickFrequencyValue || 1,
            tickFrequencyUnit: preset.tickFrequencyUnit || 'rounds',
            statModifiers: preset.statModifiers,
            resourceModifiers: preset.resourceModifiers
        });
    };

    // Apply the configured effect
    const applyEffect = (config = null) => {
        const effectConfig = config || {
            name: effectName || (effectType === 'buff' ? 'Custom Buff' : 'Custom Debuff'),
            description: effectDescription,
            effectType,
            icon: selectedIcon,
            color: effectColor,
            durationType,
            durationValue,
            hasOverTimeEffect,
            overTimeType,
            overTimeFormula,
            overTimeElement,
            tickFrequency,
            tickFrequencyValue,
            tickFrequencyUnit,
            statModifiers,
            resourceModifiers
        };

        // Calculate duration in seconds
        let durationInSeconds;
        switch (effectConfig.durationType) {
            case 'rounds':
                durationInSeconds = effectConfig.durationValue * 6;
                break;
            case 'minutes':
                durationInSeconds = effectConfig.durationValue * 60;
                break;
            case 'hours':
                durationInSeconds = effectConfig.durationValue * 3600;
                break;
            default:
                durationInSeconds = effectConfig.durationValue * 6;
        }

        // Build effects object for stat modifiers
        const effects = {};
        effectConfig.statModifiers.forEach(mod => {
            effects[mod.stat] = mod.value;
        });

        // Build structured effect summary (separate from user description)
        const effectSummaryParts = [];
        
        if (effectConfig.hasOverTimeEffect) {
            const otTypeLabel = effectConfig.overTimeType === 'healing' ? 'Heals' : 
                               effectConfig.overTimeType === 'mana_regen' ? 'Restores mana' :
                               effectConfig.overTimeType === 'mana_drain' ? 'Drains mana' : 'Deals';
            const elementLabel = effectConfig.overTimeType === 'damage' ? ` ${effectConfig.overTimeElement}` : '';
            const effectLabel = effectConfig.overTimeType === 'damage' ? ' damage' : 
                               effectConfig.overTimeType === 'healing' ? '' : '';
            const tickLabel = effectConfig.tickFrequencyValue > 1 
                ? `every ${effectConfig.tickFrequencyValue} ${effectConfig.tickFrequencyUnit}`
                : `every ${effectConfig.tickFrequencyUnit.replace(/s$/, '')}`;
            
            effectSummaryParts.push(`${otTypeLabel} ${effectConfig.overTimeFormula}${elementLabel}${effectLabel} ${tickLabel}`);
        }
        
        if (effectConfig.statModifiers && effectConfig.statModifiers.length > 0) {
            effectConfig.statModifiers.forEach(m => {
                effectSummaryParts.push(`${m.value > 0 ? '+' : ''}${m.value} ${m.name}`);
            });
        }
        
        const effectSummary = effectSummaryParts.join(' | ');

        // Add to buff/debuff store for HUD display (this handles the visual ring)
        const storeData = {
            name: effectConfig.name,
            description: effectConfig.description || '',
            effectSummary: effectSummary,
            duration: durationInSeconds,
            effects: effects,
            source: 'manual',
            targetId: tokenId,
            targetType: 'token',
            icon: effectConfig.icon,
            color: effectConfig.color,
            durationType: effectConfig.durationType,
            durationValue: effectConfig.durationValue,
            // Over-time effect data for processing
            hasOverTimeEffect: effectConfig.hasOverTimeEffect,
            overTimeType: effectConfig.overTimeType,
            overTimeFormula: effectConfig.overTimeFormula,
            overTimeElement: effectConfig.overTimeElement,
            tickFrequency: effectConfig.tickFrequency,
            tickFrequencyValue: effectConfig.tickFrequencyValue || 1,
            tickFrequencyUnit: effectConfig.tickFrequencyUnit || 'rounds'
        };

        if (effectConfig.durationType === 'rounds') {
            storeData.remainingRounds = effectConfig.durationValue;
        }

        if (effectConfig.effectType === 'buff') {
            addBuff(storeData);
        } else {
            addDebuff(storeData);
        }

        onClose();
    };

    // Save current configuration as a preset
    const saveAsPreset = () => {
        if (!effectName.trim()) {
            alert('Please enter a name for the effect');
            return;
        }

        addPreset({
            name: effectName,
            description: effectDescription,
            category: hasOverTimeEffect 
                ? (overTimeType === 'healing' ? 'hot' : 'dot')
                : (effectType === 'buff' ? 'stat_buff' : 'stat_debuff'),
            effectType,
            icon: selectedIcon,
            color: effectColor,
            durationType,
            durationValue,
            hasOverTimeEffect,
            overTimeType,
            overTimeFormula,
            overTimeElement,
            tickFrequency,
            tickFrequencyValue,
            tickFrequencyUnit,
            statModifiers,
            resourceModifiers
        });

        // Show success feedback
        alert(`Preset "${effectName}" saved!`);
    };

    // Add a stat modifier
    const addStatModifier = (stat) => {
        const existingIndex = statModifiers.findIndex(m => m.stat === stat.id);
        if (existingIndex >= 0) return; // Already added

        setStatModifiers([
            ...statModifiers,
            {
                stat: stat.id,
                name: stat.name,
                value: effectType === 'buff' ? 2 : -2,
                type: 'flat'
            }
        ]);
        setShowStatPicker(false);
    };

    // Remove a stat modifier
    const removeStatModifier = (statId) => {
        setStatModifiers(statModifiers.filter(m => m.stat !== statId));
    };

    // Update a stat modifier value
    const updateStatModifierValue = (statId, newValue) => {
        setStatModifiers(statModifiers.map(m => 
            m.stat === statId ? { ...m, value: parseInt(newValue) || 0 } : m
        ));
    };

    // Reset form
    const resetForm = () => {
        setEffectName('');
        setEffectDescription('');
        setSelectedIcon('fas fa-magic');
        setEffectColor(effectType === 'buff' ? '#32CD32' : '#DC143C');
        setDurationType('rounds');
        setDurationValue(3);
        setHasOverTimeEffect(false);
        setOverTimeType('damage');
        setOverTimeFormula('1d4');
        setOverTimeElement('physical');
        setTickFrequency('realtime');
        setTickFrequencyValue(1);
        setTickFrequencyUnit('rounds');
        setStatModifiers([]);
        setResourceModifiers([]);
    };

    // Group stats by category for the picker
    const statsByCategory = {};
    ALL_STATS.forEach(stat => {
        if (!statsByCategory[stat.category]) {
            statsByCategory[stat.category] = [];
        }
        statsByCategory[stat.category].push(stat);
    });

    return createPortal(
        <div className="buff-debuff-modal-overlay" onClick={onClose}>
            <div 
                ref={modalRef}
                className="buff-debuff-modal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bdm-header">
                    <div className="bdm-title">
                        <i className="fas fa-magic"></i>
                        <span>Add Effect - {creature?.name}</span>
                    </div>
                    <button className="bdm-close-btn" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="bdm-tabs">
                    <button 
                        className={`bdm-tab ${activeTab === 'create' ? 'active' : ''}`}
                        onClick={() => setActiveTab('create')}
                    >
                        <i className="fas fa-plus-circle"></i>
                        Create New
                    </button>
                    <button 
                        className={`bdm-tab ${activeTab === 'presets' ? 'active' : ''}`}
                        onClick={() => setActiveTab('presets')}
                    >
                        <i className="fas fa-bookmark"></i>
                        Presets ({presets.length})
                    </button>
                </div>

                {/* Content */}
                <div className="bdm-content">
                    {activeTab === 'create' ? (
                        <div className="bdm-create-section">
                            {/* Effect Type Toggle */}
                            <div className="bdm-type-toggle">
                                <button 
                                    className={`bdm-type-btn buff ${effectType === 'buff' ? 'active' : ''}`}
                                    onClick={() => setEffectType('buff')}
                                >
                                    <i className="fas fa-arrow-up"></i>
                                    Buff
                                </button>
                                <button 
                                    className={`bdm-type-btn debuff ${effectType === 'debuff' ? 'active' : ''}`}
                                    onClick={() => setEffectType('debuff')}
                                >
                                    <i className="fas fa-arrow-down"></i>
                                    Debuff
                                </button>
                            </div>

                            {/* Basic Info */}
                            <div className="bdm-section">
                                <h4>Basic Information</h4>
                                <div className="bdm-row">
                                    <div className="bdm-icon-select" onClick={() => setShowIconPicker(!showIconPicker)}>
                                        <i className={selectedIcon} style={{ color: effectColor }}></i>
                                        {showIconPicker && (
                                            <div className="bdm-icon-picker">
                                                {EFFECT_ICONS.map(icon => (
                                                    <div 
                                                        key={icon.id}
                                                        className="bdm-icon-option"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedIcon(icon.id);
                                                            setShowIconPicker(false);
                                                        }}
                                                    >
                                                        <i className={icon.id}></i>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        className="bdm-input"
                                        placeholder="Effect Name"
                                        value={effectName}
                                        onChange={(e) => setEffectName(e.target.value)}
                                    />
                                    <input
                                        type="color"
                                        className="bdm-color-input"
                                        value={effectColor}
                                        onChange={(e) => setEffectColor(e.target.value)}
                                    />
                                </div>
                                <textarea
                                    className="bdm-textarea"
                                    placeholder="Effect Description (optional)"
                                    value={effectDescription}
                                    onChange={(e) => setEffectDescription(e.target.value)}
                                    rows={2}
                                />
                            </div>

                            {/* Duration */}
                            <div className="bdm-section">
                                <h4>Duration</h4>
                                <div className="bdm-duration-row">
                                    <input
                                        type="number"
                                        className="bdm-number-input"
                                        min="1"
                                        value={durationValue}
                                        onChange={(e) => setDurationValue(parseInt(e.target.value) || 1)}
                                    />
                                    <select
                                        className="bdm-select"
                                        value={durationType}
                                        onChange={(e) => setDurationType(e.target.value)}
                                    >
                                        <option value="rounds">Rounds</option>
                                        <option value="minutes">Minutes</option>
                                        <option value="hours">Hours</option>
                                    </select>
                                </div>
                            </div>

                            {/* Over-Time Effect */}
                            <div className="bdm-section">
                                <div className="bdm-section-header">
                                    <h4>Over-Time Effect</h4>
                                    <label className="bdm-toggle">
                                        <input
                                            type="checkbox"
                                            checked={hasOverTimeEffect}
                                            onChange={(e) => setHasOverTimeEffect(e.target.checked)}
                                        />
                                        <span className="bdm-toggle-slider"></span>
                                    </label>
                                </div>
                                {hasOverTimeEffect && (
                                    <div className="bdm-overtime-config">
                                        <div className="bdm-row">
                                            <select
                                                className="bdm-select"
                                                value={overTimeType}
                                                onChange={(e) => setOverTimeType(e.target.value)}
                                            >
                                                <option value="damage">Damage</option>
                                                <option value="healing">Healing</option>
                                                <option value="mana_drain">Mana Drain</option>
                                                <option value="mana_regen">Mana Regen</option>
                                            </select>
                                            <input
                                                type="text"
                                                className="bdm-input"
                                                placeholder="Formula (e.g., 1d6)"
                                                value={overTimeFormula}
                                                onChange={(e) => setOverTimeFormula(e.target.value)}
                                            />
                                        </div>
                                        {(overTimeType === 'damage') && (
                                            <div className="bdm-element-select">
                                                {ELEMENT_TYPES.filter(e => e.id !== 'healing').map(element => (
                                                    <div 
                                                        key={element.id}
                                                        className={`bdm-element-option ${overTimeElement === element.id ? 'selected' : ''}`}
                                                        onClick={() => setOverTimeElement(element.id)}
                                                        title={element.name}
                                                    >
                                                        <i className={element.icon} style={{ color: element.color }}></i>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="bdm-tick-config">
                                            <span>Tick every:</span>
                                            <input
                                                type="number"
                                                className="bdm-number-input small"
                                                min="1"
                                                value={tickFrequencyValue}
                                                onChange={(e) => setTickFrequencyValue(parseInt(e.target.value) || 1)}
                                            />
                                            <select
                                                className="bdm-select small"
                                                value={tickFrequencyUnit}
                                                onChange={(e) => setTickFrequencyUnit(e.target.value)}
                                            >
                                                <option value="rounds">Round(s)</option>
                                                <option value="minutes">Minute(s)</option>
                                                <option value="hours">Hour(s)</option>
                                            </select>
                                            <select
                                                className="bdm-select small"
                                                value={tickFrequency}
                                                onChange={(e) => setTickFrequency(e.target.value)}
                                            >
                                                <option value="realtime">Real-Time (Always)</option>
                                                <option value="round">At Round Start</option>
                                                <option value="turn">At Turn Start</option>
                                                <option value="turn_end">At Turn End</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Stat Modifiers */}
                            <div className="bdm-section">
                                <div className="bdm-section-header">
                                    <h4>Stat Modifiers</h4>
                                    <button 
                                        className="bdm-add-btn"
                                        onClick={() => setShowStatPicker(!showStatPicker)}
                                    >
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>
                                {showStatPicker && (
                                    <div className="bdm-stat-picker">
                                        <div className="bdm-stat-categories">
                                            {Object.keys(statsByCategory).map(cat => (
                                                <button
                                                    key={cat}
                                                    className={`bdm-stat-cat-btn ${selectedStatCategory === cat ? 'active' : ''}`}
                                                    onClick={() => setSelectedStatCategory(cat)}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="bdm-stat-list">
                                            {statsByCategory[selectedStatCategory]?.map(stat => (
                                                <div 
                                                    key={stat.id}
                                                    className="bdm-stat-option"
                                                    onClick={() => addStatModifier(stat)}
                                                >
                                                    {stat.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {statModifiers.length > 0 && (
                                    <div className="bdm-modifiers-list">
                                        {statModifiers.map(mod => (
                                            <div key={mod.stat} className="bdm-modifier-item">
                                                <span className="bdm-modifier-name">{mod.name}</span>
                                                <input
                                                    type="number"
                                                    className="bdm-modifier-value"
                                                    value={mod.value}
                                                    onChange={(e) => updateStatModifierValue(mod.stat, e.target.value)}
                                                />
                                                <button 
                                                    className="bdm-remove-btn"
                                                    onClick={() => removeStatModifier(mod.stat)}
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="bdm-actions">
                                <button className="bdm-btn secondary" onClick={resetForm}>
                                    <i className="fas fa-undo"></i>
                                    Reset
                                </button>
                                <button className="bdm-btn secondary" onClick={saveAsPreset}>
                                    <i className="fas fa-save"></i>
                                    Save Preset
                                </button>
                                <button 
                                    className={`bdm-btn primary ${effectType}`}
                                    onClick={() => applyEffect()}
                                >
                                    <i className="fas fa-check"></i>
                                    Apply {effectType === 'buff' ? 'Buff' : 'Debuff'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bdm-presets-section">
                            {/* Preset Search and Filter */}
                            <div className="bdm-preset-controls">
                                <div className="bdm-preset-search">
                                    <i className="fas fa-search"></i>
                                    <input
                                        type="text"
                                        placeholder="Search presets..."
                                        value={presetSearchTerm}
                                        onChange={(e) => setPresetSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="bdm-preset-filter"
                                    value={presetCategory}
                                    onChange={(e) => setPresetCategory(e.target.value)}
                                >
                                    {PRESET_CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Preset List */}
                            <div className="bdm-preset-list">
                                {filteredPresets.length === 0 ? (
                                    <div className="bdm-no-presets">
                                        <i className="fas fa-folder-open"></i>
                                        <span>No presets found</span>
                                    </div>
                                ) : (
                                    filteredPresets.map(preset => (
                                        <div 
                                            key={preset.id} 
                                            className={`bdm-preset-card ${preset.effectType}`}
                                        >
                                            <div className="bdm-preset-icon">
                                                <i className={preset.icon} style={{ color: preset.color }}></i>
                                            </div>
                                            <div className="bdm-preset-info">
                                                <div className="bdm-preset-name">{preset.name}</div>
                                                <div className="bdm-preset-desc">{preset.description}</div>
                                                <div className="bdm-preset-meta">
                                                    <span className={`bdm-preset-type ${preset.effectType}`}>
                                                        {preset.effectType}
                                                    </span>
                                                    <span className="bdm-preset-duration">
                                                        {preset.durationValue} {preset.durationType}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="bdm-preset-actions">
                                                <button 
                                                    className="bdm-preset-btn apply"
                                                    onClick={() => quickApplyPreset(preset)}
                                                    title="Apply Now"
                                                >
                                                    <i className="fas fa-play"></i>
                                                </button>
                                                <button 
                                                    className="bdm-preset-btn edit"
                                                    onClick={() => applyPresetToForm(preset)}
                                                    title="Edit & Customize"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                {!preset.isBuiltIn && (
                                                    <button 
                                                        className="bdm-preset-btn delete"
                                                        onClick={() => removePreset(preset.id)}
                                                        title="Delete"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default BuffDebuffCreatorModal;

