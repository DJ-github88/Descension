const fs=require('fs'),path=require('path'),cp=require('child_process');
const root=path.resolve(__dirname,'../../..'),base='D:/AppData/Temp/opencode/p7-baseline-20261013';
const snapshot=JSON.parse(require('zlib').gunzipSync(fs.readFileSync(path.join(__dirname,'evidence/starting-source.json.gz'))));
for(const [file,encoded] of Object.entries(snapshot.files)) {
  if(!file.startsWith('server/'))continue;
  const target=path.join(base,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,Buffer.from(encoded,'base64'));
}
for(const [destination,source] of [['server/tests/p7Negative.production.test.js','server/tests/p7Negative.production.test.js'],['vtt-react/src/services/__tests__/p7Negative.production.test.js','vtt-react/src/services/__tests__/p7Negative.production.test.js']]) {
  const target=path.join(base,destination);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,source),target);
}
const modules=path.join(base,'server/node_modules');if(!fs.existsSync(modules))fs.symlinkSync(path.join(root,'server/node_modules'),modules,'junction');
fs.copyFileSync(path.join(root,'server/package.json'),path.join(base,'server/package.json'));
fs.mkdirSync(path.join(base,'vtt-react/verification/p7/evidence'),{recursive:true});
for(const [name,cwd,args] of [
  ['server',path.join(base,'server'),['--require',path.join(__dirname,'preload.cjs'),path.join(root,'server/node_modules/mocha/bin/mocha.js'),'tests/p7Negative.production.test.js','--timeout','10000','--exit']],
  ['frontend',path.join(base,'vtt-react'),[path.join(root,'vtt-react/node_modules/react-scripts/bin/react-scripts.js'),'test','--watchAll=false','--runInBand','--silent','--no-cache','--runTestsByPath','src/services/__tests__/p7Negative.production.test.js']]
]) {
  const result=cp.spawnSync(process.execPath,args,{cwd,env:{...process.env,P7_RED:'1',CI:'true'},encoding:'utf8',timeout:120000});
  fs.writeFileSync(path.join(__dirname,`evidence/negative-replay-${name}.log`),(result.stdout||'')+(result.stderr||''));
  fs.writeFileSync(path.join(__dirname,`evidence/negative-replay-${name}.json`),JSON.stringify({command:[process.execPath,...args],cwd,status:result.status,source:'starting-source.json.gz'},null,2));
  if(result.status!==0)throw Error('Frozen negative witness did not reproduce: '+name);
}
console.log('Frozen pre-fix server and condition negatives reproduced (2/2)');
