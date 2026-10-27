import {
  DRUID_TREE_META, DRUID_TREES, DRUID_TALENT_NODES,
  DRUID_PASSIVE_RECORDS, DRUID_TALENT_CAPACITY
} from '../talentTrees/druid';

export const DRUID_CLASS_ID = 'druid';
export const DRUID_RULESET_VERSION = 'cr-review-r1';
export const DRUID_ICON = 'Nature/Leaf';
export const DRUID_MANUAL_NOTICE = 'Manual tabletop only. No automatic transformation, slot, transition, recovery, suspension, damage, prevention, movement or expiry.';

const flags = {
  classId: DRUID_CLASS_ID, rulesetVersion: DRUID_RULESET_VERSION,
  authoredOnly: true, manualOnly: true, executionEnabled: false,
  applicationMode: 'manual-tabletop', automatedCapabilities: [],
  manualNotice: DRUID_MANUAL_NOTICE
};
const id = suffix => `cr1_druid_${suffix}`;
const instant = { durationType: 'instant', durationValue: 0, durationUnit: 'instant' };
const nextStart = { durationType: 'own_turns', durationValue: 1, durationUnit: 'next_caster_turn_start' };
const selfTarget = { targetingType: 'self', rangeType: 'self', rangeDistance: 0, targetRestrictions: ['self'], maxTargets: 1 };
const target = (roles, maxTargets = 1, rangeDistance = 5) => ({
  targetingType: maxTargets > 1 ? 'multi' : 'single', rangeType: rangeDistance <= 5 ? 'melee' : 'ranged',
  rangeDistance, targetRestrictions: roles, maxTargets
});
const enemy = (n = 1, feet = 5) => target(['enemy'], n, feet);
const ally = (n = 1, feet = 30) => target(['ally', 'self'], n, feet);
const area = (feet = 15) => ({
  targetingType: 'area', rangeType: 'ranged', rangeDistance: 30,
  targetRestrictions: ['area'], maxTargets: 1, areaRadius: feet
});
const apCost = actionPoints => ({
  actionPoints, mana: 0, resourceTypes: ['actionPoints'],
  resourceValues: { actionPoints, mana: 0 }, useFormulas: {}, components: ['somatic'],
  somaticText: 'Describe the anatomical change and name the trait given up before resolution.'
});
const damage = (formula, damageTypes = ['slicing']) => ({ formula, damageTypes, resolution: 'DICE' });
const cooldownNone = { cooldownType: 'turn_based', cooldownValue: 0 };
const cooldownLongRest = { cooldownType: 'long_rest', cooldownValue: 1 };
const effect = (kind, args, description) => ({ kind, args, description, executable: false });

const record = (level, suffix, name, ap, targetingConfig, effectTypes, program, description, effects = [], options = {}) => ({
  ...flags, id: id(suffix), name, level, specialization: options.specialization || null,
  treeId: options.treeId || null, source: options.source || 'optional', spellType: 'ACTION',
  icon: DRUID_ICON, resourceCost: apCost(ap), targetingConfig, effectTypes,
  damageConfig: options.damageConfig || null,
  durationConfig: options.durationConfig || instant,
  cooldownConfig: options.cooldownConfig || cooldownNone,
  reactionTiming: null, savingThrow: null, conditions: options.conditions || [], area: options.area || null,
  description,
  classResourceProgram: program ? { version: 1, domain: 'druid-body', ...program } : null,
  manualMechanics: {
    price: { actionPoints: ap, mana: 0, transitions: program?.args?.transitions || 0, suspensions: program?.args?.suspensions || 0 },
    effects: effects.length ? effects : [effect(program?.op || 'body.none', program?.args || {}, description)],
    executable: false
  },
  sourceRefs: ['RI-4 Druid content lock']
});

export const DRUID_COMMON_MECHANICS = {
  price: 'AP and mana are explicit. Adopting a loadout costs one unrecovered transition; recovery suspends one real active trait.',
  slots: 'Four anatomical slots (locomotion, offense, defense, senses). At most two active traits and never two traits in the same slot.',
  loadouts: 'Three prepared loadouts are chosen at a completed long rest: predator (locomotion/offense), bastion (defense/senses) and mimic (locomotion/senses).',
  transitions: 'Adopt replaces the active anatomy and adds one unrecovered transition. At three transitions further adoption is refused until recovery. No forced feral state.',
  recovery: 'Recover costs 1 AP, suspends one active unsuspended trait until your next own turn and reduces unrecovered transitions by one. A suspended trait grants nothing.',
  plating: 'Layered plating prevents 2 assigned damage from the first eligible ordinary damage event each own-turn window, before temp HP. Living Brace prevents 4 instead, once, when active and unspent.',
  mimicry: 'Borrowed Outline requires both mimic slots, a ten-minute studied same-size outline and a height change of at most ten percent. It lasts one minute and copies no equipment, memories, ancestry or spells.',
  expiry: 'Suspension lasts until your next own turn. A completed long rest returns the default body and clears strain. Reconnect, initiative or scene change never refreshes the economy.',
  native: 'Druid has no registered native heritage edge. Morgh, Amordjin, Arch Mimir and Broken Mimir are recommendations only; acquisition must be recorded.'
};

export const DRUID_CORE_RECORDS = [
  record(1, 'adopt_loadout', 'Adopt Loadout', 1, selfTarget, ['utility'], {
    op: 'body.adopt', args: {
      activeTraitMax: 2, transitionMax: 3, preparedLoadoutMax: 3,
      loadouts: ['predator', 'bastion', 'mimic'], automatic: false
    }
  }, 'Replace your active anatomy with one prepared loadout. Record the two occupied slots and add one unrecovered transition; at three transitions the adoption is refused until recovery.', [
    effect('body.adopt', { activeTraitMax: 2, transitionMax: 3, loadouts: ['predator', 'bastion', 'mimic'] }, 'Adopt a prepared two-slot anatomy.')
  ], { source: 'core' }),
  record(1, 'recover_self', 'Recover the Self', 1, selfTarget, ['utility'], {
    op: 'body.recover', args: {
      requireTransition: true, suspensionTurns: 1, suspensionMustBeActive: true,
      reducesTransitionsBy: 1, automatic: false
    }
  }, 'Suspend one active unsuspended trait until your next own turn and reduce unrecovered transitions by one. The suspended trait grants no benefit and cannot satisfy a prerequisite.', [
    effect('body.recover', { suspensionTurns: 1, reducesTransitionsBy: 1 }, 'Suspend one real trait to recover one transition.')
  ], { source: 'core' })
];

const optional = [
  record(1, 'rending_claw', 'Rending Claw', 1, enemy(), ['damage'], {
    op: 'body.strike', args: { rangeFeet: 5, damage: '1d6', requiresSlot: 'offense' }
  }, 'One adjacent enemy takes 1d6 slicing from a natural weapon. The offense slot must carry the actual weapon anatomy; no hidden extra strike.', [
    effect('body.strike', { rangeFeet: 5, damage: '1d6' }, 'Deal 1d6 slicing with a natural weapon.')
  ], { damageConfig: damage('1d6') }),
  record(1, 'chitin_plate', 'Chitin Plate', 1, selfTarget, ['buff'], {
    op: 'body.guard', args: { prevent: 2, uses: 1, window: 'own-turn', beforeTempHp: true }
  }, 'Until your next own turn, the first eligible ordinary damage event against you is reduced by 2. Record the prevention once; it does not stack with itself.', [
    effect('body.guard', { prevent: 2, uses: 1 }, 'Prevent 2 from one damage event this own-turn window.')
  ], { durationConfig: nextStart }),
  record(1, 'soft_step', 'Soft-Step', 1, selfTarget, ['utility'], {
    op: 'body.move', args: { moveFeet: 10, ordinaryMovement: true, requiresSlot: 'locomotion' }
  }, 'Move 10 ft using ordinary movement with a softened gait. Difficult terrain, opportunity rules and the locomotion requirement still apply.', [
    effect('body.move', { moveFeet: 10 }, 'Move 10 ft with an adapted gait.')
  ]),
  record(1, 'taste_the_air', 'Taste the Air', 1, selfTarget, ['utility'], {
    op: 'body.sense', args: { rangeFeet: 30, reveals: ['direction', 'age', 'kind'], hiddenIdentity: false }
  }, 'Read the direction, age and broad kind of a recent physical trace within 30 ft. It does not reveal hidden creatures, exact identity or unrolled intentions.', [
    effect('body.sense', { rangeFeet: 30, reveals: ['direction', 'age', 'kind'] }, 'Read one recent physical trace.')
  ]),

  record(2, 'shed_the_snare', 'Shed the Snare', 1, selfTarget, ['utility'], {
    op: 'body.shed', args: { requiresSuspension: true, escapes: ['mundane-grapple', 'loose-rope'], rigidRestraints: false, magicalBindings: false }
  }, 'Suspend one active unsuspended trait until your next turn to distort out of one mundane grapple or loose rope. Rigid manacles, magical bindings and surgery are not escaped.', [
    effect('body.shed', { escapes: ['mundane-grapple', 'loose-rope'] }, 'Escape one loose restraint by suspending a trait.')
  ], { durationConfig: nextStart }),
  record(2, 'lashing_tail', 'Lashing Tail', 1, enemy(), ['damage', 'control'], {
    op: 'body.strike', args: { rangeFeet: 10, damage: '1d4', pushFeet: 5, requiresSlot: 'offense' }
  }, 'One enemy within 10 ft takes 1d4 slicing and is pushed 5 ft away. The offense slot must be active; one damage event and one forced move.', [
    effect('body.strike', { damage: '1d4', pushFeet: 5 }, 'Deal 1d4 and push 5 ft.')
  ], { damageConfig: damage('1d4') }),
  record(2, 'stonehide_stance', 'Stonehide Stance', 1, selfTarget, ['buff'], {
    op: 'body.guard', args: { prevent: 3, uses: 1, requiresSlot: 'defense', stationary: false }
  }, 'Harden the active defense anatomy. Prevent 3 from one eligible damage event before your next turn. The prevention is recorded once and never stacks with plating.', [
    effect('body.guard', { prevent: 3, uses: 1, requiresSlot: 'defense' }, 'Prevent 3 with hardened hide.')
  ], { durationConfig: nextStart }),
  record(2, 'predators_leap', "Predator's Leap", 1, selfTarget, ['utility'], {
    op: 'body.move', args: { moveFeet: 15, verticalFeet: 10, requiresSlot: 'locomotion', ordinaryMovement: true }
  }, 'Leap up to 15 ft horizontally and 10 ft vertically with prepared leg anatomy. Landing, opportunity rules and difficult terrain still apply.', [
    effect('body.move', { moveFeet: 15, verticalFeet: 10 }, 'Leap with prepared legs.')
  ]),

  record(3, 'crushing_pounce', 'Crushing Pounce', 2, enemy(), ['damage'], {
    op: 'body.strike', args: { rangeFeet: 10, damage: '2d6', requiresSlot: 'offense', afterMove: true }
  }, 'Move 10 ft, then strike one enemy for 2d6 slicing. The move and strike are one paid action; the offense slot must be active.', [
    effect('body.strike', { damage: '2d6', afterMove: true }, 'Move 10 ft and deal 2d6 slicing.')
  ], { damageConfig: damage('2d6') }),
  record(3, 'vibration_sense', 'Vibration Sense', 1, selfTarget, ['utility'], {
    op: 'body.sense', args: { radiusFeet: 10, detects: 'moving-contact', hiddenIdentity: false, requiresSlot: 'senses' }
  }, 'Feel moving contact within 10 ft of your body through the ground. It does not reveal identity, still creatures or events beyond the touching surface.', [
    effect('body.sense', { radiusFeet: 10, detects: 'moving-contact' }, 'Feel moving contact within 10 ft.')
  ]),
  record(3, 'mending_molt', 'Mending Molt', 2, selfTarget, ['heal'], {
    op: 'body.heal', args: { healing: '1d8', requiresSlot: 'defense', oncePerTarget: true }
  }, 'Shed damaged tissue and restore 1d8 HP to yourself. The defense slot must be active. This is healing, not regeneration or immunity.', [
    effect('body.heal', { healing: '1d8' }, 'Restore 1d8 HP once.')
  ]),
  record(3, 'ambush_instinct', 'Ambush Instinct', 2, selfTarget, ['buff'], {
    op: 'body.focus', args: { attackBonus: 2, duration: 'start-next-caster-turn', requiresSlot: 'senses' }
  }, 'Add 2 to one attack before the start of your next turn. The senses slot must be active; declare the bonus before rolling.', [
    effect('body.focus', { attackBonus: 2 }, 'Add 2 to one attack before your next turn.')
  ], { durationConfig: nextStart }),

  record(4, 'guardian_carapace', 'Guardian Carapace', 2, selfTarget, ['buff'], {
    op: 'body.guard', args: { prevent: 4, uses: 1, requiresSlot: 'defense', window: 'own-turn' }
  }, 'Prevent 4 from one eligible damage event before your next turn with reinforced plating. One use; no extra armor score or double subtraction.', [
    effect('body.guard', { prevent: 4, uses: 1 }, 'Prevent 4 once.')
  ], { durationConfig: nextStart }),
  record(4, 'hooked_tendril', 'Hooked Tendril', 2, enemy(1, 10), ['control'], {
    op: 'body.control', args: { rangeFeet: 10, condition: 'grappled', escape: 'ordinary check', duration: 'end-target-next-turn', requiresSlot: 'offense' }
  }, 'One enemy within 10 ft is grappled until the end of its next turn unless it escapes by an ordinary check. No damage and no hidden extra target.', [
    effect('body.control', { condition: 'grappled', duration: 'end-target-next-turn' }, 'Grapple one enemy until its next turn ends.')
  ], { conditions: ['grappled'], durationConfig: nextStart }),
  record(4, 'burrowing_retreat', 'Burrowing Retreat', 2, selfTarget, ['utility'], {
    op: 'body.move', args: { moveFeet: 15, requiresSlot: 'locomotion', leavesProne: false, throughSolid: false }
  }, 'Burrow or scrabble 15 ft through loose earth or similar ground. Solid stone, walls and magical barriers block the move.', [
    effect('body.move', { moveFeet: 15, throughSolid: false }, 'Move 15 ft through loose ground.')
  ]),
  record(4, 'venom_spur', 'Venom Spur', 2, enemy(), ['damage'], {
    op: 'body.strike', args: { rangeFeet: 5, damage: '1d6', damageType: 'blight', requiresSlot: 'offense', savePenalty: -1 }
  }, 'One adjacent enemy takes 1d6 blight and has -1 to one save before your next turn. The offense slot must be active.', [
    effect('body.strike', { damage: '1d6', damageType: 'blight', savePenalty: -1 }, 'Deal 1d6 blight and penalize one save.')
  ], { damageConfig: damage('1d6', ['blight']), durationConfig: nextStart }),

  record(5, 'twin_talons', 'Twin Talons', 2, enemy(), ['damage'], {
    op: 'body.strike', args: { rangeFeet: 5, damage: '1d8', secondStrike: true, requiresSlot: 'offense' }
  }, 'Make one natural-weapon strike for 1d8 slicing. If both Predator slots are active, roll the second talon once as part of the same event; no third strike.', [
    effect('body.strike', { damage: '1d8', secondStrike: true }, 'Deal 1d8, with one additional talon if both Predator slots are active.')
  ], { damageConfig: damage('1d8') }),
  record(5, 'camouflage_skin', 'Camouflage Skin', 2, selfTarget, ['utility'], {
    op: 'body.hide', args: { bonus: 3, requiresSlot: 'senses', duration: 'start-next-caster-turn', invisibility: false }
  }, 'Shift skin color and texture to match the surroundings. Add 3 to one Stealth check before your next turn; this is not invisibility and leaves physical evidence.', [
    effect('body.hide', { bonus: 3 }, 'Add 3 to one Stealth check.')
  ], { durationConfig: nextStart }),
  record(5, 'reinforced_joints', 'Reinforced Joints', 2, selfTarget, ['buff'], {
    op: 'body.guard', args: { prevent: 2, uses: 2, requiresSlot: 'defense', window: 'own-turn' }
  }, 'Prevent 2 from each of up to two eligible damage events before your next turn. Each prevention is recorded separately; no shared pool.', [
    effect('body.guard', { prevent: 2, uses: 2 }, 'Prevent 2 twice before your next turn.')
  ], { durationConfig: nextStart }),
  record(5, 'chameleon_gait', 'Chameleon Gait', 1, selfTarget, ['utility'], {
    op: 'body.move', args: { moveFeet: 10, difficultTerrain: true, requiresSlot: 'locomotion' }
  }, 'Move 10 ft ignoring nonmagical difficult terrain with an adapted gait. Magical terrain, walls and opportunity rules still apply.', [
    effect('body.move', { moveFeet: 10, difficultTerrain: true }, 'Move 10 ft through nonmagical difficult terrain.')
  ]),

  record(6, 'spined_back', 'Spined Back', 2, selfTarget, ['damage', 'control'], {
    op: 'body.counter', args: { trigger: 'grappled-or-struck-adjacent', damage: '1d6', oncePerRound: true, requiresSlot: 'defense' }
  }, 'When an adjacent creature grapples or strikes you, deal 1d6 piercing once that round. This is a declared counter, not an automatic reaction or extra turn.', [
    effect('body.counter', { damage: '1d6', oncePerRound: true }, 'Deal 1d6 piercing once when contacted.')
  ], { damageConfig: damage('1d6', ['stabbing']) }),
  record(6, 'anchoring_root', 'Anchoring Root', 2, area(10), ['control'], {
    op: 'body.field', args: { radiusFeet: 10, difficultTerrain: true, requiresSlot: 'locomotion', duration: 'start-next-caster-turn' }
  }, 'Roots or hardened limbs make a visible 10-ft radius difficult terrain until your next turn. No damage and no hidden effect.', [
    effect('body.field', { radiusFeet: 10, difficultTerrain: true }, 'Create visible difficult terrain.')
  ], { durationConfig: nextStart, area: { shape: 'sphere', radius: 10, visible: true } }),
  record(6, 'regenerative_bloom', 'Regenerative Bloom', 2, ally(), ['heal'], {
    op: 'body.heal', args: { rangeFeet: 30, healing: '2d8', target: 'willing-living', requiresSlot: 'defense' }
  }, 'One willing living creature within 30 ft regains 2d8 HP. The defense slot must be active; no resurrection and no condition removal.', [
    effect('body.heal', { healing: '2d8' }, 'Restore 2d8 HP to one willing creature.')
  ]),
  record(6, 'scent_map', 'Scent Map', 2, selfTarget, ['utility'], {
    op: 'body.sense', args: { rangeFeet: 60, reveals: ['route', 'age', 'count'], hiddenIdentity: false, requiresSlot: 'senses' }
  }, 'Read one physical trail within 60 ft: route, approximate age and number of travelers. It does not name creatures or reveal hidden intentions.', [
    effect('body.sense', { rangeFeet: 60, reveals: ['route', 'age', 'count'] }, 'Read one physical trail in detail.')
  ]),

  record(7, 'apex_lunge', 'Apex Lunge', 3, enemy(), ['damage'], {
    op: 'body.strike', args: { rangeFeet: 10, damage: '2d8', requiresSlot: 'offense', knockProne: true }
  }, 'One enemy within 10 ft takes 2d8 slicing and is knocked prone. The offense slot must be active; one damage event and one condition.', [
    effect('body.strike', { damage: '2d8', knockProne: true }, 'Deal 2d8 and knock prone.')
  ], { damageConfig: damage('2d8'), conditions: ['prone'] }),
  record(7, 'mimic_voice', 'Mimic Voice', 1, selfTarget, ['utility'], {
    op: 'body.mimic', args: { studiedMinutes: 10, copies: ['voice', 'speech-pattern'], copiesMemories: false, requiresSlots: ['locomotion', 'senses'] }
  }, 'Reproduce one studied voice and speech pattern for one minute. It copies no memories, authority or private knowledge and breaks if the studied source is contradicted.', [
    effect('body.mimic', { copies: ['voice', 'speech-pattern'] }, 'Reproduce one studied voice.')
  ], { durationConfig: { durationType: 'minutes', durationValue: 1, durationUnit: 'minutes' } }),
  record(7, 'warding_shell', 'Warding Shell', 2, selfTarget, ['buff'], {
    op: 'body.guard', args: { prevent: 6, uses: 1, requiresSlot: 'defense', window: 'own-turn' }
  }, 'Prevent 6 from one eligible damage event before your next turn with a thick shell. One use; no immunity and no stacking.', [
    effect('body.guard', { prevent: 6, uses: 1 }, 'Prevent 6 once.')
  ], { durationConfig: nextStart }),
  record(7, 'slip_the_coil', 'Slip the Coil', 1, selfTarget, ['utility'], {
    op: 'body.move', args: { moveFeet: 15, escapes: ['grapple'], requiresSlot: 'locomotion', rigidRestraints: false }
  }, 'Slip out of one grapple and move 15 ft using ordinary movement. Rigid restraints and magical bindings still hold.', [
    effect('body.move', { moveFeet: 15, escapes: ['grapple'] }, 'Escape one grapple and move 15 ft.')
  ]),

  record(8, 'bonebreaker_bite', 'Bonebreaker Bite', 3, enemy(), ['damage'], {
    op: 'body.strike', args: { rangeFeet: 5, damage: '3d6', requiresSlot: 'offense', savePenalty: -2 }
  }, 'One adjacent enemy takes 3d6 slicing and has -2 to one save before your next turn. The offense slot must be active.', [
    effect('body.strike', { damage: '3d6', savePenalty: -2 }, 'Deal 3d6 and penalize one save.')
  ], { damageConfig: damage('3d6'), durationConfig: nextStart }),
  record(8, 'living_wall', 'Living Wall', 2, area(15), ['control'], {
    op: 'body.field', args: { radiusFeet: 15, difficultTerrain: true, cover: 'half', requiresSlot: 'defense', duration: 'start-next-caster-turn' }
  }, 'Grow a visible 15-ft barrier of body or root. The area is difficult terrain and grants half cover to one chosen side until your next turn. No damage.', [
    effect('body.field', { radiusFeet: 15, difficultTerrain: true, cover: 'half' }, 'Create a visible barrier with half cover.')
  ], { durationConfig: nextStart, area: { shape: 'sphere', radius: 15, visible: true } }),
  record(8, 'adaptive_hide', 'Adaptive Hide', 2, selfTarget, ['buff'], {
    op: 'body.guard', args: { prevent: 3, uses: 1, requiresSlot: 'defense', against: 'one-named-damage-type' }
  }, 'Prevent 3 from one named damage type before your next turn. Choose the type when the trait is adopted; no blanket resistance.', [
    effect('body.guard', { prevent: 3, against: 'one-named-damage-type' }, 'Prevent 3 from one named damage type.')
  ], { durationConfig: nextStart }),
  record(8, 'echo_location', 'Echo Location', 2, selfTarget, ['utility'], {
    op: 'body.sense', args: { radiusFeet: 30, detects: ['solid-shapes', 'moving-creatures'], hiddenIdentity: false, requiresSlot: 'senses' }
  }, 'Map solid shapes and moving creatures within 30 ft by echo. It does not reveal identity, thoughts or creatures behind total obstruction.', [
    effect('body.sense', { radiusFeet: 30, detects: ['solid-shapes', 'moving-creatures'] }, 'Map shapes and movement within 30 ft.')
  ]),

  record(9, 'rending_frenzy', 'Rending Frenzy', 3, enemy(), ['damage'], {
    op: 'body.strike', args: { rangeFeet: 5, damage: '3d8', requiresSlot: 'offense', oncePerTarget: true }
  }, 'One adjacent enemy takes 3d8 slicing once. The offense slot must be active and the same creature cannot be targeted twice in one encounter by this record.', [
    effect('body.strike', { damage: '3d8', oncePerTarget: true }, 'Deal 3d8 once per target.')
  ], { damageConfig: damage('3d8') }),
  record(9, 'perfect_disguise', 'Perfect Disguise', 2, selfTarget, ['utility'], {
    op: 'body.mimic', args: { studiedMinutes: 10, sizeDeltaPercent: 10, durationMinutes: 10, copiesMemories: false, requiresSlots: ['locomotion', 'senses'] }
  }, 'Hold one studied same-size outline for ten minutes. It copies surface anatomy and gait only; equipment, memories, ancestry traits, spells and legal authority are not copied.', [
    effect('body.mimic', { sizeDeltaPercent: 10, durationMinutes: 10 }, 'Hold a studied outline for ten minutes.')
  ], { durationConfig: { durationType: 'minutes', durationValue: 10, durationUnit: 'minutes' } }),
  record(9, 'unbreakable_plating', 'Unbreakable Plating', 3, selfTarget, ['buff'], {
    op: 'body.guard', args: { prevent: 8, uses: 1, requiresSlot: 'defense', window: 'own-turn' }
  }, 'Prevent 8 from one eligible damage event before your next turn. One use; no immunity and no carryover between windows.', [
    effect('body.guard', { prevent: 8, uses: 1 }, 'Prevent 8 once.')
  ], { durationConfig: nextStart }),
  record(9, 'earthmeld', 'Earthmeld', 2, selfTarget, ['utility'], {
    op: 'body.move', args: { moveFeet: 20, through: 'loose-earth', leavesEvidence: true, requiresSlot: 'locomotion' }
  }, 'Move 20 ft through loose earth or similar ground and leave a visible tunnel. Solid stone, walls and magical barriers block the move.', [
    effect('body.move', { moveFeet: 20, through: 'loose-earth' }, 'Move 20 ft through loose earth.')
  ]),

  record(10, 'world_serpent_strike', 'World-Serpent Strike', 3, enemy(), ['damage'], {
    op: 'body.strike', args: { rangeFeet: 15, damage: '5d8', requiresSlot: 'offense', savePenalty: -2 }
  }, 'One enemy within 15 ft takes 5d8 slicing and has -2 to one save before your next turn. The offense slot must be active; this is a finite strike, never a free kill.', [
    effect('body.strike', { damage: '5d8', savePenalty: -2 }, 'Deal 5d8 and penalize one save.')
  ], { damageConfig: damage('5d8'), durationConfig: nextStart }),
  record(10, 'chimeric_form', 'Chimeric Form', 3, selfTarget, ['buff'], {
    op: 'body.adopt', args: { activeTraitMax: 2, transitionMax: 3, hybrid: true, preparedOnly: true, automatic: false }
  }, 'Adopt one prepared hybrid anatomy that combines traits already present in your prepared loadouts. It still occupies two slots and adds one transition; no new trait is invented.', [
    effect('body.adopt', { hybrid: true, preparedOnly: true }, 'Adopt a prepared hybrid two-slot anatomy.')
  ]),
  record(10, 'crown_of_horns', 'Crown of Horns', 3, area(15), ['control'], {
    op: 'body.field', args: { radiusFeet: 15, difficultTerrain: true, savePenalty: -2, requiresSlot: 'offense', duration: 'start-next-caster-turn' }
  }, 'A visible crown of horns makes a 15-ft radius difficult terrain and imposes -2 on one save for enemies inside until your next turn. No damage.', [
    effect('body.field', { radiusFeet: 15, difficultTerrain: true, savePenalty: -2 }, 'Create a visible control field.')
  ], { durationConfig: nextStart, area: { shape: 'sphere', radius: 15, visible: true } }),
  record(10, 'return_to_self', 'Return to Self', 2, selfTarget, ['heal', 'utility'], {
    op: 'body.recover', args: { suspendAll: true, healing: '3d8', resetTransitions: 1, requiresSlot: null }
  }, 'Return to the default body: suspend every active trait until your next turn, restore 3d8 HP once and reduce unrecovered transitions by one. No extra form or free transition is created.', [
    effect('body.recover', { suspendAll: true, healing: '3d8', resetTransitions: 1 }, 'Return to the default body and heal 3d8.')
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

export const DRUID_TALENT_ACTIVES = [
  signature('pursuit_morph', 'Pursuit Morph', 'predator', 2, enemy(), {
    op: 'body.pursuit', args: { transition: 1, requiresDifferentPriorLoadout: true, transitionMax: 3, damage: '1d8+2', automatic: false }
  }, 'Adopt the prepared Predator loadout and immediately strike once with the new natural weapon for 1d8+2 slicing. The transition and strike are one paid operation; no free second form.', [
    effect('body.pursuit', { transition: 1, damage: '1d8+2' }, 'Adopt Predator and strike once.')
  ], { effectTypes: ['damage'], damageConfig: damage('1d8+2') }),
  signature('living_brace', 'Living Brace', 'adaptive-bastion', 1, selfTarget, {
    op: 'body.brace', args: { prevent: 4, replacesPlating: 2, uses: 1, movementFeet: 0, requiresSlot: 'defense', automatic: false }
  }, 'With Bastion plating active, hold still and prevent 4 assigned damage from one eligible event instead of the ordinary 2. The plate window is spent and the brace ends.', [
    effect('body.brace', { prevent: 4, replacesPlating: 2, movementFeet: 0 }, 'Prevent 4 from one impact instead of 2.')
  ], { effectTypes: ['buff'], durationConfig: nextStart }),
  signature('borrowed_outline', 'Borrowed Outline', 'mimic', 1, selfTarget, {
    op: 'body.mimic', args: {
      studiedMinutes: 10, sizeDeltaPercent: 10, durationMinutes: 1,
      requiresSlots: ['locomotion', 'senses'], copiesEquipment: false, copiesMemories: false, automatic: false
    }
  }, 'While both Mimic slots are active, reshape face, skin and gait into one studied same-size outline for one minute. You copy no equipment, memories, ancestry, spells or authority.', [
    effect('body.mimic', { durationMinutes: 1, sizeDeltaPercent: 10 }, 'Hold one studied outline for one minute.')
  ], { effectTypes: ['utility'], durationConfig: { durationType: 'minutes', durationValue: 1, durationUnit: 'minutes' } }),
  capstone('apex_of_the_hunt', 'Apex of the Hunt', 'predator', 3, enemy(), {
    op: 'body.apex', args: { transition: 1, damage: '2d8', strikes: 1, oncePerLongRest: true, automaticKill: false }
  }, 'Adopt the prepared Predator loadout and make one perfected strike for 2d8 slicing. It still adds one transition. Once per completed long rest; never an automatic kill.', [
    effect('body.apex', { damage: '2d8', transition: 1 }, 'Adopt Predator and deal 2d8 once.')
  ], { effectTypes: ['damage'], damageConfig: damage('2d8') }),
  capstone('unbroken_bastion', 'Unbroken Bastion', 'adaptive-bastion', 3, selfTarget, {
    op: 'body.unbroken', args: { prevent: 8, uses: 1, requiresSlot: 'defense', movementFeet: 0, oncePerLongRest: true }
  }, 'Become a fixed bastion: prevent 8 from one eligible damage event and remain unable to move until your next turn. Once per completed long rest; no immunity.', [
    effect('body.unbroken', { prevent: 8, movementFeet: 0 }, 'Prevent 8 once while rooted.')
  ], { effectTypes: ['buff'], durationConfig: nextStart }),
  capstone('perfect_outline', 'Perfect Outline', 'mimic', 3, selfTarget, {
    op: 'body.mimic', args: {
      studiedMinutes: 10, sizeDeltaPercent: 10, durationMinutes: 10,
      requiresSlots: ['locomotion', 'senses'], copiesEquipment: false, copiesMemories: false, oncePerLongRest: true
    }
  }, 'Hold one studied same-size outline for ten minutes without a flaw the table can detect by ordinary inspection. It copies no equipment, memories, ancestry, spells or authority. Once per completed long rest.', [
    effect('body.mimic', { durationMinutes: 10, perfect: true }, 'Hold a flawless studied outline for ten minutes.')
  ], { effectTypes: ['utility'], durationConfig: { durationType: 'minutes', durationValue: 10, durationUnit: 'minutes' } })
];

export const DRUID_OPTIONAL_RECORDS = optional;
export const DRUID_AUTHORED_RECORDS = [
  ...DRUID_CORE_RECORDS, ...DRUID_OPTIONAL_RECORDS,
  ...DRUID_TALENT_ACTIVES, ...DRUID_PASSIVE_RECORDS
];

const nodeForRecord = recordEntry => DRUID_TALENT_NODES.find(node =>
  node.grantId === recordEntry.id || node.passiveSpellId === recordEntry.id
);

export function describeDruidPrice(recordEntry) {
  const args = recordEntry.classResourceProgram?.args || {};
  const transition = args.transition ? '; add 1 unrecovered transition' : '';
  const suspension = args.requiresSuspension || args.suspendAll ? '; suspend one or more active traits' : '';
  return `${recordEntry.resourceCost.actionPoints} AP; 0 mana${transition}${suspension}; manual resolution.`;
}

export const DRUID_PROJECTED_SPELLS = DRUID_AUTHORED_RECORDS.map(recordEntry => {
  const node = nodeForRecord(recordEntry);
  return {
    ...flags, id: recordEntry.id, name: recordEntry.name, class: 'Druid', level: recordEntry.level,
    source: `druid-${recordEntry.source}`, sourceRecordSource: recordEntry.source,
    spellType: recordEntry.spellType, icon: DRUID_ICON, description: recordEntry.description,
    specialization: node?.treeId || recordEntry.treeId || 'core', treeId: node?.treeId || recordEntry.treeId || null,
    typeConfig: {
      school: 'primal', castTimeType: recordEntry.spellType === 'PASSIVE' ? 'PASSIVE' : 'IMMEDIATE',
      tags: ['druid', 'manual-only', recordEntry.source]
    },
    resourceCost: apCost(recordEntry.resourceCost.actionPoints),
    targetingConfig: recordEntry.targetingConfig, effectTypes: recordEntry.effectTypes,
    resolution: recordEntry.damageConfig ? 'DICE' : 'MANUAL', damageConfig: recordEntry.damageConfig,
    durationConfig: recordEntry.durationConfig, cooldownConfig: recordEntry.cooldownConfig,
    reactionTiming: null, savingThrow: null, conditions: recordEntry.conditions, area: recordEntry.area,
    manualRequirements: [DRUID_MANUAL_NOTICE, describeDruidPrice(recordEntry), ...Object.values(DRUID_COMMON_MECHANICS)],
    tags: ['druid', 'manual-only', recordEntry.source], categoryIds: [],
    specialMechanics: {
      druid: {
        ...flags, sourceRecordId: recordEntry.id, priceSummary: describeDruidPrice(recordEntry),
        authoredSpell: recordEntry, commonRules: DRUID_COMMON_MECHANICS,
        rankValues: recordEntry.rankValues || null, requires: recordEntry.requires || null
      }
    }
  };
});

export const DRUID_PROJECTED_SPELLS_BY_ID = Object.fromEntries(
  DRUID_PROJECTED_SPELLS.map(spell => [spell.id, spell])
);

export const DRUID_SPELL_POOLS = Object.fromEntries(
  Array.from({ length: 10 }, (_, index) => {
    const level = index + 1;
    return [level, DRUID_OPTIONAL_RECORDS.filter(spell => spell.level === level).map(spell => spell.id)];
  })
);

export const DRUID_PROGRESSION_POLICY = {
  classId: DRUID_CLASS_ID, rulesetVersion: DRUID_RULESET_VERSION,
  levelCap: 10, startingSpellPicks: 1, optionalPicksPerLevel: 1,
  allowEarlierUnchosen: true, grantedCoreSpellIds: DRUID_CORE_RECORDS.map(spell => spell.id),
  randomizeStartingSpells: false, autoTopUpOnLoad: false, talentActivesAreGrants: true,
  manualOnly: true
};

const druidNodeById = Object.fromEntries(DRUID_TALENT_NODES.map(node => [node.id, node]));
const druidTreePoints = (ranks, treeId) => DRUID_TALENT_NODES
  .filter(node => node.treeId === treeId)
  .reduce((total, node) => total + (ranks[node.id] || 0), 0);

export const pruneDruidTalents = (talents, characterLevel) => {
  const ranks = talents && typeof talents === 'object' ? { ...talents } : {};
  const level = Number.isInteger(characterLevel) ? Math.max(1, characterLevel) : 10;
  Object.keys(ranks).forEach(nodeId => {
    const node = druidNodeById[nodeId];
    if (!node || !Number.isInteger(ranks[nodeId]) || ranks[nodeId] < 1 || ranks[nodeId] > node.maxRanks) {
      delete ranks[nodeId];
    }
  });
  const pruneStructure = () => {
    let changed = true;
    while (changed) {
      changed = false;
      for (const node of DRUID_TALENT_NODES) {
        const rank = ranks[node.id];
        if (!rank) continue;
        const gatePoints = druidTreePoints(ranks, node.treeId) - rank;
        const predecessorMissing = node.requires.some(predecessorId => {
          const predecessor = druidNodeById[predecessorId];
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
    DRUID_TALENT_NODES.forEach(node => {
      if (!ranks[node.id]) return;
      if (target === null || node.minLevel >= druidNodeById[target].minLevel) target = node.id;
    });
    if (target === null) break;
    ranks[target] -= 1;
    if (ranks[target] === 0) delete ranks[target];
    pruneStructure();
  }
  return ranks;
};

const DRUID_LOADOUTS = ['predator', 'bastion', 'mimic'];
const DRUID_SLOTS = ['locomotion', 'offense', 'defense', 'senses'];
const isText = value => typeof value === 'string' && value.trim().length > 0;
const integerBetween = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;

export function validateDruidState(state) {
  const errors = [];
  if (!state || typeof state !== 'object') return { valid: false, errors: ['state must be an object'] };
  if (state.activeLoadout !== null && state.activeLoadout !== undefined && !DRUID_LOADOUTS.includes(state.activeLoadout)) {
    errors.push('activeLoadout must be null, predator, bastion or mimic');
  }
  const traits = Array.isArray(state.activeTraits) ? state.activeTraits : [];
  if (!Array.isArray(state.activeTraits)) errors.push('activeTraits must be an array');
  if (traits.length > 2) errors.push('at most two active traits');
  const slots = new Set();
  const traitIds = new Set();
  traits.forEach((trait, index) => {
    if (!trait || typeof trait !== 'object') { errors.push(`active trait ${index} must be an object`); return; }
    if (!isText(trait.id)) errors.push(`active trait ${index} requires an id`);
    else if (traitIds.has(trait.id)) errors.push(`duplicate active trait id ${trait.id}`);
    else traitIds.add(trait.id);
    if (!DRUID_SLOTS.includes(trait.slot)) errors.push(`active trait ${trait.id ?? index} has an invalid slot`);
    else if (slots.has(trait.slot)) errors.push(`duplicate active slot ${trait.slot}`);
    else slots.add(trait.slot);
  });
  if (!integerBetween(state.unrecoveredTransitions, 0, 3)) errors.push('unrecoveredTransitions must be an integer from 0 to 3');
  if (state.preparedLoadouts !== undefined) {
    if (!Array.isArray(state.preparedLoadouts)) errors.push('preparedLoadouts must be an array');
    else if (state.preparedLoadouts.length > 3) errors.push('at most three prepared loadouts');
    else state.preparedLoadouts.forEach(loadout => {
      if (!DRUID_LOADOUTS.includes(loadout)) errors.push(`unknown prepared loadout ${loadout}`);
    });
  }
  if (state.suspendedTraits !== undefined) {
    if (!Array.isArray(state.suspendedTraits)) errors.push('suspendedTraits must be an array');
    else state.suspendedTraits.forEach(traitId => {
      if (!traitIds.has(traitId)) errors.push(`suspended trait ${traitId} is not an active trait`);
    });
  }
  if (state.plateWindowUsed !== undefined && typeof state.plateWindowUsed !== 'boolean') {
    errors.push('plateWindowUsed must be a boolean');
  }
  if (state.brace !== null && state.brace !== undefined) {
    if (typeof state.brace !== 'object') errors.push('brace must be null or an object');
    else if (state.brace.active && state.activeLoadout !== 'bastion') errors.push('an active brace requires the bastion loadout');
    else if (state.brace.active && !traits.some(trait => trait.slot === 'defense')) errors.push('an active brace requires an active defense trait');
  }
  if (state.mimicPattern !== null && state.mimicPattern !== undefined) {
    if (typeof state.mimicPattern !== 'object') errors.push('mimicPattern must be null or an object');
    else {
      if (!isText(state.mimicPattern.label)) errors.push('mimicPattern requires a label');
      if (!integerBetween(state.mimicPattern.studiedMinutes, 10, 1440)) errors.push('mimicPattern studiedMinutes must be at least 10');
      if (!integerBetween(state.mimicPattern.sizeDeltaPercent, 0, 10)) errors.push('mimicPattern sizeDeltaPercent must be 0..10');
    }
  }
  return { valid: errors.length === 0, errors };
}

export function projectDruidResource(resource, isOwner = false) {
  const state = resource?.state ?? null;
  if (!state) {
    return { initialized: false, valid: true, errors: [], activeLoadout: null, activeCount: 0, transitions: 0, transitionMax: 3, preparedLoadouts: [], suspendedTraits: [], brace: null, mimicPattern: null };
  }
  const check = validateDruidState(state);
  const traits = Array.isArray(state.activeTraits) ? state.activeTraits : [];
  return {
    initialized: true, valid: check.valid, errors: check.errors,
    activeLoadout: state.activeLoadout || null,
    activeCount: traits.length, activeTraits: traits.map(trait => ({ id: trait.id || null, slot: trait.slot || 'unknown' })),
    transitions: integerBetween(state.unrecoveredTransitions, 0, 3) ? state.unrecoveredTransitions : 0,
    transitionMax: 3,
    preparedLoadouts: Array.isArray(state.preparedLoadouts) ? [...state.preparedLoadouts] : [],
    suspendedTraits: Array.isArray(state.suspendedTraits) ? [...state.suspendedTraits] : [],
    plateWindowUsed: state.plateWindowUsed === true,
    brace: state.brace && typeof state.brace === 'object'
      ? { active: state.brace.active === true, prevention: Number.isInteger(state.brace.prevention) ? state.brace.prevention : 0 }
      : null,
    mimicPattern: state.mimicPattern && isOwner ? { ...state.mimicPattern } : state.mimicPattern ? { label: state.mimicPattern.label || 'Studied outline' } : null
  };
}

export const DRUID_RESOURCE_RULES = {
  activeTraitMax: 2, slotIds: DRUID_SLOTS, preparedLoadoutMax: 3, loadouts: DRUID_LOADOUTS,
  transitionMin: 0, transitionMax: 3, platePrevention: 2, bracePrevention: 4,
  mimicStudiedMinutes: 10, mimicSizePercent: 10, mimicMinutes: 1,
  refreshOnLongRest: true, refreshOnReconnect: false, refreshOnInitiative: false,
  automaticTransformation: false, automaticRecovery: false, automaticPrevention: false, manualOnly: true
};

export const DRUID_RESOURCE_SYSTEM = {
  id: 'druid-body', name: 'Anatomical Loadout', shortName: 'Body', type: 'druid-body',
  title: 'Anatomical Loadout', subtitle: 'Two occupied slots, three prepared bodies and the cost of changing.',
  base: 0, max: 2, transitionMax: 3, preparedLoadoutMax: 3, manualOnly: true,
  description: 'Prepare three two-slot loadouts at a completed long rest. At most two anatomical slots are active at once. Adopting costs 1 AP and adds one unrecovered transition; at three transitions it is refused until you recover by suspending a real trait. Plating prevents 2 per own-turn window; Living Brace prevents 4 once.',
  cards: [
    { title: 'Slots (0-2)', stats: 'Four possible, two active', details: 'Locomotion, offense, defense and senses. Never two traits in the same slot. A suspended trait grants nothing.' },
    { title: 'Transitions (0-3)', stats: 'The cost of changing', details: 'Each adoption adds one transition. At three, adoption is refused until recovery. Reconnect or rest cannot erase recorded transitions except a completed long rest.' },
    { title: 'Prepared Bodies', stats: 'Three loadouts', details: 'Predator (locomotion/offense), Bastion (defense/senses) and Mimic (locomotion/senses). Preparation does not grant optional spells.' }
  ],
  generationTable: {
    headers: ['Outcome', 'Transition', 'Record treatment'],
    rows: [
      ['Adopt a prepared loadout', '+1', 'Replace the active two slots; record the new traits'],
      ['Recover the Self', '-1', 'Suspend one active trait until your next own turn'],
      ['Rejected adoption at three transitions', '+0', 'Leave the prior anatomy unchanged; no AP or trait is lost'],
      ['Completed long rest', 'reset to 0', 'Return to the default body and clear suspensions']
    ]
  },
  usage: {
    momentum: 'Prepare a body that can reach the objective, then spend transitions deliberately instead of stacking every advantage.',
    flourish: 'Brace one real impact with Bastion or hold a studied outline with Mimic, but name the trait you gave up and the slot that is now empty.'
  },
  mechanics: {
    title: 'Manual Anatomy Ledger',
    content: 'Four slots, two active traits, three prepared loadouts and a 0-3 transition track. Each change names the old anatomy, the new anatomy and the real trait lost.',
    sections: [
      { label: 'Slots', mechanics: [{ text: 'At most two active traits; one trait per slot.' }, { text: 'A suspended trait grants no benefit and cannot satisfy a prerequisite.' }] },
      { label: 'Transitions', mechanics: [{ text: 'Adopt +1; Recover -1; max 3.' }, { text: 'At three, adoption is refused until recovery. A long rest resets the track.' }] }
    ]
  },
  overheatRules: {
    title: 'Anatomy Overflow',
    content: 'A third active trait or a second trait in the same slot is rejected without changing the existing body. At three unrecovered transitions, adoption is refused; the prior anatomy, AP and traits remain unchanged. A completed long rest returns the default body and clears suspensions, but never invents a new prepared loadout.'
  },
  playingInPerson: {
    title: 'The Body Ledger',
    subtitle: 'Four slots, two chips and a three-stitch track',
    content: 'Place four slot cards on the table and at most two trait chips on them. Keep a three-stitch transition track. Each adoption moves one stitch; each recovery removes one and turns one trait chip face down until your next turn. Reset the stitches only after a completed long rest.'
  },
  nativeNote: 'No native heritage edge is registered. Morgh, Amordjin, Arch Mimir and Broken Mimir are recommendations only.'
};

export const DRUID_DATA = {
  ...flags, id: DRUID_CLASS_ID, name: 'Druid', variantName: 'Druid',
  icon: DRUID_ICON, imageIcon: '/assets/icons/classes/shaper.png',
  role: 'Adaptive Hybrid / Explorer', damageTypes: ['slicing', 'stabbing', 'smashing', 'primal'],
  resource: 'Anatomical Loadout', primaryStat: 'Constitution', secondaryStat: 'Agility',
  developmentStatus: 'development', statusLabel: 'Development - manual tabletop',
  heritageEffectsImplemented: false, nativeAccess: [],
  heritageRecommendation: ['morgh_groven', 'ithran_groven', 'veiled_mimir', 'tethered_mimir'],
  classResource: {
    type: 'druid-body', base: 0, max: 2, transitionMax: 3, preparedLoadoutMax: 3,
    initialized: false, state: null,
    generationNote: 'Uninitialized until the table records a prepared loadout and its first anatomical change.'
  },
  restrictions: {
    allowedSubraces: [], hardBlocks: [], narrativeUnlock: true,
    acquisition: {
      status: 'proposed',
      records: [
        { id: 'shaping_interface', label: 'Shaping interface', text: 'A real compatible plastic, mineral or co-sculpting interface that supports deliberate anatomical change.' },
        { id: 'transformation_training', label: 'Transformation training', text: 'Supervised preparation of at least three two-slot loadouts and a recorded recovery practice.' },
        { id: 'self_reference_training', label: 'Self-reference training', text: 'A maintained way to recognize the default body and return to it without losing the character.' },
        { id: 'trait_accounting', label: 'Trait accounting', text: 'Track slots, transitions, suspensions and the exact trait given up through one full session.' }
      ]
    },
    justification: 'Druid is a development transformation class. It preserves legacy Shaper records, imports no conventional Druid worship or companion package and grants no native heritage edge.'
  },
  equipment: { weapons: ['natural', 'staff', 'claw'], protectiveGear: ['hide', 'chitin', 'robes'], offHand: ['empty', 'claw'] },
  subraceVariants: {},
  overview: {
    title: 'The Druid', subtitle: 'Your body is the equipment. Choose what it cannot do.',
    description: 'A Druid prepares three bodies, occupies at most two anatomical slots and pays for every change with a transition. Plating, bracing and mimicry are real anatomy, not borrowed creature abilities.',
    quickOverview: {
      title: 'Class Overview',
      content: 'Four slots, two active, three prepared loadouts and a 0-3 transition track. Adopt Loadout and Recover the Self are core. Four optional records at every level and one signature and capstone per tree. Manual tabletop only.'
    },
    combatRole: 'Adaptive melee, defense and infiltration through mutually exclusive anatomy, with bounded plating and a real recovery cost.',
    playstyle: {
      title: 'Turn 1',
      content: 'Name the prepared loadout, the two occupied slots and the one real trait you give up. Add one transition, then use only the capabilities that anatomy actually provides.'
    },
    roleplayIdentity: {
      title: 'A chosen body, not a stolen life',
      content: 'Druid is the approved player-facing name for the transformation class. It does not inherit conventional Druid worship, pets or heritage. The body changes; the character remains in control.'
    },
    currentCrisis: 'Development class; no native heritage access is registered. The Form-Convergence, Torin reclamation and living Veyra traditions are recommendations pending approval.'
  },
  characterCreation: {
    title: 'Druid',
    description: 'Choose one level-1 optional; Adopt Loadout and Recover the Self are core grants. Record acquisition requirements. Anatomy stays uninitialized until the table records a prepared body and its first change.'
  },
  specializations: {
    title: 'Three Anatomical Disciplines',
    description: 'First investment chooses a primary tree. Five talent points per level, global cap fifty. Signatures require ten same-tree points at level three; capstones forty-five at level ten.',
    specs: DRUID_TREE_META.map(meta => ({
      id: meta.id, name: meta.name, icon: DRUID_ICON, theme: meta.tagline,
      description: meta.tagline, playstyle: meta.tagline
    }))
  },
  spells: DRUID_PROJECTED_SPELLS, spellPools: DRUID_SPELL_POOLS,
  progression: {
    levelCap: 10, policy: DRUID_PROGRESSION_POLICY,
    levels: Array.from({ length: 10 }, (_, index) => ({
      level: index + 1, newChoiceIds: DRUID_SPELL_POOLS[index + 1],
      optionalPicks: 1, talentBudget: (index + 1) * 5
    }))
  },
  talentTrees: DRUID_TALENT_CAPACITY,
  resourceSystem: { ...DRUID_RESOURCE_SYSTEM }
};

export const DRUID_MANIFEST = {
  ...flags, contentLock: 'RI-4 Druid complete content lock',
  optional: DRUID_OPTIONAL_RECORDS.map(recordEntry => recordEntry.id),
  core: DRUID_CORE_RECORDS.map(recordEntry => recordEntry.id),
  talentActives: DRUID_TALENT_ACTIVES.map(recordEntry => recordEntry.id),
  passives: DRUID_PASSIVE_RECORDS.map(recordEntry => recordEntry.id),
  records: DRUID_AUTHORED_RECORDS.map(recordEntry => ({
    id: recordEntry.id, name: recordEntry.name, level: recordEntry.level, source: recordEntry.source,
    treeId: nodeForRecord(recordEntry)?.treeId || null,
    ap: recordEntry.resourceCost.actionPoints, mana: 0
  })),
  nodes: DRUID_TALENT_NODES.map(node => ({
    id: node.id, treeId: node.treeId, spellId: node.grantId || node.passiveSpellId,
    ranks: node.maxRanks, minimumLevel: node.minLevel, requiresPoints: node.requiresPoints,
    prerequisites: node.requires
  })),
  uniqueRecords: 96, activeRecords: 48, passiveRecords: 48,
  talentNodes: 54, talentCapacity: DRUID_TALENT_CAPACITY,
  nativeAccess: [], acquisitionRequirements: DRUID_DATA.restrictions.acquisition.records.map(recordEntry => recordEntry.id),
  heritageEffectsImplemented: false, resourceRules: DRUID_RESOURCE_RULES,
  trees: DRUID_TREES.map(tree => tree.id),
  dependencies: ['CR-R1', 'RI-4 content lock', 'manual-tabletop'],
  automaticConversion: false
};

export default DRUID_DATA;
