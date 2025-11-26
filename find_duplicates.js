// Script to find duplicate spells across class data files
const fs = require('fs');
const path = require('path');

const classesDir = 'vtt-react/src/data/classes';
const spellMap = new Map();
const duplicates = new Map();

function extractSpellsFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const className = path.basename(filePath, '.js');

    // Find all spell objects (starting with { and containing id: and name:)
    const spellRegex = /\{\s*id:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"]/g;
    let match;

    while ((match = spellRegex.exec(content)) !== null) {
      const id = match[1];
      const name = match[2];

      if (!spellMap.has(name)) {
        spellMap.set(name, []);
      }
      spellMap.get(name).push({ id, class: className, file: filePath });

      // Check for ID duplicates too
      if (!duplicates.has(id)) {
        duplicates.set(id, []);
      }
      duplicates.get(id).push({ name, class: className, file: filePath });
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
  }
}

function findDuplicates() {
  console.log('=== SPELL NAME DUPLICATES ===');
  for (const [spellName, occurrences] of spellMap) {
    if (occurrences.length > 1) {
      console.log(`\n"${spellName}" appears in ${occurrences.length} classes:`);
      occurrences.forEach(occ => {
        console.log(`  - ${occ.class} (${occ.id})`);
      });
    }
  }

  console.log('\n=== SPELL ID DUPLICATES ===');
  for (const [spellId, occurrences] of duplicates) {
    if (occurrences.length > 1) {
      console.log(`\nID "${spellId}" appears in ${occurrences.length} classes:`);
      occurrences.forEach(occ => {
        console.log(`  - ${occ.class} ("${occ.name}")`);
      });
    }
  }
}

// Process all class files
const classFiles = fs.readdirSync(classesDir)
  .filter(file => file.endsWith('Data.js'))
  .map(file => path.join(classesDir, file));

console.log(`Processing ${classFiles.length} class files...`);

classFiles.forEach(extractSpellsFromFile);
findDuplicates();
