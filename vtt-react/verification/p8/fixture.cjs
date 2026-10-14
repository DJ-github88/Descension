// Inherited external SDK fixture; production loader/fan/token/controller/store bodies compile intact.
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'../../..');
exports.build=function(handleBridge){
 const styles=['components/grid/CreatureToken.css','styles/creature-token.css','components/ui/ActionFanOutMenu.css','components/grid/CreatureAbilityFanOut.css','components/grid/CreatureAbilityConfirmDialog.css','components/grid/CreatureAbilityQuickUse.css'];
 const bridge=(req,res)=>{if(req.url==='/io.js'){res.setHeader('Content-Type','text/javascript');res.end(fs.readFileSync(path.join(root,'vtt-react/node_modules/socket.io-client/dist/socket.io.js')));return true;}if(req.url==='/p8.css'){res.setHeader('Content-Type','text/css');res.end(styles.map(f=>fs.readFileSync(path.join(root,'vtt-react/src',f),'utf8')).join('\n'));return true;}if(req.url.startsWith('/assets/')){res.setHeader('Content-Type','image/svg+xml');res.end('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="#7a3b2e"/></svg>');return true;}return handleBridge(req,res);};
 let source=fs.readFileSync(path.join(root,'vtt-react/verification/p6/character-save-browser.cjs'),'utf8').split('async function main()')[0];
 source=source.replace("canonical: 'services/firebase/characterPersistenceService.js'", "canonical: 'services/firebase/characterPersistenceService.js', actors:'services/actorConsequenceService.js', game:'store/gameStore.js', creatures:'store/creatureStore.js', tokens:'store/characterTokenStore.js', map:'store/mapStore.js', chat:'store/chatStore.js', token:'components/grid/CreatureToken.jsx', loader:'utils/initCreatureStore.js', controls:'components/hud/ActorConsequenceControls.jsx', gate:'persistence/bootstrapPrivacyGate.js'");
 source=source.replace("if (file.endsWith('.json'))", "if (/\\.(png|jpg|jpeg|webp|svg)$/.test(file)) { modules[file].code='module.exports='+JSON.stringify('data:image/png;base64,'+fs.readFileSync(file).toString('base64'))+';'; return file; } if (file.endsWith('.json'))");
 source=source.replace("gate:'persistence/bootstrapPrivacyGate.js'", "gate:'persistence/bootstrapPrivacyGate.js', grid:'utils/InfiniteGridSystem.js'");
  source=source.replace("grid:'utils/InfiniteGridSystem.js'", "grid:'utils/InfiniteGridSystem.js', feather:'services/featherSlash.js', custody:'services/featherSlashCustody.js', condition:'store/conditionStore.js'");
  source=source.replace("condition:'store/conditionStore.js'", "condition:'store/conditionStore.js', spellContext:'components/spellcrafting-wizard/context/SpellLibraryContext.js'");
  source=source.replace("'prop-types','react-icons/fa'", "'react-icons/fa'");
  // The inherited import scanner is regex-based; do not parse require examples in comments.
  source=source.replace('babelrc: false, configFile: false,', 'babelrc: false, configFile: false, comments: false,');
 source=source.replace("'exports.io=()=>{throw Error(\"Socket outside P6 witness\");};'", "'exports.io=(...args)=>window.io(...args);'");
 source=source.replace('if (assets[req.url])','if (handleBridge(req,res)) return; if (req.url.startsWith("/data/")) { res.setHeader("Content-Type","application/json"); res.end(fs.readFileSync(path.join(sourceRoot,"../public",req.url))); return; } if (assets[req.url])');
 source=source.replace('<title>P6 character save witness</title>','<title>P8 implementation witness</title><link rel="stylesheet" href="/p8.css"><script src="/io.js"></script>');
 const sandbox={require,__dirname:path.join(root,'vtt-react/verification/p6'),module:{exports:{}},console,Buffer,process,handleBridge:bridge};
 vm.runInNewContext(source+'\nmodule.exports=start;',sandbox,{filename:'p8-fixture-builder.cjs'});
  return sandbox.module.exports();
};
if (require.main===module) { const built=exports.build(()=>false);built.server.listen(0,'127.0.0.1',()=>console.log('http://127.0.0.1:'+built.server.address().port)); }
