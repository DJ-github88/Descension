import React from 'react';
import './AssetLoadingOverlay.css';

/**
 * High-aesthetic loading overlay for World Maps, Games, and major scene changes.
 * Features a glowing VTT rune ring, parchment accent, title/subtitle, and animated progress bar.
 */
export default function AssetLoadingOverlay({ 
  message = "Loading...", 
  subtext = "Preparing assets & synchronizing state...", 
  progress = null, 
  isFullPage = true,
  transparent = false
}) {
  return (
    <div className={`asset-loading-overlay ${isFullPage ? 'full-page' : 'inline'} ${transparent ? 'transparent-bg' : ''}`}>
      <div className="loading-card">
        {/* Glowing Rune Orb Spinner */}
        <div className="rune-spinner-container">
          <div className="rune-ring outer-ring"></div>
          <div className="rune-ring inner-ring"></div>
          <div className="rune-core">
            <i className="fas fa-compass-drafting rune-icon"></i>
          </div>
        </div>

        {/* Text Details */}
        <h3 className="loading-title">{message}</h3>
        {subtext && <p className="loading-subtext">{subtext}</p>}

        {/* Progress Bar (if numerical progress provided, or indeterminate glow bar) */}
        <div className="loading-progress-track">
          <div 
            className={`loading-progress-fill ${progress === null ? 'indeterminate' : ''}`}
            style={progress !== null ? { width: `${Math.min(100, Math.max(0, progress))}%` } : {}}
          >
            <div className="progress-glow-head"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
