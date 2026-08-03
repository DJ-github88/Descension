import React from 'react';
import './VersionUpdateModal.css';

export default function VersionUpdateModal({ isOpen, latestInfo, countdown, onUpdate }) {
  if (!isOpen) return null;

  const versionText = latestInfo?.version ? `v${latestInfo.version}` : 'New Version';

  return (
    <div className="version-update-overlay" role="dialog" aria-modal="true">
      <div className="version-update-card">
        <div className="version-update-icon-wrapper">
          <i className="fas fa-sync-alt version-update-icon"></i>
        </div>

        <h2 className="version-update-title">App Update Available</h2>

        {latestInfo?.version && (
          <div className="version-update-badge">{versionText}</div>
        )}

        <p className="version-update-subtitle">
          A new version of Mythrill VTT has been deployed. Please update now to ensure full compatibility and features.
        </p>

        <div className="version-update-countdown">
          Auto-updating site in <strong>{countdown}s</strong>...
        </div>

        <div className="version-update-actions">
          <button className="version-update-btn" onClick={onUpdate}>
            <i className="fas fa-arrow-rotate-right"></i> Update Now
          </button>
        </div>
      </div>
    </div>
  );
}
