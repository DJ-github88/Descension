/* New review capture; preserves all first-checkpoint artifacts. */
const {fs,path,root,src,hashes,read,load,locations}=require('./headq-source-tools.cjs');
const cp=require('node:child_process'),assert=require('node:assert/strict');
const git=(...args)=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024}).trim();
const prior=JSON.parse(read('docs/plans/mythrill-class-reconstruction/evidence/current-census.json'));
const {BASE_CLASSES_DATA}=load('data/classes/index.js');
const registry=load('data/classHeritageRegistry.js');
const {HERITAGE_EDGES}=load('data/heritageEdgeContract.js');
const {initializeClassResource}=load('data/classResources.js');
const {supportSpell}=load('services/spellConsequence.js');
const result={capturedAt:new Date().toISOString(),branch:git('branch','--show-current'),head:git('rev-parse','HEAD'),status:git('status','--porcelain=v1'),changedSincePrior:[],p9Support:[],capabilityFiles:[],sourceHashes:hashes};
for(const[file,oldHash]of Object.entries(prior.sourceHashes)){read(file);if(hashes[file]!==oldHash)result.changedSincePrior.push(file);}
for(const[name,c]of Object.entries(BASE_CLASSES_DATA)){
  const stats={strength:10,agility:10,constitution:10,intelligence:10,spirit:10};const resource=initializeClassResource(name,{...stats,level:1});
  for(const s of c.spells){const check=supportSpell({id:s.id},{class:name,classResource:resource,stats});if(check.supported)result.p9Support.push({className:name,id:s.id,domain:check.payment.domain,affordable:check.payment.affordable});}
}
const focus=[
 'docs/ENGINEERING_STATE.md','docs/MYTHRILL_P11_P14_ROADMAP.md','docs/MYTHRILL_NEXT_SLICES_CONTRACT_20261017.md',
 'server/services/spellPayments.js','server/services/actorConsequences.js','server/services/strikeApprovals.js','server/services/blockApprovals.js','server/handlers/actorConsequenceHandlers.js',
 'vtt-react/src/services/actorConsequenceService.js','vtt-react/src/services/spellConsequenceService.js','vtt-react/src/services/weaponStrikeService.js','vtt-react/src/services/blockingService.js',
 'vtt-react/src/services/spellConsequenceCustody.js','vtt-react/src/services/weaponStrikeCustody.js','vtt-react/src/services/blockingCustody.js',
 'vtt-react/src/services/firebase/characterPersistenceService.js','vtt-react/src/store/characterHelpers.js','vtt-react/src/store/characterSlices/coreSlice.js','vtt-react/src/store/characterSlices/resourceSlice.js','vtt-react/src/persistence/privateStorageRegistry.js',
 'vtt-react/src/components/spellcrafting-wizard/components/steps/Step5Resources.jsx','vtt-react/src/components/spellcrafting-wizard/core/utils/spellSerializer.js','vtt-react/src/components/spellcrafting-wizard/core/utils/spellNormalizer.js','vtt-react/src/components/spellcrafting-wizard/SpellwizardApp.jsx','vtt-react/src/components/spellcrafting-wizard/components/steps/Step10Review.jsx','vtt-react/src/components/spellcrafting-wizard/context/spellWizardContext.js',
 'vtt-react/src/utils/characterClassAccess.js','vtt-react/src/utils/pointBuySystem.js','vtt-react/src/data/heritageEdgeAdapter.js','vtt-react/src/data/heritageCapabilityConsumers.js','vtt-react/src/utils/spellEffects.js','vtt-react/src/components/character-sheet/SpellActionBar.jsx'
];for(const file of focus){read(file);result.capabilityFiles.push({path:file,sha256:hashes[file]});}
const classFiles=fs.readdirSync(path.join(src,'data/classes')).filter(f=>/Data\.js$/.test(f)&&!/^class/.test(f));
const fileFor={};for(const f of classFiles){for(const d of Object.values(load(`data/classes/${f}`)))if(d?.name&&d?.subraceVariants)fileFor[d.name]=`vtt-react/src/data/classes/${f}`;}
const cohorts=[['CR0-H1-humans',['human']],['CR0-H2-stellar-industrial',['astril','fexrick']],['CR0-H3-body-and-grove',['florae','groven','mimir']],['CR0-H4-threshold',['neth','vreken']],['CR0-H5-fire-and-water',['solari','myrathil']]];
const reviewed=[];
for(const[id,raceIds]of cohorts){let md=`# ${id}: current source review extracts\n\nAUTHORED source, not automatic execution or approved successor origins. Full payloads retained in original census; this extract selects cultural, native-variant and edge fields for manual review.\n\n`;
  const rows=[];
  for(const raceId of raceIds){const file=`vtt-react/src/data/races/${raceId}.js`;const race=load(`data/races/${raceId}.js`)[raceId];
    md+=`## ${race.name} (${raceId})\n\n`;
    for(const key of ['cardFlavor','overview','culturalBackground','integrationNotes','diasporaVariation','meaningfulTradeoffs','currentCrisis'])if(race[key])md+=`### ${key}\n\n${typeof race[key]==='string'?race[key]:JSON.stringify(race[key],null,2)}\n\n`;
    for(const[heritageId,h]of Object.entries(registry.HERITAGE_TRADITIONS).filter(([,h])=>h.raceId===raceId)){
      const sub=Object.values(race.subraces||{}).find(s=>registry.resolveClassHeritageId(raceId,s.id||s.name)===heritageId);
      assert(sub,`No subrace record ${heritageId}`);
      const row={heritageId,...h,raceFile:file,subrace:sub,pairings:[],rareEdges:[]};
      md+=`### ${h.name} — ${heritageId}\n\nNative: ${h.classes.join(', ')}.\n\n`;
      for(const key of ['description','culturalBackground','culturalNotes','traditions','currentCrisis','meaningfulTradeoffs','classSynergy','classCompatibility','flavor','lore'])if(sub[key])md+=`**${key}:** ${typeof sub[key]==='string'?sub[key]:JSON.stringify(sub[key])}\n\n`;
      md+=`Subrace authored keys: ${Object.keys(sub).join(', ')}.\n\n`;
      for(const name of h.classes){const c=BASE_CLASSES_DATA[name],cf=fileFor[name];const e=HERITAGE_EDGES[`${name}|${heritageId}`]||null;
        const pairing={className:name,classFile:cf,variantLines:cf?locations(cf,heritageId):[],variant:c.subraceVariants?.[heritageId]||null,provenance:registry.CLASS_PROVENANCE[name],edge:e,edgeLines:locations('vtt-react/src/data/heritageEdgeContract.js',`${name}|${heritageId}`),access:registry.getClassHeritageAccess(name,raceId,heritageId),order:c.livingOrder,worldFriction:c.worldFriction};
        row.pairings.push(pairing);
        md+=`#### ${name}\n\nSource ${cf}:${pairing.variantLines.join('/')}\n\n${JSON.stringify({variant:pairing.variant,edge:e,access:pairing.access,order:pairing.order},null,2)}\n\n`;
      }
      row.rareEdges=Object.values(HERITAGE_EDGES).filter(e=>e.heritageId===heritageId&&e.access==='E');
      md+=`Rare-route authored edges:\n\n${JSON.stringify(row.rareEdges,null,2)}\n\n`;rows.push(row);reviewed.push(heritageId);
    }
  }
  fs.writeFileSync(path.join(__dirname,`${id}-extract.md`),md);
  fs.writeFileSync(path.join(__dirname,`${id}-source.json`),JSON.stringify({version:1,cohort:id,rows},null,2)+'\n');
}
assert.equal(reviewed.length,25);assert.equal(new Set(reviewed).size,25);
fs.writeFileSync(path.join(__dirname,'headq-source-baseline.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({branch:result.branch,head:result.head,changedSincePrior:result.changedSincePrior,p9Support:result.p9Support,cohorts:cohorts.map(c=>c[0]),heritageRecords:reviewed.length,hashedFiles:Object.keys(hashes).length},null,2));
