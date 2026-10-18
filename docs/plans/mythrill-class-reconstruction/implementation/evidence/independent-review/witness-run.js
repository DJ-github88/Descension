async (page) => {
  const results = {};
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const mount = async (fixture, name) => {
    await page.evaluate(({fixture,name}) => window.__review.mount({...fixture,reviewCase:name}), {fixture,name});
    await page.waitForFunction(name => window.__state?.resourceCost?.reviewCase === name, name);
  };
  const step = async () => {
    await page.evaluate(() => window.__review.showStep());
    await page.waitForSelector('.resource-summary-body');
    await page.waitForTimeout(50);
  };
  results.conflicts = await page.evaluate(() => {
    const api = window.__review.res;
    return [
      {name:'canonical2-selected0',ap:2,selected:true,editor:0},
      {name:'canonical0-selected2',ap:0,selected:true,editor:2},
      {name:'absent-selected0',selected:true,editor:0},
      {name:'absent-deselected-stale0',selected:false,editor:0},
      {name:'absent-formula-stale0',selected:true,editor:0,formula:true}
    ].map(c => {
      const config = {level:1,effectTypes:[],resourceCost:{
        ...(c.ap !== undefined ? {actionPoints:c.ap} : {}),
        resourceTypes:c.selected ? ['actionPoints'] : [],resourceValues:{actionPoints:c.editor},
        useFormulas:{actionPoints:!!c.formula},resourceFormulas:{actionPoints:'1d6'}
      }};
      const actual = api.calculateTotalResources(config);
      return {name:c.name,input:config.resourceCost,recommendation:api.calculateActionPoints(config),
        total:actual.actionPoints,additional:actual.additionalResources ?? [],
        expectedTotal:c.ap !== undefined ? c.ap : c.selected && !c.formula ? c.editor : api.calculateActionPoints(config)};
    });
  });
  results.step5 = [];
  for (const fixture of [
    {name:'canonical2-selected0',actionPoints:2,resourceTypes:['actionPoints'],resourceValues:{actionPoints:0}},
    {name:'canonical0-selected2',actionPoints:0,resourceTypes:['actionPoints'],resourceValues:{actionPoints:2}},
    {name:'absent-selected0',actionPoints:undefined,resourceTypes:['actionPoints'],resourceValues:{actionPoints:0}},
    {name:'absent-deselected-stale0',actionPoints:undefined,resourceTypes:[],resourceValues:{actionPoints:0}}
  ]) {
    await mount(fixture,fixture.name);
    await step();
    results.step5.push(await page.evaluate(name => ({name,canonical:window.__state.resourceCost.actionPoints,
      input:document.querySelector('.resource-config-grid input[type=number]')?.value ?? null,
      summary:[...document.querySelectorAll('.resource-summary-body .resource-cost-value')].map(n=>n.textContent.trim())}), fixture.name));
  }
  await mount({actionPoints:2,resourceTypes:['actionPoints'],resourceValues:{actionPoints:2}}, 'batched-edit-deselect');
  await step();
  results.batchedEditDeselect = await page.evaluate(async () => {
    const input = document.querySelector('.resource-config-grid input[type=number]');
    const option = [...document.querySelectorAll('.resource-type-name')].find(n=>n.textContent==='Action Points').closest('.resource-type-option');
    const props = element => element[Object.keys(element).find(key=>key.startsWith('__reactProps$'))];
    ReactDOM.unstable_batchedUpdates(() => {
      props(input).onChange({target:{value:'0'}});
      props(option).onClick();
    });
    await new Promise(resolve=>setTimeout(resolve,50));
    return {canonical:window.__state.resourceCost.actionPoints,expected:0,resourceTypes:window.__state.resourceCost.resourceTypes,
      method:'Actual production onChange and onClick closures, invoked in one ReactDOM.unstable_batchedUpdates; no handler expressions copied.'};
  });
  await mount({actionPoints:0,mana:4,resourceTypes:['actionPoints','mana'],resourceValues:{actionPoints:0,mana:4,note_v:-2},
    resourceFormulas:{mana:'2d6'},useFormulas:{mana:false},components:['verbal','somatic'],materialComponents:'a lock of hair',
    spheres:['arcane','arcane','rime'],notes:{i:2,ii:0,iii:1,iv:0,v:2,vi:1,vii:3},
    secondaryCosts:[{type:'health',amount:4}],classResource:{cost:3,gain:10},unknown:{nested:[0,'kept']},
    classResourceProgram:{version:99,steps:[{op:'gain',amount:3}]}}, 'production-save-chain');
  await step();
  const before = await page.evaluate(() => window.__state.resourceCost);
  await page.locator('button[title="Finalize & Save Spell"]').click();
  await page.waitForFunction(() => window.__library.spells.length === 1);
  const main = await page.evaluate(() => window.__library.spells[0]);
  await page.evaluate(record => window.__review.reopen(record),main);
  await step();
  const mainReopened = await page.evaluate(() => window.__state.resourceCost);
  await page.evaluate(() => window.__showReview());
  await page.locator('.review-actions .save-button').click();
  await page.waitForFunction(() => window.__library.spells.length === 2);
  const review = await page.evaluate(() => window.__library.spells[1]);
  const secondary = JSON.parse(review.serializedData);
  await page.evaluate(record => window.__review.reopen(record),review);
  await step();
  const reopened = await page.evaluate(() => window.__state.resourceCost);
  results.productionPaths = {before,mainOuter:main.resourceCost,mainReopened,reviewOuter:review.resourceCost,
    reviewSecondary:secondary.resourceCost,reviewReopened:reopened,
    checks:{mainOuter:equal(before,main.resourceCost),mainReopened:equal(before,mainReopened),
      reviewOuter:equal(before,review.resourceCost),reviewSecondary:equal(before,secondary.resourceCost),reviewReopened:equal(before,reopened)}};
  results.serializer = await page.evaluate(() => {
    const {api,lib}=window.__review;
    const config=JSON.parse(JSON.stringify(window.__state)), before=JSON.stringify(config);
    const one=api.deserializeSpell(api.serializeSpell(config));
    const two=api.deserializeSpell(api.serializeSpell(one));
    const template=api.createSpellTemplate(config,'independent-template'), templateBefore=JSON.stringify(template);
    const changed=api.generateSpellFromTemplate(template,{'resourceCost.actionPoints':2,'resourceCost.notes':'changed'});
    const second=api.generateSpellFromTemplate(template,{});
    const fromString=api.generateSpellFromTemplate(JSON.stringify(template),{});
    const replacement=api.generateSpellFromTemplate(template,{resourceCost:{actionPoints:3}});
    const exported=JSON.parse(lib.exportLibrary(window.__library,'json'));
    const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
    return {twoActualCycles:equal(two.resourceCost,config.resourceCost),inputUnmutated:JSON.stringify(config)===before,
      templateExact:equal(template.resourceCost,config.resourceCost),templateUnmutated:JSON.stringify(template)===templateBefore,
      dottedIsolated:changed.resourceCost.actionPoints===2&&changed.resourceCost.notes==='changed'&&second.resourceCost.actionPoints===0,
      secondInstanceExact:equal(second.resourceCost,config.resourceCost),serializedTemplateExact:equal(fromString.resourceCost,config.resourceCost),
      wholeReplacement:equal(replacement.resourceCost,{actionPoints:3}),
      rawExportExact:exported.data.spells.every(record=>equal(record.resourceCost,config.resourceCost))};
  });
  if (!Object.values(results.productionPaths.checks).every(Boolean) || !Object.values(results.serializer).every(Boolean)) {
    throw Error('Save/serializer preservation failed: '+JSON.stringify(results));
  }
  await page.evaluate(results => {window.__independentResults=results;},results);
  return results;
}
