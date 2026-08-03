const fs = require('fs');
const path = require('path');

const loreJsonPath = path.join(__dirname, '../../public/data/lore.json');
const dict = JSON.parse(fs.readFileSync(loreJsonPath, 'utf8'));
const keys = Object.keys(dict);
const keySet = new Set(keys);

console.log('=== LORE DICTIONARY VERIFICATION REPORT ===\n');
console.log('Total entries found: ' + keys.length);

// ID verification
console.log('\n--- ID FIELD VERIFICATION ---');
const idIssues = [];
for (const k of keys) {
  if (dict[k].id && dict[k].id !== k) {
    idIssues.push({ key: k, id: dict[k].id });
  } else if (!dict[k].id) {
    idIssues.push({ key: k, id: '(missing)' });
  }
}

if (idIssues.length === 0) {
  console.log('PASS - All ' + keys.length + ' entry id fields match their object key.');
} else {
  console.log('FAIL - ' + idIssues.length + ' issue(s):');
  for (const issue of idIssues) {
    console.log('  Key "' + issue.key + '" has id="' + issue.id + '"');
  }
}

// RelatedTerms verification
console.log('\n--- RELATED TERMS VERIFICATION ---');
const relatedTermsMap = {};
for (const k of keys) {
  if (Array.isArray(dict[k].relatedTerms)) {
    relatedTermsMap[k] = dict[k].relatedTerms;
  }
}

const entriesWithRT = Object.keys(relatedTermsMap);
const entriesWithoutRT = keys.filter(k => !relatedTermsMap[k]);
let totalReferences = 0;
const brokenRefs = [];

for (const [k, terms] of Object.entries(relatedTermsMap)) {
  totalReferences += terms.length;
  for (const t of terms) {
    if (!keySet.has(t)) {
      brokenRefs.push({ source: k, term: t });
    }
  }
}

console.log('Entries with relatedTerms: ' + entriesWithRT.length);
console.log('Entries without relatedTerms: ' + entriesWithoutRT.length);
console.log('Total relatedTerms references: ' + totalReferences);

if (brokenRefs.length === 0) {
  console.log('PASS - All ' + totalReferences + ' relatedTerms point to valid entry keys.');
} else {
  console.log('FAIL - ' + brokenRefs.length + ' broken reference(s):');
  const grouped = {};
  for (const { source, term } of brokenRefs) {
    if (!grouped[source]) grouped[source] = [];
    grouped[source].push(term);
  }
  for (const [src, terms] of Object.entries(grouped)) {
    console.log('\n  In "' + src + '":');
    for (const t of terms) console.log('    - "' + t + '"');
  }
}

console.log('\n--- ENTRIES WITHOUT RELATED TERMS ---');
for (const k of entriesWithoutRT) {
  console.log('  ' + k);
}
