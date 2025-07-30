/**
 * Test Enhanced Spells
 * 
 * Quick test to verify our enhanced spells are properly formatted
 */

// Import the enhanced spell library
const { LIBRARY_SPELLS } = require('./src/data/spellLibraryData.js');

console.log('🧙‍♂️ Testing Enhanced Spell Library...\n');

console.log(`📊 Total spells in library: ${LIBRARY_SPELLS.length}`);

// Check for our enhanced spells
const enhancedSpellNames = [
  'Ethereal Flame Manifestation',
  'Crystalline Frost Convergence', 
  'Resonant Storm Essence',
  'Sublime Grace Blessing',
  'Celestial Sanctuary Covenant',
  'Fate Weaver\'s Paradigm',
  'Twisted Nexus Theorem',
  'Pure Matrix Confluence',
  'Verdant Growth Harmony',
  'Piercing Thought Fragment',
  'Fleeting Moment Stasis',
  'Eternal Echo Paradox',
  'Ethereal Guardian Manifestation',
  'Primal Essence Transformation',
  'Serendipity Cascade',
  'Prophetic Revelation Matrix',
  'Crescendo of Power',
  'Luminous Purification Wave'
];

console.log('\n🔍 Checking for enhanced spells:');
let foundCount = 0;

enhancedSpellNames.forEach(name => {
  const found = LIBRARY_SPELLS.find(spell => spell.name === name);
  if (found) {
    console.log(`✅ ${name}`);
    foundCount++;
  } else {
    console.log(`❌ ${name} - NOT FOUND`);
  }
});

console.log(`\n📈 Found ${foundCount}/${enhancedSpellNames.length} enhanced spells`);

// Check spell structure
console.log('\n🔧 Checking spell structure:');
const sampleSpell = LIBRARY_SPELLS.find(spell => spell.name === 'Ethereal Flame Manifestation');
if (sampleSpell) {
  console.log('✅ Sample enhanced spell found');
  console.log(`   - ID: ${sampleSpell.id}`);
  console.log(`   - Level: ${sampleSpell.level}`);
  console.log(`   - Type: ${sampleSpell.spellType}`);
  console.log(`   - Effects: ${sampleSpell.effectTypes?.join(', ')}`);
  console.log(`   - Has damageConfig: ${!!sampleSpell.damageConfig}`);
  console.log(`   - Has targetingConfig: ${!!sampleSpell.targetingConfig}`);
  console.log(`   - Has resourceCost: ${!!sampleSpell.resourceCost}`);
} else {
  console.log('❌ Sample enhanced spell not found');
}

// Check for advanced mechanics
console.log('\n⚙️ Checking advanced mechanics:');
let cardMechanics = 0;
let coinMechanics = 0;
let progressiveEffects = 0;

LIBRARY_SPELLS.forEach(spell => {
  if (spell.mechanicsConfig?.cards?.enabled) cardMechanics++;
  if (spell.mechanicsConfig?.coins?.enabled) coinMechanics++;
  if (spell.rollableTable?.enabled) {
    if (spell.rollableTable.tableType === 'cards') cardMechanics++;
    if (spell.rollableTable.tableType === 'coins') coinMechanics++;
  }
  if (spell.damageConfig?.isProgressiveDamage || spell.healingConfig?.isProgressiveHot) {
    progressiveEffects++;
  }
});

console.log(`   - Card mechanics: ${cardMechanics} spells`);
console.log(`   - Coin mechanics: ${coinMechanics} spells`);
console.log(`   - Progressive effects: ${progressiveEffects} spells`);

console.log('\n✨ Enhanced spell library test complete!');

if (foundCount === enhancedSpellNames.length) {
  console.log('🎉 SUCCESS: All enhanced spells are properly loaded!');
} else {
  console.log('⚠️ WARNING: Some enhanced spells are missing from the library.');
}
