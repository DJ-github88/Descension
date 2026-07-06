const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'animist.js'), 'utf8');
const lines = content.split('\n');

// Check each line for description and pattern
for (let i = 0; i < Math.min(lines.length, 10); i++) {
  console.log(`Line ${i}: ${JSON.stringify(lines[i])}`);
  const descMatch = lines[i].match(/^\s+description:\s*'(.+)',$/);
  if (descMatch) {
    console.log(`  -> DESCRIPTION MATCHED: ${descMatch[1].substring(0, 50)}...`);
  }
}

// Check for export name
console.log('\n--- Checking TREE PATTERNS on line 0 ---');
const TREE_PATTERNS = [
  { pattern: /ANIMIST_THORNWARDEN/, key: 'THORNWARDEN' },
  { pattern: /ANIMIST_SPIRIT_BINDER/, key: 'SPIRIT_BINDER' },
  { pattern: /ANIMIST_STORMSCRIBE/, key: 'STORMSCRIBE' },
];
for (const tp of TREE_PATTERNS) {
  const matched = tp.pattern.test(lines[0]);
  console.log(`Pattern ${tp.pattern}: ${matched} (for key ${tp.key})`);
}
