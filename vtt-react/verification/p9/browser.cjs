// P9 implementation witness (not independent acceptance). Real Chrome pages, real
// browser Socket.IO, registered server authority/P7 staging/CAS/writer and the mounted
// P9 owner/GM host. Fixtures: provider token verification, canonical owner documents,
// lease backend and cloud transport; inherited inert Firebase SDK/config/router.
require('../p7/preload.cjs');
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto'),Module=require('module');
const root=path.resolve(__dirname,'../../..'),deps=Module.createRequire(path.join(root,'vtt-react/package.json')),out=process.env.P9_OUTPUT;
if(!out)throw Error('P9_OUTPUT required');fs.mkdirSync(out,{recursive:true});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),serverHashes={};
const load=Module._extensions['.js'];Module._extensions['.js']=(module,file)=>{if(file.startsWith(path.join(root,'server'))&&!file.includes('node_modules'))serverHashes[path.relative(root,file).replace(/\\/g,'/')]=sha(fs.readFileSync(file));load(module,file);};
const {createProductionStackServer}=require(path.join(root,'server/tests/helpers/productionStackServer'));
const {FirebaseBatchWriter}=require(path.join(root,'server/services/syncService'));
const actors=require(path.join(root,'server/services/actorConsequences'));
const ack=(socket,event,data)=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('ACK timeout '+event)),7000);socket.emit(event,data,r=>{clearTimeout(timer);resolve(r);});});
const clone=v=>JSON.parse(JSON.stringify(v));
const MAP='p9-hall';
async function main(){
 let cloudFailure=false,confirmedRevision=0;
 const writer=new FirebaseBatchWriter(60000,50,{baseRetryDelayMs:1000,shouldPersist:()=>true,persist:async(_id,_state,context)=>{if(cloudFailure)return {outcome:'retryable',reason:'fixture cloud transport refused'};confirmedRevision=context.revision;return {outcome:'confirmed'};}});
 const backend=createProductionStackServer({firebaseBatchWriter:writer,characterOwners:{ilse:'p9-owner',bram:'p9-martyr'}});await backend.start();
 for(const uid of ['p9-gm','p9-owner','p9-martyr'])backend.registerAuthToken(uid,uid);
 for(const event of ['actor_snapshot','actor_bind','actor_consequence','actor_spell_approve','actor_spell_withdraw','actor_spell_decline','actor_spell_list','actor_recovery','character_resource_updated','join_room'])backend.setEventLimits(event,{maxPerMinute:20000,maxPerSecond:20000});
 // Fixture parity with server.js createSyncServices: writer status reaches current room members.
 writer.setStatusSink((roomId,payload)=>{const live=backend.rooms.get(roomId);if(!live)return;for(const [sid,player] of backend.players){if(player.roomId===roomId)backend.io.to(sid).emit('room_save_status',{roomId,...payload});}});
 const seed=backend.connect({token:'p9-gm'});await new Promise(r=>seed.once('connect',r));
 const room=await backend.seedRoom(seed.id,{gmUserId:'p9-gm',persistentRoomId:crypto.randomUUID()});
 room.gameState.maps[MAP]={...clone(room.gameState.maps.default),id:MAP,name:'Hall',tokens:{},creatures:{},characterTokens:{}};room.gameState.defaultMapId=MAP;
 const creature=JSON.parse(fs.readFileSync(path.join(root,'vtt-react/public/data/creatures.json'),'utf8')).find(c=>c.id==='grimmstalk');
 const hall=room.gameState.maps[MAP];
 hall.tokens.foe={id:'foe',creatureId:'grimmstalk',name:'Branvig',mapId:MAP,stats:clone(creature.stats),position:{x:400,y:250},state:{customName:'Branvig',currentHp:30,tempHealth:4,currentMana:0,tempMana:0,currentActionPoints:2,tempActionPoints:0,maxHp:250,maxMana:30,maxAP:5,conditions:[]}};
 hall.characterTokens.pc={id:'pc',mapId:MAP,ownerUserId:'p9-owner',position:{x:250,y:250},character:{id:'ilse',name:'Ilse',class:'Arcanoneer',level:3,health:{current:20,max:40},mana:{current:10,max:30},actionPoints:{current:2,max:5},tempHealth:0,tempMana:3,tempActionPoints:1},state:{conditions:[]}};
 hall.characterTokens.pcm={id:'pcm',mapId:MAP,ownerUserId:'p9-martyr',position:{x:300,y:250},character:{id:'bram',name:'Bram',class:'Martyr',level:3,health:{current:30,max:50},mana:{current:20,max:30},actionPoints:{current:3,max:5},tempHealth:0,tempMana:0,tempActionPoints:0},state:{conditions:[]}};
 const refs={};
 for(const [kind,id,owner,characterId] of [['creature','foe'],['character','pc','p9-owner','ilse'],['character','pcm','p9-martyr','bram']]){
  const raw=hall[kind==='creature'?'tokens':'characterTokens'][id];
  const bound=await ack(seed,'actor_bind',{roomId:room.id,ref:{kind,roomId:room.id,mapId:MAP,tokenId:id,...(owner?{ownerUid:owner,characterId}:{})},snapshotHash:actors.hash(raw)});
  assert.equal(bound.success,true,JSON.stringify(bound));refs[id]=bound.ref;
 }
 seed.disconnect();
 const built=require('./fixture.cjs').build(()=>false);await new Promise(r=>built.server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+built.server.address().port;
 const launch=process.env.P9_CHROME?{executablePath:process.env.P9_CHROME,headless:true}:{channel:'chrome',headless:true};
 const browser=await deps('playwright').chromium.launch(launch);
 const evidence={kind:'implementation-only',argv:process.argv,cwd:process.cwd(),browser:launch,fixtureLimits:['Provider token verification, canonical owner documents and lease backend are in-memory fixtures.','Cloud transport is simulated; real writer admission/retention/confirmation execute.','Browser Firebase SDK/config/router and unrelated render/dice libraries are inherited inert fixtures.','Mounted P9 owner/GM host, real stores, P7/P9 services, scoped custody, real browser Socket.IO and the registered server execute.','Producers (HUD/sheet/Arcanoneer) are separately mounted in jsdom component witnesses; here the owner panel is opened through the same routeSpellCast gate they call.','No human tabletop/creator/two-device/live Firestore/deployed restart proof.'],manifest:built.manifest,serverHashes,refs,witnesses:{},errors:[]};
 const characters={'p9-owner':{currentCharacterId:'ilse',name:'Ilse',class:'Arcanoneer',level:3,stats:{strength:10,agility:10,constitution:10,intelligence:16,spirit:10,charisma:10},classResource:{type:'elementalSpheres',spheres:['arcane','arcane','ember'],current:3,max:12},lore:{notes:'Ilse private notes'}},
  'p9-martyr':{currentCharacterId:'bram',name:'Bram',class:'Martyr',level:3,stats:{strength:10,agility:10,constitution:12,intelligence:10,spirit:14,charisma:10},classResource:{type:'devotionGauge',damage:62,spentLevels:2,max:6},lore:{notes:'Bram private notes'}},
  'p9-gm':{currentCharacterId:'gm-sheet',name:'GM sheet',class:'Pyrofiend',level:1,stats:{},classResource:{type:'infernoVeil',current:2,max:9}}};
 async function setup(page,uid,reload=false){
  if(reload)await page.reload();else await page.goto(url);
  await page.evaluate(async({backendUrl,roomId,mapId,uid,character,ref})=>{
   m('init').initStoreRegistry();window.__liveUser={uid,getIdToken:async()=>uid};m('auth').default.getState().setUser(__liveUser);await m('coordinator').whenHandoffIdle();
   window.__socket=io(backendUrl,{transports:['websocket'],forceNew:true,auth:{token:uid}});await new Promise(r=>__socket.once('connect',r));
   const joined=new Promise((resolve,reject)=>{__socket.once('room_joined',resolve);__socket.once('room_error',e=>reject(Error(JSON.stringify(e))));});__socket.emit('join_room',{roomId,playerName:uid,password:''});await joined;
   window.__outbound=[];window.__roomErrors=[];window.__saves=[];__socket.on('room_error',e=>__roomErrors.push(e));__socket.on('room_save_status',v=>__saves.push(v));
   const emit=__socket.emit.bind(__socket);__socket.emit=(event,...args)=>{__outbound.push({event,payload:JSON.parse(JSON.stringify(args[0]??null))});
    if(['actor_spell_approve','actor_consequence'].includes(event)&&typeof args[1]==='function'){const callback=args[1];args[1]=r=>{if(window.__dropAck===event){window.__dropped=(window.__dropped||0)+1;return;}callback(r);};}
    return emit(event,...args);};
   const on=__socket.on.bind(__socket);__socket.on=(event,fn)=>on(event,event==='actor_consequence_accepted'?(...a)=>{if(!window.__dropDelivery)fn(...a);}:fn);
   m('game').default.setState({isInMultiplayer:true,isGMMode:uid==='p9-gm',multiplayerRoom:{id:roomId},multiplayerSocket:__socket,gridSize:50,feetPerTile:5});
   m('map').default.setState({currentMapId:mapId});m('actors').registerActorHandlers({socket:__socket});m('spellService').registerSpellConsequenceHandlers({socket:__socket});
   const result=await m('actors').refreshActorSnapshot();if(!result.success)throw Error(JSON.stringify(result));m('map').default.setState({currentMapId:mapId});
   m('character').default.setState({...character,health:{current:1,max:1},mana:{current:0,max:1},actionPoints:{current:0,max:1}});
   if(ref){const selected=m('actors').selectOwnerAttachment(ref);if(!selected.success)throw Error(JSON.stringify(selected));}
   window.__root=ReactDOM.createRoot(document.getElementById('app'));
   function Chat(){const notes=m('chat').default(s=>s.notifications.combat);return React.createElement('section',{'aria-label':'Receipt chat'},...notes.map(n=>React.createElement('p',{key:n.id},n.content)));}
   ReactDOM.flushSync(()=>__root.render(React.createElement(React.Fragment,null,React.createElement(m('host').default),React.createElement(Chat))));
   window.__rng=0;const random=Math.random;Math.random=()=>{__rng++;return .7;};window.__random=random;
  },{backendUrl:backend.url(),roomId:room.id,mapId:MAP,uid,character:characters[uid],ref:uid==='p9-owner'?refs.pc:uid==='p9-martyr'?refs.pcm:null});
 }
 const pages={};
 for(const uid of ['p9-gm','p9-owner','p9-martyr']){const page=await browser.newPage();page.on('pageerror',e=>evidence.errors.push({uid,message:e.message}));pages[uid]=page;await setup(page,uid);}
 const gm=pages['p9-gm'],owner=pages['p9-owner'],bram=pages['p9-martyr'];global.__p9pages=[gm];
 const state=()=>clone(room.gameState),pc=()=>room.gameState.maps[MAP].characterTokens.pc,pcm=()=>room.gameState.maps[MAP].characterTokens.pcm,foe=()=>room.gameState.maps[MAP].tokens.foe;
 const outbound=(page,event)=>page.evaluate(event=>__outbound.filter(o=>o.event===event).map(o=>o.payload),event);
 const chat=page=>page.locator('section[aria-label="Receipt chat"] p').allInnerTexts();
 const rng=page=>page.evaluate(()=>__rng);
 const ownerDialog=page=>page.getByRole('dialog',{name:'Supported spell cast'});
 async function openSpell(page,spellId,origin={producer:'hud',slotIndex:0}){await page.evaluate(({spellId,origin})=>m('spellService').routeSpellCast({id:spellId},origin),{spellId,origin});await ownerDialog(page).waitFor();}
 async function physical(page,target,faces){await page.getByRole('combobox',{name:'Target'}).selectOption(target);for(let i=0;i<faces.length;i++)await page.getByLabel(new RegExp(`d\\d+ face ${i+1}`)).fill(String(faces[i]));await page.getByRole('button',{name:'Record physical roll'}).click();}
 async function approve(page){await page.getByRole('button',{name:'Approve price and send to GM'}).click();await page.getByText(/Awaiting GM adjudication|Outcome unknown/).first().waitFor();}
 async function gmAccept(final,reason='',expect=/Accepted/){const card=gm.locator('.p9-gm-card').first();await card.waitFor();await card.getByRole('checkbox').check();await card.getByLabel(/^Final/).fill(String(final));await card.getByLabel(/^Reason/).fill(reason);await card.getByRole('button',{name:'Accept one consequence'}).click();await gm.getByText(expect).first().waitFor();}
 const closeOwner=page=>page.evaluate(()=>m('spellService').closeOwnerPanel());

 console.log('P9 step', '// S3/S9', new Date().toISOString());
 // S3/S9: owner approval, GM adjudication, one receipt; no pre-spend; receipt-only results.
 {
  await openSpell(owner,'arc_spark_bolt');
  const facts=await ownerDialog(owner).innerText();
  assert.match(facts,/1d8 \+ intelligence\/4 → 1d8 \+ 4 \(INT 16 ÷ 4, rounded down\)/);assert.match(facts,/1 AP · 4 mana/);assert.match(facts,/arcane, arcane, ember \(3\/12\) → ember \(1\/12\)/);
  assert.equal(await rng(owner),0,'opening the panel must not roll');
  await physical(owner,`creature:${MAP}:foe`,[6]);
  assert.match(await ownerDialog(owner).innerText(),/Recorded physical roll: \[6\] \+ 4 = 10/);
  const before=state();
  await approve(owner);
  assert.deepEqual([pc().character.mana,pc().character.tempMana,pc().character.actionPoints,pc().character.tempActionPoints],[before.maps[MAP].characterTokens.pc.character.mana,3,before.maps[MAP].characterTokens.pc.character.actionPoints,1],'approval never pre-spends');
  assert.deepEqual(pc().state.classPayment,{version:1,domain:'elementalSpheres',value:{type:'elementalSpheres',spheres:['arcane','arcane','ember']}},'owner sync published the sheet value');
  const ownerSheetBefore=await owner.evaluate(()=>m('character').default.getState().classResource.spheres);
  await gmAccept(7,'GM ruled the durability bypass against plate: 3 lower');
  await owner.getByText(/Accepted · /).first().waitFor();
  assert.deepEqual([pc().character.actionPoints.current,pc().character.tempActionPoints,pc().character.mana.current,pc().character.tempMana],[2,0,9,0]);
  assert.deepEqual(pc().state.classPayment.value.spheres,['ember']);assert.deepEqual([foe().state.currentHp,foe().state.tempHealth],[27,0]);
  const receipts=actors.ledger(room).receipts;const receipt=receipts.at(-1);
  assert.equal(receipt.authorization.kind,'owner-approval-gm');assert.equal(receipts.length,2,'one sync + one spell receipt');
  const ownerAfter=await owner.evaluate(()=>({spheres:m('character').default.getState().classResource.spheres,mana:m('character').default.getState().mana,tempMana:m('character').default.getState().tempMana,ap:m('character').default.getState().actionPoints}));
  assert.deepEqual(ownerAfter.spheres,['ember']);assert.equal(ownerAfter.mana.current,9);assert.equal(ownerAfter.tempMana,0);assert.equal(ownerAfter.ap.current,2);
  const bramSheet=await bram.evaluate(()=>m('character').default.getState().classResource);
  assert.equal(bramSheet.type,'devotionGauge','another owner sheet is untouched');
  for(const page of [gm,owner,bram]){const lines=(await chat(page)).filter(line=>line.includes('Marrow-Piercing Slug'));assert.equal(lines.length,1);assert.match(lines[0],/physical \[6\] \+ 4 = 10; GM final 7 arcane/);}
  assert.equal(await rng(bram),0);assert.equal((await outbound(bram,'actor_consequence')).length,0,'observer never executes');
  assert.equal((await outbound(gm,'actor_consequence')).length,1);assert.equal((await outbound(owner,'actor_spell_approve')).length,1);
  const retained=writer.getRetainedSnapshot(room.id);
  await writer._flushRooms({force:true,only:room.id});
  await gm.getByText('Accepted · checkpoint-confirmed').first().waitFor();await owner.getByText(/checkpoint-confirmed/).first().waitFor();
  evidence.witnesses.S3={approvalPayload:(await outbound(owner,'actor_spell_approve'))[0],command:(await outbound(gm,'actor_consequence'))[0],receipt,ownerSheetBefore,ownerAfter,
   source:clone(pc().character),home:clone(pc().state.classPayment),target:clone(foe().state),retainedHome:retained?.maps?.[MAP]?.characterTokens?.pc?.state?.classPayment,writerStatus:writer.getStatus(room.id),confirmedRevision,
   publicSnapshotHasHome:JSON.stringify(await bram.evaluate(()=>m('actors').refreshActorSnapshot())).includes('classPayment'),chat:await chat(bram)};
  assert.equal(evidence.witnesses.S3.publicSnapshotHasHome,false);
  await closeOwner(owner);
 }
 console.log('P9 step', '// S7:', new Date().toISOString());
 // S7: digital roll once; approval ACK loss → unknown → same bytes; actual reload keeps custody; GM ACK loss → same receipt.
 {
  await owner.evaluate(()=>m('character').default.setState(s=>({classResource:{...s.classResource,spheres:['ember','arcane','storm','arcane'],current:4}})));
  await openSpell(owner,'arc_spark_bolt');
  await owner.getByRole('combobox',{name:'Target'}).selectOption(`creature:${MAP}:foe`);
  await owner.getByRole('button',{name:/^Roll 1d8 once$/}).click();
  assert.equal(await rng(owner),1);
  await owner.evaluate(()=>{window.__dropAck='actor_spell_approve';});
  await owner.getByRole('button',{name:'Approve price and send to GM'}).click();
  await owner.getByText(/Outcome unknown/).first().waitFor({timeout:12000});
  const first=(await outbound(owner,'actor_spell_approve')).at(-1);
  await owner.evaluate(()=>{window.__dropAck=null;});
  await owner.getByRole('button',{name:'Check this same approval'}).click();await owner.getByText(/Awaiting GM adjudication/).first().waitFor();
  const second=(await outbound(owner,'actor_spell_approve')).at(-1);assert.deepEqual(second,first,'retry re-sends the exact approval bytes');
  await setup(owner,'p9-owner',true);
  const restored=await owner.evaluate(()=>{const latest=m('spellCustody').loadLatestSpell();return {phase:latest?.phase,approvalId:latest?.approval?.approvalId,roll:latest?.approval?.roll,custody:latest?.custody};});
  assert.equal(restored.phase,'awaiting');assert.equal(restored.approvalId,first.approvalId);assert.deepEqual(restored.roll,first.roll);
  await owner.getByText(/Awaiting GM adjudication/).first().waitFor();
  await owner.getByRole('button',{name:'Open'}).click();await owner.getByRole('button',{name:'Check this same approval'}).click();await owner.getByText(/Awaiting GM adjudication/).first().waitFor();
  assert.equal(await rng(owner),0,'reload/check never rerolls');
  const receiptsBefore=actors.ledger(room).receipts.length;
  await gm.evaluate(()=>{window.__dropAck='actor_consequence';window.__dropDelivery=true;});
  await gmAccept(10,'',/Outcome unknown/);
  await gm.evaluate(()=>{window.__dropAck=null;window.__dropDelivery=false;});
  await gm.getByRole('button',{name:'Check same command'}).first().click();await gm.getByText(/Accepted · /).first().waitFor();
  assert.equal(actors.ledger(room).receipts.length,receiptsBefore+1+0,'one receipt despite ACK loss');
  const gmCommands=await outbound(gm,'actor_consequence');assert.deepEqual(gmCommands.at(-1),gmCommands.at(-2),'check re-sends the same command bytes');
  await owner.getByText(/Accepted · /).first().waitFor();
  assert.deepEqual(pc().state.classPayment.value.spheres,['ember','storm']);
  assert.deepEqual(await owner.evaluate(()=>m('character').default.getState().classResource.spheres),['ember','storm']);
  evidence.witnesses.S7={first,second,restored,gmCommands:gmCommands.slice(-2),receipt:actors.ledger(room).receipts.at(-1),receiptsAdded:actors.ledger(room).receipts.length-receiptsBefore};
  await closeOwner(owner);
 }
 console.log('P9 step', '// S6/S7:', new Date().toISOString());
 // S6/S7: fence while pending, withdraw and decline are truthful; nothing changes.
 {
  await owner.evaluate(()=>m('character').default.setState(s=>({classResource:{...s.classResource,spheres:['arcane','arcane','storm'],current:3}})));
  await openSpell(owner,'arc_spark_bolt');await physical(owner,`creature:${MAP}:foe`,[2]);await approve(owner);
  const mirror=JSON.stringify([...room.players.values()].find(p=>p.userId==='p9-owner').character?.classResource||null);
  await owner.evaluate(()=>{m('character').default.getState().syncResourcesWithMultiplayer({classResource:0});});
  await owner.waitForFunction(()=>__roomErrors.some(e=>e.code==='class_payment_pending'));
  assert.equal(JSON.stringify([...room.players.values()].find(p=>p.userId==='p9-owner').character?.classResource||null),mirror,'legacy class write fenced before mutation');
  const before=JSON.stringify(state());
  await owner.getByRole('button',{name:'Withdraw before acceptance'}).click();await owner.getByText(/Withdrawn before GM acceptance — no payment was recorded/).first().waitFor();
  await gm.waitForFunction(()=>Object.keys(m('spellService').useSpellConsequenceStore.getState().gmPending).length===0);
  assert.equal(JSON.stringify(state()),before);
  await closeOwner(owner);
  await openSpell(owner,'arc_spark_bolt');await physical(owner,`creature:${MAP}:foe`,[3]);await approve(owner);
  await gm.locator('.p9-gm-card').first().getByRole('button',{name:'Decline'}).click();
  await owner.getByText(/Declined by the GM before acceptance — no payment was recorded/).first().waitFor();
  assert.equal(JSON.stringify(state()),before);
  evidence.witnesses.S6={fence:await owner.evaluate(()=>__roomErrors.filter(e=>e.code==='class_payment_pending')),withdrawAndDeclineUnchanged:true};
  await closeOwner(owner);
 }
 console.log('P9 step', '// S4/S9:', new Date().toISOString());
 // S4/S9: Martyr self-heal by another owner; ledger stays private; Ilse untouched.
 {
  await openSpell(bram,'martyr_restorative_prayer',{producer:'sheet'});
  assert.match(await ownerDialog(bram).innerText(),/1d4 \+ spirit → 1d4 \+ 14 \(SPI score\)/);
  assert.match(await ownerDialog(bram).innerText(),/Devotion 2\/6 \(spent 2, damage bank 62\) → Devotion 3\/6 \(spent 1, damage bank 62\)/);
  await physical(bram,`character:${MAP}:pcm`,[3]);await approve(bram);
  const ilseBefore=await owner.evaluate(()=>m('character').default.getState().classResource);
  const card=gm.locator('.p9-gm-card').first();await card.waitFor();assert.equal((await card.innerText()).includes('spent'),false,'GM view has no private ledger');
  await gmAccept(17);
  await bram.getByText(/Accepted · /).first().waitFor();
  assert.deepEqual([pcm().character.health.current,pcm().character.mana.current,pcm().character.actionPoints.current],[47,15,2]);
  assert.deepEqual(pcm().state.classPayment.value,{type:'devotionGauge',current:3,max:6,damage:62,earnedLevels:4,spentLevels:1,bonusLevels:0});
  const receipt=actors.ledger(room).receipts.at(-1);assert.equal(receipt.actors.length,1);
  assert.equal(JSON.stringify(require(path.join(root,'server/services/actorConsequences')).publicReceipt(receipt)).includes('spentLevels'),false);
  assert.deepEqual(await bram.evaluate(()=>{const c=m('character').default.getState().classResource;return [c.current,c.spentLevels,c.damage];}),[3,1,62]);
  assert.deepEqual(await owner.evaluate(()=>m('character').default.getState().classResource),ilseBefore,'foreign receipt never touches another sheet');
  evidence.witnesses.S4={receipt,bram:clone(pcm())};
 }
 console.log('P9 step', '// S6 foreign', new Date().toISOString());
 // S6 foreign owner and observer cannot approve another owner's payment.
 {
  const forged=await bram.evaluate(async({pcRef,foeRef,epoch})=>new Promise(r=>__socket.emit('actor_spell_approve',{version:1,roomId:pcRef.roomId,approvalId:crypto.randomUUID(),actionEpoch:epoch,baseCommitSequence:0,source:pcRef,target:foeRef,
   spell:{definitionId:'arc_spark_bolt',definitionHash:'p9-spell:v1/'+'0'.repeat(64),name:'Slug',kind:'damage',damageTypes:['arcane']},roll:{mode:'physical',dice:[{sides:8,faces:[1]}],constant:4,total:5,reading:'x'},price:{ap:1,mana:4},classPayment:null},r)),
  {pcRef:refs.pc,foeRef:refs.foe,epoch:(await bram.evaluate(()=>m('actors').refreshActorSnapshot())).actionEpoch});
  assert.equal(forged.code,'forbidden');evidence.witnesses.S6.foreignOwner=forged;
 }
 evidence.finalState={pc:clone(pc()),pcm:clone(pcm()),foe:clone(foe()),receipts:actors.ledger(room).receipts.length};
 assert.deepEqual(evidence.errors,[]);
 const file=path.join(out,'browser.json');fs.writeFileSync(file,JSON.stringify(evidence,null,2),{flag:'wx'});
 console.log(JSON.stringify({file,witnesses:Object.keys(evidence.witnesses),errors:evidence.errors.length,receipts:evidence.finalState.receipts}));
 // Bounded teardown: evidence is already written; a lingering transport must not hang the runner.
 await Promise.race([Promise.all([browser.close(),backend.stop()]),new Promise(r=>setTimeout(r,5000))]);built.server.close();writer.stop?.();
}
main().then(()=>process.exit(0)).catch(async error=>{console.error(error);try{for(const p of (global.__p9pages||[]))console.error('PAGE',await p.evaluate(()=>JSON.stringify({gm:m('spellService').useSpellConsequenceStore.getState(),status:m('game').default.getState().actorConsequenceStatus,saves:window.__saves,text:document.body.innerText.slice(0,300)})));}catch(e){console.error(e.message);}process.exit(1);});
