import React from 'react';

const ConnectionStatusIndicator = ({ status, isJoiningRoom, playerCount, currentMapName, onMapIconClick }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return {
          icon: 'fas fa-wifi',
          color: '#4caf50',
          text: `Connected (${playerCount} players)`
        };
      case 'connecting':
        return {
          icon: 'fas fa-spinner fa-spin',
          color: '#ff9800',
          text: 'Connecting...'
        };
      case 'error':
        return {
          icon: 'fas fa-exclamation-triangle',
          color: '#f44336',
          text: 'Connection Error'
        };
      default:
        return {
          icon: 'fas fa-wifi-slash',
          color: '#9e9e9e',
          text: 'Disconnected'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="connection-status-indicator">
      <div className="status-main">
        <i className={statusInfo.icon} style={{ color: statusInfo.color }}></i>
        <span style={{ color: statusInfo.color }}>{statusInfo.text}</span>
      </div>
      {status === 'connected' && currentMapName && (
        <div className="status-map" onClick={onMapIconClick} title="Switch/View Maps">
          <i className="fas fa-map-marked-alt"></i>
          <span className="current-map-name">{currentMapName}</span>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatusIndicator;
