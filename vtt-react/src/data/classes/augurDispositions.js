import { AUGUR_DATA } from './augurData';
import { AUGUR_AUSPICE, AUGUR_HARBINGER, AUGUR_HIEROPHANT } from '../talentTrees/augur';
import { HERITAGE_TRADITIONS } from '../classHeritageRegistry';

const AUGUR_CLASS_ID = 'augur';
const FATE_WEAVER_CLASS_ID = 'fate-weaver';

const augurTrees = [
  ['auspice', AUGUR_AUSPICE],
  ['harbinger', AUGUR_HARBINGER],
  ['hierophant', AUGUR_HIEROPHANT]
];

const keep = (sourceType, sourceId, rationale, extra = {}) => ({
  sourceType,
  sourceId,
  sourceClassId: AUGUR_CLASS_ID,
  disposition: 'keep',
  destinationClassId: AUGUR_CLASS_ID,
  destinationId: null,
  rationale,
  automaticConversion: false,
  ...extra
});

const uniqueSpells = [...new Set(
  (AUGUR_DATA.spells || AUGUR_DATA.exampleSpells || []).map(spell => spell.id)
)];

const poolEntries = Object.entries(AUGUR_DATA.spellPools || {}).flatMap(
  ([level, spellIds]) => (spellIds || []).map(spellId => ({ level, spellId }))
);

const variants = Object.keys(AUGUR_DATA.subraceVariants || {});
const heritageEdges = Object.entries(HERITAGE_TRADITIONS)
  .filter(([, heritage]) => (heritage.classes || []).includes('Augur'))
  .map(([heritageId]) => heritageId);
const resourceIds = [...new Set([
  AUGUR_DATA.classResource?.type,
  ...Object.values(AUGUR_DATA.classResource?.dualPool || {}),
  'omenDebt',
  'benediction-malediction'
].filter(Boolean))];
const specializations = (AUGUR_DATA.specializations?.specs || []).map(spec => spec.id);

export const AUGUR_DISPOSITIONS = [
  ...uniqueSpells.map(spellId => keep(
    'spell',
    spellId,
    `Keep active Augur spell ${spellId} under its exact legacy identity. Fate Weaver uses separate ${FATE_WEAVER_CLASS_ID} records; no automatic conversion is authored.`
  )),
  ...poolEntries.map(({ level, spellId }) => keep(
    'spell-pool-entry',
    `pool:${level}:${spellId}`,
    `Keep Augur pool entry ${spellId} at level ${level}. Fate Weaver has its own optional pool and does not inherit this entry.`,
    { level }
  )),
  ...augurTrees.flatMap(([treeId, nodes]) => nodes.map(node => keep(
    'talent-node',
    node.id,
    `Keep Augur node ${node.id} in the ${treeId} tree. Fate Weaver has a separate 54-node package; no node is renamed, moved or auto-converted.`,
    { treeId }
  ))),
  ...augurTrees.flatMap(([treeId, nodes]) => nodes.flatMap(node => (
    Array.from({ length: Number(node.maxRanks) || 0 }, (_, index) => index + 1).map(rank => keep(
      'talent-rank',
      `${node.id}@rank-${rank}`,
      `Keep Augur rank ${rank} of ${node.id}. Its rank values and prerequisites remain legacy; Fate Weaver ranks are separately authored.`,
      { treeId, nodeId: node.id, rank }
    ))
  ))),
  ...augurTrees.flatMap(([treeId, nodes]) => nodes.map(node => keep(
    'materialized-talent',
    `talent-spell-${node.id}`,
    `Keep materialized Augur talent ${node.id}. Existing saved grants resolve exactly; no Fate Weaver talent ID replaces it.`,
    { treeId, nodeId: node.id }
  ))),
  ...variants.map(heritageId => keep(
    'subrace-variant',
    heritageId,
    `Keep Augur variant ${heritageId} and its saved identity.${heritageId === 'deepling_myrathil' ? ' Nereid Myrathil Augur remains on this exact path.' : ''}`,
    { heritageId }
  )),
  keep(
    'class-alias',
    'Nereid Myrathil Augur',
    'Keep the Nereid Myrathil Augur compatibility alias. It continues to resolve to Augur data and the deepling_myrathil variant; no Fate Weaver alias is created.'
  ),
  ...heritageEdges.map(heritageId => keep(
    'heritage-edge',
    `edge:${heritageId}`,
    `Keep the Augur heritage edge for ${heritageId}. Fate Weaver receives no native heritage edge and no automatic heritage conversion.`,
    { heritageId }
  )),
  ...resourceIds.map(resourceId => keep(
    'resource',
    resourceId,
    `Keep the legacy Augur resource ${resourceId}, including its live omenDebt and managed benediction-malediction state. Fate Weaver uses fate-links and imports no Benediction, Malediction or Omen Debt bank.`,
    { resourceId }
  )),
  ...specializations.map(specId => keep(
    'specialization',
    specId,
    `Keep Augur specialization ${specId}. Fate Weaver's covenant, severance and tapestry trees are separate specializations, not a rename.`,
    { specializationId: specId }
  ))
];
