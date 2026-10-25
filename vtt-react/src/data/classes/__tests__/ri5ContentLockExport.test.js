import fs from 'fs';
import path from 'path';
import {
  DOOMSAYER_DATA, DOOMSAYER_MANIFEST, DOOMSAYER_AUTHORED_RECORDS,
  DOOMSAYER_OPTIONAL_RECORDS, DOOMSAYER_CORE_RECORDS, DOOMSAYER_TALENT_ACTIVES,
  DOOMSAYER_RESOURCE_RULES
} from '../doomsayerData';
import { DOOMSAYER_TREES, DOOMSAYER_TALENT_NODES } from '../../talentTrees/doomsayer';
import {
  ORACLE_DATA, ORACLE_MANIFEST, ORACLE_AUTHORED_RECORDS,
  ORACLE_OPTIONAL_RECORDS, ORACLE_CORE_RECORDS, ORACLE_TALENT_ACTIVES,
  ORACLE_RESOURCE_RULES
} from '../oracleData';
import { ORACLE_TREES, ORACLE_TALENT_NODES } from '../../talentTrees/oracle';
import { getReconstructionCompatibility } from '../classReconstructionCompatibility';

const outputDir = path.resolve(
  process.cwd(),
  '../docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-5-doomsayer-oracle'
);

const summarize = config => ({
  data: {
    id: config.data.id,
    name: config.data.name,
    role: config.data.role,
    resource: config.data.resource,
    classResource: config.data.classResource,
    primaryStat: config.data.primaryStat,
    secondaryStat: config.data.secondaryStat,
    developmentStatus: config.data.developmentStatus,
    heritageRecommendation: config.data.heritageRecommendation,
    heritageEffectsImplemented: config.data.heritageEffectsImplemented,
    nativeAccess: config.data.nativeAccess,
    restrictions: config.data.restrictions,
    equipment: config.data.equipment,
    overview: config.data.overview,
    specializations: config.data.specializations,
    progression: config.data.progression,
    talentTrees: config.data.talentTrees,
    resourceSystem: config.data.resourceSystem
  },
  manifest: config.manifest,
  authoredRecords: config.authoredRecords,
  coreRecords: config.coreRecords,
  optionalRecords: config.optionalRecords,
  talentActives: config.talentActives,
  resourceRules: config.resourceRules,
  trees: config.trees.map(tree => ({
    id: tree.id,
    name: tree.meta.name,
    tagline: tree.meta.tagline,
    signature: tree.meta.signature,
    capstone: tree.meta.capstone,
    signatureNode: tree.meta.signatureNode,
    capstoneNode: tree.meta.capstoneNode,
    nodes: tree.nodes
  })),
  nodes: config.nodes
});

test('exports the RI-5 content lock when requested', () => {
  expect(DOOMSAYER_AUTHORED_RECORDS).toHaveLength(96);
  expect(ORACLE_AUTHORED_RECORDS).toHaveLength(96);
  if (process.env.RI5_EXPORT !== '1') return;
  fs.mkdirSync(outputDir, { recursive: true });
  const payload = {
    generatedAt: new Date().toISOString(),
    rulesetVersion: 'cr-review-r1',
    classes: {
      doomsayer: summarize({
        data: DOOMSAYER_DATA, manifest: DOOMSAYER_MANIFEST,
        authoredRecords: DOOMSAYER_AUTHORED_RECORDS,
        coreRecords: DOOMSAYER_CORE_RECORDS,
        optionalRecords: DOOMSAYER_OPTIONAL_RECORDS,
        talentActives: DOOMSAYER_TALENT_ACTIVES,
        resourceRules: DOOMSAYER_RESOURCE_RULES,
        trees: DOOMSAYER_TREES, nodes: DOOMSAYER_TALENT_NODES
      }),
      oracle: summarize({
        data: ORACLE_DATA, manifest: ORACLE_MANIFEST,
        authoredRecords: ORACLE_AUTHORED_RECORDS,
        coreRecords: ORACLE_CORE_RECORDS,
        optionalRecords: ORACLE_OPTIONAL_RECORDS,
        talentActives: ORACLE_TALENT_ACTIVES,
        resourceRules: ORACLE_RESOURCE_RULES,
        trees: ORACLE_TREES, nodes: ORACLE_TALENT_NODES
      })
    },
    compatibility: {
      harbinger: getReconstructionCompatibility('harbinger'),
      oracle: getReconstructionCompatibility('oracle')
    }
  };
  fs.writeFileSync(path.join(outputDir, 'CONTENT-LOCK.json'), JSON.stringify(payload, null, 2));
});
