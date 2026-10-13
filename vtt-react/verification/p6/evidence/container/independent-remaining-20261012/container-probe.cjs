const fs=require('fs'),path=require('path'),Module=require('module'),assert=require('assert/strict');
const {createRequire}=require('module');
const deps=createRequire('D:/VTT/vtt-react/package.json');
const filename='D:/VTT/vtt-react/verification/p6/character-save-browser.cjs';
let code=fs.readFileSync(filename,'utf8');
const historical=process.argv.includes('--historical');
if(historical){
 const snapshot=JSON.parse(require('zlib').gunzipSync(fs.readFileSync('D:/VTT/vtt-react/verification/p6/evidence/remaining/reviewed-source-complete.json.gz')));
 const directory=fs.mkdtempSync('D:/AppData/Temp/opencode/p6-container-reviewed-');
 for(const[file,bytes]of Object.entries(snapshot.files)){
  const destination=path.join(directory,file),content=Buffer.from(bytes,'base64');
  assert.equal(require('crypto').createHash('sha256').update(content).digest('hex'),snapshot.hashes[file]);
  fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,content);
 }
 code=Buffer.from(snapshot.files['vtt-react/verification/p6/character-save-browser.cjs'],'base64').toString('utf8');
 code=code.replace("const sourceRoot = path.resolve(__dirname, '../../src');",`const sourceRoot = ${JSON.stringify(path.join(directory,'vtt-react/src'))};`);
}
code=code.replace("canonical: 'services/firebase/characterPersistenceService.js'", "canonical: 'services/firebase/characterPersistenceService.js', runtime: 'services/firebase/characterStateService.js', containerShape: 'utils/containerShapeUtils.js'");
code=code.replace("if(window.__holdPath===ref.path)", `const validate=(value,inArray=false)=>{if(Array.isArray(value)){if(inArray)throw Error('Firestore nested array refused');value.forEach(item=>validate(item,true));}else if(value&&typeof value==='object')Object.values(value).forEach(item=>validate(item));};validate(v);if(window.__holdPath===ref.path)`);
const loaded=new Module(filename,module);loaded.filename=filename;loaded.paths=Module._nodeModulePaths(path.dirname(filename));loaded._compile(code,filename);
async function main(){
 const {server,manifest}=loaded.exports.start();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await deps('playwright').chromium.launch({channel:'chrome',headless:true});
 try {
  const context=await browser.newContext();await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.evaluate(async()=>{
   m('init').initStoreRegistry();window.__liveUser={uid:'u-a',getIdToken:async()=>'test'};m('auth').default.getState().setUser(__liveUser);await m('coordinator').whenHandoffIdle();
   const seed={id:'c-a',name:'CONTAINER PROBE',race:'Human',class:'Martyr',level:3,stats:{strength:10,agility:10,constitution:10,intelligence:10,spirit:10,charisma:10},resources:{health:{current:30,max:50},mana:{current:20,max:50},actionPoints:{current:2,max:3}},lore:{notes:'baseline'}};
   __docs.set('characters/c-a',m('canonical').transformForStorage(seed,'u-a'));await m('character').default.getState().loadActiveCharacter();__mount();
  });
  await page.getByRole('region',{name:'Selected character save status'}).waitFor();
  const observation=await page.evaluate(async()=>{
   const shape=m('containerShape').containerShapeFromCells([[true,false],[true,true]]);
   // ContainerWizard authors this precise persisted representation; inventory
   // library conversion with preserveProperties keeps it in personal inventory.
   const library={id:'shaped-pack',name:'Shaped pack',type:'container',quality:'common',width:2,height:2,containerProperties:{gridSize:{rows:2,cols:2},shape,items:[]}};
   const added=m('inventory').default.getState().addItemFromLibrary(library,{preserveProperties:true,preserveId:true});
   m('character').default.getState().updateLore('notes','production shaped container');await m('character').default.getState().saveCurrentCharacter();
   const canonical=m('outcome').getCharacterCandidate('c-a','canonical');
   const runtime=m('outcome').getCharacterCandidate('c-a','runtime');
   const runtimeResult=await m('outcome').saveCharacterDraft(runtime,(data,current)=>m('runtime').default.saveCharacterState('u-a','c-a',data,{isCurrent:current}));
   const authoredItem=m('inventory').default.getState().items[0];
   const canonicalEncoded=m('canonical').transformForStorage(canonical.payload,'u-a');
   const writes=window.__writes.filter(w=>JSON.stringify(w.value).includes('shaped-pack'));
   // Mimic the established legacy sanitizer encoding at this known path.
   const legacyItem=structuredClone(authoredItem);legacyItem.shape.cells=legacyItem.shape.cells.map(JSON.stringify);
   legacyItem.containerProperties.shape.cells=legacyItem.containerProperties.shape.cells.map(JSON.stringify);
   const canonicalDoc=m('canonical').transformForStorage({...canonical.payload,inventory:{...canonical.payload.inventory,items:[legacyItem]}},'u-a');
   __docs.set('characters/c-a',canonicalDoc);__docs.set('users/u-a/characterStates/c-a',{...runtime.payload,inventory:{...runtime.payload.inventory,items:[legacyItem]}});
   const canonicalLoad=await m('canonical').default.loadCharacter('c-a','u-a');const runtimeLoad=await m('runtime').default.loadCharacterState('u-a','c-a');
   const loadedFloorCells={};for(const [lane,value]of Object.entries({canonical:canonicalLoad,runtime:runtimeLoad}))loadedFloorCells[lane]=m('containerShape').getContainerShapeCells(value.inventory.items[0].containerProperties.shape,2,2);
   return {added,expectedCells:shape.cells,authoredItem,canonicalStatus:canonical.status,canonicalMessage:canonical.message,runtimeResult,canonicalEncoded,writes,canonicalLoad,runtimeLoad,loadedFloorCells};
  });
  assert.equal(observation.added,'shaped-pack');assert.deepEqual(observation.expectedCells,[[true,false],[true,true]]);
  if(historical){
   assert.equal(observation.canonicalStatus,'saved');assert.equal(observation.runtimeResult.success,true);
   assert(observation.writes.some(w=>w.path==='characters/c-a'));assert(observation.writes.some(w=>w.path==='users/u-a/characterStates/c-a'));
   for(const lane of ['canonical','runtime']){assert.deepEqual(observation[lane+'Load'].inventory.items[0].containerProperties.shape.cells,observation.expectedCells);assert.deepEqual(observation.loadedFloorCells[lane],observation.expectedCells);}
  }else{
   assert.equal(observation.canonicalStatus,'error');assert(observation.canonicalMessage.includes('would change preserved data'));
   assert.equal(observation.runtimeResult.success,false);assert(observation.runtimeResult.error.includes('would change preserved data'));assert.deepEqual(observation.writes,[]);
   for(const lane of ['canonical','runtime']){assert.deepEqual(observation[lane+'Load'].inventory.items[0].containerProperties.shape.cells,['[true,false]','[true,true]']);assert.deepEqual(observation.loadedFloorCells[lane],[[true,true],[true,true]]);}
  }
  assert.deepEqual(errors,[]);
  const result={result:historical?'HISTORICAL-CONTAINER-COMPATIBILITY-PASS':'R1-BLOCK-REPRODUCED',manifest,observation,errors,snapshot:await page.locator('body').ariaSnapshot()};
  fs.writeFileSync(path.join(__dirname,historical?'container-historical.json':'container-probe.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({result:result.result,canonicalStatus:observation.canonicalStatus,canonicalMessage:observation.canonicalMessage,runtimeResult:observation.runtimeResult,expected:observation.expectedCells,loadedFloorCells:observation.loadedFloorCells,errors},null,2));await context.close();
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
