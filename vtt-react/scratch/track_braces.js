const fs = require('fs');
const lines = fs.readFileSync('D:/VTT/vtt-react/src/data/classes/lichborneData.js', 'utf8').split('\n');

let depth = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    const prevDepth = depth;
    depth += opens - closes;
    if (opens > 0 || closes > 0) {
        // console.log(`${i + 1}: depth ${prevDepth} -> ${depth} | ${line.trim()}`);
    }
    if (depth < 0) {
        console.log(`ERROR: Negative depth at line ${i + 1}`);
        depth = 0;
    }
}
console.log(`Final depth: ${depth}`);
