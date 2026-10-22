// Bounded A3 source identity. Full manifests/builds/browser captures stay outside Git.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict'), cp = require('child_process');
const root = path.resolve(__dirname, '../../..');
const runtime = [...require('./record-item-evidence.cjs').runtime,
  'vtt-react/src/store/creatureStore.js',
  'vtt-react/src/components/creature-wizard/CreatureWizardApp.jsx',
  'vtt-react/src/components/creature-wizard/context/CreatureWizardContext.js',
  'vtt-react/src/components/creature-wizard/components/common/CreatureAuthoredAbility.jsx',
  'vtt-react/src/components/creature-wizard/components/common/EnhancedCreatureInspectView.jsx',
  'vtt-react/src/components/creature-wizard/components/common/ExternalCreaturePreview.jsx',
  'vtt-react/src/components/creature-wizard/components/steps/Step3Abilities.jsx',
  'vtt-react/src/components/creature-wizard/components/library/CreatureLibrary.jsx',
  'vtt-react/src/components/creature-wizard/styles/CreatureWizard.css'];
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const snapshot = () => Object.fromEntries(runtime.map(p => [p, sha(path.join(root, p))]));
module.exports = { snapshot, runtime };
if (require.main === module) {
  const { A3_BUILD_RECORD, A3_APP_RECORD, A3_EVIDENCE_OUTPUT } = process.env;
  for (const p of [A3_BUILD_RECORD, A3_APP_RECORD, A3_EVIDENCE_OUTPUT]) assert.ok(p && path.isAbsolute(p) && !path.resolve(p).startsWith(root + path.sep));
  const build = JSON.parse(fs.readFileSync(A3_BUILD_RECORD)), app = JSON.parse(fs.readFileSync(A3_APP_RECORD)), sources = snapshot();
  assert.equal(build.exit, 0); assert.deepEqual(build.mirrorDrift, []); assert.equal(app.passed, true);
  assert.deepEqual(app.sourceBefore, app.sourceAfter); assert.deepEqual(sources, app.sourceAfter);
  const mismatches = runtime.filter(p => p.startsWith('vtt-react/') && build.hashes[p.slice(10)] !== sources[p]);
  // Inventory is inherited A2 collateral, not used by this creature producer. Report concurrent
  // changes rather than rebuilding unrelated UI or claiming full current-tree build parity.
  const collateral = ['vtt-react/src/components/windows/InventoryWindow.jsx'];
  const scopedMismatches = mismatches.filter(p => !collateral.includes(p)); assert.deepEqual(scopedMismatches, []);
  const collateralDrift = mismatches.map(p => ({ file: p, built: build.hashes[p.slice(10)], current: sources[p], reason: 'Concurrent resource-overflow UI change; outside A3 producer and not executed by this App workflow.' }));
  const out = { head: cp.execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), sources, clientMismatches: scopedMismatches, collateralDrift,
    build: { file: A3_BUILD_RECORD, sha256: sha(A3_BUILD_RECORD), assetManifestSha256: build.assetManifestSha256, liveDrift: build.concurrentLiveDrift },
    app: { file: A3_APP_RECORD, sha256: sha(A3_APP_RECORD), checks: Object.keys(app.checks), errors: app.errors }, witnessSha256: sha(path.join(__dirname, 'creature-app-browser.cjs')) };
  fs.writeFileSync(A3_EVIDENCE_OUTPUT, JSON.stringify(out, null, 2)); console.log(JSON.stringify({ runtime: runtime.length, scopedMismatches, collateralDrift, passed: true }));
}
