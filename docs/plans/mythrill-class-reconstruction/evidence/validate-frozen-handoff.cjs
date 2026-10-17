/* Validate frozen planning identities only; no correction/service implementation. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'),base=path.resolve(__dirname,'..');
const cp=require(path.join(root,'server/services/roomCheckpoint.js'));
const read=rel=>fs.readFileSync(path.join(base,rel),'utf8');const json=rel=>JSON.parse(read(rel));
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const capture=json('evidence/frozen-handoff-source.json');
const drift=Object.entries(capture.sourceHashes).filter(([file,hash])=>sha(fs.readFileSync(path.join(root,file)))!==hash).map(([file])=>file);
assert.deepEqual(drift,[],'Focused source changed during planning; reconcile before freeze');
const fixtures=json('implementation/fixtures/CR-A1a-definition-vectors.json');assert.equal(fixtures.vectors.length,3);
for(const v of fixtures.vectors){const canonical=cp.canonicalize(v.definition,'definition');assert(!canonical.error);const canonicalJSON=cp.stableStringify(canonical.value);assert.equal(canonicalJSON,v.canonicalJSON);assert.equal(sha('mythrill:authored-definition:v1\n'+canonicalJSON),v.definitionHash);assert.equal(v.descriptor.definitionRef.definitionHash,v.definitionHash);assert.equal(v.descriptor.price.ap,v.definition.resourceCost.actionPoints);assert.equal(v.descriptor.price.mana,v.definition.resourceCost.mana);assert.equal(v.descriptor.executionEnabled,false);}
assert.equal(fixtures.vectors[0].descriptor.price.ap,0);assert.notEqual(fixtures.vectors[0].definitionHash,fixtures.vectors[2].definitionHash);
const currentAbilities='evidence/headq-seven-abilities.json',oldPacket=json('evidence/headq-packet-manifest.json');
assert.equal(sha(read(currentAbilities)),oldPacket.files[currentAbilities],'R1 canonical/proposed abilities unexpectedly changed');
const files=[
 'implementation/CR-W1a-ZERO-AP.md','implementation/CR-W1b-RESOURCE-COST-ROUNDTRIP.md','implementation/CR-A1a-DEFINITION-INFRASTRUCTURE.md',
 'implementation/fixtures/CR-A1a-definition-vectors.json','32_FROZEN_HANDOFF_AND_PROTOTYPE_ACCEPTANCE.md',
 '00_README_AND_MASTER_INDEX.md','20_IMPLEMENTATION_PHASES.md','21_DEEPSEEK_IMPLEMENTATION_CONTRACTS.md','22_CREATOR_DECISION_REGISTER.md','26_COMPLETION_AND_CONTINUATION.md','30_CLASS_HEADQ_DECISION_PACKET.md',
 'implementation/CR-W1-WIZARD-CORRECTIONS.md','implementation/CR-A1-AUTHORED-SPELL-ADMISSION.md'
];
for(const file of files)assert(read(file).length>0);
assert(read(files[0]).includes('does **not** waive'));assert(read(files[0]).includes('existing **1 AP**'));
assert(read(files[1]).includes('Remains absent'));assert(read(files[2]).includes('server-only CommonJS'));assert(read(files[2]).includes('executionEnabled:false'));
const report={checkedAt:new Date().toISOString(),scope:'Frozen contract/source/hash consistency, not implementation test acceptance',contracts:3,goldenVectors:3,zeroPriceIdentityPreserved:true,sourceDrift:drift,applicationWrites:0,applicationImplementationAuthorized:false,masterAssignmentComplete:false,
 futureTargetPresence:Object.fromEntries(Object.keys(capture.newTargets).map(file=>[file,fs.existsSync(path.join(root,file))])),
 files:Object.fromEntries(files.map(file=>[file,sha(read(file))]))};
fs.writeFileSync(path.join(base,'implementation/frozen-handoff-manifest.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({contracts:3,goldenVectors:3,sourceDrift:drift,applicationWrites:0,masterAssignmentComplete:false},null,2));
