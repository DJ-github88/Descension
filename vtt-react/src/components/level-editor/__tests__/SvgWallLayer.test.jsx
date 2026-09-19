import React from 'react';
import { act, render, cleanup } from '@testing-library/react';
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
    // Every primitive group of a merged run carries all of its wall keys, so a
    // single union run means one shared data-wall-key across the whole scene.
    const keys = new Set(
      [...svg.querySelectorAll('g[data-wall-key]')].map((group) => group.getAttribute('data-wall-key'))
    );
    expect(keys).toEqual(new Set(['0,0,1,0+1,0,1,1']));
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

  it('compensates camera pan imperatively while a camera drag is active', () => {
    setView();
    setEditor({
      wallData: { '0,0,1,0': { type: 'stone_wall' } }
    });

    const { container } = render(<SvgWallLayer />);
    const svg = container.querySelector('svg.svg-wall-layer');
    expect(svg).toBeTruthy();
    expect(svg.style.overflow).toBe('visible');
    expect(svg.style.transform).toBe('');

    act(() => {
      useGameStore.setState({ isDraggingCamera: true });
      useGameStore.getState().moveCameraBy(-100, 0);
    });
    expect(svg.style.transform).toContain('translate(100px, 0px)');

    act(() => {
      useGameStore.setState({ isDraggingCamera: false });
    });
    expect(svg.style.transform).toBe('');
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

  it('merges cast shadows into a single pass under every run', () => {
    setView();
    setEditor({
      wallData: {
        '0,0,2,0': { type: 'stone_wall' },
        '0,2,2,2': { type: 'stone_wall' }
      },
      fogOfWarEnabled: false
    });

    const { container } = render(<SvgWallLayer />);
    const shadows = container.querySelectorAll('path[fill="rgba(0,0,0,0.16)"]');
    expect(shadows.length).toBe(1);
    const svg = container.querySelector('svg.svg-wall-layer');
    const directPaths = svg.querySelectorAll(':scope > path');
    expect(directPaths.length).toBe(1);
    expect(directPaths[0].getAttribute('filter')).toBe('url(#svgWallShadowBlur)');
  });

  it('keeps every wall pattern and side polygon non-degenerate for a closed room', () => {
    setView({ viewRotation: 45 });
    setEditor({
      wallData: {
        '0,0,4,0': { type: 'stone_wall' },
        '0,4,4,4': { type: 'stone_wall' },
        '0,0,0,4': { type: 'stone_wall' },
        '4,0,4,4': { type: 'stone_wall' }
      }
    });

    const { container } = render(<SvgWallLayer />);
    const svg = container.querySelector('svg.svg-wall-layer');
    expect(svg).toBeTruthy();

    const patterns = [...svg.querySelectorAll('pattern')];
    expect(patterns.length).toBeGreaterThan(0);
    for (const pattern of patterns) {
      const match = /matrix\(([^)]+)\)/.exec(pattern.getAttribute('patternTransform'));
      expect(match).toBeTruthy();
      const [a, b, c, d] = match[1].split(/\s+/).map(Number);
      expect(Math.hypot(a, b)).toBeGreaterThan(1e-6);
      expect(Math.hypot(c, d)).toBeGreaterThan(1e-6);
    }

    for (const polygon of svg.querySelectorAll('polygon')) {
      const points = polygon.getAttribute('points').split(' ');
      const unique = new Set(points);
      expect(unique.size).toBeGreaterThanOrEqual(3);
    }
  });

  it('updates projected wall geometry when gridOffsetX changes', () => {
    setView({ gridOffsetX: 0, gridOffsetY: 0 });
    setEditor({
      wallData: { '0,0,1,0': { type: 'stone_wall' } }
    });

    const { container } = render(<SvgWallLayer />);
    const polyBefore = container.querySelector('polygon');
    expect(polyBefore).toBeTruthy();
    const pointsBefore = polyBefore.getAttribute('points');

    act(() => {
      useGameStore.setState({ gridOffsetX: 100 });
    });

    const polyAfter = container.querySelector('polygon');
    expect(polyAfter).toBeTruthy();
    const pointsAfter = polyAfter.getAttribute('points');
    expect(pointsAfter).not.toBe(pointsBefore);
  });
});
