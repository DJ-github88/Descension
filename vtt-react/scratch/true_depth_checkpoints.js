const fs = require('fs');
const content = fs.readFileSync('D:/VTT/vtt-react/src/data/classes/lichborneData.js', 'utf8');

let depth = 0;
let inString = false;
let stringChar = '';
let inTemplate = false;
let inComment = false;
let inBlockComment = false;
let lineNum = 1;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i+1];
    
    if (char === '\n') lineNum++;

    if (inBlockComment) {
        if (char === '*' && nextChar === '/') {
            inBlockComment = false;
            i++;
        }
        continue;
    }
    
    if (inComment) {
        if (char === '\n') inComment = false;
        continue;
    }
    
    if (inString) {
        if (char === stringChar && content[i-1] !== '\\') inString = false;
        continue;
    }
    
    if (inTemplate) {
        if (char === '`' && content[i-1] !== '\\') inTemplate = false;
        continue;
    }
    
    if (char === '/' && nextChar === '*') {
        inBlockComment = true;
        i++;
    } else if (char === '/' && nextChar === '/') {
        inComment = true;
        i++;
    } else if (char === "'" || char === '"') {
        inString = true;
        stringChar = char;
    } else if (char === '`') {
        inTemplate = true;
    } else if (char === '{') {
        depth++;
        // console.log(`Line ${lineNum}: depth ${depth} | {`);
    } else if (char === '}') {
        depth--;
        // console.log(`Line ${lineNum}: depth ${depth} | }`);
    }
    
    if (lineNum === 1745 && char === '\n') {
        console.log(`Depth at end of exampleSpells (line 1744): ${depth}`);
    }
    if (lineNum === 3601 && char === '\n') {
        console.log(`Depth at end of spells (line 3600): ${depth}`);
    }
}

console.log(`Final true depth: ${depth}`);
