/**
 * Step 5: Discipline Selection
 *
 * Choose from character disciplines with tabbed modal for viewing details
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { ENHANCED_PATHS } from '../../../data/enhancedPathData';
import { useSpellLibrary, useSpellLibraryDispatch } from '../../spellcrafting-wizard/context/SpellLibraryContext';
import { getDisciplineSpells, addSpellsToLibrary, selectRandomSpells, removeSpellsByCategory, normalizeDisciplineAbility } from '../../../utils/raceDisciplineSpellUtils';
import TabbedSelectionModal from '../components/TabbedSelectionModal';
import { OverviewTab, PassivesTab, AbilitiesTab } from '../components/tabs';

const Step5PathSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const spellLibraryDispatch = useSpellLibraryDispatch();
    const spellLibrary = useSpellLibrary();

    const [selectedPath, setSelectedPath] = useState(state.characterData.path);
    const [selectedAbility, setSelectedAbility] = useState(state.characterData.selectedAbility);
    const [viewingAbilityId, setViewingAbilityId] = useState(null);
    
    const [showModal, setShowModal] = useState(false);
    const [viewingDiscipline, setViewingDiscipline] = useState(null);
    const [modalSelectedAbility, setModalSelectedAbility] = useState(null);

    const paths = Object.values(ENHANCED_PATHS);
    const { validationErrors } = state;

    const handlePathSelect = (pathId, abilityId) => {
        removeSpellsByCategory(spellLibraryDispatch, 'Discipline Abilities', spellLibrary.spells);
        setSelectedPath(pathId);
        setSelectedAbility(abilityId);
        setViewingAbilityId(null);
        dispatch(wizardActionCreators.setPath(pathId));
        dispatch(wizardActionCreators.setSelectedAbility(abilityId));
        const disciplineSpells = getDisciplineSpells(pathId);
        if (abilityId && disciplineSpells.length > 0) {
            const chosenSpell = disciplineSpells.find(s => s.id === abilityId);
            if (chosenSpell) {
                addSpellsToLibrary(spellLibraryDispatch, [chosenSpell], 'Discipline Abilities');
            }
        }
        setShowModal(false);
        setViewingDiscipline(null);
        setModalSelectedAbility(null);
    };

    const handleDisciplineCardClick = (pathId) => {
        const discipline = ENHANCED_PATHS[pathId];
        setViewingDiscipline(discipline);
        setModalSelectedAbility(selectedAbility || null);
        setShowModal(true);
        setViewingAbilityId(null);
    };

    const handleAbilitySelect = (abilityId) => {
        const newSelectedAbility = modalSelectedAbility === abilityId ? null : abilityId;
        setModalSelectedAbility(newSelectedAbility);
        setViewingAbilityId(newSelectedAbility);
    };

    const getDisciplineIcon = useCallback((pathId) => {
        const icons = {
            'mystic': 'fas fa-hat-wizard',
            'trickster': 'fas fa-mask',
            'harrow': 'fas fa-skull',
            'arcanist': 'fas fa-wand-sparkles',
            'hexer': 'fas fa-moon',
            'reaver': 'fas fa-bolt',
            'mercenary': 'fas fa-coins',
            'sentinel': 'fas fa-shield-alt'
        };
        return icons[pathId] || 'fas fa-star';
    }, []);

    const getDisciplineGradient = useCallback((pathId) => {
        const gradients = {
            'mystic': 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
            'trickster': 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
            'harrow': 'linear-gradient(135deg, #2c3e50 0%, #1a252f 100%)',
            'arcanist': 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
            'hexer': 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
            'reaver': 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
            'mercenary': 'linear-gradient(135deg, #f1c40f 0%, #f39c12 100%)',
            'sentinel': 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)'
        };
        return gradients[pathId] || 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)';
    }, []);

    const modalTabs = useMemo(() => {
        if (!viewingDiscipline) return [];

        const normalizedAbilities = (viewingDiscipline.abilities || []).map(normalizeDisciplineAbility);

        return [
            {
                id: 'overview',
                label: 'Overview',
                content: (
                    <OverviewTab
                        description={viewingDiscipline.description}
                        flavorText={viewingDiscipline.overview}
                    />
                )
            },
            {
                id: 'passives',
                label: 'Passives',
                badge: viewingDiscipline.mechanicalBenefits?.length?.toString(),
                content: (
                    <PassivesTab
                        passives={viewingDiscipline.mechanicalBenefits || []}
                        title="Discipline Passive Abilities"
                    />
                )
            },
            {
                id: 'abilities',
                label: 'Choose Ability',
                badge: normalizedAbilities.length.toString(),
                content: (
                    <AbilitiesTab
                        abilities={normalizedAbilities}
                        selectedAbilityId={modalSelectedAbility}
                        onSelectAbility={handleAbilitySelect}
                        title="Choose 1 Discipline Ability"
                    />
                )
            }
        ];
    }, [viewingDiscipline]);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setViewingDiscipline(null);
        setViewingAbilityId(null);
    }, []);

    const handleModalSelect = useCallback(() => {
        if (viewingDiscipline) {
            handlePathSelect(viewingDiscipline.id, modalSelectedAbility);
        }
    }, [viewingDiscipline, modalSelectedAbility]);

    return (
        <div className="wizard-step-content">
            <div className="step-header">
                <h2 className="step-title">
                    <i className="fas fa-compass"></i>
                    Choose Your Discipline
                </h2>
                <p className="step-description">
                    Within each class lies the potential for specialization—a discipline that refines your 
                    abilities and sets you apart from others who share your calling. Will you embrace the 
                    arcane mysteries of the Mystic, the cunning tricks of the Trickster, or the unyielding 
                    protection of the Sentinel? Your discipline grants powerful passive abilities and 
                    shapes your ultimate destiny.
                </p>
            </div>
            <div className="step-body">
            <div className="discipline-selection-layout-fullwidth">
                <div className="discipline-selection-panel">
                    <div className="discipline-section">
                        <h3 className="section-title">
                            <i className="fas fa-star"></i>
                            Available Disciplines
                        </h3>
                        <div className="discipline-grid-fullwidth">
                            {paths.map(path => (
                                <div
                                    key={path.id}
                                    className={`discipline-card ${selectedPath === path.id ? 'selected' : ''}`}
                                    onClick={() => handleDisciplineCardClick(path.id)}
                                    style={{ '--discipline-gradient': getDisciplineGradient(path.id) }}
                                >
                                    <div className="discipline-card-icon">
                                        <i className={getDisciplineIcon(path.id)}></i>
                                    </div>
                                    <div className="discipline-info">
                                        <h4 className="discipline-name">{path.name}</h4>
                                        <p className="discipline-description">
                                            {path.description?.substring(0, 80) || 'A unique path of power...'}...
                                        </p>
                                    </div>
                                    <button className="discipline-view-btn">
                                        <i className="fas fa-eye"></i> View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedPath && (
                        <div className="selected-discipline-summary">
                            <div className="summary-header">
                                <i className="fas fa-check-circle"></i>
                                <span>Selected: <strong>{ENHANCED_PATHS[selectedPath]?.name}</strong></span>
                            </div>
                            <button 
                                className="change-selection-btn"
                                onClick={() => handleDisciplineCardClick(selectedPath)}
                            >
                                <i className="fas fa-edit"></i> View Details
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <TabbedSelectionModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onSelect={handleModalSelect}
                selectedItem={viewingDiscipline}
                selectionType="Discipline"
                tabs={modalTabs}
                width="950px"
                disableSelect={!modalSelectedAbility}
                icon={viewingDiscipline ? getDisciplineIcon(viewingDiscipline.id) : null}
                gradient={viewingDiscipline ? getDisciplineGradient(viewingDiscipline.id) : null}
            />
            </div>
        </div>
    );
};

export default Step5PathSelection;
