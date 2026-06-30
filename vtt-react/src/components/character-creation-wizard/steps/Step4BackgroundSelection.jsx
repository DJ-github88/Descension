/**
 * Step 4: Background Selection
 *
 * Background selection with tabbed modal for viewing details
 */

import React, { useState } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { BACKGROUND_DATA } from '../../../data/backgroundData';
import { formatCurrency } from '../../../data/startingCurrencyData';
import TabbedSelectionModal from '../components/TabbedSelectionModal';
import { OverviewTab, StatsTab, SkillsTab, EquipmentTab, FeaturesTab } from '../components/tabs';

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

const Step4BackgroundSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const { characterData, validationErrors } = state;
    const { race, subrace } = characterData;
    
    const [selectedBackground, setSelectedBackground] = useState(characterData.background);
    const [showModal, setShowModal] = useState(false);
    const [viewingBackground, setViewingBackground] = useState(null);

    const [showJustificationModal, setShowJustificationModal] = useState(false);
    const [justificationTarget, setJustificationTarget] = useState(null); // { type: 'background', name: string, id: string }
    const [customJustification, setCustomJustification] = useState('');

    const backgrounds = Object.values(BACKGROUND_DATA) || [];

    const handleBackgroundSelect = (backgroundId) => {
        const bg = BACKGROUND_DATA[backgroundId];
        const { selectable, narrativeUnlock } = isBackgroundCompatible(bg, race, subrace);
        const isCompatible = selectable && !narrativeUnlock;

        if (isCompatible) {
            setSelectedBackground(backgroundId);
            dispatch(wizardActionCreators.setBackground(backgroundId));
            setShowModal(false);
            setViewingBackground(null);
        } else {
            setShowModal(false);
            setJustificationTarget({ type: 'background', name: bg.name, id: backgroundId });
            setShowJustificationModal(true);
        }
    };

    const handleConfirmJustification = (justificationText) => {
        if (!justificationTarget) return;

        // Append to backstory
        const oldBackstory = characterData.lore?.backstory || '';
        const prefix = `[Narrative Unlock Justification - Background (${justificationTarget.name})]: ${justificationText}\n\n`;
        const newBackstory = prefix + oldBackstory;

        dispatch(wizardActionCreators.updateLore({
            ...characterData.lore,
            backstory: newBackstory
        }));

        // Set the choice
        setSelectedBackground(justificationTarget.id);
        dispatch(wizardActionCreators.setBackground(justificationTarget.id));
        setViewingBackground(null);

        // Close modal
        setShowJustificationModal(false);
        setJustificationTarget(null);
        setCustomJustification('');
    };

    const handleBackgroundCardClick = (backgroundId) => {
        const bgData = BACKGROUND_DATA[backgroundId];
        setViewingBackground(bgData);
        setShowModal(true);
    };

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

    const buildModalTabs = () => {
        if (!viewingBackground) return [];

        const equipment = getBackgroundEquipment(viewingBackground);
        const features = getBackgroundFeatures(viewingBackground);
        const currency = viewingBackground.startingCurrency
            ? formatCurrency({
                gold: viewingBackground.startingCurrency.gold || 0,
                silver: viewingBackground.startingCurrency.silver || 0,
                copper: viewingBackground.startingCurrency.copper || 0
            })
            : '15g';

        return [
            {
                id: 'overview',
                label: 'Overview',
                content: (
                    <OverviewTab
                        description={viewingBackground.description}
                        metaBadges={[
                            { label: 'Skills', value: viewingBackground.skillProficiencies?.length || 0 },
                            viewingBackground.toolProficiencies?.length > 0 ? { label: 'Tools', value: viewingBackground.toolProficiencies.length } : null,
                            viewingBackground.languages > 0 ? { label: 'Languages', value: `+${viewingBackground.languages}` } : null
                        ].filter(Boolean)}
                    />
                )
            },
            {
                id: 'skills',
                label: 'Skills',
                badge: (viewingBackground.skillProficiencies?.length || 0) + (viewingBackground.toolProficiencies?.length || 0),
                content: (
                    <SkillsTab
                        skillProficiencies={viewingBackground.skillProficiencies || []}
                        toolProficiencies={viewingBackground.toolProficiencies || []}
                        languages={viewingBackground.languages || 0}
                        languageList={viewingBackground.languageList || []}
                    />
                )
            },
            {
                id: 'stats',
                label: 'Stats',
                content: (
                    <StatsTab
                        statModifiers={viewingBackground.statModifiers || {}}
                        title="Background Bonuses"
                    />
                )
            },
            {
                id: 'equipment',
                label: 'Equipment',
                badge: equipment.length > 0 ? equipment.length.toString() : null,
                content: (
                    <EquipmentTab
                        equipmentNames={equipment}
                        currency={currency}
                        note="Background equipment is included free with your character."
                    />
                )
            },
            {
                id: 'features',
                label: 'Features',
                badge: features.length > 0 ? features.length.toString() : null,
                content: (
                    <FeaturesTab
                        features={features}
                        title="Background Features"
                    />
                )
            }
        ];
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
                        <div className="background-grid-fullwidth">
                            {backgrounds.map((bgItem) => {
                                const { selectable, narrativeUnlock } = isBackgroundCompatible(bgItem, race, subrace);
                                const isCompatible = selectable && !narrativeUnlock;
                                const requiresUnlock = !isCompatible;

                                return (
                                    <div
                                        key={bgItem.id}
                                        className={`background-card ${selectedBackground === bgItem.id ? 'selected' : ''} ${requiresUnlock ? 'narrative-unlock' : ''}`}
                                        onClick={() => handleBackgroundCardClick(bgItem.id)}
                                        style={requiresUnlock ? { borderStyle: 'dashed', borderColor: '#d4af37', position: 'relative' } : { position: 'relative' }}
                                    >
                                        {requiresUnlock && (
                                            <div className="narrative-unlock-badge" style={{
                                                position: 'absolute',
                                                top: '4px',
                                                right: '4px',
                                                background: '#faf6eb',
                                                border: '1px solid #d4af37',
                                                borderRadius: '4px',
                                                padding: '2px 6px',
                                                fontSize: '0.65rem',
                                                color: '#b07a00',
                                                fontWeight: 'bold',
                                                zIndex: 10
                                            }}>
                                                <i className="fas fa-exclamation-triangle" style={{ marginRight: '4px' }}></i>
                                                Narrative Unlock
                                            </div>
                                        )}
                                        <div className="background-info">
                                            <h3 className="background-name">{bgItem.name}</h3>
                                        <p className="background-card-description">
                                            {background.description.substring(0, 100)}...
                                        </p>
                                    </div>
                                    <div className="background-benefits">
                                        <div className="benefit-item">
                                            <i className="fas fa-cogs"></i>
                                            <span>{background.skillProficiencies?.length || 0} Skills</span>
                                        </div>
                                        {background.languages > 0 && (
                                            <div className="benefit-item">
                                                <i className="fas fa-language"></i>
                                                <span>{background.languages} Language{background.languages > 1 ? 's' : ''}</span>
                                            </div>
                                        )}
                                        {bgItem.toolProficiencies && bgItem.toolProficiencies.length > 0 && (
                                            <div className="benefit-item">
                                                <i className="fas fa-tools"></i>
                                                <span>{bgItem.toolProficiencies.length} Tool{bgItem.toolProficiencies.length > 1 ? 's' : ''}</span>
                                            </div>
                                        )}
                                    </div>
                                    <button className="background-view-btn">
                                        <i className="fas fa-eye"></i> View Details
                                    </button>
                                </div>
                            )})}
                        </div>
                    </div>
                </div>
            </div>

            <TabbedSelectionModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setViewingBackground(null);
                }}
                onSelect={() => viewingBackground && handleBackgroundSelect(viewingBackground.id)}
                selectedItem={viewingBackground}
                selectionType="Background"
                tabs={buildModalTabs()}
                width="950px"
                icon="fas fa-book-open"
            />

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
                            Narrative Unlock Required
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
        </div>
    );
};

export default Step4BackgroundSelection;
