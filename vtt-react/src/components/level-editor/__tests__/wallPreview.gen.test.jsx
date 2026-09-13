/* Temporary visual harness (WALL_PREVIEW=1 only). */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import fs from 'fs';
import SvgWallLayer from '../SvgWallLayer';
import useGameStore from '../../../store/gameStore';
import useLevelEditorStore from '../../../store/levelEditorStore';
import { createGridSystem } from '../../../utils/InfiniteGridSystem';

createGridSystem(useGameStore);

const OUT = 'D:/AppData/Temp/opencode';

const baseView = {
  gridSize: 50,
  gridType: 'square',
  cameraX: 0,
  cameraY: 0,
  zoomLevel: 1,
  playerZoom: 1,
  viewMode: '2.5d',
  viewRotation: 45,
  viewTilt: 30,
  isGMMode: true
};

const baseEditor = {
  elevationData: {},
  showWallLayer: true,
  selectedWallKey: null,
  visibleArea: null,
  viewingFromToken: null,
  fogOfWarEnabled: false
};

const runY = (x, y0, y1, type) => {
  const walls = {};
  for (let y = y0; y < y1; y++) walls[`${x},${y},${x},${y + 1}`] = { type };
  return walls;
};

const runX = (y, x0, x1, type) => {
  const walls = {};
  for (let x = x0; x < x1; x++) walls[`${x},${y},${x + 1},${y}`] = { type };
  return walls;
};

const scenes = [
  {
    name: 'room-plain',
    view: { viewRotation: 45, zoomLevel: 1.1, cameraX: 0, cameraY: 25 },
    walls: {
      ...runX(0, -4, 4, 'stone_wall'),
      ...runX(4, -4, 4, 'stone_wall'),
      ...runY(-4, 0, 4, 'stone_wall'),
      ...runY(4, 0, 4, 'stone_wall')
    }
  },
  {
    name: 'room-elev',
    view: { viewRotation: 45, zoomLevel: 1.1, cameraX: 0, cameraY: 25 },
    walls: {
      ...runX(0, -4, 4, 'stone_wall'),
      ...runX(4, -4, 4, 'stone_wall'),
      ...runY(-4, 0, 4, 'stone_wall'),
      ...runY(4, 0, 4, 'stone_wall')
    },
    editor: { elevationData: { '-2,2': 1, '-1,2': 1, '-2,3': 1, '-1,3': 1 } }
  },
  {
    name: 'cliff-wall',
    view: { viewRotation: 45, zoomLevel: 1.4, cameraX: 0, cameraY: 0 },
    walls: {
      ...runY(0, -3, 3, 'stone_wall')
    },
    editor: {
      elevationData: {
        '0,-3': 1, '0,-2': 1, '0,-1': 1, '0,0': 1, '0,1': 1, '0,2': 1,
        '-1,-3': 1, '-1,-2': 1, '-1,-1': 1, '-1,0': 1, '-1,1': 1, '-1,2': 1
      }
    }
  }
];

const enabled = !!process.env.WALL_PREVIEW;
(enabled ? describe : describe.skip)('wall preview generator', () => {
  for (const scene of scenes) {
    it(`writes ${scene.name}`, () => {
      window.innerWidth = 1280;
      window.innerHeight = 800;
      useGameStore.setState({ ...baseView, ...scene.view });
      useLevelEditorStore.setState({ ...baseEditor, ...(scene.editor || {}), wallData: scene.walls });

      const { container } = render(<SvgWallLayer />);
      const markup = container.innerHTML;
      cleanup();
      const html = `<!doctype html>
<html><head><meta charset="utf-8" />
<style>html, body { margin: 0; background: #d8c9a8; overflow: hidden; } .label { position: fixed; left: 10px; top: 8px; z-index: 99; font: 600 13px system-ui; color: #1d1a14; background: rgba(255,255,255,0.72); padding: 4px 8px; border-radius: 4px; }</style>
</head><body><div class="label">${scene.name}</div>${markup}</body></html>`;
      fs.writeFileSync(`${OUT}/${scene.name}.html`, html);
    });
  }
});
