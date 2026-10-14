/** Exact commands, captured output, source identity and retained-evidence custody.
 * This is implementer verification, not independent acceptance. */
const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto');
const root = path.resolve(__dirname, '../../..');
const base = process.env.P7_LIFECYCLE_OUT || 'D:/AppData/Temp/opencode/p7-final-20261013/lifecycle';
const mode = process.argv[2] || 'green';
const out = path.join(base, mode + '-' + Date.now()); fs.mkdirSync(out, { recursive: true });
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const files = ['server/services/actorProjection.js', 'server/services/actorConsequences.js', 'server/services/roomAccessService.js',
  'server/handlers/actorConsequenceHandlers.js', 'server/handlers/tokenHandlers.js', 'server/handlers/socketHandlers.js', 'server/handlers/environmentHandlers.js', 'server/handlers/mapHandlers.js', 'server/handlers/syncHandlers.js', 'server/handlers/gmActionHandlers.js',
  'vtt-react/src/services/actorConsequenceService.js', 'vtt-react/src/services/actorProjectionOrder.js', 'vtt-react/src/services/silentRoomHydration.js',
  'vtt-react/src/components/multiplayer/roomJoinHandler.js', 'vtt-react/src/components/multiplayer/socketHandlers/tokenHandlers.js',
  'vtt-react/src/components/multiplayer/socketHandlers/audioGameSessionHandlers.js', 'vtt-react/src/components/multiplayer/socketHandlers/mapGridHandlers.js', 'vtt-react/src/components/multiplayer/socketHandlers/gmHandlers.js',
  'server/tests/p7Lifecycle.production.test.js', 'vtt-react/src/services/__tests__/actorProjectionOrder.test.js', 'vtt-react/src/services/__tests__/roomHydrationCorrections.test.js',
  'vtt-react/verification/p7/lifecycle-browser.cjs', 'vtt-react/verification/p7/lifecycle-checks.cjs', 'vtt-react/verification/p7/lifecycle-output.cjs'];
const hashes = () => Object.fromEntries(files.map(file => [file, sha(path.join(root, file))]));
const before = hashes();
const commands = {
  red: { cwd: path.join(root, 'vtt-react'), args: ['verification/p7/lifecycle-browser.cjs', '--red'] },
  green: { cwd: path.join(root, 'vtt-react'), args: ['verification/p7/lifecycle-browser.cjs'] },
  server: { cwd: path.join(root, 'server'), args: ['node_modules/mocha/bin/mocha.js', 'tests/p7Lifecycle.production.test.js', 'tests/p7Consequences.production.test.js', 'tests/p7ImportMetadata.production.test.js', '--timeout', '15000', '--exit'] },
  frontend: { cwd: path.join(root, 'vtt-react'), args: ['node_modules/react-scripts/bin/react-scripts.js', 'test', '--watchAll=false', '--runInBand', '--runTestsByPath', 'src/services/__tests__/actorProjectionOrder.test.js', 'src/services/__tests__/silentRoomHydration.test.js', 'src/services/__tests__/roomHydrationCorrections.test.js'] },
  lint: { cwd: path.join(root, 'vtt-react'), args: ['node_modules/eslint/bin/eslint.js', ...files.filter(file => file.endsWith('.js') && !file.includes('/__tests__/') && !file.includes('/tests/')).map(file => path.join(root, file))] }
};
const git = args => cp.execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const identity = { head: git(['rev-parse', 'HEAD']), status: git(['status', '--short']), hashes: before };
if (mode === 'seal') {
  const artifactHashes = {};
  const visit = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name); if (file === out) continue;
      if (entry.isDirectory()) visit(file); else if (entry.isFile()) artifactHashes[path.relative(base, file).replace(/\\/g, '/')] = sha(file);
    }
  };
  visit(base);
  fs.writeFileSync(path.join(out, 'identity.json'), JSON.stringify(identity, null, 2));
  fs.writeFileSync(path.join(out, 'artifact-manifest.json'), JSON.stringify({ identity, artifactHashes, excludes: 'this seal directory; identity is embedded here', acceptance: 'pending independent review' }, null, 2));
  console.log(JSON.stringify({ out, artifacts: Object.keys(artifactHashes).length, head: identity.head })); process.exit(0);
}
if (mode === 'custody') {
  const old = JSON.parse(fs.readFileSync('D:/AppData/Temp/opencode/p7-final-20261013/root-review/resume-20261014/before.json', 'utf8'));
  const differences = Object.entries(old.retainedHashes).filter(([file, hash]) => sha(file) !== hash).map(([file]) => file);
  const reviewBundle = JSON.parse(fs.readFileSync('D:/AppData/Temp/opencode/p7-final-20261013/root-review/resume-20261014/artifact-manifest.json', 'utf8'));
  const reviewBundleDrift = Object.entries(reviewBundle.hashes).filter(([file, hash]) => sha(file) !== hash).map(([file]) => file);
  const required = ['D:/AppData/Temp/opencode/p7-final-20261013/root-review/ordering-invariant.md', 'D:/AppData/Temp/opencode/p7-final-20261013/root-review/root-cause-review.md', 'D:/AppData/Temp/opencode/p7-rereview-20261013/review.md', 'D:/AppData/Temp/opencode/p7-rereview-20261013/lifecycle-probe.json', path.join(root, 'vtt-react/verification/p7/evidence/frozen-contract.md')];
  fs.writeFileSync(path.join(out, 'custody.json'), JSON.stringify({ identity, retainedCount: Object.keys(old.retainedHashes).length, differences, reviewBundleDrift, requiredHashes: Object.fromEntries(required.map(file => [file, sha(file)])) }, null, 2));
  console.log(JSON.stringify({ out, retainedCount: Object.keys(old.retainedHashes).length, differences, reviewBundleDrift })); process.exit(differences.length || reviewBundleDrift.length ? 1 : 0);
}
const command = commands[mode]; if (!command) throw Error('Unknown mode ' + mode);
const env = { ...process.env, CI: 'true', P7_LIFECYCLE_OUT: out, P7_LIFECYCLE_COMMAND_OUT: out,
  NODE_OPTIONS: '--require=' + path.join(__dirname, 'lifecycle-output.cjs') };
const startedAt = new Date().toISOString();
const result = cp.spawnSync(process.execPath, command.args, { cwd: command.cwd, env, encoding: 'utf8', timeout: 120000, maxBuffer: 16 * 1024 * 1024 });
fs.writeFileSync(path.join(out, 'output.log'), (result.stdout || '') + (result.stderr || ''));
const after = hashes(), drift = files.filter(file => before[file] !== after[file]);
const record = { command: [process.execPath, ...command.args], cwd: command.cwd, environment: { CI: env.CI, NODE_OPTIONS: env.NODE_OPTIONS, P7_LIFECYCLE_OUT: out },
  startedAt, endedAt: new Date().toISOString(), exit: result.status, signal: result.signal, error: result.error?.message, identity, afterHashes: after, drift };
fs.writeFileSync(path.join(out, 'command.json'), JSON.stringify(record, null, 2));
console.log(JSON.stringify({ out, exit: result.status, drift }));
if (result.status !== 0) console.error((result.stderr || result.stdout || '').slice(-14000));
process.exit(result.status === 0 && !drift.length ? 0 : 1);
