// Source identity only: reuse accepted P7 evidence without replay/copying it.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process');
const root = path.resolve(__dirname, '../../..');
const out = process.env.P8_OUTPUT || 'D:/AppData/Temp/opencode/p8-20261014';
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const files = [
  'docs/MYTHRILL_NEXT_PHASE.md', 'docs/MYTHRILL_P7_SOURCE_INDEPENDENT_ACCEPTANCE_20261014.md', 'docs/ENGINEERING_STATE.md', 'AGENTS.md', 'CLAUDE.md',
  'vtt-react/public/data/abilities.json', 'vtt-react/public/data/creatures.json', 'vtt-react/src/data/versions.js',
  'vtt-react/src/utils/initCreatureStore.js', 'vtt-react/src/utils/tokenStateUtils.js', 'vtt-react/src/utils/creatureAbilityUtils.js',
  'vtt-react/src/components/grid/CreatureToken.jsx', 'vtt-react/src/components/grid/CreatureAbilityFanOut.jsx', 'vtt-react/src/components/grid/CreatureAbilityConfirmDialog.jsx',
  'vtt-react/src/store/creatureStore.js', 'vtt-react/src/store/chatStore.js', 'vtt-react/src/services/actorConsequenceService.js',
  'vtt-react/src/persistence/privateStorageRegistry.js', 'vtt-react/src/persistence/scopedNativeFamily.js',
  'vtt-react/src/components/multiplayer/socketHandlers/registerAllHandlers.js', 'server/handlers/actorConsequenceHandlers.js', 'server/services/actorConsequences.js'
];
const sealPath = 'D:/AppData/Temp/opencode/p7-final-20261013/combined/seal-1791980637030/source.json';
const accepted = JSON.parse(fs.readFileSync(sealPath, 'utf8'));
const p7Comparison = Object.fromEntries(Object.entries(accepted.identity.hashes).map(([file, expected]) => {
  const actual = sha(fs.readFileSync(path.join(root, file))); return [file, { expected, actual, matches: actual === expected }];
}));
const git = args => cp.execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }).trim();
const source = Object.fromEntries(files.map(file => { const bytes = fs.readFileSync(path.join(root, file)); return [file, { sha256: sha(bytes), bytes: bytes.toString('base64') }]; }));
const record = { head: git(['rev-parse', 'HEAD']), branch: git(['branch', '--show-current']), worktree: git(['status', '--short']),
  acceptedP7Seal: sealPath, p7Comparison, p7Drift: Object.entries(p7Comparison).filter(([, value]) => !value.matches).map(([file]) => file), source };
fs.mkdirSync(out, { recursive: true });
const file = path.join(out, 'starting-source-' + Date.now() + '.json');
fs.writeFileSync(file, JSON.stringify(record, null, 2), { flag: 'wx' });
console.log(JSON.stringify({ file, head: record.head, p7Entries: Object.keys(p7Comparison).length, p7Drift: record.p7Drift, sourcePaths: files.length }));
process.exit(record.p7Drift.length ? 1 : 0);
