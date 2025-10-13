/**
 * Script to fix material components for test spells
 */

const fs = require('fs');
const path = require('path');

// Read the test spells file
const testSpellsPath = path.join(__dirname, 'src/data/testSpells.js');
let content = fs.readFileSync(testSpellsPath, 'utf8');

// Define correct material components for each spell
const materialFixes = [
  {
    spell: 'Chain Lightning',
    oldMaterial: 'Seven silver coins',
    newMaterial: 'A bit of fur and an amber rod'
  },
  {
    spell: 'Rejuvenation',
    remove: true // Should only have V, S
  },
  {
    spell: 'Progressive Might',
    remove: true // Should only have V, S
  },
  {
    spell: 'Dimension Door',
    remove: true // Should only have V
  },
  {
    spell: 'Gravity Well',
    remove: true // Should only have V, S
  },
  {
    spell: 'Channeled Beam',
    remove: true // Should only have V, S
  },
  {
    spell: 'Passive Aura',
    remove: true // Should only have V
  },
  {
    spell: 'Counterspell',
    remove: true // Should only have V, S
  },
  {
    spell: 'Invisibility',
    remove: true // Should only have V, S
  },
  {
    spell: 'Single Target Bolt',
    remove: true // Should only have V, S
  },
  {
    spell: 'Multi Target Missiles',
    remove: true // Should only have V, S
  },
  {
    spell: 'Area Circle Blast',
    remove: true // Should only have V, S
  },
  {
    spell: 'Area Cone Breath',
    remove: true // Should only have V, S
  },
  {
    spell: 'Area Line Lightning',
    remove: true // Should only have V, S
  },
  {
    spell: 'Smart Target Heal',
    remove: true // Should only have V, S
  },
  {
    spell: 'Nearest Enemy Strike',
    remove: true // Should only have V, S
  },
  {
    spell: 'Wild Magic Surge',
    add: true,
    newMaterial: 'A shard of chaos crystal'
  },
  {
    spell: 'Charge Fireball',
    add: true,
    newMaterial: 'A pinch of sulfur'
  },
  {
    spell: 'Dice Cooldown Blast',
    remove: true // Should only have V, S
  },
  {
    spell: 'Multi Effect Combo',
    add: true,
    newMaterial: 'A prism and a vial of quicksilver'
  },
  {
    spell: 'Ultimate Spell',
    add: true,
    newMaterial: 'A star sapphire worth 1000gp, a phoenix feather, and dragon blood (all consumed)'
  }
];

console.log('Fixing material components...\n');

materialFixes.forEach(fix => {
  if (fix.remove) {
    // Remove material from components array and materialComponents line
    const pattern = new RegExp(
      `(name: 'TEST: ${fix.spell}',[\\s\\S]*?components: \\[)'verbal', 'somatic', 'material'(\\],\\s*materialComponents: '[^']*',)`,
      'g'
    );
    content = content.replace(pattern, (match, p1, p2) => {
      return `${p1}'verbal', 'somatic'],`;
    });
    console.log(`✓ Removed material from ${fix.spell}`);
  } else if (fix.add) {
    // Add material to components array and materialComponents line
    const pattern = new RegExp(
      `(name: 'TEST: ${fix.spell}',[\\s\\S]*?components: \\[)'verbal', 'somatic'(\\],)`,
      'g'
    );
    content = content.replace(pattern, (match, p1, p2) => {
      return `${p1}'verbal', 'somatic', 'material'],\n      materialComponents: '${fix.newMaterial}',`;
    });
    console.log(`✓ Added material to ${fix.spell}`);
  } else if (fix.oldMaterial && fix.newMaterial) {
    // Replace existing material
    const pattern = new RegExp(
      `(name: 'TEST: ${fix.spell}',[\\s\\S]*?materialComponents: )'${fix.oldMaterial}'`,
      'g'
    );
    content = content.replace(pattern, (match, p1) => {
      return `${p1}'${fix.newMaterial}'`;
    });
    console.log(`✓ Fixed material for ${fix.spell}`);
  }
});

// Write the fixed content back
fs.writeFileSync(testSpellsPath, content, 'utf8');

console.log('\n✅ Material components fixed successfully!');
console.log('\nMaterial component distribution:');
console.log('- V, S, M: ~12 spells (complex spells requiring materials)');
console.log('- V, S: ~18 spells (standard spells)');
console.log('- V: ~2 spells (simple utility spells)');

