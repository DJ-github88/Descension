// P9 implementer custody/verification runner. Independent acceptance is a separate execution.
// Usage (cwd vtt-react): P9_OUTPUT=<new dir> node verification/p9/checks.cjs <server|server-p7|focused|browser|lint|seal>
const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto');
const root = path.resolve(__dirname, '../../..');
const base = process.env.P9_OUTPUT;
if (!base) throw Error('P9_OUTPUT required');
const mode = process.argv[2], out = path.join(base, `${mode}-${Date.now()}`);
fs.mkdirSync(out, { recursive: true });
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
// P9 production/test/witness bytes plus the accepted P8 principal identities they must not drift.
const p9 = [
  'docs/MYTHRILL_PROJECT_9_CONTRACT.md',
  'server/services/spellPayments.js', 'server/services/actorConsequences.js', 'server/handlers/actorConsequenceHandlers.js',
  'server/handlers/characterHandlers.js', 'server/handlers/socketHandlers.js', 'server/services/rateLimitService.js',
  'server/tests/p9SpellConsequences.production.test.js',
  ...['spellConsequence.js', 'spellConsequenceService.js', 'spellConsequenceCustody.js', 'actorConsequenceService.js', '__tests__/spellConsequence.test.js'].map(p => 'vtt-react/src/services/' + p),
  'vtt-react/src/components/hud/SpellConsequencePanel.jsx', 'vtt-react/src/components/hud/SpellConsequencePanel.css', 'vtt-react/src/components/hud/PartyHUD.jsx',
  'vtt-react/src/components/ui/ActionBar.jsx', 'vtt-react/src/components/ui/SpellCastConfirmation.jsx', 'vtt-react/src/components/ui/__tests__/ActionBarP9Producer.test.jsx',
  'vtt-react/src/components/character-sheet/SpellActionBar.jsx', 'vtt-react/src/components/character-sheet/__tests__/SpellActionBarP9Producer.test.jsx',
  'vtt-react/src/data/classes/arcanoneer/components/ArcanoneerResourceBar.jsx', 'vtt-react/src/persistence/privateStorageRegistry.js',
  'vtt-react/src/components/multiplayer/socketHandlers/registerAllHandlers.js',
  ...['README.md', 'checks.cjs', 'fixture.cjs', 'browser.cjs'].map(p => 'vtt-react/verification/p9/' + p)
];
const acceptedP8 = {
  'vtt-react/src/components/grid/CreatureAbilityQuickUse.jsx': 'f8f5654578981e482751b4a48ebef54b4774bbe0f43db1c7cb6943614e423b09',
  'vtt-react/src/components/grid/CreatureToken.jsx': 'f23be08b8af979de9b218406696a2610fa52e3b96f2d9b12e3fe2bdce616b977',
  'vtt-react/src/components/grid/CreatureAbilityFanOut.jsx': 'fcb12e3cf7ebc804c23bdb47e3ddfadbb289df869eefae1b7043214fdd262a4a',
  'vtt-react/src/components/grid/CreatureAbilityConfirmDialog.jsx': '80ceb506b3be71966e56281a584ad4010e6f84c99f3c32d31e9e74c75439778c',
  'vtt-react/src/services/featherSlash.js': '1a4418f1a900b29f58efc79de091cfb59dd694d42110cecf087ef6a0e481b3ae',
  'vtt-react/src/services/featherSlashCustody.js': '2ace5b077bbd3bccdfeec666148df385927faca1766beb065d51a2e14e5abd39',
  'vtt-react/src/services/actorConsequenceService.js': 'f7834a814da437c5da5aef4aaaa7ca5be484d35d24f8e833ee8935aa86da434f',
  'vtt-react/src/persistence/privateStorageRegistry.js': '24ef9f35ec9696e7c1a199a9494b199b78e76c2724004f811576dbe2af1466a2',
  'docs/MYTHRILL_P8_FEATHER_SLASH_PHYSICAL_REFERENCE.html': '94b8d0154a7b86ab4e16b773f785e34e60ac471a72cc47a36b6c4756f46eea5f',
  'vtt-react/public/data/abilities.json': '19551f0c774c86985eb80834c4af69f14671cc0bedeb3aae617e62d2968cfc83',
  'vtt-react/public/data/creatures.json': '992882597bd289ce036353424d25892f1f02a755db4ba6c19d43f7a595d8a744',
  'docs/MYTHRILL_PROJECT_8_CONTRACT.md': '1436f823b44405a9ecf47d41da99d8c5522dafc75acaaae6aec8243a960b5173'
};
const files = [...new Set([...p9, ...Object.keys(acceptedP8)])];
const hashes = () => Object.fromEntries(files.map(p => [p, fs.existsSync(path.join(root, p)) ? sha(fs.readFileSync(path.join(root, p))) : null]));
const git = args => { try { return cp.execFileSync('git', args, { cwd: root, encoding: 'utf8', env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' }, maxBuffer: 32 * 1024 * 1024 }); } catch (error) { return `git unavailable: ${error.message}`; } };
const before = hashes(), identity = { head: git(['rev-parse', 'HEAD']).trim(), status: git(['status', '--short']), hashes: before };
// P9's only intentional changes to accepted P8 bytes: the client request/extra seam and one classified custody family.
const intentional = ['vtt-react/src/services/actorConsequenceService.js', 'vtt-react/src/persistence/privateStorageRegistry.js'];
// A disposable LF mirror may differ from the device's CRLF bytes only in line endings.
const lineEndingOnly = (p, expected) => {
  const file = path.join(root, p);
  if (!fs.existsSync(file)) return false;
  const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  return sha(Buffer.from(text.replace(/\n/g, '\r\n'))) === expected || sha(Buffer.from(text)) === expected;
};
const p8 = Object.fromEntries(Object.entries(acceptedP8).map(([p, expected]) => [p, { expected, actual: before[p], matches: before[p] === expected,
  lineEndingOnly: before[p] !== expected && lineEndingOnly(p, expected), intentionalP9Extension: intentional.includes(p) }]));
const unexpectedP8Drift = () => Object.keys(p8).filter(p => !p8[p].matches && !p8[p].lineEndingOnly && !p8[p].intentionalP9Extension);
if (mode === 'seal') {
  const sealed = { identity, p8, files: Object.fromEntries(p9.map(p => [p, fs.existsSync(path.join(root, p)) ? fs.readFileSync(path.join(root, p)).toString('base64') : null])) };
  fs.writeFileSync(path.join(out, 'source.json'), JSON.stringify(sealed, null, 2), { flag: 'wx' });
  fs.writeFileSync(path.join(out, 'source.diff'), git(['diff', '--', ...p9.filter(p => !p.includes('/verification/p9/') && !p.endsWith('__tests__/spellConsequence.test.js'))]), { flag: 'wx' });
  const summary = { out, sourcePacketSha256: sha(fs.readFileSync(path.join(out, 'source.json'))), p8Drift: unexpectedP8Drift(), intentionalP9Extensions: intentional };
  fs.writeFileSync(path.join(out, 'seal.json'), JSON.stringify(summary, null, 2), { flag: 'wx' });
  console.log(JSON.stringify(summary)); process.exit(0);
}
const server = ['tests/p9SpellConsequences.production.test.js', 'tests/characterHandlers.test.js', 'tests/socketHandlers.test.js', 'tests/productionSocketContract.test.js',
  'tests/roomAccessPrivacyProjection.test.js', 'tests/roomAccessBoundary.test.js', 'tests/sanitizationService.test.js', 'tests/rateLimitService.test.js', 'tests/roomCheckpoint.test.js'];
// These P7 suites rewrite their retained evidence JSON on completion; run them only in a disposable mirror.
const serverP7 = ['tests/p7Consequences.production.test.js', 'tests/p7Blockers.production.test.js', 'tests/p7Bounds.production.test.js', 'tests/p7ImportMetadata.production.test.js',
  'tests/p7Negative.production.test.js', 'tests/p7Lifecycle.production.test.js'];
const focused = ['src/services/__tests__/spellConsequence.test.js', 'src/components/ui/__tests__/ActionBarP9Producer.test.jsx', 'src/components/character-sheet/__tests__/SpellActionBarP9Producer.test.jsx',
  'src/components/ui/__tests__/ActionBar.test.jsx', 'src/components/ui/__tests__/SpellCastResourceContracts.test.jsx', 'src/components/character-sheet/__tests__/SpellActionBarResourceCast.test.jsx',
  'src/components/character-sheet/__tests__/SpellActionBarAssign.test.jsx', 'src/data/classes/arcanoneer/__tests__/ArcanoneerResourceBar.test.jsx', 'src/components/hud/__tests__/PartyHUD.test.jsx',
  'src/data/__tests__/classResourceContracts.test.js', 'src/data/__tests__/classResourceBanks.test.js', 'src/data/__tests__/pyrofiendResourceContract.test.js',
  'src/persistence/__tests__/registry.test.js', 'src/persistence/__tests__/storageContracts.test.js', 'src/services/__tests__/featherSlash.test.js',
  'src/components/grid/__tests__/CreatureAbilityFanOut.test.js', 'src/services/__tests__/actorProjectionOrder.test.js', 'src/services/__tests__/p7BoundsConsumers.test.js',
  'src/services/__tests__/silentRoomHydration.test.js', 'src/persistence/__tests__/waveB_scopedConsumer.test.js', 'src/persistence/__tests__/waveB_b1b5Corrections.test.js'];
const lint = p9.filter(p => /\.(jsx?)$/.test(p) && p.startsWith('vtt-react/src/'));
// Optional P9_SUBSET (comma-separated path fragments) splits long suites across bounded host calls.
const subset = process.env.P9_SUBSET ? process.env.P9_SUBSET.split(',').filter(Boolean) : null;
const pick = list => (subset ? list.filter(p => subset.some(fragment => p.includes(fragment))) : list);
const commands = {
  server: { cwd: path.join(root, 'server'), args: [path.join(root, 'server/node_modules/mocha/bin/mocha.js'), ...pick(server), '--timeout', '20000', '--exit'] },
  'server-p7': { cwd: path.join(root, 'server'), args: [path.join(root, 'server/node_modules/mocha/bin/mocha.js'), ...serverP7, '--timeout', '20000', '--exit'] },
  focused: { cwd: path.join(root, 'vtt-react'), args: ['node_modules/react-scripts/bin/react-scripts.js', 'test', '--watchAll=false', '--runInBand', '--silent', '--testTimeout=20000', '--runTestsByPath', ...pick(focused)] },
  browser: { cwd: path.join(root, 'vtt-react'), args: ['verification/p9/browser.cjs'] },
  lint: { cwd: path.join(root, 'vtt-react'), args: ['node_modules/eslint/bin/eslint.js', ...lint.map(p => path.join(root, p))] }
};
const command = commands[mode];
if (!command) throw Error('Unknown mode ' + mode);
const startedAt = new Date().toISOString();
const result = cp.spawnSync(process.execPath, command.args, { cwd: command.cwd, env: { ...process.env, CI: 'true', P9_OUTPUT: out }, encoding: 'utf8', timeout: 900000, maxBuffer: 64 * 1024 * 1024 });
fs.writeFileSync(path.join(out, 'output.log'), (result.stdout || '') + (result.stderr || ''), { flag: 'wx' });
const after = hashes(), drift = files.filter(p => before[p] !== after[p]);
fs.writeFileSync(path.join(out, 'command.json'), JSON.stringify({ command: [process.execPath, ...command.args], cwd: command.cwd, environment: { CI: 'true', P9_OUTPUT: out, P9_CHROME: process.env.P9_CHROME || null, P9_SUBSET: process.env.P9_SUBSET || null },
  startedAt, endedAt: new Date().toISOString(), exit: result.status, error: result.error?.message, identity, p8, after, drift }, null, 2), { flag: 'wx' });
console.log(JSON.stringify({ out, exit: result.status, drift, p8Drift: unexpectedP8Drift() }));
process.exit(result.status === 0 && !drift.length && !unexpectedP8Drift().length ? 0 : 1);
