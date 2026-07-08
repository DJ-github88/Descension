/**
 * Weapon Type — Standard d8 Flavor Tables
 * ---------------------------------------
 * Standard Rules ("simple" mode): every attack rolls TWO dice at once.
 *   1. Weapon Type die  — a static d8 for ALL weapons. The result picks a
 *      unique, flavor-forward outcome for the equipped weapon that ADDS to or
 *      RETRACTS from the attack. A d8 (not a d6) keeps the strongest signature
 *      effects rare enough to stay special.
 *   2. Weapon Damage die — varies by weapon (d4 .. d12, see the damage table).
 *
 * The d8 uses one consistent 8-tier scale across ALL weapons so players learn
 * the curve once; the flavour text is unique per weapon archetype so each
 * weapon feels distinct and carries its own tactical identity (face 8 = the
 * weapon's signature move: a Bow double-crits, a Mace stuns, a Maul shoves,
 * and so on).
 *
 * Mythrill uses a durability system for gear, NOT flat Damage Reduction, so
 * these outcomes never "ignore armor DR" — where a weapon would crack guard it
 * instead threatens the target's gear durability.
 *
 * Advanced Rules ("advanced" mode) layer the Weapon Mastery quest ladder and
 * rank-gated tables on top of the same d8 outcomes (see WEAPON_FACE_TEXT in
 * Skills.jsx).
 */

/**
 * The shared d8 tier scale.
 * `delta` is a compact human label shown on the die card / outcome rows.
 * `tone` drives the colour treatment.
 */
export const WEAPON_TYPE_TIERS = {
    1: { name: 'Fumble',    delta: 'cost',     tone: 'bad',   blurb: 'A mishap that costs you something.' },
    2: { name: 'Glancing',  delta: '½ dmg',    tone: 'weak',  blurb: 'Off-balance — half damage.' },
    3: { name: 'Clean',     delta: '+0',       tone: 'base',  blurb: 'A solid hit, normal damage.' },
    4: { name: 'Solid',     delta: '+1',       tone: 'ok',    blurb: 'A firm strike with a small edge.' },
    5: { name: 'Strong',    delta: '+2',       tone: 'good',  blurb: 'A decisive blow or tactical push.' },
    6: { name: 'Skilled',   delta: '+2',       tone: 'good',  blurb: 'A practiced technique with a strong effect.' },
    7: { name: 'Expert',    delta: '+3',       tone: 'great', blurb: 'A masterful flourish and a major effect.' },
    8: { name: 'Signature', delta: 'tactical', tone: 'crit',  blurb: 'The weapon’s defining tactical move.' }
};

/**
 * Unique d8 outcome text per weapon archetype (Standard Rules).
 * Faces 1-8 map onto the tier scale above. Face 8 is always the signature.
 */
export const WEAPON_TYPE_SIMPLE_TABLES = {
    sword: {
        1: 'Blade overextends; lose 1 AP this round.',
        2: 'Edge scrapes; shallow cut — half damage.',
        3: 'Measured cut; clean, normal damage.',
        4: 'Quick slash; +1 damage and step 1 after the hit.',
        5: 'Pommel check; +2 damage and the target reels, losing 1 tile of movement.',
        6: 'Cross-cut; +2 damage, then roll the weapon die again at half value.',
        7: 'Riposte set; +2 damage. If the target strikes you before your next turn, make a free counter at −1.',
        8: 'Dancing steel; make a free follow-up slash at half damage.'
    },
    axe: {
        1: 'Head bites and lodges; spend 1 AP to wrench it free.',
        2: 'Heavy chop skids; half damage.',
        3: 'Raking cut; normal damage.',
        4: 'Wide arc; +1 damage and push the target back 1 tile.',
        5: 'Hack through; +2 damage versus shields or hard cover.',
        6: 'Cleave; +2 damage and deal 2 damage to an adjacent foe.',
        7: 'Hook and yank; +2 damage and pull the target 1 tile.',
        8: 'Sundering chop; roll the weapon die again — knock a durability step off the target’s armor or shield, or deal +4.'
    },
    mace: {
        1: 'Shock up the arm; lose 1 AP after this swing.',
        2: 'Glancing crown; half damage.',
        3: 'Bruising strike; normal damage.',
        4: 'Ringing blow; +1 damage and the target’s next action is −1.',
        5: 'Shatter guard; +2 damage and knock a durability step off the target’s armor.',
        6: 'Crush limb; +2 damage and the target’s move is −1 until end of next turn.',
        7: 'Concussive blow; +3 damage and the target is dazed (loses 1 AP).',
        8: 'Skull-rattler; on hit, the target is stunned for 1 round.'
    },
    dagger: {
        1: 'Slip; nick yourself for 1 damage.',
        2: 'Short slash; half damage.',
        3: 'Close stab; normal damage.',
        4: 'Gut jab; +1 damage and you may move 1 tile into cover.',
        5: 'Hamstring; +2 damage and the target’s speed −1 until it recovers.',
        6: 'Bleed line; +2 damage and the target suffers ongoing bleed (GM adjudicates).',
        7: 'Quickhand; +2 damage and make a second dagger jab at −3 to hit.',
        8: 'Assassin’s flick; roll the weapon die again and step 1 for free.'
    },
    greatsword: {
        1: 'Mass overbalances; fall prone unless you spend 1 AP to steady.',
        2: 'Draggy swing; half damage.',
        3: 'Driving cut; normal damage and push the target 1 tile.',
        4: 'Wide arc; +1 damage and push the target back 1.',
        5: 'Mighty sweep; +2 damage and deal 2 to an adjacent foe.',
        6: 'Batter through; +2 damage and ignore heavy cover.',
        7: 'Cleaving stride; +3 damage, move 1 tile, and strike a second adjacent foe at −2.',
        8: 'Heaving execution; roll the weapon die again and knock the target prone.'
    },
    greataxe: {
        1: 'Head bites stone; spend 1 AP to free it.',
        2: 'Wild chop; half damage and you stagger 1 tile.',
        3: 'Hefted cleave; normal damage.',
        4: 'Raking arc; +1 damage.',
        5: 'Armor split; +2 damage and knock a durability step off the target’s armor.',
        6: 'Sweeping murder; +2 damage and cleave an adjacent foe for half.',
        7: 'Bonebreaker; +3 damage and the target’s next move is halved.',
        8: 'Executioner’s arc; roll the weapon die again and the target is rattled (loses 1 AP).'
    },
    maul: {
        1: 'Recoil numbs the arms; lose 1 AP after this attack.',
        2: 'Head drags; half damage.',
        3: 'Thudding hit; normal damage.',
        4: 'Cratering blow; +1 damage.',
        5: 'Ring their bell; +2 damage or daze the target (loses 1 AP).',
        6: 'Ground-shake; +2 damage and knock the target prone.',
        7: 'Stunning smash; +3 damage and the target is dazed (loses 1 AP).',
        8: 'Pulverize; roll the weapon die again, knock the target prone, and shove it 2 tiles.'
    },
    polearm: {
        1: 'Hook catches; you cannot move this turn.',
        2: 'Overreach; half damage.',
        3: 'Set vs advance; normal damage — if the target moved toward you, +2.',
        4: 'Lever pull; +1 damage, then push or pull the target 1 tile.',
        5: 'Trip arc; +2 damage and the target must steady or fall prone.',
        6: 'Pin and post; +2 damage and the target’s move is −2 until end of next turn.',
        7: 'Crow’s beak; +3 damage and pull the target 2 tiles.',
        8: 'Whirl hook; roll the weapon die again and reposition the target 3 tiles.'
    },
    staff: {
        1: 'Misstep; fall prone unless you spend 1 AP to steady.',
        2: 'Glance; half damage.',
        3: 'Quick rap; normal damage.',
        4: 'Low sweep; +1 damage and the target’s next attack is −1.',
        5: 'Disarm flick; +2 damage, or the target drops a held item.',
        6: 'Trip and follow; +2 damage, the target goes prone, and you may step 1.',
        7: 'Sweeping arc; +3 damage and the target is knocked prone or dazed.',
        8: 'Whirling stave; roll the weapon die again, strike a second adjacent foe for half, and move 1 tile.'
    },
    bow: {
        1: 'String frays; your next shot costs +1 AP to ready.',
        2: 'Wind catches; half damage.',
        3: 'Arced shot; normal damage.',
        4: 'Pinning arrow; +1 damage and the target’s next move is −2.',
        5: 'Seam seeker; +2 damage and ignore cover on this shot.',
        6: 'Marked; +2 damage and the next ally to shoot this target gains +2 to hit.',
        7: 'Whistling arc; +3 damage and add +2 range to your next shot.',
        8: 'Twin release; double critical — fire a second arrow at the target for full damage.'
    },
    crossbow: {
        1: 'Latch jams; spend 1 AP to clear before your next shot.',
        2: 'Bolt skitters; half damage.',
        3: 'Solid bolt; normal damage.',
        4: 'Pinned limb; +1 damage and the target’s next action is −1.',
        5: 'Punch-through; +2 damage and the bolt strikes a second target behind for half.',
        6: 'Crank and fire; +2 damage and ignore cover on this shot.',
        7: 'Rattling hit; +3 damage and the target loses 1 AP next turn.',
        8: 'Snap reload; roll the weapon die again, reload for free, and gain +1 damage on the next shot.'
    },
    thrown: {
        1: 'Slip; the weapon drops at your feet.',
        2: 'Off-line; half damage.',
        3: 'Solid throw; normal damage.',
        4: 'Pin cloak; +1 damage and the target’s speed −2.',
        5: 'Gouging strike; +2 damage and the target is dazzled (next attack −1).',
        6: 'Ricochet; +2 damage and choose a second nearby target for 2 damage.',
        7: 'Crippling toss; +3 damage and the target bleeds (GM adjudicates).',
        8: 'Bullseye; roll the weapon die again and you may immediately retrieve the weapon.'
    },
    wand: {
        1: 'Mana sputter; lose 1 mana or charge.',
        2: 'Wild spark; half damage.',
        3: 'Arcane dart; normal damage.',
        4: 'Channel; +1 damage or regain 1 mana/charge.',
        5: 'Spell lash; +2 damage and the target’s next action is −1.',
        6: 'Force pulse; +2 damage and push the target 2 tiles.',
        7: 'Focused surge; +3 damage and regain 2 mana/charges.',
        8: 'Overchannel; roll the weapon die again — regain 2 mana/charges or deal +4.'
    },
    unarmed: {
        1: 'Wild swing; overextend and lose 1 AP.',
        2: 'Glancing jab; half damage.',
        3: 'Solid hit; normal damage.',
        4: 'Counter palm; +1 damage and shove the target 1 tile.',
        5: 'Elbow in; +2 damage and the target’s next attack is −1.',
        6: 'Sweep the leg; +2 damage and knock the target prone.',
        7: 'Stunning strike; +3 damage or daze the target (loses 1 AP).',
        8: 'Open-hand finale; roll the weapon die again and move 1 tile into a better position.'
    }
};

/**
 * Every weapon type in the game maps onto one of the archetypes above.
 * Instruments channel magic (→ wand) except the drum (→ mace).
 */
export const WEAPON_SIMPLE_TABLE_MAP = {
    // One-Handed
    sword: 'sword',
    rapier: 'sword',
    katana: 'sword',
    saber: 'sword',
    axe: 'axe',
    mace: 'mace',
    'war mace': 'mace',
    flail: 'mace',
    dagger: 'dagger',
    sickle: 'dagger',
    'parrying dagger': 'dagger',
    'off hand blade': 'dagger',
    shuriken: 'dagger',
    'fist weapon': 'unarmed',
    // Two-Handed
    greatsword: 'greatsword',
    'double sided sword': 'greatsword',
    greataxe: 'greataxe',
    maul: 'maul',
    polearm: 'polearm',
    halberd: 'polearm',
    scythe: 'polearm',
    'jousting spear': 'polearm',
    staff: 'staff',
    // Ranged
    bow: 'bow',
    crossbow: 'crossbow',
    thrown: 'thrown',
    dart: 'thrown',
    sling: 'thrown',
    boomerang: 'thrown',
    chakram: 'thrown',
    blowgun: 'thrown',
    wand: 'wand',
    // Instruments
    harp: 'wand',
    lute: 'wand',
    flute: 'wand',
    horn: 'wand',
    violin: 'wand',
    guitar: 'wand',
    drum: 'mace',
    // Special
    unarmed: 'unarmed'
};

/** Resolve the archetype key for any weapon type (falls back to 'sword'). */
export function getWeaponArchetype(weaponKey) {
    return WEAPON_SIMPLE_TABLE_MAP[weaponKey] || 'sword';
}

/** Resolve the d8 flavor table for a weapon type (Standard Rules). */
export function getWeaponSimpleTable(weaponKey) {
    return WEAPON_TYPE_SIMPLE_TABLES[getWeaponArchetype(weaponKey)] || WEAPON_TYPE_SIMPLE_TABLES.sword;
}
