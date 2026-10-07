import { RACE_DATA, getHeritageIllustrations, getHeritageImage } from '../raceData';

describe('Heritage Illustrations Resolution', () => {
  test('resolves canonical illustrations for all canonical races and subraces', () => {
    Object.keys(RACE_DATA).forEach((raceId) => {
      const race = RACE_DATA[raceId];
      
      // Top-level race image
      const raceImg = getHeritageImage(raceId);
      expect(raceImg).toBeTruthy();
      expect(typeof raceImg).toBe('string');
      expect(raceImg.startsWith('/assets/images/races/')).toBe(true);

      const raceIlls = getHeritageIllustrations(raceId);
      expect(raceIlls.length).toBeGreaterThan(0);
      expect(raceIlls[0].src).toBeTruthy();

      // Subraces
      if (race.subraces) {
        Object.keys(race.subraces).forEach((subId) => {
          const subrace = race.subraces[subId];
          const subImg = getHeritageImage(raceId, subId);
          expect(subImg).toBeTruthy();
          expect(subImg.startsWith('/assets/images/races/')).toBe(true);
          
          // Verify subrace image does not use outdated icon_v1 if new illustrations are present
          if (subrace.illustrations && subrace.illustrations.length > 0) {
            const firstSrc = subrace.illustrations[0].src || subrace.illustrations[0];
            expect(subImg).toBe(firstSrc);
          }

          // Test reverse argument order works identically
          const reverseImg = getHeritageImage(subId, raceId);
          expect(reverseImg).toBe(subImg);

          const subIlls = getHeritageIllustrations(raceId, subId);
          expect(subIlls.length).toBeGreaterThan(0);
        });
      }
    });
  });

  test('Broken Mimir resolves canonical riverreach city and has 5 illustrations', () => {
    const img = getHeritageImage('mimir', 'tethered');
    expect(img).toBe('/assets/images/races/mimir_broken_city_riverreach.jpg');
    const ills = getHeritageIllustrations('mimir', 'tethered_mimir');
    expect(ills.length).toBe(5);
    expect(ills[0].src).toBe('/assets/images/races/mimir_broken_city_riverreach.jpg');
  });

  test('Arch Mimir resolves canonical valcaelis city and has 4 illustrations', () => {
    const img = getHeritageImage('mimir', 'veiled');
    expect(img).toBe('/assets/images/races/mimir_arch_city_valcaelis.jpg');
    const ills = getHeritageIllustrations('mimir', 'veiled_mimir');
    expect(ills.length).toBe(4);
    expect(ills[0].src).toBe('/assets/images/races/mimir_arch_city_valcaelis.jpg');
  });

  test('Corali Myrathil resolves canonical salthinge city and has 9 illustrations', () => {
    const img = getHeritageImage('myrathil', 'shoreling');
    expect(img).toBe('/assets/images/races/myrathil_shoreling_city_salthinge.jpg');
    const ills = getHeritageIllustrations('myrathil', 'shoreling_myrathil');
    expect(ills.length).toBe(9);
    expect(ills[0].src).toBe('/assets/images/races/myrathil_shoreling_city_salthinge.jpg');
  });
});
