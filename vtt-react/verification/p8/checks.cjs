// Implementer custody/verification only. Independent acceptance is a separate execution.
const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto');
const root = path.resolve(__dirname, '../../..');
const base = process.env.P8_OUTPUT;
if (!base) throw Error('P8_OUTPUT required');
const mode = process.argv[2], out = path.join(base, mode + '-' + Date.now());
fs.mkdirSync(out, { recursive: true });
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const focal = [
  'docs/MYTHRILL_PROJECT_8_CONTRACT.md', 'docs/MYTHRILL_P8_FEATHER_SLASH_PHYSICAL_REFERENCE.html', 'vtt-react/public/data/abilities.json', 'vtt-react/public/data/creatures.json',
  ...['CreatureToken.jsx', 'CreatureAbilityFanOut.jsx', 'CreatureAbilityConfirmDialog.jsx', 'CreatureAbilityQuickUse.jsx', 'CreatureAbilityQuickUse.css', '__tests__/CreatureAbilityFanOut.test.js'].map(p => 'vtt-react/src/components/grid/' + p),
  ...['actorConsequenceService.js', 'featherSlash.js', 'featherSlashCustody.js', '__tests__/featherSlash.test.js'].map(p => 'vtt-react/src/services/' + p),
  'vtt-react/src/persistence/privateStorageRegistry.js', 'vtt-react/src/store/chatStore.js', 'vtt-react/src/components/multiplayer/socketHandlers/combatHandlers.js',
];
const visit = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? visit(path.join(dir,e.name)) : [path.join(dir,e.name)]);
const witnesses = visit(__dirname).map(p => path.relative(root,p).replace(/\\/g,'/'));
const observations = JSON.parse(process.env.P8_OBSERVATIONS || '[]').map(file => ({ file, value:JSON.parse(fs.readFileSync(file)) }));
const loaded = observations.flatMap(({file,value}) => [
  ...Object.entries(value.manifest || {}).map(([p,expected]) => ({observation:file,path:'vtt-react/src/'+p,expected})),
  ...Object.entries(value.serverHashes || {}).map(([p,expected]) => ({observation:file,path:p,expected})),
]);
const files = [...new Set([...focal, ...witnesses, ...loaded.map(e=>e.path)])];
const hashes = () => Object.fromEntries(files.map(p => [p, sha(fs.readFileSync(path.join(root,p)))]));
const git = args => cp.execFileSync('git', args, { cwd:root, encoding:'utf8', env:{...process.env,GIT_OPTIONAL_LOCKS:'0'}, maxBuffer:16*1024*1024 });
const before = hashes(), identity = { head:git(['rev-parse','HEAD']).trim(), status:git(['status','--short']), hashes:before };
if (before['docs/MYTHRILL_PROJECT_8_CONTRACT.md'] !== '1436f823b44405a9ecf47d41da99d8c5522dafc75acaaae6aec8243a960b5173') throw Error('Frozen contract drift');
if (['snapshot','seal'].includes(mode)) {
  const accepted = JSON.parse(fs.readFileSync('D:/AppData/Temp/opencode/p7-final-20261013/combined/seal-1791980637030/source.json'));
  const p7 = Object.fromEntries(Object.entries(accepted.identity.hashes).map(([p,expected]) => [p,{expected,actual:sha(fs.readFileSync(path.join(root,p)))}]));
  const loadedComparisons=loaded.map(entry=>({...entry,actual:before[entry.path],matches:before[entry.path]===entry.expected}));
  fs.writeFileSync(path.join(out,'source.json'),JSON.stringify({identity,p7,loadedComparisons,files:Object.fromEntries(files.map(p=>[p,fs.readFileSync(path.join(root,p)).toString('base64')]))},null,2),{flag:'wx'});
  fs.writeFileSync(path.join(out,'source.diff'),git(['diff','--',...focal]),{flag:'wx'});
  if(mode==='seal') fs.writeFileSync(path.join(out,'artifact-manifest.json'),JSON.stringify({acceptance:'pending independent reviewer',artifacts:Object.fromEntries(visit(base).filter(p=>!p.startsWith(out)).map(p=>[path.relative(base,p).replace(/\\/g,'/'),sha(fs.readFileSync(p))]))},null,2),{flag:'wx'});
  const drift=loadedComparisons.filter(e=>!e.matches);
  const sealed={out,argv:process.argv,cwd:process.cwd(),sourcePaths:files.length,loadedComparisons:loaded.length,loadedDrift:drift.map(e=>({observation:e.observation,path:e.path})),p7Changed:Object.keys(p7).filter(p=>p7[p].expected!==p7[p].actual),sourcePacketSha256:sha(fs.readFileSync(path.join(out,'source.json'))),...(mode==='seal'?{artifactManifestSha256:sha(fs.readFileSync(path.join(out,'artifact-manifest.json')))}:{})};
  fs.writeFileSync(path.join(out,'seal.json'),JSON.stringify(sealed,null,2),{flag:'wx'});
  console.log(JSON.stringify(sealed));process.exit(drift.length?1:0);
}
const focused = [
 'src/services/__tests__/featherSlash.test.js','src/components/grid/__tests__/CreatureAbilityFanOut.test.js',
 'src/services/__tests__/actorProjectionOrder.test.js','src/services/__tests__/p7BoundsConsumers.test.js',
 'src/services/__tests__/silentRoomHydration.test.js','src/services/__tests__/roomHydrationCorrections.test.js',
 'src/persistence/__tests__/registry.test.js','src/persistence/__tests__/waveB_scopedConsumer.test.js','src/persistence/__tests__/waveB_b1b5Corrections.test.js',
 'src/persistence/__tests__/characterProjectionIsolation.test.js','src/persistence/__tests__/characterHandoffPreservation.test.js','src/persistence/__tests__/p7ConditionRecovery.production.test.jsx',
 'src/store/__tests__/combatStore.test.js',
];
const commands = {
 rejoin:{cwd:path.join(root,'vtt-react'),args:['verification/p8/rejoin.cjs']},
 browser:{cwd:path.join(root,'vtt-react'),args:['verification/p8/browser.cjs']},
 runtime:{cwd:path.join(root,'vtt-react'),args:['verification/p8/runtime.cjs',process.env.P8_CHECKPOINT_INPUT]},
 focused:{cwd:path.join(root,'vtt-react'),args:['node_modules/react-scripts/bin/react-scripts.js','test','--watchAll=false','--runInBand','--silent','--testTimeout=15000','--no-cache','--runTestsByPath',...focused]},
 lint:{cwd:path.join(root,'vtt-react'),args:['node_modules/eslint/bin/eslint.js',...focal.filter(p=>/\.(jsx?|css)$/.test(p)&&!p.endsWith('.css')).map(p=>path.join(root,p))]},
};
const command=commands[mode];if(!command)throw Error('Unknown mode '+mode);
const startedAt=new Date().toISOString();
const result=cp.spawnSync(process.execPath,command.args,{cwd:command.cwd,env:{...process.env,CI:'true',P8_OUTPUT:out},encoding:'utf8',timeout:240000,maxBuffer:32*1024*1024});
fs.writeFileSync(path.join(out,'output.log'),(result.stdout||'')+(result.stderr||''),{flag:'wx'});
const after=hashes(),drift=files.filter(p=>before[p]!==after[p]);
fs.writeFileSync(path.join(out,'command.json'),JSON.stringify({command:[process.execPath,...command.args],cwd:command.cwd,environment:{CI:'true',P8_OUTPUT:out,P8_CHECKPOINT_INPUT:process.env.P8_CHECKPOINT_INPUT},startedAt,endedAt:new Date().toISOString(),exit:result.status,error:result.error?.message,identity,after,drift},null,2),{flag:'wx'});
console.log(JSON.stringify({out,exit:result.status,drift}));if(result.status!==0)console.error(result.stderr||result.stdout);
process.exit(result.status===0&&!drift.length?0:1);
