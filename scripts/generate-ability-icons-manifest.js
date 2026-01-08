/**
 * Script to generate ability icons manifest from the abilities folder
 * This creates a manifest.json file that lists all available ability icons
 */

const fs = require('fs');
const path = require('path');

const abilitiesPath = path.join(__dirname, '../vtt-react/public/assets/icons/abilities');
const manifestPath = path.join(abilitiesPath, 'manifest.json');

const subfolders = ['combat', 'defensive', 'magic', 'movement', 'social', 'utility'];

function scanAbilitiesFolder() {
  const icons = [];

  subfolders.forEach(folder => {
    const folderPath = path.join(abilitiesPath, folder);
    
    if (!fs.existsSync(folderPath)) {
      console.log(`Warning: Folder ${folder} does not exist`);
      return;
    }

    const files = fs.readdirSync(folderPath);
    
    files.forEach(file => {
      if (file.endsWith('.png')) {
        const iconName = file.replace('.png', '');
        const iconPath = `${folder}/${iconName}`;
        
        // Create a readable name from the filename
        const readableName = iconName
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        icons.push({
          id: iconPath,
          name: readableName,
          folder: folder,
          path: iconPath
        });
      }
    });
  });

  return icons;
}

// Generate manifest
console.log('Scanning ability icons...');
const icons = scanAbilitiesFolder();
console.log(`Found ${icons.length} ability icons`);

const manifest = {
  version: '1.0.0',
  generated: new Date().toISOString(),
  totalIcons: icons.length,
  icons: icons.sort((a, b) => {
    // Sort by folder first, then by name
    if (a.folder !== b.folder) {
      return a.folder.localeCompare(b.folder);
    }
    return a.name.localeCompare(b.name);
  })
};

// Write manifest file
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`✓ Manifest written to ${manifestPath}`);
console.log(`  - Total icons: ${manifest.totalIcons}`);
console.log(`  - Folders: ${subfolders.join(', ')}`);

