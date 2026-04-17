/**
 * Step 3: Class Selection
 *
 * Class selection with tabbed modal for viewing details
 */

import React, { useState } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { getEquipmentPreview } from '../../../data/startingEquipmentData';
import TabbedSelectionModal from '../components/TabbedSelectionModal';
import { OverviewTab, EquipmentTab, DamageTypesTab, ClassGuideTab } from '../components/tabs';
import { ALL_CLASSES_DATA } from '../../../data/classes';



const Step3ClassSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const [selectedClass, setSelectedClass] = useState(state.characterData.class);
    
    const [showModal, setShowModal] = useState(false);
    const [viewingClass, setViewingClass] = useState(null);

    const { validationErrors } = state;

    const characterClasses = [
        { name: 'Pyrofiend', icon: 'fas fa-fire', description: 'Demonic fire wielder with ascending corruption stages', theme: 'fire' },
        { name: 'Minstrel', icon: 'fas fa-music', description: 'Musical spellcaster combining notes into powerful chords', theme: 'music' },
        { name: 'Chronarch', icon: 'fas fa-clock', description: 'Time manipulator building temporal energy', theme: 'time' },
        { name: 'Chaos Weaver', icon: 'fas fa-dice', description: 'Reality bender using chaos dice and entropy', theme: 'chaos' },
        { name: 'Fate Weaver', icon: 'fas fa-cards', description: 'Destiny manipulator using cards and threads of fate', theme: 'fate' },
        { name: 'Gambler', icon: 'fas fa-coins', description: 'Fate manipulator balancing luck and risk', theme: 'luck' },
        { name: 'Martyr', icon: 'fas fa-plus', description: 'Self-sacrificing warrior earning power through pain', theme: 'sacrifice' },
        { name: 'False Prophet', icon: 'fas fa-eye-slash', description: 'Deceptive preacher spreading lies and corruption', theme: 'deception' },
        { name: 'Exorcist', icon: 'fas fa-hand-sparkles', description: 'Holy warrior banishing evil spirits', theme: 'holy' },
        { name: 'Oracle', icon: 'fas fa-eye', description: 'Seer with prophetic visions and fate manipulation', theme: 'divination' },
        { name: 'Plaguebringer', icon: 'fas fa-skull', description: 'Disease spreader with contagious plague stacks', theme: 'disease' },
        { name: 'Lichborne', icon: 'fas fa-skull-crossbones', description: 'Undead spellcaster with phylactery power', theme: 'undead' },
        { name: 'Deathcaller', icon: 'fas fa-ghost', description: 'Necromancer harvesting souls for dark magic', theme: 'necromancy' },
        { name: 'Spellguard', icon: 'fas fa-shield-alt', description: 'Protective mage with magical ward layers', theme: 'protection' },
        { name: 'Inscriptor', icon: 'fas fa-scroll', description: 'Runic scholar creating magical glyph circuits', theme: 'runes' },
        { name: 'Arcanoneer', icon: 'fas fa-wand-magic-sparkles', description: 'Elemental cannon wielder with volatility risk', theme: 'elemental' },
        { name: 'Witch Doctor', icon: 'fas fa-hat-wizard', description: 'Spiritual invoker channeling loa spirits', theme: 'spiritual' },
        { name: 'Formbender', icon: 'fas fa-paw', description: 'Shapeshifter with primal instinct energy', theme: 'primal' },
        { name: 'Primalist', icon: 'fas fa-tree', description: 'Totem master resonating with elemental forces', theme: 'nature' },
        { name: 'Berserker', icon: 'fas fa-hammer', description: 'Fury warrior with momentum thresholds', theme: 'rage' },
        { name: 'Dreadnaught', icon: 'fas fa-shield', description: 'Fortress defender with siege capabilities', theme: 'fortress' },
        { name: 'Titan', icon: 'fas fa-mountain', description: 'Gravity manipulator with strain overload', theme: 'gravity' },
        { name: 'Toxicologist', icon: 'fas fa-flask', description: 'Poison crafter with alchemical vials', theme: 'alchemy' },
        { name: 'Covenbane', icon: 'fas fa-ban', description: 'Witch hunter with anti-magic seals', theme: 'anti-magic' },
        { name: 'Bladedancer', icon: 'fas fa-wind', description: 'Finesse fighter with edge and flourish', theme: 'finesse' },
        { name: 'Lunarch', icon: 'fas fa-moon', description: 'Lunar mage with phase-based energy', theme: 'lunar' },
        { name: 'Huntress', icon: 'fas fa-crosshairs', description: 'Tracker with quarry marks and precision', theme: 'hunter' },
        { name: 'Warden', icon: 'fas fa-shield', description: 'Barrier guardian with protective bulwarks', theme: 'guardian' }
    ];

    const handleClassSelect = (className) => {
        setSelectedClass(className);
        dispatch(wizardActionCreators.setClass(className));
        setShowModal(false);
        setViewingClass(null);
    };

    const handleClassCardClick = (className) => {
        const classData = characterClasses.find(cls => cls.name === className);
        setViewingClass(classData);
        setShowModal(true);
    };




    // Simplified tab builder using centralized ALL_CLASSES_DATA
    const buildModalTabs = () => {
        if (!viewingClass) return [];

        const fullClassData = ALL_CLASSES_DATA[viewingClass.name];
        const theme = viewingClass.theme || 'default';

        const classEquipment = getEquipmentPreview('class', viewingClass.name);

        return [
            {
                id: 'overview',
                label: 'Overview',
                content: (
                    <OverviewTab
                        description={fullClassData?.overview?.description || viewingClass.description}
                        metaBadges={[
                            { label: 'Theme', value: theme },
                            { label: 'Role', value: fullClassData?.role || 'Versatile' },
                            { label: 'Resource', value: fullClassData?.resourceSystem?.title || 'Class Energy' }
                        ]}
                    />
                )
            },
            {
                id: 'guide',
                label: 'Class Guide',
                badge: '!',
                content: (
                    <ClassGuideTab 
                        classData={fullClassData}
                        theme={theme}
                    />
                )
            },
            {
                id: 'equipment',
                label: 'Equipment',
                badge: classEquipment.count > 0 ? classEquipment.count.toString() : null,
                content: (
                    <EquipmentTab 
                        equipmentNames={classEquipment.examples}
                        note="These items are added to your starting equipment pool. You can purchase additional items in Step 10."
                    />
                )
            },
            {
                id: 'damage-types',
                label: 'Damage Types',
                content: (
                    <DamageTypesTab 
                        damageTypes={fullClassData?.damageTypes || []}
                    />
                )
            }
        ];
    };

    return (
        <div className="wizard-step-content">
            <div className="step-header">
                <h2 className="step-title">
                    <i className="fas fa-fire"></i>
                    Choose Your Calling
                </h2>
                <p className="step-description">
                    Your class defines not merely what you do, but who you are destined to become. 
                    Will you harness the destructive fury of the Pyrofiend, weave reality itself as a Chaos Weaver, 
                    or perhaps walk the shadowed path of the Deathcaller? Each calling offers unique powers, 
                    mechanics, and a playstyle that will shape your legend.
                </p>
            </div>
            <div className="step-body">
            <div className="class-selection-layout-fullwidth">
                <div className="class-selection-panel">
                    <div className="class-section">
                        <h3 className="section-title">
                            <i className="fas fa-sword"></i>
                            Available Classes
                        </h3>
                        <div className="class-grid-fullwidth">
                            {characterClasses.map((classData) => (
                                <div
                                    key={classData.name}
                                    className={`class-card ${selectedClass === classData.name ? 'selected' : ''}`}
                                    onClick={() => handleClassCardClick(classData.name)}
                                >
                                    <div className="class-info">
                                        <h4 className="class-name">{classData.name}</h4>
                                        <p className="class-description">
                                            {classData.description}
                                        </p>
                                    </div>
                                    <button className="class-view-btn">
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
                    setViewingClass(null);
                }}
                onSelect={() => viewingClass && handleClassSelect(viewingClass.name)}
                selectedItem={viewingClass}
                selectionType="Class"
                tabs={buildModalTabs()}
                width="950px"
                icon={viewingClass?.icon}
            />
            </div>
        </div>
    );
};

export default Step3ClassSelection;
