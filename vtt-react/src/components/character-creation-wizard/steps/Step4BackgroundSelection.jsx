/**
 * Step 4: Background Selection
 *
 * Compact background cards with inline detail panel below
 */

import React, { useState, useRef, useCallback } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { BACKGROUND_DATA, BACKGROUND_FLAVOR_TEXT } from '../../../data/backgroundData';
import { formatCurrency } from '../../../data/startingCurrencyData';

const isBackgroundCompatible = (bg, raceId, subraceId) => {
    if (!bg || !bg.restrictions) return { selectable: true, narrativeUnlock: false };

    const { allowedSubraces = [], hardBlocks, narrativeUnlock } = bg.restrictions;

    if (hardBlocks && (hardBlocks.includes(raceId) || hardBlocks.includes(subraceId))) {
        return { selectable: false, narrativeUnlock: false };
    }

    if (!allowedSubraces || allowedSubraces.length === 0) {
        return { selectable: true, narrativeUnlock: false };
    }

    if (subraceId && allowedSubraces.includes(subraceId)) {
        return { selectable: true, narrativeUnlock: false };
    }

    if (!subraceId && raceId) {
        const racePrefix = raceId + '_';
        const raceRepresented = allowedSubraces.some((sid) => sid.startsWith(racePrefix));
        if (raceRepresented) return { selectable: true, narrativeUnlock: false };
    }

    if (narrativeUnlock) {
        return { selectable: true, narrativeUnlock: true };
    }

    return { selectable: false, narrativeUnlock: false };
};

const getFlavorText = (bg) => BACKGROUND_FLAVOR_TEXT[bg.id] || bg.description?.substring(0, 150) + '...';

const getPrimaryBadge = (bg) => {
    if (bg.feature?.name) return { label: bg.feature.name, icon: 'fas fa-star', type: 'feature' };
    if (bg.toolProficiencies?.length > 0) return { label: bg.toolProficiencies[0], icon: 'fas fa-tools', type: 'tool' };
    if (bg.languages >= 2) return { label: `${bg.languages} Languages`, icon: 'fas fa-language', type: 'language' };
    return { label: bg.skillProficiencies[0], icon: 'fas fa-cogs', type: 'skill' };
};

const getSecondaryBadges = (bg) => {
    const badges = [];
    if (bg.statModifiers) {
        const best = Object.entries(bg.statModifiers).sort((a, b) => b[1] - a[1])[0];
        if (best && best[1] > 0) badges.push({ label: `${best[0].charAt(0).toUpperCase() + best[0].slice(1)} +${best[1]}`, icon: 'fas fa-arrow-up', type: 'stat' });
    }
    if (bg.toolProficiencies?.length > 0) badges.push({ label: `${bg.toolProficiencies.length} Tools`, icon: 'fas fa-hammer', type: 'tool' });
    if (bg.languages > 0) badges.push({ label: `${bg.languages} Lang`, icon: 'fas fa-book', type: 'lang' });
    return badges.slice(0, 2);
};

const Step4BackgroundSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const { characterData, validationErrors } = state;
    const { race, subrace } = characterData;
    
    const [selectedBackground, setSelectedBackground] = useState(characterData.background);
    const [viewingBackground, setViewingBackground] = useState(null);
    const detailPanelRef = useRef(null);

    const [showJustificationModal, setShowJustificationModal] = useState(false);
    const [justificationTarget, setJustificationTarget] = useState(null);
    const [customJustification, setCustomJustification] = useState('');
    const [showRestrictedBackgrounds, setShowRestrictedBackgrounds] = useState(false);

    const backgrounds = Object.values(BACKGROUND_DATA) || [];

    const handleBackgroundSelect = (backgroundId) => {
        const bg = BACKGROUND_DATA[backgroundId];
        const { selectable, narrativeUnlock } = isBackgroundCompatible(bg, race, subrace);
        const isCompatible = selectable && !narrativeUnlock;

        if (isCompatible) {
            setSelectedBackground(backgroundId);
            dispatch(wizardActionCreators.setBackground(backgroundId));
        } else {
            setJustificationTarget({ type: 'background', name: bg.name, id: backgroundId });
            setShowJustificationModal(true);
        }
    };

    const handleConfirmJustification = (justificationText) => {
        if (!justificationTarget) return;

        const oldBackstory = characterData.lore?.backstory || '';
        const prefix = `[Narrative Unlock Justification - Background (${justificationTarget.name})]: ${justificationText}\n\n`;
        const newBackstory = prefix + oldBackstory;

        dispatch(wizardActionCreators.updateLore({
            ...characterData.lore,
            backstory: newBackstory
        }));

        setSelectedBackground(justificationTarget.id);
        dispatch(wizardActionCreators.setBackground(justificationTarget.id));
        setViewingBackground(null);

        setShowJustificationModal(false);
        setJustificationTarget(null);
        setCustomJustification('');
    };

    const handleBackgroundCardClick = useCallback((backgroundId) => {
        const bgData = BACKGROUND_DATA[backgroundId];
        setViewingBackground(bgData);
        setTimeout(() => {
            detailPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }, []);

    const getBackgroundEquipment = (background) => {
        const equipment = background.equipment || background.startingEquipment || [];
        return Array.isArray(equipment) ? equipment : [equipment];
    };

    const getBackgroundFeatures = (background) => {
        const features = [];
        
        if (background.abilities && background.abilities.length > 0) {
            background.abilities.forEach(ability => {
                features.push(`${ability.name}: ${ability.description}`);
            });
        } else if (background.feature) {
            features.push(`${background.feature.name}: ${background.feature.description}`);
        }
        
        return features;
    };

    return (
        <div className="wizard-step-content">
            <div className="step-header">
                <h2 className="step-title">
                    <i className="fas fa-book-open"></i>
                    Choose Your Origins
                </h2>
                <p className="step-description">
                    Before the adventure began, your life was shaped by circumstance and choice. 
                    Were you a Noble born to privilege, a Soldier forged in battle, or perhaps an Outcast 
                    who survived against all odds? Your background grants skills, knowledge, and connections 
                    that will prove invaluable on your journey.
                </p>
            </div>
            <div className="step-body">
            <div className="background-selection-layout-fullwidth">
                <div className="background-selection-panel">
                    <div className="background-section">
                        <h3 className="section-title">
                            <i className="fas fa-users"></i>
                            Available Backgrounds
                        </h3>
                        <div className="background-grid-wrapper-fullwidth">
                            {(() => {
                                const compatibleBackgrounds = backgrounds.filter((bgItem) => {
                                    const { selectable, narrativeUnlock } = isBackgroundCompatible(bgItem, race, subrace);
                                    return selectable && !narrativeUnlock;
                                });
                                const restrictedBackgrounds = backgrounds.filter((bgItem) => {
                                    const { selectable, narrativeUnlock } = isBackgroundCompatible(bgItem, race, subrace);
                                    return !(selectable && !narrativeUnlock);
                                });

                                const renderBackgroundCard = (bgItem) => {
                                    const { selectable, narrativeUnlock } = isBackgroundCompatible(bgItem, race, subrace);
                                    const isCompatible = selectable && !narrativeUnlock;
                                    const requiresUnlock = !isCompatible;
                                    const isActive = viewingBackground?.id === bgItem.id;
                                    const primary = getPrimaryBadge(bgItem);
                                    const secondary = getSecondaryBadges(bgItem);

                                    return (
                                        <div
                                            key={bgItem.id}
                                            className={`background-card-compact ${selectedBackground === bgItem.id ? 'selected' : ''} ${requiresUnlock ? 'narrative-unlock' : ''} ${isActive ? 'active' : ''}`}
                                            onClick={() => handleBackgroundCardClick(bgItem.id)}
                                            style={requiresUnlock ? { borderStyle: 'dashed', borderColor: '#d4af37' } : {}}
                                        >
                                            <h3 className="background-compact-name">{bgItem.name}</h3>
                                            <p className="background-compact-description">{getFlavorText(bgItem)}</p>
                                            <div className="background-compact-badges">
                                                <span className={`compact-badge compact-badge-${primary.type}`}>
                                                    <i className={primary.icon}></i> {primary.label}
                                                </span>
                                                {secondary.map((b, i) => (
                                                    <span key={i} className={`compact-badge compact-badge-${b.type}`}>
                                                        <i className={b.icon}></i> {b.label}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                };

                                return (
                                    <>
                                        <h4 className="categorized-section-title">Lore-Fitting Origins</h4>
                                        <div className="background-grid-fullwidth">
                                            {compatibleBackgrounds.map(renderBackgroundCard)}
                                        </div>

                                        {restrictedBackgrounds.length > 0 && (
                                            <div className="restricted-toggle-container">
                                                <button
                                                    type="button"
                                                    className={`restricted-toggle-button ${showRestrictedBackgrounds ? 'open' : ''}`}
                                                    onClick={() => setShowRestrictedBackgrounds(prev => !prev)}
                                                    aria-expanded={showRestrictedBackgrounds}
                                                >
                                                    <div className="restricted-toggle-left">
                                                        <i className={`fas fa-chevron-${showRestrictedBackgrounds ? 'down' : 'right'} toggle-chevron`}></i>
                                                        <span className="restricted-toggle-label">
                                                            Non-Native Origins (Requires GM Approval)
                                                        </span>
                                                        <span className="restricted-count-badge">{restrictedBackgrounds.length}</span>
                                                    </div>
                                                </button>
                                                {showRestrictedBackgrounds && (
                                                    <div className="background-grid-fullwidth restricted-grid toggleable-restricted-content">
                                                        {restrictedBackgrounds.map(renderBackgroundCard)}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                {/* Inline Detail Panel */}
                {viewingBackground && (
                    <div ref={detailPanelRef} className="background-detail-panel">
                        <div className="detail-panel-header">
                            <h3 className="detail-panel-title">{viewingBackground.name}</h3>
                            <button
                                className="detail-panel-close"
                                onClick={() => setViewingBackground(null)}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="detail-panel-tabs">
                            <div className="detail-panel-tab-content">
                                {/* Overview */}
                                <div className="detail-section">
                                    <h4 className="detail-section-title">Overview</h4>
                                    <p className="detail-description">{viewingBackground.description}</p>
                                </div>

                                {/* Skills */}
                                {(viewingBackground.skillProficiencies?.length > 0 || viewingBackground.toolProficiencies?.length > 0 || viewingBackground.languages > 0) && (
                                    <div className="detail-section">
                                        <h4 className="detail-section-title">Skills & Proficiencies</h4>
                                        <div className="detail-badges">
                                            {viewingBackground.skillProficiencies?.map((skill, i) => (
                                                <span key={i} className="detail-badge skill">
                                                    <i className="fas fa-check"></i> {skill}
                                                </span>
                                            ))}
                                            {viewingBackground.toolProficiencies?.map((tool, i) => (
                                                <span key={i} className="detail-badge tool">
                                                    <i className="fas fa-tools"></i> {tool}
                                                </span>
                                            ))}
                                            {viewingBackground.languages > 0 && (
                                                <span className="detail-badge language">
                                                    <i className="fas fa-language"></i> +{viewingBackground.languages} Language{viewingBackground.languages > 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Stats */}
                                {viewingBackground.statModifiers && Object.keys(viewingBackground.statModifiers).length > 0 && (
                                    <div className="detail-section">
                                        <h4 className="detail-section-title">Stat Bonuses</h4>
                                        <div className="detail-stats">
                                            {Object.entries(viewingBackground.statModifiers).map(([stat, mod]) => (
                                                <span key={stat} className={`stat-mod ${mod > 0 ? 'positive' : 'negative'}`}>
                                                    {stat.toUpperCase()}: {mod > 0 ? '+' : ''}{mod}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Equipment */}
                                {(() => {
                                    const equipment = getBackgroundEquipment(viewingBackground);
                                    const currency = viewingBackground.startingCurrency
                                        ? formatCurrency({
                                            gold: viewingBackground.startingCurrency.gold || 0,
                                            silver: viewingBackground.startingCurrency.silver || 0,
                                            copper: viewingBackground.startingCurrency.copper || 0
                                        })
                                        : '15g';
                                    return equipment.length > 0 ? (
                                        <div className="detail-section">
                                            <h4 className="detail-section-title">Starting Equipment</h4>
                                            <ul className="detail-equipment-list">
                                                {equipment.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                                <li className="currency-item">Starting Gold: {currency}</li>
                                            </ul>
                                        </div>
                                    ) : null;
                                })()}

                                {/* Features */}
                                {(() => {
                                    const features = getBackgroundFeatures(viewingBackground);
                                    return features.length > 0 ? (
                                        <div className="detail-section">
                                            <h4 className="detail-section-title">Background Features</h4>
                                            <div className="detail-features">
                                                {features.map((feature, i) => {
                                                    const [name, ...descParts] = feature.split(': ');
                                                    return (
                                                        <div key={i} className="detail-feature">
                                                            <strong>{name}:</strong> {descParts.join(': ')}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : null;
                                })()}
                            </div>
                        </div>

                        <div className="detail-panel-footer">
                            <button
                                className="detail-select-btn"
                                onClick={() => handleBackgroundSelect(viewingBackground.id)}
                            >
                                <i className="fas fa-check"></i> Select Background
                            </button>
                        </div>
                    </div>
                )}
            </div>
            </div>

            {/* Narrative Justification Modal */}
            {showJustificationModal && (
                <div className="justification-modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 99999,
                    fontFamily: "'Crimson Text', serif"
                }}>
                    <div className="justification-modal-content" style={{
                        background: '#faf6eb',
                        border: '2px solid #b08a4a',
                        borderRadius: '8px',
                        padding: '2rem',
                        maxWidth: '550px',
                        width: '90%',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                        color: '#2e1e0f'
                    }}>
                        <h3 style={{
                            marginTop: 0,
                            color: '#5a3d1d',
                            borderBottom: '1px solid #b08a4a',
                            paddingBottom: '0.5rem',
                            fontSize: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <i className="fas fa-exclamation-triangle" style={{ color: '#d4af37' }}></i>
                            A Rare Path
                        </h3>
                        <p style={{ fontSize: '1.05rem', lineHeight: '1.5', margin: '1rem 0' }}>
                            The combination of <strong>{race ? race.charAt(0).toUpperCase() + race.slice(1) : 'your heritage'}</strong> and the <strong>{justificationTarget?.name}</strong> origin is highly unusual or physically constrained in Mythrill's history.
                        </p>
                        <p style={{ fontSize: '0.95rem', color: '#654321', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                            How did your character break through this boundary? Choose a justification to record in your backstory:
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            {[
                                { id: 'Outcast Training', title: 'Outcast Training', text: 'You studied in secret under an outcast master who operated outside the official guilds or regional checkpoints.' },
                                { id: 'Alchemical Accident', title: 'Alchemical Accident', text: 'An alchemical experiment gone wrong or exposure to Wyrd energy altered your natural biology.' },
                                { id: 'Fateful Encounter', title: 'Fateful Encounter', text: 'A chance meeting with a traveler from another region opened up a path normally denied to your people.' },
                                { id: 'Forgotten Lineage', title: 'Forgotten Lineage', text: 'Your bloodline carries the memory of an older era before the noble houses signed their compacts.' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => {
                                        handleConfirmJustification(opt.title + ': ' + opt.text);
                                    }}
                                    style={{
                                        background: '#faf6eb',
                                        border: '1px solid #c4a882',
                                        borderRadius: '4px',
                                        padding: '0.75rem',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        fontFamily: 'inherit'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#5a3d1d';
                                        e.currentTarget.style.background = '#f5eedb';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#c4a882';
                                        e.currentTarget.style.background = '#faf6eb';
                                    }}
                                >
                                    <strong style={{ display: 'block', color: '#5a3d1d', marginBottom: '2px' }}>{opt.title}</strong>
                                    <span style={{ fontSize: '0.85rem', color: '#4e3629' }}>{opt.text}</span>
                                </button>
                            ))}
                        </div>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#5a3d1d' }}>
                                Or write a custom justification:
                            </label>
                            <textarea
                                value={customJustification}
                                onChange={(e) => setCustomJustification(e.target.value)}
                                placeholder="Describe how your character bypassed this restriction..."
                                style={{
                                    width: '100%',
                                    height: '70px',
                                    padding: '0.5rem',
                                    border: '1px solid #c4a882',
                                    borderRadius: '4px',
                                    background: '#fff',
                                    fontFamily: 'inherit',
                                    fontSize: '0.9rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button
                                onClick={() => {
                                    setShowJustificationModal(false);
                                    setJustificationTarget(null);
                                    setCustomJustification('');
                                }}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#8b0000',
                                    cursor: 'pointer',
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.95rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (customJustification.trim()) {
                                        handleConfirmJustification('Custom Justification: ' + customJustification.trim());
                                    }
                                }}
                                disabled={!customJustification.trim()}
                                style={{
                                    background: '#5a3d1d',
                                    color: '#faf6eb',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '0.5rem 1.5rem',
                                    cursor: customJustification.trim() ? 'pointer' : 'not-allowed',
                                    fontSize: '0.95rem',
                                    fontWeight: 'bold',
                                    opacity: customJustification.trim() ? 1 : 0.5
                                }}
                            >
                                Confirm custom
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Step4BackgroundSelection;
