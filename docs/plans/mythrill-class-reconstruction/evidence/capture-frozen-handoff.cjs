/* Contract evidence/golden data only. Does not implement the proposed service. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../../../..'),base=path.resolve(__dirname,'..');
const checkpoint=require(path.join(root,'server/services/roomCheckpoint.js'));
const files=[
 'vtt-react/src/components/spellcrafting-wizard/components/steps/Step5Resources.jsx',
 'vtt-react/src/components/spellcrafting-wizard/core/mechanics/resourceManager.js',
 'vtt-react/src/components/spellcrafting-wizard/core/utils/spellSerializer.js',
 'vtt-react/src/components/spellcrafting-wizard/core/utils/libraryManager.js',
 'vtt-react/src/components/spellcrafting-wizard/context/spellWizardContext.js',
 'vtt-react/src/components/spellcrafting-wizard/SpellwizardApp.jsx',
 'vtt-react/src/components/spellcrafting-wizard/components/steps/Step10Review.jsx',
 'vtt-react/src/services/spellConsequence.js','vtt-react/src/services/spellConsequenceService.js',
 'server/services/actorConsequences.js','server/services/spellPayments.js','server/services/strikeApprovals.js','server/services/blockApprovals.js',
 'server/handlers/actorConsequenceHandlers.js','server/handlers/socketHandlers.js','server/services/roomAuthorityService.js','server/services/roomCheckpoint.js',
 'vtt-react/src/persistence/privateStorageRegistry.js','vtt-react/src/data/classes/index.js',
 'server/package.json','vtt-react/package.json','docs/ENGINEERING_STATE.md','docs/MYTHRILL_P11_P14_ROADMAP.md'
];
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const git=(...args)=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024}).trim();
const newTargets=['server/services/authoredSpellDefinitions.js','server/tests/authoredSpellDefinitions.test.js','server/tests/fixtures/crA1aDefinitionVectors.json'];
const capture={capturedAt:new Date().toISOString(),branch:git('branch','--show-current'),head:git('rev-parse','HEAD'),status:git('status','--porcelain=v1'),sourceHashes:Object.fromEntries(files.map(f=>[f,sha(fs.readFileSync(path.join(root,f)))])),newTargets:Object.fromEntries(newTargets.map(f=>[f,fs.existsSync(path.join(root,f))?'EXISTS—reconcile before implementation':'absent/new deliverable'])),scope:'Read-only source reconciliation for planning freeze; no fresh application/runtime acceptance.'};
fs.writeFileSync(path.join(__dirname,'frozen-handoff-source.json'),JSON.stringify(capture,null,2)+'\n');
const damage={schemaVersion:1,scope:{roomId:'headq-pilot-room'},definitionId:'11111111-1111-4111-8111-111111111111',definitionVersion:1,name:'Pilot Arcane Dart',description:'One immediate single-target Arcane damage payload.',binding:{rulesetId:'prism',rulesetVersion:'cr-a1a-pilot-1',classId:'arcanoneer'},spellType:'ACTION',castTimeType:'IMMEDIATE',targeting:{kind:'single',maxTargets:1,rangeFeet:30,restriction:'enemy'},resourceCost:{actionPoints:0,mana:4},effect:{kind:'damage',formula:'1d6+2',damageTypes:['arcane']}};
const healing={schemaVersion:1,scope:{roomId:'headq-pilot-room'},definitionId:'22222222-2222-4222-8222-222222222222',definitionVersion:1,name:'Pilot Direct Mending',description:'Structural healing fixture, not approved playable content.',binding:{rulesetId:'prism',rulesetVersion:'cr-a1a-pilot-1',classId:'martyr'},spellType:'ACTION',castTimeType:'IMMEDIATE',targeting:{kind:'single',maxTargets:1,rangeFeet:30,restriction:'ally'},resourceCost:{actionPoints:2,mana:0},effect:{kind:'healing',formula:'2d8+3'}};
function vector(label,definition,dice,constant){const canonical=checkpoint.canonicalize(definition,'definition');if(canonical.error)throw Error(canonical.error);const canonicalJSON=checkpoint.stableStringify(canonical.value),definitionHash=checkpoint.sha256Hex('mythrill:authored-definition:v1\n'+canonicalJSON);return {label,definition,canonicalJSON,definitionHash,descriptor:{schemaVersion:1,capabilityId:'authored-immediate:v1',compilerVersion:'cr-a1a-1',definitionRef:{roomId:definition.scope.roomId,definitionId:definition.definitionId,definitionVersion:definition.definitionVersion,definitionHash},binding:definition.binding,price:{ap:definition.resourceCost.actionPoints,mana:definition.resourceCost.mana},targeting:definition.targeting,effect:{kind:definition.effect.kind,dice,constant,damageTypes:definition.effect.damageTypes||[]},executionEnabled:false}};}
const vectors=[vector('zero-ap-damage',damage,[{count:1,sides:6}],2),vector('direct-healing',healing,[{count:2,sides:8}],3)];
const changedPrice=JSON.parse(JSON.stringify(damage));changedPrice.resourceCost.actionPoints=1;vectors.push(vector('changed-price-different-identity',changedPrice,[{count:1,sides:6}],2));
const dir=path.join(base,'implementation/fixtures');fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'CR-A1a-definition-vectors.json'),JSON.stringify({schema:'cr-a1a-frozen-vectors:1',scope:'Golden contract data only; no admitted/implemented/executable spell',hashPrefix:'mythrill:authored-definition:v1\n',vectors},null,2)+'\n');
console.log(JSON.stringify({capturedFiles:files.length,newTargets:capture.newTargets,goldenVectors:vectors.map(v=>({label:v.label,hash:v.definitionHash})),applicationWrites:0},null,2));
