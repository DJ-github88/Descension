import {
  DOOMSAYER_TREE_META, DOOMSAYER_TREES, DOOMSAYER_TALENT_NODES,
  DOOMSAYER_PASSIVE_RECORDS, DOOMSAYER_TALENT_CAPACITY
} from '../talentTrees/doomsayer';

export const DOOMSAYER_CLASS_ID = 'doomsayer';
export const DOOMSAYER_RULESET_VERSION = 'cr-review-r1';
export const DOOMSAYER_ICON = 'Psychic/Psychic Telepathy';
export const DOOMSAYER_MANUAL_NOTICE = 'Manual tabletop only. No automatic calamity creation, clock advance, resolution, Havoc gain or spend, damage, ward, movement or expiry.';

const flags = {
  classId: DOOMSAYER_CLASS_ID, rulesetVersion: DOOMSAYER_RULESET_VERSION,
  authoredOnly: true, manualOnly: true, executionEnabled: false,
  applicationMode: 'manual-tabletop', automatedCapabilities: [],
  manualNotice: DOOMSAYER_MANUAL_NOTICE
};
const id = suffix => `cr1_doomsayer_${suffix}`;
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
  somaticText: 'Name the ending aloud and mark its public terms before resolution.'
});
const damage = (formula, damageTypes = ['wyrd']) => ({ formula, damageTypes, resolution: 'DICE' });
const cooldownNone = { cooldownType: 'turn_based', cooldownValue: 0 };
const cooldownLongRest = { cooldownType: 'long_rest', cooldownValue: 1 };

const effect = (kind, args, description) => ({ kind, args, description, executable: false });

const record = (level, suffix, name, ap, targetingConfig, effectTypes, program, description, effects = [], options = {}) => ({
  ...flags, id: id(suffix), name, level, specialization: options.specialization || null,
  treeId: options.treeId || null, source: options.source || 'optional', spellType: 'ACTION',
  icon: DOOMSAYER_ICON, resourceCost: apCost(ap), targetingConfig, effectTypes,
  damageConfig: options.damageConfig || null,
  durationConfig: options.durationConfig || instant,
  cooldownConfig: options.cooldownConfig || cooldownNone,
  reactionTiming: null, savingThrow: null, conditions: options.conditions || [], area: options.area || null,
  description,
  classResourceProgram: program ? { version: 1, domain: 'doom-calamities', ...program } : null,
  manualMechanics: {
    price: {
      actionPoints: ap, mana: 0,
      havoc: program?.args?.havocCost || 0,
      calamitySlots: program?.op === 'doom.plant' || program?.op === 'doom.plant-area' ? 1 : 0
    },
    effects: effects.length ? effects : [effect(program?.op || 'doom.none', program?.args || {}, description)],
    executable: false
  },
  sourceRefs: ['RI-5 Doomsayer content lock']
});

export const DOOMSAYER_COMMON_MECHANICS = {
  price: 'AP and mana are explicit. A calamity occupies one of at most two public slots; Havoc is never a second hidden bank.',
  calamities: 'At most two active calamities. Each records an exact subject or visible area, a declared trigger, a clock of one to three own turns, one public effect and one public disruption method.',
  resolution: 'A calamity resolves exactly once by trigger, expiry or dismantle. Trigger resolution grants 3 Havoc; expiry grants 1; dismantle grants 0. Resolved records are closed, not deleted.',
  clock: 'A clock advances only through an authored paid action or an explicitly recorded table event. No timer, initiative tick, reconnect, rest or scene change advances it automatically.',
  havoc: 'Havoc runs 0-15. It persists between encounters and resets to 0 only on a completed long rest. Havoc beyond 15 is lost, never converted into free damage or another resource.',
  information: 'Every declaration is public. Reading a calamity reveals only its published terms; it never reveals hidden plans, unrolled outcomes or private intentions.',
  expiry: 'Expiry is counted in the caster own turns. No long rest, reconnect, initiative, class change or scene change refreshes, extends or resolves a calamity.',
  native: 'Doomsayer has no registered native heritage edge. Skald, Anhur and Tessic are recommendations only; acquisition must be recorded.'
};

export const DOOMSAYER_CORE_RECORDS = [
  record(1, 'plant_calamity', 'Plant the Calamity', 1, enemy(), ['control'], {
    op: 'doom.plant', args: {
      slotsMax: 2, clockTurnsMin: 1, clockTurnsMax: 3,
      triggerKinds: ['target-attacks', 'target-moves', 'target-casts', 'area-entered', 'end-of-target-next-turn'],
      publicDeclaration: true, disruption: 'declared-visible-method', automatic: false
    }
  }, 'Declare one public calamity on a visible enemy or area within 30 ft. Record its exact trigger, a one-to-three own-turn clock, its published effect and its visible disruption method. It occupies one of two slots.', [
    effect('doom.plant', {
      slotsMax: 2, clockTurnsMin: 1, clockTurnsMax: 3, publicDeclaration: true,
      disruption: 'declared-visible-method', automatic: false
    }, 'Create one public calamity record in an empty slot.')
  ], { source: 'core' }),
  record(1, 'dismantle_calamity', 'Dismantle the Sign', 1, selfTarget, ['utility'], {
    op: 'doom.dismantle', args: {
      target: 'one-own-visible-calamity', rangeFeet: 60, freesSlot: true,
      havocGain: 0, reversesResolution: false, automatic: false
    }
  }, 'Dismantle one of your visible active calamities within 60 ft. The slot frees only after the table records the dismantle. No Havoc is gained and no resolved effect is reversed.', [
    effect('doom.dismantle', {
      target: 'one-own-visible-calamity', rangeFeet: 60, freesSlot: true,
      havocGain: 0, reversesResolution: false
    }, 'Close one active calamity without a resolution.')
  ], { source: 'core' })
];

const optional = [
  record(1, 'doom_bolt', 'Doom Bolt', 1, enemy(), ['damage'], null,
    'One enemy within 30 ft takes 1d6 wyrd. If it already carries your active calamity, add 1 to the damage once.', [
      effect('doom.strike', { rangeFeet: 30, damage: '1d6', bonusIfDoomed: 1 }, 'Deal 1d6 wyrd, +1 if the target is already doomed.')
    ], { damageConfig: damage('1d6') }),
  record(1, 'omen_of_ash', 'Omen of Ash', 1, enemy(), ['damage', 'control'], {
    op: 'doom.mark', args: { rangeFeet: 30, damage: '1d4', savePenalty: -1, expires: 'end-target-next-turn' }
  }, 'One enemy within 30 ft takes 1d4 blight and has -1 to its next save before the end of its next turn. One damage event and one save penalty.', [
    effect('doom.mark', { rangeFeet: 30, damage: '1d4', savePenalty: -1 }, 'Deal 1d4 blight and penalize the next save.')
  ], { damageConfig: damage('1d4', ['blight']), durationConfig: nextStart }),
  record(1, 'forewarned_step', 'Forewarned Step', 1, ally(), ['utility'], {
    op: 'doom.warn', args: { rangeFeet: 30, moveFeet: 10, against: 'named-active-calamity', expires: 'end-next-caster-turn' }
  }, 'One willing ally within 30 ft may move 10 ft using remaining movement when a named active calamity would reach it. Ordinary movement and reactions apply; no teleport or extra action.', [
    effect('doom.warn', { rangeFeet: 30, moveFeet: 10, against: 'named-active-calamity' }, 'Move 10 ft away from one named calamity.')
  ], { durationConfig: nextStart }),
  record(1, 'read_the_ledger', 'Read the Ledger', 1, selfTarget, ['utility'], {
    op: 'doom.read', args: {
      rangeFeet: 60, reveals: ['active-calamities', 'clocks', 'public-effects'],
      hiddenInformation: false, prediction: false
    }
  }, 'Read the published terms of every visible calamity within 60 ft: subject, clock, effect and disruption method. No hidden plans, private intentions or unrolled outcomes are revealed.', [
    effect('doom.read', { rangeFeet: 60, reveals: ['active-calamities', 'clocks', 'public-effects'] }, 'Read public calamity terms.')
  ]),

  record(2, 'doom_countdown', 'Doom Countdown', 2, enemy(), ['damage', 'control'], {
    op: 'doom.plant', args: {
      clockTurns: 2, trigger: 'end-of-target-next-turn', damage: '1d6',
      publicDeclaration: true, disruption: 'dismantle-or-leave-area', slotsMax: 2
    }
  }, 'Declare a two-own-turn calamity on one enemy within 30 ft. At the end of its next turn, or when the recorded trigger occurs, it takes 1d6 wyrd and the calamity closes. The record is public and occupies one slot.', [
    effect('doom.plant', { clockTurns: 2, trigger: 'end-of-target-next-turn', damage: '1d6' }, 'Declare a two-turn public countdown.')
  ], { damageConfig: damage('1d6') }),
  record(2, 'calamity_zone', 'Calamity Zone', 2, area(15), ['control'], {
    op: 'doom.plant-area', args: {
      radiusFeet: 15, clockTurns: 2, trigger: 'first-enemy-entry', damage: '1d4',
      difficultTerrain: true, publicDeclaration: true, disruption: 'visible-boundary', slotsMax: 2
    }
  }, 'Declare a visible 15-ft-radius zone within 30 ft. The first enemy to enter takes 1d4 blight and the calamity closes; the zone is difficult terrain while active. The boundary and trigger are public.', [
    effect('doom.plant-area', { radiusFeet: 15, trigger: 'first-enemy-entry', damage: '1d4', difficultTerrain: true }, 'Declare a visible entry-triggered zone.')
  ], { damageConfig: damage('1d4', ['blight']), area: { shape: 'sphere', radius: 15, visible: true } }),
  record(2, 'death_mark', 'Death Mark', 1, enemy(), ['control'], {
    op: 'doom.mark', args: { rangeFeet: 30, savePenalty: -2, expires: 'end-target-next-turn' }
  }, 'One enemy within 30 ft has -2 to its next save before the end of its next turn. No damage by itself and no hidden mark.', [
    effect('doom.mark', { rangeFeet: 30, savePenalty: -2 }, 'Penalize one next save.')
  ], { durationConfig: nextStart }),
  record(2, 'prophets_warning', "Prophet's Warning", 1, ally(), ['buff'], {
    op: 'doom.ward', args: { rangeFeet: 30, capacity: 4, uses: 1, against: 'named-active-calamity', expires: 'end-next-caster-turn' }
  }, 'One ally within 30 ft gains a 4-point one-use ward against one named active calamity. Apply after normal mitigation; it does not heal or stack with itself.', [
    effect('doom.ward', { capacity: 4, uses: 1, against: 'named-active-calamity' }, 'Capacity-4 one-use calamity ward.')
  ], { durationConfig: nextStart }),

  record(3, 'havoc_blast', 'Havoc Blast', 2, enemy(), ['damage'], {
    op: 'doom.spend', args: { rangeFeet: 30, havocCost: 3, damage: '2d6' }
  }, 'Spend 3 Havoc and hurl the stored ending at one enemy within 30 ft for 2d6 wyrd. One damage event; no splash.', [
    effect('doom.spend', { rangeFeet: 30, havocCost: 3, damage: '2d6' }, 'Spend 3 Havoc for 2d6 wyrd.')
  ], { damageConfig: damage('2d6') }),
  record(3, 'escalating_doom', 'Escalating Doom', 2, enemy(), ['damage'], {
    op: 'doom.plant', args: {
      clockTurns: 3, trigger: 'end-of-target-next-turn', damage: '1d4',
      escalation: '+1d4 per advanced clock', publicDeclaration: true, slotsMax: 2
    }
  }, 'Declare a three-own-turn calamity on one enemy within 30 ft. It deals 1d4 wyrd when triggered; each paid clock advance adds 1d4 once. The clock never exceeds three and the record occupies one slot.', [
    effect('doom.plant', { clockTurns: 3, trigger: 'end-of-target-next-turn', damage: '1d4', escalation: '+1d4 per advanced clock' }, 'Declare an escalating countdown.')
  ], { damageConfig: damage('1d4') }),
  record(3, 'rain_of_doom', 'Rain of Doom', 2, area(20), ['control'], {
    op: 'doom.plant-area', args: {
      radiusFeet: 20, clockTurns: 2, trigger: 'start-of-caster-next-turn',
      difficultTerrain: true, speedPenaltyFeet: 10, publicDeclaration: true
    }
  }, 'Declare a visible 20-ft-radius rain of ash within 30 ft. At the start of your next turn the area becomes difficult terrain and enemies inside lose 10 ft of movement until the end of their next turn; the calamity closes. The area is public and occupies one slot.', [
    effect('doom.plant-area', { radiusFeet: 20, trigger: 'start-of-caster-next-turn', difficultTerrain: true, speedPenaltyFeet: 10 }, 'Declare a public area control countdown.')
  ], { area: { shape: 'sphere', radius: 20, visible: true } }),
  record(3, 'requiem_of_silence', 'Requiem of Silence', 2, enemy(), ['control'], {
    op: 'doom.silence', args: { rangeFeet: 30, durationRounds: 1, blocksSpeech: true, blocksSpellcasting: false }
  }, 'One enemy within 30 ft cannot speak or make itself heard until the end of its next turn. It can still cast spells that do not require speech; no generic silence field is created.', [
    effect('doom.silence', { rangeFeet: 30, durationRounds: 1, blocksSpeech: true }, 'Suppress speech for one round.')
  ], { durationConfig: nextStart }),

  record(4, 'requiem_of_death', 'Requiem of Death', 2, enemy(), ['damage'], {
    op: 'doom.requiem', args: { rangeFeet: 30, damage: '3d6', requireActiveCalamity: true }
  }, 'One enemy within 30 ft that carries your active calamity takes 3d6 wyrd. If it has no such calamity, the action resolves with no effect and no Havoc.', [
    effect('doom.requiem', { rangeFeet: 30, damage: '3d6', requireActiveCalamity: true }, 'Deal 3d6 to a doomed subject.')
  ], { damageConfig: damage('3d6') }),
  record(4, 'doom_aura', 'Doom Aura', 2, selfTarget, ['control'], {
    op: 'doom.aura', args: { radiusFeet: 15, penalty: -1, duration: 'start-next-caster-turn', affects: 'enemies' }
  }, 'Until the start of your next turn, enemies within 15 ft have -1 to one save against your calamities. The aura is visible and does not stack with itself.', [
    effect('doom.aura', { radiusFeet: 15, penalty: -1 }, 'Visible 15-ft save penalty aura.')
  ], { durationConfig: nextStart }),
  record(4, 'cataclysm_blast', 'Cataclysm Blast', 2, area(15), ['damage'], {
    op: 'doom.blast', args: { rangeFeet: 30, radiusFeet: 15, damage: '2d8', oneEventPerTarget: true }
  }, 'A visible 15-ft-radius blast within 30 ft deals 2d8 wyrd to each enemy inside. One damage event per target; no chain or repeat.', [
    effect('doom.blast', { radiusFeet: 15, damage: '2d8' }, 'Deal 2d8 to each enemy in the area.')
  ], { damageConfig: damage('2d8'), area: { shape: 'sphere', radius: 15, visible: true } }),
  record(4, 'disruption_ward', 'Disruption Ward', 1, ally(), ['buff'], {
    op: 'doom.ward', args: { rangeFeet: 30, capacity: 6, uses: 1, against: 'named-active-calamity', expires: 'end-next-caster-turn' }
  }, 'One ally within 30 ft gains a 6-point one-use ward against one named active calamity. Apply after mitigation; no healing and no stacking.', [
    effect('doom.ward', { capacity: 6, uses: 1, against: 'named-active-calamity' }, 'Capacity-6 one-use ward.')
  ], { durationConfig: nextStart }),

  record(5, 'prophecy_of_ruin', 'Prophecy of Ruin', 3, enemy(), ['damage', 'control'], {
    op: 'doom.requiem', args: { rangeFeet: 30, damage: '4d6', requireActiveCalamity: true, savePenalty: -2 }
  }, 'One doomed enemy within 30 ft takes 4d6 wyrd and has -2 to one save before your next turn. If it has no active calamity of yours, the action has no effect.', [
    effect('doom.requiem', { rangeFeet: 30, damage: '4d6', savePenalty: -2 }, 'Deal 4d6 and penalize one save.')
  ], { damageConfig: damage('4d6'), durationConfig: nextStart }),
  record(5, 'stacked_doom', 'Stacked Doom', 3, enemy(), ['damage'], {
    op: 'doom.resolve-stack', args: { rangeFeet: 30, maxCalamities: 2, damagePerCalamity: '2d6', oncePerTarget: true }
  }, 'Resolve up to two of your active calamities on one enemy within 30 ft, each once, for 2d6 wyrd per calamity. The slots free after resolution; no third calamity is created.', [
    effect('doom.resolve-stack', { maxCalamities: 2, damagePerCalamity: '2d6' }, 'Resolve up to two existing calamities.')
  ], { damageConfig: damage('2d6') }),
  record(5, 'doom_nova', 'Doom Nova', 3, area(20), ['control'], {
    op: 'doom.field', args: {
      rangeFeet: 30, radiusFeet: 20, difficultTerrain: true,
      savePenalty: -1, expires: 'end-target-next-turn', oneFieldOnly: true
    }
  }, 'A visible 20-ft-radius nova within 30 ft becomes difficult terrain until the end of your next turn. Enemies inside have -1 to one save. One field; no damage and no stacking.', [
    effect('doom.field', { radiusFeet: 20, difficultTerrain: true, savePenalty: -1 }, 'Create one visible control field.')
  ], { durationConfig: nextStart, area: { shape: 'sphere', radius: 20, visible: true } }),
  record(5, 'foretold_escape', 'Foretold Escape', 1, ally(), ['utility'], {
    op: 'doom.warn', args: { rangeFeet: 30, moveFeet: 20, against: 'named-active-calamity', usesReaction: true }
  }, 'One willing ally within 30 ft may move 20 ft when a named active calamity would reach it, using its reaction. Ordinary movement and opportunity rules apply; no teleport.', [
    effect('doom.warn', { moveFeet: 20, against: 'named-active-calamity', usesReaction: true }, 'Reaction move 20 ft away from a named calamity.')
  ], { durationConfig: nextStart }),

  record(6, 'cascade_doom', 'Cascade Doom', 3, enemy(), ['control'], {
    op: 'doom.cascade', args: {
      rangeFeet: 30, secondaryTargets: 2, savePenalty: -2,
      expires: 'end-target-next-turn', requiresActiveCalamity: true, oncePerResolution: true
    }
  }, 'One doomed enemy within 30 ft and up to two other enemies within 10 ft of it each have -2 to one save before the end of their next turn. Requires one active calamity; no damage and no new calamity.', [
    effect('doom.cascade', { secondaryTargets: 2, savePenalty: -2, requiresActiveCalamity: true }, 'Spread a save penalty from one doom to nearby enemies.')
  ], { durationConfig: nextStart }),
  record(6, 'endbringer_finale', 'Endbringer Finale', 3, enemy(), ['damage'], {
    op: 'doom.requiem', args: { rangeFeet: 30, damage: '4d8', requiresResolvedCalamityThisEncounter: true }
  }, 'One enemy within 30 ft takes 4d8 wyrd if at least one of your calamities has already resolved this encounter. The condition is public and cannot be satisfied by a dismantle.', [
    effect('doom.requiem', { damage: '4d8', requiresResolvedCalamityThisEncounter: true }, 'Deal 4d8 after a real calamity resolution.')
  ], { damageConfig: damage('4d8') }),
  record(6, 'execution_prophecy', 'Execution Prophecy', 3, enemy(), ['damage'], {
    op: 'doom.execute', args: { rangeFeet: 30, thresholdPercent: 25, damage: '5d6', requireActiveCalamity: true }
  }, 'One doomed enemy within 30 ft below 25% health takes 5d6 wyrd. If it is above the threshold, the action has no effect. This is damage, never an automatic kill.', [
    effect('doom.execute', { thresholdPercent: 25, damage: '5d6' }, 'Deal 5d6 below the public threshold.')
  ], { damageConfig: damage('5d6') }),
  record(6, 'omen_shield', 'Omen Shield', 2, ally(), ['buff'], {
    op: 'doom.ward', args: { rangeFeet: 30, capacity: 8, uses: 1, against: 'named-active-calamity', expires: 'end-next-caster-turn' }
  }, 'One ally within 30 ft gains an 8-point one-use ward against one named active calamity. Apply after mitigation; no healing and no stacking.', [
    effect('doom.ward', { capacity: 8, uses: 1, against: 'named-active-calamity' }, 'Capacity-8 one-use ward.')
  ], { durationConfig: nextStart }),

  record(7, 'armageddon_herald', 'Armageddon Herald', 2, selfTarget, ['buff'], {
    op: 'doom.herald', args: { damageBonus: 2, duration: 'start-next-caster-turn', requiresActiveCalamity: true }
  }, 'While you have an active calamity, add 2 to one calamity damage event before the start of your next turn. One use; no extra slot or Havoc.', [
    effect('doom.herald', { damageBonus: 2, requiresActiveCalamity: true }, 'Add 2 to one calamity damage event.')
  ], { durationConfig: nextStart }),
  record(7, 'apocalypse_zone', 'Apocalypse Zone', 3, area(25), ['damage', 'control'], {
    op: 'doom.plant-area', args: {
      radiusFeet: 25, clockTurns: 2, trigger: 'end-of-caster-next-turn', damage: '3d6',
      difficultTerrain: true, publicDeclaration: true, slotsMax: 2
    }
  }, 'Declare a visible 25-ft-radius apocalypse zone within 30 ft. At the end of your next turn each enemy inside takes 3d6 wyrd and the zone closes; it is difficult terrain while active. Occupies one slot.', [
    effect('doom.plant-area', { radiusFeet: 25, trigger: 'end-of-caster-next-turn', damage: '3d6', difficultTerrain: true }, 'Declare a large public area calamity.')
  ], { damageConfig: damage('3d6'), area: { shape: 'sphere', radius: 25, visible: true } }),
  record(7, 'prophecy_of_annihilation', 'Prophecy of Annihilation', 3, enemy(), ['damage'], {
    op: 'doom.requiem', args: { rangeFeet: 30, damage: '5d8', requireActiveCalamity: true, savePenalty: -2 }
  }, 'One doomed enemy within 30 ft takes 5d8 wyrd and has -2 to one save before your next turn. Requires an active calamity; no automatic death.', [
    effect('doom.requiem', { damage: '5d8', savePenalty: -2 }, 'Deal 5d8 to a doomed subject.')
  ], { damageConfig: damage('5d8') }),
  record(7, 'forewarned_retreat', 'Forewarned Retreat', 2, ally(3, 60), ['utility'], {
    op: 'doom.warn', args: { rangeFeet: 60, maxTargets: 3, moveFeet: 15, against: 'named-active-calamity', usesReaction: true }
  }, 'Up to three willing allies within 60 ft may each move 15 ft when a named active calamity would reach them, each using its reaction. Ordinary movement applies; no teleport and no extra action.', [
    effect('doom.warn', { maxTargets: 3, moveFeet: 15, against: 'named-active-calamity', usesReaction: true }, 'Three reaction retreats from one named calamity.')
  ], { durationConfig: nextStart }),

  record(8, 'twist_of_doom', 'Twist of Doom', 2, selfTarget, ['utility'], {
    op: 'doom.twist', args: {
      target: 'one-own-active-calamity', changeTrigger: true,
      allowedTriggers: ['target-attacks', 'target-moves', 'target-casts', 'area-entered', 'end-of-target-next-turn'],
      extendClockMax: 1, oncePerCalamity: true
    }
  }, 'Change the declared trigger of one of your active calamities to another allowed trigger, or extend its clock by one own turn to a maximum of three. It cannot be used after the trigger begins.', [
    effect('doom.twist', { changeTrigger: true, extendClockMax: 1 }, 'Rewrite one public trigger or extend one clock.')
  ]),
  record(8, 'doom_legion', 'Doom Legion', 3, enemy(3), ['damage'], {
    op: 'doom.plant', args: {
      rangeFeet: 30, maxTargets: 3, clockTurns: 2,
      trigger: 'end-of-target-next-turn', damage: '2d4', oneSlot: true, publicDeclaration: true
    }
  }, 'Declare one public calamity affecting up to three enemies within 30 ft. Each takes 2d4 wyrd when the two-own-turn clock resolves. The whole declaration occupies one slot; it is not three calamities.', [
    effect('doom.plant', { maxTargets: 3, clockTurns: 2, damage: '2d4', oneSlot: true }, 'Declare one multi-target countdown.')
  ], { damageConfig: damage('2d4') }),
  record(8, 'death_sentence', 'Death Sentence', 3, enemy(), ['control', 'damage'], {
    op: 'doom.sentence', args: { rangeFeet: 30, savePenalty: -3, damage: '2d6', expires: 'end-target-next-turn' }
  }, 'One enemy within 30 ft takes 2d6 wyrd and has -3 to its next save before the end of its next turn. No automatic kill and no hidden brand.', [
    effect('doom.sentence', { savePenalty: -3, damage: '2d6' }, 'Deal 2d6 and penalize one save.')
  ], { damageConfig: damage('2d6'), durationConfig: nextStart }),
  record(8, 'calamity_ward', 'Calamity Ward', 2, ally(), ['buff'], {
    op: 'doom.ward', args: { rangeFeet: 30, capacity: 10, uses: 1, against: 'named-active-calamity', expires: 'end-next-caster-turn' }
  }, 'One ally within 30 ft gains a 10-point one-use ward against one named active calamity. Apply after mitigation; no healing and no stacking.', [
    effect('doom.ward', { capacity: 10, uses: 1, against: 'named-active-calamity' }, 'Capacity-10 one-use ward.')
  ], { durationConfig: nextStart }),

  record(9, 'the_end', 'The End', 3, enemy(), ['damage'], {
    op: 'doom.requiem', args: { rangeFeet: 30, damage: '6d8', requireActiveCalamity: true, oncePerTarget: true }
  }, 'One doomed enemy within 30 ft takes 6d8 wyrd once. Requires an active calamity and cannot target the same creature twice in one encounter.', [
    effect('doom.requiem', { damage: '6d8', oncePerTarget: true }, 'Deal 6d8 once to a doomed subject.')
  ], { damageConfig: damage('6d8') }),
  record(9, 'cataclysm_incarnate', 'Cataclysm Incarnate', 3, selfTarget, ['buff'], {
    op: 'doom.herald', args: { damageBonus: 4, areaBonusFeet: 10, duration: 'start-next-caster-turn', requiresActiveCalamity: true }
  }, 'While you have an active calamity, add 4 to one calamity damage event and increase its visible area by 10 ft before the start of your next turn. One use; no extra slot.', [
    effect('doom.herald', { damageBonus: 4, areaBonusFeet: 10, requiresActiveCalamity: true }, 'Add 4 damage and 10 ft area once.')
  ], { durationConfig: nextStart }),
  record(9, 'requiem_absolute', 'Requiem Absolute', 3, enemy(), ['damage'], {
    op: 'doom.execute', args: { rangeFeet: 30, thresholdPercent: 10, damage: '7d6', requireActiveCalamity: true }
  }, 'One doomed enemy within 30 ft below 10% health takes 7d6 wyrd. If it is above the threshold, the action has no effect. This is damage, never an automatic kill.', [
    effect('doom.execute', { thresholdPercent: 10, damage: '7d6' }, 'Deal 7d6 below the public threshold.')
  ], { damageConfig: damage('7d6') }),
  record(9, 'last_forewarning', 'Last Forewarning', 2, ally(1, 60), ['buff'], {
    op: 'doom.ward', args: { rangeFeet: 60, capacity: 12, uses: 1, against: 'named-active-calamity', expires: 'end-next-caster-turn' }
  }, 'One ally within 60 ft gains a 12-point one-use ward against one named active calamity. Apply after mitigation; no healing and no stacking.', [
    effect('doom.ward', { capacity: 12, uses: 1, against: 'named-active-calamity' }, 'Capacity-12 one-use ward.')
  ], { durationConfig: nextStart }),

  record(10, 'herald_of_the_end', 'Herald of the End', 3, selfTarget, ['buff'], {
    op: 'doom.herald', args: { damageBonus: 3, areaBonusFeet: 15, duration: 'start-next-caster-turn', requiresActiveCalamity: true }
  }, 'While you have an active calamity, add 3 to one calamity damage event and increase its visible area by 15 ft before the start of your next turn. One use; no extra slot or Havoc.', [
    effect('doom.herald', { damageBonus: 3, areaBonusFeet: 15, requiresActiveCalamity: true }, 'Add 3 damage and 15 ft area once.')
  ], { durationConfig: nextStart }),
  record(10, 'end_of_all_things', 'End of All Things', 3, selfTarget, ['damage'], {
    op: 'doom.resolve-all', args: { maxCalamities: 2, damage: '4d6', oneEventPerTarget: true, createsNewCalamity: false }
  }, 'Resolve every active calamity you declared, up to two, each once. Every affected enemy takes 4d6 wyrd once. No new calamity is created and no resolved record is reopened.', [
    effect('doom.resolve-all', { maxCalamities: 2, damage: '4d6' }, 'Resolve all active calamities once.')
  ], { damageConfig: damage('4d6') }),
  record(10, 'final_requiem', 'Final Requiem', 3, enemy(), ['damage'], {
    op: 'doom.requiem', args: { rangeFeet: 30, damage: '8d6', requireActiveCalamity: true, oncePerLongRest: true }
  }, 'One doomed enemy within 30 ft takes 8d6 wyrd. Once per completed long rest; the calamity still resolves once and is not refunded if the target survives.', [
    effect('doom.requiem', { damage: '8d6', oncePerLongRest: true }, 'Deal 8d6 once per long rest.')
  ], { damageConfig: damage('8d6'), cooldownConfig: cooldownLongRest }),
  record(10, 'unmaking_word', 'Unmaking Word', 3, enemy(), ['control'], {
    op: 'doom.unmake', args: { rangeFeet: 30, savePenalty: -3, condition: 'stunned', durationRounds: 1, requireActiveCalamity: true }
  }, 'One doomed enemy within 30 ft has -3 to one save and is stunned until the end of its next turn if it fails. Requires an active calamity; one condition and no automatic damage.', [
    effect('doom.unmake', { savePenalty: -3, condition: 'stunned', durationRounds: 1 }, 'Apply one stunned condition on a failed save.')
  ], { durationConfig: nextStart, conditions: ['stunned'] })
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

export const DOOMSAYER_TALENT_ACTIVES = [
  signature('quiet_requiem', 'Quiet Requiem', 'requiem', 2, enemy(), {
    op: 'doom.resolve-one', args: { rangeFeet: 30, requireActiveCalamity: true, bonusDamage: '2d6', automaticKill: false }
  }, 'Resolve one of your active calamities on an enemy within 30 ft. If resolved by trigger, add 2d6 wyrd once. If it had not triggered, resolve its published effect instead. No automatic kill.', [
    effect('doom.resolve-one', { rangeFeet: 30, bonusDamage: '2d6' }, 'Resolve one calamity with a 2d6 trigger bonus.')
  ], { effectTypes: ['damage'], damageConfig: damage('2d6') }),
  signature('lengthen_the_hour', 'Lengthen the Hour', 'endbringer', 2, selfTarget, {
    op: 'doom.advance', args: {
      target: 'one-own-active-calamity', advanceClock: 1, extendExpiryMax: 1,
      clockMax: 3, automaticResolution: false, oncePerCalamityPerTurn: true
    }
  }, 'Advance one active calamity clock by one own turn or extend its expiry by one own turn, to a maximum clock of three. It does not resolve, deal damage or gain Havoc immediately.', [
    effect('doom.advance', { advanceClock: 1, clockMax: 3 }, 'Advance one public clock without resolving it.')
  ], { effectTypes: ['utility'] }),
  signature('sound_the_warning', 'Sound the Warning', 'forewarner', 1, ally(), {
    op: 'doom.warn', args: {
      rangeFeet: 30, capacity: 4, uses: 1, against: 'named-active-calamity',
      expires: 'end-next-caster-turn', public: true
    }
  }, 'Name one active calamity and one ally within 30 ft. That ally gains a 4-point one-use ward against the named calamity or adds 4 to one save against it, chosen before the event. No extra action.', [
    effect('doom.warn', { capacity: 4, uses: 1, against: 'named-active-calamity' }, 'Ward or save bonus against one named calamity.')
  ], { effectTypes: ['buff'], durationConfig: nextStart }),
  capstone('absolute_requiem', 'Absolute Requiem', 'requiem', 3, enemy(), {
    op: 'doom.execute', args: {
      rangeFeet: 30, thresholdPercent: 25, damage: '4d8',
      requireActiveCalamity: true, automaticKill: false, oncePerLongRest: true
    }
  }, 'One doomed enemy within 30 ft below 25% health takes 4d8 wyrd. If it is above the threshold, the action has no effect. Once per completed long rest; never an automatic kill.', [
    effect('doom.execute', { thresholdPercent: 25, damage: '4d8', oncePerLongRest: true }, 'Deal 4d8 below the public threshold.')
  ], { effectTypes: ['damage'], damageConfig: damage('4d8') }),
  capstone('the_last_hour', 'The Last Hour', 'endbringer', 3, area(20), {
    op: 'doom.resolve-area', args: {
      radiusFeet: 20, rangeFeet: 30, damage: '4d6', maxTargets: 4,
      oneEventPerTarget: true, oncePerLongRest: true, createsNewCalamity: false
    }
  }, 'Resolve one active area calamity immediately in a visible 20-ft radius within 30 ft, affecting up to four enemies once each for 4d6 wyrd. No new calamity is created. Once per completed long rest.', [
    effect('doom.resolve-area', { radiusFeet: 20, damage: '4d6', maxTargets: 4 }, 'Resolve one area calamity once.')
  ], { effectTypes: ['damage'], damageConfig: damage('4d6'), area: { shape: 'sphere', radius: 20, visible: true } }),
  capstone('the_published_doom', 'The Published Doom', 'forewarner', 3, ally(3), {
    op: 'doom.publish', args: {
      rangeFeet: 30, maxTargets: 3, capacity: 6, moveFeet: 10,
      against: 'named-active-calamity', separateWards: true, oncePerLongRest: true
    }
  }, 'Publish one active calamity. Up to three allies within 30 ft each gain a 6-point one-use ward against it and may move 10 ft using remaining movement. Separate wards; no shared pool. Once per completed long rest.', [
    effect('doom.publish', { maxTargets: 3, capacity: 6, moveFeet: 10 }, 'Three separate wards and 10 ft movement.')
  ], { effectTypes: ['buff'], durationConfig: nextStart })
];

export const DOOMSAYER_OPTIONAL_RECORDS = optional;
export const DOOMSAYER_AUTHORED_RECORDS = [
  ...DOOMSAYER_CORE_RECORDS, ...DOOMSAYER_OPTIONAL_RECORDS,
  ...DOOMSAYER_TALENT_ACTIVES, ...DOOMSAYER_PASSIVE_RECORDS
];

const nodeForRecord = recordEntry => DOOMSAYER_TALENT_NODES.find(node =>
  node.grantId === recordEntry.id || node.passiveSpellId === recordEntry.id
);

export function describeDoomsayerPrice(recordEntry) {
  const args = recordEntry.classResourceProgram?.args || {};
  const havoc = args.havocCost ? `; spend ${args.havocCost} Havoc` : '; no Havoc spent';
  const slot = recordEntry.classResourceProgram?.op === 'doom.plant' ||
    recordEntry.classResourceProgram?.op === 'doom.plant-area' ? '; occupy 1 calamity slot' : '';
  return `${recordEntry.resourceCost.actionPoints} AP; 0 mana${havoc}${slot}; manual resolution.`;
}

export const DOOMSAYER_PROJECTED_SPELLS = DOOMSAYER_AUTHORED_RECORDS.map(recordEntry => {
  const node = nodeForRecord(recordEntry);
  return {
    ...flags, id: recordEntry.id, name: recordEntry.name, class: 'Doomsayer', level: recordEntry.level,
    source: `doomsayer-${recordEntry.source}`, sourceRecordSource: recordEntry.source,
    spellType: recordEntry.spellType, icon: DOOMSAYER_ICON, description: recordEntry.description,
    specialization: node?.treeId || recordEntry.treeId || 'core', treeId: node?.treeId || recordEntry.treeId || null,
    typeConfig: {
      school: 'wyrd', castTimeType: recordEntry.spellType === 'PASSIVE' ? 'PASSIVE' : 'IMMEDIATE',
      tags: ['doomsayer', 'manual-only', recordEntry.source]
    },
    resourceCost: apCost(recordEntry.resourceCost.actionPoints),
    targetingConfig: recordEntry.targetingConfig, effectTypes: recordEntry.effectTypes,
    resolution: recordEntry.damageConfig ? 'DICE' : 'MANUAL', damageConfig: recordEntry.damageConfig,
    durationConfig: recordEntry.durationConfig, cooldownConfig: recordEntry.cooldownConfig,
    reactionTiming: null, savingThrow: null, conditions: recordEntry.conditions, area: recordEntry.area,
    manualRequirements: [DOOMSAYER_MANUAL_NOTICE, describeDoomsayerPrice(recordEntry), ...Object.values(DOOMSAYER_COMMON_MECHANICS)],
    tags: ['doomsayer', 'manual-only', recordEntry.source], categoryIds: [],
    specialMechanics: {
      doomsayer: {
        ...flags, sourceRecordId: recordEntry.id, priceSummary: describeDoomsayerPrice(recordEntry),
        authoredSpell: recordEntry, commonRules: DOOMSAYER_COMMON_MECHANICS,
        rankValues: recordEntry.rankValues || null, requires: recordEntry.requires || null
      }
    }
  };
});

export const DOOMSAYER_PROJECTED_SPELLS_BY_ID = Object.fromEntries(
  DOOMSAYER_PROJECTED_SPELLS.map(spell => [spell.id, spell])
);

export const DOOMSAYER_SPELL_POOLS = Object.fromEntries(
  Array.from({ length: 10 }, (_, index) => {
    const level = index + 1;
    return [level, DOOMSAYER_OPTIONAL_RECORDS.filter(spell => spell.level === level).map(spell => spell.id)];
  })
);

export const DOOMSAYER_PROGRESSION_POLICY = {
  classId: DOOMSAYER_CLASS_ID, rulesetVersion: DOOMSAYER_RULESET_VERSION,
  levelCap: 10, startingSpellPicks: 1, optionalPicksPerLevel: 1,
  allowEarlierUnchosen: true, grantedCoreSpellIds: DOOMSAYER_CORE_RECORDS.map(spell => spell.id),
  randomizeStartingSpells: false, autoTopUpOnLoad: false, talentActivesAreGrants: true,
  manualOnly: true
};

const doomsayerNodeById = Object.fromEntries(DOOMSAYER_TALENT_NODES.map(node => [node.id, node]));
const doomsayerTreePoints = (ranks, treeId) => DOOMSAYER_TALENT_NODES
  .filter(node => node.treeId === treeId)
  .reduce((total, node) => total + (ranks[node.id] || 0), 0);

export const pruneDoomsayerTalents = (talents, characterLevel) => {
  const ranks = talents && typeof talents === 'object' ? { ...talents } : {};
  const level = Number.isInteger(characterLevel) ? Math.max(1, characterLevel) : 10;
  Object.keys(ranks).forEach(nodeId => {
    const node = doomsayerNodeById[nodeId];
    if (!node || !Number.isInteger(ranks[nodeId]) || ranks[nodeId] < 1 || ranks[nodeId] > node.maxRanks) {
      delete ranks[nodeId];
    }
  });
  const pruneStructure = () => {
    let changed = true;
    while (changed) {
      changed = false;
      for (const node of DOOMSAYER_TALENT_NODES) {
        const rank = ranks[node.id];
        if (!rank) continue;
        const gatePoints = doomsayerTreePoints(ranks, node.treeId) - rank;
        const predecessorMissing = node.requires.some(predecessorId => {
          const predecessor = doomsayerNodeById[predecessorId];
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
    DOOMSAYER_TALENT_NODES.forEach(node => {
      if (!ranks[node.id]) return;
      if (target === null || node.minLevel >= doomsayerNodeById[target].minLevel) target = node.id;
    });
    if (target === null) break;
    ranks[target] -= 1;
    if (ranks[target] === 0) delete ranks[target];
    pruneStructure();
  }
  return ranks;
};

const CALAMITY_STATUSES = ['active', 'resolved', 'dismantled', 'expired'];
const isText = value => typeof value === 'string' && value.trim().length > 0;
const integerBetween = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;

export function validateDoomsayerState(state) {
  const errors = [];
  if (!state || typeof state !== 'object') return { valid: false, errors: ['state must be an object'] };
  if (!integerBetween(state.havoc, 0, 15)) errors.push('havoc must be an integer from 0 to 15');
  if (!Array.isArray(state.calamities)) errors.push('calamities must be an array');
  const calamities = Array.isArray(state.calamities) ? state.calamities : [];
  const active = calamities.filter(calamity => calamity?.status === 'active');
  if (active.length > 2) errors.push('at most two active calamities');
  if (state.maxCalamities !== undefined && state.maxCalamities !== 2) errors.push('maxCalamities must be 2');
  const ids = new Set();
  calamities.forEach((calamity, index) => {
    if (!calamity || typeof calamity !== 'object') { errors.push(`calamity ${index} must be an object`); return; }
    if (!isText(calamity.id)) errors.push(`calamity ${index} requires an id`);
    else if (ids.has(calamity.id)) errors.push(`duplicate calamity id ${calamity.id}`);
    else ids.add(calamity.id);
    ['subject', 'effect', 'disruption', 'trigger'].forEach(field => {
      if (!isText(calamity[field])) errors.push(`calamity ${calamity.id ?? index} requires ${field}`);
    });
    if (!integerBetween(calamity.clock, 1, 3)) errors.push(`calamity ${calamity.id ?? index} clock must be 1..3`);
    if (!CALAMITY_STATUSES.includes(calamity.status)) errors.push(`calamity ${calamity.id ?? index} has invalid status`);
    if (calamity.createdAtTurn !== undefined && !Number.isInteger(calamity.createdAtTurn)) {
      errors.push(`calamity ${calamity.id ?? index} createdAtTurn must be an integer`);
    }
    if (calamity.expiresAtTurn !== undefined && !Number.isInteger(calamity.expiresAtTurn)) {
      errors.push(`calamity ${calamity.id ?? index} expiresAtTurn must be an integer`);
    }
  });
  return { valid: errors.length === 0, errors };
}

export function projectDoomsayerResource(resource, isOwner = false) {
  const state = resource?.state ?? null;
  if (!state) {
    return { initialized: false, valid: true, errors: [], havoc: 0, havocMax: 15, activeCount: 0, maxCalamities: 2, calamities: [] };
  }
  const check = validateDoomsayerState(state);
  const raw = Array.isArray(state.calamities) ? state.calamities : [];
  const calamities = raw.map(entry => {
    const calamity = entry && typeof entry === 'object' ? entry : {};
    return {
      id: calamity.id || null,
      subject: calamity.subject || 'Unrecorded subject',
      effect: calamity.effect || 'Unrecorded effect',
      disruption: calamity.disruption || 'Unrecorded disruption',
      trigger: calamity.trigger || 'Unrecorded trigger',
      clock: Number.isInteger(calamity.clock) ? calamity.clock : null,
      status: CALAMITY_STATUSES.includes(calamity.status) ? calamity.status : 'unknown',
      expiresAtTurn: Number.isInteger(calamity.expiresAtTurn) ? calamity.expiresAtTurn : null,
      ...(isOwner && Number.isInteger(calamity.createdAtTurn) ? { createdAtTurn: calamity.createdAtTurn } : {})
    };
  });
  return {
    initialized: true, valid: check.valid, errors: check.errors,
    havoc: integerBetween(state.havoc, 0, 15) ? state.havoc : 0, havocMax: 15,
    activeCount: calamities.filter(calamity => calamity.status === 'active').length,
    maxCalamities: 2, calamities
  };
}

export const DOOMSAYER_RESOURCE_RULES = {
  calamityMax: 2, clockMin: 1, clockMax: 3,
  havocMin: 0, havocMax: 15, havocOnTrigger: 3, havocOnExpiry: 1, havocOnDismantle: 0,
  statuses: CALAMITY_STATUSES, publicDeclarations: true,
  refreshOnLongRest: true, refreshHavocOnLongRest: true,
  refreshOnReconnect: false, refreshOnInitiative: false, automaticResolution: false,
  automaticClockAdvance: false, hiddenInformation: false, mechanicalHeritageBenefits: false,
  manualOnly: true
};

export const DOOMSAYER_RESOURCE_SYSTEM = {
  id: 'doom-calamities', name: 'Calamities & Havoc', shortName: 'Calamity', type: 'doom-calamities',
  title: 'Calamities & Havoc', subtitle: 'Two declared endings and the wreckage they leave.',
  base: 0, max: 2, calamityMax: 2, havocMax: 15, manualOnly: true,
  description: 'Record at most two public calamities, each with an exact subject, trigger, one-to-three own-turn clock, published effect and public disruption method. Resolve each once. Trigger resolution grants 3 Havoc, expiry grants 1 and dismantle grants 0; Havoc runs 0-15 and resets only on a completed long rest.',
  cards: [
    { title: 'Calamities (0-2)', stats: 'Two public slots', details: 'Each active calamity records its subject, trigger, clock, effect and disruption. A declaration never creates a hidden clock or an automatic timer.' },
    { title: 'Havoc (0-15)', stats: 'Earned only by resolution', details: 'Trigger resolution grants 3 Havoc; expiry grants 1; dismantle grants 0. Excess above 15 is lost. Havoc never refreshes on reconnect or initiative.' },
    { title: 'Resolution Once', stats: 'Trigger, expiry or dismantle', details: 'A calamity resolves exactly once, then its record closes. No record is reopened or silently duplicated.' }
  ],
  generationTable: {
    headers: ['Outcome', 'Havoc', 'Record treatment'],
    rows: [
      ['Resolved by declared trigger', '+3', 'Close the record and free its slot after resolution'],
      ['Resolved at expiry', '+1', 'Close the record and free its slot'],
      ['Dismantled or disrupted', '+0', 'Close the record; no Havoc and no reversal'],
      ['Duplicate or invalid declaration', '+0', 'Reject the whole declaration; keep the existing record unchanged']
    ]
  },
  usage: {
    momentum: 'Plant a clear public calamity early, let the table see the clock, and collect Havoc only when the declared ending actually arrives.',
    flourish: 'Spend Havoc on authored finishers and warnings, but keep at most two active records and never assume a clock advanced without a recorded paid action.'
  },
  mechanics: {
    title: 'Manual Calamity Ledger',
    content: 'At most two active calamities. Each has an exact subject or visible area, a declared trigger, a one-to-three own-turn clock, one published effect and one public disruption method. Resolution is a table event, not a background timer.',
    sections: [
      { label: 'Clock', mechanics: [{ text: 'Advance only through an authored paid action or an explicitly recorded table event.' }, { text: 'No initiative, reconnect, rest or scene change advances a clock.' }] },
      { label: 'Havoc', mechanics: [{ text: '0-15; trigger +3, expiry +1, dismantle +0.' }, { text: 'Resets to 0 only on a completed long rest; overflow is lost.' }] }
    ]
  },
  overheatRules: {
    title: 'Doom Overflow',
    content: 'A third active declaration is rejected without changing the existing two records. Havoc above 15 is lost rather than converted into damage, healing or another resource. A dismantled calamity frees its slot but grants no Havoc and reverses no accepted consequence.'
  },
  playingInPerson: {
    title: 'The Doom Ledger',
    subtitle: 'Two visible clocks and a Havoc bowl',
    content: 'Use two calamity cards and a Havoc bowl of fifteen tokens. Write the subject, trigger, clock, effect and disruption method on each card. Turn the card face down only when it closes, never to hide its terms. Move one Havoc token only when the table confirms a resolution; reset the bowl only after a completed long rest.'
  },
  nativeNote: 'No native heritage edge is registered. Skald, Anhur and Tessic are recommendations only.'
};

export const DOOMSAYER_DATA = {
  ...flags, id: DOOMSAYER_CLASS_ID, name: 'Doomsayer', variantName: 'Doomsayer',
  icon: DOOMSAYER_ICON, imageIcon: '/assets/icons/classes/doomsayer.png',
  role: 'Doom Caster / Control', damageTypes: ['wyrd', 'blight', 'ember', 'storm'],
  resource: 'Calamities & Havoc', primaryStat: 'Intelligence', secondaryStat: 'Spirit',
  developmentStatus: 'development', statusLabel: 'Development - manual tabletop',
  heritageEffectsImplemented: false, nativeAccess: [],
  classResource: {
    type: 'doom-calamities', base: 0, max: 2, havocMax: 15,
    initialized: false, state: null,
    generationNote: 'Uninitialized until the table records an actual public calamity. At most two active records; Havoc is earned only when a record resolves.'
  },
  restrictions: {
    allowedSubraces: [], hardBlocks: [], narrativeUnlock: true,
    acquisition: {
      status: 'proposed',
      records: [
        { id: 'witnessed_calamity', label: 'Witnessed calamity', text: 'Observed one real declared calamity resolve through a public trigger, expiry or dismantle.' },
        { id: 'doom_arithmetic', label: 'Doom arithmetic', text: 'Maintained an exact public clock and Havoc ledger through one full session without inventing a tick or a resolution.' },
        { id: 'disruption_method', label: 'Disruption method', text: 'Demonstrated a visible, legal disruption method before a declared calamity resolved.' },
        { id: 'forewarning_accounting', label: 'Forewarning accounting', text: 'Warned an ally with a named calamity and recorded the ward or save bonus exactly once.' }
      ]
    },
    justification: 'Doomsayer is a development successor class. It preserves legacy Harbinger records and grants no native heritage edge.'
  },
  equipment: { weapons: ['staff', 'dagger'], protectiveGear: ['robes', 'light_ward'], offHand: ['empty', 'tome'] },
  subraceVariants: {},
  overview: {
    title: 'The Doomsayer', subtitle: 'The end is not predicted. It is scheduled.',
    description: 'A Doomsayer declares a finite public calamity, sets its trigger and clock, and lets the table watch it arrive. Two slots, one resolution and a Havoc ledger keep the doom exact.',
    quickOverview: {
      title: 'Class Overview',
      content: 'Two public calamities, one resolution each, Havoc 0-15. Plant the Calamity and Dismantle the Sign are core. Four optional records at every level and one bounded signature and capstone per tree. Manual tabletop only.'
    },
    combatRole: 'Delayed single-target and area control through public clocks, with bounded finishers and ally forewarning.',
    playstyle: {
      title: 'Turn 1',
      content: 'Declare the exact subject, trigger, clock, effect and disruption. Do not hide the terms. Resolve once when the trigger or expiry occurs, then close the record and record the correct Havoc gain.'
    },
    roleplayIdentity: {
      title: 'A public ending, not a secret debt',
      content: 'Doomsayer is the approved successor name for Harbinger. It does not inherit Fate Weaver links, Augur omens or Oracle forecasts. Legacy Harbinger characters keep their exact Mayhem and known IDs.'
    },
    currentCrisis: 'Development class; no native heritage access is registered. The Frozen Archive, Anhur vent-readings and Tessic rehearsal traditions are recommendations pending approval.'
  },
  characterCreation: {
    title: 'Doomsayer',
    description: 'Choose one level-1 optional; Plant the Calamity and Dismantle the Sign are core grants. Record acquisition requirements. Calamity state stays uninitialized until the table records a declaration.'
  },
  specializations: {
    title: 'Three Doom Disciplines',
    description: 'First investment chooses a primary tree. Five talent points per level, global cap fifty. Signatures require ten same-tree points at level three; capstones forty-five at level ten.',
    specs: DOOMSAYER_TREE_META.map(meta => ({
      id: meta.id, name: meta.name, icon: DOOMSAYER_ICON, theme: meta.tagline,
      description: meta.tagline, playstyle: meta.tagline
    }))
  },
  spells: DOOMSAYER_PROJECTED_SPELLS, spellPools: DOOMSAYER_SPELL_POOLS,
  progression: {
    levelCap: 10, policy: DOOMSAYER_PROGRESSION_POLICY,
    levels: Array.from({ length: 10 }, (_, index) => ({
      level: index + 1, newChoiceIds: DOOMSAYER_SPELL_POOLS[index + 1],
      optionalPicks: 1, talentBudget: (index + 1) * 5
    }))
  },
  talentTrees: DOOMSAYER_TALENT_CAPACITY,
  resourceSystem: { ...DOOMSAYER_RESOURCE_SYSTEM },
  heritageRecommendation: ['skald_human', 'thrask_solari', 'tessen_human']
};

export const DOOMSAYER_MANIFEST = {
  ...flags, contentLock: 'RI-5 Doomsayer complete content lock',
  optional: DOOMSAYER_OPTIONAL_RECORDS.map(recordEntry => recordEntry.id),
  core: DOOMSAYER_CORE_RECORDS.map(recordEntry => recordEntry.id),
  talentActives: DOOMSAYER_TALENT_ACTIVES.map(recordEntry => recordEntry.id),
  passives: DOOMSAYER_PASSIVE_RECORDS.map(recordEntry => recordEntry.id),
  records: DOOMSAYER_AUTHORED_RECORDS.map(recordEntry => ({
    id: recordEntry.id, name: recordEntry.name, level: recordEntry.level, source: recordEntry.source,
    treeId: nodeForRecord(recordEntry)?.treeId || null,
    ap: recordEntry.resourceCost.actionPoints, mana: 0
  })),
  nodes: DOOMSAYER_TALENT_NODES.map(node => ({
    id: node.id, treeId: node.treeId, spellId: node.grantId || node.passiveSpellId,
    ranks: node.maxRanks, minimumLevel: node.minLevel, requiresPoints: node.requiresPoints,
    prerequisites: node.requires
  })),
  uniqueRecords: 96, activeRecords: 48, passiveRecords: 48,
  talentNodes: 54, talentCapacity: DOOMSAYER_TALENT_CAPACITY,
  nativeAccess: [], acquisitionRequirements: DOOMSAYER_DATA.restrictions.acquisition.records.map(recordEntry => recordEntry.id),
  heritageEffectsImplemented: false, resourceRules: DOOMSAYER_RESOURCE_RULES,
  trees: DOOMSAYER_TREES.map(tree => tree.id),
  dependencies: ['CR-R1', 'RI-5 content lock', 'manual-tabletop'],
  automaticConversion: false
};

export default DOOMSAYER_DATA;
