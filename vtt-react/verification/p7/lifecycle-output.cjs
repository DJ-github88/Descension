// Output-only custody: tests may publish evidence, never overwrite older files.
require('./preload.cjs');
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '../../..');
const out = process.env.P7_LIFECYCLE_COMMAND_OUT;
if (!out) throw Error('P7_LIFECYCLE_COMMAND_OUT is required');
const mkdir = fs.mkdirSync.bind(fs);
const destination = file => {
  if (typeof file !== 'string') return file;
  const full = path.resolve(file);
  if (full.toLowerCase().startsWith(path.join(root, 'vtt-react/verification/p7/evidence').toLowerCase()) || full.toLowerCase().startsWith(path.join(root, 'server/logs').toLowerCase())) {
    const target = path.join(out, 'redirected', path.relative(root, full)); mkdir(path.dirname(target), { recursive: true }); return target;
  }
  return file;
};
for (const name of ['writeFileSync', 'appendFileSync', 'writeFile', 'appendFile', 'createWriteStream']) {
  const original = fs[name].bind(fs); fs[name] = (file, ...args) => original(destination(file), ...args);
}
