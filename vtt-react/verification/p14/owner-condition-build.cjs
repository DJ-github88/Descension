// Run detached. Freeze normal production inputs; bulky source/build evidence stays external.
const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto');
const root = path.resolve(__dirname, '../../..'), frontend = path.join(root, 'vtt-react'), out = process.env.A8_BUILD_OUTPUT;
if (!out || !path.isAbsolute(out) || out.startsWith(root + path.sep)) throw Error('External A8_BUILD_OUTPUT required');
fs.mkdirSync(out, { recursive: true }); const mirror = path.join(out, 'workspace'); fs.mkdirSync(mirror);
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = [...walk(path.join(frontend, 'src')), ...walk(path.join(frontend, 'public')), ...fs.readdirSync(frontend).filter(n => /^(package(-lock)?\.json|craco\.config\.js|\.env(\..*)?|jsconfig\.json)$/.test(n)).map(n => path.join(frontend, n))], hashes = {};
for (const f of files) { const p = path.relative(frontend, f), dest = path.join(mirror, p); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.copyFileSync(f, dest); if (!path.basename(f).startsWith('.env')) hashes[p.replace(/\\/g, '/')] = sha(f); }
fs.symlinkSync(path.join(frontend, 'node_modules'), path.join(mirror, 'node_modules'), 'junction');
const fd = fs.openSync(path.join(out, 'build.log'), 'w'), startedAt = new Date().toISOString();
const result = cp.spawnSync(process.execPath, [path.join(mirror, 'node_modules/@craco/craco/dist/bin/craco.js'), 'build'], { cwd: mirror, env: { ...process.env, CI: '', NODE_OPTIONS: '--max-old-space-size=8192', BUILD_PATH: path.join(out, 'app') }, stdio: ['ignore', fd, fd], timeout: 900000 }); fs.closeSync(fd);
const drift = base => Object.entries(hashes).filter(([p, h]) => !fs.existsSync(path.join(base, p)) || sha(path.join(base, p)) !== h).map(([p]) => p);
const record = { exit: result.status, signal: result.signal, error: result.error?.message, startedAt, endedAt: new Date().toISOString(), hashes, mirrorDrift: drift(mirror), concurrentLiveDrift: drift(frontend), assetManifestSha256: fs.existsSync(path.join(out, 'app/asset-manifest.json')) ? sha(path.join(out, 'app/asset-manifest.json')) : null, config: 'Unmodified production CRACO/config/dependencies; external frozen workspace. Environment copied privately, not evidence.' };
fs.writeFileSync(path.join(out, 'build.json'), JSON.stringify(record, null, 2)); fs.writeFileSync(path.join(out, 'build.exit'), String(result.status)); process.exit(result.status === 0 ? 0 : 1);
