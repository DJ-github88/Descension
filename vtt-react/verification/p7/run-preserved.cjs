// Run the untouched witness as Node's MAIN module. Redirect only its outputs.
const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto');
const selected = process.argv[2], root = path.resolve(__dirname, '../../..');
const allowed = { p6: 'vtt-react/verification/p6/character-save-browser.cjs', p5: 'vtt-react/verification/p5-01/character-preservation-browser.cjs', container: 'vtt-react/verification/p6/container-browser.cjs', remaining: 'vtt-react/verification/p6/remaining-browser.cjs', regressions: 'vtt-react/verification/p6/regressions-browser.cjs' };
if (!allowed[selected]) throw Error('Unknown preserved witness');
const output = path.join(__dirname, 'evidence', 'retained-' + selected);
fs.mkdirSync(output, { recursive: true });
const witness = path.join(root, allowed[selected]);
const args = ['--require', path.join(__dirname, 'preserved-output.cjs'), witness];
const result = cp.spawnSync(process.execPath, args, { cwd: path.join(root, 'vtt-react'), env: { ...process.env, P7_PRESERVED_OUTPUT: output }, encoding: 'utf8', timeout: 180000, maxBuffer: 32 * 1024 * 1024 });
fs.writeFileSync(path.join(output, 'run.log'), (result.stdout || '') + (result.stderr || ''));
const record = { command: [process.execPath, ...args], status: result.status, error: result.error?.message || null,
  sourceSha256: crypto.createHash('sha256').update(fs.readFileSync(witness)).digest('hex') };
fs.writeFileSync(path.join(output, 'run.json'), JSON.stringify(record, null, 2));
console.log(JSON.stringify(record, null, 2));
process.exit(result.status ?? 1);
