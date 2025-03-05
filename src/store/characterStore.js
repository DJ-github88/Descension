import { create } from 'zustand';
import { calculateEquipmentBonuses, calculateDerivedStats } from '../utils/characterUtils';

const useCharacterStore = create((set, get) => ({
    // Base character info
    name: 'Character Name',
    race: 'Race',
    alignment: 'Neutral Good',
    exhaustionLevel: 0,
    
    // Base Stats
    stats: {
        constitution: 10,
        strength: 10,
        agility: 10,
        intelligence: 10,
        spirit: 10,
        charisma: 10
    },

    // Resources
    health: {
        current: 45,
        max: 50
    },
    mana: {
        current: 45,
        max: 50
    },
    actionPoints: {
        current: 1,
        max: 3
    },

    // Resistances
    resistances: {
        fire: { 
            value: 0, 
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_fire.jpg'
        },
        cold: { 
            value: 0, 
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frostbolt02.jpg'
        },
        lightning: { 
            value: 0, 
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_lightning.jpg'
        },
        acid: { 
            value: 0, 
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_creature_poison_02.jpg'
        },
        force: { 
            value: 0, 
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_blast.jpg'
        },
        necrotic: { 
            value: 0, 
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowbolt.jpg'
        },
        radiant: { 
            value: 0, 
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_holybolt.jpg'
        },
        poison: { 
            value: 0, 
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_dualweild.jpg'
        },
        psychic: { 
            value: 0, 
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_mindtwisting.jpg'
        },
        thunder: { 
            value: 0, 
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_thunderclap.jpg'
        }
    },

    // Spell Power
    spellPower: {
        fire: { 
            value: 0, 
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_fire.jpg'
        },
        cold: { 
            value: 0, 
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frostbolt02.jpg'
        },
        lightning: { 
            value: 0, 
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_lightning.jpg'
        },
        acid: { 
            value: 0, 
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_creature_poison_02.jpg'
        },
        force: { 
            value: 0, 
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_blast.jpg'
        },
        necrotic: { 
            value: 0, 
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowbolt.jpg'
        },
        radiant: { 
            value: 0, 
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_holybolt.jpg'
        },
        poison: { 
            value: 0, 
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_dualweild.jpg'
        },
        psychic: { 
            value: 0, 
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_mindtwisting.jpg'
        },
        thunder: { 
            value: 0, 
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_thunderclap.jpg'
        }
    },

    // Equipment slots
    equipment: {
        head: null,
        neck: null,
        shoulders: null,
        back: null,
        chest: null,
        shirt: null,
        wrists: null,
        mainHand: null,
        offHand: null,
        ranged: null,
        trinket1: null,
        trinket2: null,
        ring1: null,
        ring2: null,
        feet: null,
        legs: null,
        waist: null,
        gloves: null
    },

    // Equipment bonuses (calculated)
    equipmentBonuses: {
        stats: {},
        skills: {},
        resistances: {}
    },

    // Derived stats (calculated)
    derivedStats: {
        movementSpeed: 30,
        swimSpeed: 15,
        carryingCapacity: 0,
        visionRange: 0
    },

    // Skill system
    skillLevels: {},
    skillPoints: {},
    completedAchievements: {},

    // Actions
    updateStat: (statName, value) => {
        set(state => {
            const newStats = { ...state.stats, [statName]: value };
            const equipmentBonuses = calculateEquipmentBonuses(state.equipment);
            const derivedStats = calculateDerivedStats(newStats, equipmentBonuses);
            
            return {
                stats: newStats,
                equipmentBonuses,
                derivedStats
            };
        });
    },

    updateEquipment: (slot, item) => {
        set(state => {
            const newEquipment = { ...state.equipment, [slot]: item };
            const equipmentBonuses = calculateEquipmentBonuses(newEquipment);
            const derivedStats = calculateDerivedStats(state.stats, equipmentBonuses);
            
            return {
                equipment: newEquipment,
                equipmentBonuses,
                derivedStats
            };
        });
    },

    updateResistance: (type, value) => {
        set(state => ({
            resistances: {
                ...state.resistances,
                [type]: {
                    ...state.resistances[type],
                    value
                }
            }
        }));
    },

    updateSpellPower: (type, value) => {
        set(state => ({
            spellPower: {
                ...state.spellPower,
                [type]: {
                    ...state.spellPower[type],
                    value
                }
            }
        }));
    },

    updateCharacterInfo: (field, value) => {
        set(state => ({ [field]: value }));
    },

    setSkillLevel: (skillId, level) => 
        set((state) => ({
            skillLevels: { ...state.skillLevels, [skillId]: level }
        })),

    setSkillPoints: (skillId, points) => 
        set((state) => ({
            skillPoints: { ...state.skillPoints, [skillId]: points }
        })),

    setCompletedAchievements: (achievements) =>
        set((state) => ({
            completedAchievements: achievements
        })),

    updateResource: (resource, current, max) => {
        set(state => ({
            [resource]: {
                current: current !== undefined ? Math.min(max || state[resource].max, Math.max(0, current)) : state[resource].current,
                max: max !== undefined ? Math.max(0, max) : state[resource].max
            }
        }));
    },

    // Initialize character
    initializeCharacter: () => {
        const state = get();
        const equipmentBonuses = calculateEquipmentBonuses(state.equipment);
        const derivedStats = calculateDerivedStats(state.stats, equipmentBonuses);
        
        set({
            equipmentBonuses,
            derivedStats
        });
    }
}));

export default useCharacterStore;
