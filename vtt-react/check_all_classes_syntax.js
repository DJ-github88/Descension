const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');

const classesDir = 'd:/VTT/vtt-react/src/data/classes';
const files = fs.readdirSync(classesDir).filter(f => f.endsWith('.js'));

let allValid = true;

files.forEach(file => {
    const filePath = path.join(classesDir, file);
    const code = fs.readFileSync(filePath, 'utf8');

    try {
        parser.parse(code, {
            sourceType: 'module',
            plugins: ['flow', 'jsx']
        });
        // console.log(`SUCCESS: ${file} is valid.`);
    } catch (e) {
        allValid = false;
        console.log(`FAILURE in ${file}:`);
        console.log('Error:', e.message);
        console.log('Location:', e.loc);
        
        const lines = code.split('\n');
        const startLine = Math.max(0, e.loc.line - 3);
        const endLine = Math.min(lines.length, e.loc.line + 3);
        
        console.log('Context:');
        for (let i = startLine; i < endLine; i++) {
            const prefix = (i + 1) === e.loc.line ? '> ' : '  ';
            console.log(`${prefix}${i + 1} | ${lines[i]}`);
        }
        console.log('-----------------------------------');
    }
});

if (allValid) {
    console.log('ALL CLASS DATA FILES ARE VALID.');
}
