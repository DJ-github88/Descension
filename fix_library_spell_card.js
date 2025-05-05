// Fix the syntax error in LibraryStyleSpellCard.jsx
const fs = require('fs');

// Read the file
const filePath = 'src/components/spellcrafting-wizard/components/common/LibraryStyleSpellCard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix the specific issue with the return statement at line 148
content = content.replace(/if \(similarSpell\) \{\s*console\.log\('Found similar spell:', similarSpell\);\s*return \{/g, 
  'if (similarSpell) {\n          console.log(\'Found similar spell:\', similarSpell);\n          return {');

// Write the file
fs.writeFileSync(filePath, content);

console.log('Fixed syntax error in', filePath);
