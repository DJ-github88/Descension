const fs=require('fs'),cp=require('child_process'),path=require('path'),crypto=require('crypto'),zlib=require('zlib'),assert=require('assert/strict');
const root='D:/VTT',evidence=root+'/vtt-react/verification/p6/evidence/remaining',out=__dirname;
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const json=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const git=(...args)=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:64*1024*1024}).trim();
if(process.argv.includes('--prepare')) {
  if(!fs.existsSync(evidence+'/first-red.json'))fs.copyFileSync(evidence+'/red.json',evidence+'/first-red.json');
  fs.copyFileSync('D:/AppData/Temp/opencode/p6-rereview-20261012/retained-controls.cjs',out+'/retained-controls.cjs');
  return;
}
const before=json(out+'/before.json');
assert.equal(git('rev-parse','HEAD'),before.head);
const production=['vtt-react/src/utils/characterShapeCodec.js','vtt-react/src/persistence/characterSaveOutcome.js','vtt-react/src/services/firebase/characterPersistenceService.js'];
const files=git('ls-files','--cached','--others','--exclude-standard').split('\n');
const hashes=Object.fromEntries(files.map(file=>[file,hash(fs.readFileSync(root+'/'+file))]));
const changedExisting=Object.keys(before.hashes).filter(file=>hashes[file]!==before.hashes[file]);
const concurrent=changedExisting.filter(file=>!production.includes(file));
const presentation = ['vtt-react/src/styles/calm-shared.css', 'vtt-react/src/components/hud/MadnessGaugeResourceBar.jsx',
 'vtt-react/src/components/hud/TimeShardsStrainResourceBar.jsx', 'vtt-react/src/components/hud/styles/resourceBars/madness-gauge.css',
 'vtt-react/src/components/hud/styles/resourceBars/time-shards-strain.css',
 'vtt-react/src/data/classes/berserker/components/BerserkerResourceBar.jsx',
 'vtt-react/src/data/classes/minstrel/components/MinstrelResourceBar.jsx', 'vtt-react/src/data/classes/minstrel/styles/MinstrelResourceBar.css'];
assert(concurrent.every(file=>presentation.includes(file)||/^vtt-react\/src\/data\/classes\/[^/]+\/(components|styles)\/[^/]*ResourceBar\.(jsx|css)$/.test(file)),
 'Inspect unexpected non-correction source drift: '+JSON.stringify(concurrent));
for(const file of production)assert.notEqual(before.hashes[file],hashes[file]);
const preserved=root+'/vtt-react/verification/p6/evidence/independent-rereview-20261012';
for(const artifact of json(preserved+'/preserved-manifest.json').artifacts)assert.equal(hash(fs.readFileSync(preserved+'/'+artifact.path)),artifact.sha256,artifact.path);
assert.equal(hashes['docs/MYTHRILL_P6_INDEPENDENT_REREVIEW_BLOCK_20261012.md'],hash(fs.readFileSync(preserved+'/review.md')));
for(const file of ['docs/MYTHRILL_PROJECT_6_CONTRACT.md','docs/MYTHRILL_P6_INDEPENDENT_BLOCK_20261012.md','docs/MYTHRILL_P6_R1_R6_CORRECTIONS_20261012.md',
 'docs/MYTHRILL_P5_01_INDEPENDENT_ACCEPTANCE_20261012.md','vtt-react/src/App.jsx','vtt-react/src/components/rules/ClassCodex.css',
 'vtt-react/src/components/spellcrafting-wizard/components/library/SpellLibrary.jsx','vtt-react/src/components/spellcrafting-wizard/data/effects/DebuffEffects.jsx',
 'vtt-react/src/components/spellcrafting-wizard/styles/pathfinder/all-spellwizard-styles.css','vtt-react/src/components/spellcrafting-wizard/styles/pathfinder/spell-wizard-calm.css',
 'vtt-react/verification/p6/character-save-browser.cjs','vtt-react/verification/p6/regressions-browser.cjs',
 'vtt-react/verification/p5-01/character-browser-harness.cjs','vtt-react/verification/p5-01/character-preservation-browser.cjs'])assert.equal(hashes[file],before.hashes[file],file);
const frozen=json(evidence+'/freeze-complete.json'),snapshotBytes=fs.readFileSync(evidence+'/reviewed-source-complete.json.gz'),snapshot=jsonFromGzip(snapshotBytes);
assert.equal(hash(snapshotBytes),frozen.snapshotSha256);assert.equal(hash(fs.readFileSync(evidence+'/reviewed-witness.cjs')),frozen.witnessSha256);
for(const[file,bytes]of Object.entries(snapshot.files)){assert.equal(hash(Buffer.from(bytes,'base64')),snapshot.hashes[file]);assert.equal(snapshot.hashes[file],before.hashes[file]);}
const red=json(evidence+'/red.json'),green=json(evidence+'/green.json'),accepted=json(evidence+'/accepted-r1-r6-green.json');
assert.deepEqual(red.manifest,frozen.manifest);assert.equal(red.results.length,2);assert(red.results.every(r=>r.result==='RED-REPRODUCED'&&!r.errors.length));
assert.deepEqual(red.results[0].observation.canonicalLoad.futureAnnotation.shape.cells,[[true]]);
assert.deepEqual(red.results[0].observation.runtimeLoad.futureAnnotation.shape.cells,[[true]]);
assert.deepEqual(red.results[1].observation.after.live.class,{invalid:'object'});assert.deepEqual(red.results[1].observation.after.alerts,[]);
assert.equal(green.results.length,4);assert(green.results.every(r=>r.result==='GREEN'&&!r.errors.length));
assert.equal(green.results[2].observation.rejected.length,17);
assert.equal(accepted.results.length,14);assert(accepted.results.every(r=>r.result==='GREEN'&&!r.errors.length));
const p6=json(out+'/final-p6-browser.log'),controls=json(out+'/retained-controls.json');assert.equal(p6.result,'PASS');assert.equal(controls.result.length,4);
for(const result of [green,accepted,p6,controls])for(const[file,expected]of Object.entries(result.manifest))assert.equal(hashes['vtt-react/src/'+file],expected,'Current witness source: '+file);
const p5=fs.readFileSync(out+'/final-p5-browser.log','utf8');assert(p5.includes('P5_CHARACTER_BROWSER GREEN pending-edit:PASS failed-preservation:PASS marker-failure:PASS'));
for(const[file,expected]of Object.entries(JSON.parse(p5.split('\n')[0].replace('SOURCE_MANIFEST ',''))))assert.equal(hashes['vtt-react/src/'+file],expected.toLowerCase());
assert(fs.readFileSync(out+'/final-regressions.log','utf8').includes('134 passed'));assert.equal(fs.readFileSync(out+'/final-lint.log','utf8').trim(),'');
assert.equal(fs.readFileSync(out+'/build-final.exit','utf8').trim(),'0');assert(fs.readFileSync(out+'/build-final.log','utf8').includes('Compiled successfully'));
const buildBefore=json(out+'/build-final-before.json'),buildAfter=json(out+'/build-final-after.json');
for(const file of production){assert.equal(buildBefore.hashes[file],hashes[file]);assert.equal(buildAfter.hashes[file],hashes[file]);}
for(const name of ['before.json','final-focused.log','red.log','red-complete.log','final-red-replay.log','final-accepted.log','final-regressions.log','final-lint.log',
 'final-p6-browser.log','final-p5-browser.log','retained-controls.cjs','retained-controls.json','retained-controls.log','build-final.log','build-final.exit',
 'build-final-before.json','build-final-after.json','build.log','build.exit','build-before.json','build-after.json','build-identity.cjs','finalize.cjs'])fs.copyFileSync(out+'/'+name,evidence+'/'+name);
fs.copyFileSync('D:/AppData/Temp/opencode/p6-independent-20261012/build.config.cjs',evidence+'/build.config.cjs');
const witness=['vtt-react/verification/p6/remaining-browser.cjs','vtt-react/verification/p6/remaining-output.cjs'];
const result={date:new Date().toISOString(),checkout:git('rev-parse','--show-toplevel'),head:git('rev-parse','HEAD'),status:git('status','--porcelain=v1','--untracked-files=all'),
 changedExisting,concurrent,addedFiles:files.filter(file=>!before.hashes[file]),hashes,
 buildDrift:buildAfter.drift,frozenSnapshotSha256:frozen.snapshotSha256,redManifestVerified:true,greenManifestsVerified:true,
 focalHashes:Object.fromEntries([...production,...witness].map(file=>[file,{before:before.hashes[file]||null,after:hashes[file]}])),
 evidenceHashes:Object.fromEntries(fs.readdirSync(evidence).filter(file=>fs.statSync(evidence+'/'+file).isFile()).map(file=>[file,hash(fs.readFileSync(evidence+'/'+file))]))};
fs.writeFileSync(evidence+'/final-identity.json',JSON.stringify(result,null,2));
fs.writeFileSync(evidence+'/source-hashes.md','# Remaining correction source identity\n\nHEAD '+result.head+'; reviewed uncommitted bytes.\n\n| Path | Before SHA256 | After SHA256 |\n|---|---|---|\n'+[...production,...witness].map(file=>'| `'+file+'` | `'+(before.hashes[file]||'new')+'` | `'+hashes[file]+'` |').join('\n')+'\n\nConcurrent existing-file drift: '+JSON.stringify(concurrent)+'\nBuild-time drift: '+JSON.stringify(buildAfter.drift)+'\n');
const temporary=fs.mkdtempSync('D:/AppData/Temp/opencode/p6-remaining-diff-');const diffs=[];
for(const file of production){const original=path.join(temporary,file);fs.mkdirSync(path.dirname(original),{recursive:true});fs.writeFileSync(original,Buffer.from(snapshot.files[file],'base64'));const diff=cp.spawnSync('git',['diff','--no-index','--',original,root+'/'+file],{encoding:'utf8'});assert([0,1].includes(diff.status));diffs.push(diff.stdout);}
fs.writeFileSync(evidence+'/correction-only.patch',diffs.join('\n'));
const intent = file => production.includes(file) || witness.includes(file) ||
 ['docs/MYTHRILL_P6_INDEPENDENT_REREVIEW_BLOCK_20261012.md','docs/MYTHRILL_P6_R1_R4_REMAINING_CORRECTIONS_20261012.md'].includes(file) ||
 file.startsWith('vtt-react/verification/p6/evidence/remaining/') || file.startsWith('vtt-react/verification/p6/evidence/independent-rereview-20261012/');
const changesPath='vtt-react/verification/p6/evidence/remaining/file-changes.json';
const currentFiles=git('ls-files','--cached','--others','--exclude-standard').split('\n');
const physicalEvidence=[];
function listEvidence(directory) { for(const entry of fs.readdirSync(root+'/'+directory,{withFileTypes:true})) {
  const file=directory+'/'+entry.name;if(entry.isDirectory())listEvidence(file);else physicalEvidence.push(file);
} }
listEvidence('vtt-react/verification/p6/evidence/remaining');
listEvidence('vtt-react/verification/p6/evidence/independent-rereview-20261012');
fs.writeFileSync(evidence+'/file-changes.json',JSON.stringify({modifiedByThisTask:production,
 addedByThisTask:[...new Set([...currentFiles.filter(file=>!before.hashes[file]&&intent(file)),...physicalEvidence,changesPath])].sort(),
 concurrentModified:concurrent,concurrentAdded:currentFiles.filter(file=>!before.hashes[file]&&!intent(file))},null,2));
const finalFiles=git('ls-files','--cached','--others','--exclude-standard').split('\n');
result.addedFiles=finalFiles.filter(file=>!before.hashes[file]);
// A manifest cannot include its own hash; all other recorded files are hashed
// after artifact copying/generation so the snapshot describes the actual bytes.
result.hashes=Object.fromEntries(finalFiles.filter(file=>file!=='vtt-react/verification/p6/evidence/remaining/final-identity.json').map(file=>[file,hash(fs.readFileSync(root+'/'+file))]));
result.evidenceHashes=Object.fromEntries(fs.readdirSync(evidence).filter(file=>file!=='final-identity.json'&&fs.statSync(evidence+'/'+file).isFile()).map(file=>[file,hash(fs.readFileSync(evidence+'/'+file))]));
fs.writeFileSync(evidence+'/final-identity.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({head:result.head,production:result.focalHashes,concurrent,buildDrift:result.buildDrift,red:2,focused:4,malformed:17,accepted:14},null,2));
function jsonFromGzip(bytes){return JSON.parse(zlib.gunzipSync(bytes));}
