const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.resolve(__dirname, '../../..');
const runtime = [...new Set([...require('./record-owner-condition-evidence.cjs').runtime, 'server/handlers/socketHandlers.js',
  'vtt-react/src/components/character-sheet/Lore.jsx'])];
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const snapshot = () => Object.fromEntries(runtime.map(p => [p, sha(path.join(root, p))]));
module.exports = { runtime, snapshot };
if (require.main === module) {
  const assert = require('assert/strict'), cp = require('child_process'), buildPath = process.env.A9_BUILD_RECORD, appPath = process.env.A9_APP_RECORD, output = process.env.A9_EVIDENCE_OUTPUT;
  for (const p of [buildPath, appPath, output]) assert.ok(p && path.isAbsolute(p) && !p.startsWith(root + path.sep));
  const build = JSON.parse(fs.readFileSync(buildPath)), app = JSON.parse(fs.readFileSync(appPath)), baseline = JSON.parse(fs.readFileSync('D:/AppData/Temp/opencode/p14a9-baseline.json')), sources = snapshot();
  assert.equal(build.exit, 0); assert.equal(app.passed, true); assert.deepEqual(app.sourceBefore, app.sourceAfter); assert.deepEqual(app.sourceAfter, sources);
  const clientDrift = runtime.filter(p => p.startsWith('vtt-react/') && sources[p] !== build.hashes[p.slice(10)]); assert.deepEqual(clientDrift, []);
  for (const [p, h] of Object.entries(baseline.protectedFiles)) assert.equal(sha(path.join(root, p)), h, p);
  const record = { head: cp.execFileSync('git', ['rev-parse','HEAD'], { cwd: root, encoding:'utf8' }).trim(), sources, protectedFiles: baseline.protectedFiles, clientDrift,
    currentFullClientDrift: Object.entries(build.hashes).filter(([p, h]) => !fs.existsSync(path.join(root, 'vtt-react', p)) || sha(path.join(root, 'vtt-react', p)) !== h).map(([p]) => p),
    build: { path: buildPath, sha256: sha(buildPath), assetManifestSha256: build.assetManifestSha256 }, app: { path: appPath, sha256: sha(appPath), checks: Object.keys(app.checks), errors: app.errors },
    witnesses: Object.fromEntries(['pc-target-condition-app-browser.cjs','record-pc-target-condition-evidence.cjs'].map(p => [p, sha(path.join(__dirname,p))])) };
  fs.writeFileSync(output, JSON.stringify(record,null,2)); console.log(JSON.stringify({ runtime: runtime.length, clientDrift, currentFullClientDrift: record.currentFullClientDrift, sha256: sha(output) }));
}
