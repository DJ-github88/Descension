const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const root = 'D:/VTT', evidence = root + '/vtt-react/verification/p6/evidence/container';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = name => JSON.parse(fs.readFileSync(path.join(__dirname, name)));
const before = read('before.json'), after = read('after.json'), green = read('green.json');
assert.equal(after.head, before.head); assert.deepEqual(after.preserved, before.preserved);
for (const [file, expected] of Object.entries(before.hashes)) if (file.startsWith('vtt-react/verification/')) assert.equal(after.hashes[file], expected, 'Preserved repository evidence ' + file);
for (const name of ['imported', 'failed', 'recovered', 'healed']) assert.deepEqual(green.controls[name].items, green.controls.input.runtime.inventory.items, 'Live inventory ' + name);
const files = ['vtt-react/src/utils/characterShapeCodec.js', 'vtt-react/verification/p6/container-browser.cjs', 'docs/MYTHRILL_P6_CONTAINER_COMPATIBILITY_CORRECTION_20261012.md', 'docs/MYTHRILL_P6_CONTAINER_INDEPENDENT_BLOCK_20261012.md'];
const hashes = Object.fromEntries(files.map(file => [file, hash(fs.readFileSync(root + '/' + file))]));
const changed = Object.keys(before.hashes).filter(file => before.hashes[file] !== after.hashes[file]);
const concurrent = changed.filter(file => !files.includes(file));
const summary = { headUnchanged: true, preservedExternalEvidenceUnchanged: true, preservedRepositoryEvidenceUnchanged: true, taskFiles: files.map(file => ({ file, before: before.hashes[file] || null, after: hashes[file] })), concurrentChanges: concurrent, newEvidenceDirectory: 'vtt-react/verification/p6/evidence/container', liveInventoryChecks: 'imported/failed/recovered/healed exact' };
fs.writeFileSync(path.join(__dirname, 'file-changes.json'), JSON.stringify(summary, null, 2));
fs.writeFileSync(path.join(__dirname, 'source-hashes.md'), '# Container correction SHA256 identity\n\n' + files.map(file => '- `' + file + '`: `' + hashes[file] + '`').join('\n') + '\n');
for (const file of ['after.json', 'integrity-summary.json', 'file-changes.json', 'source-hashes.md', 'finish.cjs']) {
  const destination = path.join(evidence, file); assert(!fs.existsSync(destination), 'Never overwrite final identity'); fs.writeFileSync(destination, fs.readFileSync(path.join(__dirname, file)));
}
const artifactHashes = {};
function walk(directory) { for (const entry of fs.readdirSync(directory, { withFileTypes: true })) { const file = path.join(directory, entry.name); if (entry.isDirectory()) walk(file); else artifactHashes[path.relative(evidence, file).replace(/\\/g, '/')] = hash(fs.readFileSync(file)); } }
walk(evidence); fs.writeFileSync(path.join(evidence, 'artifact-manifest.json'), JSON.stringify(artifactHashes, null, 2));
console.log(JSON.stringify({ ...summary, hashes, archivedArtifacts: Object.keys(artifactHashes).length }, null, 2));
