/**
 * Weapon Action Spells Data
 * 
 * Defines baseline actions and 40 weapon discipline specials for:
 * - Main Hand (Attack 1 AP, Opportunity Attack 1 AP, Parry 1 AP, Riposte 1 AP, Weapon Special 2 AP)
 * - Off Hand (Shield: Raise Shield 1 AP, Defend 1 AP, Interpose 1 AP, Shield Bash 1 AP; Weapon: Off-Hand Strike 1 AP, Parry 1 AP, Riposte 1 AP, Special 2 AP; Unarmed: Strike 1 AP, Shove 1 AP)
 * - Ranged (Ranged Attack 1 AP, Aimed Shot 1 AP, Overwatch 1 AP, Ranged Special 2 AP)
 */

import { getWeaponDamageNotation, getWeaponDamageType, getWeaponRange, getWeaponAttackAttribute } from '../utils/weaponIntegration';
import { WEAPON_TYPE_META } from '../constants/weaponTypeMeta';

/**
 * Identify the weapon discipline key from an equipped item
 * @param {Object} item - The equipped item
 * @returns {string} One of the 40 discipline keys from WEAPON_TYPE_META, or 'shield', or 'unarmed'
 */
export function getWeaponDisciplineKey(item) {
    if (!item) return 'unarmed';

    // If explicit discipline or weaponType is set
    const explicit = (item.discipline || item.weaponType || item.disciplineKey || '').toLowerCase().trim();
    if (explicit && WEAPON_TYPE_META[explicit]) {
        return explicit;
    }

    const subtype = (item.subtype || '').toLowerCase().trim();
    const name = (item.name || '').toLowerCase().trim();

    // Shields
    if (subtype.includes('shield') || subtype.includes('buckler') || name.includes('shield') || name.includes('buckler')) {
        return 'shield';
    }

    // Direct discipline match from subtype
    if (WEAPON_TYPE_META[subtype]) {
        return subtype;
    }

    // Subtype heuristics
    if (subtype.includes('staff') || subtype.includes('quarterstaff')) return 'staff';
    if (subtype.includes('greatsword')) return 'greatsword';
    if (subtype.includes('greataxe')) return 'greataxe';
    if (subtype.includes('maul') || subtype.includes('warhammer') || subtype.includes('hammer')) return 'maul';
    if (subtype.includes('halberd')) return 'halberd';
    if (subtype.includes('scythe')) return 'scythe';
    if (subtype.includes('polearm') || subtype.includes('spear') || subtype.includes('pike') || subtype.includes('glaive')) return 'polearm';
    if (subtype.includes('jousting') || subtype.includes('lance')) return 'jousting spear';
    if (subtype.includes('double') && subtype.includes('sword')) return 'double sided sword';
    if (subtype.includes('bow') && !subtype.includes('cross')) return 'bow';
    if (subtype.includes('crossbow')) return 'crossbow';
    if (subtype.includes('thrown') || subtype.includes('throwing')) return 'thrown';
    if (subtype.includes('wand')) return 'wand';
    if (subtype.includes('blowgun')) return 'blowgun';
    if (subtype.includes('sling')) return 'sling';
    if (subtype.includes('boomerang')) return 'boomerang';
    if (subtype.includes('chakram')) return 'chakram';
    if (subtype.includes('shuriken')) return 'shuriken';
    if (subtype.includes('dart')) return 'dart';
    if (subtype.includes('rapier')) return 'rapier';
    if (subtype.includes('katana')) return 'katana';
    if (subtype.includes('saber') || subtype.includes('sabre')) return 'saber';
    if (subtype.includes('sickle')) return 'sickle';
    if (subtype.includes('flail')) return 'flail';
    if (subtype.includes('fist') || subtype.includes('claw') || subtype.includes('knuckle')) return 'fist weapon';
    if (subtype.includes('parrying')) return 'parrying dagger';
    if (subtype.includes('off hand') || subtype.includes('offhand')) return 'off hand blade';
    if (subtype.includes('war mace')) return 'war mace';
    if (subtype.includes('dagger') || subtype.includes('knife')) return 'dagger';
    if (subtype.includes('axe') || subtype.includes('hatchet')) return 'axe';
    if (subtype.includes('mace') || subtype.includes('club')) return 'mace';
    if (subtype.includes('sword') || subtype.includes('blade')) return 'sword';
    if (subtype.includes('harp')) return 'harp';
    if (subtype.includes('lute')) return 'lute';
    if (subtype.includes('flute')) return 'flute';
    if (subtype.includes('drum')) return 'drum';
    if (subtype.includes('horn')) return 'horn';
    if (subtype.includes('violin') || subtype.includes('fiddle')) return 'violin';
    if (subtype.includes('guitar')) return 'guitar';

    // Name-based fallback heuristics
    for (const key of Object.keys(WEAPON_TYPE_META)) {
        if (name.includes(key)) {
            return key;
        }
    }

    return 'sword';
}

/**
 * 40 Unique, Flavor-Forward Weapon Discipline Specials (2 AP each)
 * Formatted as full Mythrill spell cards with rich mechanics, damageConfig, and tooltips.
 */
export const WEAPON_DISCIPLINE_SPECIALS = {
    sword: {
        id: 'spec_sword_dancing_steel',
        name: 'Dancing Steel',
        description: 'Perform a fluid blademaster flourish that slices through the enemy’s guard. Deals weapon damage + 2 bonus damage, and allows you to immediately take a free 1-tile tactical step without provoking reactions.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'utility'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Slashing/Sword Slash',
        damageConfig: {
            formula: 'weapon_die + 2',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'slicing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'sword', 'attack', 'movement']
    },
    axe: {
        id: 'spec_axe_sundering_chop',
        name: 'Sundering Chop',
        description: 'Bring the heavy bearded edge down with terrifying cleaving momentum. Deals weapon damage and cracks 1 durability point off the target’s shield or armor plating.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'debuff'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Slashing/Axe Slash',
        damageConfig: {
            formula: 'weapon_die + 2',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'slicing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'axe', 'sunder', 'attack']
    },
    mace: {
        id: 'spec_mace_skull_rattler',
        name: 'Skull-Rattler',
        description: 'Deliver a concussive bludgeon directly to the opponent’s helm. Deals smashing damage and forces a Constitution saving throw; on failure, the target is Stunned until the end of their next turn.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'control'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Bludgeoning/Striking Hammer',
        damageConfig: {
            formula: 'weapon_die',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'smashing',
            savingThrowConfig: {
                enabled: true,
                savingThrow: { ability: 'constitution', difficultyClass: 14, saveOutcome: 'negates' },
                savingThrowType: 'constitution',
                difficultyClass: 14,
                saveOutcome: 'negates'
            },
            canCrit: true,
            critMultiplier: 2
        },
        controlConfig: {
            controlType: 'status_effect',
            duration: 1,
            durationUnit: 'rounds',
            savingThrow: { ability: 'constitution', difficultyClass: 14, saveOutcome: 'negates' },
            saveType: 'constitution',
            difficultyClass: 14,
            saveOutcome: 'negates',
            effects: [
                {
                    id: 'stunned',
                    name: 'Stunned',
                    description: 'Forces a DC 14 Constitution save; on failure, target is Stunned for 1 round.',
                    mechanicsText: 'Target cannot take actions'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'mace', 'stun', 'attack']
    },
    dagger: {
        id: 'spec_dagger_hamstring_slice',
        name: 'Hamstring Slice',
        description: 'Dart low and sever the target’s Achilles tendon with surgical precision. Deals stabbing damage and reduces the target’s movement speed by half for 2 rounds.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'control'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Piercing/Bloody Dagger Strike',
        damageConfig: {
            formula: 'weapon_die + 1',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'stabbing',
            savingThrowConfig: {
                enabled: true,
                savingThrow: { ability: 'agility', difficultyClass: 13, saveOutcome: 'negates' },
                savingThrowType: 'agility',
                difficultyClass: 13,
                saveOutcome: 'negates'
            },
            canCrit: true,
            critMultiplier: 2
        },
        controlConfig: {
            controlType: 'status_effect',
            duration: 2,
            durationUnit: 'rounds',
            savingThrow: { ability: 'agility', difficultyClass: 13, saveOutcome: 'negates' },
            saveType: 'agility',
            difficultyClass: 13,
            saveOutcome: 'negates',
            effects: [
                {
                    id: 'slowed',
                    name: 'Hamstrung (Movement Halved)',
                    description: 'Forces a DC 13 Agility save; on failure, target movement speed is halved for 2 rounds.',
                    mechanicsText: 'Movement speed halved'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'dagger', 'slow', 'finesse']
    },
    rapier: {
        id: 'spec_rapier_fleche_thrust',
        name: 'Flèche Thrust',
        description: 'An explosive forward lunging thrust exploiting the smallest seam in enemy armor. Has expanded critical strike range (threatens critical on natural 18–20) and deals piercing damage.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Piercing/Sword Pierce',
        damageConfig: {
            formula: 'weapon_die + 3',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'stabbing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'rapier', 'finesse', 'crit']
    },
    katana: {
        id: 'spec_katana_iaijutsu_slash',
        name: 'Iaijutsu Slash',
        description: 'In one blinding flash of steel, draw and strike with perfect geometry. Deals weapon damage, and if striking a target who has not yet acted this round, automatically maximizes the weapon damage die.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Slashing/Swift Sword',
        damageConfig: {
            formula: 'weapon_die + 2',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'slicing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'katana', 'burst', 'attack']
    },
    saber: {
        id: 'spec_saber_cavalry_cut',
        name: 'Cavalry Cut',
        description: 'A sweeping curved slash capitalizing on continuous kinetic momentum. Strikes the foe for slicing damage and grants a free 1-tile reposition without triggering opportunity attacks.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'utility'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Slashing/Curved Blade',
        damageConfig: {
            formula: 'weapon_die + 1',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'slicing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'saber', 'mobile', 'attack']
    },
    sickle: {
        id: 'spec_sickle_reaping_hook',
        name: 'Reaping Hook',
        description: 'Hook the curved beak behind an opponent’s guard or ankle. Deals slicing damage and yanks the target 1 tile toward you, putting them off-balance.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'control'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Slashing/Curved Scythe',
        damageConfig: {
            formula: 'weapon_die + 1',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'slicing',
            savingThrowConfig: {
                enabled: true,
                savingThrow: { ability: 'strength', difficultyClass: 13, saveOutcome: 'negates' },
                savingThrowType: 'strength',
                difficultyClass: 13,
                saveOutcome: 'negates'
            },
            canCrit: true,
            critMultiplier: 2
        },
        controlConfig: {
            controlType: 'forcedMovement',
            distance: 5,
            savingThrow: { ability: 'strength', difficultyClass: 13, saveOutcome: 'negates' },
            saveType: 'strength',
            difficultyClass: 13,
            saveOutcome: 'negates',
            effects: [
                {
                    id: 'pull',
                    name: 'Reaping Pull (5 ft)',
                    description: 'Forces a DC 13 Strength save; on failure, target is yanked 1 tile (5 ft) toward you.',
                    mechanicsText: 'Pulls target 5 ft'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'sickle', 'hook', 'control']
    },
    flail: {
        id: 'spec_flail_chain_wrap',
        name: 'Chain Wrap',
        description: 'Whip the spiked ball over and around the defender’s shield. This attack completely ignores any Armor Class bonus or damage reduction granted by shields.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Bludgeoning/Swinging Hammer',
        damageConfig: {
            formula: 'weapon_die + 2',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'smashing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'flail', 'shield_bypass', 'attack']
    },
    'fist weapon': {
        id: 'spec_fistweapon_rending_claws',
        name: 'Rending Claws',
        description: 'Lacerate the enemy with dual-clawed savagery. Deals damage and opens bleeding wounds that cause 1d4 damage at the start of the target’s turn for 2 rounds.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'debuff'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Bludgeoning/Brass Knuckles',
        damageConfig: {
            formula: 'weapon_die + 1d4',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'slicing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'fist_weapon', 'bleed', 'attack']
    },
    'parrying dagger': {
        id: 'spec_parrying_dagger_deflect_bind',
        name: 'Deflect & Bind',
        description: 'Trap the incoming blade in the quillons of your defensive dagger, nullifying the attack and granting an immediate free Riposte strike at advantage.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['buff', 'utility'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Utility/Parry',
        buffConfig: {
            buffType: 'defense',
            effects: [
                {
                    id: 'deflect_bind',
                    name: 'Deflect & Bind Stance',
                    description: 'Trap incoming blade, nullifying the attack and granting advantage on your next riposte.'
                }
            ]
        },
        damageConfig: {
            formula: 'weapon_die',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'stabbing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'parrying_dagger', 'defensive', 'bind']
    },
    'off hand blade': {
        id: 'spec_offhand_twin_fang',
        name: 'Twin Fang Flurry',
        description: 'Unleash a lightning-fast dual-wield combination where your secondary blade strikes in tandem with your primary weapon, delivering two separate damage instances.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Slashing/Dual Blades',
        damageConfig: {
            formula: '2 * weapon_die',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'slicing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'off_hand_blade', 'dual_wield', 'flurry']
    },
    'war mace': {
        id: 'spec_warmace_armor_pulverizer',
        name: 'Armor Pulverizer',
        description: 'Crash the heavy spiked head into the enemy’s breastplate. Deals crushing damage, dazes the enemy (loses 1 AP next turn), and dents 1 point of armor durability.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'debuff'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Bludgeoning/Dwarven Hammer Warrior',
        damageConfig: {
            formula: 'weapon_die + 3',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'smashing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'war_mace', 'sunder', 'daze']
    },
    greatsword: {
        id: 'spec_greatsword_colossus_cleave',
        name: 'Colossus Cleave',
        description: 'Swing the massive two-handed blade in a ferocious 180° arc. Deals weapon damage + 2 to the primary target and cleaves an adjacent enemy for half damage.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Slashing/Cleave',
        damageConfig: {
            formula: 'weapon_die + 2',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'slicing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'greatsword', 'cleave', 'two_handed']
    },
    greataxe: {
        id: 'spec_greataxe_mountain_splitter',
        name: 'Mountain Splitter',
        description: 'A terrifying two-handed overhead chop. Deals heavy slicing damage, knocks the enemy 2 tiles backward, and shatters 1 durability point on their armor.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'control'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Slashing/Axe downward swing',
        damageConfig: {
            formula: 'weapon_die + 3',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'slicing',
            savingThrowConfig: {
                enabled: true,
                savingThrow: { ability: 'strength', difficultyClass: 14, saveOutcome: 'negates' },
                savingThrowType: 'strength',
                difficultyClass: 14,
                saveOutcome: 'negates'
            },
            canCrit: true,
            critMultiplier: 2
        },
        controlConfig: {
            controlType: 'forcedMovement',
            distance: 10,
            savingThrow: { ability: 'strength', difficultyClass: 14, saveOutcome: 'negates' },
            saveType: 'strength',
            difficultyClass: 14,
            saveOutcome: 'negates',
            effects: [
                {
                    id: 'knockback',
                    name: 'Knockback (10 ft)',
                    description: 'Forces a DC 14 Strength save; on failure, target is knocked 2 tiles (10 ft) backward.',
                    mechanicsText: 'Pushes target 10 ft'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'greataxe', 'knockback', 'sunder']
    },
    maul: {
        id: 'spec_maul_earthshaker_slam',
        name: 'Earthshaker Slam',
        description: 'Slam the colossal war hammer into the ground with bone-shattering force. Deals heavy bludgeoning damage and forces a Strength saving throw; on failure, the target is slammed Prone.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'control'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Bludgeoning/Hammer Crush',
        damageConfig: {
            formula: 'weapon_die + 2',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'smashing',
            savingThrowConfig: {
                enabled: true,
                savingThrow: { ability: 'strength', difficultyClass: 14, saveOutcome: 'negates' },
                savingThrowType: 'strength',
                difficultyClass: 14,
                saveOutcome: 'negates'
            },
            canCrit: true,
            critMultiplier: 2
        },
        controlConfig: {
            controlType: 'status_effect',
            duration: 1,
            durationUnit: 'rounds',
            savingThrow: { ability: 'strength', difficultyClass: 14, saveOutcome: 'negates' },
            saveType: 'strength',
            difficultyClass: 14,
            saveOutcome: 'negates',
            effects: [
                {
                    id: 'prone',
                    name: 'Knockdown (Prone)',
                    description: 'Forces a DC 14 Strength save; on failure, the target is slammed Prone.',
                    mechanicsText: 'Target falls Prone until standing up'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'maul', 'prone', 'crush']
    },
    polearm: {
        id: 'spec_polearm_vaulting_sweep',
        name: 'Vaulting Sweep',
        description: 'Leverage the long haft to execute an extended 10 ft sweeping trip. Deals slashing/piercing damage and trips the enemy flat onto the ground (Prone).',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'control'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Piercing/Spear Flip',
        damageConfig: {
            formula: 'weapon_die + 1',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'stabbing',
            savingThrowConfig: {
                enabled: true,
                savingThrow: { ability: 'agility', difficultyClass: 14, saveOutcome: 'negates' },
                savingThrowType: 'agility',
                difficultyClass: 14,
                saveOutcome: 'negates'
            },
            canCrit: true,
            critMultiplier: 2
        },
        controlConfig: {
            controlType: 'status_effect',
            duration: 1,
            durationUnit: 'rounds',
            savingThrow: { ability: 'agility', difficultyClass: 14, saveOutcome: 'negates' },
            saveType: 'agility',
            difficultyClass: 14,
            saveOutcome: 'negates',
            effects: [
                {
                    id: 'prone',
                    name: 'Vaulting Sweep (Prone)',
                    description: 'Forces a DC 14 Agility save; on failure, target is tripped flat onto the ground (Prone).',
                    mechanicsText: 'Target falls Prone'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 10, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'polearm', 'reach', 'trip']
    },
    staff: {
        id: 'spec_staff_sweeping_trip',
        name: 'Sweeping Trip & Bonk',
        description: 'An iconic spinning sweep of the staff across the ankles followed by a firm stunning bonk to the crown. Deals smashing damage and forces an Agility save; on failure, the target is knocked Prone!',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'control'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Bludgeoning/Staff Attack',
        damageConfig: {
            formula: 'weapon_die + 2',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'smashing',
            savingThrowConfig: {
                enabled: true,
                savingThrow: { ability: 'agility', difficultyClass: 13, saveOutcome: 'negates' },
                savingThrowType: 'agility',
                difficultyClass: 13,
                saveOutcome: 'negates'
            },
            canCrit: true,
            critMultiplier: 2
        },
        controlConfig: {
            controlType: 'status_effect',
            duration: 1,
            durationUnit: 'rounds',
            savingThrow: { ability: 'agility', difficultyClass: 13, saveOutcome: 'negates' },
            saveType: 'agility',
            difficultyClass: 13,
            saveOutcome: 'negates',
            effects: [
                {
                    id: 'prone',
                    name: 'Sweeping Trip (Prone)',
                    description: 'Forces a DC 13 Agility save; on failure, target is knocked Prone.',
                    mechanicsText: 'Target falls Prone'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'staff', 'sweep', 'stun', 'prone']
    },
    halberd: {
        id: 'spec_halberd_hook_and_cleave',
        name: 'Hook & Cleave',
        description: 'Use the rear spike to pull down the foe’s weapon or shield, instantly followed by a brutal axe chop to the exposed opening for heavy slicing damage.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Slashing/Axe Weapon',
        damageConfig: {
            formula: 'weapon_die + 3',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'slicing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 10, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'halberd', 'reach', 'hook']
    },
    scythe: {
        id: 'spec_scythe_soul_harvest',
        name: 'Soul Harvest',
        description: 'Reap across vital centers with the long curving crescent blade. Deals deep slicing damage and leaves a lingering chill that prevents the target from recovering health for 1 round.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'debuff'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Slashing/Bloody Crossed Scythes',
        damageConfig: {
            formula: 'weapon_die + 2',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'slicing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'scythe', 'harvest', 'chill']
    },
    'jousting spear': {
        id: 'spec_joustingspear_couched_charge',
        name: 'Couched Charge',
        description: 'Couch the lance into your hip and drive forward with immense momentum. Deals double weapon damage if you have moved at least 2 tiles toward the target this turn.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Piercing/Spear Warrior',
        damageConfig: {
            formula: '2 * weapon_die',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'stabbing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 10, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'jousting_spear', 'charge', 'lance']
    },
    'double sided sword': {
        id: 'spec_doublesided_bladestorm',
        name: 'Bladestorm Flourish',
        description: 'Spin the center grip into a whirlwind of whirling twin edges, striking all adjacent hostile creatures within 5 ft for weapon damage.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Slashing/Crossed Scimitars',
        damageConfig: {
            formula: 'weapon_die + 1',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'slicing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'area', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'double_sided_sword', 'aoe', 'spin']
    },
    bow: {
        id: 'spec_bow_rain_of_arrows',
        name: 'Rain of Arrows',
        description: 'Draw to maximum tension and loose a volley high into the air, raining arrows down onto a 10 ft radius target area at range.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Piercing/Bow Shot',
        damageConfig: {
            formula: 'weapon_die + 1',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'stabbing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'area', rangeType: 'ranged', rangeDistance: 120, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'bow', 'ranged', 'volley']
    },
    crossbow: {
        id: 'spec_crossbow_piercing_bolt',
        name: 'Piercing Bolt',
        description: 'Fire a heavy winch-cocked bolt with enough kinetic force to punch cleanly through the primary target and strike a second enemy directly behind them.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Piercing/Focused Arrow Shot',
        damageConfig: {
            formula: 'weapon_die + 3',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'stabbing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'line', rangeType: 'ranged', rangeDistance: 100, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'crossbow', 'ranged', 'piercing']
    },
    thrown: {
        id: 'spec_thrown_ricochet_toss',
        name: 'Ricochet Toss',
        description: 'Hurl the throwing blade or axe at an angle so that it bounces forcefully off the first enemy to strike an adjacent secondary foe.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Piercing/Spear Throw',
        damageConfig: {
            formula: 'weapon_die + 2',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'slicing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 40, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'thrown', 'ricochet']
    },
    wand: {
        id: 'spec_wand_arcane_surge',
        name: 'Arcane Surge',
        description: 'Channel pure raw magical power through the wand tip, projecting an overcharged lance of force that deals damage and knocks the target back 5 ft.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'control'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Arcane/Spiral Vortex',
        damageConfig: {
            formula: 'weapon_die + 2',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'arcane',
            savingThrowConfig: {
                enabled: true,
                savingThrow: { ability: 'strength', difficultyClass: 13, saveOutcome: 'negates' },
                savingThrowType: 'strength',
                difficultyClass: 13,
                saveOutcome: 'negates'
            },
            canCrit: true,
            critMultiplier: 2
        },
        controlConfig: {
            controlType: 'forcedMovement',
            distance: 5,
            savingThrow: { ability: 'strength', difficultyClass: 13, saveOutcome: 'negates' },
            saveType: 'strength',
            difficultyClass: 13,
            saveOutcome: 'negates',
            effects: [
                {
                    id: 'knockback',
                    name: 'Arcane Push (5 ft)',
                    description: 'Forces a DC 13 Strength save; on failure, target is pushed 5 ft backward.',
                    mechanicsText: 'Pushes target 5 ft'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 60, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'wand', 'arcane', 'push']
    },
    blowgun: {
        id: 'spec_blowgun_paralytic_dart',
        name: 'Paralytic Dart',
        description: 'Propel an envenomed needle into an exposed artery. Forces a DC 13 Constitution save; on failure, the target is Paralyzed until the end of their next turn.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['control', 'debuff'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Poison/Poison Flask',
        damageConfig: {
            formula: '1d4',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: false,
            damageType: 'stabbing',
            savingThrowConfig: {
                enabled: true,
                savingThrow: { ability: 'constitution', difficultyClass: 13, saveOutcome: 'negates' },
                savingThrowType: 'constitution',
                difficultyClass: 13,
                saveOutcome: 'negates'
            },
            canCrit: true,
            critMultiplier: 2
        },
        controlConfig: {
            controlType: 'status_effect',
            duration: 1,
            durationUnit: 'rounds',
            savingThrow: { ability: 'constitution', difficultyClass: 13, saveOutcome: 'negates' },
            saveType: 'constitution',
            difficultyClass: 13,
            saveOutcome: 'negates',
            effects: [
                {
                    id: 'paralyzed',
                    name: 'Paralyzed',
                    description: 'Forces a DC 13 Constitution save; on failure, target is Paralyzed until end of next turn.',
                    mechanicsText: 'Target cannot take actions'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'blowgun', 'poison', 'paralysis']
    },
    sling: {
        id: 'spec_sling_concussive_bullet',
        name: 'Concussive Bullet',
        description: 'Whip a heavy lead bullet around your head with centrifugal velocity. Deals crushing damage and rattles the target’s skull, causing disadvantage on their next attack.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'debuff'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Bludgeoning/Comet Strike',
        damageConfig: {
            formula: 'weapon_die + 2',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'smashing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 60, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'sling', 'concussion', 'smashing']
    },
    boomerang: {
        id: 'spec_boomerang_returning_whirlwind',
        name: 'Returning Whirlwind',
        description: 'Hurl the curved thrower on an arced trajectory that slices through the foe and returns safely to your hand, granting you a free ready action.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Utility/Counter Spiral',
        damageConfig: {
            formula: 'weapon_die + 2',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'slicing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 50, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'boomerang', 'returning']
    },
    chakram: {
        id: 'spec_chakram_whirling_razor',
        name: 'Whirling Razor',
        description: 'Spin the circular bladed disc into an orbit around the foe, inflicting deep slicing wounds that bleed for 1d4 damage on their next turn.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'debuff'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Slashing/Cross Slash',
        damageConfig: {
            formula: 'weapon_die + 2',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'slicing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 45, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'chakram', 'razor', 'bleed']
    },
    shuriken: {
        id: 'spec_shuriken_shadow_fan',
        name: 'Shadow Fan',
        description: 'Release three concealed throwing stars in a spread pattern, striking up to three targets within range for piercing damage.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Piercing/Dual Daggers',
        damageConfig: {
            formula: 'weapon_die + 1',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'stabbing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'area', rangeType: 'ranged', rangeDistance: 35, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'shuriken', 'fan', 'stabbing']
    },
    dart: {
        id: 'spec_dart_pinpoint_flechette',
        name: 'Pinpoint Flechette',
        description: 'Flick a needle-point dart into a vulnerable joint seam. Bypasses light physical armor and deals precision piercing damage with an increased crit chance.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Piercing/Dagger In Motion',
        damageConfig: {
            formula: 'weapon_die + 2',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'stabbing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 40, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'dart', 'precision', 'crit']
    },
    harp: {
        id: 'spec_harp_harmonic_cascade',
        name: 'Harmonic Cascade',
        description: 'Weave an ethereal melody across the strings that manifests as an acoustic resonant barrier, granting you or an ally +2 Armor Class and soothing tension.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['buff', 'utility'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Radiant/Holy Aura',
        buffConfig: {
            buffType: 'statEnhancement',
            effects: [{ id: 'harmonic_barrier', name: 'Harmonic Barrier', description: '+2 Armor Class for 1 round' }],
            durationValue: 1,
            durationUnit: 'rounds'
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['ally', 'self'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 },
        resolution: 'DICE',
        tags: ['instrument', 'discipline', 'harp', 'buff', 'resonance']
    },
    lute: {
        id: 'spec_lute_discordant_strum',
        name: 'Discordant Strum',
        description: 'Strike a jarring, cacophonous chord that ripples through the air, breaking enemy spell concentration and forcing hostile creatures within 10 ft to step back.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['control', 'damage'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Nature/Healing Breeze',
        damageConfig: {
            formula: '1d6 + 2',
            damageType: 'wyrd',
            savingThrowConfig: {
                enabled: true,
                savingThrow: { ability: 'strength', difficultyClass: 13, saveOutcome: 'negates' },
                savingThrowType: 'strength',
                difficultyClass: 13,
                saveOutcome: 'negates'
            },
            canCrit: true,
            critMultiplier: 2
        },
        controlConfig: {
            controlType: 'forcedMovement',
            distance: 5,
            savingThrow: { ability: 'strength', difficultyClass: 13, saveOutcome: 'negates' },
            saveType: 'strength',
            difficultyClass: 13,
            saveOutcome: 'negates',
            effects: [
                {
                    id: 'push',
                    name: 'Discordant Repulsion (5 ft)',
                    description: 'Forces a DC 13 Strength save; on failure, enemies within 10 ft are pushed back 5 ft.',
                    mechanicsText: 'Pushes targets 5 ft'
                }
            ]
        },
        targetingConfig: { targetingType: 'area', rangeType: 'ranged', rangeDistance: 20, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['instrument', 'discipline', 'lute', 'sonic', 'disrupt']
    },
    flute: {
        id: 'spec_flute_sirens_trill',
        name: 'Siren’s Trill',
        description: 'Play a haunting trill that charms the senses. Forces a DC 13 Wisdom saving throw; on failure, the target is hypnotized and cannot take reactions until your next turn.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['control'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Nature/Healing Breeze',
        controlConfig: {
            controlType: 'status_effect',
            duration: 1,
            durationUnit: 'rounds',
            savingThrow: { ability: 'wisdom', difficultyClass: 13, saveOutcome: 'negates' },
            saveType: 'wisdom',
            difficultyClass: 13,
            saveOutcome: 'negates',
            effects: [
                {
                    id: 'hypnotized',
                    name: 'Hypnotized (No Reactions)',
                    description: 'Forces a DC 13 Wisdom save; on failure, target cannot take reactions until your next turn.',
                    mechanicsText: 'Target cannot take reactions'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 40, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 },
        resolution: 'DICE',
        tags: ['instrument', 'discipline', 'flute', 'charm', 'control']
    },
    drum: {
        id: 'spec_drum_thunder_beat',
        name: 'Thunder Beat',
        description: 'Pound the drum skins with thunderous force, producing a shockwave in a 10 ft cone that deals smashing damage and pushes foes 5 ft back.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'control'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Bludgeoning/Energy Strike',
        damageConfig: {
            formula: '1d8 + 2',
            damageType: 'smashing',
            savingThrowConfig: {
                enabled: true,
                savingThrow: { ability: 'strength', difficultyClass: 13, saveOutcome: 'negates' },
                savingThrowType: 'strength',
                difficultyClass: 13,
                saveOutcome: 'negates'
            },
            canCrit: true,
            critMultiplier: 2
        },
        controlConfig: {
            controlType: 'forcedMovement',
            distance: 5,
            savingThrow: { ability: 'strength', difficultyClass: 13, saveOutcome: 'negates' },
            saveType: 'strength',
            difficultyClass: 13,
            saveOutcome: 'negates',
            effects: [
                {
                    id: 'push',
                    name: 'Shockwave Push (5 ft)',
                    description: 'Forces a DC 13 Strength save; shockwave pushes foes 5 ft backward.',
                    mechanicsText: 'Pushes foes 5 ft'
                }
            ]
        },
        targetingConfig: { targetingType: 'cone', rangeType: 'touch', rangeDistance: 15, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['instrument', 'discipline', 'drum', 'shockwave', 'push']
    },
    horn: {
        id: 'spec_horn_rallying_warblast',
        name: 'Rallying Warblast',
        description: 'Sound a booming clarion call across the battlefield that stirs courage. All allies within 30 ft gain +1d6 to their next strike roll.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['buff'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Utility/Bull Charge',
        targetingConfig: { targetingType: 'area', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['ally', 'self'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 },
        resolution: 'DICE',
        tags: ['instrument', 'discipline', 'horn', 'buff', 'rally']
    },
    violin: {
        id: 'spec_violin_screeching_cacophony',
        name: 'Screeching Cacophony',
        description: 'Draw the bow across the strings in a screeching, ear-splitting discordance! Forces a DC 13 Constitution saving throw; on failure, the enemy is Dazed, loses 1 AP next turn, and takes sonic damage.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'control'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Arcane/Spellcasting Aura',
        damageConfig: {
            formula: '1d6 + 2',
            damageType: 'wyrd',
            savingThrowConfig: {
                enabled: true,
                savingThrow: { ability: 'constitution', difficultyClass: 13, saveOutcome: 'negates' },
                savingThrowType: 'constitution',
                difficultyClass: 13,
                saveOutcome: 'negates'
            },
            canCrit: true,
            critMultiplier: 2
        },
        controlConfig: {
            controlType: 'status_effect',
            duration: 1,
            durationUnit: 'rounds',
            savingThrow: { ability: 'constitution', difficultyClass: 13, saveOutcome: 'negates' },
            saveType: 'constitution',
            difficultyClass: 13,
            saveOutcome: 'negates',
            effects: [
                {
                    id: 'dazed',
                    name: 'Dazed (-1 AP)',
                    description: 'Forces a DC 13 Constitution save; on failure, target is Dazed and loses 1 AP on their next turn.',
                    mechanicsText: '-1 AP on next turn'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 35, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 },
        resolution: 'DICE',
        tags: ['instrument', 'discipline', 'violin', 'screech', 'daze', 'dc_check']
    },
    guitar: {
        id: 'spec_guitar_power_chime',
        name: 'Power Chime',
        description: 'Strike an acoustic power chord that vibrates through the floorboards. Deals sonic damage and jolts the target, giving them disadvantage on their next physical check.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'debuff'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Chaos/Chaos Wave',
        damageConfig: {
            formula: '1d6 + 2',
            damageType: 'smashing',
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['instrument', 'discipline', 'guitar', 'sonic', 'jolt']
    },
    unarmed: {
        id: 'spec_unarmed_dragon_kick',
        name: 'Dragon Kick',
        description: 'Leap forward with a flying martial arts heel strike. Deals crushing smashing damage and forces an Athletics / Acrobatics save; on failure, the opponent is slammed Prone.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'control'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Bludgeoning/Power Kick',
        damageConfig: {
            formula: '1d6 + 2',
            damageType: 'smashing',
            savingThrowConfig: {
                enabled: true,
                savingThrow: { ability: 'agility', difficultyClass: 13, saveOutcome: 'negates' },
                savingThrowType: 'agility',
                difficultyClass: 13,
                saveOutcome: 'negates'
            },
            canCrit: true,
            critMultiplier: 2
        },
        controlConfig: {
            controlType: 'status_effect',
            duration: 1,
            durationUnit: 'rounds',
            savingThrow: { ability: 'agility', difficultyClass: 13, saveOutcome: 'negates' },
            saveType: 'agility',
            difficultyClass: 13,
            saveOutcome: 'negates',
            effects: [
                {
                    id: 'prone',
                    name: 'Knockdown (Prone)',
                    description: 'Forces a DC 13 Agility or Athletics save; on failure, target is slammed Prone.',
                    mechanicsText: 'Target falls Prone'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'unarmed', 'kick', 'prone']
    }
};

/**
 * Adapts a discipline special spell template dynamically for an equipped weapon.
 * - Replaces all occurrences of 'weapon_die' with the weapon's actual damage dice notation (e.g. '2d6', '1d12', '1d8')
 * - Ensures damage type and attribute modifier reflect the equipped weapon
 * - Synchronizes reach/range distance
 */
export function adaptSpecialForWeapon(specialTemplate, weapon) {
    if (!specialTemplate) return null;

    const damageNotation = getWeaponDamageNotation(weapon);
    const damageType = getWeaponDamageType(weapon);
    const attribute = getWeaponAttackAttribute(weapon);
    const range = getWeaponRange(weapon);

    // Deep copy special template to avoid mutating base dictionary
    const adapted = JSON.parse(JSON.stringify(specialTemplate));

    if (adapted.damageConfig) {
        let formula = adapted.damageConfig.formula || damageNotation;
        // Replace all instances of 'weapon_die' with the concrete dice notation
        formula = formula.replace(/weapon_die/g, damageNotation);
        adapted.damageConfig.formula = formula;

        if (weapon) {
            if (!adapted.damageConfig.preserveDamageType) {
                adapted.damageConfig.damageType = adapted.damageConfig.damageType || damageType;
            }
            if (adapted.damageConfig.addAttributeModifier) {
                adapted.damageConfig.attributeModifier = attribute;
            }
        }
    }

    if (weapon && adapted.targetingConfig && adapted.targetingConfig.rangeType === 'touch') {
        adapted.targetingConfig.rangeDistance = Math.max(adapted.targetingConfig.rangeDistance || 5, range);
    }

    return adapted;
}

/**
 * Baseline Actions for Main Hand
 */
export function getMainHandActions(weapon) {
    const damageNotation = getWeaponDamageNotation(weapon);
    const damageType = getWeaponDamageType(weapon);
    const range = getWeaponRange(weapon);
    const attribute = getWeaponAttackAttribute(weapon);
    const disciplineKey = getWeaponDisciplineKey(weapon);
    const rawSpecial = WEAPON_DISCIPLINE_SPECIALS[disciplineKey] || WEAPON_DISCIPLINE_SPECIALS.sword;
    const disciplineSpecial = adaptSpecialForWeapon(rawSpecial, weapon);

    // 1. Standard Attack (1 AP)
    const defaultAttackIcon = damageType === 'piercing' ? 'Piercing/Stab Spear' : damageType === 'smashing' ? 'Bludgeoning/Combat Hammer Strike' : 'Slashing/Sword Strike';
    const standardAttack = {
        id: 'mh_standard_attack',
        name: weapon ? `Attack (${weapon.name})` : 'Attack (Unarmed)',
        description: weapon
            ? `Strike cleanly with your ${weapon.name}. Deals ${damageNotation} ${damageType} damage plus your ${attribute.toUpperCase()} modifier.`
            : 'Strike with your bare hands or improvised weapons. Deals 1d4 smashing damage + STR modifier.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage'],
        source: 'general',
        categoryIds: ['general_actions'],
        icon: (weapon?.iconId && weapon.iconId.includes('/')) ? weapon.iconId : defaultAttackIcon,
        damageConfig: {
            formula: `${damageNotation} + ${attribute}_modifier`,
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            attributeModifier: attribute,
            damageType: damageType,
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: {
            targetingType: 'single',
            rangeType: range > 5 ? 'ranged' : 'touch',
            rangeDistance: range,
            targetRestrictions: ['enemy']
        },
        resourceCost: { actionPoints: 1, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
        resolution: 'DICE',
        tags: ['attack', 'combat', 'main_hand', damageType]
    };

    // 2. Opportunity Attack (1 AP)
    const opportunityAttack = {
        id: 'mh_opportunity_attack',
        name: 'Opportunity Attack',
        description: 'React to an enemy moving out of your melee engagement zone with an immediate snap strike. Deals weapon damage.',
        level: 1,
        spellType: 'REACTION',
        effectTypes: ['damage'],
        source: 'general',
        categoryIds: ['general_reactions'],
        icon: 'Slashing/Cleave',
        damageConfig: {
            formula: damageNotation,
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: damageType,
            canCrit: true,
            critMultiplier: 1
        },
        targetingConfig: {
            targetingType: 'single',
            rangeType: 'touch',
            rangeDistance: range,
            targetRestrictions: ['enemy']
        },
        resourceCost: { actionPoints: 1, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
        resolution: 'DICE',
        tags: ['reaction', 'offensive', 'opportunity_attack']
    };

    // 3. Parry (1 AP)
    const parry = {
        id: 'mh_parry',
        name: 'Parry',
        description: 'Interpose your weapon against an incoming melee strike. Roll your weapon die vs. the attacker’s roll; if higher, negate the blow entirely.',
        level: 1,
        spellType: 'REACTION',
        effectTypes: ['buff', 'utility'],
        source: 'general',
        categoryIds: ['general_reactions'],
        icon: 'Utility/Parry',
        buffConfig: {
            buffType: 'defense',
            effects: [
                {
                    id: 'parry_reaction',
                    name: 'Parry Stance',
                    description: 'Interpose your weapon against an incoming melee strike. Negates damage if weapon roll meets attack roll.'
                }
            ]
        },
        targetingConfig: { targetingType: 'self' },
        resourceCost: { actionPoints: 1, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
        resolution: 'DICE',
        tags: ['reaction', 'defensive', 'parry']
    };

    // 4. Riposte (1 AP)
    const riposte = {
        id: 'mh_riposte',
        name: 'Riposte',
        description: 'Immediately following a successful parry, riposte with a counter-attack. Deals weapon damage, completely ignoring the target’s passive DR and Defend soak.',
        level: 1,
        spellType: 'REACTION',
        effectTypes: ['damage'],
        source: 'general',
        categoryIds: ['general_reactions'],
        icon: 'Slashing/Crossed Swords Clash',
        damageConfig: {
            formula: damageNotation,
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: false,
            damageType: damageType,
            canCrit: true,
            critMultiplier: 1
        },
        targetingConfig: {
            targetingType: 'single',
            rangeType: 'touch',
            rangeDistance: range,
            targetRestrictions: ['enemy']
        },
        resourceCost: { actionPoints: 1, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
        resolution: 'DICE',
        tags: ['reaction', 'offensive', 'riposte']
    };

    // 5. Weapon Discipline Special (2 AP)
    return [standardAttack, opportunityAttack, parry, riposte, disciplineSpecial];
}

/**
 * Baseline Actions for Off Hand (Shield, Off-hand Weapon, or Unarmed)
 */
export function getOffHandActions(item) {
    if (!item) {
        // Unarmed offhand
        return [
            {
                id: 'oh_unarmed_jab',
                name: 'Off-Hand Jab',
                description: 'Quick off-hand punch or palm jab dealing 1d4 smashing damage.',
                level: 1,
                spellType: 'ACTION',
                effectTypes: ['damage'],
                source: 'general',
                categoryIds: ['general_actions'],
                icon: 'Bludgeoning/Punch',
                damageConfig: { formula: '1d4', damageType: 'smashing', canCrit: true, critMultiplier: 2 },
                targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
                resourceCost: { actionPoints: 1, mana: 0, health: 0 },
                cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
                resolution: 'DICE',
                tags: ['off_hand', 'unarmed', 'attack']
            },
            {
                id: 'oh_shove',
                name: 'Shove & Guard',
                description: 'Use your free hand to push an engaged enemy 5 ft back or brace your stance.',
                level: 1,
                spellType: 'ACTION',
                effectTypes: ['control'],
                source: 'general',
                categoryIds: ['general_actions'],
                icon: 'Bludgeoning/Hard Step',
                controlConfig: {
                    controlType: 'forcedMovement',
                    distance: 5,
                    savingThrow: { ability: 'strength', difficultyClass: 12, saveOutcome: 'negates' },
                    saveType: 'strength',
                    difficultyClass: 12,
                    saveOutcome: 'negates',
                    effects: [
                        {
                            id: 'shove',
                            name: 'Shove (5 ft)',
                            description: 'Forces a DC 12 Strength save; pushes target 5 ft back on failure.',
                            mechanicsText: 'Pushes target 5 ft'
                        }
                    ]
                },
                targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
                resourceCost: { actionPoints: 1, mana: 0, health: 0 },
                cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
                resolution: 'DICE',
                tags: ['off_hand', 'unarmed', 'shove']
            }
        ];
    }

    const disciplineKey = getWeaponDisciplineKey(item);

    // If Shield is equipped
    if (disciplineKey === 'shield') {
        const durability = item.durability?.current ?? item.currentDurability ?? item.stats?.durability ?? 5;
        const maxDurability = item.durability?.max ?? item.maxDurability ?? 5;

        return [
            {
                id: 'oh_raise_shield',
                name: 'Raise Shield',
                description: `Roll a shield die (d8) to absorb incoming strike damage before armor takes the hit. Current shield durability: ${durability}/${maxDurability}.`,
                level: 1,
                spellType: 'REACTION',
                effectTypes: ['buff'],
                source: 'general',
                categoryIds: ['general_reactions'],
                icon: 'Utility/Barred Shield',
                buffConfig: {
                    buffType: 'statEnhancement',
                    effects: [{ id: 'shield_block', name: 'Shield Block', description: 'Reduces incoming damage by 1d8' }]
                },
                targetingConfig: { targetingType: 'self' },
                resourceCost: { actionPoints: 1, mana: 0, health: 0 },
                cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
                resolution: 'DICE',
                tags: ['reaction', 'shield', 'defensive']
            },
            {
                id: 'oh_defend',
                name: 'Defend',
                description: `Hunker tightly behind the shield. Absorbs double the incoming damage with NO risk of shield durability degradation. Current durability: ${durability}/${maxDurability}.`,
                level: 1,
                spellType: 'REACTION',
                effectTypes: ['buff'],
                source: 'general',
                categoryIds: ['general_reactions'],
                icon: 'Utility/Brown Shield',
                targetingConfig: { targetingType: 'self' },
                resourceCost: { actionPoints: 1, mana: 0, health: 0 },
                cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
                resolution: 'DICE',
                tags: ['reaction', 'shield', 'defensive', 'durability_protect']
            },
            {
                id: 'oh_interpose',
                name: 'Interpose',
                description: 'When an adjacent ally within 10 ft is attacked, step in front with your shield, pushing them 5 ft to safety and taking the blow yourself.',
                level: 1,
                spellType: 'REACTION',
                effectTypes: ['utility', 'buff'],
                source: 'general',
                categoryIds: ['general_reactions'],
                icon: 'Utility/Armored Warrior',
                targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 10, targetRestrictions: ['ally'] },
                resourceCost: { actionPoints: 1, mana: 0, health: 0 },
                cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
                resolution: 'DICE',
                tags: ['reaction', 'shield', 'support', 'interpose']
            },
            {
                id: 'oh_shield_bash',
                name: 'Shield Bash',
                description: 'Following a successful block, thrust the iron boss directly into the enemy’s face. Forces a Constitution save; on failure, target is Stunned for 1 turn.',
                level: 1,
                spellType: 'ACTION',
                effectTypes: ['damage', 'control'],
                source: 'general',
                categoryIds: ['general_actions'],
                icon: 'Utility/Deflecting Shield',
                damageConfig: {
                    formula: '1d6 + strength_modifier',
                    damageType: 'smashing',
                    savingThrowConfig: {
                        enabled: true,
                        savingThrow: { ability: 'constitution', difficultyClass: 14, saveOutcome: 'negates' },
                        savingThrowType: 'constitution',
                        difficultyClass: 14,
                        saveOutcome: 'negates'
                    },
                    canCrit: true,
                    critMultiplier: 2
                },
                controlConfig: {
                    controlType: 'status_effect',
                    duration: 1,
                    durationUnit: 'turns',
                    savingThrow: { ability: 'constitution', difficultyClass: 14, saveOutcome: 'negates' },
                    saveType: 'constitution',
                    difficultyClass: 14,
                    saveOutcome: 'negates',
                    effects: [
                        {
                            id: 'stunned',
                            name: 'Stunned',
                            description: 'Forces a DC 14 Constitution save; on failure, target is Stunned for 1 turn.',
                            mechanicsText: 'Target cannot take actions'
                        }
                    ]
                },
                targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
                resourceCost: { actionPoints: 1, mana: 0, health: 0 },
                cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
                resolution: 'DICE',
                tags: ['shield', 'attack', 'stun', 'bash']
            }
        ];
    }

    // If dual-wielding weapon
    const damageNotation = getWeaponDamageNotation(item);
    const damageType = getWeaponDamageType(item);
    const rawSpecial = WEAPON_DISCIPLINE_SPECIALS[disciplineKey] || WEAPON_DISCIPLINE_SPECIALS['off hand blade'];
    const special = adaptSpecialForWeapon(rawSpecial, item);

    return [
        {
            id: 'oh_weapon_strike',
            name: `Off-Hand Strike (${item.name})`,
            description: `A swift, coordinated secondary attack with your ${item.name}. Deals ${damageNotation} ${damageType} damage.`,
            level: 1,
            spellType: 'ACTION',
            effectTypes: ['damage'],
            source: 'general',
            categoryIds: ['general_actions'],
            icon: 'Slashing/Dual Blades',
            damageConfig: { formula: damageNotation, weaponDependent: true, damageType, canCrit: true, critMultiplier: 2 },
            targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
            resourceCost: { actionPoints: 1, mana: 0, health: 0 },
            cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
            resolution: 'DICE',
            tags: ['off_hand', 'dual_wield', 'attack']
        },
        {
            id: 'oh_deflect',
            name: 'Off-Hand Deflect',
            description: 'Parry an incoming blade using your off-hand weapon. Roll weapon die vs attack roll.',
            level: 1,
            spellType: 'REACTION',
            effectTypes: ['buff', 'utility'],
            source: 'general',
            categoryIds: ['general_reactions'],
            icon: 'Utility/Parry',
            buffConfig: {
                buffType: 'defense',
                effects: [
                    {
                        id: 'deflect_reaction',
                        name: 'Deflect Stance',
                        description: 'Parry an incoming blade using your off-hand weapon.'
                    }
                ]
            },
            targetingConfig: { targetingType: 'self' },
            resourceCost: { actionPoints: 1, mana: 0, health: 0 },
            cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
            resolution: 'DICE',
            tags: ['reaction', 'off_hand', 'defensive']
        },
        {
            id: 'oh_riposte',
            name: 'Off-Hand Riposte',
            description: 'Counter-attack with your off-hand blade immediately following a successful deflect or parry.',
            level: 1,
            spellType: 'REACTION',
            effectTypes: ['damage'],
            source: 'general',
            categoryIds: ['general_reactions'],
            icon: 'Slashing/Crossed Swords Clash',
            damageConfig: { formula: damageNotation, weaponDependent: true, damageType, canCrit: true, critMultiplier: 1 },
            targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
            resourceCost: { actionPoints: 1, mana: 0, health: 0 },
            cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
            resolution: 'DICE',
            tags: ['reaction', 'off_hand', 'riposte']
        },
        special
    ];
}

/**
 * Generate a signature quirky combat trick native to the ranged weapon archetype
 */
function getRangedQuirkyAction(item, disciplineKey, damageNotation, damageType, range) {
    switch (disciplineKey) {
        case 'crossbow':
            return {
                id: 'ranged_quirk_kneecapper',
                name: 'Knee-Capper Bolt',
                description: 'Aim low at the target’s joint. Target takes weapon damage and has their Movement Speed halved for 1 turn.',
                level: 1,
                spellType: 'ACTION',
                effectTypes: ['damage', 'control'],
                source: 'weapon_quirk',
                categoryIds: ['general_actions'],
                icon: 'Piercing/Bleeding Arrow',
                damageConfig: {
                    formula: damageNotation,
                    weaponDependent: true,
                    damageType: 'piercing',
                    savingThrowConfig: {
                        enabled: true,
                        savingThrow: { ability: 'agility', difficultyClass: 13, saveOutcome: 'negates' },
                        savingThrowType: 'agility',
                        difficultyClass: 13,
                        saveOutcome: 'negates'
                    },
                    canCrit: true,
                    critMultiplier: 2
                },
                controlConfig: {
                    controlType: 'status_effect',
                    duration: 1,
                    durationUnit: 'rounds',
                    savingThrow: { ability: 'agility', difficultyClass: 13, saveOutcome: 'negates' },
                    saveType: 'agility',
                    difficultyClass: 13,
                    saveOutcome: 'negates',
                    effects: [
                        {
                            id: 'slowed',
                            name: 'Hamstrung (Movement Halved)',
                            description: 'Forces a DC 13 Agility save; on failure, target movement speed is halved for 1 turn.',
                            mechanicsText: 'Movement speed halved'
                        }
                    ]
                },
                targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: range, targetRestrictions: ['enemy'] },
                resourceCost: { actionPoints: 1, mana: 0, health: 0 },
                cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
                resolution: 'DICE',
                tags: ['ranged', 'crossbow', 'slow', 'trick']
            };
        case 'sling':
            return {
                id: 'ranged_quirk_skimming_stone',
                name: 'Skimming Ricochet',
                description: 'Skip a smooth bullet or river pebble off the floor or wall to strike around cover. Target must make a DEX save or be Dazed (-2 to attacks) until their next turn.',
                level: 1,
                spellType: 'ACTION',
                effectTypes: ['damage', 'control'],
                source: 'weapon_quirk',
                categoryIds: ['general_actions'],
                icon: 'Bludgeoning/Comet Strike',
                damageConfig: {
                    formula: `${damageNotation} + 1`,
                    weaponDependent: true,
                    damageType: 'smashing',
                    savingThrowConfig: {
                        enabled: true,
                        savingThrow: { ability: 'agility', difficultyClass: 13, saveOutcome: 'negates' },
                        savingThrowType: 'agility',
                        difficultyClass: 13,
                        saveOutcome: 'negates'
                    },
                    canCrit: true,
                    critMultiplier: 2
                },
                controlConfig: {
                    controlType: 'status_effect',
                    duration: 1,
                    durationUnit: 'rounds',
                    savingThrow: { ability: 'agility', difficultyClass: 13, saveOutcome: 'negates' },
                    saveType: 'agility',
                    difficultyClass: 13,
                    saveOutcome: 'negates',
                    effects: [
                        {
                            id: 'dazed',
                            name: 'Dazed',
                            description: 'Forces a DC 13 Agility save; on failure, target is Dazed (-2 to attacks) until their next turn.',
                            mechanicsText: '-2 to attack rolls'
                        }
                    ]
                },
                targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: range, targetRestrictions: ['enemy'] },
                resourceCost: { actionPoints: 1, mana: 0, health: 0 },
                cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
                resolution: 'DICE',
                tags: ['ranged', 'sling', 'daze', 'trick']
            };
        case 'blowgun':
            return {
                id: 'ranged_quirk_soporific_needle',
                name: 'Soporific Needle',
                description: 'Blow a needle dipped in concentrated poppy juice. Forces a CON save; on failure, target becomes Drowsy and loses 1 AP on their next turn.',
                level: 1,
                spellType: 'ACTION',
                effectTypes: ['damage', 'control'],
                source: 'weapon_quirk',
                categoryIds: ['general_actions'],
                icon: 'Poison/Poison Flask',
                damageConfig: {
                    formula: '1d4',
                    damageType: 'poison',
                    savingThrowConfig: {
                        enabled: true,
                        savingThrow: { ability: 'constitution', difficultyClass: 13, saveOutcome: 'negates' },
                        savingThrowType: 'constitution',
                        difficultyClass: 13,
                        saveOutcome: 'negates'
                    },
                    canCrit: false
                },
                controlConfig: {
                    controlType: 'status_effect',
                    duration: 1,
                    durationUnit: 'rounds',
                    savingThrow: { ability: 'constitution', difficultyClass: 13, saveOutcome: 'negates' },
                    saveType: 'constitution',
                    difficultyClass: 13,
                    saveOutcome: 'negates',
                    effects: [
                        {
                            id: 'drowsy',
                            name: 'Drowsy (-1 AP)',
                            description: 'Forces a DC 13 Constitution save; on failure, target loses 1 AP on their next turn.',
                            mechanicsText: '-1 AP on next turn'
                        }
                    ]
                },
                targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: range, targetRestrictions: ['enemy'] },
                resourceCost: { actionPoints: 1, mana: 0, health: 0 },
                cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
                resolution: 'DICE',
                tags: ['ranged', 'blowgun', 'poison', 'sleep']
            };
        case 'boomerang':
            return {
                id: 'ranged_quirk_circling_gale',
                name: 'Circling Gale Arc',
                description: 'Launch the airfoil in a wide curving trajectory that sweeps across 2 adjacent enemy tiles before returning smoothly to your grip.',
                level: 1,
                spellType: 'ACTION',
                effectTypes: ['damage'],
                source: 'weapon_quirk',
                categoryIds: ['general_actions'],
                icon: 'Utility/Counter Spiral',
                damageConfig: { formula: damageNotation, weaponDependent: true, damageType: 'smashing', canCrit: true, critMultiplier: 2 },
                targetingConfig: { targetingType: 'area', rangeType: 'ranged', rangeDistance: range, areaShape: 'line', areaSize: 10, targetRestrictions: ['enemy'] },
                resourceCost: { actionPoints: 1, mana: 0, health: 0 },
                cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
                resolution: 'DICE',
                tags: ['ranged', 'boomerang', 'returning', 'cleave']
            };
        case 'chakram':
            return {
                id: 'ranged_quirk_rebounding_edge',
                name: 'Rebounding Edge',
                description: 'Fling the bladed ring to slice a primary target, then ricochet to an adjacent enemy within 5 ft for 1d6 slicing damage.',
                level: 1,
                spellType: 'ACTION',
                effectTypes: ['damage'],
                source: 'weapon_quirk',
                categoryIds: ['general_actions'],
                icon: 'Slashing/Cross Slash',
                damageConfig: { formula: damageNotation, weaponDependent: true, damageType: 'slicing', canCrit: true, critMultiplier: 2 },
                targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: range, targetRestrictions: ['enemy'] },
                resourceCost: { actionPoints: 1, mana: 0, health: 0 },
                cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
                resolution: 'DICE',
                tags: ['ranged', 'chakram', 'ricochet', 'slicing']
            };
        case 'shuriken':
        case 'dart':
            return {
                id: 'ranged_quirk_pinpoint_twin_flick',
                name: 'Pinpoint Twin Flick',
                description: 'Flick two concealed micro-projectiles simultaneously at separate targets or a single target’s pressure points for 1d4 damage each.',
                level: 1,
                spellType: 'ACTION',
                effectTypes: ['damage'],
                source: 'weapon_quirk',
                categoryIds: ['general_actions'],
                icon: 'Piercing/Dual Daggers',
                damageConfig: { formula: '2d4 + agility_modifier', damageType: 'piercing', canCrit: true, critMultiplier: 2 },
                targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: range, targetRestrictions: ['enemy'] },
                resourceCost: { actionPoints: 1, mana: 0, health: 0 },
                cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
                resolution: 'DICE',
                tags: ['ranged', 'flick', 'flurry', 'piercing']
            };
        case 'thrown':
            return {
                id: 'ranged_quirk_pinning_skewer',
                name: 'Pinning Skewer',
                description: 'Hurl the weapon with tremendous force, pinning the target’s boots or clothing to the floor (Rooted until end of round unless they pass a STR check).',
                level: 1,
                spellType: 'ACTION',
                effectTypes: ['damage', 'control'],
                source: 'weapon_quirk',
                categoryIds: ['general_actions'],
                icon: 'Piercing/Spear Throw',
                damageConfig: {
                    formula: damageNotation,
                    weaponDependent: true,
                    damageType: damageType,
                    savingThrowConfig: {
                        enabled: true,
                        savingThrow: { ability: 'strength', difficultyClass: 13, saveOutcome: 'negates' },
                        savingThrowType: 'strength',
                        difficultyClass: 13,
                        saveOutcome: 'negates'
                    },
                    canCrit: true,
                    critMultiplier: 2
                },
                controlConfig: {
                    controlType: 'status_effect',
                    duration: 1,
                    durationUnit: 'rounds',
                    savingThrow: { ability: 'strength', difficultyClass: 13, saveOutcome: 'negates' },
                    saveType: 'strength',
                    difficultyClass: 13,
                    saveOutcome: 'negates',
                    effects: [
                        {
                            id: 'rooted',
                            name: 'Rooted (Pinned)',
                            description: 'Forces a DC 13 Strength save; on failure, target clothes/limbs are pinned to the surface (Rooted).',
                            mechanicsText: 'Target speed is 0'
                        }
                    ]
                },
                targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: range, targetRestrictions: ['enemy'] },
                resourceCost: { actionPoints: 1, mana: 0, health: 0 },
                cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
                resolution: 'DICE',
                tags: ['ranged', 'thrown', 'root', 'skewer']
            };
        case 'wand':
            return {
                id: 'ranged_quirk_prismatic_spark',
                name: 'Prismatic Spark',
                description: 'Snap the wand tip forward to spray dazzling arcane flares. Deals 1d6 force damage and illuminates the target, preventing stealth or invisibility for 2 turns.',
                level: 1,
                spellType: 'ACTION',
                effectTypes: ['damage', 'utility'],
                source: 'weapon_quirk',
                categoryIds: ['general_actions'],
                icon: 'Arcane/Missile',
                damageConfig: { formula: '1d6 + intelligence_modifier', damageType: 'radiant', canCrit: true, critMultiplier: 2 },
                targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: range, targetRestrictions: ['enemy'] },
                resourceCost: { actionPoints: 1, mana: 0, health: 0 },
                cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
                resolution: 'DICE',
                tags: ['ranged', 'wand', 'radiant', 'spark']
            };
        case 'bow':
        default:
            return {
                id: 'ranged_quirk_trick_arc',
                name: 'Trick Arc Shot',
                description: 'Fire a projectile in a high parabolic trajectory that curves neatly over cover and obstacles, ignoring partial and half cover penalties.',
                level: 1,
                spellType: 'ACTION',
                effectTypes: ['damage'],
                source: 'weapon_quirk',
                categoryIds: ['general_actions'],
                icon: 'Piercing/Arrow Wavy Path',
                damageConfig: { formula: `${damageNotation} + agility_modifier`, weaponDependent: true, damageType: 'piercing', canCrit: true, critMultiplier: 2 },
                targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: range, targetRestrictions: ['enemy'] },
                resourceCost: { actionPoints: 1, mana: 0, health: 0 },
                cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
                resolution: 'DICE',
                tags: ['ranged', 'bow', 'trick_shot', 'cover_ignore']
            };
    }
}

/**
 * Baseline Actions for Ranged Slot
 */
export function getRangedActions(item) {
    if (!item) {
        return [
            {
                id: 'ranged_improvised_throw',
                name: 'Throw Improvised Object',
                description: 'Pick up and fling a loose stone, dagger, or improvised missile at a distant foe for 1d4 damage.',
                level: 1,
                spellType: 'ACTION',
                effectTypes: ['damage'],
                source: 'general',
                categoryIds: ['general_actions'],
                icon: 'General/Rock Throw',
                damageConfig: { formula: '1d4 + agility_modifier', damageType: 'smashing', canCrit: true, critMultiplier: 2 },
                targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['enemy'] },
                resourceCost: { actionPoints: 1, mana: 0, health: 0 },
                cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
                resolution: 'DICE',
                tags: ['ranged', 'improvised', 'throw']
            }
        ];
    }

    const damageNotation = getWeaponDamageNotation(item);
    const damageType = getWeaponDamageType(item);
    const range = getWeaponRange(item);
    const attribute = getWeaponAttackAttribute(item);
    const disciplineKey = getWeaponDisciplineKey(item);
    const rawSpecial = WEAPON_DISCIPLINE_SPECIALS[disciplineKey] || WEAPON_DISCIPLINE_SPECIALS.bow;
    const special = adaptSpecialForWeapon(rawSpecial, item);
    const rawQuirky = getRangedQuirkyAction(item, disciplineKey, damageNotation, damageType, range);
    const quirkyAction = adaptSpecialForWeapon(rawQuirky, item);

    const standardRangedIcon = disciplineKey === 'crossbow' ? 'Piercing/Piercing Bolt' : disciplineKey === 'wand' ? 'Arcane/Missile' : 'Piercing/Bow Shot';

    const standardAttack = {
        id: 'ranged_standard_attack',
        name: `Ranged Attack (${item.name})`,
        description: `Fire a standard projectile from your ${item.name}. Deals ${damageNotation} ${damageType} damage plus ${attribute.toUpperCase()} modifier at range up to ${range} ft.`,
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage'],
        source: 'general',
        categoryIds: ['general_actions'],
        icon: standardRangedIcon,
        damageConfig: {
            formula: `${damageNotation} + ${attribute}_modifier`,
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            attributeModifier: attribute,
            damageType: damageType,
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: {
            targetingType: 'single',
            rangeType: 'ranged',
            rangeDistance: range,
            targetRestrictions: ['enemy']
        },
        resourceCost: { actionPoints: 1, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
        resolution: 'DICE',
        tags: ['ranged', 'attack', damageType]
    };

    const aimedShot = {
        id: 'ranged_aimed_shot',
        name: 'Aimed Precision Shot',
        description: 'Steady your breath and align the sights on a vital opening. Grants +2 to hit and an expanded critical threat window.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage'],
        source: 'general',
        categoryIds: ['general_actions'],
        icon: 'Piercing/Focused Arrow Shot',
        damageConfig: {
            formula: `${damageNotation} + 2`,
            weaponDependent: true,
            damageType: damageType,
            canCrit: true,
            critMultiplier: 2
        },
        targetingConfig: {
            targetingType: 'single',
            rangeType: 'ranged',
            rangeDistance: range,
            targetRestrictions: ['enemy']
        },
        resourceCost: { actionPoints: 1, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['ranged', 'precision', 'crit']
    };

    const overwatch = {
        id: 'ranged_overwatch',
        name: 'Overwatch',
        description: 'Hold a ready arrow or bolt, observing a target corridor. Take an immediate reactive shot if an enemy enters your sightline.',
        level: 1,
        spellType: 'REACTION',
        effectTypes: ['damage'],
        source: 'general',
        categoryIds: ['general_reactions'],
        icon: 'Piercing/Aimed Up',
        damageConfig: {
            formula: damageNotation,
            weaponDependent: true,
            damageType: damageType,
            canCrit: true,
            critMultiplier: 1
        },
        targetingConfig: {
            targetingType: 'single',
            rangeType: 'ranged',
            rangeDistance: range,
            targetRestrictions: ['enemy']
        },
        resourceCost: { actionPoints: 1, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['reaction', 'ranged', 'overwatch']
    };

    return [standardAttack, quirkyAction, aimedShot, overwatch, special];
}

/**
 * Get all available actions for a specific equipment slot
 * @param {string} slotName - 'mainHand', 'offHand', or 'ranged'
 * @param {Object} equipment - The character's equipment object
 * @returns {Array} List of action spells
 */
export function getActionsForSlot(slotName, equipment) {
    if (!equipment) return [];

    switch (slotName) {
        case 'mainHand':
            return getMainHandActions(equipment.mainHand);
        case 'offHand':
            // If main hand is two-handed, off-hand is disabled
            if (equipment.mainHand?.weaponSlot === 'TWO_HANDED') {
                return [];
            }
            return getOffHandActions(equipment.offHand);
        case 'ranged':
            return getRangedActions(equipment.ranged);
        default:
            return [];
    }
}
