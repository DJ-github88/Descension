import React, { useState, useEffect } from 'react';
import {
  getContentReports,
  moderateContent,
  getFilteredWords,
  addFilteredWord,
  removeFilteredWord,
  getModerationStats,
  REPORT_REASONS,
  CONTENT_STATUS
} from '../../services/contentModerationService';
import useAuthStore from '../../store/authStore';
import './ContentModerationDashboard.css';

const ContentModerationDashboard = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [newWord, setNewWord] = useState('');
  const [moderationAction, setModerationAction] = useState('');
  const [moderationReason, setModerationReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, activeTab, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'reports') {
        const reportsResult = await getContentReports(filters);
        if (reportsResult.success) {
          setReports(reportsResult.reports);
        }
      } else if (activeTab === 'words') {
        const wordsResult = await getFilteredWords();
        setFilteredWords(wordsResult);
      }

      // Always load stats
      const statsResult = await getModerationStats();
      if (statsResult.success) {
        setStats(statsResult.stats);
      }
    } catch (error) {
      console.error('Failed to load moderation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (reportId, action) => {
    if (!moderationReason.trim() && action !== 'approve') {
      alert('Please provide a reason for this moderation action.');
      return;
    }

    try {
      const result = await moderateContent(reportId, action, user.uid, moderationReason);
      if (result.success) {
        setModerationAction('');
        setModerationReason('');
        loadData(); // Refresh data
        alert(`Content ${action} successfully.`);
      } else {
        alert('Failed to moderate content: ' + result.error);
      }
    } catch (error) {
      console.error('Moderation failed:', error);
      alert('Failed to moderate content.');
    }
  };

  const handleAddWord = async () => {
    if (!newWord.trim()) return;

    try {
      const result = await addFilteredWord(newWord.trim());
      if (result.success) {
        setNewWord('');
        loadData();
      } else {
        alert('Failed to add filtered word: ' + result.error);
      }
    } catch (error) {
      console.error('Failed to add word:', error);
      alert('Failed to add filtered word.');
    }
  };

  const handleRemoveWord = async (wordId) => {
    if (!confirm('Are you sure you want to remove this filtered word?')) return;

    try {
      const result = await removeFilteredWord(wordId);
      if (result.success) {
        loadData();
      } else {
        alert('Failed to remove filtered word: ' + result.error);
      }
    } catch (error) {
      console.error('Failed to remove word:', error);
      alert('Failed to remove filtered word.');
    }
  };

  const formatDate = (date) => {
    return new Date(date.seconds * 1000).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffa500';
      case 'approved': return '#48bb78';
      case 'rejected': return '#ff6b6b';
      case 'removed': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="moderation-dashboard-overlay">
      <div className="moderation-dashboard">
        <div className="moderation-header">
          <h2>Content Moderation Dashboard</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {stats && (
          <div className="moderation-stats">
            <div className="stat-item">
              <span className="stat-label">Total Reports:</span>
              <span className="stat-value">{stats.totalReports}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pending:</span>
              <span className="stat-value warning">{stats.pendingReports}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Resolved:</span>
              <span className="stat-value success">{stats.resolvedReports}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Actions Taken:</span>
              <span className="stat-value">{stats.moderationActions}</span>
            </div>
          </div>
        )}

        <div className="moderation-tabs">
          <button
            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Content Reports
          </button>
          <button
            className={`tab-btn ${activeTab === 'words' ? 'active' : ''}`}
            onClick={() => setActiveTab('words')}
          >
            Filtered Words
          </button>
        </div>

        <div className="moderation-content">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : activeTab === 'reports' ? (
            <div className="reports-section">
              <div className="filters">
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters({...filters, status: e.target.value || undefined})}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="removed">Removed</option>
                </select>

                <select
                  value={filters.contentType || ''}
                  onChange={(e) => setFilters({...filters, contentType: e.target.value || undefined})}
                >
                  <option value="">All Types</option>
                  <option value="spell">Spells</option>
                  <option value="creature">Creatures</option>
                  <option value="item">Items</option>
                  <option value="campaign">Campaigns</option>
                </select>
              </div>

              <div className="reports-list">
                {reports.length === 0 ? (
                  <div className="no-reports">No reports found</div>
                ) : (
                  reports.map(report => (
                    <div key={report.id} className="report-item">
                      <div className="report-header">
                        <div className="report-info">
                          <span className="content-type">{report.contentType}</span>
                          <span className="report-reason">{report.reason.replace(/_/g, ' ')}</span>
                          <span
                            className="report-status"
                            style={{ color: getStatusColor(report.status) }}
                          >
                            {report.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="report-date">
                          {formatDate(report.createdAt)}
                        </div>
                      </div>

                      <div className="report-description">
                        {report.description || 'No description provided'}
                      </div>

                      {report.status === 'pending' && (
                        <div className="moderation-actions">
                          <div className="action-inputs">
                            <select
                              value={moderationAction}
                              onChange={(e) => setModerationAction(e.target.value)}
                            >
                              <option value="">Select Action</option>
                              <option value="approve">Approve</option>
                              <option value="reject">Reject</option>
                              <option value="remove">Remove Content</option>
                            </select>

                            {moderationAction && moderationAction !== 'approve' && (
                              <input
                                type="text"
                                placeholder="Reason for action"
                                value={moderationReason}
                                onChange={(e) => setModerationReason(e.target.value)}
                              />
                            )}
                          </div>

                          {moderationAction && (
                            <button
                              className="moderate-btn"
                              onClick={() => handleModerate(report.id, moderationAction)}
                            >
                              {moderationAction}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="words-section">
              <div className="add-word">
                <input
                  type="text"
                  placeholder="Add filtered word"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddWord()}
                />
                <button onClick={handleAddWord}>Add Word</button>
              </div>

              <div className="words-list">
                {filteredWords.length === 0 ? (
                  <div className="no-words">No filtered words configured</div>
                ) : (
                  filteredWords.map(word => (
                    <div key={word.id} className="word-item">
                      <div className="word-info">
                        <span className="word-text">{word.word}</span>
                        <span className="word-severity">{word.severity}</span>
                      </div>
                      <button
                        className="remove-word-btn"
                        onClick={() => handleRemoveWord(word.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentModerationDashboard;
