// Check bladedancer spells
const fs = require('fs');
const path = require('path');

try {
  const content = fs.readFileSync(path.join(__dirname, 'vtt-react/src/data/classes/bladedancerData.js'), 'utf8');
  console.log('File loaded successfully');

  // Extract the spells array
  const spellsMatch = content.match(/spells:\s*\[([\s\S]*?)\]/);
  if (spellsMatch) {
    console.log('Found spells array');
    const spellsText = spellsMatch[1];
    const spellMatches = spellsText.match(/\{[^}]*level:\s*(\d+)[^}]*\}/g);

    if (spellMatches) {
      console.log(`Found ${spellMatches.length} spells`);
      const byLevel = {};
      spellMatches.forEach(match => {
        const levelMatch = match.match(/level:\s*(\d+)/);
        if (levelMatch) {
          const level = levelMatch[1];
          if (!byLevel[level]) byLevel[level] = 0;
          byLevel[level]++;
        }
      });

      Object.keys(byLevel).sort((a,b) => parseInt(a)-parseInt(b)).forEach(level => {
        console.log(`Level ${level}: ${byLevel[level]} spells`);
      });
    } else {
      console.log('No individual spells found');
    }
  } else {
    console.log('No spells array found');
  }
} catch(e) {
  console.error('Error:', e.message);
}
