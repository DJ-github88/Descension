import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loreJsonPath = path.join(__dirname, '../../public/data/lore.json');
const dict = JSON.parse(fs.readFileSync(loreJsonPath, 'utf8'));
const keys = Object.keys(dict);

console.log('=== LORE DICTIONARY VERIFICATION REPORT ===\n');
console.log('Total entries: ' + keys.length);

// ID verification
let idBad = [];
for (const k of keys) {
  if (dict[k].id !== k) idBad.push({ key: k, id: dict[k].id });
}
console.log('\n--- ID FIELD VERIFICATION ---');
console.log('ID mismatches: ' + idBad.length);
for (const b of idBad) {
  console.log('  MISMATCH: key="' + b.key + '" has id="' + b.id + '"');
}
if (idBad.length === 0) console.log('(All entry id fields match their object key)\n');

// RelatedTerms verification
let broken = [];
let without = [];
let totalTerms = 0;

for (const k of keys) {
  const terms = dict[k].relatedTerms;
  if (!Array.isArray(terms)) {
    without.push(k);
    continue;
  }
  totalTerms += terms.length;
  for (const t of terms) {
    if (!keys.includes(t)) broken.push({ src: k, bad: t });
  }
}

console.log('--- RELATED TERMS VERIFICATION ---');
console.log('Entries with relatedTerms: ' + (keys.length - without.length));
console.log('Entries without relatedTerms: ' + without.length);
console.log('Total relatedTerms references: ' + totalTerms);
console.log('Broken references: ' + broken.length);

if (broken.length > 0) {
  const grouped = {};
  for (const b of broken) {
    if (!grouped[b.src]) grouped[b.src] = [];
    grouped[b.src].push(b.bad);
  }
  for (const [src, terms] of Object.entries(grouped)) {
    console.log('\n  In entry "' + src + '":');
    for (const t of terms) {
      console.log('    - "' + t + '"');
    }
  }
} else {
  console.log('\nAll relatedTerms are valid (every string matches an entry key)');
}

console.log('\n--- ENTRIES WITHOUT RELATED TERMS ---');
for (const k of without) {
  console.log('  ' + k);
}
