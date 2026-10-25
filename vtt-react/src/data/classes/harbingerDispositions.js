import { HARBINGER_DATA } from './harbingerData';
import {
  HARBINGER_WILD_PROPHET, HARBINGER_DEATHS_SEER, HARBINGER_FATE_RIFT
} from '../talentTrees/harbinger';
import { HERITAGE_TRADITIONS } from '../classHeritageRegistry';

const HARBINGER_CLASS_ID = 'harbinger';
const DOOMSAYER_CLASS_ID = 'doomsayer';

const harvesterTrees = [
  ['wild_prophet', HARBINGER_WILD_PROPHET],
  ['deaths_seer', HARBINGER_DEATHS_SEER],
  ['fate_rift', HARBINGER_FATE_RIFT]
];

const keep = (sourceType, sourceId, rationale, extra = {}) => ({
  sourceType,
  sourceId,
  sourceClassId: HARBINGER_CLASS_ID,
  disposition: 'keep',
  destinationClassId: HARBINGER_CLASS_ID,
  destinationId: null,
  rationale,
  automaticConversion: false,
  ...extra
});

const collectIds = (value, target) => {
  if (Array.isArray(value)) {
    value.forEach(entry => collectIds(entry, target));
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (typeof value.id === 'string' && value.id.trim()) target.add(value.id);
  Object.values(value).forEach(entry => collectIds(entry, target));
};

const topLevelSpells = HARBINGER_DATA.spells || HARBINGER_DATA.exampleSpells || [];
const nestedSpellIds = new Set();
topLevelSpells.forEach(spell => collectIds(spell, nestedSpellIds));
const topLevelSpellIds = new Set(topLevelSpells.map(spell => spell.id).filter(Boolean));
const poolEntries = Object.entries(HARBINGER_DATA.spellPools || {}).flatMap(
  ([level, spellIds]) => (spellIds || []).map(spellId => ({ level, spellId }))
);
const variants = Object.keys(HARBINGER_DATA.subraceVariants || {});
const heritageEdges = Object.entries(HERITAGE_TRADITIONS)
  .filter(([, heritage]) => (heritage.classes || []).includes('Harbinger'))
  .map(([heritageId]) => heritageId);
const resourceIds = [...new Set([
  HARBINGER_DATA.classResource?.type,
  'mayhem',
  'mayhemGauge'
].filter(Boolean))];
const specializations = (HARBINGER_DATA.specializations?.specs || []).map(spec => spec.id);

export const HARBINGER_RECORD_DISPOSITIONS = [
  ...[...topLevelSpellIds].map(spellId => keep(
    'spell',
    spellId,
    `Keep active Harbinger spell ${spellId} under its exact legacy identity and Mayhem semantics. Doomsayer uses separate ${DOOMSAYER_CLASS_ID} records; no automatic conversion is authored.`
  )),
  ...[...nestedSpellIds].filter(spellId => !topLevelSpellIds.has(spellId)).map(spellId => keep(
    'spell-effect',
    spellId,
    `Keep nested Harbinger effect ${spellId}. Its parent spell, damage, debuff and Mayhem behavior remain legacy-only; no Doomsayer record replaces it.`
  )),
  ...poolEntries.map(({ level, spellId }) => keep(
    'spell-pool-entry',
    `pool:${level}:${spellId}`,
    `Keep Harbinger pool entry ${spellId} at level ${level}. Doomsayer has its own optional pool and does not inherit this entry.`,
    { level }
  )),
  ...harvesterTrees.flatMap(([treeId, nodes]) => nodes.map(node => keep(
    'talent-node',
    node.id,
    `Keep Harbinger node ${node.id} in the ${treeId} tree. Doomsayer has a separate 54-node package; no node is renamed, moved or auto-converted.`,
    { treeId }
  ))),
  ...harvesterTrees.flatMap(([treeId, nodes]) => nodes.flatMap(node => (
    Array.from({ length: Number(node.maxRanks) || 0 }, (_, index) => index + 1).map(rank => keep(
      'talent-rank',
      `${node.id}@rank-${rank}`,
      `Keep Harbinger rank ${rank} of ${node.id}. Its rank values and prerequisites remain legacy; Doomsayer ranks are separately authored.`,
      { treeId, nodeId: node.id, rank }
    ))
  ))),
  ...harvesterTrees.flatMap(([treeId, nodes]) => nodes.map(node => keep(
    'materialized-talent',
    `talent-spell-${node.id}`,
    `Keep materialized Harbinger talent ${node.id}. Existing saved grants resolve exactly; no Doomsayer talent ID replaces it.`,
    { treeId, nodeId: node.id }
  ))),
  ...variants.map(heritageId => keep(
    'subrace-variant',
    heritageId,
    `Keep Harbinger variant ${heritageId} and its saved identity. Doomsayer's heritage pairings remain recommendations only.`,
    { heritageId }
  )),
  ...heritageEdges.map(heritageId => keep(
    'heritage-edge',
    `edge:${heritageId}`,
    `Keep the Harbinger heritage edge for ${heritageId}. Doomsayer receives no native heritage edge and no automatic heritage conversion.`,
    { heritageId }
  )),
  ...resourceIds.map(resourceId => keep(
    'resource',
    resourceId,
    `Keep the legacy Harbinger resource ${resourceId}, including its live Mayhem gauge and Wild Surge marker. Doomsayer uses doom-calamities and imports no Mayhem bank.`,
    { resourceId }
  )),
  ...specializations.map(specId => keep(
    'specialization',
    specId,
    `Keep Harbinger specialization ${specId}. Doomsayer's requiem, endbringer and forewarner trees are separate specializations, not a rename.`,
    { specializationId: specId }
  ))
];
