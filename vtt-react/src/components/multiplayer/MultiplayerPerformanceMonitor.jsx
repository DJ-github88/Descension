/**
 * Multiplayer Performance Monitor Component
 * Displays real-time metrics for multiplayer performance
 */

import React from 'react';
import './MultiplayerPerformanceMonitor.css';

const MultiplayerPerformanceMonitor = ({ 
  networkMetrics = {}, 
  performanceMetrics = {}, 
  connectionQuality = 'good',
  isVisible = false 
}) => {
  if (!isVisible) return null;

  const {
    latency = 0,
    bandwidth = 0,
    packetLoss = 0
  } = networkMetrics;

  const {
    fps = 60,
    memoryUsage = 0,
    updateRate = 30
  } = performanceMetrics;

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'excellent': return '#506e30';
      case 'good': return '#4a6a2e';
      case 'fair': return '#9a5e15';
      case 'poor': return '#8b3a2a';
      default: return '#8b7d6b';
    }
  };

  const getLatencyColor = (latency) => {
    if (latency < 50) return '#506e30';
    if (latency < 100) return '#9a5e15';
    return '#8b3a2a';
  };

  return (
    <div className="multiplayer-performance-monitor">
      <div className="monitor-header">
        <h4>🚀 Multiplayer Performance</h4>
        <div 
          className="connection-status"
          style={{ color: getQualityColor(connectionQuality) }}
        >
          {connectionQuality.toUpperCase()}
        </div>
      </div>
      
      <div className="metrics-grid">
        <div className="metric-item">
          <span className="metric-label">Latency</span>
          <span 
            className="metric-value"
            style={{ color: getLatencyColor(latency) }}
          >
            {latency}ms
          </span>
        </div>
        
        <div className="metric-item">
          <span className="metric-label">FPS</span>
          <span className="metric-value">{fps}</span>
        </div>
        
        <div className="metric-item">
          <span className="metric-label">Update Rate</span>
          <span className="metric-value">{updateRate}/s</span>
        </div>
        
        <div className="metric-item">
          <span className="metric-label">Packet Loss</span>
          <span className="metric-value">{(packetLoss * 100).toFixed(1)}%</span>
        </div>
        
        <div className="metric-item">
          <span className="metric-label">Bandwidth</span>
          <span className="metric-value">{(bandwidth / 1024).toFixed(1)} KB/s</span>
        </div>
        
        <div className="metric-item">
          <span className="metric-label">Memory</span>
          <span className="metric-value">{(memoryUsage / 1024 / 1024).toFixed(1)} MB</span>
        </div>
      </div>
      
      <div className="optimization-status">
        <div className="status-indicator">
          <span className="status-dot" style={{ backgroundColor: getQualityColor(connectionQuality) }}></span>
          <span className="status-text">
            {connectionQuality === 'excellent' && 'All optimizations active'}
            {connectionQuality === 'good' && 'Standard optimizations'}
            {connectionQuality === 'fair' && 'Reduced quality mode'}
            {connectionQuality === 'poor' && 'Minimal features only'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerPerformanceMonitor;
