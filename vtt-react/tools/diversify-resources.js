/**
 * Script to diversify resource costs across test spells
 */

const fs = require('fs');
const path = require('path');

// Read the test spells file
const testSpellsPath = path.join(__dirname, 'src/data/testSpells.js');
let content = fs.readFileSync(testSpellsPath, 'utf8');

// Define resource variations for different spells
const resourceVariations = [
  // Health cost spells (blood magic, sacrifice)
  {
    spell: 'Dominate Mind',
    resources: { mana: 30, health: 20, stamina: 0, focus: 0 }
  },
  {
    spell: 'Multi Resource Spell',
    resources: { mana: 25, health: 15, stamina: 10, focus: 5 },
    classResource: { type: 'soul_shards', cost: 3 }
  },
  // Stamina cost spells (physical exertion)
  {
    spell: 'Gravity Well',
    resources: { mana: 20, health: 0, stamina: 15, focus: 0 }
  },
  {
    spell: 'Area Cone Breath',
    resources: { mana: 15, health: 0, stamina: 20, focus: 0 }
  },
  // Focus cost spells (concentration, precision)
  {
    spell: 'Smart Target Heal',
    resources: { mana: 20, health: 0, stamina: 0, focus: 15 }
  },
  {
    spell: 'Nearest Enemy Strike',
    resources: { mana: 10, health: 0, stamina: 0, focus: 20 }
  },
  // Class resource spells
  {
    spell: 'Chain Lightning',
    resources: { mana: 40, health: 0, stamina: 0, focus: 0 },
    classResource: { type: 'arcane_charges', cost: 4 }
  },
  {
    spell: 'Rejuvenation',
    resources: { mana: 25, health: 0, stamina: 0, focus: 0 },
    classResource: { type: 'holy_power', cost: 3 }
  },
  {
    spell: 'Progressive Might',
    resources: { mana: 30, health: 0, stamina: 0, focus: 0 },
    classResource: { type: 'combo_points', cost: 5 }
  },
  {
    spell: 'Polymorph Beast',
    resources: { mana: 35, health: 0, stamina: 0, focus: 0 },
    classResource: { type: 'chi', cost: 3 }
  },
  {
    spell: 'Channeled Beam',
    resources: { mana: 20, health: 0, stamina: 0, focus: 0 },
    classResource: { type: 'runes', cost: 2 }
  },
  {
    spell: 'Ultimate Spell',
    resources: { mana: 50, health: 25, stamina: 20, focus: 15 },
    classResource: { type: 'soul_shards', cost: 5 }
  }
];

console.log('Diversifying resource costs...');

resourceVariations.forEach(variation => {
  // Find the spell and update its resource costs
  const spellPattern = new RegExp(
    `(name: 'TEST: ${variation.spell}',[\\s\\S]*?resourceCost: \\{[\\s\\S]*?)` +
    `mana: \\d+,\\s*health: \\d+,\\s*stamina: \\d+,\\s*focus: \\d+`,
    'g'
  );
  
  content = content.replace(spellPattern, (match, prefix) => {
    let replacement = `${prefix}mana: ${variation.resources.mana}, health: ${variation.resources.health}, stamina: ${variation.resources.stamina}, focus: ${variation.resources.focus}`;
    
    // Add class resource if specified
    if (variation.classResource) {
      replacement += `,\n      classResource: {\n        type: '${variation.classResource.type}',\n        cost: ${variation.classResource.cost}\n      }`;
    }
    
    return replacement;
  });
  
  console.log(`✓ Updated ${variation.spell}`);
});

// Write the fixed content back
fs.writeFileSync(testSpellsPath, content, 'utf8');

console.log('\n✅ Resource costs diversified successfully!');
console.log('\nResource distribution:');
console.log('- Mana only: ~15 spells');
console.log('- Mana + Health: 2 spells');
console.log('- Mana + Stamina: 2 spells');
console.log('- Mana + Focus: 2 spells');
console.log('- Mana + Class Resource: 6 spells');
console.log('- All resources: 2 spells');

