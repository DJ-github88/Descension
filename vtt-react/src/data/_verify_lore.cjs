const fs = require('fs');
const content = fs.readFileSync(__dirname + '/loreDictionary.js', 'utf8');
const lines = content.split('\n');

const keys = [];
const idMap = {};
const relatedTermsMap = {};

// Step 1: Extract all keys and parse entries
let currentKey = null;
let braceCountAtEntry = 0;
let isInLoreDict = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (!isInLoreDict) {
    if (line.trim() === "export const LORE_DICTIONARY = {") {
      isInLoreDict = true;
    }
    continue;
  }

  // Check if we've left LORE_DICTIONARY (last line has just `};`)
  if (line.trim() === '};') break;
  
  const trimmed = line.trim();
  
  // Detect entry key: line like `'frostwood-reach': {`
  const keyMatch = trimmed.match(/^'([^']+)':\s*\{/);
  if (keyMatch) {
    currentKey = keyMatch[1];
    keys.push(currentKey);
    braceCountAtEntry = 1; // we just opened one brace
    continue;
  }

  if (!currentKey) continue;

  // Track brace depth for current entry
  for (const ch of trimmed) {
    if (ch === '{') braceCountAtEntry++;
    if (ch === '}') braceCountAtEntry--;
  }

  // Check for id field
  const idMatch = trimmed.match(/^id:\s*'([^']+)'/);
  if (idMatch) idMap[currentKey] = idMatch[1];

  // Check for relatedTerms array (always on one line in this file)
  const rtMatch = line.match(/relatedTerms:\s*\[([^\]]*)\]/);
  if (rtMatch) {
    const termMatches = rtMatch[1].match(/'([^']+)'/g) || [];
    relatedTermsMap[currentKey] = termMatches.map(t => t.replace(/'/g, ''));
  }

  // Check if entry closes (brace depth returns to 0)
  if (braceCountAtEntry <= 0) {
    // If next non-empty/comment line is a new key or end, reset
    currentKey = null;
  }
}

// Step 2: Verification
const keySet = new Set(keys);

console.log('=== LORE DICTIONARY VERIFICATION REPORT ===\n');
console.log('Total entries found: ' + keys.length);

// ID verification
console.log('\n--- ID FIELD VERIFICATION ---');
const idIssues = [];
for (const k of keys) {
  if (idMap[k] && idMap[k] !== k) {
    idIssues.push({ key: k, id: idMap[k] });
  } else if (!idMap[k]) {
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
