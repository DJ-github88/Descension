import {
  normalizePoints,
  renderSmoothStroke,
  getSvgPathFromStroke,
  renderRoughShape,
  TOOL_STROKE_PRESETS
} from '../strokeRenderer';

describe('strokeRenderer', () => {
  describe('normalizePoints', () => {
    test('normalizes array and object points into [x, y, pressure] tuples', () => {
      const input = [
        { x: 10, y: 20, pressure: 0.8 },
        [30, 40, 0.4],
        { worldX: 50, worldY: 60 }
      ];

      const normalized = normalizePoints(input);
      expect(normalized).toEqual([
        [10, 20, 0.8],
        [30, 40, 0.4],
        [50, 60, 0.5]
      ]);
    });

    test('applies width and height multipliers', () => {
      const input = [{ x: 0.5, y: 0.25, pressure: 0.7 }];
      const normalized = normalizePoints(input, 1000, 800);

      expect(normalized).toEqual([
        [500, 200, 0.7]
      ]);
    });

    test('returns empty array for invalid inputs', () => {
      expect(normalizePoints(null)).toEqual([]);
      expect(normalizePoints(undefined)).toEqual([]);
      expect(normalizePoints([])).toEqual([]);
    });
  });

  describe('renderSmoothStroke', () => {
    let mockCtx;

    beforeEach(() => {
      mockCtx = {
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        quadraticCurveTo: jest.fn(),
        closePath: jest.fn(),
        arc: jest.fn(),
        fill: jest.fn(),
        stroke: jest.fn()
      };
    });

    test('renders single point as a circular dab', () => {
      renderSmoothStroke(mockCtx, [{ x: 100, y: 100, pressure: 0.6 }], { size: 10 });

      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.arc).toHaveBeenCalledWith(100, 100, expect.any(Number), 0, Math.PI * 2);
      expect(mockCtx.fill).toHaveBeenCalled();
    });

    test('renders multi-point stroke using perfect-freehand outline polygon', () => {
      const points = [
        { x: 10, y: 10, pressure: 0.5 },
        { x: 20, y: 15, pressure: 0.6 },
        { x: 40, y: 30, pressure: 0.7 },
        { x: 60, y: 50, pressure: 0.5 }
      ];

      renderSmoothStroke(mockCtx, points, { tool: 'quill', size: 4 });

      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.moveTo).toHaveBeenCalled();
      expect(mockCtx.quadraticCurveTo).toHaveBeenCalled();
      expect(mockCtx.closePath).toHaveBeenCalled();
      expect(mockCtx.fill).toHaveBeenCalled();
    });

    test('handles empty points array gracefully without errors', () => {
      expect(() => renderSmoothStroke(mockCtx, [])).not.toThrow();
      expect(mockCtx.fill).not.toHaveBeenCalled();
    });
  });

  describe('getSvgPathFromStroke', () => {
    test('converts outline points to SVG quadratic curve path', () => {
      const outline = [
        [0, 0],
        [10, 0],
        [10, 10],
        [0, 10]
      ];

      const svgPath = getSvgPathFromStroke(outline);
      expect(svgPath).toContain('M');
      expect(svgPath).toContain('Q');
      expect(svgPath).toContain('Z');
    });

    test('returns empty string for empty input', () => {
      expect(getSvgPathFromStroke([])).toBe('');
      expect(getSvgPathFromStroke(null)).toBe('');
    });
  });

  describe('renderRoughShape', () => {
    let mockCanvas;
    let mockCtx;

    beforeEach(() => {
      mockCtx = {
        save: jest.fn(),
        restore: jest.fn(),
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        bezierCurveTo: jest.fn(),
        quadraticCurveTo: jest.fn(),
        stroke: jest.fn(),
        fill: jest.fn(),
        transform: jest.fn()
      };
      mockCanvas = {
        getContext: jest.fn().mockReturnValue(mockCtx)
      };
    });

    test('renders rough line', () => {
      const res = renderRoughShape(mockCanvas, 'line', { x1: 0, y1: 0, x2: 100, y2: 100 });
      expect(res).toBeDefined();
    });

    test('renders rough rectangle', () => {
      const res = renderRoughShape(mockCanvas, 'rectangle', { x: 10, y: 10, width: 200, height: 100 });
      expect(res).toBeDefined();
    });

    test('renders rough circle', () => {
      const res = renderRoughShape(mockCanvas, 'circle', { x: 50, y: 50, diameter: 80 });
      expect(res).toBeDefined();
    });

    test('returns null gracefully for invalid inputs', () => {
      expect(renderRoughShape(null, 'line')).toBeNull();
    });
  });
});
