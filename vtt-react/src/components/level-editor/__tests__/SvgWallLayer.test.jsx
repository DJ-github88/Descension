import React from 'react';
import { render, cleanup } from '@testing-library/react';
import SvgWallLayer from '../SvgWallLayer';
import useGameStore from '../../../store/gameStore';
import useLevelEditorStore from '../../../store/levelEditorStore';
import { createGridSystem } from '../../../utils/InfiniteGridSystem';

createGridSystem(useGameStore);

const setView = (overrides = {}) => {
  useGameStore.setState({
    gridSize: 50,
    gridType: 'square',
    cameraX: 0,
    cameraY: 0,
    zoomLevel: 1,
    playerZoom: 1,
    viewMode: '2.5d',
    viewRotation: 0,
    viewTilt: 30,
    isGMMode: true,
    ...overrides
  });
};

const setEditor = (overrides = {}) => {
  useLevelEditorStore.setState({
    wallData: {},
    elevationData: {},
    showWallLayer: true,
    selectedWallKey: null,
    visibleArea: null,
    viewingFromToken: null,
    fogOfWarEnabled: false,
    ...overrides
  });
};

describe('SvgWallLayer', () => {
  afterEach(() => {
    cleanup();
  });

  it('merges connected same-material walls into a single seamless run', () => {
    setView();
    setEditor({
      wallData: {
        '0,0,1,0': { type: 'stone_wall' },
        '1,0,1,1': { type: 'stone_wall' }
      }
    });

    const { container } = render(<SvgWallLayer />);
    const svg = container.querySelector('svg.svg-wall-layer');
    expect(svg).toBeTruthy();
    expect(svg.querySelectorAll('polygon').length).toBeGreaterThan(4);
    expect(svg.querySelectorAll('g').length).toBe(1);
  });

  it('renders a real window assembly with glass panes', () => {
    setView();
    setEditor({
      wallData: {
        '0,0,1,0': { type: 'glass_window' }
      }
    });

    const { container } = render(<SvgWallLayer />);
    const svg = container.querySelector('svg.svg-wall-layer');
    expect(svg).toBeTruthy();
    expect(svg.querySelectorAll('[fill="url(#svgWindowGlass)"]').length).toBeGreaterThan(0);
  });

  it('renders an open door swing leaf instead of a closed slab', () => {
    setView();
    setEditor({
      wallData: {
        '0,0,1,0': { type: 'wooden_door', state: 'open' }
      }
    });

    const { container } = render(<SvgWallLayer />);
    const svg = container.querySelector('svg.svg-wall-layer');
    expect(svg).toBeTruthy();
    expect(svg.querySelectorAll('polyline').length).toBeGreaterThan(0);
  });

  it('renders nothing in flat topdown 2D', () => {
    setView({ viewMode: '2d' });
    setEditor({
      wallData: { '0,0,1,0': { type: 'stone_wall' } }
    });

    const { container } = render(<SvgWallLayer />);
    expect(container.querySelector('svg.svg-wall-layer')).toBeNull();
  });

  it('casts wall shadows only when fog of war is disabled', () => {
    setView();
    setEditor({
      wallData: { '0,0,2,0': { type: 'stone_wall' } },
      fogOfWarEnabled: false
    });
    const withoutFog = render(<SvgWallLayer />);
    expect(withoutFog.container.querySelectorAll('path[fill="rgba(0,0,0,0.16)"]').length).toBe(1);
    cleanup();

    setEditor({
      wallData: { '0,0,2,0': { type: 'stone_wall' } },
      fogOfWarEnabled: true,
      viewingFromToken: null,
      isGMMode: true
    });
    const withFog = render(<SvgWallLayer />);
    expect(withFog.container.querySelectorAll('path[fill="rgba(0,0,0,0.16)"]').length).toBe(0);
  });
});
