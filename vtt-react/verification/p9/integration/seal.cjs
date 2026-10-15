const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict'), cp = require('child_process');
const root = path.resolve(__dirname, '../../../..'), base = path.join(root, 'vtt-react/verification/p9/evidence/integration-20261015/sol');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const read = p => fs.readFileSync(path.join(root, p));
const json = p => JSON.parse(fs.readFileSync(path.join(base, p)));
const focal = ['vtt-react/src/services/featherSlash.js', 'vtt-react/src/services/__tests__/featherSlash.test.js',
  'vtt-react/src/components/ui/ActionBar.jsx', 'vtt-react/src/components/ui/__tests__/ActionBarLegacyArcanoneerSpheres.test.jsx',
  'vtt-react/src/components/hud/PartyHUD.jsx', 'vtt-react/src/components/hud/SpellConsequencePanel.css',
  'vtt-react/public/data/abilities.json', 'vtt-react/public/data/creatures.json', 'vtt-react/src/data/versions.js',
  'vtt-react/src/services/featherSlashCustody.js', 'vtt-react/src/services/actorConsequenceService.js'];
const before = json('before-identity.json'), start = json('starting-source.json'), build = json('build-snapshot/command.json'), app = json('app-replay-final/result.json');
assert.equal(build.exit, 0); assert.deepEqual(build.mirrorDrift, []); assert.equal(app.passed, true);
const manifest = fs.readFileSync(path.join(base, 'build-snapshot/app/asset-manifest.json'));
assert.equal(app.buildAssetManifestSha256, sha(manifest));
const identities = Object.fromEntries(focal.map(p => [p, { raw: sha(read(p)), lf: sha(read(p).toString('utf8').replace(/\r\n/g, '\n')), before: before.hashes[p] }]));
for (const p of focal) if (p in build.hashes) assert.equal(identities[p].raw, build.hashes[p], 'Focal snapshot mismatch: ' + p);
for (const p of focal.filter(p => !p.includes('/services/featherSlash.js') && !p.endsWith('/__tests__/featherSlash.test.js'))) assert.equal(identities[p].raw, before.hashes[p], 'Unintended focal edit: ' + p);
const historical = Object.keys(before.hashes).filter(p => p.startsWith('vtt-react/verification/') && !p.includes('/p9/integration/') || /^docs\/MYTHRILL_(P[789]_SOURCE_INDEPENDENT_ACCEPTANCE|PROJECT_[789]_CONTRACT)/.test(p));
const historicalDrift = historical.filter(p => !fs.existsSync(path.join(root, p)) || sha(read(p)) !== before.hashes[p]);
// Another process advanced HEAD and replaced two generated P7 evidence JSONs.
// Preserve both identities; never overwrite the other owner's current bytes.
const expectedConcurrent = ['vtt-react/verification/p7/evidence/corrections-20261013/server-green.json', 'vtt-react/verification/p7/evidence/server-results.json'];
assert.deepEqual(historicalDrift.slice().sort(), expectedConcurrent.slice().sort());
const preservedHistorical = historicalDrift.map(p => {
  const committed = cp.execFileSync('git', ['show', before.head + ':' + p], { cwd: root, maxBuffer: 16 * 1024 * 1024 });
  const variants = [committed, Buffer.from(committed.toString('utf8').replace(/\r?\n/g, '\r\n'))];
  const original = variants.find(b => sha(b) === before.hashes[p]); assert(original, 'Original historical bytes unavailable: ' + p);
  const name = p.includes('corrections-20261013') ? 'p7-corrections-server-green' : 'p7-server-results';
  fs.writeFileSync(path.join(base, name + '-original.json'), original, { flag: 'wx' });
  fs.writeFileSync(path.join(base, name + '-concurrent.json'), read(p), { flag: 'wx' });
  return { path: p, originalSha256: sha(original), currentSha256: sha(read(p)), originalCopy: name + '-original.json', concurrentCopy: name + '-concurrent.json', recoveredFrom: before.head };
});
const preservedP9 = Object.keys(start.files).filter(p => p !== 'vtt-react/src/services/featherSlash.js' && p !== 'vtt-react/src/services/__tests__/featherSlash.test.js');
assert.deepEqual(preservedP9.filter(p => sha(read(p)) !== sha(Buffer.from(start.files[p], 'base64'))), []);
const acceptedP9 = json('accepted-p9-comparison.json');
const p9CurrentDifferences = Object.entries(acceptedP9).filter(([p, value]) => sha(read(p).toString('utf8').replace(/\r\n/g, '\n')) !== value.expected).map(([p]) => p);
const summary = { at: new Date().toISOString(), startingHead: before.head, currentHead: cp.execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  focal: identities, preservedP9StartingFiles: preservedP9.length, historicalFilesVerified: historical.length, historicalDrift, preservedHistorical,
  p9CurrentDifferences, snapshotSha256: build.snapshotSha256, snapshotBuild: { cwd: build.cwd, startedAt: build.startedAt, endedAt: build.endedAt, exit: build.exit, mirrorDrift: build.mirrorDrift, concurrentLiveDrift: build.concurrentLiveDrift },
  buildManifestSha256: sha(manifest), productionApp: { file: 'app-replay-final/result.json', sha256: sha(fs.readFileSync(path.join(base, 'app-replay-final/result.json'))), passed: app.passed,
    pageErrors: app.errors, deliberatelyRefusedRequests: app.networkRefusals.length, receipts: Object.fromEntries(Object.entries(app.witnesses).map(([name, value]) => [name, value.receipt.commandId])) } };
fs.writeFileSync(path.join(base, 'final-summary.json'), JSON.stringify(summary, null, 2), { flag: 'wx' });
fs.writeFileSync(path.join(base, 'final-source.json'), JSON.stringify({ files: Object.fromEntries(focal.map(p => [p, read(p).toString('base64')])) }, null, 2), { flag: 'wx' });
console.log(JSON.stringify({ focal: Object.fromEntries(focal.map(p => [p, identities[p].raw])), historicalFilesVerified: historical.length, historicalDrift,
  p9CurrentDifferences, snapshotSha256: summary.snapshotSha256, buildManifestSha256: summary.buildManifestSha256, app: summary.productionApp }));
