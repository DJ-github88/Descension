const fs=require('fs'), Module=require('module'), path=require('path');
const filename='D:/VTT/vtt-react/verification/p6/evidence/independent-20261012/supplemental.cjs';
let code=fs.readFileSync(filename,'utf8');
code=code.replace('async function scenario(name, fn) {',`async function scenario(name, fn) { if(!['runtime-serialized-overlapping-writes-and-later-edit','canonical-serialized-overlapping-writes','mounted-cyclic-export-refusal','reachable-sync-reconciliation-outcome'].includes(name))return;`);
code=code.replace("path.join(__dirname,'supplemental-results.json')",JSON.stringify(path.join(__dirname,'retained-controls.json')));
code=code.replace("path.join(__dirname,'supplemental-partial.json')",JSON.stringify(path.join(__dirname,'retained-controls-partial.json')));
code=code.replace('const evidence = await fn(page);',`const evidence = await fn(page); if(name==='reachable-sync-reconciliation-outcome'){assert.equal(evidence.result.synced,0);assert.equal(evidence.result.failed,1);assert.equal(evidence.queue.length,1);assert.equal(evidence.draft.lore.notes,'newer canonical retained');}`);
const loaded=new Module(filename,module);loaded.filename=filename;loaded.paths=Module._nodeModulePaths(path.dirname(filename));loaded._compile(code,filename);
