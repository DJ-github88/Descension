import { ALL_CLASSES_DATA, DEEPLING_MYRATHIL_APEX_DATA, DEEPLING_MYRATHIL_ANIMIST_DATA, DEEPLING_MYRATHIL_AUGUR_DATA } from '../index';
import { isClassCompatible } from '../../../utils/pointBuySystem';

describe('Nereid Myrathil class variants', () => {
  test('are registered in ALL_CLASSES_DATA', () => {
    expect(ALL_CLASSES_DATA['Nereid Myrathil Apex']).toBeDefined();
    expect(ALL_CLASSES_DATA['Nereid Myrathil Animist']).toBeDefined();
    expect(ALL_CLASSES_DATA['Nereid Myrathil Augur']).toBeDefined();
  });

  test('carry the deepling subrace variant flavor', () => {
    expect(DEEPLING_MYRATHIL_APEX_DATA.subraceVariants?.deepling_myrathil).toBeDefined();
    expect(DEEPLING_MYRATHIL_ANIMIST_DATA.subraceVariants?.deepling_myrathil).toBeDefined();
    expect(DEEPLING_MYRATHIL_AUGUR_DATA.subraceVariants?.deepling_myrathil).toBeDefined();
    expect(DEEPLING_MYRATHIL_APEX_DATA.variantName).toBe('Nereid Myrathil Apex');
  });

  test('keep inherited spell pools and base class identity', () => {
    expect(DEEPLING_MYRATHIL_APEX_DATA.spellPools?.[1]?.length).toBeGreaterThan(0);
    expect(DEEPLING_MYRATHIL_ANIMIST_DATA.spellPools?.[1]?.length).toBeGreaterThan(0);
    expect(DEEPLING_MYRATHIL_AUGUR_DATA.spellPools?.[1]?.length).toBeGreaterThan(0);
    expect(DEEPLING_MYRATHIL_APEX_DATA.id).toBe('apex');
  });

  test('only compatible with deepling_myrathil', () => {
    for (const name of ['Nereid Myrathil Apex', 'Nereid Myrathil Animist', 'Nereid Myrathil Augur']) {
      expect(isClassCompatible(name, 'myrathil', 'deepling_myrathil')).toBe(true);
      expect(isClassCompatible(name, 'myrathil', 'shoreling_myrathil')).toBe(false);
      expect(isClassCompatible(name, 'ordan_human', 'ordan_human')).toBe(false);
      expect(isClassCompatible(name, 'skald_human', 'skald_human')).toBe(false);
    }
  });

  test('base classes keep their native Nereid heritage', () => {
    expect(isClassCompatible('Apex', 'myrathil', 'deepling_myrathil')).toBe(true);
    expect(isClassCompatible('Animist', 'myrathil', 'deepling_myrathil')).toBe(true);
    expect(isClassCompatible('Augur', 'myrathil', 'deepling_myrathil')).toBe(true);
  });
});
