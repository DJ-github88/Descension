// Merged M1/UI integration witness: fixture identity/actors + external HUD drag payload only.
// Actual shipped class profile is never mutated or marked confirmed. One persistent profile per role.
// Interactions use normal Playwright clicks, keys and taps; no forced clicks or React handler dispatch.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.USABILITY_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External USABILITY_OUTPUT and exact APP_BUILD_DIR required');
fs.mkdirSync(out, {recursive:true}); process.env.APP_OUTPUT = path.join(out,'fixture');
const { setup } = require('../p9/integration/app-browser.cjs');
const save = (n,v) => fs.writeFileSync(path.join(out,n),typeof v==='string'?v:JSON.stringify(v,null,2));
const report = { passed:false, build:process.env.APP_BUILD_DIR, checks:[], storage:[], pageErrors:[], limits:[
  'Optimized App and registered backend. Provider identity, canonical ownership, lease/cloud are existing fixtures.',
  'External HUD drop payload is fixture setup. UI uses unforced pointer, keyboard and emulated touch, not physical tablet.',
  'Same-runtime transport reconnect; no server restart or deployed/live-cloud proof.'
]};
const dialog = p => p.getByRole('dialog',{name:'Supported spell cast',exact:true});
async function measure(pages,phase) {
 const row={phase};
 for(const [role,p] of Object.entries(pages))row[role]=await p.evaluate(()=>{const plan=window.mythrillStorageRecovery?.plan?.();return {keys:localStorage.length,chars:Object.keys(localStorage).reduce((n,k)=>n+k.length+localStorage.getItem(k).length,0),families:plan?.families?.map(f=>({familyId:f.familyId,identicalCopiesToRemove:f.identicalCopiesToRemove}))};});
 report.storage.push(row);
}
async function registerRejoin(p) {
  await p.evaluate(()=>{
    const pair=Object.entries(__req.m).find(([,f])=>f.toString().includes('[roomRejoin] subscriber failed'));
    const register=Object.values(__req(pair[0])).find(f=>typeof f==='function'&&f.toString().includes('room_joined'));
    if(!register)throw Error('Missing production rejoin registration'); register(__socket);
  });
}
async function interrupt(p) { await p.evaluate(()=>__socket.disconnect()); }
async function rejoin(p,uid) {
  await p.evaluate(async uid=>{
    __socket.connect();await new Promise((r,j)=>{__socket.once('connect',r);__socket.once('connect_error',j)});
    const f=await fetch('/integration-fixture.json').then(r=>r.json());
    const joined=new Promise(r=>__socket.once('room_joined',r));
    __socket.emit('join_room',{roomId:f.roomId,playerName:uid,password:''});await joined;
  },uid);
}
async function main() {
 const host=await require('../p9/integration/app-server.cjs').start();
  const context=await chromium.launchPersistentContext(path.join(out,'private/gm-profile'),{channel:'chrome',headless:true,viewport:{width:1440,height:1000},hasTouch:true});
  let ownerContext;
 let gm,owner;
 const protectedState=()=>JSON.stringify({maps:host.room.gameState.maps,ledger:host.room.gameState.actorConsequences});
 const resourceState=()=>JSON.stringify(Object.values(host.room.gameState.maps).flatMap(m=>[
   ...Object.values(m.tokens||{}).map(t=>({id:t.id,hp:t.state.currentHp,mana:t.state.currentMana,ap:t.state.currentActionPoints,tempHp:t.state.tempHealth,tempMana:t.state.tempMana,tempAP:t.state.tempActionPoints,conditions:t.state.conditions})),
   ...Object.values(m.characterTokens||{}).map(t=>({id:t.id,hp:t.character.health,mana:t.character.mana,ap:t.character.actionPoints,tempHp:t.character.tempHealth,tempMana:t.character.tempMana,tempAP:t.character.tempActionPoints,conditions:t.state.conditions}))]));
 try {
   gm=await context.newPage();gm.on('pageerror',e=>report.pageErrors.push({role:'gm',message:e.message}));await setup(gm,host.url,'app-gm');await registerRejoin(gm);
   await measure({gm},'gm setup');
  await gm.getByRole('button',{name:/^Adventure(?: \(\d+\))?$/}).click();
  await gm.getByRole('button',{name:'Combat Initiator X',exact:true}).click();
  await gm.locator('.creature-token').first().click();await gm.locator('.creature-token').nth(1).click();
  await gm.getByRole('button',{name:'Begin Combat (2)',exact:true}).click();
  await gm.locator('.creature-token').first().click({button:'right'});
  await gm.getByRole('button',{name:/Token Actions/}).hover();
  await gm.getByRole('button',{name:' Inspect',exact:true}).click();
  const inspect=gm.getByRole('dialog',{name:'Branvig',exact:true});await inspect.waitFor();
  for(const width of [1440,1024]) {
    await gm.setViewportSize({width,height:width===1440?1000:768});
    const abilities=inspect.getByRole('button',{name:'Abilities & Spells',exact:true});
    if(width===1024)await abilities.tap();else await abilities.click();
    await inspect.getByRole('button',{name:'Tactics & Behavior',exact:true}).click();
    await abilities.focus();await abilities.press('Enter');
    const ability=inspect.getByRole('tablist',{name:'Creature abilities',exact:true}).getByRole('tab').first();
    await ability.click();await ability.focus();await ability.press('Enter');
    const tracker=gm.getByRole('region',{name:'Combat tracker',exact:true});
    const bounds=await tracker.boundingBox();assert.ok(bounds.x>=0&&bounds.y>=0&&bounds.x+bounds.width<=width+1);
    save(`inspect-${width}.aria.yml`,await inspect.ariaSnapshot());save(`tracker-${width}.json`,bounds);
    report.checks.push(`Tracker and Inspect ordinary tabs/keyboard${width===1024?'/tap':''} at ${width}px`);
  }
  // Escape belongs to the focused adjudication column; Inspect stays open.
  const attack=gm.getByRole('textbox',{name:'Attack name',exact:true});await attack.fill('Retained UI draft');
  const baseline=protectedState();await attack.press('Escape');
  const show=gm.getByRole('button',{name:'Show combat adjudication',exact:true});
  assert.equal(await show.evaluate(e=>e===document.activeElement),true);assert.equal(await inspect.count(),1);
  await show.press('Enter');assert.equal(await attack.inputValue(),'Retained UI draft');assert.equal(protectedState(),baseline);
  await inspect.getByRole('button',{name:'Close',exact:true}).click();
  const collapse=gm.getByRole('button',{name:'Collapse combat tracker',exact:true});await collapse.focus();await collapse.press('Escape');
  await gm.getByRole('button',{name:'Expand combat tracker',exact:true}).press('Enter');assert.equal(protectedState(),baseline);
  report.checks.push('Tracker/adjudication Escape, focus return, hide/reopen retain draft and resources');
  // End this two-creature turn-order fixture through its ordinary control before the
  // separate PC approval scenario; the PC was deliberately not a combatant above.
  await gm.getByRole('button',{name:'End Combat',exact:true}).click();
   ownerContext=await chromium.launchPersistentContext(path.join(out,'private/owner-profile'),{channel:'chrome',headless:true,viewport:{width:1024,height:768},hasTouch:true});
   owner=await ownerContext.newPage();owner.on('pageerror',e=>report.pageErrors.push({role:'owner',message:e.message}));await setup(owner,host.url,'app-owner');await registerRejoin(owner);await owner.waitForTimeout(1500);
  await owner.evaluate(async()=>{
    // Existing p14 witness boundary: asynchronous demo-roster bootstrap may replace
    // the test principal's selected sheet. Re-establish the exact declared fixture.
    S('characterStore').setState({id:'ilse',currentCharacterId:'ilse',name:'Ilse',class:'Arcanoneer',level:3});
    const f=await fetch('/integration-fixture.json').then(r=>r.json());
    const selected=__actors.selectOwnerAttachment(f.refs.pc);if(!selected.success)throw Error(JSON.stringify(selected));
  });
   await measure({gm,owner},'UI and owner setup');
   const slot=owner.locator('.action-bar-assembly .action-slot').first();
  await slot.evaluate(el=>{const d=new DataTransfer();d.setData('application/json',JSON.stringify({id:'arc_spark_bolt',name:'Marrow-Piercing Slug',spellType:'ACTION'}));const e=new Event('drop',{bubbles:true,cancelable:true});Object.defineProperty(e,'dataTransfer',{value:d});el.dispatchEvent(e)});
  await slot.getByAltText('Marrow-Piercing Slug',{exact:true}).waitFor();
  await slot.focus();await slot.press('Enter');await dialog(owner).waitFor();
  assert.equal(await dialog(owner).getByRole('button',{name:'Close',exact:true}).evaluate(e=>e===document.activeElement),true);
  await owner.keyboard.press('Shift+Tab');assert.equal(await dialog(owner).evaluate(e=>e.contains(document.activeElement)),true);
  await owner.keyboard.press('Tab');assert.equal(await dialog(owner).getByRole('button',{name:'Close',exact:true}).evaluate(e=>e===document.activeElement),true);
  await dialog(owner).getByRole('combobox',{name:'Target',exact:true}).selectOption('creature:app-hall:B');
  await dialog(owner).getByLabel('d8 face 1',{exact:true}).fill('6');await dialog(owner).getByRole('button',{name:'Record physical roll',exact:true}).click();
  const before=protectedState(),resourcesBefore=resourceState();save('owner-prepared.aria.yml',await dialog(owner).ariaSnapshot());
  await dialog(owner).getByRole('button',{name:'Close',exact:true}).press('Escape');await dialog(owner).waitFor({state:'detached'});
  assert.equal(await slot.evaluate(e=>e===document.activeElement),true);await slot.press('Enter');
  assert.match(await dialog(owner).locator('.p9-roll-result').innerText(),/Recorded physical roll: \[6\]/);assert.equal(protectedState(),before);
  await dialog(owner).getByRole('button',{name:'Approve price and send to GM',exact:true}).click();
  const card=gm.locator('.p9-gm-card').filter({hasText:'Marrow-Piercing Slug'});await card.waitFor();
  await gm.getByRole('combobox',{name:'Exact room attachment',exact:true}).selectOption('character:pc');
  // P9's existing owner approval first publishes an absent class-resource room home.
  // That revisioned sync is not a spell payment. Do not mislabel it as zero commands.
  assert.equal(resourceState(),resourcesBefore,'approval never spends HP/mana/AP');
   const pendingState=protectedState();await measure({gm,owner},'pending approval');
  await card.getByRole('checkbox').check();await card.getByLabel('Final damage',{exact:true}).fill('6');
  await card.getByLabel(/^Reason/).fill('GM mitigation for the bounded UI witness');
  await card.getByLabel('Final damage',{exact:true}).press('Escape');await gm.getByRole('button',{name:'Show combat adjudication',exact:true}).press('Enter');
  assert.equal(await card.getByLabel('Final damage',{exact:true}).inputValue(),'6');
  await dialog(owner).getByRole('button',{name:'Close',exact:true}).tap();await slot.press('Enter');
  assert.equal(protectedState(),pendingState);save('pending-before-rejoin.aria.yml',await dialog(owner).ariaSnapshot());
  const submissions=async p=>p.evaluate(()=>__outbound.filter(e=>['actor_spell_approve','actor_consequence','reaction_window_open','reaction_window_change'].includes(e.event)));
  const sent=[await submissions(gm),await submissions(owner)];
  await interrupt(gm);await interrupt(owner);
  await gm.getByText(/^Collection disconnected\/unavailable/).waitFor();save('disconnected.aria.yml',await gm.locator('body').ariaSnapshot());
  await rejoin(gm,'app-gm');await rejoin(owner,'app-owner');
  await gm.getByText(/^Collection disconnected\/unavailable/).waitFor({state:'detached'});
  await gm.getByText(/^Disconnected — collection/).waitFor({state:'detached'});
  assert.deepEqual([await submissions(gm),await submissions(owner)],sent,'rejoin does not resubmit commands');assert.equal(protectedState(),pendingState);
  assert.equal(await dialog(owner).count(),1);await card.waitFor();
  save('pending-after-rejoin.aria.yml',await dialog(owner).ariaSnapshot());
  report.checks.push('Owner keyboard open, modal focus/Escape/return, retained6 roll and pending approval survive close/reopen');
  report.checks.push('Real transport interruption shows notice; production-listener rejoin clears disconnected status without resubmission/spend');
  for(const width of [1440,1024]) {
    await gm.setViewportSize({width,height:width===1440?1000:768});
    await card.getByRole('button',{name:'Accept one consequence',exact:true}).scrollIntoViewIfNeeded();
    save(`gm-confirmation-${width}.aria.yml`,await card.ariaSnapshot());
    const hit=await card.getByRole('button',{name:'Accept one consequence',exact:true}).evaluate(e=>{const r=e.getBoundingClientRect(),t=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {reachable:t===e||e.contains(t),rect:r.toJSON()}});
    assert.ok(hit.reachable);save(`gm-confirmation-${width}.json`,hit);
  }
  await card.getByRole('button',{name:'Accept one consequence',exact:true}).click();
  await dialog(owner).getByText(/Accepted ·/).first().waitFor();save('accepted.aria.yml',await dialog(owner).ariaSnapshot());
   report.checks.push('Ordinary GM confirmation after reconnect at tablet width; accepted owner result');
   await measure({gm,owner},'accepted ordinary supported cast');
   await dialog(owner).getByRole('button',{name:'Close',exact:true}).click();
   const clasp=owner.locator('.action-bar-assembly .action-slot').nth(1);
   await clasp.evaluate(el=>{const d=new DataTransfer();d.setData('application/json',JSON.stringify({id:'arc_frost_touch',name:'Rime-Iron Clasp',icon:'Frost/Frost Touch',spellType:'ACTION'}));const e=new Event('drop',{bubbles:true,cancelable:true});Object.defineProperty(e,'dataTransfer',{value:d});el.dispatchEvent(e)});
   await clasp.getByAltText('Rime-Iron Clasp',{exact:true}).waitFor();
   const availability=await owner.evaluate(()=>{
    const pair=Object.entries(__req.m).find(([,f])=>f.toString().includes('class-effect-1')&&f.toString().includes('ff1b91e10d21655d5dcbf16660b66a81330c8d1fc3f8570d9b62856b1d7e1649'));
    const data=__req(pair[0]);return {classHq:(data.profiles||data.default?.profiles)[0].review.classHq};
   });
   assert.equal(availability.classHq,null,'actual compiled profile stays unconfirmed');
   const beforeClasp=protectedState(),beforeSent=await submissions(owner);
   await clasp.focus();await clasp.press('Enter');
   await owner.getByText(/Class HQ has not confirmed this profile yet/).first().waitFor();
   assert.equal(await dialog(owner).count(),0,'no automated M1 cast dialog');
   assert.equal(protectedState(),beforeClasp,'disabled HUD cast spends/applies nothing');
   assert.deepEqual(await submissions(owner),beforeSent,'disabled cast submits no approval/consequence');
   save('clasp-availability.aria.yml',await owner.locator('body').ariaSnapshot());
   report.availability={...availability,enabled:false,confirmationInjected:false};
   report.checks.push('Real unconfirmed shipped/compiled Clasp: normal keyboard HUD activation shows Class HQ manual-only diagnostic; no supported cast, approval, payment or consequence');
   await measure({gm,owner},'disabled Clasp ordinary HUD activation');
   assert.deepEqual(report.pageErrors,[]);
  report.passed=true;
 } catch(e) {report.failure=e.stack;for(const [n,p] of [['gm',gm],['owner',owner]])if(p)save(`failure-${n}.aria.yml`,await p.locator('body').ariaSnapshot());throw e;}
  finally {save('result.json',report);await ownerContext?.close();await context.close();report.fixtureTeardown=await Promise.race([host.stop().then(()=>'closed'),new Promise(r=>setTimeout(()=>r('fixture teardown timeout; process exits'),3000))]);save('result.json',report);}
}
main().then(()=>process.exit(0),e=>{console.error(e);process.exit(1)});
