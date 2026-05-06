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

            // Search for: tooltip.style.opacity = '0';
            const regex = /(const updatePosition\s*=\s*\(\)\s*=>\s*\{[\s\S]*?)((tooltip|tt|ttRef|tooltipElement)\.style\.opacity\s*=\s*['"]0['"];)/;
            const match = content.match(regex);
            
            if (match) {
                const prefix = match[1];
                const opacityLine = match[2];
                const varName = match[3];

                // Make sure we haven't already fixed it
                if (!content.substring(match.index, match.index + 500).includes(`${varName}.style.position = 'fixed'`)) {
                    const insertStr = `\n            ${varName}.style.position = 'fixed'; // FIXED: Prevent tooltip dimension stretching`;
                    const newContent = content.substring(0, match.index + prefix.length) + opacityLine + insertStr + content.substring(match.index + prefix.length + opacityLine.length);
                    content = newContent;
                    modified = true;
                    console.log('Fixed:', fullPath);
                }
            }

            if (modified) {
                fs.writeFileSync(fullPath, content);
            }
        }
    }
}

processDir(path.join(__dirname, 'src/data/classes'));
processDir(path.join(__dirname, 'src/components/hud'));
console.log('Done');
