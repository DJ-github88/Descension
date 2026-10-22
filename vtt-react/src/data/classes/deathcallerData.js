import { createCr1Package, makeCr1ResourceSystem, pruneCr1Talents } from './cr1ClassBuilder';
import { DEATHCALLER_MANIFEST_SPELLS } from './cr1ManifestPayloads';

export const DEATHCALLER_CLASS_ID = 'deathcaller';
export const DEATHCALLER_RULESET_VERSION = 'cr-review-r1';
export const DEATHCALLER_ICON = 'Psychic/Psychic Telepathy';
export const DEATHCALLER_MANUAL_NOTICE = 'Manual tabletop only. No automatic AP, HP, vitality, summon, command, movement, expiry or recovery.';

const optionalRows = [
  { suffix: 'bone_whistle', name: 'Bone Whistle', level: 1, ap: 1, target: 'ally', description: 'Signal one prepared formation within 60 ft. The retainer may reposition up to 5 ft using its remaining legal movement; this grants no extra action.', op: 'dead.signal', args: { rangeFeet: 60, moveFeet: 5, extraAction: false } },
  { suffix: 'grave_signal', name: 'Grave Signal', level: 1, ap: 1, target: 'ally', description: 'Mark one ally and one manifestation. Until the end of the next caster turn, the ally may ignore 5 ft of difficult terrain while moving toward that manifestation.', op: 'dead.signal', args: { rangeFeet: 30, difficultTerrainFeet: 5, expires: 'end-next-caster-turn' } },
  { suffix: 'pallid_hand', name: 'Pallid Hand', level: 1, ap: 1, target: 'enemy', effectTypes: ['control'], description: 'One enemy within 30 ft has its Speed reduced by 5 ft until the end of its next turn unless it spends 5 ft of movement to break the grip.', op: 'dead.grip', args: { rangeFeet: 30, speedPenaltyFeet: 5, breakCostFeet: 5, expires: 'end-target-next-turn' } },
  { suffix: 'shroud_step', name: 'Shroud Step', level: 1, ap: 1, target: 'self', description: 'Move up to 10 ft through the space of one allied manifestation. The move uses your remaining allowance and provokes normally.', op: 'dead.step', args: { moveFeet: 10, throughAllyOnly: true, consumesRemainingAllowance: true } },
  { suffix: 'relentless_retainer', name: 'Relentless Retainer', level: 2, ap: 2, target: 'ally', description: 'One manifestation within 30 ft may immediately spend its one command action to stand from prone or move 5 ft; it cannot both stand and move.', op: 'dead.command', args: { rangeFeet: 30, standOrMove: true, moveFeet: 5, extraAction: false } },
  { suffix: 'ossuary_recall', name: 'Ossuary Recall', level: 2, ap: 2, target: 'self', description: 'Dismiss one manifestation you control and return its pattern to preparation with 1 vitality. The capacity is freed only after the dismissal resolves.', op: 'dead.recall', args: { capacityFreedAfter: 'resolution', returningVitality: 1, dismiss: true } },
  { suffix: 'deathwatch', name: 'Deathwatch', level: 2, ap: 2, target: 'self', description: 'Read the vitality and remaining orders of one visible manifestation you control. No hidden command, prepared pattern or future action is revealed.', op: 'dead.read', args: { rangeFeet: 60, reveals: ['vitality', 'remaining-orders'], hiddenInformation: false } },
  { suffix: 'charnel_toll', name: 'Charnel Toll', level: 3, ap: 1, target: 'enemy', effectTypes: ['damage'], description: 'One enemy within 30 ft takes 1d6 wyrd. If a manifestation you control is adjacent to it, add 1 to the damage once.', op: 'dead.strike', args: { rangeFeet: 30, baseDamage: '1d6', adjacentManifestationBonus: 1 }, damageConfig: { formula: '1d6', damageTypes: ['wyrd'], resolution: 'DICE' } },
  { suffix: 'grave_ward', name: 'Grave Ward', level: 3, ap: 2, target: 'ally', effectTypes: ['buff'], description: 'One ally or manifestation within 30 ft gains a 4-point one-use ward against the next original damage after normal mitigation.', op: 'dead.ward', args: { rangeFeet: 30, wardCapacity: 4, uses: 1, stacking: 'higher-only', expires: 'start-next-caster-turn' } },
  { suffix: 'hollow_command', name: 'Hollow Command', level: 3, ap: 1, target: 'ally', description: 'One manifestation may use its command action to Help an ally against one target. The manifestation must be within 5 ft of that ally.', op: 'dead.command', args: { action: 'help', rangeFeet: 5, extraAction: false } },
  { suffix: 'funeral_pace', name: 'Funeral Pace', level: 3, ap: 1, target: 'ally', description: 'One willing ally within 30 ft moves 10 ft toward a manifestation you control. The movement is ordinary and uses the ally reaction.', op: 'dead.guide', args: { rangeFeet: 30, moveFeet: 10, consumesReaction: true } },
  { suffix: 'bone_splinter', name: 'Bone Splinter', level: 4, ap: 2, target: 'enemy', effectTypes: ['damage'], description: 'One enemy within 30 ft takes 2d6 wyrd. A manifestation occupying a space adjacent to the target may lose 1 vitality to add 1d6 once.', op: 'dead.strike', args: { rangeFeet: 30, baseDamage: '2d6', optionalVitalityCost: 1, bonusDamage: '1d6' }, damageConfig: { formula: '2d6', damageTypes: ['wyrd'], resolution: 'DICE' } },
  { suffix: 'silent_procession', name: 'Silent Procession', level: 4, ap: 2, target: 'ally', effectTypes: ['buff'], description: 'Up to two allied manifestations within 30 ft move 10 ft in the same direction. Each uses its own remaining movement and cannot end closer to an enemy than it began.', op: 'dead.procession', args: { maxTargets: 2, moveFeet: 10, mustEndNoCloser: true } },
  { suffix: 'marrow_mend', name: 'Marrow Mend', level: 4, ap: 2, target: 'ally', effectTypes: ['healing'], description: 'Restore 1d6 vitality to one manifestation within 5 ft, up to its maximum. This cannot restore a destroyed manifestation.', op: 'dead.mend', args: { rangeFeet: 5, healing: '1d6', destroyedEligible: false } },
  { suffix: 'coffin_nail', name: 'Coffin Nail', level: 4, ap: 2, target: 'enemy', effectTypes: ['control'], description: 'One enemy within 30 ft cannot take reactions until the end of its next turn. It may end this effect early by spending 10 ft of movement.', op: 'dead.pin', args: { rangeFeet: 30, reactionsBlocked: true, breakCostFeet: 10, expires: 'end-target-next-turn' } },
  { suffix: 'dead_drop', name: 'Dead Drop', level: 5, ap: 1, target: 'self', description: 'Transfer one prepared pattern to a willing ally within 30 ft. That ally may manifest it using their own action and your capacity; the pattern remains yours.', op: 'dead.transfer', args: { rangeFeet: 30, usesAllyAction: true, capacityOwner: 'caster', patternOwner: 'caster' } },
  { suffix: 'wardens_echo', name: "Warden's Echo", level: 5, ap: 2, target: 'ally', effectTypes: ['buff'], description: 'One manifestation within 30 ft gains +1 to one save or check before the start of your next turn. It cannot use this on a check to attack.', op: 'dead.echo', args: { rangeFeet: 30, bonus: 1, uses: 1, excludesAttack: true, expires: 'start-next-caster-turn' } },
  { suffix: 'tomb_rune', name: 'Tomb Rune', level: 5, ap: 2, target: 'enemy', effectTypes: ['control'], description: 'Place a visible rune in an adjacent space. The first enemy to enter it loses 10 ft of movement and the rune ends; no hidden trigger or damage.', op: 'dead.rune', args: { placementRangeFeet: 5, trigger: 'first-enemy-entry', movementPenaltyFeet: 10, damage: 0, visible: true } },
  { suffix: 'severed_command', name: 'Severed Command', level: 5, ap: 1, target: 'enemy', effectTypes: ['control'], description: 'One manifestation you control may immediately move 10 ft away from an enemy within 5 ft. This uses its command action; it cannot attack.', op: 'dead.command', args: { action: 'withdraw', moveFeet: 10, extraAction: false, attack: false } },
  { suffix: 'grave_tide', name: 'Grave Tide', level: 6, ap: 3, target: 'enemy', effectTypes: ['damage'], targetingConfig: { targetingType: 'multiple', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['enemy'], maxTargets: 2 }, description: 'Two enemies within 30 ft each take 2d6 wyrd. A manifestation cannot add damage to both targets.', op: 'dead.strike', args: { rangeFeet: 30, maxTargets: 2, baseDamage: '2d6', extraPerTarget: false }, damageConfig: { formula: '2d6', damageTypes: ['wyrd'], resolution: 'DICE' } },
  { suffix: 'bone_choir', name: 'Bone Choir', level: 6, ap: 2, target: 'ally', effectTypes: ['buff'], description: 'Allied manifestations within 30 ft gain +1 to their next command action check. This does not grant an action or stack with itself.', op: 'dead.choir', args: { rangeFeet: 30, bonus: 1, affects: 'manifestations', extraAction: false } },
  { suffix: 'ashen_escort', name: 'Ashen Escort', level: 6, ap: 2, target: 'ally', effectTypes: ['buff'], description: 'One ally within 30 ft ignores the first 5 ft of difficult terrain each turn while adjacent to a manifestation you control. No flight or wall passage.', op: 'dead.escort', args: { rangeFeet: 30, difficultTerrainFeet: 5, requiresAdjacentManifestation: true } },
  { suffix: 'final_roll_call', name: 'Final Roll Call', level: 6, ap: 2, target: 'ally', description: 'Name up to three allied manifestations within 60 ft and learn which are destroyed, exhausted or active. The answer must be truthful and public.', op: 'dead.read', args: { rangeFeet: 60, maxTargets: 3, reveals: ['destroyed', 'exhausted', 'active'] } },
  { suffix: 'deathless_drill', name: 'Deathless Drill', level: 7, ap: 2, target: 'ally', effectTypes: ['buff'], description: 'One manifestation within 30 ft gains one additional 5 ft of movement on its next command action. It still cannot exceed one command action per caster turn.', op: 'dead.command', args: { rangeFeet: 30, movementBonusFeet: 5, extraAction: false } },
  { suffix: 'ossuary_gate', name: 'Ossuary Gate', level: 7, ap: 2, target: 'self', description: 'Open a visible passage through one adjacent allied manifestation. You move 10 ft through its space; hostile creatures cannot follow.', op: 'dead.gate', args: { moveFeet: 10, throughAlly: true, hostilePassage: false } },
  { suffix: 'mourners_veil', name: "Mourner's Veil", level: 7, ap: 2, target: 'ally', effectTypes: ['buff'], description: 'One ally within 30 ft gains +2 to Stealth while within 5 ft of a manifestation. Bright light or direct observation still reveals them.', op: 'dead.veil', args: { rangeFeet: 30, stealthBonus: 2, requiresAdjacentManifestation: true, invisibility: false } },
  { suffix: 'relentless_march', name: 'Relentless March', level: 7, ap: 2, target: 'ally', description: 'One willing ally within 30 ft moves 15 ft toward a visible enemy. This uses the ally reaction and cannot pass through occupied spaces.', op: 'dead.guide', args: { rangeFeet: 30, moveFeet: 15, consumesReaction: true, mustApproach: true } },
  { suffix: 'sepulcher_seal', name: 'Sepulcher Seal', level: 8, ap: 3, target: 'enemy', effectTypes: ['control'], description: 'One enemy within 30 ft is rooted until the end of its next turn. It can break free by spending its action; no repeated save.', op: 'dead.seal', args: { rangeFeet: 30, root: true, breakAction: true, expires: 'end-target-next-turn' } },
  { suffix: 'grave_harvest', name: 'Grave Harvest', level: 8, ap: 3, target: 'enemy', effectTypes: ['damage'], description: 'One enemy within 30 ft takes 3d6 wyrd. If it drops to 0 HP, one manifestation you control regains 1 vitality; no new manifestation is created.', op: 'dead.harvest', args: { rangeFeet: 30, baseDamage: '3d6', onDefeatVitality: 1, createsManifestation: false }, damageConfig: { formula: '3d6', damageTypes: ['wyrd'], resolution: 'DICE' } },
  { suffix: 'silent_legion', name: 'Silent Legion', level: 8, ap: 3, target: 'ally', effectTypes: ['buff'], description: 'Up to two allied manifestations within 30 ft each gain +1 to their next save. This is one use each and does not stack.', op: 'dead.legion', args: { rangeFeet: 30, maxTargets: 2, saveBonus: 1, usesPerTarget: 1 } },
  { suffix: 'last_rites', name: 'Last Rites', level: 8, ap: 2, target: 'ally', effectTypes: ['healing'], description: 'Restore 2d6 vitality to one manifestation within 30 ft and end one exhaustion on it. Cannot revive a destroyed pattern.', op: 'dead.mend', args: { rangeFeet: 30, healing: '2d6', removesExhaustion: 1, destroyedEligible: false } },
  { suffix: 'deaths_ledger', name: "Death's Ledger", level: 9, ap: 2, target: 'self', description: 'Record the exact vitality, capacity and orders of your manifestations. The ledger reveals only what is already true and cannot predict future orders.', op: 'dead.read', args: { rangeFeet: 60, reveals: ['vitality', 'capacity', 'orders'], prediction: false } },
  { suffix: 'ossuary_crown', name: 'Ossuary Crown', level: 9, ap: 3, target: 'ally', effectTypes: ['buff'], description: 'One manifestation within 30 ft gains +2 to one attack or save before the end of your next turn. It still has one command action.', op: 'dead.crown', args: { rangeFeet: 30, bonus: 2, uses: 1, expires: 'end-next-caster-turn', extraAction: false } },
  { suffix: 'charnel_storm', name: 'Charnel Storm', level: 9, ap: 3, target: 'enemy', effectTypes: ['damage'], targetingConfig: { targetingType: 'multiple', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['enemy'], maxTargets: 2 }, description: 'Two enemies within 30 ft each take 3d6 wyrd. The damage is one event per target and cannot be redirected to a manifestation.', op: 'dead.storm', args: { rangeFeet: 30, maxTargets: 2, damage: '3d6', perTargetEvent: true }, damageConfig: { formula: '3d6', damageTypes: ['wyrd'], resolution: 'DICE' } },
  { suffix: 'unbroken_muster', name: 'Unbroken Muster', level: 9, ap: 3, target: 'ally', effectTypes: ['buff'], description: 'Up to two manifestations within 30 ft that are exhausted become ready to receive orders again. No vitality is restored and capacity is unchanged.', op: 'dead.muster', args: { rangeFeet: 30, maxTargets: 2, clearsExhaustion: true, restoreVitality: 0 } },
  { suffix: 'last_roll', name: 'The Last Roll', level: 10, ap: 3, target: 'ally', effectTypes: ['buff'], targetingConfig: { targetingType: 'multiple', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['ally', 'self'], maxTargets: 2 }, description: 'Two allies within 30 ft may each use one reaction to move 10 ft or make one ordinary attack. No extra action is granted.', op: 'dead.last-roll', args: { rangeFeet: 30, maxTargets: 2, options: ['move', 'attack'], reaction: true } },
  { suffix: 'tomb_of_names', name: 'Tomb of Names', level: 10, ap: 3, target: 'enemy', effectTypes: ['control'], description: 'One enemy within 30 ft is frightened of one manifestation you control until the end of its next turn. It may repeat the save when it takes damage.', op: 'dead.names', args: { rangeFeet: 30, condition: 'frightened', source: 'manifestation', repeatOnDamage: true } },
  { suffix: 'march_of_dead', name: 'March of the Dead', level: 10, ap: 3, target: 'ally', effectTypes: ['buff'], targetingConfig: { targetingType: 'multiple', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['ally'], maxTargets: 3 }, description: 'Up to three allied manifestations within 30 ft move 10 ft. Each uses its own movement and must remain within command range.', op: 'dead.march', args: { rangeFeet: 30, maxTargets: 3, moveFeet: 10, perManifestationMovement: true } },
  { suffix: 'final_testament', name: 'Final Testament', level: 10, ap: 3, target: 'self', description: 'Publish a binding order that lasts until the start of your next turn: one named manifestation may take one extra command action. At the end of that turn it loses 1 vitality.', op: 'dead.testament', args: { duration: 'start-next-caster-turn', extraCommand: 1, endVitalityCost: 1, noFreeSummon: true } }
];

const treeRows = {
  'grave-marshal': [
    ['command_voice', 'Command Voice', [5, 10, 15], 'orders.rangeBonusFeet', 'Increase the range of your orders by {v} ft.'],
    ['bone_sight', 'Bone Sight', [5, 10, 15], 'manifestations.sightBonusFeet', 'Increase the distance at which you can perceive through an allied manifestation by {v} ft.'],
    ['steady_orders', 'Steady Orders', [1, 2, 3], 'orders.checkBonus', 'Add {v} to one check to keep a manifestation steady under pressure; no extra action.'],
    ['muster_drill', 'Muster Drill', [5, 10, 15], 'muster.movementBonusFeet', 'Add {v} ft to one formation movement granted by a muster record.'],
    ['quick_salute', 'Quick Salute', [1, 2, 3], 'orders.initiativeBonus', 'Add {v} to one initiative check while at least one manifestation is active; declared before rolling.'],
    ['grave_discipline', 'Grave Discipline', [1, 2, 3], 'orders.saveBonus', 'Add {v} to one save made by an allied manifestation; once per round.'],
    ['shared_orders', 'Shared Orders', [1, 2, 3], 'orders.helpBonus', 'Add {v} to one Help check made by a manifestation; it still consumes its command action.'],
    ['line_of_bones', 'Line of Bones', [1, 2, 3], 'formation.coverBonus', 'Grant one ally {v} cover against one ranged attack while adjacent to two allied manifestations.'],
    ['relentless_example', 'Relentless Example', [1, 2, 3], 'orders.frightenedSaveBonus', 'Add {v} to one save against fear for an ally within command range.'],
    ['silent_command', 'Silent Command', [1, 2, 3], 'orders.stealthBonus', 'Add {v} to one Stealth check to issue an order without being overheard.'],
    ['bone_harness', 'Bone Harness', [1, 2, 3], 'manifestations.carryCapacityBonus', 'Increase one manifestation carrying capacity by {v} slots; no extra attack.'],
    ['drumbeat', 'Drumbeat', [1, 2, 3], 'orders.rallyBonus', 'Add {v} to one rally or morale check made by an ally; no healing.'],
    ['veteran_retinue', 'Veteran Retinue', [1, 2, 3], 'manifestations.maxVitalityBonus', 'Increase one manifestation maximum vitality by {v}; current vitality does not change.'],
    ['grave_march', 'Grave March', [1, 2, 3], 'muster.difficultTerrainFeet', 'Ignore {v} ft of difficult terrain during one commanded move.'],
    ['last_order', 'Last Order', [1, 2, 3], 'orders.finalActionBonus', 'Add {v} to one command check made by a manifestation with 1 vitality remaining.'],
    ['unbroken_line', 'Unbroken Line', [1, 2, 3], 'formation.saveBonus', 'Add {v} to one save for an ally adjacent to two allied manifestations.']
  ],
  'soul-shepherd': [
    ['gentle_hand', 'Gentle Hand', [5, 10, 15], 'escort.rangeBonusFeet', 'Add {v} ft to the range of your escort and guidance records.'],
    ['last_comfort', 'Last Comfort', [1, 2, 3], 'manifestations.fearSaveBonus', 'Add {v} to one fear save made by an allied manifestation.'],
    ['soul_sight', 'Soul Sight', [10, 20, 30], 'soul.senseRangeFeet', 'Sense the presence of an intact soul anchor within {v} ft; no exact location or identity.'],
    ['escort_training', 'Escort Training', [1, 2, 3], 'escort.checkBonus', 'Add {v} to one check to guide an ally through danger; no free movement.'],
    ['quiet_passage', 'Quiet Passage', [1, 2, 3], 'escort.stealthBonus', 'Add {v} to one Stealth check made while escorting a willing ally.'],
    ['mourning_ward', 'Mourning Ward', [1, 2, 3], 'ward.capacityBonus', 'Add {v} capacity to one grave ward; cannot exceed the authored ward maximum by more than 3.'],
    ['shared_grief', 'Shared Grief', [1, 2, 3], 'ally.griefSaveBonus', 'Add {v} to one save against grief or despair for an ally within 30 ft.'],
    ['soul_tether', 'Soul Tether', [5, 10, 15], 'tether.rangeBonusFeet', 'Add {v} ft to the range at which you can maintain an escort tether.'],
    ['final_words', 'Final Words', [1, 2, 3], 'last-rite.checkBonus', 'Add {v} to one check to deliver last rites or record a dying statement.'],
    ['calm_the_restless', 'Calm the Restless', [1, 2, 3], 'restless.savePenalty', 'Reduce one restless spirit save penalty by {v}; does not create a new spirit.'],
    ['shepherds_crook', "Shepherd's Crook", [1, 2, 3], 'escort.grappleBonus', 'Add {v} to one check to pull a willing ally free of a grapple; no extra attack.'],
    ['burden_bearer', 'Burden Bearer', [1, 2, 3], 'escort.carryBonus', 'Add {v} to one carrying or drag check while escorting an ally.'],
    ['grave_tenderness', 'Grave Tenderness', [1, 2, 3], 'mend.vitalityBonus', 'Restore {v} additional vitality with one mend record; never above maximum.'],
    ['threshold_sense', 'Threshold Sense', [1, 2, 3], 'threshold.checkBonus', 'Add {v} to one check to notice an active threshold or anchor.'],
    ['soul_ledger', 'Soul Ledger', [1, 2, 3], 'soul.recordRecallMax', 'Recall the public terms of up to {v} soul records; no hidden information.'],
    ['last_road', 'Last Road', [1, 2, 3], 'escort.difficultTerrainFeet', 'Ignore {v} ft of difficult terrain during one escorted move.']
  ],
  'ossuary-architect': [
    ['bone_joinery', 'Bone Joinery', [5, 10, 15], 'construct.rangeBonusFeet', 'Add {v} ft to the range at which you can place one visible bone construct.'],
    ['grave_masonry', 'Grave Masonry', [1, 2, 3], 'construct.coverBonus', 'Add {v} cover to one ally behind a bone construct; no full cover from an open frame.'],
    ['vault_sense', 'Vault Sense', [10, 20, 30], 'vault.senseRangeFeet', 'Sense the nearest sealed vault or tomb within {v} ft; no secret opening is revealed.'],
    ['ossuary_brace', 'Ossuary Brace', [1, 2, 3], 'construct.stabilityBonus', 'Add {v} to one check to keep a bone construct standing.'],
    ['tomb_geometry', 'Tomb Geometry', [1, 2, 3], 'construct.placementBonus', 'Add {v} to one check to place a construct in a cramped or unstable space.'],
    ['silent_vault', 'Silent Vault', [1, 2, 3], 'construct.stealthBonus', 'Add {v} to one Stealth check involving a bone construct; no invisibility.'],
    ['grave_foundation', 'Grave Foundation', [1, 2, 3], 'construct.maxVitalityBonus', 'Increase one bone construct maximum vitality by {v}; current vitality does not change.'],
    ['reliquary', 'Reliquary', [1, 2, 3], 'reliquary.recallMax', 'Store and recall the public identity of up to {v} relics; no hidden ownership.'],
    ['charnel_arch', 'Charnel Arch', [5, 10, 15], 'construct.archWidthFeet', 'Increase one arch opening by {v} ft; it still cannot block a legal path.'],
    ['bone_lock', 'Bone Lock', [1, 2, 3], 'construct.lockCheckBonus', 'Add {v} to one check to hold a door or gate with a construct.'],
    ['dust_settling', 'Dust Settling', [1, 2, 3], 'construct.perceptionPenalty', 'Impose -{v} on one Perception check through a dust-filled ossuary space.'],
    ['memorial_mark', 'Memorial Mark', [1, 2, 3], 'memorial.recallMax', 'Read the public inscription on up to {v} memorial marks; no private text.'],
    ['vault_guardian', 'Vault Guardian', [1, 2, 3], 'construct.guardBonus', 'Add {v} to one guard check made by an ossuary construct.'],
    ['collapsing_frame', 'Collapsing Frame', [1, 2, 3], 'construct.collapseSavePenalty', 'Impose -{v} on one save against a collapsing bone frame; one event only.'],
    ['silent_city', 'Silent City', [1, 2, 3], 'construct.countBonus', 'Treat one additional visible bone construct as cover for one ally; no extra construct.'],
    ['final_foundation', 'Final Foundation', [1, 2, 3], 'construct.repairBonus', 'Add {v} to one repair of a bone construct; no free repair or vitality refill.']
  ]
};

const trees = [
  { id: 'grave-marshal', name: 'Grave Marshal', stem: 'grave_marshal', short: 'gm', signatureId: 'coordinated_muster', capstoneId: 'muster_eternal', signatureNode: 'cr1_deathcaller_grave_marshal_signature', capstoneNode: 'cr1_deathcaller_grave_marshal_capstone', tagline: 'Turn a prepared dead pattern into a disciplined, bounded formation.', rows: treeRows['grave-marshal'] },
  { id: 'soul-shepherd', name: 'Soul Shepherd', stem: 'soul_shepherd', short: 'ss', signatureId: 'veil_escort', capstoneId: 'last_road', signatureNode: 'cr1_deathcaller_soul_shepherd_signature', capstoneNode: 'cr1_deathcaller_soul_shepherd_capstone', tagline: 'Guide the living and the manifested dead without claiming their souls.', rows: treeRows['soul-shepherd'] },
  { id: 'ossuary-architect', name: 'Ossuary Architect', stem: 'ossuary_architect', short: 'oa', signatureId: 'bone_bastion', capstoneId: 'silent_city', signatureNode: 'cr1_deathcaller_ossuary_architect_signature', capstoneNode: 'cr1_deathcaller_ossuary_architect_capstone', tagline: 'Build a visible bastion from bone, memory and exact geometry.', rows: treeRows['ossuary-architect'] }
];

const signatureNames = {
  coordinated_muster: 'Coordinated Muster',
  veil_escort: 'Veil Escort',
  bone_bastion: 'Bone Bastion'
};
const capstoneNames = {
  muster_eternal: 'The Muster Eternal',
  last_road: 'The Last Road',
  silent_city: 'The Silent City'
};
const capstones = [
  { suffix: 'muster_eternal', name: 'The Muster Eternal', treeId: 'grave-marshal', ap: 3, target: 'ally', effectTypes: ['buff'], op: 'dead.muster-eternal', args: { rangeFeet: 30, maxTargets: 2, extraCommand: 1, vitalityCost: 1, duration: 'start-next-caster-turn' }, description: 'Two allied manifestations each receive one additional command action until the start of your next turn; each loses 1 vitality when the effect ends. No extra manifestation or turn is created.' },
  { suffix: 'last_road', name: 'The Last Road', treeId: 'soul-shepherd', ap: 3, target: 'ally', effectTypes: ['utility'], op: 'dead.last-road', args: { rangeFeet: 60, escortTargets: 3, moveFeet: 15, difficultTerrain: 10, expires: 'end-next-caster-turn' }, description: 'Up to three willing allies within 60 ft may move 15 ft along one declared route and ignore 10 ft of difficult terrain. Each uses its reaction; no teleport or free attack.' },
  { suffix: 'silent_city', name: 'The Silent City', treeId: 'ossuary-architect', ap: 3, target: 'ally', effectTypes: ['buff'], op: 'dead.silent-city', args: { rangeFeet: 30, maxTargets: 3, coverValue: 3, duration: 'start-next-caster-turn', constructRequired: true }, description: 'Up to three allies within 30 ft gain 3 points of cover from visible bone structures until the start of your next turn. An open path remains open; this is not a wall.' }
];

const resource = makeCr1ResourceSystem({
  classId: 'deathcaller',
  id: 'dead-muster',
  name: 'Dead Muster',
  shortName: 'Muster',
  type: 'dead_muster',
  description: 'Up to three prepared patterns, two active manifestations, two orders per own turn. Manual tabletop only; no automatic summon, command, vitality or recovery.',
  mechanics: { initialized: false, current: 0, max: 2, state: null, consumeVerb: 'order', gainVerb: 'prepare' },
  tooltip: { title: 'Dead Muster - manual tabletop', description: 'Prepared patterns and active manifestations are a recorded manual state. No manifestation is created, moved, healed or expired automatically.' },
  rules: {
    preparedMax: 3, capacityMax: 2, ordersPerOwnTurn: 2, manifestationsMax: 2,
    actorActionMaxPerCasterOwnTurn: 1, questionsMax: 2, vitalityMin: 0, vitalityMax: 10,
    timing: 'Own turn only; preparation precedes manifestation; a manifestation cannot act without an order.',
    recovery: 'Exhausted patterns recover only at a completed rest or authored effect. No reconnect, initiative or class-change refill.',
    manualOnly: true
  }
});

const built = createCr1Package({
  classId: 'deathcaller', className: 'Deathcaller', icon: DEATHCALLER_ICON,
  manualNotice: DEATHCALLER_MANUAL_NOTICE,
  description: 'A disciplined commander of prepared dead patterns, bounded by preparation, capacity and orders.',
  overview: {
    title: 'The Deathcaller',
    subtitle: 'Every retainer is prepared before it is called.',
    description: 'Reserve up to three named dead patterns, manifest at most two, and spend no more than two orders on your own turn. The dead do not gain free turns or hidden resources.',
    quickOverview: 'Three prepared patterns, two active manifestations, two orders per own turn. Manual tabletop only.',
    playstyle: 'Prepare the pattern, declare its exact template, manifest it in a legal space, and issue bounded orders. Recovery is a recorded rest event.',
    roleplayIdentity: 'A steward of remains and memory, not a ruler of souls.',
    currentCrisis: 'HeadQ-review-R1 proposed class; no native heritage effect is registered.'
  },
  manifestSpells: DEATHCALLER_MANIFEST_SPELLS,
  coreIds: ['cr1_deathcaller_manifest_retainer', 'cr1_deathcaller_grave_order'],
  optionalPayloadIds: ['cr1_deathcaller_last_testimony'],
  optionalRows, capstones, trees, signatureNames, capstoneNames, resource,
  heritageRecommendation: ['clean_vreken', 'velun_neth'],
  acquisitionRequirements: [
    { id: 'witnessed_manifestation', description: 'Witness one actual manifested dead pattern under a competent custodian.' },
    { id: 'grave_order_training', description: 'Complete supervised training in preparation, manifestation and bounded orders.' },
    { id: 'vitality_accounting', description: 'Maintain an exact public pattern-vitality and capacity record through one full session.' },
    { id: 'rest_recovery_training', description: 'Demonstrate recorded rest recovery without automatic refill.' }
  ]
});

export const DEATHCALLER_TREES = built.trees;
export const DEATHCALLER_TALENT_NODES = built.nodes;
export const DEATHCALLER_PASSIVE_RECORDS = built.passiveRecords;
export const DEATHCALLER_CORE_RECORDS = built.coreRecords;
export const DEATHCALLER_OPTIONAL_RECORDS = built.optionalRecords;
export const DEATHCALLER_TALENT_ACTIVES = built.talentActives;
export const DEATHCALLER_AUTHORED_RECORDS = built.authoredRecords;
export const DEATHCALLER_PROJECTED_SPELLS = built.projectedSpells;
export const DEATHCALLER_PROJECTED_SPELLS_BY_ID = built.projectedById;
export const DEATHCALLER_SPELL_POOLS = built.spellPools;
export const DEATHCALLER_PROGRESSION_POLICY = built.progressionPolicy;
export const DEATHCALLER_RESOURCE_SYSTEM = resource;
export const DEATHCALLER_RESOURCE_RULES = resource.rules;
export const DEATHCALLER_RESOURCE_DEFINITION = resource.resourceDefinition;
export const validateDeathcallerState = resource.validate;
export const projectDeathcallerResource = resource.project;
export const pruneDeathcallerTalents = (talents, level) => pruneCr1Talents(talents, level, DEATHCALLER_TALENT_NODES);

export const DEATHCALLER_DATA = {
  ...built.data,
  equipment: { weapons: ['staff', 'dagger'], protectiveGear: ['robes', 'light_ward'], offHand: ['empty', 'tome'] },
  subraceVariants: {},
  specializations: {
    title: 'Three Muster Disciplines',
    description: 'Choose a primary tree. Five talent points per level; signatures require ten same-tree points at level three, capstones forty-five at level ten.',
    specs: DEATHCALLER_TREES.map(tree => ({ id: tree.id, name: tree.name, icon: DEATHCALLER_ICON, theme: tree.tagline, description: tree.tagline, playstyle: tree.tagline }))
  },
  characterCreation: {
    title: 'Deathcaller',
    description: 'Choose one level-1 optional; Manifest Retainer and Grave Order are core grants. Record preparation and manifestation state manually.'
  }
};

export const DEATHCALLER_MANIFEST = built.manifest;
export default DEATHCALLER_DATA;
