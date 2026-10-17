/* Naming-only planning maintenance; no application imports, writes or ID migration. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const names=require('./druid-display-name.cjs');
const base=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(base,file),'utf8');
const json=file=>JSON.parse(read(file));
const save=(file,value)=>fs.writeFileSync(path.join(base,file),JSON.stringify(value,null,2)+'\n');
const sha=value=>crypto.createHash('sha256').update(typeof value==='string'?value:JSON.stringify(value)).digest('hex');
const oldPacketFile='evidence/headq-packet-manifest-before-druid.json';
if(!fs.existsSync(path.join(base,oldPacketFile)))fs.copyFileSync(path.join(base,'evidence/headq-packet-manifest.json'),path.join(base,oldPacketFile));
const oldModels=json('evidence/headq-seven-review-models.json');
const oldAbilities=json('evidence/headq-seven-abilities.json');
const oldCompatibility=json('evidence/headq-priority-compatibility.json');
const frozenModels=Object.fromEntries(Object.entries(oldModels.profiles).map(([id,p])=>[id,{state:p.state,rules:p.rules,specs:p.specs,turns:p.turns,natives:p.natives,initial:p.initial}]));
const preserveFiles=[
 'evidence/checkpoint1-priority-dossiers.json','evidence/current-census.json','evidence/authored-spells.json',
 'evidence/historical-census.json','evidence/historical-definitions.json','evidence/asset-inventory.json','evidence/baseline-status.json',
 'evidence/headq-source-baseline.json','evidence/headq-wizard-witness-inputs.json','03_HISTORICAL_CLASS_GENEALOGY.md',
 ...fs.readdirSync(__dirname).filter(f=>/(?:-source\.json|-extract\.md|-digest\.md)$/.test(f)).map(f=>'evidence/'+f)
];
const preserved=Object.fromEntries(preserveFiles.map(file=>[file,sha(read(file))]));
const models=json('evidence/headq-seven-review-models.json');names.labelProfiles(models.profiles);save('evidence/headq-seven-review-models.json',models);
const oldFooter='Recommend thisR1 economy with its explicit costs/resets/limits. Balance, new native/institution records and survival/transfer rules need HeadQ approval; engine extensions need their own contracts. Working Hunter/Metamorph names are not migration permission, and Shapeshifter remains an alternative. No remaining full-library or50-point-tree detail is delegated to an implementer to invent.';
const newFooter='The Druid player-facing name and selective familiar-naming principle are approved; Hunter remains a working name. R1 economy, balance, specializations and native/institution records still need HeadQ approval; engine extensions need their own contracts. Preserve Shaper IDs/compatibility until explicit migration approval. The name imports no conventional Druid rules, worship, pet requirement or heritage assignment. No remaining full-library or50-point-tree detail is delegated to an implementer to invent.';
const files=['gambler','fate-weaver','chaos-weaver','deathcaller','lichborne','hunter','transformation-class'];
for(const file of files){const rel=`classes/${file}.md`,text=read(rel),cut=text.indexOf('<details>');assert(cut>0,`Missing archived boundary ${rel}`);let active=text.slice(0,cut);const archive=text.slice(cut);
 active=active.replace(oldFooter,newFooter);
 if(file==='transformation-class'){
  active=active.replace(oldModels.profiles.metamorph.institution,models.profiles.metamorph.institution).replace(oldModels.profiles.metamorph.migration,models.profiles.metamorph.migration);
  active=active.replace(/^# .* — HeadQ review R1/m,'# Druid — HeadQ review R1');
 }
 active=names.publicProse(active);
 if(file==='transformation-class'&&!active.includes('See [creator naming decision]')){
  const marker='## Fantasy and repeated decisions';
  active=active.replace(marker,`**${names.boundary}** See [creator naming decision](../31_CREATOR_NAMING_DECISION_DRUID.md). Retained technical keys/IDs are internal R1 proposal handles, not player-facing labels or approved application IDs.\n\n${marker}`);
 }
 fs.writeFileSync(path.join(base,rel),active+archive);
 assert.equal(read(rel).slice(read(rel).indexOf('<details>')),archive);
}
// Add display metadata outside canonical spells. Their IDs, costs and programs stay exact.
const abilities=json('evidence/headq-seven-abilities.json');for(const a of abilities.abilities)if(a.spell.classId==='metamorph')a.classDisplayName='Druid';save('evidence/headq-seven-abilities.json',abilities);
const split=json('classes/manifests/metamorph-review-r1.json');split.classDisplayName='Druid';for(const a of split.abilities)a.classDisplayName='Druid';save('classes/manifests/metamorph-review-r1.json',split);
const compatibility=json('evidence/headq-priority-compatibility.json');compatibility.candidates.find(c=>c.candidate==='metamorph').classDisplayName='Druid';save('evidence/headq-priority-compatibility.json',compatibility);
const cultureJSON=['evidence/headq-heritage-reviewed.json','evidence/heritage-human-audit.json',...fs.readdirSync(__dirname).filter(f=>/^CR0-H.*-review\.json$/.test(f)).map(f=>'evidence/'+f)];
for(const file of cultureJSON){const data=json(file);for(const h of data.heritages)h.restorationRecommendation.summary=names.publicProse(h.restorationRecommendation.summary);save(file,data);}
for(const f of fs.readdirSync(path.join(base,'heritage')).filter(f=>/^CR0-H.*\.md$/.test(f))){const file='heritage/'+f;fs.writeFileSync(path.join(base,file),read(file).split('\n').map(line=>line.startsWith('**PROPOSED origin decision:**')?names.publicProse(line):line).join('\n'));}

const afterAbilities=json('evidence/headq-seven-abilities.json');assert.deepEqual(afterAbilities.abilities.map(a=>a.spell),oldAbilities.abilities.map(a=>a.spell),'Canonical ability payload changed');
for(const[id,p]of Object.entries(json('evidence/headq-seven-review-models.json').profiles))assert.deepEqual({state:p.state,rules:p.rules,specs:p.specs,turns:p.turns,natives:p.natives,initial:p.initial},frozenModels[id],`Mechanics/trees/origins changed: ${id}`);
const stripDisplay=data=>({...data,candidates:data.candidates.map(c=>{const {classDisplayName,...rest}=c;return rest;})});assert.deepEqual(stripDisplay(json('evidence/headq-priority-compatibility.json')),stripDisplay(oldCompatibility),'Compatibility/IDs changed');
for(const[file,hash]of Object.entries(preserved))assert.equal(sha(read(file)),hash,`Historical/source artifact changed: ${file}`);
assert.equal(models.profiles.metamorph.name,'Druid');assert.equal(split.classDisplayName,'Druid');assert.equal(afterAbilities.abilities.filter(a=>a.classDisplayName==='Druid').length,6);
assert(read('classes/transformation-class.md').startsWith('# Druid —'));assert(read('22_CREATOR_DECISION_REGISTER.md').includes('CD01 | **Druid**'));assert(read('30_CLASS_HEADQ_DECISION_PACKET.md').includes('[Druid](classes/transformation-class.md)'));
const report={checkedAt:new Date().toISOString(),scope:'Creator naming-only decision; no production/gameplay validation rerun',approvedName:'Druid',rejectedName:'Metamorph',canonicalAbilityPayloadsUnchanged:42,resourceRulesTreesExamplesNativeAssignmentsUnchanged:7,legacyCompatibilityAndIdsUnchanged:true,historicalAndSourceArtifactsPreserved:preserved,applicationWrites:0,mechanicsApproved:false,migrationApproved:false};
save('evidence/druid-naming-verification.json',report);
const packet=json('evidence/headq-packet-manifest.json');packet.capturedAt=new Date().toISOString();packet.status='Druid name/naming principle approved only; mechanics and migrations remain under review';
for(const file of ['31_CREATOR_NAMING_DECISION_DRUID.md','05_CLASS_NAMING_AND_FANTASY.md','25_CANDIDATE_COMPARISON.md','evidence/druid-naming-verification.json'])packet.files[file]='';
for(const file of Object.keys(packet.files))packet.files[file]=sha(read(file));save('evidence/headq-packet-manifest.json',packet);
console.log(JSON.stringify({approvedName:'Druid',canonicalAbilityPayloadsUnchanged:42,unchangedMechanicalModels:7,historyAndSourceArtifactsPreserved:preserveFiles.length,applicationWrites:0,migrationApproved:false},null,2));
