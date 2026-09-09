import { create } from 'zustand';

/**
 * SpellAoEStore - Live spell AoE template placement on the game grid.
 * Two-click placement: first click sets the caster origin (anchor),
 * second click confirms the template target point. Geometry generation
 * and wall clipping live in utils/AoETemplates.js; rendering lives in
 * components/grid/SpellAoEOverlay.jsx. The tool is launched from the
 * dice cog orb menu (DiceSelectionBar, game/room routes only).
 *
 * While the tool is armed, updateTool() patches shape/size/label/color
 * in place — the live preview re-targets seamlessly without cancelling
 * the in-progress placement.
 */

export const AOE_SHAPES = {
  CONE: 'cone',
  CIRCLE: 'circle',
  LINE: 'line',
  CUBE: 'cube'
};

// sizeFeet meaning per shape: cone length, circle radius, line length, cube side
export const AOE_SHAPE_CONFIG = {
  cone: { label: 'Cone', icon: '◢', presets: [15, 30, 60], defaultFeet: 30 },
  circle: { label: 'Sphere', icon: '◉', presets: [5, 10, 20], defaultFeet: 10 },
  line: { label: 'Line', icon: '⟼', presets: [30, 60, 100], defaultFeet: 60 },
  cube: { label: 'Cube', icon: '▣', presets: [15, 30, 50], defaultFeet: 30 }
};

export const AOE_DEFAULT_COLOR = '#8b5cf6';

/**
 * Builds the { stroke, fill } pair for a user-picked hex color.
 * fill uses ~25% alpha so map content stays readable underneath.
 */
export function buildAoEColor(hex) {
  const safe = /^#[0-9a-fA-F]{6}$/.test(hex || '') ? hex : AOE_DEFAULT_COLOR;
  const r = parseInt(safe.slice(1, 3), 16);
  const g = parseInt(safe.slice(3, 5), 16);
  const b = parseInt(safe.slice(5, 7), 16);
  return {
    stroke: safe,
    fill: `rgba(${r}, ${g}, ${b}, 0.25)`
  };
}

const initialState = {
  // Active placement tool config, null when idle
  // { shape, sizeFeet, label, color: { stroke, fill } }
  tool: null,
  // Caster origin in world px (set by first click)
  anchor: null,
  // Current cursor position in world px (live preview)
  cursor: null,
  // Last committed template (persists until cleared)
  // { rings, affected: [{id, name, kind}], shape, sizeFeet, label, color, origin, target, placedAt }
  placement: null
};

const resolveTool = (config, previousTool) => {
  const shapeConfig = AOE_SHAPE_CONFIG[config?.shape];
  if (!shapeConfig) return null;
  return {
    shape: config.shape,
    sizeFeet: config.sizeFeet || shapeConfig.defaultFeet,
    label: (config.label ?? previousTool?.label ?? '')?.trim?.() ?? '',
    color: buildAoEColor(config.colorHex || previousTool?.color?.stroke)
  };
};

const useSpellAoEStore = create((set, get) => ({
  ...initialState,

  startPlacement: (config) => {
    const tool = resolveTool(config, get().tool);
    if (!tool) return;
    set({
      tool,
      anchor: null,
      cursor: null,
      placement: null
    });
  },

  // Patch the armed tool in place — anchor/cursor/placement are preserved
  // so an in-progress placement seamlessly re-previews with the new config
  updateTool: (config) => {
    const tool = resolveTool(config, get().tool);
    if (!tool || !get().tool) return;
    set({ tool });
  },

  setCursor: (worldPos) => {
    if (!get().tool || !worldPos) return;
    set({ cursor: { x: worldPos.x, y: worldPos.y } });
  },

  setAnchor: (worldPos) => {
    if (!get().tool || !worldPos) return;
    set({ anchor: { x: worldPos.x, y: worldPos.y } });
  },

  // Allow re-picking the origin while mid-placement
  resetAnchor: () => {
    if (!get().tool) return;
    set({ anchor: null });
  },

  commitPlacement: (result) => {
    if (!get().tool || !result || !result.rings) return;
    set({
      placement: {
        rings: result.rings,
        affected: result.affected || [],
        shape: get().tool.shape,
        sizeFeet: get().tool.sizeFeet,
        label: get().tool.label,
        color: get().tool.color,
        origin: result.origin || get().anchor,
        target: result.target || get().cursor,
        placedAt: Date.now()
      },
      // Stay armed for the next placement (rapid multi-cast), reset click state
      anchor: null,
      cursor: null
    });
  },

  cancelPlacement: () => {
    set({ tool: null, anchor: null, cursor: null });
  },

  clearPlacement: () => {
    set({ placement: null });
  }
}));

export default useSpellAoEStore;
