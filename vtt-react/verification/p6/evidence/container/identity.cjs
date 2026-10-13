const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto');
const root = 'D:/VTT', output = __dirname;
const git = (...args) => cp.execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const phase = process.argv[2];
const files = git('ls-files', '--cached', '--others', '--exclude-standard', '-z').split('\0').filter(Boolean);
const hashes = Object.fromEntries(files.map(file => [file, hash(path.join(root, file))]));
function walk(directory, records, base) { for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
  const file = path.join(directory, entry.name); if (entry.isDirectory()) walk(file, records, base);
  else records[path.relative(base, file).replace(/\\/g, '/')] = hash(file);
} }
walk(root + '/vtt-react/verification', hashes, root);
const preserved = {}; walk('D:/AppData/Temp/opencode/p6-remaining-acceptance-20261012', preserved, 'D:/AppData/Temp/opencode/p6-remaining-acceptance-20261012');
const record = { date: new Date().toISOString(), checkout: git('rev-parse', '--show-toplevel'), branch: git('branch', '--show-current'), head: git('rev-parse', 'HEAD'), status: git('status', '--porcelain=v1', '--untracked-files=all'), hashes, preserved };
fs.writeFileSync(path.join(output, phase + '.json'), JSON.stringify(record, null, 2));
if (phase === 'before') {
  const prior = JSON.parse(fs.readFileSync('D:/AppData/Temp/opencode/p6-remaining-acceptance-20261012/after.json'));
  const focal = ['vtt-react/src/utils/characterShapeCodec.js', 'vtt-react/src/persistence/characterSaveOutcome.js', 'vtt-react/src/services/firebase/characterPersistenceService.js', 'vtt-react/verification/p6/remaining-browser.cjs', 'vtt-react/verification/p6/remaining-output.cjs'];
  for (const file of focal) require('assert/strict').equal(hashes[file], prior.hashes[file], file);
  console.log(JSON.stringify({ checkout: record.checkout, branch: record.branch, head: record.head, focal: Object.fromEntries(focal.map(file => [file, hashes[file]])), preservedFiles: Object.keys(preserved).length }, null, 2));
} else {
  const before = JSON.parse(fs.readFileSync(path.join(output, 'before.json')));
  require('assert/strict').deepEqual(preserved, before.preserved);
  const changed = Object.keys(before.hashes).filter(file => hashes[file] !== before.hashes[file]);
  const added = Object.keys(hashes).filter(file => !before.hashes[file]);
  const result = { headUnchanged: before.head === record.head, preservedEvidenceUnchanged: true, changed, added };
  fs.writeFileSync(path.join(output, 'integrity-summary.json'), JSON.stringify(result, null, 2)); console.log(JSON.stringify(result, null, 2));
}
