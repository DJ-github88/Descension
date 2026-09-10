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
 * @returns {string} One of the discipline keys from WEAPON_TYPE_META, or 'shield', or 'unarmed'
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

    // Off-hand focus items (idols, tomes, orbs, totems)
    if (subtype.includes('idol') || subtype.includes('fetish')) return 'idol';
    if (subtype.includes('tome') || subtype.includes('book') || subtype.includes('codex') || subtype.includes('grimoire')) return 'tome';
    if (subtype.includes('sphere') || subtype.includes('orb')) return 'sphere';
    if (subtype.includes('totem') || subtype.includes('effigy')) return 'totem';

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
 * 44 Unique, Flavor-Forward Weapon Discipline Specials (2 AP each)
 * Formatted as full Mythrill spell cards with rich mechanics, damageConfig, and tooltips.
 * Grounded in the Mythrill defense model: no AC — armor soaks with DR dice tied to
 * the durability ladder, crits explode, saves use the six attributes (spirit, not wisdom).
 */
export const WEAPON_DISCIPLINE_SPECIALS = {
    sword: {
        id: 'spec_sword_dancing_steel',
        name: 'Dancing Steel',
        description: 'Measure your partner, dip, and finish on the downbeat — a blademaster flourish that slips past the guard. Deals weapon damage + 2, and lets you take a free 1-tile tactical step without provoking reactions. The band plays on.',
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
        name: 'Eviction Notice',
        description: 'The bearded axe repossesses a chunk of the target’s gear. Deals weapon damage + 2, and the impact steps the target’s armor DR die down one step (d8 → d6, and so on) until repaired. Possessions must go.',
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
        controlConfig: {
            controlType: 'status_effect',
            effects: [
                {
                    id: 'dr_step_down',
                    name: 'Evicted (Armor DR Step-Down)',
                    description: 'The target’s armor DR die steps down one step (d8 → d6, etc.) until repaired.',
                    mechanicsText: 'Armor DR die steps down one step until repaired'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'axe', 'sunder', 'dr_step_down']
    },
    mace: {
        id: 'spec_mace_skull_rattler',
        name: 'Skull-Rattler',
        description: 'Rings the target’s helm like a dinner bell. Deals weapon damage, and the cranial percussion forces a DC 14 Constitution save; on failure, the target is Stunned for 1 round — ears still ringing.',
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
        name: 'Shoelace Express',
        description: 'A quick delivery, straight to the tendons behind the knee. Deals weapon damage + 1; DC 13 Agility save or the target’s movement speed is halved for 2 rounds while they quietly reconsider their laces.',
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
                    name: 'Untied Laces (Movement Halved)',
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
        name: 'Envelope Opener',
        description: 'Slides past plate like a letter opener through sealed mail — terribly rude, terribly neat. Deals weapon damage + 3, and the blade threatens a Sovereign Critical on a weapon-die roll of max OR one below max (the wider window still explodes as normal).',
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
        description: 'One breath. One draw. No apology. If the target has not yet acted this round, the weapon die is treated as its maximum value — which then explodes per Sovereign Critical rules — for weapon damage + 2. Blink and you’ll miss both the draw and the point.',
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
        name: 'Drive-By Curtsy',
        description: 'A flashing curved cut delivered mid-stride, with impeccable manners. Deals weapon damage + 1 and grants a free 1-tile reposition that provokes no reactions. Curtsy optional, but encouraged.',
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
        name: 'Turnip Reaper',
        description: 'Hooks an ankle and reels the foe in like a stubborn root vegetable. Deals weapon damage + 1; DC 13 Strength save or the target is yanked 1 tile (5 ft) toward you. Fresh produce, delivered daily.',
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
                    name: 'Reaped (Pull 5 ft)',
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
        name: 'Bypass the Bouncer',
        description: 'The spiked ball takes the scenic route — entirely around the shield. The target’s shield DR die cannot soak this hit (body armor still can), and their shield cracks, losing 1 durability for its trouble. Deals weapon damage + 2. Names not on the list.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'debuff'],
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
        controlConfig: {
            controlType: 'status_effect',
            effects: [
                {
                    id: 'shield_bypassed',
                    name: 'Bounced (Shield Bypassed)',
                    description: 'The target’s shield DR die cannot soak this hit, and the shield loses 1 durability.',
                    mechanicsText: 'Shield DR die cannot soak; shield loses 1 durability'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'flail', 'shield_bypass', 'dr_step_down']
    },
    'fist weapon': {
        id: 'spec_fistweapon_rending_claws',
        name: 'Rending Claws',
        description: 'Introduces the enemy to their new life as a scratching post. Deals weapon damage + 1d4 immediate bleed, and the wounds weep for another 1d4 at the start of each of the target’s next 2 turns.',
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
        controlConfig: {
            controlType: 'status_effect',
            duration: 2,
            durationUnit: 'turns',
            effects: [
                {
                    id: 'bleed',
                    name: 'Scratching Post (Bleed)',
                    description: 'The target bleeds 1d4 at the start of each of its next 2 turns.',
                    mechanicsText: '1d4 bleed per turn, 2 turns'
                }
            ]
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
        description: 'Catch the incoming blade in your quillons, compliment their form — then return it, at speed. Establishes a binding stance: your next Parry contest rolls the weapon die one step higher, and a successful Parry grants an immediate free Riposte.',
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
        description: 'Two blades, one appointment, no waiting room. Your off-hand fang strikes in tandem with the primary weapon, delivering two separate weapon-die damage instances. The receptionist will see both of you now.',
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
        name: 'Can Opener',
        description: 'Crashes the spiked face into the breastplate — and peels. Deals weapon damage + 3, steps the target’s armor DR die down one step (d8 → d6, and so on), and the ringing clang leaves them Dazed (−1 AP next turn). Dinner is served.',
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
        controlConfig: {
            controlType: 'status_effect',
            duration: 1,
            durationUnit: 'turns',
            effects: [
                {
                    id: 'dazed',
                    name: 'Rung Like a Bell (−1 AP)',
                    description: 'The clang leaves the target Dazed: −1 AP on their next turn, and their armor DR die steps down one step until repaired.',
                    mechanicsText: '−1 AP next turn; armor DR die steps down until repaired'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'war_mace', 'sunder', 'daze', 'dr_step_down']
    },
    greatsword: {
        id: 'spec_greatsword_colossus_cleave',
        name: 'Colossus Cleave',
        description: 'A ferocious 180° arc with a blade built for architecture. Deals weapon damage + 2 to the primary target — and the follow-through is everyone else’s problem: one adjacent enemy of your choice takes half the rolled damage.',
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
        description: 'An overhead chop with geological ambitions. Deals weapon damage + 3; DC 14 Strength save or the target is hurled 2 tiles (10 ft) backward — and whatever they land in has its armor DR die stepped down one step. The mountain does not negotiate.',
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
                    name: 'Split Asunder (Knockback 10 ft)',
                    description: 'Forces a DC 14 Strength save; on failure, target is knocked 2 tiles (10 ft) backward and their armor DR die steps down one step until repaired.',
                    mechanicsText: 'Pushes target 10 ft; armor DR die steps down until repaired'
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
        description: 'Introduces the target to the floor. Personally. Deals weapon damage + 2 with a ground-shaking impact; DC 14 Strength save or the target is slammed Prone, and the tremor rattles every boot within 5 ft (flavor is free).',
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
        description: 'Unscheduled pole-vault lessons, courtesy of your haft. From 10 ft away, sweep the target’s legs clean; DC 14 Agility save or they are tripped Prone while you remain dignified. Deals weapon damage + 1.',
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
        name: 'Coat Check',
        description: 'Hook their shield — or weapon — with the rear spike and hang it somewhere else for the turn. The hooked guard cannot contribute its DR soak to your follow-up axe chop, which lands for weapon damage + 3. No coat, no service.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'control'],
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
        controlConfig: {
            controlType: 'status_effect',
            effects: [
                {
                    id: 'shield_hooked',
                    name: 'Coat Checked (Guard Hooked)',
                    description: 'The target’s hooked shield or weapon cannot contribute its DR soak against this hit.',
                    mechanicsText: 'Shield/guard DR cannot soak this hit'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 10, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'halberd', 'reach', 'hook', 'dr_step_down']
    },
    scythe: {
        id: 'spec_scythe_soul_harvest',
        name: 'Soul Harvest',
        description: 'Reaps across vital centers and takes a small deposit — non-refundable. Deals weapon damage + 2, and the lingering grave-chill prevents the target from recovering health for 1 round (healing and regeneration stall).',
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
        controlConfig: {
            controlType: 'status_effect',
            duration: 1,
            durationUnit: 'rounds',
            effects: [
                {
                    id: 'no_healing',
                    name: 'Harvest Deposit (No Healing)',
                    description: 'The target cannot recover health for 1 round. The blade keeps the change.',
                    mechanicsText: 'Healing prevented, 1 round'
                }
            ]
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
        description: 'Couch the lance, lower the visor, and deliver with extreme punctuality. If you have moved at least 2 tiles toward the target this turn, the charge deals DOUBLE weapon damage. Signature required on arrival.',
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
        description: 'Become a blender with strong opinions. Spin both edges in a full circle, striking every adjacent enemy within 5 ft for weapon damage + 1. Ingredients are not optional.',
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
        description: 'Loose a full volley skyward and let gravity do the paperwork. Arrows rain onto a 10 ft radius area at up to 120 ft — today’s forecast: pointed, with a chance of regret. Each enemy in the area takes weapon damage + 1.',
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
        description: 'A winch-cocked bolt with no concept of personal boundaries. It punches through the primary target and keeps going into the next enemy directly behind them — one bolt, two receipts. Deals weapon damage + 3 to each.',
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
        description: 'Bank shot! The blade clips the first enemy’s helm and ricochets into a second foe within 10 ft of the first — both take weapon damage + 2. The laws of physics have been notified and do not care.',
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
        description: 'The wand has opinions and no manners. Channels an overcharged lance of raw force for weapon damage + 2; DC 13 Strength save or the target is shoved 5 ft backward, hair thoroughly staticky.',
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
        description: 'A tiny goodnight kiss on a breath of wind. The envenomed needle deals 1d4 damage; DC 13 Constitution save or the target is Paralyzed until the end of their next turn. Nap time, administered.',
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
        description: 'David’s formal rebuttal. A lead bullet at centrifugal velocity rings the target’s skull for weapon damage + 2 — and the ringing scrambles their dice: the target’s next weapon-die roll cannot explode (no Sovereign Critical).',
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
        controlConfig: {
            controlType: 'status_effect',
            duration: 1,
            durationUnit: 'turns',
            effects: [
                {
                    id: 'no_explode',
                    name: 'Scrambled (No Exploding Die)',
                    description: 'The target’s next weapon-die roll cannot explode — no Sovereign Critical.',
                    mechanicsText: 'Next damage die cannot explode'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 60, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'sling', 'concussion', 'no_explode']
    },
    boomerang: {
        id: 'spec_boomerang_returning_whirlwind',
        name: 'Returning Whirlwind',
        description: 'The thrower carves through the target, orbits once, and comes home — filing a complaint on return. Deals weapon damage + 2 at up to 50 ft, and catching it grants a free Ready action. Return postage prepaid.',
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
        description: 'Send the disc on a close orbit — a shaving appointment the target did not book. Deals weapon damage + 2 now, and the orbiting edge nicks for 1d4 bleed at the start of their next turn.',
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
        controlConfig: {
            controlType: 'status_effect',
            duration: 1,
            durationUnit: 'turns',
            effects: [
                {
                    id: 'bleed',
                    name: 'Close Shave (Bleed)',
                    description: 'The orbiting edge nicks the target for 1d4 bleed at the start of their next turn.',
                    mechanicsText: '1d4 bleed next turn'
                }
            ]
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
        description: 'Distribute sharpened business cards to up to three targets within 35 ft — each takes weapon damage + 1. Networking, the old way.',
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
        description: 'Flick a needle-point dart into the seam of their harness, where it finds armor deeply offensive. For this hit, the target’s armor DR die soaks one step lower (d8 → d6, and so on) — the dart slips in like gossip at court. Deals weapon damage + 2 with an increased crit chance.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'debuff'],
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
        controlConfig: {
            controlType: 'status_effect',
            effects: [
                {
                    id: 'dr_step_down_hit',
                    name: 'Seam Found (DR Step-Down, This Hit)',
                    description: 'For this hit only, the target’s armor DR die soaks one step lower (d8 → d6, etc.).',
                    mechanicsText: 'Armor soaks one die step lower against this hit'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 40, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'dart', 'precision', 'crit', 'dr_step_down']
    },
    harp: {
        id: 'spec_harp_harmonic_cascade',
        name: 'Harmonic Cascade',
        description: 'Strum a chord so serene the air itself stands guard. You or an ally within 30 ft becomes Guarded: all damage taken is reduced by 25% for 1 round. A lullaby with a bodyguard clause.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['buff', 'utility'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Radiant/Holy Aura',
        buffConfig: {
            buffType: 'defense',
            effects: [{ id: 'guarded', name: 'Guarded (Harmonic Cascade)', description: 'All damage taken reduced by 25% for 1 round.' }],
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
        description: 'Strum a chord with a criminal record. The cacophony shatters concentration and ripples outward: enemies within 10 ft take 1d6 + 2 storm damage; DC 13 Strength save or they are shoved 5 ft back with their ears ringing.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['control', 'damage'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Nature/Healing Breeze',
        damageConfig: {
            formula: '1d6 + 2',
            damageType: 'storm',
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
        description: 'A trill that charms the inner ear and evicts good decisions. DC 13 Spirit save or the target is Hypnotized and cannot take reactions until your next turn. They will hum it for days. Days.',
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
            savingThrow: { ability: 'spirit', difficultyClass: 13, saveOutcome: 'negates' },
            saveType: 'spirit',
            difficultyClass: 13,
            saveOutcome: 'negates',
            effects: [
                {
                    id: 'hypnotized',
                    name: 'Hypnotized (No Reactions)',
                    description: 'Forces a DC 13 Spirit save; on failure, target cannot take reactions until your next turn.',
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
        description: 'The beat drops. So do they. A thunderous 15 ft cone of storm sound deals 1d8 + 2 damage; DC 13 Strength save or foes are pushed 5 ft back. The neighbors have filed complaints.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'control'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Bludgeoning/Energy Strike',
        damageConfig: {
            formula: '1d8 + 2',
            damageType: 'storm',
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
        description: 'One trumpet scream, morale included. Allies within 30 ft add +1d6 to their next strike roll. Somewhere, a warhorse perks up its ears.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['buff'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Utility/Bull Charge',
        buffConfig: {
            buffType: 'statEnhancement',
            effects: [{ id: 'rallied', name: 'Rallied (Warblast)', description: '+1d6 to the target’s next strike roll.' }],
            durationValue: 1,
            durationUnit: 'rounds'
        },
        targetingConfig: { targetingType: 'area', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['ally', 'self'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 },
        resolution: 'DICE',
        tags: ['instrument', 'discipline', 'horn', 'buff', 'rally']
    },
    violin: {
        id: 'spec_violin_screeching_cacophony',
        name: 'Screeching Cacophony',
        description: 'The violin files a noise complaint directly into the enemy’s skull. DC 13 Constitution save or the target is Dazed — losing 1 AP next turn — and takes 1d6 + 2 storm damage. The neighbors applaud.',
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
        id: 'spec_guitar_power_chord',
        name: 'Power Chord',
        description: 'Strike a chord that vibrates through the floorboards and disagrees with the target’s skeleton. Deals 1d6 + 2 storm damage, and their next check rolls one difficulty die step higher — legs unsteady, dignity unaccounted for.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'debuff'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Chaos/Chaos Wave',
        damageConfig: {
            formula: '1d6 + 2',
            damageType: 'storm',
            canCrit: true,
            critMultiplier: 2
        },
        controlConfig: {
            controlType: 'status_effect',
            duration: 1,
            durationUnit: 'turns',
            effects: [
                {
                    id: 'difficulty_up',
                    name: 'Rattled (Difficulty Step-Up)',
                    description: 'The target’s next check rolls one difficulty die step higher.',
                    mechanicsText: 'Next check: difficulty die one step up'
                }
            ]
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
        description: 'A flying heel strike, signed and delivered. Deals 1d6 + 2 smashing damage; DC 13 Agility save or the target is planted Prone. Postage due on arrival.',
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
                    description: 'Forces a DC 13 Agility save; on failure, target is planted Prone.',
                    mechanicsText: 'Target falls Prone'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'unarmed', 'kick', 'prone']
    },
    // Off-Hand Focus Items
    idol: {
        id: 'spec_idol_vengeful_little_god',
        name: 'Vengeful Little God',
        description: 'The tenant of the idol takes personal offense on your behalf. It flares with sacred heat for weapon damage + 1 ember, and fixes the target with a burning stare: DC 13 Spirit save or the target is Exposed — all damage they take is increased by 50% for 1 round. The little god remembers their face.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'debuff'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Radiant/Sacred Symbol',
        damageConfig: {
            formula: 'weapon_die + 1',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'ember',
            savingThrowConfig: {
                enabled: true,
                savingThrow: { ability: 'spirit', difficultyClass: 13, saveOutcome: 'negates' },
                savingThrowType: 'spirit',
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
            savingThrow: { ability: 'spirit', difficultyClass: 13, saveOutcome: 'negates' },
            saveType: 'spirit',
            difficultyClass: 13,
            saveOutcome: 'negates',
            effects: [
                {
                    id: 'exposed',
                    name: 'Exposed (Idol’s Grudge)',
                    description: 'Forces a DC 13 Spirit save; on failure, all damage the target takes is increased by 50% for 1 round.',
                    mechanicsText: '+50% damage taken, 1 round'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'idol', 'sacred', 'exposed']
    },
    tome: {
        id: 'spec_tome_cite_your_sources',
        name: 'Cite Your Sources',
        description: 'Snap the codex open and hurl the footnotes. A shrieking volley of loose pages deals weapon damage + 2 storm, and the incantations tangled in the margins bark the target’s own casting into silence: DC 13 Spirit save or the target is Silenced for 1 round. Peer review complete.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'control'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Chaos/Chaos Book Channel',
        damageConfig: {
            formula: 'weapon_die + 2',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'storm',
            savingThrowConfig: {
                enabled: true,
                savingThrow: { ability: 'spirit', difficultyClass: 13, saveOutcome: 'negates' },
                savingThrowType: 'spirit',
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
            savingThrow: { ability: 'spirit', difficultyClass: 13, saveOutcome: 'negates' },
            saveType: 'spirit',
            difficultyClass: 13,
            saveOutcome: 'negates',
            effects: [
                {
                    id: 'silenced',
                    name: 'Silenced (Peer Reviewed)',
                    description: 'Forces a DC 13 Spirit save; on failure, the target cannot speak incantations or cast verbal spells for 1 round.',
                    mechanicsText: 'No verbal casting, 1 round'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'tome', 'arcane', 'silence']
    },
    sphere: {
        id: 'spec_sphere_ominous_hum',
        name: 'Ominous Hum',
        description: 'The orb stares into them and hums a note armor hates. The resonance deals weapon damage + 2 storm, and for this hit the target’s armor DR die soaks one step lower (d8 → d6, and so on) — the sound finds every rivet and worries it. Deeply unsettling. Very effective.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'debuff'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Arcane/Orb Manipulation',
        damageConfig: {
            formula: 'weapon_die + 2',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'storm',
            canCrit: true,
            critMultiplier: 2
        },
        controlConfig: {
            controlType: 'status_effect',
            effects: [
                {
                    id: 'dr_step_down_hit',
                    name: 'Resonating (DR Step-Down, This Hit)',
                    description: 'For this hit only, the target’s armor DR die soaks one step lower (d8 → d6, etc.).',
                    mechanicsText: 'Armor soaks one die step lower against this hit'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 40, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'sphere', 'arcane', 'dr_step_down']
    },
    totem: {
        id: 'spec_totem_tantrum',
        name: 'Totem Tantrum',
        description: 'The carved face wakes up cranky. A lash of spirit-root and splinter deals weapon damage + 1 primal, and grasping carved vines snag the target’s ankles: DC 13 Spirit save or the target is Rooted in place (movement 0) for 1 round. The totem is not a morning person.',
        level: 1,
        spellType: 'ACTION',
        effectTypes: ['damage', 'control'],
        source: 'weapon_discipline',
        categoryIds: ['general_actions'],
        icon: 'Nature/Gnarled Roots',
        damageConfig: {
            formula: 'weapon_die + 1',
            weaponDependent: true,
            usesWeaponDice: true,
            addAttributeModifier: true,
            damageType: 'primal',
            savingThrowConfig: {
                enabled: true,
                savingThrow: { ability: 'spirit', difficultyClass: 13, saveOutcome: 'negates' },
                savingThrowType: 'spirit',
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
            savingThrow: { ability: 'spirit', difficultyClass: 13, saveOutcome: 'negates' },
            saveType: 'spirit',
            difficultyClass: 13,
            saveOutcome: 'negates',
            effects: [
                {
                    id: 'rooted',
                    name: 'Rooted (Ankle Vines)',
                    description: 'Forces a DC 13 Spirit save; on failure, the target’s movement speed is 0 for 1 round.',
                    mechanicsText: 'Movement 0, 1 round'
                }
            ]
        },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, health: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 },
        resolution: 'DICE',
        tags: ['weapon', 'discipline', 'totem', 'primal', 'rooted']
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
 * Off-hand focus disciplines (idols, tomes, spheres, totems) — caster trinkets
 * that get their own flavored action sets instead of dual-wield blade moves.
 */
export const FOCUS_DISCIPLINES = ['idol', 'tome', 'sphere', 'totem'];

function getFocusItemActions(item, disciplineKey) {
    const damageNotation = getWeaponDamageNotation(item);
    const damageType = getWeaponDamageType(item);
    const special = adaptSpecialForWeapon(WEAPON_DISCIPLINE_SPECIALS[disciplineKey], item);

    const focusFlavor = {
        idol: {
            strike: {
                id: 'oh_idol_bonk', name: 'Sacred Bonk', icon: 'Radiant/Golden Bell',
                description: `The idol makes an excellent club, and the little god enjoys the fresh air. Deal ${damageNotation} ${damageType} damage up close.`
            },
            ward: {
                id: 'oh_idol_ward', name: 'Aegis of the Small God', icon: 'Radiant/Radiant Golden Shield',
                description: 'The little god shields its house. You become Guarded: all damage taken is reduced by 25% until your next turn.'
            },
            rebuke: {
                id: 'oh_idol_rebuke', name: 'Zealous Rebuke', icon: 'Radiant/Golden Projectiles',
                description: `When a foe strikes you, the idol flares with offended sanctity, scalding the attacker for ${damageNotation} ${damageType} damage.`
            }
        },
        tome: {
            strike: {
                id: 'oh_tome_spine', name: 'Spine Strike', icon: 'Fire/Burning Cursed Book',
                description: `Hardcover. Hard swing. The tome's spine meets the target's — philologically speaking. Deal ${damageNotation} ${damageType} damage.`
            },
            ward: {
                id: 'oh_tome_ward', name: 'Chapter Break', icon: 'Utility/Barred Shield',
                description: 'Snap the covers shut and huddle behind them. The tome\'s cover soaks the next hit against you with a 1d4 DR die; the binding complains, but it holds.'
            },
            rebuke: {
                id: 'oh_tome_rebuke', name: 'Marginalia Scorch', icon: 'Arcane/Spellcasting Aura',
                description: `The footnotes defend themselves. When struck, searing annotations flash out at your attacker for ${damageNotation} ${damageType} damage.`
            }
        },
        sphere: {
            strike: {
                id: 'oh_orb_knock', name: 'Orbital Knock', icon: 'Arcane/Missile',
                description: `Bonk them with the future. The orb deals ${damageNotation} ${damageType} damage and hums disapprovingly.`
            },
            ward: {
                id: 'oh_orb_ward', name: 'Crystal Cocoon', icon: 'Frost/Ice Orb',
                description: 'The orb spins a lattice of light around you. Guarded: all damage taken is reduced by 25% until your next turn.'
            },
            rebuke: {
                id: 'oh_orb_rebuke', name: 'Static Rebuke', icon: 'Arcane/Spiral Vortex',
                description: `Touch the mage, receive the lesson. Attackers are zapped for ${damageNotation} ${damageType} damage.`
            }
        },
        totem: {
            strike: {
                id: 'oh_totem_whack', name: 'Whack of the Wilds', icon: 'Nature/Roots',
                description: `The forest's least patient branch. Deal ${damageNotation} ${damageType} damage.`
            },
            ward: {
                id: 'oh_totem_ward', name: 'Bark Skin', icon: 'Nature/Growth',
                description: 'Splinters rise across your skin like armor that grows on trees. Physical damage taken is reduced by 2 until your next turn.'
            },
            rebuke: {
                id: 'oh_totem_rebuke', name: 'Root Rebuke', icon: 'Nature/Root Network',
                description: `The totem's roots snap out at anyone who strikes you, dealing ${damageNotation} ${damageType} damage and looking disappointed.`
            }
        }
    }[disciplineKey];

    return [
        {
            id: focusFlavor.strike.id,
            name: focusFlavor.strike.name,
            description: focusFlavor.strike.description,
            level: 1,
            spellType: 'ACTION',
            effectTypes: ['damage'],
            source: 'general',
            categoryIds: ['general_actions'],
            icon: focusFlavor.strike.icon,
            damageConfig: { formula: damageNotation, weaponDependent: true, damageType, canCrit: true, critMultiplier: 2 },
            targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
            resourceCost: { actionPoints: 1, mana: 0, health: 0 },
            cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
            resolution: 'DICE',
            tags: ['off_hand', 'focus', disciplineKey, 'attack']
        },
        {
            id: focusFlavor.ward.id,
            name: focusFlavor.ward.name,
            description: focusFlavor.ward.description,
            level: 1,
            spellType: 'REACTION',
            effectTypes: ['buff'],
            source: 'general',
            categoryIds: ['general_reactions'],
            icon: focusFlavor.ward.icon,
            buffConfig: {
                buffType: 'defense',
                effects: [{ id: focusFlavor.ward.id, name: focusFlavor.ward.name, description: focusFlavor.ward.description }]
            },
            targetingConfig: { targetingType: 'self' },
            resourceCost: { actionPoints: 1, mana: 0, health: 0 },
            cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
            resolution: 'DICE',
            tags: ['reaction', 'off_hand', 'focus', disciplineKey, 'defensive']
        },
        {
            id: focusFlavor.rebuke.id,
            name: focusFlavor.rebuke.name,
            description: focusFlavor.rebuke.description,
            level: 1,
            spellType: 'REACTION',
            effectTypes: ['damage'],
            source: 'general',
            categoryIds: ['general_reactions'],
            icon: focusFlavor.rebuke.icon,
            damageConfig: { formula: damageNotation, weaponDependent: true, damageType, canCrit: true, critMultiplier: 1 },
            targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, targetRestrictions: ['enemy'] },
            resourceCost: { actionPoints: 1, mana: 0, health: 0 },
            cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
            resolution: 'DICE',
            tags: ['reaction', 'off_hand', 'focus', disciplineKey, 'riposte']
        },
        special
    ];
}

/**
 * Baseline Actions for Off Hand (Shield, Off-hand Weapon, Focus Item, or Unarmed)
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

    // If an off-hand focus item (idol / tome / sphere / totem) is equipped
    if (FOCUS_DISCIPLINES.includes(disciplineKey)) {
        return getFocusItemActions(item, disciplineKey);
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
                    damageType: 'blight',
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
                description: 'Flick two concealed micro-projectiles simultaneously at separate targets or a single target’s pressure points for 1d4 stabbing damage each.',
                level: 1,
                spellType: 'ACTION',
                effectTypes: ['damage'],
                source: 'weapon_quirk',
                categoryIds: ['general_actions'],
                icon: 'Piercing/Dual Daggers',
                damageConfig: { formula: '2d4 + agility_modifier', damageType: 'stabbing', canCrit: true, critMultiplier: 2 },
                targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: range, targetRestrictions: ['enemy'] },
                resourceCost: { actionPoints: 1, mana: 0, health: 0 },
                cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
                resolution: 'DICE',
                tags: ['ranged', 'flick', 'flurry', 'stabbing']
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
                description: 'Snap the wand tip forward to spray dazzling arcane flares. Deals 1d6 arcane damage and illuminates the target, preventing stealth or invisibility for 2 turns.',
                level: 1,
                spellType: 'ACTION',
                effectTypes: ['damage', 'utility'],
                source: 'weapon_quirk',
                categoryIds: ['general_actions'],
                icon: 'Arcane/Missile',
                damageConfig: { formula: '1d6 + intelligence_modifier', damageType: 'arcane', canCrit: true, critMultiplier: 2 },
                targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: range, targetRestrictions: ['enemy'] },
                resourceCost: { actionPoints: 1, mana: 0, health: 0 },
                cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 },
                resolution: 'DICE',
                tags: ['ranged', 'wand', 'arcane', 'spark']
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
                damageConfig: { formula: `${damageNotation} + agility_modifier`, weaponDependent: true, damageType: 'stabbing', canCrit: true, critMultiplier: 2 },
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
