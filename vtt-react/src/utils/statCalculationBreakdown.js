/**
 * Stat Calculation Breakdown Utility
 * Computes transparent math component breakdowns for all Attributes and Derived Stats
 * used in hover tooltips across the Character Sheet and Info Panels.
 */

import { getFullRaceData, getRacialBaseStats } from '../data/raceData';
import { calculateEquipmentBonuses } from './characterUtils';

const STAT_MAPPING = {
    str: 'strength',
    strength: 'strength',
    agi: 'agility',
    agility: 'agility',
    con: 'constitution',
    constitution: 'constitution',
    int: 'intelligence',
    intelligence: 'intelligence',
    spi: 'spirit',
    spir: 'spirit',
    spirit: 'spirit',
    cha: 'charisma',
    charisma: 'charisma'
};

const SHORT_TO_FULL = {
    str: 'strength',
    agi: 'agility',
    con: 'constitution',
    int: 'intelligence',
    spir: 'spirit',
    cha: 'charisma'
};

const FULL_TO_SHORT = {
    strength: 'str',
    agility: 'agi',
    constitution: 'con',
    intelligence: 'int',
    spirit: 'spir',
    charisma: 'cha'
};

/**
 * Computes the breakdown components for a primary attribute (STR, AGI, CON, INT, SPI, CHA)
 */
export function getAttributeBreakdown(statKey, character = {}) {
    const fullName = STAT_MAPPING[statKey.toLowerCase()] || statKey.toLowerCase();
    const shortName = FULL_TO_SHORT[fullName] || 'str';

    const {
        stats = {},
        equipment = {},
        race = null,
        subrace = null,
        levelUpHistory = {},
        activeEffects = {},
        encumbranceState = 'normal',
        exhaustionLevel = 0,
        talents = []
    } = character;

    // 1. Racial Modifiers
    let racialBonus = 0;
    let racialName = '';
    if (race && subrace) {
        try {
            const raceData = getFullRaceData(race, subrace);
            if (raceData) {
                racialName = raceData.subrace?.name || raceData.race?.name || 'Racial';
                const modifiers = raceData.combinedTraits?.statModifiers || {};
                racialBonus = modifiers[fullName] || modifiers[shortName] || 0;
            }
        } catch (e) {
            console.warn('Error fetching racial modifiers for', race, subrace, e);
        }
    }

    // 2. Level-Up Increases from History
    let levelUpBonus = 0;
    if (levelUpHistory && typeof levelUpHistory === 'object') {
        Object.values(levelUpHistory).forEach(entry => {
            if (entry?.attributes && Array.isArray(entry.attributes)) {
                entry.attributes.forEach(attr => {
                    if (attr === fullName || attr === shortName) {
                        levelUpBonus += 1;
                    }
                });
            }
            if (entry?.statChoice === fullName || entry?.statChoice === shortName) {
                levelUpBonus += (entry.statIncrease || 1);
            }
        });
    }

    // 3. Equipment Bonuses
    const eqBonuses = calculateEquipmentBonuses(equipment);
    const equipmentBonus = (eqBonuses && (eqBonuses[shortName] || eqBonuses[fullName])) || 0;

    // 4. Talents / Passives
    let talentBonus = 0;
    if (Array.isArray(talents)) {
        talents.forEach(t => {
            if (t?.statModifiers?.[fullName]) talentBonus += t.statModifiers[fullName];
            if (t?.statModifiers?.[shortName]) talentBonus += t.statModifiers[shortName];
        });
    }

    // 5. Active Buffs & Debuffs
    let buffBonus = 0;
    let debuffBonus = 0;
    if (activeEffects) {
        const buffs = activeEffects.buffs || activeEffects.buff || [];
        const debuffs = activeEffects.debuffs || activeEffects.debuff || [];

        if (Array.isArray(buffs)) {
            buffs.forEach(b => {
                if (b?.stat === fullName || b?.stat === shortName || b?.type === fullName) {
                    buffBonus += (b.value || b.amount || 0);
                }
            });
        }
        if (Array.isArray(debuffs)) {
            debuffs.forEach(d => {
                if (d?.stat === fullName || d?.stat === shortName || d?.type === fullName) {
                    debuffBonus += Math.abs(d.value || d.amount || 0);
                }
            });
        }
    }

    // 6. Base creation stat
    const rawStoredStat = stats[fullName] ?? stats[shortName] ?? 10;
    const computedBase = Math.max(1, rawStoredStat);

    // 7. Encumbrance Effect
    let encumbranceMultiplier = 1.0;
    let encumbranceDesc = '';
    if (encumbranceState === 'encumbered') {
        if (fullName === 'strength' || fullName === 'constitution') {
            encumbranceMultiplier = 1.05;
            encumbranceDesc = 'Encumbered (+5%)';
        } else {
            encumbranceMultiplier = 0.95;
            encumbranceDesc = 'Encumbered (-5%)';
        }
    } else if (encumbranceState === 'overencumbered') {
        if (fullName === 'strength' || fullName === 'constitution') {
            encumbranceMultiplier = 1.15;
            encumbranceDesc = 'Overencumbered (+15%)';
        } else {
            encumbranceMultiplier = 0.85;
            encumbranceDesc = 'Overencumbered (-15%)';
        }
    }

    const preEncumbrance = computedBase + racialBonus + levelUpBonus + equipmentBonus + talentBonus + buffBonus - debuffBonus;
    const encumbranceEffect = Math.round(preEncumbrance * encumbranceMultiplier) - preEncumbrance;

    const finalValue = Math.max(1, preEncumbrance + encumbranceEffect);
    const modifier = Math.floor((finalValue - 10) / 2);

    return {
        stat: fullName,
        base: computedBase,
        racial: racialBonus,
        racialName: racialName,
        levelUp: levelUpBonus,
        equipment: equipmentBonus,
        talents: talentBonus,
        buffs: buffBonus,
        debuffs: debuffBonus ? -debuffBonus : 0,
        encumbrance: encumbranceEffect,
        encumbranceDescription: encumbranceDesc,
        exhaustionLevel: exhaustionLevel,
        finalValue,
        modifier
    };
}

/**
 * Computes the breakdown components for Derived and Combat Stats
 */
export function getDerivedStatBreakdown(statName, character = {}) {
    const {
        stats = {},
        equipment = {},
        race = null,
        subrace = null,
        levelUpHistory = {},
        activeEffects = {},
        encumbranceState = 'normal',
        exhaustionLevel = 0,
        talents = []
    } = character;

    const strBreakdown = getAttributeBreakdown('strength', character);
    const agiBreakdown = getAttributeBreakdown('agility', character);
    const conBreakdown = getAttributeBreakdown('constitution', character);
    const intBreakdown = getAttributeBreakdown('intelligence', character);
    const spiBreakdown = getAttributeBreakdown('spirit', character);

    const eqBonuses = calculateEquipmentBonuses(equipment);

    let racialBase = {
        speed: 30,
        hp: 0,
        mana: 0,
        passivePerception: 10,
        initiative: 0
    };

    if (race && subrace) {
        try {
            racialBase = { ...racialBase, ...getRacialBaseStats(race, subrace) };
        } catch (e) {
            console.warn('Could not load racial base stats for derived breakdown:', e);
        }
    }

    switch (statName.toLowerCase()) {
        case 'max health':
        case 'maxhealth':
        case 'health': {
            const fromCon = conBreakdown.finalValue * 5;
            let levelUpHP = 0;
            if (levelUpHistory) {
                Object.values(levelUpHistory).forEach(e => {
                    levelUpHP += (e.healthIncrease || 0);
                });
            }
            const eqHP = eqBonuses.maxHealth || 0;
            let buffHP = 0;
            if (activeEffects?.buffs) {
                activeEffects.buffs.forEach(b => {
                    if (b?.stat === 'maxHealth' || b?.type === 'maxHealth') buffHP += (b.value || 0);
                });
            }

            let calculated = fromCon + racialBase.hp + levelUpHP + eqHP + buffHP;
            let exhaustionHalved = false;
            if (exhaustionLevel >= 4) {
                exhaustionHalved = true;
                calculated = Math.floor(calculated / 2);
            }

            return {
                stat: 'Max Health',
                description: 'Calculated from Constitution (CON × 5), racial resilience, level gains, and equipment.',
                baseValue: fromCon,
                baseLabel: `CON (${conBreakdown.finalValue}) × 5`,
                racial: racialBase.hp,
                racialLabel: 'Racial base',
                levelUp: levelUpHP,
                equipment: eqHP,
                buffs: buffHP,
                exhaustionEffect: exhaustionHalved ? 'HP Halved (Exhaustion Lvl 4+)' : null,
                finalValue: calculated
            };
        }

        case 'max mana':
        case 'maxmana':
        case 'mana': {
            const fromInt = intBreakdown.finalValue * 5;
            let levelUpMana = 0;
            if (levelUpHistory) {
                Object.values(levelUpHistory).forEach(e => {
                    levelUpMana += (e.manaIncrease || 0);
                });
            }
            const eqMana = eqBonuses.maxMana || 0;
            let buffMana = 0;
            if (activeEffects?.buffs) {
                activeEffects.buffs.forEach(b => {
                    if (b?.stat === 'maxMana' || b?.type === 'maxMana') buffMana += (b.value || 0);
                });
            }

            let calculated = fromInt + racialBase.mana + levelUpMana + eqMana + buffMana;
            let exhaustionHalved = false;
            if (exhaustionLevel >= 5) {
                exhaustionHalved = true;
                calculated = Math.floor(calculated / 2);
            }

            return {
                stat: 'Max Mana',
                description: 'Calculated from Intelligence (INT × 5), ancestral mana affinity, level gains, and equipment.',
                baseValue: fromInt,
                baseLabel: `INT (${intBreakdown.finalValue}) × 5`,
                racial: racialBase.mana,
                racialLabel: 'Racial base',
                levelUp: levelUpMana,
                equipment: eqMana,
                buffs: buffMana,
                exhaustionEffect: exhaustionHalved ? 'Mana Halved (Exhaustion Lvl 5+)' : null,
                finalValue: calculated
            };
        }

        case 'initiative': {
            const fromAgi = agiBreakdown.modifier;
            const eqInit = eqBonuses.initiative || 0;
            const finalInit = fromAgi + racialBase.initiative + eqInit;

            return {
                stat: 'Initiative',
                description: 'Determines turn order in combat. Driven primarily by Agility modifier.',
                baseValue: fromAgi,
                baseLabel: `AGI Modifier (+${fromAgi >= 0 ? fromAgi : `-${Math.abs(fromAgi)}`})`,
                racial: racialBase.initiative,
                equipment: eqInit,
                finalValue: finalInit
            };
        }

        case 'movement':
        case 'movementspeed':
        case 'speed': {
            let baseSpeed = racialBase.speed || 30;
            const eqSpeed = eqBonuses.movementSpeed || 0;
            let encPenalty = 0;
            if (encumbranceState === 'encumbered') encPenalty = -10;
            else if (encumbranceState === 'overencumbered') encPenalty = -20;

            let currentSpeed = baseSpeed + eqSpeed + encPenalty;
            let exhDesc = null;
            if (exhaustionLevel >= 6) {
                currentSpeed = 0;
                exhDesc = 'Speed 0 (Exhaustion Lvl 6)';
            } else if (exhaustionLevel >= 2) {
                currentSpeed = Math.floor(currentSpeed / 2);
                exhDesc = 'Speed Halved (Exhaustion Lvl 2+)';
            }

            return {
                stat: 'Movement Speed',
                description: 'Distance your character can travel per round in tactical grid combat.',
                baseValue: baseSpeed,
                baseLabel: 'Racial Base Speed',
                equipment: eqSpeed,
                encumbrance: encPenalty,
                encumbranceDescription: encPenalty ? `Encumbrance (${encPenalty} ft)` : null,
                exhaustionEffect: exhDesc,
                finalValue: `${currentSpeed} ft`
            };
        }

        case 'healing power':
        case 'healingpower': {
            const sMod = Math.max(0, spiBreakdown.modifier);
            const baseHealing = sMod * 2;
            const eqHealing = eqBonuses.healingPower || 0;

            return {
                stat: 'Healing Power',
                description: 'Bonus points restored by healing spells and abilities (Spirit Mod × 2).',
                baseValue: baseHealing,
                baseLabel: `Spirit (${sMod}) × 2`,
                equipment: eqHealing,
                finalValue: baseHealing + eqHealing
            };
        }

        case 'mana regen':
        case 'manaregen': {
            const sMod = Math.max(0, spiBreakdown.modifier);
            const iMod = Math.max(0, Math.floor(intBreakdown.modifier / 2));
            const baseRegen = sMod > 0 ? (sMod * 2) + iMod : 0;
            const eqRegen = eqBonuses.manaRegen || 0;

            return {
                stat: 'Mana Regen',
                description: 'Mana points recovered at the start of each turn. Gates on Spirit (Spirit × 2 + INT / 2).',
                baseValue: baseRegen,
                baseLabel: `Spirit (${sMod}×2) + INT (${iMod})`,
                equipment: eqRegen,
                finalValue: `${baseRegen + eqRegen}/turn`
            };
        }

        case 'health regen':
        case 'healthregen': {
            const sMod = Math.max(0, spiBreakdown.modifier);
            const cMod = Math.max(0, Math.floor(conBreakdown.modifier / 2));
            const baseRegen = sMod > 0 ? (sMod * 2) + cMod : 0;
            const eqRegen = eqBonuses.healthRegen || 0;

            return {
                stat: 'Health Regen',
                description: 'Health points recovered at the start of each turn. Gates on Spirit (Spirit × 2 + CON / 2).',
                baseValue: baseRegen,
                baseLabel: `Spirit (${sMod}×2) + CON (${cMod})`,
                equipment: eqRegen,
                finalValue: `${baseRegen + eqRegen}/turn`
            };
        }

        case 'passive perception':
        case 'passiveperception': {
            const sMod = spiBreakdown.modifier;
            const racialBonus = racialBase.passivePerception > 10 ? (racialBase.passivePerception - 10) : 0;
            const eqPerc = eqBonuses.passivePerception || 0;
            const finalVal = 10 + sMod + racialBonus + eqPerc;

            const details = [
                'Base: 10',
                `Spirit modifier (${sMod >= 0 ? `+${sMod}` : sMod}): ${sMod >= 0 ? `+${sMod}` : sMod}`
            ];
            if (racialBonus > 0) details.push(`Racial bonus: +${racialBonus}`);
            if (eqPerc !== 0) details.push(`Equipment: ${eqPerc > 0 ? `+${eqPerc}` : eqPerc}`);

            const calcParts = ['Base 10 (base)'];
            if (sMod !== 0) calcParts.push(`${sMod >= 0 ? `+${sMod}` : sMod} (Spirit mod)`);
            if (racialBonus > 0) calcParts.push(`+${racialBonus} (racial)`);
            if (eqPerc !== 0) calcParts.push(`${eqPerc > 0 ? `+${eqPerc}` : eqPerc} (gear)`);

            return {
                stat: 'Passive Perception',
                description: 'Base awareness for detecting hidden traps, stealthy creatures, and ambushes without an active check.',
                baseValue: 10,
                baseLabel: 'Base 10',
                racial: racialBonus,
                modifier: sMod,
                modifierLabel: `Spirit (${sMod >= 0 ? `+${sMod}` : sMod})`,
                equipment: eqPerc,
                details,
                customCalculation: `${calcParts.join(' ')} = ${finalVal}`,
                finalValue: finalVal
            };
        }

        case 'melee damage':
        case 'meleedamage': {
            const mainHand = equipment?.mainHand;
            const strMod = strBreakdown.modifier;
            const agiMod = agiBreakdown.modifier;

            let diceCount = 1;
            let diceType = 4;
            let damageType = 'smashing';
            let weaponBonus = 0;

            if (mainHand?.weaponStats?.baseDamage) {
                diceCount = mainHand.weaponStats.baseDamage.diceCount || 1;
                diceType = mainHand.weaponStats.baseDamage.diceType || 4;
                damageType = (mainHand.weaponStats.baseDamage.damageType || 'smashing').toLowerCase();
                weaponBonus = Number(mainHand.weaponStats.baseDamage.bonusDamage || 0);
            }

            const cleanDice = String(diceType).replace(/^d+/i, '');
            const diceFormula = `${diceCount}d${cleanDice}`;

            let statMod = 0;
            let scalingLabel = '';
            switch (damageType) {
                case 'stabbing':
                case 'piercing':
                    statMod = agiMod * 2;
                    scalingLabel = `Agility modifier (${agiMod >= 0 ? `+${agiMod}` : agiMod}) × 2 = ${statMod >= 0 ? `+${statMod}` : statMod}`;
                    break;
                case 'slicing':
                case 'slashing':
                    statMod = strMod + agiMod;
                    scalingLabel = `STR (${strMod >= 0 ? `+${strMod}` : strMod}) + AGI (${agiMod >= 0 ? `+${agiMod}` : agiMod}) = ${statMod >= 0 ? `+${statMod}` : statMod}`;
                    break;
                case 'smashing':
                case 'bludgeoning':
                default:
                    statMod = strMod * 2;
                    scalingLabel = `Strength modifier (${strMod >= 0 ? `+${strMod}` : strMod}) × 2 = ${statMod >= 0 ? `+${statMod}` : statMod}`;
                    break;
            }

            const otherEqDamage = Math.max(0, (eqBonuses.damage || 0) - weaponBonus) + (eqBonuses[`${damageType}Damage`] || 0);
            const totalMod = statMod + weaponBonus + otherEqDamage;
            const modSign = totalMod >= 0 ? `+ ${totalMod}` : `- ${Math.abs(totalMod)}`;
            const finalString = `${diceFormula} ${modSign}`;

            const details = [
                `Weapon: ${mainHand?.name || 'Unarmed'} (${diceFormula} ${damageType.charAt(0).toUpperCase() + damageType.slice(1)} Damage)`,
                `Attribute Scaling: ${scalingLabel}`
            ];
            if (weaponBonus !== 0) {
                details.push(`Weapon Bonus: ${weaponBonus > 0 ? `+${weaponBonus}` : weaponBonus} (${mainHand?.name || 'Weapon'} enchantment/stat bonus)`);
            }
            if (otherEqDamage !== 0) {
                details.push(`Other Equipment: ${otherEqDamage > 0 ? `+${otherEqDamage}` : otherEqDamage}`);
            }

            const calcParts = [`${diceFormula} (base dice)`, `${statMod >= 0 ? `+${statMod}` : statMod} (${scalingLabel.split('=')[0].trim()})`];
            if (weaponBonus !== 0) calcParts.push(`${weaponBonus > 0 ? `+${weaponBonus}` : weaponBonus} (weapon bonus)`);
            if (otherEqDamage !== 0) calcParts.push(`${otherEqDamage > 0 ? `+${otherEqDamage}` : otherEqDamage} (gear)`);

            return {
                stat: 'Melee Damage',
                description: 'Physical weapon attack power. Derived from weapon dice + physical attribute modifier (STR for Smashing, AGI for Stabbing, STR/AGI for Slicing) + weapon and gear bonuses.',
                baseValue: 0,
                baseLabel: diceFormula,
                finalValue: finalString,
                details,
                customCalculation: `${calcParts.join(' ')} = ${finalString}`
            };
        }

        case 'ranged damage':
        case 'rangeddamage': {
            const ranged = equipment?.ranged;
            const agiMod = agiBreakdown.modifier;

            if (!ranged) {
                return {
                    stat: 'Ranged Damage',
                    description: 'Ranged weapon attack power. Derived from ranged weapon base dice + Agility modifier.',
                    finalValue: '—',
                    details: ['No ranged weapon equipped']
                };
            }

            let diceCount = 1;
            let diceType = 4;
            let damageType = 'stabbing';
            let weaponBonus = 0;

            if (ranged?.weaponStats?.baseDamage) {
                diceCount = ranged.weaponStats.baseDamage.diceCount || 1;
                diceType = ranged.weaponStats.baseDamage.diceType || 4;
                damageType = (ranged.weaponStats.baseDamage.damageType || 'stabbing').toLowerCase();
                weaponBonus = Number(ranged.weaponStats.baseDamage.bonusDamage || 0);
            }

            const cleanDice = String(diceType).replace(/^d+/i, '');
            const diceFormula = `${diceCount}d${cleanDice}`;
            const statMod = agiMod * 2;
            const scalingLabel = `Agility modifier (${agiMod >= 0 ? `+${agiMod}` : agiMod}) × 2 = ${statMod >= 0 ? `+${statMod}` : statMod}`;

            const otherEqDamage = Math.max(0, (eqBonuses.damage || 0) - weaponBonus) + (eqBonuses.rangedDamage || 0) + (eqBonuses[`${damageType}Damage`] || 0);
            const totalMod = statMod + weaponBonus + otherEqDamage;
            const modSign = totalMod >= 0 ? `+ ${totalMod}` : `- ${Math.abs(totalMod)}`;
            const finalString = `${diceFormula} ${modSign}`;

            const details = [
                `Weapon: ${ranged?.name || 'Ranged Weapon'} (${diceFormula} ${damageType.charAt(0).toUpperCase() + damageType.slice(1)} Damage)`,
                `Attribute Scaling: ${scalingLabel}`
            ];
            if (weaponBonus !== 0) {
                details.push(`Weapon Bonus: ${weaponBonus > 0 ? `+${weaponBonus}` : weaponBonus} (${ranged?.name || 'Weapon'} bonus)`);
            }
            if (otherEqDamage !== 0) {
                details.push(`Other Equipment: ${otherEqDamage > 0 ? `+${otherEqDamage}` : otherEqDamage}`);
            }

            const calcParts = [`${diceFormula} (base dice)`, `${statMod >= 0 ? `+${statMod}` : statMod} (Agility mod × 2)`];
            if (weaponBonus !== 0) calcParts.push(`${weaponBonus > 0 ? `+${weaponBonus}` : weaponBonus} (weapon bonus)`);
            if (otherEqDamage !== 0) calcParts.push(`${otherEqDamage > 0 ? `+${otherEqDamage}` : otherEqDamage} (gear)`);

            return {
                stat: 'Ranged Damage',
                description: 'Ranged weapon attack power. Derived from ranged weapon base dice + Agility modifier + weapon and gear bonuses.',
                baseValue: 0,
                baseLabel: diceFormula,
                finalValue: finalString,
                details,
                customCalculation: `${calcParts.join(' ')} = ${finalString}`
            };
        }

        default:
            return null;
    }
}
