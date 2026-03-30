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

const Step4BackgroundSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const [selectedBackground, setSelectedBackground] = useState(state.characterData.background);
    
    const [showModal, setShowModal] = useState(false);
    const [viewingBackground, setViewingBackground] = useState(null);

    const backgrounds = Object.values(BACKGROUND_DATA) || [];
    const { validationErrors } = state;

    const handleBackgroundSelect = (backgroundId) => {
        setSelectedBackground(backgroundId);
        dispatch(wizardActionCreators.setBackground(backgroundId));
        setShowModal(false);
        setViewingBackground(null);
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
                            {backgrounds.map((background) => (
                                <div
                                    key={background.id}
                                    className={`background-card ${selectedBackground === background.id ? 'selected' : ''}`}
                                    onClick={() => handleBackgroundCardClick(background.id)}
                                >
                                    <div className="background-info">
                                        <h3 className="background-name">{background.name}</h3>
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
                                        {background.toolProficiencies && background.toolProficiencies.length > 0 && (
                                            <div className="benefit-item">
                                                <i className="fas fa-tools"></i>
                                                <span>{background.toolProficiencies.length} Tool{background.toolProficiencies.length > 1 ? 's' : ''}</span>
                                            </div>
                                        )}
                                    </div>
                                    <button className="background-view-btn">
                                        <i className="fas fa-eye"></i> View Details
                                    </button>
                                </div>
                            ))}
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
            </div>
        </div>
    );
};

export default Step4BackgroundSelection;
