const fs = require('fs');
const path = require('path');
const root = 'D:/VTT/vtt-react/verification/p6/evidence';
const redirects = new Map([
  [root + '/remaining/red.json', 'red.json'],
  [root + '/remaining/green.json', 'green.json'],
  [root + '/green.json', 'accepted-r1-r6-green.json'],
  [root + '/remaining/accepted-r1-r6-green.json', 'accepted-r1-r6-green.json'],
  [root + '/remaining/retained-controls.json', 'retained-controls.json'],
  [root + '/remaining/retained-controls-partial.json', 'retained-controls-partial.json']
].map(([from, to]) => [path.resolve(from), path.join(__dirname, to)]));
const write = fs.writeFileSync.bind(fs);
fs.writeFileSync = (file, ...args) => {
  const resolved = typeof file === 'string' ? path.resolve(file) : null;
  const destination = redirects.get(resolved);
  if (resolved && resolved.toLowerCase().startsWith('d:\\vtt\\') && !destination) {
    throw new Error('Read-only review refused repository write: ' + resolved);
  }
  return write(destination || file, ...args);
};
