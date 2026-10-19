'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../../../../../..');
const api = require(path.join(root,'server/services/authoredSpellDefinitions'));
// Expected identity/descriptor bytes come from the original planning fixture, not the new copied test fixture.
const fixture = JSON.parse(fs.readFileSync(path.join(root,'docs/plans/mythrill-class-reconstruction/implementation/fixtures/CR-A1a-definition-vectors.json'),'utf8'));
const clone = x => JSON.parse(JSON.stringify(x));
const stable = x => JSON.stringify(sort(x));
function sort(x) { return Array.isArray(x)?x.map(sort):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sort(x[k])])):x; }
const sha = x => crypto.createHash('sha256').update(x).digest('hex');
const room = fixture.vectors[0].definition.scope.roomId;
const baseDefinition = () => clone(fixture.vectors[0].definition);
const uuid = n => `abcdefab-cdef-4abc-8def-${String(n).padStart(12,'0')}`;
const authority = () => ({ok:true,roomId:room,uid:'review-gm',gmUid:'review-gm',principalBound:true,authorityCurrent:true,rulesetId:'prism',rulesetVersion:'cr-a1a-pilot-1'});
const admission = (n,revision,definition=baseDefinition()) => ({roomId:room,requestId:uuid(n),expectedRegistryRevision:revision,definition,expectedDefinitionHash:sha(fixture.hashPrefix+stable(definition))});
const revocation = (n,revision,ref) => ({roomId:room,requestId:uuid(n),expectedRegistryRevision:revision,definitionRef:clone(ref)});
const failure = (value,code) => {assert.equal(value.ok,false);assert.equal(value.code,code);assert.equal('descriptor' in value,false);};
const results = [];
async function probe(name,fn) {
  try {const detail=await fn();results.push({name,pass:true,...(detail===undefined?{}:{detail})});}
  catch(error) {results.push({name,pass:false,error:error.message});}
}
function assertFrozenTree(x) {
  if(x&&typeof x==='object') {assert.equal(Object.isFrozen(x),true);for(const key of Object.keys(x)) assertFrozenTree(x[key]);}
}
function rehashHistory(snapshot) {
  snapshot.decisions.forEach((decision,index)=>{
    decision.sequence=index+1;
    const request={roomId:snapshot.roomId,requestId:decision.requestId,expectedRegistryRevision:index};
    if(decision.action==='admit') {
      const entry=snapshot.definitions.find(e=>e.definitionRef.definitionVersion===decision.definitionRef.definitionVersion);
      request.definition=entry.canonicalDefinition;request.expectedDefinitionHash=entry.definitionRef.definitionHash;
    } else request.definitionRef=decision.definitionRef;
    decision.requestHash=sha(stable(request));
  });
}
async function main() {
  for(const vector of fixture.vectors) await probe('independent golden '+vector.label,()=>{
    assert.equal(stable(vector.definition),vector.canonicalJSON);
    assert.equal(sha(fixture.hashPrefix+vector.canonicalJSON),vector.definitionHash);
    const result=api.compileDefinition(clone(vector.definition));assert.equal(result.ok,true);
    assert.equal(JSON.stringify(result.canonicalDefinition),vector.canonicalJSON);
    assert.equal(result.definitionHash,vector.definitionHash);assert.deepEqual(result.descriptor,vector.descriptor);
    assertFrozenTree(result);return {hash:result.definitionHash};
  });
  await probe('explicit AP0/mana0 and changed scope/formula identities',()=>{
    const d=baseDefinition();d.resourceCost.mana=0;const c=api.compileDefinition(d);assert.deepEqual(c.descriptor.price,{ap:0,mana:0});
    const other=clone(d);other.scope.roomId='review-room-2';assert.notEqual(api.compileDefinition(other).definitionHash,c.definitionHash);
    other.scope.roomId=room;other.effect.formula='2d6';assert.notEqual(api.compileDefinition(other).definitionHash,c.definitionHash);
  });
  for(const [label,change] of [
    ['missing price',d=>delete d.resourceCost.actionPoints],['undefined price',d=>d.resourceCost.actionPoints=undefined],
    ['null price',d=>d.resourceCost.actionPoints=null],['boolean price',d=>d.resourceCost.mana=false],
    ['extra class program',d=>d.classResourceProgram={version:1}],['extra resource state',d=>d.resourceCost.gain=1],
    ['extra effect',d=>d.effect.duration={rounds:1}],['Date',d=>d.description=new Date(0)],
    ['custom object prototype',d=>Object.setPrototypeOf(d.effect,{inherited:true})]
  ]) await probe('reject '+label,()=>{const d=baseDefinition();change(d);failure(api.compileDefinition(d),'INVALID_DEFINITION');});
  for(const target of ['definition','resourceCost','damageTypes']) await probe('getter/toJSON not called: '+target,()=>{
    for(const key of ['toJSON','authoredGetter']) {
      let calls=0;const d=baseDefinition(),object=target==='definition'?d:target==='resourceCost'?d.resourceCost:d.effect.damageTypes;
      Object.defineProperty(object,key,{enumerable:true,get(){calls++;throw Error('authored behavior invoked');}});
      failure(api.compileDefinition(d),'INVALID_DEFINITION');assert.equal(calls,0);
    }
  });
  // Concrete contract probes missed by the implementation suite. No Proxy or global prototype modification.
  await probe('MUST reject own Symbol-keyed authored data instead of stripping it',()=>{
    const d=baseDefinition();d[Symbol('unsupported-cooldown')]=()=>42;
    const actual=api.compileDefinition(d);
    assert.equal(actual.ok,false,'symbol-keyed authored function was silently discarded; accepted hash='+actual.definitionHash);
    assert.equal(actual.code,'INVALID_DEFINITION');
  });
  await probe('MUST reject a Symbol-keyed getter without invoking it',()=>{
    let calls=0;const d=baseDefinition();Object.defineProperty(d.effect,Symbol('authored'),{get(){calls++;return 1;},enumerable:true});
    const actual=api.compileDefinition(d);assert.equal(calls,0);assert.equal(actual.ok,false,'symbol getter was silently discarded');
  });
  await probe('MUST reject custom Array prototype even when its toJSON is never invoked',()=>{
    let calls=0;class AuthoredArray extends Array {toJSON(){calls++;throw Error('authored toJSON invoked');}}
    const d=baseDefinition();d.effect.damageTypes=new AuthoredArray('arcane');
    const actual=api.compileDefinition(d);assert.equal(calls,0);
    assert.equal(actual.ok,false,'custom-prototype array accepted as ordinary JSON; hash='+actual.definitionHash);
  });
  await probe('emptyRegistry direct return and independent mutable callers',()=>{
    const a=api.emptyRegistry(room),b=api.emptyRegistry(room);assert.equal('ok' in a,false);assert.equal(a.revision,0);
    assertFrozenTree(a);assert.notEqual(a.definitions,b.definitions);assert.equal(api.decodeRegistry(api.encodeRegistry(a).json).ok,true);
  });
  const engine=api.createDefinitionRegistry({authorize:()=>authority()});
  const originalRequest=admission(1,0);
  const first=await engine.planAdmit(api.emptyRegistry(room),clone(originalRequest));assert.equal(first.ok,true);
  const secondDefinition=baseDefinition();secondDefinition.definitionVersion=2;secondDefinition.name='Independent version two';
  const second=await engine.planAdmit(first.nextRegistry,admission(2,1,secondDefinition));assert.equal(second.ok,true);
  const revokeRequest=revocation(3,2,first.definitionRef);
  const revoked=await engine.planRevoke(second.nextRegistry,clone(revokeRequest));assert.equal(revoked.ok,true);
  const params={definitionRef:second.definitionRef,expectedBinding:baseDefinition().binding};
  await probe('real restart with fresh factory, version/revoke/replay semantics',async()=>{
    const snapshot=api.decodeRegistry(api.encodeRegistry(revoked.nextRegistry).json).registry;
    const fresh=api.createDefinitionRegistry({authorize:()=>authority()});
    assert.equal(fresh.describe(snapshot,params).ok,true);
    failure(fresh.describe(snapshot,{...params,definitionRef:first.definitionRef}),'DEFINITION_REVOKED');
    const replay=await fresh.planAdmit(snapshot,clone(originalRequest));assert.equal(replay.kind,'replay');assert.equal('nextRegistry' in replay,false);
    const replayRevoke=await fresh.planRevoke(snapshot,clone(revokeRequest));assert.equal(replayRevoke.kind,'replay');assert.equal('decision' in replayRevoke,false);
    failure(await fresh.planRevoke(snapshot,revocation(4,3,first.definitionRef)),'ALREADY_REVOKED');
    assert.equal(snapshot.revision,3);assertFrozenTree(snapshot);
  });
  await probe('fresh authority failure prevents replay for admit AND revoke',async()=>{
    let calls=0;const denying=api.createDefinitionRegistry({authorize:()=>{calls++;return {...authority(),authorityCurrent:false};}});
    failure(await denying.planAdmit(revoked.nextRegistry,clone(originalRequest)),'AUTHORITY_UNAVAILABLE');
    failure(await denying.planRevoke(revoked.nextRegistry,clone(revokeRequest)),'AUTHORITY_UNAVAILABLE');assert.equal(calls,2);
  });
  await probe('no cross-result aliases or caller freezing',async()=>{
    const input=clone(first.nextRegistry),request=admission(20,1,clone(secondDefinition)),before=clone({input,request});
    const a=await engine.planAdmit(input,request),b=await engine.planAdmit(input,request);
    assert.equal(a.ok,true);assertFrozenTree(a);assert.notEqual(a.nextRegistry,b.nextRegistry);
    assert.notEqual(a.nextRegistry.definitions[0].canonicalDefinition,b.nextRegistry.definitions[0].canonicalDefinition);
    assert.notEqual(a.nextRegistry.definitions[0].canonicalDefinition,input.definitions[0].canonicalDefinition);
    assert.equal(Object.isFrozen(input),false);assert.equal(Object.isFrozen(request.definition),false);assert.deepEqual({input,request},before);
    assert.equal(Reflect.set(a.descriptor.price,'ap',7),false);assert.equal(b.descriptor.price.ap,0);
  });
  for(const operation of ['admit','revoke']) await probe('detached BEFORE synchronous authorizer side effects AND pending mutation: '+operation,async()=>{
    const input=clone(operation==='admit'?first.nextRegistry:second.nextRegistry);
    const request=operation==='admit'?admission(31,1,clone(secondDefinition)):revocation(32,2,first.definitionRef);
    const requestBefore=clone(request),registryBefore=clone(input);let release,calls=0;
    const port=api.createDefinitionRegistry({authorize:()=>{
      calls++;assert.deepEqual(input,registryBefore);assert.deepEqual(request,requestBefore);
      assert.equal(Object.isFrozen(input),false);assert.equal(Object.isFrozen(request),false);
      input.definitions[0].canonicalDefinition.name='mutation at authorize invocation';input.decisions[0].byUid='changed';
      request.roomId='changed';return new Promise(resolve=>{release=resolve;});
    }});
    const pending=operation==='admit'?port.planAdmit(input,request):port.planRevoke(input,request);
    assert.equal(calls,1);input.revision=99;input.definitions.length=0;input.decisions.length=0;request.requestId=uuid(999);
    if(operation==='admit'){request.definition.resourceCost.actionPoints=19;request.definition.effect.formula='50d100';}
    else request.definitionRef.definitionHash='f'.repeat(64);
    release(authority());const result=await pending;assert.equal(result.ok,true);
    assert.equal(result.expectedRegistryRevision,requestBefore.expectedRegistryRevision);assert.equal(result.requestHash,sha(stable(requestBefore)));
    assert.deepEqual(result.nextRegistry.definitions[0],registryBefore.definitions[0]);assert.equal(result.decision.requestId,requestBefore.requestId);
    assert.equal(Object.isFrozen(request),false);return {requestHash:result.requestHash,expectedRegistryRevision:result.expectedRegistryRevision};
  });
  await probe('malformed JSON data and corrupt history rejected before authorizer invocation',async()=>{
    let calls=0,getters=0;const port=api.createDefinitionRegistry({authorize:()=>{calls++;return authority();}});
    const request=admission(33,0);Object.defineProperty(request.definition.resourceCost,'actionPoints',{enumerable:true,get(){getters++;return 0;}});
    failure(await port.planAdmit(api.emptyRegistry(room),request),'INVALID_DEFINITION');
    const corrupt=clone(first.nextRegistry);corrupt.decisions[0].requestHash='0'.repeat(64);
    failure(await port.planAdmit(corrupt,admission(34,1,clone(secondDefinition))),'INVALID_REGISTRY');assert.equal(calls,0);assert.equal(getters,0);
  });
  // Compile/semantic policy remains after fresh authorization per the explicit frozen precedence.
  await probe('post-authorization revision/hash/scope semantics use detached snapshots',async()=>{
    let calls=0;const port=api.createDefinitionRegistry({authorize:()=>{calls++;return authority();}});
    const badHash=admission(35,1,clone(secondDefinition));badHash.expectedDefinitionHash='f'.repeat(64);
    failure(await port.planAdmit(first.nextRegistry,badHash),'HASH_MISMATCH');assert.equal(calls,1);
    const stale=admission(36,0,clone(secondDefinition));failure(await port.planAdmit(first.nextRegistry,stale),'REVISION_CONFLICT');assert.equal(calls,2);
  });
  await probe('stale concurrent plans never install or mutate original registry',async()=>{
    const input=clone(first.nextRegistry),before=clone(input);
    const [a,b]=await Promise.all([engine.planAdmit(input,admission(40,1,clone(secondDefinition))),engine.planAdmit(input,admission(41,1,clone(secondDefinition)))]);
    assert.equal(a.ok,true);assert.equal(b.ok,true);assert.equal(a.installed,false);assert.equal(b.installed,false);assert.deepEqual(input,before);
    failure(await engine.planAdmit(a.nextRegistry,admission(41,1,clone(secondDefinition))),'REVISION_CONFLICT');
  });
  const mutations=[
    ['duplicate requestId cross actions',s=>{s.decisions[2].requestId=s.decisions[0].requestId;s.decisions[2].requestHash=sha(stable({roomId:room,requestId:s.decisions[2].requestId,expectedRegistryRevision:2,definitionRef:s.decisions[2].definitionRef}));}],
    ['version gap with valid definition records',s=>{s.definitions.splice(0,1);s.decisions=[s.decisions[1]];s.revision=1;s.decisions[0].sequence=1;s.decisions[0].requestHash=sha(stable(admission(2,0,secondDefinition)));}],
    ['out-of-order admits',s=>{[s.decisions[0],s.decisions[1]]=[s.decisions[1],s.decisions[0]];rehashHistory(s);}],
    ['orphan stored version',s=>{s.decisions=[s.decisions[0]];s.revision=1;}],
    ['double revoke',s=>{const d=clone(s.decisions[2]);d.sequence=4;d.requestId=uuid(44);d.requestHash=sha(stable(revocation(44,3,d.definitionRef)));s.decisions.push(d);s.revision=4;}],
    ['revoke before admit',s=>{[s.decisions[0],s.decisions[2]]=[s.decisions[2],s.decisions[0]];rehashHistory(s);}],
    ['wrong reference hash',s=>{s.decisions[0].definitionRef.definitionHash='f'.repeat(64);}],
    ['wrong decision request hash',s=>{s.decisions[1].requestHash='f'.repeat(64);}],
    ['revision-count mismatch',s=>{s.revision++;}]
  ];
  for(const [name,mutate] of mutations) await probe('all five consumers reject history: '+name,async()=>{
    const s=clone(revoked.nextRegistry);mutate(s);
    for(const entry of s.definitions) assert.equal(api.compileDefinition(entry.canonicalDefinition).ok,true);
    let calls=0;const port=api.createDefinitionRegistry({authorize:()=>{calls++;return authority();}});
    failure(api.encodeRegistry(s),'INVALID_REGISTRY');failure(api.decodeRegistry(JSON.stringify(s)),'INVALID_REGISTRY');
    failure(await port.planAdmit(s,admission(51,3)),'INVALID_REGISTRY');failure(await port.planRevoke(s,revocation(52,3,first.definitionRef)),'INVALID_REGISTRY');
    failure(port.describe(s,params),'INVALID_REGISTRY');assert.equal(calls,0);
  });
  await probe('describe stable precedence with a revoked valid record',()=>{
    const expectedBinding=baseDefinition().binding,definitionRef=first.definitionRef;
    failure(engine.describe(revoked.nextRegistry,{definitionRef,expectedBinding:{...expectedBinding,classId:'warden'}}),'UNSUPPORTED_BINDING');
    failure(engine.describe(revoked.nextRegistry,{definitionRef:{...definitionRef,definitionHash:'f'.repeat(64)},expectedBinding}),'HASH_MISMATCH');
    failure(engine.describe(revoked.nextRegistry,{definitionRef,expectedBinding}),'DEFINITION_REVOKED');
  });
  await probe('MUST reject symbol metadata at every object-input boundary',async()=>{
    const marked=clone(first.nextRegistry);marked[Symbol('registry-extension')]=true;
    const outcomes={encode:api.encodeRegistry(marked).ok,describe:engine.describe(marked,{definitionRef:first.definitionRef,expectedBinding:baseDefinition().binding}).ok,
      planAdmit:(await engine.planAdmit(marked,admission(60,1,clone(secondDefinition)))).ok,
      planRevoke:(await engine.planRevoke(marked,revocation(61,1,first.definitionRef))).ok};
    assert.deepEqual(outcomes,{encode:false,describe:false,planAdmit:false,planRevoke:false},JSON.stringify(outcomes));
  });
  await probe('MUST reject array subclass in registry before authorizer invocation',async()=>{
    const marked=clone(first.nextRegistry);class AuthoredEntries extends Array {}
    marked.definitions=new AuthoredEntries(...marked.definitions);let calls=0;
    const port=api.createDefinitionRegistry({authorize:()=>{calls++;return authority();}});
    const result=await port.planRevoke(marked,revocation(62,1,first.definitionRef));
    assert.equal(result.ok,false,'registry array subclass authorized '+calls+' time(s) and accepted');assert.equal(calls,0);
  });
  const output={capturedAt:new Date().toISOString(),sourceSha256:sha(fs.readFileSync(path.join(root,'server/services/authoredSpellDefinitions.js'))),
    total:results.length,passed:results.filter(r=>r.pass).length,failed:results.filter(r=>!r.pass).length,results};
  fs.writeFileSync(path.join(__dirname,'probe-results.json'),JSON.stringify(output,null,2)+'\n');
  console.log(JSON.stringify(output,null,2));if(output.failed) process.exitCode=1;
}
main().catch(error=>{console.error(error);process.exitCode=2;});
