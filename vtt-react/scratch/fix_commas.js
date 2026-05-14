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
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Pattern: line not ending in comma/brace/bracket, followed by newline and optional whitespace + resolution: 'DICE'
    const regex = /([^,{[\s])(\r?\n\s+resolution: 'DICE')/g;
    
    if (regex.test(content)) {
        console.log(`Fixing ${filePath}...`);
        const newContent = content.replace(regex, '$1,$2');
        fs.writeFileSync(filePath, newContent);
    }
});
