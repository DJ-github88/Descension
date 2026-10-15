// Freeze current frontend inputs in an isolated build workspace while other owners edit.
// No runtime instrumentation, code substitution or changed compiler configuration.
const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto'), zlib = require('zlib');
const root = path.resolve(__dirname, '../../../..'), frontend = path.join(root, 'vtt-react');
const out = path.join(frontend, 'verification/p9/evidence/integration-20261015/sol/build-snapshot');
const mirror = path.join('D:/AppData/Temp/opencode', 'p8-p9-final-' + Date.now());
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
fs.mkdirSync(out, { recursive: true }); fs.mkdirSync(mirror);
const files = [...walk(path.join(frontend, 'src')), ...walk(path.join(frontend, 'public')),
  ...fs.readdirSync(frontend).filter(n => /^(package(-lock)?\.json|craco\.config\.js|\.env(\..*)?|jsconfig\.json)$/.test(n)).map(n => path.join(frontend, n))];
const hashes = {}, sources = {};
for (const f of files) {
  const relative = path.relative(frontend, f), bytes = fs.readFileSync(f), destination = path.join(mirror, relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true }); fs.writeFileSync(destination, bytes);
  if (!path.basename(f).startsWith('.env')) {
    hashes['vtt-react/' + relative.replace(/\\/g, '/')] = sha(bytes);
    if (relative.startsWith('src' + path.sep) || relative.startsWith('public' + path.sep + 'data' + path.sep) || relative.endsWith('config.js')) sources[relative.replace(/\\/g, '/')] = bytes.toString('base64');
  }
}
fs.symlinkSync(path.join(frontend, 'node_modules'), path.join(mirror, 'node_modules'), 'junction');
const startedAt = new Date().toISOString(), snapshot = { startedAt, hashes, files: sources };
fs.writeFileSync(path.join(out, 'source.json.gz'), zlib.gzipSync(Buffer.from(JSON.stringify(snapshot))));
const fd = fs.openSync(path.join(out, 'output.log'), 'wx');
const command = [path.join(mirror, 'node_modules/@craco/craco/dist/bin/craco.js'), 'build'];
const result = cp.spawnSync(process.execPath, command, { cwd: mirror, env: { ...process.env, CI: '', NODE_OPTIONS: '--max-old-space-size=8192', BUILD_PATH: path.join(out, 'app') }, stdio: ['ignore', fd, fd], timeout: 900000 });
fs.closeSync(fd);
const mirrorDrift = Object.keys(hashes).filter(p => sha(fs.readFileSync(path.join(mirror, p.slice('vtt-react/'.length)))) !== hashes[p]);
const concurrentLiveDrift = Object.keys(hashes).filter(p => sha(fs.readFileSync(path.join(root, p))) !== hashes[p]);
const record = { command: [process.execPath, ...command], cwd: mirror, startedAt, endedAt: new Date().toISOString(), exit: result.status, signal: result.signal,
  error: result.error?.message, snapshotSha256: sha(fs.readFileSync(path.join(out, 'source.json.gz'))), hashes, mirrorDrift, concurrentLiveDrift,
  config: 'Unmodified CRACO production config/package and dependencies; .env files copied only to temporary workspace, not evidence.' };
fs.writeFileSync(path.join(out, 'command.json'), JSON.stringify(record, null, 2), { flag: 'wx' });
fs.writeFileSync(path.join(out, 'exit.json'), JSON.stringify({ exit: result.status, mirrorDrift, concurrentLiveDrift }), { flag: 'wx' });
process.exit(result.status === 0 && !mirrorDrift.length ? 0 : 1);
