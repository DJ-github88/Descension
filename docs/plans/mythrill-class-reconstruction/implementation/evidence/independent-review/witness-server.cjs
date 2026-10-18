/* Review-only bounded fixture. Compile unchanged production modules in full;
 * click their actual save buttons and deliver the actual internalLoadSpell event.
 * No extracted/reimplemented save/load expressions. Storage adapter is memory-only.
 */
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../../../../../..');
const src = path.join(root, 'vtt-react/src');
const dependencies = path.join(root, 'vtt-react/node_modules');
const babel = require(path.join(dependencies, '@babel/core'));
const preset = require.resolve('@babel/preset-react', { paths: [dependencies] });
const plugin = require.resolve('@babel/plugin-transform-modules-commonjs', { paths: [dependencies] });
const factories = {}, hashes = {}, mocked = new Set();
const wizard = 'components/spellcrafting-wizard/';
const mockPaths = new Map([
  ['persistence/spellLibraryScopedStorage', 'storage'],
  ['utils/assetManager', 'assets'],
  ['utils/dialogService', 'dialog'],
  ['components/windows/MythrillWindow', 'null'],
  ['data/spellLibraryData', 'catalogue'],
  [wizard + 'core/utils/spellCardTransformer', 'transformer'],
  [wizard + 'components/common/UnifiedSpellCard', 'null'],
  [wizard + 'components/common/SpellCardUtils', 'format'],
  [wizard + 'components/common/SimpleFormulaHelp', 'null'],
  [wizard + 'components/common/SpellComponentsSelector', 'null'],
  [wizard + 'components/library/SpellLibrary', 'null'],
  [wizard + 'components/library/SampleSpellsLoader', 'null']
]);
for (const step of ['Step1BasicInfo','Step2SpellType','Step3Effects','Step4Targeting','Step6Cooldown',
  'Step7Mechanics','Step7Triggers','TrapPlacementStep','Step8Channeling','RollableTableStep','ProphecyStep','Step9Balance']) {
  mockPaths.set(wizard + 'components/steps/' + step, 'null');
}
function resolveFile(file) {
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  for (const ext of ['.js', '.jsx']) if (fs.existsSync(file + ext)) return file + ext;
  throw Error('Missing fixture dependency: ' + file);
}
const idFor = file => path.relative(src, file).replaceAll('\\', '/');
function compile(file) {
  file = resolveFile(file);
  const id = idFor(file);
  if (factories[id] !== undefined) return id;
  const bytes = fs.readFileSync(file), text = bytes.toString('utf8');
  hashes[path.relative(root, file).replaceAll('\\', '/')] = crypto.createHash('sha256').update(bytes).digest('hex');
  factories[id] = '';
  const ast = babel.parseSync(text, { filename: file, babelrc: false, configFile: false, parserOpts: { plugins: ['jsx'] } });
  for (const statement of ast.program.body) {
    if (statement.type !== 'ImportDeclaration') continue;
    const name = statement.source.value;
    if (!name.startsWith('.')) continue;
    const target = path.resolve(path.dirname(file), name);
    const mockKey = idFor(target).replace(/\.(js|jsx)$/, '');
    if (mockPaths.has(mockKey)) mocked.add(mockKey);
    else compile(target);
  }
  factories[id] = babel.transformSync(text, { filename: file, babelrc: false, configFile: false,
    presets: [[preset, { runtime: 'classic' }]], plugins: [plugin] }).code;
  return id;
}
const app = compile(path.join(src, wizard, 'SpellwizardApp.jsx'));
const review = compile(path.join(src, wizard, 'components/steps/Step10Review.jsx'));
const ctx = compile(path.join(src, wizard, 'context/spellWizardContext.js'));
const libctx = compile(path.join(src, wizard, 'context/SpellLibraryContext.js'));
const serializer = compile(path.join(src, wizard, 'core/utils/spellSerializer.js'));
const resources = compile(path.join(src, wizard, 'core/mechanics/resourceManager.js'));
const library = compile(path.join(src, wizard, 'core/utils/libraryManager.js'));
const bundle = `const factories=${JSON.stringify(factories)}, mockPaths=${JSON.stringify(Object.fromEntries(mockPaths))}, modules={};
let memoryStorage=null;
const empty=()=>null;
const mocks={
 null:{__esModule:true,default:empty},
 storage:{loadSpellLibraryData:()=>memoryStorage,saveSpellLibraryData:x=>{memoryStorage=JSON.parse(JSON.stringify(x));},clearSpellLibraryDataScoped:()=>{memoryStorage=null;}},
 assets:{getIconUrl:()=>''},dialog:{showConfirm:async()=>false},catalogue:{LIBRARY_SPELLS:[]},
 transformer:{transformSpellForCard:x=>x},format:{formatFormulaToPlainEnglish:x=>x}
};
function resolve(from,name){const out=[];for(const p of (from.slice(0,from.lastIndexOf('/'))+'/'+name).split('/')){if(p==='..')out.pop();else if(p&&p!=='.')out.push(p);}return out.join('/');}
function req(id){if(modules[id])return modules[id].exports;const m={exports:{}};modules[id]=m;
const local=name=>{
 if(name==='react')return React;
 if(name==='prop-types')return PropTypes;
 if(name==='@fortawesome/react-fontawesome')return {FontAwesomeIcon:empty};
 if(name==='@fortawesome/free-solid-svg-icons')return new Proxy({},{get:(_,k)=>k});
 if(name==='react-bootstrap')return new Proxy({},{get:()=>({children})=>React.createElement('div',null,children)});
 if(!name.startsWith('.'))throw Error('Unexpected fixture import '+name);
 const target=resolve(id,name), key=target.replace(/\\.(js|jsx)$/,'');
 if(mockPaths[key])return mocks[mockPaths[key]];
 return req(factories[target]!==undefined?target:factories[target+'.js']!==undefined?target+'.js':target+'.jsx');
};
if(!factories[id])throw Error('Unknown module '+id);new Function('require','module','exports',factories[id])(local,m,m.exports);return m.exports;}
const ctx=req(${JSON.stringify(ctx)}),libctx=req(${JSON.stringify(libctx)}),api=req(${JSON.stringify(serializer)}),res=req(${JSON.stringify(resources)}),lib=req(${JSON.stringify(library)});
const App=req(${JSON.stringify(app)}).default,Review=req(${JSON.stringify(review)}).default;
const noop=()=>{};
function Probe(){const state=ctx.useSpellWizardState(),library=libctx.useSpellLibrary();
 window.__state=state;window.__library=library;window.__dispatch=ctx.useSpellWizardDispatch();
 return React.createElement('output',{id:'probe'},JSON.stringify({ap:state.resourceCost.actionPoints,step:state.currentStep,saved:library.spells.map(s=>({id:s.id,ap:s.resourceCost?.actionPoints,secondary:!!s.serializedData}))}));}
function Gate({fixture}){const dispatch=ctx.useSpellWizardDispatch();const [ready,setReady]=React.useState(false),[showReview,setReview]=React.useState(false);
 window.__showReview=()=>{dispatch(ctx.actionCreators.setCurrentStep(1));setReview(true);};
 React.useEffect(()=>{dispatch(ctx.actionCreators.setName('Independent price witness'));dispatch(ctx.actionCreators.setDescription('Isolated review fixture'));dispatch(ctx.actionCreators.updateResourceCost(fixture));setReady(true);},[]);
 return ready?React.createElement(React.Fragment,null,React.createElement(Probe),React.createElement(App),showReview?React.createElement(Review,{stepNumber:10,totalSteps:10,isActive:true,onNext:noop,onPrevious:noop,onJumpToStep:noop}):null):null;}
const root=ReactDOM.createRoot(document.getElementById('root'));let sequence=0;
function mount(fixture){memoryStorage=null;root.render(React.createElement(ctx.SpellWizardProvider,{key:++sequence},React.createElement(libctx.SpellLibraryProvider,null,React.createElement(Gate,{fixture}))));}
window.__review={mount,api,res,lib,actions:ctx.actionCreators,storage:()=>memoryStorage,
 reopen:record=>window.dispatchEvent(new CustomEvent('internalLoadSpell',{detail:{spell:record,editMode:false}})),
 showStep:()=>window.__dispatch(ctx.actionCreators.setCurrentStep(5))};
mount({actionPoints:0,mana:4,resourceTypes:['actionPoints','mana'],resourceValues:{actionPoints:0,mana:4},resourceFormulas:{},useFormulas:{},spheres:['arcane','arcane','rime'],notes:{i:2,ii:0,iii:1,iv:0,v:2,vi:1,vii:3},secondaryCosts:[{type:'health',amount:4}],classResource:{cost:3,gain:10},unknown:{nested:[0,'kept']}});`;
fs.writeFileSync(path.join(__dirname, 'witness-source-hashes.json'), JSON.stringify({ hashes, mocks: [...mocked],
  boundary: 'Full production App/Review/Step5, both providers/reducers, helpers; isolated review composition, other steps/visual cards/catalogue mocked, scoped storage adapter memory-only. No App-to-Review navigation claim.' }, null, 2) + '\n');
const server = http.createServer((request, response) => {
  if (request.url === '/witness.js') { response.setHeader('Content-Type', 'application/javascript'); response.end(bundle); return; }
  if (request.url === '/react.js' || request.url === '/react-dom.js' || request.url === '/prop-types.js') {
    const name = request.url === '/react.js' ? 'react/umd/react.development.js' : request.url === '/prop-types.js' ? 'prop-types/prop-types.js' : 'react-dom/umd/react-dom.development.js';
    response.setHeader('Content-Type', 'application/javascript'); response.end(fs.readFileSync(path.join(dependencies, name))); return;
  }
  response.setHeader('Content-Type','text/html');
  response.end('<!doctype html><html lang="en"><meta charset="utf-8"><title>Independent W1 production-handler witness</title><h1>Independent W1 production-handler witness</h1><p>Memory-only storage; actual App/Review save buttons and App internalLoadSpell handler.</p><div id="root"></div><script src="/react.js"></script><script src="/react-dom.js"></script><script src="/prop-types.js"></script><script src="/witness.js"></script></html>');
});
server.listen(0, '127.0.0.1', () => {
  const ready = { pid:process.pid, url:'http://127.0.0.1:'+server.address().port+'/' };
  fs.writeFileSync(path.join(__dirname, 'witness-ready.json'), JSON.stringify(ready, null, 2) + '\n');
  console.log(JSON.stringify(ready));
});
