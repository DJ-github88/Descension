const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto'), zlib = require('zlib');
const root = path.resolve(__dirname, '../../..'), out = path.join(__dirname, 'evidence/corrections-20261013');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const git = (...args) => cp.execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
const phase = process.argv[2] || 'before';
fs.mkdirSync(out, { recursive: true });
if (phase === 'before' && fs.existsSync(path.join(out, 'before.json'))) throw Error('Correction starting identity is immutable');
const files = git('ls-files', '--cached', '--others', '--exclude-standard', '-z').split('\0').filter(file => file && fs.existsSync(path.join(root, file)));
const hashes = Object.fromEntries(files.map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
const record = { date: new Date().toISOString(), checkout: git('rev-parse', '--show-toplevel'), head: git('rev-parse', 'HEAD'), branch: git('branch', '--show-current'), status: git('status', '--porcelain=v1', '--untracked-files=all'), hashes };
if (phase === 'before') {
  const independent = 'D:/AppData/Temp/opencode/p7-independent-20261013';
  const retained = path.join(__dirname, 'evidence/independent-block-20261013');
  fs.mkdirSync(retained, { recursive: true });
  const manifest = {};
  function copy(dir, rel = '') {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!rel && ['build', 'baseline', 'starting'].includes(item.name)) continue;
      const name = path.join(rel, item.name), from = path.join(dir, item.name), to = path.join(retained, name);
      if (item.isDirectory()) { fs.mkdirSync(to, { recursive: true }); copy(from, name); }
      else { const bytes = fs.readFileSync(from); fs.writeFileSync(to, bytes); manifest[name.replace(/\\/g, '/')] = hash(bytes); }
    }
  }
  copy(independent);
  fs.writeFileSync(path.join(retained, 'retention-manifest.json'), JSON.stringify({ source: independent, omittedGeneratedTrees: ['build', 'baseline', 'starting'], hashes: manifest }, null, 2));
  const focal = fs.readFileSync(path.join(retained, 'focal-hashes.md'), 'utf8');
  record.reviewedFocal = [...focal.matchAll(/\| `([^`]+)` \| `([a-f0-9]{64})` \| `([a-f0-9]{64})` \|/g)].map(([, file, before, reviewed]) => ({ file, before, reviewed, actual: hashes[file], matches: hashes[file] === reviewed }));
  const source = files.filter(file => /^(server\/(handlers|services|utils|tests)|vtt-react\/src)\//.test(file));
  fs.writeFileSync(path.join(out, 'reviewed-source.json.gz'), zlib.gzipSync(JSON.stringify({ hashes: Object.fromEntries(source.map(file => [file, hashes[file]])), files: Object.fromEntries(source.map(file => [file, fs.readFileSync(path.join(root, file)).toString('base64')])) })));
} else {
  const before = JSON.parse(fs.readFileSync(path.join(out, 'before.json')));
  record.changed = Object.keys(before.hashes).filter(file => hashes[file] !== before.hashes[file]);
  record.added = Object.keys(hashes).filter(file => !before.hashes[file]);
}
fs.writeFileSync(path.join(out, phase + '.json'), JSON.stringify(record, null, 2));
console.log(JSON.stringify({ phase, checkout: record.checkout, head: record.head, files: files.length, focal: record.reviewedFocal, changed: record.changed, added: record.added }, null, 2));
