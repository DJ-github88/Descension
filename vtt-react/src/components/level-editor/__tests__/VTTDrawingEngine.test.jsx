import React from 'react';
import { render, cleanup } from '@testing-library/react';
import VTTDrawingEngine from '../VTTDrawingEngine';
import useGameStore from '../../../store/gameStore';
import useLevelEditorStore from '../../../store/levelEditorStore';
import { createGridSystem } from '../../../utils/InfiniteGridSystem';

createGridSystem(useGameStore);

const createMockContext = () => {
  const ctx = {
    canvas: null,
    fillStyle: '#000000',
    strokeStyle: '#000000',
    lineWidth: 1,
    globalAlpha: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    font: '',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    imageSmoothingEnabled: true,
    globalCompositeOperation: 'source-over',
    shadowColor: '',
    shadowBlur: 0,
    fills: [],
    strokes: [],
    fillsWithAlpha: [],
    clearRect: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    quadraticCurveTo: jest.fn(),
    closePath: jest.fn(),
    fill: jest.fn(() => {
      ctx.fills.push(ctx.fillStyle);
      ctx.fillsWithAlpha.push({ fillStyle: ctx.fillStyle, alpha: ctx.globalAlpha });
    }),
    stroke: jest.fn(() => ctx.strokes.push(ctx.strokeStyle)),
    arc: jest.fn(),
    rect: jest.fn(),
    roundRect: jest.fn(),
    setLineDash: jest.fn(),
    measureText: jest.fn(() => ({ width: 10 })),
    fillText: jest.fn()
  };
  return ctx;
};

const setView = (overrides = {}) => {
  useGameStore.setState({
    gridSize: 50,
    gridType: 'square',
    cameraX: 0,
    cameraY: 0,
    zoomLevel: 1,
    playerZoom: 1,
    viewMode: '2d',
    viewRotation: 0,
    viewTilt: 90,
    isGMMode: true,
    ...overrides
  });
};

const setEditor = (overrides = {}) => {
  useLevelEditorStore.setState({
    drawingPaths: [],
    drawingLayers: [
      { id: 'drawings', name: 'Drawings', visible: true, locked: false }
    ],
    isCurrentlyDrawing: false,
    currentDrawingPath: [],
    currentDrawingTool: '',
    ...overrides
  });
};

describe('VTTDrawingEngine freehand rendering', () => {
  let ctx;
  const originalGetContext = HTMLCanvasElement.prototype.getContext;

  beforeEach(() => {
    ctx = createMockContext();
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ctx);
  });

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    cleanup();
  });

  it('fills freehand strokes with the stroke colour even when fillColor is transparent', () => {
    setView();
    setEditor({
      drawingPaths: [
        {
          id: 'freehand-1',
          tool: 'freehand',
          layer: 'drawings',
          style: {
            strokeColor: '#ff0000',
            fillColor: 'transparent',
            strokeWidth: 2,
            opacity: 1
          },
          points: [
            { worldX: 0, worldY: 0, isWorldCoords: true },
            { worldX: 50, worldY: 50, isWorldCoords: true },
            { worldX: 100, worldY: 0, isWorldCoords: true }
          ],
          timestamp: Date.now()
        }
      ]
    });

    render(<VTTDrawingEngine />);

    expect(ctx.fills).toContain('#ff0000');
    expect(ctx.fills).not.toContain('transparent');
  });

  it('renders paths saved with corrupt tiny opacity at full alpha', () => {
    setView();
    setEditor({
      drawingPaths: [
        {
          id: 'freehand-corrupt-opacity',
          tool: 'freehand',
          layer: 'drawings',
          style: {
            strokeColor: '#ff0000',
            fillColor: 'transparent',
            strokeWidth: 2,
            opacity: 0.0001
          },
          points: [
            { worldX: 0, worldY: 0, isWorldCoords: true },
            { worldX: 50, worldY: 50, isWorldCoords: true },
            { worldX: 100, worldY: 0, isWorldCoords: true }
          ],
          timestamp: Date.now()
        }
      ]
    });

    render(<VTTDrawingEngine />);

    const redFill = ctx.fillsWithAlpha.find(f => f.fillStyle === '#ff0000');
    expect(redFill).toBeTruthy();
    expect(redFill.alpha).toBe(1);
  });
});
