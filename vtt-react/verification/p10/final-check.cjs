// Retain a small relevant identity/result record; never inventory/copy the asset tree.
const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto'), assert = require('assert/strict');
const root = path.resolve(__dirname, '../../..');
const out = process.env.P10_OUTPUT || 'D:/AppData/Temp/opencode/p10-integration-20261016';
const read = p => JSON.parse(fs.readFileSync(path.join(out, p)));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const build = read('build.json'), tests = read('tests.json'), lint = read('lint-baseline.json');
const app = read('app-smoke/result.json'), laws = read(process.env.P10_BROWSER_RESULT || 'laws-browser-5/result.json');
assert.equal(build.exit, 0); assert.deepEqual(build.drift, []); assert.equal(tests.exit, 0); assert.deepEqual(tests.drift, []); assert.deepEqual(lint.added, []);
assert.equal(app.passed, true); assert.equal(laws.passed, true);
assert.equal(app.errors.every(error => error.message === 'Failed to fetch'), true, 'Unexpected App page error');
assert.equal(laws.errors.every(error => error === 'Failed to fetch'), true, 'Unexpected Laws page error');
assert.equal(app.buildAssetManifestSha256, build.assetManifestSha256); assert.equal(laws.assetManifestSha256, build.assetManifestSha256);
for (const [p, expected] of Object.entries(build.after)) assert.equal(sha(fs.readFileSync(path.join(root, p))), expected, 'Built integration input drift: ' + p);
cp.execFileSync('git', ['apply', '--reverse', '--check', '--ignore-space-change', path.join(out, 'p10/p10.diff')], { cwd: root });
const start = read('starting-identity.json');
assert.equal(sha(fs.readFileSync(path.join(root, 'vtt-react/src/hooks/useSessionManagement.js'))), start.hook.current);
assert.equal(sha(fs.readFileSync(path.join(root, 'docs/P10_FIRST_REVIEW_REPORT.md'))), sha(fs.readFileSync(path.join(out, 'p10/docs/P10_FIRST_REVIEW_REPORT.md'))));
const git = args => cp.execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const runtimePaths = Object.keys(start.startingP10).filter(p => !p.includes('/__tests__/'));
const witnessPaths = ['vtt-react/src/hooks/__tests__/useSessionManagement.test.js', 'vtt-react/verification/p9/integration/app-browser.cjs', 'vtt-react/verification/p9/integration/app-server.cjs', ...fs.readdirSync(__dirname).filter(n => n.endsWith('.cjs')).map(n => 'vtt-react/verification/p10/' + n)];
const testLog = fs.readFileSync(path.join(out, 'tests.log'), 'utf8');
const concurrent = 'vtt-react/src/components/account/styles/AccountJournalManager.css';
const concurrentWizard = 'vtt-react/src/components/character-creation-wizard/styles/CharacterCreationWizard.css';
const source = Object.fromEntries([...new Set([...runtimePaths, ...Object.keys(build.after), ...witnessPaths])].sort().map(p => [p, sha(fs.readFileSync(path.join(root, p)))]));
const record = {
  head: git(['rev-parse', 'HEAD']), bundleSha256: start.bundle, reviewedDiffSha256: start.reviewedDiff,
  reviewedDiffReverseCheck: 'PASS', retainedHookSha256: start.hook.current,
  source, build: { startedAt: build.startedAt, endedAt: build.endedAt, exit: build.exit, relevantDrift: build.drift, assetManifestSha256: build.assetManifestSha256 },
  tests: { suites: Number(testLog.match(/Test Suites:\s+(\d+) passed/)[1]), tests: Number(testLog.match(/Tests:\s+(\d+) passed/)[1]), exit: tests.exit },
  lint: { errors: lint.errors, warnings: lint.warnings, baselineErrors: lint.baselineErrors, baselineWarnings: lint.baselineWarnings, added: lint.added },
  browser: { app: { passed: app.passed, pageErrors: app.errors.length, deliberateCloudRefusals: app.networkRefusals.length,
    receipts: Object.fromEntries(Object.entries(app.witnesses).map(([k, v]) => [k, { commandId: v.receipt.commandId, receipt: v.receipt }])) },
    laws: { passed: laws.passed, pages: laws.pages, cacheRefresh: laws.cacheRefresh, trackerOpening: laws.trackerOpening, trackerNext: laws.trackerNext, creatureTooltip: laws.creatureTooltip, pageErrors: laws.errors.length, deliberateCloudRefusals: laws.refusedCloud.length } },
  concurrentPresentation: { file: concurrent, lastModified: fs.statSync(path.join(root, concurrent)).mtime.toISOString(), sha256: sha(fs.readFileSync(path.join(root, concurrent))), disposition: 'Unrelated journal presentation edit appeared after production build; retained, not attributed to P10 or included in built-source claim. Does not reopen bounded P8/P9 source acceptance.' },
  concurrentWizardPresentation: { file: concurrentWizard, lastModified: fs.statSync(path.join(root, concurrentWizard)).mtime.toISOString(), sha256: sha(fs.readFileSync(path.join(root, concurrentWizard))), disposition: 'Unrelated character-wizard presentation changed during finalization; retained outside integration identity. Broad whitespace scan reports its trailing whitespace; not repaired here.' },
  evidenceRoot: out, recordedAt: new Date().toISOString()
};
fs.writeFileSync(path.join(__dirname, 'integration-identity.json'), JSON.stringify(record, null, 2) + '\n');
fs.writeFileSync(path.join(out, 'final-check.json'), JSON.stringify(record, null, 2) + '\n');
const documentation = git(['ls-files', '--cached', '--others', '--exclude-standard', '--', 'docs/ENGINEERING_STATE.md', 'docs/MYTHRILL_P10_INTEGRATION_20261016.md', 'docs/MYTHRILL_PROJECT_10_IMPLEMENTATION.md', 'docs/MYTHRILL_FIRST_TABLE_RELEASE_CHECKLIST.md', 'docs/MYTHRILL_SESSION_CLOSURE_BOUNDED_REVIEW_20261016.md', 'docs/P10_FIRST_REVIEW_REPORT.md', 'docs/ai']).split(/\r?\n/).filter(Boolean);
cp.execFileSync('git', ['-c', 'core.safecrlf=false', 'diff', '--check', '--', ...Object.keys(source), ...documentation], { cwd: root });
const untracked = git(['ls-files', '--others', '--exclude-standard', '--', ...Object.keys(source), ...documentation]).split(/\r?\n/).filter(Boolean);
for (const p of untracked) assert.equal(fs.readFileSync(path.join(root, p), 'utf8').split(/\r?\n/).some(line => /[\t ]+$/.test(line)), false, 'New-file trailing whitespace: ' + p);
console.log(JSON.stringify({ head: record.head, sourcePaths: Object.keys(source).length, build: record.build, tests: record.tests, lint: record.lint,
  app: { passed: app.passed, errors: app.errors.length, refusals: app.networkRefusals.length, receipts: Object.fromEntries(Object.entries(app.witnesses).map(([k, v]) => [k, v.receipt.commandId])) },
  laws: { passed: laws.passed, errors: laws.errors.length, refusals: laws.refusedCloud.length }, scopedWhitespace: 'PASS', concurrentPresentation: record.concurrentPresentation, concurrentWizardPresentation: record.concurrentWizardPresentation }, null, 2));
