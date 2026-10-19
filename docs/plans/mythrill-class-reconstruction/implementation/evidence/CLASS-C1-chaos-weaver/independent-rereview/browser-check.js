async (page) => {
  const results = {};
  const tab = name => page.getByRole('button',{name,exact:true}).click();
  const selectSpell = id => page.getByLabel('Spell (core, granted talent actives and rehearsal picks)').selectOption(id);
  const commit = async (id,ids,cont) => {
    await selectSpell(id);
    for(const tile of ids) await page.getByRole('checkbox',{name:`${tile} (${tile[0]})`,exact:true}).check();
    if(cont) await page.getByLabel(/Reserve one continuation ID/).selectOption(cont);
    await page.getByRole('button',{name:'Commit: publish the pair and lock it'}).click();
  };
  const face = async n => {await page.getByLabel('Physical face entered by hand').fill(String(n)); await tab('Record face');};
  const confirm = async () => {await page.getByRole('checkbox',{name:/Recorded the authored/}).first().waitFor();for(const box of await page.getByRole('checkbox',{name:/Recorded the authored/}).all()) await box.check();};
  const settle = async () => {await confirm(); await page.getByRole('button',{name:/^Settle: record/}).click();};
  const cast = async (id,ids,n) => {await commit(id,ids);if(n){await face(n);await settle();}};
  const turn = async () => {await page.getByLabel('AP available (manual entry)').fill('4');await tab('Confirm start of own turn');};
  const snapshot = async () => (await page.locator('.chaos-weaver-workshop').innerText());
  const start = async names => {
    await page.goto('http://localhost:3000/codex/character-creation/classes');
    await page.getByRole('button',{name:'Open class workshop'}).click();
    await tab('Talents');await page.getByLabel('Preview character level').selectOption('3');
    for(const [name,n] of names) {
      const node=page.locator('.cw-node').filter({has:page.locator('strong',{hasText:new RegExp('^\\d+\\. '+name+'$')})});
      for(let i=0;i<n;i++) await node.getByRole('button',{name:'+ rank',exact:true}).click();
    }
    await tab('Rehearsal');await tab('Start new rehearsal');
    await page.getByLabel('AP available (manual entry)').fill('4');await page.getByLabel('Remaining movement (ft)').fill('30');await tab('Apply worksheet counters');
  };
  page.c1Helpers={tab,selectSpell,commit,face,confirm,settle,cast,turn,snapshot,start};
  await page.setViewportSize({width:1280,height:900});
  await start([['Measured Reach',3],['Clean Surge',3],['Read the Fracture',3],['Shared Notebook',1],['Bias the Draw',1]]);
  await cast('cr1_chaos_weaver_bias_draw',['S1','S2','F1'],6);
  await cast('cr1_chaos_weaver_fold_odds',['S1','F1']);await turn();
  await cast('cr1_chaos_weaver_fold_odds',['S2']);await cast('cr1_chaos_weaver_bias_draw',['S1','S2','F2'],3);await turn();
  await cast('cr1_chaos_weaver_fold_odds',['S1','F2']);await cast('cr1_chaos_weaver_split_possibility',['M1','F1'],1);
  results.probability=await snapshot();page.c1Results=results;
  return results;
  /* Other sequences are run separately using the retained UI helpers to stay within MCP request timeouts.
  await start([['Ground Survey',3],['Braced Interface',3],['Material Memory',3],['Close Observation',1],['Unsteady Ground',1]]);
  await cast('cr1_chaos_weaver_unsteady_ground',['M1','F1']);await cast('cr1_chaos_weaver_split_possibility',['S1','F2'],1);
  await page.getByRole('button',{name:/^Trigger/}).click();await face(1);
  results.anomalyRetained=await snapshot();await settle();await turn();
  await cast('cr1_chaos_weaver_fold_odds',['M1','F1']);await cast('cr1_chaos_weaver_unsteady_ground',['M1','F1']);await turn();
  await page.getByRole('button',{name:/Dismiss anomaly.*1 AP/i}).click();await cast('cr1_chaos_weaver_fold_odds',['M1','F1']);
  results.anomaly=await snapshot();
  await start([['Sideways Reach',3],['Sure Footing',3],['Crosscurrent Hand',3],['Counterbalanced Load',1],['Second Possibility',1]]);
  await commit('cr1_chaos_weaver_second_possibility',['S1','F1'],'M1');await face(1);await confirm();
  await page.getByRole('button',{name:/Accept.*continuation/i}).click();await turn();
  await cast('cr1_chaos_weaver_fold_odds',['S1','F1']);await commit('cr1_chaos_weaver_second_possibility',['S1','F1'],'M2');await face(6);
  results.declineBefore=await snapshot();await page.getByRole('button',{name:/Decline.*continuation/i}).click();results.declineAfter=await snapshot();await turn();
  await cast('cr1_chaos_weaver_fold_odds',['S1','F1']);await commit('cr1_chaos_weaver_second_possibility',['S1','F1'],'M2');await face(1);
  await tab('Rules');await tab('Rehearsal');results.cascadeLocked=await snapshot();
  await page.setViewportSize({width:360,height:800});await page.emulateMedia({reducedMotion:'reduce'});
  results.mobile=await page.locator('.cw-tabs button,.cw-node-actions button').evaluateAll(es=>es.map(e=>({text:e.textContent.trim(),width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,clientWidth:e.clientWidth,scrollWidth:e.scrollWidth})));
  results.overflow=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
  await page.getByRole('button',{name:'Inspect tiles',exact:true}).focus();await page.keyboard.press('Enter');
  results.inspectorFocus=await page.evaluate(()=>document.activeElement.getAttribute('aria-label'));await page.keyboard.press('Escape');
  results.inspectorReturn=await page.evaluate(()=>document.activeElement.textContent);
  await page.getByRole('button',{name:/Back to classes/}).click();results.backFocus=await page.evaluate(()=>document.activeElement.textContent);
  return results; */
}
