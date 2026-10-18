const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '../../../../../..');
const packageRoot = path.resolve(__dirname, '../../..');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const frozen = read(path.join(packageRoot, 'evidence/frozen-handoff-source.json'));
const manifest = read(path.join(__dirname, '../source-diff-manifest.json'));
const changed = new Set(manifest.changedSourceFiles.map(row => row.path));
const after = [...manifest.changedSourceFiles.map(row => [row.path, row.afterSha256]),
  ...manifest.newTestFiles.map(row => [row.path, row.sha256]),
  ...Object.entries(manifest.protectedFilesVerifiedUnchanged)];
const results = {
  capturedAt: new Date().toISOString(), head: cp.execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  implementationHashes: after.map(([file, expected]) => ({file, expected, actual:hash(fs.readFileSync(path.join(root,file)))})),
  frozenProtected: Object.entries(frozen.sourceHashes).filter(([file])=>!changed.has(file)).map(([file, expected])=>({file,expected,actual:hash(fs.readFileSync(path.join(root,file)))})),
  newA1aTargets: Object.fromEntries(Object.keys(frozen.newTargets).map(file=>[file,fs.existsSync(path.join(root,file))]))
};
const paths = [...changed];
const liveDiff = cp.execFileSync('git', ['diff','--',...paths], {cwd:root,encoding:'utf8'}).replaceAll('\r\n','\n');
const retainedDiff = fs.readFileSync(path.join(__dirname,'../diff-W1a-W1b.patch'),'utf8').replaceAll('\r\n','\n');
results.retainedDiffMatchesCurrent = liveDiff === retainedDiff;
results.allHashesMatch = [...results.implementationHashes,...results.frozenProtected].every(row=>row.actual===row.expected);
fs.writeFileSync(path.join(__dirname,'manifest-verification.json'),JSON.stringify(results,null,2)+'\n');
const originalHandoff = read(path.join(packageRoot,'implementation/frozen-handoff-manifest.json'));
const a1a = 'implementation/CR-A1a-DEFINITION-INFRASTRUCTURE.md';
const vectors = 'implementation/fixtures/CR-A1a-definition-vectors.json';
fs.writeFileSync(path.join(__dirname,'a1a-clarification-manifest.json'), JSON.stringify({
  capturedAt:new Date().toISOString(),scope:'HeadQ clarification addendum only; no application implementation authorization',
  contract:a1a,originalFrozenSha256:originalHandoff.files[a1a],
  clarifiedSha256:hash(fs.readFileSync(path.join(packageRoot,a1a))),
  goldenVectors:{file:vectors,expected:originalHandoff.files[vectors],actual:hash(fs.readFileSync(path.join(packageRoot,vectors)))},
  unchangedW1Contracts:['implementation/CR-W1a-ZERO-AP.md','implementation/CR-W1b-RESOURCE-COST-ROUNDTRIP.md'].map(file=>({file,expected:originalHandoff.files[file],actual:hash(fs.readFileSync(path.join(packageRoot,file)))})),
  newA1aTargets:results.newA1aTargets,serverOnly:true,executionEnabled:false,installed:false,
  acceptanceCondition:'Combined W1 acceptance withheld; A1a handoff clarified but no acceptance-conditioned implementation release issued.'
},null,2)+'\n');
console.log(JSON.stringify({implementationHashes:results.implementationHashes.length,protectedHashes:results.frozenProtected.length,allHashesMatch:results.allHashesMatch,retainedDiffMatchesCurrent:results.retainedDiffMatchesCurrent,drift:[...results.implementationHashes,...results.frozenProtected].filter(row=>row.actual!==row.expected),newA1aTargets:results.newA1aTargets},null,2));
