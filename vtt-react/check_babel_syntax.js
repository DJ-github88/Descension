const fs = require('fs');
const parser = require('@babel/parser');

const code = fs.readFileSync('d:/VTT/vtt-react/src/data/classes/covenbaneData.js', 'utf8');

try {
    parser.parse(code, {
        sourceType: 'module',
        plugins: ['flow', 'jsx'] // Added flow and jsx because of the project type
    });
    console.log('SUCCESS: File is valid Babel code.');
} catch (e) {
    console.log('FAILURE:');
    console.log('Error:', e.message);
    console.log('Location:', e.loc);
    
    const lines = code.split('\n');
    const startLine = Math.max(0, e.loc.line - 5);
    const endLine = Math.min(lines.length, e.loc.line + 5);
    
    console.log('Context:');
    for (let i = startLine; i < endLine; i++) {
        const prefix = (i + 1) === e.loc.line ? '> ' : '  ';
        console.log(`${prefix}${i + 1} | ${lines[i]}`);
    }
}
