import React from 'react';
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

/**
 * CameraCompass - local per-player camera orientation control.
 * Styled to match the parchment window/tool language of the VTT.
 */
const CameraCompass = () => {
  const viewRotation = useGameStore(state => state.viewRotation);
  const viewMode = useGameStore(state => state.viewMode);
  const viewTilt = useGameStore(state => state.viewTilt);
  const rotateCameraBy = useGameStore(state => state.rotateCameraBy);
  const snapViewRotation = useGameStore(state => state.snapViewRotation);
  const resetViewRotation = useGameStore(state => state.resetViewRotation);
  const setViewTilt = useGameStore(state => state.setViewTilt);

  const normalized = ((Math.round(viewRotation) % 360) + 360) % 360;
  const snapped = normalizeSnap(normalized);
  const directionLabel = DIRECTION_LABELS[snapped] || '';

  const handleRotate = (delta) => {
    rotateCameraBy(delta);
    snapViewRotation(45);
  };

  return (
    <div className="camera-compass" title="Camera orientation (your view only)">
      <div className="camera-compass__title">Camera</div>

      <div className="camera-compass__row">
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

      {viewMode === '2.5d' && (
        <div className="camera-compass__tilts">
          {TILT_PRESETS.map(preset => (
            <button
              key={preset.label}
              type="button"
              className={`camera-compass__tilt-btn ${Math.round(viewTilt) === preset.degrees ? 'active' : ''}`}
              onClick={() => setViewTilt(preset.degrees)}
              title={preset.title}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      <div className="camera-compass__hint">[ ] rotate · Shift snap</div>
    </div>
  );
};

function normalizeSnap(deg) {
  const snapped = Math.round(deg / 45) * 45;
  return ((snapped % 360) + 360) % 360;
}

export default CameraCompass;
