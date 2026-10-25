// Detached normal CRACO build on accepted A8 inputs + exact current scoped A9 inputs.
// Concurrent unrelated Class integration can be incomplete without altering its files.
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto'),assert=require('assert/strict');
const root=path.resolve(__dirname,'../../..'),frontend=path.join(root,'vtt-react'),out=process.env.A9_BUILD_OUTPUT;
if(!out||!path.isAbsolute(out)||out.startsWith(root+path.sep))throw Error('External A9_BUILD_OUTPUT required');
const base='D:/AppData/Temp/opencode/p14a8-build4',accepted=JSON.parse(fs.readFileSync(path.join(base,'build.json')));
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
fs.mkdirSync(out,{recursive:true});const mirror=path.join(out,'workspace');fs.mkdirSync(mirror);
for(const [p,h]of Object.entries(accepted.hashes)){const src=path.join(base,'workspace',p);assert.equal(sha(src),h,p);const dst=path.join(mirror,p);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.copyFileSync(src,dst);}
for(const p of fs.readdirSync(path.join(base,'workspace')).filter(p=>p.startsWith('.env')))fs.copyFileSync(path.join(base,'workspace',p),path.join(mirror,p));
const overlay=require('./record-pc-target-condition-evidence.cjs').runtime.filter(p=>p.startsWith('vtt-react/')).map(p=>p.slice(10));
for(const p of overlay){fs.mkdirSync(path.dirname(path.join(mirror,p)),{recursive:true});fs.copyFileSync(path.join(frontend,p),path.join(mirror,p));}
fs.symlinkSync(path.join(frontend,'node_modules'),path.join(mirror,'node_modules'),'junction');
const hashes=Object.fromEntries([...new Set([...Object.keys(accepted.hashes),...overlay])].map(p=>[p,sha(path.join(mirror,p))]));
const fd=fs.openSync(path.join(out,'build.log'),'w'),startedAt=new Date().toISOString();
const result=cp.spawnSync(process.execPath,[path.join(mirror,'node_modules/@craco/craco/dist/bin/craco.js'),'build'],{cwd:mirror,env:{...process.env,CI:'',NODE_OPTIONS:'--max-old-space-size=8192',BUILD_PATH:path.join(out,'app')},stdio:['ignore',fd,fd],timeout:900000});fs.closeSync(fd);
const drift=base=>Object.entries(hashes).filter(([p,h])=>!fs.existsSync(path.join(base,p))||sha(path.join(base,p))!==h).map(([p])=>p);
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const addedLiveInputs=[...walk(path.join(frontend,'src')),...walk(path.join(frontend,'public'))].map(p=>path.relative(frontend,p).replace(/\\/g,'/')).filter(p=>!hashes[p]);
const record={exit:result.status,startedAt,endedAt:new Date().toISOString(),hashes,overlay,base:'accepted A8 Build4 recorded production inputs (verified before copy)',mirrorDrift:drift(mirror),concurrentLiveDrift:drift(frontend),addedLiveInputs,assetManifestSha256:fs.existsSync(path.join(out,'app/asset-manifest.json'))?sha(path.join(out,'app/asset-manifest.json')):null,config:'Unmodified normal optimized CRACO/config/dependencies. Current A9 scoped files over coherent accepted A8 inputs; not a full-current-tree build claim.'};
fs.writeFileSync(path.join(out,'build.json'),JSON.stringify(record,null,2));fs.writeFileSync(path.join(out,'build.exit'),String(result.status));process.exit(result.status===0?0:1);
