import React, { useState } from 'react';
import useSpellAoEStore, { AOE_SHAPES, AOE_SHAPE_CONFIG, AOE_DEFAULT_COLOR } from '../../store/spellAoEStore';
import './SpellAoE.css';

/**
 * SpellAoEPanel - Spell AoE template launcher.
 * Rendered inside the dice cog orb menu (DiceSelectionBar) on game/room
 * routes. Offers the 5e template shapes, size presets, an optional spell
 * label, and a free-form color picker.
 *
 * While a placement is armed on the grid, every control here live-updates
 * the in-progress template (switch sphere → line mid-aim and the preview
 * re-targets instantly) — no cancel/re-place needed.
 */
const SpellAoEPanel = () => {
  const tool = useSpellAoEStore((state) => state.tool);
  const placement = useSpellAoEStore((state) => state.placement);
  const startPlacement = useSpellAoEStore((state) => state.startPlacement);
  const updateTool = useSpellAoEStore((state) => state.updateTool);
  const cancelPlacement = useSpellAoEStore((state) => state.cancelPlacement);
  const clearPlacement = useSpellAoEStore((state) => state.clearPlacement);

  const [shape, setShape] = useState(AOE_SHAPES.CONE);
  const [sizeFeet, setSizeFeet] = useState(AOE_SHAPE_CONFIG.cone.defaultFeet);
  const [label, setLabel] = useState('');
  const [colorHex, setColorHex] = useState(AOE_DEFAULT_COLOR);

  const armed = !!tool;

  // Current effective values: the armed tool drives the UI while placing
  const activeShape = armed ? tool.shape : shape;
  const activeSize = armed ? tool.sizeFeet : sizeFeet;
  const activeLabel = armed ? tool.label : label;
  const activeColor = armed ? tool.color.stroke : colorHex;

  const shapeConfig = AOE_SHAPE_CONFIG[activeShape];

  const applyChange = (patch) => {
    if (armed) {
      // Live-update the in-progress placement
      updateTool({
        shape: patch.shape ?? activeShape,
        sizeFeet: patch.sizeFeet ?? activeSize,
        label: patch.label ?? activeLabel,
        colorHex: patch.colorHex ?? activeColor
      });
    }
    // Keep local draft state in sync for when the tool is (re)armed
    if (patch.shape !== undefined) {
      setShape(patch.shape);
      const nextConfig = AOE_SHAPE_CONFIG[patch.shape];
      if (!nextConfig.presets.includes(patch.sizeFeet ?? activeSize)) {
        const nextSize = nextConfig.defaultFeet;
        setSizeFeet(nextSize);
        if (armed) {
          updateTool({
            shape: patch.shape,
            sizeFeet: nextSize,
            label: patch.label ?? activeLabel,
            colorHex: patch.colorHex ?? activeColor
          });
        }
      }
    }
    if (patch.sizeFeet !== undefined) setSizeFeet(patch.sizeFeet);
    if (patch.label !== undefined) setLabel(patch.label);
    if (patch.colorHex !== undefined) setColorHex(patch.colorHex);
  };

  const handlePlace = () => {
    startPlacement({ shape, sizeFeet, label, colorHex });
  };

  const sizeUnit = activeShape === 'circle' ? 'ft radius' : 'ft';

  return (
    <div className="spell-aoe-panel-content">
      <div className="spell-aoe-shape-grid">
        {Object.entries(AOE_SHAPE_CONFIG).map(([key, config]) => (
          <button
            key={key}
            type="button"
            className={`spell-aoe-shape-btn ${activeShape === key ? 'active' : ''}`}
            onClick={() => applyChange({ shape: key })}
            title={`${config.label} (${activeSize} ${sizeUnit})`}
          >
            <span className="spell-aoe-shape-icon">{config.icon}</span>
            <span className="spell-aoe-shape-name">{config.label}</span>
          </button>
        ))}
      </div>

      <div className="spell-aoe-size-row">
        <label>Size:</label>
        {shapeConfig.presets.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`spell-aoe-size-btn ${activeSize === preset ? 'active' : ''}`}
            onClick={() => applyChange({ sizeFeet: preset })}
          >
            {preset}
          </button>
        ))}
        <input
          type="number"
          min="5"
          max="200"
          step="5"
          className="spell-aoe-size-input"
          value={activeSize}
          onChange={(e) =>
            applyChange({ sizeFeet: Math.max(5, Math.min(200, parseInt(e.target.value, 10) || 5)) })
          }
          title={`Custom size (${sizeUnit})`}
        />
        <span className="spell-aoe-size-unit">{sizeUnit}</span>
      </div>

      <input
        type="text"
        className="spell-aoe-label-input"
        placeholder="Spell name (optional)"
        value={activeLabel}
        maxLength={40}
        onChange={(e) => applyChange({ label: e.target.value })}
      />

      <div className="spell-aoe-color-row">
        <label className="spell-aoe-color-label">Color:</label>
        <label className="spell-aoe-color-picker" title="Pick template color">
          <span className="spell-aoe-color-swatch-large" style={{ background: activeColor }} />
          <input
            type="color"
            value={activeColor}
            onChange={(e) => applyChange({ colorHex: e.target.value })}
          />
        </label>
      </div>

      <div className="spell-aoe-actions">
        {armed ? (
          <button type="button" className="spell-aoe-cancel-btn" onClick={cancelPlacement}>
            Cancel Placement
          </button>
        ) : (
          <button type="button" className="spell-aoe-place-btn" onClick={handlePlace}>
            Place on Grid
          </button>
        )}
        {placement && !armed && (
          <button type="button" className="spell-aoe-clear-btn" onClick={clearPlacement}>
            Clear Template
          </button>
        )}
      </div>

      <div className="spell-aoe-hint">
        {armed
          ? 'On the map: click caster origin → click to place. Controls here update the live template; Esc cancels.'
          : 'Click "Place on Grid", then click the caster origin and aim on the map.'}
      </div>
    </div>
  );
};

export default SpellAoEPanel;
