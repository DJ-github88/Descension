// Simple script to fix FontAwesomeIcon issues
const fs = require('fs');
const path = require('path');

// Path to the file
const filePath = path.join('vtt-react', 'src', 'components', 'spellcrafting-wizard', 'components', 'common', 'LibraryStyleSpellCard.jsx');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Fix the syntax error first (remove the object literal that's not assigned to anything)
content = content.replace(/import { LIBRARY_SPELLS } from '\.\.\/\.\.\/\.\.\/\.\.\/data\/spellLibraryData';\s+'radiant_aegis':.+?},/s, 
  "import { LIBRARY_SPELLS } from '../../../../data/spellLibraryData';\n\n// Known spell IDs mapping\nconst KNOWN_SPELL_IDS = {\n  'radiant_aegis': { name: 'Radiant Aegis', description: 'Surrounds the target with a shield of radiant energy' },");

// Replace FontAwesomeIcon instances with direct component usage
content = content.replace(/<FontAwesomeIcon icon={faExpandAlt}/g, '<FaExpandAlt');
content = content.replace(/<FontAwesomeIcon icon={faLayerGroup}/g, '<FaLayerGroup');
content = content.replace(/<FontAwesomeIcon icon={faShieldAlt}/g, '<FaShieldAlt');
content = content.replace(/<FontAwesomeIcon icon={faTint}/g, '<FaTint');
content = content.replace(/<FontAwesomeIcon icon={faHourglass}/g, '<FaHourglass');

// Fix the complex FontAwesomeIcon instance
content = content.replace(/<FontAwesomeIcon\s*icon={(() => {/g, '<(() => {');

// Add the getResourceIconComponent function if it doesn't exist
if (!content.includes('getResourceIconComponent')) {
  const functionToAdd = `
  // Function to get the resource icon component
  const getResourceIconComponent = (type) => {
    switch (type) {
      case 'mana':
        return <FaTint style={{ color: '#3498db', marginRight: '6px' }} />;
      case 'energy':
        return <FaBolt style={{ color: '#f1c40f', marginRight: '6px' }} />;
      case 'rage':
        return <FaFire style={{ color: '#e74c3c', marginRight: '6px' }} />;
      case 'health':
        return <FaHeart style={{ color: '#e74c3c', marginRight: '6px' }} />;
      case 'uses':
        return <FaHourglass style={{ color: '#e67e22', marginRight: '6px' }} />;
      default:
        return <FaQuestionCircle style={{ color: '#95a5a6', marginRight: '6px' }} />;
    }
  };`;
  
  // Insert after getResourceIcon function
  content = content.replace(/const getResourceIcon[^;]+;/, match => match + functionToAdd);
}

// Replace getResourceIcon with getResourceIconComponent in the render
content = content.replace(/return getResourceIcon/g, 'return getResourceIconComponent');

// Write the file
fs.writeFileSync(filePath, content);

console.log('Fixed FontAwesomeIcon instances in', filePath);
