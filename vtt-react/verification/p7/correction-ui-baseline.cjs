const fs = require('fs'), path = require('path'), zlib = require('zlib'), cp = require('child_process'), crypto = require('crypto');
const root = path.resolve(__dirname, '../../..'), out = path.join(__dirname, 'evidence/corrections-20261013');
const temporary = 'D:/AppData/Temp/opencode/p7-correction-ui-starting-20261013';
const snapshot = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(__dirname, 'evidence/starting-source.json.gz'))));
for (const [file, encoded] of Object.entries(snapshot.files)) {
  if (!file.startsWith('vtt-react/src/')) continue;
  const bytes = Buffer.from(encoded, 'base64'); if (crypto.createHash('sha256').update(bytes).digest('hex') !== snapshot.hashes[file]) throw Error('Source mismatch: ' + file);
  const target = path.join(temporary, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, bytes);
}
fs.copyFileSync(path.join(root, 'vtt-react/package.json'), path.join(temporary, 'vtt-react/package.json'));
const modules = path.join(temporary, 'vtt-react/node_modules'); if (!fs.existsSync(modules)) fs.symlinkSync(path.join(root, 'vtt-react/node_modules'), modules, 'junction');
const selection = ['src/data/classes/apex/__tests__/ApexResourceBar.test.jsx', 'src/data/classes/augur/__tests__/AugurResourceBar.test.jsx', 'src/components/account/__tests__/CharacterViewHeaderMounts.test.jsx', 'src/data/classes/revenant/__tests__/RevenantResourceBar.test.jsx', 'src/data/classes/warden/__tests__/GaolerResourceBar.test.jsx', 'src/data/classes/minstrel/components/__tests__/MinstrelStaveSmoke.test.jsx'];
const args = [path.join(root, 'vtt-react/node_modules/react-scripts/bin/react-scripts.js'), 'test', '--watchAll=false', '--runInBand', '--silent', '--no-cache', '--runTestsByPath', ...selection];
const result = cp.spawnSync(process.execPath, args, { cwd: path.join(temporary, 'vtt-react'), encoding: 'utf8', timeout: 120000, maxBuffer: 32 * 1024 * 1024, env: { ...process.env, CI: 'true' } });
fs.writeFileSync(path.join(out, 'styling-starting-comparison.log'), (result.stdout || '') + (result.stderr || ''));
fs.writeFileSync(path.join(out, 'styling-starting-comparison.json'), JSON.stringify({ command: [process.execPath, ...args], cwd: path.join(temporary, 'vtt-react'), status: result.status, source: 'starting-source.json.gz', testHashes: Object.fromEntries(selection.map(file => [file, snapshot.hashes['vtt-react/' + file]])) }, null, 2));
console.log((result.stdout || '') + (result.stderr || '')); process.exit(result.status ?? 1);
