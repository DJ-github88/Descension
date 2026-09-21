import React, { useState } from 'react';
import useGameStore from '../../store/gameStore';
import './CameraCompass.css';

const DIRECTION_LABELS = {
  0: 'N',
  45: 'NE',
  90: 'E',
  135: 'SE',
  180: 'S',
  225: 'SW',
  270: 'W',
  315: 'NW'
};

const TILT_PRESETS = [
  { label: 'Top', degrees: 90, title: 'Topdown (90°)' },
  { label: 'Iso', degrees: 30, title: 'Isometric (30°)' },
  { label: 'Low', degrees: 15, title: 'Low angle (15°)' }
];

const TILT_MIN = 15;
const TILT_MAX = 90;

/**
 * CameraCompass - local per-player camera orientation control.
 * Styled to match the parchment window/tool language of the VTT.
 * Collapses to a small Camera pill that sits above the Dialogue toggle.
 */
const CameraCompass = () => {
  const viewRotation = useGameStore(state => state.viewRotation);
  const viewMode = useGameStore(state => state.viewMode);
  const viewTilt = useGameStore(state => state.viewTilt);
  const rotateCameraBy = useGameStore(state => state.rotateCameraBy);
  const snapViewRotation = useGameStore(state => state.snapViewRotation);
  const resetViewRotation = useGameStore(state => state.resetViewRotation);
  const setViewRotation = useGameStore(state => state.setViewRotation);
  const setViewTilt = useGameStore(state => state.setViewTilt);
  const setViewMode = useGameStore(state => state.setViewMode);

  // While typing, the number field keeps the raw string so partial values
  // ("1", "18") don't get reformatted mid-keystroke.
  const [headingInput, setHeadingInput] = useState(null);

  // Starts expanded (preserves the always-visible control) but can fold down
  // to the camera toggle pill that sits above the Dialogue toggle.
  const [isCollapsed, setIsCollapsed] = useState(false);

  const normalized = ((Math.round(viewRotation) % 360) + 360) % 360;
  const snapped = normalizeSnap(normalized);
  const directionLabel = DIRECTION_LABELS[snapped] || '';
  const roundedTilt = Math.round(viewTilt);

  const handleRotate = (delta) => {
    rotateCameraBy(delta);
    snapViewRotation(45);
  };

  const handleModeChange = (mode) => {
    if (mode === viewMode) return;
    setViewMode(mode);
  };

  const handleHeadingSlider = (event) => {
    setHeadingInput(null);
    setViewRotation(parseFloat(event.target.value));
  };

  const handleHeadingTyped = (value) => {
    setHeadingInput(value);
    const parsed = parseFloat(value);
    if (Number.isFinite(parsed)) {
      setViewRotation(parsed);
    }
  };

  return (
    <div className="camera-compass-dock">
      {!isCollapsed && (
        <div className="camera-compass" id="camera-compass-panel" title="Camera orientation (your view only)">
          <div className="camera-compass__title-row">
            <span className="camera-compass__title">Camera</span>
            <button
              type="button"
              className="camera-compass__minimize"
              onClick={() => setIsCollapsed(true)}
              aria-label="Minimize camera controls"
              title="Minimize camera controls"
            >
              <i className="fas fa-chevron-down" />
            </button>
          </div>

          <div className="camera-compass__segmented" role="group" aria-label="Camera projection mode">
            <button
              type="button"
              className={`camera-compass__mode-btn ${viewMode === '2d' ? 'active' : ''}`}
              onClick={() => handleModeChange('2d')}
              title="2D Topdown view (flat)"
            >
              2D
            </button>
            <button
              type="button"
              className={`camera-compass__mode-btn ${viewMode === '2.5d' ? 'active' : ''}`}
              onClick={() => handleModeChange('2.5d')}
              title="2.5D Isometric view (elevated)"
            >
              2.5D
            </button>
          </div>

          <div className="camera-compass__rotate">
            <button
              type="button"
              className="camera-compass__btn"
              onClick={() => handleRotate(-45)}
              title="Rotate camera 45° left ([ with Shift)"
            >
              <i className="fas fa-rotate-left" />
            </button>

            <button
              type="button"
              className="camera-compass__dial"
              onClick={resetViewRotation}
              title="Click to reset to north (0°)"
            >
              <span className="camera-compass__heading">{directionLabel}</span>
              <span className="camera-compass__angle">{normalized}°</span>
            </button>

            <button
              type="button"
              className="camera-compass__btn"
              onClick={() => handleRotate(45)}
              title="Rotate camera 45° right (] with Shift)"
            >
              <i className="fas fa-rotate-right" />
            </button>
          </div>

          <div className="camera-compass__control">
            <div className="camera-compass__control-head">
              <span className="camera-compass__label">Heading</span>
              <div className="camera-compass__value-chip">
                <input
                  type="number"
                  min="0"
                  max="359"
                  step="1"
                  value={headingInput !== null ? headingInput : normalized}
                  onChange={(event) => handleHeadingTyped(event.target.value)}
                  onBlur={() => setHeadingInput(null)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') event.currentTarget.blur();
                  }}
                  className="camera-compass__number"
                  aria-label="Camera heading in degrees"
                  title="Type an exact heading"
                />
                <span className="camera-compass__unit">°</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="359"
              step="1"
              value={normalized}
              onChange={handleHeadingSlider}
              className="camera-compass__slider"
              aria-label="Camera heading"
              title="Drag for a precise heading (1° steps)"
            />
          </div>

          {viewMode === '2.5d' && (
            <>
              <div className="camera-compass__control">
                <div className="camera-compass__control-head">
                  <span className="camera-compass__label">Tilt</span>
                  <div className="camera-compass__value-chip">
                    <span className="camera-compass__value">{roundedTilt}</span>
                    <span className="camera-compass__unit">°</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={TILT_MIN}
                  max={TILT_MAX}
                  step="1"
                  value={roundedTilt}
                  onChange={(event) => setViewTilt(parseFloat(event.target.value))}
                  className="camera-compass__slider"
                  aria-label="Camera tilt"
                  title="Drag for a precise tilt (15°–90°)"
                />
              </div>
              <div className="camera-compass__segmented" role="group" aria-label="Tilt presets">
                {TILT_PRESETS.map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    className={`camera-compass__tilt-btn ${roundedTilt === preset.degrees ? 'active' : ''}`}
                    onClick={() => setViewTilt(preset.degrees)}
                    title={preset.title}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="camera-compass__hint">
            <span className="camera-compass__keys">[ ]</span>
            <span>rotate 5° · Shift snap</span>
          </div>
        </div>
      )}

      <button
        type="button"
        className={`camera-compass-toggle ${!isCollapsed ? 'active' : ''}`}
        onClick={() => setIsCollapsed(prev => !prev)}
        aria-expanded={!isCollapsed}
        aria-controls="camera-compass-panel"
        title={isCollapsed ? 'Show camera controls' : 'Minimize camera controls'}
      >
        <i className="fas fa-camera" />
        <span className="camera-compass-toggle__text">Camera</span>
      </button>
    </div>
  );
};

function normalizeSnap(deg) {
  const snapped = Math.round(deg / 45) * 45;
  return ((snapped % 360) + 360) % 360;
}

export default CameraCompass;
