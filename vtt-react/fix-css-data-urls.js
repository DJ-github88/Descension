const fs = require('fs');
const path = require('path');

// Simple replacement background for all problematic data URLs
const REPLACEMENT_BACKGROUND = 'linear-gradient(135deg, rgba(240, 230, 210, 0.95) 0%, rgba(230, 220, 200, 0.9) 50%, rgba(213, 203, 176, 0.85) 100%)';

// Function to recursively find all CSS files
function findCSSFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findCSSFiles(filePath, fileList);
    } else if (file.endsWith('.css')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to fix data URLs in a CSS file
function fixDataURLsInFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Pattern to match problematic data URLs (SVG and PNG)
  const dataURLPattern = /url\(['"]?data:image\/[^)]*\)/g;

  if (dataURLPattern.test(content)) {
    console.log(`  Found problematic data URLs in ${filePath}`);

    // Replace all data URLs with the simple background
    content = content.replace(dataURLPattern, REPLACEMENT_BACKGROUND);
    modified = true;
  }

  // Also fix any remaining unescaped data URLs
  const unescapedPattern = /background[^:]*:\s*url\(['"]?data:image\/[^)]*\)/g;
  if (unescapedPattern.test(content)) {
    console.log(`  Found unescaped data URLs in ${filePath}`);
    content = content.replace(unescapedPattern, `background: ${REPLACEMENT_BACKGROUND}`);
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  Fixed ${filePath}`);
  }
}

// Main execution
console.log('Starting CSS data URL fix...');

const srcDir = path.join(__dirname, 'src');
const cssFiles = findCSSFiles(srcDir);

console.log(`Found ${cssFiles.length} CSS files`);

cssFiles.forEach(fixDataURLsInFile);

console.log('CSS data URL fix completed!');
