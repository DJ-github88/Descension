/* Review consistency/arithmetic witnesses, NOT a production resource/combat executor. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {load,root}=require('./headq-source-tools.cjs');
const read=name=>JSON.parse(fs.readFileSync(path.join(__dirname,name),'utf8'));
const corpus=read('headq-seven-abilities.json').abilities,models=read('headq-seven-review-models.json').profiles,heritage=read('headq-heritage-reviewed.json').heritages;
const checks=[];const check=(name,fn)=>{fn();checks.push({name,status:'PASS'});};
const byId=id=>{const a=corpus.find(a=>a.spell.id===id);assert(a,`Missing ${id}`);return a;};
const spell=(c,key)=>byId(`cr1_${c.replaceAll('-','_')}_${key}`).spell;
check('Seven classes,42 unique full records,three signatures per class',()=>{
 assert.equal(corpus.length,42);assert.equal(new Set(corpus.map(a=>a.spell.id)).size,42);
 for(const id of Object.keys(models)){const list=corpus.filter(a=>a.spell.classId===id);assert.equal(list.length,6);assert.equal(list.filter(a=>a.spell.specialization).length,3);}
 for(const p of Object.values(models))assert(p.natives.every(row=>row.length===5));
 for(const file of ['gambler','fate-weaver','chaos-weaver','deathcaller','lichborne','hunter','transformation-class']){
  const active=fs.readFileSync(path.resolve(__dirname,'../classes',`${file}.md`),'utf8').split('<details>')[0];let width=null;
  for(const line of active.split('\n')){if(line.startsWith('|')){const count=line.split('|').length-2;if(width===null)width=count;assert.equal(count,width,`${file}: inconsistent table width`);}else width=null;}
 }
});
check('Proposed canonical envelope,explicit zero price/program fields and bounded signature access',()=>{
 const required=['id','classId','rulesetVersion','name','description','level','specialization','spellType','icon','typeConfig','resourceCost','targetingConfig','effectTypes','resolution','damageConfig','durationConfig','cooldownConfig','classResourceProgram','reactionTiming','savingThrow','conditions','area'];
 for(const a of corpus){const s=a.spell;assert.deepEqual(Object.keys(s).sort(),required.sort());assert.equal(s.rulesetVersion,'cr-review-r1');assert.equal(s.resolution,'RESOURCE_PROGRAM');assert.equal(s.classResourceProgram.version,1);assert(s.classResourceProgram.op&&Object.keys(s.classResourceProgram.args).length);assert(Number.isInteger(s.resourceCost.actionPoints)&&s.resourceCost.actionPoints>=0&&s.resourceCost.actionPoints<=4);assert.equal(s.resourceCost.mana,0);assert.equal(s.resourceCost.actionPoints,s.resourceCost.resourceValues.actionPoints);assert.equal(s.reactionTiming,null);assert.equal(s.savingThrow,null);assert(!s.resourceCost.classResource);assert(s.targetingConfig.maxTargets>=1);assert(s.durationConfig.durationType);assert(s.cooldownConfig.cooldownType);assert(a.verificationRequirements.positive&&a.verificationRequirements.refusal&&a.verificationRequirements.duplicate&&a.verificationRequirements.roundTrip);assert(a.runtimeDependencies.length>=4);if(s.specialization){assert.equal(s.level,3);assert.equal(a.talentNode.requiresTreePoints+1,11);assert(a.talentNode.requiresTreePoints+1<=3*5);}}
 for(const a of corpus){const d=a.spell.durationConfig;if(d.durationType==='own_turns'&&d.durationValue===1)assert.equal(d.durationUnit,'next_caster_turn_start');if(d.durationType==='own_turns'&&d.durationValue===2)assert.equal(d.durationUnit,'subsequent_caster_turn_end');}
});
check('Every documented three-turn AP equation is legal',()=>{
 for(const[id,p]of Object.entries(models)){assert.equal(p.turns.length,3);for(const row of p.turns){const [lhs,rhs]=row[2].split('=');const n=lhs.split('−').map(Number);assert.equal(n[0],4);const result=n.slice(1).reduce((sum,cost)=>sum-cost,n[0]);assert.equal(result,Number(rhs),`${id}: ${row[2]}`);assert(result>=0);}}
});
const traces={};
check('Gambler: actual20-card identity conservation,base stake cap and Card Sharp turn arithmetic',()=>{
 const all=['C','D','H','S'].flatMap(suit=>[1,2,3,4,5].map(rank=>`${rank}${suit}`));
 let hand=['1C','1D','3H','4H','5S'],discard=[],deck=['2S','3C','5D','2D','4C',...all.filter(c=>!hand.includes(c)&&!['2S','3C','5D','2D','4C'].includes(c))],fortune=3;
 const conserved=()=>assert.deepEqual([...hand,...discard,...deck].sort(),all.slice().sort());
 const draw=n=>{while(n--&&hand.length<5&&deck.length)hand.push(deck.shift());};
 const play=card=>{const i=hand.indexOf(card);assert(i>=0);hand.splice(i,1);discard.push(card);};
 const wager=spell('gambler','wager_strike').classResourceProgram.args;
 const settle=(stake,win)=>{assert(stake>=wager.stakeMin&&stake<=wager.stakeMax);assert(fortune>=stake);fortune-=stake;if(win)fortune=Math.min(wager.fortuneCap,fortune+wager.payoutMultiplier*stake);};
 conserved();play('5S');settle(2,true);assert.equal(fortune,5);assert.equal(hand.length,4);conserved();
 draw(2);play('1C');play('1D');play('4H');settle(1,false);assert.equal(fortune,4);assert.equal(hand.length,2);conserved();
 draw(2);play('5D');settle(2,true);play('3C');draw(2);assert.equal(fortune,6);assert.equal(hand.length,4);conserved();
 assert.equal(spell('gambler','marked_pair').resourceCost.actionPoints,1);assert.equal(spell('gambler','double_or_nothing').specialization,'high-roller');assert.equal(wager.stakeMax,2);
 traces.gambler={fortune,hand,discardCount:discard.length,deckCount:deck.length,finalEscrow:0,baseStakeMax:wager.stakeMax};
});
check('Fate Weaver:three-token reservation/recovery andassigned-damage conservation',()=>{
 let free=3,reserved=0,recovering=0;const invariant=()=>assert.equal(free+reserved+recovering,3);
 free--;reserved++;invariant();const transfer=spell('fate-weaver','tie_thread').classResourceProgram.args.transferMax;
 const portions=d=>[d-Math.min(transfer,d),Math.min(transfer,d)];assert.deepEqual(portions(8),[5,3]);assert.equal(portions(8).reduce((a,b)=>a+b,0),8);
 reserved--;recovering++;invariant();free+=recovering;recovering=0;free--;reserved++;invariant();
 // Two reanchors keep original one reservation,remaininguse andT4expiry unchanged.
 const expiresAt=4;assert.equal(spell('fate-weaver','reanchor_tapestry').classResourceProgram.args.extendExpiry,false);assert.equal(spell('fate-weaver','reanchor_tapestry').classResourceProgram.args.resetUses,false);assert.deepEqual(portions(6),[3,3]);reserved--;recovering++;invariant();
 assert.equal(free,2);assert.equal(recovering,1);
 const covenant=spell('fate-weaver','witnessed_covenant').classResourceProgram.args;assert.equal(covenant.threadReservation,2);assert.equal(covenant.uses,2);
 traces['fate-weaver']={free,reserved,recovering,assigned8:portions(8),assigned6:portions(6),reanchorDoesNotRefreshExpiry:expiresAt};
});
check('Chaos Weaver:six fixed tile zones anddeclared probability/exhaustion arithmetic',()=>{
 const zones=Object.fromEntries(['S1','S2','M1','M2','F1','F2'].map(id=>[id,'available']));
 const move=(ids,from,to)=>{for(const id of ids){assert.equal(zones[id],from);zones[id]=to;}assert.equal(Object.keys(zones).length,6);};
 move(['S1','S2','F1'],'available','spent');move(['S1','F1'],'spent','available');assert.equal(Object.values(zones).filter(z=>z==='available').length,5);
 move(['S2'],'spent','available');move(['S1','S2','F2'],'available','spent');assert.equal(Object.values(zones).filter(z=>z==='available').length,3);
 move(['S1','F2'],'spent','available');move(['M1','F1'],'available','spent');assert.equal(Object.values(zones).filter(z=>z==='available').length,3);
 const bias=spell('chaos-weaver','bias_draw').classResourceProgram.args;assert.equal(bias.requiresCounts.surge/bias.commitCount,2/3);assert.equal(bias.requiresCounts.fracture/bias.commitCount,1/3);
 assert.equal(spell('chaos-weaver','unsteady_ground').classResourceProgram.args.branches.fracture.until,'end-next-caster-own-turn');
 traces['chaos-weaver']={zones,biasSurgeProbability:2/3,biasFractureProbability:1/3};
});
check('Deathcaller:casterAP/orders/capacity,one actor action andno defeat/dismiss vitality refresh',()=>{
 const manifest=spell('deathcaller','manifest_retainer'),order=spell('deathcaller','grave_order'),coord=spell('deathcaller','coordinated_muster');
 let ap=4,orders=2,capacity=0,used=new Set();
 ap-=manifest.resourceCost.actionPoints*2;capacity+=2;for(const actor of ['A','B']){assert(!used.has(actor));used.add(actor);ap-=order.resourceCost.actionPoints;orders-=order.classResourceProgram.args.orders;}assert.equal(ap,0);assert.equal(orders,0);
 ap=4;orders=2;used.clear();ap-=coord.resourceCost.actionPoints;orders-=coord.classResourceProgram.args.orders;used.add('A');used.add('B');assert.equal(ap,2);assert.equal(orders,0);capacity--;const vitality={A:10,B:0,C:10};
 ap=4;orders=2;used.clear();ap-=manifest.resourceCost.actionPoints;capacity++;ap-=2*order.resourceCost.actionPoints;orders-=2;assert.equal(ap,1);assert.equal(capacity,2);assert.equal(orders,0);assert.equal(vitality.B,0);
 assert.equal(manifest.classResourceProgram.args.creationHP,'pattern-remaining-vitality');assert.equal(spell('deathcaller','bone_bastion').classResourceProgram.args.creationHP,'sum-two-patterns-remaining-vitality');
 traces.deathcaller={capacity,orders,ap,vitality,defeatedPatternRefilled:false};
});
check('Lichborne:finite integrity,one-step advancement,no refund/killgain;repair isnotan in-combat zeroAPcast',()=>{
 const stage=spell('lichborne','veil_unbound').classResourceProgram.args;let integrity=12,currentStage=0;
 integrity-=stage.advanceIntegrity;currentStage+=stage.advanceSteps;assert.equal(integrity,10);assert.equal(currentStage,1);
 integrity-=stage.advanceIntegrity;currentStage+=stage.advanceSteps;assert.equal(integrity,8);assert.equal(currentStage,2);
 currentStage=0;assert.equal(stage.veilRefund,0);assert.equal(integrity,8);assert.equal(spell('lichborne','cold_touch').classResourceProgram.args.minimumStage,0);
 assert.equal(spell('lichborne','repair_vessel').resourceCost.actionPoints,0);assert.equal(spell('lichborne','repair_vessel').classResourceProgram.args.requiresCompletedLongRest,true);
 assert.equal(spell('lichborne','winter_edict').classResourceProgram.args.forbiddenWhileMortal,true);
 traces.lichborne={integrity,currentStage,returnWouldConsume:6,afterHypotheticalReturn:integrity-6,immediateRevive:false};
});
check('Hunter:solo tag acquisition/spend andshared one-tagcap even after expenditure',()=>{
 const mark=spell('hunter','mark_quarry').classResourceProgram.args,angle=spell('hunter','take_angle').classResourceProgram.args,press=spell('hunter','press_quarry').classResourceProgram.args,ambush=spell('hunter','patient_ambush').classResourceProgram.args;
 assert.equal(mark.generatedTagsMaxPerOwnTurn,1);assert.equal(angle.generatedTagsMaxPerOwnTurn,1);assert.equal(press.generatedTagsMaxPerOwnTurn,1);assert.equal(ambush.requiresCompanion,false);
 const tags=new Set();let generated=0;const gain=tag=>{if(generated<1&&!tags.has(tag)){tags.add(tag);generated++;}};
 gain('read');gain('pressure');assert.deepEqual([...tags],['read']);
 generated=0;gain('angle');for(const tag of ambush.consumeTags){assert(tags.has(tag));tags.delete(tag);}gain('pressure');assert.equal(tags.size,0);
 generated=0;gain('pressure');gain('angle');assert.deepEqual([...tags],['pressure']);
 traces.hunter={tags:[...tags],companionRequired:false,finalGenerated:generated};
});
check('Druid:proposed slot replacement,paid suspension/recovery andbrace replacesnotstacks',()=>{
 const adopt=spell('metamorph','adopt_loadout').classResourceProgram.args,recover=spell('metamorph','recover_self').classResourceProgram.args,brace=spell('metamorph','living_brace').classResourceProgram.args;
 let strain=0,slots=[];strain+=adopt.transitionGain;slots=['locomotion','offense'];assert.equal(slots.length,2);strain+=adopt.transitionGain;slots=['defense','senses'];assert(!slots.includes('offense'));assert.equal(strain,2);
 const assigned=8,prevented=Math.min(brace.prevention,assigned);assert.equal(prevented,4);assert.equal(assigned-prevented,4);assert.equal(brace.stacking,'replace-not-add');assert.equal(brace.requiresPlateBudgetUnused,true);
 strain-=recover.reduceTransitions;const suspended='senses';assert.equal(strain,1);assert(slots.includes(suspended));assert(slots.includes('defense'));
 traces.metamorph={strain,slots,suspended,bracePrevention:prevented,damageApplied:assigned-prevented};
});
check('All25 cultures/102 actual nativepairs reviewed,positive access andpaired source evidence present',()=>{
 assert.equal(heritage.length,25);assert.equal(new Set(heritage.map(h=>h.heritageId)).size,25);assert.equal(heritage.reduce((n,h)=>n+h.pairings.length,0),102);
 for(const h of heritage){assert(h.culture.summary&&h.bodyInterfaces.length&&h.restorationRecommendation.summary);for(const p of h.pairings){assert.equal(p.effectiveNativeAccess.status,'normal-tradition');assert(p.rawVariantPresent&&p.advantage&&p.pairedCost&&p.sources.length);assert.equal(p.executionLevel,'advisory');}}
 assert.equal(Object.values(models).reduce((n,p)=>n+p.natives.length,0),19);
});
check('No representative ID overwrites current or recovered historical content;every legacy ID retained',()=>{
 const originals=read('authored-spells.json'),historical=read('historical-definitions.json');const oldIds=new Set(originals.map(s=>s.id));for(const c of Object.values(historical.classes))for(const s of [...(c.spells||[]),...(c.exampleSpells||[])])oldIds.add(s.id);
 for(const a of corpus)assert(!oldIds.has(a.spell.id));
 for(const c of read('headq-priority-compatibility.json').candidates)for(const p of c.parents)assert.equal(p.allLegacySpellIds.length,originals.filter(s=>s.className===p.className).length);
});
check('Original v0 dossiers preserved byte-for-byte inside archive',()=>{
 const archived=read('checkpoint1-priority-dossiers.json');for(const d of Object.values(archived.documents))assert.equal(crypto.createHash('sha256').update(d.text).digest('hex'),d.sha256);
});
check('Mounted production-source Wizard issue observations match actualrepros andpositive control',()=>{
 const selected=read('headq-wizard-selected-zero.json'),unselected=read('headq-wizard-unselected-and-export.json'),passive=read('headq-wizard-passive-zero.json'),positive=read('headq-wizard-positive-control.json'),edited=read('headq-wizard-edit-zero.json');
 assert.equal(selected.state.actionPoints,1);assert.equal(selected.state.resourceValues.actionPoints,0);assert.equal(unselected.state.actionPoints,1);assert(unselected.freeSpellVisible);assert.equal(passive.ap,1);assert.equal(positive.ap,2);assert.equal(edited.state.actionPoints,1);assert.equal(edited.firstInput,'0');assert.equal(selected.storageLength,0);
 assert(!Object.hasOwn(unselected.serialized,'resourceCost'));assert(!Object.hasOwn(unselected.template,'resourceCost'));assert(!Object.hasOwn(unselected.generated,'resourceCost'));assert.equal(unselected.originalCostAfterCalls.actionPoints,0);
});
check('Fresh current production P9 admission still refuses allnewR1originals',()=>{
 const {supportSpell}=load('services/spellConsequence.js');for(const a of corpus){const result=supportSpell(a.spell,{class:a.spell.classId,stats:{strength:10,agility:10,constitution:10,intelligence:10,spirit:10},classResource:{}});assert.equal(result.supported,false);}
});
const baseline=read('headq-source-baseline.json');const hashUnion={...baseline.sourceHashes,...read('headq-heritage-reviewed.json').sourceHashes,...read('headq-wizard-witness-inputs.json').sourceHashes};const drift=Object.entries(hashUnion).filter(([file,hash])=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')!==hash).map(([file])=>file);
check('No drift in newreview baseline source/evidenceinputs',()=>assert.deepEqual(drift,[]));
const report={checkedAt:new Date().toISOString(),schema:'HeadQ-review-consistency/r1',checks,traces,sourceDrift:drift,reviewScope:'Seven-candidate design coherence and42structured records; notproduction executor/schema/browser integration acceptance',masterAssignmentComplete:false};
const cp=require('node:child_process');
const status=cp.execFileSync('git',['status','--porcelain=v1'],{cwd:root,encoding:'utf8'}).trim();
const outside=text=>text.split('\n').filter(line=>line&&!line.includes('docs/plans/mythrill-class-reconstruction')).sort();
const beforeStatus=outside(baseline.status),afterStatus=outside(status);
report.outsidePlanningStatusDelta={added:afterStatus.filter(line=>!beforeStatus.includes(line)),removed:beforeStatus.filter(line=>!afterStatus.includes(line))};
report.currentBranch=cp.execFileSync('git',['branch','--show-current'],{cwd:root,encoding:'utf8'}).trim();
report.currentHead=cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
fs.writeFileSync(path.join(__dirname,'headq-review-validation.json'),JSON.stringify(report,null,2)+'\n');
const packetFiles=[
 '00_README_AND_MASTER_INDEX.md','22_CREATOR_DECISION_REGISTER.md','26_COMPLETION_AND_CONTINUATION.md',
 '27_HEADQ_SOURCE_RECONCILIATION.md','28_HERITAGE_REVIEW_AND_PRIORITY_ORIGINS.md','29_PRIORITY_REVIEW_RULES_AND_SERIALIZATION.md','30_CLASS_HEADQ_DECISION_PACKET.md','31_CREATOR_NAMING_DECISION_DRUID.md',
 ...['gambler','fate-weaver','chaos-weaver','deathcaller','lichborne','hunter','transformation-class'].map(n=>`classes/${n}.md`),
 ...Object.keys(models).map(n=>`classes/manifests/${n}-review-r1.json`),
 'implementation/CR-W1-WIZARD-CORRECTIONS.md','implementation/CR-A1-AUTHORED-SPELL-ADMISSION.md','implementation/CR-L1-AUTHORITATIVE-LIFECYCLES.md',
 'evidence/headq-seven-abilities.json','evidence/headq-seven-review-models.json','evidence/headq-priority-compatibility.json','evidence/headq-heritage-reviewed.json','evidence/checkpoint1-priority-dossiers.json','evidence/headq-concurrent-followup.json'
];
fs.writeFileSync(path.join(__dirname,'headq-packet-manifest.json'),JSON.stringify({capturedAt:new Date().toISOString(),status:'prepared-for-HeadQ-review; not-approved-or-implemented',files:Object.fromEntries(packetFiles.map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,'..',file))).digest('hex')]))},null,2)+'\n');
console.log(JSON.stringify({passed:checks.length,records:corpus.length,cultures:heritage.length,nativePairings:19,sourceDrift:drift,masterAssignmentComplete:false},null,2));
