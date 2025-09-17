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
        spellDamageTypes: {},
        immunities: [], // Add immunities array
        skills: {}
    };

    // Loop over each equipped item
    for (const slot in equipment) {
        const item = equipment[slot];
        if (!item) continue;

        // Handle legacy effects structure
        if (item.effects) {
            for (const [key, val] of Object.entries(item.effects)) {
                if (typeof val === 'number') {
                    bonuses[key] = (bonuses[key] || 0) + val;
                    continue;
                }

                if (key === 'resistances' && typeof val === 'object') {
                    for (const [resType, resVal] of Object.entries(val)) {
                        bonuses.resistances[resType] =
                            (bonuses.resistances[resType] || 0) + resVal;
                    }
                }
                else if (key === 'spellDamageTypes' && typeof val === 'object') {
                    for (const [spellType, amount] of Object.entries(val)) {
                        bonuses.spellDamageTypes[spellType] =
                            (bonuses.spellDamageTypes[spellType] || 0) + amount;
                    }
                }
                else if (key === 'skills' && typeof val === 'object') {
                    for (const [skillKey, skillVal] of Object.entries(val)) {
                        bonuses.skills[skillKey] =
                            (bonuses.skills[skillKey] || 0) + skillVal;
                    }
                }
            }
        }

        // Handle new item structure with baseStats, combatStats, utilityStats
        if (item.baseStats) {
            for (const [stat, statData] of Object.entries(item.baseStats)) {
                const value = typeof statData === 'object' ? statData.value : statData;
                if (typeof value === 'number') {
                    // Map stat names to bonus keys
                    const statMap = {
                        strength: 'str',
                        constitution: 'con',
                        agility: 'agi',
                        intelligence: 'int',
                        spirit: 'spir',
                        charisma: 'cha'
                    };
                    const bonusKey = statMap[stat] || stat;
                    bonuses[bonusKey] = (bonuses[bonusKey] || 0) + value;
                }
            }
        }

        if (item.combatStats) {
            for (const [stat, statData] of Object.entries(item.combatStats)) {
                // Handle spell damage types specifically
                if (stat === 'spellDamage' && statData.types) {
                    for (const [spellType, spellData] of Object.entries(statData.types)) {
                        const value = typeof spellData === 'object' ? spellData.value : spellData;
                        if (typeof value === 'number') {
                            bonuses.spellDamageTypes[spellType] = (bonuses.spellDamageTypes[spellType] || 0) + value;
                        }
                    }
                    continue;
                }

                // Handle resistances specifically
                if (stat === 'resistances' && typeof statData === 'object') {
                    for (const [resType, resData] of Object.entries(statData)) {
                        const value = typeof resData === 'object' ? resData.value : resData;
                        if (typeof value === 'number') {
                            bonuses.resistances[resType] = (bonuses.resistances[resType] || 0) + value;
                        }
                    }
                    continue;
                }

                // Handle regular combat stats
                const value = typeof statData === 'object' ? statData.value : statData;
                const isPercentage = typeof statData === 'object' ? statData.isPercentage : false;

                if (typeof value === 'number') {
                    // Map combat stat names to bonus keys
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
            }
        }

        if (item.utilityStats) {
            for (const [stat, statData] of Object.entries(item.utilityStats)) {
                const value = typeof statData === 'object' ? statData.value : statData;
                if (typeof value === 'number') {
                    // Map utility stat names to bonus keys
                    const statMap = {
                        movementSpeed: 'moveSpeed',
                        carryingCapacity: 'carryingCapacity'
                    };
                    const bonusKey = statMap[stat] || stat;
                    bonuses[bonusKey] = (bonuses[bonusKey] || 0) + value;
                }
            }
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
        const spellDamageTypes = ['fire', 'frost', 'arcane', 'shadow', 'holy', 'nature', 'lightning', 'cold', 'acid', 'force', 'thunder'];
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

        // Handle top-level armorClass property (for legacy items)
        if (item.armorClass && typeof item.armorClass === 'number') {
            bonuses.armor = (bonuses.armor || 0) + item.armorClass;
        }
    }


    return bonuses;
}

export function calculateDerivedStats(totalStats, equipmentBonuses = {}, skillBonuses = {}, encumbranceStatus = 'normal') {
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
    let baseHealthRegen = Math.floor(modifiedStats.constitution / 2);
    let baseManaRegen = Math.floor((modifiedStats.intelligence + modifiedStats.spirit) / 4);
    let baseHealingPower = Math.floor(modifiedStats.spirit / 2);

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

    let derivedStats = {
        maxHealth: baseMaxHealth,
        maxMana: baseMaxMana,
        healthRegen: baseHealthRegen,
        manaRegen: baseManaRegen,
        damage: Math.floor(modifiedStats.strength / 2) + (equipmentBonuses.damage || 0),
        spellDamage: Math.floor(modifiedStats.intelligence / 2) + (equipmentBonuses.spellDamage || 0) + (skillBonuses.spellPower || 0),
        healingPower: baseHealingPower,
        rangedDamage: Math.floor(modifiedStats.agility / 2) + (equipmentBonuses.rangedDamage || 0),
        armor: Math.floor(modifiedStats.agility / 2) + (equipmentBonuses.armor || 0) + (skillBonuses.armor || 0),
        moveSpeed: 30 + (skillBonuses.movementSpeed || 0),
        swimSpeed: 10 + (skillBonuses.swimSpeed || 0),
        climbSpeed: 15 + (skillBonuses.climbSpeed || 0),
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
            derivedStats.swimSpeed = Math.floor(derivedStats.swimSpeed * 0.95);
            derivedStats.climbSpeed = Math.floor(derivedStats.climbSpeed * 0.95);
            break;

        case 'overencumbered':
            // Speed -75% (specific penalty for movement)
            derivedStats.moveSpeed = Math.floor(derivedStats.moveSpeed * 0.25);
            derivedStats.swimSpeed = Math.floor(derivedStats.swimSpeed * 0.85);
            derivedStats.climbSpeed = Math.floor(derivedStats.climbSpeed * 0.85);
            break;
    }

    return derivedStats;
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

    console.log('🎒 Carrying capacity calculation:', {
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

    console.log('📐 Grid dimensions calculation:', {
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
