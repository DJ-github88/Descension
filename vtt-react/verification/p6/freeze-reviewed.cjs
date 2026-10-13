/** One-time evidence capture; refuses any drift from the independent review. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cp = require('child_process');
const zlib = require('zlib');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '../../..');
const external = process.argv[2];
assert(external, 'Supply the independent evidence directory');
const reviewed = JSON.parse(fs.readFileSync(path.join(external, 'after.json')));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const changed = Object.entries(reviewed.hashes).filter(([file, expected]) => hash(fs.readFileSync(path.join(root, file))) !== expected);
assert.deepEqual(changed, [], 'Reviewed source drift: investigate before freezing');
const head = cp.execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
assert.equal(head, reviewed.head);
const evidence = path.join(__dirname, 'evidence/independent-20261012');
fs.mkdirSync(evidence, { recursive: true });
for (const name of ['review.md', 'reviewed-hashes.md', 'before.json', 'interim.json', 'after.json', 'supplemental.cjs', 'supplemental-results.json', 'supplemental.log', 'evidence-summary.json', 'regressions.log', 'lint.log', 'p5-browser.log', 'p6-browser.log', 'build.config.cjs', 'build-retry.log', 'build-retry.exit', 'build.log', 'build.exit']) {
  fs.copyFileSync(path.join(external, name), path.join(evidence, name));
}
fs.copyFileSync(path.join(external, 'review.md'), path.join(root, 'docs/MYTHRILL_P6_INDEPENDENT_BLOCK_20261012.md'));
const manifest = JSON.parse(fs.readFileSync(path.join(external, 'supplemental-results.json'))).manifest;
const files = [...Object.keys(manifest).map(p => `vtt-react/src/${p}`), 'vtt-react/src/config/firebase.js', 'vtt-react/src/components/character-sheet/character-save-status.css', 'vtt-react/verification/p6/character-save-browser.cjs'];
const snapshot = Object.fromEntries(files.map(file => [file, fs.readFileSync(path.join(root, file)).toString('base64')]));
const destination = path.join(__dirname, 'evidence/reviewed-source.json.gz');
assert(!fs.existsSync(destination), 'Never replace the frozen source');
fs.writeFileSync(destination, zlib.gzipSync(JSON.stringify(snapshot)));
const result = { head, reviewedFiles: Object.keys(reviewed.hashes).length, changedSinceReview: changed, snapshotFiles: files.length,
  snapshotSha256: hash(fs.readFileSync(destination)), status: cp.execFileSync('git', ['status', '--porcelain=v1', '--untracked-files=all'], { cwd: root, encoding: 'utf8' }) };
fs.writeFileSync(path.join(__dirname, 'evidence/pre-correction-identity.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
