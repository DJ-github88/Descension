/**
 * Character Persistence Test Runner Component
 * 
 * A React component that provides a UI for running character persistence tests
 * and displaying results in a user-friendly format.
 */

import React, { useState } from 'react';
import CharacterPersistenceTest from '../../tests/characterPersistenceTest';
import './CharacterPersistenceTestRunner.css';

const CharacterPersistenceTestRunner = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState([]);

  /**
   * Run the test suite
   */
  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setSummary(null);
    setLogs([]);

    // Capture console logs
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    const capturedLogs = [];
    
    const captureLog = (level, ...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      capturedLogs.push({
        level,
        message,
        timestamp: new Date().toISOString()
      });
      
      setLogs([...capturedLogs]);
    };

    console.log = (...args) => {
      originalLog(...args);
      captureLog('log', ...args);
    };
    
    console.error = (...args) => {
      originalError(...args);
      captureLog('error', ...args);
    };
    
    console.warn = (...args) => {
      originalWarn(...args);
      captureLog('warn', ...args);
    };

    try {
      const testSuite = new CharacterPersistenceTest();
      
      // Override recordTest to capture results
      const originalRecordTest = testSuite.recordTest.bind(testSuite);
      testSuite.recordTest = (testName, passed, message) => {
        originalRecordTest(testName, passed, message);
        
        const result = {
          name: testName,
          passed,
          message,
          timestamp: new Date().toISOString()
        };
        
        setTestResults(prev => [...prev, result]);
      };

      await testSuite.runAllTests();
      
      // Calculate summary
      const totalTests = testSuite.testResults.length;
      const passedTests = testSuite.testResults.filter(test => test.passed).length;
      const failedTests = totalTests - passedTests;
      
      setSummary({
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        successRate: totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0
      });

    } catch (error) {
      console.error('Test suite failed:', error);
    } finally {
      // Restore original console methods
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      
      setIsRunning(false);
    }
  };

  /**
   * Clear test results
   */
  const clearResults = () => {
    setTestResults([]);
    setSummary(null);
    setLogs([]);
  };

  /**
   * Get status icon for test result
   */
  const getStatusIcon = (passed) => {
    return passed ? '✅' : '❌';
  };

  /**
   * Get log level class
   */
  const getLogLevelClass = (level) => {
    switch (level) {
      case 'error': return 'log-error';
      case 'warn': return 'log-warn';
      default: return 'log-info';
    }
  };

  return (
    <div className="test-runner">
      <div className="test-runner-header">
        <h2>Character Persistence System Tests</h2>
        <p>Comprehensive testing of character persistence, synchronization, and data integrity.</p>
      </div>

      <div className="test-controls">
        <button 
          onClick={runTests} 
          disabled={isRunning}
          className="btn btn-primary"
        >
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </button>
        
        <button 
          onClick={clearResults} 
          disabled={isRunning}
          className="btn btn-secondary"
        >
          Clear Results
        </button>
      </div>

      {isRunning && (
        <div className="test-progress">
          <div className="spinner"></div>
          <span>Running character persistence tests...</span>
        </div>
      )}

      {summary && (
        <div className="test-summary">
          <h3>Test Summary</h3>
          <div className="summary-stats">
            <div className="stat">
              <span className="stat-label">Total Tests:</span>
              <span className="stat-value">{summary.total}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Passed:</span>
              <span className="stat-value passed">{summary.passed}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Failed:</span>
              <span className="stat-value failed">{summary.failed}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Success Rate:</span>
              <span className="stat-value">{summary.successRate}%</span>
            </div>
          </div>
          
          <div className={`overall-status ${summary.failed === 0 ? 'success' : 'failure'}`}>
            {summary.failed === 0 ? '🎉 All Tests Passed!' : '⚠️ Some Tests Failed'}
          </div>
        </div>
      )}

      {testResults.length > 0 && (
        <div className="test-results">
          <h3>Test Results</h3>
          <div className="results-list">
            {testResults.map((result, index) => (
              <div key={index} className={`test-result ${result.passed ? 'passed' : 'failed'}`}>
                <div className="result-header">
                  <span className="result-icon">{getStatusIcon(result.passed)}</span>
                  <span className="result-name">{result.name}</span>
                  <span className="result-time">{new Date(result.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="result-message">{result.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {logs.length > 0 && (
        <div className="test-logs">
          <h3>Test Logs</h3>
          <div className="logs-container">
            {logs.map((log, index) => (
              <div key={index} className={`log-entry ${getLogLevelClass(log.level)}`}>
                <span className="log-time">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className="log-level">[{log.level.toUpperCase()}]</span>
                <span className="log-message">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="test-info">
        <h3>Test Coverage</h3>
        <ul>
          <li>Character creation and basic persistence</li>
          <li>Character data updates and synchronization</li>
          <li>Inventory changes and session tracking</li>
          <li>Multiplayer session persistence</li>
          <li>Offline/online synchronization</li>
          <li>Data migration from localStorage</li>
          <li>Backup and restore functionality</li>
          <li>Conflict resolution mechanisms</li>
        </ul>
      </div>
    </div>
  );
};

export default CharacterPersistenceTestRunner;
