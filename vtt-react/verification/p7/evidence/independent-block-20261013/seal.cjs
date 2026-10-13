const fs=require('fs'),path=require('path'),crypto=require('crypto');const root='D:/VTT',out=__dirname,hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const after=JSON.parse(fs.readFileSync(out+'/after.json'));
const p6=JSON.parse(fs.readFileSync(root+'/vtt-react/verification/p6/evidence/independent-container-acceptance-20261012/after.json'));
const preserved=Object.keys(p6.hashes).filter(f=>/^vtt-react\/verification\/(p6|p5-01)\//.test(f));
const preservedDrift=preserved.filter(f=>!fs.existsSync(path.join(root,f))||hash(fs.readFileSync(path.join(root,f)))!==p6.hashes[f]);
const nowDrift=Object.entries(after.hashes).filter(([f,h])=>!fs.existsSync(path.join(root,f))||hash(fs.readFileSync(path.join(root,f)))!==h).map(e=>e[0]);
const result={preservedCount:preserved.length,preservedDrift,postFinalInventoryDrift:nowDrift};fs.writeFileSync(out+'/seal.json',JSON.stringify(result,null,2));
const artifacts={};function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory()){if(!['build','baseline','starting'].includes(e.name))walk(f);}else if(path.resolve(f)!==path.resolve(out,'artifact-manifest.json'))artifacts[path.relative(out,f).replace(/\\/g,'/')]=hash(fs.readFileSync(f));}}
walk(out);fs.writeFileSync(out+'/artifact-manifest.json',JSON.stringify({excluded:['build/ generated assets','baseline/ extracted starting-source test checkout','starting/ diff input copies'],artifacts},null,2));console.log(JSON.stringify({...result,independentArtifacts:Object.keys(artifacts).length},null,2));
