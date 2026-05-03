// Fix missing commas before targetRestrictions that was inserted without a trailing comma
const fs = require('fs');
const filePath = 'vtt-react/src/data/classes/dreadnaughtData.js';
let code = fs.readFileSync(filePath, 'utf8');

// Pattern: rangeDistance: N\n        targetRestrictions  (missing comma after N)
const before = code.length;
code = code.replace(/(rangeDistance: \d+)(\n\s+targetRestrictions)/g, '$1,$2');
const fixed = code.length !== before ? 'Fixed comma issues' : 'No comma issues found (length unchanged but replacements may have happened)';

// Also fix trailing comma before closing brace in targetingConfig
// e.g.  maxTargets: 1,\n      },  - this is fine
// e.g.  maxTargets: 1\n      },  - missing comma - check these too
code = code.replace(/(maxTargets: \d+)(\n\s+\})/g, '$1,$2');

fs.writeFileSync(filePath, code, 'utf8');
console.log(fixed);
console.log('Done');
