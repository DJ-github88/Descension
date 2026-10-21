// Tie C3 reviewed bytes to the optimized App witness; generated artifacts remain outside Git.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict'), cp = require('child_process');
const root = path.resolve(__dirname, '../../..'), temp = 'D:/AppData/Temp/opencode';
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const reviewFile = path.join(temp, 'p14c3-review1/REPORT.md');
const reviewed = [...fs.readFileSync(reviewFile, 'utf8').matchAll(/^\| ((?:vtt-react|server)\/[^|]+?) \| ([a-f0-9]{64}) \|/gm)].map(([, file, expected]) => ({ file, expected, current: sha(path.join(root, file)) }));
assert.equal(reviewed.length, 9); assert.deepEqual(reviewed.filter(e => e.expected !== e.current), [], 'review identity drift');
const runtime = reviewed.filter(e => !/\.test\./.test(e.file)), frontend = runtime.filter(e => e.file.startsWith('vtt-react/'));
const buildFile = path.join(temp, 'p14c3-build1/build.json'), build = JSON.parse(fs.readFileSync(buildFile)); assert.equal(build.exit, 0);
const mismatches = frontend.filter(e => build.before[e.file] !== e.current || build.after[e.file] !== e.current); assert.deepEqual(mismatches, [], 'C3 frontend build identity drift');
const appFile = path.join(temp, 'p14c3-app2/result.json'), app = JSON.parse(fs.readFileSync(appFile)); assert.equal(app.passed, true);
const protectedExpected = {
  'server/services/authoredSpellDefinitions.js': '48b69255b8958ae75a7aa17ed7aa67c95b6d4c2bada63f4dcd24a305e20f0003',
  'vtt-react/src/components/spellcrafting-wizard/components/steps/Step5Resources.jsx': '6120e2b6d7af6ecf8c4692a2d13626dcc6fac036e4345500e8a19fe0b5b37431',
  'vtt-react/src/components/spellcrafting-wizard/core/mechanics/resourceManager.js': 'ea27eb2c0bb6cfadd229c5407c652d0d44c67593a36d1f890c114ca3c28b4605',
  'vtt-react/src/components/spellcrafting-wizard/core/utils/spellSerializer.js': 'b960862958d5752e06dbbcde7390b6243ea6bb01642ef97a7a364b7bf5dfaa5f',
  'vtt-react/src/data/universalCombatSpells.js': '89bebadaa3b079de5c22ad2bebc823ab3f1bad87a0e35b1d6b245ee6c2802fab'
};
const protectedIdentity = Object.entries(protectedExpected).map(([file, expected]) => ({ file, expected, current: sha(path.join(root, file)) }));
assert.deepEqual(protectedIdentity.filter(e => e.expected !== e.current), [], 'protected authored source drift');
const artifacts = [reviewFile, buildFile, appFile, path.join(__dirname, 'shield-bash-app-browser.cjs'),
  path.join(root, 'server/tests/p14c3ShieldBash.production.test.js'), path.join(root, 'vtt-react/src/services/__tests__/sharedConditionService.test.js')];
const evidence = { recordedAt: new Date().toISOString(), head: cp.execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), reviewed, protectedIdentity,
  build: { head: build.head, compilationExit: build.exit, c3ClientMismatches: mismatches, fullBuildDrift: build.drift, assetManifestSha256: build.assetManifestSha256 },
  app, artifacts: Object.fromEntries(artifacts.map(file => [file, sha(file)])) };
const output = path.join(temp, 'p14c3-final-evidence.json'); fs.writeFileSync(output, JSON.stringify(evidence, null, 2));
console.log(JSON.stringify({ runtimeFiles: runtime.length, clientRuntimeFiles: frontend.length, compilationExit: build.exit, c3ClientMismatches: mismatches,
  fullBuildDrift: build.drift, app: app.passed, artifacts: evidence.artifacts, output }, null, 2));
