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
            'Nordmark': 'fas fa-mountain',
            'Corvani': 'fas fa-crow',
            'Grimheart': 'fas fa-hammer',
            'Voidtouched': 'fas fa-eye',
            'Mirrorkin': 'fas fa-mask',
            'Thornkin': 'fas fa-leaf',
            'Stormcaller': 'fas fa-bolt',
            'Shadowmere': 'fas fa-moon',
            'Ironbound': 'fas fa-shield',
            'Flameborn': 'fas fa-fire',
            'Frostkin': 'fas fa-snowflake',
            'Wildkin': 'fas fa-tree',
            'Graveworn': 'fas fa-skull'
        };
        return icons[raceName] || 'fas fa-user';
    };

    const getRaceColor = (raceName) => {
        const colors = {
            'Nordmark': '#8B7355',
            'Corvani': '#6B5B95',
            'Grimheart': '#A0522D',
            'Voidtouched': '#4B0082',
            'Mirrorkin': '#C0C0C0',
            'Thornkin': '#228B22',
            'Stormcaller': '#4169E1',
            'Shadowmere': '#2F2F4F',
            'Ironbound': '#708090',
            'Flameborn': '#FF4500',
            'Frostkin': '#87CEEB',
            'Wildkin': '#8FBC8F',
            'Graveworn': '#696969'
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
                        description={viewingRace.description}
                        culturalBackground={raceData?.culturalBackground}
                        basicInfo={raceData?.baseTraits ? {
                            'Size': raceData.baseTraits.size,
                            'Speed': `${raceData.baseTraits.baseSpeed} feet`,
                            'Lifespan': raceData.baseTraits.lifespan,
                            'Languages': raceData.baseTraits.languages?.join(', ')
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

    return (
        <div className="wizard-step-content">
            <div className="step-header">
                <h2 className="step-title">
                    <i className="fas fa-dna"></i>
                    Choose Your Heritage
                </h2>
                <p className="step-description">
                    Every hero is shaped by their bloodline. Will you be forged in the frozen peaks of the Nordmark, 
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

                    {selectedRace && selectedSubrace && (
                        <div className="selected-race-summary">
                            <div className="summary-header">
                                <i className="fas fa-check-circle"></i>
                                <span>Selected: <strong>{selectedRaceData?.name}</strong> - <strong>{
                                    selectedRaceData?.subraces.find(s => s.id === selectedSubrace)?.name
                                }</strong></span>
                            </div>
                            <button
                                className="change-selection-btn"
                                onClick={() => handleRaceCardClick(selectedRace)}
                            >
                                <i className="fas fa-edit"></i> View Details
                            </button>
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
            />
            </div>
        </div>
    );
};

export default Step2RaceSelection;
