/**
 * Script to add verbal, somatic, and material component text to test spells
 */

const fs = require('fs');
const path = require('path');

// Read the test spells file
const testSpellsPath = path.join(__dirname, 'src/data/testSpells.js');
let content = fs.readFileSync(testSpellsPath, 'utf8');

// Define component text for each spell
const componentText = [
  {
    spell: 'Chain Lightning',
    verbal: 'Chains of lightning!',
    somatic: 'Point fingers at targets in sequence',
    material: 'A bit of fur and an amber rod'
  },
  {
    spell: 'Summon Fire Elemental',
    verbal: 'Ignis elementum, veni!',
    somatic: 'Draw a circle of flame in the air',
    material: 'A ruby worth 100gp'
  },
  {
    spell: 'Polymorph Beast',
    verbal: 'Forma mutatio!',
    somatic: 'Trace the outline of the target creature',
    material: 'A caterpillar cocoon'
  },
  {
    spell: 'Greater Purification',
    verbal: 'Puritas maxima!',
    somatic: 'Wave hands over the afflicted',
    material: 'Holy water and powdered silver'
  },
  {
    spell: 'Resurrection',
    verbal: 'Vita redux, anima reveni!',
    somatic: 'Place hands on the deceased\'s heart',
    material: 'A diamond worth 1000gp (consumed)'
  },
  {
    spell: 'Wild Magic Surge',
    verbal: 'Chaos unleashed!',
    somatic: 'Wild gesticulations',
    material: 'A shard of chaos crystal'
  },
  {
    spell: 'Charge Fireball',
    verbal: 'Ignis globus!',
    somatic: 'Cup hands and gather energy',
    material: 'A pinch of sulfur'
  },
  {
    spell: 'Multi Effect Combo',
    verbal: 'Omnia simul!',
    somatic: 'Complex weaving hand patterns',
    material: 'A prism and a vial of quicksilver'
  },
  {
    spell: 'Ultimate Spell',
    verbal: 'OMNIPOTENTIA ABSOLUTA!',
    somatic: 'Raise both arms to the heavens',
    material: 'A star sapphire worth 1000gp, a phoenix feather, and dragon blood (all consumed)'
  },
  {
    spell: 'Dimension Door',
    verbal: 'Porta dimensio!',
    somatic: 'Tear open a rift in space'
  },
  {
    spell: 'Invisibility',
    verbal: 'Invisibilis!',
    somatic: 'Pass hand over body from head to toe'
  },
  {
    spell: 'Rejuvenation',
    verbal: 'Vita restauro!',
    somatic: 'Gentle circular motions over wounds'
  },
  {
    spell: 'Progressive Might',
    verbal: 'Fortitudo crescens!',
    somatic: 'Flex muscles and strike a power pose'
  },
  {
    spell: 'Gravity Well',
    verbal: 'Gravitas maxima!',
    somatic: 'Pull fists downward forcefully'
  },
  {
    spell: 'Channeled Beam',
    verbal: 'Radius continuus!',
    somatic: 'Extend arm and maintain focus'
  },
  {
    spell: 'Passive Aura',
    verbal: 'Aura perpetua!',
    somatic: 'Spread arms wide to emanate energy'
  }
];

console.log('Adding component text to spells...\n');

componentText.forEach(spell => {
  // Find the spell's resourceCost section
  const spellPattern = new RegExp(
    `(name: 'TEST: ${spell.spell}',[\\s\\S]*?resourceCost: \\{\\s*components: \\[[^\\]]+\\],)`,
    'g'
  );

  content = content.replace(spellPattern, (match) => {
    let result = match;
    
    // Add verbal text if provided
    if (spell.verbal && !match.includes('verbalText:')) {
      result = result.replace(
        /(components: \[[^\]]+\],)/,
        `$1\n      verbalText: '${spell.verbal}',`
      );
    }
    
    // Add somatic text if provided
    if (spell.somatic && !match.includes('somaticText:')) {
      result = result.replace(
        /(verbalText: '[^']+',|components: \[[^\]]+\],)/,
        `$1\n      somaticText: '${spell.somatic}',`
      );
    }
    
    // Add material text if provided and not already present
    if (spell.material && !match.includes('materialComponents:')) {
      result = result.replace(
        /(somaticText: '[^']+',|verbalText: '[^']+',|components: \[[^\]]+\],)/,
        `$1\n      materialComponents: '${spell.material}',`
      );
    }
    
    return result;
  });
  
  console.log(`✓ Added component text to ${spell.spell}`);
});

// Write the fixed content back
fs.writeFileSync(testSpellsPath, content, 'utf8');

console.log('\n✅ Component text added successfully!');
console.log('\nSpells updated:');
console.log('- With V/S/M text: 9 spells');
console.log('- With V/S text: 7 spells');
console.log('- Total: 16 spells with custom component descriptions');

