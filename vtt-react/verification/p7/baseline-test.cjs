/** Execute a disputed unrelated test against the immutable starting source. */
const fs=require('fs'),path=require('path'),zlib=require('zlib'),cp=require('child_process');
const root=path.resolve(__dirname,'../../..'),temporary='D:/AppData/Temp/opencode/p7-baseline-20261013';
const source=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(__dirname,'evidence/starting-source.json.gz'))));
fs.mkdirSync(path.join(temporary,'vtt-react'),{recursive:true});
for(const [file,encoded] of Object.entries(source.files)) {
  if(!file.startsWith('vtt-react/src/'))continue;
  const target=path.join(temporary,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,Buffer.from(encoded,'base64'));
}
fs.copyFileSync(path.join(root,'vtt-react/package.json'),path.join(temporary,'vtt-react/package.json'));
const modules=path.join(temporary,'vtt-react/node_modules');if(!fs.existsSync(modules))fs.symlinkSync(path.join(root,'vtt-react/node_modules'),modules,'junction');
const args=[path.join(root,'vtt-react/node_modules/react-scripts/bin/react-scripts.js'),'test','--watchAll=false','--runInBand','--silent','--no-cache','--runTestsByPath','src/data/classes/pyrofiend/__tests__/PyrofiendResourceBar.test.jsx'];
const result=cp.spawnSync(process.execPath,args,{cwd:path.join(temporary,'vtt-react'),env:{...process.env,CI:'true'},encoding:'utf8',timeout:120000});
fs.writeFileSync(path.join(__dirname,'evidence/baseline-pyrofiend.log'),(result.stdout||'')+(result.stderr||''));
const record={command:[process.execPath,...args],cwd:path.join(temporary,'vtt-react'),status:result.status,source:'starting-source.json.gz',error:result.error?.message||null};
fs.writeFileSync(path.join(__dirname,'evidence/baseline-pyrofiend.json'),JSON.stringify(record,null,2));console.log(JSON.stringify(record,null,2));
