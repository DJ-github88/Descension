const fs = require('fs');
const c = fs.readFileSync('vtt-react/src/data/classes/dreadnaughtData.js', 'utf8');
const ids = [...c.matchAll(/id: '(dread_[^']+)'/g)].map(m => m[1]);
const noCD = ids.filter(id => {
  const pos = c.indexOf("id: '" + id + "'");
  const block = c.slice(pos, pos + 2500);
  return !block.includes('cooldownConfig');
});
console.log('Spells missing cooldownConfig:', noCD.join('\n  '));
console.log('Total spells:', ids.length, '| Missing:', noCD.length);
