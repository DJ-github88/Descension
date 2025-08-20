/**
 * Multiplayer Performance Monitor Component
 * 
 * This component provides real-time monitoring of multiplayer performance:
 * - Network quality indicators
 * - Latency and prediction metrics
 * - Bandwidth usage and optimization stats
 * - Real-time sync performance
 */

import React, { useState, useEffect } from 'react';
import './MultiplayerPerformanceMonitor.css';

const MultiplayerPerformanceMonitor = ({
  networkMetrics,
  performanceMetrics,
  connectionQuality,
  isVisible = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [historicalData, setHistoricalData] = useState({
    latency: [],
    bandwidth: [],
    predictions: []
  });

  // Only update historical data when visible to save performance
  useEffect(() => {
    if (isVisible && networkMetrics) {
      setHistoricalData(prev => ({
        latency: [...prev.latency, networkMetrics.latency].slice(-20),
        bandwidth: [...prev.bandwidth, networkMetrics.bandwidth || 0].slice(-20),
        predictions: [...prev.predictions, performanceMetrics?.predictionsCorrect || 95].slice(-20)
      }));
    }
  }, [networkMetrics, performanceMetrics, isVisible]);

  if (!isVisible) return null;

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'fair': return '#FF9800';
      case 'poor': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getLatencyStatus = (latency) => {
    if (latency < 20) return 'excellent';
    if (latency < 50) return 'good';
    if (latency < 100) return 'fair';
    return 'poor';
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderMiniGraph = (data, color = '#4CAF50') => {
    if (data.length < 2) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="mini-graph" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  };

  return (
    <div className={`performance-monitor ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="monitor-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="connection-indicator">
          <div 
            className="quality-dot" 
            style={{ backgroundColor: getQualityColor(connectionQuality) }}
          />
          <span className="quality-text">{connectionQuality.toUpperCase()}</span>
        </div>
        <div className="latency-display">
          {Math.round(networkMetrics?.latency || 0)}ms
        </div>
        <div className="expand-icon">
          {isExpanded ? '▼' : '▶'}
        </div>
      </div>

      {isExpanded && (
        <div className="monitor-content">
          {/* Network Metrics */}
          <div className="metrics-section">
            <h4>Network Performance</h4>
            <div className="metrics-grid">
              <div className="metric-item">
                <label>Latency</label>
                <div className="metric-value">
                  <span className={`value ${getLatencyStatus(networkMetrics?.latency || 0)}`}>
                    {Math.round(networkMetrics?.latency || 0)}ms
                  </span>
                  {renderMiniGraph(historicalData.latency, getQualityColor(getLatencyStatus(networkMetrics?.latency || 0)))}
                </div>
              </div>

              <div className="metric-item">
                <label>Jitter</label>
                <div className="metric-value">
                  <span className="value">
                    {Math.round(networkMetrics?.jitter || 0)}ms
                  </span>
                </div>
              </div>

              <div className="metric-item">
                <label>Packet Loss</label>
                <div className="metric-value">
                  <span className="value">
                    {((networkMetrics?.packetLoss || 0) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="metric-item">
                <label>Bandwidth</label>
                <div className="metric-value">
                  <span className="value">
                    {formatBytes(networkMetrics?.bandwidth || 0)}/s
                  </span>
                  {renderMiniGraph(historicalData.bandwidth, '#2196F3')}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="metrics-section">
            <h4>Multiplayer Performance</h4>
            <div className="metrics-grid">
              <div className="metric-item">
                <label>Update Rate</label>
                <div className="metric-value">
                  <span className="value">
                    {performanceMetrics?.updateRate || 60} FPS
                  </span>
                </div>
              </div>

              <div className="metric-item">
                <label>Prediction Accuracy</label>
                <div className="metric-value">
                  <span className="value">
                    {(performanceMetrics?.predictionsCorrect || 95).toFixed(1)}%
                  </span>
                  {renderMiniGraph(historicalData.predictions, '#4CAF50')}
                </div>
              </div>

              <div className="metric-item">
                <label>State Corrections</label>
                <div className="metric-value">
                  <span className="value">
                    {performanceMetrics?.stateCorrections || 0}
                  </span>
                </div>
              </div>

              <div className="metric-item">
                <label>Pending Actions</label>
                <div className="metric-value">
                  <span className="value">
                    {performanceMetrics?.pendingActions || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Optimization Status */}
          <div className="metrics-section">
            <h4>Optimizations Active</h4>
            <div className="optimization-list">
              <div className="optimization-item active">
                <span className="status-dot active" />
                Delta Synchronization
              </div>
              <div className="optimization-item active">
                <span className="status-dot active" />
                Event Batching
              </div>
              <div className="optimization-item active">
                <span className="status-dot active" />
                Client Prediction
              </div>
              <div className="optimization-item active">
                <span className="status-dot active" />
                Lag Compensation
              </div>
              <div className="optimization-item active">
                <span className="status-dot active" />
                Adaptive Quality
              </div>
            </div>
          </div>

          {/* Performance Tips */}
          {connectionQuality === 'poor' && (
            <div className="metrics-section">
              <h4>Performance Tips</h4>
              <div className="tips-list">
                <div className="tip-item">
                  • Close other applications using internet
                </div>
                <div className="tip-item">
                  • Move closer to your WiFi router
                </div>
                <div className="tip-item">
                  • Consider using ethernet connection
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiplayerPerformanceMonitor;
