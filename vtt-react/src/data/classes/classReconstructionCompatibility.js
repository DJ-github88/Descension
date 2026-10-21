/*
 * Roster reconstruction compatibility table (data-only).
 *
 * Source: docs/plans/mythrill-class-reconstruction/34_ROSTER_INTEGRATION_COHORTS.md
 * — "Binding decisions and compatibility treatment".
 *
 * This is a roster lookup, not a lifecycle framework:
 *  - every row keeps the exact legacy key/IDs and an explicit successor list;
 *  - `automaticConversion` is false everywhere; migration is a future,
 *    separate, user-initiated field-level mapping;
 *  - legacy resolution (class resolver, spells, talents, resources) stays
 *    untouched for every legacy key;
 *  - these one-to-many rows must never be inserted into
 *    CLASS_COMPATIBILITY_ALIASES (whose semantics collapse identity/heritage).
 *
 * RI-1 seeds the identity rows below; later cohorts append per-spell,
 * per-node and per-variant dispositions to `recordDispositions`.
 */

import { GAMBIT_DATA } from './gambitData';
import { AUGUR_DISPOSITIONS } from './augurDispositions';
import { GAMBIT_PROBABILITY_SAVANT, GAMBIT_HIGH_ROLLER, GAMBIT_KARMIC_WEAVER } from '../talentTrees/gambit';

const gambitTrees = [
  ['probability_savant', GAMBIT_PROBABILITY_SAVANT],
  ['high_roller', GAMBIT_HIGH_ROLLER],
  ['karmic_weaver', GAMBIT_KARMIC_WEAVER]
];
const retained = (sourceType, sourceId) => ({
  sourceType, sourceId, sourceClassId: 'gambit', disposition: 'keep',
  destinationClassId: 'gambit', destinationId: null, automaticConversion: false,
  rationale: `Keep ${sourceType} ${sourceId} under its exact legacy Gambit identity and semantics. Accepted G1 uses new cr1_gambler_* definitions, not a semantic or saved-state conversion.`
});
export const GAMBIT_RECORD_DISPOSITIONS = [
  ...[...new Set([...(GAMBIT_DATA.spells || GAMBIT_DATA.exampleSpells || []).map(spell => spell.id), ...Object.values(GAMBIT_DATA.spellPools || {}).flat()])].map(spellId => retained('spell', spellId)),
  ...gambitTrees.map(([treeId]) => retained('talent-tree', treeId)),
  ...gambitTrees.flatMap(([, nodes]) => nodes.map(node => retained('materialized-talent', `talent-spell-${node.id}`)))
];

export const RECONSTRUCTION_RELATIONSHIPS = [
  'split',
  'merged-design',
  'successor-name',
  'under-review'
];

export const RECONSTRUCTION_COMPATIBILITY_ROWS = [
  {
    legacyKey: 'gambit',
    legacyNames: ['Gambit'],
    row: {
      relationship: 'split',
      legacyResolutionRetained: true,
      automaticConversion: false,
      noAutomaticDestination: true,
      successors: [
        { id: 'gambler', name: 'Gambler', relationship: 'split' },
        { id: 'fate-weaver', name: 'Fate Weaver', relationship: 'split' },
        { id: 'chaos-weaver', name: 'Chaos Weaver', relationship: 'split' }
      ],
      notes:
        'Retain Gambit resolver/data/spells/talents/resources for existing saves. ' +
        'One-to-many successor choices only; no Fortune -> hand/thread/tile conversion. ' +
        'Legacy Mayhem and all current Gambit IDs keep resolving exactly.',
      recordDispositions: GAMBIT_RECORD_DISPOSITIONS
    }
  },
  {
    legacyKey: 'augur',
    legacyNames: ['Augur', 'Nereid Myrathil Augur'],
    row: {
      relationship: 'merged-design',
      legacyResolutionRetained: true,
      automaticConversion: false,
      noAutomaticDestination: true,
      successors: [{ id: 'fate-weaver', name: 'Fate Weaver', relationship: 'merged-design' }],
      notes:
        'Preserve old Augur saves, Nereid variant keys, omens/debt, spell/node/materialized IDs and provenance. ' +
        'Fate Weaver receives individually assessed techniques only; no wholesale dual-bank inheritance.',
      recordDispositions: AUGUR_DISPOSITIONS
    }
  },
  {
    legacyKey: 'harbinger',
    legacyNames: ['Harbinger'],
    row: {
      relationship: 'successor-name',
      legacyResolutionRetained: true,
      automaticConversion: false,
      successors: [{ id: 'doomsayer', name: 'Doomsayer', relationship: 'successor-name' }],
      notes:
        'Old Harbinger still loads exact Mayhem and known IDs. A display successor label never invokes ' +
        'class-change or resource reinitialization. Historical Doomsayer payloads require individual mapping.',
      recordDispositions: []
    }
  },
  {
    legacyKey: 'revenant',
    legacyNames: ['Revenant'],
    row: {
      relationship: 'split',
      legacyResolutionRetained: true,
      automaticConversion: false,
      noAutomaticDestination: true,
      successors: [
        { id: 'deathcaller', name: 'Deathcaller', relationship: 'split' },
        { id: 'lichborne', name: 'Lichborne', relationship: 'split' }
      ],
      notes:
        'Explicit split map with no default destination; preserve Toll/anchor/known spell/talent bytes for old characters.',
      recordDispositions: []
    }
  },
  {
    legacyKey: 'shaper',
    legacyNames: ['Shaper'],
    row: {
      relationship: 'successor-name',
      legacyResolutionRetained: true,
      automaticConversion: false,
      successors: [{ id: 'druid', name: 'Druid', relationship: 'successor-name' }],
      notes:
        'Druid is the transformation name. Keep prior martial/body state and IDs resolvable; no Flux/stance -> ' +
        'anatomical-slot conversion. Bladedancer/Monk are separate reviews.',
      recordDispositions: []
    }
  },
  {
    legacyKey: 'formbender',
    legacyNames: ['Formbender'],
    row: {
      relationship: 'merged-design',
      legacyResolutionRetained: true,
      automaticConversion: false,
      successors: [{ id: 'druid', name: 'Druid', relationship: 'merged-design' }],
      notes: 'Historical Formbender identity merged into the Druid design; raw IDs remain resolvable.',
      recordDispositions: []
    }
  },
  {
    legacyKey: 'apex',
    legacyNames: ['Apex', 'Huntress', 'Nereid Myrathil Apex'],
    row: {
      relationship: 'successor-name',
      legacyResolutionRetained: true,
      automaticConversion: false,
      successors: [{ id: 'hunter', name: 'Hunter', relationship: 'successor-name' }],
      notes:
        'Preserve old marks/companion/spec/save IDs, including Nereid variants; never conjure a new actor from an old counter.',
      recordDispositions: []
    }
  },
  {
    legacyKey: 'oracle',
    legacyNames: ['Oracle'],
    row: {
      relationship: 'under-review',
      legacyResolutionRetained: true,
      automaticConversion: false,
      successors: [],
      notes:
        'Register independently when its full content is delivered; no Augur alias/merger and no assumed Omen Debt restoration.',
      recordDispositions: []
    }
  },
  {
    legacyKey: 'animist',
    legacyNames: ['Animist', 'Nereid Myrathil Animist'],
    row: {
      relationship: 'under-review',
      legacyResolutionRetained: true,
      automaticConversion: false,
      successors: [],
      notes:
        'Retained under review: keep the actual class and existing content available. Do not silently replace ' +
        'resonance/spirits with a proposed network/seat economy.',
      recordDispositions: []
    }
  }
];

const normalizeLegacyKey = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_');

export const RECONSTRUCTION_COMPATIBILITY = Object.fromEntries(
  RECONSTRUCTION_COMPATIBILITY_ROWS.map(({ legacyKey, row }) => [legacyKey, row])
);

export const getReconstructionCompatibility = (legacyKey) =>
  RECONSTRUCTION_COMPATIBILITY[normalizeLegacyKey(legacyKey)] || null;

export const getReconstructionSuccessors = (legacyKey) =>
  getReconstructionCompatibility(legacyKey)?.successors || [];

export const hasAutomaticConversion = (legacyKey) =>
  getReconstructionCompatibility(legacyKey)?.automaticConversion === true;

export const LEGACY_RECONSTRUCTION_KEYS = RECONSTRUCTION_COMPATIBILITY_ROWS.map(
  ({ legacyKey }) => legacyKey
);

export default RECONSTRUCTION_COMPATIBILITY;
