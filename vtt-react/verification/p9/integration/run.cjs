// Run bounded checks into new integration evidence, without rewriting historical runners.
const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto');
const root = path.resolve(__dirname, '../../../..'), frontend = path.join(root, 'vtt-react');
const mode = process.argv[2], out = path.join(frontend, 'verification/p9/evidence/integration-20261015/sol', mode);
fs.mkdirSync(out, { recursive: true });
const focused = ['src/services/__tests__/featherSlash.test.js', 'src/services/__tests__/spellConsequence.test.js',
  'src/components/grid/__tests__/CreatureAbilityFanOut.test.js', 'src/components/ui/__tests__/ActionBarLegacyArcanoneerSpheres.test.jsx',
  'src/components/ui/__tests__/ActionBarP9Producer.test.jsx', 'src/components/hud/__tests__/PartyHUD.test.jsx',
  'src/components/character-sheet/__tests__/SpellActionBarP9Producer.test.jsx'];
const commands = {
  focused: ['node_modules/react-scripts/bin/react-scripts.js', 'test', '--watchAll=false', '--runInBand', '--silent', '--testTimeout=20000', '--runTestsByPath', ...focused],
  lint: ['node_modules/eslint/bin/eslint.js', 'src/services/featherSlash.js', 'src/services/__tests__/featherSlash.test.js', 'src/components/ui/ActionBar.jsx', 'src/components/hud/PartyHUD.jsx'],
  lifecycle: ['verification/p7/lifecycle-browser.cjs'],
  p8: ['verification/p8/browser.cjs'],
  rejoin: ['verification/p8/rejoin.cjs'],
  p9: ['verification/p9/browser.cjs'],
  build: ['node_modules/@craco/craco/dist/bin/craco.js', 'build']
};
commands['build-final'] = commands.build;
if (!commands[mode]) throw Error('Unknown mode ' + mode);
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, p))).digest('hex');
const inputs = cp.execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).split('\0')
  .filter(p => p && /^(vtt-react\/(src|public|verification\/(p7|p8))\/|server\/|vtt-react\/(package.*json|craco.config.js)$)/.test(p));
const hashes = () => Object.fromEntries(inputs.map(p => [p, hash(p)]));
const before = hashes(), startedAt = new Date().toISOString();
const env = { ...process.env, CI: mode === 'build' ? '' : 'true', NODE_OPTIONS: '--max-old-space-size=8192',
  P8_OUTPUT: out, P9_OUTPUT: out, P7_LIFECYCLE_OUT: out };
if (mode === 'build-final') { env.CI = ''; env.BUILD_PATH = path.join(out, 'app'); }
const fd = fs.openSync(path.join(out, 'output.log'), 'wx');
const result = cp.spawnSync(process.execPath, commands[mode], { cwd: frontend, env, stdio: ['ignore', fd, fd], timeout: 900000 });
fs.closeSync(fd);
const after = hashes(), drift = inputs.filter(p => before[p] !== after[p]);
const record = { command: [process.execPath, ...commands[mode]], cwd: frontend, startedAt, endedAt: new Date().toISOString(),
  exit: result.status, signal: result.signal, error: result.error?.message, environment: { CI: env.CI, NODE_OPTIONS: env.NODE_OPTIONS, BUILD_PATH: env.BUILD_PATH, P8_OUTPUT: out, P9_OUTPUT: out, P7_LIFECYCLE_OUT: out }, before, after, drift };
fs.writeFileSync(path.join(out, 'command.json'), JSON.stringify(record, null, 2), { flag: 'wx' });
fs.writeFileSync(path.join(out, 'exit.json'), JSON.stringify({ exit: result.status, signal: result.signal, drift, error: result.error?.message }), { flag: 'wx' });
console.log(JSON.stringify({ mode, out, exit: result.status, drift }));
process.exit(result.status === 0 && !drift.length ? 0 : 1);
