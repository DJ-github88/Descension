const fs = require('fs'), cp = require('child_process'), path = require('path'), crypto = require('crypto');
const root = 'D:/VTT';
const git = (...args) => cp.execFileSync('git', args, {cwd:root, encoding:'utf8', maxBuffer:64*1024*1024}).trim();
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const phase = process.argv[2];
const files = git('ls-files','--cached','--others','--exclude-standard','-z').split('\0').filter(Boolean);
const hashes = Object.fromEntries(files.map(file => [file, hash(fs.readFileSync(path.join(root,file)))]));
// Include ignored preserved verification evidence as well.
function walk(directory) { for(const entry of fs.readdirSync(path.join(root,directory),{withFileTypes:true})) {
  const file=directory+'/'+entry.name; if(entry.isDirectory())walk(file);else hashes[file]=hash(fs.readFileSync(path.join(root,file)));
} }
walk('vtt-react/verification');
const record = {date:new Date().toISOString(), checkout:git('rev-parse','--show-toplevel'), head:git('rev-parse','HEAD'), status:git('status','--porcelain=v1','--untracked-files=all'), hashes};
fs.writeFileSync(path.join(__dirname,phase+'.json'),JSON.stringify(record,null,2));
if(phase==='before') {
  const previous=JSON.parse(fs.readFileSync(root+'/vtt-react/verification/p6/evidence/remaining/final-identity.json','utf8'));
  const drift=Object.keys(previous.hashes).filter(file=>hashes[file]!==previous.hashes[file]);
  fs.writeFileSync(path.join(__dirname,'handoff-drift.json'),JSON.stringify({drift},null,2));
  console.log(JSON.stringify({checkout:record.checkout,head:record.head,files:Object.keys(hashes).length,handoffDrift:drift},null,2));
} else {
  const before=JSON.parse(fs.readFileSync(path.join(__dirname,'before.json'),'utf8'));
  const changed=Object.keys(before.hashes).filter(file=>before.hashes[file]!==hashes[file]);
  const added=Object.keys(hashes).filter(file=>!before.hashes[file]);
  fs.writeFileSync(path.join(__dirname,'integrity-summary.json'),JSON.stringify({headUnchanged:before.head===record.head,statusUnchanged:before.status===record.status,changed,added},null,2));
  console.log(JSON.stringify({headUnchanged:before.head===record.head,statusUnchanged:before.status===record.status,changed,added},null,2));
}
