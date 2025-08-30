import React, { useState } from 'react';
import { versionInfo } from '../../utils/versionInfo';
import './VersionDisplay.css';

const VersionDisplay = ({ position = 'bottom-right', showDetails = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const deploymentInfo = versionInfo.getDeploymentInfo();
  
  const getEnvironmentColor = () => {
    switch (deploymentInfo.environment) {
      case 'development': return '#4CAF50';
      case 'netlify-production': return '#00C7B7';
      case 'railway-production': return '#7C3AED';
      case 'production': return '#FF5722';
      default: return '#9E9E9E';
    }
  };

  const getEnvironmentIcon = () => {
    switch (deploymentInfo.environment) {
      case 'development': return '🔧';
      case 'netlify-production': return '🌐';
      case 'railway-production': return '🚂';
      case 'production': return '🚀';
      default: return '❓';
    }
  };

  if (!showDetails && versionInfo.isProduction()) {
    return null; // Hide in production unless explicitly shown
  }

  return (
    <div 
      className={`version-display ${position} ${isExpanded ? 'expanded' : ''}`}
      onClick={() => setIsExpanded(!isExpanded)}
      style={{ '--env-color': getEnvironmentColor() }}
    >
      {/* Compact View */}
      <div className="version-compact">
        <span className="env-icon">{getEnvironmentIcon()}</span>
        <span className="version-text">
          {versionInfo.getVersionString()}
        </span>
        {isExpanded && <span className="expand-icon">▼</span>}
        {!isExpanded && <span className="expand-icon">▶</span>}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="version-details">
          <div className="detail-row">
            <span className="label">Environment:</span>
            <span className="value">{deploymentInfo.environment}</span>
          </div>
          <div className="detail-row">
            <span className="label">Version:</span>
            <span className="value">{deploymentInfo.version}</span>
          </div>
          <div className="detail-row">
            <span className="label">Commit:</span>
            <span className="value mono">{deploymentInfo.shortCommit}</span>
          </div>
          <div className="detail-row">
            <span className="label">Branch:</span>
            <span className="value">{deploymentInfo.branch}</span>
          </div>
          <div className="detail-row">
            <span className="label">Build:</span>
            <span className="value">{deploymentInfo.buildTime}</span>
          </div>
          <div className="detail-row">
            <span className="label">Mode:</span>
            <span className="value">{deploymentInfo.buildMode}</span>
          </div>
          
          {/* Action Buttons */}
          <div className="version-actions">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                console.log('Full Version Info:', versionInfo.getDeploymentInfo());
              }}
              className="action-btn"
            >
              📋 Log Info
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                window.location.reload();
              }}
              className="action-btn"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionDisplay;
