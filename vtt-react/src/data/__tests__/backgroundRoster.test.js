import { BACKGROUND_DATA } from '../backgroundData';
import { BACKGROUND_ABILITIES } from '../backgroundAbilities';
import { HERITAGE_TRADITIONS } from '../classHeritageRegistry';

const norm = (s) => String(s).toLowerCase().replace(/[^a-z]/g, '');

// heritage id -> set of normalized native class names
const nativeClassesByHeritage = {};
Object.entries(HERITAGE_TRADITIONS).forEach(([id, row]) => {
  nativeClassesByHeritage[id] = new Set(row.classes.map(norm));
});

const backgrounds = Object.values(BACKGROUND_DATA);

describe('background roster consistency', () => {
  test('no background lists a subrace twice', () => {
    backgrounds.forEach((bg) => {
      const subs = bg.restrictions?.allowedSubraces || [];
      expect(new Set(subs).size).toBe(subs.length);
    });
  });

  test('every subrace owns at least two backgrounds (native or universal)', () => {
    Object.keys(HERITAGE_TRADITIONS).forEach((heritageId) => {
      const count = backgrounds.filter((bg) => {
        const subs = bg.restrictions?.allowedSubraces || [];
        return subs.length === 0 || subs.includes(heritageId);
      }).length;
      expect(count).toBeGreaterThanOrEqual(2);
    });
  });

  test('gated background class hooks/tensions only reference native classes', () => {
    backgrounds.forEach((bg) => {
      const subs = bg.restrictions?.allowedSubraces || [];
      if (subs.length === 0) return; // universal backgrounds are open to any subrace
      const pool = new Set();
      subs.forEach((s) => (nativeClassesByHeritage[s] || new Set()).forEach((c) => pool.add(c)));
      const classIds = [
        ...(bg.classHooks || []).map((h) => h.classId),
        ...(bg.tensionPairings || []).map((t) => t.classId)
      ];
      classIds.forEach((classId) => {
        expect(pool.has(norm(classId))).toBe(true);
      });
    });
  });

  test('every race owns at least one exclusive background', () => {
    const races = [...new Set(Object.values(HERITAGE_TRADITIONS).map((r) => r.raceId))];
    races.forEach((raceId) => {
      const members = Object.entries(HERITAGE_TRADITIONS)
        .filter(([, row]) => row.raceId === raceId)
        .map(([id]) => id);
      const exclusive = backgrounds.filter((bg) => {
        const subs = bg.restrictions?.allowedSubraces || [];
        return subs.length > 0 && subs.every((s) => members.includes(s));
      });
      expect(exclusive.length).toBeGreaterThanOrEqual(1);
    });
  });

  test('every background exposes per-subrace flavor for each allowed subrace', () => {
    backgrounds.forEach((bg) => {
      const subs = bg.restrictions?.allowedSubraces || [];
      if (subs.length === 0) return;
      subs.forEach((s) => {
        expect(bg.subraceFlavor && bg.subraceFlavor[s]).toBeTruthy();
      });
    });
  });

  test('every subrace has at least one dedicated subrace-specific background', () => {
    Object.keys(HERITAGE_TRADITIONS).forEach((heritageId) => {
      const specific = backgrounds.filter((bg) => {
        const subs = bg.restrictions?.allowedSubraces || [];
        return subs.length >= 1 && subs.length <= 2 && subs.includes(heritageId);
      });
      expect(specific.length).toBeGreaterThanOrEqual(1);
    });
  });

  test('every background has corresponding abilities in BACKGROUND_ABILITIES', () => {
    const missing = Object.keys(BACKGROUND_DATA).filter((k) => !Array.isArray(BACKGROUND_ABILITIES[k]));
    expect(missing).toEqual([]);
    Object.keys(BACKGROUND_DATA).forEach((bgKey) => {
      const abilities = BACKGROUND_ABILITIES[bgKey] || [];
      expect(abilities.length).toBeGreaterThanOrEqual(1);
      abilities.forEach((ability) => {
        expect(ability.name).toBeTruthy();
        expect(['Passive', 'Active']).toContain(ability.type);
        expect(ability.description).toBeTruthy();
      });
    });
  });
});

