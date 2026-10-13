/** Mounted B1/B3/B5/B7 regressions. The HTTP outbound and Playwright inbound
 * bridge cross real Socket.IO subscriptions; browser on/off are functional. */
const fs = require('fs'), path = require('path'), Module = require('module');
const file = path.join(__dirname, 'browser.cjs');
const red = process.env.P7_CORRECTION_RED === '1';
let source = fs.readFileSync(file, 'utf8');
source = source.replace('const { FirebaseBatchWriter }', 'const { FirebaseBatchWriter, createSyncServices }');
source = source.replace('shouldPersist: () => true, ', '');
source = source.replace("{ gmUserId: 'u-a' }", "{ gmUserId: 'u-a', persistentRoomId:crypto.randomUUID() }");
source = source.replace("const character = {", "const services=createSyncServices(backend.io,backend.rooms,backend.players,{authorityService:backend.authorityService});for(const name of ['shouldPersist','captureAuthority','authorityCurrent','authorityAccept','authorityConfirm','captureMetadata','getRoomRevision','validateSnapshot','onConfirmed'])writer[name]=services.firebaseBatchWriter[name];writer.authorityRequired=true;\n   const character = {");
source = source.replace('await backend.stop();', 'services.firebaseBatchWriter.stop();services.movementDebouncer.stop();await backend.stop();');
source = source.replace("page.locator('.modular-health-bar-container')", "page.getByLabel('Target portrait')");
// Current TargetHUD has an accessible portrait image inside the context-menu frame.
source = source.replace("page.getByLabel('Target portrait')", "page.getByLabel(/Health: 30 of 50/)");
source = source.replace("on:()=>{},off:()=>{}", "on:(event,listener)=>{(__listeners[event] ||= new Set()).add(listener);},off:(event,listener)=>__listeners[event]?.delete(listener)");
source = source.replace("m('init').initStoreRegistry();", "window.__listeners={};window.__dispatch=(event,payload)=>{for(const listener of __listeners[event] || []) listener(payload);};m('init').initStoreRegistry();");
source = source.replace("await m('actors').refreshActorSnapshot();\n       __root", "await m('actors').refreshActorSnapshot();\n       __root");
source = source.replace("await m('actors').refreshActorSnapshot();\n      __root", "await m('actors').refreshActorSnapshot();window.__unsubscribeActors=m('actors').registerActorHandlers({socket:__socket});\n      __root");
source = source.replace("window.__socket={...__socket,id:socketId};", "__unsubscribeActors();window.__socket={...__socket,id:socketId};window.__unsubscribeActors=m('actors').registerActorHandlers({socket:__socket});");
source = source.replace("await page.goto(url);", `
    for(const event of ['actor_bound','actor_consequence_accepted','actor_proposal_pending','room_save_status']) client.on(event,payload=>{page.evaluate(({event,payload})=>window.__dispatch?.(event,payload),{event,payload}).catch(()=>{});});
    await page.goto(url);`);
source = source.replace('    await page.goto(url);', `
    await page.goto(url);
    // Pristine production GM shape, before personal build sync can add a GM
    // mirror to room.players: real socket -> functional subscription -> UI.
    const createdForDelivery=await ack(client,'token_created',{roomId:room.id,mapId:'default',token:{id:'gm-delivery',state:{currentHp:40,currentMana:20,currentActionPoints:3,conditions:[]}},creature:{stats:{maxHp:50,maxMana:30,maxAP:5}},position:{x:0,y:0}});assert.equal(createdForDelivery.success,true);
    const deliveryRaw=room.gameState.maps.default.tokens['gm-delivery'];
    const deliveryBound=await ack(client,'actor_bind',{roomId:room.id,ref:{kind:'creature',roomId:room.id,mapId:'default',tokenId:'gm-delivery'},snapshotHash:actors.hash(deliveryRaw)});assert.equal(deliveryBound.success,true);
    await page.evaluate(async({roomId,socketId})=>{m('init').initStoreRegistry();window.__liveUser={uid:'u-a',getIdToken:async()=>'fixture'};m('auth').default.getState().setUser(__liveUser);await m('coordinator').whenHandoffIdle();window.__listeners={};window.__dispatch=(event,payload)=>{for(const listener of __listeners[event]||[])listener(payload);};window.__socket={id:socketId,connected:true,emit:(event,payload,callback)=>fetch('/p7-event',{method:'POST',body:JSON.stringify({event,payload})}).then(r=>r.json()).then(v=>callback?.(v)),on:(event,listener)=>(__listeners[event]||=new Set()).add(listener),off:(event,listener)=>__listeners[event]?.delete(listener)};m('game').default.setState({isInMultiplayer:true,isGMMode:true,multiplayerRoom:{id:roomId},multiplayerSocket:__socket});await m('actors').refreshActorSnapshot();window.__unsubscribeActors=m('actors').registerActorHandlers({socket:__socket});window.__root=ReactDOM.createRoot(document.getElementById('app'));ReactDOM.flushSync(()=>__root.render(React.createElement(m('controls').default)));},{roomId:room.id,socketId:client.id});
    backend.registerAuthToken('pristine-peer','u-pristine-peer');const pristinePeer=backend.connect({token:'pristine-peer'});await new Promise(r=>pristinePeer.once('connect',r));const pristineJoined=new Promise(r=>pristinePeer.once('room_joined',r));pristinePeer.emit('join_room',{roomId:room.id,playerName:'Pristine peer',password:''});await pristineJoined;
    assert.notEqual(room.gm,backend.players.get(client.id));assert.equal(room.players.has(room.gm.id),false);
    const deliveryAdmission=await ack(client,'actor_snapshot',{roomId:room.id});const pristineCommand={version:1,roomId:room.id,commandId:crypto.randomUUID(),actionEpoch:deliveryAdmission.actionEpoch,baseCommitSequence:deliveryAdmission.commitSequence,actors:[{ref:deliveryBound.ref,expectedRevision:0,finalResources:{hp:{current:28,temp:0}}}]};const pristineProposal=await ack(pristinePeer,'actor_propose',pristineCommand);await page.waitForTimeout(100);
    const pristineConsumed=await page.evaluate(()=>m('game').default.getState().pendingActorProposal||null);assert.equal(!!pristineConsumed,!${red});
    if(${red}){await ack(client,'actor_adjudicate',{roomId:room.id,proposalId:pristineProposal.proposalId,contentHash:pristineProposal.contentHash});}else{assert.deepEqual(pristineConsumed.command,pristineCommand);await page.getByRole('button',{name:'Authorize this immutable result'}).click();}
    await page.waitForTimeout(100);const pristineHp=await page.evaluate(()=>m('actors').findActor('gm-delivery').state.currentHp);assert.equal(pristineHp,${red}?40:28);
    observations.B1Pristine={separateGMSession:true,gmAbsentFromMembers:true,proposal:pristineProposal,consumed:pristineConsumed,clientHp:pristineHp,serverHp:room.gameState.maps.default.tokens['gm-delivery'].state.currentHp,deliveryOnly:true};
    pristinePeer.disconnect();await page.evaluate(()=>{__unsubscribeActors();ReactDOM.flushSync(()=>__root.unmount());m('game').default.setState({pendingActorProposal:null});});`);
source = source.replace("'evidence/browser-results.json'", "'evidence/corrections-20261013/browser-" + (red ? 'red' : 'green') + ".json'");
source = source.replace("await page.getByRole('button', { name: 'Bind primary attachment' }).click();", "await page.getByRole('button', { name: 'Bind primary attachment' }).click();await page.waitForTimeout(100);console.log('Bind status',JSON.stringify(await page.evaluate(()=>m('game').default.getState().actorConsequenceStatus)));");
source = source.replace('    // Older receipt is display-only after newer state.', `
    observations.additionalSharedCleanup=await page.evaluate(()=>{const store=m('tokens').default;const saved=store.getState().characterTokens;const before=saved.find(t=>t.id==='pc-a').state.conditions;store.getState().cleanupExpiredConditions();const after=store.getState().characterTokens.find(t=>t.id==='pc-a').state.conditions;store.setState({characterTokens:saved});return {before,after};});
    assert.equal(observations.additionalSharedCleanup.after.length,${red} ? 0 : observations.additionalSharedCleanup.before.length);
    // Older receipt is display-only after newer state.`);
source = source.replace('    // Round zero survives scoped partialization and peer polling never ticks it.', `
    if(${red}){const repair=await page.evaluate(()=>m('actors').refreshActorSnapshot());if(!repair.success)await page.evaluate(()=>m('actors').acceptRecoveredActorSnapshot());}
    // Round zero survives scoped partialization and peer polling never ticks it.`);
const insertion = `
    // B1: a real peer proposes; ONLY delivered socket listeners populate the GM UI.
    backend.registerAuthToken('p7-peer','u-peer');const peer=backend.connect({token:'p7-peer'});
    await new Promise(resolve=>peer.once('connect',resolve));
    const joined=new Promise(resolve=>peer.once('room_joined',resolve));peer.emit('join_room',{roomId:room.id,playerName:'Peer',password:''});await joined;
    await page.waitForTimeout(1100);
    const currentSnapshot=await ack(client,'actor_snapshot',{roomId:room.id});
    const proposalCommand={version:1,roomId:room.id,commandId:crypto.randomUUID(),actionEpoch:currentSnapshot.actionEpoch,baseCommitSequence:currentSnapshot.commitSequence,actors:[{ref:remote.ref,expectedRevision:restored.gameState.maps.default.characterTokens['pc-b'].state.actorContract.revision,finalResources:{hp:{current:24,temp:0}}}]};
    const proposed=await ack(peer,'actor_propose',proposalCommand);await page.waitForTimeout(100);
    const consumed=await page.evaluate(()=>m('game').default.getState().pendingActorProposal||null);
    observations.B1={proposed,consumed,registeredListenerCount:await page.evaluate(()=>__listeners.actor_proposal_pending.size)};
    console.log('B1 delivery',JSON.stringify(observations.B1), 'separate',restored.gm!==backend.players.get(client.id),'member',restored.players.get(restored.gm.id)===backend.players.get(client.id));
    // Prior personal build sync also registers this GM in room.players. The
    // pristine separate-session B1 RED is frozen in the registered server suite.
    assert.equal(!!consumed,true);
    assert.deepEqual(consumed.command,proposalCommand);await page.getByRole('button',{name:'Authorize this immutable result'}).click();await page.waitForFunction(()=>m('tokens').default.getState().characterTokens.find(t=>t.id==='pc-b').character.health.current===24);
    // Independently observe accepted delivery (no direct service/ACK application).
    const deliverySnapshot=await ack(client,'actor_snapshot',{roomId:room.id});
    const delivered=await ack(client,'actor_consequence',{...proposalCommand,commandId:crypto.randomUUID(),actionEpoch:deliverySnapshot.actionEpoch,baseCommitSequence:deliverySnapshot.commitSequence,actors:[{ref:remote.ref,expectedRevision:restored.gameState.maps.default.characterTokens['pc-b'].state.actorContract.revision,finalResources:{hp:{current:23,temp:0}}}]});assert.equal(delivered.success,true);
    await page.waitForTimeout(100);observations.B1.acceptedClientHp=await page.evaluate(()=>m('tokens').default.getState().characterTokens.find(t=>t.id==='pc-b').character.health.current);
    assert.equal(observations.B1.acceptedClientHp,23);
    // B7 exact mounted sequence and observed attempted personal payload.
    await page.waitForTimeout(1100);
    const remoteSnapshot=await ack(client,'actor_snapshot',{roomId:room.id});
    const foreignRecord={version:1,id:'foreign-personal-probe',recordId:'foreign-personal-probe',name:'Foreign only',originalName:'Foreign only',type:'debuff',kind:'effect',target:remote.ref,targetId:'pc-b',targetType:'character',source:'review',durationType:'rounds',durationValue:3,remainingRounds:3,effects:{movementSpeed:-10},sharedTiming:'manual'};
    const foreignResult=await ack(client,'actor_consequence',{version:1,roomId:room.id,commandId:crypto.randomUUID(),actionEpoch:remoteSnapshot.actionEpoch,baseCommitSequence:remoteSnapshot.commitSequence,actors:[{ref:remote.ref,expectedRevision:restored.gameState.maps.default.characterTokens['pc-b'].state.actorContract.revision,conditions:[{op:'add',recordId:foreignRecord.id,record:foreignRecord}]}]});assert.equal(foreignResult.success,true);
    if(${red}) await page.evaluate(result=>m('actors').applyAcceptedConsequence(result),foreignResult);
    else await page.waitForFunction(()=>m('tokens').default.getState().characterTokens.find(t=>t.id==='pc-b').state.conditions.some(r=>r.id==='foreign-personal-probe'));
    await page.evaluate(()=>{const store=m('character').default;const seed={...store.getState().characters[0],id:'c-other',name:'Different selected character'};store.setState(current=>({characters:[...current.characters,seed],currentCharacterId:'c-other',name:seed.name,health:{current:42,max:50}}));});
    await page.waitForTimeout(150);
    await page.evaluate(()=>m('actors').hydrateActorConditions());
    await page.getByRole('button',{name:'Retry runtime save'}).click();
    await page.waitForFunction(()=>__docs.has('users/u-a/characterStates/c-other'));
    observations.B7=await page.evaluate(()=>({projection:m('actors').roomResourceProjection(),saved:__docs.get('users/u-a/characterStates/c-other'),conditions:m('condition').default.getState().activeDebuffs}));
    assert.equal(observations.B7.saved.debuffs.some(record=>record.id==='foreign-personal-probe'),${red});
    if(!${red}) assert(!observations.B7.saved.roomActorRecoveryCandidates?.some(c=>c.characterId==='c-a'));
    if(!${red}) {
      await page.evaluate(()=>{const store=m('condition').default;store.setState(current=>({activeDebuffs:[...current.activeDebuffs,{id:'selected-local',name:'Personal local',type:'debuff',targetId:'c-other',targetType:'character',durationType:'rounds',durationValue:2,remainingRounds:2},{id:'ambiguous-manual',name:'Unbound legacy',targetId:'unknown-token',targetType:'character',privateUnknown:{keep:'exact recovery bytes'}}]}));});
      await page.getByRole('button',{name:'Retry runtime save'}).click();await page.waitForFunction(()=>__docs.get('users/u-a/characterStates/c-other')?.debuffs.some(r=>r.id==='selected-local'));
      observations.B7.scopingControls=await page.evaluate(()=>({saved:__docs.get('users/u-a/characterStates/c-other'),recovery:m('game').default.getState().personalConditionRecoveryCandidates}));
      assert(!observations.B7.scopingControls.saved.debuffs.some(r=>['foreign-personal-probe','ambiguous-manual'].includes(r.id)));assert(observations.B7.scopingControls.recovery.some(c=>c.records.some(r=>r.privateUnknown?.keep==='exact recovery bytes')));
    }
    // B5 exact confirmed HP11 -> metadata-less HP49, with silent application spies.
    await page.evaluate(()=>{m('character').default.setState({currentCharacterId:'c-a'});m('actors').reconcileOwner();});
    const priorTokenSnapshot=await ack(client,'actor_snapshot',{roomId:room.id});const staleMaps=JSON.parse(JSON.stringify(priorTokenSnapshot.maps));
    delete staleMaps.default.characterTokens['pc-a'].state.actorContract;staleMaps.default.characterTokens['pc-a'].character.health.current=49;
    observations.B5=await page.evaluate(maps=>{let rng=0,emits=0;const random=Math.random,emit=__socket.emit;Math.random=()=>{rng++;return random();};__socket.emit=(...args)=>{emits++;return emit(...args);};let result;try{result=m('hydration').applyRoomSnapshot({scope:'room',roomId:m('game').default.getState().multiplayerRoom.id,gameState:{maps,defaultMapId:'default'}});}finally{Math.random=random;__socket.emit=emit;}const token=m('tokens').default.getState().characterTokens.find(t=>t.id==='pc-a');return {result,actorContract:token.state.actorContract||null,hp:token.character.health.current,ownerProjection:m('actors').roomResourceProjection(),recovery:m('game').default.getState().actorRecoverySnapshot||null,rng,emits};},staleMaps);
    assert.equal(observations.B5.hp,${red} ? 49 : 11);assert.equal(!!observations.B5.actorContract,!${red});assert.equal(observations.B5.rng,0);assert.equal(observations.B5.emits,0);
    if(!${red}){assert.equal(observations.B5.ownerProjection.health.current,11);assert.equal(observations.B5.recovery.result.maps.default.characterTokens['pc-a'].character.health.current,49);}
    // Recover for the independent B3 custody witness; this is explicit refresh.
    const refreshBeforeFault=await page.evaluate(()=>m('actors').refreshActorSnapshot());
    if(!refreshBeforeFault.success) console.log('Refresh diagnostic',JSON.stringify(await page.evaluate(()=>({result:m('game').default.getState().actorRecoverySnapshot,tokens:m('tokens').default.getState().characterTokens}))));
    const originalTo=backend.io.to.bind(backend.io);let failOnce=true;
    backend.io.to=target=>{const op=originalTo(target),emit=op.emit.bind(op);op.emit=(event,...args)=>{if(event==='actor_consequence_accepted'&&failOnce){failOnce=false;throw Error('publication transport failure');}return emit(event,...args);};return op;};
    const fault=await page.evaluate(()=>m('actors').adjustSharedResource('pc-a','health',-1));backend.io.to=originalTo;
    observations.B3={fault,liveHp:restored.gameState.maps.default.characterTokens['pc-a'].character.health.current};
    console.log('B3 mounted',JSON.stringify(observations.B3),'B5',JSON.stringify(observations.B5));
    assert.equal(fault.success,!${red});assert.equal(observations.B3.liveHp,10);
    if(${red}){assert.equal(fault.code,'invalid_consequence');assert.equal(fault.commandId,undefined);}else{assert.equal(fault.delivery,'partial');assert(fault.commandId);assert.equal(await page.evaluate(()=>m('character').default.getState().health.current),10);}
    if(!${red}) {
      // Both result deliveries fail after installation. Actual mounted retry
      // retains and resends the original command identity, with one mutation.
      await page.waitForTimeout(1100);
      await page.evaluate(()=>{window.__faultCommands=[];window.__priorEmit=__socket.emit;__socket.emit=(event,payload,callback)=>{if(event==='actor_consequence')__faultCommands.push(JSON.parse(JSON.stringify(payload)));return __priorEmit(event,payload,callback);};});
      const serverSocket=backend.io.sockets.sockets.get(client.id),oldPacket=serverSocket.packet.bind(serverSocket),beforeFaultSequence=restored.gameState.actorConsequences.commitSequence;let ackFails=true;
      serverSocket.packet=(packet,...args)=>{if(packet.type===3 && ackFails && restored.gameState.actorConsequences.commitSequence>beforeFaultSequence){ackFails=false;throw Error('ack transport failure');}return oldPacket(packet,...args);};
      backend.io.to=target=>{const op=originalTo(target),emit=op.emit.bind(op);op.emit=(event,...args)=>{if(event==='actor_consequence_accepted')throw Error('broadcast transport failure');return emit(event,...args);};return op;};
      const unknownResult=await page.evaluate(()=>m('actors').adjustSharedResource('pc-a','health',-1));serverSocket.packet=oldPacket;backend.io.to=originalTo;
      console.log('ACK fault custody',JSON.stringify(unknownResult));
      assert.equal(unknownResult.code,'outcome_unknown');assert(unknownResult.commandId);
      const installedFault=JSON.stringify(restored.gameState);
      await page.getByRole('button',{name:'Check same command'}).click();await page.waitForFunction(()=>m('character').default.getState().health.current===9);
      const attempts=await page.evaluate(()=>__faultCommands);assert.equal(attempts.length,2);assert.deepEqual(attempts[1],attempts[0]);assert.equal(attempts[0].commandId,unknownResult.commandId);assert.equal(JSON.stringify(restored.gameState),installedFault);
      const replay=await ack(client,'actor_consequence',attempts[0]);assert.equal(replay.success,true);assert.equal(JSON.stringify(restored.gameState),installedFault);
      observations.B3Ack={unknownResult,attempts,receipt:replay.receipt,singleMutation:true};
      await page.evaluate(()=>{__socket.emit=__priorEmit;});
    }
    peer.disconnect();
    if(!${red}) {
      // Valid absence, explicit reincarnation, unbound legacy hydration and room
      // changes remain accepted; the downgrade guard is not a deletion lock.
      client.emit('token_removed',{roomId:room.id,mapId:'default',tokenId:'gm-delivery'});await page.waitForTimeout(100);
      const deletionSnapshot=await ack(client,'actor_snapshot',{roomId:room.id});
      const deletion=await page.evaluate(maps=>m('hydration').applyRoomSnapshot({scope:'room',roomId:m('game').default.getState().multiplayerRoom.id,gameState:{maps,defaultMapId:'default'}}),deletionSnapshot.maps);assert.equal(deletion.applied,true);assert.equal(await page.evaluate(()=>m('actors').findActor('gm-delivery')),null);
      const recreated=await ack(client,'token_created',{roomId:room.id,mapId:'default',token:{id:'gm-delivery',state:{currentHp:7,currentMana:20,currentActionPoints:3,conditions:[]}},creature:{stats:{maxHp:50,maxMana:30,maxAP:5}},position:{x:0,y:0}});assert.equal(recreated.success,true);
      const legacy=await page.evaluate(()=>m('actors').refreshActorSnapshot());assert.equal(legacy.success,true);assert.equal(await page.evaluate(()=>m('actors').refOf(m('actors').findActor('gm-delivery'))),null);
      const replacementRaw=restored.gameState.maps.default.tokens['gm-delivery'];const replacementBound=await ack(client,'actor_bind',{roomId:room.id,ref:{kind:'creature',roomId:room.id,mapId:'default',tokenId:'gm-delivery'},snapshotHash:actors.hash(replacementRaw)});assert.equal(replacementBound.success,true);assert.notEqual(replacementBound.ref.instanceId,deliveryBound.ref.instanceId);
      await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>m('actors').findActor('gm-delivery').state.currentHp),7);
      const changeSnapshot=await ack(client,'actor_snapshot',{roomId:room.id});const roomChangeMaps=JSON.parse(JSON.stringify(changeSnapshot.maps));for(const map of Object.values(roomChangeMaps))for(const field of ['tokens','characterTokens'])for(const token of Object.values(map[field]||{}))delete token.state.actorContract;
      const roomChange=await page.evaluate(maps=>{m('game').default.setState({multiplayerRoom:{id:'different-room'}});return m('hydration').applyRoomSnapshot({scope:'room',roomId:'different-room',gameState:{maps,defaultMapId:'default'}});},roomChangeMaps);assert.equal(roomChange.applied,true);
      observations.B5.lifecycleControls={deletion,replacementBound,legacyUnboundHydration:true,roomChange};
    }
`;
source = source.replace('    // Actual local sandbox round bookkeeping remains functional.', insertion + '    // Actual local sandbox round bookkeeping remains functional.');
const runner = new Module(file, module); runner.filename = file; runner.paths = Module._nodeModulePaths(path.dirname(file)); runner._compile(source, file);
