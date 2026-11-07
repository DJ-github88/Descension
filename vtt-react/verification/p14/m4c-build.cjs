// Detached only. One immutable integrated capture; unrelated files added later do not corrupt frozen checks.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process'), assert = require('assert/strict');
const live = path.resolve(__dirname, '../../..'), out = process.env.M4C_BUILD_OUTPUT;
assert(out && path.isAbsolute(out) && !out.startsWith(live + path.sep));
const root = path.join(out, 'root'), sha = raw => crypto.createHash('sha256').update(raw).digest('hex');
const save = (name, value) => fs.writeFileSync(path.join(out, name), JSON.stringify(value, null, 2));
const walk = (relative) => fs.readdirSync(path.join(live, relative), { withFileTypes: true }).flatMap(e => {
  if (['node_modules', '.git', 'logs', 'build', 'coverage', 'evidence'].includes(e.name) || e.name.startsWith('.env') || /service.account|firebase-adminsdk/i.test(e.name)) return [];
  const p = relative + '/' + e.name; return e.isDirectory() ? walk(p) : [p];
});
try {
  assert(fs.existsSync(out) && !fs.existsSync(root));
  const files = ['vtt-react/src', 'vtt-react/public', 'vtt-react/verification/p7', 'vtt-react/verification/p9/integration', 'vtt-react/verification/p14', 'server'].flatMap(walk)
    .concat(['vtt-react/package.json', 'vtt-react/package-lock.json', 'vtt-react/craco.config.js', 'vtt-react/.eslintrc.js']).sort();
  const hashes = base => Object.fromEntries(files.map(p => [p, fs.existsSync(path.join(base, p)) ? sha(fs.readFileSync(path.join(base, p))) : null]));
  const before = hashes(live);
  const sockets = {
    'vtt-react/src/services/socketReconnectAuth.js': '282297226f659d1a79c9af22afa4d22d037856288994797d476bb67c7ada7721',
    'vtt-react/src/components/multiplayer/useSocketConnection.js': 'e7a0efeee2cdbf722c957428024afdc11b01161226d50b120b91e1676223822f',
    'vtt-react/src/store/presenceStore.js': '4a94399fbc1aa5d2f3b62300a252c7ab13c528304a26e918449c92135ef47035',
    'vtt-react/src/components/multiplayer/__tests__/useSocketConnection.authFailure.test.js': 'f4a34d92fddc87c0afee14dcbbb274f6ce44737325215f48cd99dfc165c806a3',
    'vtt-react/src/store/__tests__/presenceReconnectAuth.test.js': 'd25c074a4c0d6e134df06e3534057a49483262650dc25d2778165ad9b57a65a1',
    'vtt-react/src/persistence/__tests__/waveA_guestPresenceSocketIdentity.test.js': 'eea6dbac8263de56dab19a56f81f7d2355d0b001fe73bf7ac137ad5a4af35045'
  };
  for (const [file, expected] of Object.entries(sockets)) assert.equal(before[file], expected, 'Released socket identity changed: ' + file);
  save('capture-before.json', before);
  for (const p of files) { const target = path.join(root, p); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.copyFileSync(path.join(live, p), target); }
  assert.deepEqual(hashes(live), before, 'Live drift during capture'); assert.deepEqual(hashes(root), before);
  for (const dir of ['server', 'vtt-react']) fs.symlinkSync(path.join(live, dir, 'node_modules'), path.join(root, dir, 'node_modules'), 'junction');
  const captureHash = sha(JSON.stringify(before)); save('capture.json', { at: new Date().toISOString(), captureHash, files: before, releasedSockets: sockets });
  const fd = fs.openSync(path.join(out, 'build.log'), 'wx');
  const result = cp.spawnSync(process.execPath, [path.join(root, 'vtt-react/node_modules/@craco/craco/dist/bin/craco.js'), 'build'], {
    cwd: path.join(root, 'vtt-react'), env: Object.assign({}, process.env, { CI: '', NODE_OPTIONS: '--max-old-space-size=8192', BUILD_PATH: path.join(out, 'build') }), stdio: ['ignore', fd, fd], timeout: 900000 });
  fs.closeSync(fd);
  const frozen = hashes(root), after = hashes(live), asset = path.join(out, 'build/asset-manifest.json');
  save('build.json', { exit: result.status, error: result.error?.message || null, captureHash, at: new Date().toISOString(),
    frozenDrift: files.filter(p => before[p] !== frozen[p]), liveDrift: files.filter(p => before[p] !== after[p]),
    assetManifestSha256: fs.existsSync(asset) ? sha(fs.readFileSync(asset)) : null });
  fs.writeFileSync(path.join(out, 'build.exit'), String(result.status));
} catch (e) { fs.writeFileSync(path.join(out, 'failure.txt'), e.stack); fs.writeFileSync(path.join(out, 'build.exit'), 'failed'); process.exitCode = 1; }
