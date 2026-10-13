/** P7 mounted witness: real registered server/lease/writer/actor logic and real
 * browser production stores/provider/HUD control. Firebase auth/SDK/lease
 * backend/storage transport are external fixtures. No actor logic is mocked. */
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert/strict'), crypto = require('crypto');
const root = path.resolve(__dirname, '../../..');
const deps = require('module').createRequire(path.join(root, 'vtt-react/package.json'));
const { createProductionStackServer } = require(path.join(root, 'server/tests/helpers/productionStackServer'));
const { FirebaseBatchWriter } = require(path.join(root, 'server/services/syncService'));
const actors = require(path.join(root, 'server/services/actorConsequences'));
const ack = (client, event, payload) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(Error('ack timeout ' + event)), 5000);
  client.emit(event, payload, result => {clearTimeout(timer); resolve(result);});
});
async function main() {
  let durableState = null, durableRevision = 0;
  const writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async(_id, snapshot, context) => {
    durableState = JSON.parse(JSON.stringify(snapshot)); durableRevision = context.revision; return { outcome: 'confirmed' };
  } });
  const backend = createProductionStackServer({ firebaseBatchWriter: writer }); await backend.start();
  backend.registerAuthToken('p7-browser', 'u-a');
  const client = backend.connect({ token: 'p7-browser' }); await new Promise(resolve => client.once('connect', resolve));
  const room = await backend.seedRoom(client.id, { gmUserId: 'u-a' });
  const character = { id: 'c-a', name: 'P7 HERO', class: 'Martyr', race: 'Human', level: 3,
    health: { current: 30, max: 50 }, mana: { current: 20, max: 50 }, actionPoints: { current: 2, max: 3 }, tempHealth: 0, tempMana: 0, tempActionPoints: 0 };
  for (const [id, owner, characterId] of [['pc-a', 'u-a', 'c-a'], ['pc-b', 'u-b', 'c-b']]) {
    backend.setCharacterOwner(characterId, owner);
    room.gameState.maps.default.characterTokens[id] = { id, name: 'Same display name', ownerUserId: owner, playerId: owner, character: { ...character, id: characterId }, state: { conditions: [] } };
  }
  const bridge = (req, res) => {
    if (req.url !== '/p7-event' || req.method !== 'POST') return false;
    let raw = ''; req.on('data', bytes => {raw += bytes;}); req.on('end', async() => {
      try {const { event, payload } = JSON.parse(raw); res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(await ack(client, event, payload)));}
      catch(error) {res.statusCode = 500; res.end(JSON.stringify({ success: false, error: error.message }));}
    }); return true;
  };
  // Reuse the unchanged P6 external SDK fixture/module builder. Add only entry
  // points and an HTTP transport bridge; production bodies are compiled intact.
  let builder = fs.readFileSync(path.join(root, 'vtt-react/verification/p6/character-save-browser.cjs'), 'utf8').split('async function main()')[0];
  builder = builder.replace("canonical: 'services/firebase/characterPersistenceService.js'", "canonical: 'services/firebase/characterPersistenceService.js', actors:'services/actorConsequenceService.js', game:'store/gameStore.js', condition:'store/conditionStore.js', tokens:'store/characterTokenStore.js', combat:'store/combatStore.js', controls:'components/hud/ActorConsequenceControls.jsx', hydration:'services/silentRoomHydration.js', effects:'services/effectProcessingService.js', gate:'persistence/bootstrapPrivacyGate.js'");
  builder = builder.replace('if (assets[req.url])', 'if (handleBridge(req,res)) return; if (assets[req.url])');
  builder = builder.replace("if (file.endsWith('.json'))", "if (/\\.(png|jpg|jpeg|webp|svg)$/.test(file)) { const mime=file.endsWith('.svg')?'image/svg+xml':'image/png'; modules[file].code='module.exports='+JSON.stringify('data:'+mime+';base64,'+fs.readFileSync(file).toString('base64'))+';'; return file; } if (file.endsWith('.json'))");
  builder = builder.replace("gate:'persistence/bootstrapPrivacyGate.js'", "gate:'persistence/bootstrapPrivacyGate.js', targetHud:'components/hud/TargetHUD.jsx', targeting:'store/targetingStore.js', party:'store/partyStore.js'");
  builder += '\nmodule.exports=start;';
  const sandbox = { require, __dirname: path.join(root, 'vtt-react/verification/p6'), module: { exports: {} }, console, Buffer, process, handleBridge: bridge };
  vm.runInNewContext(builder, sandbox, { filename: 'p7-browser-builder.cjs' });
  const { server, manifest } = sandbox.module.exports(); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  if (process.argv.includes('--serve')) {console.log(url); return;}
  const browser = await deps('playwright').chromium.launch({ channel: 'chrome', headless: true });
  const observations = { manifest, url, simulations: ['Firebase auth/config/browser SDK', 'Firestore cloud documents/admission', 'lease backend', 'HTTP bridge to real registered Socket.IO client'] };
  try {
    const page = await browser.newPage(); const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(url);
    await page.evaluate(async({ roomId, socketId, character }) => {
      m('init').initStoreRegistry(); window.__liveUser = { uid: 'u-a', getIdToken: async() => 'fixture' };
      m('auth').default.getState().setUser(__liveUser); await m('coordinator').whenHandoffIdle();
      const seed = { ...character, stats: { strength:10,agility:10,constitution:10,intelligence:10,spirit:10,charisma:10 },
        resources: { health:character.health,mana:character.mana,actionPoints:character.actionPoints }, lore:{notes:'P7 private draft'}, classResource:{type:'devotionGauge',current:0,max:6,damage:0,earnedLevels:0,spentLevels:0,bonusLevels:0}, inventory:{items:[],currency:{},containers:[]} };
      __docs.set('characters/c-a', m('canonical').transformForStorage(seed,'u-a'));
      m('character').default.setState({characters:[seed],currentCharacterId:'c-a',...seed});
      window.__socket = { id:socketId, connected:true, emit:(event,payload,callback)=>fetch('/p7-event',{method:'POST',body:JSON.stringify({event,payload})}).then(res=>res.json()).then(value=>callback?.(value)), on:()=>{},off:()=>{} };
      m('game').default.setState({isInMultiplayer:true,isGMMode:true,multiplayerRoom:{id:roomId},multiplayerSocket:__socket});
      await m('actors').refreshActorSnapshot();
      __root=ReactDOM.createRoot(document.getElementById('app'));
      ReactDOM.flushSync(()=>__root.render(React.createElement(m('provider').default,null,React.createElement(React.Fragment,null,React.createElement(m('controls').default),React.createElement(m('targetHud').default)))));
    }, { roomId: room.id, socketId: client.id, character });
    await page.getByRole('combobox', { name: 'Exact room attachment' }).selectOption('character:pc-a');
    await page.getByRole('button', { name: 'Bind primary attachment' }).click();
    await page.getByRole('button', { name: 'Use this owner attachment' }).click();
    const ref = actors.refFor(room.gameState.maps.default.characterTokens['pc-a'].state.actorContract);
    const remoteRaw = room.gameState.maps.default.characterTokens['pc-b'];
    const remote = await ack(client, 'actor_bind', { roomId:room.id, ref:{kind:'character',roomId:room.id,mapId:'default',tokenId:'pc-b',ownerUid:'u-b',characterId:'c-b'}, snapshotHash:actors.hash(remoteRaw) });
    assert.equal(remote.success,true,JSON.stringify(remote));
    await page.evaluate(()=>m('actors').refreshActorSnapshot());
    await page.evaluate(()=>{
      const token=m('tokens').default.getState().characterTokens.find(value=>value.id==='pc-b');
      m('party').default.setState({partyMembers:[{id:'pc-b',userId:'u-b',name:'Remote PC',character:token.character}]});
      m('targeting').default.getState().setTarget({id:'pc-b',userId:'u-b',character:token.character,name:'Remote PC'},'party_member');
    });
    await page.locator('.modular-health-bar-container').click({button:'right'});
    await page.getByRole('button',{name:'Health',exact:true}).hover();
    await page.getByText('Damage (5)',{exact:true}).click();
    await page.waitForFunction(()=>m('tokens').default.getState().characterTokens.find(value=>value.id==='pc-b').character.health.current===25);
    assert.equal(room.gameState.maps.default.characterTokens['pc-b'].character.health.current,25);
    assert.equal(await page.evaluate(()=>m('character').default.getState().health.current),30);
    observations.A1MountedHud={realTargetHUDDamageControl:true,remoteHp:25,localHpUnchanged:true};
    await page.evaluate(()=>m('targeting').default.getState().clearTarget());
    const snapshot = await ack(client,'actor_snapshot',{roomId:room.id});
    const cmd = {version:1,roomId:room.id,commandId:crypto.randomUUID(),actionEpoch:snapshot.actionEpoch,baseCommitSequence:snapshot.commitSequence,
      actors:[{ref,expectedRevision:0,finalResources:{hp:{current:17,temp:2}},conditions:[{op:'add',recordId:'round-zero',record:{version:1,id:'round-zero',recordId:'round-zero',name:'Slowed',originalName:'slow',type:'debuff',kind:'effect',target:ref,targetId:'pc-a',targetType:'character',source:'arc_frost_touch',durationType:'rounds',durationValue:3,remainingRounds:0,effects:{movementSpeed:-10},sharedTiming:'manual'}}]}]};
    const accepted=await ack(client,'actor_consequence',cmd);assert.equal(accepted.success,true,JSON.stringify(accepted));
    await page.evaluate(result=>m('actors').applyAcceptedConsequence(result),accepted);
    await page.waitForFunction(()=>m('character').default.getState().health.current===17);
    // Real personal runtime save failure stays distinct from accepted room.
    await page.evaluate(()=>{window.__rejectRuntime=true;m('character').default.getState().updateLore('notes','P7 retained edit');});
    await page.getByRole('button',{name:'Retry runtime save'}).click();
    await page.waitForFunction(()=>document.querySelector('.character-save-status').textContent.includes('runtime network refusal'));
    observations.A9={roomHp:room.gameState.maps.default.characterTokens['pc-a'].character.health.current,personalFailure:await page.locator('.character-save-status').innerText()};
    // A newer room receipt while an older personal write is held cannot roll back.
    await page.evaluate(()=>{window.__rejectRuntime=false;window.__holdPath='users/u-a/characterStates/c-a';});
    await page.getByRole('button',{name:'Retry runtime save'}).click();await page.waitForFunction(()=>!!window.__release);
    const newer={...cmd,commandId:crypto.randomUUID(),actors:[{ref,expectedRevision:1,finalResources:{hp:{current:11,temp:0}}}]};
    const next=await ack(client,'actor_consequence',newer);assert.equal(next.success,true);
    await page.evaluate(result=>{m('actors').applyAcceptedConsequence(result);window.__holdPath=null;__release.resolve();},next);
    await page.waitForFunction(()=>m('outcome').getCharacterCandidate('c-a','runtime')?.payload.health.current===11);
    await page.evaluate(()=>{m('character').default.setState({health:{current:49,max:50}});m('actors').reconcileOwner();});
    assert.equal(await page.evaluate(()=>m('character').default.getState().health.current),11);
    observations.A9.delayedPersonalSavePreservesLatest=true;
    // Remote turn recipient while the matching local sheet is open.
    await page.evaluate(ref=>{m('combat').default.setState({isInCombat:true,currentTurnIndex:0,round:1,turnOrder:[{tokenId:'pc-a',actorRef:m('actors').refOf(m('tokens').default.getState().characterTokens.find(t=>t.id==='pc-a')),isCharacterToken:true,currentActionPoints:2,maxActionPoints:3},{tokenId:'pc-b',actorRef:ref,isCharacterToken:true,currentActionPoints:2,maxActionPoints:3}],combatConfig:{apRestorationMode:'set',apRestorationAmount:1,healthRegenEnabled:false,manaRegenEnabled:false}});m('combat').default.getState().nextTurn();},remote.ref);
    await page.waitForFunction(()=>m('tokens').default.getState().characterTokens.find(t=>t.id==='pc-b')?.character.actionPoints.current===1);
    assert.equal(await page.evaluate(()=>m('character').default.getState().actionPoints.current),2);
    observations.A8={remoteAp:room.gameState.maps.default.characterTokens['pc-b'].character.actionPoints.current,localAp:await page.evaluate(()=>m('character').default.getState().actionPoints.current)};
    // Round zero survives scoped partialization and peer polling never ticks it.
    observations.A7A10=await page.evaluate(()=>{
      const store=m('condition').default, before=JSON.stringify(store.getState().activeDebuffs);
      const partial=store.persist.getOptions().partialize(store.getState());
      store.getState().updateConditionTimers('debuff');store.getState().decrementRoundBasedConditions('debuff','pc-a');
      m('effects').processOverTimeEffectsForTarget('pc-a','turn');
      return {same:before===JSON.stringify(store.getState().activeDebuffs),partial,health:m('character').default.getState().health.current};
    });assert.equal(observations.A7A10.same,true);assert.equal(observations.A7A10.partial.activeDebuffs[0].remainingRounds,0);
    // Older receipt is display-only after newer state.
    await page.evaluate(result=>m('actors').applyAcceptedConsequence(result),accepted);
    assert.equal(await page.evaluate(()=>m('character').default.getState().health.current),11);
    await page.getByRole('button',{name:'Retry runtime save'}).click();
    await page.waitForFunction(()=>__docs.get('users/u-a/characterStates/c-a')?.health.current===11);
    const full=await ack(client,'actor_snapshot',{roomId:room.id});
    observations.A10Silent=await page.evaluate(maps=>{
      let rng=0,emits=0;const random=Math.random,emit=__socket.emit;
      Math.random=()=>{rng++;return random();};__socket.emit=(...args)=>{emits++;return emit(...args);};
      try {m('hydration').applyRoomSnapshot({scope:'room',roomId:m('game').default.getState().multiplayerRoom.id,gameState:{maps,defaultMapId:'default',combat:{isActive:false,turnOrder:[],currentTurnIndex:0,round:1}}});
        m('hydration').applyRoomSnapshot({scope:'room',roomId:m('game').default.getState().multiplayerRoom.id,gameState:{maps,defaultMapId:'default',combat:{isActive:false,turnOrder:[],currentTurnIndex:0,round:1}}});
      } finally {Math.random=random;__socket.emit=emit;}
      return {rng,emits,health:m('character').default.getState().health.current,roundZero:m('condition').default.getState().activeDebuffs[0]?.remainingRounds};
    },full.maps);assert.equal(observations.A10Silent.rng,0);assert.equal(observations.A10Silent.emits,0);assert.equal(observations.A10Silent.roundZero,0);
    // Actual mounted import preserves incoming old resource candidates without
    // allowing them to replace the selected room projection.
    const raw=await page.evaluate(()=>JSON.parse(m('outcome').exportCharacterDraft('c-a')));
    raw.runtime.health.current=49;
    await page.getByLabel('Import selected draft').setInputFiles({name:'old-personal.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(raw))});
    await page.waitForTimeout(100);
    assert.equal(await page.evaluate(()=>m('character').default.getState().health.current),11);
    observations.A9.mountedImport={keptRoomHp:true,alert:await page.getByRole('alert').allTextContents()};
    await writer.flush();
    assert.equal(durableState.maps.default.characterTokens['pc-a'].character.health.current,11);
    // Same UID / different selected canonical character is not this actor.
    await page.evaluate(()=>m('character').default.setState({currentCharacterId:'c-other',health:{current:42,max:50}}));
    const third={...cmd,commandId:crypto.randomUUID(),actors:[{ref,expectedRevision:2,finalResources:{hp:{current:8,temp:0}}}]};
    const thirdResult=await ack(client,'actor_consequence',third);assert.equal(thirdResult.success,true);
    await page.evaluate(result=>m('actors').applyAcceptedConsequence(result),thirdResult);
    assert.equal(await page.evaluate(()=>m('character').default.getState().health.current),42);
    await page.evaluate(()=>{m('character').default.setState({currentCharacterId:'c-a'});m('actors').reconcileOwner();});
    assert.equal(await page.evaluate(()=>m('character').default.getState().health.current),8);
    observations.A9.sameUidDifferentCharacter=true;
    await page.evaluate(()=>{m('gate').retirePrivateScope();m('gate').activatePrivateScope({scopeKind:'user',scopeId:'u-a'});m('character').default.setState({health:{current:41,max:50}});m('actors').reconcileOwner();});
    assert.equal(await page.evaluate(()=>m('actors').roomResourceProjection()),null);
    assert.equal(await page.evaluate(()=>m('character').default.getState().health.current),41);
    observations.A9.sameUidGenerationRetired=true;
    await page.evaluate(({roomId,socketId})=>{
      window.__socket={...__socket,id:socketId};
      m('game').default.setState({isInMultiplayer:true,multiplayerRoom:{id:roomId},multiplayerSocket:__socket});
      m('character').default.setState({currentCharacterId:'c-a'});
    },{roomId:room.id,socketId:client.id});
    await page.evaluate(()=>m('actors').refreshActorSnapshot());
    const selected=await page.evaluate(ref=>m('actors').selectOwnerAttachment(ref),ref);assert.equal(selected.success,true,JSON.stringify(selected));
    assert.equal(await page.evaluate(()=>m('character').default.getState().health.current),8);
    // A real admitted but unconfirmed command is absent after restoring the
    // last confirmed snapshot. The client preserves its competing projection.
    const restored = { ...room, gameState: durableState, checkpointRevision: durableRevision };
    backend.rooms.set(room.id,restored);backend.authorityService.attachRoom(restored);
    const unknown=await ack(client,'actor_consequence',third);assert.equal(unknown.code,'outcome_unknown');
    const recovery=await page.evaluate(()=>m('actors').refreshActorSnapshot());assert.equal(recovery.code,'actor_reconciliation_required');
    assert.equal(await page.evaluate(()=>m('character').default.getState().health.current),8);
    await page.getByRole('button',{name:'Use server projection; retain current candidate'}).click();
    assert.equal(await page.evaluate(()=>m('character').default.getState().health.current),11);
    const candidate=await page.evaluate(()=>m('character').default.getState().roomActorRecoveryCandidates.at(-1));
    assert.equal(candidate.data.health.current,8);
    const known=await ack(client,'actor_consequence',newer);assert.equal(known.success,true);
    await page.evaluate(result=>m('actors').applyAcceptedConsequence(result),known);
    assert.equal(await page.evaluate(()=>m('character').default.getState().health.current),11);
    observations.A6Mounted={unconfirmedUnknown:true,competingProjectionRetained:true,explicitServerProjection:11,retainedPriorHp:8,durableReceiptReadOnly:true};
    // Actual local sandbox round bookkeeping remains functional.
    observations.A10Local=await page.evaluate(()=>{
      m('game').default.setState({isInMultiplayer:false});
      m('condition').default.getState().addCondition('buff',{id:'sandbox-round',name:'Sandbox',targetId:'sandbox-token',durationType:'rounds',durationValue:3,remainingRounds:3,effects:{armor:2}});
      m('condition').default.getState().decrementRoundBasedConditions('buff','sandbox-token');
      return {remainingRounds:m('condition').default.getState().activeBuffs.find(value=>value.id==='sandbox-round').remainingRounds};
    });assert.equal(observations.A10Local.remainingRounds,2);
    observations.finalSnapshot=await page.locator('body').ariaSnapshot();observations.pageErrors=errors;
    assert.deepEqual(errors,[]);
    fs.writeFileSync(path.join(__dirname,'evidence/browser-results.json'),JSON.stringify(observations,null,2));
    console.log(JSON.stringify({A7:true,A8:observations.A8,A9:true,A10:true,pageErrors:errors,dependencies:Object.keys(manifest).length},null,2));
  } finally {await browser.close();await new Promise(resolve=>server.close(resolve));client.disconnect();await backend.stop();}
}
main().then(()=>{if(!process.argv.includes('--serve'))process.exit(0);}).catch(error=>{console.error(error);process.exit(1);});
