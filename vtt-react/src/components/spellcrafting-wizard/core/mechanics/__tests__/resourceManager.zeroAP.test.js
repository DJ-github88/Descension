import {
  calculateActionPoints,
  calculateClassResourceCost,
  calculateManaCost,
  calculateTotalResources
} from '../resourceManager';

const spell = (resourceCost, extra = {}) => ({
  name: 'Zero AP Fixture',
  level: 1,
  effectTypes: [],
  resourceCost,
  ...extra
});

const additionalRow = (resources, type) =>
  (resources.additionalResources || []).find(row => row.type === type);

describe('resourceManager zero-AP preservation', () => {
  it('keeps canonical 0 in the total instead of the recommendation', () => {
    const resources = calculateTotalResources(spell({ actionPoints: 0 }));
    expect(resources.actionPoints).toBe(0);
  });

  it('keeps canonical 2 in the total', () => {
    const resources = calculateTotalResources(spell({ actionPoints: 2 }));
    expect(resources.actionPoints).toBe(2);
  });

  it('keeps a selected fixed editor 0 when canonical AP is genuinely absent', () => {
    const config = spell({
      resourceTypes: ['actionPoints'],
      resourceValues: { actionPoints: 0 }
    });
    const resources = calculateTotalResources(config);
    expect(resources.actionPoints).toBe(0);
    expect(additionalRow(resources, 'actionPoints').value).toBe(0);
  });

  it('prefers canonical AP over the fixed editor when both exist', () => {
    const config = spell({
      actionPoints: 2,
      resourceTypes: ['actionPoints'],
      resourceValues: { actionPoints: 0 }
    });
    const resources = calculateTotalResources(config);
    expect(resources.actionPoints).toBe(2);
    expect(additionalRow(resources, 'actionPoints').value).toBe(2);
  });

  it('keeps canonical 0 in the total and additional AP row when a conflicting editor 2 exists', () => {
    const config = spell({
      actionPoints: 0,
      resourceTypes: ['actionPoints'],
      resourceValues: { actionPoints: 2 }
    });
    const resources = calculateTotalResources(config);
    expect(resources.actionPoints).toBe(0);
    expect(additionalRow(resources, 'actionPoints').value).toBe(0);
  });

  it('ignores a deselected stale editor 0 and keeps the existing recommendation', () => {
    const config = spell({
      resourceTypes: [],
      resourceValues: { actionPoints: 0 }
    });
    const resources = calculateTotalResources(config);
    expect(resources.actionPoints).toBe(calculateActionPoints(config));
    expect(additionalRow(resources, 'actionPoints')).toBeUndefined();
  });

  it('ignores a stale editor 0 in formula mode and preserves the formula row without evaluating it', () => {
    const config = spell({
      resourceTypes: ['actionPoints'],
      resourceValues: { actionPoints: 0 },
      useFormulas: { actionPoints: true },
      resourceFormulas: { actionPoints: '1d6' }
    });
    const resources = calculateTotalResources(config);
    expect(resources.actionPoints).toBe(calculateActionPoints(config));
    const row = additionalRow(resources, 'actionPoints');
    expect(row).toBeTruthy();
    expect(row.useFormula).toBe(true);
    expect(row.formula).toBe('1d6');
    expect(row.value).toBe(0);
  });

  it('retains the existing calculateActionPoints recommendation when both encodings are missing', () => {
    const config = spell({ resourceValues: {} });
    const resources = calculateTotalResources(config);
    expect(resources.actionPoints).toBe(calculateActionPoints(config));
  });

  it('keeps explicit PASSIVE 0 at 0 without a new type default', () => {
    const resources = calculateTotalResources(spell({ actionPoints: 0 }, { spellType: 'PASSIVE' }));
    expect(resources.actionPoints).toBe(0);
  });

  it('retains the existing recommendation for genuinely missing PASSIVE AP', () => {
    const config = spell({ resourceValues: {} }, { spellType: 'PASSIVE' });
    const resources = calculateTotalResources(config);
    expect(resources.actionPoints).toBe(calculateActionPoints(config));
  });

  it('does not convert malformed supplied AP into a valid fallback', () => {
    expect(calculateTotalResources(spell({ actionPoints: null })).actionPoints).toBeNull();
    expect(calculateTotalResources(spell({ actionPoints: '2' })).actionPoints).toBe('2');
    expect(calculateTotalResources(spell({ actionPoints: -1 })).actionPoints).toBe(-1);
    expect(calculateTotalResources(spell({ actionPoints: 0.5 })).actionPoints).toBe(0.5);
    expect(calculateTotalResources(spell({ actionPoints: NaN })).actionPoints).toBeNaN();
    expect(calculateTotalResources(spell({ actionPoints: Infinity })).actionPoints).toBe(Infinity);
  });

  it('keeps canonical 0 in the additional AP row instead of a class-resource estimate', () => {
    const config = spell({ actionPoints: 0, resourceTypes: ['actionPoints'] });
    const row = additionalRow(calculateTotalResources(config), 'actionPoints');
    expect(row).toBeTruthy();
    expect(row.value).toBe(0);
  });

  it('keeps a fixed editor 0 in the additional AP row when canonical AP is absent', () => {
    const config = spell({
      resourceTypes: ['actionPoints'],
      resourceValues: { actionPoints: 0 }
    });
    const resources = calculateTotalResources(config);
    expect(resources.actionPoints).toBe(0);
    const row = additionalRow(resources, 'actionPoints');
    expect(row).toBeTruthy();
    expect(row.value).toBe(0);
  });

  it('retains the existing class-resource fallback when the additional AP row has no fixed encoding', () => {
    const config = spell({ resourceTypes: ['actionPoints'], resourceValues: {} });
    const resources = calculateTotalResources(config);
    const row = additionalRow(resources, 'actionPoints');
    expect(row).toBeTruthy();
    expect(row.value).toBe(calculateClassResourceCost(config, 'actionPoints'));
  });

  it('leaves non-AP resources unchanged', () => {
    const config = spell({ actionPoints: 2, resourceTypes: ['mana'], resourceValues: { mana: 4 } });
    const resources = calculateTotalResources(config);
    const row = additionalRow(resources, 'mana');
    expect(row).toBeTruthy();
    expect(row.value).toBe(4);
    expect(resources.mana).toBe(calculateManaCost(config));
  });

  it('keeps positive canonical 2 stable while unrelated resources change', () => {
    const config = spell({ actionPoints: 2, resourceTypes: ['mana'], resourceValues: { mana: 3 } });
    const resources = calculateTotalResources(config);
    expect(resources.actionPoints).toBe(2);
  });
});
