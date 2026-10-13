const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto'), zlib = require('zlib'), assert = require('assert/strict');
const root = path.resolve(__dirname, '../../..'), out = path.join(__dirname, 'evidence');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const git = (...args) => cp.execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
const production = [
  'server/services/actorConsequences.js', 'server/services/syncService.js', 'server/services/validationService.js', 'server/services/sanitizationService.js', 'server/services/rateLimitService.js', 'server/services/roomAccessService.js',
  'server/handlers/actorConsequenceHandlers.js', 'server/handlers/socketHandlers.js', 'server/handlers/tokenHandlers.js', 'server/handlers/environmentHandlers.js', 'server/handlers/combatHandlers.js', 'server/handlers/roomLifecycleHandlers.js',
  'vtt-react/src/services/actorConsequenceService.js', 'vtt-react/src/services/silentRoomHydration.js', 'vtt-react/src/services/effectProcessingService.js',
  'vtt-react/src/store/creatureStore.js', 'vtt-react/src/store/characterTokenStore.js', 'vtt-react/src/store/conditionStore.js', 'vtt-react/src/store/combatStore.js',
  'vtt-react/src/store/characterHelpers.js', 'vtt-react/src/store/characterSlices/coreSlice.js', 'vtt-react/src/store/characterSlices/multiplayerSlice.js', 'vtt-react/src/hooks/useCharacterPersistence.js',
  'vtt-react/src/components/multiplayer/socketHandlers/registerAllHandlers.js', 'vtt-react/src/components/hud/ActorConsequenceControls.jsx', 'vtt-react/src/components/hud/PartyHUD.jsx', 'vtt-react/src/components/hud/TargetHUD.jsx'
];
const witnesses = ['server/tests/p7Consequences.production.test.js', 'server/tests/p7Negative.production.test.js', 'server/tests/p7ImportMetadata.production.test.js',
  'server/tests/c5RoomAuthority.test.js', 'server/tests/roomAccessPrivacyProjection.test.js', 'server/tests/socketHandlers.test.js', 'server/tests/helpers/productionStackServer.js', 'vtt-react/src/services/__tests__/p7Negative.production.test.js'];
const phase = process.argv[2] || 'freeze';
const before = JSON.parse(fs.readFileSync(path.join(out, 'before.json')));
const focal = [...production, ...witnesses];
const current = Object.fromEntries(focal.map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
const record = { date: new Date().toISOString(), checkout: git('rev-parse', '--show-toplevel'), branch: git('branch', '--show-current'), head: git('rev-parse', 'HEAD'), production, witnesses,
  hashes: current, sourceBefore: Object.fromEntries(focal.map(file => [file, before.hashes[file] || null])) };
assert.equal(record.head, before.head);
if (phase === 'freeze') {
  let iteration = 1;
  if (fs.existsSync(path.join(out, 'source-freeze.json')) && !fs.existsSync(path.join(out, 'source-freeze-1.json'))) {
    fs.copyFileSync(path.join(out, 'source-freeze.json'), path.join(out, 'source-freeze-1.json'));
    fs.copyFileSync(path.join(out, 'reviewed-source.json.gz'), path.join(out, 'reviewed-source-1.json.gz'));
  }
  while (fs.existsSync(path.join(out, `source-freeze-${iteration}.json`))) iteration += 1;
  if (!fs.existsSync(path.join(out, 'frozen-contract.md'))) fs.writeFileSync(path.join(out, 'frozen-contract.md'), fs.readFileSync(path.join(root, 'docs/MYTHRILL_PROJECT_7_CONTRACT.md')));
  record.contractSha256 = hash(fs.readFileSync(path.join(out, 'frozen-contract.md')));
  record.implementationContractSha256 = hash(fs.readFileSync(path.join(root, 'docs/MYTHRILL_PROJECT_7_CONTRACT.md')));
  fs.writeFileSync(path.join(out, 'source-freeze.json'), JSON.stringify(record, null, 2));
  fs.writeFileSync(path.join(out, `source-freeze-${iteration}.json`), JSON.stringify(record, null, 2));
  const browser = JSON.parse(fs.readFileSync(path.join(out, 'browser-results.json')));
  const dependencies = [...new Set([...focal, ...Object.keys(browser.manifest).map(file => 'vtt-react/src/' + file)])];
  const files = Object.fromEntries(dependencies.map(file => [file, fs.readFileSync(path.join(root, file)).toString('base64')]));
  const hashes = Object.fromEntries(dependencies.map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
  fs.writeFileSync(path.join(out, 'reviewed-source.json.gz'), zlib.gzipSync(JSON.stringify({ files, hashes })));
  fs.copyFileSync(path.join(out, 'reviewed-source.json.gz'), path.join(out, `reviewed-source-${iteration}.json.gz`));
} else {
  const frozen = JSON.parse(fs.readFileSync(path.join(out, 'source-freeze.json')));
  record.focalDrift = focal.filter(file => frozen.hashes[file] !== current[file]);
  assert.deepEqual(record.focalDrift, []);
  const accepted = JSON.parse(fs.readFileSync(path.join(root, 'vtt-react/verification/p6/evidence/independent-container-acceptance-20261012/after.json')));
  const evidence = Object.keys(accepted.hashes).filter(file => /^vtt-react\/verification\/(p6|p5-01)\//.test(file));
  record.preservedEvidenceFiles = evidence.length;
  record.preservedEvidenceDrift = evidence.filter(file => !fs.existsSync(path.join(root, file)) || hash(fs.readFileSync(path.join(root, file))) !== accepted.hashes[file]);
  assert.deepEqual(record.preservedEvidenceDrift, []);
  const files = git('ls-files', '--cached', '--others', '--exclude-standard', '-z').split('\0').filter(Boolean);
  const hashes = Object.fromEntries(files.filter(file => fs.existsSync(path.join(root, file))).map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
  record.concurrentChanges = Object.keys(before.hashes).filter(file => !focal.includes(file) && hashes[file] !== before.hashes[file] && !file.startsWith('vtt-react/verification/p7/') && !file.startsWith('docs/'));
  record.p6NewDependencyBytes = Object.keys(JSON.parse(fs.readFileSync(path.join(root, 'vtt-react/verification/p6/evidence/independent-container-acceptance-20261012/green.json'))).manifest)
    .filter(file => hashes['vtt-react/src/' + file] !== accepted.hashes['vtt-react/src/' + file]);
  const checked = cp.spawnSync('git', ['diff', '--check', '--', ...focal], { cwd: root, encoding: 'utf8' });
  record.scopedDiffCheck = checked.status; fs.writeFileSync(path.join(out, 'scoped-diff-check.log'), (checked.stdout || '') + (checked.stderr || ''));
  record.documents = Object.fromEntries(['docs/MYTHRILL_PROJECT_7_CONTRACT.md', 'docs/MYTHRILL_PROJECT_7_IMPLEMENTATION.md', 'docs/ENGINEERING_STATE.md'].map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
  const build = 'D:/AppData/Temp/opencode/p7-build-final-20261013';
  if (fs.existsSync(path.join(build, 'build.exit'))) {
    for (const file of ['build.exit', 'build.log', 'build.cmd', 'build.config.cjs']) fs.copyFileSync(path.join(build, file), path.join(out, file));
  }
  fs.writeFileSync(path.join(out, 'final-identity.json'), JSON.stringify(record, null, 2));
  fs.writeFileSync(path.join(out, 'changed-files.md'), '# P7 exact behavioral/witness source identity\n\n| File | Before SHA256 | Final SHA256 |\n|---|---|---|\n' + focal.map(file => `| \`${file}\` | \`${record.sourceBefore[file] || 'new'}\` | \`${current[file]}\` |`).join('\n') + '\n');
  const artifacts = {};
  const walk = directory => {for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (file !== path.join(out, 'artifact-manifest.json')) artifacts[path.relative(out, file).replace(/\\/g, '/')] = hash(fs.readFileSync(file));
  }};
  walk(out); fs.writeFileSync(path.join(out, 'artifact-manifest.json'), JSON.stringify(artifacts, null, 2));
}
console.log(JSON.stringify({ phase, head: record.head, focalFiles: focal.length, focalDrift: record.focalDrift, preservedEvidenceFiles: record.preservedEvidenceFiles, preservedEvidenceDrift: record.preservedEvidenceDrift, concurrentChanges: record.concurrentChanges?.length, scopedDiffCheck: record.scopedDiffCheck }, null, 2));
