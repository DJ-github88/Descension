const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walkDir('d:/VTT/vtt-react/src/data/classes');
let modifiedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    // We check for updatePosition logic that does not yet have opacity='0'
    if (content.includes('const updatePosition = () => {') && !content.includes("tooltip.style.opacity = '0'")) {
        content = content.replace(
            /(const updatePosition = \(\) => \{\s*const tooltip = tooltipRef\.current;\s*const bar = barRef\.current;\s*if \(!tooltip \|\| !bar\) return;)/,
            "$1\n            tooltip.style.opacity = '0';"
        );
        changed = true;
    }
    
    if (changed && !content.includes("tooltip.style.opacity = '1'")) {
        content = content.replace(
            /(tooltip\.style\.zIndex = '2147483647';)/,
            "$1\n            tooltip.style.opacity = '1';"
        );
    }
    
    if (changed) {
        fs.writeFileSync(file, content);
        modifiedCount++;
        console.log('Modified: ' + file);
    }
});
console.log('Total files modified: ' + modifiedCount);
