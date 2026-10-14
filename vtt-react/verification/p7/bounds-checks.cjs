// Focused implementer evidence. Acceptance belongs to the independent reviewer.
const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto');
const root = path.resolve(__dirname, '../../..'), base = 'D:/AppData/Temp/opencode/p7-final-20261013/bounds';
const mode = process.argv[2] || 'server', out = path.join(base, mode + '-' + Date.now()); fs.mkdirSync(out, { recursive: true });
const files = ['server/services/actorConsequences.js', 'server/handlers/socketHandlers.js', 'server/handlers/tokenHandlers.js', 'server/handlers/environmentHandlers.js', 'server/handlers/characterHandlers.js',
  'vtt-react/src/components/multiplayer/socketHandlers/tokenHandlers.js', 'vtt-react/src/components/multiplayer/socketHandlers/characterHandlers.js', 'vtt-react/src/store/characterTokenStore.js', 'vtt-react/src/store/characterSlices/multiplayerSlice.js',
  'server/tests/p7Bounds.production.test.js', 'server/tests/p7Blockers.production.test.js', 'vtt-react/verification/p7/bounds-checks.cjs',
  'server/services/actorProjection.js', 'server/handlers/roomLifecycleHandlers.js', 'server/services/roomAccessService.js',
  'vtt-react/src/services/actorConsequenceService.js', 'vtt-react/src/services/actorProjectionOrder.js', 'vtt-react/src/services/silentRoomHydration.js',
  'vtt-react/src/services/__tests__/p7BoundsConsumers.test.js', 'vtt-react/verification/p7/bounds-red-source.cjs', 'vtt-react/verification/p7/bounds-browser.cjs'];
const hashes = () => Object.fromEntries(files.map(file => [file, crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex')]));
const before = hashes(), identity = { head: cp.execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), status: cp.execFileSync('git', ['status', '--short'], { cwd: root, encoding: 'utf8' }), hashes: before };
if (mode === 'before') {
  fs.writeFileSync(path.join(base, 'source-before.json'), JSON.stringify({ identity, files: Object.fromEntries(files.map(file => [file, fs.readFileSync(path.join(root, file)).toString('base64')])) }, null, 2), { flag: 'wx' });
  console.log(out); process.exit(0);
}
if (mode === 'seal') {
  fs.writeFileSync(path.join(out, 'source-final.json'), JSON.stringify({ identity, files: Object.fromEntries(files.map(file => [file, fs.readFileSync(path.join(root, file)).toString('base64')])) }, null, 2), { flag: 'wx' });
  fs.writeFileSync(path.join(out, 'focal.diff'), cp.execFileSync('git', ['diff', '--', ...files], { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }));
  const after = hashes(), drift = files.filter(file => before[file] !== after[file]);
  fs.writeFileSync(path.join(out, 'command.json'), JSON.stringify({ command: process.argv, cwd: process.cwd(), identity, afterHashes: after, drift, acceptance: 'Independent review pending' }, null, 2));
  const artifacts = {};
  const walk = folder => { for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const full = path.join(folder, entry.name);
    if (entry.isDirectory()) walk(full); else artifacts[path.relative(base, full).replace(/\\/g, '/')] = crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
  } };
  walk(base);
  fs.writeFileSync(path.join(out, 'artifact-manifest.json'), JSON.stringify(artifacts, null, 2));
  console.log(JSON.stringify({ out, artifacts: Object.keys(artifacts).length, drift })); process.exit(drift.length ? 1 : 0);
}
const commands = {
  red: { cwd: path.join(root, 'server'), args: ['node_modules/mocha/bin/mocha.js', 'tests/p7Bounds.production.test.js', '--timeout', '15000', '--exit'] },
  replay: { cwd: path.join(root, 'server'), args: ['node_modules/mocha/bin/mocha.js', 'tests/p7Bounds.production.test.js', '--grep', 'exact historical', '--timeout', '15000', '--exit'] },
  server: { cwd: path.join(root, 'server'), args: ['node_modules/mocha/bin/mocha.js', 'tests/p7Bounds.production.test.js', 'tests/p7Blockers.production.test.js', 'tests/p7Consequences.production.test.js', 'tests/p7ImportMetadata.production.test.js', 'tests/p7Lifecycle.production.test.js', '--timeout', '15000', '--exit'] },
  frontend: { cwd: path.join(root, 'vtt-react'), args: ['node_modules/react-scripts/bin/react-scripts.js', 'test', '--watchAll=false', '--runInBand', '--runTestsByPath', 'src/services/__tests__/p7BoundsConsumers.test.js', 'src/services/__tests__/actorProjectionOrder.test.js', 'src/services/__tests__/roomHydrationCorrections.test.js', 'src/services/__tests__/silentRoomHydration.test.js'] },
  browser: { cwd: path.join(root, 'vtt-react'), args: ['verification/p7/bounds-browser.cjs'] },
  lint: { cwd: path.join(root, 'vtt-react'), args: ['node_modules/eslint/bin/eslint.js', ...files.filter(file => file.endsWith('.js') && !file.includes('/tests/') && !file.includes('/__tests__/')).map(file => path.join(root, file))] }
};
const command = commands[mode]; if (!command) throw Error('Unknown mode ' + mode);
const startedAt = new Date().toISOString(), env = { ...process.env, CI: 'true', P7_BOUNDS_OUT: out, P7_LIFECYCLE_COMMAND_OUT: out, NODE_OPTIONS: '--require=' + path.join(__dirname, 'lifecycle-output.cjs') };
if (mode === 'replay') env.NODE_OPTIONS += ' --require=' + path.join(__dirname, 'bounds-red-source.cjs');
const result = cp.spawnSync(process.execPath, command.args, { cwd: command.cwd, env, encoding: 'utf8', timeout: 120000, maxBuffer: 16 * 1024 * 1024 });
fs.writeFileSync(path.join(out, 'output.log'), (result.stdout || '') + (result.stderr || ''));
const after = hashes(), drift = files.filter(file => before[file] !== after[file]);
fs.writeFileSync(path.join(out, 'command.json'), JSON.stringify({ outer: process.argv, command: [process.execPath, ...command.args], cwd: command.cwd, environment: { CI: env.CI, NODE_OPTIONS: env.NODE_OPTIONS, P7_BOUNDS_OUT: out }, startedAt, endedAt: new Date().toISOString(), exit: result.status, error: result.error?.message, identity, afterHashes: after, drift }, null, 2));
console.log(JSON.stringify({ out, exit: result.status, drift }));
if (result.status !== 0) console.error((result.stderr || result.stdout || '').slice(-16000));
process.exit(result.status === 0 && !drift.length ? 0 : 1);
