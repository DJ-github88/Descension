const fs = require('fs');
const path = require('path');
const originalWrite = fs.writeFileSync.bind(fs), originalMkdir = fs.mkdirSync.bind(fs);
const repoEvidence = 'D:/VTT/vtt-react/verification/p6/evidence';
const out = 'D:/AppData/Temp/opencode/p6-rereview-20261012';
function redirect(file) {
  if (typeof file !== 'string') return file;
  const p = path.resolve(file).replace(/\\/g, '/');
  if (p === repoEvidence + '/green.json') return out + '/green.json';
  if (p === repoEvidence + '/red' || p.startsWith(repoEvidence + '/red/')) return out + p.slice(repoEvidence.length);
  if (p.startsWith('D:/VTT/')) throw Error('Review refused repository write: ' + p);
  return file;
}
fs.writeFileSync = (file, ...args) => originalWrite(redirect(file), ...args);
fs.mkdirSync = (file, ...args) => originalMkdir(redirect(file), ...args);
