/**
 * Script to automatically fix all test spells with proper components and configurations
 */

const fs = require('fs');
const path = require('path');

// Read the test spells file
const testSpellsPath = path.join(__dirname, 'src/data/testSpells.js');
let content = fs.readFileSync(testSpellsPath, 'utf8');

// Define component configurations for different spell types
const componentConfigs = {
  // Damage spells - V, S, M
  damage: {
    components: ['verbal', 'somatic', 'material'],
    materials: {
      fire: 'A tiny ball of bat guano and sulfur',
      cold: 'A drop of water or piece of ice',
      lightning: 'A bit of fur and an amber rod',
      force: 'A shard of mica',
      acid: 'A drop of acid',
      poison: 'A fang from a poisonous creature',
      necrotic: 'A withered flower petal',
      radiant: 'A sunburst pendant',
      psychic: 'A crystal prism'
    }
  },
  // Healing spells - V, S
  healing: {
    components: ['verbal', 'somatic']
  },
  // Buff spells - V, S
  buff: {
    components: ['verbal', 'somatic']
  },
  // Debuff spells - V, S, M
  debuff: {
    components: ['verbal', 'somatic', 'material'],
    materials: 'A pinch of powdered iron'
  },
  // Utility spells - V
  utility: {
    components: ['verbal']
  },
  // Control spells - V, S, M
  control: {
    components: ['verbal', 'somatic', 'material'],
    materials: 'A small iron chain'
  },
  // Summoning spells - V, S, M
  summoning: {
    components: ['verbal', 'somatic', 'material'],
    materials: 'A brazier of burning incense'
  },
  // Transformation spells - V, S, M
  transformation: {
    components: ['verbal', 'somatic', 'material'],
    materials: 'A caterpillar cocoon'
  },
  // Purification spells - V, S, M
  purification: {
    components: ['verbal', 'somatic', 'material'],
    materials: 'Holy water and silver dust'
  },
  // Restoration spells - V, S, M
  restoration: {
    components: ['verbal', 'somatic', 'material'],
    materials: 'Diamond worth 500gp (consumed)'
  }
};

// Fix 1: Add components to all resourceCost blocks
console.log('Adding components to all spells...');

// Pattern to match resourceCost blocks without components
const resourceCostPattern = /(resourceCost: \{)\s*\n(\s*actionPoints:)/g;

content = content.replace(resourceCostPattern, (match, p1, p2) => {
  return `${p1}\n      components: ['verbal', 'somatic'],\n${p2}`;
});

console.log('✓ Added basic components to all spells');

// Fix 2: Add material components to specific spells
const spellsNeedingMaterials = [
  { name: 'Dice Fireball', material: 'A tiny ball of bat guano and sulfur' },
  { name: 'Coin Fortune Frost', material: 'Seven silver coins' },
  { name: 'Summon Fire Elemental', material: 'A brazier of burning incense and ruby dust worth 100gp' },
  { name: 'Polymorph Beast', material: 'A caterpillar cocoon' },
  { name: 'Greater Purification', material: 'Holy water and silver dust worth 50gp' },
  { name: 'Resurrection', material: 'Diamond worth 500gp (consumed)' },
  { name: 'Explosive Rune', material: 'Powdered diamond worth 50gp' },
  { name: 'Reagent Ritual', material: 'Dragon scale, phoenix feather, and moonstone (all consumed)' }
];

spellsNeedingMaterials.forEach(spell => {
  const pattern = new RegExp(
    `(name: 'TEST: ${spell.name}',[\\s\\S]*?components: \\[)('verbal', 'somatic')(\\])`,
    'g'
  );
  content = content.replace(pattern, (match, p1, p2, p3) => {
    return `${p1}'verbal', 'somatic', 'material'${p3},\n      materialComponents: '${spell.material}'`;
  });
});

console.log('✓ Added material components to specific spells');

// Fix 3: Fix capitalization of conditions
const conditionFixes = [
  { old: "'charmed'", new: "'Charmed'" },
  { old: "'haste'", new: "'Haste'" },
  { old: "'stunned'", new: "'Stunned'" },
  { old: "'slowed'", new: "'Slowed'" },
  { old: "'paralyzed'", new: "'Paralyzed'" },
  { old: "'frightened'", new: "'Frightened'" },
  { old: "'invisible'", new: "'Invisible'" }
];

conditionFixes.forEach(fix => {
  content = content.replace(new RegExp(fix.old, 'g'), fix.new);
});

console.log('✓ Fixed condition capitalization');

// Fix 4: Fix spacing issues
content = content.replace(/rangeDistance:\s+(\d+)/g, 'rangeDistance: $1');
content = content.replace(/targetingType:\s+'self'/g, "targetingType: 'self'");
content = content.replace(/targetingType: ' self'/g, "targetingType: 'self'");

console.log('✓ Fixed spacing issues');

// Fix 5: Fix area effect "any" to specific shapes
content = content.replace(/targetRestrictions: \['any'\]/g, "targetRestrictions: ['enemies', 'objects']");

console.log('✓ Fixed area effect restrictions');

// Write the fixed content back
fs.writeFileSync(testSpellsPath, content, 'utf8');

console.log('\n✅ All fixes applied successfully!');
console.log('\nNext steps:');
console.log('1. Review the changes in testSpells.js');
console.log('2. Add trigger configs to REACTION and TRAP spells manually');
console.log('3. Add summoning creature specifications');
console.log('4. Diversify resource costs');
console.log('5. Test the spells in the application');

