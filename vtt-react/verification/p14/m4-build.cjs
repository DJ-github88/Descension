// One detached build on a guarded source capture. No live source/config/dependency writes.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process'), assert = require('assert/strict');
const live = path.resolve(__dirname, '../../..'), out = process.env.M4_OUTPUT;
assert.ok(out && path.isAbsolute(out) && !out.startsWith(live + path.sep), 'External M4_OUTPUT required');
const root = path.join(out, 'root'), sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const save = (name, value) => fs.writeFileSync(path.join(out, name), JSON.stringify(value, null, 2));
const walk = (base, relative) => fs.readdirSync(path.join(base, relative), { withFileTypes: true }).flatMap(e => {
  if (['node_modules', '.git', 'logs', 'build', 'coverage', 'evidence'].includes(e.name) || e.name.startsWith('.env') || /service.account|firebase-adminsdk/i.test(e.name)) return [];
  const p = relative + '/' + e.name;
  return e.isDirectory() ? walk(base, p) : [p];
});
const inputs = () => ['vtt-react/src', 'vtt-react/public', 'vtt-react/verification/p7', 'vtt-react/verification/p9/integration', 'vtt-react/verification/p14', 'server'].flatMap(p => walk(live, p))
  .concat(['vtt-react/package.json', 'vtt-react/package-lock.json', 'vtt-react/craco.config.js', 'vtt-react/.eslintrc.json'].filter(p => fs.existsSync(path.join(live, p))));
const hashes = base => Object.fromEntries(inputs().sort().map(p => [p, sha(fs.readFileSync(path.join(base, p)))]));
function main() {
  assert.ok(fs.existsSync(out)); assert.ok(!fs.existsSync(root), 'Never overwrite a prior capture');
  const before = hashes(live); save('capture-before.json', before);
  for (const p of Object.keys(before)) { const target = path.join(root, p); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.copyFileSync(path.join(live, p), target); }
  assert.deepEqual(hashes(live), before, 'Live changed during capture'); assert.deepEqual(hashes(root), before, 'Copy drift');
  for (const dir of ['server', 'vtt-react']) fs.symlinkSync(path.join(live, dir, 'node_modules'), path.join(root, dir, 'node_modules'), 'junction');
  const captureHash = sha(JSON.stringify(before)); save('capture.json', { captureHash, files: before, at: new Date().toISOString() });
  const fd = fs.openSync(path.join(out, 'build.log'), 'wx');
  const result = cp.spawnSync(process.execPath, [path.join(root, 'vtt-react/node_modules/@craco/craco/dist/bin/craco.js'), 'build'], { cwd: path.join(root, 'vtt-react'),
    env: Object.assign({}, process.env, { CI: '', NODE_OPTIONS: '--max-old-space-size=8192', BUILD_PATH: path.join(out, 'build') }), stdio: ['ignore', fd, fd], timeout: 900000 }); fs.closeSync(fd);
  const after = hashes(live), frozen = hashes(root), asset = path.join(out, 'build/asset-manifest.json');
  save('build.json', { exit: result.status, error: result.error?.message || null, captureHash, at: new Date().toISOString(),
    frozenDrift: Object.keys(before).filter(p => before[p] !== frozen[p]), liveDrift: Object.keys(after).filter(p => before[p] !== after[p]),
    assetManifestSha256: fs.existsSync(asset) ? sha(fs.readFileSync(asset)) : null });
  fs.writeFileSync(path.join(out, 'build.exit'), String(result.status));
}
try { main(); } catch (e) { fs.writeFileSync(path.join(out, 'failure.txt'), e.stack); fs.writeFileSync(path.join(out, 'build.exit'), 'failed'); process.exitCode = 1; }
