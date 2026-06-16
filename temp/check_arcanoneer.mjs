import { readFileSync } from 'fs';
import { parse } from '@babel/parser';

const file = 'D:/VTT/vtt-react/src/data/classes/arcanoneerData.js';
const source = readFileSync(file, 'utf8');

try {
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['jsx'],
  });
  console.log('PARSE OK: ' + ast.program.body.length + ' top-level statements');
} catch (e) {
  console.error('PARSE FAIL:', e.message);
  process.exit(1);
}

// Now eval the source with a Babel transform to validate the data structure.
import { transformSync } from '@babel/core';
const transformed = transformSync(source, {
  filename: file,
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [],
});
const module_ = { exports: {} };
const fn = new Function('module', 'exports', 'require', transformed.code);
fn(module_, module_.exports, () => {});
const data = module_.exports.ARCANONEER_DATA || module_.exports.default;
if (!data) {
  console.error('NO EXPORTED DATA FOUND');
  process.exit(1);
}

const entries = data.combinationMatrix.entries;
console.log('Matrix entries:', entries.length);
console.log('First:', entries[0].id, entries[0].elements);
console.log('Last:', entries[entries.length - 1].id, entries[entries.length - 1].elements);

const spells = data.spells || data.exampleSpells || [];
const sphereSpells = spells.filter(s => s.resourceCost && s.resourceCost.spheres);
console.log('Spells with spheres:', sphereSpells.length);
console.log('Sample:', JSON.stringify(sphereSpells.slice(0, 5).map(s => ({ name: s.name, spheres: s.resourceCost.spheres }))));

const validIds = new Set(['force', 'light', 'shadow', 'heat', 'cold', 'spark', 'flesh', 'wyrd']);
const bad = [];
for (const e of entries) {
  for (const el of e.elements) if (!validIds.has(el)) bad.push(`matrix ${e.id}: ${el}`);
}
for (const s of sphereSpells) {
  for (const el of s.resourceCost.spheres) if (typeof el === 'string' && !validIds.has(el)) bad.push(`spell ${s.name}: ${el}`);
}
if (bad.length) {
  console.log('STALE IDS FOUND:');
  for (const b of bad) console.log('  ', b);
  process.exit(1);
} else {
  console.log('CLEAN: no stale element IDs in matrix or spell spheres.');
}
