const fs = require('fs');
const path = require('path');

// Function to find all CSS files and check for problematic patterns
function findProblematicCSS() {
  const srcDir = path.join(__dirname, 'src');
  const cssFiles = [];
  
  function findCSSFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findCSSFiles(filePath);
      } else if (file.endsWith('.css')) {
        cssFiles.push(filePath);
      }
    });
  }
  
  findCSSFiles(srcDir);
  
  console.log(`Found ${cssFiles.length} CSS files`);
  
  // Patterns that might cause CSS minimizer issues
  const problematicPatterns = [
    /\/\*/g,  // CSS comments with forward slashes
    /url\([^)]*\/[^)]*\)/g,  // URLs with forward slashes
    /calc\([^)]*\/[^)]*\)/g,  // calc() with division
    /data:[^)]*\/[^)]*/g,  // data URLs with forward slashes
    /\/(?![*])/g,  // Forward slashes not in comments
  ];
  
  cssFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(__dirname, filePath);
    
    problematicPatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        console.log(`\nFile: ${relativePath}`);
        console.log(`Pattern ${index + 1} matches:`, matches.slice(0, 3)); // Show first 3 matches
        
        // Show the lines where matches occur
        const lines = content.split('\n');
        lines.forEach((line, lineIndex) => {
          if (pattern.test(line)) {
            console.log(`  Line ${lineIndex + 1}: ${line.trim()}`);
          }
        });
      }
    });
  });
}

findProblematicCSS();
