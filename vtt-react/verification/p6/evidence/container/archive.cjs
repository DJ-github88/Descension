const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict'), zlib = require('zlib');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const root = 'D:/VTT', target = root + '/vtt-react/verification/p6/evidence/container';
const independent = 'D:/AppData/Temp/opencode/p6-remaining-acceptance-20261012';
const before = JSON.parse(fs.readFileSync(path.join(__dirname, 'before.json')));
function preserve(source, destination) {
  const bytes = fs.readFileSync(source); fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (fs.existsSync(destination)) assert.equal(hash(fs.readFileSync(destination)), hash(bytes), destination);
  else fs.writeFileSync(destination, bytes);
  assert.equal(hash(fs.readFileSync(destination)), hash(bytes)); return hash(bytes);
}
const originals = {};
for (const [file, expected] of Object.entries(before.preserved)) {
  const source = path.join(independent, file); assert.equal(hash(fs.readFileSync(source)), expected, file);
  originals[file] = preserve(source, path.join(target, 'independent-remaining-20261012', file));
}
preserve(independent + '/review.md', root + '/docs/MYTHRILL_P6_CONTAINER_INDEPENDENT_BLOCK_20261012.md');
fs.writeFileSync(path.join(target, 'independent-remaining-20261012/preserved-manifest.json'), JSON.stringify(originals, null, 2));
const green = JSON.parse(fs.readFileSync(path.join(__dirname, 'green.json')));
const red = JSON.parse(fs.readFileSync(path.join(__dirname, 'red.json')));
const drift = Object.keys(red.manifest).filter(file => red.manifest[file] !== green.manifest[file]);
assert.deepEqual(drift, ['utils/characterShapeCodec.js']);
assert.equal(green.result, 'GREEN'); assert.deepEqual(green.errors, []);
const checks = ['container-green', 'focused', 'retained-r1-r6', 'original-p6', 'original-p5', 'retained-supplemental', 'regressions', 'lint'];
for (const label of checks) assert.equal(JSON.parse(fs.readFileSync(path.join(__dirname, label + '.exit.json'))).status, 0, label);
const focal = ['vtt-react/src/utils/characterShapeCodec.js', 'vtt-react/verification/p6/container-browser.cjs'];
const hashes = Object.fromEntries(focal.map(file => [file, hash(fs.readFileSync(root + '/' + file))]));
const previousCodec = before.hashes[focal[0]];
const report = { checkout: 'D:/VTT', head: before.head, previousCodec, hashes, behavioralDependencyDrift: drift, preservedIndependentFiles: Object.keys(originals).length, originalSnapshotSha256: hash(fs.readFileSync(root + '/vtt-react/verification/p6/evidence/remaining/reviewed-source-complete.json.gz')), containerSnapshotSha256: hash(fs.readFileSync(path.join(__dirname, 'reviewed-source-complete.json.gz'))), checks };
fs.writeFileSync(path.join(__dirname, 'validation-summary.json'), JSON.stringify(report, null, 2));
const snapshot = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(__dirname, 'reviewed-source-complete.json.gz'))));
for (const [file, bytes] of Object.entries(snapshot.files)) assert.equal(hash(Buffer.from(bytes, 'base64')), snapshot.hashes[file], file);
// Archive only newly generated evidence; never run earlier finalizers/freeze.
for (const entry of fs.readdirSync(__dirname, { withFileTypes: true })) if (entry.isFile() && !['after.json', 'integrity-summary.json', 'serve.log'].includes(entry.name)) preserve(path.join(__dirname, entry.name), path.join(target, entry.name));
console.log(JSON.stringify(report, null, 2));
