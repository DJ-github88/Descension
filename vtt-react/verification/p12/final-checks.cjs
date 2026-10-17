// Scoped final source identity/lint/whitespace checks. Outputs stay outside Git.
const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto');
const root = path.resolve(__dirname, '../../..'), frontend = path.join(root, 'vtt-react'), out = process.env.P12_OUTPUT, build = process.env.P12_BUILD_OUTPUT;
if (!out || !build) throw Error('External P12_OUTPUT and P12_BUILD_OUTPUT required');
fs.mkdirSync(out, { recursive: true });
const front = ['src/services/weaponStrike.js', 'src/services/weaponStrikeService.js', 'src/services/weaponStrikeCustody.js',
  'src/services/__tests__/weaponStrike.test.js', 'src/components/hud/WeaponStrikePanel.jsx', 'src/components/hud/PartyHUD.jsx',
  'src/components/ui/ActionBar.jsx', 'src/components/ui/SpellCastConfirmation.jsx', 'src/components/character-sheet/SpellActionBar.jsx',
  'src/components/multiplayer/socketHandlers/registerAllHandlers.js', 'src/persistence/privateStorageRegistry.js'];
const server = ['services/strikeApprovals.js', 'services/actorConsequences.js', 'handlers/actorConsequenceHandlers.js',
  'handlers/socketHandlers.js', 'services/rateLimitService.js', 'tests/p12aWeaponStrike.production.test.js'];
const reports = ['docs/MYTHRILL_PROJECT_12A_IMPLEMENTATION.md', 'docs/MYTHRILL_P12A_INDEPENDENT_REVIEW_20261016.md',
  'docs/MYTHRILL_PROJECT_12_CONTRACT.md', 'docs/MYTHRILL_PROJECT_11_IMPLEMENTATION.md', 'docs/ENGINEERING_STATE.md', 'docs/ai/CURRENT_PRIORITIES.md'];
const files = [...front.map(f => 'vtt-react/' + f), ...server.map(f => 'server/' + f), ...reports, 'vtt-react/src/components/hud/WeaponStrikePanel.css',
  ...fs.readdirSync(__dirname).filter(f => /\.(cjs|md)$/.test(f)).map(f => 'vtt-react/verification/p12/' + f)];
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const hashes = Object.fromEntries(files.map(f => [f, sha(fs.readFileSync(path.join(root, f)))]));
const newFiles = new Set(cp.execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8' }).split(/\r?\n/));
// Whole-file checks apply to additions; tracked changes are checked by git below.
// Incumbent trailing whitespace is retained, not attributed to this scoped change.
const whitespace = files.filter(f => newFiles.has(f)).flatMap(f => fs.readFileSync(path.join(root, f), 'utf8').split(/\r?\n/).flatMap((line, i) => /[ \t]+$/.test(line) ? [`${f}:${i + 1}`] : []));
function run(name, cwd, args) {
  const result = cp.spawnSync(process.execPath, args, { cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  fs.writeFileSync(path.join(out, name + '.log'), (result.stdout || '') + (result.stderr || ''));
  return { exit: result.status, command: [process.execPath, ...args] };
}
const prior = process.env.P12_REUSE_LINT === '1' ? JSON.parse(fs.readFileSync(path.join(out, 'final-checks.json'))) : null;
if (prior && [...front.map(f => 'vtt-react/' + f), ...server.map(f => 'server/' + f)].some(f => hashes[f] !== prior.hashes[f])) throw Error('Lint source changed; rerun without P12_REUSE_LINT');
const clientLint = prior?.clientLint || run('client-lint', frontend, ['node_modules/eslint/bin/eslint.js', '--format', 'json', ...front]);
const serverLint = prior?.serverLint || run('server-lint', path.join(root, 'server'), ['node_modules/eslint/bin/eslint.js', '--format', 'json', ...server]);
const tracked = cp.spawnSync('git', ['diff', '--check', '--', ...files], { cwd: root, encoding: 'utf8' });
fs.writeFileSync(path.join(out, 'tracked-whitespace.log'), (tracked.stdout || '') + (tracked.stderr || ''));
const snapshot = JSON.parse(fs.readFileSync(path.join(build, 'build.json')));
const relevantBuildDrift = front.filter(f => !f.includes('__tests__') && snapshot.hashes[f] !== hashes['vtt-react/' + f]);
const result = { head: cp.execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), hashes, whitespace,
  clientLint, serverLint, trackedWhitespaceExit: tracked.status, relevantBuildDrift, assetManifestSha256: snapshot.assetManifestSha256,
  passed: clientLint.exit === 0 && serverLint.exit === 0 && tracked.status === 0 && !whitespace.length && !relevantBuildDrift.length };
fs.writeFileSync(path.join(out, 'final-checks.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify({ ...result, hashes: `${Object.keys(hashes).length} source/report hashes retained externally` }));
process.exit(result.passed ? 0 : 1);
