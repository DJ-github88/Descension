/* Isolated real-React/source witness. No application/server/state writes. */
const {fs,path,root,src,read,hashes}=require('./headq-source-tools.cjs');
const http=require('node:http');
const babel=require(path.join(root,'vtt-react/node_modules/@babel/core'));
const preset=require.resolve('@babel/preset-react',{paths:[path.join(root,'vtt-react')]});
const plugin=require.resolve('@babel/plugin-transform-modules-commonjs',{paths:[path.join(root,'vtt-react')]});
const factories={};
function compile(file){file=path.normalize(file);if(!fs.existsSync(file))file+='.js';const id=path.relative(src,file).replaceAll('\\','/');if(factories[id])return id;
 const text=read(file);factories[id]='';const ast=babel.parseSync(text,{filename:file,babelrc:false,configFile:false,parserOpts:{plugins:['jsx']}});
 for(const statement of ast.program.body)if(statement.type==='ImportDeclaration'){
  const name=statement.source.value;if(!name.startsWith('.'))continue;
  if(/spellWizardContext|SimpleFormulaHelp|SpellComponentsSelector/.test(name))continue;
  compile(path.resolve(path.dirname(file),name));
 }
 factories[id]=babel.transformSync(text,{filename:file,babelrc:false,configFile:false,presets:[[preset,{runtime:'classic'}]],plugins:[plugin]}).code;return id;
}
const step=compile(path.join(src,'components/spellcrafting-wizard/components/steps/Step5Resources.jsx'));
const serializer=compile(path.join(src,'components/spellcrafting-wizard/core/utils/spellSerializer.js'));
const bundle=`const factories=${JSON.stringify(factories)};const modules={};
const State=React.createContext(null);const Dispatch=React.createContext(null);
function resolve(from,name){const parts=(from.slice(0,from.lastIndexOf('/'))+'/'+name).split('/'),out=[];for(const p of parts){if(p==='..')out.pop();else if(p&&p!=='.')out.push(p);}const id=out.join('/');return id.endsWith('.js')||id.endsWith('.jsx')?id:id+'.js';}
function req(id){if(modules[id])return modules[id].exports;const m={exports:{}};modules[id]=m;
const local=name=>{if(name==='react')return React;if(name==='@fortawesome/react-fontawesome')return {FontAwesomeIcon:()=>null};if(name==='@fortawesome/free-solid-svg-icons')return new Proxy({},{get:(_,k)=>k});if(name==='react-bootstrap')return new Proxy({},{get:()=>({children})=>React.createElement('div',null,children)});
if(/spellWizardContext/.test(name))return {useSpellWizardState:()=>React.useContext(State),useSpellWizardDispatch:()=>React.useContext(Dispatch),actionCreators:{updateResourceCost:payload=>({type:'UPDATE_RESOURCE_COST',payload})}};
if(/SimpleFormulaHelp|SpellComponentsSelector/.test(name))return {__esModule:true,default:()=>null};if(!name.startsWith('.'))throw Error('Unexpected fixture import '+name);return req(resolve(id,name));};
if(!factories[id])throw Error('Unknown fixture module '+id);new Function('require','module','exports',factories[id])(local,m,m.exports);return m.exports;}
const Step=req(${JSON.stringify(step)}).default;const api=req(${JSON.stringify(serializer)});
const initial={id:'headq-zero-ap-witness',name:'Zero AP witness',level:1,description:'Isolated research fixture',spellType:'ACTION',effectTypes:['damage'],typeConfig:{school:'arcane'},targetingConfig:{targetingType:'single'},durationConfig:{durationType:'instant'},damageConfig:{formula:'1d6',damageTypes:['arcane']},resourceCost:{actionPoints:0,mana:4,resourceTypes:['actionPoints','mana'],resourceValues:{actionPoints:0,mana:4},resourceFormulas:{},useFormulas:{},components:[],spheres:['arcane','arcane']}};
let fixtureMode='selected-zero',mountKey=0;const observed=[];
function Fixture(){const [state,setState]=React.useState(()=>{const s=JSON.parse(JSON.stringify(initial));if(fixtureMode==='unselected-zero')s.resourceCost.resourceTypes=[];if(fixtureMode==='passive-zero'){s.spellType='PASSIVE';s.resourceCost.resourceTypes=[];}if(fixtureMode==='selected-two'){s.resourceCost.actionPoints=2;s.resourceCost.resourceValues.actionPoints=2;}return s;});
const dispatch=React.useCallback(action=>{observed.push(action);setState(s=>({...s,resourceCost:{...s.resourceCost,...action.payload}}));},[]);
window.__wizardState=state;
return React.createElement(State.Provider,{value:state},React.createElement(Dispatch.Provider,{value:dispatch},React.createElement('output',{id:'state'},JSON.stringify({mode:fixtureMode,ap:state.resourceCost.actionPoints,values:state.resourceCost.resourceValues})),React.createElement(Step)));}
const app=ReactDOM.createRoot(document.getElementById('root'));
function mount(mode){fixtureMode=mode;app.render(React.createElement(Fixture,{key:++mountKey}));}
window.__headq={observed,initial,api,mount,serialize:()=>api.deserializeSpell(api.serializeSpell(initial)),template:()=>api.createSpellTemplate(initial,'HeadQ witness'),generate:()=>api.generateSpellFromTemplate(api.createSpellTemplate(initial,'HeadQ witness'),{})};
for(const mode of ['selected-zero','unselected-zero','passive-zero','selected-two']){const b=document.createElement('button');b.textContent=mode;b.onclick=()=>mount(mode);document.getElementById('fixtures').append(b);}
for(const [name,fn]of [['Serialize spell',window.__headq.serialize],['Create template',window.__headq.template],['Generate from template',window.__headq.generate]]){const b=document.createElement('button');b.textContent=name;b.onclick=()=>{document.getElementById('serialized').textContent=JSON.stringify(fn());};document.getElementById('fixtures').append(b);}
mount('selected-zero');`;
read('vtt-react/node_modules/react/umd/react.development.js');read('vtt-react/node_modules/react-dom/umd/react-dom.development.js');
fs.writeFileSync(path.join(__dirname,'headq-wizard-witness-inputs.json'),JSON.stringify({capturedAt:new Date().toISOString(),sourceHashes:hashes,mocks:['state/dispatch context boundary (resource patch only)','visual-only icons/bootstrap/child components'],real:['React18 UMD','ReactDOM createRoot','unmodified Step5Resources component body','resourceManager','spellSerializer and real transitive data/format helpers'],limits:'No full SpellWizardProvider validation, library persistence, app save flow or backend exercised.'},null,2)+'\n');
const html='<!doctype html><html lang="en"><meta charset="utf-8"><title>HeadQ isolated Wizard witness</title><body><h1>Isolated production Wizard resource witness</h1><p>Planning research; no personal storage or shared room.</p><div id="fixtures"></div><pre id="serialized"></pre><div id="root"></div><script src="/react.js"></script><script src="/react-dom.js"></script><script src="/witness.js"></script></body></html>';
const server=http.createServer((request,response)=>{let text=html,type='text/html';if(request.url==='/witness.js'){text=bundle;type='application/javascript';}if(request.url==='/react.js'){text=fs.readFileSync(path.join(root,'vtt-react/node_modules/react/umd/react.development.js'));type='application/javascript';}if(request.url==='/react-dom.js'){text=fs.readFileSync(path.join(root,'vtt-react/node_modules/react-dom/umd/react-dom.development.js'));type='application/javascript';}response.setHeader('Content-Type',type);response.end(text);});
server.listen(0,'127.0.0.1',()=>{const ready={pid:process.pid,url:`http://127.0.0.1:${server.address().port}/`};fs.writeFileSync(path.join(__dirname,'headq-wizard-witness-ready.json'),JSON.stringify(ready,null,2)+'\n');console.log(JSON.stringify(ready));});
