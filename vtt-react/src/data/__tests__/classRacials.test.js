import { CLASS_RACIALS, getClassRacialTraits } from '../classRacials';
import { HERITAGE_TRADITIONS, CLASS_PROVENANCE } from '../classHeritageRegistry';

describe('native class-heritage abilities (class racials)', () => {
  test('every native class x heritage relationship grants 1-2 abilities', () => {
    Object.entries(HERITAGE_TRADITIONS).forEach(([heritageId, row]) => {
      row.classes.forEach((className) => {
        const traits = getClassRacialTraits(className, row.raceId, heritageId);
        if (!CLASS_RACIALS[className]) {
          expect(traits).toEqual([]);
          return;
        }
        expect(traits.length).toBeGreaterThanOrEqual(1);
        expect(traits.length).toBeLessThanOrEqual(2);
        traits.forEach((trait) => {
          expect(typeof trait.id).toBe('string');
          expect(typeof trait.name).toBe('string');
          expect(typeof trait.description).toBe('string');
          expect(['PASSIVE', 'ACTION']).toContain(trait.spellType);
          expect(trait.typeConfig?.category).toBe('class-racial');
        });
      });
    });
  });

  test('class-racial tables exist only for classes with authored payloads', () => {
    const missing = Object.keys(CLASS_PROVENANCE).filter((className) => !CLASS_RACIALS[className]);
    expect(missing.sort()).toEqual(['Fate Weaver', 'Gambler']);
  });

  test('non-native combinations grant nothing', () => {
    // Arcanoneer is native to Athien/Fex/Lumian, not Tallyn or Ordu.
    expect(getClassRacialTraits('Arcanoneer', 'human', 'thalren_human')).toEqual([]);
    expect(getClassRacialTraits('Arcanoneer', 'human', 'ordan_human')).toEqual([]);
    // Berserker is native only to Skald.
    expect(getClassRacialTraits('Berserker', 'human', 'merryn_human')).toEqual([]);
    expect(getClassRacialTraits('Berserker', 'human', 'skald_human').length).toBeGreaterThan(0);
  });

  test('ability ids are unique per class table', () => {
    Object.entries(CLASS_RACIALS).forEach(([className, subs]) => {
      const ids = Object.values(subs).flat().map((t) => t.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });
});
