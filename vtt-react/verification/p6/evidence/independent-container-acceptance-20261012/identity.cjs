const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto'), zlib = require('zlib'), assert = require('assert/strict');
const root = 'D:/VTT', out = __dirname;
const git = (...args) => cp.execFileSync('git', args, {cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024}).trim();
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const files = git('ls-files', '--cached', '--others', '--exclude-standard', '-z').split('\0').filter(Boolean);
const hashes = Object.fromEntries(files.map(file => [file, hash(fs.readFileSync(path.join(root, file)))]));
function walk(dir, records, base) { for (const entry of fs.readdirSync(dir, {withFileTypes:true})) { const file = path.join(dir, entry.name); if(entry.isDirectory())walk(file, records, base); else records[path.relative(base,file).replace(/\\/g,'/')] = hash(fs.readFileSync(file)); } }
walk(root + '/vtt-react/verification', hashes, root);
const phase = process.argv[2];
const record = {date:new Date().toISOString(),checkout:git('rev-parse','--show-toplevel'),head:git('rev-parse','HEAD'),branch:git('branch','--show-current'),status:git('status','--porcelain=v1','--untracked-files=all'),hashes};
assert.equal(record.checkout, 'D:/VTT'); assert.equal(record.head, '620fbc072e87f113cdcc2ea323e0c6c2b28e6d6b');
assert.equal(hashes['vtt-react/src/utils/characterShapeCodec.js'], 'ddbd6d694e62a8a14709d058be69b14b0fcce20d32364be69564dd8303a83b37');
assert.equal(hashes['vtt-react/verification/p6/container-browser.cjs'], '706e4f964b6a89612044ffc9e15f354b18118b375b985d24b191aadaac7003c4');
fs.writeFileSync(path.join(out,phase+'.json'),JSON.stringify(record,null,2));
if(phase === 'before') {
  const base = root + '/vtt-react/verification/p6/evidence/container';
  const manifest = JSON.parse(fs.readFileSync(base+'/artifact-manifest.json'));
  for(const [file,expected] of Object.entries(manifest)) assert.equal(hash(fs.readFileSync(path.join(base,file))), expected, file);
  const preserved = JSON.parse(fs.readFileSync(base+'/independent-remaining-20261012/preserved-manifest.json'));
  for(const [file,expected] of Object.entries(preserved)) assert.equal(hash(fs.readFileSync(path.join(base,'independent-remaining-20261012',file))),expected,file);
  const frozen = JSON.parse(fs.readFileSync(base+'/freeze-complete.json'));
  const snapshots = [];
  for(const [file,expected,comparison] of [
    [base+'/reviewed-source-complete.json.gz','f087a576076a97e47e982253a64fac7eba86a41b8c11625ae74a7030b0d83b0e',base+'/before.json'],
    [root+'/vtt-react/verification/p6/evidence/remaining/reviewed-source-complete.json.gz','0afa985b4679640c7ae945f14af17296f7004f29db9c1ad65b2d6e1653088be3',root+'/vtt-react/verification/p6/evidence/independent-rereview-20261012/after.json']]) {
    const bytes=fs.readFileSync(file);assert.equal(hash(bytes),expected);
    const snapshot=JSON.parse(zlib.gunzipSync(bytes)), prior=JSON.parse(fs.readFileSync(comparison));
    for(const [name,encoded] of Object.entries(snapshot.files)) {const actual=hash(Buffer.from(encoded,'base64'));assert.equal(actual,snapshot.hashes[name],name);assert.equal(actual,prior.hashes[name],name);}
    snapshots.push({file,sha256:expected,files:Object.keys(snapshot.files).length});
  }
  assert.equal(frozen.runnerSha256,hashes['vtt-react/verification/p6/container-browser.cjs']);
  const retained=JSON.parse(fs.readFileSync(base+'/green.json')).manifest;
  const drift=Object.keys(retained).filter(file=>hashes['vtt-react/src/'+file]!==retained[file]); assert.deepEqual(drift,[]);
  fs.writeFileSync(path.join(out,'evidence-integrity.json'),JSON.stringify({containerManifestFiles:Object.keys(manifest).length,preservedFiles:Object.keys(preserved).length,snapshots,retainedDependencyCount:Object.keys(retained).length,retainedDependencyDrift:drift},null,2));
  console.log(JSON.stringify({checkout:record.checkout,head:record.head,branch:record.branch,files:Object.keys(hashes).length,snapshots,retainedDependencyCount:Object.keys(retained).length},null,2));
} else {
  const before=JSON.parse(fs.readFileSync(path.join(out,'before.json')));
  const changed=Object.keys(before.hashes).filter(file=>hashes[file]!==before.hashes[file]);
  const added=Object.keys(hashes).filter(file=>!before.hashes[file]);
  const focal=Object.keys(hashes).filter(file=>file.startsWith('vtt-react/verification/')||file.startsWith('vtt-react/src/persistence/')||file.startsWith('vtt-react/src/services/')||file==='vtt-react/src/utils/characterShapeCodec.js');
  assert.deepEqual(changed.filter(file=>focal.includes(file)),[]); assert.deepEqual(added,[]);
  const manifest=JSON.parse(fs.readFileSync(path.join(out,'container-green.json'))).manifest;
  for(const [file,expected] of Object.entries(manifest)){assert.equal(before.hashes['vtt-react/src/'+file],expected,file);assert.equal(hashes['vtt-react/src/'+file],expected,file);}
  const result={headUnchanged:before.head===record.head,changed,added,behavioralDependenciesUnchanged:Object.keys(manifest).length,evidenceUnchanged:true};
  fs.writeFileSync(path.join(out,'integrity-summary.json'),JSON.stringify(result,null,2));
  const selected=['vtt-react/src/utils/characterShapeCodec.js','vtt-react/src/persistence/characterSaveOutcome.js','vtt-react/src/services/firebase/characterPersistenceService.js','vtt-react/src/services/firebase/characterStateService.js','vtt-react/src/hooks/useCharacterPersistence.js','vtt-react/verification/p6/container-browser.cjs','vtt-react/verification/p6/character-save-browser.cjs','vtt-react/verification/p6/remaining-browser.cjs','vtt-react/verification/p6/remaining-output.cjs','docs/MYTHRILL_PROJECT_6_CONTRACT.md','docs/MYTHRILL_NEXT_PHASE.md','vtt-react/src/components/item-generation/ContainerWizard.jsx','vtt-react/src/components/item-generation/ItemLibrary.jsx','vtt-react/src/components/item-generation/ContainerWindow.jsx','vtt-react/src/store/inventoryStore.js','vtt-react/src/utils/containerShapeUtils.js','vtt-react/verification/p5-01/character-preservation-browser.cjs'];
  fs.writeFileSync(path.join(out,'focal-hashes.md'),'# Before/after SHA256\n\n| Path | Before | After |\n|---|---|---|\n'+selected.map(file=>'| `'+file+'` | `'+before.hashes[file]+'` | `'+hashes[file]+'` |').join('\n')+'\n');
  console.log(JSON.stringify(result,null,2));
}
