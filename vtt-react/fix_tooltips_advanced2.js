const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Find updatePosition function
            const updatePosRegex = /const updatePosition\s*=\s*\(\)\s*=>\s*\{([\s\S]*?)(?:requestAnimationFrame\(()=>\{)?requestAnimationFrame\(updatePosition\)/g;
            
            // We don't want to use a massive regex because there might be multiple updatePositions or it might not match well.
            // Let's just find "const updatePosition" and insert the fix right before the first getBoundingClientRect() that has 'tooltip' or 'tt' in the name.
            
            let newContent = content.replace(/(const updatePosition\s*=\s*\(\)\s*=>\s*\{[\s\S]*?)(const\s+(tooltipRect|ttRect|rect)\s*=\s*(tooltip|tt|tooltipRef\.current|ttRef\.current)\.getBoundingClientRect\(\);)/g, (match, prefix, rectLine, rectVar, ttVar) => {
                if (!prefix.includes('.style.position = \'fixed\'') && !prefix.includes('.style.position="fixed"')) {
                    modified = true;
                    return `${prefix}\n            ${ttVar}.style.position = 'fixed'; // FIXED: Prevent tooltip dimension stretching\n            ${rectLine}`;
                }
                return match;
            });

            // What if getBoundingClientRect isn't for tooltip first?
            // "const tooltipRect = tooltip.getBoundingClientRect();"
            
            if (!modified) {
                 // Try another pattern if the above didn't catch it
                 // maybe it's const barRect = bar.getBoundingClientRect(); first
                 let tempContent = content.replace(/(const updatePosition\s*=\s*\(\)\s*=>\s*\{[\s\S]*?)(const\s+[a-zA-Z0-9_]+\s*=\s*[a-zA-Z0-9_]+\.getBoundingClientRect\(\);)/g, (match, prefix, rectLine) => {
                     // We need to identify the tooltip variable.
                     let ttVarMatch = prefix.match(/const\s+(tooltip|tt)\s*=/);
                     if (ttVarMatch) {
                         let ttVar = ttVarMatch[1];
                         if (!prefix.includes('.style.position = \'fixed\'') && !prefix.includes('.style.position="fixed"')) {
                            modified = true;
                            return `${prefix}\n            ${ttVar}.style.position = 'fixed'; // FIXED: Prevent tooltip dimension stretching\n            ${rectLine}`;
                         }
                     }
                     return match;
                 });
                 if (modified) newContent = tempContent;
            }

            if (modified) {
                fs.writeFileSync(fullPath, newContent);
                console.log('Fixed:', fullPath);
            }
        }
    }
}

processDir(path.join(__dirname, 'src/data/classes'));
processDir(path.join(__dirname, 'src/components/hud'));
console.log('Done');
