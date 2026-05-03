const fs = require('fs');
const code = fs.readFileSync('vtt-react/src/data/classes/dreadnaughtData.js', 'utf8');

// Extract spells
const idRe = /id: '(dread_[^']+)'/g;
let m;
const issues = [];

while ((m = idRe.exec(code)) !== null) {
  const start = m.index;
  const end = code.indexOf('},', start + 1000) > -1 ? code.indexOf('},', start + 1000) + 2 : start + 3000;
  const block = code.slice(start, end);
  
  const etMatch = block.match(/effectTypes: \[([^\]]+)\]/);
  const effectTypes = etMatch ? etMatch[1].replace(/['"]/g, '').split(',').map(s => s.trim()) : [];
  
  const configMap = {
    restoration: 'restorationConfig',
    healing: 'healingConfig',
    buff: 'buffConfig',
    debuff: 'debuffConfig',
    damage: 'damageConfig',
    transformation: 'transformationConfig',
    summoning: 'summoningConfig',
    utility: 'utilityConfig',
    control: 'controlConfig',
    purification: 'purificationConfig'
  };
  
  effectTypes.forEach(type => {
    const cfg = configMap[type];
    if (cfg && !block.includes(cfg + ':')) {
      issues.push(`MISSING ${cfg}: ${m[1]} (has effectType=${type})`);
    }
  });

  // Check for resourceGainConfig which is not rendered
  if (block.includes('resourceGainConfig:')) {
     issues.push(`UNRENDERED resourceGainConfig: ${m[1]} (UnifiedSpellCard doesn't support this, use restorationConfig or buffConfig)`);
  }
  
  // Check for healing formula issues in description vs config
  if (block.includes('healing') && !block.includes('healingConfig') && !block.includes('restorationConfig')) {
     issues.push(`HEALING TYPE BUT NO HEALING/RESTORATION CONFIG: ${m[1]}`);
  }
}

issues.forEach(i => console.log(i));
console.log('Audit complete.');
