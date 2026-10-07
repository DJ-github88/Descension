import fs from 'fs';
import path from 'path';
import { RACE_DATA, getHeritageCrest, getSubraceList } from '../raceData';

describe('Heritage Crests Resolution and Assets', () => {
  test('all 25 canonical subraces have crest defined and pointing to public assets', () => {
    let subraceCount = 0;

    Object.keys(RACE_DATA).forEach((raceId) => {
      const race = RACE_DATA[raceId];
      if (race.subraces) {
        Object.keys(race.subraces).forEach((subKey) => {
          subraceCount++;
          const subrace = race.subraces[subKey];
          
          expect(subrace.crest).toBeTruthy();
          expect(typeof subrace.crest).toBe('string');
          expect(subrace.crest.startsWith('/assets/images/crests/')).toBe(true);
          expect(subrace.crest.endsWith('.png')).toBe(true);

          // Verify getHeritageCrest with (raceId, subId)
          const crestPair = getHeritageCrest(raceId, subrace.id);
          expect(crestPair).toBe(subrace.crest);

          // Verify getHeritageCrest with reverse order (subId, raceId)
          const crestReverse = getHeritageCrest(subrace.id, raceId);
          expect(crestReverse).toBe(subrace.crest);

          // Verify getHeritageCrest with just subId
          const crestSingle = getHeritageCrest(subrace.id);
          expect(crestSingle).toBe(subrace.crest);

          // Verify file exists on disk in public directory
          const relativeAssetPath = subrace.crest.replace(/^\//, '');
          const diskPath = path.resolve(__dirname, '../../../public', relativeAssetPath);
          expect(fs.existsSync(diskPath)).toBe(true);
        });
      }
    });

    expect(subraceCount).toBe(25);
  });

  test('getSubraceList returns crest for every subrace', () => {
    Object.keys(RACE_DATA).forEach((raceId) => {
      const list = getSubraceList(raceId);
      const race = RACE_DATA[raceId];
      if (race.subraces) {
        expect(list.length).toBe(Object.keys(race.subraces).length);
        list.forEach((sub) => {
          expect(sub.crest).toBeTruthy();
          expect(sub.crest.startsWith('/assets/images/crests/')).toBe(true);
        });
      }
    });
  });
});
