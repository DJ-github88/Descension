// Fix the corrupted soul_drain and vampiric_strike targetingConfig blocks
const fs = require('fs');
const filePath = 'vtt-react/src/data/classes/dreadnaughtData.js';
let code = fs.readFileSync(filePath, 'utf8');

// Fix soul_drain: the targetingConfig got corrupted - description has orphaned maxTargets
// Current broken state (approx):
//   description: 'Drain the soul...',
//       maxTargets: 1,
//     },
//     resourceCost: {
// We need to rebuild soul_drain's targetingConfig correctly

// First, find the soul_drain block and show what we have
const sdPos = code.indexOf("id: 'dread_soul_drain'");
const sdBlock = code.slice(sdPos, sdPos + 600);
console.log('Soul drain block start:\n', sdBlock.slice(0, 400));
console.log('---');
