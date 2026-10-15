// Final report identity only; no build, browser, production or historical writes.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const root = 'D:/VTT', out = __dirname, sol = path.dirname(out);
const read = p => fs.readFileSync(path.resolve(root, p));
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const json = p => JSON.parse(read(p));
const checked = json(path.join(out, 'completion-check.json'));
const current = Object.fromEntries(Object.keys(checked.focal).map(p => [p, sha(read(p))]));
assert.deepEqual(current, Object.fromEntries(Object.entries(checked.focal).map(([p, v]) => [p, v.raw])));
const changedInputs = Object.entries(checked.inputHashesBefore).filter(([p, hash]) => sha(read(p)) !== hash).map(([p]) => p);
assert.deepEqual(changedInputs, []);
const commandPath = path.join(sol, 'build-current/command.json'), build = json(commandPath);
const focalBuildMismatch = Object.keys(current).filter(p => build.before[p] !== current[p] || build.after[p] !== current[p]);
assert.deepEqual(focalBuildMismatch, []);
assert.equal(build.exit, 0);
const reportArtifacts = ['review.md', 'completion-check.cjs', 'completion-check.json', 'completion-invariants.json', 'completion-custody-probe.json', 'completion-evidence-check.json', 'completion-seal.cjs'];
const result = {
  task_id: checked.task_id, checkedAt: new Date().toISOString(), command: process.argv, cwd: process.cwd(),
  reportHashes: Object.fromEntries(reportArtifacts.map(name => [name, sha(read(path.join(out, name)))])),
  currentFocalRawHashes: current, changedHistoricalInputs: changedInputs, sourceDrift: [],
  buildCurrent: { commandSha256: sha(read(commandPath)), command: build.command, cwd: build.cwd, startedAt: build.startedAt, endedAt: build.endedAt, exit: build.exit, signal: build.signal, drift: build.drift, focalBeforeAndAfterMatchCurrent: true,
    exitRecord: json(path.join(sol, 'build-current/exit.json')), outputLogSha256: sha(read(path.join(sol, 'build-current/output.log'))), assetManifestSha256: sha(read(path.join(sol, 'build-current/app/asset-manifest.json'))) },
  appReplay7Sha256: sha(read(path.join(sol, 'app-replay-7/result.json'))), passed: true
};
assert.equal(result.appReplay7Sha256, checked.appReplay7.sha256);
fs.writeFileSync(path.join(out, 'completion-final-state.json'), JSON.stringify(result, null, 2), { flag: 'wx' });
console.log(JSON.stringify({ passed: true, task_id: result.task_id, reportSha256: result.reportHashes['review.md'], changedHistoricalInputs: [], sourceDrift: [], buildCurrent: result.buildCurrent }, null, 2));
