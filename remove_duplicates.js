// Script to automatically remove duplicate spells with same IDs within the same file
const fs = require('fs');
const path = require('path');

const classesDir = 'vtt-react/src/data/classes';

// Function to remove duplicate spells with same IDs in a file
function removeDuplicateSpellsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const className = path.basename(filePath, '.js');

    console.log(`Processing ${className}...`);

    // Find all spell objects with their positions
    const spellRegex = /\{\s*id:\s*['"]([^'"]+)['"]/g;
    const spells = [];
    let match;

    while ((match = spellRegex.exec(content)) !== null) {
      spells.push({
        id: match[1],
        startIndex: match.index,
        fullMatch: match[0]
      });
    }

    // Find duplicates (same ID appearing multiple times)
    const seenIds = new Set();
    const duplicates = [];

    for (const spell of spells) {
      if (seenIds.has(spell.id)) {
        duplicates.push(spell);
      } else {
        seenIds.add(spell.id);
      }
    }

    if (duplicates.length === 0) {
      console.log(`  No duplicates found in ${className}`);
      return;
    }

    console.log(`  Found ${duplicates.length} duplicate spells in ${className}`);

    // Remove duplicates (keep first occurrence)
    // We need to remove from end to beginning to maintain indices
    duplicates.reverse();

    for (const duplicate of duplicates) {
      // Find the end of this spell object by looking for the closing brace
      let braceCount = 0;
      let endIndex = duplicate.startIndex;
      let inString = false;
      let stringChar = '';

      for (let i = duplicate.startIndex; i < content.length; i++) {
        const char = content[i];

        // Handle strings
        if (!inString && (char === '"' || char === "'")) {
          inString = true;
          stringChar = char;
        } else if (inString && char === stringChar && content[i-1] !== '\\') {
          inString = false;
        } else if (!inString) {
          if (char === '{') {
            braceCount++;
          } else if (char === '}') {
            braceCount--;
            if (braceCount === 0) {
              endIndex = i;
              break;
            }
          }
        }
      }

      // Find the end of the line after the closing brace
      while (endIndex < content.length && content[endIndex] !== '\n') {
        endIndex++;
      }
      endIndex++; // Include the newline

      // Remove the duplicate spell
      const before = content.substring(0, duplicate.startIndex);
      const after = content.substring(endIndex);
      content = before + after;

      console.log(`    Removed duplicate spell with ID: ${duplicate.id}`);
    }

    // Write back the cleaned content
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Cleaned ${className}`);

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Process all class files
const classFiles = fs.readdirSync(classesDir)
  .filter(file => file.endsWith('Data.js'))
  .map(file => path.join(classesDir, file));

console.log(`Processing ${classFiles.length} class files for duplicate removal...`);

classFiles.forEach(removeDuplicateSpellsInFile);

console.log('Duplicate removal complete!');
