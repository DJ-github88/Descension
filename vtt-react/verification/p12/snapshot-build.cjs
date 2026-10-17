// One frozen production compile when the live checkout has concurrent writers.
// Detached launcher only. All sources, assets, configuration and bulky evidence stay outside Git.
const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto');
const frontend = path.resolve(__dirname, '../..'), out = process.env.P12_BUILD_OUTPUT;
if (!out || !path.isAbsolute(out) || out.startsWith(frontend)) throw Error('P12_BUILD_OUTPUT must be an absolute external directory.');
const mirror = path.join(out, 'workspace'), sha = b => crypto.createHash('sha256').update(b).digest('hex');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
fs.mkdirSync(mirror, { recursive: true });
const files = [...walk(path.join(frontend, 'src')), ...walk(path.join(frontend, 'public')),
  ...fs.readdirSync(frontend).filter(n => /^(package(-lock)?\.json|craco\.config\.js|\.env(\..*)?|jsconfig\.json)$/.test(n)).map(n => path.join(frontend, n))];
const hashes = {};
for (const file of files) {
  const relative = path.relative(frontend, file), bytes = fs.readFileSync(file), destination = path.join(mirror, relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true }); fs.writeFileSync(destination, bytes);
  if (!path.basename(file).startsWith('.env')) hashes[relative.replace(/\\/g, '/')] = sha(bytes);
}
fs.symlinkSync(path.join(frontend, 'node_modules'), path.join(mirror, 'node_modules'), 'junction');
// Parse the actual snapshot before invoking expensive webpack compilation.
const parser = require('@babel/parser');
for (const relative of Object.keys(hashes).filter(f => f.startsWith('src/') && /\.[jt]sx?$/.test(f))) parser.parse(fs.readFileSync(path.join(mirror, relative), 'utf8'), { sourceType: 'unambiguous', plugins: ['jsx'] });
const startedAt = new Date().toISOString(), fd = fs.openSync(path.join(out, 'build.log'), 'wx');
const command = [path.join(mirror, 'node_modules/@craco/craco/dist/bin/craco.js'), 'build'];
const result = cp.spawnSync(process.execPath, command, { cwd: mirror, env: { ...process.env, CI: '', NODE_OPTIONS: '--max-old-space-size=8192', BUILD_PATH: path.join(out, 'build') }, stdio: ['ignore', fd, fd], timeout: 900000 });
fs.closeSync(fd);
const drift = base => Object.keys(hashes).filter(p => !fs.existsSync(path.join(base, p)) || sha(fs.readFileSync(path.join(base, p))) !== hashes[p]);
const mirrorDrift = drift(mirror), concurrentLiveDrift = drift(frontend);
const record = { startedAt, endedAt: new Date().toISOString(), command: [process.execPath, ...command], cwd: mirror, exit: result.status, error: result.error?.message,
  hashes, mirrorDrift, concurrentLiveDrift, config: 'Unmodified production source/config/dependencies. Secret env configuration copied only inside external workspace; never included in manifest.' };
if (result.status === 0) record.assetManifestSha256 = sha(fs.readFileSync(path.join(out, 'build/asset-manifest.json')));
fs.writeFileSync(path.join(out, 'build.json'), JSON.stringify(record, null, 2), { flag: 'wx' });
console.log(JSON.stringify({ exit: result.status, mirrorDrift, concurrentLiveDrift, out }));
process.exit(result.status === 0 && !mirrorDrift.length ? 0 : 1);
