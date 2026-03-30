/**
 * Script to generate comprehensive icon list from item-icon-mapping.json
 * Run this to generate an expanded wowIcons.js file with all available icons
 */

const fs = require('fs');
const path = require('path');

const mappingPath = path.join(__dirname, '../vtt-react/public/assets/icons/item-icon-mapping.json');
const outputPath = path.join(__dirname, '../vtt-react/src/components/item-generation/wowIcons-comprehensive.js');

// Read the mapping file
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// Organize icons by category
const organizedIcons = {};

mapping.items.forEach(item => {
  const pathParts = item.relative_path.split('/');
  const category = pathParts[0];
  const subcategory = pathParts[1] || 'other';
  
  if (!organizedIcons[category]) {
    organizedIcons[category] = {};
  }
  
  if (!organizedIcons[category][subcategory]) {
    organizedIcons[category][subcategory] = [];
  }
  
  // Convert filename to readable name
  const name = item.name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  organizedIcons[category][subcategory].push({
    id: item.full_path.replace('.png', ''),
    name: name
  });
});

// Generate the JavaScript file
let output = `// Comprehensive icon list generated from item-icon-mapping.json
// This file contains all ${mapping.items.length} available icons organized by category
// Generated: ${new Date().toISOString()}

export const WOW_ICONS_COMPREHENSIVE = {\n`;

// Sort categories
const categories = Object.keys(organizedIcons).sort();

categories.forEach(category => {
  const subcategories = Object.keys(organizedIcons[category]).sort();
  
  output += `    ${category.toLowerCase()}: {\n`;
  
  subcategories.forEach(subcategory => {
    const icons = organizedIcons[category][subcategory];
    const subcategoryKey = subcategory.toLowerCase().replace(/\s+/g, '_');
    
    output += `        ${subcategoryKey}: [\n`;
    icons.forEach(icon => {
      output += `            { id: '${icon.id}', name: '${icon.name.replace(/'/g, "\\'")}' },\n`;
    });
    output += `        ],\n`;
  });
  
  output += `    },\n`;
});

output += `};\n\n`;
output += `// Re-export for backward compatibility\n`;
output += `export const WOW_ICONS = WOW_ICONS_COMPREHENSIVE;\n`;

// Write the file
fs.writeFileSync(outputPath, output, 'utf8');

console.log(`Generated comprehensive icon list with ${mapping.items.length} icons`);
console.log(`Output written to: ${outputPath}`);

