const fs = require('fs'), path = require('path'), cp = require('child_process'), zlib = require('zlib'), crypto = require('crypto');
const root = path.resolve(__dirname, '../../..'), out = path.join(__dirname, 'evidence/corrections-20261013');
const retry = process.argv[2] === 'retry';
const base = 'D:/AppData/Temp/opencode/p7-correction-' + (retry ? 'retry' : 'reviewed') + '-replay-20261013';
const sourceName = retry ? 'retry-before-source.json.gz' : 'reviewed-source.json.gz';
const snapshot = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(out, sourceName))));
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
for (const [file, content] of Object.entries(snapshot.files)) {
  const bytes = Buffer.from(content, 'base64'); if (hash(bytes) !== snapshot.hashes[file]) throw Error('Snapshot identity mismatch: ' + file);
  const target = path.join(base, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, bytes);
}
const witness = ['server/tests/p7Blockers.production.test.js', 'vtt-react/verification/p7/browser.cjs', 'vtt-react/verification/p7/correction-browser.cjs', 'vtt-react/verification/p6/character-save-browser.cjs', 'vtt-react/verification/p5-01/character-browser-harness.cjs'];
const manifest = {};
for (const file of witness) {const bytes = fs.readFileSync(path.join(root, file)); manifest[file] = hash(bytes); const target = path.join(base, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, bytes);}
for (const folder of ['server', 'vtt-react']) {
  const modules = path.join(base, folder, 'node_modules'); if (!fs.existsSync(modules)) fs.symlinkSync(path.join(root, folder, 'node_modules'), modules, 'junction');
  fs.copyFileSync(path.join(root, folder, 'package.json'), path.join(base, folder, 'package.json'));
}
fs.mkdirSync(path.join(base, 'vtt-react/verification/p7/evidence/corrections-20261013'), { recursive: true });
for (const [name, cwd, args] of [
  ['server', path.join(base, 'server'), [path.join(root, 'server/node_modules/mocha/bin/mocha.js'), 'tests/p7Blockers.production.test.js', '--timeout', '15000', '--exit']],
  ['browser', path.join(base, 'vtt-react'), ['verification/p7/correction-browser.cjs']]
]) {
  if (retry && name === 'server') continue;
  const result = cp.spawnSync(process.execPath, args, { cwd, encoding: 'utf8', timeout: 120000, maxBuffer: 32 * 1024 * 1024, env: { ...process.env, P7_CORRECTION_RED: retry ? '0' : '1', P7_ACK_ONLY_RED: retry ? '1' : '0', CI: 'true' } });
  const prefix = retry ? 'retry-replay-' : 'reviewed-replay-';
  fs.writeFileSync(path.join(out, prefix + name + '.log'), (result.stdout || '') + (result.stderr || ''));
  fs.writeFileSync(path.join(out, prefix + name + '.command.json'), JSON.stringify({ command: [process.execPath, ...args], cwd, status: result.status, source: sourceName, sourceFiles: Object.keys(snapshot.files).length, witnesses: manifest }, null, 2));
  console.log(name + ' reviewed-source RED replay: ' + result.status); console.log((result.stdout || '') + (result.stderr || ''));
  if (result.status !== 0) throw Error('Reviewed RED failed: ' + name);
  const suffix = retry ? '-ack-only-red.json' : '-red.json';
  fs.copyFileSync(path.join(base, 'vtt-react/verification/p7/evidence/corrections-20261013', name + suffix), path.join(out, prefix + name + suffix));
}
