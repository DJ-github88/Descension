/* CR-W1a mounted witness: real SpellWizardProvider + real Step5Resources + production save/reopen expressions.
   Isolated in-memory fixtures only. No personal storage, shared room, network or backend writes. */
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

const MOCK_CHILDREN = /SimpleFormulaHelp|SpellComponentsSelector/;

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
      if (MOCK_CHILDREN.test(name)) continue;
      compile(path.resolve(path.dirname(file), name));
    }
  }
  factories[id] = babel.transformSync(text, {
    filename: file, babelrc: false, configFile: false,
    presets: [[preset, { runtime: 'classic' }]], plugins: [plugin]
  }).code;
  return id;
}

const step = compile(path.join(src, 'components/spellcrafting-wizard/components/steps/Step5Resources.jsx'));
const context = compile(path.join(src, 'components/spellcrafting-wizard/context/spellWizardContext.js'));
const serializer = compile(path.join(src, 'components/spellcrafting-wizard/core/utils/spellSerializer.js'));

const bundle = `const factories=${JSON.stringify(factories)};const modules={};
function resolve(from,name){const parts=(from.slice(0,from.lastIndexOf('/'))+'/'+name).split('/'),out=[];for(const p of parts){if(p==='..')out.pop();else if(p&&p!=='.')out.push(p);}const id=out.join('/');return id.endsWith('.js')||id.endsWith('.jsx')?id:id+'.js';}
function req(id){if(modules[id])return modules[id].exports;const m={exports:{}};modules[id]=m;
const local=name=>{if(name==='react')return React;
if(name==='@fortawesome/react-fontawesome')return {FontAwesomeIcon:()=>null};
if(name==='@fortawesome/free-solid-svg-icons')return new Proxy({},{get:(_,k)=>k});
if(name==='react-bootstrap')return new Proxy({},{get:()=>({children})=>React.createElement('div',null,children)});
if(/SimpleFormulaHelp|SpellComponentsSelector/.test(name))return {__esModule:true,default:()=>null};
if(!name.startsWith('.'))throw Error('Unexpected fixture import '+name);return req(resolve(id,name));};
if(!factories[id])throw Error('Unknown fixture module '+id);new Function('require','module','exports',factories[id])(local,m,m.exports);return m.exports;}

const ctx=req(${JSON.stringify(context)});
const Step=req(${JSON.stringify(step)}).default;
const api=req(${JSON.stringify(serializer)});
const MOCK_BOUNDARIES=['react/bootstrap/icon packages','SimpleFormulaHelp/SpellComponentsSelector children','no App chrome, library persistence, Firebase or backend'];

const FIXTURES={
 'selected-editor-zero':{patch:{resourceTypes:['actionPoints'],resourceValues:{actionPoints:0},actionPoints:0}},
 'editor-missing-canonical-zero':{patch:{resourceTypes:['actionPoints'],resourceValues:{},actionPoints:0}},
 'editor-zero-canonical-two':{patch:{resourceTypes:['actionPoints'],resourceValues:{actionPoints:0},actionPoints:2}},
 'deselected-canonical-zero':{patch:{resourceTypes:[],resourceValues:{},actionPoints:0}},
 'both-missing':{patch:{resourceTypes:[],resourceValues:{actionPoints:undefined},actionPoints:undefined}},
 'passive-explicit-zero':{patch:{resourceTypes:[],resourceValues:{},actionPoints:0},spellType:'PASSIVE'},
 'passive-missing':{patch:{resourceTypes:[],resourceValues:{},actionPoints:undefined},spellType:'PASSIVE'},
 'malformed-null':{patch:{resourceTypes:['actionPoints'],resourceValues:{},actionPoints:null}},
 'positive-two':{patch:{resourceTypes:['mana'],resourceValues:{mana:4},actionPoints:2}}
};

let fixture=FIXTURES['selected-editor-zero'];let mountKey=0;
function StateProbe(){const s=ctx.useSpellWizardState();window.__state=s;return React.createElement('output',{id:'state-json'},JSON.stringify({ap:s.resourceCost.actionPoints===undefined?'<undefined>':s.resourceCost.actionPoints,values:s.resourceCost.resourceValues}));}
function Bridge({children}){window.__dispatch=ctx.useSpellWizardDispatch();window.__actions=ctx.actionCreators;return children;}
function SeedGate({children}){const dispatch=ctx.useSpellWizardDispatch();const [ready,setReady]=React.useState(false);
React.useEffect(()=>{if(fixture.spellType!==undefined)dispatch(ctx.actionCreators.setSpellType(fixture.spellType));dispatch(ctx.actionCreators.updateResourceCost(fixture.patch));setReady(true);},[]);
return ready?children:null;}
function Fixture(){const [stepSeq,setStepSeq]=React.useState(0);window.__remountStep=()=>setStepSeq(s=>s+1);
return React.createElement(ctx.SpellWizardProvider,{key:'provider'},
React.createElement(Bridge,null,
React.createElement(StateProbe,null),
React.createElement(SeedGate,null,React.createElement(Step,{key:'step-'+stepSeq}))));}

const app=ReactDOM.createRoot(document.getElementById('root'));
function mount(mode){if(!FIXTURES[mode])throw Error('Unknown fixture '+mode);fixture=FIXTURES[mode];app.render(React.createElement(Fixture,{key:'fixture-'+ ++mountKey}));}

const AP_OF=()=>window.__state.resourceCost.actionPoints;
const apReport=()=>({presentInState:Object.prototype.hasOwnProperty.call(window.__state.resourceCost,'actionPoints'),value:AP_OF()===undefined?'<undefined>':(Number.isNaN(AP_OF())?'<NaN>':AP_OF())});
function apInput(){return document.querySelector('.resource-config-grid input[type="number"]');}
function drive(label){const names=[...document.querySelectorAll('.resource-type-name')];const el=names.find(n=>n.textContent===label);if(!el)throw Error('No resource option '+label);el.closest('.resource-type-option').click();}
function setInput(value){const input=apInput();if(!input)throw Error('No numeric input');const setter=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;setter.call(input,value);input.dispatchEvent(new Event('input',{bubbles:true}));}
function snapshot(){return{ap:apReport(),inputValue:apInput()?apInput().value:null,summaryValues:[...document.querySelectorAll('.resource-cost-value,.resource-cost-label')].map(n=>n.textContent.trim()),freeText:document.body.textContent.includes('can be cast freely')?'free-asserted':'free-not-asserted'};}

const mainSaveRecord=()=>{const wizardState=window.__state;
/* Expressions below copied verbatim from SpellwizardApp.jsx:255-280 (outer record + resourceCost guarantee). */
const spellData={...wizardState,lastModified:new Date().toISOString(),lastSaved:new Date().toISOString(),resourceCost:wizardState.resourceCost||{actionPoints:1,components:[]}};
return spellData;};

const reviewRecord=()=>{const spellState=window.__state;
/* Expressions below copied verbatim from Step10Review.jsx:2624-2630 and :2666-2672 and :2729-2735. */
const librarySpell={...spellState,id:'w1a_review_record',dateCreated:new Date().toISOString(),lastModified:new Date().toISOString(),serializedData:api.serializeSpell(spellState),resourceCost:spellState.resourceCost||{mana:0,rage:0,energy:0,focus:0,runic:0}};
librarySpell.resourceCost={...librarySpell.resourceCost,resourceValues:spellState.resourceCost?.resourceValues||{},resourceTypes:spellState.resourceCost?.resourceTypes||[],resourceFormulas:spellState.resourceCost?.resourceFormulas||{},useFormulas:spellState.resourceCost?.useFormulas||{}};
return librarySpell;};

const reopenFrom=record=>{const spellCopy=JSON.parse(JSON.stringify(record));
/* resourceCost expression copied verbatim from SpellwizardApp.jsx:539-548; provider-visible defaults copied from :485-596. */
const formattedSpellData={name:spellCopy.name||'',description:spellCopy.description||'',level:spellCopy.level||1,spellType:spellCopy.spellType||'ACTION',typeConfig:spellCopy.typeConfig||{},effectTypes:spellCopy.effectTypes||[],effectsMap:spellCopy.effectsMap||{},damageConfig:spellCopy.damageConfig||null,healingConfig:spellCopy.healingConfig||null,buffConfig:spellCopy.buffConfig||null,debuffConfig:spellCopy.debuffConfig||null,utilityConfig:spellCopy.utilityConfig||null,controlConfig:spellCopy.controlConfig||null,summoningConfig:spellCopy.summoningConfig||null,transformationConfig:spellCopy.transformationConfig||null,purificationConfig:spellCopy.purificationConfig||null,restorationConfig:spellCopy.restorationConfig||null,rollableTable:spellCopy.rollableTable||null,effectResolutions:spellCopy.effectResolutions||{},effectMechanicsConfigs:spellCopy.effectMechanicsConfigs||{},mechanicsAvailableEffects:spellCopy.mechanicsAvailableEffects||[],combinedEffects:spellCopy.combinedEffects||[],mechanicsAvailableCombinedEffects:spellCopy.mechanicsAvailableCombinedEffects||[],targetingConfig:spellCopy.targetingConfig||{},targetingMode:spellCopy.targetingMode||'unified',targetingTags:spellCopy.targetingTags||{},effectTargeting:spellCopy.effectTargeting||{},durationConfig:spellCopy.durationConfig||{},persistentConfig:spellCopy.persistentConfig||{},propagation:spellCopy.propagation||null,resourceCost:spellCopy.resourceCost||{components:[],materialComponents:'',actionPoints:1,actionPointsSelected:true,resourceTypes:[],resourceValues:{},resourceFormulas:{},useFormulas:{}},mechanicsConfig:spellCopy.mechanicsConfig||{},cooldownConfig:spellCopy.cooldownConfig||{},triggerConfig:spellCopy.triggerConfig||{},trapConfig:spellCopy.trapConfig||{},channelingConfig:spellCopy.channelingConfig||{},errors:{},warnings:{},currentStep:1,completedSteps:spellCopy.completedSteps||[],wizardFlow:spellCopy.wizardFlow||[],id:spellCopy.id||'w1a_reopened',lastModified:new Date(),isValid:true};
window.__dispatch(ctx.actionCreators.loadSpell(formattedSpellData));
window.__remountStep();
return apReport();};

window.__w1a={mount,drive,setInput,snapshot,apReport,mainSaveRecord,reviewRecord,reopenFrom,getState:()=>window.__state,mockBoundaries:MOCK_BOUNDARIES};

for(const mode of Object.keys(FIXTURES)){const b=document.createElement('button');b.textContent=mode;b.id='mount-'+mode;b.onclick=()=>mount(mode);document.getElementById('fixtures').append(b);}
mount('selected-editor-zero');`;

fs.writeFileSync(
  path.join(__dirname, 'witness-source-hashes.json'),
  JSON.stringify({ capturedAt: new Date().toISOString(), sourceHashes: hashes }, null, 2) + '\n'
);

const html = '<!doctype html><html lang="en"><meta charset="utf-8"><title>CR-W1a mounted witness</title><body><h1>CR-W1a mounted real-provider witness</h1><p>Isolated in-memory fixtures. No personal account, library persistence or shared-room writes.</p><div id="fixtures"></div><div id="root"></div><script src="/react.js"></script><script src="/react-dom.js"></script><script src="/witness.js"></script></body></html>';

const server = http.createServer((request, response) => {
  let text = html; let type = 'text/html';
  if (request.url === '/witness.js') { text = bundle; type = 'application/javascript'; }
  if (request.url === '/react.js') { text = fs.readFileSync(path.join(root, 'vtt-react/node_modules/react/umd/react.development.js')); type = 'application/javascript'; }
  if (request.url === '/react-dom.js') { text = fs.readFileSync(path.join(root, 'vtt-react/node_modules/react-dom/umd/react-dom.development.js')); type = 'application/javascript'; }
  response.setHeader('Content-Type', type);
  response.end(text);
});
server.listen(0, '127.0.0.1', () => {
  const ready = { pid: process.pid, url: `http://127.0.0.1:${server.address().port}/` };
  fs.writeFileSync(path.join(__dirname, 'witness-ready.json'), JSON.stringify(ready, null, 2) + '\n');
  console.log(JSON.stringify(ready));
});
