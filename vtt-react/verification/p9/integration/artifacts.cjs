const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.resolve(__dirname, '../../../..'), base = path.join(root, 'vtt-react/verification/p9/evidence/integration-20261015/sol');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const files = [...walk(base), ...walk(__dirname), path.join(root, 'docs/MYTHRILL_P9_INTEGRATION_FOLLOWTHROUGH_20261015.md'), path.join(root, 'docs/ENGINEERING_STATE.md')];
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const artifacts = Object.fromEntries(files.filter(p => !p.endsWith('artifact-manifest.json')).map(p => [path.relative(root, p).replace(/\\/g, '/'), sha(p)]));
fs.writeFileSync(path.join(base, 'artifact-manifest.json'), JSON.stringify({ at: new Date().toISOString(), artifacts }, null, 2), { flag: 'wx' });
console.log(JSON.stringify({ artifacts: Object.keys(artifacts).length, manifestSha256: sha(path.join(base, 'artifact-manifest.json')), reportSha256: sha(path.join(root, 'docs/MYTHRILL_P9_INTEGRATION_FOLLOWTHROUGH_20261015.md')) }));
