/** Permanent P6 mounted production-path witness. Auth/Firestore transport only
 * are simulated; production stores, provider, hook, outcome and storage execute.
 * P5's original four evidence/witness files are left intact. */
const fs = require('fs');
const path = require('path');
const http = require('http');
const assert = require('assert/strict');
const { createHash } = require('crypto');
const { createRequire } = require('module');
const deps = createRequire(path.resolve(__dirname, '../../package.json'));
const babel = deps('@babel/core');
const sourceRoot = path.resolve(__dirname, '../../src');
/* global m, __docs, __seed, __mount, __release */

function start() {
  const modules = {};
  const virtual = {
    react: 'module.exports=window.React;', 'react-dom': 'module.exports=window.ReactDOM;',
    'react-dom/client': 'module.exports=window.ReactDOM;',
    'react-router-dom': 'exports.useNavigate=()=>()=>{}; exports.Link=p=>React.createElement("a",{href:p.to},p.children); exports.useLocation=()=>({pathname:"/account"});',
    uuid: 'exports.v4=()=>crypto.randomUUID();',
    'socket.io-client': 'exports.io=()=>{throw Error("Socket outside P6 witness");};',
    'firebase/auth': 'exports.onAuthStateChanged=()=>()=>{};exports.signOut=async()=>{};',
    'firebase-config': 'exports.db={};exports.auth={get currentUser(){return window.__liveUser;}};exports.isFirebaseConfigured=true;exports.isDemoMode=false;exports.isMockOrDevUser=()=>false;exports.storage={};exports.app={};',
    css: 'module.exports={};',
    'firebase/firestore': `
      const docs=window.__docs=new Map(JSON.parse(sessionStorage.getItem('__p6_fixture_cloud')||'[]')),writes=window.__writes=[];
      const clone=v=>JSON.parse(JSON.stringify(v));
      exports.doc=(_db,...parts)=>({path:parts.join('/'),id:parts.at(-1)});
      exports.collection=(_db,...parts)=>({path:parts.join('/')});
      exports.where=(field,op,value)=>({field,op,value});exports.orderBy=()=>({});exports.limit=()=>({});
      exports.query=(ref,...constraints)=>({...ref,constraints});
      exports.getDoc=async ref=>({exists:()=>docs.has(ref.path),data:()=>clone(docs.get(ref.path))});
      exports.getDocs=async ref=>{const values=[...docs].filter(([p,v])=>p.startsWith(ref.path+'/')&&(ref.constraints||[]).every(c=>!c.field||c.field.split('.').reduce((a,k)=>a&&a[k],v)===c.value)).map(([p,v])=>({id:p.split('/').at(-1),data:()=>clone(v)}));return {docs:values,empty:!values.length,forEach:fn=>values.forEach(fn)};};
      const write=async(op,ref,v)=>{writes.push({op,path:ref.path,value:clone(v),uid:window.__liveUser?.uid});
        if(window.__holdPath===ref.path)await new Promise((resolve,reject)=>{window.__release={resolve,reject};});
        if(window.__rejectRuntime&&ref.path.includes('/characterStates/'))throw Error('P6 runtime network refusal');
        if(window.__rejectCanonical&&ref.path.startsWith('characters/'))throw Error('P6 canonical network refusal');
        docs.set(ref.path,{...docs.get(ref.path),...clone(v)});
        sessionStorage.setItem('__p6_fixture_cloud',JSON.stringify([...docs]));};
      exports.updateDoc=(ref,v)=>write('updateDoc',ref,v);exports.setDoc=(ref,v)=>write('setDoc',ref,v);
      exports.addDoc=async(ref,v)=>{const r={path:ref.path+'/'+crypto.randomUUID()};await write('addDoc',r,v);return r;};
      exports.deleteDoc=async ref=>docs.delete(ref.path);exports.onSnapshot=()=>()=>{};
      exports.serverTimestamp=()=>({seconds:Date.now()/1000});exports.Timestamp={fromDate:v=>v};
      exports.arrayUnion=(...v)=>v;exports.arrayRemove=(...v)=>v;exports.increment=n=>n;
      exports.runTransaction=async(_db,fn)=>fn({get:exports.getDoc,set:exports.setDoc,update:exports.updateDoc});
      exports.writeBatch=()=>({set:()=>{},delete:()=>{},commit:async()=>{}});`,
    'firebase/storage': 'exports.getStorage=()=>({});exports.ref=()=>({});',
    'firebase/analytics': 'exports.getAnalytics=()=>null;exports.logEvent=()=>{};',
    'firebase/performance': 'exports.getPerformance=()=>null;'
  };
  const inert = 'module.exports=new Proxy(function(){return null;},{get(t,k){if(k==="__esModule")return false;if(k==="default")return module.exports;if(k==="then")return undefined;return function(){};}});';
  for (const name of ['@dice-roller/rpg-dice-roller','fast-json-patch','fuse.js','howler','perfect-freehand','polygon-clipping','rbush','roughjs','three',
    'three/examples/jsm/loaders/GLTFLoader','three/examples/jsm/utils/SkeletonUtils','visibility-polygon','@fortawesome/free-solid-svg-icons',
    '@fortawesome/free-regular-svg-icons','@fortawesome/react-fontawesome','prop-types','react-icons/fa']) virtual[name] = inert;
  function compile(file) {
    if (modules[file]) return file;
    modules[file] = { code: '', deps: {} };
    if (file.startsWith('virtual:')) { modules[file].code = virtual[file.slice(8)]; return file; }
    if (file.endsWith('.json')) { modules[file].code = `module.exports=${fs.readFileSync(file, 'utf8')};`; return file; }
    const code = babel.transformFileSync(file, { babelrc: false, configFile: false,
      plugins: [deps.resolve('@babel/plugin-transform-modules-commonjs'), deps.resolve('@babel/plugin-transform-dynamic-import')],
      presets: [deps.resolve('@babel/preset-react')] }).code;
    const imports = {};
    for (const match of code.matchAll(/require\((['"])([^'"]+)\1\)/g)) {
      const spec = match[2];
      let resolved;
      if (spec.endsWith('.css')) resolved = 'virtual:css';
      else if (virtual[spec]) resolved = `virtual:${spec}`;
      else if (spec.startsWith('.')) {
        const base = path.resolve(path.dirname(file), spec);
        resolved = [base, `${base}.js`, `${base}.jsx`, path.join(base, 'index.js')].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
        if (resolved === path.join(sourceRoot, 'config/firebase.js')) resolved = 'virtual:firebase-config';
      } else resolved = deps.resolve(spec);
      if (!resolved) throw Error(`Unresolved ${spec} in ${file}`);
      imports[spec] = compile(resolved);
    }
    modules[file] = { code, deps: imports };
    return file;
  }
  const entries = {};
  for (const [key, file] of Object.entries({ init: 'store/initStoreRegistry.js', auth: 'store/authStore.js', character: 'store/characterStore.js',
    inventory: 'store/inventoryStore.js', coordinator: 'persistence/handoff/accountHandoffCoordinator.js',
    provider: 'components/providers/CharacterPersistenceProvider.jsx', outcome: 'persistence/characterSaveOutcome.js',
    helpers: 'store/characterHelpers.js', storage: 'persistence/characterScopedStorage.js',
    canonical: 'services/firebase/characterPersistenceService.js' })) entries[key] = compile(path.join(sourceRoot, file));
  const manifest = Object.fromEntries(Object.keys(modules).filter(file => file.startsWith(sourceRoot)).map(file =>
    [path.relative(sourceRoot, file).replace(/\\/g, '/'), createHash('sha256').update(fs.readFileSync(file)).digest('hex')]));
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>P6 character save witness</title><link rel="stylesheet" href="/status.css"></head><body><div id="app"></div>
    <script src="/react.js"></script><script src="/react-dom.js"></script><script>window.process={env:{NODE_ENV:'test'}};window.global=window;
    const modules=${JSON.stringify(modules)},entries=${JSON.stringify(entries)},cache={};
    function load(file){if(cache[file])return cache[file].exports;const m={exports:{}};cache[file]=m;const r=modules[file];new Function('require','module','exports',r.code)(s=>load(r.deps[s]),m,m.exports);return m.exports;}
    window.m=name=>load(entries[name]);window.__mount=()=>{window.__root=ReactDOM.createRoot(document.getElementById('app'));ReactDOM.flushSync(()=>window.__root.render(React.createElement(m('provider').default,null,React.createElement('h1',null,'Selected character'))));};
    </script></body></html>`;
  const assets = { '/react.js': path.join(path.dirname(deps.resolve('react/package.json')), 'umd/react.development.js'),
    '/react-dom.js': path.join(path.dirname(deps.resolve('react-dom/package.json')), 'umd/react-dom.development.js'),
    '/status.css': path.join(sourceRoot, 'components/character-sheet/character-save-status.css') };
  const server = http.createServer((req, res) => {
    if (assets[req.url]) { res.setHeader('Content-Type', req.url.endsWith('.css') ? 'text/css' : 'text/javascript'); res.end(fs.readFileSync(assets[req.url])); }
    else { res.setHeader('Content-Type', 'text/html'); res.end(html); }
  });
  return { server, manifest };
}

async function main() {
  const { server, manifest } = start();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  if (process.argv.includes('--serve')) { console.log(url); return; }
  const browser = await deps('playwright').chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext({ acceptDownloads: true });
    await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(url);
    await page.evaluate(async () => {
      m('init').initStoreRegistry();
      window.__liveUser = { uid: 'u-a', getIdToken: async () => 'P6-test-token' };
      m('auth').default.getState().setUser(window.__liveUser);
      await m('coordinator').whenHandoffIdle();
      window.__seed = { id: 'c-a', name: 'P6 HERO', race: 'Human', class: 'Martyr', level: 3,
        stats: { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 },
        resources: { health: { current: 30, max: 50 }, mana: { current: 20, max: 50 }, actionPoints: { current: 2, max: 3 } }, lore: { notes: 'P6 baseline' },
        classResource: { type: 'devotionGauge', current: 0, max: 6, damage: 0, earnedLevels: 0, spentLevels: 0, bonusLevels: 0 }, unknownP6: { retained: true } };
      __docs.set('characters/c-a', m('canonical').transformForStorage(__seed, 'u-a'));
      await m('character').default.getState().loadActiveCharacter();
      __mount();
    });
    await page.getByRole('region', { name: 'Selected character save status' }).waitFor();
    await page.evaluate(() => {
      window.__rejectCanonical = true; window.__rejectRuntime = true;
      m('character').default.getState().updateLore('notes', 'P6 latest marginalia');
      m('character').default.getState().updateResource('health', 14);
      m('inventory').default.getState().updateCurrency({ gold: 23 });
    });
    await page.getByText('Save failed', { exact: false }).first().waitFor();
    await page.getByRole('button', { name: 'Retry runtime save' }).click();
    await page.waitForFunction(() => document.querySelector('.character-save-status').textContent.includes('runtime network refusal'));
    const failed = await page.locator('.character-save-status').innerText();
    assert(failed.includes('Device draft retained')); assert(failed.includes('Save failed'));
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download selected draft' }).click();
    const downloaded = await downloadPromise;
    const raw = JSON.parse(fs.readFileSync(await downloaded.path(), 'utf8'));
    assert.equal(raw.characterId, 'c-a'); assert.equal(raw.canonical.lore.notes, 'P6 latest marginalia');
    assert.equal(raw.runtime.health.current, 14); assert.equal(raw.canonical.inventory.currency.gold, 23);
    await page.evaluate(() => { window.__rejectCanonical = false; window.__rejectRuntime = false; });
    await page.getByRole('button', { name: 'Retry character save' }).click();
    await page.getByRole('button', { name: 'Retry runtime save' }).click();
    await page.waitForFunction(() => document.querySelector('.character-save-status').textContent.match(/Cloud saved/g)?.length === 2);
    const saved = await page.locator('.character-save-status').innerText();
    assert.equal(await page.evaluate(() => __docs.get('characters/c-a').lore.notes), 'P6 latest marginalia');
    assert.equal(await page.evaluate(() => __docs.get('users/u-a/characterStates/c-a').health.current), 14);
    await page.evaluate(() => {
      window.__holdPath = 'users/u-a/characterStates/c-a';
      m('character').default.getState().updateResource('health', 12);
    });
    await page.getByRole('button', { name: 'Retry runtime save' }).click();
    await page.waitForFunction(() => !!window.__release);
    await page.evaluate(() => {
      m('character').default.getState().updateResource('health', 8);
      window.__holdPath = null; __release.resolve();
    });
    await page.waitForFunction(() => document.querySelector('.character-save-status').textContent.includes('Personal runtime: Cloud save pending'));
    assert.equal(await page.evaluate(() => m('outcome').getCharacterCandidate('c-a', 'runtime').payload.health.current), 8);
    await page.evaluate(() => { window.__rejectCanonical = true; window.__rejectRuntime = true; });
    // Fresh document/module graph: real browser reload restores actual scoped bytes.
    await page.reload();
    await page.evaluate(async () => {
      m('init').initStoreRegistry(); window.__liveUser = { uid: 'u-a', getIdToken: async () => 'test' };
      m('auth').default.getState().setUser(window.__liveUser); await m('coordinator').whenHandoffIdle();
      await m('character').default.getState().loadActiveCharacter(); __mount();
    });
    await page.waitForFunction(() => m('character').default.getState().health.current === 8, null, { timeout: 5000 }).catch(async error => {
      console.error('P6 reload diagnostic', await page.evaluate(() => ({
        id: m('character').default.getState().currentCharacterId, health: m('character').default.getState().health,
        roster: m('character').default.getState().characters.map(c => ({ id: c.id, health: c.health })),
        candidate: m('outcome').getCharacterCandidate('c-a', 'runtime'), keys: Object.keys(localStorage),
        ui: document.body.textContent.slice(0, 1800)
      })));
      throw error;
    });
    assert.equal(await page.evaluate(() => m('character').default.getState().lore.notes), 'P6 latest marginalia');
    const recovered = await page.locator('.character-save-status').innerText();
    assert.equal(errors.length, 0, errors.join('\n'));
    console.log(JSON.stringify({ result: 'PASS', witnesses: ['mounted-failure-retry', 'selected-download', 'canonical-runtime-separation', 'newer-runtime-during-old-ACK', 'real-reload-recovery'], failed, saved, recovered, manifest }, null, 2));
    await context.close();
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
}
if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { start };
