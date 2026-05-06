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
// Also add ClassResourceBar.jsx
files.push('d:/VTT/vtt-react/src/components/hud/ClassResourceBar.jsx');

let modifiedCount = 0;

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    const pattern = /<div ref=\{tooltipRef\} className="([^"]*unified-resourcebar-tooltip[^"]*)"(?: style=\{\{([^}]*)\}\})?>/g;
    
    if (pattern.test(content)) {
        content = content.replace(
            pattern,
            (match, classNames, existingStyle) => {
                if (existingStyle) {
                    if (existingStyle.includes('opacity')) return match;
                    return `<div ref={tooltipRef} className="${classNames}" style={{ ${existingStyle}, opacity: 0 }}>`;
                }
                return `<div ref={tooltipRef} className="${classNames}" style={{ opacity: 0 }}>`;
            }
        );
        changed = true;
    }
    
    if (changed) {
        fs.writeFileSync(file, content);
        modifiedCount++;
        console.log('Modified: ' + file);
    }
});
console.log('Total files modified: ' + modifiedCount);
