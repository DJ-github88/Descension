import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getCreatureTokenIconUrl } from '../assetManager';

const loadJson = (relPath) =>
  JSON.parse(fs.readFileSync(path.resolve(__dirname, relPath), 'utf8'));

const BESTIARY_DIR = path.resolve(__dirname, '../../../public/assets/icons/creatures/Bestiary');
const ILLUSTRATION_DIR = path.resolve(__dirname, '../../../public/assets/images/creatures');

const creatures = loadJson('../../../public/data/creatures.json');
const bestiaryFiles = fs.readdirSync(BESTIARY_DIR).filter((f) => f.toLowerCase().endsWith('.png'));

const md5 = (filePath) =>
  crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex');

describe('creature icon uniqueness', () => {
  test('every creature has a distinct tokenIcon id', () => {
    const icons = creatures.map((c) => c.tokenIcon);
    expect(new Set(icons).size).toBe(creatures.length);
  });

  test('every creature resolves to its own Bestiary icon file', () => {
    const fileSet = new Set(bestiaryFiles.map((f) => f.toLowerCase()));
    const unresolved = [];
    for (const c of creatures) {
      expect(c.tokenIcon).toBe(`Bestiary/${c.id}`);
      if (!fileSet.has(`${c.id}.png`)) unresolved.push(`${c.id} (missing file)`);
      const url = getCreatureTokenIconUrl(c.tokenIcon, c.type);
      if (!url.includes(`/Bestiary/${c.id}.png`)) unresolved.push(`${c.id} -> ${url}`);
    }
    expect(unresolved).toEqual([]);
  });

  test('no two Bestiary icon files share identical artwork', () => {
    const byHash = new Map();
    for (const f of bestiaryFiles) {
      const h = md5(path.join(BESTIARY_DIR, f));
      if (!byHash.has(h)) byHash.set(h, []);
      byHash.get(h).push(f);
    }
    const duplicates = [...byHash.values()].filter((group) => group.length > 1);
    expect(duplicates).toEqual([]);
  });

  test('every creature has a distinct existing bestiary illustration', () => {
    const data = loadJson('../../data/creatureData.json');
    const all = [];
    data.regions.forEach((r) => (r.creatures || []).forEach((c) => all.push(c)));
    expect(all).toHaveLength(creatures.length);

    const illustrations = all.map((c) => c.illustration);
    expect(new Set(illustrations).size).toBe(illustrations.length);

    const missing = illustrations.filter((p) => !fs.existsSync(path.join(ILLUSTRATION_DIR, path.basename(p))));
    expect(missing).toEqual([]);
  });
});
