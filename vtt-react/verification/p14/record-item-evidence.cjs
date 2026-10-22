// Source identity for the bounded A2 producer plus reused A1 runtime. Bulk is external.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const root = path.resolve(__dirname, '../../..');
const runtime = [...require('./record-authored-evidence.cjs').runtime,
  'vtt-react/src/services/itemAuthoredAbility.js', 'vtt-react/src/components/item-generation/ItemAbilityEditor.jsx', 'vtt-react/src/components/item-generation/ItemAbilityAccess.jsx', 'vtt-react/src/components/item-generation/ItemAbility.css',
  'vtt-react/src/components/item-generation/ItemWizard.jsx', 'vtt-react/src/components/item-generation/ItemLibrary.jsx', 'vtt-react/src/components/item-generation/ItemCard.jsx', 'vtt-react/src/components/windows/InventoryWindow.jsx', 'vtt-react/src/store/inventoryStore.js'];
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const snapshot = () => Object.fromEntries(runtime.map(p => [p, sha(path.join(root, p))]));
module.exports = { runtime, snapshot };
if (require.main === module) {
  const { A2_BUILD_RECORD, A2_APP_RECORD, A2_EVIDENCE_OUTPUT } = process.env;
  for (const p of [A2_BUILD_RECORD, A2_APP_RECORD, A2_EVIDENCE_OUTPUT]) assert.ok(p && path.isAbsolute(p) && !path.resolve(p).startsWith(root + path.sep));
  const build = JSON.parse(fs.readFileSync(A2_BUILD_RECORD)), app = JSON.parse(fs.readFileSync(A2_APP_RECORD)), sources = snapshot();
  assert.equal(build.exit, 0); assert.deepEqual(build.drift, []); assert.equal(app.passed, true);
  assert.deepEqual(app.sourceBefore, app.sourceAfter); assert.deepEqual(sources, app.sourceAfter);
  const mismatches = runtime.filter(p => p.startsWith('vtt-react/') && build.before[p] !== sources[p]); assert.deepEqual(mismatches, []);
  const out = { head: build.head, sources, clientMismatches: mismatches, build: { file: A2_BUILD_RECORD, sha256: sha(A2_BUILD_RECORD), assetManifestSha256: build.assetManifestSha256 }, app: { file: A2_APP_RECORD, sha256: sha(A2_APP_RECORD), checks: Object.keys(app.checks), errors: app.errors }, witnessSha256: sha(path.join(__dirname, 'item-app-browser.cjs')) };
  fs.writeFileSync(A2_EVIDENCE_OUTPUT, JSON.stringify(out, null, 2)); console.log(JSON.stringify({ runtime: runtime.length, mismatches, passed: true }));
}
