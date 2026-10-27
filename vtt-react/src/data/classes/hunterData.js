import {
  HUNTER_TREE_META, HUNTER_TREES, HUNTER_TALENT_NODES,
  HUNTER_PASSIVE_RECORDS, HUNTER_TALENT_CAPACITY
} from '../talentTrees/hunter';

export const HUNTER_CLASS_ID = 'hunter';
export const HUNTER_RULESET_VERSION = 'cr-review-r1';
export const HUNTER_ICON = 'Nature/Trap';
export const HUNTER_MANUAL_NOTICE = 'Manual tabletop only. No automatic quarry, evidence, tag generation, companion action, path, damage, movement or expiry.';

const flags = {
  classId: HUNTER_CLASS_ID, rulesetVersion: HUNTER_RULESET_VERSION,
  authoredOnly: true, manualOnly: true, executionEnabled: false,
  applicationMode: 'manual-tabletop', automatedCapabilities: [],
  manualNotice: HUNTER_MANUAL_NOTICE
};
const id = suffix => `cr1_hunter_${suffix}`;
const instant = { durationType: 'instant', durationValue: 0, durationUnit: 'instant' };
const nextStart = { durationType: 'own_turns', durationValue: 1, durationUnit: 'next_caster_turn_start' };
const selfTarget = { targetingType: 'self', rangeType: 'self', rangeDistance: 0, targetRestrictions: ['self'], maxTargets: 1 };
const target = (roles, maxTargets = 1, rangeDistance = 30) => ({
  targetingType: maxTargets > 1 ? 'multi' : 'single', rangeType: 'ranged',
  rangeDistance, targetRestrictions: roles, maxTargets
});
const enemy = (n = 1, feet = 30) => target(['enemy'], n, feet);
const ally = (n = 1, feet = 30) => target(['ally', 'self'], n, feet);
const area = (feet = 15) => ({
  targetingType: 'area', rangeType: 'ranged', rangeDistance: 30,
  targetRestrictions: ['area'], maxTargets: 1, areaRadius: feet
});
const apCost = actionPoints => ({
  actionPoints, mana: 0, resourceTypes: ['actionPoints'],
  resourceValues: { actionPoints, mana: 0 }, useFormulas: {}, components: ['somatic'],
  somaticText: 'Name the exact quarry, the evidence source and the tag before resolution.'
});
const damage = (formula, damageTypes = ['stabbing']) => ({ formula, damageTypes, resolution: 'DICE' });
const cooldownNone = { cooldownType: 'turn_based', cooldownValue: 0 };
const cooldownLongRest = { cooldownType: 'long_rest', cooldownValue: 1 };
const effect = (kind, args, description) => ({ kind, args, description, executable: false });

const record = (level, suffix, name, ap, targetingConfig, effectTypes, program, description, effects = [], options = {}) => ({
  ...flags, id: id(suffix), name, level, specialization: options.specialization || null,
  treeId: options.treeId || null, source: options.source || 'optional', spellType: 'ACTION',
  icon: HUNTER_ICON, resourceCost: apCost(ap), targetingConfig, effectTypes,
  damageConfig: options.damageConfig || null,
  durationConfig: options.durationConfig || instant,
  cooldownConfig: options.cooldownConfig || cooldownNone,
  reactionTiming: null, savingThrow: null, conditions: options.conditions || [], area: options.area || null,
  description,
  classResourceProgram: program ? { version: 1, domain: 'hunter-evidence', ...program } : null,
  manualMechanics: {
    price: {
      actionPoints: ap, mana: 0,
      evidence: program?.args?.consumes || [],
      companionAction: program?.args?.companionAction === true
    },
    effects: effects.length ? effects : [effect(program?.op || 'quarry.none', program?.args || {}, description)],
    executable: false
  },
  sourceRefs: ['RI-4 Hunter content lock']
});

export const HUNTER_COMMON_MECHANICS = {
  price: 'AP and mana are explicit. Evidence tags are distinct and are spent exactly as listed; one tag can never pay twice.',
  quarry: 'One exact quarry reference, not an arbitrary name or hidden-identity lookup. Changing quarry deliberately clears all evidence.',
  evidence: 'Read, Angle and Pressure are distinct tags with recorded source events. At most one new tag per own turn across all sources; duplicates do nothing.',
  generation: 'Mark grants Read, Take an Angle grants Angle after a legal 10 ft reposition, and an accepted non-miss Press grants Pressure. A miss pays AP but grants nothing.',
  expiry: 'Evidence expires at the end of the second own turn without renewed contact, or immediately when the quarry dies, is retired or is changed.',
  companion: 'A Beastmaster companion is a real positively bonded and trained creature. It has one action per caster turn and shares the one-tag cap; no free extra creature turn.',
  path: 'Returning Path commits one named glaive to one segment of at most 20 ft. Only the bound quarry first voluntary crossing triggers the strike; expiry or dismissal returns the weapon without evidence.',
  native: 'Hunter has no registered native heritage edge. The field and Quiet methods are recommendations only; acquisition must be recorded.'
};

export const HUNTER_CORE_RECORDS = [
  record(1, 'mark_quarry', 'Mark Quarry', 1, enemy(1, 60), ['utility'], {
    op: 'quarry.mark', args: {
      quarryMax: 1, grantTag: 'read', evidenceMax: 3, oneTagPerOwnTurn: true,
      clearsOldEvidence: true, automatic: false
    }
  }, 'Designate or study one exact visible quarry within 60 ft. Changing quarry clears all old evidence. If your own-turn generation budget is unused, obtain Read and record its source event.', [
    effect('quarry.mark', { grantTag: 'read', quarryMax: 1, clearsOldEvidence: true }, 'Designate one quarry and record Read when the generation budget is available.')
  ], { source: 'core' }),
  record(1, 'take_angle', 'Take an Angle', 1, selfTarget, ['utility'], {
    op: 'quarry.angle', args: {
      moveFeet: 10, requiresRemainingMovement: true, grantTag: 'angle',
      evidenceMax: 3, oneTagPerOwnTurn: true, ordinaryMovementOnly: true, automatic: false
    }
  }, 'Move 10 ft along a legal pursuit path to improve your position. If your own-turn generation budget is unused, obtain Angle. Ordinary movement alone never manufactures the tag.', [
    effect('quarry.angle', { moveFeet: 10, grantTag: 'angle' }, 'Reposition 10 ft and record Angle when the budget is available.')
  ], { source: 'core' }),
  record(1, 'press_quarry', 'Press the Quarry', 2, enemy(), ['damage'], {
    op: 'quarry.press', args: {
      rangeFeet: 30, damage: '1d8+2', grantTag: 'pressure', on: 'accepted-non-miss-hit',
      evidenceMax: 3, oneTagPerOwnTurn: true, automatic: false
    }
  }, 'Make one hunting strike against the exact quarry for 1d8+2 stabbing. Only an accepted non-miss hit can grant Pressure, and only if the own-turn generation budget is unused.', [
    effect('quarry.press', { damage: '1d8+2', grantTag: 'pressure' }, 'Strike the quarry and record Pressure on an accepted non-miss hit.')
  ], { source: 'core', damageConfig: damage('1d8+2') })
];

const optional = [
  record(1, 'hunters_snare', "Hunter's Snare", 1, enemy(1, 15), ['control'], {
    op: 'quarry.snare', args: { rangeFeet: 15, condition: 'restrained', duration: 'end-target-next-turn', escape: 'ordinary check', damage: null }
  }, 'One enemy within 15 ft is restrained until the end of its next turn unless it escapes by an ordinary check. No damage and no hidden second target.', [
    effect('quarry.snare', { condition: 'restrained', duration: 'end-target-next-turn' }, 'Restrain one enemy until its next turn ends.')
  ], { conditions: ['restrained'], durationConfig: nextStart }),
  record(1, 'steady_aim', 'Steady Aim', 1, selfTarget, ['buff'], {
    op: 'quarry.aim', args: { attackBonus: 2, duration: 'start-next-caster-turn', requiresStationary: true }
  }, 'Remain stationary and add 2 to one ranged attack before your next turn. Declare the bonus before rolling; movement loses it.', [
    effect('quarry.aim', { attackBonus: 2, requiresStationary: true }, 'Add 2 to one ranged attack.')
  ], { durationConfig: nextStart }),
  record(1, 'trailcraft', 'Trailcraft', 1, selfTarget, ['utility'], {
    op: 'quarry.track', args: { rangeFeet: 60, reveals: ['direction', 'age', 'kind'], hiddenIdentity: false }
  }, 'Read the direction, age and broad kind of one physical trail within 60 ft. It does not name hidden creatures or reveal private intentions.', [
    effect('quarry.track', { rangeFeet: 60, reveals: ['direction', 'age', 'kind'] }, 'Read one physical trail.')
  ]),
  record(1, 'quick_draw', 'Quick Draw', 1, enemy(), ['damage'], {
    op: 'quarry.strike', args: { rangeFeet: 30, damage: '1d6', requiresWeaponDrawn: false }
  }, 'Draw and fire one light weapon at an enemy within 30 ft for 1d6 stabbing. One damage event; no free second shot.', [
    effect('quarry.strike', { damage: '1d6' }, 'Deal 1d6 stabbing with a quick draw.')
  ], { damageConfig: damage('1d6') }),

  record(2, 'crippling_shot', 'Crippling Shot', 2, enemy(), ['damage', 'control'], {
    op: 'quarry.strike', args: { rangeFeet: 30, damage: '1d6', speedPenaltyFeet: 10, duration: 'end-target-next-turn' }
  }, 'One enemy within 30 ft takes 1d6 stabbing and loses 10 ft of movement until the end of its next turn. One damage event and one movement penalty.', [
    effect('quarry.strike', { damage: '1d6', speedPenaltyFeet: 10 }, 'Deal 1d6 and reduce movement by 10 ft.')
  ], { damageConfig: damage('1d6'), durationConfig: nextStart }),
  record(2, 'read_the_spoor', 'Read the Spoor', 1, selfTarget, ['utility'], {
    op: 'quarry.track', args: { rangeFeet: 60, reveals: ['route', 'count', 'condition'], hiddenIdentity: false }
  }, 'Read one trail within 60 ft for route, number of travelers and their condition. It does not identify them or reveal hidden intent.', [
    effect('quarry.track', { reveals: ['route', 'count', 'condition'] }, 'Read a trail in detail.')
  ]),
  record(2, 'evasive_step', 'Evasive Step', 1, selfTarget, ['utility'], {
    op: 'quarry.move', args: { moveFeet: 10, against: 'one-visible-attacker', ordinaryMovement: true }
  }, 'Move 10 ft using ordinary movement in response to one visible attacker. Opportunity and difficult-terrain rules apply; no teleport.', [
    effect('quarry.move', { moveFeet: 10 }, 'Move 10 ft away from one visible attacker.')
  ]),
  record(2, 'companion_whistle', 'Companion Whistle', 1, ally(1, 60), ['utility'], {
    op: 'quarry.companion', args: { command: 'reposition', moveFeet: 10, companionAction: true, requiresBondedCompanion: true }
  }, 'Your real bonded companion moves up to 10 ft using its action for this turn. This is a paid command; no free pet action or fabricated companion.', [
    effect('quarry.companion', { moveFeet: 10 }, 'Command a bonded companion to move 10 ft.')
  ]),

  record(3, 'piercing_volley', 'Piercing Volley', 2, enemy(2, 30), ['damage'], {
    op: 'quarry.strike', args: { rangeFeet: 30, maxTargets: 2, damage: '1d6', oneEventPerTarget: true }
  }, 'Two enemies within 30 ft each take 1d6 stabbing. One damage event per target; no splash or repeat.', [
    effect('quarry.strike', { maxTargets: 2, damage: '1d6' }, 'Deal 1d6 to each of two enemies.')
  ], { damageConfig: damage('1d6') }),
  record(3, 'camouflage', 'Camouflage', 1, selfTarget, ['utility'], {
    op: 'quarry.hide', args: { bonus: 3, duration: 'start-next-caster-turn', invisibility: false }
  }, 'Add 3 to one Stealth check before your next turn by using prepared cover and pigment. This is not invisibility and leaves physical evidence.', [
    effect('quarry.hide', { bonus: 3 }, 'Add 3 to one Stealth check.')
  ], { durationConfig: nextStart }),
  record(3, 'long_stride', 'Long Stride', 1, selfTarget, ['utility'], {
    op: 'quarry.move', args: { moveFeet: 15, ordinaryMovement: true, difficultTerrain: false }
  }, 'Move 15 ft using ordinary movement. Difficult terrain and opportunity rules still apply.', [
    effect('quarry.move', { moveFeet: 15 }, 'Move 15 ft.')
  ]),
  record(3, 'beast_bond', 'Beast Bond', 1, ally(1, 30), ['buff'], {
    op: 'quarry.companion', args: { command: 'guard', bonus: 2, duration: 'start-next-caster-turn', companionAction: true, requiresBondedCompanion: true }
  }, 'Your bonded companion guards an ally within 30 ft, adding 2 to one save before your next turn. It uses its action for this turn.', [
    effect('quarry.companion', { bonus: 2 }, 'Companion adds 2 to one ally save.')
  ], { durationConfig: nextStart }),

  record(4, 'hamstring_shot', 'Hamstring Shot', 2, enemy(), ['damage', 'control'], {
    op: 'quarry.strike', args: { rangeFeet: 30, damage: '1d8', knockProne: true, savePenalty: -1 }
  }, 'One enemy within 30 ft takes 1d8 stabbing, is knocked prone and has -1 to one save before your next turn. One event; no extra attack.', [
    effect('quarry.strike', { damage: '1d8', knockProne: true, savePenalty: -1 }, 'Deal 1d8, knock prone and penalize one save.')
  ], { damageConfig: damage('1d8'), conditions: ['prone'], durationConfig: nextStart }),
  record(4, 'trackless_step', 'Trackless Step', 1, selfTarget, ['utility'], {
    op: 'quarry.hide', args: { removeTrail: true, duration: 'one-travel-segment', ordinaryStealth: true }
  }, 'Leave no ordinary physical trail for one travel segment. Magical tracking, direct observation and existing evidence are unaffected.', [
    effect('quarry.hide', { removeTrail: true }, 'Suppress one ordinary physical trail.')
  ]),
  record(4, 'snare_line', 'Snare Line', 2, area(10), ['control'], {
    op: 'quarry.field', args: { radiusFeet: 10, difficultTerrain: true, duration: 'start-next-caster-turn', visible: true }
  }, 'A visible 10-ft snare line becomes difficult terrain until your next turn. No damage and no hidden effect.', [
    effect('quarry.field', { radiusFeet: 10, difficultTerrain: true }, 'Create visible difficult terrain.')
  ], { durationConfig: nextStart, area: { shape: 'sphere', radius: 10, visible: true } }),
  record(4, 'focused_draw', 'Focused Draw', 2, enemy(), ['damage'], {
    op: 'quarry.strike', args: { rangeFeet: 30, damage: '2d6', requiresAim: true }
  }, 'One enemy within 30 ft takes 2d6 stabbing after a full round of aim. Without the aim, the action resolves with no effect and no tag.', [
    effect('quarry.strike', { damage: '2d6', requiresAim: true }, 'Deal 2d6 after aiming.')
  ], { damageConfig: damage('2d6') }),

  record(5, 'twin_shot', 'Twin Shot', 2, enemy(2, 30), ['damage'], {
    op: 'quarry.strike', args: { rangeFeet: 30, maxTargets: 2, damage: '1d8', oneEventPerTarget: true }
  }, 'Two enemies within 30 ft each take 1d8 stabbing. One event per target; no third shot.', [
    effect('quarry.strike', { maxTargets: 2, damage: '1d8' }, 'Deal 1d8 to each of two enemies.')
  ], { damageConfig: damage('1d8') }),
  record(5, 'hunters_mark', "Hunter's Mark", 1, enemy(), ['buff'], {
    op: 'quarry.mark', args: { grantTag: 'read', evidenceMax: 3, oneTagPerOwnTurn: true, bonusDamage: 1, duration: 'start-next-caster-turn' }
  }, 'Designate or study the quarry and add 1 to one damage event against it before your next turn. The mark grants no tag beyond the normal budget.', [
    effect('quarry.mark', { bonusDamage: 1 }, 'Add 1 to one damage event against the quarry.')
  ], { durationConfig: nextStart }),
  record(5, 'field_dressing', 'Field Dressing', 2, ally(), ['heal'], {
    op: 'quarry.heal', args: { rangeFeet: 30, healing: '2d6', target: 'willing-living', removesConditions: false }
  }, 'One willing living creature within 30 ft regains 2d6 HP. No resurrection, condition removal or extra target.', [
    effect('quarry.heal', { healing: '2d6' }, 'Restore 2d6 HP to one willing creature.')
  ]),
  record(5, 'silent_prowl', 'Silent Prowl', 1, selfTarget, ['utility'], {
    op: 'quarry.hide', args: { bonus: 2, moveFeet: 10, ordinaryMovement: true, invisibility: false }
  }, 'Move 10 ft and add 2 to one Stealth check before your next turn. Ordinary movement limits apply; no invisibility.', [
    effect('quarry.hide', { bonus: 2, moveFeet: 10 }, 'Move 10 ft and add 2 to one Stealth check.')
  ], { durationConfig: nextStart }),

  record(6, 'barbed_arrow', 'Barbed Arrow', 2, enemy(), ['damage'], {
    op: 'quarry.strike', args: { rangeFeet: 30, damage: '2d6', bleed: '1d4', duration: 'end-target-next-turn' }
  }, 'One enemy within 30 ft takes 2d6 stabbing and 1d4 bleed at the end of its next turn. One initial event and one recorded bleed event.', [
    effect('quarry.strike', { damage: '2d6', bleed: '1d4' }, 'Deal 2d6 and record 1d4 bleed.')
  ], { damageConfig: damage('2d6'), durationConfig: nextStart }),
  record(6, 'herding_call', 'Herding Call', 2, enemy(2, 30), ['control'], {
    op: 'quarry.push', args: { rangeFeet: 30, maxTargets: 2, pushFeet: 10, oncePerTarget: true }
  }, 'Up to two enemies within 30 ft are pushed 10 ft away. No damage and no hidden extra movement.', [
    effect('quarry.push', { maxTargets: 2, pushFeet: 10 }, 'Push up to two enemies 10 ft.')
  ]),
  record(6, 'forage', 'Forage', 1, selfTarget, ['utility'], {
    op: 'quarry.supply', args: { environment: 'living-wilds', finds: ['food', 'water', 'simple-material'], automatic: false }
  }, 'Spend a travel segment foraging in a living environment. The table records what is actually available; no inventory is manufactured.', [
    effect('quarry.supply', { finds: ['food', 'water', 'simple-material'] }, 'Forage one travel segment.')
  ]),
  record(6, 'coordinated_strike', 'Coordinated Strike', 2, enemy(), ['damage'], {
    op: 'quarry.companion', args: { command: 'strike', damage: '1d6', rangeFeet: 5, companionAction: true, requiresBondedCompanion: true, quarry: true }
  }, 'Your bonded companion strikes the quarry for 1d6 primal from an adjacent position. It uses its action and shares the own-turn tag cap.', [
    effect('quarry.companion', { damage: '1d6' }, 'Companion strikes the quarry for 1d6.')
  ], { damageConfig: damage('1d6', ['primal']) }),

  record(7, 'skewering_shot', 'Skewering Shot', 3, enemy(), ['damage'], {
    op: 'quarry.strike', args: { rangeFeet: 30, damage: '3d6', savePenalty: -2 }
  }, 'One enemy within 30 ft takes 3d6 stabbing and has -2 to one save before your next turn. No automatic critical.', [
    effect('quarry.strike', { damage: '3d6', savePenalty: -2 }, 'Deal 3d6 and penalize one save.')
  ], { damageConfig: damage('3d6'), durationConfig: nextStart }),
  record(7, 'trailblaze', 'Trailblaze', 1, selfTarget, ['utility'], {
    op: 'quarry.field', args: { radiusFeet: 15, difficultTerrain: false, allyMovementBonusFeet: 5, duration: 'one-travel-segment' }
  }, 'Prepare a clear route: allies gain 5 ft of movement on the chosen segment. The route is physical and can be blocked or lost.', [
    effect('quarry.field', { allyMovementBonusFeet: 5 }, 'Prepare a route with +5 ft ally movement.')
  ]),
  record(7, 'beast_guard', 'Beast Guard', 1, ally(1, 30), ['buff'], {
    op: 'quarry.companion', args: { command: 'guard', prevent: 4, duration: 'start-next-caster-turn', companionAction: true, requiresBondedCompanion: true }
  }, 'Your companion prevents 4 damage to one ally within 30 ft before your next turn. It uses its action; no shared pool.', [
    effect('quarry.companion', { prevent: 4 }, 'Companion prevents 4 damage to one ally.')
  ], { durationConfig: nextStart }),
  record(7, 'vantage_point', 'Vantage Point', 1, selfTarget, ['buff'], {
    op: 'quarry.aim', args: { attackBonus: 3, rangeBonusFeet: 15, duration: 'start-next-caster-turn', requiresHighGround: true }
  }, 'From high ground, add 3 to one ranged attack and 15 ft to its range before your next turn. Losing the position ends the benefit.', [
    effect('quarry.aim', { attackBonus: 3, rangeBonusFeet: 15, requiresHighGround: true }, 'Add 3 and 15 ft range from high ground.')
  ], { durationConfig: nextStart }),

  record(8, 'pinning_shot', 'Pinning Shot', 2, enemy(), ['control'], {
    op: 'quarry.strike', args: { rangeFeet: 30, damage: '1d6', condition: 'restrained', duration: 'end-target-next-turn', escape: 'ordinary check' }
  }, 'One enemy within 30 ft takes 1d6 stabbing and is restrained until the end of its next turn unless it escapes. No hidden second target.', [
    effect('quarry.strike', { damage: '1d6', condition: 'restrained' }, 'Deal 1d6 and restrain until next turn end.')
  ], { damageConfig: damage('1d6'), conditions: ['restrained'], durationConfig: nextStart }),
  record(8, 'ghost_step', 'Ghost Step', 1, selfTarget, ['utility'], {
    op: 'quarry.hide', args: { moveFeet: 15, leavesTrace: false, invisibility: false, ordinaryMovement: true }
  }, 'Move 15 ft through cover without leaving an ordinary trail. Direct observation, magical tracking and existing evidence are unaffected.', [
    effect('quarry.hide', { moveFeet: 15, leavesTrace: false }, 'Move 15 ft without a physical trail.')
  ]),
  record(8, 'beast_frenzy', 'Beast Frenzy', 3, enemy(), ['damage'], {
    op: 'quarry.companion', args: { command: 'strike', damage: '2d6', rangeFeet: 5, companionAction: true, requiresBondedCompanion: true, quarry: true }
  }, 'Your companion strikes the quarry for 2d6 primal. It uses its action and shares the own-turn tag cap; no extra turn is created.', [
    effect('quarry.companion', { damage: '2d6' }, 'Companion strikes for 2d6.')
  ], { damageConfig: damage('2d6', ['primal']) }),
  record(8, 'wilderness_ward', 'Wilderness Ward', 2, ally(2, 30), ['buff'], {
    op: 'quarry.ward', args: { rangeFeet: 30, maxTargets: 2, prevent: 3, against: 'one-named-damage-type', duration: 'start-next-caster-turn' }
  }, 'Up to two allies within 30 ft each prevent 3 from one named damage type before your next turn. Separate records; no shared pool.', [
    effect('quarry.ward', { maxTargets: 2, prevent: 3 }, 'Prevent 3 from one named damage type for two allies.')
  ], { durationConfig: nextStart }),

  record(9, 'heartseeker', 'Heartseeker', 3, enemy(), ['damage'], {
    op: 'quarry.strike', args: { rangeFeet: 30, damage: '4d6', requiresQuarry: true, oncePerTarget: true }
  }, 'One quarry within 30 ft takes 4d6 stabbing once. The same creature cannot be targeted twice in one encounter by this record.', [
    effect('quarry.strike', { damage: '4d6', oncePerTarget: true }, 'Deal 4d6 once to the quarry.')
  ], { damageConfig: damage('4d6') }),
  record(9, 'perfect_camouflage', 'Perfect Camouflage', 2, selfTarget, ['utility'], {
    op: 'quarry.hide', args: { bonus: 5, duration: 'minutes', durationMinutes: 10, invisibility: false, breakOnAttack: true }
  }, 'Add 5 to Stealth for ten minutes in prepared cover. Attacking or moving in the open ends it; this is not invisibility.', [
    effect('quarry.hide', { bonus: 5, durationMinutes: 10 }, 'Add 5 to Stealth for ten minutes.')
  ], { durationConfig: { durationType: 'minutes', durationValue: 10, durationUnit: 'minutes' } }),
  record(9, 'relentless_pursuit', 'Relentless Pursuit', 2, selfTarget, ['utility'], {
    op: 'quarry.move', args: { moveFeet: 20, requiresQuarry: true, ordinaryMovement: true, difficultTerrain: false }
  }, 'Move 20 ft toward your quarry using ordinary movement. Difficult terrain and opportunity rules apply.', [
    effect('quarry.move', { moveFeet: 20 }, 'Move 20 ft toward the quarry.')
  ]),
  record(9, 'pack_tactics', 'Pack Tactics', 1, ally(2, 30), ['buff'], {
    op: 'quarry.mark', args: { maxTargets: 2, allyAttackBonus: 2, duration: 'start-next-caster-turn', requiresQuarry: true }
  }, 'Up to two allies add 2 to one attack against your quarry before your next turn. The benefit is recorded per ally and never stacks with itself.', [
    effect('quarry.mark', { maxTargets: 2, allyAttackBonus: 2 }, 'Two allies add 2 to one attack against the quarry.')
  ], { durationConfig: nextStart }),

  record(10, 'final_quarry', 'Final Quarry', 3, enemy(), ['damage'], {
    op: 'quarry.strike', args: { rangeFeet: 30, damage: '6d6', requiresQuarry: true, oncePerLongRest: true }
  }, 'One quarry within 30 ft takes 6d6 stabbing once per completed long rest. If it survives, the quarry remains and the use is spent.', [
    effect('quarry.strike', { damage: '6d6', oncePerLongRest: true }, 'Deal 6d6 once per long rest.')
  ], { damageConfig: damage('6d6'), cooldownConfig: cooldownLongRest }),
  record(10, 'master_tracker', 'Master Tracker', 2, selfTarget, ['utility'], {
    op: 'quarry.track', args: { rangeFeet: 120, reveals: ['route', 'age', 'count', 'condition'], hiddenIdentity: false, oncePerLongRest: true }
  }, 'Read one physical trail within 120 ft for route, age, count and condition. It still does not name hidden creatures or reveal private intent. Once per completed long rest.', [
    effect('quarry.track', { rangeFeet: 120, reveals: ['route', 'age', 'count', 'condition'] }, 'Read one distant trail in detail.')
  ], { cooldownConfig: cooldownLongRest }),
  record(10, 'unerring_path', 'Unerring Path', 2, selfTarget, ['buff'], {
    op: 'quarry.aim', args: { attackBonus: 3, ignoreCover: 'half', duration: 'start-next-caster-turn', requiresQuarry: true }
  }, 'Add 3 to one ranged attack against the quarry and ignore half cover before your next turn. Total cover still blocks.', [
    effect('quarry.aim', { attackBonus: 3, ignoreCover: 'half' }, 'Add 3 and ignore half cover against the quarry.')
  ], { durationConfig: nextStart }),
  record(10, 'alphas_call', "Alpha's Call", 2, ally(1, 30), ['buff'], {
    op: 'quarry.companion', args: { command: 'guard', prevent: 6, allyAttackBonus: 2, duration: 'start-next-caster-turn', companionAction: true, requiresBondedCompanion: true }
  }, 'Your companion prevents 6 damage to one ally and that ally adds 2 to one attack before your next turn. It uses its action; no second command.', [
    effect('quarry.companion', { prevent: 6, allyAttackBonus: 2 }, 'Companion prevents 6 and grants +2 to one attack.')
  ], { durationConfig: nextStart })
];

const signature = (suffix, name, treeId, ap, targetingConfig, program, description, effects, options = {}) => record(
  3, suffix, name, ap, targetingConfig, options.effectTypes || ['utility'], program, description, effects, {
    source: 'talent-signature', specialization: treeId, treeId,
    durationConfig: options.durationConfig || instant,
    conditions: options.conditions || []
  }
);

const capstone = (suffix, name, treeId, ap, targetingConfig, program, description, effects, options = {}) => record(
  10, suffix, name, ap, targetingConfig, options.effectTypes || ['utility'], program, description, effects, {
    source: 'talent-capstone', specialization: treeId, treeId,
    cooldownConfig: cooldownLongRest, durationConfig: options.durationConfig || instant
  }
);

export const HUNTER_TALENT_ACTIVES = [
  signature('patient_ambush', 'Patient Ambush', 'stalker', 2, enemy(), {
    op: 'quarry.ambush', args: {
      consumes: ['read', 'angle'], damage: '2d8', grantsTags: false,
      requiresCompanion: false, automatic: false
    }
  }, 'Consume Read and Angle for one prepared precision strike against the quarry for 2d8 slicing. No companion is required and the strike grants no new evidence.', [
    effect('quarry.ambush', { consumes: ['read', 'angle'], damage: '2d8' }, 'Spend Read and Angle for 2d8 slicing.')
  ], { effectTypes: ['damage'], damageConfig: damage('2d8', ['slicing']) }),
  signature('cross_the_scent', 'Cross the Scent', 'beastmaster', 2, enemy(), {
    op: 'quarry.cross-scent', args: {
      consumes: ['read', 'pressure'], damage: '1d8', rangeFeet: 30, companionAction: true,
      requiresBondedCompanion: true, oneCompanionAction: true, automatic: false
    }
  }, 'Consume Read and Pressure and spend your bonded companion action to send it along a short flanking route and strike the quarry for 1d8 primal. No free extra pet turn.', [
    effect('quarry.cross-scent', { consumes: ['read', 'pressure'], damage: '1d8' }, 'Companion flanks and strikes for 1d8.')
  ], { effectTypes: ['damage'], damageConfig: damage('1d8', ['primal']) }),
  signature('returning_path', 'Returning Path', 'trailblade', 2, enemy(), {
    op: 'quarry.return-path', args: {
      consumes: ['angle', 'pressure'], pathFeet: 20, damage: '1d8', expiryOwnTurns: 2,
      onlyQuarryCrossing: true, dismissalAP: 1, returnsWeapon: true, automatic: false
    }
  }, 'Consume Angle and Pressure to commit a named glaive to one visible segment of at most 20 ft. Only the quarry first voluntary crossing triggers one 1d8 slicing strike; expiry or dismissal returns the weapon without evidence.', [
    effect('quarry.return-path', { pathFeet: 20, damage: '1d8', expiryOwnTurns: 2 }, 'Commit a glaive line and strike on the quarry crossing.')
  ], { effectTypes: ['damage'], damageConfig: damage('1d8', ['slicing']), durationConfig: { durationType: 'own_turns', durationValue: 2, durationUnit: 'subsequent_caster_turn_end' } }),
  capstone('death_from_the_blind', 'Death from the Blind', 'stalker', 3, enemy(), {
    op: 'quarry.ambush', args: {
      consumes: ['read', 'angle'], damage: '3d8', grantsTags: false, oncePerLongRest: true, automaticKill: false
    }
  }, 'Consume Read and Angle for one perfected ambush strike for 3d8 slicing. It grants no tags and is never an automatic kill. Once per completed long rest.', [
    effect('quarry.ambush', { consumes: ['read', 'angle'], damage: '3d8', oncePerLongRest: true }, 'Spend Read and Angle for 3d8 slicing.')
  ], { effectTypes: ['damage'], damageConfig: damage('3d8', ['slicing']) }),
  capstone('the_perfect_pack', 'The Perfect Pack', 'beastmaster', 3, enemy(), {
    op: 'quarry.pack', args: {
      consumes: ['read', 'pressure'], hunterDamage: '1d8', companionDamage: '1d8',
      companionAction: true, requiresBondedCompanion: true, oncePerLongRest: true
    }
  }, 'Consume Read and Pressure: you and your bonded companion each strike the quarry once for 1d8. The companion spends its action; no third strike or extra turn. Once per completed long rest.', [
    effect('quarry.pack', { hunterDamage: '1d8', companionDamage: '1d8' }, 'You and your companion each strike once.')
  ], { effectTypes: ['damage'], damageConfig: damage('1d8') }),
  capstone('the_long_way_home', 'The Long Way Home', 'trailblade', 3, enemy(), {
    op: 'quarry.return-path', args: {
      consumes: ['angle', 'pressure'], pathFeet: 30, damage: '2d8', expiryOwnTurns: 2,
      onlyQuarryCrossing: true, dismissalAP: 1, returnsWeapon: true, oncePerLongRest: true
    }
  }, 'Consume Angle and Pressure to commit a named glaive to one visible segment of at most 30 ft. The quarry first voluntary crossing triggers 2d8 slicing. Once per completed long rest.', [
    effect('quarry.return-path', { pathFeet: 30, damage: '2d8' }, 'Commit a longer glaive line for 2d8.')
  ], { effectTypes: ['damage'], damageConfig: damage('2d8', ['slicing']), durationConfig: { durationType: 'own_turns', durationValue: 2, durationUnit: 'subsequent_caster_turn_end' } })
];

export const HUNTER_OPTIONAL_RECORDS = optional;
export const HUNTER_AUTHORED_RECORDS = [
  ...HUNTER_CORE_RECORDS, ...HUNTER_OPTIONAL_RECORDS,
  ...HUNTER_TALENT_ACTIVES, ...HUNTER_PASSIVE_RECORDS
];

const nodeForRecord = recordEntry => HUNTER_TALENT_NODES.find(node =>
  node.grantId === recordEntry.id || node.passiveSpellId === recordEntry.id
);

export function describeHunterPrice(recordEntry) {
  const args = recordEntry.classResourceProgram?.args || {};
  const evidence = args.consumes?.length ? `; consume ${args.consumes.join(' + ')}` : '';
  const companion = args.companionAction ? '; spend the companion action' : '';
  return `${recordEntry.resourceCost.actionPoints} AP; 0 mana${evidence}${companion}; manual resolution.`;
}

export const HUNTER_PROJECTED_SPELLS = HUNTER_AUTHORED_RECORDS.map(recordEntry => {
  const node = nodeForRecord(recordEntry);
  return {
    ...flags, id: recordEntry.id, name: recordEntry.name, class: 'Hunter', level: recordEntry.level,
    source: `hunter-${recordEntry.source}`, sourceRecordSource: recordEntry.source,
    spellType: recordEntry.spellType, icon: HUNTER_ICON, description: recordEntry.description,
    specialization: node?.treeId || recordEntry.treeId || 'core', treeId: node?.treeId || recordEntry.treeId || null,
    typeConfig: {
      school: 'primal', castTimeType: recordEntry.spellType === 'PASSIVE' ? 'PASSIVE' : 'IMMEDIATE',
      tags: ['hunter', 'manual-only', recordEntry.source]
    },
    resourceCost: apCost(recordEntry.resourceCost.actionPoints),
    targetingConfig: recordEntry.targetingConfig, effectTypes: recordEntry.effectTypes,
    resolution: recordEntry.damageConfig ? 'DICE' : 'MANUAL', damageConfig: recordEntry.damageConfig,
    durationConfig: recordEntry.durationConfig, cooldownConfig: recordEntry.cooldownConfig,
    reactionTiming: null, savingThrow: null, conditions: recordEntry.conditions, area: recordEntry.area,
    manualRequirements: [HUNTER_MANUAL_NOTICE, describeHunterPrice(recordEntry), ...Object.values(HUNTER_COMMON_MECHANICS)],
    tags: ['hunter', 'manual-only', recordEntry.source], categoryIds: [],
    specialMechanics: {
      hunter: {
        ...flags, sourceRecordId: recordEntry.id, priceSummary: describeHunterPrice(recordEntry),
        authoredSpell: recordEntry, commonRules: HUNTER_COMMON_MECHANICS,
        rankValues: recordEntry.rankValues || null, requires: recordEntry.requires || null
      }
    }
  };
});

export const HUNTER_PROJECTED_SPELLS_BY_ID = Object.fromEntries(
  HUNTER_PROJECTED_SPELLS.map(spell => [spell.id, spell])
);

export const HUNTER_SPELL_POOLS = Object.fromEntries(
  Array.from({ length: 10 }, (_, index) => {
    const level = index + 1;
    return [level, HUNTER_OPTIONAL_RECORDS.filter(spell => spell.level === level).map(spell => spell.id)];
  })
);

export const HUNTER_PROGRESSION_POLICY = {
  classId: HUNTER_CLASS_ID, rulesetVersion: HUNTER_RULESET_VERSION,
  levelCap: 10, startingSpellPicks: 1, optionalPicksPerLevel: 1,
  allowEarlierUnchosen: true, grantedCoreSpellIds: HUNTER_CORE_RECORDS.map(spell => spell.id),
  randomizeStartingSpells: false, autoTopUpOnLoad: false, talentActivesAreGrants: true,
  manualOnly: true
};

const hunterNodeById = Object.fromEntries(HUNTER_TALENT_NODES.map(node => [node.id, node]));
const hunterTreePoints = (ranks, treeId) => HUNTER_TALENT_NODES
  .filter(node => node.treeId === treeId)
  .reduce((total, node) => total + (ranks[node.id] || 0), 0);

export const pruneHunterTalents = (talents, characterLevel) => {
  const ranks = talents && typeof talents === 'object' ? { ...talents } : {};
  const level = Number.isInteger(characterLevel) ? Math.max(1, characterLevel) : 10;
  Object.keys(ranks).forEach(nodeId => {
    const node = hunterNodeById[nodeId];
    if (!node || !Number.isInteger(ranks[nodeId]) || ranks[nodeId] < 1 || ranks[nodeId] > node.maxRanks) {
      delete ranks[nodeId];
    }
  });
  const pruneStructure = () => {
    let changed = true;
    while (changed) {
      changed = false;
      for (const node of HUNTER_TALENT_NODES) {
        const rank = ranks[node.id];
        if (!rank) continue;
        const gatePoints = hunterTreePoints(ranks, node.treeId) - rank;
        const predecessorMissing = node.requires.some(predecessorId => {
          const predecessor = hunterNodeById[predecessorId];
          return !predecessor || (ranks[predecessorId] || 0) !== predecessor.maxRanks;
        });
        if (node.minLevel > level || gatePoints < node.requiresPoints || predecessorMissing) {
          delete ranks[node.id];
          changed = true;
        }
      }
    }
  };
  pruneStructure();
  const budget = Math.min(50, level * 5);
  let guard = 0;
  while (Object.values(ranks).reduce((total, rank) => total + rank, 0) > budget && guard < 200) {
    guard += 1;
    let target = null;
    HUNTER_TALENT_NODES.forEach(node => {
      if (!ranks[node.id]) return;
      if (target === null || node.minLevel >= hunterNodeById[target].minLevel) target = node.id;
    });
    if (target === null) break;
    ranks[target] -= 1;
    if (ranks[target] === 0) delete ranks[target];
    pruneStructure();
  }
  return ranks;
};

const HUNTER_TAGS = ['read', 'angle', 'pressure'];
const isText = value => typeof value === 'string' && value.trim().length > 0;
const integerBetween = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;

export function validateHunterState(state) {
  const errors = [];
  if (!state || typeof state !== 'object') return { valid: false, errors: ['state must be an object'] };
  if (state.quarry !== null && state.quarry !== undefined) {
    if (typeof state.quarry !== 'object') errors.push('quarry must be null or an object');
    else {
      if (!isText(state.quarry.id)) errors.push('quarry requires an exact id');
      if (!isText(state.quarry.label)) errors.push('quarry requires a label');
    }
  }
  const evidence = Array.isArray(state.evidence) ? state.evidence : [];
  if (!Array.isArray(state.evidence)) errors.push('evidence must be an array');
  if (evidence.length > 3) errors.push('at most three evidence tags');
  if (evidence.length > 0 && (!state.quarry || typeof state.quarry !== 'object')) errors.push('evidence requires an exact quarry');
  const tags = new Set();
  evidence.forEach((tag, index) => {
    if (!tag || typeof tag !== 'object') { errors.push(`evidence ${index} must be an object`); return; }
    if (!HUNTER_TAGS.includes(tag.tag)) errors.push(`evidence ${index} has an invalid tag`);
    else if (tags.has(tag.tag)) errors.push(`duplicate evidence tag ${tag.tag}`);
    else tags.add(tag.tag);
    if (!isText(tag.sourceEventId)) errors.push(`evidence ${index} requires a sourceEventId`);
    if (!isText(tag.source)) errors.push(`evidence ${index} requires a source`);
    if (!Number.isInteger(tag.ownTurnId)) errors.push(`evidence ${index} requires an integer ownTurnId`);
  });
  if (state.generationUsedOwnTurnId !== null && state.generationUsedOwnTurnId !== undefined) {
    const value = state.generationUsedOwnTurnId;
    if (!(typeof value === 'string' && value.trim().length > 0) && !Number.isInteger(value)) {
      errors.push('generationUsedOwnTurnId must be null, a non-empty string or an integer');
    }
  }
  if (state.lastContactOwnTurn !== null && state.lastContactOwnTurn !== undefined && !Number.isInteger(state.lastContactOwnTurn)) {
    errors.push('lastContactOwnTurn must be null or an integer');
  }
  if (state.companion !== null && state.companion !== undefined) {
    if (typeof state.companion !== 'object') errors.push('companion must be null or an object');
    else {
      if (!isText(state.companion.id)) errors.push('companion requires an id');
      if (state.companion.bonded !== true) errors.push('companion must be positively bonded and trained');
    }
  }
  if (state.committedPath !== null && state.committedPath !== undefined) {
    if (typeof state.committedPath !== 'object') errors.push('committedPath must be null or an object');
    else {
      if (!isText(state.committedPath.weaponId)) errors.push('committedPath requires a weaponId');
      if (!integerBetween(state.committedPath.pathFeet, 1, 20)) errors.push('committedPath pathFeet must be 1..20');
      if (!Number.isInteger(state.committedPath.expiresAtTurn)) errors.push('committedPath requires an integer expiresAtTurn');
    }
  }
  return { valid: errors.length === 0, errors };
}

export function projectHunterResource(resource, isOwner = false) {
  const state = resource?.state ?? null;
  if (!state) {
    return { initialized: false, valid: true, errors: [], quarry: null, evidence: [], generationUsedOwnTurnId: null, companion: null, committedPath: null };
  }
  const check = validateHunterState(state);
  const evidence = Array.isArray(state.evidence) ? state.evidence : [];
  return {
    initialized: true, valid: check.valid, errors: check.errors,
    quarry: state.quarry && typeof state.quarry === 'object'
      ? { id: state.quarry.id || null, label: state.quarry.label || 'Unrecorded quarry' } : null,
    evidence: evidence.map(tag => ({
      tag: HUNTER_TAGS.includes(tag.tag) ? tag.tag : 'unknown',
      source: tag.source || 'Unrecorded source',
      ownTurnId: Number.isInteger(tag.ownTurnId) ? tag.ownTurnId : null,
      ...(isOwner && isText(tag.sourceEventId) ? { sourceEventId: tag.sourceEventId } : {})
    })),
    generationUsedOwnTurnId: state.generationUsedOwnTurnId ?? null,
    companion: state.companion && typeof state.companion === 'object'
      ? { id: state.companion.id || null, label: state.companion.label || 'Bonded companion', bonded: state.companion.bonded === true } : null,
    committedPath: state.committedPath && typeof state.committedPath === 'object'
      ? { weaponId: state.committedPath.weaponId || null, pathFeet: Number.isInteger(state.committedPath.pathFeet) ? state.committedPath.pathFeet : 0, expiresAtTurn: state.committedPath.expiresAtTurn ?? null }
      : null
  };
}

export const HUNTER_RESOURCE_RULES = {
  quarryMax: 1, evidenceDistinctMax: 3, tags: HUNTER_TAGS, newTagsPerOwnTurn: 1,
  lostContactExpiryOwnTurns: 2, companionOptional: true, companionActionMaxPerOwnTurn: 1,
  committedPathMaxFeet: 20, committedPathExpiryOwnTurns: 2,
  refreshOnLongRest: false, refreshOnReconnect: false, refreshOnInitiative: false,
  automaticTagGeneration: false, automaticContact: false, automaticCompanionAction: false, manualOnly: true
};

export const HUNTER_RESOURCE_SYSTEM = {
  id: 'hunter-evidence', name: 'Quarry & Evidence', shortName: 'Evidence', type: 'hunter-evidence',
  title: 'Quarry & Evidence', subtitle: 'One quarry, three distinct openings and a real companion.',
  base: 0, max: 3, quarryMax: 1, evidenceMax: 3, companionOptional: true, manualOnly: true,
  description: 'Designate one exact quarry. Read, Angle and Pressure are distinct evidence tags with recorded sources; at most one new tag is generated per own turn. Spend listed tags on tactics. Evidence expires after two own turns without contact.',
  cards: [
    { title: 'Quarry (0-1)', stats: 'One exact reference', details: 'Changing quarry clears all evidence. Investigating an unknown trail never invents an exact combat identity.' },
    { title: 'Evidence (0-3)', stats: 'Read, Angle, Pressure', details: 'Each tag records its source event and own turn. A duplicate tag does nothing and spending a tag never refreshes generation.' },
    { title: 'Companion', stats: 'Optional, one action', details: 'A real bonded and trained companion shares the one-tag cap and spends its own action. No fabricated pet or free creature turn.' }
  ],
  generationTable: {
    headers: ['Source', 'Tag', 'Budget treatment'],
    rows: [
      ['Mark Quarry or Study', 'Read', 'Requires the own-turn generation budget'],
      ['Take an Angle with 10 ft legal movement', 'Angle', 'Requires the own-turn generation budget'],
      ['Press the Quarry with an accepted non-miss hit', 'Pressure', 'Requires the own-turn generation budget'],
      ['Companion study or accepted pack hit', 'Read or Pressure', 'Shares the same own-turn budget'],
      ['Duplicate tag, miss or ordinary movement', 'None', 'No tag; AP is still spent when the action was paid']
    ]
  },
  usage: {
    momentum: 'Mark the quarry, build one opening and spend evidence only when it actually creates the strike you want.',
    flourish: 'Patient Ambush needs Read and Angle; Cross the Scent needs Read and Pressure and a real companion action; Returning Path commits a glaive to one visible segment.'
  },
  mechanics: {
    title: 'Manual Quarry Ledger',
    content: 'One exact quarry, at most three distinct evidence tags, one new tag per own turn and a recorded source event for each. Evidence expires after two own turns without contact.',
    sections: [
      { label: 'Evidence', mechanics: [{ text: 'Read, Angle and Pressure are distinct; one tag cannot pay twice.' }, { text: 'A miss, duplicate or ordinary movement grants nothing.' }] },
      { label: 'Contact', mechanics: [{ text: 'Explicit observation, movement or an accepted hit renews contact.' }, { text: 'Two full own turns without contact expire all evidence.' }] }
    ]
  },
  overheatRules: {
    title: 'Quarry Overflow',
    content: 'A second quarry is rejected without changing the first; changing quarry is always deliberate and clears all evidence. A fourth evidence tag or duplicate tag is rejected. A third own-turn tag is impossible because generation is capped at one. A missing companion disables companion actions only, never the solo economy.'
  },
  playingInPerson: {
    title: 'The Quarry Ledger',
    subtitle: 'One quarry card and three evidence tokens',
    content: 'Write the exact quarry on one card. Place Read, Angle and Pressure tokens only when their source event is accepted. Turn a token in when spent. After two own turns without contact, clear the tokens; the quarry card remains until changed or retired.'
  },
  nativeNote: 'No native heritage edge is registered. Field and Quiet methods are recommendations only.'
};

export const HUNTER_DATA = {
  ...flags, id: HUNTER_CLASS_ID, name: 'Hunter', variantName: 'Hunter',
  icon: HUNTER_ICON, imageIcon: '/assets/icons/classes/huntress.png',
  role: 'Pursuit / Precision', damageTypes: ['stabbing', 'slicing', 'primal'],
  resource: 'Quarry & Evidence', primaryStat: 'Agility', secondaryStat: 'Spirit',
  developmentStatus: 'development', statusLabel: 'Development - manual tabletop',
  heritageEffectsImplemented: false, nativeAccess: [],
  heritageRecommendation: ['skald_human', 'ordan_human', 'veiled_mimir', 'tethered_mimir', 'marked_vreken', 'thrask_solari', 'deepling_myrathil'],
  classResource: {
    type: 'hunter-evidence', base: 0, max: 3, quarryMax: 1, evidenceMax: 3,
    initialized: false, state: null,
    generationNote: 'Uninitialized until the table records an exact quarry and its first real evidence tag.'
  },
  restrictions: {
    allowedSubraces: [], hardBlocks: [], narrativeUnlock: true,
    acquisition: {
      status: 'proposed',
      records: [
        { id: 'field_apprenticeship', label: 'Field apprenticeship', text: 'Train under a working field hunter or an equivalent maintained practice.' },
        { id: 'tracking_training', label: 'Tracking training', text: 'Read real spoor, plan a route and survive one field expedition.' },
        { id: 'sensory_trade', label: 'Sensory trade (Quiet method)', text: 'A genuine sensory trade or equivalent training that changes what the hunter can perceive.' },
        { id: 'companion_bond', label: 'Companion bond (Beastmaster)', text: 'A positively bonded and trained companion, not a summoned or fabricated pet.' }
      ]
    },
    justification: 'Hunter is a development successor class. It preserves legacy Apex/Huntress records, requires no companion for its solo path and grants no native heritage edge.'
  },
  equipment: { weapons: ['bow', 'crossbow', 'glaive', 'dagger'], protectiveGear: ['leather', 'hide', 'cloak'], offHand: ['empty', 'quiver'] },
  subraceVariants: {},
  overview: {
    title: 'The Hunter', subtitle: 'Read the quarry. Spend the opening.',
    description: 'A Hunter designates one exact quarry, gathers Read, Angle and Pressure from real events, and spends them on a prepared strike. The companion is a real optional path, not a required pet.',
    quickOverview: {
      title: 'Class Overview',
      content: 'One quarry, three distinct evidence tags, one new tag per own turn. Mark Quarry, Take an Angle and Press the Quarry are core. Four optional records at every level and one signature and capstone per tree. Manual tabletop only.'
    },
    combatRole: 'Mobile precision and control through a prepared opening, with a solo-viable stalker path, an optional real companion and a committed-glaive route.',
    playstyle: {
      title: 'Turn 1',
      content: 'Name the exact quarry. Use one generating action to obtain a tag, record its source event and stop; a second tag cannot be manufactured in the same own turn.'
    },
    roleplayIdentity: {
      title: 'A prepared opening, not a magical mark',
      content: 'Hunter is the proposed successor direction for Apex. It does not inherit Apex marks, companion powers or sensory loss. Legacy Apex characters keep their exact IDs and state.'
    },
    currentCrisis: 'Development class; no native heritage access is registered. Skald, Ordu, Arch Mimir, Broken Mimir, Cromyx, Anhur and Nereid field traditions are recommendations pending approval.'
  },
  characterCreation: {
    title: 'Hunter',
    description: 'Choose one level-1 optional; Mark Quarry, Take an Angle and Press the Quarry are core grants. Record acquisition requirements. Quarry state stays uninitialized until the table records an exact target and its first evidence.'
  },
  specializations: {
    title: 'Three Pursuit Disciplines',
    description: 'First investment chooses a primary tree. Five talent points per level, global cap fifty. Signatures require ten same-tree points at level three; capstones forty-five at level ten.',
    specs: HUNTER_TREE_META.map(meta => ({
      id: meta.id, name: meta.name, icon: HUNTER_ICON, theme: meta.tagline,
      description: meta.tagline, playstyle: meta.tagline
    }))
  },
  spells: HUNTER_PROJECTED_SPELLS, spellPools: HUNTER_SPELL_POOLS,
  progression: {
    levelCap: 10, policy: HUNTER_PROGRESSION_POLICY,
    levels: Array.from({ length: 10 }, (_, index) => ({
      level: index + 1, newChoiceIds: HUNTER_SPELL_POOLS[index + 1],
      optionalPicks: 1, talentBudget: (index + 1) * 5
    }))
  },
  talentTrees: HUNTER_TALENT_CAPACITY,
  resourceSystem: { ...HUNTER_RESOURCE_SYSTEM }
};

export const HUNTER_MANIFEST = {
  ...flags, contentLock: 'RI-4 Hunter complete content lock',
  optional: HUNTER_OPTIONAL_RECORDS.map(recordEntry => recordEntry.id),
  core: HUNTER_CORE_RECORDS.map(recordEntry => recordEntry.id),
  talentActives: HUNTER_TALENT_ACTIVES.map(recordEntry => recordEntry.id),
  passives: HUNTER_PASSIVE_RECORDS.map(recordEntry => recordEntry.id),
  records: HUNTER_AUTHORED_RECORDS.map(recordEntry => ({
    id: recordEntry.id, name: recordEntry.name, level: recordEntry.level, source: recordEntry.source,
    treeId: nodeForRecord(recordEntry)?.treeId || null,
    ap: recordEntry.resourceCost.actionPoints, mana: 0
  })),
  nodes: HUNTER_TALENT_NODES.map(node => ({
    id: node.id, treeId: node.treeId, spellId: node.grantId || node.passiveSpellId,
    ranks: node.maxRanks, minimumLevel: node.minLevel, requiresPoints: node.requiresPoints,
    prerequisites: node.requires
  })),
  uniqueRecords: 97, activeRecords: 49, passiveRecords: 48,
  talentNodes: 54, talentCapacity: HUNTER_TALENT_CAPACITY,
  nativeAccess: [], acquisitionRequirements: HUNTER_DATA.restrictions.acquisition.records.map(recordEntry => recordEntry.id),
  heritageEffectsImplemented: false, resourceRules: HUNTER_RESOURCE_RULES,
  trees: HUNTER_TREES.map(tree => tree.id),
  dependencies: ['CR-R1', 'RI-4 content lock', 'manual-tabletop'],
  automaticConversion: false
};

export default HUNTER_DATA;
