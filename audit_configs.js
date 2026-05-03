const fs = require('fs');
const code = fs.readFileSync('vtt-react/src/data/classes/dreadnaughtData.js', 'utf8');

// Extract just the spells array via regex
const spellsMatch = code.match(/spells:\s*\[[\s\S]+/);
if (!spellsMatch) { console.log('Could not find spells array'); process.exit(1); }

// Parse spells by finding all id: 'dread_' entries and the effectTypes near them
const spellBlocks = [];
const idRe = /id: '(dread_[^']+)'/g;
let m;
while ((m = idRe.exec(code)) !== null) {
  const start = m.index;
  const end = Math.min(start + 3500, code.length);
  const block = code.slice(start, end);
  
  const etMatch = block.match(/effectTypes: \[([^\]]+)\]/);
  const effectTypes = etMatch ? etMatch[1].replace(/['"]/g, '').split(',').map(s => s.trim()) : [];
  
  const configChecks = {
    restoration: 'restorationConfig',
    healing: 'healingConfig',
    buff: 'buffConfig',
    debuff: 'debuffConfig',
    damage: 'damageConfig',
    transformation: 'transformationConfig',
    summoning: 'summoningConfig',
    utility: 'utilityConfig',
  };
  
  effectTypes.forEach(type => {
    const cfg = configChecks[type];
    if (cfg && !block.includes(cfg + ':')) {
      console.log(`MISSING ${cfg}: ${m[1]} (has effectType=${type})`);
    }
  });
}
console.log('Audit complete.');
