const fs=require('fs'),path=require('path'),crypto=require('crypto');const out=__dirname;
const records=fs.readdirSync(out).filter(f=>f.endsWith('.json')).map(f=>{try{return {artifact:f,...JSON.parse(fs.readFileSync(path.join(out,f)))};}catch{return null;}}).filter(r=>r&&r.command);
const before=JSON.parse(fs.readFileSync(out+'/before.json')),after=JSON.parse(fs.readFileSync(out+'/after.json')),build=JSON.parse(fs.readFileSync(out+'/build-start.json'));
const buildDrift=Object.keys({...build.hashes,...after.hashes}).filter(f=>build.hashes[f]!==after.hashes[f]&&/^(vtt-react\/(src|public)\/|vtt-react\/(package|craco|config))/.test(f));
const witnessFiles=Object.keys(before.hashes).filter(f=>/^vtt-react\/verification\/(p7|p6|p5-01)\/.*\.(cjs|js)$/.test(f));
const summary={commands:records.map(r=>({artifact:r.artifact,command:r.command,cwd:r.cwd,status:r.status,durationMs:r.durationMs})),buildDrift,witnessDrift:witnessFiles.filter(f=>before.hashes[f]!==after.hashes[f]),focalDrift:after.focal.filter(f=>before.hashes[f.file]!==after.hashes[f.file]),allDrift:after.drift};
fs.writeFileSync(out+'/validation-summary.json',JSON.stringify(summary,null,2));
fs.writeFileSync(out+'/focal-hashes.md','# Independent P7 focal before/after SHA256\n\n| File | Before | After |\n|---|---|---|\n'+after.focal.map(f=>`| \`${f.file}\` | \`${before.hashes[f.file]}\` | \`${after.hashes[f.file]}\` |`).join('\n')+'\n\n## Permanent runner hashes\n\n'+witnessFiles.map(f=>`- \`${f}\`: \`${after.hashes[f]}\``).join('\n'));
console.log(JSON.stringify(summary,null,2));
