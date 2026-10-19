/*
 * CLASS-C1 — Chaos Weaver: authored class-local content packet (proposed).
 *
 * This module is the single authored source for the class identity, origins,
 * level progression, resource rules, the 49 active spell/talent records and the
 * proposed native variant. It performs no registration, granting, payment,
 * random sampling or effect execution. Every record is materialized on the
 * closed C1 profile: authoredOnly:true, executionEnabled:false,
 * applicationMode:'manual-tabletop'.
 *
 * Stable IDs: cw1_01..cw1_40 (slot 07 uses its existing R1 stable ID
 * cr1_chaos_weaver_read_instability; cw1_07 is a table alias only), the three
 * core IDs below, and six talent-grant IDs. Passive talent spell records live
 * in data/talentTrees/chaosWeaver.js and derive from the same node data.
 */

export const CHAOS_WEAVER_CLASS_ID = 'chaos-weaver';
export const CHAOS_WEAVER_RULESET_VERSION = 'cr-cw-1';
export const CHAOS_WEAVER_ICON = 'Psychic/Psychic Telepathy';

export const CHAOS_WEAVER_TILE_IDS = ['S1', 'S2', 'M1', 'M2', 'F1', 'F2'];
export const CHAOS_WEAVER_TILE_SYMBOLS = { S1: 'S', S2: 'S', M1: 'M', M2: 'M', F1: 'F', F2: 'F' };
export const CHAOS_WEAVER_TILE_ZONES = ['available', 'committed', 'bound', 'spent'];
export const CHAOS_WEAVER_TREE_IDS = ['probability-sculptor', 'anomaly-binder', 'cascade-weaver'];

export const CHAOS_WEAVER_MANUAL_ONLY_NOTICE =
  'Manual tabletop only: no AP, tile, movement or effect is applied automatically.';

/* ------------------------------------------------------------------ */
/* Identity and presentation (proposed C1 tuning, not approved canon)  */
/* ------------------------------------------------------------------ */

export const CHAOS_WEAVER_IDENTITY = {
  contentId: CHAOS_WEAVER_CLASS_ID,
  rulesetVersion: CHAOS_WEAVER_RULESET_VERSION,
  name: 'Chaos Weaver',
  statusLabel: 'Reconstruction preview — manual only',
  pitch:
    'Choose which things may happen; spend those possibilities even when reality chooses the one you dislike.',
  role: 'Wyrd damage / uncertainty control; secondary observational utility.',
  primaryAttributes: ['intelligence', 'spirit'],
  payloadAffinity: 'wyrd',
  groupVerb:
    'Publish and contain a finite set of possible consequences — not foretell actual future facts, underwrite a wager or redirect another actor’s damage.',
  equipmentTraining:
    'Light clothing, staff or dagger and a finite stabilizing apparatus are proposed equipment training; no new equipment item IDs, armor calculations, HP formula or generic proficiency engine is introduced here.',
  weaknesses: [
    'Paid recovery: Fold the Odds costs 1 AP every time.',
    'Finite available symbols: six tiles, no free draw or exchange.',
    'Unavoidable published Fracture branches carry a movement downside.',
    'No healing of any kind.',
    'No hidden reroll and no invisible outcome.',
    'One unresolved action and one anomaly at a time.'
  ],
  boundary:
    'Candidate content and manual rehearsal only. No character-class registration, live spell grants, save migration, character/library/room writes or server calls.'
};

export const CHAOS_WEAVER_ORIGIN = {
  longForm:
    'Alchemite variance containment around the Roulette Manifold/Sump workshops, distinct from Merrowport House wagering and from cosmic Mael-Zhul. Jix is a documented cross-school contact, not newly declared founder of all Chaos Weavers.',
  institution: {
    name: 'Variance Circle',
    kind: 'workshop network (proposed, not an invented government or canonical NPC)',
    note:
      'Present transmission as apprenticeship in surviving a real anomaly and maintaining a finite interface.'
  },
  crisis:
    'Salvage scarcity and refugee workshops pressure the boundary between honest containment and rigging a sample.',
  teachingPhrase: {
    text: 'Name the failure before you invite it.',
    attribution: 'anonymous workshop instruction, not a historical NPC quotation'
  }
};

export const CHAOS_WEAVER_ACQUISITION_RECORDS = [
  {
    id: 'anomaly_encounter',
    label: 'Survived a real anomaly',
    text:
      'The candidate has stood inside an actual observable anomaly and stayed long enough to describe it afterwards.',
    proposedOnly: true
  },
  {
    id: 'containment_training',
    label: 'Containment training',
    text:
      'The candidate completed supervised containment drills with a finite stabilizing apparatus.',
    proposedOnly: true
  },
  {
    id: 'stabilizing_interface',
    label: 'Stabilizing interface maintenance',
    text:
      'The candidate can maintain — not improvise — a working stabilizing interface through a full rest cycle.',
    proposedOnly: true
  }
];

export const CHAOS_WEAVER_NATIVE_VARIANTS = [
  {
    id: 'drall_fexric',
    peopleId: 'drall_fexric',
    name: 'Sump Variance-Worker',
    status: 'proposed',
    edge: {
      name: 'Prepared Exchange',
      cost: { actionPoints: 0, mana: 0 },
      frequency: 'once per completed long rest',
      requirements: [
        'One actual prepared spare part is consumed at the table.',
        'No pending action exists.',
        'The chosen spent ID and the chosen available ID are of different symbols.'
      ],
      effect:
        'Exchange one chosen spent ID with one chosen available ID of a different symbol: exactly one each changes zone; no symbol changes. Caster movement−5ft until next own-turn start.',
      cannot: [
        'Cannot touch bound or committed tiles.',
        'Cannot change a recorded result or waive the part.',
        'Cannot run while a pending action or unresolved draw exists.'
      ],
      manualNote: 'Manual verification required, no automatic benefit; normal class play works without this edge.'
    },
    acquisition: {
      note:
        'No automatic additional natives; every other compatible people may qualify through the actual acquisition records below. Ancestry alone is neither competence nor a racial prohibition.',
      records: CHAOS_WEAVER_ACQUISITION_RECORDS.map((record) => record.id)
    },
    brokenStabilizer:
      'A broken stabilizer blocks active class procedure until repaired at the table.'
  }
];

/* ------------------------------------------------------------------ */
/* Level progression                                                  */
/* ------------------------------------------------------------------ */

export const CHAOS_WEAVER_PROGRESSION = [
  {
    level: 1,
    optionalPicks: 1,
    talentBudget: 5,
    event: 'Six Tiles, Fold, Split, stabilizer care and explicit downside rules',
    newChoiceIds: ['cw1_01', 'cw1_02', 'cw1_03', 'cw1_04']
  },
  {
    level: 2,
    optionalPicks: 2,
    talentBudget: 10,
    event: 'No new resource bank',
    newChoiceIds: ['cw1_05', 'cw1_06', 'cr1_chaos_weaver_read_instability', 'cw1_08']
  },
  {
    level: 3,
    optionalPicks: 3,
    talentBudget: 15,
    event: 'A signature can be bought after 10 points in that tree',
    newChoiceIds: ['cw1_09', 'cw1_10', 'cw1_11', 'cw1_12']
  },
  {
    level: 4,
    optionalPicks: 4,
    talentBudget: 20,
    event: 'No free reaction unlock',
    newChoiceIds: ['cw1_13', 'cw1_14', 'cw1_15', 'cw1_16']
  },
  {
    level: 5,
    optionalPicks: 5,
    talentBudget: 25,
    event: 'No second anomaly or tile cap increase',
    newChoiceIds: ['cw1_17', 'cw1_18', 'cw1_19', 'cw1_20']
  },
  {
    level: 6,
    optionalPicks: 6,
    talentBudget: 30,
    event: 'Recovery remains paid',
    newChoiceIds: ['cw1_21', 'cw1_22', 'cw1_23', 'cw1_24']
  },
  {
    level: 7,
    optionalPicks: 7,
    talentBudget: 35,
    event: 'Derived continuations still one only',
    newChoiceIds: ['cw1_25', 'cw1_26', 'cw1_27', 'cw1_28']
  },
  {
    level: 8,
    optionalPicks: 8,
    talentBudget: 40,
    event: 'Anomaly counterplay remains visible',
    newChoiceIds: ['cw1_29', 'cw1_30', 'cw1_31', 'cw1_32']
  },
  {
    level: 9,
    optionalPicks: 9,
    talentBudget: 45,
    event: 'Finite high-level choices; no certainty capstone',
    newChoiceIds: ['cw1_33', 'cw1_34', 'cw1_35', 'cw1_36']
  },
  {
    level: 10,
    optionalPicks: 10,
    talentBudget: 50,
    event: 'One fully funded tree can buy its capstone; hybrids keep all paid prerequisites',
    newChoiceIds: ['cw1_37', 'cw1_38', 'cw1_39', 'cw1_40']
  }
];

export const CHAOS_WEAVER_PROGRESSION_RULES = {
  levelCap: 10,
  optionalPickRule:
    'Exactly one optional spell pick at each level from that level or an earlier unchosen pool.',
  minimumNewOptionsPerLevel: 4,
  minimumNondamageOptionsPerLevel: 2,
  picksDoNotConsume:
    'Core actions, passives, signatures and capstones do not consume a spell pick.',
  noAutomaticScaling: 'No automatic tile-cap or damage scaling by level.',
  primarySpecialization:
    'Primary specialization is the first tree invested in, not three free signatures.',
  respecPreview:
    'Class-local respec preview recomputes legality and removes dependent ranks; it never rewrites a character’s real talents. Table rest/training respec permission remains the campaign’s existing policy.'
};

/* ------------------------------------------------------------------ */
/* Closed record helpers (explicit materialization, no read defaults) */
/* ------------------------------------------------------------------ */

const wyrd = (formula) => ({ formula, damageTypes: ['wyrd'] });

const step = (feet, optional = true) => ({
  kind: 'step',
  feet,
  until: 'immediate',
  usesRemainingMovement: true,
  optional
});

const displacement = (feet) => ({
  kind: 'displacement',
  feet,
  until: 'immediate',
  usesRemainingMovement: true,
  optional: false
});

const penalty = (feet, until = 'next-own-turn-start') => ({
  kind: 'penalty',
  feet,
  until,
  usesRemainingMovement: true,
  optional: false
});

const endsMovement = () => ({
  kind: 'ends-remaining-movement',
  feet: 0,
  until: 'current-turn',
  usesRemainingMovement: true,
  optional: false
});

const wardOut = (amount, until = 'next-caster-turn-start', appliesTo = 'self') => ({
  amount,
  until,
  eventLimit: 'next-wyrd-damage',
  appliesTo
});

const outcome = ({ damage = null, ward = null, movement = null, penalty = null, note }) => ({
  damage,
  ward,
  movement,
  penalty,
  note
});

const uniformByTileId = (outcomes, sampleNote) => ({
  selection: 'uniform-by-primary-tile-id',
  sampleNote,
  outcomes
});

const manual = (entries) => [CHAOS_WEAVER_MANUAL_ONLY_NOTICE, ...entries];

const activeRecord = ({
  id,
  name,
  level,
  source,
  treeId = null,
  actionPoints,
  mana = 0,
  inputSymbols,
  zoneFrom = 'available',
  zoneTo = 'spent',
  count = 0,
  spendAllPrimary = true,
  roles = ['enemy'],
  rangeFeet = 30,
  maxSubjects = 1,
  branchRule = null,
  outcome = null,
  area = null,
  continuation = null,
  expiry = null,
  oncePerRest = false,
  damage = null,
  requires = null,
  effectText,
  manualRequirements,
  sourceRefs
}) => ({
  id,
  classId: CHAOS_WEAVER_CLASS_ID,
  rulesetVersion: CHAOS_WEAVER_RULESET_VERSION,
  name,
  level,
  source,
  treeId,
  spellType: 'ACTION',
  icon: CHAOS_WEAVER_ICON,
  resourceCost: { actionPoints, mana },
  tileRule: {
    inputSymbols,
    zoneFrom: count === 0 ? null : zoneFrom,
    zoneTo: count === 0 ? null : zoneTo,
    count,
    spendAllPrimary
  },
  target: { roles, rangeFeet, maxSubjects },
  branchRule,
  outcome,
  timing: { use: 'own-turn', expiry, oncePerRest },
  damage,
  reaction: null,
  savingThrow: null,
  conditions: [],
  area,
  continuation,
  rankValues: null,
  requires,
  effectText,
  sourceRefs,
  authoredOnly: true,
  executionEnabled: false,
  applicationMode: 'manual-tabletop',
  automatedCapabilities: [],
  manualRequirements
});

/* ------------------------------------------------------------------ */
/* Optional records 01–40 (source: CLASS-C1 §5 manifest)              */
/* ------------------------------------------------------------------ */

export const CHAOS_WEAVER_OPTIONAL_SLOTS = [
  { slot: '01', id: 'cw1_01' },
  { slot: '02', id: 'cw1_02' },
  { slot: '03', id: 'cw1_03' },
  { slot: '04', id: 'cw1_04' },
  { slot: '05', id: 'cw1_05' },
  { slot: '06', id: 'cw1_06' },
  { slot: '07', id: 'cr1_chaos_weaver_read_instability' },
  { slot: '08', id: 'cw1_08' },
  { slot: '09', id: 'cw1_09' },
  { slot: '10', id: 'cw1_10' },
  { slot: '11', id: 'cw1_11' },
  { slot: '12', id: 'cw1_12' },
  { slot: '13', id: 'cw1_13' },
  { slot: '14', id: 'cw1_14' },
  { slot: '15', id: 'cw1_15' },
  { slot: '16', id: 'cw1_16' },
  { slot: '17', id: 'cw1_17' },
  { slot: '18', id: 'cw1_18' },
  { slot: '19', id: 'cw1_19' },
  { slot: '20', id: 'cw1_20' },
  { slot: '21', id: 'cw1_21' },
  { slot: '22', id: 'cw1_22' },
  { slot: '23', id: 'cw1_23' },
  { slot: '24', id: 'cw1_24' },
  { slot: '25', id: 'cw1_25' },
  { slot: '26', id: 'cw1_26' },
  { slot: '27', id: 'cw1_27' },
  { slot: '28', id: 'cw1_28' },
  { slot: '29', id: 'cw1_29' },
  { slot: '30', id: 'cw1_30' },
  { slot: '31', id: 'cw1_31' },
  { slot: '32', id: 'cw1_32' },
  { slot: '33', id: 'cw1_33' },
  { slot: '34', id: 'cw1_34' },
  { slot: '35', id: 'cw1_35' },
  { slot: '36', id: 'cw1_36' },
  { slot: '37', id: 'cw1_37' },
  { slot: '38', id: 'cw1_38' },
  { slot: '39', id: 'cw1_39' },
  { slot: '40', id: 'cw1_40' }
];

const optionalRecord = (record) => activeRecord({ source: 'level-pick', ...record });

export const CHAOS_WEAVER_OPTIONAL_SPELLS = [
  optionalRecord({
    id: 'cw1_01',
    name: 'Fraying Bolt',
    level: 1,
    actionPoints: 2,
    inputSymbols: [{ symbol: 'F' }],
    count: 1,
    roles: ['enemy'],
    rangeFeet: 30,
    damage: wyrd('1d6'),
    outcome: outcome({
      damage: wyrd('1d6'),
      movement: penalty(5),
      note:
        '1d6 Wyrd; caster movement−5ft until next own-turn start. Deterministic authored result — confirm before settlement.'
    }),
    effectText:
      '1d6 Wyrd; caster movement−5ft until next own-turn start. Deliberate deterministic low-resource basic, not a sample.',
    manualRequirements: manual([
      'Apply the caster movement−5ft penalty until the next own-turn start on the character’s turn.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 01']
  }),
  optionalRecord({
    id: 'cw1_02',
    name: 'Sideways Spark',
    level: 1,
    actionPoints: 2,
    inputSymbols: [{ symbol: 'M' }],
    count: 1,
    roles: ['enemy'],
    rangeFeet: 30,
    damage: wyrd('1d4'),
    effectText: '1d4 Wyrd; optional caster 5ft step.',
    manualRequirements: manual([
      'The optional 5ft caster step uses remaining legal movement and is GM-adjudicated.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 02']
  }),
  optionalRecord({
    id: 'cw1_03',
    name: 'Survey the Seam',
    level: 1,
    actionPoints: 1,
    inputSymbols: [{ symbol: 'M' }],
    count: 1,
    roles: ['object'],
    rangeFeet: 10,
    damage: null,
    effectText:
      'One visible inert object within 10ft: identify one visible seam or likely mechanical load path, not hidden contents or structural immunity bypass; instant information.',
    manualRequirements: manual([
      'The GM answers one visible seam or load-path question about an actual object; no hidden contents and no structural immunity bypass.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 03']
  }),
  optionalRecord({
    id: 'cw1_04',
    name: 'Fracture Brace',
    level: 1,
    actionPoints: 1,
    inputSymbols: [{ symbol: 'F' }],
    count: 1,
    roles: ['self'],
    rangeFeet: 0,
    damage: null,
    outcome: outcome({
      ward: wardOut(2, 'next-own-turn-start', 'self'),
      movement: penalty(5),
      note:
        'Self ward 2 versus the next Wyrd damage assigned before next own-turn start; caster movement−5ft to that start. Deterministic authored result — confirm before settlement.'
    }),
    expiry: 'next-own-turn-start',
    effectText:
      'Self ward 2 versus next Wyrd assigned damage before next own-turn start; also caster−5ft movement to that start.',
    manualRequirements: manual([
      'Track the ward as “next Wyrd damage assigned, once, before next own-turn start”.',
      'Apply the caster movement−5ft penalty until next own-turn start.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 04']
  }),
  optionalRecord({
    id: 'cw1_05',
    name: 'Lancing Variance',
    level: 2,
    actionPoints: 2,
    inputSymbols: [{ symbol: 'S' }],
    count: 1,
    roles: ['enemy'],
    rangeFeet: 30,
    damage: wyrd('1d6+2'),
    effectText: '1d6+2 Wyrd. Deterministic basic giving up a Surge that could bias a set.',
    manualRequirements: manual([]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 05']
  }),
  optionalRecord({
    id: 'cw1_06',
    name: 'Chosen Crosscurrent',
    level: 2,
    actionPoints: 2,
    inputSymbols: [{ symbol: 'M' }, { symbol: 'F' }],
    count: 2,
    roles: ['enemy'],
    rangeFeet: 30,
    branchRule: uniformByTileId(
      {
        M: outcome({
          damage: wyrd('1d6+2'),
          movement: step(5),
          note: 'M: 1d6+2 Wyrd and caster 5ft step using remaining movement.'
        }),
        F: outcome({
          damage: wyrd('1d6'),
          movement: penalty(5),
          note: 'F: 1d6 Wyrd and the normal Fracture penalty (caster movement−5ft until next own-turn start).'
        })
      },
      'Uniform selection across the committed M and F tile IDs before any face is entered.'
    ),
    damage: null,
    effectText: 'M: 1d6+2 Wyrd and caster 5ft step; F: 1d6 Wyrd and normal Fracture penalty.',
    manualRequirements: manual([
      'Fix the ordered committed pair and its d6 mapping before entering the face.',
      'Match the face to the published mapping, then apply only that branch.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 06']
  }),
  optionalRecord({
    id: 'cr1_chaos_weaver_read_instability',
    name: 'Read Instability',
    level: 2,
    actionPoints: 1,
    inputSymbols: [{ anyOf: ['S', 'M', 'F'] }],
    count: 1,
    roles: ['anomaly'],
    rangeFeet: 30,
    damage: null,
    effectText:
      'Observable anomaly within 30ft; choose one actual material, rough-boundary or stabilizer fact. No future rolls, hidden identities or invented facts.',
    manualRequirements: manual([
      'The GM answers exactly one actual material, rough-boundary or stabilizer question about an observable anomaly.',
      'No future rolls, hidden identities or invented facts are revealed.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 07 (table alias cw1_07; R1 stable ID kept)']
  }),
  optionalRecord({
    id: 'cw1_08',
    name: 'Counterweight',
    level: 2,
    actionPoints: 1,
    inputSymbols: [{ symbol: 'F' }],
    count: 1,
    roles: ['self'],
    rangeFeet: 0,
    damage: null,
    outcome: outcome({
      movement: penalty(5),
      note:
        'Caster movement−5ft to next own-turn start; the +1 balance/handling check stays manual. Deterministic authored downside — confirm before settlement.'
    }),
    expiry: 'end-next-own-turn',
    effectText:
      'Touch a mundane carried load: +1 to one GM-called noncombat balance/handling check made before end of next own turn; caster−5ft movement to next start. Not advantage, armor or immunity.',
    manualRequirements: manual([
      'Apply +1 to exactly one GM-called noncombat balance/handling check made before the end of the next own turn.',
      'Apply the caster movement−5ft penalty to next own-turn start; this is not advantage, armor or immunity.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 08']
  }),
  optionalRecord({
    id: 'cw1_09',
    name: 'Discordant Arc',
    level: 3,
    actionPoints: 2,
    inputSymbols: [{ symbol: 'S' }, { symbol: 'F' }],
    count: 2,
    roles: ['enemy'],
    rangeFeet: 30,
    branchRule: uniformByTileId(
      {
        S: outcome({
          damage: wyrd('2d6+2'),
          note: 'S: 2d6+2 Wyrd.'
        }),
        F: outcome({
          damage: wyrd('1d6+2'),
          movement: penalty(5),
          note: 'F: 1d6+2 Wyrd and the normal Fracture penalty (caster movement−5ft until next own-turn start).'
        })
      },
      'Uniform selection across the committed S and F tile IDs before any face is entered.'
    ),
    damage: null,
    effectText: 'S: 2d6+2 Wyrd; F: 1d6+2 Wyrd and normal Fracture penalty.',
    manualRequirements: manual([
      'Fix the ordered committed pair and its d6 mapping before entering the face.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 09']
  }),
  optionalRecord({
    id: 'cw1_10',
    name: 'Slip Tether',
    level: 3,
    actionPoints: 1,
    inputSymbols: [{ symbol: 'M' }, { symbol: 'F' }],
    count: 2,
    roles: ['self'],
    rangeFeet: 0,
    branchRule: uniformByTileId(
      {
        M: outcome({
          movement: step(10),
          note: 'M: caster 10ft legal step using remaining movement.'
        }),
        F: outcome({
          movement: penalty(5),
          note: 'F: no step and the normal Fracture penalty (caster movement−5ft until next own-turn start).'
        })
      },
      'Uniform selection across the committed M and F tile IDs before any face is entered.'
    ),
    damage: null,
    effectText:
      'M: caster 10ft legal step; F: no step and normal Fracture penalty. Spend both; not teleport or escape from a binding without GM legality.',
    manualRequirements: manual([
      'The step is legal movement only; it is not a teleport and cannot escape a binding without GM legality.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 10']
  }),
  optionalRecord({
    id: 'cw1_11',
    name: 'Measured Shelter',
    level: 3,
    actionPoints: 2,
    inputSymbols: [{ symbol: 'S' }],
    count: 1,
    roles: ['self', 'ally'],
    rangeFeet: 30,
    damage: null,
    expiry: 'next-caster-turn-start',
    effectText: 'Ward 4 versus next Wyrd damage before next caster-turn start.',
    manualRequirements: manual([
      'The ward reduces the next Wyrd damage assigned to the chosen willing self/ally, once, before the next caster-turn start.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 11']
  }),
  optionalRecord({
    id: 'cw1_12',
    name: 'Signal Coin',
    level: 3,
    actionPoints: 1,
    inputSymbols: [{ symbol: 'M' }],
    count: 1,
    roles: ['token'],
    rangeFeet: 0,
    damage: null,
    expiry: 'endT+2',
    effectText:
      'Touch one existing inert token: emits one declared audible click when physically jostled before endT+2, then inert. Does not sense invisible creatures, identify an intruder or create material.',
    manualRequirements: manual([
      'The click is a mundane audible signal for normal listeners; it does not sense invisible creatures, identify an intruder or create material.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 12']
  }),
  optionalRecord({
    id: 'cw1_13',
    name: 'Torsion Lance',
    level: 4,
    actionPoints: 3,
    inputSymbols: [{ symbol: 'S' }, { symbol: 'F' }],
    count: 2,
    roles: ['enemy'],
    rangeFeet: 30,
    branchRule: uniformByTileId(
      {
        S: outcome({
          damage: wyrd('3d6'),
          note: 'S: 3d6 Wyrd.'
        }),
        F: outcome({
          damage: wyrd('1d6+2'),
          movement: penalty(5),
          note: 'F: 1d6+2 Wyrd and the normal Fracture penalty (caster movement−5ft until next own-turn start).'
        })
      },
      'Uniform selection across the committed S and F tile IDs before any face is entered.'
    ),
    damage: null,
    effectText: 'S: 3d6 Wyrd; F: 1d6+2 Wyrd and normal Fracture penalty.',
    manualRequirements: manual([
      'Fix the ordered committed pair and its d6 mapping before entering the face.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 13']
  }),
  optionalRecord({
    id: 'cw1_14',
    name: 'Skewed Guard',
    level: 4,
    actionPoints: 2,
    inputSymbols: [{ anyOf: ['S', 'M'] }, { symbol: 'F' }],
    count: 2,
    roles: ['self', 'ally'],
    rangeFeet: 30,
    damage: null,
    branchRule: uniformByTileId(
      {
        S: outcome({
          ward: wardOut(6, 'next-caster-turn-start', 'self-or-ally'),
          note: 'S: ward 6 on the chosen willing self or ally.'
        }),
        M: outcome({
          ward: wardOut(3, 'next-caster-turn-start', 'self-or-ally'),
          movement: step(5),
          note: 'M: ward 3 on the chosen willing self or ally and caster 5ft step.'
        }),
        F: outcome({
          ward: wardOut(3, 'next-caster-turn-start', 'self-or-ally'),
          movement: penalty(5),
          note: 'F: ward 3 on the chosen willing self or ally and the normal caster Fracture penalty (movement−5ft until next own-turn start).'
        })
      },
      'Sample between the chosen S-or-M tile and the F tile, uniform by committed tile ID, before any face is entered.'
    ),
    effectText:
      'S: ward 6 on the chosen willing self or ally; M: ward 3 on that target and caster 5ft step; F: ward 3 on that target and normal caster Fracture. Ward expiry next caster-turn start, one Wyrd event.',
    manualRequirements: manual([
      'The ward reduces one next Wyrd damage event on the chosen willing self or ally before the next caster-turn start; it does not stack with another C1 ward.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 14']
  }),
  optionalRecord({
    id: 'cw1_15',
    name: 'Inert Margin',
    level: 4,
    actionPoints: 1,
    inputSymbols: [{ symbol: 'F' }],
    count: 1,
    roles: ['self'],
    rangeFeet: 0,
    damage: null,
    outcome: outcome({
      movement: penalty(5),
      note:
        'Caster movement−5ft to next own-turn start; the +2 stabilization check stays manual. Deterministic authored downside — confirm before settlement.'
    }),
    expiry: 'endT+1',
    effectText:
      'One mundane fragile object carried by caster: +2 to one GM-called noncombat check to stabilize it before endT+1; caster−5ft movement to next start. No automatic magical hazard shutdown.',
    manualRequirements: manual([
      'Apply +2 to exactly one GM-called noncombat stabilization check before endT+1; no automatic magical hazard shutdown.',
      'Apply the caster movement−5ft penalty to next own-turn start.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 15']
  }),
  optionalRecord({
    id: 'cw1_16',
    name: 'Shared Survey',
    level: 4,
    actionPoints: 2,
    inputSymbols: [{ anyOf: ['S', 'M', 'F'] }],
    count: 1,
    roles: ['ally'],
    rangeFeet: 10,
    damage: null,
    effectText:
      'One willing ally within 10ft participates in observing one actual visible anomaly within 30ft. The table answers two distinct material/boundary/stabilizer questions to both; no hidden knowledge.',
    manualRequirements: manual([
      'The GM answers two distinct material/boundary/stabilizer questions about the visible anomaly to both participants; no hidden knowledge.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 16']
  }),
  optionalRecord({
    id: 'cw1_17',
    name: 'Resonance Fork',
    level: 5,
    actionPoints: 3,
    inputSymbols: [{ symbol: 'S' }, { symbol: 'M' }, { symbol: 'F' }],
    count: 3,
    roles: ['enemy'],
    rangeFeet: 30,
    branchRule: uniformByTileId(
      {
        S: outcome({
          damage: wyrd('3d6'),
          note: 'S: 3d6 Wyrd.'
        }),
        M: outcome({
          damage: wyrd('2d6'),
          movement: step(5),
          note: 'M: 2d6 Wyrd and caster 5ft step.'
        }),
        F: outcome({
          damage: wyrd('1d6'),
          movement: penalty(5),
          note: 'F: 1d6 Wyrd and normal Fracture penalty.'
        })
      },
      'Uniform thirds across the committed S, M and F tile IDs before any face is entered.'
    ),
    damage: null,
    effectText: 'S: 3d6 Wyrd; M: 2d6 Wyrd and caster 5ft step; F: 1d6 Wyrd and normal Fracture. Uniform thirds, all spent.',
    manualRequirements: manual([
      'Fix the ordered committed triad and its d6 mapping before entering the face.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 17']
  }),
  optionalRecord({
    id: 'cw1_18',
    name: 'Warning Boundary',
    level: 5,
    actionPoints: 2,
    inputSymbols: [{ symbol: 'M' }, { symbol: 'F' }],
    count: 2,
    zoneTo: 'bound',
    roles: ['point'],
    rangeFeet: 30,
    damage: null,
    area: {
      kind: 'anomaly',
      radiusFeet: 5,
      placementRangeFeet: 30,
      trigger: 'first-enemy-original-voluntary-entry',
      triggerVictim: 'one-enemy',
      expires: 'endT+2',
      occupancyNote: 'Occupants at creation do not count as entry.',
      dismissal: { costAP: 1, note: 'Dismissal sends both bound IDs to spent.' },
      branches: {
        M: outcome({
          movement: step(5),
          note: 'M: creates an audible warning and an optional caster 5ft legal step using remaining movement.'
        }),
        F: outcome({
          movement: penalty(5, 'end-next-own-turn'),
          note: 'F: caster movement−5ft through end of next own turn.'
        })
      },
      boundary:
        'No attack or stop effect; one trigger victim only, never a multi-target attack. Same one-anomaly and dismissal rules as §3.',
      manualNote: 'The table confirms paths and relationship; the workshop never watches map pixels.'
    },
    effectText:
      '5ft anomaly; first enemy voluntary entry: M creates an audible warning and optional caster 5ft legal step; F gives caster−5ft to end next own turn. No attack/stop; expiry endT+2; same one-anomaly/dismiss rules.',
    manualRequirements: manual([
      'The table confirms the visible 5ft circle, its center point within 30ft, and the first enemy original voluntary entry.',
      'On trigger, expiry at endT+2 or paid 1-AP dismissal, both bound IDs go to spent.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 18']
  }),
  optionalRecord({
    id: 'cw1_19',
    name: 'Stabilizer’s Kit',
    level: 5,
    actionPoints: 2,
    inputSymbols: [{ symbol: 'S' }],
    count: 1,
    roles: ['self'],
    rangeFeet: 0,
    damage: null,
    expiry: 'endT+1',
    effectText:
      'Declare one carried mundane tool. +2 to one GM-called noncombat apparatus-calibration check this activity/endT+1. Does not manufacture tools, components or a free rest.',
    manualRequirements: manual([
      'Apply +2 to exactly one GM-called noncombat apparatus-calibration check; the kit does not manufacture tools, components or a free rest.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 19']
  }),
  optionalRecord({
    id: 'cw1_20',
    name: 'Safe Rehearsal',
    level: 5,
    actionPoints: 1,
    inputSymbols: [],
    count: 0,
    spendAllPrimary: false,
    roles: ['self'],
    rangeFeet: 0,
    damage: null,
    oncePerRest: true,
    effectText:
      '+2 to one GM-called noncombat risk-explanation check about one currently legal published set in this scene, without commitment, tile movement or roll. Merely inspecting odds/branches is always free; this price buys only the check bonus, not access to basic information.',
    manualRequirements: manual([
      'Inspecting odds and branches is always free; this once-per-rest price buys only the +2 check bonus.',
      'No commitment, tile movement or roll takes place.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 20']
  }),
  optionalRecord({
    id: 'cw1_21',
    name: 'Deep Shear',
    level: 6,
    actionPoints: 3,
    inputSymbols: [{ symbol: 'S' }, { symbol: 'F' }],
    count: 2,
    roles: ['enemy'],
    rangeFeet: 30,
    branchRule: uniformByTileId(
      {
        S: outcome({
          damage: wyrd('3d6+3'),
          note: 'S: 3d6+3 Wyrd.'
        }),
        F: outcome({
          damage: wyrd('2d6'),
          movement: penalty(10),
          note: 'F: 2d6 Wyrd and caster movement−10ft until next own-turn start.'
        })
      },
      'Uniform selection across the committed S and F tile IDs before any face is entered.'
    ),
    damage: null,
    effectText:
      'S: 3d6+3 Wyrd; F: 2d6 Wyrd and caster−10ft until next own-turn start. Stronger branch buys a worse downside.',
    manualRequirements: manual([
      'The F branch is a published −10ft downside and cannot be refunded by branch choice.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 21']
  }),
  optionalRecord({
    id: 'cw1_22',
    name: 'Return Line',
    level: 6,
    actionPoints: 2,
    inputSymbols: [{ symbol: 'M' }],
    count: 1,
    roles: ['self'],
    rangeFeet: 0,
    damage: null,
    effectText:
      'Up to 15ft legal displacement along a previously observed clear route, using remaining movement. Not teleport, forced escape or obstacle removal.',
    manualRequirements: manual([
      'The route must be previously observed and clear; displacement uses remaining legal movement and cannot remove obstacles or force an escape.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 22']
  }),
  optionalRecord({
    id: 'cw1_23',
    name: 'Retune Apparatus',
    level: 6,
    actionPoints: 2,
    inputSymbols: [{ symbol: 'F' }],
    zoneFrom: 'spent',
    zoneTo: 'available',
    count: 1,
    spendAllPrimary: false,
    roles: ['self'],
    rangeFeet: 0,
    damage: null,
    expiry: 'next-caster-turn-start',
    effectText:
      'Recover exactly that F and give self ward 4 to next caster-turn start. No other tile recovered; deliberately trades Fold’s broad recovery for protection.',
    manualRequirements: manual([
      'Recover exactly the chosen spent F; no other tile may be recovered.',
      'Track self ward 4 until next caster-turn start, one Wyrd event.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 23']
  }),
  optionalRecord({
    id: 'cw1_24',
    name: 'Hold the Sample',
    level: 6,
    actionPoints: 1,
    inputSymbols: [{ anyOf: ['S', 'M', 'F'] }],
    count: 1,
    zoneTo: 'bound',
    roles: ['material'],
    rangeFeet: 0,
    damage: null,
    area: {
      kind: 'inert-preservation',
      radiusFeet: 0,
      placementRangeFeet: 0,
      trigger: 'endT+2-or-1AP-release',
      triggerVictim: null,
      expires: 'endT+2',
      occupiesAnomalySlot: true,
      boundary:
        'No living, active magical, temporal or limitless preservation; the record occupies the one anomaly slot.',
      dismissal: { costAP: 1, note: 'Release sends the bound tile to spent.' },
      branches: null,
      manualNote: 'The table tracks the preserved arrangement and release manually.'
    },
    effectText:
      'Touch an actual inert material sample and preserve its observable arrangement until endT+2 or 1-AP release; tile then spent. Occupies the anomaly slot; no living, active magical, temporal or limitless preservation.',
    manualRequirements: manual([
      'Only an actual inert material sample may be preserved; the bound tile goes to spent at endT+2 or release.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 24']
  }),
  optionalRecord({
    id: 'cw1_25',
    name: 'Crossgrain Ray',
    level: 7,
    actionPoints: 3,
    inputSymbols: [{ symbol: 'S' }, { symbol: 'M' }, { symbol: 'F' }],
    count: 3,
    roles: ['enemy'],
    rangeFeet: 30,
    branchRule: uniformByTileId(
      {
        S: outcome({
          damage: wyrd('4d6'),
          note: 'S: 4d6 Wyrd.'
        }),
        M: outcome({
          damage: wyrd('2d6'),
          movement: step(10),
          note: 'M: 2d6 Wyrd and caster 10ft step.'
        }),
        F: outcome({
          damage: wyrd('2d6'),
          movement: penalty(10),
          note: 'F: 2d6 Wyrd and caster−10ft until next own-turn start.'
        })
      },
      'Uniform thirds across the committed S, M and F tile IDs before any face is entered.'
    ),
    damage: null,
    effectText: 'S: 4d6 Wyrd; M: 2d6 Wyrd and caster 10ft step; F: 2d6 Wyrd and caster−10ft until next start.',
    manualRequirements: manual([
      'Fix the ordered committed triad and its d6 mapping before entering the face.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 25']
  }),
  optionalRecord({
    id: 'cw1_26',
    name: 'Passed Opening',
    level: 7,
    actionPoints: 2,
    inputSymbols: [{ symbol: 'M' }],
    count: 1,
    roles: ['ally'],
    rangeFeet: 30,
    damage: null,
    effectText:
      'Ally may immediately make one 10ft legal derived displacement using remaining movement. No additional action, attack, reaction or resource generation.',
    manualRequirements: manual([
      'The ally’s 10ft derived displacement uses the ally’s remaining legal movement and generates no action, attack, reaction or resource.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 26']
  }),
  optionalRecord({
    id: 'cw1_27',
    name: 'Joint Containment',
    level: 7,
    actionPoints: 2,
    inputSymbols: [{ symbol: 'S' }, { symbol: 'F' }],
    count: 2,
    roles: ['ally'],
    rangeFeet: 30,
    damage: null,
    branchRule: uniformByTileId(
      {
        S: outcome({
          ward: wardOut(8, 'next-caster-turn-start', 'ally'),
          note: 'S: ally ward 8.'
        }),
        F: outcome({
          ward: wardOut(4, 'next-caster-turn-start', 'ally'),
          movement: penalty(10),
          note: 'F: ally ward 4 and caster−10ft until next own-turn start.'
        })
      },
      'Uniform selection across the committed S and F tile IDs before any face is entered.'
    ),
    effectText:
      'S: ally ward 8; F: ally ward 4 and caster−10ft until next start. One Wyrd event, expiry next caster-turn start; no ally tile pool.',
    manualRequirements: manual([
      'The ward covers one next Wyrd damage event before the next caster-turn start; the ally never gains a tile pool.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 27']
  }),
  optionalRecord({
    id: 'cw1_28',
    name: 'Trace Disturbance',
    level: 7,
    actionPoints: 2,
    inputSymbols: [{ anyOf: ['S', 'M', 'F'] }],
    count: 1,
    roles: ['disturbance'],
    rangeFeet: 30,
    damage: null,
    effectText:
      'One visible mundane disturbance/anomaly 30ft: identify direction of an actually observable change and one likely local stabilizer. No time travel, culprit identity or divination of future events.',
    manualRequirements: manual([
      'The GM answers only about actually observable change direction and one likely local stabilizer; no time travel, culprit identity or future divination.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 28']
  }),
  optionalRecord({
    id: 'cw1_29',
    name: 'Fault Needle',
    level: 8,
    actionPoints: 3,
    inputSymbols: [{ symbol: 'S' }, { symbol: 'F' }],
    count: 2,
    roles: ['enemy'],
    rangeFeet: 30,
    branchRule: uniformByTileId(
      {
        S: outcome({
          damage: wyrd('4d6+2'),
          note: 'S: 4d6+2 Wyrd.'
        }),
        F: outcome({
          damage: wyrd('2d6+2'),
          movement: penalty(10),
          note: 'F: 2d6+2 Wyrd and caster−10ft until next own-turn start.'
        })
      },
      'Uniform selection across the committed S and F tile IDs before any face is entered.'
    ),
    damage: null,
    effectText: 'S: 4d6+2 Wyrd; F: 2d6+2 Wyrd and caster−10ft until next start.',
    manualRequirements: manual([
      'Fix the ordered committed pair and its d6 mapping before entering the face.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 29']
  }),
  optionalRecord({
    id: 'cw1_30',
    name: 'Counterseal',
    level: 8,
    actionPoints: 2,
    inputSymbols: [{ symbol: 'S' }, { symbol: 'F' }],
    count: 2,
    roles: ['point'],
    rangeFeet: 30,
    damage: null,
    branchRule: uniformByTileId(
      {
        S: outcome({
          ward: wardOut(6),
          note: 'S: self ward 6.'
        }),
        F: outcome({
          movement: penalty(10),
          note: 'F: no ward and caster−10ft until next own-turn start.'
        })
      },
      'Uniform selection across the committed S and F tile IDs before any face is entered.'
    ),
    effectText:
      'End your own anomaly: all its bound tiles become spent; S grants self ward 6, F grants no ward and caster−10ft to next start. No hostile-effect dispel; impossible if an anomaly trigger is unresolved.',
    manualRequirements: manual([
      'Only your own anomaly can be ended; all its bound tiles become spent with no refund.',
      'The cast is impossible while that anomaly’s trigger is unresolved.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 30']
  }),
  optionalRecord({
    id: 'cw1_31',
    name: 'Lateral Refuge',
    level: 8,
    actionPoints: 2,
    inputSymbols: [{ symbol: 'M' }, { symbol: 'F' }],
    count: 2,
    roles: ['self'],
    rangeFeet: 0,
    damage: null,
    branchRule: uniformByTileId(
      {
        M: outcome({
          movement: displacement(20),
          note: 'M: 20ft legal displacement using remaining movement.'
        }),
        F: outcome({
          movement: displacement(5),
          penalty: penalty(10),
          note: 'F: 5ft legal displacement and caster−10ft until next own-turn start (both retained: displacement and caster penalty).'
        })
      },
      'Uniform selection across the committed M and F tile IDs before any face is entered.'
    ),
    effectText:
      'M: 20ft legal displacement; F: 5ft legal displacement and caster−10ft until next start. Both typed: the F branch carries a displacement component and a separate caster penalty with the next-own-turn-start expiry. Remaining movement still bounds both branches.',
    manualRequirements: manual([
      'Both displacements are bounded by remaining legal movement; the F branch also applies the −10ft penalty.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 31']
  }),
  optionalRecord({
    id: 'cw1_32',
    name: 'Public Experiment',
    level: 8,
    actionPoints: 2,
    inputSymbols: [{ symbol: 'S' }],
    count: 1,
    roles: ['apparatus'],
    rangeFeet: 10,
    damage: null,
    effectText:
      'One visible apparatus/material and willing witnesses 10ft: answer three distinct existing observable cause/boundary/stabilizer facts after a GM-adjudicated test. No generated loot or automatic success against an active hazard.',
    manualRequirements: manual([
      'The GM adjudicates the visible test and answers three distinct existing observable facts; no generated loot or automatic success against an active hazard.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 32']
  }),
  optionalRecord({
    id: 'cw1_33',
    name: 'Wyrd Crucible',
    level: 9,
    actionPoints: 4,
    inputSymbols: [{ symbol: 'S', count: 2 }, { symbol: 'F' }],
    count: 3,
    roles: ['enemy'],
    rangeFeet: 30,
    branchRule: uniformByTileId(
      {
        S: outcome({
          damage: wyrd('5d6'),
          note: 'S: 5d6 Wyrd.'
        }),
        F: outcome({
          damage: wyrd('2d6'),
          movement: penalty(10, 'end-next-own-turn'),
          note: 'F: 2d6 Wyrd and caster−10ft until end of next own turn.'
        })
      },
      'Uniform thirds across the committed S1, S2 and F tile IDs; all three are spent, one target.'
    ),
    damage: null,
    effectText:
      'S: 5d6 Wyrd; F: 2d6 Wyrd and caster−10ft until end next own turn. All three spent; one target.',
    manualRequirements: manual([
      'Both Surge tiles are committed; uniform thirds by tile ID, one target only.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 33']
  }),
  optionalRecord({
    id: 'cw1_34',
    name: 'Partitioned Shelter',
    level: 9,
    actionPoints: 3,
    inputSymbols: [{ symbol: 'S' }, { symbol: 'M' }, { symbol: 'F' }],
    count: 3,
    roles: ['ally'],
    rangeFeet: 30,
    damage: null,
    branchRule: uniformByTileId(
      {
        S: outcome({
          ward: wardOut(10, 'end-caster-next-turn', 'ally'),
          note: 'S: ward 10.'
        }),
        M: outcome({
          ward: wardOut(6, 'end-caster-next-turn', 'ally'),
          movement: step(5),
          note: 'M: ward 6 plus ally 5ft derived step.'
        }),
        F: outcome({
          ward: wardOut(4, 'end-caster-next-turn', 'ally'),
          movement: penalty(10, 'end-next-own-turn'),
          note: 'F: ward 4 and caster−10ft to end next own turn.'
        })
      },
      'Uniform thirds across the committed S, M and F tile IDs before any face is entered.'
    ),
    effectText:
      'S: ward 10; M: ward 6 plus ally 5ft derived step; F: ward 4 and caster−10ft to end next own turn. One Wyrd event, ward expiry end caster’s next turn.',
    manualRequirements: manual([
      'The ward covers one Wyrd event for the ally until the end of the caster’s next turn.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 34']
  }),
  optionalRecord({
    id: 'cw1_35',
    name: 'Unbind the Test',
    level: 9,
    actionPoints: 2,
    inputSymbols: [{ anyOf: ['S', 'M', 'F'] }],
    count: 1,
    roles: ['material'],
    rangeFeet: 0,
    damage: null,
    effectText:
      'Safely close your own inert Hold Sample/Signal Coin record early; its bound tile, if any, becomes spent; answer one observable failure-mode question. No undo of accepted outcomes or recovery of another caster’s contents.',
    manualRequirements: manual([
      'Only your own inert record can be closed; its bound tile becomes spent with no recovery.',
      'No accepted outcome is undone and another caster’s contents are never recovered.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 35']
  }),
  optionalRecord({
    id: 'cw1_36',
    name: 'Read the Whole Apparatus',
    level: 9,
    actionPoints: 3,
    inputSymbols: [{ symbol: 'S' }, { symbol: 'M' }],
    count: 2,
    roles: ['apparatus'],
    rangeFeet: 30,
    damage: null,
    effectText:
      'Visible apparatus 30ft: four distinct existing material/boundary/stabilizer/failure-path questions; no guaranteed correct future outcome, creature mind or unknown history.',
    manualRequirements: manual([
      'The GM answers four distinct existing observable questions; no future outcome guarantee, creature mind or unknown history.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 36']
  }),
  optionalRecord({
    id: 'cw1_37',
    name: 'Finite Cataclysm',
    level: 10,
    actionPoints: 4,
    inputSymbols: [
      { tileIds: ['S1', 'S2'] },
      { symbol: 'M' },
      { symbol: 'F' }
    ],
    count: 4,
    roles: ['enemy'],
    rangeFeet: 30,
    oncePerRest: true,
    branchRule: uniformByTileId(
      {
        S: outcome({
          damage: wyrd('6d6'),
          note: 'S: 6d6 Wyrd (both Surge tiles carry this branch).'
        }),
        M: outcome({
          damage: wyrd('3d6'),
          movement: step(10),
          note: 'M: 3d6 Wyrd and caster 10ft step.'
        }),
        F: outcome({
          damage: wyrd('2d6'),
          movement: penalty(10, 'end-next-own-turn'),
          note: 'F: 2d6 Wyrd and caster−10ft through end of next own turn.'
        })
      },
      'Uniform ID weights 1/2 Surge, 1/4 Shift, 1/4 Fracture; one enemy, no explosion.'
    ),
    damage: null,
    effectText:
      'S: 6d6 Wyrd; M: 3d6 Wyrd and caster 10ft step; F: 2d6 Wyrd and caster−10ft through end next own turn. Uniform ID weights 1/2, 1/4, 1/4; one enemy, no explosion.',
    manualRequirements: manual([
      'Fix the full four-ID commitment and d4 mapping before the face; exactly one enemy target, no explosion.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 37']
  }),
  optionalRecord({
    id: 'cw1_38',
    name: 'Sixfold Audit',
    level: 10,
    actionPoints: 3,
    inputSymbols: [{ anyTiles: 3, distinct: true }],
    count: 3,
    roles: ['apparatus'],
    rangeFeet: 0,
    oncePerRest: true,
    damage: null,
    effectText:
      'Touch one visible inert apparatus/real anomaly; choose six distinct observable material/boundary/stabilizer/failure-path questions. Does not reveal hidden actors, passwords or future RNG.',
    manualRequirements: manual([
      'Three distinct available tile IDs are spent; the GM answers six distinct observable questions only.',
      'No hidden actors, passwords or future random outcomes are revealed.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 38']
  }),
  optionalRecord({
    id: 'cw1_39',
    name: 'Final Safe Passage',
    level: 10,
    actionPoints: 3,
    inputSymbols: [{ symbol: 'M' }, { symbol: 'F' }],
    count: 2,
    roles: ['ally'],
    rangeFeet: 30,
    oncePerRest: true,
    branchRule: uniformByTileId(
      {
        M: outcome({
          movement: displacement(20),
          note: 'M: ally 20ft legal derived displacement.'
        }),
        F: outcome({
          movement: displacement(5),
          penalty: penalty(10, 'end-next-own-turn'),
          note: 'F: ally 5ft displacement and caster−10ft through end next own turn (both retained: ally displacement and caster penalty).'
        })
      },
      'Uniform selection across the committed M and F tile IDs before any face is entered.'
    ),
    damage: null,
    effectText:
      'M: ally 20ft legal derived displacement; F: ally 5ft and caster−10ft through end next own turn. Both typed: the F branch carries the ally displacement component and a separate caster penalty with the end-next-own-turn expiry. All remaining movement/permission constraints stand.',
    manualRequirements: manual([
      'All remaining movement and permission constraints apply to the derived displacement.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 39']
  }),
  optionalRecord({
    id: 'cw1_40',
    name: 'Shelter of Alternatives',
    level: 10,
    actionPoints: 4,
    inputSymbols: [{ symbol: 'S' }, { symbol: 'M' }, { symbol: 'F' }],
    count: 3,
    roles: ['ally'],
    rangeFeet: 30,
    oncePerRest: true,
    branchRule: uniformByTileId(
      {
        S: outcome({
          ward: wardOut(14, 'end-caster-next-turn', 'ally'),
          note: 'S: ward 14.'
        }),
        M: outcome({
          ward: wardOut(8, 'end-caster-next-turn', 'ally'),
          movement: step(5),
          note: 'M: ward 8 plus ally 5ft step.'
        }),
        F: outcome({
          ward: wardOut(6, 'end-caster-next-turn', 'ally'),
          movement: penalty(10, 'end-next-own-turn'),
          note: 'F: ward 6 and caster−10ft through end of next turn.'
        })
      },
      'Uniform thirds across the committed S, M and F tile IDs before any face is entered.'
    ),
    effectText:
      'S: ward 14; M: ward 8 plus ally 5ft step; F: ward 6 and caster−10ft through end next turn. One Wyrd event, ward expires end next caster turn.',
    manualRequirements: manual([
      'The ward covers one Wyrd event for the ally until the end of the caster’s next turn.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 row 40']
  })
];

/* ------------------------------------------------------------------ */
/* Core records (rules §3)                                            */
/* ------------------------------------------------------------------ */

export const CHAOS_WEAVER_CORE_SPELLS = [
  activeRecord({
    id: 'cr1_chaos_weaver_fold_odds',
    name: 'Fold the Odds',
    level: 1,
    source: 'core',
    actionPoints: 1,
    inputSymbols: [{ anyOf: ['S', 'M', 'F'], minCount: 1, maxCount: 2 }],
    zoneFrom: 'spent',
    zoneTo: 'available',
    count: 2,
    spendAllPrimary: false,
    roles: ['self'],
    rangeFeet: 0,
    damage: null,
    effectText:
      'Costs 1 AP and recovers one or two selected spent IDs. None spent means unavailable. Never recovers committed/bound IDs. No free per-turn recovery or symbol exchange; repeating Fold requires another actual AP payment at the table.',
    manualRequirements: manual([
      'Select one or two spent IDs explicitly by tile ID; committed and bound IDs are never eligible.',
      'Record the actual 1-AP payment for every use, including repeats in one turn.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §3 rule 3', 'CLASS-C1-CHAOS-WEAVER.md §5 core grants']
  }),
  activeRecord({
    id: 'cr1_chaos_weaver_split_possibility',
    name: 'Split Possibility',
    level: 1,
    source: 'core',
    actionPoints: 2,
    inputSymbols: [{ symbol: 'F' }, { anyOf: ['S', 'M'] }],
    count: 2,
    roles: ['enemy'],
    rangeFeet: 30,
    branchRule: uniformByTileId(
      {
        S: outcome({
          damage: wyrd('2d6'),
          note: 'S: 2d6 Wyrd.'
        }),
        M: outcome({
          damage: wyrd('1d6'),
          movement: step(5),
          note: 'M: 1d6 Wyrd and optional 5ft caster displacement using remaining legal movement.'
        }),
        F: outcome({
          damage: wyrd('1d6'),
          movement: penalty(5),
          note: 'F: 1d6 Wyrd and caster movement−5ft until next own-turn start.'
        })
      },
      'Publish the exact ordered pair and all branches before the face; uniformly select one ID; both become spent irrespective of result.'
    ),
    damage: null,
    effectText:
      'Choose one available F and one available S or M; publish the exact ordered pair and all branches before the face. Both tiles become committed. Uniformly select one ID, then both become spent irrespective of result. Default branches: S: 2d6 Wyrd; M: 1d6 Wyrd and optional 5ft caster displacement; F: 1d6 Wyrd and caster movement−5ft until next own-turn start.',
    manualRequirements: manual([
      'Fix the ordered pair and its mapping in the pending record before entering the face.',
      'All targets, geometry, mitigation, critical and hit legality are GM-adjudicated; no hidden Evasion bypass or second attack roll is inferred.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §3 rule 4', 'CLASS-C1-CHAOS-WEAVER.md §5 core grants']
  }),
  activeRecord({
    id: 'cw1_dismiss_anomaly',
    name: 'Dismiss Anomaly',
    level: 1,
    source: 'core',
    actionPoints: 1,
    inputSymbols: [],
    count: 0,
    spendAllPrimary: false,
    roles: ['self'],
    rangeFeet: 0,
    damage: null,
    effectText:
      'ACTION 1 AP / mana 0, self’s one anomaly only, no new tile cost, instant: all its bound IDs become spent and the anomaly closes. Refuse if none exists or its trigger is unresolved. Dismissal is known but unusable until an actual binding is present, never a recovery pick tax.',
    manualRequirements: manual([
      'Only your own existing anomaly can be dismissed; refuse while its trigger is unresolved.',
      'All bound IDs become spent with no refund.'
    ]),
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 core grants']
  })
];

/* ------------------------------------------------------------------ */
/* Talent-grant active records (§5 talent table)                      */
/* ------------------------------------------------------------------ */

export const CHAOS_WEAVER_TALENT_ACTIVE_SPELLS = [
  activeRecord({
    id: 'cr1_chaos_weaver_bias_draw',
    name: 'Bias the Draw',
    level: 3,
    source: 'talent',
    treeId: 'probability-sculptor',
    actionPoints: 2,
    inputSymbols: [{ symbol: 'S', count: 2 }, { symbol: 'F' }],
    count: 3,
    roles: ['enemy'],
    rangeFeet: 30,
    branchRule: uniformByTileId(
      {
        S: outcome({
          damage: wyrd('2d6'),
          note: 'S: the Split Surge branch — 2d6 Wyrd.'
        }),
        F: outcome({
          damage: wyrd('1d6'),
          movement: penalty(5),
          note: 'F: the Split Fracture branch — 1d6 Wyrd and caster movement−5ft until next own-turn start.'
        })
      },
      'Both Surge tiles plus one Fracture; uniform ID sampling gives 2/3 S, 1/3 F. C1 never changes tile weights or adds an invisible outcome.'
    ),
    damage: null,
    effectText:
      'Costs 2 AP, both S plus one F: uniform ID sampling gives 2/3 S, 1/3 F. Use the Split S/F branches; all three are spent.',
    manualRequirements: manual([
      'Publish the three-tile commitment and mapping before the face; uniform ID weights 2/3–1/3.',
      'Base Split branches apply; Split-only talent modifiers apply only when a talent row explicitly names Bias the Draw.'
    ]),
    requires: {
      nodeId: 'cw1_ps_n05',
      requiresPoints: 10,
      requiresAll: true,
      predecessorNodeIds: ['cw1_ps_n03'],
      minLevel: 3
    },
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §3 rule 6', 'CLASS-C1-CHAOS-WEAVER.md §5 talent table']
  }),
  activeRecord({
    id: 'cr1_chaos_weaver_unsteady_ground',
    name: 'Unsteady Ground',
    level: 3,
    source: 'talent',
    treeId: 'anomaly-binder',
    actionPoints: 2,
    inputSymbols: [{ symbol: 'M' }, { symbol: 'F' }],
    count: 2,
    zoneTo: 'bound',
    roles: ['point'],
    rangeFeet: 30,
    damage: null,
    area: {
      kind: 'anomaly',
      radiusFeet: 5,
      placementRangeFeet: 30,
      trigger: 'first-enemy-original-voluntary-entry',
      triggerVictim: 'one-enemy',
      expires: 'endT+2',
      occupancyNote: 'Occupants at creation do not count as entry.',
      dismissal: { costAP: 1, note: 'Paid 1-AP dismissal sends both IDs to spent.' },
      branches: {
        M: outcome({
          movement: endsMovement(),
          note: 'M: ends that actor’s remaining movement for the current turn.'
        }),
        F: outcome({
          movement: penalty(5, 'end-next-own-turn'),
          note: 'F: caster movement−5ft through end of next own turn.'
        })
      },
      boundary:
        'No damage, refund, second target or forced-movement trigger. Either branch, expiry at endT+2, or paid 1-AP dismissal sends both IDs to spent.',
      manualNote: 'The table confirms paths and relationship; the workshop never watches map pixels.'
    },
    effectText:
      'Bind one M and one F in a visible 5ft-radius circle within 30ft. One anomaly; first enemy original voluntary entry draws once. M ends that actor’s remaining movement; F gives caster movement−5ft through end of next own turn. Both IDs go to spent on trigger, expiry endT+2 or paid 1-AP dismissal.',
    manualRequirements: manual([
      'The table confirms the visible circle, the first enemy original voluntary entry and path legality.',
      'Only one anomaly may exist; occupants at creation never count as entry.'
    ]),
    requires: {
      nodeId: 'cw1_ab_n05',
      requiresPoints: 10,
      requiresAll: true,
      predecessorNodeIds: ['cw1_ab_n03'],
      minLevel: 3
    },
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §3 rule 7', 'CLASS-C1-CHAOS-WEAVER.md §5 talent table']
  }),
  activeRecord({
    id: 'cr1_chaos_weaver_second_possibility',
    name: 'Second Possibility',
    level: 3,
    source: 'talent',
    treeId: 'cascade-weaver',
    actionPoints: 3,
    inputSymbols: [{ symbol: 'F' }, { anyOf: ['S', 'M'] }],
    count: 2,
    roles: ['enemy', 'ally'],
    rangeFeet: 30,
    maxSubjects: 2,
    branchRule: uniformByTileId(
      {
        S: outcome({
          damage: wyrd('2d6'),
          note: 'S: the Split Surge branch — 2d6 Wyrd.'
        }),
        M: outcome({
          damage: wyrd('1d6'),
          movement: step(5),
          note: 'M: the Split Shift branch — 1d6 Wyrd and caster 5ft step.'
        }),
        F: outcome({
          damage: wyrd('1d6'),
          movement: penalty(5),
          note: 'F: the Split Fracture branch — 1d6 Wyrd and caster movement−5ft until next own-turn start.'
        })
      },
      'Ordinary Split plus one predeclared willing ally within 30ft; after the retained primary branch, optionally spend one further available reserved tile for that ally’s legal 5ft displacement, or decline.'
    ),
    damage: null,
    continuation: {
      kind: 'single-optional-continuation',
      afterPrimaryResult: true,
      choices: [
        {
          id: 'ally-displacement',
          tileSymbols: ['M'],
          baseFeet: 5,
          effectText:
            'Spend the reserved M for the predeclared ally’s legal 5ft displacement using its remaining movement.',
          requiresTalentId: null
        },
        {
          id: 'ally-ward',
          tileSymbols: ['S'],
          baseWard: 3,
          effectText:
            'Spend the reserved S for ward 3–5 to that ally until the next caster start (requires Optional Shelter).',
          requiresTalentId: 'cw1_ca_n10'
        }
      ],
      reservationRule:
        'The optional tile must be reserved from availability before the primary draw; it occupies committed while the choice is pending. Decline returns only that unused reservation, never the primary tiles.',
      singleFollowUpRule:
        'Exactly one derived follow-up; it generates no new draw, tile, reaction or anomaly trigger.',
      chooseBeforeCommit: true
    },
    effectText:
      'Costs 3 AP: ordinary Split plus one predeclared willing ally within 30ft. After the retained primary branch, optionally spend one further available M for that ally’s legal 5ft displacement using its remaining movement; otherwise decline. The main result/Fracture stands. Exactly one derived follow-up.',
    manualRequirements: manual([
      'Reserve the exact optional continuation ID before the primary draw; continuations never enter the primary sample.',
      'Retain the branch selection/result first, then the one continuation choice, then record primary+continuation together.',
      'No repeated primary effect while the choice is pending; one unresolved action across all casts.'
    ]),
    requires: {
      nodeId: 'cw1_ca_n05',
      requiresPoints: 10,
      requiresAll: true,
      predecessorNodeIds: ['cw1_ca_n03'],
      minLevel: 3
    },
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §3 rule 8', 'CLASS-C1-CHAOS-WEAVER.md §5 talent table']
  }),
  activeRecord({
    id: 'cw1_closed_distribution',
    name: 'Closed Distribution',
    level: 10,
    source: 'talent',
    treeId: 'probability-sculptor',
    actionPoints: 3,
    inputSymbols: [{ anyOf: ['S', 'M'], count: 2, sameSymbol: true }, { symbol: 'F' }],
    count: 3,
    roles: ['enemy'],
    rangeFeet: 30,
    oncePerRest: true,
    branchRule: uniformByTileId(
      {
        S: outcome({
          damage: wyrd('4d6'),
          note: 'S: 4d6 Wyrd.'
        }),
        M: outcome({
          damage: wyrd('2d6'),
          movement: step(5),
          note: 'M: 2d6 Wyrd and caster 5ft step.'
        }),
        F: outcome({
          damage: wyrd('2d6'),
          movement: penalty(5),
          note: 'F: 2d6 Wyrd and the normal Fracture penalty.'
        })
      },
      'Two same-symbol S or M tiles plus one F; uniform three-ID draw; all three spent; no guaranteed branch, extra tile or second sample.'
    ),
    damage: null,
    effectText:
      'AP 3 / two same-symbol S or M plus F; once/rest. Uniform three-ID draw. S: 4d6 Wyrd; M: 2d6 Wyrd + caster 5ft step; F: 2d6 Wyrd + normal Fracture. All three spent.',
    manualRequirements: manual([
      'The two chosen tiles must share one symbol (both S or both M) plus one F.',
      'Once per rest; the grant does not refresh any once/rest use.'
    ]),
    requires: {
      nodeId: 'cw1_ps_n18',
      requiresPoints: 45,
      requiresAll: true,
      predecessorNodeIds: ['cw1_ps_n05', 'cw1_ps_n16', 'cw1_ps_n17'],
      minLevel: 10
    },
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 talent table']
  }),
  activeRecord({
    id: 'cw1_last_boundary',
    name: 'Last Boundary',
    level: 10,
    source: 'talent',
    treeId: 'anomaly-binder',
    actionPoints: 3,
    inputSymbols: [{ tileIds: ['M1', 'M2'] }, { symbol: 'F' }],
    count: 3,
    zoneTo: 'bound',
    roles: ['point'],
    rangeFeet: 30,
    oncePerRest: true,
    damage: null,
    area: {
      kind: 'anomaly',
      radiusFeet: 10,
      placementRangeFeet: 30,
      trigger: 'first-enemy-original-voluntary-entry',
      triggerVictim: 'one-enemy',
      expires: 'endT+3',
      occupancyNote: 'Occupants at creation do not count as entry.',
      dismissal: { costAP: 1, note: 'Paid 1-AP dismissal sends all three IDs to spent.' },
      branches: {
        M: outcome({
          movement: endsMovement(),
          note: 'M: ends the victim’s remaining movement for the current turn.'
        }),
        F: outcome({
          movement: penalty(10, 'end-next-own-turn'),
          note: 'F: caster movement−10ft through end of next own turn.'
        })
      },
      boundary:
        'All three spent on trigger, expiry or dismissal. Never coexists with another anomaly.',
      manualNote: 'The table confirms paths and relationship; the workshop never watches map pixels.'
    },
    effectText:
      'M1+M2+F bound; once/rest. One visible 10ft anomaly 30ft, expires endT+3. First enemy original voluntary entry: M ends remaining movement; F gives caster−10ft through end next own turn. All three spent on trigger/expiry/dismiss. Never coexists with another anomaly.',
    manualRequirements: manual([
      'Both Shift tiles plus one Fracture are bound; exactly one anomaly may exist.'
    ]),
    requires: {
      nodeId: 'cw1_ab_n18',
      requiresPoints: 45,
      requiresAll: true,
      predecessorNodeIds: ['cw1_ab_n05', 'cw1_ab_n16', 'cw1_ab_n17'],
      minLevel: 10
    },
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 talent table']
  }),
  activeRecord({
    id: 'cw1_single_aftershock',
    name: 'Single Aftershock',
    level: 10,
    source: 'talent',
    treeId: 'cascade-weaver',
    actionPoints: 4,
    inputSymbols: [{ symbol: 'F' }, { anyOf: ['S', 'M'] }],
    count: 2,
    roles: ['enemy', 'ally'],
    rangeFeet: 30,
    maxSubjects: 2,
    oncePerRest: true,
    branchRule: uniformByTileId(
      {
        S: outcome({
          damage: wyrd('3d6'),
          note: 'S: 3d6 Wyrd.'
        }),
        M: outcome({
          damage: wyrd('2d6'),
          movement: step(5),
          note: 'M: 2d6 Wyrd + caster 5ft step.'
        }),
        F: outcome({
          damage: wyrd('2d6'),
          movement: penalty(5),
          note: 'F: 2d6 Wyrd + normal Fracture.'
        })
      },
      'Split pair plus one predeclared willing ally within 30ft, once/rest.'
    ),
    damage: null,
    continuation: {
      kind: 'single-optional-continuation',
      afterPrimaryResult: true,
      choices: [
        {
          id: 'extra-shift-move',
          tileSymbols: ['M'],
          baseFeet: 10,
          effectText: 'Spend the reserved M for a 10ft derived step for the ally.',
          requiresTalentId: null
        },
        {
          id: 'extra-surge-ward',
          tileSymbols: ['S'],
          baseWard: 6,
          effectText: 'Spend the reserved S for ward 6 to the ally until the next caster start.',
          requiresTalentId: null
        }
      ],
      reservationRule:
        'Reserve the exact optional ID before the primary draw; one choice, never both; decline returns only that unused reservation.',
      singleFollowUpRule: 'Exactly one derived follow-up; no new draw, tile, reaction or anomaly trigger.',
      chooseBeforeCommit: true
    },
    effectText:
      'AP 4 / Split pair + optional S or M; once/rest. Primary S: 3d6 Wyrd; M: 2d6 Wyrd + caster 5ft step; F: 2d6 Wyrd + normal Fracture. One predeclared willing ally 30ft; optional extra S buys ward 6 to next caster start, OR extra M buys 10ft derived step. One choice, never both.',
    manualRequirements: manual([
      'Reserve the exact optional ID before the primary draw; the reserved ID never enters the primary sample.'
    ]),
    requires: {
      nodeId: 'cw1_ca_n18',
      requiresPoints: 45,
      requiresAll: true,
      predecessorNodeIds: ['cw1_ca_n05', 'cw1_ca_n16', 'cw1_ca_n17'],
      minLevel: 10
    },
    sourceRefs: ['CLASS-C1-CHAOS-WEAVER.md §5 talent table']
  })
];

export const CHAOS_WEAVER_ACTIVE_SPELLS = [
  ...CHAOS_WEAVER_OPTIONAL_SPELLS,
  ...CHAOS_WEAVER_CORE_SPELLS,
  ...CHAOS_WEAVER_TALENT_ACTIVE_SPELLS
];

export const CHAOS_WEAVER_SPELLS_BY_ID = Object.fromEntries(
  CHAOS_WEAVER_ACTIVE_SPELLS.map((record) => [record.id, record])
);

export const CHAOS_WEAVER_ACTIVE_COUNTS = {
  optional: CHAOS_WEAVER_OPTIONAL_SPELLS.length,
  core: CHAOS_WEAVER_CORE_SPELLS.length,
  talentActives: CHAOS_WEAVER_TALENT_ACTIVE_SPELLS.length,
  total: CHAOS_WEAVER_ACTIVE_SPELLS.length
};

/* ------------------------------------------------------------------ */
/* Resource rules (§3 rules 1–12, class-local manual semantics)        */
/* ------------------------------------------------------------------ */

export const CHAOS_WEAVER_RESOURCE_RULES = [
  {
    id: 'cw-r01',
    title: 'Six exact IDs, four zones, one zone each',
    text:
      'Every one of the six IDs occurs in exactly one zone (available, committed, bound, spent). A tile never changes symbol. Reject duplicate/foreign/missing IDs, contradictory pending/anomaly ownership or malformed imported state; preserve the rejected JSON as an exportable draft, not a repaired playable state.'
  },
  {
    id: 'cw-r02',
    title: 'Explicit completed long rest only',
    text:
      'At one explicitly confirmed completed long rest, after all pending actions/anomalies have settled, all six become available and once/rest uses clear. Initiative, level gain, class selection, view remount, short rest or reconnect never refills. The workshop requires a new manual rest label; this is a rehearsal check, not trusted event identity.'
  },
  {
    id: 'cw-r03',
    title: 'Fold the Odds is paid recovery',
    text:
      'Fold the Odds costs 1 AP and recovers one or two selected spent IDs. None spent means unavailable. Never recovers committed/bound IDs. No free per-turn recovery or symbol exchange. Repeating Fold requires another actual AP payment at the table.'
  },
  {
    id: 'cw-r04',
    title: 'Split Possibility publishes the pair first',
    text:
      'Costs 2 AP: choose one available F and one available S or M; publish the exact ordered pair and all branches before the face. Both tiles become committed. Uniformly select one ID, then both become spent irrespective of result.'
  },
  {
    id: 'cw-r05',
    title: 'Default Split branches',
    text:
      'S: 2d6 Wyrd; M: 1d6 Wyrd and optional 5ft caster displacement using remaining legal movement; F: 1d6 Wyrd and caster movement−5ft until next own-turn start. All targets/geometry/mitigation/critical/hit legality are GM-adjudicated; no hidden Evasion bypass or second attack roll is inferred.'
  },
  {
    id: 'cw-r06',
    title: 'Bias the Draw weights are published',
    text:
      'Costs 2 AP, both S plus one F: uniform ID sampling gives 2/3 S, 1/3 F. Use the Split S/F branches; all three are spent. C1 never changes tile weights or adds an invisible outcome.'
  },
  {
    id: 'cw-r07',
    title: 'Unsteady Ground is one visible anomaly',
    text:
      'Costs 2 AP: bind one M and one F in a visible 5ft-radius circle within 30ft. One anomaly; first enemy original voluntary entry draws once. M ends that actor’s remaining movement for the current turn; F gives caster movement−5ft through end of next own turn. Either branch, expiry at endT+2, or paid 1-AP dismissal sends both IDs to spent. No damage, refund, second target or forced-movement trigger. Occupants at creation do not count as entry. The table confirms paths and relationship; the workshop never watches map pixels.'
  },
  {
    id: 'cw-r08',
    title: 'Second Possibility reserves one continuation',
    text:
      'Costs 3 AP: ordinary Split plus one predeclared willing ally within 30ft. After the retained primary branch, optionally spend one further available M for that ally’s legal 5ft displacement using its remaining movement; otherwise decline. The main result/Fracture stands. Exactly one derived follow-up; it generates no new draw, tile, reaction or anomaly trigger. The optional M must be reserved from availability before the primary draw if selected as a promised follow-up; unused reservation returns only after the recorded decline, never the primary tiles. It occupies committed while choice is pending.'
  },
  {
    id: 'cw-r09',
    title: 'Retain the result, then the continuation, then record',
    text:
      'C1 resolves the R1 wording ambiguity: branch selection/result is retained first, then the one continuation choice, then the GM records primary+continuation together. No repeated primary effect while that choice is pending. One unresolved action across all casts; no Fold/rest/native exchange while pending. An existing nonpending anomaly may coexist with a cast only if enough other IDs are available.'
  },
  {
    id: 'cw-r10',
    title: 'Cancellation, void and settlement',
    text:
      'Before manual commitment, cancel freely. After commitment, no resource refund or new face from cancellation/timeouts. An impossible/unresolved branch stays locked until the table records settlement/GM void with a reason; a void never invents a favorable new result. The workshop has no automatic “timed out = failed” transition.'
  },
  {
    id: 'cw-r11',
    title: 'Uniform physical mapping is fixed before the face',
    text:
      'Sort committed IDs in S1,S2,M1,M2,F1,F2 order. Two IDs: d6 faces 1–3 select first, 4–6 second. Three IDs: 1–2 first, 3–4 second, 5–6 third. Four IDs: d4 direct. Retain the mapping before entering the face. Damage dice are separate original dice, never reuse the selection face as damage. No digital RNG is needed for this deliverable.'
  },
  {
    id: 'cw-r12',
    title: 'Penalties and wards are manual order rules',
    text:
      'Same-source Fracture penalty refreshes its published expiry; penalties from different actions use largest feet reduction, not a sum, to minimum remaining movement 0. They never refund movement already used. Wards prevent the stated assigned Wyrd damage before temp HP, once; strongest eligible C1 ward only, no stacking, no fate-transfer interaction inferred. Wards/timing are manual rules only.'
  }
];

export const CHAOS_WEAVER_SETTLEMENT_RULES = {
  oneUnresolvedAction:
    'Only one unresolved action exists across all casts; no Fold, rest or native exchange while pending.',
  oneAnomaly:
    'At most one anomaly: an existing nonpending anomaly may coexist with a cast only if enough other IDs are available.',
  commitmentOrder:
    'Cancel freely before manual commitment; after commitment no refund and no new face from cancellation or timeout.',
  continuationTiming:
    'No repeated primary effect while the continuation choice is pending; record primary+continuation together.'
};

export const CHAOS_WEAVER_RULESET = {
  classId: CHAOS_WEAVER_CLASS_ID,
  rulesetVersion: CHAOS_WEAVER_RULESET_VERSION,
  authoredOnly: true,
  executionEnabled: false,
  applicationMode: 'manual-tabletop',
  tileIds: CHAOS_WEAVER_TILE_IDS,
  tileSymbols: CHAOS_WEAVER_TILE_SYMBOLS,
  zones: CHAOS_WEAVER_TILE_ZONES,
  treeIds: CHAOS_WEAVER_TREE_IDS,
  talents: {
    nodesPerTree: 18,
    maxRanksPerTree: 50,
    characterPointCap: 50,
    pointsPerLevel: 5,
    signatureMinPoints: 10,
    signatureMinLevel: 3,
    capstoneMinPoints: 45,
    capstoneMinLevel: 10,
    prerequisiteRule: 'Every listed predecessor must be fully ranked; prerequisites are AND. Gates count already-spent points in the same tree.'
  },
  levelCap: 10,
  nativeRule:
    'Prepared Exchange: once per completed long rest, before commitment and with no pending action, consume one actual prepared spare part; exchange one chosen spent ID with one chosen available ID of a different symbol (one each changes zone; no symbol changes); caster movement−5ft until next own-turn start. Additional AP 0, mana 0. Manual verification required, no automatic benefit.'
};
