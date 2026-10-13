/** Replay F1/F2 with real production stores/handoffs and mounted private UI.
 * Run from vtt-react: node verification/p5-01/character-preservation-browser.cjs
 * Historical RED: --source-root <export>/vtt-react/src --expect-block
 * No temp harness dependency. JSON evidence is printed, not overwritten. */
const assert = require('assert/strict');
const path = require('path');
const {start,deps} = require('./character-browser-harness.cjs');
const {chromium} = deps('playwright');

async function witness(page,mode) {
  return page.evaluate(async scenario => {
    const {m,React,ReactDOM} = window;
    const sleep = ms => new Promise(r=>setTimeout(r,ms));
    const idle = async () => {await m('coordinator').whenHandoffIdle();await sleep(150);};
    m('init').initStoreRegistry();
    const auth = m('auth').default, store = m('character').default;
    const signIn = uid => {
      window.__liveUser = uid ? {uid,getIdToken:async()=>`fixture-token-${uid}`} : null;
      auth.getState().setUser(window.__liveUser);
    };
    const gate = () => {const g=m('gate').getBootstrapGateState();return {
      scope:g.scope?.scopeId || null,generation:g.accountGeneration,pending:g.handoffPending,phase:g.phase};};
    const selectors = () => {const s=store.getState();return {
      names:s.characters.map(c=>c.name),pointer:s.currentCharacterId,active:s.getActiveCharacter()?.name || null};};
    const roster = () => JSON.parse(localStorage.getItem('mythrill:p5:user:u-a:character.roster') || 'null');
    const snapshot = () => ({liveUid:auth.getState().user?.uid || null,gate:gate(),selectors:selectors(),roster:roster(),
      candidate:window.__entries.preservation ? m('preservation').getRetainedCharacterHandoffCandidate() : null,
      status:m('coordinator').getHandoffStatus(),
      markers:Object.keys(localStorage).filter(k=>k.includes('character.deferredPublication')),
      writes:window.__writes.slice(writeStart).filter(w=>w.path==='characters/c-a' || w.path.startsWith('character_backups/')),
      privateVisible:!!document.querySelector('[data-p5-private-projection]') &&
        document.querySelector('[data-p5-private-projection]').style.display!=='none'});
    signIn('u-a');await idle();
    window.__docs.set('characters/c-a',{
      metadata:{id:'c-a',userId:'u-a',name:'A HERO',version:1},
      basicInfo:{race:'Human',class:'Martyr',level:3},
      stats:{strength:10,agility:10,constitution:10,intelligence:10,spirit:10,charisma:10},
      resources:{health:{current:40,max:50},mana:{current:40,max:50},actionPoints:{current:2,max:3}},
      lore:{notes:'A BASELINE'}
    });
    await store.getState().loadCharacters();await store.getState().setActiveCharacter('c-a');
    await m('storage').saveRoster(false,store.getState().characters);
    m('storage').saveActivePointer('c-a');
    const root = ReactDOM.createRoot(document.getElementById('app'));
    function Host(){const user=auth(s=>s.user);return React.createElement(m('boundary').default,null,
      React.createElement(m('ui').default,{user}));}
    ReactDOM.flushSync(()=>root.render(React.createElement(Host)));
    await sleep(200);
    const beforeUI = document.body.textContent.includes('A HERO');
    const marker = `A UNSENT CHARACTER ${scenario}`;
    store.getState().updateLore('notes',marker);
    const authored = {notes:store.getState().lore.notes,pending:!!m('helpers').characterAutoSavePending,
      timer:!!m('helpers').characterAutoSaveTimer,baseline:store.getState().characters[0]?.lore?.notes};
    const writeStart=window.__writes.length;
    let release;
    const hold=new Promise(r=>{release=r;});
    m('coordinator').registerHandoffParticipant({id:'frozen-character-witness-hold',stopNewWork:()=>hold});
    const originalSet=Storage.prototype.setItem;
    const refused=[],localAttempts=[];
    Storage.prototype.setItem=function(key,value){
        if(String(value).includes(marker))localAttempts.push(String(key));
        if(scenario==='marker-failure' ? String(key).includes('character.deferredPublication') :
          scenario==='failed-preservation' && String(value).includes(marker)){
          refused.push(String(key));throw new DOMException('frozen preservation refusal','QuotaExceededError');}
        return originalSet.call(this,key,value);};
    signIn('u-b');
    const synchronous=snapshot();
    // Real debounce is allowed to elapse while preservation is held.
    await sleep(m('helpers').CHARACTER_AUTO_SAVE_DELAY+150);
    const held=snapshot();
    release({ok:true});await idle();
    const settled=snapshot();
    Storage.prototype.setItem=originalSet;
    m('coordinator').unregisterHandoffParticipant('frozen-character-witness-hold');
    if(scenario!=='pending-edit'){m('coordinator').retryPendingHandoff();await idle();}
    const afterRetry=snapshot();
    // Return under A, force a deferred network rejection, then heal and reload.
    window.__rejectCloud=true;signIn('u-a');await idle();
    await store.getState().loadActiveCharacter();await sleep(150);
    const failedCloud=snapshot();
    const returnedNotes=store.getState().lore.notes;
    window.__rejectCloud=false;await store.getState().loadCharacters();await sleep(150);
    await store.getState().loadActiveCharacter();await sleep(150);
    const returned=snapshot();
    const finalNotes=store.getState().lore.notes;
    const finalDoc=window.__docs.get('characters/c-a');
    root.unmount();
    return {scenario,marker,beforeUI,authored,synchronous,held,settled,refused,localAttempts,afterRetry,
      failedCloud,returnedNotes,returned,finalNotes,finalDoc};
  },mode);
}

function checks(e) {
  const failures=[];
  function check(name,fn){try{fn();}catch(error){failures.push({name,error:error.message});}}
  const notes=s=>s.roster?.payload?.find(c=>c.id==='c-a')?.lore?.notes;
  const empty=s=>{assert.deepEqual(s.selectors.names,[]);assert.equal(s.selectors.pointer,null);assert.equal(s.selectors.active,null);};
  check('real mounted A UI and pending production debounce',()=>{
    assert.equal(e.beforeUI,true);assert.equal(e.authored.notes,e.marker);
    assert.equal(e.authored.pending,true);assert.equal(e.authored.timer,true);assert.equal(e.authored.baseline,'A BASELINE');});
  check('synchronous privacy with retained owner/generation',()=>{
    assert.equal(e.synchronous.liveUid,'u-b');assert.equal(e.held.liveUid,'u-b');
    assert.equal(e.synchronous.gate.scope,'u-a');assert.equal(e.synchronous.gate.pending,true);
    empty(e.synchronous);assert.equal(e.synchronous.privateVisible,false);
    assert.equal(e.held.gate.generation,e.synchronous.gate.generation);empty(e.held);});
  check('no B attribution and no duplicate handoff save',()=>{
    assert.deepEqual(e.held.writes,[]);
    assert.equal(e.returned.writes.some(w=>JSON.stringify(w.value).includes(e.marker) &&
      ((w.value?.metadata?.userId || w.value?.userId)!=='u-a' || w.liveUid!=='u-a')),false);});
  if(e.scenario==='pending-edit'){
    check('confirmed A recovery before safe B activation',()=>{
      assert.equal(notes(e.held),e.marker);assert.equal(e.held.markers.length,1);
      assert.equal(e.localAttempts.filter(k=>k.endsWith(':character.roster')).length,1);
      assert.equal(e.settled.gate.scope,'u-b');assert.equal(e.settled.gate.pending,false);
      assert.ok(e.settled.gate.generation>e.held.gate.generation);empty(e.settled);});
  }else{
    check('failure is reported and candidate privately held',()=>{
      assert.ok(e.refused.length);assert.equal(e.settled.gate.scope,'u-a');assert.equal(e.settled.gate.pending,true);
      assert.equal(e.settled.status.lastResult.blocked,true);
      assert.ok(e.settled.status.lastResult.failures.some(f=>f.participantId==='scoped-store:characterStore' && f.hook==='stopNewWork'));
      assert.equal(e.settled.candidate?.characters.find(c=>c.id==='c-a')?.lore?.notes,e.marker);
      empty(e.settled);assert.equal(e.settled.privateVisible,false);});
    check('healed retry preserves before B activation',()=>{
      assert.equal(notes(e.afterRetry),e.marker);assert.equal(e.afterRetry.gate.scope,'u-b');
      assert.equal(e.afterRetry.gate.pending,false);empty(e.afterRetry);});
  }
  check('failed cloud retains A recovery and healed reload recovers exact edit',()=>{
    assert.equal(e.returnedNotes,e.marker);assert.equal(notes(e.failedCloud),e.marker);
    assert.equal(e.failedCloud.markers.length,1);assert.equal(e.finalNotes,e.marker);
    assert.equal(e.finalDoc.metadata.userId,'u-a');assert.equal(e.finalDoc.lore.notes,e.marker);});
  return failures;
}

async function main(){
  const index=process.argv.indexOf('--source-root');
  const sourceRoot=index<0?undefined:path.resolve(process.argv[index+1]);
  const expectedBlock=process.argv.includes('--expect-block');
  const {server,port,sourceManifest}=await start(sourceRoot);
  console.log('SOURCE_MANIFEST',JSON.stringify(sourceManifest));
  let browser;
  const results=[];
  try{
    browser=await chromium.launch({channel:process.env.P5_BROWSER_CHANNEL || 'chrome',headless:true});
    for(const mode of ['pending-edit','failed-preservation','marker-failure']){
      const context=await browser.newContext({serviceWorkers:'block'});
      await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
      const page=await context.newPage();
      const errors=[];page.on('pageerror',error=>errors.push(error.message));
      await page.goto(`http://127.0.0.1:${port}/`);
      const evidence=await witness(page,mode);
      const failures=checks(evidence);
      if(errors.length)failures.push({name:'browser runtime',errors});
      const result={mode,status:failures.length?'BLOCK':'PASS',failures,evidence};
      results.push(result);console.log(JSON.stringify(result,null,2));
      console.log('SUMMARY',JSON.stringify({mode,status:result.status,failures:failures.map(f=>f.name),
        actualPending:evidence.authored.pending,synchronous:evidence.synchronous.selectors,
        heldOwner:evidence.held.gate.scope,heldGeneration:evidence.held.gate.generation,
        handoffWrites:evidence.held.writes.map(w=>({op:w.op,uid:w.value.metadata?.userId || w.value.userId,
          liveUid:w.liveUid,notes:w.value.lore?.notes})),
        rosterWrites:evidence.localAttempts.filter(k=>k.endsWith(':character.roster')).length,
        settledOwner:evidence.settled.gate.scope,blocked:evidence.settled.status.lastResult?.blocked,
        retainedCandidate:!!evidence.settled.candidate,returnedNotes:evidence.finalNotes}));
      await context.close();
    }
    if(expectedBlock)assert.ok(results.slice(0,2).every(r=>r.status==='BLOCK'),'Both original defects must reproduce on baseline');
    else assert.ok(results.every(r=>r.status==='PASS'),'Frozen character contract failed');
    console.log(`P5_CHARACTER_BROWSER ${expectedBlock?'EXPECTED_RED':'GREEN'} ${results.map(r=>`${r.mode}:${r.status}`).join(' ')}`);
  }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
