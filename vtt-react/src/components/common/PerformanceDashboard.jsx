import React, { useState, useEffect } from 'react';
import { getPerformanceStats, exportPerformanceData, recordMetric } from '../../services/performanceService';
import './PerformanceDashboard.css';

const PerformanceDashboard = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen, timeRange]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const performanceStats = getPerformanceStats(timeRange);
      setStats(performanceStats);
    } catch (error) {
      console.error('Failed to load performance stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const data = exportPerformanceData(timeRange);
      if (data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `performance-data-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        recordMetric('performance_export', { timeRange, dataSize: blob.size });
      }
    } catch (error) {
      console.error('Failed to export performance data:', error);
    }
  };

  const formatDuration = (ms) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="performance-dashboard-overlay">
      <div className="performance-dashboard">
        <div className="performance-header">
          <h2>Performance Dashboard</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="performance-controls">
          <div className="time-range-selector">
            <label>Time Range:</label>
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          <button className="export-btn" onClick={handleExport}>
            Export Data
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading performance data...</div>
        ) : stats ? (
          <div className="performance-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Metrics</h3>
                <div className="stat-value">{stats.totalMetrics.toLocaleString()}</div>
              </div>

              <div className="stat-card">
                <h3>Total Errors</h3>
                <div className="stat-value error">{stats.totalErrors.toLocaleString()}</div>
              </div>

              {stats.averagePageLoadTime && (
                <div className="stat-card">
                  <h3>Avg Page Load</h3>
                  <div className="stat-value">{formatDuration(stats.averagePageLoadTime)}</div>
                </div>
              )}

              {stats.apiCallStats.total > 0 && (
                <div className="stat-card">
                  <h3>API Calls</h3>
                  <div className="stat-value">
                    {stats.apiCallStats.total} ({Math.round((stats.apiCallStats.success / stats.apiCallStats.total) * 100)}% success)
                  </div>
                  <div className="stat-subtext">
                    Avg: {formatDuration(stats.apiCallStats.averageDuration)}
                  </div>
                </div>
              )}

              {stats.averageMemoryUsage && (
                <div className="stat-card">
                  <h3>Memory Usage</h3>
                  <div className="stat-value">
                    {formatBytes(stats.averageMemoryUsage.used)}
                  </div>
                  <div className="stat-subtext">
                    of {formatBytes(stats.averageMemoryUsage.total)}
                  </div>
                </div>
              )}
            </div>

            <div className="metrics-breakdown">
              <div className="breakdown-section">
                <h3>Metrics by Type</h3>
                <div className="metrics-list">
                  {Object.entries(stats.metricsByType).map(([type, count]) => (
                    <div key={type} className="metric-item">
                      <span className="metric-type">{type.replace(/_/g, ' ')}</span>
                      <span className="metric-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="breakdown-section">
                <h3>Errors by Type</h3>
                <div className="metrics-list">
                  {Object.entries(stats.errorsByType).map(([type, count]) => (
                    <div key={type} className="metric-item error">
                      <span className="metric-type">{type.replace(/_/g, ' ')}</span>
                      <span className="metric-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="performance-info">
              <h3>Performance Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Data Collection:</strong> Automatic
                </div>
                <div className="info-item">
                  <strong>Storage:</strong> Local browser storage
                </div>
                <div className="info-item">
                  <strong>Retention:</strong> 7 days
                </div>
                <div className="info-item">
                  <strong>Privacy:</strong> Data stays on device
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-data">No performance data available</div>
        )}
      </div>
    </div>
  );
};

export default PerformanceDashboard;
