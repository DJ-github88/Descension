import fs from 'fs';
import path from 'path';
import { AUGUR_DATA } from '../augurData';
import { AUGUR_AUSPICE, AUGUR_HARBINGER, AUGUR_HIEROPHANT } from '../../talentTrees/augur';
import { HERITAGE_TRADITIONS } from '../../classHeritageRegistry';
import { AUGUR_DISPOSITIONS } from '../classReconstructionCompatibility';

const trees = [AUGUR_AUSPICE, AUGUR_HARBINGER, AUGUR_HIEROPHANT];
const countByType = type => AUGUR_DISPOSITIONS.filter(row => row.sourceType === type).length;

describe('Augur disposition manifest', () => {
  test('enumerates the complete 380-row legacy inventory exactly once', () => {
    expect(AUGUR_DISPOSITIONS).toHaveLength(380);
    expect(new Set(AUGUR_DISPOSITIONS.map(row => row.sourceId)).size).toBe(380);
    expect(AUGUR_DISPOSITIONS.map(row => row.sourceType)).toEqual(
      expect.arrayContaining(['spell', 'spell-pool-entry', 'talent-node', 'talent-rank', 'materialized-talent', 'subrace-variant', 'class-alias', 'heritage-edge', 'resource', 'specialization'])
    );
    expect(countByType('spell')).toBe((AUGUR_DATA.spells || AUGUR_DATA.exampleSpells).length);
    expect(countByType('spell-pool-entry')).toBe(Object.values(AUGUR_DATA.spellPools).flat().length);
    expect(countByType('talent-node')).toBe(trees.flat().length);
    expect(countByType('talent-rank')).toBe(trees.flat().reduce((sum, node) => sum + node.maxRanks, 0));
    expect(countByType('materialized-talent')).toBe(trees.flat().length);
    expect(countByType('subrace-variant')).toBe(Object.keys(AUGUR_DATA.subraceVariants).length);
    expect(countByType('class-alias')).toBe(1);
    expect(countByType('heritage-edge')).toBe(
      Object.values(HERITAGE_TRADITIONS).filter(heritage => heritage.classes.includes('Augur')).length
    );
    expect(countByType('resource')).toBe(3);
    expect(countByType('specialization')).toBe(AUGUR_DATA.specializations.specs.length);
  });

  test('keeps every legacy identity without inventing conversions or Fate Weaver destinations', () => {
    AUGUR_DISPOSITIONS.forEach(row => {
      expect(row).toMatchObject({
        sourceClassId: 'augur',
        disposition: 'keep',
        destinationClassId: 'augur',
        destinationId: null,
        automaticConversion: false
      });
      expect(row.rationale).toEqual(expect.any(String));
      expect(row.rationale.length).toBeGreaterThan(20);
    });
  });

  test('matches the checked-in machine-readable artifact', () => {
    const artifact = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '../docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-2-gambler-fate-weaver/phase-2b/augur-disposition.json'), 'utf8'));
    expect(artifact.classId).toBe('augur');
    expect(artifact.totals.rows).toBe(380);
    expect(artifact.rows).toEqual(AUGUR_DISPOSITIONS);
  });

  test('preserves the Nereid alias, heritage edges and all three legacy resource IDs', () => {
    const ids = new Set(AUGUR_DISPOSITIONS.map(row => row.sourceId));
    expect(ids.has('Nereid Myrathil Augur')).toBe(true);
    expect(ids.has('deepling_myrathil')).toBe(true);
    expect(ids.has('edge:deepling_myrathil')).toBe(true);
    expect(ids.has('omens')).toBe(true);
    expect(ids.has('benediction')).toBe(true);
    expect(ids.has('malediction')).toBe(true);
    expect(ids.has('auspex')).toBe(true);
    expect(ids.has('harbinger')).toBe(true);
    expect(ids.has('hierophant')).toBe(true);
  });
});
