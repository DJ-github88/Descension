// Independent report-completion checks. All writes are new review artifacts.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const vm = require('vm'), assert = require('assert/strict');
const root = 'D:/VTT', out = __dirname, sol = path.dirname(out);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = p => fs.readFileSync(path.resolve(root, p));
const lf = bytes => bytes.toString('utf8').replace(/\r\n/g, '\n');
const json = p => JSON.parse(read(p));
const save = (name, value) => fs.writeFileSync(path.join(out, name), JSON.stringify(value, null, 2), { flag: 'wx' });
const result = { task_id: 'independent-integration-review-20261015-completion', startedAt: new Date().toISOString(), command: process.argv, cwd: process.cwd() };
const focal = json(path.join(out, 'start-focal-hashes.json'));
const starting = json(path.join(sol, 'starting-source.json')).files;
const inputNames = ['invariants.json', 'custody-probe.json', 'import-negative.json', 'import-negative.log', 'focused-command.json', 'focused.log', 'evidence-check.json', 'layout-probe-v3.json', 'narrow-diffs.json', 'start-focal-hashes.json', 'starting-featherSlash.js', 'starting-featherSlash.test.js', 'review-checks.cjs', 'custody-probe.cjs', 'evidence-check.cjs', 'layout-probe.cjs', 'without-import-transform.cjs'];
const inputs = [...inputNames.map(name => path.join(out, name)), ...['starting-source.json', 'accepted-PartyHUD.jsx', 'accepted-ActionBar.jsx', 'accepted-SpellConsequencePanel.css', 'accepted-p9-identity-lf-sha256.txt'].map(name => path.join(sol, name))];
const inputHashes = () => Object.fromEntries(inputs.map(p => [path.relative(root, p).replace(/\\/g, '/'), sha(read(p))]));
result.inputHashesBefore = inputHashes();
result.focal = Object.fromEntries(Object.entries(focal).map(([p, prior]) => {
  const bytes = read(p), raw = sha(bytes), normalized = sha(lf(bytes));
  assert.equal(raw, prior.raw, `Source drift: ${p}`);
  return [p, { raw, lf: normalized, startingRaw: starting[p] ? sha(Buffer.from(starting[p], 'base64')) : null }];
}));

const featherPath = 'vtt-react/src/services/featherSlash.js';
const oldFeather = lf(Buffer.from(starting[featherPath], 'base64'));
const expectedFeather = oldFeather
  .replace("export const FEATHER_CAPABILITY =", "// Stable command/receipt identity: both reviewed datasets contain this exact capability.\nexport const FEATHER_CAPABILITY =")
  .replace("DATA_VERSIONS.abilities === '1.4.0'", "['1.4.0', '1.5.0'].includes(DATA_VERSIONS.abilities)");
assert.equal(lf(read(featherPath)), expectedFeather);
for (const name of ['featherSlash.js', 'featherSlash.test.js']) {
  const p = `vtt-react/src/services/${name.endsWith('.test.js') ? '__tests__/' : ''}${name}`;
  assert.equal(sha(read(path.join(out, `starting-${name}`))), sha(Buffer.from(starting[p], 'base64')));
}
const actionPath = 'vtt-react/src/components/ui/ActionBar.jsx';
const importLine = "import { migrateBlockId } from '../../utils/arcanoneerMigration';\n";
const acceptedAction = lf(read(path.join(sol, 'accepted-ActionBar.jsx')));
assert.equal(lf(read(actionPath)), acceptedAction.replace("import { routeSpellCast, isP9Routed }", importLine + "import { routeSpellCast, isP9Routed }"));
const hudPath = 'vtt-react/src/components/hud/PartyHUD.jsx';
assert.equal(lf(read(hudPath)), lf(read(path.join(sol, 'accepted-PartyHUD.jsx'))).replace('<div><ActorConsequenceControls /><SpellConsequenceHost /></div>', '<div className="actor-consequence-layer"><ActorConsequenceControls /><SpellConsequenceHost /></div>'));
const cssPath = 'vtt-react/src/components/hud/SpellConsequencePanel.css';
const acceptedCss = lf(read(path.join(sol, 'accepted-SpellConsequencePanel.css'))), currentCss = lf(read(cssPath));
assert(currentCss.startsWith(acceptedCss));
const appendedCss = currentCss.slice(acceptedCss.length);
assert.equal((appendedCss.match(/\{/g) || []).length, 1);
assert(appendedCss.includes('.party-hud-frames > .actor-consequence-layer { position: fixed; top: 84px; right: 16px;'));
for (const p of [actionPath, hudPath, cssPath, 'vtt-react/src/components/ui/__tests__/ActionBarLegacyArcanoneerSpheres.test.jsx']) assert.equal(sha(read(p)), sha(Buffer.from(starting[p], 'base64')));
result.exactDiffChecks = { featherOnlyCommentAndExplicitAllowlist: true, actionOnlyImportVersusAccepted: true, hudOnlyClassVersusAccepted: true, cssAcceptedPrefixPreservedAndOneAppendedRule: true, existingRepairsAndLegacyTestUnchangedSinceStartingSource: true, startingFeatherCopiesMatchPacket: true, appendedCss };

// Re-execute reviewed probes unchanged, redirecting only their exclusive-create
// result write. This avoids overwriting the interrupted review's evidence.
result.reexecutions = [];
function rerun(file, args, oldName, newName) {
  const captured = [], wrote = [];
  const facade = Object.create(fs);
  facade.writeFileSync = (p, value, options) => {
    assert.equal(path.resolve(p), path.resolve(out, oldName));
    fs.writeFileSync(path.join(out, newName), value, { ...options, flag: 'wx' });
    wrote.push(newName);
  };
  const localProcess = Object.create(process);
  localProcess.argv = [process.execPath, __filename, ...args, '--embedded-probe', file];
  const startedAt = new Date().toISOString();
  vm.runInNewContext(read(path.join(out, file)).toString('utf8'), {
    require: name => name === 'fs' ? facade : require(name), __dirname: out,
    __filename: path.join(out, file), process: localProcess, Buffer,
    console: { log: (...values) => captured.push(values.map(String).join(' ')) }
  }, { filename: file, timeout: 60000 });
  assert.deepEqual(wrote, [newName]);
  result.reexecutions.push({ file, args, method: 'Unmodified probe source in Node VM; fs.writeFileSync redirects its one output to a new exclusive-create report artifact.', startedAt, endedAt: new Date().toISOString(), output: newName, outputSha256: sha(read(path.join(out, newName))), stdout: captured });
}
rerun('review-checks.cjs', ['invariants'], 'invariants.json', 'completion-invariants.json');
rerun('custody-probe.cjs', [], 'custody-probe.json', 'completion-custody-probe.json');
rerun('evidence-check.cjs', [], 'evidence-check.json', 'completion-evidence-check.json');

result.supplementalBuilds = {};
for (const name of ['build', 'build-final', 'build-current']) {
  const p = path.join(sol, name, 'command.json');
  if (!fs.existsSync(p)) { result.supplementalBuilds[name] = { commandPresent: false, entriesAtCutoff: fs.existsSync(path.dirname(p)) ? fs.readdirSync(path.dirname(p)) : [] }; continue; }
  const c = json(p);
  result.supplementalBuilds[name] = { sha256: sha(read(p)), command: c.command, startedAt: c.startedAt, endedAt: c.endedAt, exit: c.exit, signal: c.signal, drift: c.drift, outputLogSha256: sha(read(path.join(sol, name, 'output.log'))) };
}
const replayPath = path.join(sol, 'app-replay-7/result.json');
if (fs.existsSync(replayPath)) {
  const replay = json(replayPath);
  result.appReplay7 = { sha256: sha(read(replayPath)), command: replay.command, startedAt: replay.startedAt, endedAt: replay.endedAt, passed: replay.passed === true, failure: replay.failure, witnesses: Object.keys(replay.witnesses || {}), errors: replay.errors, networkRefusalCount: replay.networkRefusals?.length, build: replay.build, buildAssetManifestSha256: replay.buildAssetManifestSha256 };
} else result.appReplay7 = { present: false };
result.sourceDrift = Object.keys(result.focal).filter(p => sha(read(p)) !== result.focal[p].raw);
result.inputHashesAfter = inputHashes();
assert.deepEqual(result.inputHashesAfter, result.inputHashesBefore);
assert.deepEqual(result.sourceDrift, []);
result.passed = true;
result.endedAt = new Date().toISOString();
save('completion-check.json', result);
console.log(JSON.stringify({ passed: true, exactDiffChecks: result.exactDiffChecks, reexecutions: result.reexecutions.map(r => ({ file: r.file, output: r.output })), sourceDrift: [], historicalInputsChanged: false, appReplay7: result.appReplay7, supplementalBuilds: result.supplementalBuilds }, null, 2));
