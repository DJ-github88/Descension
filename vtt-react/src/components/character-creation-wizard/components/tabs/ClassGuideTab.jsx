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

    // Render action cards for Arcanoneer-style classes
    const renderActionCards = (actionTable) => {
        if (!actionTable?.actions) return null;
        return (
            <div className="guide-subsection action-cards-section">
                <div className="guide-section-header">
                    <h4><i className="fas fa-hand-fist"></i> {actionTable.title}</h4>
                    {actionTable.subtitle && <p className="guide-section-subtitle">{actionTable.subtitle}</p>}
                </div>
                <div className="guide-action-cards-grid">
                    {actionTable.actions.map((action, i) => (
                        <div key={i} className="guide-action-card">
                            <div className="guide-action-card-header">
                                <i className={`fas fa-${action.icon}`}></i>
                                <span className="guide-action-name">{action.name}</span>
                            </div>
                            <div className="guide-action-card-stats">
                                <div className="guide-action-stat">
                                    <span className="guide-action-label">Cost</span>
                                    <span className="guide-action-value">{action.spheres} spheres + {action.mana} mana</span>
                                </div>
                                <div className="guide-action-stat">
                                    <span className="guide-action-label">Range</span>
                                    <span className="guide-action-value">{action.range}</span>
                                </div>
                                <div className="guide-action-stat">
                                    <span className="guide-action-label">Target</span>
                                    <span className="guide-action-value">{action.target}</span>
                                </div>
                                <div className="guide-action-stat">
                                    <span className="guide-action-label">Effect</span>
                                    <span className="guide-action-value">{action.damage}</span>
                                </div>
                            </div>
                            <div className="guide-action-card-note">{action.note}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Render combo tier cards
    const renderComboTiers = (comboTiers) => {
        if (!comboTiers?.tiers) return null;
        return (
            <div className="guide-subsection combo-tiers-section">
                <div className="guide-section-header">
                    <h4><i className="fas fa-layer-group"></i> {comboTiers.title}</h4>
                </div>
                <div className="guide-combo-tiers-grid">
                    {comboTiers.tiers.map((tier, i) => (
                        <div key={i} className={`guide-tier-card ${tier.highlight ? 'highlight' : ''}`}>
                            <div className="guide-tier-name">{tier.name}</div>
                            <div className="guide-tier-meta">
                                <span><i className="fas fa-circle"></i> {tier.sphereCost} spheres</span>
                                <span><i className="fas fa-tint"></i> {tier.manaCost} mana</span>
                                <span><i className="fas fa-unlock"></i> {tier.available}</span>
                            </div>
                            <p className="guide-tier-desc">{tier.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Render single-sphere fallback abilities
    const renderFallbacks = (fallbacks) => {
        if (!fallbacks?.abilities) return null;
        return (
            <div className="guide-subsection fallbacks-section">
                <div className="guide-section-header">
                    <h4><i className="fas fa-hand-sparkles"></i> {fallbacks.title}</h4>
                    {fallbacks.subtitle && <p className="guide-section-subtitle">{fallbacks.subtitle}</p>}
                </div>
                <div className="guide-fallbacks-grid">
                    {fallbacks.abilities.map((ability, i) => (
                        <div key={i} className="guide-fallback-card">
                            <div className="guide-fallback-header">
                                <span className="guide-fallback-name">{ability.name}</span>
                                <span className="guide-fallback-type">{ability.type}</span>
                            </div>
                            <div className="guide-fallback-cost">{ability.cost}</div>
                            <div className="guide-fallback-desc">{ability.description}</div>
                        </div>
                    ))}
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
                        {resourceSystem.mechanics.content && (
                            <div className="subsection-content">
                                {renderContent(resourceSystem.mechanics.content)}
                            </div>
                        )}
                        {resourceSystem.mechanics.sections && (
                            <div className="guide-steps">
                                {resourceSystem.mechanics.sections.map((section, i) => (
                                    <div key={i} className="guide-step-card">
                                        <div className="guide-step-number">{section.stepNumber}</div>
                                        <div className="guide-step-body">
                                            <div className="guide-step-title">{section.title}</div>
                                            {section.subtitle && <div className="guide-step-subtitle">{section.subtitle}</div>}
                                            <div className="guide-step-content" dangerouslySetInnerHTML={{
                                                __html: section.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Action Table (Arcanoneer and similar) */}
            {resourceSystem?.mechanics?.actionTable && renderActionCards(resourceSystem.mechanics.actionTable)}

            {/* Sphere Generation Table (Arcanoneer) */}
            {resourceSystem?.sphereGenerationTable && renderTable(resourceSystem.sphereGenerationTable)}

            {/* Mana Cost Reference Table */}
            {resourceSystem?.manaCostTable && renderTable(resourceSystem.manaCostTable)}

            {/* Combo Tiers */}
            {resourceSystem?.mechanics?.comboTiers && renderComboTiers(resourceSystem.mechanics.comboTiers)}

            {/* Single-Sphere Fallbacks */}
            {resourceSystem?.mechanics?.singleSphereFallbacks && renderFallbacks(resourceSystem.mechanics.singleSphereFallbacks)}

            {/* Mana Regeneration */}
            {resourceSystem?.mechanics?.manaRegeneration && (
                <div className="guide-subsection mana-regen-box">
                    <h4><i className="fas fa-tint"></i> {resourceSystem.mechanics.manaRegeneration.title}</h4>
                    <div className="subsection-content">
                        {renderContent(resourceSystem.mechanics.manaRegeneration.content)}
                    </div>
                </div>
            )}

            {/* Action Points */}
            {resourceSystem?.mechanics?.actionPointsRule && (
                <div className="guide-subsection ap-box">
                    <h4><i className="fas fa-bolt"></i> {resourceSystem.mechanics.actionPointsRule.title}</h4>
                    <div className="subsection-content">
                        {renderContent(resourceSystem.mechanics.actionPointsRule.content)}
                    </div>
                </div>
            )}

            {/* Render any specific tables (Inferno, Rage, etc.) */}
            {resourceSystem?.infernoLevelsTable && renderTable(resourceSystem.infernoLevelsTable)}
            {resourceSystem?.rageStatesTable && renderTable(resourceSystem.rageStatesTable)}
            {resourceSystem?.timeShardTable && renderTable(resourceSystem.timeShardTable)}
            {resourceSystem?.musicalNotesTable && renderTable(resourceSystem.musicalNotesTable)}
            {resourceSystem?.edgeStatesTable && renderTable(resourceSystem.edgeStatesTable)}
            {resourceSystem?.chaosTable && renderTable(resourceSystem.chaosTable)}

            {/* Mana Warning */}
            {resourceSystem?.mechanics?.manaWarning && (
                <div className="guide-warning-box" dangerouslySetInnerHTML={{
                    __html: resourceSystem.mechanics.manaWarning.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }} />
            )}

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
                            html: overview.playstyle.content.split('\n\n').slice(0, 3).join('</p><p>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
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
