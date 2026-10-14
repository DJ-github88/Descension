require('../p7/preload.cjs');
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),Module=require('module');
const root=path.resolve(__dirname,'../../..'),deps=Module.createRequire(path.join(root,'vtt-react/package.json'));
async function main(){
 const built=require('./fixture.cjs').build(()=>false); await new Promise(r=>built.server.listen(0,'127.0.0.1',r));
 const browser=await deps('playwright').chromium.launch({channel:'chrome',headless:true});
 try {const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:'+built.server.address().port);
 await page.evaluate(async()=>{m('init').initStoreRegistry();__liveUser={uid:'p8-gm',getIdToken:async()=> 'fixture'};m('auth').default.getState().setUser(__liveUser);await m('coordinator').whenHandoffIdle();m('creatures').default.setState({creatures:[]});await m('loader').default();const creature=m('creatures').default.getState().creatures.find(c=>c.id==='grimmstalk'); if(!creature)throw Error('Actual loader failed');const placed={id:'p8-A',creatureId:'grimmstalk',mapId:'default',position:{x:250,y:250},state:{currentActionPoints:2,tempActionPoints:0,currentHp:30,tempHealth:0,currentMana:0,tempMana:0}};m('creatures').default.setState({creatureTokens:[placed],tokens:[placed]});m('game').default.setState({isGMMode:true,cameraX:0,cameraY:0,zoomLevel:1,playerZoom:1,dynamicFogEnabled:false});m('grid').createGridSystem(m('game').default);__root=ReactDOM.createRoot(document.getElementById('app'));ReactDOM.flushSync(()=>__root.render(React.createElement(m('token').default,{tokenId:'p8-A',position:{x:250,y:250}})));window.__rng=0;Math.random=()=>{__rng++;return .3;};});
 await page.locator('.creature-token').first().hover();await page.getByAltText('Feather Slash',{exact:true}).waitFor();await page.getByAltText('Feather Slash',{exact:true}).click();
 const observation=await page.evaluate(()=>({rng:__rng,text:document.body.innerText,targetUI:!!document.querySelector('[aria-label="Feather Slash target"]')}));
 const out=process.env.P8_OUTPUT;fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'production-red.json'),JSON.stringify({observation,errors,manifest:built.manifest},null,2),{flag:'wx'});
 assert(observation.rng>0,'Old mounted quick-use must demonstrate pretarget RNG');assert.equal(observation.targetUI,false);assert.deepEqual(errors,[]);console.log('Retained actual old quick-use RED: click rolls before target; no target consequence UI.');
 }finally{await browser.close();await new Promise(r=>built.server.close(r));}
}main().catch(e=>{console.error(e);process.exitCode=1;});
