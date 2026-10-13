const fs=require('fs'),path=require('path'),zlib=require('zlib'),cp=require('child_process');
const root='D:/VTT',out=__dirname;
const snapshot=JSON.parse(zlib.gunzipSync(fs.readFileSync(root+'/vtt-react/verification/p7/evidence/starting-source.json.gz')));
const files=process.argv.slice(2);
for(const file of files){const old=path.join(out,'starting',file);fs.mkdirSync(path.dirname(old),{recursive:true});fs.writeFileSync(old,Buffer.from(snapshot.files[file],'base64'));const r=cp.spawnSync('git',['diff','--no-index','--',old,path.join(root,file)],{encoding:'utf8',maxBuffer:16*1024*1024});fs.writeFileSync(path.join(out,path.basename(file)+'.diff'),r.stdout||'');console.log(r.stdout||'No change: '+file);}
