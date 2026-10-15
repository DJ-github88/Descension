// Bounded integration custody; historical evidence is read-only.
const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto'), zlib = require('zlib'), assert = require('assert/strict');
const root = path.resolve(__dirname, '../../../..');
const out = path.join(root, 'vtt-react/verification/p9/evidence/integration-20261015/sol');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const read = file => fs.readFileSync(path.resolve(root, file));
const git = args => cp.execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' } });
const save = (file, value) => { if (mode === 'before' && fs.existsSync(path.join(out, file))) return; fs.writeFileSync(path.join(out, file), typeof value === 'string' ? value : JSON.stringify(value, null, 2), { flag: 'wx' }); };
fs.mkdirSync(out, { recursive: true });
const mode = process.argv[2] || 'before';
const files = [...new Set(git(['ls-files', '--cached', '--others', '--exclude-standard', '-z']).split('\0').filter(Boolean))]
  .filter(p => !p.includes('/evidence/integration-20261015/sol/') && fs.existsSync(path.join(root, p)));
const hashes = Object.fromEntries(files.map(p => [p, sha(read(p))]));
save(mode + '-identity.json', { at: new Date().toISOString(), head: git(['rev-parse', 'HEAD']).trim(), status: git(['status', '--short']), hashes });
if (mode !== 'before') {
  const before = JSON.parse(fs.readFileSync(path.join(out, 'before-identity.json')));
  save(mode + '-changes.json', { changed: Object.keys(before.hashes).filter(p => hashes[p] !== before.hashes[p]), added: Object.keys(hashes).filter(p => !(p in before.hashes)) });
  process.exit(0);
}
const acceptedPath = 'D:/AppData/Temp/opencode/p8-20261014/independent/final-cycle2/accepted-source.json.gz';
const acceptedBytes = fs.readFileSync(acceptedPath);
assert.equal(sha(acceptedBytes), 'b53b919df7f944dfbe58a7ec380c46b0af99097b437ce7d21dd01a3c58e74a0c');
const accepted = JSON.parse(zlib.gunzipSync(acceptedBytes));
const raw = p => { const bytes = Buffer.from(accepted.files[p], 'base64'); assert.equal(sha(bytes), accepted.hashes[p], p); return bytes; };
const abilitiesPath = 'vtt-react/public/data/abilities.json', creaturesPath = 'vtt-react/public/data/creatures.json';
const oldAbilities = JSON.parse(raw(abilitiesPath)), newAbilities = JSON.parse(read(abilitiesPath));
const oldCreatures = JSON.parse(raw(creaturesPath)), newCreatures = JSON.parse(read(creaturesPath));
assert.deepEqual(newAbilities.grimmstalk, oldAbilities.grimmstalk);
assert.deepEqual(newCreatures.find(c => c.id === 'grimmstalk'), oldCreatures.find(c => c.id === 'grimmstalk'));
const feather = oldAbilities.grimmstalk.find(a => a.id === 'grimmstalk_feather_slash');
save('raw-definition-verification.json', { acceptedPath, acceptedPacketSha256: sha(acceptedBytes),
  acceptedAbilitiesSha256: sha(raw(abilitiesPath)), currentAbilitiesSha256: sha(read(abilitiesPath)),
  acceptedCreaturesSha256: sha(raw(creaturesPath)), currentCreaturesSha256: sha(read(creaturesPath)),
  grimmstalkAbilitiesIdentical: true, grimmstalkCreatureIdentical: true, featherSlashIdentical: true,
  addedAbilityFamilies: Object.keys(newAbilities).filter(k => !(k in oldAbilities)),
  changedExistingAbilityFamilies: Object.keys(oldAbilities).filter(k => JSON.stringify(oldAbilities[k]) !== JSON.stringify(newAbilities[k])),
  addedCreatures: newCreatures.filter(c => !oldCreatures.some(old => old.id === c.id)).map(c => c.id),
  changedExistingCreatures: oldCreatures.filter(c => JSON.stringify(c) !== JSON.stringify(newCreatures.find(n => n.id === c.id))).map(c => c.id),
  rawFeatherSlash: feather, rawCreature: oldCreatures.find(c => c.id === 'grimmstalk') });
const archive = path.join(root, 'vtt-react/verification/p9/evidence/independent-review/independent-cycle1-and-cycle2.tar.gz');
const p9Manifest = cp.execFileSync('tar', ['-xOf', archive, 'review2/p9-identity-lf-sha256.txt'], { encoding: 'utf8' });
save('accepted-p9-identity-lf-sha256.txt', p9Manifest);
const seal = JSON.parse(read('vtt-react/verification/p9/evidence/repair-cycle1-20261015/seal-1792059273601/source.json'));
const focal = [...new Set([...Object.keys(seal.files), 'vtt-react/src/services/featherSlash.js', 'vtt-react/src/services/__tests__/featherSlash.test.js',
  'vtt-react/src/components/ui/__tests__/ActionBarLegacyArcanoneerSpheres.test.jsx', abilitiesPath, creaturesPath, 'vtt-react/src/data/versions.js'])];
save('starting-source.json', { files: Object.fromEntries(focal.map(p => [p, read(p).toString('base64')])) });
const acceptedP9 = Object.fromEntries(p9Manifest.trim().split(/\r?\n/).map(line => { const m = line.match(/^([a-f0-9]{64})\s+(.+)$/); assert(m, line); return [m[2].replace(/^\.\//, ''), m[1]]; }));
save('accepted-p9-comparison.json', Object.fromEntries(Object.entries(acceptedP9).map(([p, expected]) => [p, {
  expected, actualLF: sha(read(p).toString('utf8').replace(/\r\n/g, '\n')), actualRaw: sha(read(p)),
  sealLF: seal.files[p] ? sha(Buffer.from(seal.files[p], 'base64').toString('utf8').replace(/\r\n/g, '\n')) : null
}])));
const subset = ['vtt-react/src/components/hud/PartyHUD.jsx', 'vtt-react/src/components/hud/SpellConsequencePanel.css', 'vtt-react/src/components/ui/ActionBar.jsx'];
for (const p of subset) {
  assert.equal(sha(Buffer.from(seal.files[p], 'base64').toString('utf8').replace(/\r\n/g, '\n')), acceptedP9[p]);
  save('accepted-' + path.basename(p), Buffer.from(seal.files[p], 'base64').toString('utf8'));
}
console.log(JSON.stringify({ out, inventoried: files.length, rawDefinitionsIdentical: true, acceptedP9ManifestSha256: sha(p9Manifest) }));
