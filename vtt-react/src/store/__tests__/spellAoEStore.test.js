import useSpellAoEStore, { AOE_SHAPES, AOE_SHAPE_CONFIG, AOE_DEFAULT_COLOR, buildAoEColor } from '../spellAoEStore';

describe('spellAoEStore placement state machine', () => {
  beforeEach(() => {
    const store = useSpellAoEStore.getState();
    store.cancelPlacement();
    store.clearPlacement();
  });

  test('startPlacement arms the tool and resets placement state', () => {
    const { startPlacement } = useSpellAoEStore.getState();

    startPlacement({ shape: AOE_SHAPES.CONE, sizeFeet: 30, label: 'Burning Hands', colorHex: '#ef4444' });

    const state = useSpellAoEStore.getState();
    expect(state.tool).toEqual({
      shape: 'cone',
      sizeFeet: 30,
      label: 'Burning Hands',
      color: buildAoEColor('#ef4444')
    });
    expect(state.anchor).toBeNull();
    expect(state.cursor).toBeNull();
    expect(state.placement).toBeNull();
  });

  test('startPlacement rejects unknown shapes and applies defaults', () => {
    const { startPlacement } = useSpellAoEStore.getState();

    startPlacement({ shape: 'pentagram' });
    expect(useSpellAoEStore.getState().tool).toBeNull();

    startPlacement({ shape: AOE_SHAPES.CUBE });
    const tool = useSpellAoEStore.getState().tool;
    expect(tool.sizeFeet).toBe(AOE_SHAPE_CONFIG.cube.defaultFeet);
    expect(tool.label).toBe('');
    expect(tool.color.stroke).toBe(AOE_DEFAULT_COLOR);
  });

  test('updateTool live-patches the armed tool without losing anchor or placement', () => {
    const { startPlacement, setAnchor, updateTool } = useSpellAoEStore.getState();

    startPlacement({ shape: AOE_SHAPES.CIRCLE, sizeFeet: 10, label: 'Fireball' });
    setAnchor({ x: 200, y: 200 });

    // Mid-placement shape switch: sphere -> line, anchor survives
    updateTool({ shape: 'line', sizeFeet: 60, label: 'Fireball', colorHex: '#38bdf8' });

    const state = useSpellAoEStore.getState();
    expect(state.tool.shape).toBe('line');
    expect(state.tool.sizeFeet).toBe(60);
    expect(state.tool.color.stroke).toBe('#38bdf8');
    expect(state.anchor).toEqual({ x: 200, y: 200 });

    // updateTool is a no-op while idle
    updateTool({ shape: 'cube' });
    useSpellAoEStore.getState().cancelPlacement();
    updateTool({ shape: 'cube' });
    expect(useSpellAoEStore.getState().tool).toBeNull();
  });

  test('anchor/cursor tracking only works while the tool is armed', () => {
    const { setCursor, setAnchor, startPlacement } = useSpellAoEStore.getState();

    setCursor({ x: 100, y: 100 });
    setAnchor({ x: 50, y: 50 });
    expect(useSpellAoEStore.getState().cursor).toBeNull();
    expect(useSpellAoEStore.getState().anchor).toBeNull();

    startPlacement({ shape: AOE_SHAPES.LINE });
    setCursor({ x: 100, y: 100 });
    setAnchor({ x: 50, y: 50 });
    const state = useSpellAoEStore.getState();
    expect(state.cursor).toEqual({ x: 100, y: 100 });
    expect(state.anchor).toEqual({ x: 50, y: 50 });
  });

  test('commitPlacement stores the template and stays armed for the next cast', () => {
    const { startPlacement, setAnchor, commitPlacement } = useSpellAoEStore.getState();

    startPlacement({ shape: AOE_SHAPES.CIRCLE, sizeFeet: 10, label: 'Fireball', colorHex: '#ef4444' });
    setAnchor({ x: 200, y: 200 });

    const rings = [[{ x: 150, y: 150 }, { x: 250, y: 150 }, { x: 200, y: 250 }]];
    const affected = [{ id: 'tok-1', name: 'Goblin', kind: 'creature', position: { x: 200, y: 200 } }];
    commitPlacement({ rings, affected, target: { x: 200, y: 210 } });

    const state = useSpellAoEStore.getState();
    expect(state.placement).toMatchObject({
      rings,
      affected,
      shape: 'circle',
      sizeFeet: 10,
      label: 'Fireball',
      origin: { x: 200, y: 200 },
      target: { x: 200, y: 210 }
    });
    // Tool stays armed, click state resets for rapid re-placement
    expect(state.tool).not.toBeNull();
    expect(state.anchor).toBeNull();
    expect(state.cursor).toBeNull();
  });

  test('commitPlacement is ignored without an armed tool', () => {
    const { commitPlacement } = useSpellAoEStore.getState();
    commitPlacement({ rings: [[{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }]] });
    expect(useSpellAoEStore.getState().placement).toBeNull();
  });

  test('resetAnchor re-picks the origin; cancelPlacement disarms the tool', () => {
    const { startPlacement, setAnchor, resetAnchor, cancelPlacement } = useSpellAoEStore.getState();

    startPlacement({ shape: AOE_SHAPES.CONE });
    setAnchor({ x: 10, y: 10 });
    expect(useSpellAoEStore.getState().anchor).toEqual({ x: 10, y: 10 });

    resetAnchor();
    expect(useSpellAoEStore.getState().anchor).toBeNull();

    cancelPlacement();
    expect(useSpellAoEStore.getState().tool).toBeNull();
  });

  test('clearPlacement removes a committed template', () => {
    const { startPlacement, setAnchor, commitPlacement, clearPlacement } = useSpellAoEStore.getState();

    startPlacement({ shape: AOE_SHAPES.CUBE });
    setAnchor({ x: 0, y: 0 });
    commitPlacement({ rings: [[{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }]], affected: [] });

    expect(useSpellAoEStore.getState().placement).not.toBeNull();
    clearPlacement();
    expect(useSpellAoEStore.getState().placement).toBeNull();
  });

  describe('buildAoEColor', () => {
    test('derives a 25% alpha fill from a picked hex', () => {
      expect(buildAoEColor('#ef4444')).toEqual({
        stroke: '#ef4444',
        fill: 'rgba(239, 68, 68, 0.25)'
      });
    });

    test('falls back to the default color for invalid input', () => {
      expect(buildAoEColor('nope').stroke).toBe(AOE_DEFAULT_COLOR);
      expect(buildAoEColor(null).stroke).toBe(AOE_DEFAULT_COLOR);
    });
  });
});
