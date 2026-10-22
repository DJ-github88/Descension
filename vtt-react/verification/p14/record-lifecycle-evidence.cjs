// Verify C4 source/review/build/App identities; bulky evidence stays outside Git.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict'), cp = require('child_process');
const root = path.resolve(__dirname, '../../..'), temp = 'D:/AppData/Temp/opencode';
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex'), sha = file => digest(fs.readFileSync(file));
const reviewFile = path.join(temp, 'p14c4-review1/source-hashes-and-results-repaired.json'), review = JSON.parse(fs.readFileSync(reviewFile));
const reviewed = Object.entries(review.after).filter(([file]) => !file.startsWith('docs/')).map(([file, expected]) => ({ file, expected, current: sha(path.join(root, file)) }));
assert.deepEqual(reviewed.filter(e => e.expected !== e.current), [], 'reviewed C4 code drift');
const runtime = reviewed.filter(e => !/\.test\./.test(e.file)), client = runtime.filter(e => e.file.startsWith('vtt-react/'));
const buildFile = path.join(temp, 'p14c4-build2/build.json'), build = JSON.parse(fs.readFileSync(buildFile)); assert.equal(build.exit, 0);
// Concurrent commits made some inputs clean before Build2. Its dirty-input manifest is supplemented
// by the recorded build HEAD for those unchanged tracked files, not silently treated as missing evidence.
const inputIdentity = client.map(e => {
  const recorded = build.before[e.file];
  const built = recorded || digest(cp.execFileSync('git', ['show', `${build.head}:${e.file}`], { cwd: root, maxBuffer: 8 * 1024 * 1024 }));
  const lineEndingEquivalent = !recorded && built !== e.current && digest(Buffer.from(fs.readFileSync(path.join(root, e.file), 'utf8').replace(/\r\n/g, '\n'))) === built;
  return { file: e.file, expected: e.current, built, output: build.after[e.file] || built, lineEndingEquivalent,
    basis: recorded ? 'recorded before/after input' : `committed build HEAD ${build.head}${lineEndingEquivalent ? '; working CRLF matches committed LF after newline normalization' : ''}` };
});
assert.deepEqual(inputIdentity.filter(e => !e.lineEndingEquivalent && (e.expected !== e.built || e.expected !== e.output)), [], 'C4 build identity mismatch');
const appFile = path.join(temp, 'p14c4-app4/result.json'), app = JSON.parse(fs.readFileSync(appFile)); assert.equal(app.passed, true);
const protectedExpected = {
  'server/services/authoredSpellDefinitions.js': '48b69255b8958ae75a7aa17ed7aa67c95b6d4c2bada63f4dcd24a305e20f0003',
  'vtt-react/src/components/spellcrafting-wizard/components/steps/Step5Resources.jsx': '6120e2b6d7af6ecf8c4692a2d13626dcc6fac036e4345500e8a19fe0b5b37431',
  'vtt-react/src/components/spellcrafting-wizard/core/mechanics/resourceManager.js': 'ea27eb2c0bb6cfadd229c5407c652d0d44c67593a36d1f890c114ca3c28b4605',
  'vtt-react/src/components/spellcrafting-wizard/core/utils/spellSerializer.js': 'b960862958d5752e06dbbcde7390b6243ea6bb01642ef97a7a364b7bf5dfaa5f',
  'vtt-react/src/data/universalCombatSpells.js': '89bebadaa3b079de5c22ad2bebc823ab3f1bad87a0e35b1d6b245ee6c2802fab'
};
const protectedIdentity = Object.entries(protectedExpected).map(([file, expected]) => ({ file, expected, current: sha(path.join(root, file)) }));
assert.deepEqual(protectedIdentity.filter(e => e.expected !== e.current), [], 'protected source identity changed');
const artifacts = [reviewFile, path.join(temp, 'p14c4-review1/REPORT.md'), buildFile, appFile, path.join(__dirname, 'lifecycle-app-browser.cjs')];
const evidence = { recordedAt: new Date().toISOString(), branch: cp.execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim(),
  head: cp.execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), reviewed, inputIdentity, protectedIdentity,
  build: { head: build.head, exit: build.exit, recordedDrift: build.drift, assetManifestSha256: build.assetManifestSha256 }, app,
  artifacts: Object.fromEntries(artifacts.map(file => [file, sha(file)])) };
const output = path.join(temp, 'p14c4-final-evidence.json'); fs.writeFileSync(output, JSON.stringify(evidence, null, 2));
console.log(JSON.stringify({ runtime: runtime.length, clientRuntime: client.length, buildExit: build.exit, mismatches: [], recordedBuildDrift: build.drift,
  newlineOnlyInputs: inputIdentity.filter(e => e.lineEndingEquivalent).map(e => e.file), head: evidence.head, app: app.passed, artifacts: evidence.artifacts, output }, null, 2));
