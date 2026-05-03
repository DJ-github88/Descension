const fs = require('fs');
const lines = fs.readFileSync('D:/VTT/vtt-react/src/data/classes/lichborneData.js', 'utf8').split('\n');

let depth = 0;
const checkLines = [306, 708, 878, 1744, 3600, 3654, 3655];
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    depth += opens - closes;
    if (checkLines.includes(i + 1)) {
        console.log(`Line ${i + 1}: Depth ${depth} | ${line.trim()}`);
    }
}
console.log(`Final depth: ${depth}`);
