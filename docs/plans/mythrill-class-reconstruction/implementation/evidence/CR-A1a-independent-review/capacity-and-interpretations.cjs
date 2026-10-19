'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../../../..');
const api=require(path.join(root,'server/services/authoredSpellDefinitions'));
const fixture=JSON.parse(fs.readFileSync(path.join(root,'docs/plans/mythrill-class-reconstruction/implementation/fixtures/CR-A1a-definition-vectors.json'),'utf8'));
const uuid=n=>`12345678-abcd-4abc-8abc-${String(n).padStart(12,'0')}`;
const clone=x=>JSON.parse(JSON.stringify(x));
const sort=x=>Array.isArray(x)?x.map(sort):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sort(x[k])])):x;
const stable=x=>JSON.stringify(sort(x));
const hash=x=>crypto.createHash('sha256').update(stable(x)).digest('hex');
const defs=[],decisions=[];
for(let n=1;n<=128;n++) {
  const d=clone(fixture.vectors[0].definition);
  d.scope.roomId='a';d.definitionId=uuid(n);d.name='a';d.description='';d.binding.classId='apex';
  d.targeting.rangeFeet=0;d.targeting.restriction='any';d.resourceCost={actionPoints:0,mana:0};d.effect={kind:'healing',formula:'1d2'};
  const c=api.compileDefinition(d);assert.equal(c.ok,true);
  const ref=c.descriptor.definitionRef;
  defs.push({definitionRef:ref,canonicalDefinition:c.canonicalDefinition,compilerVersion:'cr-a1a-1',descriptor:c.descriptor});
  const request={roomId:'a',requestId:uuid(1000+n),expectedRegistryRevision:decisions.length,definition:d,expectedDefinitionHash:c.definitionHash};
  decisions.push({requestId:request.requestId,requestHash:hash(request),byUid:'g',sequence:decisions.length+1,action:'admit',definitionRef:ref});
}
const beforeRevokes={schemaVersion:1,roomId:'a',revision:decisions.length,definitions:defs,decisions:clone(decisions)};
for(let n=0;n<128;n++) {
  const request={roomId:'a',requestId:uuid(2000+n),expectedRegistryRevision:decisions.length,definitionRef:defs[n].definitionRef};
  decisions.push({requestId:request.requestId,requestHash:hash(request),byUid:'g',sequence:decisions.length+1,action:'revoke',definitionRef:defs[n].definitionRef});
}
const snapshot={schemaVersion:1,roomId:'a',revision:256,definitions:defs,decisions};
const encoded=api.encodeRegistry(snapshot);
const authorizer=()=>({ok:true,roomId:'a',uid:'g',gmUid:'g',principalBound:true,authorityCurrent:true,rulesetId:'prism',rulesetVersion:'cr-a1a-pilot-1'});
async function main() {
  const engine=api.createDefinitionRegistry({authorize:authorizer});
  // Reconstruct the final revoke using the actual planner, independently of the manual codec control.
  const lastInput={...clone(snapshot),revision:255,decisions:clone(decisions.slice(0,255))};
  const final=await engine.planRevoke(lastInput,{roomId:'a',requestId:uuid(2127),expectedRegistryRevision:255,definitionRef:defs[127].definitionRef});
  const result={capturedAt:new Date().toISOString(),minimizedValidConstruction:{definitionCount:defs.length,decisionCount:decisions.length,utf8Bytes:Buffer.byteLength(stable(snapshot)),capBytes:256*1024,
    encodeResult:encoded.ok?{ok:true,bytes:Buffer.byteLength(encoded.json)}:encoded,
    decodeResult:api.decodeRegistry(stable(snapshot)).ok,finalRevokePlan:final.ok?{ok:true,revision:final.nextRegistry.revision,installed:final.installed}:final},
    independentDescribe:engine.describe(beforeRevokes,{definitionRef:defs[0].definitionRef,expectedBinding:defs[0].canonicalDefinition.binding}).ok,
    regexCanonicalControls:{uuidNewlineAccepted:api.compileDefinition({...clone(fixture.vectors[0].definition),definitionId:fixture.vectors[0].definition.definitionId+'\n'}).ok,
      formulaNewlineAccepted:api.compileDefinition({...clone(fixture.vectors[0].definition),effect:{...fixture.vectors[0].definition.effect,formula:'1d6\n'}}).ok}
  };
  fs.writeFileSync(path.join(__dirname,'capacity-interpretation-results.json'),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
