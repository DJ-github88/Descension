import { getStroke } from 'perfect-freehand';
import rough from 'roughjs';

/**
 * Default options for various drawing tool presets.
 */
export const TOOL_STROKE_PRESETS = {
  quill: {
    size: 3,
    thinning: 0.65,
    smoothing: 0.5,
    streamline: 0.55,
    easing: (t) => Math.sin((t * Math.PI) / 2),
    start: { taper: 8, cap: true },
    end: { taper: 12, cap: true }
  },
  nib: {
    size: 5,
    thinning: 0.75,
    smoothing: 0.45,
    streamline: 0.4,
    start: { taper: 4, cap: false },
    end: { taper: 6, cap: false }
  },
  brush: {
    size: 9,
    thinning: 0.4,
    smoothing: 0.6,
    streamline: 0.6,
    start: { taper: 10, cap: true },
    end: { taper: 14, cap: true }
  },
  highlighter: {
    size: 20,
    thinning: 0.05,
    smoothing: 0.5,
    streamline: 0.6,
    start: { taper: 0, cap: true },
    end: { taper: 0, cap: true }
  },
  eraser: {
    size: 16,
    thinning: 0,
    smoothing: 0.4,
    streamline: 0.5,
    start: { taper: 0, cap: true },
    end: { taper: 0, cap: true }
  },
  default: {
    size: 3,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
    start: { taper: 5, cap: true },
    end: { taper: 8, cap: true }
  }
};

/**
 * Normalizes input point representations to [x, y, pressure] tuples.
 * Supports {x, y, pressure}, {x, y}, or [x, y, pressure].
 *
 * @param {Array<Object|Array>} points
 * @param {number} [widthMultiplier=1]
 * @param {number} [heightMultiplier=1]
 * @returns {Array<[number, number, number]>}
 */
export function normalizePoints(points, widthMultiplier = 1, heightMultiplier = 1) {
  if (!Array.isArray(points)) return [];

  return points.map(pt => {
    if (Array.isArray(pt)) {
      const x = pt[0] * widthMultiplier;
      const y = pt[1] * heightMultiplier;
      const pressure = typeof pt[2] === 'number' ? pt[2] : 0.5;
      return [x, y, pressure];
    }

    if (pt && typeof pt === 'object') {
      const x = (typeof pt.worldX === 'number' ? pt.worldX : (typeof pt.x === 'number' ? pt.x : 0)) * widthMultiplier;
      const y = (typeof pt.worldY === 'number' ? pt.worldY : (typeof pt.y === 'number' ? pt.y : 0)) * heightMultiplier;
      const pressure = typeof pt.pressure === 'number' ? pt.pressure : 0.5;
      return [x, y, pressure];
    }

    return [0, 0, 0.5];
  });
}

/**
 * Draws an organic, smooth Catmull-Rom polygon stroke on a 2D canvas context
 * using perfect-freehand.
 *
 * @param {CanvasRenderingContext2D} ctx - Target 2D canvas context
 * @param {Array<Object|Array>} rawPoints - Stroke points
 * @param {Object} [options={}] - Custom stroke options and tool type
 * @param {number} [width=1] - Coordinate scale width
 * @param {number} [height=1] - Coordinate scale height
 */
export function renderSmoothStroke(ctx, rawPoints, options = {}, width = 1, height = 1) {
  if (!ctx || !Array.isArray(rawPoints) || rawPoints.length === 0) return;

  const points = normalizePoints(rawPoints, width, height);
  if (points.length === 0) return;

  const tool = options.tool || 'default';
  const preset = TOOL_STROKE_PRESETS[tool] || TOOL_STROKE_PRESETS.default;

  const strokeOptions = {
    ...preset,
    size: options.size || preset.size,
    ...options
  };

  // Single point fallback: draw a smooth circular dab
  if (points.length === 1) {
    const [x, y, pressure] = points[0];
    const radius = Math.max(1, (strokeOptions.size / 2) * (pressure || 0.5));
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  // Generate smooth polygon outline
  const outline = getStroke(points, strokeOptions);
  if (!outline || outline.length === 0) return;

  ctx.beginPath();
  const [firstX, firstY] = outline[0];
  ctx.moveTo(firstX, firstY);

  if (outline.length < 4) {
    for (let i = 1; i < outline.length; i++) {
      ctx.lineTo(outline[i][0], outline[i][1]);
    }
  } else {
    for (let i = 0; i < outline.length; i++) {
      const p0 = outline[i];
      const p1 = outline[(i + 1) % outline.length];
      const midX = (p0[0] + p1[0]) / 2;
      const midY = (p0[1] + p1[1]) / 2;
      ctx.quadraticCurveTo(p0[0], p0[1], midX, midY);
    }
  }

  ctx.closePath();
  ctx.fill();
}

/**
 * Converts a perfect-freehand outline polygon into an SVG path definition (d attribute).
 *
 * @param {Array<[number, number]>} outline
 * @returns {string} SVG path string
 */
export function getSvgPathFromStroke(outline) {
  if (!outline || outline.length === 0) return '';

  const max = outline.length - 1;
  return outline.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...outline[0], 'Q']
  ).concat(['Z']).join(' ');
}

/**
 * Renders a hand-drawn / sketched geometric shape on canvas using Rough.js.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {'line'|'rectangle'|'circle'|'polygon'} shapeType
 * @param {Object} params - Shape-specific geometry
 * @param {Object} [options={}] - Rough styling options
 */
export function renderRoughShape(canvas, shapeType, params = {}, options = {}) {
  if (!canvas) return null;

  try {
    const rc = typeof rough.canvas === 'function'
      ? rough.canvas(canvas)
      : (rough.default && typeof rough.default.canvas === 'function' ? rough.default.canvas(canvas) : null);

    if (!rc) return null;

    const roughOptions = {
      roughness: options.roughness !== undefined ? options.roughness : 1.2,
      bowing: options.bowing !== undefined ? options.bowing : 1.0,
      stroke: options.stroke || '#1f140e',
      strokeWidth: options.strokeWidth || 2,
      fill: options.fill && options.fill !== 'transparent' ? options.fill : undefined,
      fillStyle: options.fillStyle || 'hachure',
      ...options
    };

    switch (shapeType) {
      case 'line': {
        const { x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = params;
        return rc.line(x1, y1, x2, y2, roughOptions);
      }
      case 'rectangle': {
        const { x = 0, y = 0, width = 0, height = 0 } = params;
        return rc.rectangle(x, y, width, height, roughOptions);
      }
      case 'circle': {
        const { x = 0, y = 0, diameter = 0 } = params;
        return rc.circle(x, y, diameter, roughOptions);
      }
      case 'polygon': {
        const { vertices = [] } = params;
        if (vertices.length < 3) return null;
        return rc.polygon(vertices, roughOptions);
      }
      default:
        return null;
    }
  } catch (err) {
    console.warn('Rough.js shape rendering fallback:', err);
    return null;
  }
}

export default {
  renderSmoothStroke,
  renderRoughShape,
  getSvgPathFromStroke,
  normalizePoints,
  TOOL_STROKE_PRESETS
};
