import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Effect Preset Store
 * Stores saved buff/debuff configurations for quick application
 */
const useEffectPresetStore = create(
    persist(
        (set, get) => ({
            // Saved effect presets
            presets: [],

            // Add a new preset
            addPreset: (preset) => {
                const { presets } = get();
                const newPreset = {
                    id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    name: preset.name,
                    description: preset.description || '',
                    category: preset.category || 'custom',
                    effectType: preset.effectType, // 'buff' or 'debuff'
                    icon: preset.icon || 'fas fa-magic',
                    color: preset.color || (preset.effectType === 'buff' ? '#32CD32' : '#DC143C'),
                    
                    // Duration configuration
                    durationType: preset.durationType || 'rounds',
                    durationValue: preset.durationValue || 3,
                    
                    // Effect configuration
                    hasOverTimeEffect: preset.hasOverTimeEffect || false,
                    overTimeType: preset.overTimeType || null, // 'damage' or 'healing'
                    overTimeFormula: preset.overTimeFormula || '',
                    overTimeElement: preset.overTimeElement || 'physical',
                    tickFrequency: preset.tickFrequency || 'realtime',
                    tickFrequencyValue: preset.tickFrequencyValue || 1,
                    tickFrequencyUnit: preset.tickFrequencyUnit || 'rounds',
                    
                    // Stat modifiers
                    statModifiers: preset.statModifiers || [],
                    
                    // Resource modifiers (HP, Mana, AP changes)
                    resourceModifiers: preset.resourceModifiers || [],
                    
                    // Additional config for compatibility with spell system
                    stackable: preset.stackable || false,
                    maxStacks: preset.maxStacks || 1,
                    canBeDispelled: preset.canBeDispelled !== false,
                    
                    // Metadata
                    createdAt: Date.now(),
                    isBuiltIn: preset.isBuiltIn || false
                };

                // Check for duplicate names
                const existingIndex = presets.findIndex(p => p.name.toLowerCase() === newPreset.name.toLowerCase());
                if (existingIndex >= 0) {
                    // Update existing preset
                    const updatedPresets = [...presets];
                    updatedPresets[existingIndex] = { ...newPreset, id: presets[existingIndex].id };
                    set({ presets: updatedPresets });
                } else {
                    set({ presets: [...presets, newPreset] });
                }
                
                return newPreset;
            },

            // Update an existing preset
            updatePreset: (presetId, updates) => {
                const { presets } = get();
                const updatedPresets = presets.map(preset => 
                    preset.id === presetId ? { ...preset, ...updates, updatedAt: Date.now() } : preset
                );
                set({ presets: updatedPresets });
            },

            // Remove a preset
            removePreset: (presetId) => {
                const { presets } = get();
                set({ presets: presets.filter(preset => preset.id !== presetId && !preset.isBuiltIn) });
            },

            // Get presets by type
            getPresetsByType: (effectType) => {
                const { presets } = get();
                return presets.filter(preset => preset.effectType === effectType);
            },

            // Get presets by category
            getPresetsByCategory: (category) => {
                const { presets } = get();
                return presets.filter(preset => preset.category === category);
            },

            // Search presets
            searchPresets: (query) => {
                const { presets } = get();
                const lowerQuery = query.toLowerCase();
                return presets.filter(preset => 
                    preset.name.toLowerCase().includes(lowerQuery) ||
                    preset.description.toLowerCase().includes(lowerQuery)
                );
            },

            // Initialize with built-in presets
            initializeBuiltInPresets: () => {
                const { presets } = get();
                const builtInPresets = getBuiltInPresets();
                
                // Only add built-in presets that don't already exist
                const existingIds = presets.map(p => p.id);
                const newBuiltIns = builtInPresets.filter(bp => !existingIds.includes(bp.id));
                
                if (newBuiltIns.length > 0) {
                    set({ presets: [...newBuiltIns, ...presets] });
                }
            }
        }),
        {
            name: 'effect-preset-store',
            version: 1
        }
    )
);

// Built-in presets for common effects
const getBuiltInPresets = () => [
    // Damage Over Time Effects
    {
        id: 'builtin_bleed',
        name: 'Bleeding',
        description: 'Takes physical damage at the start of each turn',
        category: 'dot',
        effectType: 'debuff',
        icon: 'fas fa-tint',
        color: '#DC143C',
        durationType: 'rounds',
        durationValue: 3,
        hasOverTimeEffect: true,
        overTimeType: 'damage',
        overTimeFormula: '1d4',
        overTimeElement: 'physical',
        tickFrequency: 'round',
        statModifiers: [],
        resourceModifiers: [],
        stackable: true,
        maxStacks: 3,
        canBeDispelled: true,
        isBuiltIn: true
    },
    {
        id: 'builtin_burning',
        name: 'Burning',
        description: 'Takes fire damage at the start of each turn',
        category: 'dot',
        effectType: 'debuff',
        icon: 'fas fa-fire',
        color: '#FF4500',
        durationType: 'rounds',
        durationValue: 2,
        hasOverTimeEffect: true,
        overTimeType: 'damage',
        overTimeFormula: '1d6',
        overTimeElement: 'fire',
        tickFrequency: 'round',
        statModifiers: [],
        resourceModifiers: [],
        stackable: false,
        canBeDispelled: true,
        isBuiltIn: true
    },
    {
        id: 'builtin_poison',
        name: 'Poisoned',
        description: 'Takes poison damage and has disadvantage on attacks',
        category: 'dot',
        effectType: 'debuff',
        icon: 'fas fa-skull-crossbones',
        color: '#228B22',
        durationType: 'rounds',
        durationValue: 3,
        hasOverTimeEffect: true,
        overTimeType: 'damage',
        overTimeFormula: '1d4',
        overTimeElement: 'poison',
        tickFrequency: 'round',
        statModifiers: [],
        resourceModifiers: [],
        stackable: false,
        canBeDispelled: true,
        isBuiltIn: true
    },
    {
        id: 'builtin_frostbite',
        name: 'Frostbite',
        description: 'Takes cold damage and movement reduced',
        category: 'dot',
        effectType: 'debuff',
        icon: 'fas fa-snowflake',
        color: '#00BFFF',
        durationType: 'rounds',
        durationValue: 2,
        hasOverTimeEffect: true,
        overTimeType: 'damage',
        overTimeFormula: '1d4',
        overTimeElement: 'cold',
        tickFrequency: 'round',
        statModifiers: [{ stat: 'movement_speed', value: -15, type: 'flat' }],
        resourceModifiers: [],
        stackable: false,
        canBeDispelled: true,
        isBuiltIn: true
    },
    
    // Healing Over Time Effects
    {
        id: 'builtin_regeneration',
        name: 'Regeneration',
        description: 'Heals at the start of each turn',
        category: 'hot',
        effectType: 'buff',
        icon: 'fas fa-heart',
        color: '#32CD32',
        durationType: 'rounds',
        durationValue: 3,
        hasOverTimeEffect: true,
        overTimeType: 'healing',
        overTimeFormula: '1d6',
        overTimeElement: 'healing',
        tickFrequency: 'round',
        statModifiers: [],
        resourceModifiers: [],
        stackable: false,
        canBeDispelled: true,
        isBuiltIn: true
    },
    {
        id: 'builtin_rejuvenation',
        name: 'Rejuvenation',
        description: 'Gradually restores health over time',
        category: 'hot',
        effectType: 'buff',
        icon: 'fas fa-leaf',
        color: '#00FF7F',
        durationType: 'rounds',
        durationValue: 5,
        hasOverTimeEffect: true,
        overTimeType: 'healing',
        overTimeFormula: '1d4 + 2',
        overTimeElement: 'healing',
        tickFrequency: 'round',
        statModifiers: [],
        resourceModifiers: [],
        stackable: false,
        canBeDispelled: true,
        isBuiltIn: true
    },
    
    // Stat Buff Effects
    {
        id: 'builtin_strength_boost',
        name: 'Strength Boost',
        description: 'Temporarily increases Strength',
        category: 'stat_buff',
        effectType: 'buff',
        icon: 'fas fa-fist-raised',
        color: '#FF6347',
        durationType: 'rounds',
        durationValue: 3,
        hasOverTimeEffect: false,
        statModifiers: [{ stat: 'strength', value: 2, type: 'flat' }],
        resourceModifiers: [],
        stackable: false,
        canBeDispelled: true,
        isBuiltIn: true
    },
    {
        id: 'builtin_agility_boost',
        name: 'Agility Boost',
        description: 'Temporarily increases Agility',
        category: 'stat_buff',
        effectType: 'buff',
        icon: 'fas fa-wind',
        color: '#87CEEB',
        durationType: 'rounds',
        durationValue: 3,
        hasOverTimeEffect: false,
        statModifiers: [{ stat: 'agility', value: 2, type: 'flat' }],
        resourceModifiers: [],
        stackable: false,
        canBeDispelled: true,
        isBuiltIn: true
    },
    {
        id: 'builtin_armor_boost',
        name: 'Armor Boost',
        description: 'Temporarily increases Armor',
        category: 'stat_buff',
        effectType: 'buff',
        icon: 'fas fa-shield-alt',
        color: '#4682B4',
        durationType: 'rounds',
        durationValue: 3,
        hasOverTimeEffect: false,
        statModifiers: [{ stat: 'armor', value: 2, type: 'flat' }],
        resourceModifiers: [],
        stackable: false,
        canBeDispelled: true,
        isBuiltIn: true
    },
    
    // Stat Debuff Effects
    {
        id: 'builtin_weakness',
        name: 'Weakness',
        description: 'Temporarily decreases Strength',
        category: 'stat_debuff',
        effectType: 'debuff',
        icon: 'fas fa-dizzy',
        color: '#8B4513',
        durationType: 'rounds',
        durationValue: 2,
        hasOverTimeEffect: false,
        statModifiers: [{ stat: 'strength', value: -2, type: 'flat' }],
        resourceModifiers: [],
        stackable: false,
        canBeDispelled: true,
        isBuiltIn: true
    },
    {
        id: 'builtin_slow',
        name: 'Slowed',
        description: 'Movement speed reduced',
        category: 'stat_debuff',
        effectType: 'debuff',
        icon: 'fas fa-shoe-prints',
        color: '#696969',
        durationType: 'rounds',
        durationValue: 2,
        hasOverTimeEffect: false,
        statModifiers: [{ stat: 'movement_speed', value: -15, type: 'flat' }],
        resourceModifiers: [],
        stackable: false,
        canBeDispelled: true,
        isBuiltIn: true
    },
    {
        id: 'builtin_vulnerability',
        name: 'Vulnerable',
        description: 'Armor reduced, taking more damage',
        category: 'stat_debuff',
        effectType: 'debuff',
        icon: 'fas fa-heart-broken',
        color: '#B22222',
        durationType: 'rounds',
        durationValue: 2,
        hasOverTimeEffect: false,
        statModifiers: [{ stat: 'armor', value: -3, type: 'flat' }],
        resourceModifiers: [],
        stackable: false,
        canBeDispelled: true,
        isBuiltIn: true
    },
    
    // Resource Effects
    {
        id: 'builtin_mana_drain',
        name: 'Mana Drain',
        description: 'Loses mana at the start of each turn',
        category: 'resource',
        effectType: 'debuff',
        icon: 'fas fa-bolt',
        color: '#9370DB',
        durationType: 'rounds',
        durationValue: 3,
        hasOverTimeEffect: true,
        overTimeType: 'mana_drain',
        overTimeFormula: '1d4',
        overTimeElement: 'arcane',
        tickFrequency: 'round',
        statModifiers: [],
        resourceModifiers: [{ resource: 'mana', value: -5, type: 'flat' }],
        stackable: false,
        canBeDispelled: true,
        isBuiltIn: true
    },
    {
        id: 'builtin_mana_regen',
        name: 'Mana Regeneration',
        description: 'Regenerates mana at the start of each turn',
        category: 'resource',
        effectType: 'buff',
        icon: 'fas fa-magic',
        color: '#4169E1',
        durationType: 'rounds',
        durationValue: 3,
        hasOverTimeEffect: true,
        overTimeType: 'mana_regen',
        overTimeFormula: '1d4 + 1',
        overTimeElement: 'arcane',
        tickFrequency: 'round',
        statModifiers: [],
        resourceModifiers: [{ resource: 'mana', value: 5, type: 'flat' }],
        stackable: false,
        canBeDispelled: true,
        isBuiltIn: true
    }
];

export default useEffectPresetStore;
export { getBuiltInPresets };

