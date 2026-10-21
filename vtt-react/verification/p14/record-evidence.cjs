// Bind the final reviewed bytes, optimized bundle and successful browser witness without rebuilding unrelated work.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const root = path.resolve(__dirname, '../../..'), temp = 'D:/AppData/Temp/opencode';
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const review = path.join(temp, 'p14c1-review1-runtime.sha256');
const files = fs.readFileSync(review, 'utf8').trim().split(/\r?\n/).map(line => { const [expected, file] = line.split(/  /); return { file, expected, current: hash(path.join(root, file)) }; });
assert.deepEqual(files.filter(f => f.expected !== f.current), [], 'review identity drift');
const buildFile = path.join(temp, 'p14c1-build3/build.json'), build = JSON.parse(fs.readFileSync(buildFile));
assert.equal(build.exit, 0);
const frontend = files.filter(f => f.file.startsWith('vtt-react/'));
const mismatches = frontend.filter(f => build.before[f.file] !== f.current || build.after[f.file] !== f.current);
assert.deepEqual(mismatches, [], 'C1 runtime differs from optimized bundle');
const appFile = path.join(temp, 'p14c1-app11/result.json'), app = JSON.parse(fs.readFileSync(appFile)); assert.equal(app.passed, true);
const artifacts = [review, path.join(temp, 'p14c1-review1.md'), path.join(temp, 'p14c1-review1-probe.cjs'), buildFile, appFile,
  path.join(root, 'server/tests/p12bBlockWear.production.test.js'), path.join(root, 'vtt-react/src/services/__tests__/sharedConditionService.test.js'),
  path.join(root, 'vtt-react/src/services/__tests__/sharedConditionAdapters.test.js'), path.join(__dirname, 'defending-app-browser.cjs')];
const record = { recordedAt: new Date().toISOString(), runtime: files, build: { compilationExit: build.exit, c1RuntimeMismatches: mismatches,
  fullBuildSourceDrift: build.drift, assetManifestSha256: build.assetManifestSha256 }, app: { passed: app.passed, checks: app.checks,
  pageErrors: app.errors, limits: [...app.limits, 'Accelerated fixture raises selected event limits. Four Failed to fetch page errors accompany deliberately blocked cloud/provider requests.',
    'Desktop 1440x1000 and tablet 1024x768; phone tactical grid is intentionally unavailable in the incumbent App.'] },
  artifacts: Object.fromEntries(artifacts.map(file => [file, hash(file)])) };
fs.writeFileSync(path.join(temp, 'p14c1-final-evidence.json'), JSON.stringify(record, null, 2));
console.log(JSON.stringify({ reviewedRuntimeFiles: files.length, c1RuntimeMismatches: mismatches, compilationExit: build.exit,
  otherBuildDrift: build.drift, app: app.passed, evidence: path.join(temp, 'p14c1-final-evidence.json') }));
