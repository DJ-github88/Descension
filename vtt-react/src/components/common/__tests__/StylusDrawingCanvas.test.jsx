import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StylusDrawingCanvas from '../StylusDrawingCanvas';

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    clearRect: jest.fn(),
    drawImage: jest.fn(),
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    closePath: jest.fn(),
    quadraticCurveTo: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    getImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) }))
  }));

  // Mock getBoundingClientRect
  HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
    width: 800,
    height: 600,
    top: 0,
    left: 0,
    bottom: 600,
    right: 800
  }));
});

describe('StylusDrawingCanvas', () => {
  const sampleStrokes = [
    {
      id: 'stroke-1',
      tool: 'quill',
      color: '#1f140e',
      size: 3,
      points: [
        { x: 0.1, y: 0.1, pressure: 0.5 },
        { x: 0.2, y: 0.2, pressure: 0.5 }
      ]
    },
    {
      id: 'stroke-2',
      tool: 'brush',
      color: '#991b1b',
      size: 5,
      points: [
        { x: 0.3, y: 0.3, pressure: 0.6 },
        { x: 0.4, y: 0.4, pressure: 0.6 }
      ]
    }
  ];

  test('renders cleanly with default empty strokes without error', () => {
    const { container } = render(<StylusDrawingCanvas />);
    expect(container.querySelector('.stylus-canvas-container')).toBeTruthy();
    expect(screen.getByRole('button', { name: /clear all strokes/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /redo/i })).toBeDisabled();
  });

  test('renders cleanly with multiple initialStrokes and does not crash on render or undo', () => {
    const handleChange = jest.fn();
    render(
      <StylusDrawingCanvas
        initialStrokes={sampleStrokes}
        onChange={handleChange}
      />
    );

    const clearBtn = screen.getByRole('button', { name: /clear all strokes/i });
    expect(clearBtn).not.toBeDisabled();

    // On mount with initialStrokes, historyIndex is 0 so Undo is disabled (no prior history step)
    const undoBtn = screen.getByRole('button', { name: /undo/i });
    expect(undoBtn).toBeDisabled();

    // Clicking undo when disabled or even firing it directly should never crash
    fireEvent.click(undoBtn);
    expect(clearBtn).not.toBeDisabled();
  });

  test('clearing strokes updates history and allows undoing back to initial strokes', () => {
    const handleChange = jest.fn();
    render(
      <StylusDrawingCanvas
        initialStrokes={sampleStrokes}
        onChange={handleChange}
      />
    );

    const clearBtn = screen.getByRole('button', { name: /clear all strokes/i });
    const undoBtn = screen.getByRole('button', { name: /undo/i });

    expect(clearBtn).not.toBeDisabled();
    expect(undoBtn).toBeDisabled();

    // Clear all strokes
    fireEvent.click(clearBtn);

    // After clearing, clear button should be disabled, undo should be enabled
    expect(clearBtn).toBeDisabled();
    expect(undoBtn).not.toBeDisabled();
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ strokes: [] })
    );

    // Undo the clear
    fireEvent.click(undoBtn);
    expect(clearBtn).not.toBeDisabled();
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ strokes: sampleStrokes })
    );
  });

  test('ref methods setStrokes and getStrokes handle undefined gracefully', () => {
    const ref = React.createRef();
    render(<StylusDrawingCanvas ref={ref} initialStrokes={sampleStrokes} />);

    expect(ref.current.getStrokes()).toEqual(sampleStrokes);

    // Passing undefined to setStrokes should fallback to empty array without crashing
    const { act } = require('@testing-library/react');
    act(() => {
      ref.current.setStrokes(undefined);
    });
    expect(ref.current.getStrokes()).toEqual([]);
    expect(screen.getByRole('button', { name: /clear all strokes/i })).toBeDisabled();
  });
});
