/* Planning artifact validation only. Does not claim the master assignment is complete. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const base = path.resolve(__dirname,'..'), root = path.resolve(base,'../../..');
const walk = dir => fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk(base), errors=[], links=[];
for(const file of files){
  if(!fs.statSync(file).size) errors.push(`Empty artifact ${file}`);
  if(file.endsWith('.json')) {try {JSON.parse(fs.readFileSync(file,'utf8'));} catch(e){errors.push(`${file}: ${e.message}`);}}
  if(!file.endsWith('.md'))continue;
  const text=fs.readFileSync(file,'utf8');
  for(const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)){
    const target=match[1].split('#')[0];
    if(!target||/^(https?:|mailto:|file:)/i.test(target)) continue;
    const resolved=path.resolve(path.dirname(file),decodeURIComponent(target));
    links.push({from:path.relative(base,file),target});
    if(!fs.existsSync(resolved)) errors.push(`Broken link ${path.relative(base,file)} -> ${target}`);
  }
}
const census=JSON.parse(fs.readFileSync(path.join(__dirname,'current-census.json'),'utf8'));
const spells=JSON.parse(fs.readFileSync(path.join(__dirname,'authored-spells.json'),'utf8'));
const history=JSON.parse(fs.readFileSync(path.join(__dirname,'historical-census.json'),'utf8'));
const old=JSON.parse(fs.readFileSync(path.join(__dirname,'historical-definitions.json'),'utf8'));
assert.equal(census.baseClasses,21);assert.equal(census.heritageCount,25);assert.equal(census.nativeRelationships,102);
assert.equal(census.authoredSpells,spells.length);assert.equal(new Set(spells.map(s=>s.id)).size,spells.length);
assert.equal(census.p9Supported.length,4);
assert.equal(census.trees.length,65);assert(census.trees.every(t=>t.points===50 && !t.invalidPrerequisites.length));
assert.equal(Object.keys(old.classes).filter(name=>!name.includes('backup')).length,30);
assert.equal(history.historicalLoadFailures.length,0);
const drift=Object.entries(census.sourceHashes).filter(([file,hash])=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')!==hash).map(([file])=>file);
const report={checkedAt:new Date().toISOString(),artifactFiles:files.length,markdownFiles:files.filter(f=>f.endsWith('.md')).length,localLinksChecked:links.length,historicalPathIdentities:history.classes.length,errors,sourceDriftSinceCensus:drift,masterAssignmentComplete:false,
  remaining:'See26_COMPLETION_AND_CONTINUATION.md. Artifact checks validate evidence consistency and links, not missing full class designs/content or application behavior.'};
fs.writeFileSync(path.join(__dirname,'package-validation.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
assert.equal(errors.length,0,'Planning artifact errors');
if(drift.length) console.warn('Census has live source drift; preserve the old snapshot and refresh relevant claims before implementation.');
