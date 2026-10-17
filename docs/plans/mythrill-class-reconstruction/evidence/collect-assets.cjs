const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const root = path.resolve(__dirname,'../../../..');
const git = (...args) => cp.execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024}).trim();
const historyPaths = [...new Set(git('log','--all','--format=','--name-only','--','vtt-react/public/assets/icons/classes').split('\n').filter(Boolean))].sort();
const historicalBasenames = [...new Set(historyPaths.map(file=>path.posix.basename(file)))].sort();
const currentPaths = git('ls-files','--cached','--others','--exclude-standard','--','vtt-react/public/assets').split('\n').filter(file=>/\/classes\//i.test(file));
const assets = currentPaths.filter(file=>fs.existsSync(path.join(root,file))).map(file=>{
  const bytes=fs.readFileSync(path.join(root,file));
  return {path:file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),kind:file.includes('/icons/')?'class-icon-or-derivative':'class-illustration'};
});
const result={capturedAt:new Date().toISOString(),head:git('rev-parse','HEAD'),historicalIconPathCount:historyPaths.length,historicalIconBasenames:historicalBasenames,historicalIconPaths:historyPaths,currentAssets:assets,scope:'Class-directory icon and illustration paths only; spell icons, legacy backgrounds, out-of-tree art and per-image suitability remain to inspect. Basenames/formats/derivatives are not classes.'};
fs.writeFileSync(path.join(__dirname,'asset-inventory.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({historicalIconBasenames:historicalBasenames,currentAssets:assets.length,kindCounts:assets.reduce((m,a)=>(m[a.kind]=(m[a.kind]||0)+1,m),{})},null,2));
