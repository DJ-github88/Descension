const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '../../..'), output = process.env.P7_PRESERVED_OUTPUT;
if (!output) throw Error('P7_PRESERVED_OUTPUT required');
const write = fs.writeFileSync, mkdir = fs.mkdirSync;
const redirect = filename => {
  if (typeof filename !== 'string') return filename;
  const normalized = path.resolve(filename).replace(/\\/g, '/');
  for (const prefix of ['vtt-react/verification/p6/evidence/', 'vtt-react/verification/p5-01/evidence/']) {
    const base = path.join(root, prefix).replace(/\\/g, '/');
    if (normalized.startsWith(base)) return path.join(output, normalized.slice(base.length));
  }
  return filename;
};
fs.writeFileSync = (file, ...args) => {const target = redirect(file); mkdir(path.dirname(target), { recursive: true }); return write(target, ...args);};
fs.mkdirSync = (file, ...args) => mkdir(redirect(file), ...args);
