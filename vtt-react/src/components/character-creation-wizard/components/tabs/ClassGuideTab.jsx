import React from 'react';
import './ClassGuideTab.css';

/**
 * ClassGuideTab Component
 * 
 * A premium, Pathfinder-inspired guide for character classes.
 * Displays resource mechanics, usage tips, and specialization details.
 */
const ClassGuideTab = ({ classData, theme }) => {
    if (!classData) return <div className="class-guide-empty">No guide data available.</div>;

    const { resourceSystem, specializations, overview } = classData;

    // Helper to render markdown-like bold text and line breaks
    const renderContent = (content) => {
        if (!content) return null;
        if (typeof content !== 'string') return null;
        return content.split('\n\n').map((paragraph, i) => (
            <p key={i} dangerouslySetInnerHTML={{ 
                __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
            }} />
        ));
    };

    // Helper to render a resource table
    const renderTable = (table) => {
        if (!table) return null;
        return (
            <div className="guide-table-container">
                <div className="guide-table-title">
                    <i className="fas fa-scroll"></i> {table.title}
                </div>
                <div className="guide-table-wrapper">
                    <table className="guide-table">
                        <thead>
                            <tr>
                                {table.headers.map((h, i) => <th key={i}>{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {table.rows.map((row, i) => (
                                <tr key={i} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                                    {row.map((cell, j) => <td key={j}>{cell}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className={`class-guide-container pathfinder-theme theme-${theme}`}>
            <div className="guide-section main-resource">
                <div className="guide-badge-header">
                    <span className="guide-badge">
                        <i className="fas fa-bolt"></i> CORE RESOURCE
                    </span>
                    <h3>{resourceSystem?.title || 'Class Resource'}</h3>
                </div>
                
                {resourceSystem?.subtitle && (
                    <div className="guide-subtitle">{resourceSystem.subtitle}</div>
                )}

                <div className="guide-description">
                    {renderContent(resourceSystem?.description)}
                </div>

                {resourceSystem?.mechanics && (
                    <div className="guide-subsection mechanics-box">
                        <h4><i className="fas fa-cogs"></i> {resourceSystem.mechanics.title || 'Mechanics'}</h4>
                        <div className="subsection-content">
                            {renderContent(resourceSystem.mechanics.content)}
                        </div>
                    </div>
                )}
            </div>

            {/* Render any specific tables (Inferno, Rage, etc.) */}
            {resourceSystem?.infernoLevelsTable && renderTable(resourceSystem.infernoLevelsTable)}
            {resourceSystem?.rageStatesTable && renderTable(resourceSystem.rageStatesTable)}
            {resourceSystem?.timeShardTable && renderTable(resourceSystem.timeShardTable)}
            {resourceSystem?.musicalNotesTable && renderTable(resourceSystem.musicalNotesTable)}
            {resourceSystem?.edgeStatesTable && renderTable(resourceSystem.edgeStatesTable)}
            {resourceSystem?.chaosTable && renderTable(resourceSystem.chaosTable)}

            {resourceSystem?.strategicConsiderations && (
                <div className="guide-section strategy-section">
                    <h4><i className="fas fa-lightbulb"></i> Strategic Considerations</h4>
                    <div className="strategy-content">
                        {renderContent(resourceSystem.strategicConsiderations.content)}
                    </div>
                </div>
            )}

            {specializations && (
                <div className="guide-section specs-section">
                    <div className="guide-header-line">
                        <h4><i className="fas fa-medal"></i> SPECIALIZATIONS</h4>
                    </div>
                    <div className="specs-brief-grid">
                        {specializations.specs?.map((spec, i) => (
                            <div key={i} className="spec-brief-card" style={{ '--spec-color': spec.color }}>
                                <div className="spec-brief-header">
                                    <span className="spec-name">{spec.name}</span>
                                    <span className="spec-theme-tag">{spec.theme}</span>
                                </div>
                                <p className="spec-brief-desc">{spec.playstyle}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="guide-master-box">
                <div className="master-tag">
                    <i className="fas fa-crown"></i> MASTER GUIDE
                </div>
                <div className="master-content">
                    {overview?.playstyle?.content ? (
                        <div dangerouslySetInnerHTML={{ 
                            __html: overview.playstyle.content.split('\n\n')[0].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                        }} />
                    ) : (
                        "Focus on managing your core resource to maximize efficiency in combat."
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassGuideTab;

