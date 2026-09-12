import useGameStore from '../gameStore';

describe('gameStore view mode + camera orbit', () => {
  beforeEach(() => {
    useGameStore.setState({
      viewMode: '2d',
      viewRotation: 0,
      viewTilt: 90
    });
  });

  it('defaults to 2D topdown with north-up rotation', () => {
    useGameStore.setState({ viewMode: '2d', viewRotation: 0, viewTilt: 90 });
    const state = useGameStore.getState();
    expect(state.viewMode).toBe('2d');
    expect(state.viewRotation).toBe(0);
    expect(state.viewTilt).toBe(90);
  });

  it('switching to 2.5D restores an isometric tilt', () => {
    useGameStore.getState().setViewMode('2.5d');
    const state = useGameStore.getState();
    expect(state.viewMode).toBe('2.5d');
    expect(state.viewTilt).toBe(30);
  });

  it('switching back to 2D forces topdown tilt', () => {
    useGameStore.getState().setViewMode('2.5d');
    useGameStore.getState().setViewTilt(45);
    expect(useGameStore.getState().viewTilt).toBe(45);

    useGameStore.getState().setViewMode('2d');
    expect(useGameStore.getState().viewTilt).toBe(90);
  });

  it('ignores invalid view modes', () => {
    useGameStore.getState().setViewMode('3d');
    expect(useGameStore.getState().viewMode).toBe('2d');
  });

  it('normalizes absolute rotation into [0, 360)', () => {
    useGameStore.getState().setViewRotation(450);
    expect(useGameStore.getState().viewRotation).toBe(90);

    useGameStore.getState().setViewRotation(-90);
    expect(useGameStore.getState().viewRotation).toBe(270);
  });

  it('supports relative rotation and snapping', () => {
    useGameStore.getState().rotateCameraBy(30);
    expect(useGameStore.getState().viewRotation).toBe(30);

    useGameStore.getState().snapViewRotation(45);
    expect(useGameStore.getState().viewRotation).toBe(45);

    useGameStore.getState().rotateCameraBy(300);
    expect(useGameStore.getState().viewRotation).toBe(345);
    useGameStore.getState().snapViewRotation(90);
    expect(useGameStore.getState().viewRotation).toBe(0);
  });

  it('clamps 2.5D tilt to the 15-90 degree range', () => {
    useGameStore.getState().setViewMode('2.5d');
    useGameStore.getState().setViewTilt(5);
    expect(useGameStore.getState().viewTilt).toBe(15);

    useGameStore.getState().setViewTilt(120);
    expect(useGameStore.getState().viewTilt).toBe(90);
  });

  it('locks tilt to 90 while in 2D mode', () => {
    useGameStore.getState().setViewTilt(30);
    expect(useGameStore.getState().viewTilt).toBe(90);
  });

  it('resetViewRotation returns to north', () => {
    useGameStore.getState().setViewRotation(180);
    useGameStore.getState().resetViewRotation();
    expect(useGameStore.getState().viewRotation).toBe(0);
  });
});
