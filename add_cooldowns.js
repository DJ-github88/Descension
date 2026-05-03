const fs = require('fs');
const filePath = 'vtt-react/src/data/classes/dreadnaughtData.js';
let code = fs.readFileSync(filePath, 'utf8');

// Spells that already have a cooldownConfig with a real value (not 'none')
// e.g. shadow_step has value:0, oblivion_strike has value:10 - keep those
const keepAsIs = ['dread_shadow_step', 'dread_oblivion_strike'];

// For all other spells missing cooldownConfig, insert it before their tags line
// Strategy: find each spell's tags line and insert cooldownConfig before it
// if the preceding ~100 chars don't already have cooldownConfig

const spellIds = [...code.matchAll(/id: '(dread_[^']+)'/g)].map(m => m[1]);

let inserted = 0;
for (const id of spellIds) {
  if (keepAsIs.includes(id)) continue;
  
  const idPos = code.indexOf(`id: '${id}'`);
  if (idPos === -1) continue;
  
  // Find the tags: line for THIS spell (within next 3000 chars)
  const spellBlock = code.slice(idPos, idPos + 3000);
  const tagsMatch = spellBlock.match(/(\n[ \t]+)(tags: \[)/);
  if (!tagsMatch) continue;
  
  const tagsRelPos = spellBlock.indexOf(tagsMatch[0]);
  const tagsAbsPos = idPos + tagsRelPos;
  
  // Check if cooldownConfig already exists between this spell's id and its tags
  const between = code.slice(idPos, tagsAbsPos);
  if (between.includes('cooldownConfig')) continue;
  
  // Insert cooldownConfig before the tags line
  const indent = tagsMatch[1].replace('\n', ''); // leading spaces
  const insertion = `\n${indent}cooldownConfig: {\n${indent}  type: 'none'\n${indent}},\n`;
  code = code.slice(0, tagsAbsPos) + insertion + code.slice(tagsAbsPos);
  inserted++;
  console.log(`Added cooldownConfig to: ${id}`);
}

fs.writeFileSync(filePath, code, 'utf8');
console.log(`\nDone. Added cooldownConfig to ${inserted} spells.`);
