import React, { useState, useEffect } from 'react';
import { useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../../context/SpellLibraryContext';
import { formatSpellLibrary, generateLibraryReport, validateSpellFormat } from '../../../../utils/spellLibraryFormatter';

/**
 * Spell Library Formatter Component
 * 
 * Provides tools to format and validate spells in the library
 * for compatibility with UnifiedSpellCard component.
 */
const SpellLibraryFormatter = ({ onClose }) => {
  const library = useSpellLibrary();
  const dispatch = useSpellLibraryDispatch();
  
  const [report, setReport] = useState(null);
  const [isFormatting, setIsFormatting] = useState(false);
  const [formatResults, setFormatResults] = useState([]);

  // Generate report when component mounts
  useEffect(() => {
    if (library && library.spells) {
      const libraryReport = generateLibraryReport(library.spells);
      setReport(libraryReport);
    }
  }, [library]);

  const handleFormatLibrary = async () => {
    if (!library || !library.spells) return;
    
    setIsFormatting(true);
    try {
      const formattedSpells = formatSpellLibrary(library.spells);
      const results = [];

      // Update each spell in the library
      formattedSpells.forEach((formattedSpell, index) => {
        const originalSpell = library.spells[index];
        
        // Check if formatting made changes
        const originalJson = JSON.stringify(originalSpell);
        const formattedJson = JSON.stringify(formattedSpell);
        
        if (originalJson !== formattedJson) {
          dispatch(libraryActionCreators.updateSpell(formattedSpell.id, formattedSpell));
          results.push({
            spellName: formattedSpell.name,
            spellId: formattedSpell.id,
            changes: 'Formatted for UnifiedSpellCard compatibility'
          });
        }
      });

      setFormatResults(results);
      
      // Re-generate report after formatting
      setTimeout(() => {
        const newReport = generateLibraryReport(formattedSpells);
        setReport(newReport);
      }, 1000);
    } finally {
      setIsFormatting(false);
    }
  };

  if (!report) {
    return (
      <div className="formatter-overlay">
        <div className="formatter-modal">
          <div className="formatter-header">
            <h3>Analyzing Library...</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="formatter-content">
            <div className="loading-spinner"></div>
            <p>Checking spell formatting...</p>
          </div>
        </div>
      </div>
    );
  }

  const { totalSpells, validSpells, invalidSpells, issues } = report;
  const formatScore = Math.round((validSpells / totalSpells) * 100);

  return (
    <div className="formatter-overlay">
      <div className="formatter-modal">
        <div className="formatter-header">
          <h3>Spell Library Formatter</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="formatter-content">
          <div className="format-summary">
            <div className="format-score">
              <div className="score-circle">
                <span className="score-number">{formatScore}%</span>
                <span className="score-label">Formatted</span>
              </div>
            </div>

            <div className="format-stats">
              <div className="stat-item valid">
                <span className="stat-label">Valid Spells</span>
                <span className="stat-value">{validSpells}</span>
              </div>
              <div className="stat-item invalid">
                <span className="stat-label">Need Formatting</span>
                <span className="stat-value">{invalidSpells}</span>
              </div>
              <div className="stat-item total">
                <span className="stat-label">Total Spells</span>
                <span className="stat-value">{totalSpells}</span>
              </div>
            </div>
          </div>

          {invalidSpells > 0 && (
            <div className="format-actions">
              <button 
                className="format-button"
                onClick={handleFormatLibrary}
                disabled={isFormatting}
                title="Format all spells for UnifiedSpellCard compatibility"
              >
                {isFormatting ? 'Formatting...' : `Format ${invalidSpells} Spells`}
              </button>
              <div className="format-info">
                <small>This will ensure all spells are properly formatted for the UnifiedSpellCard component with required fields, valid configurations, and consistent structure.</small>
              </div>
            </div>
          )}

          {formatResults.length > 0 && (
            <div className="format-results">
              <h4>Formatted Spells:</h4>
              {formatResults.slice(0, 5).map((result, index) => (
                <div key={index} className="format-result">
                  <strong>{result.spellName}</strong>: {result.changes}
                </div>
              ))}
              {formatResults.length > 5 && (
                <div className="more-results">...and {formatResults.length - 5} more</div>
              )}
            </div>
          )}

          {invalidSpells > 0 && (
            <div className="format-issues">
              <h4>Formatting Issues:</h4>
              {issues.slice(0, 5).map((issue, index) => (
                <div key={index} className="format-issue">
                  <strong>{issue.spellName}</strong>
                  <div className="issue-list">
                    {issue.issues.map((issueText, i) => (
                      <div key={i} className="issue">• {issueText}</div>
                    ))}
                  </div>
                </div>
              ))}
              {issues.length > 5 && (
                <div className="more-issues">...and {issues.length - 5} more spells with issues</div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .formatter-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }

        .formatter-modal {
          background: linear-gradient(135deg, #f4f1e8 0%, #e8dcc0 100%);
          border: 3px solid #8B4513;
          border-radius: 12px;
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }

        .formatter-header {
          background: linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%);
          color: white;
          padding: 16px 20px;
          border-radius: 8px 8px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .formatter-header h3 {
          margin: 0;
          font-family: 'Cinzel', serif;
          font-size: 18px;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .formatter-content {
          padding: 20px;
        }

        .format-summary {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          border: 1px solid rgba(139, 69, 19, 0.2);
        }

        .format-score {
          flex-shrink: 0;
        }

        .score-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }

        .score-number {
          font-size: 20px;
          line-height: 1;
        }

        .score-label {
          font-size: 10px;
          text-transform: uppercase;
        }

        .format-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          flex: 1;
        }

        .stat-item {
          text-align: center;
          padding: 8px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.5);
        }

        .stat-item.valid {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid #22c55e;
        }

        .stat-item.invalid {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid #ef4444;
        }

        .stat-item.total {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid #3b82f6;
        }

        .stat-value {
          font-size: 18px;
          font-weight: bold;
          display: block;
          color: #654321;
        }

        .stat-label {
          font-size: 12px;
          color: #654321;
        }

        .format-actions {
          margin-bottom: 20px;
        }

        .format-button {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s;
          margin-bottom: 8px;
        }

        .format-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .format-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .format-info {
          padding: 8px 12px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 6px;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .format-info small {
          color: #654321;
          font-size: 12px;
          line-height: 1.4;
          display: block;
        }

        .format-results, .format-issues {
          margin-bottom: 16px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          border: 1px solid rgba(139, 69, 19, 0.2);
        }

        .format-results h4, .format-issues h4 {
          margin: 0 0 8px 0;
          color: #654321;
          font-size: 14px;
        }

        .format-result, .format-issue {
          margin-bottom: 6px;
          font-size: 13px;
        }

        .issue-list {
          margin-left: 12px;
          margin-top: 4px;
        }

        .issue {
          color: #dc2626;
          font-size: 12px;
        }

        .more-results, .more-issues {
          font-style: italic;
          color: #6b7280;
          font-size: 12px;
          margin-top: 8px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #8B4513;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SpellLibraryFormatter;
