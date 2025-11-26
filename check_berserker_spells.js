// Check all berserker spells
const fs = require('fs');
const content = fs.readFileSync('vtt-react/src/data/classes/berserkerData.js', 'utf8');
const spellRegex = /\{\s*id:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"],\s*level:\s*(\d+)/g;
const spells = [];
let match;
while ((match = spellRegex.exec(content)) !== null) {
  spells.push({id: match[1], name: match[2], level: parseInt(match[3])});
}
console.log('All Berserker Spells:');
spells.forEach(s => console.log(`Level ${s.level}: ${s.name} (${s.id})`));
console.log(`Total spells: ${spells.length}`);
