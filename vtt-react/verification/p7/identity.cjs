const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const crypto = require('crypto');
const zlib = require('zlib');
const root = path.resolve(__dirname, '../../..');
const out = path.join(__dirname, 'evidence');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const git = (...args) => cp.execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
const files = git('ls-files', '--cached', '--others', '--exclude-standard', '-z').split('\0').filter(Boolean);
const hashes = Object.fromEntries(files.filter(file => fs.existsSync(path.join(root, file))).map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
const phase = process.argv[2] || 'before';
fs.mkdirSync(out, { recursive: true });
const record = { date: new Date().toISOString(), checkout: git('rev-parse', '--show-toplevel'), branch: git('branch', '--show-current'), head: git('rev-parse', 'HEAD'), status: git('status', '--porcelain=v1', '--untracked-files=all'), hashes };
if (phase === 'before') {
  if (fs.existsSync(path.join(out, 'before.json'))) throw new Error('Starting identity is immutable');
  const accepted = JSON.parse(fs.readFileSync(path.join(root, 'vtt-react/verification/p6/evidence/independent-container-acceptance-20261012/after.json')));
  const drift = Object.keys(accepted.hashes).filter(file => hashes[file] !== accepted.hashes[file]);
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'vtt-react/verification/p6/evidence/independent-container-acceptance-20261012/green.json'))).manifest;
  const behavioralDrift = Object.keys(manifest).filter(file => hashes['vtt-react/src/' + file] !== manifest[file]);
  if (behavioralDrift.length) throw new Error('Accepted P6 behavioral dependency drift: ' + behavioralDrift.join(','));
  record.p6 = { compared: Object.keys(accepted.hashes).length, drift, behavioralDependencies: Object.keys(manifest).length, behavioralDrift };
  const source = files.filter(file => /^(server\/(handlers|services|utils|tests)|vtt-react\/src)\//.test(file));
  fs.writeFileSync(path.join(out, 'starting-source.json.gz'), zlib.gzipSync(JSON.stringify({ hashes: Object.fromEntries(source.map(file => [file, hashes[file]])), files: Object.fromEntries(source.map(file => [file, fs.readFileSync(path.join(root, file)).toString('base64')])) })));
} else {
  const before = JSON.parse(fs.readFileSync(path.join(out, 'before.json')));
  record.changed = Object.keys(before.hashes).filter(file => hashes[file] !== before.hashes[file]);
  record.added = Object.keys(hashes).filter(file => !before.hashes[file]);
}
fs.writeFileSync(path.join(out, phase + '.json'), JSON.stringify(record, null, 2));
console.log(JSON.stringify({ phase, checkout: record.checkout, head: record.head, files: files.length, p6: record.p6, changed: record.changed, added: record.added }, null, 2));
