import { logger } from './logger';

// Helper functions for processing different data structures
const processSimpleValue = (bonuses, key, val) => {
    if (typeof val === 'number') {
        bonuses[key] = (bonuses[key] || 0) + val;
        return true;
    }
    return false;
};

const processObjectValue = (bonuses, key, val, targetKey) => {
    if (typeof val === 'object') {
        Object.entries(val).forEach(([subKey, subVal]) => {
            bonuses[targetKey][subKey] = (bonuses[targetKey][subKey] || 0) + subVal;
        });
        return true;
    }
    return false;
};

const statMap = {
    strength: 'str',
    constitution: 'con',
    agility: 'agi',
    intelligence: 'int',
    spirit: 'spir',
    charisma: 'cha'
};

export function calculateEquipmentBonuses(equipment = {}) {
    const bonuses = {
        str: 0, con: 0, agi: 0, int: 0, spir: 0, cha: 0,
        damage: 0, armor: 0, healthRegen: 0, manaRegen: 0,
        moveSpeed: 0, spellDamage: 0, healingPower: 0,
        rangedDamage: 0, carryingCapacity: 0,
        maxHealth: 0, maxMana: 0, // Add direct health/mana bonuses
        maxHealthPercent: 0, maxManaPercent: 0, // Add percentage bonuses
        healthRegenPercent: 0, manaRegenPercent: 0, // Add percentage regen bonuses
        healingPowerPercent: 0, // Add percentage healing power
        resistances: {},
        flatDamageReductions: {}, // Track flat damage reduction values per damage type
        spellDamageTypes: {},
        immunities: [], // Add immunities array
        conditionModifiers: {}, // Add condition modifiers
        skills: {}
    };

    // Process each equipped item using functional approach
    Object.values(equipment).filter(Boolean).forEach(item => {
        // Handle legacy effects structure
        if (item.effects) {
            Object.entries(item.effects).forEach(([key, val]) => {
                if (processSimpleValue(bonuses, key, val)) return;

                switch (key) {
                    case 'resistances':
                        processObjectValue(bonuses, key, val, 'resistances');
                        break;
                    case 'spellDamageTypes':
                        processObjectValue(bonuses, key, val, 'spellDamageTypes');
                        break;
                    case 'skills':
                        processObjectValue(bonuses, key, val, 'skills');
                        break;
                }
            });
        }

        // Handle new item structure with baseStats, combatStats, utilityStats
        if (item.baseStats) {
            Object.entries(item.baseStats).forEach(([stat, statData]) => {
                const value = typeof statData === 'object' ? statData.value : statData;
                if (typeof value === 'number') {
                    const bonusKey = statMap[stat] || stat;
                    bonuses[bonusKey] = (bonuses[bonusKey] || 0) + value;
                }
            });
        }

        if (item.combatStats) {
            Object.entries(item.combatStats).forEach(([stat, statData]) => {
                // Handle special cases first
                if (stat === 'spellDamage' && statData.types) {
                    Object.entries(statData.types).forEach(([spellType, spellData]) => {
                        const value = typeof spellData === 'object' ? spellData.value : spellData;
                        if (typeof value === 'number') {
                            bonuses.spellDamageTypes[spellType] = (bonuses.spellDamageTypes[spellType] || 0) + value;
                        }
                    });
                    return;
                }

                if (stat === 'resistances' && typeof statData === 'object') {
                    Object.entries(statData).forEach(([resType, resData]) => {
                        // Normalize damage type names: shadow -> necrotic, holy -> radiant, cold -> frost
                        const normalizeDamageType = (type) => {
                            if (type === 'shadow') return 'necrotic';
                            if (type === 'holy') return 'radiant';
                            if (type === 'cold') return 'frost';
                            return type;
                        };
                        const normalizedResType = normalizeDamageType(resType);
                        
                        // Check if this is a flat damage reduction (isPercentage is false or undefined, and value is a number)
                        const isFlatReduction = resData && typeof resData === 'object' && 
                            resData.value !== undefined && 
                            typeof resData.value === 'number' && 
                            resData.isPercentage !== true;
                        
                        if (isFlatReduction) {
                            // Track flat damage reduction separately
                            bonuses.flatDamageReductions[normalizedResType] = (bonuses.flatDamageReductions[normalizedResType] || 0) + resData.value;
                            return;
                        }
                        
                        // Handle new resistance level system
                        if (resData && typeof resData === 'object' && resData.level !== undefined) {
                            // New system: store the full resistance data
                            // If multiple items have resistances, we need to combine them intelligently
                            if (!bonuses.resistances[normalizedResType]) {
                                bonuses.resistances[normalizedResType] = { level: 100, multiplier: 1.0 };
                            }
                            // For multiple resistances, we'll use the most beneficial one (lowest multiplier for damage taken)
                            // If current is normal (100) or worse, use the new one if it's better
                            const currentLevel = bonuses.resistances[normalizedResType].level || 100;
                            const currentMultiplier = bonuses.resistances[normalizedResType].multiplier || 1.0;
                            const newLevel = resData.level || 100;
                            const newMultiplier = resData.multiplier || 1.0;
                            
                            // Lower multiplier is better (takes less damage), except for negative (healing)
                            // For healing (negative multiplier), higher absolute value is better
                            if (newMultiplier < 0 && currentMultiplier >= 0) {
                                // New is healing, current is not - use new
                                bonuses.resistances[normalizedResType] = resData;
                            } else if (newMultiplier < 0 && currentMultiplier < 0) {
                                // Both are healing - use the one with higher absolute value (more healing)
                                if (Math.abs(newMultiplier) > Math.abs(currentMultiplier)) {
                                    bonuses.resistances[normalizedResType] = resData;
                                }
                            } else if (newMultiplier >= 0 && currentMultiplier >= 0) {
                                // Both are normal or resistance - use the one with lower multiplier (better resistance)
                                if (newMultiplier < currentMultiplier) {
                                    bonuses.resistances[normalizedResType] = resData;
                                }
                            }
                        } else {
                            // Legacy system: simple value (percentage-based)
                            const value = typeof resData === 'object' ? resData.value : resData;
                            if (typeof value === 'number') {
                                // Convert legacy value to new system format
                                if (!bonuses.resistances[normalizedResType] || typeof bonuses.resistances[normalizedResType] === 'number') {
                                    bonuses.resistances[normalizedResType] = (bonuses.resistances[normalizedResType] || 0) + value;
                                }
                            }
                        }
                    });
                    return;
                }

                if (stat === 'conditionModifiers' && typeof statData === 'object') {
                    Object.entries(statData).forEach(([conditionId, modifierData]) => {
                        if (modifierData && modifierData.modifier && modifierData.modifier !== 'none') {
                            // Store condition modifier data
                            if (!bonuses.conditionModifiers[conditionId]) {
                                bonuses.conditionModifiers[conditionId] = {
                                    modifier: modifierData.modifier,
                                    label: modifierData.label,
                                    description: modifierData.description,
                                    color: modifierData.color
                                };
                            } else {
                                // If multiple items have the same condition modifier, prioritize immune > double_advantage > advantage > double_disadvantage > disadvantage
                                const priority = {
                                    'immune': 5,
                                    'double_advantage': 4,
                                    'advantage': 3,
                                    'double_disadvantage': 2,
                                    'disadvantage': 1
                                };
                                const currentPriority = priority[bonuses.conditionModifiers[conditionId].modifier] || 0;
                                const newPriority = priority[modifierData.modifier] || 0;
                                if (newPriority > currentPriority) {
                                    bonuses.conditionModifiers[conditionId] = {
                                        modifier: modifierData.modifier,
                                        label: modifierData.label,
                                        description: modifierData.description,
                                        color: modifierData.color
                                    };
                                }
                            }
                        }
                    });
                    return;
                }

                // Handle regular combat stats
                const value = typeof statData === 'object' ? statData.value : statData;
                const isPercentage = typeof statData === 'object' ? statData.isPercentage : false;

                if (typeof value === 'number') {
                    const statMap = {
                        healthRestore: 'healthRegen',
                        manaRestore: 'manaRegen',
                        armorClass: 'armor',
                        armor: 'armor', // Direct armor mapping
                        spellPower: 'spellDamage',
                        healingPower: 'healingPower',
                        maxHealth: 'maxHealth',
                        maxMana: 'maxMana',
                        healthRegen: 'healthRegen',
                        manaRegen: 'manaRegen'
                    };

                    let bonusKey = statMap[stat] || stat;

                    // Handle percentage-based stats
                    if (isPercentage) {
                        if (stat === 'maxHealth') {
                            bonusKey = 'maxHealthPercent';
                        } else if (stat === 'maxMana') {
                            bonusKey = 'maxManaPercent';
                        } else if (stat === 'healthRegen' || stat === 'healthRestore') {
                            bonusKey = 'healthRegenPercent';
                        } else if (stat === 'manaRegen' || stat === 'manaRestore') {
                            bonusKey = 'manaRegenPercent';
                        } else if (stat === 'healingPower') {
                            bonusKey = 'healingPowerPercent';
                        }
                    }

                    bonuses[bonusKey] = (bonuses[bonusKey] || 0) + value;
                }
            });
        }

        if (item.utilityStats) {
            Object.entries(item.utilityStats).forEach(([stat, statData]) => {
                const value = typeof statData === 'object' ? statData.value : statData;
                if (typeof value === 'number') {
                    // Map utility stat names to bonus keys
                    const bonusKey = statMap[stat] || stat;
                    bonuses[bonusKey] = (bonuses[bonusKey] || 0) + value;
                }
            });
        }

        // Handle weapon stats for damage bonuses
        if (item.weaponStats && item.weaponStats.baseDamage) {
            const weaponDamage = item.weaponStats.baseDamage;
            if (weaponDamage.bonusDamage) {
                bonuses.damage = (bonuses.damage || 0) + weaponDamage.bonusDamage;
            }
        }

        // Handle immunities
        if (item.immunities && Array.isArray(item.immunities)) {
            item.immunities.forEach(immunity => {
                if (!bonuses.immunities.includes(immunity)) {
                    bonuses.immunities.push(immunity);
                }
            });
        }

        // Handle individual spell damage types (fire, frost, etc.)
        const spellDamageTypes = ['fire', 'frost', 'arcane', 'nature', 'lightning', 'acid', 'force', 'thunder', 'chaos', 'necrotic', 'radiant'];
        spellDamageTypes.forEach(type => {
            const typeKey = `${type}Damage`;
            const spellPowerKey = `${type}SpellPower`;

            // Check in combatStats
            if (item.combatStats && item.combatStats[typeKey]) {
                const value = typeof item.combatStats[typeKey] === 'object' ? item.combatStats[typeKey].value : item.combatStats[typeKey];
                if (typeof value === 'number') {
                    bonuses.spellDamageTypes[type] = (bonuses.spellDamageTypes[type] || 0) + value;
                }
            }

            // Check for spell power variants
            if (item.combatStats && item.combatStats[spellPowerKey]) {
                const value = typeof item.combatStats[spellPowerKey] === 'object' ? item.combatStats[spellPowerKey].value : item.combatStats[spellPowerKey];
                if (typeof value === 'number') {
                    bonuses.spellDamageTypes[type] = (bonuses.spellDamageTypes[type] || 0) + value;
                }
            }
        });

        // Handle physical damage types
        const physicalDamageTypes = ['piercing', 'slashing', 'bludgeoning'];
        physicalDamageTypes.forEach(type => {
            const typeKey = `${type}Damage`;

            if (item.combatStats && item.combatStats[typeKey]) {
                const value = typeof item.combatStats[typeKey] === 'object' ? item.combatStats[typeKey].value : item.combatStats[typeKey];
                if (typeof value === 'number') {
                    bonuses.damage = (bonuses.damage || 0) + value;
                }
            }
        });

        // Handle top-level armorClass property (for legacy items - deprecated, use armor instead)
        // Only add if it hasn't already been processed from combatStats to avoid double-counting
        if (item.armorClass && typeof item.armorClass === 'number') {
            const alreadyProcessed = item.combatStats && (
                item.combatStats.armor !== undefined || 
                item.combatStats.armorClass !== undefined
            );
            if (!alreadyProcessed) {
                bonuses.armor = (bonuses.armor || 0) + item.armorClass;
            }
        }
    });

    return bonuses;
}

export function calculateDerivedStats(totalStats, equipmentBonuses = {}, skillBonuses = {}, encumbranceStatus = 'normal', exhaustionLevel = 0, health = null, race = null, subrace = null) {
    // Apply skill bonuses to base stats first
    const modifiedStats = { ...totalStats };

    // Apply skill bonuses to primary stats
    ['strength', 'constitution', 'agility', 'intelligence', 'spirit', 'charisma'].forEach(stat => {
        if (skillBonuses[stat]) {
            modifiedStats[stat] = (modifiedStats[stat] || 0) + skillBonuses[stat];
        }
    });

    // Apply encumbrance effects to base stats BEFORE calculating derived stats
    let encumbranceEffects = null;
    switch (encumbranceStatus) {
        case 'encumbered':
            // -5% to most stats, +5% to constitution and strength
            ['agility', 'intelligence', 'spirit', 'charisma'].forEach(stat => {
                modifiedStats[stat] = Math.floor(modifiedStats[stat] * 0.95);
            });
            modifiedStats.constitution = Math.floor(modifiedStats.constitution * 1.05);
            modifiedStats.strength = Math.floor(modifiedStats.strength * 1.05);
            encumbranceEffects = {
                baseStatMultiplier: 0.95,
                constitutionMultiplier: 1.05,
                hasDisadvantage: false
            };
            break;

        case 'overencumbered':
            // -15% to most stats, +15% to constitution and strength
            ['agility', 'intelligence', 'spirit', 'charisma'].forEach(stat => {
                modifiedStats[stat] = Math.floor(modifiedStats[stat] * 0.85);
            });
            modifiedStats.constitution = Math.floor(modifiedStats.constitution * 1.15);
            modifiedStats.strength = Math.floor(modifiedStats.strength * 1.15);
            encumbranceEffects = {
                baseStatMultiplier: 0.85,
                constitutionMultiplier: 1.15,
                hasDisadvantage: true
            };
            break;

        default:
            encumbranceEffects = {
                baseStatMultiplier: 1.0,
                constitutionMultiplier: 1.0,
                hasDisadvantage: false
            };
            break;
    }

    // Now calculate derived stats using encumbrance-affected stats
    let baseMaxHealth = (modifiedStats.constitution * 5) + (skillBonuses.maxHealth || 0);
    let baseMaxMana = (modifiedStats.intelligence * 5) + (skillBonuses.manaPool || 0);
    let baseHealthRegen = 0; // Base health regen is 0, only equipment bonuses
    let baseManaRegen = 0; // Base mana regen is 0, only equipment bonuses
    let baseHealingPower = 0; // Base healing power is 0, only equipment bonuses

    // Apply flat equipment bonuses
    baseMaxHealth += (equipmentBonuses.maxHealth || 0);
    baseMaxMana += (equipmentBonuses.maxMana || 0);
    baseHealthRegen += (equipmentBonuses.healthRegen || 0);
    baseManaRegen += (equipmentBonuses.manaRegen || 0);
    baseHealingPower += (equipmentBonuses.healingPower || 0);

    // Apply percentage bonuses
    if (equipmentBonuses.maxHealthPercent) {
        baseMaxHealth = Math.floor(baseMaxHealth * (1 + equipmentBonuses.maxHealthPercent / 100));
    }
    if (equipmentBonuses.maxManaPercent) {
        baseMaxMana = Math.floor(baseMaxMana * (1 + equipmentBonuses.maxManaPercent / 100));
    }
    if (equipmentBonuses.healthRegenPercent) {
        baseHealthRegen = Math.floor(baseHealthRegen * (1 + equipmentBonuses.healthRegenPercent / 100));
    }
    if (equipmentBonuses.manaRegenPercent) {
        baseManaRegen = Math.floor(baseManaRegen * (1 + equipmentBonuses.manaRegenPercent / 100));
    }
    if (equipmentBonuses.healingPowerPercent) {
        baseHealingPower = Math.floor(baseHealingPower * (1 + equipmentBonuses.healingPowerPercent / 100));
    }

    // Get racial base stats
    let racialBaseStats = {
        armor: 0,
        speed: 30,
        hp: 0,
        mana: 0,
        ap: 3, // Default is 3, some races have 4 or 2
        passivePerception: 0,
        swimSpeed: 0,
        climbSpeed: 0,
        visionRange: 60,
        darkvision: 0,
        initiative: 0
    };
    
    if (race && subrace) {
        try {
            const { getRacialBaseStats } = require('../data/raceData');
            racialBaseStats = getRacialBaseStats(race, subrace);
        } catch (e) {
            console.warn('Could not load racial base stats:', e);
        }
    }
    
    // Base movement speed from race, with skill bonuses
    // Note: Passive movement speed modifiers will be applied later in conditional passives section
    const baseMoveSpeed = racialBaseStats.speed + (skillBonuses.movementSpeed || 0);
    
    // Base armor from race (0 by default), then add agility modifier ((agility - 10) / 2) and equipment
    const baseArmor = racialBaseStats.armor + Math.floor((modifiedStats.agility - 10) / 2);
    
    let derivedStats = {
        maxHealth: baseMaxHealth + racialBaseStats.hp, // Add racial base HP to calculated HP
        maxMana: baseMaxMana + racialBaseStats.mana, // Add racial base mana to calculated mana
        healthRegen: baseHealthRegen,
        manaRegen: baseManaRegen,
        damage: 0 + (equipmentBonuses.damage || 0), // Base damage is 0, only equipment bonuses
        spellDamage: 0 + (equipmentBonuses.spellDamage || 0) + (skillBonuses.spellPower || 0), // Base spell damage is 0
        healingPower: 0, // Base healing power is 0
        rangedDamage: 0 + (equipmentBonuses.rangedDamage || 0), // Base ranged damage is 0, only equipment bonuses
        slashingDamage: 0 + (equipmentBonuses.slashingDamage || 0), // Base slashing damage is 0
        bludgeoningDamage: 0 + (equipmentBonuses.bludgeoningDamage || 0), // Base bludgeoning damage is 0
        piercingDamage: 0 + (equipmentBonuses.piercingDamage || 0), // Base piercing damage is 0
        armor: baseArmor + (equipmentBonuses.armor || 0) + (skillBonuses.armor || 0),
        moveSpeed: baseMoveSpeed,
        swimSpeed: racialBaseStats.swimSpeed, // Start with racial base, will be calculated from moveSpeed if 0
        climbSpeed: racialBaseStats.climbSpeed, // Start with racial base, will be calculated from moveSpeed if 0
        passivePerception: racialBaseStats.passivePerception + (equipmentBonuses.passivePerception || 0) + (skillBonuses.passivePerception || 0),
        visionRange: racialBaseStats.visionRange + (equipmentBonuses.visionRange || 0) + (skillBonuses.visionRange || 0),
        darkvision: racialBaseStats.darkvision + (equipmentBonuses.darkvision || 0) + (skillBonuses.darkvision || 0),
        initiative: racialBaseStats.initiative + (equipmentBonuses.initiative || 0) + (skillBonuses.initiative || 0),
        actionPoints: racialBaseStats.ap + (equipmentBonuses.actionPoints || 0) + (skillBonuses.actionPoints || 0),
        carryingCapacity: calculateCarryingCapacity(modifiedStats.strength, equipmentBonuses.carryingCapacity || 0),
        encumbranceEffects: encumbranceEffects
    };

    // Apply equipment bonuses (but skip stats that are already handled above)
    const alreadyHandledStats = ['maxHealth', 'maxMana', 'healthRegen', 'manaRegen', 'healingPower', 'maxHealthPercent', 'maxManaPercent', 'healthRegenPercent', 'manaRegenPercent', 'healingPowerPercent'];
    for (const stat in equipmentBonuses) {
        if (derivedStats.hasOwnProperty(stat) && !alreadyHandledStats.includes(stat)) {
            derivedStats[stat] += equipmentBonuses[stat];
        }
    }

    // Apply additional skill bonuses that don't map to derived stats
    for (const stat in skillBonuses) {
        if (derivedStats.hasOwnProperty(stat) && !['strength', 'constitution', 'agility', 'intelligence', 'spirit', 'charisma', 'maxHealth', 'manaPool', 'spellPower', 'armor', 'movementSpeed'].includes(stat)) {
            derivedStats[stat] = (derivedStats[stat] || 0) + skillBonuses[stat];
        }
    }

    // Apply movement speed penalties for encumbrance
    switch (encumbranceStatus) {
        case 'encumbered':
            // Speed -25% (specific penalty for movement)
            derivedStats.moveSpeed = Math.floor(derivedStats.moveSpeed * 0.75);
            break;

        case 'overencumbered':
            // Speed -75% (specific penalty for movement)
            derivedStats.moveSpeed = Math.floor(derivedStats.moveSpeed * 0.25);
            break;
    }

    // Apply exhaustion effects (cumulative)
    // Level 2: Speed halved (applies to movement speed, swim and climb will be calculated after)
    if (exhaustionLevel >= 2) {
        derivedStats.moveSpeed = Math.floor(derivedStats.moveSpeed * 0.5);
    }

    // Level 4: HP maximum halved (applied after all other HP calculations)
    if (exhaustionLevel >= 4) {
        derivedStats.maxHealth = Math.floor(derivedStats.maxHealth * 0.5);
    }

    // Level 5: Speed reduced to 0 (this overrides everything, including level 2's halving)
    // This MUST happen after level 2's halving to override it
    if (exhaustionLevel >= 5) {
        derivedStats.moveSpeed = 0;
    }

    // Calculate swim and climb speeds based on final movement speed (after all exhaustion effects)
    // Only if racial base was 0 (meaning it should be calculated from moveSpeed)
    if (racialBaseStats.swimSpeed === 0) {
        // Swim speed = 1/3 of movement speed
        derivedStats.swimSpeed = Math.floor(derivedStats.moveSpeed / 3);
    }
    if (racialBaseStats.climbSpeed === 0) {
        // Climb speed = 1/2 of movement speed
        derivedStats.climbSpeed = Math.floor(derivedStats.moveSpeed / 2);
    }
    
    // Apply skill bonuses to swim and climb if present (only if not exhausted to 0)
    if (skillBonuses.swimSpeed && derivedStats.moveSpeed > 0) {
        derivedStats.swimSpeed += skillBonuses.swimSpeed;
    }
    if (skillBonuses.climbSpeed && derivedStats.moveSpeed > 0) {
        derivedStats.climbSpeed += skillBonuses.climbSpeed;
    }

    // Store exhaustion effects for reference
    derivedStats.exhaustionEffects = {
        hasDisadvantageOnAbilityChecks: exhaustionLevel >= 1,
        hasDisadvantageOnAttackRolls: exhaustionLevel >= 3,
        hasDisadvantageOnSavingThrows: exhaustionLevel >= 3,
        isDead: exhaustionLevel >= 6
    };

    // Apply conditional passives based on health thresholds
    if (health && race && subrace) {
        const healthPercentage = (health.current / health.max) * 100;
        
        // Import dynamically to avoid circular dependency
        const raceDisciplineSpellUtils = require('./raceDisciplineSpellUtils');
        const passiveModifiers = raceDisciplineSpellUtils.getRacialStatModifiers(race, subrace);
        
        // Check each passive for health threshold conditions
        passiveModifiers.forEach(passive => {
            if (!passive.triggerConfig?.global?.compoundTriggers) return;
            
            // Find health threshold trigger
            const healthTrigger = passive.triggerConfig.global.compoundTriggers.find(t => t.id === 'health_threshold');
            if (!healthTrigger?.parameters) return;
            
            const threshold = healthTrigger.parameters.percentage;
            const comparison = healthTrigger.parameters.comparison;
            if (!threshold || !comparison) return;
            
            // Check if condition is met
            let conditionMet = false;
            if (comparison === 'less_than' || comparison === 'below') {
                conditionMet = healthPercentage <= threshold;
            } else if (comparison === 'greater_than' || comparison === 'above') {
                conditionMet = healthPercentage >= threshold;
            } else if (comparison === 'equal' || comparison === 'exactly') {
                conditionMet = Math.abs(healthPercentage - threshold) < 1; // Within 1%
            }
            
            // Apply passive effects if condition is met
            if (conditionMet && passive.buffConfig?.effects) {
                passive.buffConfig.effects.forEach(effect => {
                    if (effect.statModifier) {
                        const statName = effect.statModifier.stat;
                        const magnitude = effect.statModifier.magnitude;
                        
                        // Apply stat modifiers to derived stats
                        if (statName === 'slashing_damage') {
                            derivedStats.slashingDamage = (derivedStats.slashingDamage || 0) + magnitude;
                        } else if (statName === 'bludgeoning_damage') {
                            derivedStats.bludgeoningDamage = (derivedStats.bludgeoningDamage || 0) + magnitude;
                        } else if (statName === 'piercing_damage') {
                            derivedStats.piercingDamage = (derivedStats.piercingDamage || 0) + magnitude;
                        } else if (statName === 'ranged_damage') {
                            derivedStats.rangedDamage = (derivedStats.rangedDamage || 0) + magnitude;
                        } else if (statName === 'armor') {
                            derivedStats.armor = (derivedStats.armor || 0) + magnitude;
                        } else if (statName === 'saving_throws') {
                            derivedStats.savingThrowPenalty = (derivedStats.savingThrowPenalty || 0) + magnitude;
                        } else if (statName === 'damage') {
                            derivedStats.damage = (derivedStats.damage || 0) + magnitude;
                        } else if (statName === 'spell_damage') {
                            derivedStats.spellDamage = (derivedStats.spellDamage || 0) + magnitude;
                        } else if (statName === 'movement_speed' || statName === 'moveSpeed' || statName === 'speed') {
                            // Handle movement speed modifiers (can be negative for penalties)
                            derivedStats.moveSpeed = (derivedStats.moveSpeed || 30) + magnitude;
                            // Ensure speed doesn't go below 0
                            derivedStats.moveSpeed = Math.max(0, derivedStats.moveSpeed);
                        }
                        // Add more stat mappings as needed
                    }
                });
            }
        });
    }

    return derivedStats;
}

/**
 * Get exhaustion-based disadvantage flags
 * @param {number} exhaustionLevel - Current exhaustion level (0-6)
 * @returns {Object} Object with flags for disadvantage types
 */
export function getExhaustionDisadvantages(exhaustionLevel = 0) {
    return {
        abilityChecks: exhaustionLevel >= 1, // Level 1+
        attackRolls: exhaustionLevel >= 3,    // Level 3+
        savingThrows: exhaustionLevel >= 3    // Level 3+
    };
}

/**
 * Check if a character should have disadvantage on ability checks due to exhaustion
 * @param {number} exhaustionLevel - Current exhaustion level
 * @returns {boolean} True if disadvantage applies
 */
export function hasExhaustionDisadvantageOnAbilityChecks(exhaustionLevel = 0) {
    return exhaustionLevel >= 1;
}

/**
 * Check if a character should have disadvantage on attack rolls due to exhaustion
 * @param {number} exhaustionLevel - Current exhaustion level
 * @returns {boolean} True if disadvantage applies
 */
export function hasExhaustionDisadvantageOnAttackRolls(exhaustionLevel = 0) {
    return exhaustionLevel >= 3;
}

/**
 * Check if a character should have disadvantage on saving throws due to exhaustion
 * @param {number} exhaustionLevel - Current exhaustion level
 * @returns {boolean} True if disadvantage applies
 */
export function hasExhaustionDisadvantageOnSavingThrows(exhaustionLevel = 0) {
    return exhaustionLevel >= 3;
}

export function rollDice(numberOfDice, diceType) {
    let total = 0;
    let rolls = [];
    for (let i = 0; i < numberOfDice; i++) {
        const roll = Math.floor(Math.random() * diceType) + 1;
        rolls.push(roll);
        total += roll;
    }
    return { total, rolls };
}

export function calculateStatModifier(statValue) {
    return Math.floor((statValue - 10) / 2);
}

export function debounce(func, delay) {
    let debounceTimer;
    return function (...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
}

// Calculate carrying capacity based on strength and equipment bonuses
// Base: 5x5 (25 slots) for each section (normal, encumbered, overencumbered)
// Custom inventory progression: +/-1 row every 2 strength points from base 10-11
// 8-9 str = 4 rows, 10-11 str = 5 rows, 12-13 str = 6 rows, 14-15 str = 7 rows, etc.
export function calculateCarryingCapacity(strength, equipmentBonus = 0) {
    const baseRowsPerSection = 5; // Base for strength 10-11

    // Custom progression: strength 10-11 = base (5 rows)
    // Every 2 points above 11 adds 1 row, every 2 points below 10 removes 1 row
    let additionalRows = 0;

    if (strength >= 12) {
        // 12-13 = +1, 14-15 = +2, etc.
        additionalRows = Math.floor((strength - 10) / 2);
    } else if (strength <= 9) {
        // 8-9 = -1, 6-7 = -2, etc.
        additionalRows = Math.floor((strength - 10) / 2); // This will be negative
    }
    // strength 10-11 gets additionalRows = 0

    // Minimum of 1 row per section, even with very low strength
    const rowsPerSection = Math.max(1, baseRowsPerSection + additionalRows);
    const slotsPerRow = 5;
    const sectionsCount = 3; // normal, encumbered, overencumbered

    const totalSlots = rowsPerSection * slotsPerRow * sectionsCount;

    logger.debug('🎒 Carrying capacity calculation:', {
        strength,
        baseRowsPerSection,
        additionalRows,
        rowsPerSection,
        totalSlots,
        equipmentBonus,
        finalCapacity: totalSlots + equipmentBonus,
        expectedGrid: `${rowsPerSection}x15`
    });

    // Add equipment bonus (individual slots)
    return totalSlots + equipmentBonus;
}

// Get inventory grid dimensions based on carrying capacity
export function getInventoryGridDimensions(carryingCapacity) {
    const slotsPerRow = 5;
    const sectionsCount = 3;
    const totalColumns = slotsPerRow * sectionsCount; // Always 15 columns (5 per section)

    // Calculate total slots per section based on carrying capacity
    // Each encumbrance level gets equal slots
    const slotsPerSection = Math.ceil(carryingCapacity / sectionsCount);

    // Calculate rows per section (minimum 5 rows, then add based on strength)
    const rowsPerSection = Math.ceil(slotsPerSection / slotsPerRow);

    logger.debug('📐 Grid dimensions calculation:', {
        carryingCapacity,
        slotsPerSection,
        rowsPerSection,
        totalColumns,
        finalDimensions: `${rowsPerSection}x${totalColumns}`
    });

    return {
        WIDTH: totalColumns, // Always 15 columns (5 normal + 5 encumbered + 5 overencumbered)
        HEIGHT: rowsPerSection, // This increases with strength modifier
        NORMAL_SECTION: slotsPerRow, // Always 5 columns for normal section
        ENCUMBERED_SECTION: slotsPerRow, // Always 5 columns for encumbered section
        OVERENCUMBERED_SECTION: slotsPerRow, // Always 5 columns for overencumbered section
        ROWS_PER_SECTION: rowsPerSection
    };
}
