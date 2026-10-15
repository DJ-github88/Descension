// Seal the new addendum while preserving the original report and all replay inputs.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const root = 'D:/VTT', out = __dirname, read = p => fs.readFileSync(path.resolve(root, p));
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const checked = JSON.parse(read(path.join(out, 'run8-addendum-check.json')));
const original = JSON.parse(read(path.join(out, 'completion-check.json')));
const previous = JSON.parse(read(path.join(out, 'completion-final-state.json')));
for (const [p, hash] of Object.entries(checked.currentFocalRawHashes)) assert.equal(sha(read(p)), hash);
for (const [p, hash] of Object.entries(checked.artifactHashesBefore)) assert.equal(sha(read(p)), hash);
for (const [p, hash] of Object.entries(original.inputHashesBefore)) assert.equal(sha(read(p)), hash);
for (const [p, hash] of Object.entries(previous.reportHashes)) assert.equal(sha(read(path.join(out, p))), hash);
const names = ['final-review.md', 'run8-addendum-check.cjs', 'run8-addendum-check.json', 'run8-addendum-seal.cjs'];
const seal = { task_id: checked.task_id, checkedAt: new Date().toISOString(), command: process.argv, cwd: process.cwd(), verdict: 'PASS within bounded desktop integration scope', reportHashes: Object.fromEntries(names.map(p => [p, sha(read(path.join(out, p)))])), priorReportSha256: sha(read(path.join(out, 'review.md'))), sourceDrift: [], changedHistoricalAndReplayInputs: [], snapshotReplayClaimed: false, passed: true };
fs.writeFileSync(path.join(out, 'run8-addendum-seal.json'), JSON.stringify(seal, null, 2), { flag: 'wx' });
console.log(JSON.stringify(seal, null, 2));
