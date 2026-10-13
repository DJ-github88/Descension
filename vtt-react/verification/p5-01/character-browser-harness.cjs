/** Isolated P5-01 loader. Production source is compiled unchanged; only the
 * external boundaries listed in MYTHRILL_P5_01_CHARACTER_PRESERVATION_REPLAY.md
 * are replaced. No character/store/persistence implementation overrides. */
const fs = require('fs');
const path = require('path');
const http = require('http');
const {createHash} = require('crypto');
const { createRequire } = require('module');
const deps = createRequire(path.resolve(__dirname, '../../package.json'));
const babel = deps('@babel/core');

function start(sourceRoot = path.resolve(__dirname, '../../src')) {
  const modules = {};
  const virtual = {
    react: 'module.exports = window.React;',
    'react-dom': 'module.exports = window.ReactDOM;',
    'react-dom/client': 'module.exports = window.ReactDOM;',
    'react-router-dom': `exports.useNavigate = () => () => {};
      exports.Link = p => React.createElement('a', {href:p.to}, p.children);
      exports.useLocation = () => ({pathname:'/account'});`,
    uuid: 'exports.v4 = () => crypto.randomUUID();',
    'socket.io-client': 'exports.io = () => { throw Error("Socket transport outside this witness"); };',
    'firebase/auth': `exports.onAuthStateChanged = () => () => {};
      exports.signOut = async () => {};`,
    'firebase-config': `exports.db = {}; exports.auth = {get currentUser(){return window.__liveUser;}};
      exports.isFirebaseConfigured = true; exports.isDemoMode = false;
      exports.googleProvider = {}; exports.storage = {}; exports.app = {};
      exports.isMockOrDevUser = () => false;`,
    css: 'module.exports = {};',
    'firebase/firestore': `
      const docs = window.__docs = new Map();
      const writes = window.__writes = [];
      const clone = v => JSON.parse(JSON.stringify(v));
      const nested = (v, key) => key.split('.').reduce((a,k) => a && a[k], v);
      exports.doc = (_db,...parts) => ({path:parts.join('/'),id:parts.at(-1)});
      exports.collection = (_db,...parts) => ({path:parts.join('/')});
      exports.where = (field,op,value) => ({field,op,value});
      exports.orderBy = () => ({}); exports.limit = () => ({});
      exports.query = (ref,...constraints) => ({...ref,constraints});
      exports.getDoc = async ref => ({exists:()=>docs.has(ref.path),data:()=>clone(docs.get(ref.path)),id:ref.id});
      exports.getDocs = async ref => {
        const values = [...docs].filter(([p,v]) => p.startsWith(ref.path+'/') &&
          (ref.constraints || []).every(c => !c.field || nested(v,c.field) === c.value))
          .map(([p,v]) => ({id:p.split('/').at(-1),data:()=>clone(v)}));
        return {docs:values,size:values.length,empty:!values.length,forEach:fn=>values.forEach(fn)};
      };
      const write = (op,ref,value) => {
        writes.push({op,path:ref.path,value:clone(value),liveUid:window.__liveUser?.uid || null});
        if (window.__rejectCloud && ref.path.startsWith('characters/')) return Promise.reject(Error('injected network rejection'));
        docs.set(ref.path,{...(docs.get(ref.path)||{}),...clone(value)});
        return Promise.resolve();
      };
      exports.setDoc = (ref,v) => write('setDoc',ref,v);
      exports.updateDoc = (ref,v) => write('updateDoc',ref,v);
      exports.addDoc = async (ref,v) => {const r={path:ref.path+'/'+crypto.randomUUID()};await write('addDoc',r,v);return r;};
      exports.deleteDoc = async ref => docs.delete(ref.path);
      exports.onSnapshot = () => () => {};
      exports.serverTimestamp = () => ({seconds:Date.now()/1000});
      exports.Timestamp = {fromDate:date=>({toDate:()=>date})};
      exports.arrayUnion = (...v) => v; exports.arrayRemove = (...v) => v;
      exports.increment = n => n;
      exports.runTransaction = async (_db,fn) => fn({get:exports.getDoc,set:exports.setDoc,update:exports.updateDoc});
      exports.writeBatch = () => {const ops=[];return {set:(r,v)=>ops.push(()=>exports.setDoc(r,v)),
        update:(r,v)=>ops.push(()=>exports.updateDoc(r,v)),delete:r=>ops.push(()=>exports.deleteDoc(r)),
        commit:()=>Promise.all(ops.map(fn=>fn()))};};`,
    'firebase/storage': `exports.getStorage=()=>({}); exports.ref=()=>({});`,
    'firebase/analytics': 'exports.getAnalytics=()=>null; exports.logEvent=()=>{};',
    'firebase/performance': 'exports.getPerformance=()=>null;'
  };
  // These packages belong to unrelated rendering/geometry/audio branches of the
  // imported store graph. The exercised character path never invokes them.
  const stub = `module.exports = new Proxy(function(){return null;}, {get(t,k){
    if(k==='__esModule')return false;if(k==='default')return module.exports;
    if(k==='then')return undefined;return function(){return undefined;};}});`;
  for (const name of ['@dice-roller/rpg-dice-roller','fast-json-patch','fuse.js','howler',
    'perfect-freehand','polygon-clipping','rbush','roughjs','three',
    'three/examples/jsm/loaders/GLTFLoader','three/examples/jsm/utils/SkeletonUtils',
    'visibility-polygon','@fortawesome/free-solid-svg-icons','@fortawesome/free-regular-svg-icons',
    '@fortawesome/react-fontawesome','prop-types','react-icons/fa']) virtual[name] = stub;

  function compile(file) {
    if (modules[file]) return file;
    modules[file] = {code:'',deps:{}};
    if (file.startsWith('virtual:')) {
      modules[file].code = virtual[file.slice(8)];
      return file;
    }
    if (file.endsWith('.json')) {
      modules[file].code = `module.exports = ${fs.readFileSync(file,'utf8')};`;
      return file;
    }
    const code = babel.transformFileSync(file, {babelrc:false,configFile:false,
      plugins:[deps.resolve('@babel/plugin-transform-modules-commonjs'),deps.resolve('@babel/plugin-transform-dynamic-import')],
      presets:[deps.resolve('@babel/preset-react')]}).code;
    const imports = {};
    for (const match of code.matchAll(/require\((['"])([^'"]+)\1\)/g)) {
      const spec = match[2];
      let resolved;
      if (spec.endsWith('.css')) resolved = 'virtual:css';
      else if (virtual[spec]) resolved = `virtual:${spec}`;
      else {
        if (spec.startsWith('.')) {
          const base = path.resolve(path.dirname(file),spec);
          resolved = [base,`${base}.js`,`${base}.jsx`,path.join(base,'index.js')]
            .find(p => fs.existsSync(p) && fs.statSync(p).isFile());
        } else resolved = deps.resolve(spec);
        if (!resolved) throw Error(`Unresolved ${spec} from ${file}`);
        if (resolved === path.join(sourceRoot,'config/firebase.js')) resolved = 'virtual:firebase-config';
      }
      imports[spec] = compile(resolved);
    }
    modules[file] = {code,deps:imports};
    return file;
  }
  const entries = {};
  for (const [name,file] of Object.entries({
    init:'store/initStoreRegistry.js',auth:'store/authStore.js',character:'store/characterStore.js',
    helpers:'store/characterHelpers.js',coordinator:'persistence/handoff/accountHandoffCoordinator.js',
    gate:'persistence/bootstrapPrivacyGate.js',storage:'persistence/characterScopedStorage.js',
    boundary:'persistence/PrivateProjectionBoundary.jsx',ui:'components/account/CharacterManagement.jsx'
  })) entries[name] = compile(path.join(sourceRoot,file));
  const preservation = path.join(sourceRoot,'persistence/characterHandoffPreservation.js');
  if (fs.existsSync(preservation)) entries.preservation = compile(preservation);
  const html = `<!doctype html><html><head><title>P5 character preservation witness</title></head>
    <body><div id="app"></div><script src="/react.js"></script><script src="/react-dom.js"></script>
    <script>window.process={env:{NODE_ENV:'test'}};window.global=window;
    const modules=${JSON.stringify(modules)},entries=${JSON.stringify(entries)},cache={};
    function load(file){if(cache[file])return cache[file].exports;const m={exports:{}};cache[file]=m;
      const r=modules[file];new Function('require','module','exports',r.code)(s=>load(r.deps[s]),m,m.exports);return m.exports;}
    window.m=name=>load(entries[name]);window.__entries=entries;
    </script></body></html>`;
  const assets = {'/react.js':path.join(path.dirname(deps.resolve('react/package.json')),'umd/react.development.js'),
    '/react-dom.js':path.join(path.dirname(deps.resolve('react-dom/package.json')),'umd/react-dom.development.js')};
  const sourceManifest = {};
  for (const file of ['persistence/characterHandoffPreservation.js','persistence/characterScopedStorage.js',
    'persistence/scopedStoreHandoffs.js','store/characterHelpers.js','store/characterSlices/coreSlice.js',
    'services/firebase/characterPersistenceService.js','persistence/privateStorageRegistry.js']) {
    const full = path.join(sourceRoot,file);
    if (fs.existsSync(full)) sourceManifest[file] = createHash('sha256').update(fs.readFileSync(full)).digest('hex').toUpperCase();
  }
  const server = http.createServer((req,res) => {
    res.setHeader('Content-Type',assets[req.url]?'text/javascript':'text/html');
    res.end(assets[req.url]?fs.readFileSync(assets[req.url]):html);
  });
  return new Promise(resolve => server.listen(0,'127.0.0.1',()=>resolve({server,port:server.address().port,sourceManifest})));
}
module.exports = {start,deps};
if (require.main === module) start().then(({port}) => console.log(`http://127.0.0.1:${port}/`));
