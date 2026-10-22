// Exact scoped A4 identity; bulk build/App evidence is external.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process'), assert = require('assert/strict');
const root = path.resolve(__dirname, '../../..');
const runtime = [...new Set([...require('./record-creature-evidence.cjs').runtime,
  'server/handlers/tokenHandlers.js', 'server/handlers/socketHandlers.js', 'vtt-react/src/services/actorConsequenceService.js',
  'vtt-react/src/services/spellConsequenceCustody.js', 'vtt-react/public/data/rules.json'])];
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const snapshot = () => Object.fromEntries(runtime.map(p => [p, sha(path.join(root, p))]));
module.exports = { snapshot, runtime };
if (require.main === module) {
  const { A4_BUILD_RECORD: b, A4_APP_RECORD: a, A4_EVIDENCE_OUTPUT: o } = process.env;
  for (const p of [b, a, o]) assert.ok(p && path.isAbsolute(p) && !path.resolve(p).startsWith(root + path.sep));
  const build = JSON.parse(fs.readFileSync(b)), app = JSON.parse(fs.readFileSync(a)), sources = snapshot();
  assert.equal(build.exit, 0); assert.deepEqual(build.mirrorDrift, []); assert.equal(app.passed, true); assert.deepEqual(app.sourceBefore, app.sourceAfter); assert.deepEqual(app.sourceAfter, sources);
  const clientMismatches = runtime.filter(p => p.startsWith('vtt-react/') && build.hashes[p.slice(10)] !== sources[p]); assert.deepEqual(clientMismatches, []);
  const out = { branch: cp.execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim(), head: cp.execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    sources, clientMismatches, build: { file: b, sha256: sha(b), assetManifestSha256: build.assetManifestSha256, concurrentLiveDrift: build.concurrentLiveDrift },
    app: { file: a, sha256: sha(a), checks: Object.keys(app.checks), errors: app.errors }, witnessSha256: sha(path.join(__dirname, 'creature-execution-app-browser.cjs')) };
  fs.writeFileSync(o, JSON.stringify(out, null, 2)); console.log(JSON.stringify({ passed: true, files: runtime.length, clientMismatches }));
}
