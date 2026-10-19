const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '../../../../../..');
const retained = path.resolve(__dirname, '../CR-A1a');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const git = args => cp.execFileSync('git', args, {cwd:root,encoding:'utf8'}).trim();
const reported = readJson(path.join(retained, 'new-source-hashes.json'));
const baseline = readJson(path.join(retained, 'entry-server-hashes.json'));
const compare = ([file,expected]) => {
  const actual = hash(fs.readFileSync(path.join(root,file)));
  return {file,expected,actual,match:actual===expected};
};
const original = fs.readFileSync(path.join(root,reported.frozenFixtureSource.path));
const copied = fs.readFileSync(path.join(root,'server/tests/fixtures/crA1aDefinitionVectors.json'));
const patch = fs.readFileSync(path.join(retained,'new-files.patch'),'utf8').replaceAll('\r\n','\n');
const additions = patch.split(/(?=^diff --git )/m).filter(part=>part.startsWith('diff --git '));
const patchComparisons = additions.map(part=>{
  const lines = part.split('\n');
  const fileHeader = lines.find(line=>line.startsWith('+++ ')).slice(4);
  const file = (fileHeader.startsWith('"') ? JSON.parse(fileHeader) : fileHeader).replaceAll('\\','/').slice(2);
  const hunkIndex = lines.findIndex(line=>line.startsWith('@@ '));
  const restored = lines.slice(hunkIndex+1).filter(line=>line.startsWith('+')).map(line=>line.slice(1)).join('\n')+'\n';
  return {file,normalizedContentMatches:restored===fs.readFileSync(path.join(root,file),'utf8').replaceAll('\r\n','\n')};
});
const result = {
  capturedAt:new Date().toISOString(),branch:git(['branch','--show-current']),head:git(['rev-parse','HEAD']),
  reportedNewFiles:Object.entries(reported.files).map(compare),
  entryExistingFiles:Object.entries(baseline).map(compare),
  fixtureByteIdentical:original.equals(copied),fixtureSourceHash:hash(original),
  retainedPatch:patchComparisons,
  implementationEntryHead:reported.entryGitState.headAtEntry,
  implementationCompletionHead:reported.entryGitState.headAtCompletion,
  entryToCompletionDiff:git(['diff','--name-status',reported.entryGitState.headAtEntry+'..'+reported.entryGitState.headAtCompletion]),
  completionToReviewDiff:git(['diff','--name-status',reported.entryGitState.headAtCompletion+'..HEAD']),
  newTargetsAbsentAtEntry:Object.fromEntries(Object.keys(reported.files).map(file=>[file,git(['ls-tree',reported.entryGitState.headAtEntry,'--',file])===''])),
  reviewStatus:git(['status','--short'])
};
fs.writeFileSync(path.join(__dirname,'identity-results.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({head:result.head,newFiles:result.reportedNewFiles.length,baselineFiles:result.entryExistingFiles.length,
  mismatches:[...result.reportedNewFiles,...result.entryExistingFiles].filter(row=>!row.match),fixtureByteIdentical:result.fixtureByteIdentical,
  retainedPatch:result.retainedPatch,entryToCompletionDiff:result.entryToCompletionDiff,newTargetsAbsentAtEntry:result.newTargetsAbsentAtEntry},null,2));
if([...result.reportedNewFiles,...result.entryExistingFiles].some(row=>!row.match)||!result.fixtureByteIdentical||patchComparisons.some(row=>!row.normalizedContentMatches)) process.exitCode=1;
