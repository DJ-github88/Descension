const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto'), zlib = require('zlib');
const root = path.resolve(__dirname, '../../..'), out = path.join(__dirname, 'evidence/corrections-20261013');
const independent = path.join(__dirname, 'evidence/independent-block-20261013');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const git = (...args) => cp.execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
const before = JSON.parse(fs.readFileSync(path.join(out, 'before.json')));
const buildStart = JSON.parse(fs.readFileSync(path.join(out, 'build-start-final.json')));
const source = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(out, 'reviewed-source.json.gz'))));
const production = ['server/handlers/actorConsequenceHandlers.js', 'server/services/actorConsequences.js', 'server/handlers/socketHandlers.js', 'vtt-react/src/services/actorConsequenceService.js', 'vtt-react/src/services/silentRoomHydration.js', 'vtt-react/src/store/characterTokenStore.js', 'vtt-react/src/components/hud/ActorConsequenceControls.jsx'];
const tests = ['server/tests/p7Blockers.production.test.js', 'server/tests/p7Consequences.production.test.js'];
const docs = ['docs/MYTHRILL_P7_B1_B7_CORRECTIONS_20261013.md', 'docs/MYTHRILL_PROJECT_7_IMPLEMENTATION.md', 'docs/MYTHRILL_PROJECT_7_CONTRACT.md', 'docs/ENGINEERING_STATE.md'];
const runners = ['correction-custody', 'correction-run', 'correction-output', 'correction-browser', 'correction-red-replay', 'correction-ui-baseline', 'correction-seal'].map(name => 'vtt-react/verification/p7/' + name + '.cjs');
const intended = [...production, ...tests, ...docs, ...runners];
// Generated seal outputs are covered by the post-write artifact manifest, not
// their own pre-write inventory hashes (which would be self-referential).
const inventoryExcluded = ['final-identity.json', 'final-source.json.gz', 'changed-files.md', 'validation-summary.json', 'artifact-manifest.json', 'reviewed-to-final.diff', 'diff-check.log'].map(file => 'vtt-react/verification/p7/evidence/corrections-20261013/' + file);
const files = git('ls-files', '--cached', '--others', '--exclude-standard', '-z').split('\0').filter(file => file && !inventoryExcluded.includes(file) && fs.existsSync(path.join(root, file)));
const hashes = Object.fromEntries(files.map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
const comparisons = intended.map(file => ({ file, reviewed: before.hashes[file] || null, final: hashes[file] }));
const independentManifest = JSON.parse(fs.readFileSync(path.join(independent, 'retention-manifest.json'))).hashes;
const independentDrift = Object.keys(independentManifest).filter(file => !fs.existsSync(path.join(independent, file)) || hash(fs.readFileSync(path.join(independent, file))) !== independentManifest[file]);
const acceptedP6Inventory = JSON.parse(fs.readFileSync(path.join(root, 'vtt-react/verification/p6/evidence/independent-container-acceptance-20261012/after.json'))).hashes;
const preserved = Object.keys(acceptedP6Inventory).filter(file => /^vtt-react\/verification\/(p5-01|p6)\//.test(file));
const preservedDrift = preserved.filter(file => !fs.existsSync(path.join(root, file)) || hash(fs.readFileSync(path.join(root, file))) !== acceptedP6Inventory[file]);
const frozen = fs.readFileSync(path.join(__dirname, 'evidence/frozen-contract.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/MYTHRILL_PROJECT_7_CONTRACT.md'), 'utf8');
const freeze = text => text.slice(text.indexOf('### F1'), text.indexOf('## 1. Authority'));
if (freeze(frozen) !== freeze(contract)) throw Error('Frozen F1–F6 changed');
if (independentDrift.length || preservedDrift.length) throw Error('Historical evidence drift: ' + [...independentDrift, ...preservedDrift]);
const buildExit = Number(fs.readFileSync('D:/AppData/Temp/opencode/p7-correction-final-build.exit', 'utf8').trim());
if (buildExit !== 0) throw Error('Final detached build has not passed');
for (const [from, to] of [['p7-correction-final-build.log', 'build-final.log'], ['p7-correction-final-build.exit', 'build-final.exit'], ['p7-correction-final-build.cmd', 'build-final.cmd'], ['p7-correction-build.config.cjs', 'build-final.config.cjs']]) fs.copyFileSync('D:/AppData/Temp/opencode/' + from, path.join(out, to));
const input = file => file.startsWith('vtt-react/src/') || file.startsWith('vtt-react/public/') || /^vtt-react\/[^/]+\.(json|[jc]sx?|html|css)$/.test(file);
const buildDrift = Object.keys(buildStart.hashes).filter(file => input(file) && hashes[file] !== buildStart.hashes[file]);
const buildAdded = Object.keys(hashes).filter(file => input(file) && !buildStart.hashes[file]);
const p7BuildDrift = production.filter(file => file.startsWith('vtt-react/') && hashes[file] !== buildStart.hashes[file]);
if (p7BuildDrift.length) throw Error('P7 source changed after final build start: ' + p7BuildDrift);
const temporary = 'D:/AppData/Temp/opencode/p7-correction-diff';
let diff = '', whitespace = '', lineEndingWarnings = '';
for (const file of [...production, ...tests]) {
  const old = path.join(temporary, file); fs.mkdirSync(path.dirname(old), { recursive: true }); fs.writeFileSync(old, source.files[file] ? Buffer.from(source.files[file], 'base64') : '');
  for (const check of [false, true]) {
    const result = cp.spawnSync('git', ['diff', '--no-index', ...(check ? ['--check'] : []), '--', old, path.join(root, file)], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
    if (check) {whitespace += result.stdout || ''; lineEndingWarnings += result.stderr || '';} else diff += (result.stdout || '') + (result.stderr || '');
  }
}
fs.writeFileSync(path.join(out, 'reviewed-to-final.diff'), diff);
fs.writeFileSync(path.join(out, 'diff-check.log'), whitespace + lineEndingWarnings);
const focal = before.reviewedFocal.map(entry => ({ file: entry.file, reviewed: entry.reviewed, final: hashes[entry.file], changed: entry.reviewed !== hashes[entry.file] }));
const acceptedP6 = JSON.parse(fs.readFileSync(path.join(root, 'vtt-react/verification/p6/evidence/independent-container-acceptance-20261012/green.json'))).manifest;
const p6Integration = Object.entries(acceptedP6).filter(([file, accepted]) => hashes['vtt-react/src/' + file] !== accepted).map(([file, accepted]) => ({ file: 'vtt-react/src/' + file, accepted, reviewed: before.hashes['vtt-react/src/' + file], final: hashes['vtt-react/src/' + file] }));
const record = { date: new Date().toISOString(), checkout: git('rev-parse', '--show-toplevel'), head: git('rev-parse', 'HEAD'), branch: git('branch', '--show-current'), status: git('status', '--porcelain=v1', '--untracked-files=all'), reviewedHead: before.head, externalCommits: git('log', '--oneline', before.head + '..HEAD'), hashes, inventoryExcluded, intended: comparisons, focal, preserved: { files: preserved.length, drift: preservedDrift }, independentRetention: { files: Object.keys(independentManifest).length, drift: independentDrift }, frozenF1F6Sha256: hash(freeze(contract)), p6Integration, build: { exit: buildExit, startHead: buildStart.head, command: 'Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "D:\\AppData\\Temp\\opencode\\p7-correction-final-build.cmd" -WorkingDirectory "D:\\VTT\\vtt-react" -PassThru -WindowStyle Hidden', pid: 11280, drift: buildDrift, added: buildAdded, p7Drift: p7BuildDrift }, whitespace: { scopedOutput: whitespace, lineEndingWarnings, clean: !whitespace.trim() }, ambientChanges: Object.keys(before.hashes).filter(file => hashes[file] !== before.hashes[file] && !intended.includes(file)), verdict: 'P7 BLOCK; corrections implemented, awaiting independent acceptance' };
fs.writeFileSync(path.join(out, 'final-identity.json'), JSON.stringify(record, null, 2));
const sourceFiles = files.filter(file => /^(server\/(handlers|services|utils|tests)|vtt-react\/src)\//.test(file));
fs.writeFileSync(path.join(out, 'final-source.json.gz'), zlib.gzipSync(JSON.stringify({ head: record.head, hashes: Object.fromEntries(sourceFiles.map(file => [file, hashes[file]])), files: Object.fromEntries(sourceFiles.map(file => [file, fs.readFileSync(path.join(root, file)).toString('base64')])) })));
fs.writeFileSync(path.join(out, 'changed-files.md'), '# P7 correction source identity\n\nActual checkout `' + record.checkout + '`, branch `' + record.branch + '`, HEAD `' + record.head + '`. Reviewed HEAD `' + record.reviewedHead + '`. Dirty status and ambient changes are in final-identity.json.\n\n| Correction file | Reviewed SHA256 | Final SHA256 |\n|---|---|---|\n' + comparisons.map(entry => '| `' + entry.file + '` | `' + (entry.reviewed || 'new') + '` | `' + entry.final + '` |').join('\n') + '\n\n## All independently reviewed focal files\n\n| File | Reviewed SHA256 | Final SHA256 |\n|---|---|---|\n' + focal.map(entry => '| `' + entry.file + '` | `' + entry.reviewed + '` | `' + entry.final + '` |').join('\n') + '\n');
const commands = fs.readdirSync(out).filter(file => file.endsWith('.command.json')).map(file => ({ artifact: file, ...JSON.parse(fs.readFileSync(path.join(out, file))) }));
fs.writeFileSync(path.join(out, 'validation-summary.json'), JSON.stringify({ commands, finalHead: record.head, build: record.build, lintWarnings: { server: 0, frontend: 6 }, fullFrontend: { passedSuites: 231, passedTests: 2732, failedSuites: 5, failedTests: 5, skippedSuites: 2, skippedTests: 4 }, independentVerdict: 'BLOCK', corrections: 'awaiting independent acceptance' }, null, 2));
const artifacts = {};
function inventory(dir, relative = '') {for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {const name = path.join(relative, entry.name), full = path.join(dir, entry.name); if (entry.isDirectory()) inventory(full, name); else if (name !== 'artifact-manifest.json') artifacts[name.replace(/\\/g, '/')] = hash(fs.readFileSync(full));}}
inventory(out);
fs.writeFileSync(path.join(out, 'artifact-manifest.json'), JSON.stringify({ artifacts }, null, 2));
for (const [file, expected] of Object.entries(artifacts)) if (hash(fs.readFileSync(path.join(out, file))) !== expected) throw Error('Artifact changed while sealing: ' + file);
console.log(JSON.stringify({ checkout: record.checkout, head: record.head, reviewedHead: record.reviewedHead, preserved: record.preserved, independentRetention: record.independentRetention, p6Integration: p6Integration.map(entry => entry.file), build: record.build, whitespace: record.whitespace, sourceFiles: sourceFiles.length, artifacts: Object.keys(artifacts).length }, null, 2));
