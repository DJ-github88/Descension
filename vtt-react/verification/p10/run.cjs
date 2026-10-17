// Focused integration checks; all bulky output stays outside the checkout.
const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto');
const root = path.resolve(__dirname, '../../..'), frontend = path.join(root, 'vtt-react');
const out = process.env.P10_OUTPUT || 'D:/AppData/Temp/opencode/p10-integration-20261016';
const mode = process.argv[2];
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const git = args => cp.execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
const changed = git(['diff', '--name-only', '--', 'vtt-react/src', 'vtt-react/public/data']).trim().split(/\r?\n/).filter(Boolean);
const added = git(['ls-files', '--others', '--exclude-standard', '--', 'vtt-react/src']).trim().split(/\r?\n/).filter(Boolean);
const dependencies = [
  'src/hooks/useSessionManagement.js', 'src/hooks/useGameData.js', 'src/services/dataCache.js',
  'src/components/rules/RulesPage.jsx', 'src/services/featherSlash.js', 'src/services/spellConsequence.js',
  'src/services/actorConsequenceService.js', 'src/components/ui/ActionBar.jsx', 'src/components/hud/PartyHUD.jsx',
  'src/components/hud/SpellConsequencePanel.css', 'public/data/abilities.json', 'public/data/creatures.json',
  'package.json', 'package-lock.json', 'craco.config.js'
].map(p => 'vtt-react/' + p);
const inputs = [...new Set([...changed, ...added, ...dependencies])].sort();
const hashes = () => Object.fromEntries(inputs.map(p => [p, sha(fs.readFileSync(path.join(root, p)))]));
const allTests = git(['ls-files', '--cached', '--others', '--exclude-standard', '--', 'vtt-react/src']).split(/\r?\n/).filter(p => /\.test\.[jt]sx?$/.test(p));
const selection = /(?:firstTableLaws|FirstTableLawsRendered|combatStore|silentRoomHydration|roomHydrationCorrections|featherSlash|spellConsequence|p7BoundsConsumers|TalentTreeContent|RulesPageCodexRoute|ActionBar|SpellActionBar|SettingsWindow|Step7SkillsLanguages|wave[ABC]_|TokenTooltips|CreatureAbilityFanOut|BestiaryDisplay|LibraryBrowserModal|lootThematicExcerpt|useSessionManagement)/;
const tests = [...new Set(allTests.filter(p => selection.test(path.basename(p))))].map(p => p.slice('vtt-react/'.length)).sort();
const lint = inputs.filter(p => /\.[jt]sx?$/.test(p) && p.startsWith('vtt-react/src/')).map(p => p.slice('vtt-react/'.length));
const commands = {
  tests: ['node_modules/react-scripts/bin/react-scripts.js', 'test', '--watchAll=false', '--runInBand', '--silent', '--testTimeout=20000', '--runTestsByPath', ...tests],
  lint: ['node_modules/eslint/bin/eslint.js', '--format', 'json', ...lint],
  build: ['node_modules/@craco/craco/dist/bin/craco.js', 'build']
};
if (!commands[mode]) throw Error('Use tests, lint or build');
fs.mkdirSync(out, { recursive: true });
const before = hashes(), startedAt = new Date().toISOString();
const env = { ...process.env, CI: mode === 'build' ? '' : 'true', NODE_OPTIONS: '--max-old-space-size=8192', BUILD_PATH: path.join(out, 'build') };
const fd = fs.openSync(path.join(out, mode + '.log'), 'wx');
const result = cp.spawnSync(process.execPath, commands[mode], { cwd: frontend, env, stdio: ['ignore', fd, fd], timeout: 900000 });
fs.closeSync(fd);
const after = hashes(), drift = inputs.filter(p => before[p] !== after[p]);
const record = { head: git(['rev-parse', 'HEAD']).trim(), startedAt, endedAt: new Date().toISOString(), command: [process.execPath, ...commands[mode]], cwd: frontend,
  environment: { CI: env.CI, NODE_OPTIONS: env.NODE_OPTIONS, BUILD_PATH: env.BUILD_PATH }, exit: result.status, signal: result.signal, error: result.error?.message,
  before, after, drift, ...(mode === 'tests' ? { selection: tests } : {}) };
if (mode === 'build' && result.status === 0) record.assetManifestSha256 = sha(fs.readFileSync(path.join(out, 'build/asset-manifest.json')));
fs.writeFileSync(path.join(out, mode + '.json'), JSON.stringify(record, null, 2), { flag: 'wx' });
console.log(JSON.stringify({ mode, exit: result.status, drift, ...(mode === 'tests' ? { suitesSelected: tests.length } : {}), out }));
process.exit(result.status === 0 && !drift.length ? 0 : 1);
