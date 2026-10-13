const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const read=file=>JSON.parse(fs.readFileSync(file)),out=__dirname,retained='D:/VTT/vtt-react/verification/p6/evidence/container';
const red=read(path.join(out,'container-red.json')),historical=read(path.join(out,'container-historical.json')),green=read(path.join(out,'container-green.json'));
const frozen=read(retained+'/freeze-complete.json');assert.deepEqual(red.manifest,frozen.manifest);
assert.deepEqual(historical.manifest,read(retained+'/independent-remaining-20261012/container-historical.json').manifest);
assert.deepEqual(historical.manifest,read(retained+'/historical.json').manifest);
const changed=Object.keys(red.manifest).filter(file=>green.manifest[file]!==red.manifest[file]);assert.deepEqual(changed,['utils/characterShapeCodec.js']);
const cells=[[true,false],[true,true]],outer=[[true,true],[true,true]],rows=['[true,false]','[true,true]'];
assert.equal(red.observation.canonicalStatus,'error');assert(red.observation.canonicalMessage.includes('would change preserved data'));
assert.equal(red.observation.runtimeResult.success,false);assert(red.observation.runtimeResult.error.includes('would change preserved data'));assert.deepEqual(red.observation.writes,[]);
for(const lane of ['canonical','runtime']){assert.deepEqual(red.observation[lane+'Load'].inventory.items[0].containerProperties.shape.cells,rows);assert.deepEqual(red.observation.loadedFloorCells[lane],outer);}
for(const result of [historical,green]) {
  assert.deepEqual(result.errors,[]);assert.equal(result.observation.added,'shaped-pack');assert.equal(result.observation.canonicalStatus,'saved');assert.equal(result.observation.runtimeResult.success,true);
  const item=result.observation.authoredItem;assert.deepEqual(item.containerProperties.shape.cells,cells);assert.deepEqual(item.shape.cells,outer);
  for(const [lane,destination] of [['canonical','characters/c-a'],['runtime','users/u-a/characterStates/c-a']]) {
    const writes=result.observation.writes.filter(write=>write.path===destination);assert(writes.length>0);
    const saved=writes.at(-1).value.inventory.items[0];assert.deepEqual(saved.containerProperties.shape.cells,rows);assert.deepEqual(saved.shape.cells,outer.map(JSON.stringify));
    for(const value of [result.observation.savedLoads[lane],result.observation[lane+'Load']]) {assert.deepEqual(value.inventory.items[0].containerProperties.shape,item.containerProperties.shape);assert.deepEqual(value.inventory.items[0].shape,item.shape);}
    assert.deepEqual(result.observation.loadedFloorCells[lane],cells);
  }
}
for(const phase of ['imported','loaded','failed','recovered','healed'])for(const lane of ['canonical','runtime']){
  const value=green.controls[phase][lane],expected=green.controls.input[lane];assert.deepEqual(value.inventory,expected.inventory);
  for(const slot of ['mainHand','weapon','accessories'])assert.deepEqual(value.equipment[slot],expected.equipment[slot]);
  assert.deepEqual(value.futureAnnotation.shape.cells,['[true]']);assert.deepEqual(value.inventory.items[0].futureAnnotation.shape.cells,['[true]']);assert.deepEqual(value.inventory.items[0].containerProperties.futureAnnotation.shape.cells,['[true]']);
  assert.deepEqual(value.inventory.items[0].containerProperties.shape.cells,cells);assert.deepEqual(value.inventory.items[0].shape.cells,outer);
}
assert.deepEqual(green.controls.recovered.items,green.controls.failed.items);assert.equal(green.controls.recovered.canonical.lore.notes,'container recovery');assert.equal(green.controls.recovered.runtime.health.current,8);
assert.equal((green.snapshot.match(/Cloud saved · Device draft retained/g)||[]).length,2);
const focused=read(path.join(out,'remaining-green.json')),accepted=read(path.join(out,'green.json')),supplemental=read(path.join(out,'remaining-retained-controls.json'));
assert.equal(focused.results.length,4);assert.equal(accepted.results.length,14);assert.equal(focused.results[2].observation.rejected.length,17);
for(const result of [...focused.results,...accepted.results]){assert.equal(result.result,'GREEN');assert.deepEqual(result.errors,[]);}
assert.equal(supplemental.result.length,4);for(const result of supplemental.result){assert.deepEqual(result.errors,[]);}
const before=read(path.join(out,'before.json'));
for(const document of [green,focused,accepted,supplemental])for(const [file,expected]of Object.entries(document.manifest))assert.equal(before.hashes['vtt-react/src/'+file],expected,file);
const originalP6=read(path.join(out,'original-p6.utf8.log'));assert.equal(originalP6.result,'PASS');assert.equal(originalP6.witnesses.length,5);
for(const [file,expected]of Object.entries(originalP6.manifest))assert.equal(before.hashes['vtt-react/src/'+file],expected,file);
const originalP5=fs.readFileSync(path.join(out,'original-p5.utf8.log'),'utf8');
const sourceManifest=JSON.parse(originalP5.split('\n')[0].slice('SOURCE_MANIFEST '.length));
for(const [file,expected]of Object.entries(sourceManifest))assert.equal(before.hashes['vtt-react/src/'+file],expected.toLowerCase(),file);
const p5Results=[];
for(const match of originalP5.matchAll(/\{\s*"mode":/g)) {
  let depth=0,string=false,escape=false,end=match.index;
  for(;end<originalP5.length;end++){const ch=originalP5[end];if(string){if(escape)escape=false;else if(ch==='\\')escape=true;else if(ch==='"')string=false;}else if(ch==='"')string=true;else if(ch==='{')depth++;else if(ch==='}'&&!--depth){end++;break;}}
  const result=JSON.parse(originalP5.slice(match.index,end));assert.equal(result.status,'PASS');assert.deepEqual(result.failures,[]);p5Results.push(result.mode);
}
assert.deepEqual([...new Set(p5Results)],['pending-edit','failed-preservation','marker-failure']);
const previous=read(retained+'/independent-remaining-20261012/after.json');
for(const file of ['src/components/item-generation/ContainerWizard.jsx','src/components/item-generation/ItemLibrary.jsx','src/components/item-generation/ContainerWindow.jsx','src/store/inventoryStore.js','src/store/containerStore.js','src/utils/containerShapeUtils.js'])assert.equal(before.hashes['vtt-react/'+file],previous.hashes['vtt-react/'+file],file);
for(const file of ['docs/MYTHRILL_NEXT_PHASE.md','docs/MYTHRILL_PROJECT_6_CONTRACT.md','docs/MYTHRILL_P5_01_INDEPENDENT_ACCEPTANCE_20261012.md','vtt-react/verification/p6/remaining-browser.cjs','vtt-react/verification/p6/remaining-output.cjs','vtt-react/verification/p6/character-save-browser.cjs','vtt-react/verification/p5-01/character-preservation-browser.cjs'])assert.equal(before.hashes[file],previous.hashes[file],file);
const summary={red:{saveRefusals:[red.observation.canonicalMessage,red.observation.runtimeResult.error],destinationWrites:0,legacyRows:rows,floor:outer,manifestMatchesFrozen:true},historical:{manifestMatchesRetainedIndependent:true,saves:'confirmed',floor:cells},green:{saves:'confirmed',destinations:green.observation.writes.map(write=>write.path),interior:cells,outer,upperRightBlocked:true,legacyDecoded:true,checks:green.controls.checks,annotationsUnchanged:true,recoveryHealth:8},dependencyCount:Object.keys(green.manifest).length,redToGreenChangedDependencies:changed,focusedScenarios:4,malformedRefusals:17,retainedScenarios:14,supplementalScenarios:4};
summary.originalP5=[...new Set(p5Results)];summary.originalP6=originalP6.witnesses;
fs.writeFileSync(path.join(out,'observations.json'),JSON.stringify(summary,null,2));
fs.writeFileSync(path.join(out,'container-final.yml'),green.snapshot);console.log(JSON.stringify(summary,null,2));
