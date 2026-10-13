const fs=require('fs'),path=require('path'),cp=require('child_process');
const root=path.resolve(__dirname,'../../..'),out=path.join(__dirname,'evidence');
const mode=process.argv[2];
const cases={
  server:{cwd:path.join(root,'server'),args:['--require',path.join(__dirname,'preload.cjs'),'node_modules/mocha/bin/mocha.js','tests/**/*.test.js','--timeout','10000','--exit']},
  frontend:{cwd:path.join(root,'vtt-react'),args:['node_modules/react-scripts/bin/react-scripts.js','test','--watchAll=false','--runInBand','--silent','--no-cache']},
  focused:{cwd:path.join(root,'vtt-react'),args:['node_modules/react-scripts/bin/react-scripts.js','test','--watchAll=false','--runInBand','--silent','--runTestsByPath',
    'src/persistence/__tests__/p6CharacterSave.production.test.jsx','src/persistence/__tests__/characterHandoffPreservation.test.js','src/persistence/__tests__/characterProjectionIsolation.test.js',
    'src/store/__tests__/waveB_characterRosterIsolation.test.js','src/services/__tests__/characterPersistence.test.js','src/persistence/__tests__/waveA_handoff.test.js',
    'src/persistence/__tests__/waveB_scopedStoreStorage.test.js','src/persistence/__tests__/waveB_scopedConsumer.test.js','src/store/__tests__/shareableStore.test.js',
    'src/hooks/__tests__/useJournalPersistence.lifecycleFences.test.js','src/hooks/__tests__/useJournalPersistence.ownerFence.test.js',
    'src/persistence/__tests__/PrivateProjectionBoundary.synchronousIsolation.test.js','src/persistence/__tests__/PrivateProjectionBoundary.missedActivation.test.js',
    'src/persistence/__tests__/registry.test.js','src/persistence/__tests__/waveB_b1b5Corrections.test.js','src/components/windows/__tests__/MythrillWindow.privateProjection.test.jsx',
    'src/components/multiplayer/__tests__/useSocketConnection.eligibility.test.js','src/persistence/__tests__/waveB_closureAcceptance.test.js','src/store/__tests__/combatStore.test.js']}
};
const selected=cases[mode];if(!selected)throw Error('Select server/frontend/focused');
let iteration=1;while(fs.existsSync(path.join(out,`${mode}-${iteration}.json`)))iteration++;
const started=new Date();
const result=cp.spawnSync(process.execPath,selected.args,{cwd:selected.cwd,env:{...process.env,CI:'true'},encoding:'utf8',timeout:600000,maxBuffer:32*1024*1024});
fs.writeFileSync(path.join(out,`${mode}-${iteration}.log`),(result.stdout||'')+(result.stderr||''));
const record={command:[process.execPath,...selected.args],cwd:selected.cwd,started:started.toISOString(),durationMs:Date.now()-started.getTime(),status:result.status,signal:result.signal,error:result.error?.message||null};
fs.writeFileSync(path.join(out,`${mode}-${iteration}.json`),JSON.stringify(record,null,2));console.log(JSON.stringify(record,null,2));process.exit(result.status??1);
