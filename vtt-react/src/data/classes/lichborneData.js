import { createCr1Package, makeCr1ResourceSystem, pruneCr1Talents } from './cr1ClassBuilder';
import { LICHBORNE_MANIFEST_SPELLS } from './cr1ManifestPayloads';

export const LICHBORNE_CLASS_ID = 'lichborne';
export const LICHBORNE_RULESET_VERSION = 'cr-review-r1';
export const LICHBORNE_ICON = 'Psychic/Psychic Telepathy';
export const LICHBORNE_MANUAL_NOTICE = 'Manual tabletop only. Anchor integrity, traits, suppression, stage, life state, damage and recovery are never applied automatically.';

const optionalRows = [
  { suffix: 'rime_ward', name: 'Rime Ward', level: 1, ap: 1, target: 'ally', effectTypes: ['buff'], description: 'One ally within 30 ft gains a 3-point one-use ward against the next cold damage after normal mitigation.', op: 'lich.ward', args: { rangeFeet: 30, wardCapacity: 3, damageType: 'cold', uses: 1 } },
  { suffix: 'grave_chill', name: 'Grave Chill', level: 1, ap: 1, target: 'enemy', effectTypes: ['control'], description: 'One enemy within 30 ft has its Speed reduced by 5 ft until the end of its next turn. It may end this by spending 5 ft of movement.', op: 'lich.chill', args: { rangeFeet: 30, speedPenaltyFeet: 5, breakCostFeet: 5, expires: 'end-target-next-turn' } },
  { suffix: 'vessel_sense', name: 'Vessel Sense', level: 1, ap: 1, target: 'self', description: 'Sense the direction of your own intact anchor within one mile. This reveals no precise distance, room or hidden creature.', op: 'lich.sense', args: { rangeMiles: 1, reveals: ['direction'], precise: false, hidden: false } },
  { suffix: 'cold_reproach', name: 'Cold Reproach', level: 2, ap: 1, target: 'enemy', effectTypes: ['damage'], description: 'One enemy within 30 ft takes 1d6 cold. If you are at stage 1 or higher, it cannot take reactions until the end of its next turn.', op: 'lich.strike', args: { rangeFeet: 30, baseDamage: '1d6', stageGate: 1, reactionBlock: true }, damageConfig: { formula: '1d6', damageTypes: ['cold'], resolution: 'DICE' } },
  { suffix: 'phylactery_pulse', name: 'Phylactery Pulse', level: 2, ap: 2, target: 'self', description: 'Read your anchor status and current integrity. The pulse cannot locate a hidden anchor or reveal who damaged it.', op: 'lich.read', args: { reveals: ['status', 'integrity'], locateHidden: false, identifyCulprit: false } },
  { suffix: 'hollow_step', name: 'Hollow Step', level: 2, ap: 2, target: 'self', description: 'Move up to 10 ft through one space occupied by an undead ally. This uses your remaining movement and provokes normally.', op: 'lich.step', args: { moveFeet: 10, throughUndeadAlly: true, freeMovement: false } },
  { suffix: 'wintry_veil', name: 'Wintry Veil', level: 2, ap: 2, target: 'ally', effectTypes: ['buff'], description: 'One ally within 30 ft gains +2 to Stealth in dim light or darkness until the start of your next turn. Direct observation still reveals them.', op: 'lich.veil', args: { rangeFeet: 30, stealthBonus: 2, lightRequirement: 'dim-or-dark', invisibility: false } },
  { suffix: 'frost_nail', name: 'Frost Nail', level: 3, ap: 1, target: 'enemy', effectTypes: ['damage', 'control'], description: 'One enemy within 30 ft takes 1d6 cold and cannot Disengage until the end of its next turn.', op: 'lich.strike', args: { rangeFeet: 30, baseDamage: '1d6', disengageBlocked: true }, damageConfig: { formula: '1d6', damageTypes: ['cold'], resolution: 'DICE' } },
  { suffix: 'anchor_sense', name: 'Anchor Sense', level: 3, ap: 2, target: 'self', description: 'Learn whether a visible object within 30 ft is warded as an anchor. Learn the ward type only; no ownership or trigger details.', op: 'lich.sense', args: { rangeFeet: 30, reveals: ['is-anchor', 'ward-type'], owner: false, trigger: false } },
  { suffix: 'dead_mans_poise', name: "Dead Man's Poise", level: 3, ap: 2, target: 'self', effectTypes: ['buff'], description: 'Gain +2 to one save against being frightened or charmed before the end of your next turn.', op: 'lich.poise', args: { saveBonus: 2, against: ['frightened', 'charmed'], uses: 1, expires: 'end-next-turn' } },
  { suffix: 'rime_bind', name: 'Rime Bind', level: 3, ap: 2, target: 'enemy', effectTypes: ['control'], description: 'One enemy within 30 ft is rooted until the end of its next turn. It may break free by spending 10 ft of movement.', op: 'lich.bind', args: { rangeFeet: 30, root: true, breakCostFeet: 10, expires: 'end-target-next-turn' } },
  { suffix: 'vessel_mend', name: 'Vessel Mend', level: 4, ap: 2, target: 'self', effectTypes: ['healing'], description: 'Restore 1d4 anchor integrity if your anchor is intact and within one mile. Cannot raise integrity above 12 or repair a destroyed anchor.', op: 'lich.repair', args: { integrity: '1d4', maxIntegrity: 12, anchorStatus: 'intact', rangeMiles: 1, destroyedEligible: false } },
  { suffix: 'icy_rebuke', name: 'Icy Rebuke', level: 4, ap: 2, target: 'enemy', effectTypes: ['damage'], description: 'One enemy within 30 ft takes 2d6 cold. A creature that damaged your anchor since your last turn takes +1 damage once.', op: 'lich.strike', args: { rangeFeet: 30, baseDamage: '2d6', anchorDamageBonus: 1 }, damageConfig: { formula: '2d6', damageTypes: ['cold'], resolution: 'DICE' } },
  { suffix: 'soul_static', name: 'Soul Static', level: 4, ap: 2, target: 'enemy', effectTypes: ['control'], description: 'One enemy within 30 ft cannot cast or concentrate on a spell until the end of its next turn unless it succeeds on a save.', op: 'lich.static', args: { rangeFeet: 30, blocksSpellcasting: true, saveAllowed: true, expires: 'end-target-next-turn' } },
  { suffix: 'grave_calm', name: 'Grave Calm', level: 4, ap: 2, target: 'self', effectTypes: ['buff'], description: 'Suppress one fear or charm effect on yourself until the end of your next turn. The source remains and returns afterward.', op: 'lich.calm', args: { suppresses: ['frightened', 'charmed'], duration: 'end-next-turn', removesSource: false } },
  { suffix: 'winters_grasp', name: "Winter's Grasp", level: 5, ap: 2, target: 'enemy', effectTypes: ['control'], description: 'One enemy within 30 ft has its Speed halved and cannot take reactions until the end of its next turn.', op: 'lich.grasp', args: { rangeFeet: 30, speedMultiplier: 0.5, reactionsBlocked: true, expires: 'end-target-next-turn' } },
  { suffix: 'anchor_shift', name: 'Anchor Shift', level: 5, ap: 2, target: 'self', description: 'Conceal one intact anchor more thoroughly at its current location. Increase the check to find it by 2; the anchor does not move.', op: 'lich.conceal', args: { concealBonus: 2, relocate: false, requiresIntact: true } },
  { suffix: 'deathless_focus', name: 'Deathless Focus', level: 5, ap: 2, target: 'self', description: 'Gain +2 to one concentration or death-save check before the end of your next turn. This does not prevent death.', op: 'lich.focus', args: { bonus: 2, checks: ['concentration', 'death-save'], expires: 'end-next-turn' } },
  { suffix: 'rime_armor', name: 'Rime Armor', level: 5, ap: 2, target: 'self', effectTypes: ['buff'], description: 'Gain 4 temporary HP against cold damage only until the start of your next turn. This is not healing and does not stack.', op: 'lich.armor', args: { temporaryHp: 4, damageType: 'cold', duration: 'start-next-turn', stacking: 'no' } },
  { suffix: 'colder_still', name: 'Colder Still', level: 6, ap: 2, target: 'enemy', effectTypes: ['damage'], description: 'One enemy within 30 ft takes 2d6 cold. If it is already slowed or rooted, add 1d6 once.', op: 'lich.strike', args: { rangeFeet: 30, baseDamage: '2d6', conditionalBonus: '1d6', condition: ['slowed', 'rooted'] }, damageConfig: { formula: '2d6 + 1d6', damageTypes: ['cold'], resolution: 'DICE' } },
  { suffix: 'vessel_warning', name: 'Vessel Warning', level: 6, ap: 2, target: 'self', description: 'Learn immediately when your anchor takes damage, and whether it remains intact. This does not identify the attacker or location.', op: 'lich.warn', args: { triggers: ['anchor-damage'], reveals: ['damage-occurred', 'status'], identifyAttacker: false } },
  { suffix: 'veil_slip', name: 'Veil Slip', level: 6, ap: 1, target: 'self', description: 'Move up to 15 ft without provoking from one creature you can see. This uses your movement and is not a teleport.', op: 'lich.step', args: { moveFeet: 15, provokeFromOne: false, teleport: false } },
  { suffix: 'frozen_word', name: 'Frozen Word', level: 6, ap: 2, target: 'enemy', effectTypes: ['control'], description: 'One enemy within 30 ft cannot speak or cast a verbal spell until the end of its next turn unless it succeeds on a save.', op: 'lich.silence', args: { rangeFeet: 30, blocksVerbal: true, saveAllowed: true, expires: 'end-target-next-turn' } },
  { suffix: 'rime_chain', name: 'Rime Chain', level: 7, ap: 3, target: 'enemy', effectTypes: ['control'], targetingConfig: { targetingType: 'multiple', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['enemy'], maxTargets: 2 }, description: 'Two enemies within 30 ft each have their Speed reduced by 10 ft until the end of their next turns. Each may break free separately.', op: 'lich.chain', args: { rangeFeet: 30, maxTargets: 2, speedPenaltyFeet: 10, separateBreak: true } },
  { suffix: 'anchor_lock', name: 'Anchor Lock', level: 7, ap: 2, target: 'self', description: 'Set one public ward condition on your intact anchor. The ward is not hidden and does not damage intruders automatically.', op: 'lich.ward-anchor', args: { wardCondition: 'authored', hidden: false, automaticDamage: false, requiresIntact: true } },
  { suffix: 'dead_hand', name: 'Dead Hand', level: 7, ap: 2, target: 'enemy', effectTypes: ['damage'], description: 'One enemy within 30 ft takes 3d6 cold; it cannot regain HP until the end of its next turn.', op: 'lich.strike', args: { rangeFeet: 30, baseDamage: '3d6', healingBlocked: true, duration: 'end-target-next-turn' }, damageConfig: { formula: '3d6', damageTypes: ['cold'], resolution: 'DICE' } },
  { suffix: 'winters_patience', name: "Winter's Patience", level: 7, ap: 2, target: 'self', effectTypes: ['buff'], description: 'Gain +2 to one save made to maintain concentration until the end of your next turn.', op: 'lich.focus', args: { bonus: 2, checks: ['concentration'], expires: 'end-next-turn' } },
  { suffix: 'soul_frost', name: 'Soul Frost', level: 8, ap: 3, target: 'enemy', effectTypes: ['damage'], description: 'One enemy within 30 ft takes 3d6 cold and has disadvantage on its next attack before the end of its next turn.', op: 'lich.strike', args: { rangeFeet: 30, baseDamage: '3d6', nextAttackDisadvantage: true }, damageConfig: { formula: '3d6', damageTypes: ['cold'], resolution: 'DICE' } },
  { suffix: 'vessel_shelter', name: 'Vessel Shelter', level: 8, ap: 2, target: 'ally', effectTypes: ['buff'], description: 'One ally within 30 ft gains a 6-point one-use ward against cold damage. This does not protect your anchor.', op: 'lich.ward', args: { rangeFeet: 30, wardCapacity: 6, damageType: 'cold', uses: 1, protectsAnchor: false } },
  { suffix: 'veil_stride', name: 'Veil Stride', level: 8, ap: 2, target: 'self', description: 'Move up to 20 ft through dim light or darkness without provoking. Bright light or a creature with truesight still sees you.', op: 'lich.step', args: { moveFeet: 20, lightRequirement: 'dim-or-dark', provoke: false, invisibility: false } },
  { suffix: 'killing_cold', name: 'Killing Cold', level: 8, ap: 3, target: 'enemy', effectTypes: ['damage', 'control'], description: 'One enemy within 30 ft takes 3d6 cold and cannot regain HP until the end of its next turn.', op: 'lich.strike', args: { rangeFeet: 30, baseDamage: '3d6', healingBlocked: true }, damageConfig: { formula: '3d6', damageTypes: ['cold'], resolution: 'DICE' } },
  { suffix: 'winters_crown', name: "Winter's Crown", level: 9, ap: 3, target: 'enemy', effectTypes: ['control'], description: 'One enemy within 30 ft is frightened of you until the end of its next turn. It may repeat the save when it takes damage.', op: 'lich.crown', args: { rangeFeet: 30, condition: 'frightened', repeatOnDamage: true, source: 'caster' } },
  { suffix: 'anchor_recall', name: 'Anchor Recall', level: 9, ap: 3, target: 'self', description: 'Learn your anchor direction and approximate distance within ten miles. You cannot teleport it or move it with this record.', op: 'lich.sense', args: { rangeMiles: 10, reveals: ['direction', 'approximate-distance'], teleport: false } },
  { suffix: 'deathless_resolve', name: 'Deathless Resolve', level: 9, ap: 3, target: 'self', effectTypes: ['buff'], description: 'Gain +3 to one death save before the end of your next turn. A success does not stabilize you automatically beyond the normal rule.', op: 'lich.resolve', args: { bonus: 3, check: 'death-save', autoStabilize: false, expires: 'end-next-turn' } },
  { suffix: 'rime_storm', name: 'Rime Storm', level: 9, ap: 3, target: 'enemy', effectTypes: ['damage'], targetingConfig: { targetingType: 'multiple', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['enemy'], maxTargets: 3 }, description: 'Up to three enemies within 30 ft each take 2d6 cold. Each target resolves separately; no lingering zone is created.', op: 'lich.storm', args: { rangeFeet: 30, maxTargets: 3, damage: '2d6', lingeringZone: false }, damageConfig: { formula: '2d6', damageTypes: ['cold'], resolution: 'DICE' } },
  { suffix: 'last_winter', name: 'The Last Winter', level: 10, ap: 3, target: 'enemy', effectTypes: ['damage'], targetingConfig: { targetingType: 'multiple', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['enemy'], maxTargets: 3 }, description: 'Up to three enemies within 30 ft each take 3d6 cold and cannot regain HP until the end of their next turns.', op: 'lich.last-winter', args: { rangeFeet: 30, maxTargets: 3, damage: '3d6', healingBlocked: true }, damageConfig: { formula: '3d6', damageTypes: ['cold'], resolution: 'DICE' } },
  { suffix: 'vessel_eternal', name: 'Vessel Eternal', level: 10, ap: 3, target: 'self', effectTypes: ['buff'], description: 'Once per long rest, restore 3 anchor integrity to an intact anchor. This cannot exceed 12 or restore a destroyed anchor.', op: 'lich.repair', args: { integrity: 3, maxIntegrity: 12, anchorStatus: 'intact', oncePerRest: true, destroyedEligible: false } },
  { suffix: 'veil_beyond', name: 'Veil Beyond', level: 10, ap: 3, target: 'self', description: 'Until the start of your next turn, you may move through one solid obstacle no thicker than 5 ft. You must end in an unoccupied legal space.', op: 'lich.step', args: { throughObstacleFeet: 5, duration: 'start-next-turn', mustEndLegal: true } },
  { suffix: 'crown_of_ice', name: 'Crown of Ice', level: 10, ap: 3, target: 'self', effectTypes: ['buff'], description: 'Gain +2 to spell save DC and cold damage rolls until the end of your next turn. This does not increase anchor integrity or stage.', op: 'lich.crown-ice', args: { saveDcBonus: 2, coldDamageBonus: 2, duration: 'end-next-turn', anchorChange: 0 } }
];

const treeRows = {
  'rime-sovereign': [
    ['winter_affinity', 'Winter Affinity', [1, 2, 3], 'cold.damageBonus', 'Add {v} to one cold damage roll against one target.'],
    ['frost_save', 'Frost Save', [1, 2, 3], 'cold.saveDcBonus', 'Add {v} to the save DC of one cold record; declared before the target rolls.'],
    ['numbing_air', 'Numbing Air', [5, 10, 15], 'cold.slowFeet', 'Reduce one target Speed by {v} ft until the end of its next turn; no stacking.'],
    ['ice_lance', 'Ice Lance', [5, 10, 15], 'cold.rangeBonusFeet', 'Add {v} ft to the range of one cold record.'],
    ['frozen_ground', 'Frozen Ground', [1, 2, 3], 'cold.difficultTerrainFeet', 'One 5-ft square counts as {v} ft of difficult terrain for one creature; no damage.'],
    ['winters_edge', 'Winter\'s Edge', [1, 2, 3], 'cold.critRange', 'Lower the critical threshold of one cold attack by {v}; only on a natural roll.'],
    ['pale_flame', 'Pale Flame', [1, 2, 3], 'cold.ignoreResistance', 'Treat {v} points of cold resistance as absent for one damage event.'],
    ['still_air', 'Still Air', [1, 2, 3], 'cold.concentrationBonus', 'Add {v} to one concentration save made while maintaining a cold record.'],
    ['frost_memory', 'Frost Memory', [1, 2, 3], 'cold.recallBonus', 'Add {v} to one check to identify a cold effect or its source.'],
    ['winters_step', 'Winter\'s Step', [1, 2, 3], 'cold.difficultTerrainFeet', 'Ignore {v} ft of difficult terrain created by cold or ice.'],
    ['glacial_command', 'Glacial Command', [1, 2, 3], 'cold.commandBonus', 'Add {v} to one Intimidation check against a creature affected by your cold.'],
    ['rime_lash', 'Rime Lash', [1, 2, 3], 'cold.reactionDamage', 'Deal {v} cold damage to one creature that leaves your reach; uses your reaction.'],
    ['deep_freeze', 'Deep Freeze', [1, 2, 3], 'cold.healingBlock', 'Extend one healing block by {v} additional turn; no automatic application.'],
    ['frozen_moment', 'Frozen Moment', [1, 2, 3], 'cold.initiativeBonus', 'Add {v} to one initiative check made while at stage 1 or higher.'],
    ['winters_judgment', 'Winter\'s Judgment', [1, 2, 3], 'cold.executeBonus', 'Add {v} to one damage roll against a creature below half HP.'],
    ['endless_frost', 'Endless Frost', [1, 2, 3], 'cold.durationBonus', 'Extend one authored cold control effect by {v} turn; cannot exceed its stated maximum.']
  ],
  'phylactery-keeper': [
    ['anchor_ward', 'Anchor Ward', [1, 2, 3], 'anchor.wardBonus', 'Add {v} to the DC to locate or disturb your intact anchor.'],
    ['integrity_sight', 'Integrity Sight', [1, 2, 3], 'anchor.integrityReadBonus', 'Add {v} to one check to determine anchor integrity.'],
    ['vessel_hide', 'Vessel Hide', [5, 10, 15], 'anchor.concealmentBonus', 'Add {v} to one Stealth check made to conceal your anchor.'],
    ['grave_repair', 'Grave Repair', [1, 2, 3], 'anchor.repairBonus', 'Restore {v} additional integrity with one repair record, never above 12.'],
    ['phylactery_bond', 'Phylactery Bond', [10, 20, 30], 'anchor.senseRangeFeet', 'Sense your anchor within {v} ft; no exact location.'],
    ['dead_ward', 'Dead Ward', [1, 2, 3], 'anchor.wardCapacityBonus', 'Increase one anchor ward capacity by {v}; no automatic trigger.'],
    ['vessel_vigil', 'Vessel Vigil', [1, 2, 3], 'anchor.warningBonus', 'Add {v} to one check to notice a disturbance at your anchor.'],
    ['soul_anchor', 'Soul Anchor', [1, 2, 3], 'anchor.deathSaveBonus', 'Add {v} to one death save while your anchor is intact.'],
    ['cold_storage', 'Cold Storage', [1, 2, 3], 'anchor.storageSlots', 'Treat one container at your anchor as holding {v} additional small items.'],
    ['anchor_memory', 'Anchor Memory', [1, 2, 3], 'anchor.recallBonus', 'Add {v} to one check to recall the last public condition of your anchor.'],
    ['vessel_guard', 'Vessel Guard', [1, 2, 3], 'anchor.guardBonus', 'Add {v} to one check made by a guardian at your anchor; no new guardian.'],
    ['dead_switch', 'Dead Switch', [1, 2, 3], 'anchor.switchCheckBonus', 'Add {v} to one check to set a public ward condition; hidden wards are not created.'],
    ['integrity_floor', 'Integrity Floor', [1, 2, 3], 'anchor.lowIntegrityBonus', 'Add {v} to one save made while anchor integrity is 3 or lower.'],
    ['vessel_recall', 'Vessel Recall', [5, 10, 15], 'anchor.recallRangeFeet', 'Add {v} ft to the range at which you can read anchor status.'],
    ['phylactery_shield', 'Phylactery Shield', [1, 2, 3], 'anchor.damageReduction', 'Reduce one damage event to your anchor by {v}; cannot reduce below 1.'],
    ['vessel_unbroken', 'Vessel Unbroken', [1, 2, 3], 'anchor.recoveryBonus', 'Add {v} to one check to preserve an intact anchor after a damaging event.']
  ],
  'veil-scholar': [
    ['death_lexicon', 'Death Lexicon', [1, 2, 3], 'veil.knowledgeBonus', 'Add {v} to one check to identify an undead or death effect.'],
    ['borrowed_breath', 'Borrowed Breath', [1, 2, 3], 'veil.holdBreathBonus', 'Add {v} rounds to one held-breath check; no immunity.'],
    ['grave_lore', 'Grave Lore', [1, 2, 3], 'veil.loreBonus', 'Add {v} to one History or Religion check about a burial site.'],
    ['veil_sight', 'Veil Sight', [10, 20, 30], 'veil.senseRangeFeet', 'Sense an active undead presence within {v} ft; no identity.'],
    ['cold_reading', 'Cold Reading', [1, 2, 3], 'veil.insightBonus', 'Add {v} to one Insight check against an undead or a liar about the dead.'],
    ['mortality_ledger', 'Mortality Ledger', [1, 2, 3], 'veil.recordRecallMax', 'Recall the public terms of up to {v} death records.'],
    ['borrowed_skill', 'Borrowed Skill', [1, 2, 3], 'veil.skillBonus', 'Add {v} to one skill check using a tool or language learned from the dead; no new proficiency.'],
    ['winters_lesson', 'Winter\'s Lesson', [1, 2, 3], 'veil.saveBonus', 'Add {v} to one save against cold or exhaustion.'],
    ['soul_anatomy', 'Soul Anatomy', [1, 2, 3], 'veil.attackBonus', 'Add {v} to one attack roll against an undead creature.'],
    ['forbidden_text', 'Forbidden Text', [1, 2, 3], 'veil.decipherBonus', 'Add {v} to one check to decipher a funerary text.'],
    ['pale_argument', 'Pale Argument', [1, 2, 3], 'veil.persuasionBonus', 'Add {v} to one Persuasion check with a creature that respects the dead.'],
    ['grave_memory', 'Grave Memory', [1, 2, 3], 'veil.memoryBonus', 'Add {v} to one check to remember a public detail from a prior death record.'],
    ['veil_step', 'Veil Step', [1, 2, 3], 'veil.stealthBonus', 'Add {v} to one Stealth check in a graveyard or crypt.'],
    ['deathward', 'Deathward', [1, 2, 3], 'veil.deathSaveBonus', 'Add {v} to one death save; no automatic stabilization.'],
    ['borrowed_time', 'Borrowed Time', [1, 2, 3], 'veil.delayBonus', 'Add {v} to one check to delay an author-declared doom; cannot create extra turns.'],
    ['last_lesson', 'Last Lesson', [1, 2, 3], 'veil.finalBonus', 'Add {v} to one final save or check made at 0 HP; no revival.']
  ]
};

const trees = [
  { id: 'rime-sovereign', name: 'Rime Sovereign', stem: 'rime_sovereign', short: 'rs', signatureId: 'winter_edict', capstoneId: 'winter_without_end', signatureNode: 'cr1_lichborne_rime_sovereign_signature', capstoneNode: 'cr1_lichborne_rime_sovereign_capstone', tagline: 'Command cold as a precise, temporary sentence rather than a permanent curse.', rows: treeRows['rime-sovereign'] },
  { id: 'phylactery-keeper', name: 'Phylactery Keeper', stem: 'phylactery_keeper', short: 'pk', signatureId: 'anchor_ward', capstoneId: 'vessel_unbroken', signatureNode: 'cr1_lichborne_phylactery_keeper_signature', capstoneNode: 'cr1_lichborne_phylactery_keeper_capstone', tagline: 'Protect the vessel, record its integrity and keep recovery explicit.', rows: treeRows['phylactery-keeper'] },
  { id: 'veil-scholar', name: 'Veil Scholar', stem: 'veil_scholar', short: 'vs', signatureId: 'borrowed_mortality', capstoneId: 'mortal_ledger', signatureNode: 'cr1_lichborne_veil_scholar_signature', capstoneNode: 'cr1_lichborne_veil_scholar_capstone', tagline: 'Study death without becoming its unquestioned master.', rows: treeRows['veil-scholar'] }
];

const signatureNames = {
  winter_edict: 'Winter Edict',
  anchor_ward: 'Anchor Ward',
  borrowed_mortality: 'Borrowed Mortality'
};
const capstoneNames = {
  winter_without_end: 'Winter Without End',
  vessel_unbroken: 'The Vessel Unbroken',
  mortal_ledger: "Mortality's Ledger"
};
const capstones = [
  { suffix: 'winter_without_end', name: 'Winter Without End', treeId: 'rime-sovereign', ap: 3, target: 'enemy', effectTypes: ['damage', 'control'], op: 'lich.winter-without-end', args: { rangeFeet: 30, maxTargets: 2, damage: '4d6', speedPenaltyFeet: 15, duration: 'end-target-next-turn', permanent: false }, description: 'Two enemies within 30 ft each take 4d6 cold and have Speed reduced by 15 ft until the end of their next turns. No permanent freezing or extra damage loop.' },
  { suffix: 'vessel_unbroken', name: 'The Vessel Unbroken', treeId: 'phylactery-keeper', ap: 3, target: 'self', effectTypes: ['buff'], op: 'lich.vessel-unbroken', args: { integrity: 6, maxIntegrity: 12, requiresIntact: true, oncePerRest: true, immunity: false }, description: 'Once per long rest, restore 6 anchor integrity to an intact anchor, up to 12. This cannot restore a destroyed anchor or grant immunity.' },
  { suffix: 'mortal_ledger', name: "Mortality's Ledger", treeId: 'veil-scholar', ap: 3, target: 'self', effectTypes: ['utility'], op: 'lich.mortal-ledger', args: { duration: 'start-next-turn', options: ['save', 'skill', 'attack'], uses: 3, noExtraTurns: true }, description: 'Before the start of your next turn, grant up to three allies +2 to one save, skill check or attack each. The ledger records public outcomes only; no extra turns or revival.' }
];

const resource = makeCr1ResourceSystem({
  classId: 'lichborne',
  id: 'lich-anchor',
  name: 'Lich Anchor',
  shortName: 'Anchor',
  type: 'lich_anchor',
  description: 'One intact or destroyed anchor, integrity 0-12, undeath stage 0-2, two prepared traits and a bounded life state. Manual tabletop only.',
  mechanics: { initialized: false, current: 0, max: 12, state: null, consumeVerb: 'spend integrity', gainVerb: 'repair' },
  tooltip: { title: 'Lich Anchor - manual tabletop', description: 'No trait, anchor ward, death save, stage or integrity change is applied automatically. The table must record every change.' },
  rules: {
    integrityMax: 12, initialIntegrity: 12, stageMax: 2, preparedTraitCount: 2,
    anchorStatuses: ['intact', 'destroyed'], lifeStates: ['active', 'dormant', 'dead'],
    slotsByStage: [0, 1, 2], suppressedRule: 'Trait effects resume at the start of the owner turn; no automatic expiry.',
    recovery: 'Repair only through authored records or a completed rest. No class-change, reconnect or initiative refill.',
    vulnerabilities: ['radiant', 'anchor-destruction'], manualOnly: true
  }
});

const built = createCr1Package({
  classId: 'lichborne', className: 'Lichborne', icon: LICHBORNE_ICON,
  manualNotice: LICHBORNE_MANUAL_NOTICE,
  description: 'A deathless scholar bound to a vulnerable anchor, wielding cold and borrowed mortality through strict limits.',
  overview: {
    title: 'The Lichborne',
    subtitle: 'The vessel can break. That is the point.',
    description: 'Your anchor is a place, object and recorded condition. Integrity, undeath stage, traits and suppression are explicit tabletop state, never invisible automation.',
    quickOverview: 'Anchor integrity 12, stage 0-2, two prepared traits, manual anchor and death state.',
    playstyle: 'Protect the vessel, choose when to advance undeath, and pay for cold power with limited integrity and recovery.',
    roleplayIdentity: 'A scholar who bargained with death and remains accountable to the vessel.',
    currentCrisis: 'HeadQ-review-R1 proposed class; no native heritage effect is registered.'
  },
  manifestSpells: LICHBORNE_MANIFEST_SPELLS,
  coreIds: ['cr1_lichborne_veil_unbound', 'cr1_lichborne_repair_vessel'],
  optionalPayloadIds: ['cr1_lichborne_cold_touch'],
  optionalRows, capstones, trees, signatureNames, capstoneNames, resource,
  heritageRecommendation: ['velun_neth', 'tessen_human'],
  acquisitionRequirements: [
    { id: 'vessel_identification', description: 'Identify one physical anchor and record its ward, location and public condition.' },
    { id: 'integrity_accounting', description: 'Track anchor integrity 0-12 and every repair through one full session without automatic refill.' },
    { id: 'stage_control', description: 'Demonstrate the two prepared traits and stage 0-2 limits under supervision.' },
    { id: 'rest_recovery', description: 'Complete a recorded rest recovery and explain why no other refill occurs.' }
  ]
});

export const LICHBORNE_TREES = built.trees;
export const LICHBORNE_TALENT_NODES = built.nodes;
export const LICHBORNE_PASSIVE_RECORDS = built.passiveRecords;
export const LICHBORNE_CORE_RECORDS = built.coreRecords;
export const LICHBORNE_OPTIONAL_RECORDS = built.optionalRecords;
export const LICHBORNE_TALENT_ACTIVES = built.talentActives;
export const LICHBORNE_AUTHORED_RECORDS = built.authoredRecords;
export const LICHBORNE_PROJECTED_SPELLS = built.projectedSpells;
export const LICHBORNE_PROJECTED_SPELLS_BY_ID = built.projectedById;
export const LICHBORNE_SPELL_POOLS = built.spellPools;
export const LICHBORNE_PROGRESSION_POLICY = built.progressionPolicy;
export const LICHBORNE_RESOURCE_SYSTEM = resource;
export const LICHBORNE_RESOURCE_RULES = resource.rules;
export const LICHBORNE_RESOURCE_DEFINITION = resource.resourceDefinition;
export const validateLichborneState = resource.validate;
export const projectLichborneResource = resource.project;
export const pruneLichborneTalents = (talents, level) => pruneCr1Talents(talents, level, LICHBORNE_TALENT_NODES);

export const LICHBORNE_DATA = {
  ...built.data,
  id: LICHBORNE_CLASS_ID,
  variantName: 'Lichborne',
  imageIcon: '/assets/icons/classes/lichborne.png',
  role: 'Anchor Mage / Controller',
  resource: 'Lich Anchor',
  primaryStat: 'Intelligence',
  secondaryStat: 'Constitution',
  damageTypes: ['cold', 'wyrd'],
  developmentStatus: 'development',
  statusLabel: 'Development - manual tabletop',
  classResource: {
    type: 'lich_anchor', current: 0, max: 12, initialized: false, state: null,
    note: 'Record anchor integrity, stage, prepared traits and life state manually.'
  },
  equipment: { weapons: ['staff', 'dagger'], protectiveGear: ['light_ward', 'robes'], offHand: ['empty', 'phylactery_focus'] },
  subraceVariants: {},
  specializations: {
    title: 'Three Vessel Disciplines',
    description: 'Choose a primary tree. Five talent points per level; signatures require ten same-tree points at level three, capstones forty-five at level ten.',
    specs: LICHBORNE_TREES.map(tree => ({ id: tree.id, name: tree.name, icon: LICHBORNE_ICON, theme: tree.tagline, description: tree.tagline, playstyle: tree.tagline }))
  },
  characterCreation: {
    title: 'Lichborne',
    description: 'Choose one level-1 optional; Veil Unbound and Repair Vessel are core grants. Record anchor, integrity and stage manually.'
  }
};

export const LICHBORNE_MANIFEST = built.manifest;
export default LICHBORNE_DATA;
