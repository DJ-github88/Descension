// Read-only source review probes. No application module is rewritten.
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto');
const root = path.resolve(__dirname, '../../../../../..');
const base = root + '/vtt-react/node_modules/';
const babel = require(base + '@babel/core'), cache = {};
function load(file) {
  file = path.resolve(file);
  if (!path.extname(file)) file += '.js';
  if (cache[file]) return cache[file].exports;
  const m = { exports: {} }; cache[file] = m;
  const code = babel.transformSync(fs.readFileSync(file, 'utf8'), { babelrc:false, configFile:false, presets:[require(base+'@babel/preset-react')], plugins:[require(base+'@babel/plugin-transform-modules-commonjs')] }).code;
  vm.runInThisContext('(function(require,module,exports){'+code+'\n})', {filename:file})(p => p.startsWith('.') ? load(path.resolve(path.dirname(file), p)) : require(base+p), m, m.exports);
  return m.exports;
}
const src = root + '/vtt-react/src/';
const integration = load(src+'data/classes/chaosWeaverIntegration.js');
const trees = load(src+'data/talentTreeData.js').TALENT_TREES['Chaos Weaver'];
const convert = load(src+'data/talentTrees/talentSystem.mjs').convertTalentSpellToLibrarySpell;
const registry = load(src+'data/classHeritageRegistry.js');
const out = {manifest: integration.CHAOS_WEAVER_INTEGRATION_MANIFEST};
out.grants = Object.values(trees).flat().filter(n=>n.grantId).map(n=>{
  const authored = integration.CHAOS_WEAVER_PROJECTED_SPELLS_BY_ID[n.grantId];
  const legacy = convert(n,1);
  const applied = n.spell || legacy;
  return {node:n.id,grantId:n.grantId, authoredType:authored.spellType, materializedType:applied.spellType,
    authoredAP:authored.resourceCost.actionPoints,materializedAP:applied.actionPoints ?? applied.resourceCost?.actionPoints,
    materializedId:applied.id,manualOnly:applied.manualOnly ?? null,
    typedRecord:applied.specialMechanics?.chaosWeaver ?? null,
    legacyConverterId:legacy.id,legacyConverterType:legacy.spellType,
    legacyConverterAP:legacy.resourceCost.actionPoints};
});
out.nativeIds = registry.getClassNativeHeritageIds('Chaos Weaver');
const blueprint=fs.readFileSync(root+'/LORE_CANON_AND_HERITAGE_BLUEPRINT.md','utf8');
const inverse=blueprint.split('## 7. Complete ancestry-to-native-class map')[1].split('## 8.')[0];
out.nativeDeltaFromBlueprint=inverse.split('\n').filter(line=>/^\|.*`[^`]+`/.test(line)).flatMap(line=>{
  const cells=line.split('|').slice(1,-1).map(x=>x.trim()),id=cells[1].replace(/`/g,'');
  const old=cells[2].split(', ').map(n=>n.replace(/\s*\([^)]*\)/g,'')),now=registry.HERITAGE_TRADITIONS[id].classes;
  return [...now.filter(n=>!old.includes(n)).map(name=>({heritage:id,class:name,change:'added'})),...old.filter(n=>!now.includes(n)).map(name=>({heritage:id,class:name,change:'removed'}))];
});
out.nativeAccess = registry.getClassHeritageAccess('Chaos Weaver','fexrick','drall_fexric');
out.brokenNativeAccess = registry.getClassHeritageAccess('Chaos Weaver','fexrick','drall_fexric',{bodyStates:['broken_stabilizer']});
out.outsiderAccess = registry.getClassHeritageAccess('Chaos Weaver','human','skald_human');
out.qualifiedAccess = registry.getClassHeritageAccess('Chaos Weaver','human','skald_human',{qualification:{verified:true,source:'independent fixture',fulfilledRequirements:['anomaly_encounter','containment_training','stabilizing_interface']}});
const r=load(src+'data/classes/chaosWeaverRules.js');
const step=(s,fn,args)=>{const v=r[fn](s,args);if(!v.ok)throw Error(fn+': '+v.errors);return v.session;};
const fresh=()=>step(r.createRehearsalSession({label:'independent RI-1'}),'setWorksheetCounters',{apAvailable:20,remainingMovementFeet:30});
let s=step(fresh(),'commitSpell',{spellId:'cw1_01',primaryTileIds:['F1']});
out.deterministicPending=s.pending;
out.noFakeFace=r.recordFace(s,{faceValue:1}).ok;
const Display=load(src+'components/hud/ChaosWeaverResourceDisplay.jsx').default;
try { Display({tiles:s.tiles,pending:s.pending,anomaly:null}); out.deterministicDisplay='rendered'; }
catch(e) { out.deterministicDisplay={threw:e.message}; }
s=step(s,'settlePending',{confirmations:r.pendingSettlementPreview(s).labels});
out.deterministicSettlement={penalties:s.penalties,settlements:s.settlements};
s=step(fresh(),'commitSpell',{spellId:'cr1_chaos_weaver_second_possibility',primaryTileIds:['S1','F1'],continuationTileId:'M1'});
s=step(s,'recordFace',{faceValue:6});
out.unconfirmedDeclineAccepted=r.resolveContinuation(s,{choice:'decline',confirmations:{}}).ok;
s=step(s,'resolveContinuation',{choice:'decline',confirmations:r.pendingSettlementPreview(s).labels});
out.confirmedDecline={tiles:s.tiles,penalties:s.penalties,roundTrip:r.importPacket(r.exportPacketText({rehearsal:s})).ok};
const cast=(state,id,ids,face,continuation=null,choice='accept')=>{
  state=step(state,'commitSpell',{spellId:id,primaryTileIds:ids,continuationTileId:continuation});
  if(state.pending){
    if(state.pending.mapping.dice)state=step(state,'recordFace',{faceValue:face});
    const confirmations=r.pendingSettlementPreview(state).labels;
    state=step(state,continuation?'resolveContinuation':'settlePending',continuation?{choice,confirmations:[...confirmations,...(choice==='accept'?['continuation']:[])]}:{confirmations});
  }
  return state;
};
const fold=(state,ids)=>step(state,'commitSpell',{spellId:'cr1_chaos_weaver_fold_odds',primaryTileIds:ids});
const turn=state=>step(state,'startOwnTurn',{apAvailable:4});
const summary=state=>({ap:state.turn.apAvailable,tiles:state.tiles,pending:state.pending,penalties:state.penalties,selections:state.settlements.map(x=>x.selectedTileId),roundTrip:r.importPacket(r.exportPacketText({rehearsal:state})).ok});
let p=step(fresh(),'setWorksheetCounters',{apAvailable:4});
p=cast(p,'cr1_chaos_weaver_bias_draw',['S1','S2','F1'],5);p=fold(p,['S1','F1']);p=turn(p);p=fold(p,['S2']);p=cast(p,'cr1_chaos_weaver_bias_draw',['S1','S2','F2'],1);p=turn(p);p=fold(p,['S1','F2']);p=cast(p,'cr1_chaos_weaver_split_possibility',['M1','F1'],1);
out.probabilityWitness=summary(p);
out.anomalyWitnesses=[1,6].map(face=>{
  let a=step(fresh(),'setWorksheetCounters',{apAvailable:4});
  a=cast(a,'cr1_chaos_weaver_unsteady_ground',['M1','F1']);a=cast(a,'cr1_chaos_weaver_split_possibility',['S1','F2'],1);
  a=step(a,'resolveAnomaly',{reason:'trigger'});a=step(a,'recordFace',{faceValue:face});a=step(a,'settlePending',{confirmations:r.pendingSettlementPreview(a).labels});
  a=turn(a);a=fold(a,['M1','F1']);a=cast(a,'cr1_chaos_weaver_unsteady_ground',['M1','F1']);
  // Table elects to avoid the visible trigger on turn 2: no synthetic event.
  a=turn(a);a=step(a,'commitSpell',{spellId:'cw1_dismiss_anomaly'});a=step(a,'resolveAnomaly',{reason:'dismissal'});a=fold(a,['M1','F1']);
  return {face,avoidance:'manual no-trigger decision, not geometry execution',...summary(a)};
});
let c=step(fresh(),'setWorksheetCounters',{apAvailable:4});
c=cast(c,'cr1_chaos_weaver_second_possibility',['S1','F1'],1,'M1');c=turn(c);c=fold(c,['S1','F1']);c=cast(c,'cr1_chaos_weaver_second_possibility',['S1','F1'],6,'M2','decline');c=turn(c);c=fold(c,['S1','F1']);c=step(c,'commitSpell',{spellId:'cr1_chaos_weaver_second_possibility',primaryTileIds:['S1','F1'],continuationTileId:'M2'});c=step(c,'recordFace',{faceValue:1});
out.cascadeWitness=summary(c);
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(root+'/'+f)).digest('hex');
const entry=JSON.parse(fs.readFileSync(__dirname+'/entry-hashes.json','utf8').replace(/^\uFEFF/,''));
out.entryManifestGroups=Object.keys(entry);
out.entryDrift=Object.entries(entry).filter(([,v])=>Array.isArray(v)).flatMap(([group,rows])=>rows.filter(x=>x.path&&x.sha256&&fs.existsSync(root+'/'+x.path)).map(x=>({group,path:x.path,entry:x.sha256,now:sha(x.path)}))).filter(x=>x.entry!==x.now);
const phase=JSON.parse(fs.readFileSync(__dirname+'/after-phase2-hashes.json','utf8').replace(/^\uFEFF/,''));
out.phase2Drift=Object.entries(phase).filter(([p,h])=>sha(p)!==h).map(([p,h])=>({path:p,phase2:h,now:sha(p)}));
if(fs.existsSync(__dirname+'/independent-retained-probes.json')) {
  const actual=JSON.parse(fs.readFileSync(__dirname+'/independent-retained-probes.json','utf8'));
  const prior=JSON.parse(fs.readFileSync(__dirname+'/probe-summary-phase2.json','utf8').replace(/^\uFEFF/,''));
  out.retainedProbeDrift=actual.checks.filter(x=>JSON.stringify(x)!==JSON.stringify(prior.checks.find(y=>y.name===x.name))).map(x=>x.name);
  out.retainedProbeExceptions=actual.checks.filter(x=>x.threw).map(x=>({name:x.name,threw:x.threw}));
}
out.semanticChecks=[
  {name:'all paid active grants retain authored active type/price/typed record (canonical id is applied by syncTalentSpell)',pass:out.grants.every(g=>g.materializedId===g.grantId&&g.materializedType===g.authoredType&&g.materializedAP===g.authoredAP&&g.typedRecord)},
  {name:'valid deterministic pending renders without inventing a physical face',pass:out.deterministicDisplay==='rendered'},
  {name:'unconfirmed decline refuses and confirmed decline retains downside',pass:!out.unconfirmedDeclineAccepted&&out.confirmedDecline.penalties.length>0&&out.confirmedDecline.roundTrip},
  {name:'only approved Alchemite native assignment activated',pass:JSON.stringify(out.nativeDeltaFromBlueprint)===JSON.stringify([{heritage:'drall_fexric',class:'Chaos Weaver',change:'added'}])}
];
console.log(JSON.stringify(out,null,2));
process.exitCode=out.semanticChecks.every(x=>x.pass)?0:1;
