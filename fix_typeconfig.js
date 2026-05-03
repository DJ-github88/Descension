const fs = require('fs');
const filePath = 'vtt-react/src/data/classes/dreadnaughtData.js';
let code = fs.readFileSync(filePath, 'utf8');

// Only remove cooldownConfig that is INSIDE a typeConfig block (nested)
// vs cooldownConfig at spell top level (correct location)
// Strategy: find each typeConfig: { ... } and strip cooldownConfig from inside

let fixed = 0;
let pos = 0;
const marker = 'typeConfig: {';

while (true) {
  const tcPos = code.indexOf(marker, pos);
  if (tcPos === -1) break;
  
  // Find matching closing brace for this typeConfig block
  let depth = 0;
  let i = tcPos + marker.length - 1; // position of opening {
  let tcEnd = -1;
  for (; i < code.length; i++) {
    if (code[i] === '{') depth++;
    else if (code[i] === '}') {
      depth--;
      if (depth === 0) { tcEnd = i; break; }
    }
  }
  
  if (tcEnd === -1) break;
  
  const tcBlock = code.slice(tcPos, tcEnd + 1);
  
  // Only fix if this typeConfig block contains a cooldownConfig
  if (tcBlock.includes('cooldownConfig')) {
    // Remove just the cooldownConfig sub-block
    const cleaned = tcBlock.replace(/\n\s*cooldownConfig: \{\n\s*type: 'none'\n\s*\},?\n/g, '\n');
    if (cleaned !== tcBlock) {
      code = code.slice(0, tcPos) + cleaned + code.slice(tcEnd + 1);
      fixed++;
    }
  }
  
  pos = tcPos + 1;
}

fs.writeFileSync(filePath, code, 'utf8');
console.log(`Removed ${fixed} nested cooldownConfig from typeConfig blocks.`);
