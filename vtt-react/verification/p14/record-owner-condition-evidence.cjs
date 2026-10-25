const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.resolve(__dirname, '../../..');
const runtime = [...new Set([...require('./record-authored-condition-evidence.cjs').runtime, 'vtt-react/src/services/sharedConditionCustody.js'])];
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const snapshot = () => Object.fromEntries(runtime.map(p => [p, sha(path.join(root, p))]));
module.exports = { runtime, snapshot };
if (require.main === module) {
  const assert = require('assert/strict'), cp = require('child_process'), b = process.env.A8_BUILD_RECORD, a = process.env.A8_APP_RECORD, o = process.env.A8_EVIDENCE_OUTPUT;
  for (const f of [b, a, o]) assert.ok(f && path.isAbsolute(f) && !f.startsWith(root + path.sep));
  const build = JSON.parse(fs.readFileSync(b)), app = JSON.parse(fs.readFileSync(a)), sources = snapshot(), previous = JSON.parse(fs.readFileSync('D:/AppData/Temp/opencode/p14a7-final-evidence.json'));
  assert.equal(build.exit, 0); assert.deepEqual(build.mirrorDrift, []); assert.equal(app.passed, true); assert.deepEqual(app.sourceBefore, app.sourceAfter); assert.deepEqual(app.sourceAfter, sources);
  const clientMismatches = runtime.filter(p => p.startsWith('vtt-react/') && build.hashes[p.slice(10)] !== sources[p]); assert.deepEqual(clientMismatches, []);
  for (const [p, h] of Object.entries(previous.protectedFiles)) assert.equal(sha(path.join(root, p)), h, p);
  const record = { branch: cp.execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim(), head: cp.execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), sources, protectedFiles: previous.protectedFiles, clientMismatches,
    currentFullClientDrift: Object.entries(build.hashes).filter(([p, h]) => !fs.existsSync(path.join(root, 'vtt-react', p)) || sha(path.join(root, 'vtt-react', p)) !== h).map(([p]) => p),
    build: { file: b, sha256: sha(b), assetManifestSha256: build.assetManifestSha256, concurrentLiveDrift: build.concurrentLiveDrift }, app: { file: a, sha256: sha(a), checks: Object.keys(app.checks), errors: app.errors }, witnessSha256: sha(path.join(__dirname, 'owner-condition-app-browser.cjs')) };
  fs.writeFileSync(o, JSON.stringify(record, null, 2)); console.log(JSON.stringify({ passed: true, runtime: runtime.length, clientMismatches, currentFullClientDrift: record.currentFullClientDrift, sha256: sha(o) }));
}
