import { GAMBLER_TREE_META, GAMBLER_TREES, GAMBLER_TALENT_NODES, GAMBLER_PASSIVE_RECORDS, GAMBLER_TALENT_CAPACITY } from '../talentTrees/gambler';

export const GAMBLER_CLASS_ID = 'gambler';
export const GAMBLER_RULESET_VERSION = 'cr-review-r1';
export const GAMBLER_ICON = 'Psychic/Psychic Telepathy';
export const GAMBLER_MANUAL_NOTICE = 'Manual tabletop only. No automatic AP, HP, movement, card, Fortune, ward or wager settlement.';
const flags = { classId: GAMBLER_CLASS_ID, rulesetVersion: GAMBLER_RULESET_VERSION, authoredOnly: true, manualOnly: true, executionEnabled: false, applicationMode: 'manual-tabletop', automatedCapabilities: [], manualNotice: GAMBLER_MANUAL_NOTICE };
const id = suffix => `cr1_gambler_${suffix}`;
const NEXT = 'next_caster_turn_start';
const instant = { durationType: 'instant', durationValue: 0, durationUnit: 'instant' };
const nextStart = { durationType: 'own_turns', durationValue: 1, durationUnit: NEXT };
const self = { targetingType: 'self', rangeType: 'self', rangeDistance: 0, targetRestrictions: ['self'], maxTargets: 1 };
const target = (roles, maxTargets = 1, rangeDistance = 30) => ({ targetingType: maxTargets > 1 ? 'multiple' : 'single', rangeType: 'ranged', rangeDistance, targetRestrictions: roles, maxTargets });
const ally = (n = 1) => target(['ally', 'self'], n);
const enemy = (n = 1, feet = 30) => target(['enemy'], n, feet);
const somaticText = 'Present the class focus and deliberately declare the operation; its exact choices precede resolution.';
const apCost = actionPoints => ({ actionPoints, mana: 0, resourceTypes: ['actionPoints'], resourceValues: { actionPoints, mana: 0 }, useFormulas: {}, components: ['somatic'], somaticText });
const damage = formula => ({ formula, damageTypes: ['wyrd'], resolution: 'DICE' });

// Exact R1 spell payloads. Projection keeps these objects intact as authoredSpell
// under the existing specialMechanics namespace; RESOURCE_PROGRAM is not admitted.
const r1 = (suffix, name, description, level, ap, targetingConfig, effectTypes, op, args, extra = {}) => ({
  id: id(suffix), classId: 'gambler', rulesetVersion: 'cr-review-r1', name, description, level,
  specialization: null, spellType: 'ACTION', icon: GAMBLER_ICON,
  typeConfig: { school: 'wyrd', castTimeType: 'IMMEDIATE', tags: ['gambler', 'class-feature'] },
  resourceCost: apCost(ap), targetingConfig, effectTypes, resolution: 'RESOURCE_PROGRAM', damageConfig: null,
  durationConfig: instant, cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
  classResourceProgram: { version: 1, domain: 'gambler-hand', op, args },
  reactionTiming: null, savingThrow: null, conditions: [], area: null, ...extra
});
const wardTerms = { capacity: 4, uses: 1, stacking: 'replace-with-higher-not-add', expires: 'start-next-caster-own-turn', applies: 'original-damage-after-normal-mitigation-before-fate-routing-and-temp-hp' };
export const GAMBLER_R1_SPELLS = [
  r1('wager_strike', 'Wager Strike', 'Play one card and stake Fortune before a 2d6 wager. On 8+, return twice the stake and add the stake to this strike; on loss the stake is gone.', 1, 2, enemy(), ['damage'], 'wager.attack', {
    stakeMin: 1, stakeMax: 2, handCards: 1, roll: { dice: 2, sides: 6, winTotalMin: 8 }, payoutMultiplier: 2,
    baseDamage: '1d8 + 1', winDamagePerStake: 1, lossDamage: '1d8 + 1', fortuneCap: 7, unresolvedWagerLimit: 1, attackProfile: 'direct-DICE-GM-adjudicated'
  }, { damageConfig: damage('1d8 + 1') }),
  r1('recut', 'Recut', 'Once on your own turn discard up to two cards, reshuffle discard only if the deck is empty, then draw into up to two empty sockets. If broke and you actually discarded a card, recover one Fortune.', 1, 1, self, ['utility'], 'hand.recut', {
    discardMin: 0, discardMax: 2, drawMax: 2, handMax: 5, shuffleOnlyWhenDeckEmpty: true, shuffleHeldOrEscrow: false,
    brokeRecovery: { requiresFortune: 0, requiresDiscardAtLeast: 1, gain: 1 }, maxPerOwnTurn: 1
  }, { cooldownConfig: { cooldownType: 'own_turn', cooldownValue: 1 } }),
  r1('read_table', 'Read the Table', 'Inspect the next card of your own deck and one publicly observable tell of a game or wager. You learn no hidden opponent cards and do not change deck order.', 2, 1, self, ['utility'], 'table.read', {
    peekTop: 1, changeOrder: false, hiddenOpponentKnowledge: false, requiresObservableGame: true, maxPerOwnTurn: 1
  }, { cooldownConfig: { cooldownType: 'own_turn', cooldownValue: 1 } }),
  r1('double_or_nothing', 'Double or Nothing', 'Play one card and stake exactly three Fortune on a harder 2d6 wager. On 9+, return three times the stake and deliver the larger published strike; otherwise lose the stake.', 3, 3, enemy(), ['damage'], 'wager.high-roll', {
    stake: 3, handCards: 1, roll: { dice: 2, sides: 6, winTotalMin: 9 }, payoutMultiplier: 3, winDamage: '2d8 + 3', lossDamage: '1d8 + 1', fortuneCap: 7, unresolvedWagerLimit: 1, attackProfile: 'direct-DICE-GM-adjudicated'
  }, { specialization: 'high-roller' }),
  r1('marked_pair', 'Marked Pair', 'Expose and discard two cards of the same rank to place a four-point one-use luck ward on one ally. The ward is not healing or a second Fortune bank.', 3, 1, ally(), ['buff'], 'hand.marked-pair', {
    cards: 2, pattern: 'same-rank', ward: wardTerms
  }, { specialization: 'card-sharp', durationConfig: nextStart, conditions: [{ kind: 'next-damage-ward', capacity: 4, uses: 1, expires: 'start-next-caster-own-turn', stacking: 'higher-only' }] }),
  r1('underwrite', 'Underwrite', 'Before an ally rolls, stake Fortune and one card against that ally’s next eligible original single-d8 damage roll. Face5–8 pays the wager and adds two raw damage before mitigation; otherwise the stake is lost.', 3, 1, ally(), ['utility'], 'wager.underwrite', {
    stakeMin: 1, stakeMax: 2, handCards: 1,
    event: { kind: 'original-damage-roll', dice: 1, sides: 8, eligibleFaces: [5, 6, 7, 8], excludeDerived: true },
    payoutMultiplier: 2, winDamageBonus: 2, winDamageBonusTiming: 'raw-after-critical-base-before-mitigation',
    expiry: 'start-next-caster-own-turn', expiredOrCancelled: 'lose-stake', unresolvedWagerLimit: 1
  }, { specialization: 'odds-broker', durationConfig: nextStart })
];

export const GAMBLER_COMMON_MECHANICS = {
  price: 'AP and mana are explicit; class contents are typed manual prices, never duplicated as a legacy scalar resource cost.',
  commitment: 'Validate all exact targets, cards, patterns and available Fortune before commitment. Costs precede private inspection/results. Later allowed ordering/selection is a retained resolution choice, never refundable preview.',
  conservation: '20 unique cards; each exactly once in deck/hand/discard/pending-wager. Hand <=5. Available Fortune plus unresolved escrow <=7. One unresolved parent wager.',
  optionalWager: '2d6 >=8 returns twice stake, otherwise zero. One payout per action regardless of target count. Overflow discarded. Exact choices precede roll; cards settle once.',
  damage: 'Wyrd; direct-DICE-GM-adjudicated. Ordinary defenses/geometry remain GM-confirmed. Added damage is raw after original critical calculation before mitigation, not multiplied again and not a new event.',
  ward: 'Next positive original damage after normal mitigation before Fate routing/temp HP; never transferred burden. Capacity per use; unused capacity lost. One active Gambler ward per recipient; larger per-event capacity replaces smaller, equal/smaller does not overwrite. Validate eligibility before commitment.',
  checks: 'One specified otherwise legal check, declared before rolling. Highest Gambler bonus to the same check, not sum. No guaranteed success or invented evidence.',
  movement: 'Immediate voluntary movement using remaining legal allowance, confirmed path and normal consequences. No free pool, teleport, disengage or ignored obstacle.',
  information: 'Owned cards, accessible records and genuinely observable facts only. No mind reading, future certainty, missing evidence or hidden opponent cards.',
  timing: 'Own-turn IDs and explicit completed long rests only. Noncombat uses actual GM-adjudicated activity time, never invented refresh loops. No reconnect/initiative/class-change refill.',
  pending: 'New card/Fortune-changing actions require an empty wager slot. Retained R1 restrictions remain unchanged. Unknown outcomes retain exact escrow/cards/results for same-action reconciliation.',
  native: 'Merryn/Alchemite are approved trained native traditions. All four acquisition requirements remain documented. Mechanical heritage benefits are pending, not baseline curses or free generation.'
};
const ward = (capacity, uses = 1, expiry = NEXT) => ({ kind: 'next-damage-ward', capacity, uses, expiry, stacking: 'higher-only', timing: 'after-mitigation-before-fate-and-temp-hp', transferredBurdenEligible: false });
const move = distanceFeet => ({ kind: 'voluntary-movement', distanceFeet, consumesRemainingAllowance: true, teleport: false, disengage: false });
const check = (skill, bonus, scope) => ({ kind: 'check-bonus', skill, bonus, checks: 1, expiryMinutes: 10, scope, stacking: 'highest', suppliesEvidence: false });
const price = (cards, fortune, pattern = null) => ({ cards: { count: cards, pattern, from: 'hand', to: 'discard' }, fortune: { kind: 'consume', amount: fortune }, requiresEmptyWagerSlot: cards > 0 || fortune > 0 });
const wager = (min, max, win, loss) => ({
  kind: 'wager', stakeMin: min, stakeMax: max, dice: 2, sides: 6, winTotalMin: 8, payoutMultiplier: 2,
  outcomes: { win, loss }, unresolvedParentMax: 1, payoutsPerAction: 1, discardOnce: true
});
const action = (level, suffix, name, ap, cards, fortune, targetingConfig, effects, description, options = {}) => ({
  ...flags, id: id(suffix), name, level, specialization: null, source: 'optional', spellType: 'ACTION', icon: GAMBLER_ICON,
  resourceCost: { actionPoints: ap, mana: 0 }, targetingConfig, effectTypes: effects.some(e => (e.kind === 'wager' && (e.outcomes.win.damage || e.outcomes.loss.damage)) || e.kind === 'damage-bonus') ? ['damage', 'utility'] : ['utility'],
  damageConfig: null, durationConfig: instant, cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
  reactionTiming: null, savingThrow: null, conditions: [], area: null,
  description, manualMechanics: { price: price(cards, fortune), effects }, sourceRefs: ['Accepted Gambler G1 §1.3'], ...options
});
const minutes = { durationType: 'minutes', durationValue: 10, durationUnit: 'minutes' };
const turnOnce = { cooldownType: 'own_turn', cooldownValue: 1 };
const optional = [
  action(1, 'lucky_toss', 'Lucky Toss', 2, 1, 0, enemy(), [wager(1, 1, { damage: damage('1d8 + 2') }, { damage: null })], 'One card and one Fortune escrow; 2d6 >=8 returns 2 Fortune and deals 1d8 + 2 wyrd, otherwise no return and zero damage. One instant wager.'),
  action(1, 'beginners_cover', 'Beginner’s Cover', 1, 1, 0, ally(), [ward(2)], 'Discard one actual card; one willing ally including self within 30ft receives ward 2, one original damage use until next caster own-turn start. No Fortune gain.', { durationConfig: nextStart }),
  action(1, 'cheats_sleight', 'Cheat’s Sleight', 1, 1, 0, self, [check('sleight_of_hand', 2, 'One declared hand-held object')], 'Discard one card for +2 to the next otherwise legal Sleight of Hand check involving one declared hand-held object within 10 minutes. Never automatically steals, moves, duplicates or conceals it.', { durationConfig: minutes }),
  action(1, 'stakeholder_read', 'Read the Stakeholders', 1, 0, 0, self, [{ kind: 'observable-information', exchangeMax: 1, rangeFeet: 30, fields: ['public stake', 'settlement condition', 'cancellation terms'], omissionsPerExchange: 1, repeatedWithoutMaterialChange: 'no-new-information' }], 'Inspect one visible wager/exchange within 30ft. GM identifies one observable omission or inconsistency, if present, in publicly stated stake/settlement/cancellation terms. No hidden terms or truth detection; repeats need a material change.'),
  GAMBLER_R1_SPELLS[2],
  action(2, 'gamblers_insight', 'Gambler’s Insight', 1, 1, 0, self, [check('insight', 2, 'Observable conduct of one actor within 30ft')], 'Discard one card for +2 to one Insight check about one observed actor’s conduct within 30ft, used within 10 minutes. No lie detection, private intentions or memories.', { durationConfig: minutes }),
  action(2, 'fools_gold', 'Fool’s Gold', 1, 1, 1, { targetingType: 'single', rangeType: 'touch', rangeDistance: 0, targetRestrictions: ['object', 'unattended-or-consenting-holder'], maxTargets: 1 }, [{ kind: 'visual-illusion', objectMaxSize: 'hand-sized', appearances: ['coins', 'gaming counters', 'jewelry'], durationMinutes: 10, materialChange: false, physicalExamination: 'exposes-mismatch', copiesCredentials: false }], 'One card and one Fortune: visually disguise one real hand-sized object as coins, gaming counters or jewelry for 10 minutes. Unattended object or consenting holder, touch. No weight/material/value/writing/magic/credential change; physical examination exposes the mismatch. Observation is GM-adjudicated.', { durationConfig: minutes }),
  action(2, 'cut_deck', 'Cut the Deck', 1, 1, 0, self, [{ kind: 'card-zone', discardChosen: 1, drawTop: 1, deckRequired: 1, shuffle: false, inspect: false }], 'Once per own turn, discard exactly one chosen hand card, draw the actual top card into its socket. Requires one deck card; no inspection, selection among draws or shuffle.', { cooldownConfig: turnOnce }),
  action(3, 'dice_dart', 'Dice Dart', 2, 1, 0, enemy(1, 60), [wager(1, 2, { damage: damage('2d6 + stake') }, { damage: damage('1d6') })], 'One card, 1–2 Fortune escrow, one enemy within 60ft. 2d6 >=8 returns twice stake and deals 2d6 + stake wyrd; loss returns zero and deals 1d6. Settle once.'),
  action(3, 'matched_step', 'Matched Step', 1, 2, 0, ally(), [move(10)], 'Discard an exact equal-rank pair. One willing ally including self within 30ft immediately moves up to 10ft using remaining legal movement. No ward or Fortune gain.', { manualPattern: 'same-rank' }),
  action(3, 'poker_face', 'Poker Face', 1, 1, 1, self, [check('deception', 2, 'Conceal one declared motive or maintain one bluff')], 'One card and one Fortune: +2 to one Deception check to conceal a declared motive or maintain a bluff within 10 minutes. No immunity to interrogation, evidence, observation or magic.', { durationConfig: minutes }),
  action(3, 'dead_pot_etiquette', 'Dead Pot Etiquette', 1, 1, 0, self, [check('persuasion', 2, 'Mutually accepted parley/game/settlement with willing interlocutors within 30ft')], 'Discard one card for +2 to one Persuasion check within 10 minutes to establish a mutually accepted parley, game or safe settlement procedure with willing interlocutors within 30ft. No forced ceasefire, disarm or enforcement.', { durationConfig: minutes }),
  action(4, 'solitaires_guard', 'Solitaire’s Guard', 1, 1, 1, ally(), [ward(5)], 'One card and one Fortune; ward 5 on one willing ally including self within 30ft, one use until next caster own-turn start.', { durationConfig: nextStart }),
  action(4, 'mirage_flip', 'Mirage Flip', 2, 1, 0, self, [wager(1, 1, { ward: ward(7) }, { ward: ward(2) })], 'One card and one Fortune escrow. Declare before 2d6: 8+ returns 2 Fortune and self ward 7; loss returns zero and self ward 2. Both one use until next caster own-turn start. No foreign roll changes.', { durationConfig: nextStart }),
  action(4, 'spot_the_weight', 'Spot the Weight', 1, 0, 1, self, [check('investigation', 3, 'Physical weighting, marked surfaces, compartments or dealing faults in one actual touched gaming device')], 'Consume one Fortune for +3 to one Investigation check within 10 minutes on an actual gaming device at touch. Finds only physically supported weighting, marks, false compartments or dealing faults; attended devices require access/consent.', { durationConfig: minutes }),
  action(4, 'insured_exit', 'Insured Exit', 1, 1, 1, ally(), [move(10)], 'One card and one Fortune. One willing ally including self within 30ft immediately moves up to 10ft using remaining legal movement, with ordinary consequences and no refund or reaction immunity.'),
  action(5, 'hot_streak', 'Hot Streak', 2, 1, 2, self, [{ kind: 'damage-bonus', formula: '1d8', damageTypes: ['wyrd'], charges: 1, match: 'next-winning-optional-damaging-wager', lossConsumes: false, expiry: NEXT, perActionRecipients: 1, chosenBeforeRoll: true, stacking: 'replace-not-add' }], 'One card and two Fortune. Until next caster own-turn start, next winning optional damaging wager gains +1d8 raw wyrd after original critical calculation. One charge; losses do not consume it. Grand Wager names one recipient before rolling. No stacked charges, resource generation, core/signature/capstone change or new damage event.', { durationConfig: nextStart }),
  action(5, 'three_card_passage', 'Three-Card Passage', 2, 3, 0, ally(2), [move(15)], 'Discard three distinct consecutive ranks, suits unrestricted. Up to two willing allies including self, each within 30ft, immediately move up to 15ft using remaining legal movement.', { manualPattern: 'three-consecutive-ranks' }),
  action(5, 'open_ledger', 'Open Ledger', 1, 1, 0, self, [check('investigation', 2, 'Trace payment/arithmetic discrepancy/altered entry in one accessible touched ledger')], 'Discard one card: +2 to one Investigation check within 10 minutes examining one accessible ledger at touch, tracing payment, arithmetic or altered entry. No missing pages or proof of intent supplied.', { durationConfig: minutes }),
  action(5, 'safe_pot', 'Safe Pot', 2, 2, 1, ally(2), [ward(5)], 'An equal-rank pair and one Fortune give up to two willing allies including self within 30ft ward 5 each, one use until next caster own-turn start. No shared damage pool.', { manualPattern: 'same-rank', durationConfig: nextStart }),
  action(6, 'house_advantage', 'House Advantage', 2, 1, 2, ally(2), [{ ...check('investigation-or-persuasion', 2, 'One shared named game, negotiation or account'), chooseSkillPerRecipientBeforeCommitment: true }], 'One card and two Fortune. Up to two willing allies including self within 30ft each declare Investigation or Persuasion before commitment and gain +2 on their next such check about one shared named activity within 10 minutes. No attack/save bonus or enemy penalty.', { durationConfig: minutes }),
  action(6, 'twin_cut', 'Twin Cut', 1, 2, 0, self, [{ kind: 'card-zone', discardChosen: 2, drawTop: 2, deckRequired: 2, shuffle: false, discardMemoryException: 'one-eligible-preexisting-discard-replaces-one-draw' }], 'Once per own turn, discard two selected cards, draw the actual next two deck cards. Requires two deck cards, or one when learned Discard Memory legally replaces one draw. Receive exactly two; never shuffle or recover Fortune.', { cooldownConfig: turnOnce }),
  action(6, 'price_the_route', 'Price the Route', 1, 1, 1, self, [{ ...check('survival', 3, 'Visible travel hazards of one observed route segment within 60ft'), supportedVisibleHazardsOnSuccess: 1 }], 'One card and one Fortune: +3 to one Survival check within 10 minutes to appraise a visible route segment within 60ft. On success GM identifies one supported visible hazard and warning. No hidden-trap detection, safe-path guarantee or prediction.', { durationConfig: minutes }),
  action(6, 'sealed_reserve', 'Sealed Reserve', 1, 1, 1, self, [ward(4, 1, 'end-second-subsequent-caster-own-turn')], 'One card and one Fortune: self ward 4, one use, expiry end of the second subsequent caster own turn. Not stored Fortune or temp HP.', { durationConfig: { durationType: 'own_turns', durationValue: 2, durationUnit: 'subsequent_caster_turn_end' } }),
  action(7, 'death_roll', 'Death Roll', 3, 1, 0, enemy(), [wager(2, 2, { damage: damage('3d8 + 2') }, { damage: damage('1d8') })], 'One card and two Fortune escrow, one enemy within 30ft. 2d6 >=8 returns 4 Fortune and deals 3d8 + 2 wyrd; loss returns zero and deals 1d8. No death effect, self-damage or bankruptcy.'),
  action(7, 'escape_clause', 'Escape Clause', 2, 2, 1, ally(2), [move(15)], 'Discard any two distinct cards and one Fortune. Up to two willing allies including self within 30ft immediately move up to 15ft using remaining legal movement. No teleport, interception or delayed reaction.'),
  action(7, 'scrap_test', 'Scrap Test', 1, 1, 1, self, [check('intelligence', 3, 'Operating risk/tampering/game suitability of one actual touched device; normal tools/access required')], 'One card and one Fortune: +3 to one Intelligence-based check within 10 minutes to assess one touched device’s risk, tampering or suitability for a declared game. Actual access and normally required tools remain necessary; no repair or creation.', { durationConfig: minutes }),
  action(7, 'call_the_bluff', 'Call the Bluff', 1, 1, 1, self, [check('insight', 2, 'One explicit claim/wager declaration by an observed actor within 30ft')], 'One card and one Fortune: +2 to one Insight check within 10 minutes about one identified claim or wager declaration from an actor observed within 30ft. Evidence required, no compelled answer or automatic detection.', { durationConfig: minutes }),
  action(8, 'jackpot_guard', 'Jackpot Guard', 2, 3, 2, ally(3), [ward(7)], 'Three same-rank cards and two Fortune. Up to three willing allies including self within 30ft receive ward 7 each, one use until next caster own-turn start.', { manualPattern: 'three-same-rank', durationConfig: nextStart }),
  action(8, 'dealers_route', 'Dealer’s Route', 2, 3, 1, ally(3), [move(10)], 'Three same-suit cards and one Fortune. Self and up to two other willing allies within 30ft each immediately move up to 10ft using remaining legal movement. Pay cards once, not per recipient.', { manualPattern: 'same-suit' }),
  action(8, 'ledger_of_losses', 'Ledger of Losses', 1, 1, 1, self, [check('investigation', 4, 'Reconstruct recorded parties/stake/outcome/unpaid obligation of one named settled wager in accessible records at touch')], 'One card and one Fortune: +4 to one Investigation check within 10 minutes reconstructing one named settled wager from accessible touched records. No recreated memory, missing evidence or rewritten settlement.', { durationConfig: minutes }),
  action(8, 'table_sweep', 'Table Sweep', 1, 2, 1, self, [{ kind: 'card-zone', discardChosen: 2, inspectTopMax: 3, reorder: true, returnTo: 'top', drawTop: 0, deckRequired: 1, shuffle: false }], 'Once per own turn, discard two chosen hand cards and one Fortune, privately inspect up to the next three deck cards, choose their order and return those exact cards to top. Nonempty deck required; no draw or shuffle.', { cooldownConfig: turnOnce }),
  action(9, 'grand_wager', 'Grand Wager', 3, 2, 0, enemy(2), [wager(2, 2, { damage: damage('2d8 + 1'), perDeclaredTarget: true }, { damage: null })], 'Two cards and two Fortune escrow. Declare one or two distinct enemies within 30ft before one shared 2d6 roll: 8+ deals 2d8 + 1 wyrd to each and returns 4 Fortune TOTAL; loss gives zero damage/return. No target swaps or payout per target.'),
  action(9, 'merrowport_precedent', 'Merrowport Precedent', 2, 1, 1, self, [{ ...check('persuasion', 4, 'Restructure one actual identified obligation with willing creditor/debtor representatives within 30ft'), representativeMax: 3, actualConsentRequired: true }], 'One card and one Fortune: +4 to one Persuasion check within 10 minutes with up to three willing creditor/debtor representatives within 30ft about restructuring one existing obligation. Every affected party must consent; no erased debt or magical covenant.', { durationConfig: minutes }),
  action(9, 'five_card_audit', 'Five-Card Audit', 2, 0, 2, self, [{ kind: 'card-zone', inspectTopMax: 5, reorder: false, drawTop: 0, returnTo: 'same-order', deckRequired: 1, shuffle: false }], 'Two Fortune: privately inspect up to the actual next five deck cards and restore identical order. Nonempty deck required. No draw, selection, bottoming, shuffle or changed result.'),
  action(9, 'layered_collateral', 'Layered Collateral', 2, 2, 1, ally(), [ward(4, 2, 'end-second-subsequent-caster-own-turn')], 'An equal-rank pair and one Fortune give one willing ally including self within 30ft one ward with capacity 4 PER USE and exactly two uses. Each original eligible event consumes one use; unused capacity lost. Expiry end of second subsequent caster turn. Not two stackable wards.', { manualPattern: 'same-rank', durationConfig: { durationType: 'own_turns', durationValue: 2, durationUnit: 'subsequent_caster_turn_end' } }),
  action(10, 'final_pot', 'Final Pot', 3, 3, 0, enemy(), [wager(1, 2, { damage: damage('4d8 + stake') }, { damage: damage('1d8') })], 'Three distinct cards of any ranks/suits and 1–2 Fortune escrow. One enemy within 30ft: 2d6 >=8 returns twice stake and deals 4d8 + stake wyrd; loss returns zero and deals 1d8. No automatic critical or extra wager slot.'),
  action(10, 'blind_deal', 'Blind Deal', 2, 2, 2, self, [{ kind: 'card-zone', discardChosenBeforeCommitment: 2, inspectTopMax: 4, chooseForHand: 2, restTo: 'bottom-original-relative-order', deckRequired: 4, shuffle: false, oncePerCompletedLongRest: true }], 'Once per completed long rest: two AP, two selected hand cards and two Fortune. After commitment inspect the actual top four, select exactly two for the vacated sockets, and put the other two at bottom in original relative order. Requires four deck cards. No generated card, guaranteed pattern, second selection or refund.', { cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 } }),
  action(10, 'reassign_collateral', 'Reassign Collateral', 1, 1, 1, ally(2), [{ kind: 'ward-reassignment', distinctRecipients: 2, consenting: true, sameCasterOnly: true, preserve: ['sourceIdentity', 'capacity', 'remainingUses', 'absoluteExpiry'], excludes: ['wagers', 'Fortune', 'damage', 'tempHP', 'other-caster-wards'], destinationMustAcceptHigherCapacity: true }], 'One card and one Fortune. Between two distinct willing allies including self within 30ft, move one existing ward created by this Gambler, preserving exact source/capacity/remaining uses/absolute expiry. No renewed duration, other caster’s ward, unresolved wager, Fortune, damage or temp HP transfer. Destination must be eligible; own-turn action, not interception.'),
  action(10, 'house_nerve', 'House Nerve', 2, 1, 2, ally(3), [{ kind: 'save-bonus', attribute: 'spirit', against: 'fear', bonus: 3, uses: 1, expiry: NEXT, stacking: 'highest' }], 'One card and two Fortune: up to three willing allies including self within 30ft gain +3 to their next Spirit saving throw against fear before next caster own-turn start. Does not end existing fear, grant immunity, reroll, or affect other saves.', { durationConfig: nextStart })
];

const capstone = (suffix, name, treeId, ap, cards, fortune, targetingConfig, effects, description, extra = {}) => action(10, suffix, name, ap, cards, fortune, targetingConfig, effects, description, {
  source: 'talent-capstone', specialization: treeId, treeId,
  cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 }, ...extra
});
const capstones = [
  capstone('the_last_stake', 'The Last Stake', 'high-roller', 4, 1, 0, enemy(), [{
    kind: 'wager', stakeMin: 3, stakeMax: 7, stakeMustEqualAvailableFortune: true, dice: 2, sides: 6, winTotalMin: 10, payoutMultiplier: 2,
    outcomes: { win: { damage: damage('6d8 + 2 * stake') }, loss: { damage: damage('1d8 + 1') } }, unresolvedParentMax: 1, oncePerCompletedLongRest: true
  }], 'Once per completed long rest. 4 AP, one card and ALL available Fortune (3–7) to escrow, one enemy within 30ft. 2d6 >=10 returns twice stake capped at 7 and deals 6d8 + twice stake wyrd; loss returns zero and deals 1d8 + 1. Settle exact card/escrow once; no self-damage, refund, extra card or guaranteed result.'),
  capstone('royal_arrangement', 'Royal Arrangement', 'card-sharp', 3, 5, 2, ally(3), [{
    kind: 'declared-hand-pattern', chooseBeforeCommitment: true, branches: {
      'full-house': { pattern: 'three-one-rank-two-another', effect: ward(8) },
      straight: { pattern: 'ranks-1-2-3-4-5', effect: move(15) },
      flush: { pattern: 'five-one-suit', effect: { kind: 'damage-bonus', flat: 4, damageTypes: ['wyrd'], match: 'next-original-damaging-action', perRecipientUses: 1, perActionRecipients: 1, expiry: NEXT, newEvent: false } }
    }, oncePerCompletedLongRest: true
  }], 'Once per completed long rest. 3 AP, five actual hand cards and two Fortune; choose one qualifying branch before commitment. Up to three willing allies including self within 30ft: full house (3 of one rank +2 another) gives ward 8 once until next start; straight ranks 1–5 moves each up to 15ft using remaining movement; five-card flush gives +4 raw wyrd on each recipient’s next original damaging action before next start, one declared target per action. A same-suit straight chooses ONE branch. No payout, generated pattern, extra event or arbitrary effect.'),
  capstone('house_compact', 'House Compact', 'odds-broker', 2, 2, 0, target(['ally', 'not-self'], 2), [{
    kind: 'compound-wager', unresolvedParentMax: 1, exactLegs: 2, totalEscrow: 2, stakePerLeg: 1, cardsPerLeg: 1,
    distinctAllies: true, casterEligible: false, formationRangeFeet: 30, eventRangeFeet: 60,
    event: { kind: 'original-damage-roll', dice: 1, sides: 8, eligibleFaces: [5, 6, 7, 8], excludeDerived: true },
    returnPerWinningLeg: 2, rawDamagePerWinningLeg: 4, expiry: NEXT,
    expiredCancelledOrOutOfRange: 'lose-that-leg-stake', cardSettlement: 'each-leg-once', parentCloses: 'both-legs-closed',
    payoutCapIncludesRemainingEscrow: true, eventCanMatchOnlyOneLeg: true, oncePerCompletedLongRest: true
  }], 'Once per completed long rest. 2 AP, two distinct cards, two Fortune escrow (one per leg). Exactly two distinct willing OTHER allies within 30ft; one unresolved parent wager, two fixed leg identities. Each locks that ally’s next original single-d8 damage roll: face 5–8 returns two Fortune and adds FOUR raw damage before mitigation, otherwise no return/bonus. Each leg expires next caster own-turn start; cancelled, expired or next otherwise eligible event beyond 60ft loses its stake. Each card settles once. Parent stays locked until both close: no new wager or Recut. Payout plus remaining escrow never exceeds seven; discard overflow. Derived/duplicate events cannot pay and one event cannot match both legs.', { durationConfig: nextStart })
];

const roleForR1 = spell => ['wager_strike', 'recut'].some(s => id(s) === spell.id) ? 'core' : spell.id === id('read_table') ? 'optional' : 'talent-signature';
const asAuthored = spell => ({ ...flags, ...spell, source: roleForR1(spell), sourceRefs: ['classes/manifests/gambler-review-r1.json'], retainedR1: true });
export const GAMBLER_OPTIONAL_RECORDS = optional.map(spell => spell === GAMBLER_R1_SPELLS[2] ? asAuthored(spell) : spell);
export const GAMBLER_CORE_RECORDS = GAMBLER_R1_SPELLS.slice(0, 2).map(asAuthored);
export const GAMBLER_TALENT_ACTIVES = [...GAMBLER_R1_SPELLS.slice(3).map(asAuthored), ...capstones];
export const GAMBLER_AUTHORED_RECORDS = [...GAMBLER_CORE_RECORDS, ...GAMBLER_OPTIONAL_RECORDS, ...GAMBLER_TALENT_ACTIVES, ...GAMBLER_PASSIVE_RECORDS];

const nodeForRecord = record => GAMBLER_TALENT_NODES.find(node => node.grantId === record.id || node.passiveSpellId === record.id);
export function describeGamblerPrice(record) {
  const args = record.classResourceProgram?.args;
  const effects = record.manualMechanics?.effects || [];
  const bet = effects.find(effect => ['wager', 'compound-wager'].includes(effect.kind));
  const cards = record.id === id('recut') ? 'discard 0–2 actual cards' : `${args?.handCards ?? args?.cards ?? record.manualMechanics?.price?.cards?.count ?? 0} actual card(s)`;
  const stake = args?.stakeMin != null ? `${args.stakeMin}–${args.stakeMax} Fortune escrow` : args?.stake != null ? `${args.stake} Fortune escrow`
    : bet?.kind === 'compound-wager' ? '2 Fortune escrow (one per fixed leg)'
    : bet ? bet.stakeMustEqualAvailableFortune ? 'ALL available Fortune, 3–7, to escrow' : `${bet.stakeMin}–${bet.stakeMax} Fortune escrow`
      : `${record.manualMechanics?.price?.fortune?.amount ?? 0} Fortune consumed`;
  return `${record.resourceCost.actionPoints} AP; 0 mana; ${cards}; ${stake}.`;
}
export const GAMBLER_PROJECTED_SPELLS = GAMBLER_AUTHORED_RECORDS.map(record => {
  const node = nodeForRecord(record);
  const original = record.retainedR1 ? GAMBLER_R1_SPELLS.find(spell => spell.id === record.id) : record;
  return {
    ...flags, id: record.id, name: record.name, class: 'Gambler', level: record.level,
    source: `gambler-${record.source}`, sourceRecordSource: record.source,
    spellType: record.spellType, icon: GAMBLER_ICON, description: record.description,
    specialization: node?.treeId || 'core', treeId: node?.treeId || null,
    typeConfig: { school: 'wyrd', castTimeType: record.spellType === 'PASSIVE' ? 'PASSIVE' : 'IMMEDIATE', tags: ['gambler', 'manual-only', record.source] },
    resourceCost: apCost(record.resourceCost.actionPoints),
    targetingConfig: record.targetingConfig, effectTypes: record.effectTypes,
    resolution: record.damageConfig ? 'DICE' : 'NONE', damageConfig: record.damageConfig,
    durationConfig: record.durationConfig, cooldownConfig: record.cooldownConfig,
    reactionTiming: null, savingThrow: null, conditions: record.conditions, area: null,
    manualRequirements: [GAMBLER_MANUAL_NOTICE, describeGamblerPrice(record), ...Object.values(GAMBLER_COMMON_MECHANICS)],
    tags: ['gambler', 'manual-only', record.source], categoryIds: [],
    specialMechanics: { gambler: { ...flags, sourceRecordId: record.id, priceSummary: describeGamblerPrice(record), authoredSpell: original, commonRules: GAMBLER_COMMON_MECHANICS, rankValues: record.rankValues || null, requires: record.requires || null } }
  };
});
export const GAMBLER_PROJECTED_SPELLS_BY_ID = Object.fromEntries(GAMBLER_PROJECTED_SPELLS.map(spell => [spell.id, spell]));
export const GAMBLER_SPELL_POOLS = Object.fromEntries(Array.from({ length: 10 }, (_, i) => [i + 1, GAMBLER_OPTIONAL_RECORDS.filter(spell => spell.level === i + 1).map(spell => spell.id)]));
export const GAMBLER_PROGRESSION_POLICY = {
  classId: 'gambler', rulesetVersion: GAMBLER_RULESET_VERSION, levelCap: 10,
  startingSpellPicks: 1, optionalPicksPerLevel: 1, allowEarlierUnchosen: true,
  grantedCoreSpellIds: GAMBLER_CORE_RECORDS.map(spell => spell.id),
  randomizeStartingSpells: false, autoTopUpOnLoad: false, talentActivesAreGrants: true, manualOnly: true
};
export const GAMBLER_ACQUISITION_RECORDS = [
  { id: 'house_wager', label: 'Real House wager', text: 'Witnessed genuine pre-result wager establishing the channel: actual owned stake, declared settlement/cancellation and accepted loss; record wager and witness/source.' },
  { id: 'initiation_survival', label: 'Survived initiation', text: 'Attested survival of the genuine initiating hazard-wager; supported background evidence is sufficient, never a new self-damage payment or manufactured near-death encounter.' },
  { id: 'wager_discipline', label: 'Wager discipline', text: 'Supervised stake-before-result, losing-stake settlement, no refund, pending lock and discarded overflow; completion recorded, not inferred from temperament.' },
  { id: 'finite_deck_training', label: 'Finite-deck training', text: 'Demonstrated conservation of twenty actual cards, five-card hand, bounded draw and exact Recut/long-rest rules. No fabricated cards or reconnect reset.' }
];
const variants = {
  merryn_human: { subraceName: 'Merryn', title: 'Sea-Omen Gambler', reframe: 'Maritime voyage-share wagers and Merrowport House settlement discipline. Merr-Cael leads the existing Last Table; Jax is a modern transmitter, not creator of every primordial wager.', acquisition: 'All four documented requirements through an actual House/Last Table apprenticeship; a carried ledger alone is insufficient.' },
  drall_fexric: { subraceName: 'Alchemite', title: 'Sump-Hustler', reframe: 'Actual salvage stakes and finite-deck wagering, with Gear-Rat Jix’s cross-school transmission. Distinct from Chaos Weaver anomaly-containment training.', acquisition: 'All four documented requirements through an actual Alchemite wagering apprenticeship; possession of a variance device is not qualification.' }
};
Object.values(variants).forEach(variant => { Object.assign(variant, { status: 'native-trained-tradition', heritageEffectsImplemented: false, requirements: GAMBLER_ACQUISITION_RECORDS.map(r => r.id), manualNote: 'Native access approved. Mechanical heritage benefits/costs remain pending; no automatic curse or free resource generation.' }); });

export const GAMBLER_RESOURCE_RULES = {
  cardCount: 20, suits: ['C', 'D', 'H', 'S'], ranks: [1, 2, 3, 4, 5], handMax: 5,
  fortuneMax: 7, unresolvedWagerMax: 1, compactLegs: 2,
  completedLongRest: { fortune: 3, hand: 5, deck: 15, requiresSettledWagers: true },
  ownTurnDraw: { max: 2, emptySocketsOnly: true, shuffle: false, oncePerOwnTurn: true },
  recut: GAMBLER_R1_SPELLS[1].classResourceProgram.args,
  refreshOnReconnect: false, refreshOnInitiative: false, mechanicalHeritageBenefits: false
};
export const GAMBLER_CARD_IDS = ['C', 'D', 'H', 'S'].flatMap(suit => [1, 2, 3, 4, 5].map(rank => `${rank}${suit}`));
export const GAMBLER_CARD_ZONES = ['deck', 'hand', 'discard', 'pending-wager'];

// Shape checks only. Never settle, draw, refill, repair or mutate a stored draft.
export function validateGamblerState(state) {
  const errors = [];
  if (!state || typeof state !== 'object' || state.type !== 'gambler-hand' || state.version !== 1) return { ok: false, errors: ['Expected an explicit version-1 gambler-hand state.'] };
  const zones = state.cards;
  if (!zones || GAMBLER_CARD_ZONES.some(zone => !Array.isArray(zones[zone]))) return { ok: false, errors: ['All four actual card-zone arrays are required.'] };
  const all = GAMBLER_CARD_ZONES.flatMap(zone => zones[zone]);
  if (all.length !== 20 || new Set(all).size !== 20 || all.some(card => !GAMBLER_CARD_IDS.includes(card))) errors.push('Twenty unique canonical cards must occur in exactly one zone each.');
  if (zones.hand.length > 5) errors.push('Hand exceeds five cards.');
  if (!Number.isInteger(state.fortune) || state.fortune < 0 || state.fortune > 7) errors.push('Fortune must be an integer from zero to seven.');
  if (!Number.isInteger(state.escrow) || state.escrow < 0 || state.fortune + state.escrow > 7) errors.push('Available Fortune plus escrow must be at most seven.');
  const pending = state.pending;
  if (pending == null) {
    if (state.escrow !== 0 || zones['pending-wager'].length) errors.push('Escrow/pending cards require one unresolved wager.');
  } else if (Array.isArray(pending) || typeof pending !== 'object' || typeof pending.id !== 'string' || !pending.id) {
    errors.push('Exactly one identified parent wager is allowed.');
  } else {
    if (!['attack', 'underwrite', 'house-compact'].includes(pending.kind)) errors.push('Unknown pending wager kind.');
    if (!Array.isArray(pending.cardIds) || new Set(pending.cardIds).size !== pending.cardIds.length || pending.cardIds.some(card => !GAMBLER_CARD_IDS.includes(card))) errors.push('Pending choices require exact distinct canonical card IDs.');
    if (pending.kind === 'house-compact') {
      const legs = pending.legs;
      if (pending.cardIds?.length !== 2) errors.push('Compact has exactly two immutable original card choices.');
      if (!Array.isArray(legs) || legs.length !== 2) errors.push('House Compact has exactly two fixed legs, not two parent wagers.');
      else {
        if (new Set(legs.map(leg => leg?.id)).size !== 2 || legs.some(leg => !leg || typeof leg.id !== 'string' || !leg.id || leg.stake !== 1)) errors.push('Each Compact leg needs a distinct identity and exactly one stake.');
        if (legs.some(leg => !['pending', 'won', 'lost', 'expired', 'cancelled'].includes(leg?.status))) errors.push('Unknown Compact leg state.');
        if (new Set(legs.map(leg => leg?.cardId)).size !== 2 || legs.some(leg => !pending.cardIds?.includes(leg?.cardId))) errors.push('Compact cards must match its two fixed choices.');
        const targetKeys = legs.map(leg => leg?.targetRef?.actorId
          ? `${leg.targetRef.actorType || 'actor'}:${leg.targetRef.actorId}` : JSON.stringify(leg?.targetRef || null));
        if (targetKeys.some(key => key === 'null') || new Set(targetKeys).size !== 2) errors.push('Compact needs two distinct exact consenting ally references.');
        const open = legs.filter(leg => leg?.status === 'pending');
        if (!open.length) errors.push('A fully closed Compact cannot remain pending.');
        if (state.escrow !== open.length) errors.push('Compact escrow must equal unsettled one-Fortune legs.');
        if (zones['pending-wager'].length !== open.length || open.some(leg => !zones['pending-wager'].includes(leg.cardId))) errors.push('Only unsettled Compact cards remain in pending-wager.');
        if (legs.filter(leg => leg?.status !== 'pending').some(leg => !zones.discard.includes(leg?.cardId))) errors.push('Closed Compact cards must be discarded.');
      }
    } else {
      if (!Number.isInteger(pending.stake) || pending.stake < 1 || pending.stake > 7 || pending.stake !== state.escrow) errors.push('Pending stake and escrow must agree.');
      if (zones['pending-wager'].length === 0 || zones['pending-wager'].length !== pending.cardIds?.length || zones['pending-wager'].some(card => !pending.cardIds?.includes(card))) errors.push('Pending cards must match the committed choice.');
    }
  }
  return { ok: errors.length === 0, errors };
}

export function validateGamblerSelection(state, spellId, choice = {}, talentRanks = {}) {
  const checkState = validateGamblerState(state);
  if (!checkState.ok) return checkState;
  const record = GAMBLER_AUTHORED_RECORDS.find(spell => spell.id === spellId);
  if (!record || record.spellType !== 'ACTION') return { ok: false, errors: ['Select one authored Gambler action.'] };
  if (!choice || typeof choice !== 'object' || Array.isArray(choice)) return { ok: false, errors: ['Expected explicit Gambler action choices.'] };
  const args = record.classResourceProgram?.args;
  const mechanic = record.manualMechanics;
  const bet = mechanic?.effects.find(effect => ['wager', 'compound-wager'].includes(effect.kind));
  const count = args?.handCards ?? args?.cards ?? mechanic?.price.cards.count ?? 0;
  if (choice.cardIds != null && !Array.isArray(choice.cardIds)) return { ok: false, errors: ['Card choices must be an array of exact hand IDs.'] };
  const chosen = choice.cardIds || [];
  const recut = spellId === id('recut');
  const errors = [];
  if (!Array.isArray(chosen) || new Set(chosen).size !== chosen.length || chosen.some(card => !state.cards.hand.includes(card))) errors.push('Choose distinct actual hand cards.');
  if (recut ? chosen.length > 2 : chosen.length !== count) errors.push('Incorrect number of selected cards.');
  if (state.pending && (recut || args?.handCards || mechanic?.price.requiresEmptyWagerSlot)) errors.push('Pending wager locks this resource-changing action.');
  const pattern = record.manualPattern || args?.pattern;
  const ranks = chosen.map(card => Number(String(card)[0]));
  if (['same-rank', 'three-same-rank'].includes(pattern) && new Set(ranks).size !== 1) errors.push('An exact matching-rank pattern is required.');
  if (pattern === 'same-suit' && new Set(chosen.map(card => String(card)[1])).size !== 1) errors.push('A same-suit pattern is required.');
  if (pattern === 'three-consecutive-ranks' && (new Set(ranks).size !== 3 || Math.max(...ranks) - Math.min(...ranks) !== 2)) errors.push('Three distinct consecutive ranks are required.');
  const min = args?.stakeMin ?? args?.stake ?? bet?.stakeMin;
  const max = args?.stakeMax ?? args?.stake ?? bet?.stakeMax;
  if (min != null && (!Number.isInteger(choice.stake) || choice.stake < min || choice.stake > max || choice.stake > state.fortune || (bet?.stakeMustEqualAvailableFortune && choice.stake !== state.fortune))) errors.push('Stake is outside this action’s exact available bounds.');
  const consume = mechanic?.price.fortune.amount ?? 0;
  if (consume > state.fortune || bet?.totalEscrow > state.fortune) errors.push('Insufficient available Fortune.');
  const deckEffect = mechanic?.effects.find(effect => effect.kind === 'card-zone');
  let deckRequired = deckEffect?.deckRequired || 0;
  if (spellId === id('twin_cut') && choice.reclaimCardId) {
    const rank = talentRanks.cr1_gambler_card_sharp_p10 || 0;
    if (!state.cards.discard.includes(choice.reclaimCardId) || !Number.isInteger(rank) || rank < 1 || rank > 3 || Number(String(choice.reclaimCardId)[0]) > rank) errors.push('Reclaim needs a learned matching Discard Memory rank and preexisting discard.');
    deckRequired = 1;
  }
  if (state.cards.deck.length < deckRequired) errors.push('Not enough actual deck cards; only Recut can reshuffle.');
  if (spellId === id('royal_arrangement')) {
    const counts = Object.values(ranks.reduce((all, rank) => ({ ...all, [rank]: (all[rank] || 0) + 1 }), {})).sort();
    const legal = choice.branch === 'full-house' ? counts.join(',') === '2,3' : choice.branch === 'straight' ? [...ranks].sort().join(',') === '1,2,3,4,5' : choice.branch === 'flush' && new Set(chosen.map(card => card[1])).size === 1;
    if (!legal) errors.push('Choose exactly one qualifying actual five-card arrangement.');
  }
  return { ok: errors.length === 0, errors };
}

// A separate, allow-listed observer DTO: never spread pending choices or private
// deck/hand arrays into a model used by DOM, ARIA, titles or inspection details.
export function projectGamblerResource(resource, isOwner = false) {
  if (resource?.type && resource.type !== 'gambler-hand') return { initialized: false };
  const state = resource?.state;
  if (!state) return { initialized: false };
  const checkState = validateGamblerState(state);
  if (!checkState.ok) return { initialized: true, valid: false, error: isOwner ? checkState.errors[0] : 'State requires owner review.' };
  const view = {
    initialized: true, valid: true, fortune: state.fortune, escrow: state.escrow,
    handCount: state.cards.hand.length, deckCount: state.cards.deck.length, discardCount: state.cards.discard.length,
    pending: state.pending ? { locked: true, kind: state.pending.kind, outstandingCards: state.cards['pending-wager'].length, outstandingLegs: state.pending.kind === 'house-compact' ? state.pending.legs.filter(leg => leg.status === 'pending').length : 1 } : null
  };
  return isOwner ? { ...view, hand: [...state.cards.hand] } : view;
}

export function pruneGamblerTalents(ranks, level) {
  const desired = ranks && typeof ranks === 'object' ? ranks : {};
  const accepted = {};
  const budget = Math.min(50, Math.max(0, Math.trunc(level || 0)) * 5);
  let total = 0;
  let changed = true;
  while (changed && total < budget) {
    changed = false;
    for (const node of GAMBLER_TALENT_NODES) {
      const wanted = Number.isInteger(desired[node.id]) ? Math.min(node.maxRanks, Math.max(0, desired[node.id])) : 0;
      if ((accepted[node.id] || 0) >= wanted || node.minLevel > level) continue;
      const treePoints = GAMBLER_TALENT_NODES.filter(n => n.treeId === node.treeId).reduce((sum, n) => sum + (accepted[n.id] || 0), 0);
      if (treePoints < node.requiresPoints || node.requires.some(pre => (accepted[pre] || 0) < GAMBLER_TALENT_NODES.find(n => n.id === pre).maxRanks)) continue;
      accepted[node.id] = (accepted[node.id] || 0) + 1;
      total++;
      changed = true;
      if (total === budget) break;
    }
  }
  return accepted;
}

export const GAMBLER_RESOURCE_SYSTEM = {
  type: 'gambler-hand', title: 'The Hand and the Stake', subtitle: 'Twenty actual cards; one bank of seven; one unresolved wager.',
  mechanics: { title: 'Finite contents, real commitments', content: Object.values(GAMBLER_COMMON_MECHANICS).join('\n\n') },
  activePricingTable: { title: 'All 48 Active Prices', headers: ['Action', 'Exact price', 'Manual effects'], rows: GAMBLER_AUTHORED_RECORDS.filter(r => r.spellType === 'ACTION').map(r => [r.name, describeGamblerPrice(r), r.description]) },
  resourceBarExplanation: { title: 'Read-only Hand', content: 'Starts explicitly uninitialized. No fabricated cards, draw or rest refill. Owners see their actual hand; observers see counts only. Pending cards and private choices never appear in observer markup.' }
};
export const GAMBLER_DATA = {
  ...flags, id: 'gambler', name: 'Gambler', variantName: 'Gambler', icon: GAMBLER_ICON, imageIcon: '/assets/icons/classes/gambler.png',
  role: 'Burst damage / support / risk brokerage', damageTypes: ['wyrd'], resource: 'Hand & Fortune', primaryStat: 'Charisma', secondaryStat: 'Intelligence',
  developmentStatus: 'development', statusLabel: 'Development — manual tabletop', heritageEffectsImplemented: false,
  classResource: { type: 'gambler-hand', base: 0, max: 7, generationNote: 'Uninitialized until actual table state is recorded. Fortune resets to 3 only on an explicit completed long rest.' },
  restrictions: { allowedSubraces: ['merryn_human', 'drall_fexric'], hardBlocks: [], narrativeUnlock: true, acquisition: { records: GAMBLER_ACQUISITION_RECORDS }, justification: 'A real survived House wager and documented finite-deck training; native ancestry alone grants neither competence nor a mechanical edge.' },
  equipment: { weapons: ['dagger', 'staff'], protectiveGear: ['light_ward', 'robes'], offHand: ['empty', 'tome'] },
  subraceVariants: variants,
  overview: {
    title: 'The Gambler', subtitle: 'Put something real on the table before the dice land.',
    description: 'A finite-hand burst/support broker: expose a card, commit a stake, preserve a pattern, or underwrite an ally. Weak sustained defense and committed losses constrain spectacular wins.',
    quickOverview: { title: 'Class Overview', content: 'Twenty actual cards, hand five and Fortune seven. One unresolved wager: no free credit, debt bank, foreign reroll, Fate link or Chaos tile. Core Wager Strike and Recut are separate from one optional pick per level. All consequences are manual tabletop.' },
    playstyle: { title: 'Turn 1', content: 'Inspect the actual recorded hand. Choose card and stake before the result, or preserve a pair. Record and settle the same action once. No deck is invented when this page opens.' },
    roleplayIdentity: { title: 'Merrowport House and the Sump', content: 'Preserve Merrowport House/Merr-Cael and Last Table. Merryn voyage-share settlement and Alchemite salvage wagers are distinct trained native traditions. Jax/Jix are transmitters, not universal origins; Lyra/Deck-Burners remain legacy context, not a new Gambler leader.' },
    currentCrisis: 'Jax remains missing; disputed sea obligations and salvage scarcity pressure real tables. No new founder or mechanical curse is imposed.'
  },
  characterCreation: { title: 'Gambler', description: 'Choose one level-1 optional; core Wager Strike and Recut are granted separately. Record four acquisition requirements. Hand state remains uninitialized until actual table state exists.' },
  specializations: { title: 'Three Wagering Disciplines', description: 'First investment chooses primary tree. Five talent points per level, global cap fifty. Signatures require ten same-tree points at level three; capstones forty-five at level ten.', specs: GAMBLER_TREE_META.map(meta => ({ id: meta.id, name: meta.name, icon: GAMBLER_ICON, theme: meta.tagline, description: meta.tagline, playstyle: meta.tagline })) },
  spells: GAMBLER_PROJECTED_SPELLS, spellPools: GAMBLER_SPELL_POOLS,
  progression: { levelCap: 10, policy: GAMBLER_PROGRESSION_POLICY, levels: Array.from({ length: 10 }, (_, i) => ({ level: i + 1, newChoiceIds: GAMBLER_SPELL_POOLS[i + 1], optionalPicks: 1, talentBudget: (i + 1) * 5 })) },
  talentTrees: GAMBLER_TALENT_CAPACITY, resourceSystem: GAMBLER_RESOURCE_SYSTEM
};
export const GAMBLER_MANIFEST = {
  ...flags, contentLock: 'HeadQ accepted G1 with native-access amendment, 2026-10-20',
  optional: GAMBLER_OPTIONAL_RECORDS.map(r => r.id), core: GAMBLER_CORE_RECORDS.map(r => r.id),
  talentActives: GAMBLER_TALENT_ACTIVES.map(r => r.id), passives: GAMBLER_PASSIVE_RECORDS.map(r => r.id),
  records: GAMBLER_AUTHORED_RECORDS.map(r => ({ id: r.id, name: r.name, level: r.level, source: r.source, treeId: nodeForRecord(r)?.treeId || null, ap: r.resourceCost.actionPoints, mana: 0 })),
  nodes: GAMBLER_TALENT_NODES.map(n => ({ id: n.id, treeId: n.treeId, spellId: n.grantId || n.passiveSpellId, ranks: n.maxRanks, minimumLevel: n.minLevel, requiresPoints: n.requiresPoints, prerequisites: n.requires })),
  uniqueRecords: 96, activeRecords: 48, passiveRecords: 48, talentNodes: 54, talentCapacity: GAMBLER_TALENT_CAPACITY,
  nativeAccess: ['merryn_human', 'drall_fexric'], acquisitionRequirements: GAMBLER_ACQUISITION_RECORDS.map(r => r.id), heritageEffectsImplemented: false,
  resourceRules: GAMBLER_RESOURCE_RULES, trees: GAMBLER_TREES.map(tree => tree.id),
  dependencies: ['CR-A1', 'CR-R1', 'CR-E1', 'CR-D1-private-deck', 'CR-E2-deferred-consequence', 'CR-L1'],
  automaticConversion: false
};
export default GAMBLER_DATA;
