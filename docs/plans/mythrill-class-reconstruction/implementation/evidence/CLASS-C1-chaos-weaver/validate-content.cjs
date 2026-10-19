/* Planning-package check only. Reads specifications and current source identities;
 * writes planning evidence. Does not import/run or modify application modules. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../../../../../..');
const packageRoot = path.resolve(__dirname, '../../..');
const file = path.join(packageRoot, 'implementation/CLASS-C1-CHAOS-WEAVER.md');
const text = fs.readFileSync(file, 'utf8');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const optional = [...text.matchAll(/^\|(\d{2})\|(\d+) ([DU]) ([^|]+)\|([^|]+)\|([^|]+)\|$/gm)].map(m=>({
  slot:m[1],id:m[1]==='07'?'cr1_chaos_weaver_read_instability':`cw1_${m[1]}`,
  level:Number(m[2]),category:m[3]==='D'?'damage':'nondamage',name:m[4],price:m[5],rule:m[6]
}));
assert.equal(optional.length,40);
assert.equal(new Set(optional.map(r=>r.id)).size,40);
const levels = Array.from({length:10},(_,index)=>{
  const level=index+1, rows=optional.filter(r=>r.level===level);
  assert.equal(rows.length,4);assert.ok(rows.filter(r=>r.category==='nondamage').length>=2);
  return {level,options:rows.map(r=>r.id),nondamage:rows.filter(r=>r.category==='nondamage').length,picks:level,talentBudget:level*5};
});
const passiveOrGrants = [...text.matchAll(/^\|([PAC])(\d{2}) ([^|]+)\|([^|]+)\|$/gm)].map(m=>({prefix:m[1],number:Number(m[2]),name:m[3],rule:m[4]}));
assert.equal(passiveOrGrants.length,54);
const pointGates = [0,0,5,5,10,10,10,15,15,20,20,25,25,30,30,35,35,45];
const predecessorNumbers = [[],[],[1],[2],[3],[3],[4],[6],[7],[8],[9],[10],[11],[12],[13],[14],[15],[5,16,17]];
const trees = ['P','A','C'].map(prefix=>{
  const slug={P:'ps',A:'ab',C:'ca'}[prefix];
  const rows=passiveOrGrants.filter(r=>r.prefix===prefix);
  assert.equal(rows.length,18);
  assert.deepEqual(rows.map(r=>r.number),Array.from({length:18},(_,i)=>i+1));
  const nodes=rows.map(r=>({...r,id:`cw1_${slug}_n${String(r.number).padStart(2,'0')}`,
    maxRanks:[5,18].includes(r.number)?1:3,requiresPoints:pointGates[r.number-1],requiresAll:true,
    requires:predecessorNumbers[r.number-1].map(n=>`cw1_${slug}_n${String(n).padStart(2,'0')}`)}));
  assert.equal(nodes.reduce((sum,n)=>sum+n.maxRanks,0),50);
  const byId=Object.fromEntries(nodes.map(n=>[n.id,n])),ranks={};let points=0;
  // Verify the published signature-first full-tree allocation, not only rank totals.
  const allocation=[1,1,1,2,2,2,3,3,3,4,5,4,4,...Array.from({length:11},(_,i)=>i+6).flatMap(n=>[n,n,n]),17,17,17,18];
  assert.equal(allocation.length,50);
  const witness=[];
  for(const number of allocation) {
    const node=nodes[number-1];
    assert.ok(points>=node.requiresPoints,`gate ${node.id}`);
    assert.ok(node.requires.every(id=>(ranks[id]||0)===byId[id].maxRanks),`prerequisite ${node.id}`);
    assert.ok((ranks[node.id]||0)<node.maxRanks);
    ranks[node.id]=(ranks[node.id]||0)+1;points++;
    if(number===5||number===18) witness.push({node:node.id,point:points,earliestLevel:Math.ceil(points/5)});
  }
  assert.equal(points,50);assert.equal(witness[0].point,11);assert.equal(witness[1].point,50);
  return {tree:slug,maxRanks:50,nodes,legalAllocation:allocation,signatureAndCapstoneWitness:witness};
});
const core=['cr1_chaos_weaver_fold_odds','cr1_chaos_weaver_split_possibility','cw1_dismiss_anomaly'];
const talentActives=['cr1_chaos_weaver_bias_draw','cr1_chaos_weaver_unsteady_ground','cr1_chaos_weaver_second_possibility','cw1_closed_distribution','cw1_last_boundary','cw1_single_aftershock'];
const passiveIds=trees.flatMap(t=>t.nodes.filter(n=>n.maxRanks===3).map(n=>`talent_spell_${n.id}`));
const allIds=[...optional.map(r=>r.id),...core,...talentActives,...passiveIds];
assert.equal(allIds.length,97);assert.equal(new Set(allIds).size,97);
const baselineFiles=[
  'server/services/authoredSpellDefinitions.js','server/tests/authoredSpellDefinitions.test.js','server/tests/fixtures/crA1aDefinitionVectors.json',
  'server/services/actorConsequences.js','server/services/spellPayments.js','server/services/strikeApprovals.js','server/services/blockApprovals.js',
  'server/handlers/actorConsequenceHandlers.js','server/handlers/socketHandlers.js','server/services/roomAuthorityService.js',
  'server/services/roomCheckpoint.js','server/services/syncService.js','server/services/firebaseService.js',
  'server/tests/p9SpellConsequences.production.test.js','server/tests/p12aWeaponStrike.production.test.js','server/tests/p12bBlockWear.production.test.js',
  'vtt-react/src/components/spellcrafting-wizard/components/steps/Step5Resources.jsx',
  'vtt-react/src/components/spellcrafting-wizard/core/mechanics/resourceManager.js',
  'vtt-react/src/components/spellcrafting-wizard/core/utils/spellSerializer.js',
  'vtt-react/src/data/classes/index.js','vtt-react/src/data/classHeritageRegistry.js','vtt-react/src/data/talentTreeData.js',
  'vtt-react/src/components/rules/ClassesDisplay.jsx',
  'docs/plans/mythrill-class-reconstruction/implementation/evidence/CR-A1a-independent-review/review.md',
  'docs/plans/mythrill-class-reconstruction/implementation/evidence/CR-A1a-independent-review/independent-probes.cjs'
];
const hashes=Object.fromEntries(baselineFiles.map(file=>[file,sha(fs.readFileSync(path.join(root,file)))]));
const a1a=JSON.parse(fs.readFileSync(path.join(packageRoot,'implementation/evidence/CR-A1a/new-source-hashes.json'),'utf8'));
for(const [file,expected] of Object.entries(a1a.files)) assert.equal(hashes[file],expected);
const result={checkedAt:new Date().toISOString(),scope:'Planning content/cardinality/build-path checks; no application implementation, effect or playtest acceptance',
  packageSha256:sha(fs.readFileSync(file)),optional:40,core:3,talentActives:6,passives:48,spellRecords:97,
  treeCount:3,nodeCount:54,capacityPerTree:50,characterTalentCap:50,levels,
  pathWitnesses:trees.map(t=>({tree:t.tree,...Object.fromEntries(t.signatureAndCapstoneWitness.map(w=>[w.point===11?'signature':'capstone',w]))})),
  correctedA1aIdentityMatches:true,originalIndependentFindingsAndProbeSourcePreservedAsInputs:true,sourceHashes:hashes};
fs.writeFileSync(path.join(__dirname,'content-index.json'),JSON.stringify({evidenceLabel:'PROPOSED-C1-content-index-not-runtime-DTO',optional,core,talentActives,passiveIds,trees},null,2)+'\n');
fs.writeFileSync(path.join(__dirname,'planning-validation.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({optional:result.optional,spellRecords:result.spellRecords,nodes:result.nodeCount,capacityPerTree:50,pathWitnesses:result.pathWitnesses,correctedA1aIdentityMatches:true,sourceWrites:0},null,2));
