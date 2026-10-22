// P14-A1 source/build/App identity gate. All bulky evidence must be external to Git.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict'), cp = require('child_process');
const root = path.resolve(__dirname, '../../..');
const runtime = [
  'server/handlers/actorConsequenceHandlers.js', 'server/handlers/socketHandlers.js', 'server/services/actorConsequences.js', 'server/services/roomAccessService.js', 'server/services/spellPayments.js', 'server/services/installedAuthoredAbilities.js',
  'vtt-react/src/services/authoredAbility.js', 'vtt-react/src/services/authoredAbilityRegistry.js', 'vtt-react/src/services/spellConsequence.js', 'vtt-react/src/services/spellConsequenceService.js', 'vtt-react/src/services/acceptedResultFeed.js',
  'vtt-react/src/components/hud/SpellConsequencePanel.jsx', 'vtt-react/src/components/hud/SpellConsequencePanel.css', 'vtt-react/src/components/spellcrafting-wizard/components/library/AuthoredAdmission.jsx', 'vtt-react/src/components/spellcrafting-wizard/components/library/SpellLibrary.jsx',
  'vtt-react/src/components/spellcrafting-wizard/ExternalLivePreview.jsx', 'vtt-react/src/components/spellcrafting-wizard/SpellwizardApp.jsx', 'vtt-react/src/components/spellcrafting-wizard/components/steps/Step10Review.jsx', 'vtt-react/src/components/spellcrafting-wizard/components/steps/Step2SpellType.jsx', 'vtt-react/src/components/spellcrafting-wizard/components/steps/Step4Targeting.jsx', 'vtt-react/src/store/spellbookStore.js', 'vtt-react/public/data/rules.json'
];
const protectedFiles = {
  'server/services/authoredSpellDefinitions.js': '48b69255b8958ae75a7aa17ed7aa67c95b6d4c2bada63f4dcd24a305e20f0003',
  'server/tests/authoredSpellDefinitions.test.js': '6a2f58f23d9217fc8eddf6af81d6de7f63f2232d29b519156f05fbca74037aa4',
  'server/tests/fixtures/crA1aDefinitionVectors.json': 'e6a98a497308b8535538b9887435c9189127afa768b60cd8e01af31cd3c55bdb',
  'vtt-react/src/components/spellcrafting-wizard/components/steps/Step5Resources.jsx': '6120e2b6d7af6ecf8c4692a2d13626dcc6fac036e4345500e8a19fe0b5b37431',
  'vtt-react/src/components/spellcrafting-wizard/core/mechanics/resourceManager.js': 'ea27eb2c0bb6cfadd229c5407c652d0d44c67593a36d1f890c114ca3c28b4605',
  'vtt-react/src/components/spellcrafting-wizard/core/utils/spellSerializer.js': 'b960862958d5752e06dbbcde7390b6243ea6bb01642ef97a7a364b7bf5dfaa5f',
  'vtt-react/src/data/universalCombatSpells.js': '89bebadaa3b079de5c22ad2bebc823ab3f1bad87a0e35b1d6b245ee6c2802fab'
};
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const snapshot = () => Object.fromEntries(runtime.map(file => [file, sha(path.join(root, file))]));
function main() {
  const { A1_BUILD_RECORD, A1_APP_RECORD, A1_EVIDENCE_OUTPUT } = process.env;
  if (![A1_BUILD_RECORD, A1_APP_RECORD, A1_EVIDENCE_OUTPUT].every(p => p && path.isAbsolute(p) && !path.resolve(p).startsWith(root + path.sep))) throw Error('External absolute A1_BUILD_RECORD/A1_APP_RECORD/A1_EVIDENCE_OUTPUT required');
  const build = JSON.parse(fs.readFileSync(A1_BUILD_RECORD)), app = JSON.parse(fs.readFileSync(A1_APP_RECORD)), sources = snapshot();
  assert.equal(build.exit, 0); assert.deepEqual(build.mirrorDrift, []); assert.equal(app.passed, true);
  assert.deepEqual(app.sourceBefore, app.sourceAfter, 'App runtime drift'); assert.deepEqual(app.sourceAfter, sources, 'source changed after App witness');
  const mismatches = runtime.filter(file => file.startsWith('vtt-react/') && build.hashes[file.slice('vtt-react/'.length)] !== sources[file]);
  assert.deepEqual(mismatches, [], 'client runtime differs from frozen production build');
  for (const [file, expected] of Object.entries(protectedFiles)) assert.equal(sha(path.join(root, file)), expected, `protected ${file}`);
  const evidence = { at: new Date().toISOString(), branch: cp.execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim(),
    head: cp.execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), sources, protectedFiles, clientMismatches: mismatches,
    build: { file: A1_BUILD_RECORD, sha256: sha(A1_BUILD_RECORD), exit: build.exit, assetManifestSha256: build.assetManifestSha256, mirrorDrift: build.mirrorDrift, concurrentLiveDrift: build.concurrentLiveDrift },
    app: { file: A1_APP_RECORD, sha256: sha(A1_APP_RECORD), passed: app.passed, checks: Object.keys(app.checks), errors: app.errors },
    witnessSha256: sha(path.join(__dirname, 'authored-app-browser.cjs')) };
  fs.writeFileSync(A1_EVIDENCE_OUTPUT, JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify({ output: A1_EVIDENCE_OUTPUT, runtime: runtime.length, clientMismatches: mismatches, buildExit: build.exit, app: app.passed, protected: Object.keys(protectedFiles).length }));
}
module.exports = { snapshot, runtime };
if (require.main === module) main();
