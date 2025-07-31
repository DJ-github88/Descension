// Fix the syntax error in LibraryStyleSpellCard.jsx
const fs = require('fs');
const path = require('path');

// Path to the file
const filePath = path.join('src', 'components', 'spellcrafting-wizard', 'components', 'common', 'LibraryStyleSpellCard.jsx');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Fix the indentation issue with the return statement
content = content.replace(/if \(parsedData\.name\) \{\s*return \{/g, 
  'if (parsedData.name) {\n          return {');

// Write the file
fs.writeFileSync(filePath, content);

console.log('Fixed syntax error in', filePath);
