const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const out=__dirname,hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const integrity=JSON.parse(fs.readFileSync(path.join(out,'integrity-summary.json')));
assert.deepEqual(integrity.changed,[]);assert.deepEqual(integrity.added,[]);assert(integrity.headUnchanged);
assert.equal(fs.readFileSync(path.join(out,'build.exit'),'utf8').trim(),'0');assert(fs.readFileSync(path.join(out,'build.log'),'utf8').includes('Compiled successfully.'));
for(const label of ['container-red','container-historical','container-green','remaining-green','retained-r1-r6','original-p5','original-p6','retained-supplemental','regressions','lint'])assert.equal(JSON.parse(fs.readFileSync(path.join(out,label+'.exit.json'))).status,0,label);
assert.equal(fs.readFileSync(path.join(out,'lint.utf8.log'),'utf8'),'');
const manifest={};
for(const file of fs.readdirSync(out)){const full=path.join(out,file);if(fs.statSync(full).isFile()&&file!=='artifact-manifest.json')manifest[file]=hash(full);}
manifest['build/asset-manifest.json']=hash(path.join(out,'build/asset-manifest.json'));
fs.writeFileSync(path.join(out,'artifact-manifest.json'),JSON.stringify(manifest,null,2));
console.log(JSON.stringify({verdict:'P6 SOURCE PASS',review:path.join(out,'review.md'),reviewSha256:manifest['review.md'],artifacts:Object.keys(manifest).length,integrity},null,2));
