const fs = require('fs');
const path = require('path');
const Module = require('module');
const assert = require('assert/strict');
const { createRequire } = require('module');
const deps = createRequire('D:/VTT/vtt-react/package.json');
// Instrument only the witness's entry exposure and external snapshot transport.
// Production module bodies are compiled unchanged from the reviewed checkout.
const filename = 'D:/VTT/vtt-react/verification/p6/character-save-browser.cjs';
let code = fs.readFileSync(filename, 'utf8');
code = code.replace("canonical: 'services/firebase/characterPersistenceService.js'", "canonical: 'services/firebase/characterPersistenceService.js', runtime: 'services/firebase/characterStateService.js', sync: 'services/firebase/characterSyncService.js', session: 'services/firebase/characterSessionService.js', sanitizer: 'utils/firebaseUtils.js', context: 'persistence/scopedConsumer.js'");
code = code.replace('exports.onSnapshot=()=>()=>{};', 'exports.onSnapshot=(ref,callback)=>{(window.__listeners ||= []).push({path:ref.path,callback});return ()=>{};};');
code = code.replace('await write(\'addDoc\',r,v);return r;', 'await write(\'addDoc\',r,v);r.id=r.path.split(\'/\').at(-1);return r;');
code = code.replace("exports.getDoc=async ref=>({exists:()=>docs.has(ref.path),data:()=>clone(docs.get(ref.path))});", "exports.getDoc=async ref=>{if(window.__holdReadPath===ref.path)await new Promise(resolve=>{window.__releaseRead=resolve;});return {exists:()=>docs.has(ref.path),data:()=>clone(docs.get(ref.path))};};");
const loaded = new Module(filename, module);
loaded.filename = filename; loaded.paths = Module._nodeModulePaths(path.dirname(filename)); loaded._compile(code, filename);
const result = [];
async function run() {
  const { server, manifest } = loaded.exports.start();
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  const browser = await deps('playwright').chromium.launch({channel:'chrome',headless:true});
  try {
    async function scenario(name, fn) {
      const context = await browser.newContext({acceptDownloads:true});
      await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
      const page = await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
      await page.goto(`http://127.0.0.1:${server.address().port}`);
      await page.evaluate(async () => {
        m('init').initStoreRegistry(); window.__liveUser={uid:'u-a',getIdToken:async()=> 'test'};
        m('auth').default.getState().setUser(__liveUser); await m('coordinator').whenHandoffIdle();
        window.__seed={id:'c-a',name:'REVIEW HERO',race:'Human',class:'Martyr',level:3,
          stats:{strength:10,agility:10,constitution:10,intelligence:10,spirit:10,charisma:10},
          resources:{health:{current:30,max:50},mana:{current:20,max:50},actionPoints:{current:2,max:3}},lore:{notes:'baseline'},
          classResource:{type:'devotionGauge',current:0,max:6,damage:0,earnedLevels:0,spentLevels:0,bonusLevels:0}};
        __docs.set('characters/c-a',m('canonical').transformForStorage(__seed,'u-a'));
        await m('character').default.getState().loadActiveCharacter(); __mount();
      });
      await page.getByRole('region',{name:'Selected character save status'}).waitFor();
      const evidence = await fn(page);
      assert.equal(errors.length,0,errors.join('\n'));
      const item={name,evidence,errors}; result.push(item); console.log(JSON.stringify(item,null,2));
      await context.close();
    }
    await scenario('mounted-import-over-newer-work',async page=>{
      const raw=await page.evaluate(()=>{
        const s=m('character').default; s.getState().updateLore('notes','older exported draft');
        s.getState().updateResource('health',19); return m('outcome').exportCharacterDraft('c-a');
      });
      await page.evaluate(()=>{window.__rejectCanonical=true;window.__rejectRuntime=true;m('character').default.getState().updateLore('notes','newer work to preserve');m('character').default.getState().updateResource('health',7);});
      await page.waitForTimeout(2400); // real failed autosave has finished; no still-pending capture can accidentally rescue the import.
      const before=await page.evaluate(()=>({notes:m('character').default.getState().lore.notes,health:m('character').default.getState().health.current,draft:JSON.parse(m('outcome').exportCharacterDraft('c-a'))}));
      await page.getByLabel('Import selected draft').setInputFiles({name:'older.json',mimeType:'application/json',buffer:Buffer.from(raw)});
      await page.waitForTimeout(150);
      const after=await page.evaluate(()=>({notes:m('character').default.getState().lore.notes,health:m('character').default.getState().health.current,draft:JSON.parse(m('outcome').exportCharacterDraft('c-a')),ui:document.querySelector('.character-save-status').textContent,alerts:[...document.querySelectorAll('[role=alert]')].map(e=>e.textContent)}));
      assert.equal(before.notes,'newer work to preserve');
      assert.equal(after.notes,'older exported draft');assert.equal(after.alerts.length,0);
      return {expected:'preserve newer work or refuse/offer explicit reconciliation',before,after,reproduced:true};
    });
    await scenario('mounted-import-character-payload-mismatch',async page=>{
      const raw=await page.evaluate(()=>{
        m('character').default.getState().updateLore('notes','foreign payload edit');
        const doc=JSON.parse(m('outcome').exportCharacterDraft('c-a'));doc.canonical.id='c-b';return JSON.stringify(doc);
      });
      await page.getByLabel('Import selected draft').setInputFiles({name:'mismatch.json',mimeType:'application/json',buffer:Buffer.from(raw)});
      await page.waitForTimeout(150);
      const after=await page.evaluate(()=>({id:m('character').default.getState().currentCharacterId,roster:m('character').default.getState().characters.map(c=>({id:c.id,notes:c.lore.notes})),candidate:m('outcome').getCharacterCandidate('c-a','canonical')?.payload,alerts:[...document.querySelectorAll('[role=alert]')].map(e=>e.textContent)}));
      assert(after.roster.some(c=>c.id==='c-b'));assert.equal(after.alerts.length,0);
      return {expected:'reject embedded character identity mismatch before mutation',after,reproduced:true};
    });
    await scenario('runtime-import-mounted-fidelity',async page=>{
      await page.evaluate(()=>{m('character').default.getState().updateResource('health',21);});
      const raw=await page.evaluate(()=>{
        const doc=JSON.parse(m('outcome').exportCharacterDraft('c-a'));doc.canonical=null;
        doc.runtime.health.current=5;doc.runtime.inventory.items=[{id:'imported-blade',name:'Imported blade',position:{row:0,col:0},quality:'common',type:'weapon',width:1,height:1,quantity:1,rotation:0,shape:{type:'rectangular',width:1,height:1,cells:[[true]]}}];
        return JSON.stringify(doc);
      });
      await page.getByLabel('Import selected draft').setInputFiles({name:'runtime.json',mimeType:'application/json',buffer:Buffer.from(raw)});
      await page.waitForTimeout(150);
      const evidence=await page.evaluate(()=>({expectedHealth:5,actualHealth:m('character').default.getState().health.current,inventory:m('inventory').default.getState().items,draft:m('outcome').getCharacterCandidate('c-a','runtime').payload,alerts:[...document.querySelectorAll('[role=alert]')].map(e=>e.textContent)}));
      assert.equal(evidence.actualHealth,21);assert.equal(evidence.draft.health.current,21);assert.deepEqual(evidence.draft.inventory.items,[]);assert.equal(evidence.alerts.length,0);
      return {...evidence,reproduced:true};
    });
    await scenario('runtime-serialized-overlapping-writes-and-later-edit',async page=>{
      await page.evaluate(()=>{window.__holdPath='users/u-a/characterStates/c-a';m('character').default.getState().updateResource('health',18);});
      await page.getByRole('button',{name:'Retry runtime save'}).click();await page.waitForFunction(()=>!!window.__release);
      await page.evaluate(()=>{m('character').default.getState().updateResource('health',11);});
      await page.getByRole('button',{name:'Retry runtime save'}).click();
      await page.waitForTimeout(100);
      const held=await page.evaluate(()=>__writes.filter(w=>w.path==='users/u-a/characterStates/c-a'));
      assert.equal(held.length,1);assert.equal(held[0].value.health.current,18);
      await page.evaluate(()=>{window.__holdPath=null;__release.resolve();});
      await page.waitForFunction(()=>__docs.get('users/u-a/characterStates/c-a')?.health.current===11);
      await page.waitForFunction(()=>document.querySelector('.character-save-status').textContent.includes('Personal runtime: Cloud saved'));
      const confirmed=await page.evaluate(()=>({writes:__writes.filter(w=>w.path==='users/u-a/characterStates/c-a'),persisted:__docs.get('users/u-a/characterStates/c-a'),draft:m('outcome').getCharacterCandidate('c-a','runtime').payload}));
      await page.evaluate(()=>{
        m('character').default.getState().updateResource('health',6);
        const old=__docs.get('users/u-a/characterStates/c-a');__listeners.filter(l=>l.path==='users/u-a/characterStates/c-a').at(-1).callback({exists:()=>true,data:()=>old});
      });
      const later=await page.evaluate(()=>({health:m('character').default.getState().health.current,draft:m('outcome').getCharacterCandidate('c-a','runtime').payload,ui:document.querySelector('.character-save-status').textContent}));
      assert.equal(later.health,6);assert.equal(later.draft.health.current,6);assert(later.ui.includes('Personal runtime: Cloud save pending'));
      return {held,confirmed,later,result:'PASS'};
    });
    await scenario('canonical-serialized-overlapping-writes',async page=>{
      await page.evaluate(()=>{window.__writeStart=__writes.length;window.__holdPath='characters/c-a';m('character').default.getState().updateLore('notes','old canonical');window.__oldSave=m('character').default.getState().saveCurrentCharacter();});
      await page.waitForFunction(()=>!!window.__release);
      await page.evaluate(()=>{m('character').default.getState().updateLore('notes','new canonical');window.__newSave=m('character').default.getState().saveCurrentCharacter();});
      await page.waitForTimeout(100);
      const held=await page.evaluate(()=>__writes.slice(__writeStart).filter(w=>w.path==='characters/c-a'));
      assert.equal(held.length,1);assert.equal(held[0].value.lore.notes,'old canonical');assert.equal(held[0].uid,'u-a');
      await page.evaluate(async()=>{window.__holdPath=null;__release.resolve();await Promise.all([__oldSave,__newSave]);});
      const after=await page.evaluate(()=>({writes:__writes.slice(__writeStart).filter(w=>w.path==='characters/c-a'),persisted:__docs.get('characters/c-a').lore.notes,status:m('outcome').getCharacterCandidate('c-a','canonical').status,draft:m('outcome').getCharacterCandidate('c-a','canonical').payload.lore.notes}));
      assert.equal(after.persisted,'new canonical');assert.equal(after.status,'saved');assert.equal(after.draft,'new canonical');assert.deepEqual(after.writes.map(w=>w.value.lore.notes),['old canonical','new canonical']);
      return {held,after,result:'PASS'};
    });
    await scenario('mounted-cyclic-export-refusal',async page=>{
      await page.evaluate(()=>{const payload={note:'cyclic exact',big:1n};payload.self=payload;window.__cyclic=m('outcome').stageCharacterDraft('c-a','runtime',payload);});
      await page.getByRole('button',{name:'Download selected draft'}).click();
      await page.getByRole('alert').waitFor();
      const evidence=await page.evaluate(()=>({alert:document.querySelector('[role=alert]').textContent,ui:document.querySelector('.character-save-status').textContent,exact:__cyclic.payload.self===__cyclic.payload&&__cyclic.payload.big===1n,retention:__cyclic.retention}));
      assert(evidence.alert.includes('Download failed'));assert(evidence.ui.includes('Memory only'));assert.equal(evidence.exact,true);assert.equal(evidence.retention,'memory');
      return {...evidence,result:'PASS'};
    });
    await scenario('ordinary-production-inventory-add-and-save',async page=>{
      const evidence=await page.evaluate(async()=>{
        const s=m('character').default, inventory=m('inventory').default;
        const accepted=inventory.getState().addItem({id:'ordinary-blade',name:'Ordinary blade',type:'weapon',quality:'common',width:1,height:1});
        s.getState().updateLore('notes','ordinary inventory authored'); await s.getState().saveCurrentCharacter();
        const runtime=m('outcome').getCharacterCandidate('c-a','runtime');
        const saved=await m('outcome').saveCharacterDraft(runtime,(data,latest)=>m('runtime').default.saveCharacterState('u-a','c-a',data,{isCurrent:latest}));
        return {accepted,items:inventory.getState().items,canonical:m('outcome').getCharacterCandidate('c-a','canonical'),runtimeResult:saved,ui:document.querySelector('.character-save-status').textContent,writes:__writes.filter(w=>w.path==='characters/c-a'||w.path.includes('/characterStates/'))};
      });
      assert.equal(evidence.accepted.success,true);assert.deepEqual(evidence.items[0].shape.cells,[[true]]);
      assert.equal(evidence.canonical.status,'error');assert.equal(evidence.runtimeResult.success,false);
      assert(evidence.canonical.message.includes('would change preserved data'));
      assert(!evidence.writes.some(w=>JSON.stringify(w.value).includes('ordinary-blade')));
      return {...evidence,reproduced:true};
    });
    await scenario('reachable-sync-reconciliation-outcome',async page=>{
      return await page.evaluate(async()=>{
        m('character').default.getState().updateLore('notes','newer canonical retained');
        const sync=m('sync').default; sync.isOnline=false;sync.queueChange('c-a','resource_change',{type:'health',value:{current:4,max:50}});
        sync.isOnline=true;const result=await sync.syncOfflineChanges();
        return {result,queue:sync.loadOfflineChanges(),summary:sync.getSyncSummary(),ui:document.querySelector('.character-save-status').textContent,draft:m('outcome').getCharacterCandidate('c-a','canonical').payload,writes:__writes};
      });
    });
    await scenario('session-linked-delayed-failure-owner-switch',async page=>{
      await page.evaluate(async()=>{
        const session=m('session').default;await m('character').default.getState().startCharacterSession('c-a');
        const id=session.activeSessions.get('c-a').id;window.__holdPath='characterSessions/'+id;
        window.__recordPromise=m('character').default.getState().recordCharacterChange('c-a','stat_change',{stat:'privateMemo',value:'A PRIVATE DELAYED CHANGE'});
      });
      await page.waitForFunction(()=>!!window.__release);
      await page.evaluate(async()=>{
        window.__liveUser={uid:'u-b',getIdToken:async()=> 'b'};m('auth').default.getState().setUser(__liveUser);await m('coordinator').whenHandoffIdle();
        window.__holdPath=null;__release.reject(Error('old session network failure'));await __recordPromise;
      });
      await page.waitForTimeout(150);
      const after=await page.evaluate(()=>({owner:m('auth').default.getState().user.uid,queue:m('sync').default.loadOfflineChanges(),keys:Object.keys(localStorage),raw:localStorage.getItem('mythrill:p5:user:u-b:character.offlineChanges'),writes:__writes}));
      assert.equal(after.owner,'u-b');assert(after.raw.includes('A PRIVATE DELAYED CHANGE'));
      return {expected:'delayed A recordChange failure stays in A scope or is refused without putting A data into B',after,reproduced:true};
    });
    await scenario('sync-delayed-read-foreign-metadata-write',async page=>{
      await page.evaluate(async()=>{await m('character').default.getState().saveCurrentCharacter();});
      await page.evaluate(()=>{
        window.__holdReadPath='characters/c-a';window.__writeStart=__writes.length;
        window.__syncResult=m('sync').default.syncCharacterChanges('c-a',[],m('context').captureConsumerContext().context).catch(e=>({error:e.message}));
      });
      // This scenario needs a confirmed/idle candidate, not a reconciliation refusal.
      await page.waitForFunction(()=>!!window.__releaseRead);
      await page.evaluate(async()=>{
        window.__liveUser={uid:'u-b',getIdToken:async()=> 'b'};m('auth').default.getState().setUser(__liveUser);await m('coordinator').whenHandoffIdle();
        window.__holdReadPath=null;__releaseRead();window.__actualSyncResult=await __syncResult;
      });
      const evidence=await page.evaluate(()=>({result:__actualSyncResult,writes:__writes.slice(__writeStart),owner:m('auth').default.getState().user.uid}));
      assert(evidence.writes.some(w=>w.path==='characters/c-a'&&w.uid==='u-b'&&Object.hasOwn(w.value,'metadata.lastPlayedAt')));
      return {...evidence,expected:'outer owner fence must prevent metadata publication inside the delayed load',reproduced:true};
    });
    fs.writeFileSync(path.join(__dirname,'supplemental-results.json'),JSON.stringify({manifest,result},null,2));
  } finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
}
run().catch(e=>{console.error(e);fs.writeFileSync(path.join(__dirname,'supplemental-partial.json'),JSON.stringify(result,null,2));process.exitCode=1;});
