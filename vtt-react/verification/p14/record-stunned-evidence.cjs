// Concise C2 source/review/build/App identity; generated artifacts stay outside Git.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict'), cp = require('child_process');
const root = path.resolve(__dirname, '../../..'), temp = 'D:/AppData/Temp/opencode';
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const reviewFile = path.join(temp, 'p14c2-review1/final-runtime.sha256');
const entries = fs.readFileSync(reviewFile, 'utf8').split(/\r?\n/).filter(line => /^[a-f0-9]{64}  /.test(line)).map(line => {
  const [expected, file] = line.split('  '); return { file, expected, current: sha(path.join(root, file)) };
});
assert.deepEqual(entries.filter(e => e.expected !== e.current), [], 'reviewed source identity drift');
const runtime = entries.filter(e => !/\.test\./.test(e.file));
const buildFile = path.join(temp, 'p14c2-build2/build.json'), build = JSON.parse(fs.readFileSync(buildFile)); assert.equal(build.exit, 0);
const frontend = runtime.filter(e => e.file.startsWith('vtt-react/'));
const mismatches = frontend.filter(e => build.before[e.file] !== e.current || build.after[e.file] !== e.current);
assert.deepEqual(mismatches, [], 'C2 client build identity drift');
const appFile = path.join(temp, 'p14c2-app5/result.json'), app = JSON.parse(fs.readFileSync(appFile)); assert.equal(app.passed, true);
const preserved = {
  'server/services/authoredSpellDefinitions.js': '48b69255b8958ae75a7aa17ed7aa67c95b6d4c2bada63f4dcd24a305e20f0003',
  'vtt-react/src/components/spellcrafting-wizard/components/steps/Step5Resources.jsx': '6120e2b6d7af6ecf8c4692a2d13626dcc6fac036e4345500e8a19fe0b5b37431',
  'vtt-react/src/components/spellcrafting-wizard/core/mechanics/resourceManager.js': 'ea27eb2c0bb6cfadd229c5407c652d0d44c67593a36d1f890c114ca3c28b4605',
  'vtt-react/src/components/spellcrafting-wizard/core/utils/spellSerializer.js': 'b960862958d5752e06dbbcde7390b6243ea6bb01642ef97a7a364b7bf5dfaa5f',
  'vtt-react/src/data/universalCombatSpells.js': '89bebadaa3b079de5c22ad2bebc823ab3f1bad87a0e35b1d6b245ee6c2802fab'
};
const protectedIdentity = Object.entries(preserved).map(([file, expected]) => ({ file, expected, current: sha(path.join(root, file)) }));
assert.deepEqual(protectedIdentity.filter(e => e.expected !== e.current), [], 'protected authored identity changed');
const artifacts = [reviewFile, path.join(temp, 'p14c2-review1/REPORT.md'), buildFile, appFile,
  path.join(root, 'server/tests/p14c2Stunned.production.test.js'), path.join(root, 'server/tests/p13bRiposte.production.test.js'),
  path.join(root, 'server/tests/p9SpellConsequences.production.test.js'), path.join(root, 'vtt-react/src/services/__tests__/sharedConditionService.test.js'),
  path.join(__dirname, 'stunned-app-browser.cjs')];
const record = { recordedAt: new Date().toISOString(), head: cp.execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  branch: cp.execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim(), runtime, protectedIdentity,
  build: { head: build.head, compilationExit: build.exit, c2ClientMismatches: mismatches, fullBuildDrift: build.drift, assetManifestSha256: build.assetManifestSha256 },
  app, artifacts: Object.fromEntries(artifacts.map(file => [file, sha(file)])) };
const output = path.join(temp, 'p14c2-final-evidence.json'); fs.writeFileSync(output, JSON.stringify(record, null, 2));
console.log(JSON.stringify({ runtimeFiles: runtime.length, compilationExit: build.exit, c2ClientMismatches: mismatches, fullBuildDrift: build.drift,
  appPassed: app.passed, head: record.head, artifacts: record.artifacts, output }, null, 2));
