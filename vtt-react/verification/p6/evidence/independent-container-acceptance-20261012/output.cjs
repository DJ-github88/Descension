const fs = require('fs'), path = require('path');
const write = fs.writeFileSync.bind(fs), mkdir = fs.mkdirSync.bind(fs);
const repo = 'D:/VTT/', evidence = repo + 'vtt-react/verification/p6/evidence/';
const absolute = file => typeof file === 'string' ? path.resolve(file).replace(/\\/g, '/') : '';
fs.writeFileSync = (file, ...args) => {
  const location = absolute(file);
  if (location.startsWith(evidence)) {
    const output = path.join(__dirname, location.slice(evidence.length).replace(/[\\/]/g, '-'));
    return write(output, ...args);
  }
  if (location.startsWith(repo)) throw Error('Read-only review refused repository write: ' + location);
  return write(file, ...args);
};
fs.mkdirSync = (file, ...args) => {
  const location = absolute(file);
  if (location.startsWith(repo)) {
    if (!fs.existsSync(file)) throw Error('Read-only review refused repository mkdir: ' + location);
    return;
  }
  return mkdir(file, ...args);
};
