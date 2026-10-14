// Combined-source verification. Independent review, not this runner, accepts P7.
const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto');
const root = path.resolve(__dirname, '../../..');
const base = process.env.P7_FINAL_OUT || 'D:/AppData/Temp/opencode/p7-final-20261013/combined';
const mode = process.argv[2], out = path.join(base, mode + '-' + Date.now());
fs.mkdirSync(out, { recursive: true });
const production = [
  'server/services/actorProjection.js', 'server/services/actorConsequences.js', 'server/services/roomAccessService.js',
  ...['actorConsequenceHandlers', 'characterHandlers', 'environmentHandlers', 'gmActionHandlers', 'mapHandlers', 'socketHandlers', 'syncHandlers', 'tokenHandlers'].map(name => `server/handlers/${name}.js`),
  ...['actorConsequenceService', 'actorProjectionOrder', 'silentRoomHydration'].map(name => `vtt-react/src/services/${name}.js`),
  'vtt-react/src/components/multiplayer/roomJoinHandler.js',
  ...['audioGameSessionHandlers', 'characterHandlers', 'gmHandlers', 'mapGridHandlers', 'tokenHandlers'].map(name => `vtt-react/src/components/multiplayer/socketHandlers/${name}.js`),
  'vtt-react/src/store/characterTokenStore.js', 'vtt-react/src/store/characterSlices/multiplayerSlice.js',
  'vtt-react/src/hooks/useCharacterPersistence.js', 'vtt-react/src/persistence/characterSaveOutcome.js', 'vtt-react/src/persistence/privateStorageRegistry.js'
];
const tests = ['server/tests/p7Bounds.production.test.js', 'server/tests/p7Lifecycle.production.test.js', 'server/tests/p7Blockers.production.test.js',
  ...['actorProjectionOrder.test.js', 'p7BoundsConsumers.test.js', 'roomHydrationCorrections.test.js'].map(name => `vtt-react/src/services/__tests__/${name}`),
  'vtt-react/src/persistence/__tests__/p7ConditionRecovery.production.test.jsx'];
const witnesses = ['final-checks.cjs', 'lifecycle-browser.cjs', 'lifecycle-checks.cjs', 'lifecycle-output.cjs', 'bounds-browser.cjs', 'bounds-checks.cjs', 'bounds-red-source.cjs', 'condition-recovery-browser.cjs', 'owner-condition-browser.cjs'].map(name => `vtt-react/verification/p7/${name}`);
const files = [...production, ...tests, ...witnesses, 'vtt-react/verification/p7/evidence/frozen-contract.md'];
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const hashes = () => Object.fromEntries(files.map(file => [file, sha(path.join(root, file))]));
const git = args => cp.execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
const before = hashes(), identity = { head: git(['rev-parse', 'HEAD']).trim(), status: git(['status', '--short']), hashes: before };
if (mode === 'seal') {
  fs.writeFileSync(path.join(out, 'source.json'), JSON.stringify({ identity, files: Object.fromEntries(files.map(file => [file, fs.readFileSync(path.join(root, file)).toString('base64')])) }, null, 2));
  fs.writeFileSync(path.join(out, 'source.diff'), git(['diff', '--', ...production, ...tests]));
  const artifacts = {};
  const visit = folder => { for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) visit(file); else if (entry.isFile()) artifacts[path.relative(base, file).replace(/\\/g, '/')] = sha(file);
  } };
  visit(base);
  fs.writeFileSync(path.join(out, 'artifact-manifest.json'), JSON.stringify({ artifacts, acceptance: 'pending independent review' }, null, 2));
  console.log(JSON.stringify({ out, head: identity.head, artifacts: Object.keys(artifacts).length })); process.exit(0);
}
const focused = [
  'src/persistence/__tests__/p6CharacterSave.production.test.jsx', 'src/persistence/__tests__/characterHandoffPreservation.test.js', 'src/persistence/__tests__/characterProjectionIsolation.test.js',
  'src/store/__tests__/waveB_characterRosterIsolation.test.js', 'src/services/__tests__/characterPersistence.test.js', 'src/persistence/__tests__/waveA_handoff.test.js',
  'src/persistence/__tests__/waveB_scopedStoreStorage.test.js', 'src/persistence/__tests__/waveB_scopedConsumer.test.js', 'src/store/__tests__/shareableStore.test.js',
  'src/hooks/__tests__/useJournalPersistence.lifecycleFences.test.js', 'src/hooks/__tests__/useJournalPersistence.ownerFence.test.js',
  'src/persistence/__tests__/PrivateProjectionBoundary.synchronousIsolation.test.js', 'src/persistence/__tests__/PrivateProjectionBoundary.missedActivation.test.js',
  'src/persistence/__tests__/registry.test.js', 'src/persistence/__tests__/waveB_b1b5Corrections.test.js', 'src/components/windows/__tests__/MythrillWindow.privateProjection.test.jsx',
  'src/components/multiplayer/__tests__/useSocketConnection.eligibility.test.js', 'src/persistence/__tests__/waveB_closureAcceptance.test.js', 'src/store/__tests__/combatStore.test.js',
  ...tests.filter(file => file.startsWith('vtt-react/')).map(file => file.slice('vtt-react/'.length)), 'src/services/__tests__/silentRoomHydration.test.js'
];
const preserved = { p5: '../p5-01/character-preservation-browser.cjs', p6: '../p6/character-save-browser.cjs', container: '../p6/container-browser.cjs', remaining: '../p6/remaining-browser.cjs', regressions: '../p6/regressions-browser.cjs' };
const commands = {
  dependencies: { cwd: path.join(root, 'server'), args: ['node_modules/mocha/bin/mocha.js',
    ...['p4CorrectionBoundary', 'roomAccessBoundary', 'roomAccessPrivacyProjection', 'productionSocketContract', 'p7Negative.production', 'deltaSync', 'roomCheckpoint', 'roomCheckpointCorrections', 'roomCheckpointFinalCorrections', 'roomCheckpointFinalTwoBlockers', 'roomSaveFinalClosure'].map(name => `tests/${name}.test.js`), '--timeout', '15000', '--exit'] },
  server: { cwd: path.join(root, 'server'), args: ['node_modules/mocha/bin/mocha.js', 'tests/p7Bounds.production.test.js', 'tests/p7Blockers.production.test.js', 'tests/p7Consequences.production.test.js', 'tests/p7ImportMetadata.production.test.js', 'tests/p7Lifecycle.production.test.js', '--timeout', '15000', '--exit'] },
  focused: { cwd: path.join(root, 'vtt-react'), args: ['node_modules/react-scripts/bin/react-scripts.js', 'test', '--watchAll=false', '--runInBand', '--silent', '--no-cache', '--runTestsByPath', ...focused] },
  lifecycle: { cwd: path.join(root, 'vtt-react'), args: ['verification/p7/lifecycle-browser.cjs'] },
  recovery: { cwd: path.join(root, 'vtt-react'), args: ['verification/p7/condition-recovery-browser.cjs', '--require-collection'] },
  owner: { cwd: path.join(root, 'vtt-react'), args: ['verification/p7/owner-condition-browser.cjs'] },
  bounds: { cwd: path.join(root, 'vtt-react'), args: ['verification/p7/bounds-browser.cjs'] },
  lint: { cwd: path.join(root, 'vtt-react'), args: ['node_modules/eslint/bin/eslint.js', ...production.map(file => path.join(root, file))] }
};
for (const [name, witness] of Object.entries(preserved)) commands[name] = { cwd: path.join(root, 'vtt-react'), args: ['--require', path.join(__dirname, 'preserved-output.cjs'), path.resolve(__dirname, witness)] };
const command = commands[mode]; if (!command) throw Error('Unknown mode ' + mode);
const env = { ...process.env, CI: 'true', NODE_OPTIONS: '--require=' + path.join(__dirname, 'lifecycle-output.cjs'),
  P7_LIFECYCLE_COMMAND_OUT: out, P7_LIFECYCLE_OUT: out, P7_BOUNDS_OUT: out, P7_RECOVERY_OUTPUT: path.join(out, 'recovery.json'), P7_PRESERVED_OUTPUT: path.join(out, 'preserved') };
const startedAt = new Date().toISOString();
const result = cp.spawnSync(process.execPath, command.args, { cwd: command.cwd, env, encoding: 'utf8', timeout: 180000, maxBuffer: 32 * 1024 * 1024 });
fs.writeFileSync(path.join(out, 'output.log'), (result.stdout || '') + (result.stderr || ''));
const after = hashes(), drift = files.filter(file => before[file] !== after[file]);
fs.writeFileSync(path.join(out, 'command.json'), JSON.stringify({ command: [process.execPath, ...command.args], cwd: command.cwd, environment: { CI: env.CI, NODE_OPTIONS: env.NODE_OPTIONS }, startedAt, endedAt: new Date().toISOString(), exit: result.status, error: result.error?.message, identity, afterHashes: after, drift }, null, 2));
console.log(JSON.stringify({ out, exit: result.status, drift }));
if (result.status !== 0) console.error((result.stderr || result.stdout || '').slice(-16000));
process.exit(result.status === 0 && !drift.length ? 0 : 1);
