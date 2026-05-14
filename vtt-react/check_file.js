const fs = require('fs');
try {
    const content = fs.readFileSync('d:/VTT/vtt-react/src/data/classes/covenbaneData.js', 'utf8');
    // We can't use eval or require because it's ESM.
    // But we can check if it's valid ESM using the 'vm' module or just 'node --check' (which I tried).
    console.log('File length:', content.length);
    console.log('Line count:', content.split('\n').length);
} catch (e) {
    console.error(e);
}
