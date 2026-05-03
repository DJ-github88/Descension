const fs = require('fs');
const content = fs.readFileSync('D:/VTT/vtt-react/src/data/classes/lichborneData.js', 'utf8').split('\n');

let depth = 1; 
let inString = false;
let stringChar = '';
let inTemplate = false;
let inComment = false;
let inBlockComment = false;

for (let i = 8; i < 309; i++) {
    const line = content[i];
    const prevDepth = depth;
    for (let j = 0; j < line.length; j++) {
        const char = line[j];
        const nextChar = line[j+1];
        if (inBlockComment) { if (char === '*' && nextChar === '/') { inBlockComment = false; j++; } continue; }
        if (inComment) continue;
        if (inString) { if (char === stringChar && line[j-1] !== '\\') inString = false; continue; }
        if (inTemplate) { if (char === '`' && line[j-1] !== '\\') inTemplate = false; continue; }
        if (char === '/' && nextChar === '*') { inBlockComment = true; j++; } 
        else if (char === '/' && nextChar === '/') { inComment = true; j++; } 
        else if (char === "'" || char === '"') { inString = true; stringChar = char; } 
        else if (char === '`') { inTemplate = true; } 
        else if (char === '{') { depth++; } 
        else if (char === '}') { depth--; }
    }
    inComment = false;
    if (depth > prevDepth) {
        console.log(`${i + 1}: depth increased to ${depth} | ${line.trim()}`);
    } else if (depth < prevDepth) {
        console.log(`${i + 1}: depth decreased to ${depth} | ${line.trim()}`);
    }
}
