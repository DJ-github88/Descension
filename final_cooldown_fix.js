/**
 * Final clean fix: add cooldownConfig at top-level of each spell
 * by inserting it AFTER the closing brace of typeConfig, not before tags:
 * Also removes any that got nested inside typeConfig.
 */
const fs = require('fs');
const filePath = 'vtt-react/src/data/classes/dreadnaughtData.js';
let code = fs.readFileSync(filePath, 'utf8');

// Step 1: Remove any cooldownConfig nested inside typeConfig
{
  let fixed = 0, pos = 0;
  while (true) {
    const tcPos = code.indexOf('typeConfig: {', pos);
    if (tcPos === -1) break;
    let depth = 0, i = tcPos + 'typeConfig: {'.length - 1, tcEnd = -1;
    for (; i < code.length; i++) {
      if (code[i] === '{') depth++;
      else if (code[i] === '}') { depth--; if (depth === 0) { tcEnd = i; break; } }
    }
    if (tcEnd === -1) break;
    const tcBlock = code.slice(tcPos, tcEnd + 1);
    if (tcBlock.includes('cooldownConfig')) {
      const cleaned = tcBlock.replace(/\n[ \t]*cooldownConfig: \{\n[ \t]*type: 'none'\n[ \t]*\},?\n/g, '\n');
      if (cleaned !== tcBlock) { code = code.slice(0, tcPos) + cleaned + code.slice(tcEnd + 1); fixed++; }
    }
    pos = tcPos + 1;
  }
  console.log(`Step 1: Removed ${fixed} nested cooldownConfig from typeConfig.`);
}

// Step 2: For each spell, find the END of its typeConfig block, then insert
// cooldownConfig immediately after it (if not already there top-level)
const spellIds = [...code.matchAll(/id: '(dread_[^']+)'/g)].map(m => m[1]);
const keepAsIs = ['dread_shadow_step', 'dread_oblivion_strike']; // already have value
let inserted = 0;

for (const id of spellIds) {
  const idPos = code.indexOf(`id: '${id}'`);
  if (idPos === -1) continue;

  // Find typeConfig: { for this spell
  const tcPos = code.indexOf('typeConfig: {', idPos);
  if (tcPos === -1 || tcPos - idPos > 600) continue;

  // Find end of typeConfig block
  let depth = 0, i = tcPos + 'typeConfig: {'.length - 1, tcEnd = -1;
  for (; i < code.length; i++) {
    if (code[i] === '{') depth++;
    else if (code[i] === '}') { depth--; if (depth === 0) { tcEnd = i; break; } }
  }
  if (tcEnd === -1) continue;

  // Check if cooldownConfig already exists between tcEnd and the next spell (within 2000 chars)
  const after = code.slice(tcEnd, tcEnd + 2000);
  if (after.includes('cooldownConfig')) {
    if (!keepAsIs.includes(id)) continue; // already has it
  }

  if (keepAsIs.includes(id)) continue;

  // Insert cooldownConfig after the closing brace of typeConfig
  const lineEnd = code.indexOf('\n', tcEnd);
  const indent = '      '; // 6 spaces (spell body indentation)
  const insertion = `\n\n${indent}cooldownConfig: {\n${indent}  type: 'none'\n${indent}},`;
  code = code.slice(0, lineEnd) + insertion + code.slice(lineEnd);
  inserted++;
}

fs.writeFileSync(filePath, code, 'utf8');
console.log(`Step 2: Inserted cooldownConfig after typeConfig for ${inserted} spells.`);

// Step 3: Verify
const finalCode = fs.readFileSync(filePath, 'utf8');
const allIds = [...finalCode.matchAll(/id: '(dread_[^']+)'/g)].map(m => m[1]);
const missing = allIds.filter(id => {
  const pos = finalCode.indexOf(`id: '${id}'`);
  const block = finalCode.slice(pos, pos + 2500);
  return !block.includes('cooldownConfig');
});
console.log(`\nVerification: ${missing.length === 0 ? 'ALL OK' : 'Missing: ' + missing.join(', ')}`);
console.log(`Total spells: ${allIds.length} | cooldownConfig occurrences: ${(finalCode.match(/cooldownConfig/g)||[]).length}`);
