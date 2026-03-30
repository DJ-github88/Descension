/**
 * Generate Status Icons Manifest
 * Scans the Status directory and generates manifest.json files for each subdirectory
 */

const fs = require('fs');
const path = require('path');

const STATUS_DIR = path.join(__dirname, '../vtt-react/public/assets/icons/Status');

// Function to generate readable name from filename
function generateIconName(filename) {
  return filename
    .replace('.png', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Function to scan a directory and generate manifest
function generateManifestForDirectory(dirPath, dirName) {
  const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.png'));
  
  const icons = files.map(filename => ({
    filename: filename,
    name: generateIconName(filename),
    path: `${dirName}/${filename}`
  }));
  
  const manifest = {
    category: dirName,
    count: icons.length,
    icons: icons.sort((a, b) => a.name.localeCompare(b.name))
  };
  
  const manifestPath = path.join(dirPath, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log(`✓ Generated manifest for ${dirName}: ${icons.length} icons`);
  return manifest;
}

// Main function
function generateAllManifests() {
  console.log('Generating Status Icons Manifests...\n');
  
  if (!fs.existsSync(STATUS_DIR)) {
    console.error(`Error: Status directory not found at ${STATUS_DIR}`);
    process.exit(1);
  }
  
  const subdirs = fs.readdirSync(STATUS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  const allManifests = {};
  let totalIcons = 0;
  
  subdirs.forEach(dirName => {
    const dirPath = path.join(STATUS_DIR, dirName);
    const manifest = generateManifestForDirectory(dirPath, dirName);
    allManifests[dirName] = manifest;
    totalIcons += manifest.count;
  });
  
  // Generate master manifest
  const masterManifest = {
    generated: new Date().toISOString(),
    totalCategories: subdirs.length,
    totalIcons: totalIcons,
    categories: allManifests
  };
  
  const masterManifestPath = path.join(STATUS_DIR, 'manifest.json');
  fs.writeFileSync(masterManifestPath, JSON.stringify(masterManifest, null, 2));
  
  console.log(`\n✓ Generated master manifest: ${totalIcons} total icons across ${subdirs.length} categories`);
  console.log(`\nManifests saved to: ${STATUS_DIR}`);
}

// Run if called directly
if (require.main === module) {
  generateAllManifests();
}

module.exports = { generateAllManifests, generateManifestForDirectory };

