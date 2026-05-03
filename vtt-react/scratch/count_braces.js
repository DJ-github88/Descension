const fs = require('fs');
const content = fs.readFileSync('D:/VTT/vtt-react/src/data/classes/lichborneData.js', 'utf8');
const openBraces = (content.match(/\{/g) || []).length;
const closeBraces = (content.match(/\}/g) || []).length;
const openBrackets = (content.match(/\[/g) || []).length;
const closeBrackets = (content.match(/\]/g) || []).length;
console.log(`Braces: { ${openBraces}, } ${closeBraces}`);
console.log(`Brackets: [ ${openBrackets}, ] ${closeBrackets}`);
