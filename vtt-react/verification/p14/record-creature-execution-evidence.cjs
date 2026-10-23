// Exact scoped A4 identity; bulk build/App evidence is external.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process'), assert = require('assert/strict');
const root = path.resolve(__dirname, '../../..');
const runtime = [...new Set([...require('./record-creature-evidence.cjs').runtime,
  'server/handlers/tokenHandlers.js', 'server/handlers/socketHandlers.js', 'vtt-react/src/services/actorConsequenceService.js',
  'vtt-react/src/services/spellConsequenceCustody.js', 'vtt-react/public/data/rules.json'])];
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const protectedFiles = {
  'server/services/authoredSpellDefinitions.js': '48b69255b8958ae75a7aa17ed7aa67c95b6d4c2bada63f4dcd24a305e20f0003',
  'server/tests/authoredSpellDefinitions.test.js': '6a2f58f23d9217fc8eddf6af81d6de7f63f2232d29b519156f05fbca74037aa4',
  'server/tests/fixtures/crA1aDefinitionVectors.json': 'e6a98a497308b8535538b9887435c9189127afa768b60cd8e01af31cd3c55bdb',
  'vtt-react/src/components/spellcrafting-wizard/components/steps/Step5Resources.jsx': '6120e2b6d7af6ecf8c4692a2d13626dcc6fac036e4345500e8a19fe0b5b37431',
  'vtt-react/src/components/spellcrafting-wizard/core/mechanics/resourceManager.js': 'ea27eb2c0bb6cfadd229c5407c652d0d44c67593a36d1f890c114ca3c28b4605',
  'vtt-react/src/components/spellcrafting-wizard/core/utils/spellSerializer.js': 'b960862958d5752e06dbbcde7390b6243ea6bb01642ef97a7a364b7bf5dfaa5f',
  'vtt-react/src/data/universalCombatSpells.js': '89bebadaa3b079de5c22ad2bebc823ab3f1bad87a0e35b1d6b245ee6c2802fab'
};
const snapshot = () => Object.fromEntries(runtime.map(p => [p, sha(path.join(root, p))]));
module.exports = { snapshot, runtime };
if (require.main === module) {
  const { A4_BUILD_RECORD: b, A4_APP_RECORD: a, A4_EVIDENCE_OUTPUT: o } = process.env;
  for (const p of [b, a, o]) assert.ok(p && path.isAbsolute(p) && !path.resolve(p).startsWith(root + path.sep));
  const build = JSON.parse(fs.readFileSync(b)), app = JSON.parse(fs.readFileSync(a)), sources = snapshot();
  assert.equal(build.exit, 0); assert.deepEqual(build.mirrorDrift, []); assert.equal(app.passed, true); assert.deepEqual(app.sourceBefore, app.sourceAfter); assert.deepEqual(app.sourceAfter, sources);
  const clientMismatches = runtime.filter(p => p.startsWith('vtt-react/') && build.hashes[p.slice(10)] !== sources[p]); assert.deepEqual(clientMismatches, []);
  for (const [file, expected] of Object.entries(protectedFiles)) assert.equal(sha(path.join(root, file)), expected, `protected ${file}`);
  const out = { branch: cp.execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim(), head: cp.execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    sources, protectedFiles, clientMismatches, build: { file: b, sha256: sha(b), assetManifestSha256: build.assetManifestSha256, concurrentLiveDrift: build.concurrentLiveDrift },
    app: { file: a, sha256: sha(a), checks: Object.keys(app.checks), errors: app.errors }, witnessSha256: sha(path.join(__dirname, 'creature-execution-app-browser.cjs')) };
  fs.writeFileSync(o, JSON.stringify(out, null, 2)); console.log(JSON.stringify({ passed: true, files: runtime.length, clientMismatches, evidenceSha256: sha(o) }));
}
