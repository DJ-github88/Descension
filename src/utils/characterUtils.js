export function calculateEquipmentBonuses(equipment = {}) {
    const bonuses = {
        str: 0, con: 0, agi: 0, int: 0, spir: 0, cha: 0,
        damage: 0, armor: 0, healthRegen: 0, manaRegen: 0,
        moveSpeed: 0, critChance: 0, spellDamage: 0, healingPower: 0,
        rangedDamage: 0, carryingCapacity: 0,
        resistances: {},
        spellDamageTypes: {},
        skills: {}
    };

    // Loop over each equipped item
    for (const slot in equipment) {
        const item = equipment[slot];
        if (!item?.effects) continue;

        // Merge item.effects into the bonuses object
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

    return bonuses;
}

export function calculateDerivedStats(totalStats, equipmentBonuses = {}, encumbranceStatus = 'normal') {
    let derivedStats = {
        maxHealth: totalStats.con * 5,
        maxMana: totalStats.int * 5,
        healthRegen: Math.floor(totalStats.con / 2),
        manaRegen: Math.floor((totalStats.int + totalStats.spir) / 4),
        damage: Math.floor(totalStats.str / 2),
        spellDamage: Math.floor(totalStats.int / 2),
        healingPower: Math.floor(totalStats.spir / 2),
        rangedDamage: Math.floor(totalStats.agi / 2),
        armor: Math.floor(totalStats.agi / 2) + (equipmentBonuses.armor || 0),
        critChance: Math.floor(totalStats.agi / 5),
        moveSpeed: 30,
        carryingCapacity: totalStats.str * 15
    };

    // Apply equipment bonuses
    for (const stat in equipmentBonuses) {
        if (derivedStats.hasOwnProperty(stat)) {
            derivedStats[stat] += equipmentBonuses[stat];
        }
    }

    // Apply encumbrance effects
    switch (encumbranceStatus) {
        case 'encumbered':
            derivedStats.moveSpeed = Math.floor(derivedStats.moveSpeed * 0.75);
            derivedStats.healthRegen = Math.floor(derivedStats.healthRegen * 0.5);
            derivedStats.manaRegen = Math.floor(derivedStats.manaRegen * 0.5);
            break;
        case 'overencumbered':
            derivedStats.moveSpeed = Math.floor(derivedStats.moveSpeed * 0.25);
            derivedStats.healthRegen = 0;
            derivedStats.manaRegen = 0;
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
