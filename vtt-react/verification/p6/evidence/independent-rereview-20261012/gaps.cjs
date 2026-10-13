const fs=require('fs'), Module=require('module'), path=require('path');
const filename='D:/VTT/vtt-react/verification/p6/regressions-browser.cjs';
process.argv.push('--only=review-gap');
let code=fs.readFileSync(filename,'utf8');
code=code.replace("const output = path.join(evidenceRoot, 'green.json');",`const output = ${JSON.stringify(path.join(__dirname,'gaps.json'))};`);
const scenarios=String.raw`
      await scenario('review-gap-R1-legacy-and-unknown-shape-decoding', async page => {
        const evidence=await page.evaluate(async()=>{
          const canonical=m('canonical'), original=__docs.get('characters/c-a');
          const legacy=structuredClone(original);
          legacy.inventory.items=[{id:'legacy-shape',shape:{type:'custom',cells:['[true,false]','[false,true]']}}];
          legacy.preservedFields.futureAnnotation={shape:{cells:['[true]'],meaning:'literal JSON text; not an inventory item'}};
          const before=structuredClone(legacy);
          const decoded=canonical.transformFromStorage(legacy);
          __docs.set('characters/c-a',legacy);
          const loaded=await canonical.default.loadCharacter('c-a','u-a');
          return {before,decoded,loaded,sourceUnchanged:JSON.stringify(before)===JSON.stringify(legacy)};
        });
        assert.deepEqual(evidence.loaded.inventory.items[0].shape.cells,[[true,false],[false,true]]);
        assert.equal(evidence.sourceUnchanged,true);
        assert.deepEqual(evidence.loaded.futureAnnotation.shape.cells,[[true]]);
        return {...evidence,observed:'Legacy item decodes correctly, but unrelated preserved literal strings are silently converted to boolean arrays'};
      });
      await scenario('review-gap-R4-invalid-consumed-canonical-class', async page=>{
        await confirm(page);
        const before=await state(page);
        const raw=await page.evaluate(()=>{const doc=JSON.parse(m('outcome').exportCharacterDraft('c-a'));doc.runtime=null;doc.canonical.class={invalid:'object'};doc.canonical.lore.notes='INVALID CLASS MUST NOT APPLY';return JSON.stringify(doc);});
        await fileInput(page,raw);const after=await state(page);
        assert.equal(after.draft.canonical.lore.notes,'INVALID CLASS MUST NOT APPLY');
        assert.deepEqual(after.roster[0].class,{invalid:'object'});
        return {before,after,raw:JSON.parse(raw),observed:'Invalid consumed class passes preflight and mutates roster, live projection and draft without visible refusal'};
      });
      await scenario('review-gap-R5-private-memory-owner-return-accessibility', async page=>{
        await confirm(page);
        await page.evaluate(async()=>{await m('character').default.getState().startCharacterSession('c-a');window.__holdPath='characterSessions/'+m('session').default.activeSessions.get('c-a').id;window.__recordPromise=m('character').default.getState().recordCharacterChange('c-a','stat_change',{stat:'privateMemo',value:'A RETURN ACCESSIBILITY MARKER'});});
        await page.waitForFunction(()=>!!window.__release);await switchOwner(page,false);
        const refused=await page.evaluate(async()=>{window.__holdPath=null;__release.reject(Error('retired network failure'));return {recordResult:await __recordPromise,bRead:await m('session').default.getActiveSession('c-a'),bQueue:m('sync').default.loadOfflineChanges(),retained:m('session').default.activeSessions.get('c-a')};});
        assert.equal(refused.recordResult,false);assert.equal(refused.bRead,null);assert(!JSON.stringify(refused.bQueue).includes('A RETURN ACCESSIBILITY MARKER'));
        await page.evaluate(async()=>{window.__liveUser={uid:'u-a',getIdToken:async()=> 'a'};m('auth').default.getState().setUser(__liveUser);await m('coordinator').whenHandoffIdle();});
        const returned=await page.evaluate(async()=>{const readable=await m('session').default.getActiveSession('c-a');const source=structuredClone(readable);const completed=await m('character').default.getState().endCharacterSession('c-a');return {source,completed,document:__docs.get('characters/c-a'),afterSession:m('session').default.activeSessions.get('c-a')||null};});
        assert.equal(returned.source.changes.stats.privateMemo,'A RETURN ACCESSIBILITY MARKER');assert.equal(returned.completed,true);assert.equal(returned.document.stats.privateMemo,'A RETURN ACCESSIBILITY MARKER');
        return {refused,returned,observed:'Origin source privately retained and readable/applicable on A return without document reload; not reload-durable'};
      });
`;
code=code.replace("      await scenario('R2-older-import-protects-newer-work'",scenarios+"      await scenario('R2-older-import-protects-newer-work'");
const loaded=new Module(filename,module);loaded.filename=filename;loaded.paths=Module._nodeModulePaths(path.dirname(filename));loaded._compile(code,filename);
