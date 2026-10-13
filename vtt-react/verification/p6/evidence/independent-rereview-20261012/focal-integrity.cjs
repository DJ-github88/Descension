const fs=require('fs'),assert=require('assert/strict'),path=require('path'),crypto=require('crypto');
const read=f=>JSON.parse(fs.readFileSync(path.join(__dirname,f),'utf8'));
const before=read('before.json'),after=read('after.json'),green=read('green.json');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const focal=[...Object.keys(green.manifest).map(f=>'vtt-react/src/'+f),
 'vtt-react/src/persistence/__tests__/p6CharacterSave.production.test.jsx',
 'vtt-react/src/persistence/__tests__/characterHandoffPreservation.test.js',
 'vtt-react/verification/p6/regressions-browser.cjs','vtt-react/verification/p6/character-save-browser.cjs',
 'vtt-react/verification/p6/freeze-reviewed.cjs','vtt-react/verification/p6/finalize-evidence.cjs',
 'vtt-react/verification/p5-01/character-browser-harness.cjs','vtt-react/verification/p5-01/character-preservation-browser.cjs',
 'docs/MYTHRILL_NEXT_PHASE.md','docs/MYTHRILL_PROJECT_6_CONTRACT.md',
 'docs/MYTHRILL_P5_01_INDEPENDENT_ACCEPTANCE_20261012.md',
 'docs/MYTHRILL_P6_INDEPENDENT_BLOCK_20261012.md','docs/MYTHRILL_P6_R1_R6_CORRECTIONS_20261012.md',
 'vtt-react/src/components/rules/ClassCodex.css'];
for(const f of focal)assert.equal(before.hashes[f],after.hashes[f],f);
const originalReport='D:/VTT/vtt-react/verification/p6/evidence/independent-20261012/review.md';
assert.equal(hash(fs.readFileSync(originalReport)),after.hashes['docs/MYTHRILL_P6_INDEPENDENT_BLOCK_20261012.md']);
const p6=read('p6-browser.log');for(const [f,h]of Object.entries(p6.manifest))assert.equal(after.hashes['vtt-react/src/'+f],h);
const p5Line=fs.readFileSync(path.join(__dirname,'p5-browser.log'),'utf8').split('\n')[0].replace('SOURCE_MANIFEST ','');
for(const[f,h]of Object.entries(JSON.parse(p5Line)))assert.equal(after.hashes['vtt-react/src/'+f],h.toLowerCase());
const selected=focal.filter(f=>/verification|Contract|CONTRACT|ClassCodex|characterSaveOutcome|characterShapeCodec|characterPersistenceService|characterStateService|characterSessionService|characterSyncService|coreSlice|useCharacterPersistence|CharacterPersistenceProvider|CharacterSaveStatus|production.test/.test(f));
fs.writeFileSync(path.join(__dirname,'focal-hashes.md'),'# Independent reviewed hashes\n\nCheckout D:/VTT; HEAD '+after.head+'; reviewed uncommitted bytes.\nAll '+new Set(focal).size+' focal production/witness/contract paths unchanged before/after. Full identities in before.json/after.json.\n\n| Path | Before SHA256 | After SHA256 |\n|---|---|---|\n'+selected.map(f=>'| `'+f+'` | `'+before.hashes[f]+'` | `'+after.hashes[f]+'` |').join('\n')+'\n');
fs.writeFileSync(path.join(__dirname,'integrity-summary.json'),JSON.stringify({head:after.head,focalCount:new Set(focal).size,focalUnchanged:true,p6ManifestVerified:true,p5ManifestVerified:true,correctionEvidenceUnchanged:after.evidenceCheck.every(x=>x.match),snapshotVerified:after.snapshotCheck.every(x=>x.match),concurrentDrift:after.reviewDrift,sourceIdentityDrift:after.drift},null,2));
console.log(JSON.stringify({focalCount:new Set(focal).size,focalUnchanged:true,concurrentDrift:after.reviewDrift}));
