// Connected current-candidate smoke. Reuses production-App witnesses; no replacement bundle.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), crypto = require('crypto');
const { chromium } = require('playwright');
const out = process.env.INTEGRATION_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External INTEGRATION_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true });
process.env.APP_OUTPUT = path.join(out, 'fixture'); process.env.A4_OUTPUT = path.join(out, 'producer');
const { setup } = require('../p9/integration/app-browser.cjs');
const producer = require('./creature-execution-app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const result = { checks: {}, findings: [], errors: [], passed: false, transactionJourneyPassed: false, integrationReady: false, liveServiceVerified: false, releaseReady: false, limits: ['Optimized production App, registered disposable backend, isolated browser contexts. Auth/ownership/lease/cloud are fixtures; device-local roster only. No live auth/cloud/two-device or deployment proof.'] };
const save = (n,v) => fs.writeFileSync(path.join(out,n),typeof v === 'string'?v:JSON.stringify(v,null,2));
const navigate = (p, url) => p.evaluate(url => { history.pushState({},'',url); dispatchEvent(new PopStateEvent('popstate')); },url);
const aiming = p => p.getByRole('region',{name:'Target aiming advisory',exact:true});
const deltaOnly=process.env.INTEGRATION_DELTA_ONLY==='1';
async function inspectEffectFields(page,book,effect){
  if(!deltaOnly)return;
  const fields=book.getByRole('group',{name:effect?'Composed effect · structured expiry':'Canonical Stunned · manual expiry',exact:true});
  for(const width of [1440,1024]){
    await page.setViewportSize({width,height:1000});
    const shape=await fields.evaluate(el=>({className:el.className,width:el.clientWidth,scrollWidth:el.scrollWidth,border:getComputedStyle(el).borderTopStyle,controls:[...el.querySelectorAll('input,select,textarea')].map(n=>({width:n.getBoundingClientRect().width,outline:getComputedStyle(n).outlineStyle}))}));
    assert.match(shape.className,/authored-effect-fields/);assert.equal(shape.border,'solid');assert.ok(shape.scrollWidth<=shape.width+1);
    shape.controls.forEach(n=>assert.ok(n.width>0&&n.width<=shape.width));
    save(`delta-fields-${effect?'composed':'manual'}-${width}.json`,shape);save(`delta-fields-${effect?'composed':'manual'}-${width}.aria.yml`,await fields.ariaSnapshot());
  }
  await page.setViewportSize({width:1440,height:1000});
}
async function effectsIncrement({gm,owner,observer},host) {
  process.env.A7_OUTPUT=path.join(out,'effects');
  const {authorSpell}=require('./authored-condition-app-browser.cjs');
  const book=()=>gm.getByRole('dialog',{name:'Spellbook',exact:true});
  const ack=(event,payload)=>gm.evaluate(({event,payload})=>new Promise(r=>__socket.emit(event,payload,r)),{event,payload});
  const target=()=>actors.locate(host.room,host.refs.B).token;
  const pc=()=>actors.locate(host.room,host.refs.pc).token;
  let deltaStun;
  await setup(gm,host.url,'app-gm');
  const saved=await authorSpell(gm,'HQ Ember Mire',0,0,{feet:-10,policy:'target-next-start',direct:true},inspectEffectFields);
  await gm.getByRole('button',{name:/^Character(?: \(\d+\))?$/}).click();await gm.getByRole('button',{name:'Spellbook S',exact:true}).click();
  await book().getByRole('button',{name:'Spell Library',exact:true}).click();await book().getByText(saved.name,{exact:true}).click();
  const admission=gm.getByRole('region',{name:`Room admission for ${saved.name}`,exact:true});
  await admission.getByRole('combobox',{name:'Existing class binding',exact:true}).selectOption('arcanoneer');await admission.getByRole('button',{name:'Admit this saved version',exact:true}).click();
  await admission.getByText(/^Admitted for /).waitFor();save('effect-library-admission.aria.yml',await admission.ariaSnapshot());
  await gm.locator('.spell-detail-overlay').getByRole('button',{name:'Close',exact:true}).click();await book().getByRole('button',{name:'Close',exact:true}).click();
  if(deltaOnly){
    await setup(gm,host.url,'app-gm');
    deltaStun=await authorSpell(gm,'Delta Immutable Stun',0,0,{kind:'stunned',policy:'target-next-end'},inspectEffectFields);
    await gm.getByRole('button',{name:/^Character(?: \(\d+\))?$/}).click();const open=gm.getByRole('button',{name:'Spellbook S',exact:true});await open.focus();await open.press('Enter');
    await book().getByRole('button',{name:'Spell Library',exact:true}).click();await book().getByText(deltaStun.name,{exact:true}).click();
    const a=gm.getByRole('region',{name:`Room admission for ${deltaStun.name}`,exact:true});await a.getByRole('combobox',{name:'Existing class binding',exact:true}).selectOption('arcanoneer');await a.getByRole('button',{name:'Admit this saved version',exact:true}).click();await a.getByText(/^Admitted for /).waitFor();
    await gm.locator('.spell-detail-overlay').getByRole('button',{name:'Close',exact:true}).click();await book().getByRole('button',{name:'Close',exact:true}).click();
  }
  // Prepare both authored sources before opening the combat timeline over authoring windows.
  await setup(gm,host.url,'app-gm');
  const anchor=await authorSpell(gm,'HQ Anchor Mire',0,0,{feet:-60,policy:'target-next-start',direct:true},inspectEffectFields);
  await producer.openBestiary(gm);await gm.locator('.library-window').getByRole('button',{name:'Create New',exact:true}).click();
  const wizard=gm.locator('.creature-wizard-layout');await wizard.locator('#creature-name').fill('HQ Mire Fox');await wizard.getByRole('button',{name:'3 Abilities',exact:true}).click();
  await wizard.getByRole('combobox',{name:'Compatible Spell Library definition',exact:true}).selectOption({label:anchor.name});await wizard.getByRole('button',{name:'Keep ability on creature',exact:true}).click();
  await wizard.getByRole('button',{name:'5 Shop Config',exact:true}).click();await wizard.getByRole('button',{name:/^Save Creature/}).click();await wizard.waitFor({state:'detached'});await producer.closeLibrary(gm);
  await gm.evaluate(()=>{const s=S('creatureStore').getState(),c=s.creatures.find(c=>c.name==='HQ Mire Fox');s.addCreatureToken(c,{x:150,y:-100},true,'hq-mire-fox',false,'app-hall');});
  // Existing C4 clock; no browser timer or alternate lifecycle owner.
  const started=await ack('combat_started',{roomId:host.room.id,turnOrder:[host.refs.B,host.refs.A].map(actorRef=>({tokenId:actorRef.tokenId,actorRef})),currentTurnIndex:0,round:1});assert.equal(started.success,true,JSON.stringify(started));
  await gm.getByRole('button',{name:'Shared turn expiry',exact:true}).click();const clock=gm.getByRole('region',{name:'Authenticated turn expiry',exact:true});
  await clock.getByRole('button',{name:'Enable authenticated turn expiry',exact:true}).click();
  await gm.waitForFunction(()=>document.body.textContent.includes('Advance authenticated turn'));
  await gm.getByRole('button',{name:'Close shared condition editor',exact:true}).last().click();
  // Use the existing resize/drag affordances to keep the timeline clear of authoring/Inspect.
  const timeline=gm.locator('.combat-timeline-window-compact');await timeline.waitFor();
  const windowBox=await timeline.boundingBox(),handle=await timeline.locator('.react-resizable-handle-se').boundingBox();
  assert.ok(windowBox&&handle);await gm.mouse.move(handle.x+handle.width/2,handle.y+handle.height/2);await gm.mouse.down();await gm.mouse.move(windowBox.x+400,windowBox.y+150,{steps:8});await gm.mouse.up();
  const title=await timeline.locator('.timeline-header').boundingBox();await gm.mouse.move(title.x+20,title.y+10);await gm.mouse.down();await gm.mouse.move(20,860,{steps:8});await gm.mouse.up();
  const summary=owner.locator('summary').filter({hasText:/^Admitted abilities$/});if(!(await summary.evaluate(e=>e.parentElement.open)))await summary.click();
  const admitted=owner.getByRole('region',{name:'Admitted abilities',exact:true});
  if(process.env.INTEGRATION_EFFECTS_ONLY==='1'||deltaOnly)await owner.evaluate(async ref=>{
    // The fresh-room continuation has no saved roster: stabilize the same explicit
    // fixture identity after asynchronous account bootstrap, without another save journey.
    S('characterStore').setState({id:'ilse',currentCharacterId:'ilse',class:'Arcanoneer'});
    await __actors.refreshActorSnapshot();const selected=__actors.selectOwnerAttachment(ref);if(!selected.success)throw Error(JSON.stringify(selected));
  },host.refs.pc);
  await admitted.getByRole('button',{name:'Refresh admitted abilities',exact:true}).click();
  await admitted.locator('.p9-admitted-row').filter({hasText:saved.name}).getByRole('button',{name:'Use admitted ability',exact:true}).click();
  const cast=owner.getByRole('dialog',{name:'Supported spell cast',exact:true});await cast.getByRole('combobox',{name:'Target',exact:true}).selectOption('creature:app-hall:B');
  await cast.getByLabel('d6 face 1',{exact:true}).fill('3');await cast.getByRole('button',{name:'Record physical roll',exact:true}).click();
  const before=actors.clone(target()),beforePC=actors.clone(pc().character);
  await cast.getByRole('button',{name:'Approve exact price, target, effects and duration',exact:true}).click();
  const card=gm.locator('.p9-gm-card').filter({hasText:saved.name});await card.getByLabel('GM timing clarification (required)',{exact:true}).fill('PRIVATE HQ exact target next start');
  await card.getByLabel('Private manual resolution evidence',{exact:true}).fill('PRIVATE HQ manually confirmed successful eligible outcome');await card.getByRole('checkbox',{name:/I resolved eligibility/}).check();await card.getByLabel('Final damage',{exact:true}).fill('5');
  await card.getByRole('button',{name:'Confirm payment, result and effect together',exact:true}).click();await cast.getByText(/Accepted ·/).first().waitFor();
  const receipt=actors.ledger(host.room).receipts.at(-1),instance=target().state.conditions.find(c=>c.sourceEntityId?.startsWith('authored-effect:'));
  assert.ok(instance);assert.equal(target().state.currentHp+target().state.tempHealth,before.state.currentHp+before.state.tempHealth-5);assert.deepEqual(pc().character,beforePC);
  assert.equal(instance.effects.movementSpeed,-10);assert.ok(host.room.gameState.combat.effectLifecycle);
  assert.equal(JSON.stringify(actors.publicReceipt(receipt)).includes('PRIVATE'),false);
  await observer.waitForFunction(id=>S('creatureStore').getState().creatureTokens.find(t=>t.id==='B').state.conditions.some(c=>c.id===id),instance.id);
  assert.equal(await observer.evaluate(id=>S('chatStore').getState().notifications.combat.filter(n=>n.receiptId?.endsWith(id)).length,receipt.commandId),1);
  result.checks.a10OwnerAtomicBundle={saved,receipt,instance};save('effect-owner-accepted.aria.yml',await cast.ariaSnapshot());
  await cast.getByRole('button',{name:'Close',exact:true}).click();
  await gm.getByRole('button',{name:'Shared turn expiry',exact:true}).click();
  const due=require('../../src/services/sharedEffectTiming').scheduleFor(instance,host.room.gameState.combat).dueSequence;
  while(host.room.gameState.combat.effectLifecycle.sequence<due){const next=host.room.gameState.combat.effectLifecycle.sequence+1;await clock.getByRole('button',{name:'Advance authenticated turn',exact:true}).click();await gm.waitForFunction(next=>{const pair=Object.entries(__req.m).find(([,f])=>f.toString().includes('Condition preparation already pending. No duplicate command created.'));const s=Object.values(__req(pair[0])).find(v=>typeof v?.getState==='function'&&'saved'in v.getState());return s.getState().combat?.effectLifecycle?.sequence===next;},next);if(next<due)assert.ok(target().state.conditions.some(c=>c.id===instance.id));}
  assert.equal(target().state.conditions.some(c=>c.id===instance.id),false);result.checks.a10ExactBoundaryExpiry={id:instance.id,due};
  await gm.getByRole('button',{name:'Close shared condition editor',exact:true}).last().click();
  // A second authored record reaches zero speed through the placed-creature production route.
  const region=await producer.inspectPlaced(gm,'hq-mire-fox');const bind=region.getByRole('button',{name:'Bind this placed creature',exact:true});if(await bind.count())await bind.click();
  await region.getByRole('button',{name:'Refresh room admission',exact:true}).click();await region.getByRole('button',{name:'Admit for this creature',exact:true}).click();await region.getByText(/^Admitted for /).waitFor();await region.getByRole('button',{name:'Use for this creature',exact:true}).click();
  const creature=gm.getByRole('dialog',{name:'Creature ability action',exact:true});await creature.getByRole('combobox',{name:'Creature or primary PC target',exact:true}).selectOption('creature:app-hall:B');
  await creature.getByLabel('d6 face 1',{exact:true}).fill('4');await creature.getByRole('button',{name:'Record physical roll',exact:true}).click();await creature.getByLabel('GM timing note (required)',{exact:true}).fill('PRIVATE source exact target next start');await creature.getByRole('checkbox',{name:/I resolved eligibility/}).check();
  await creature.getByRole('button',{name:'Validate successful effect application',exact:true}).click();await creature.getByRole('checkbox',{name:/I reviewed the retained successful outcome/}).check();await creature.getByLabel('Final damage',{exact:true}).fill('6');
  await creature.getByRole('button',{name:'Confirm payment, result and effect together',exact:true}).click();await creature.getByText(/^Accepted ·/).first().waitFor();
  const second=actors.ledger(host.room).receipts.at(-1);assert.equal(second.authorization.kind,'gm-creature-ability');assert.ok(target().state.conditions.some(c=>c.sourceEntityId?.startsWith('authored-effect:')));result.checks.a10PlacedCreatureBundle=second;
  await creature.getByRole('button',{name:'Finish or explicitly cancel (keep evidence)',exact:true}).click();await producer.closeInspect(gm);
  if(deltaOnly)await observer.evaluate(()=>{window.__deltaMoveEchoes=[];__socket.on('token_moved',event=>__deltaMoveEchoes.push(event));});
  const movementBefore=actors.clone(target()),outboundBefore=await gm.evaluate(()=>__outbound.length);
  // Seed an old retained quote, then click the real mounted confirmation after real effect arrival.
  const movementBudgetBefore=await gm.evaluate(()=>{
    const pair=Object.entries(__req.m).find(([,f])=>f.toString().includes('forceResetCombat:'));
    window.__integrationCombat=Object.values(__req(pair[0])).find(v=>typeof v?.getState==='function'&&'nextTurn'in v.getState());
    const t=S('creatureStore').getState().creatureTokens.find(t=>t.id==='B'),c=S('creatureStore').getState().creatures.find(c=>c.id===t.creatureId);
    __integrationCombat.setState({turnOrder:__integrationCombat.getState().turnOrder.map(r=>r.tokenId==='B'?{...r,creatureId:t.creatureId,currentActionPoints:t.state.currentActionPoints}:r)});
    __integrationCombat.getState().setPendingMovementConfirmation({tokenId:'B',creatureName:'B',startPosition:t.position,finalPosition:{x:t.position.x+50,y:t.position.y},requiredAP:1,totalDistance:5,baseMovement:c.stats.speed,currentAP:t.state.currentActionPoints,movementUsedThisTurn:0,currentMovementDistance:5,feetPerTile:5});
    const s=__integrationCombat.getState();return {used:s.turnMovementUsed.get('B')||0,unlocked:s.movementUnlocked.has('B'),ap:s.turnOrder.find(r=>r.tokenId==='B').currentActionPoints};
  });
  await gm.locator('.movement-confirmation-dialog').getByRole('button',{name:'Spend 1 AP to Move',exact:true}).click();await gm.locator('.movement-confirmation-dialog').waitFor({state:'detached'});
  assert.deepEqual(target().position,movementBefore.position);assert.equal(target().state.currentActionPoints,movementBefore.state.currentActionPoints);
  const token=await producer.tokenLocator(gm,'B'),bounds=await token.boundingBox();assert.ok(bounds);
  await gm.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);await gm.mouse.down();await gm.mouse.move(bounds.x+bounds.width/2+55,bounds.y+bounds.height/2,{steps:8});await gm.mouse.up();
  assert.equal(await gm.locator('.movement-confirmation-dialog').count(),0);assert.deepEqual(target().position,movementBefore.position);
  const movementEvents=await gm.evaluate(n=>__outbound.slice(n).filter(e=>e.event==='token_moved'),outboundBefore);
  // The legacy rejection path may synchronize the original coordinates; it must never send the proposed move.
  movementEvents.forEach(e=>assert.deepEqual(e.payload.position,movementBefore.position));
  // The existing debouncer flushes even a no-op coordinate sync asynchronously.
  // Fence its echoed action before taking the next refusal's whole-room baseline.
  if(deltaOnly&&movementEvents.length)await observer.waitForFunction(id=>__deltaMoveEchoes.some(e=>e.actionId===id),movementEvents.at(-1).payload.actionId);
  const movementBudgetAfter=await gm.evaluate(()=>{const s=__integrationCombat.getState();return {used:s.turnMovementUsed.get('B')||0,unlocked:s.movementUnlocked.has('B'),ap:s.turnOrder.find(r=>r.tokenId==='B').currentActionPoints};});assert.deepEqual(movementBudgetAfter,movementBudgetBefore);
  await gm.evaluate(()=>__actors.refreshActorSnapshot());assert.deepEqual(target().position,movementBefore.position);assert.equal(target().state.currentActionPoints,movementBefore.state.currentActionPoints);
  result.checks.a10RejectedMovementEvents=movementEvents;
  result.checks.a10ZeroSpeedRealDragAndStaleConfirmationNoMutation=true;
  if(deltaOnly)await postFreezeAuthorityAndTiming({gm,owner,observer},host,authorSpell,deltaStun);
}
async function postFreezeAuthorityAndTiming({gm,owner,observer},host,authorSpell,stunSpell){
  const profile=require('../../src/services/sharedConditionProfile'),timing=require('../../src/services/sharedEffectTiming');
  const target=()=>actors.locate(host.room,host.refs.B).token,record=actors.clone(target().state.conditions.find(c=>c.sourceEntityId?.startsWith('authored-effect:')));
  assert.ok(record);const schedule=timing.scheduleFor(record,host.room.gameState.combat);assert.ok(schedule);
  // Disposable entitlement fixture: the player controls this exact creature, so a
  // refusal must come from authored-effect authority, not generic wrong ownership.
  host.room.tokenControllers=host.room.tokenControllers||{};
  host.room.tokenControllers[`${host.room.id}:app-hall:B`]={roomId:host.room.id,mapId:'app-hall',tokenId:'B',controllerUserId:'app-owner'};
  const command=(op,replacement)=>({version:1,roomId:host.room.id,commandId:crypto.randomUUID(),actionEpoch:actors.epoch(host.room),baseCommitSequence:actors.ledger(host.room).commitSequence,
    actors:[{ref:host.refs.B,expectedRevision:target().state.actorContract.revision,conditions:[{op,recordId:record.recordId,...(replacement?{record:replacement}:{})}]}],
    adjudication:{definitionId:'gm-correction',definitionVersionOrHash:'gm-correction',finalAmount:0,adjustmentReason:'',chosenResult:'Exact condition correction witness'}});
  const rebuilt=profile.makeMovementRecord(host.refs.B,record.id,{sourceActor:record.sourceActor,sourceOccurrence:record.sourceEntityId,timing:'manual',authoredDuration:record.authoredDuration,feet:60,label:record.name});
  const refusals=[];
  for(const [page,op,code]of [[owner,'update','authored_effect_correction_is_removal'],[gm,'update','authored_effect_correction_is_removal'],[owner,'remove','authored_effect_gm_removal_required']]){
    const before=actors.clone(host.room.gameState),payload=command(op,op==='update'?rebuilt:null);
    const r=await page.evaluate(payload=>new Promise(resolve=>__socket.emit('actor_consequence',payload,resolve)),payload);
    assert.equal(r.success,false);assert.equal(r.code,code,JSON.stringify(r));assert.deepEqual(actors.clone(host.room.gameState),before);refusals.push({op,code:r.code});
  }
  assert.deepEqual(timing.scheduleFor(record,host.room.gameState.combat),schedule);result.checks.deltaImmutablePaidInstanceAndGmOnlyRemoval=refusals;
  // Real UI path for the new refusal classifier: a controller's attempted removal
  // of an authored Stunned instance is definitively failed, not an unknown lane.
  const admitted=owner.getByRole('region',{name:'Admitted abilities',exact:true});await admitted.getByRole('button',{name:'Refresh admitted abilities',exact:true}).click();await admitted.locator('.p9-admitted-row').filter({hasText:stunSpell.name}).getByRole('button',{name:'Use admitted ability',exact:true}).click();
  const cast=owner.getByRole('dialog',{name:'Supported spell cast',exact:true});await cast.getByRole('combobox',{name:'Target',exact:true}).selectOption('creature:app-hall:B');await cast.getByRole('button',{name:'Approve exact price, target, effects and duration',exact:true}).click();
  const card=gm.locator('.p9-gm-card').filter({hasText:stunSpell.name});await card.getByLabel('GM timing clarification (required)',{exact:true}).fill('PRIVATE immutable Stunned timing');await card.getByRole('checkbox',{name:/I resolved eligibility/}).check();await card.getByRole('button',{name:'Confirm payment, result and effect together',exact:true}).click();await cast.getByText(/Accepted ·/).first().waitFor();await cast.getByRole('button',{name:'Close',exact:true}).click();
  const stun=actors.clone(target().state.conditions.find(c=>profile.isStunned(c)));assert.ok(stun);
  await owner.evaluate(()=>__actors.refreshActorSnapshot());
  // Mirror the trusted P4 delegation fixture for the legacy menu's display gate;
  // do not change bound ownership/provenance or any protected room actor value.
  await owner.evaluate(()=>{const s=S('creatureStore'),tokens=s.getState().tokens.map(t=>t.id==='B'?{...t,state:{...t.state,ownerId:'app-owner'}}:t);s.setState({tokens,creatureTokens:tokens});});
  const owned=await producer.tokenLocator(owner,'B');await owned.click({button:'right'});await owner.getByText('Status',{exact:true}).hover();await owner.getByText('Conditions',{exact:true}).last().click();
  const ownerEditor=owner.getByRole('region',{name:'Shared Stunned',exact:true}),beforeOwner=actors.clone(host.room.gameState);
  const remove=ownerEditor.getByRole('button',{name:`Remove Stunned instance ${stun.id}`,exact:true});await remove.click();await ownerEditor.getByText(/Not applied: authored_effect_gm_removal_required/).waitFor();
  assert.deepEqual(actors.clone(host.room.gameState),beforeOwner);
  await owner.waitForFunction(id=>[...document.querySelectorAll('button')].some(b=>b.textContent.trim()===`Remove Stunned instance ${id}`&&!b.disabled),stun.id);assert.equal(await remove.isEnabled(),true);
  const custody=await owner.evaluate(key=>{const p=Object.entries(__req.m).find(([,f])=>f.toString().includes('Condition preparation already pending. No duplicate command created.'));return Object.values(__req(p[0])).find(v=>typeof v?.getState==='function'&&'saved'in v.getState()).getState().saved.entries[key];},profile.canonical(host.refs.B));assert.equal(custody.phase,'failed');
  save('delta-controller-definitive-refusal.aria.yml',await ownerEditor.ariaSnapshot());result.checks.deltaRealControllerRefusalClosesCustody=true;await owner.locator('.conditions-window .close-button').click();
  const ended=await gm.evaluate(roomId=>new Promise(resolve=>__socket.emit('combat_ended',{roomId},resolve)),host.room.id);assert.notEqual(ended.success,false);
  await gm.evaluate(()=>__actors.refreshActorSnapshot());assert.ok(target().state.conditions.some(c=>c.id===record.id));assert.equal(timing.scheduleFor(record,host.room.gameState.combat),null);
  const b=await producer.tokenLocator(gm,'B');await b.click({button:'right'});await gm.getByText('Status',{exact:true}).hover();await gm.getByText('Conditions',{exact:true}).last().click();
  const editor=gm.getByRole('region',{name:'Shared Stunned',exact:true});await editor.getByText(/not tracked by the current turn clock; GM removes this exact instance/).first().waitFor();
  save('delta-retired-clock-manual.aria.yml',await editor.ariaSnapshot());const before=actors.resources(target(),'creature');
  await editor.getByRole('button',{name:`Remove ${record.name} instance ${record.recordId}`,exact:true}).click();
  await gm.waitForFunction(id=>!S('creatureStore').getState().creatureTokens.find(t=>t.id==='B').state.conditions.some(c=>c.id===id),record.id);
  assert.equal(target().state.conditions.some(c=>c.id===record.id),false);assert.deepEqual(actors.resources(target(),'creature'),before);
  assert.ok(target().state.conditions.some(c=>c.id===stun.id),'movement removal preserves independent Stunned');await editor.getByRole('button',{name:`Remove Stunned instance ${stun.id}`,exact:true}).click();await gm.waitForFunction(id=>!S('creatureStore').getState().creatureTokens.find(t=>t.id==='B').state.conditions.some(c=>c.id===id),stun.id);assert.equal(target().state.conditions.some(c=>c.id===stun.id),false);assert.deepEqual(actors.resources(target(),'creature'),before);
  await observer.waitForFunction(id=>!S('creatureStore').getState().creatureTokens.find(t=>t.id==='B').state.conditions.some(c=>c.id===id),record.id);
  result.checks.deltaRetiredClockRetainsThenExactGmRemoval=true;
  await gm.locator('.conditions-window .close-button').click();
  await setup(gm,host.url,'app-gm');
  assert.equal(target().state.conditions.some(c=>c.id===record.id||c.id===stun.id),false,'reload does not resurrect removed instances');
  await authorSpell(gm,'Delta Manual Bell',0,0,null,inspectEffectFields);result.checks.deltaLegacyManualAndComposedFields=true;
}
async function registerBlocking(p) {
  await p.evaluate(() => {
    const pair=Object.entries(__req.m).find(([,f])=>f.toString().includes('Submitting one HP + wear consequence'));
    const m=__req(pair[0]); window.__blocking={register:Object.values(m).find(f=>typeof f==='function'&&f.toString().includes('actor_block_offered')),store:Object.values(m).find(v=>typeof v==='function'&&v.getState&&'gmPending' in v.getState())};
    __blocking.register({socket:__socket});
    const strike=Object.entries(__req.m).find(([,f])=>f.toString().includes('Submitting one AP/HP consequence'));
    Object.values(__req(strike[0])).find(f=>typeof f==='function'&&f.toString().includes('actor_strike_pending')&&f.toString().includes('.on('))({socket:__socket});
    const relay=Object.entries(__req.m).find(([,f])=>f.toString().includes('[roomRejoin] subscriber failed'));
    Object.values(__req(relay[0])).find(f=>typeof f==='function'&&f.toString().includes('room_joined'))(__socket);
  });
}
async function characterRoundtrip(owner) {
  // Seed one representative record through the real store, then use normal view/edit/save routes.
  await navigate(owner,'/account/characters/create');
  await owner.locator('.character-wizard-container').waitFor();
  await owner.evaluate(async() => {
    __socket.disconnect();S('gameStore').setState({isInMultiplayer:false,multiplayerRoom:null,multiplayerSocket:null});S('characterStore').setState({roomActorProjection:null});
    const record={id:'ilse',name:'Ilse HQ Disposable',race:'vreken',subrace:'clean_vreken',background:'sanctuarySeneschal',class:'Arcanoneer',level:2,statsModel:'base+earned@1',class_spells:{known_spells:['arc_spark_bolt','arc_frost_touch','arc_healing_light']},selectedSkills:['arcana'],skillRanks:{arcana:'NOVICE'},selectedLanguages:['common'],lore:{backstory:'Disposable integration fixture'},health:{current:7,max:40},mana:{current:3,max:30},levelUpHistory:{2:{attributes:['intelligence'],healthIncrease:4,manaIncrease:2}}};
    record.classAcquisition={Arcanoneer:{qualification:{verified:true,source:'Disposable supervised training',fulfilledRequirements:['elemental_training','compatible_interface']}}};
    // Production validator checked this 19-point base with this exact heritage/origin/qualification.
    const base={strength:5,agility:5,constitution:5,intelligence:5,spirit:15,charisma:5};
    record.baseStats=base;record.stats={...base,intelligence:base.intelligence+1};
    S('characterStore').setState({characters:[]});
    await S('characterStore').getState().createCharacter(record);
    await S('characterStore').getState().loadCharacters();
    window.__hqCharacter=JSON.parse(JSON.stringify(S('characterStore').getState().characters.find(c=>c.id==='ilse')));
    if(!__hqCharacter)throw Error('Fixture roster save/reload lost record');
  });
  await navigate(owner,'/account/characters/view/ilse');
  await owner.getByRole('heading',{name:'Ilse HQ Disposable',exact:true}).waitFor();
  await owner.waitForFunction(()=>S('characterStore').getState().currentCharacterId==='ilse');
  const viewEffective=await owner.evaluate(()=>S('characterStore').getState().getEffectiveStats());
  const before=await owner.evaluate(()=>({stats:__hqCharacter.stats,base:__hqCharacter.baseStats,spells:__hqCharacter.class_spells,health:__hqCharacter.health.current,mana:__hqCharacter.mana.current}));
  for(let i=0;i<2;i++){
    await navigate(owner,'/account/characters/edit/ilse');
    await owner.getByRole('button',{name:'Quick step navigation',exact:true}).click();
    await owner.getByRole('button',{name:/5 Summary/}).click();
    const summary=await owner.locator('.character-wizard-container').ariaSnapshot();save(`character-summary-${i}.aria.yml`,summary);
    const shownInt=Number(summary.match(/Int (\d+)/)?.[1]);
    assert.equal(shownInt,viewEffective.intelligence,'Wizard Summary and sheet agree including earned gain');
    await owner.getByRole('button',{name:'Update Character',exact:true}).click();
    await owner.waitForURL('**/account');
    await navigate(owner,'/account/characters/view/ilse');
    await owner.getByRole('heading',{name:'Ilse HQ Disposable',exact:true}).waitFor();
    const after=await owner.evaluate(()=>{const c=S('characterStore').getState().characters.find(c=>c.id==='ilse');return {stats:c.stats,base:c.baseStats,spells:c.class_spells,health:c.health.current,mana:c.mana.current};});
    assert.deepEqual(after,before,'no-op edit preserves gains, known spells and current resources');
  }
  result.checks.characterSaveReopenNoopTwice=before;
  result.checks.summarySheetEffectiveInt=viewEffective.intelligence;
  // Sonnet's guest legacy no-op acceptance carries forward. Exercise the late helper
  // from this actual optimized bundle without creating a second competing save fixture.
  const legacy=await owner.evaluate(()=>{
    const input=JSON.parse(JSON.stringify(__hqCharacter));delete input.baseStats;delete input.statsModel;
    const before=JSON.stringify(input);
    const pair=Object.entries(__req.m).find(([,f])=>f.toString().includes('effectiveStats:')&&f.toString().includes('equipmentBonuses:')&&f.toString().includes('totalStats:'));
    const fn=Object.values(__req(pair[0])).find(f=>typeof f==='function'&&f.toString().includes('effectiveStats:')&&f.toString().includes('totalStats:'));
    const snapshot=fn(input);return {effective:snapshot.effectiveStats,unchanged:before===JSON.stringify(input),hasBase:'baseStats'in input,hasModel:'statsModel'in input};
  });
  assert.equal(legacy.effective.intelligence,9);assert.equal(legacy.effective.strength,3);assert.equal(legacy.unchanged,true);assert.equal(legacy.hasBase,false);assert.equal(legacy.hasModel,false);
  result.checks.ambiguousLegacyResourceHelperPreservesProvenance=legacy;
}
async function main(){
  const host=await require('../p9/integration/app-server.cjs').start();
  host.room.gameState.maps['app-hall'].characterTokens.pc.character.health.current=7;
  host.room.gameState.maps['app-hall'].characterTokens.pc.character.mana.current=3;
  const browser=await chromium.launch({channel:'chrome',headless:true}), pages={};
  for(const event of ['actor_snapshot','actor_consequence','actor_authored_admit','actor_authored_list','actor_bind','actor_block_offer','actor_block_approve','actor_block_list','actor_blocking_view','actor_block_decline','actor_block_withdraw','actor_spell_list','actor_strike_approve','actor_strike_list','actor_spell_approve','actor_spell_prepare_creature','actor_spell_withdraw','actor_turn_boundary','combat_started','combat_ended','character_updated','token_created','join_room'])host.backend.setEventLimits(event,{maxPerMinute:20000,maxPerSecond:20000});
  try{
    for(const [role,uid] of [['owner','app-owner'],['gm','app-gm'],['observer','app-observer']]){
      const p=pages[role]=await browser.newPage({viewport:{width:1440,height:1000}});p.on('pageerror',e=>result.errors.push({role,error:e.message}));await setup(p,host.url,uid);
    }
    const {owner,gm,observer}=pages;
    if(process.env.INTEGRATION_EFFECTS_ONLY==='1'||deltaOnly){
      const carriedPath=process.env.INTEGRATION_CARRY,carried=JSON.parse(fs.readFileSync(carriedPath));
      const asset=crypto.createHash('sha256').update(fs.readFileSync(path.join(process.env.APP_BUILD_DIR,'asset-manifest.json'))).digest('hex');
      assert.equal(carried.transactionJourneyPassed,true);assert.deepEqual(carried.findings,[]);
      if(deltaOnly){
        const capture=JSON.parse(fs.readFileSync(process.env.INTEGRATION_DELTA_CAPTURE)),base=JSON.parse(fs.readFileSync(capture.baseIdentity));
        assert.equal(base.workingByteSha256,'288bccd8f56b8dbedd8dd21974fdf231c9a06b82721ee1706858a7e4636f5b59');
        assert.equal(capture.baseAppSha256,crypto.createHash('sha256').update(fs.readFileSync(carriedPath)).digest('hex'));
        for(const [p,h]of Object.entries(base.runtimeHashes).filter(([p])=>!capture.delta.includes(p)))assert.equal(capture.hashes[p],h,`Non-delta input changed: ${p}`);
        result.executionScope='Released Opus delta scenarios only; unchanged full App14 acceptance carried by source manifest.';
        result.integratedDeltaFileCount=capture.delta.length;
      }else assert.equal(carried.assetManifestSha256,asset);
      assert.ok(carried.checks.characterPanelRendersSnapshotResources);assert.ok(carried.checks.strikeEffectiveScoreModifierOriginalRecovery);
      await effectsIncrement(pages,host);
      result.carriedConnectedEvidence={path:carriedPath,sha256:crypto.createHash('sha256').update(fs.readFileSync(carriedPath)).digest('hex'),reason:deltaOnly?'Accepted App14; only declared delta files differ. Full journey not rerun.':'Same optimized asset and sealed backend; completed connected/attribute checks carried while extending A10 entrypoint coverage.'};
      result.checks={...carried.checks,...result.checks};result.transactionJourneyPassed=true;result.integrationReady=true;result.passed=true;
      return;
    }
    try{await characterRoundtrip(owner);}catch(e){result.findings.push({id:'character-roundtrip',error:e.stack});save('character-failure.aria.yml',await owner.locator('body').ariaSnapshot());}
    assert.equal(await observer.evaluate(()=>S('characterStore').getState().characters.some(c=>c.id==='ilse'&&c.name==='Ilse HQ Disposable')),false);result.checks.separatePrincipalContextIsolation=true;
    const savedCharacter=await owner.evaluate(()=>S('characterStore').getState().characters.find(c=>c.id==='ilse')||window.__hqCharacter||null);
    const joinedOwner=await setup(owner,host.url,'app-owner');
    await owner.evaluate(({record,ref})=>{if(record){S('characterStore').setState({characters:[record]});S('characterStore').getState().loadCharacter('ilse');const r=__actors.selectOwnerAttachment(ref);if(!r.success)throw Error(JSON.stringify(r));}},{record:savedCharacter,ref:joinedOwner.fixture.refs.pc});
    for(const p of [owner,gm,observer])await registerBlocking(p);
    result.checks.exactPrimary=await owner.evaluate(()=>S('characterStore').getState().roomActorProjection?.ref);
    await owner.keyboard.press('c');const sheet=owner.getByRole('dialog',{name:'Character Sheet',exact:true});const info=sheet.getByRole('button',{name:'Info',exact:true});await info.focus();await info.press('Enter');await owner.mouse.move(1300,850);await sheet.getByText('Spell & Magic',{exact:true}).waitFor();
    const resourcePanel=await owner.evaluate(()=>{
      const pair=Object.entries(__req.m).find(([,f])=>f.toString().includes('effectiveStats:')&&f.toString().includes('equipmentBonuses:')&&f.toString().includes('totalStats:'));
      const fn=Object.values(__req(pair[0])).find(f=>typeof f==='function'&&f.toString().includes('effectiveStats:')&&f.toString().includes('totalStats:'));
      const s=S('characterStore').getState(),snapshot=fn(s);return {hp:s.health.current,mp:s.mana.current,maxHP:snapshot.health.max,maxMP:snapshot.mana.max};
    });
    assert.ok((await sheet.getByText('Max Health',{exact:true}).locator('..').textContent()).includes(`${resourcePanel.hp}/${resourcePanel.maxHP}`));
    assert.ok((await sheet.getByText('Max Mana',{exact:true}).locator('..').textContent()).includes(`${resourcePanel.mp}/${resourcePanel.maxMP}`));
    save('character-panel-resource-snapshot.aria.yml',await sheet.ariaSnapshot());result.checks.characterPanelRendersSnapshotResources=resourcePanel;await owner.keyboard.press('c');
    // Map picker, advisory-only GM geometry and invariant player unknown; retained dice, no spending.
    await gm.evaluate(()=>{
      const pairs=Object.entries(__req.m).filter(([,f])=>f.toString().includes('addEnvironmentalObject:'));
      window.__editor=pairs.flatMap(([id])=>Object.values(__req(id))).find(v=>typeof v?.getState==='function'&&'wallData' in v.getState());
      S('gameStore').setState({gridType:'square',gridOffsetX:0,gridOffsetY:0,cameraX:450,cameraY:300});__editor.setState({wallData:{},environmentalObjects:[],windowOverlays:{},viewingFromToken:null});
    });
    const resources=JSON.stringify(host.room.gameState.actorConsequences);
    await gm.locator('.creature-token').first().hover();await gm.getByAltText('Feather Slash',{exact:true}).first().click();
    const feather=gm.getByRole('dialog',{name:'Feather Slash adjudication'});
    await feather.getByRole('combobox',{name:'Feather Slash target'}).selectOption('creature:B');
    for(const [n,v] of [[1,'2'],[2,'4']])await feather.getByLabel(`Physical d8 face ${n}`).fill(v);
    await feather.getByRole('button',{name:'Record physical faces',exact:true}).click();await feather.getByRole('button',{name:'Pick on map',exact:true}).click();
    await aiming(gm).getByRole('combobox',{name:'Preview target'}).selectOption({label:'B'});
    await aiming(gm).getByText('Sight clear in modeled 2D geometry only',{exact:false}).waitFor();
    await gm.evaluate(()=>__editor.setState({wallData:{'9,5,9,7':{type:'stone_wall'}}}));
    await aiming(gm).getByText('Sight blocked in modeled 2D geometry',{exact:false}).waitFor();
    await gm.evaluate(()=>S('gameStore').setState({isGMMode:false}));await aiming(gm).getByText('viewer-safe geometry is unavailable',{exact:false}).waitFor();
    await gm.evaluate(()=>S('gameStore').setState({isGMMode:true}));await gm.keyboard.press('Escape');
    await feather.getByText(/recorded faces \[2, 4\]/).waitFor();await feather.getByRole('button',{name:'Pick on map',exact:true}).click();
    await aiming(gm).getByRole('combobox',{name:'Preview target'}).selectOption({label:'Ilse HQ Disposable'});await aiming(gm).getByRole('button',{name:'Use target',exact:true}).click();
    await feather.getByText(/recorded faces \[2, 4\]/).waitFor();assert.equal(JSON.stringify(host.room.gameState.actorConsequences),resources);
    await feather.getByRole('button',{name:'Close Feather Slash',exact:true}).click();result.checks.targetingAdvisoryRetainedNoSpend=true;
    // Supported owner spell via normal action bar; GM installs one accepted result.
    await owner.locator('.action-bar-assembly .action-slot').first().evaluate(el=>{const data=new DataTransfer();data.setData('application/json',JSON.stringify({id:'arc_spark_bolt',name:'Marrow-Piercing Slug',icon:'Arcane/Ebon Blaze',spellType:'ACTION'}));const e=new Event('drop',{bubbles:true,cancelable:true});Object.defineProperty(e,'dataTransfer',{value:data});el.dispatchEvent(e);});
    await owner.locator('.action-bar-assembly .action-slot').first().click();const spell=owner.getByRole('dialog',{name:'Supported spell cast'});
    await spell.getByRole('button',{name:'Pick on map',exact:true}).click();await aiming(owner).getByRole('combobox',{name:'Preview target'}).selectOption({label:'B'});await aiming(owner).getByText('viewer-safe geometry is unavailable',{exact:false}).waitFor();await aiming(owner).getByRole('button',{name:'Use target',exact:true}).click();
    await spell.getByLabel('d8 face 1',{exact:true}).fill('6');await spell.getByRole('button',{name:'Record physical roll',exact:true}).click();
    const formula=await spell.ariaSnapshot(),attrs=await owner.evaluate(()=>{const s=S('characterStore').getState();return {raw:s.stats.intelligence,effective:s.getEffectiveStats().intelligence};});save('supported-spell.aria.yml',formula);
    assert.equal(attrs.effective,result.checks.summarySheetEffectiveInt);assert.match(formula,new RegExp(`INT ${attrs.effective} ÷ 4`));assert.match(formula,/\[6\] \+ 2/);
    result.checks.spellScoreDivisor={...attrs,constant:2,rollTotal:8};
    await gm.getByRole('combobox',{name:'Exact room attachment',exact:true}).selectOption('character:pc');await gm.getByRole('button',{name:'Edit selected shared conditions',exact:true}).click();
    const stunned=gm.getByRole('region',{name:'Shared Stunned',exact:true});await stunned.getByLabel('Source occurrence reference').fill('HQ disposable stun');await stunned.getByLabel('Source-specific duration').selectOption('manual');await stunned.getByRole('button',{name:'Apply Stunned source',exact:true}).click();
    await stunned.getByText('Stunned active: supported actions/reactions and player voluntary movement refused.',{exact:true}).waitFor();
    const pools=()=>{const c=host.room.gameState.maps['app-hall'].characterTokens.pc.character;return JSON.stringify([c.health,c.mana,c.actionPoints,c.tempHealth,c.tempMana,c.tempActionPoints]);},frozen=pools();
    await spell.getByRole('button',{name:'Approve price and send to GM'}).click();await spell.getByText(/actor stunned|Stunned|actor_stunned/).first().waitFor();assert.equal(pools(),frozen);
    await stunned.getByRole('button',{name:/Remove Stunned instance/}).click();await stunned.getByText('Stunned inactive.',{exact:true}).waitFor();await gm.getByRole('button',{name:'Close shared condition editor',exact:true}).click();result.checks.canonicalStunnedRestrictionRestored=true;
    await spell.getByRole('button',{name:'Approve price and send to GM'}).click();
    const sc=gm.locator('.p9-gm-card').first();await sc.waitFor();await sc.getByRole('checkbox').check();await sc.getByLabel(/^Final/).fill('7');await sc.getByLabel(/^Reason/).fill('Disposable integrated ruling');await sc.getByRole('button',{name:'Accept one consequence'}).click();await spell.getByText(/Accepted · /).first().waitFor();result.checks.ownerSpell=actors.ledger(host.room).receipts.at(-1);
    await spell.getByRole('button',{name:'Close',exact:true}).click();
    // Actual basic strike: the score feeds its modifier, not a score-as-bonus substitution.
    await owner.locator('.action-bar-assembly .action-slot').first().evaluate(el=>{const data=new DataTransfer();data.setData('application/json',JSON.stringify({id:'universal_attack',name:'Attack',icon:'Slashing/Sword Strike',spellType:'ACTION'}));const e=new Event('drop',{bubbles:true,cancelable:true});Object.defineProperty(e,'dataTransfer',{value:data});el.dispatchEvent(e);});
    await owner.locator('.action-bar-assembly .action-slot').first().click();const strike=owner.getByRole('dialog',{name:'Basic weapon strike',exact:true});
    await strike.getByRole('combobox',{name:'Strike target',exact:true}).selectOption('creature:app-hall:B');
    await strike.getByLabel('Physical weapon faces',{exact:true}).fill('3');await strike.getByRole('button',{name:'Record weapon faces',exact:true}).click();
    await strike.getByLabel('Physical proficiency faces',{exact:true}).fill('2');await strike.getByRole('button',{name:'Record proficiency faces',exact:true}).click();
    save('supported-strike.aria.yml',await strike.ariaSnapshot());await strike.getByRole('button',{name:'Approve 2 AP and send to GM',exact:true}).click();
    const strikeCard=gm.locator('.p12-gm-card').last();await strikeCard.getByRole('combobox',{name:'Proficiency outcome',exact:true}).selectOption('deferred');
    const defense=strikeCard.getByRole('combobox',{name:'Listed defense verdict',exact:true});if(await defense.count())await defense.selectOption('not-applicable');
    await gm.evaluate(()=>{window.__integrationEmit=__socket.emit.bind(__socket);const handlers=__socket.listeners('actor_consequence_accepted');__socket.removeAllListeners('actor_consequence_accepted');__socket.on('actor_consequence_accepted',r=>{if(r.receipt?.adjudication?.definitionId==='basic-weapon-strike')return;handlers.forEach(f=>f(r));});__socket.emit=(event,...args)=>{if(event==='actor_consequence'&&typeof args[1]==='function')args[1]=()=>{};return __integrationEmit(event,...args);};});
    await strikeCard.getByRole('button',{name:'Confirm and apply',exact:true}).click();await strikeCard.getByRole('button',{name:'Check same command',exact:true}).waitFor({timeout:15000});
    const strikeReceipt=actors.ledger(host.room).receipts.at(-1),original=await gm.evaluate(()=>__outbound.filter(x=>x.event==='actor_consequence').at(-1).payload),count=actors.ledger(host.room).receipts.length;
    const strikeReading=JSON.parse(strikeReceipt.adjudication.chosenResult);assert.equal(strikeReading.weapon.score,2);assert.equal(strikeReading.weapon.modifier,-4);assert.equal(strikeReading.proposed,0);
    await gm.evaluate(()=>{__socket.emit=__integrationEmit;});await strikeCard.getByRole('button',{name:'Check same command',exact:true}).click();await strikeCard.getByText(/^Accepted: AP/).waitFor();
    assert.deepEqual(await gm.evaluate(()=>__outbound.filter(x=>x.event==='actor_consequence').at(-1).payload),original);assert.equal(actors.ledger(host.room).receipts.length,count);
    result.checks.strikeEffectiveScoreModifierOriginalRecovery={score:2,modifier:-4,original,receipt:strikeReceipt};await strike.getByRole('button',{name:'Close strike',exact:true}).click();
    // Real Creature Wizard → placed source → existing owner block/healing path.
    await owner.evaluate(()=>{const s=S('characterStore');s.setState({equipment:{...s.getState().equipment,chest:{id:'hq-hide',name:'HQ Hide',type:'armor',subtype:'LEATHER',durability:'d8',maxDurability:'d8',width:2,height:2,slots:['chest']}},roomEquipmentCustody:null});s.getState().syncWithMultiplayer();});
    await owner.locator('button.p12b-chip').click();const od=owner.getByRole('dialog',{name:'Blocking and wear',exact:true});await od.getByRole('button',{name:'Add HQ Hide (armor d8)',exact:true}).click();await od.getByRole('button',{name:'Save blocking declaration',exact:true}).click();
    await gm.evaluate(()=>S('gameStore').setState({cameraX:0,cameraY:0}));await producer.openBestiary(gm);
    const damage=await producer.author(gm,{creature:'HQ Finch',name:'HQ Thorn',kind:'damage',formula:'1d6+2',ap:1,mana:3,range:30});
    const heal=await producer.author(gm,{creature:'HQ Doe',name:'HQ Mend',kind:'healing',formula:'1d8+1',ap:0,mana:0,range:30});await producer.closeLibrary(gm);
    await gm.evaluate(({damage,heal})=>{const s=S('creatureStore').getState();s.addCreatureToken(damage,{x:-150,y:-100},true,'hq-source',false,'app-hall');s.addCreatureToken(heal,{x:50,y:-100},true,'hq-healer',false,'app-hall');},{damage,heal});
    await gm.waitForFunction(()=>__outbound.filter(x=>x.event==='token_created').length>=2);
    for(const healing of [false,true]){
      const d=await producer.admitAndOpen(gm,healing?'hq-healer':'hq-source');await d.getByRole('combobox',{name:'Creature or primary PC target',exact:true}).selectOption('character:app-hall:pc');
      const currentHall=host.room.gameState.maps['app-hall'],beforeSource=actors.clone(currentHall.tokens[healing?'hq-healer':'hq-source'].state),beforeHP=currentHall.characterTokens.pc.character.health.current;
      if(healing)await d.getByRole('button',{name:'Roll 1d8+1 once',exact:true}).click();else{await d.getByLabel('d6 face 1',{exact:true}).fill('4');await d.getByRole('button',{name:'Record physical roll',exact:true}).click();}
      await d.getByLabel(healing?'Proposed healing':'Proposed damage before equipment block',{exact:true}).fill(healing?'10':'6');
      if(!healing)await d.getByLabel('I rule that equipment blocking applies to this ability',{exact:true}).check();
      await d.getByLabel(healing?'Targeting and healing ruling (required)':'Targeting and blocking applicability ruling (required)',{exact:true}).fill('Disposable exact-owner integrated ruling');await d.getByRole('button',{name:'Offer exact proposal to PC owner',exact:true}).click();
      const oc=od.getByRole('article',{name:`Block roll for HQ ${healing?'Mend':'Thorn'}`,exact:true});await oc.waitFor();
      assert.equal(await observer.evaluate(()=>Object.keys(__blocking.store.getState().offers).length),0,'owner/GM pending block offers stay private');
      if(healing)await oc.getByRole('button',{name:'Accept this healing proposal',exact:true}).click();else{await oc.getByLabel(/Natural face/).fill('2');await oc.getByRole('button',{name:'Approve block roll',exact:true}).click();}
      const gc=gm.getByRole('article',{name:'Pending block roll',exact:true}).last();await gc.waitFor();if(!healing)await gc.getByLabel(/Non-physical damage: the GM rules/).check();await gc.getByRole('button',{name:'Confirm and apply',exact:true}).click();await gc.waitFor({state:'detached'});
      result.checks[healing?'healing':'ownerBlockPaymentHPWear']=actors.ledger(host.room).receipts.at(-1);
      const afterHall=host.room.gameState.maps['app-hall'],afterSource=afterHall.tokens[healing?'hq-healer':'hq-source'].state;
      assert.equal(afterSource.currentActionPoints,beforeSource.currentActionPoints-(healing?0:1));assert.equal(afterSource.currentMana,beforeSource.currentMana-(healing?0:3));
      assert.equal(afterHall.characterTokens.pc.character.health.current,healing?Math.min(40,beforeHP+10):beforeHP-4);
      if(healing)assert.equal(result.checks.healing.actors[1].equipmentWear,undefined);
      await gm.getByRole('button',{name:'Open retained creature action',exact:true}).click();await gm.getByRole('button',{name:'Finish or explicitly cancel (keep evidence)',exact:true}).click();await producer.closeInspect(gm);
      if(!healing){await owner.waitForFunction(()=>S('characterStore').getState().equipment.chest.durability==='d6');const n=actors.ledger(host.room).receipts.length;const r=await owner.evaluate(async()=>{__socket.disconnect();__socket.connect();await new Promise(r=>__socket.once('connect',r));const joined=new Promise(r=>__socket.once('room_joined',r));__socket.emit('join_room',{roomId:S('gameStore').getState().multiplayerRoom.id,playerName:'app-owner',password:'',isReconnect:true});await joined;return __socket.listeners('room_joined').length;});assert.equal(r,1);assert.equal(actors.ledger(host.room).receipts.length,n);result.checks.rejoinOneListenerNoDuplicate=true;}
    }
    const id=result.checks.ownerBlockPaymentHPWear.commandId;assert.equal(await observer.evaluate(id=>S('chatStore').getState().notifications.combat.filter(n=>n.id.endsWith(id)).length,id),1);result.checks.acceptedFeedbackOnce=true;
    result.transactionJourneyPassed=!result.findings.some(f=>f.id==='character-roundtrip');
    await od.getByRole('button',{name:'Close',exact:true}).click();
    await effectsIncrement(pages,host);
    await owner.evaluate(()=>{__socket.disconnect();S('gameStore').setState({isInMultiplayer:false,multiplayerRoom:null,multiplayerSocket:null});S('authStore').getState().setUser({uid:'app-isolation',displayName:'Isolation fixture',getIdToken:async()=> 'app-isolation'});});
    await owner.waitForFunction(()=>!S('characterStore').getState().characters.some(c=>c.id==='ilse'));
    await navigate(owner,'/account/characters');await owner.waitForFunction(()=>location.pathname==='/account/characters');
    assert.equal(await owner.getByText('Ilse HQ Disposable',{exact:true}).count(),0);result.checks.sameDeviceFixturePrincipalSwitchHidesPriorRoster=true;
    result.transactionJourneyPassed=!result.findings.some(f=>f.id==='character-roundtrip');
    result.integrationReady=result.findings.length===0;
    result.passed=result.integrationReady;
  }catch(e){result.failure=e.stack;throw e;}finally{
    result.assetManifestSha256=crypto.createHash('sha256').update(fs.readFileSync(path.join(process.env.APP_BUILD_DIR,'asset-manifest.json'))).digest('hex');
    for(const [role,p]of Object.entries(pages))save(`${role}-final.aria.yml`,await p.locator('body').ariaSnapshot().catch(()=>''));save('result.json',result);await browser.close();host.server.closeAllConnections();await Promise.race([host.stop(),new Promise(r=>setTimeout(r,3000))]);
  }
}
main().then(()=>process.exit(result.passed?0:1),e=>{console.error(e);process.exit(1);});
