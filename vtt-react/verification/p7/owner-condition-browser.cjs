// Permanent matched-owner preservation witness from the independent cycle-1 RED.
// Extend only the mounted bounds setup; production modules are not instrumented.
const fs = require('fs'), path = require('path'), Module = require('module');
const file = path.join(__dirname, 'bounds-browser.cjs');
let source = fs.readFileSync(file, 'utf8');
const entry = "controls:'components/hud/ActorConsequenceControls.jsx'";
const marker = "    evidence.accessibilitySnapshot = await page.locator('body').ariaSnapshot();";
if (!source.includes(entry) || !source.includes(marker)) throw Error('Mounted witness marker drift');
source = source.replace(entry, entry + ", condition:'store/conditionStore.js'");
source = source.replace(marker, `
    const ownerSnapshot = await ack(client, 'actor_snapshot', { roomId: room.id });
    const preservation = await page.evaluate(snapshot => {
      const local = [2, 0].map(round => ({ id:'selected-local-round'+round, name:'Selected local', type:'debuff',
        targetId:'c-bounds', targetType:'character', durationType:'rounds', durationValue:2, remainingRounds:round }));
      const ambiguous = { id:'owner-ambiguous', name:'Unbound legacy', targetId:'unknown-slot', targetType:'character',
        privateUnknown:{keep:'owner exact bytes', nested:[0,false,null]}, remainingRounds:0 };
      const foreign = { id:'foreign-personal', type:'debuff', ownerUid:'other-owner', characterId:'other-character' };
      const staleRef = { ...m('actors').refOf(m('actors').findActor('bounds-pc')), instanceId:'retired-incarnation' };
      const staleRoom = { id:'retired-room-record', recordId:'retired-room-record', type:'debuff', target:staleRef };
      const store = m('condition').default;
      store.setState({ activeBuffs:[], activeDebuffs:[...local, ambiguous, foreign, staleRoom] });
      const before = { projection:m('actors').roomResourceProjection(), conditions:store.getState().activeDebuffs };
      let rng=0, emits=0; const random=Math.random, emit=__socket.emit;
      Math.random=()=>{rng++;return random();}; __socket.emit=()=>{emits++;};
      const observations=[];
      const observe = (name, options) => {
        const result=m('hydration').applyRoomSnapshot(options);
        observations.push({name,result,conditions:store.getState().activeDebuffs});
      };
      try {
        const full={ scope:'room', roomId:snapshot.roomId, actorProjection:snapshot.actorProjection,
          gameState:{maps:snapshot.maps,actorProjection:snapshot.actorProjection,defaultMapId:'default',
            buffs:[{id:'foreign-global',targetId:'foreign-character',targetType:'character'}],debuffs:[]} };
        observe('room',full); observe('room-repeat',full);
        observe('map',{scope:'map',roomId:snapshot.roomId,mapId:'default',mapData:snapshot.maps.default,actorProjection:snapshot.actorProjection});
        observe('section',{scope:'section',roomId:snapshot.roomId,mapId:'default',actorProjection:snapshot.actorProjection,
          sections:{tokens:snapshot.maps.default.tokens,characterTokens:snapshot.maps.default.characterTokens}});
      } finally { Math.random=random; __socket.emit=emit; }
      return {before,local,ambiguous,observations,afterProjection:m('actors').roomResourceProjection(),rng,emits,
        recovery:m('outcome').getPersonalConditionRecovery('c-bounds')};
    }, ownerSnapshot);
    evidence.observations.ownerConditions = preservation;
    fs.writeFileSync(path.join(out,'owner-conditions.json'),JSON.stringify({preservation,manifest:built.manifest,serverHashes,pageErrors:errors},null,2),{flag:'wx'});
    assert(preservation.before.projection,'Mounted selected owner attachment required');
    for (const observation of preservation.observations) {
      assert.equal(observation.result.applied,true,observation.name);
      assert.deepEqual(observation.conditions,preservation.local,observation.name+' must preserve exact selected-local records only');
    }
    assert.deepEqual(preservation.afterProjection,preservation.before.projection);
    assert.equal(preservation.rng,0); assert.equal(preservation.emits,0);
    assert(preservation.recovery.some(candidate=>candidate.records.some(record=>JSON.stringify(record)===JSON.stringify(preservation.ambiguous))), 'Ambiguous exact bytes must survive shared hydration');
    const current = await page.evaluate(()=>m('actors').findActor('bounds-pc'));
    const accepted = await page.evaluate(token=>m('actors').submitActorEntries([{ref:m('actors').refOf(token),expectedRevision:token.state.actorContract.revision,
      finalResources:{hp:{current:39,temp:6}}}]),current);
    assert.equal(accepted.success,true,JSON.stringify(accepted));
    const afterReceipt=await page.evaluate(()=>({conditions:m('condition').default.getState().activeDebuffs,
      recovery:m('outcome').getPersonalConditionRecovery('c-bounds')}));
    assert.deepEqual(afterReceipt.conditions,preservation.local,'Accepted receipt must preserve local round2 and round0');
    assert.deepEqual(afterReceipt.recovery,preservation.recovery);
    evidence.observations.ownerConditionsAccepted={accepted,afterReceipt};
` + marker);
const loaded = new Module(file, module); loaded.filename = file;
loaded.paths = Module._nodeModulePaths(path.dirname(file)); loaded._compile(source, file);
