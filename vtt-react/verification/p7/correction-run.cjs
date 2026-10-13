const cp = require('child_process'), fs = require('fs'), path = require('path');
const [name, cwd, ...command] = process.argv.slice(2), out = path.join(__dirname, 'evidence/corrections-20261013');
const start = Date.now();
const result = cp.spawnSync(command[0], command.slice(1), { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env: { ...process.env, CI: 'true', NODE_OPTIONS: '--require=' + path.join(__dirname, 'correction-output.cjs') } });
fs.writeFileSync(path.join(out, name + '.log'), (result.stdout || '') + (result.stderr || ''));
fs.writeFileSync(path.join(out, name + '.command.json'), JSON.stringify({ command, cwd, status: result.status, error: result.error?.message, durationMs: Date.now() - start }, null, 2));
console.log(name + ': exit ' + result.status); console.log((result.stdout || '') + (result.stderr || ''));
process.exit(result.status ?? 1);
