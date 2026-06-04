/**
 * Step 2: Race & Subrace Selection
 *
 * Race selection with tabbed modal for viewing details
 * Flow: Click race → Tabbed modal with Overview, Subrace, Traits, Stats, Equipment
 */

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { RACE_DATA, getRacialBaseStats, getRacialSavingThrowModifiers } from '../../../data/raceData';
import { getEquipmentPreview } from '../../../data/startingEquipmentData';
import { getIconUrl } from '../../../utils/assetManager';
import { useSpellLibrary, useSpellLibraryDispatch } from '../../spellcrafting-wizard/context/SpellLibraryContext';
import { getRacialSpells, addSpellsToLibrary, removeSpellsByCategory } from '../../../utils/raceDisciplineSpellUtils';
import useCharacterStore from '../../../store/characterStore';
import TabbedSelectionModal from '../components/TabbedSelectionModal';
import { OverviewTab, StatsTab, TraitsTab, EquipmentTab, SubraceTab } from '../components/tabs';

const SubracePickerModal = ({ isOpen, race, onPickSubrace, onCancel }) => {
    if (!isOpen || !race) return null;

    return ReactDOM.createPortal(
        <div className="subrace-picker-overlay" onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
            <div className="subrace-picker-modal subrace-picker-modal-enhanced">
                <div className="subrace-picker-header">
                    <div className="subrace-picker-title">
                        <i className={race.icon}></i>
                        <span>Choose a {race.name} Subrace</span>
                    </div>
                    <button className="subrace-picker-close" onClick={onCancel}>✕</button>
                </div>
                <div className="subrace-picker-intro">
                    <p>{race.name} has <strong>{race.subraces.length} subraces</strong>. Compare their traits and abilities below to make your choice.</p>
                </div>
                <div className="subrace-comparison-container">
                    {race.subraces.map((subrace) => (
                        <div key={subrace.id} className="subrace-comparison-card">
                            <div className="comparison-card-body">
                                <div className="comparison-card-header">
                                    <div className="comparison-card-icon">
                                        <i className="fas fa-dna"></i>
                                    </div>
                                    <h4 className="comparison-card-name">{subrace.name}</h4>
                                </div>

                                <div className="comparison-card-description">
                                    <p>{subrace.description}</p>
                                </div>

                                {subrace.statModifiers && Object.keys(subrace.statModifiers).length > 0 && (
                                    <div className="comparison-card-section">
                                        <h5 className="comparison-section-title">
                                            <i className="fas fa-chart-bar"></i> Stat Modifiers
                                        </h5>
                                        <div className="comparison-stat-grid">
                                            {Object.entries(subrace.statModifiers).map(([stat, modifier]) => (
                                                modifier !== 0 && (
                                                    <div
                                                        key={stat}
                                                        className={`comparison-stat ${modifier >= 0 ? 'positive' : 'negative'}`}
                                                    >
                                                        <span className="stat-abbr">{stat.slice(0, 3).toUpperCase()}</span>
                                                        <span className="stat-mod">{modifier >= 0 ? '+' : ''}{modifier}</span>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {subrace.traits && subrace.traits.length > 0 && (
                                    <div className="comparison-card-section">
                                        <h5 className="comparison-section-title">
                                            <i className="fas fa-star"></i> Key Traits
                                        </h5>
                                        <div className="comparison-traits-list">
                                            {subrace.traits.slice(0, 3).map((trait, index) => (
                                                <div key={index} className="comparison-trait-item">
                                                    <i className="fas fa-check"></i>
                                                    <span>{trait.name}</span>
                                                </div>
                                            ))}
                                            {subrace.traits.length > 3 && (
                                                <div className="comparison-more-traits">
                                                    +{subrace.traits.length - 3} more traits
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                className="comparison-select-btn"
                                onClick={() => onPickSubrace(subrace)}
                            >
                                <i className="fas fa-check-circle"></i>
                                Select {subrace.name}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="subrace-picker-footer">
                    <button className="subrace-picker-cancel-btn" onClick={onCancel}>
                        <i className="fas fa-arrow-left"></i> Go Back
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};


const Step2RaceSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const spellLibraryDispatch = useSpellLibraryDispatch();
    const spellLibrary = useSpellLibrary();
    const updateCharacterInfo = useCharacterStore(state => state.updateCharacterInfo);

    const [selectedRace, setSelectedRace] = useState(state.characterData.race);
    const [selectedSubrace, setSelectedSubrace] = useState(state.characterData.subrace);

    const [showSubracePicker, setShowSubracePicker] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [viewingRace, setViewingRace] = useState(null);
    const [pendingSubrace, setPendingSubrace] = useState(null);


    const { validationErrors } = state;

    const getRaceList = () => {
        return Object.entries(RACE_DATA).map(([raceId, raceData]) => ({
            id: raceId,
            name: raceData.name,
            description: raceData.description,
            essence: raceData.essence || raceData.name,
            gradient: raceData.gradient || 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
            icon: getRaceIcon(raceData.name),
            color: getRaceColor(raceData.name),
            subraces: Object.entries(raceData.subraces).map(([subraceKey, subraceData]) => ({
                id: subraceData.id,
                name: subraceData.name,
                description: subraceData.description,
                statModifiers: subraceData.statModifiers,
                traits: subraceData.traits
            }))
        }));
    };

    const getRaceIcon = (raceName) => {
        const icons = {

            'Myrathil': 'fas fa-water',
            'Mimir': 'fas fa-mask',
            'Briaran': 'fas fa-leaf',
            'Groven': 'fas fa-shield-alt',
            'Emberth': 'fas fa-fire',
            'Vreken': 'fas fa-spider',
            'Neth': 'fas fa-scroll',
            'Astril': 'fas fa-star',
            'Fexrick': 'fas fa-cog',
            'Human': 'fas fa-user'
        };
        return icons[raceName] || 'fas fa-user';
    };

    const getRaceColor = (raceName) => {
        const colors = {

            'Myrathil': '#00ced1',
            'Mimir': '#9370db',
            'Briaran': '#228b22',
            'Groven': '#8b7355',
            'Emberth': '#ff4500',
            'Vreken': '#2f2f4f',
            'Neth': '#c0c0c0',
            'Astril': '#ffd700',
            'Fexrick': '#b8860b',
            'Human': '#a0522d'
        };
        return colors[raceName] || '#d4af37';
    };

    const handleFinalSelect = (raceId, subraceId) => {
        removeSpellsByCategory(spellLibraryDispatch, 'Racial Abilities', spellLibrary.spells);
        setSelectedRace(raceId);
        setSelectedSubrace(subraceId);
        dispatch(wizardActionCreators.setRace(raceId));
        dispatch(wizardActionCreators.setSubrace(subraceId));
        updateCharacterInfo('race', raceId);
        updateCharacterInfo('subrace', subraceId);
        const racialSpells = getRacialSpells(raceId, subraceId);
        if (racialSpells.length > 0) {
            addSpellsToLibrary(spellLibraryDispatch, racialSpells, 'Racial Abilities');
        }
        setShowModal(false);
        setViewingRace(null);
        setPendingSubrace(null);
    };

    const handleRaceCardClick = (raceId) => {
        const raceData = getRaceList().find(race => race.id === raceId);
        setViewingRace(raceData);
        setPendingSubrace(null);
        // If race has subraces, show picker first; otherwise go straight to detail modal
        if (raceData.subraces && raceData.subraces.length > 1) {
            setShowSubracePicker(true);
            setShowModal(false);
        } else {
            setShowSubracePicker(false);
            setPendingSubrace(raceData.subraces[0] || null);
            setShowModal(true);
        }
    };

    const handleSubracePickerSelect = (subrace) => {
        setPendingSubrace(subrace);
        setShowSubracePicker(false);
        setShowModal(true);
    };

    const handleSubracePickerCancel = () => {
        setShowSubracePicker(false);
        setViewingRace(null);
        setPendingSubrace(null);
    };


    const handleSubraceSelect = (subrace) => {
        setPendingSubrace(subrace);
    };

    const handleModalSelect = () => {
        if (viewingRace && pendingSubrace) {
            handleFinalSelect(viewingRace.id, pendingSubrace.id);
        }
    };

    const getSelectedRaceData = () => {
        if (!selectedRace) return null;
        return getRaceList().find(race => race.id === selectedRace);
    };

    const buildModalTabs = () => {
        if (!viewingRace) return [];

        const raceData = RACE_DATA[viewingRace.id];
        const currentSubrace = pendingSubrace || viewingRace.subraces[0];
        const baseStats = currentSubrace ? getRacialBaseStats(viewingRace.id, currentSubrace.id) : null;
        const savingThrowMods = currentSubrace ? getRacialSavingThrowModifiers(viewingRace.id, currentSubrace.id) : null;

        const raceEquipment = getEquipmentPreview('race', viewingRace.id);
        const subraceEquipment = currentSubrace ? getEquipmentPreview('subrace', currentSubrace.id) : { examples: [] };
        const allEquipment = [...(raceEquipment.examples || []), ...(subraceEquipment.examples || [])];

        const tabs = [
            {
                id: 'overview',
                label: 'Overview',
                content: (
                    <OverviewTab
                        flavorText={viewingRace.description}
                        culturalBackground={raceData?.culturalBackground}
                        basicInfo={raceData?.baseTraits ? {
                            'Size': raceData.baseTraits.size,
                            'Speed': `${raceData.baseTraits.baseSpeed} feet`,
                            'Lifespan': raceData.baseTraits.lifespan,
                            'Languages': raceData.baseTraits.languages?.join(', ')
                        } : null}
                        subrace={currentSubrace ? {
                            name: currentSubrace.name,
                            description: currentSubrace.description,
                            culturalBackground: currentSubrace.culturalBackground
                        } : null}
                    />
                )
            },
            {
                id: 'subrace',
                label: 'Subrace',
                badge: viewingRace.subraces.length.toString(),
                content: (
                    <SubraceTab
                        subraces={viewingRace.subraces}
                        selectedSubraceId={pendingSubrace?.id}
                        onSelectSubrace={handleSubraceSelect}
                        raceName={viewingRace.name}
                    />
                )
            },
            {
                id: 'traits',
                label: 'Traits',
                badge: currentSubrace?.traits?.length?.toString(),
                content: (
                    <TraitsTab
                        traits={currentSubrace?.traits || []}
                        title={`${currentSubrace?.name || 'Subrace'} Traits`}
                    />
                )
            },
            {
                id: 'stats',
                label: 'Stats',
                content: (
                    <StatsTab
                        statModifiers={currentSubrace?.statModifiers || {}}
                        baseStats={baseStats}
                        savingThrowMods={savingThrowMods}
                    />
                )
            },
            {
                id: 'equipment',
                label: 'Equipment',
                badge: allEquipment.length > 0 ? allEquipment.length.toString() : null,
                content: (
                    <EquipmentTab
                        equipmentNames={allEquipment}
                        note="These items are added to your starting equipment pool. You can purchase additional items in Step 10."
                    />
                )
            }
        ];

        return tabs;
    };

    const raceList = getRaceList();
    const selectedRaceData = getSelectedRaceData();

    const subHeaderContent = viewingRace && viewingRace.subraces.length > 1 ? (
        <div className="modal-header-subrace-switcher">
            <span className="switcher-label"><i className="fas fa-exchange-alt"></i> Subrace:</span>
            <div className="switcher-pills">
                {viewingRace.subraces.map((sub) => {
                    const isSelected = pendingSubrace?.id === sub.id;
                    return (
                        <button
                            key={sub.id}
                            type="button"
                            className={`switcher-pill ${isSelected ? 'active' : ''}`}
                            onClick={() => handleSubraceSelect(sub)}
                        >
                            <span className="pill-name">{sub.name}</span>
                            {sub.statModifiers && Object.keys(sub.statModifiers).length > 0 && (
                                <span className="pill-stats">
                                    ({Object.entries(sub.statModifiers)
                                        .filter(([_, mod]) => mod !== 0)
                                        .map(([stat, mod]) => `${stat.slice(0, 3).toUpperCase()}${mod >= 0 ? '+' : ''}${mod}`)
                                        .join(', ')})
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    ) : null;

    return (
        <div className="wizard-step-content">
            <div className="step-header">
                <h2 className="step-title">
                    <i className="fas fa-dna"></i>
                    Choose Your Heritage
                </h2>
                <p className="step-description">
                    Every hero is shaped by their bloodline. Will you endure the frozen fjords of Nordhalla as a Skald,
                    rise from the shadowed depths as Corvani, or perhaps carry the ancient fire of the Emberth within your veins?
                    Your race grants unique abilities, traits, and a destiny written in your very soul.
                </p>
            </div>
            <div className="step-body">
                <div className="race-selection-layout-fullwidth">
                    <div className="race-selection-panel">
                        <div className="race-section">
                            <h3 className="section-title">
                                <i className="fas fa-users"></i>
                                Available Races
                            </h3>
                            <div className="race-grid-fullwidth">
                                {raceList.map((race) => (
                                    <div
                                        key={race.id}
                                        className={`race-card ${selectedRace === race.id ? 'selected' : ''}`}
                                        onClick={() => handleRaceCardClick(race.id)}
                                        style={{ '--race-gradient': race.gradient }}
                                    >
                                        <div className="race-card-icon">
                                            <i className={race.icon}></i>
                                        </div>
                                        <h4 className="race-name">{race.name}</h4>
                                        {race.essence && <p className="race-essence">{race.essence}</p>}
                                        <button className="race-view-btn">
                                            <i className="fas fa-eye"></i> View Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {selectedRace && selectedSubrace && selectedRaceData && (
                            <div className="selected-race-summary-enhanced">
                                <div className="summary-enhanced-header">
                                    <div className="summary-title-group">
                                        <i className="fas fa-check-circle success-icon"></i>
                                        <span>Current Heritage: <strong>{selectedRaceData.name}</strong> - <strong className="highlight-text">{
                                            selectedRaceData.subraces.find(s => s.id === selectedSubrace)?.name || selectedSubrace
                                        }</strong></span>
                                    </div>
                                    <button
                                        className="change-selection-btn-enhanced"
                                        onClick={() => handleRaceCardClick(selectedRace)}
                                    >
                                        <i className="fas fa-book-open"></i> View Full Details
                                    </button>
                                </div>

                                {selectedRaceData.subraces && selectedRaceData.subraces.length > 1 && (
                                    <div className="quick-subrace-switcher-section">
                                        <h4 className="quick-switcher-title">
                                            <i className="fas fa-exchange-alt"></i>
                                            Quick-Switch Subrace:
                                        </h4>
                                        <div className="quick-subrace-grid">
                                            {selectedRaceData.subraces.map((sub) => {
                                                const isCurrent = selectedSubrace === sub.id;
                                                return (
                                                    <div 
                                                        key={sub.id} 
                                                        className={`quick-subrace-card ${isCurrent ? 'active' : ''}`}
                                                        onClick={() => handleFinalSelect(selectedRace, sub.id)}
                                                    >
                                                        <div className="quick-subrace-card-header">
                                                            <span className="subrace-name">{sub.name}</span>
                                                            {isCurrent && <span className="active-badge"><i className="fas fa-check"></i> Selected</span>}
                                                        </div>
                                                        <p className="subrace-desc">{sub.description}</p>
                                                        {sub.statModifiers && Object.keys(sub.statModifiers).length > 0 && (
                                                            <div className="subrace-mods">
                                                                {Object.entries(sub.statModifiers).map(([stat, mod]) => (
                                                                    mod !== 0 && (
                                                                        <span key={stat} className={`mod-badge ${mod >= 0 ? 'pos' : 'neg'}`}>
                                                                            {stat.slice(0, 3).toUpperCase()}: {mod >= 0 ? '+' : ''}{mod}
                                                                        </span>
                                                                    )
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <SubracePickerModal
                    isOpen={showSubracePicker}
                    race={viewingRace}
                    onPickSubrace={handleSubracePickerSelect}
                    onCancel={handleSubracePickerCancel}
                />

                <TabbedSelectionModal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setViewingRace(null);
                        setPendingSubrace(null);
                    }}
                    onSelect={handleModalSelect}
                    selectedItem={pendingSubrace ? { name: `${viewingRace?.name} - ${pendingSubrace?.name}` } : null}
                    selectionType={`${viewingRace?.name || 'Race'}${pendingSubrace ? ` - ${pendingSubrace.name}` : ''}`}
                    tabs={buildModalTabs()}
                    width="950px"
                    icon={viewingRace?.icon}
                    gradient={viewingRace?.gradient}
                    defaultTab="overview"
                    subHeaderContent={subHeaderContent}
                />
            </div>
        </div>
    );
};

export default Step2RaceSelection;
