/** Reload-durable B7 witness. Existing P6 auth/Firestore fixtures; production
 * provider, hook, projection, scoped storage, draft export/import run intact. */
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert/strict');
const deps = require('module').createRequire(path.resolve(__dirname, '../../package.json'));
const red = process.argv.includes('--red');
const output = process.env.P7_RECOVERY_OUTPUT;
if (!output) throw Error('Set P7_RECOVERY_OUTPUT to a fresh external JSON output path');
let builder = fs.readFileSync(path.resolve(__dirname, '../p6/character-save-browser.cjs'), 'utf8').split('async function main()')[0];
builder = builder.replace("canonical: 'services/firebase/characterPersistenceService.js'", "canonical: 'services/firebase/characterPersistenceService.js', actors:'services/actorConsequenceService.js', game:'store/gameStore.js', condition:'store/conditionStore.js', hook:'hooks/useCharacterPersistence.js', gate:'persistence/bootstrapPrivacyGate.js'");
builder += '\nmodule.exports=start;';
const sandbox = { require, __dirname: path.resolve(__dirname, '../p6'), module: { exports: {} }, console, Buffer, process };
vm.runInNewContext(builder, sandbox, { filename: 'p7-condition-recovery-builder.cjs' });
async function main() {
  const { server, manifest } = sandbox.module.exports();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await deps('playwright').chromium.launch({ channel: 'chrome', headless: true });
  const evidence = { mode: red ? 'RED defective observation' : 'GREEN implementation checks; not acceptance', manifest,
    simulations: ['P6 Firebase auth/config/Firestore documents and transport', 'Unmatched room flag; no room lifecycle/server fixture'], observations: {} };
  const errors = [];
  try {
    const context = await browser.newContext({ acceptDownloads: true });
    await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message));
    const setup = async (uid = 'u-a', id = 'c-other') => {
      await page.evaluate(async ({ uid, id }) => {
        m('init').initStoreRegistry(); window.__liveUser = { uid, getIdToken: async () => 'fixture' };
        m('auth').default.getState().setUser(__liveUser); await m('coordinator').whenHandoffIdle();
        const seed = { id, name: 'Recovery owner', race: 'Human', class: 'Martyr', level: 3,
          stats: { strength:10,agility:10,constitution:10,intelligence:10,spirit:10,charisma:10 },
          resources: { health:{current:42,max:50},mana:{current:20,max:50},actionPoints:{current:2,max:3} },
          lore:{notes:'owner draft'}, inventory:{items:[],currency:{gold:0},containers:[]} };
        __docs.set('characters/'+id, m('canonical').transformForStorage(seed, uid));
        m('character').default.setState({characters:[seed],currentCharacterId:id,...seed,...seed.resources});
        m('game').default.setState({isInMultiplayer:true,multiplayerRoom:{id:'unmatched-room'}});
        __mount();
      }, { uid, id });
      await page.getByRole('region', { name: 'Selected character save status' }).waitFor();
    };
    await page.goto(`http://127.0.0.1:${server.address().port}`); await setup();
    const raw = { id:'ambiguous-manual',name:'Unbound legacy',targetId:'unknown-token',targetType:'character',
      privateUnknown:{keep:'exact recovery bytes',unicode:'\u2603\u0000',nested:[0,false,null,{'original key':' unchanged '}]},remainingRounds:0,endTime:1234567 };
    await page.evaluate(raw => {
      window.__rejectRuntime = true;
      m('condition').default.setState({activeBuffs:[],activeDebuffs:[
        {id:'selected-local',name:'Personal local',type:'debuff',targetId:'c-other',targetType:'character',durationType:'rounds',durationValue:2,remainingRounds:2},
        {id:'foreign',name:'Foreign',target:{roomId:'unmatched-room',kind:'character',ownerUid:'u-b',characterId:'c-b'}},raw]});
    }, raw);
    await page.getByRole('button', { name: 'Retry runtime save' }).click();
    await page.waitForFunction(() => m('outcome').getCharacterCandidate('c-other','runtime')?.status === 'error');
    const inspect = () => page.evaluate(() => ({
      exported:JSON.parse(m('outcome').exportCharacterDraft('c-other')),
      candidate:m('outcome').getCharacterCandidate('c-other','runtime').payload,
      volatile:m('game').default.getState().personalConditionRecoveryCandidates || null,
      stored:[localStorage,sessionStorage].map(storage => Object.keys(storage).some(key => storage.getItem(key)?.includes('exact recovery bytes'))),
      conditions:m('condition').default.getState().activeDebuffs
    }));
    const before = await inspect(); evidence.observations.beforeReload = before;
    assert.deepEqual(before.candidate.debuffs.map(r=>r.id), ['selected-local']);
    if (red) assert.deepEqual(before.volatile.find(c=>c.observedCharacterId==='c-other').records, [raw]);
    else assert.deepEqual(before.exported.conditionRecovery, [{observedOwnerUid:'u-a',observedCharacterId:'c-other',records:[raw]}]);
    assert.equal(JSON.stringify(before.exported).includes('exact recovery bytes'), !red);
    assert.equal(before.stored[0], !red);
    await page.reload(); await setup();
    const after = await inspect(); evidence.observations.afterReload = after;
    assert.equal(JSON.stringify(after.exported).includes('exact recovery bytes'), !red);
    assert(!after.conditions.some(r=>['foreign','ambiguous-manual'].includes(r.id)));
    assert.equal(after.conditions.find(r=>r.id==='selected-local')?.remainingRounds,2);
    if (!red) {
      assert.deepEqual(after.exported.conditionRecovery, [{observedOwnerUid:'u-a',observedCharacterId:'c-other',records:[raw]}]);
      // Supported UI download after a new document/module graph.
      const downloading = page.waitForEvent('download');
      await page.getByRole('button', { name:'Download selected draft' }).click();
      const downloaded = JSON.parse(fs.readFileSync(await (await downloading).path(), 'utf8'));
      assert.deepEqual(downloaded.conditionRecovery, after.exported.conditionRecovery);
      evidence.observations.download = downloaded;
      await page.getByRole('button', { name:'Retry runtime save' }).click();
      await page.waitForFunction(()=>__docs.get('users/u-a/characterStates/c-other')?.debuffs.some(r=>r.id==='selected-local'));
      assert.equal(await page.evaluate(()=>JSON.stringify(__docs.get('users/u-a/characterStates/c-other')).includes('privateUnknown')),false);
      await page.reload(); await setup('u-a','c-other-2');
      const differentCharacter = await page.evaluate(()=>JSON.parse(m('outcome').exportCharacterDraft('c-other-2')));
      assert(!JSON.stringify(differentCharacter).includes('exact recovery bytes'));
      const wrongCharacter = await page.evaluate(raw=>{try{m('outcome').importCharacterDraft(raw,'c-other-2');return false;}catch(_e){return true;}},JSON.stringify(downloaded));
      assert(wrongCharacter); evidence.observations.otherCharacter = {differentCharacter,importRefused:wrongCharacter};
      await page.reload(); await setup('u-b');
      const differentOwner = await page.evaluate(()=>JSON.parse(m('outcome').exportCharacterDraft('c-other')));
      assert(!JSON.stringify(differentOwner).includes('exact recovery bytes'));
      const wrongOwner = await page.evaluate(raw=>{try{m('outcome').importCharacterDraft(raw,'c-other');return false;}catch(_e){return true;}},JSON.stringify(downloaded));
      assert(wrongOwner); evidence.observations.otherOwner={differentOwner,importRefused:wrongOwner};
      await page.reload(); await setup();
      const returned=await inspect(); assert.deepEqual(returned.exported.conditionRecovery,downloaded.conditionRecovery);
      evidence.observations.returnedOwner=returned;
      // Actual browser storage refusal, distinct from the Firestore fixture.
      const writesBefore=await page.evaluate(()=>__writes.filter(w=>w.path.includes('/characterStates/')).length);
      await page.evaluate(()=>{
        window.__realRecoverySetItem=Storage.prototype.setItem;
        Storage.prototype.setItem=function(key,value){if(String(key).includes('conditionRecovery')&&String(value).includes('refused exact recovery bytes'))throw new DOMException('quota','QuotaExceededError');return __realRecoverySetItem.call(this,key,value);};
        m('condition').default.setState(current=>({activeDebuffs:[...current.activeDebuffs,{id:'refused-raw',targetId:'unknown-refused',targetType:'character',privateUnknown:{keep:'refused exact recovery bytes'}}]}));
      });
      await page.getByRole('button',{name:'Retry runtime save'}).click();
      await page.waitForFunction(()=>document.querySelector('.character-save-status').textContent.includes('Private condition recovery is memory only'));
      const refusal=await page.evaluate(()=>({exported:JSON.parse(m('outcome').exportCharacterDraft('c-other')),entry:m('outcome').getCharacterCandidate('c-other','conditionRecovery'),writes:__writes.filter(w=>w.path.includes('/characterStates/')).length,ui:document.querySelector('.character-save-status').textContent}));
      assert.equal(refusal.entry.retention,'memory');assert.equal(refusal.writes,writesBefore);
      assert(JSON.stringify(refusal.exported.conditionRecovery).includes('refused exact recovery bytes'));
      evidence.observations.storageRefusal=refusal;
      await page.evaluate(()=>{Storage.prototype.setItem=__realRecoverySetItem;});
      await page.getByRole('button',{name:'Retry runtime save'}).click();
      await page.waitForFunction(()=>m('outcome').getCharacterCandidate('c-other','runtime')?.status==='saved');
      assert.equal(await page.evaluate(()=>m('outcome').getCharacterCandidate('c-other','conditionRecovery').retention),'device');
      await page.reload();await setup();
      const healed=await inspect();assert.deepEqual(healed.exported.conditionRecovery,refusal.exported.conditionRecovery);
      assert(!JSON.stringify(healed.conditions).includes('privateUnknown'));evidence.observations.healedReload=healed;
      const local=await page.evaluate(()=>{m('game').default.setState({isInMultiplayer:false});const store=m('condition').default;const before=store.getState().activeDebuffs.find(r=>r.id==='selected-local').remainingRounds;store.getState().decrementRoundBasedConditions('debuff','c-other');return {before,after:store.getState().activeDebuffs.find(r=>r.id==='selected-local').remainingRounds};});
      assert.deepEqual(local,{before:2,after:1});evidence.observations.localSandbox=local;
      if(process.argv.includes('--require-collection')) {
        // Coordinator-owned collection hunk must also work without a mounted
        // persistence hook and must not leave a cross-account raw game cache.
        const direct=await page.evaluate(()=>{
          ReactDOM.flushSync(()=>__root.unmount());
          const record={id:'direct-raw',targetId:'unknown-direct',privateUnknown:{keep:'direct-origin-bytes'}};
          const projected=m('actors').projectPersonalRuntime({buffs:[],debuffs:[record]},false);
          return {projected,recovery:m('outcome').getPersonalConditionRecovery('c-other'),volatile:m('game').default.getState().personalConditionRecoveryCandidates||null};
        });
        assert.deepEqual(direct.projected.debuffs,[]);
        assert(JSON.stringify(direct.recovery).includes('direct-origin-bytes'));
        assert(!JSON.stringify(direct.volatile).includes('recovery bytes'));
        evidence.observations.directCollection=direct;
      }
    }
    assert.deepEqual(errors, []); evidence.pageErrors=errors; evidence.completed=true;
    await context.close();
  } finally {
    fs.writeFileSync(output, JSON.stringify(evidence, null, 2));
    await browser.close(); await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
