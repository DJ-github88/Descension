// Full-App wizard/provider validation. Fixture state is injected through the mounted
// provider's actual reducer, with no component remount or replacement module.
const assert = require('assert/strict');
exports.check = async function(page, save, evidence) {
  await page.evaluate(() => { history.pushState(null, '', '/account/characters/create'); window.dispatchEvent(new PopStateEvent('popstate')); });
  await page.locator('.character-wizard-container').waitFor();
  await page.evaluate(() => {
    window.__wizard = () => {
      const el = document.querySelector('.character-wizard-container');
      let root = el[Object.keys(el).find(k => k.startsWith('__reactFiber'))];
      while (root.return) root = root.return;
      const stack = [root.stateNode.current];
      while (stack.length) {
        const fiber = stack.pop();
        for (let hook = fiber.memoizedState; hook; hook = hook.next) if (hook.memoizedState?.characterData && hook.queue?.dispatch) return { state: hook.memoizedState, dispatch: hook.queue.dispatch };
        if (fiber.sibling) stack.push(fiber.sibling); if (fiber.child) stack.push(fiber.child);
      }
      throw Error('Mounted real wizard reducer not found');
    };
    __wizard().dispatch({ type: 'SET_SKILL_RANKS', payload: { athletics: 'MASTER', weaponMastery_sword: 'MASTER' } });
    __wizard().dispatch({ type: 'SET_CURRENT_STEP', payload: 2 });
  });
  await page.getByTestId('skill-budget-warning').waitFor();
  assert.match(await page.getByTestId('skill-budget-warning').innerText(), /over budget/i);
  await page.waitForFunction(() => !!__wizard().state.validationErrors.skillPoints);
  save('p11-app-budget.aria.yml', await page.locator('.character-wizard-container').ariaSnapshot());
  await page.evaluate(() => __wizard().dispatch({ type: 'SET_CURRENT_STEP', payload: 5 }));
  // Existing badge pulses continuously; bypass Playwright's stability wait, retain real pointer click.
  await page.getByRole('button', { name: 'Toggle completion status', exact: true }).click({ force: true });
  await page.getByText('Skill Training (within budget)', { exact: true }).waitFor();
  assert.equal(await page.getByRole('button', { name: /Create Character/ }).isDisabled(), true);
  assert.doesNotMatch(await page.locator('.character-wizard-container').innerText(), /Your hero is ready!/);
  save('p11-app-summary.aria.yml', await page.locator('.character-wizard-container').ariaSnapshot());
  // Load an existing story-progressed character through the production reducer's edit path.
  await page.evaluate(() => {
    __wizard().dispatch({ type: 'LOAD_CHARACTER', payload: { id: 'p11-existing', name: 'Existing veteran', class: 'Warrior', race: 'human', subrace: '',
      stats: { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 }, skillRanks: { athletics: 'MASTER', weaponMastery_sword: 'MASTER' } } });
    __wizard().dispatch({ type: 'SET_CURRENT_STEP', payload: 2 });
  });
  await page.getByTestId('skill-budget-note').waitFor();
  await page.waitForFunction(() => !__wizard().state.validationErrors.skillPoints);
  const state = await page.evaluate(() => ({ ranks: __wizard().state.characterData.skillRanks, editing: !!__wizard().state.originalCalling }));
  assert.equal(state.editing, true); assert.equal(state.ranks.weaponMastery_sword, 'MASTER');
  save('p11-app-existing-edit.aria.yml', await page.locator('.character-wizard-container').ariaSnapshot());
  evidence.witnesses.P11wizardBudgetSummaryExistingEdit = state;
};
