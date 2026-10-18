/* CR-W1b isolated serializer browser witness + Review-secondary + raw-library controls.
   Real spellSerializer.js and real libraryManager.exportLibrary(). Isolated fixtures only. No storage/network. */
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../../../../../../');
const src = path.join(root, 'vtt-react/src');
const babel = require(path.join(root, 'vtt-react/node_modules/@babel/core'));
const preset = require.resolve('@babel/preset-react', { paths: [path.join(root, 'vtt-react')] });
const plugin = require.resolve('@babel/plugin-transform-modules-commonjs', { paths: [path.join(root, 'vtt-react')] });

const hashes = {};
const factories = {};
const readTracked = file => {
  const bytes = fs.readFileSync(file);
  hashes[path.relative(root, file).replaceAll('\\', '/')] = crypto.createHash('sha256').update(bytes).digest('hex');
  return bytes.toString('utf8');
};

function compile(file) {
  file = path.normalize(file);
  if (!fs.existsSync(file)) file += '.js';
  const id = path.relative(src, file).replaceAll('\\', '/');
  if (factories[id] !== undefined) return id;
  const text = readTracked(file);
  factories[id] = '';
  const ast = babel.parseSync(text, { filename: file, babelrc: false, configFile: false, parserOpts: { plugins: ['jsx'] } });
  for (const statement of ast.program.body) {
    if (statement.type === 'ImportDeclaration') {
      const name = statement.source.value;
      if (!name.startsWith('.')) continue;
      if (/spellLibraryScopedStorage/.test(name)) continue;
      compile(path.resolve(path.dirname(file), name));
    }
  }
  factories[id] = babel.transformSync(text, { filename: file, babelrc: false, configFile: false, plugins: [plugin] }).code;
  return id;
}

const serializer = compile(path.join(src, 'components/spellcrafting-wizard/core/utils/spellSerializer.js'));
const library = compile(path.join(src, 'components/spellcrafting-wizard/core/utils/libraryManager.js'));

const bundle = `const factories=${JSON.stringify(factories)};const modules={};
function resolve(from,name){const parts=(from.slice(0,from.lastIndexOf('/'))+'/'+name).split('/'),out=[];for(const p of parts){if(p==='..')out.pop();else if(p&&p!=='.')out.push(p);}const id=out.join('/');return id.endsWith('.js')||id.endsWith('.jsx')?id:id+'.js';}
function req(id){if(modules[id])return modules[id].exports;const m={exports:{}};modules[id]=m;
const local=name=>{if(!name.startsWith('.'))throw Error('Unexpected fixture import '+name);const resolved=resolve(id,name);
if(resolved.startsWith('persistence/spellLibraryScopedStorage'))return {loadSpellLibraryData:()=>null,saveSpellLibraryData:()=>{},clearSpellLibraryDataScoped:()=>{}};
return req(resolved);};
if(!factories[id])throw Error('Unknown fixture module '+id);new Function('require','module','exports',factories[id])(local,m,m.exports);return m.exports;}

const api=req(${JSON.stringify(serializer)});
const lib=req(${JSON.stringify(library)});

const richConfig=()=>({id:'fixture_rich',name:'Rich Price Fixture',level:3,spellType:'ACTION',description:'fixture with authored resource data',
resourceCost:{actionPoints:0,mana:0,components:['verbal','somatic'],materialComponents:'a lock of hair',resourceTypes:['mana','actionPoints','note_v','note_i','note_vi'],resourceValues:{mana:0,actionPoints:0,note_v:-2,note_i:-1,note_vi:-1},resourceFormulas:{mana_formula:'2d6'},useFormulas:{mana:false},spheres:['arcane','arcane','rime'],classResource:{type:'fervor',gain:10,cost:3,state:'rally'},secondaryCosts:[{type:'health',amount:4}],unknownExtension:{nested:{list:[1,2,3],flag:true}},classResourceProgram:{version:99,steps:[{op:'gain',amount:3}]}}});
const positiveConfig=()=>({id:'fixture_positive',name:'Positive Price Fixture',level:2,resourceCost:{actionPoints:1,mana:4,notes:'Soft',resourceValues:{mana:4}}});
const deep=x=>JSON.parse(JSON.stringify(x));

function runAll(){
 const results={};
 const rich=richConfig();
 const rt=api.deserializeSpell(api.serializeSpell(rich));
 results.apZeroManaZeroAndTypes={pass:rt.resourceCost.actionPoints===0&&rt.resourceCost.mana===0&&typeof rt.resourceCost.actionPoints==='number',value:deep(rt.resourceCost)};
 const ap0mana4=positiveConfig();ap0mana4.resourceCost.actionPoints=0;
 const rt2=api.deserializeSpell(api.serializeSpell(ap0mana4));
 results.apZeroManaFourExact={pass:JSON.stringify(rt2.resourceCost)===JSON.stringify(ap0mana4.resourceCost),value:deep(rt2.resourceCost)};
 results.sphereMultiset={pass:JSON.stringify(rt.resourceCost.spheres)===JSON.stringify(['arcane','arcane','rime']),value:rt.resourceCost.spheres};
 results.sevenNoteCounts={pass:rt.resourceCost.resourceValues.note_v===-2&&rt.resourceCost.resourceValues.note_i===-1&&rt.resourceCost.resourceValues.note_vi===-1&&rt.resourceCost.resourceValues.mana===0,value:deep(rt.resourceCost.resourceValues)};
 results.classSecondaryMaterialsFormulas={pass:JSON.stringify(rt.resourceCost.classResource)===JSON.stringify({type:'fervor',gain:10,cost:3,state:'rally'})&&JSON.stringify(rt.resourceCost.secondaryCosts)===JSON.stringify([{type:'health',amount:4}])&&rt.resourceCost.materialComponents==='a lock of hair'&&rt.resourceCost.resourceFormulas.mana_formula==='2d6',value:{classResource:deep(rt.resourceCost.classResource),secondaryCosts:deep(rt.resourceCost.secondaryCosts),resourceFormulas:deep(rt.resourceCost.resourceFormulas)}};
 results.unknownExtensionsDataOnly={pass:JSON.stringify(rt.resourceCost.unknownExtension)===JSON.stringify({nested:{list:[1,2,3],flag:true}})&&rt.resourceCost.classResourceProgram.version===99,value:{unknownExtension:deep(rt.resourceCost.unknownExtension),classResourceProgram:deep(rt.resourceCost.classResourceProgram)}};
 const absent=positiveConfig();delete absent.resourceCost;
 const absentRt=api.deserializeSpell(api.serializeSpell(absent));
 const empty=positiveConfig();empty.resourceCost={};
 const nulled=positiveConfig();nulled.resourceCost=null;
 results.missingEmptyNullDistinct={pass:!('resourceCost' in absentRt)&&JSON.stringify(api.deserializeSpell(api.serializeSpell(empty)).resourceCost)==='{}'&&api.deserializeSpell(api.serializeSpell(nulled)).resourceCost===null,value:{absent:'resourceCost' in absentRt?'present':'absent',empty:deep(api.deserializeSpell(api.serializeSpell(empty)).resourceCost),nulled:api.deserializeSpell(api.serializeSpell(nulled)).resourceCost}};
 const cfg=richConfig();const snap=deep(cfg);const first=api.serializeSpell(cfg);const second=api.serializeSpell(cfg);
 results.twoCyclesStableNoMutation={pass:first===second&&JSON.stringify(cfg)===JSON.stringify(snap),value:{stable:first===second,inputUnmutated:JSON.stringify(cfg)===JSON.stringify(snap)}};
 const template=api.createSpellTemplate(richConfig(),'rich-template');
 const instance=api.generateSpellFromTemplate(template,{});
 const fromString=api.generateSpellFromTemplate(JSON.stringify(template),{});
 results.templateRoundTrip={pass:JSON.stringify(template.resourceCost)===JSON.stringify(richConfig().resourceCost)&&JSON.stringify(instance.resourceCost)===JSON.stringify(richConfig().resourceCost)&&JSON.stringify(fromString.resourceCost)===JSON.stringify(richConfig().resourceCost)&&instance._isTemplate===undefined&&instance._templateName===undefined&&instance._dateCreated===undefined&&instance._parameterOptions===undefined,value:{templateAP:template.resourceCost.actionPoints,instanceAP:instance.resourceCost.actionPoints,fromStringAP:fromString.resourceCost.actionPoints,metadataOnTemplate:template._isTemplate===true,metadataRemovedOnInstance:instance._isTemplate===undefined}};
 const original=positiveConfig();const tpl=api.createSpellTemplate(original,'positive-template');const tplSnap=deep(tpl);const origSnap=deep(original);
 const dotted=api.generateSpellFromTemplate(tpl,{'resourceCost.actionPoints':0,'resourceCost.notes':'Soft zero'});
 const secondInstance=api.generateSpellFromTemplate(tpl,{});
 results.dottedChangeIsolated={pass:dotted.resourceCost.actionPoints===0&&dotted.resourceCost.notes==='Soft zero'&&JSON.stringify(tpl)===JSON.stringify(tplSnap)&&JSON.stringify(original)===JSON.stringify(origSnap)&&secondInstance.resourceCost.actionPoints===1&&secondInstance.resourceCost.notes==='Soft',value:{instance:{ap:dotted.resourceCost.actionPoints,notes:dotted.resourceCost.notes},templateUnmutated:JSON.stringify(tpl)===JSON.stringify(tplSnap),originalUnmutated:JSON.stringify(original)===JSON.stringify(origSnap),secondInstanceAP:secondInstance.resourceCost.actionPoints,secondInstanceNotes:secondInstance.resourceCost.notes}};
 const replaced=api.generateSpellFromTemplate(api.createSpellTemplate(positiveConfig(),'replace-template'),{resourceCost:{actionPoints:3}});
 results.wholeObjectReplacement={pass:JSON.stringify(replaced.resourceCost)===JSON.stringify({actionPoints:3}),value:deep(replaced.resourceCost)};
 const priv=positiveConfig();priv._draft=true;priv.resourceCost._legacyNote='kept';
 const privRt=api.deserializeSpell(api.serializeSpell(priv));
 results.privateCleanupTopLevelOnly={pass:!('_draft' in privRt)&&privRt.resourceCost._legacyNote==='kept',value:{topLevelRemoved:!('_draft' in privRt),nestedKept:privRt.resourceCost._legacyNote}};
 const spellState=Object.assign(richConfig(),{resourceCost:Object.assign(richConfig().resourceCost,{actionPoints:0,mana:4})});
 const secondary=api.deserializeSpell(api.serializeSpell(spellState));
 results.reviewSecondarySerializedData={pass:JSON.stringify(secondary.resourceCost)===JSON.stringify(spellState.resourceCost),value:{ap:secondary.resourceCost.actionPoints,mana:secondary.resourceCost.mana}};
 const price=richConfig().resourceCost;
 const exportJson=lib.exportLibrary({spells:[{id:'s1',name:'Keeper',resourceCost:price}]},'json');
 const parsedExport=JSON.parse(exportJson);
 results.rawLibraryExportPositiveControl={pass:JSON.stringify(parsedExport.data.spells[0].resourceCost)===JSON.stringify(price)&&exportJson.includes('"actionPoints": 0'),value:{ap:parsedExport.data.spells[0].resourceCost.actionPoints,mana:parsedExport.data.spells[0].resourceCost.mana}};
 return results;}

window.__w1b={runAll,api,lib,hashInputs:()=>Object.keys(factories)};
document.getElementById('run').onclick=()=>{const r=runAll();document.getElementById('out').textContent=JSON.stringify(r,null,2);};
const initial=runAll();document.getElementById('out').textContent=JSON.stringify(initial,null,2);`;

fs.writeFileSync(
  path.join(__dirname, 'witness-source-hashes.json'),
  JSON.stringify({ capturedAt: new Date().toISOString(), sourceHashes: hashes }, null, 2) + '\n'
);

const html = '<!doctype html><html lang="en"><meta charset="utf-8"><title>CR-W1b serializer witness</title><body><h1>CR-W1b isolated serializer witness</h1><p>Real spellSerializer.js and real libraryManager.exportLibrary(). Isolated fixtures; no storage or network.</p><button id="run">run</button><pre id="out"></pre><script src="/witness.js"></script></body></html>';

const server = http.createServer((request, response) => {
  let text = html; let type = 'text/html';
  if (request.url === '/witness.js') { text = bundle; type = 'application/javascript'; }
  response.setHeader('Content-Type', type);
  response.end(text);
});
server.listen(0, '127.0.0.1', () => {
  const ready = { pid: process.pid, url: `http://127.0.0.1:${server.address().port}/` };
  fs.writeFileSync(path.join(__dirname, 'witness-ready.json'), JSON.stringify(ready, null, 2) + '\n');
  console.log(JSON.stringify(ready));
});
