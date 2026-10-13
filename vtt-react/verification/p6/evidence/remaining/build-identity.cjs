const fs=require('fs'),cp=require('child_process'),crypto=require('crypto'),path=require('path');
const root='D:/VTT';const label=process.argv[2];
const files=cp.execFileSync('git',['ls-files','--cached','--others','--exclude-standard'],{cwd:root,encoding:'utf8',maxBuffer:64*1024*1024}).trim().split('\n').filter(f=>f.startsWith('vtt-react/src/')||['vtt-react/craco.config.js','vtt-react/package.json','vtt-react/package-lock.json','vtt-react/.eslintrc.js'].includes(f));
const hashes=Object.fromEntries(files.map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(root+'/'+f)).digest('hex')]));
const result={date:new Date().toISOString(),hashes};if(label.endsWith('after')){const before=JSON.parse(fs.readFileSync(path.join(__dirname,'build-'+label.replace(/after$/,'before')+'.json')));result.drift=Object.keys({...before.hashes,...hashes}).filter(f=>before.hashes[f]!==hashes[f]);}
fs.writeFileSync(path.join(__dirname,'build-'+label+'.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({files:files.length,drift:result.drift}));
