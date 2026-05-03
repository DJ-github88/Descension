const fs = require('fs');
const c = fs.readFileSync('vtt-react/src/data/classes/dreadnaughtData.js', 'utf8');
['dread_cosmic_devourer', 'dread_cosmic_annihilation'].forEach(id => {
  const pos = c.indexOf("id: '" + id + "'");
  const tc = c.indexOf('typeConfig: {', pos);
  console.log(id, '| id at:', pos, '| typeConfig at:', tc, '| offset:', tc - pos);
  // Also show if they already have cooldownConfig somewhere
  const block = c.slice(pos, pos + 3000);
  console.log('  has cooldownConfig:', block.includes('cooldownConfig'));
});
