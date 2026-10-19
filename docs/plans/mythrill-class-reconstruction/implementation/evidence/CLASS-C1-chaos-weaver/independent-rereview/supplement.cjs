// Independent supplementary observations. Original retained probe source is untouched.
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto');
const root = path.resolve(__dirname, '../../../../../../..');
const base = root + '/vtt-react/node_modules/';
const babel = require(base + '@babel/core'), cache = {};
function load(file) {
  file = path.resolve(file); if (cache[file]) return cache[file].exports;
  const m = { exports: {} }; cache[file] = m;
  const code = babel.transformSync(fs.readFileSync(file, 'utf8'), { babelrc:false, configFile:false, plugins:[require(base+'@babel/plugin-transform-modules-commonjs')] }).code;
  vm.runInThisContext('(function(require,module,exports){'+code+'\n})', {filename:file})(p=>load(path.resolve(path.dirname(file),p)+'.js'),m,m.exports);
  return m.exports;
}
const r = load(root+'/vtt-react/src/data/classes/chaosWeaverRules.js');
const out = {};
const fresh = (ap=20) => r.setWorksheetCounters(r.createRehearsalSession({label:'rereview'}),{apAvailable:ap,remainingMovementFeet:30}).session;
const step = (s, fn, args) => { const before=JSON.stringify(s), v=r[fn](s,args); if(!v.ok) throw Error(fn+': '+v.errors); if(JSON.stringify(s)!==before) throw Error('input mutation'); return v.session; };
const cast = (s,id,ids,face,cont) => {s=step(s,'commitSpell',{spellId:id,primaryTileIds:ids,continuationTileId:cont||null}); if(s.pending) {s=step(s,'recordFace',{faceValue:face}); const labels=r.pendingSettlementPreview(s).labels; s=step(s,cont?'resolveContinuation':'settlePending',cont?{choice:'accept',confirmations:[...labels,'continuation']}:{confirmations:labels});} return s;};
function observe(name, fn) {try {out[name]=fn();} catch(e) {out[name]={threw:e.message};}}
observe('legalPick',()=>r.buildPreview({characterLevel:1,pickedSpellIds:['cw1_01']}));
observe('recoveredRoundTrip',()=>{let s=cast(fresh(),'cr1_chaos_weaver_split_possibility',['S1','F1'],1); s=step(s,'commitSpell',{spellId:'cr1_chaos_weaver_fold_odds',primaryTileIds:['S1']}); return r.importPacket(r.exportPacketText({rehearsal:s}));});
observe('restedRoundTrip',()=>{let s=cast(fresh(),'cr1_chaos_weaver_split_possibility',['S1','F1'],1);s=step(s,'completeRest',{restLabel:'rest-1'});return r.importPacket(r.exportPacketText({rehearsal:s}));});
observe('closureRejections',()=>{let s=cast(fresh(),'cr1_chaos_weaver_unsteady_ground',['M1','F1']);return Object.fromEntries(['expiry','counterseal','unbind','dismissal'].map(reason=>[reason,r.resolveAnomaly(s,{reason})]));});
observe('anomalyCompleteWitness',()=>{let s=cast(fresh(4),'cr1_chaos_weaver_unsteady_ground',['M1','F1']);s=cast(s,'cr1_chaos_weaver_split_possibility',['S1','F2'],1);s=step(s,'resolveAnomaly',{reason:'trigger'});s=step(s,'recordFace',{faceValue:1});s=step(s,'settlePending',{confirmations:r.pendingSettlementPreview(s).labels});s=step(s,'startOwnTurn',{apAvailable:4});s=step(s,'commitSpell',{spellId:'cr1_chaos_weaver_fold_odds',primaryTileIds:['M1','F1']});s=cast(s,'cr1_chaos_weaver_unsteady_ground',['M1','F1']);s=step(s,'startOwnTurn',{apAvailable:4});s=step(s,'commitSpell',{spellId:'cw1_dismiss_anomaly'});s=step(s,'resolveAnomaly',{reason:'dismissal'});s=step(s,'commitSpell',{spellId:'cr1_chaos_weaver_fold_odds',primaryTileIds:['M1','F1']});return {session:s,roundTrip:r.importPacket(r.exportPacketText({rehearsal:s})).ok};});
observe('anomalyVoidRedraw',()=>{let s=cast(fresh(),'cr1_chaos_weaver_unsteady_ground',['M1','F1']);s=step(s,'resolveAnomaly',{reason:'trigger'});s=step(s,'recordFace',{faceValue:6});s=step(s,'voidPending',{reason:'table void'});const retrigger=r.resolveAnomaly(s,{reason:'trigger'});return {afterVoid:s,retrigger:retrigger.ok,newFace:retrigger.ok?r.recordFace(retrigger.session,{faceValue:1}):null};});
observe('malformedPendingMapping',()=>{let s=step(fresh(),'commitSpell',{spellId:'cr1_chaos_weaver_split_possibility',primaryTileIds:['S1','F1']});s.pending.primaryTileIds=['S1'];s.pending.mapping=null;s.pending.phase='face-recorded';s.pending.recordedFaces=[1];s.pending.selectedTileId='S1';return r.importPacket(r.exportPacketText({rehearsal:s}));});
observe('forgedPendingPrice',()=>{let s=step(fresh(),'commitSpell',{spellId:'cr1_chaos_weaver_split_possibility',primaryTileIds:['S1','F1']});s.pending.spellId='cr1_chaos_weaver_bias_draw';return r.importPacket(r.exportPacketText({rehearsal:s}));});
observe('deterministicFracture',()=>{const s=cast(fresh(),'cw1_01',['F1']);return {penalties:s.penalties,settlements:s.settlements,log:s.log};});
observe('paidCounterseal',()=>{let s=cast(fresh(),'cr1_chaos_weaver_unsteady_ground',['M1','F1']);s=cast(s,'cw1_30',['S1','F2'],6);return s;});
const dir=path.resolve(__dirname,'..'), sha=f=>crypto.createHash('sha256').update(fs.readFileSync(root+'/'+f)).digest('hex');
const retained=JSON.parse(require('child_process').execFileSync(process.execPath,[dir+'/independent-review/independent-probes.cjs','--summary'],{encoding:'utf8',maxBuffer:8*1024*1024}));
const correction=JSON.parse(fs.readFileSync(dir+'/correction/probe-summary.json','utf8'));
out.retainedProbeChecks=retained.checks;
out.correctionComparison=retained.checks.map(x=>({name:x.name,exactCorrectionPayload:JSON.stringify(x)===JSON.stringify(correction.checks.find(c=>c.name===x.name))}));
const hashes=JSON.parse(fs.readFileSync(dir+'/correction/new-source-hashes.json','utf8'));
out.identities=[...hashes.newFiles,...hashes.modifiedFiles].map(x=>({path:x.path,expected:x.correctionSha256,now:sha(x.path),match:sha(x.path)===x.correctionSha256}));
out.preservation=JSON.parse(fs.readFileSync(dir+'/preservation-check.json','utf8').replace(/^\uFEFF/,'')).map(x=>({path:x.path,entry:x.expected,delivery:x.current,now:sha(x.path),entryMatch:x.expected===sha(x.path),deliveryMatch:x.current===sha(x.path)}));
for (const key of ['recoveredRoundTrip','restedRoundTrip','malformedPendingMapping','forgedPendingPrice']) {
  const v=out[key]; if(v && !v.threw) out[key]={ok:v.ok,errors:v.errors,draftRetained:typeof v.draftText==='string'};
}
console.log(JSON.stringify(out,null,2));
