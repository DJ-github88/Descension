const fs = require('fs');
const path = require('path');

const baseDir = 'src/data/classes';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('Data.js')) results.push(file);
        }
    });
    return results;
}

const files = walk(baseDir);

files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("resolution: 'DICE'")) {
            if (i > 0) {
                const prevLine = lines[i-1].trim();
                if (prevLine && !prevLine.endsWith(',') && !prevLine.endsWith('{') && !prevLine.endsWith('[')) {
                    console.log(`STILL MISSING COMMA: ${filePath}:${i+1}`);
                    console.log(`  Prev: ${lines[i-1]}`);
                    console.log(`  Curr: ${lines[i]}`);
                }
            }
        }
    }
});
