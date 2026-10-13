/** Read-only source identity/manifest checks; writes evidence artifacts only. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cp = require('child_process');
const zlib = require('zlib');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '../../..');
const evidence = path.join(__dirname, 'evidence');
const git = (...args) => cp.execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim();
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const reviewed = JSON.parse(fs.readFileSync(path.join(evidence, 'independent-20261012/after.json')));
const originalSupplement = JSON.parse(fs.readFileSync(path.join(evidence, 'independent-20261012/supplemental-results.json')));
const red = JSON.parse(fs.readFileSync(path.join(evidence, 'red/supplemental-results.json')));
const green = JSON.parse(fs.readFileSync(path.join(evidence, 'green.json')));
assert.deepEqual(red.manifest, originalSupplement.manifest, 'RED must identify the exact reviewed module bytes');
assert.equal(red.result.filter(item => item.evidence.reproduced).length, 6);
assert.equal(hash(fs.readFileSync(path.join(root, 'docs/MYTHRILL_P6_INDEPENDENT_BLOCK_20261012.md'))),
  hash(fs.readFileSync(path.join(evidence, 'independent-20261012/review.md'))));
const independentSummary = JSON.parse(fs.readFileSync(path.join(evidence, 'independent-20261012/evidence-summary.json')));
for (const artifact of independentSummary.artifacts) {
  assert.equal(hash(fs.readFileSync(path.join(evidence, 'independent-20261012', artifact.path))), artifact.sha256,
    `Preserved independent artifact changed: ${artifact.path}`);
}
assert.equal(green.results.length, 14, 'A filtered run is not final evidence');
assert(green.results.every(item => item.result === 'GREEN' && item.errors.length === 0));
for (const [file, expected] of Object.entries(green.manifest)) {
  assert.equal(hash(fs.readFileSync(path.join(root, 'vtt-react/src', file))), expected, `Source changed after GREEN: ${file}`);
}
for (const file of ['docs/MYTHRILL_P5_01_INDEPENDENT_ACCEPTANCE_20261012.md', 'vtt-react/src/components/rules/ClassCodex.css',
  'vtt-react/verification/p5-01/character-browser-harness.cjs', 'vtt-react/verification/p5-01/character-preservation-browser.cjs']) {
  assert.equal(hash(fs.readFileSync(path.join(root, file))), reviewed.hashes[file], `Preserved evidence/style changed: ${file}`);
}
// PowerShell 5.1 native redirection is UTF-16. Keep the original bytes as .raw
// and make the generated evidence readable without rerunning the checks.
for (const name of ['regressions.txt', 'corrections-browser.txt', 'p6-browser.txt', 'p5-browser.txt', 'lint.txt']) {
  const file = path.join(evidence, name), bytes = fs.readFileSync(file);
  if (bytes[0] === 255 && bytes[1] === 254) {
    if (!fs.existsSync(`${file}.raw`)) fs.copyFileSync(file, `${file}.raw`);
    fs.writeFileSync(file, bytes.subarray(2).toString('utf16le'));
  }
}
for (const [name, content] of [['p6-browser.txt', 'PASS'], ['p5-browser.txt', 'GREEN'], ['regressions.txt', '134 passed']]) {
  assert(fs.readFileSync(path.join(evidence, name), 'utf8').includes(content), `Missing success evidence: ${name}`);
}
const buildLog = 'D:/AppData/Temp/opencode/p6-corrections-build.log';
const buildExit = 'D:/AppData/Temp/opencode/p6-corrections-build.exit';
const sourceOnly = process.argv.includes('--source-only');
if (!sourceOnly) {
  assert.equal(fs.readFileSync(buildExit, 'utf8').trim(), '0');
  assert(fs.readFileSync(buildLog, 'utf8').includes('Compiled successfully'));
  fs.copyFileSync(buildLog, path.join(evidence, 'build.txt'));
  fs.copyFileSync(buildExit, path.join(evidence, 'build.exit'));
}
const finalHashes = Object.fromEntries(Object.keys(reviewed.hashes).map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
const delta = Object.keys(reviewed.hashes).filter(file => finalHashes[file] !== reviewed.hashes[file]);
const focal = Object.keys(green.manifest).map(file => `vtt-react/src/${file}`).filter(file => delta.includes(file));
focal.push('vtt-react/src/utils/characterShapeCodec.js', 'vtt-react/src/persistence/__tests__/p6CharacterSave.production.test.jsx');
const rows = [...new Set(focal)].map(file => `| \`${file}\` | \`${reviewed.hashes[file] || 'new'}\` | \`${hash(fs.readFileSync(path.join(root, file)))}\` |`);
const result = { date: new Date().toISOString(), head: git('rev-parse', 'HEAD'), checkout: git('rev-parse', '--show-toplevel'),
  status: git('status', '--porcelain=v1', '--untracked-files=all'), reviewedFiles: Object.keys(reviewed.hashes).length,
  changedReviewedFiles: delta, finalHashes, greenManifestVerified: true, redReviewedManifestVerified: true,
  verificationHashes: Object.fromEntries(['regressions-browser.cjs', 'freeze-reviewed.cjs', 'finalize-evidence.cjs', 'character-save-browser.cjs'].map(file => [file, hash(fs.readFileSync(path.join(__dirname, file)))])),
  evidenceHashes: Object.fromEntries(['green.json', 'red/supplemental-results.json', 'reviewed-source.json.gz', 'regressions.txt', 'corrections-browser.txt', 'p6-browser.txt', 'p5-browser.txt', 'lint.txt', ...(!sourceOnly ? ['build.txt'] : [])].map(file => [file, hash(fs.readFileSync(path.join(evidence, file)))])) };
fs.writeFileSync(path.join(evidence, sourceOnly ? 'source-identity.json' : 'final-identity.json'), JSON.stringify(result, null, 2));
fs.writeFileSync(path.join(evidence, 'source-hashes.md'), '# Reviewed → corrected source identity\n\nActual HEAD: `' + result.head + '`. Initial review comparison: 2,347/2,347 hashes identical.\n\n| Path | Reviewed SHA256 | Corrected SHA256 |\n|---|---|---|\n' + rows.join('\n') + '\n\nAll changed reviewed paths (includes concurrent user styling and evidence ledgers):\n\n' + delta.map(file => `- \`${file}\``).join('\n') + '\n');
// Correction-only diffs are from frozen reviewed source, not from HEAD's older
// P5 baseline. Never reset, checkout or modify a production file for the diff.
const snapshot = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(evidence, 'reviewed-source.json.gz'))));
const temporary = fs.mkdtempSync('D:/AppData/Temp/opencode/p6-diff-');
const diff = [];
for (const file of focal) {
  if (!snapshot[file]) continue;
  const original = path.join(temporary, file); fs.mkdirSync(path.dirname(original), { recursive: true });
  fs.writeFileSync(original, Buffer.from(snapshot[file], 'base64'));
  const compared = cp.spawnSync('git', ['diff', '--no-index', '--', original, path.join(root, file)], { encoding: 'utf8' });
  assert(compared.status === 0 || compared.status === 1);
  diff.push(compared.stdout);
}
fs.writeFileSync(path.join(evidence, 'correction-only.patch'), diff.join('\n'));
console.log(JSON.stringify({ head: result.head, changedReviewedFiles: delta, redFailures: 6, greenScenarios: green.results.length, focal }, null, 2));
