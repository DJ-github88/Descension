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
        { name: 'Arcanoneer', imageIcon: '/assets/icons/classes/arcanoneer.png', icon: 'fas fa-atom', description: 'Master of elemental sphere combination with dynamic spell crafting', theme: 'elemental' },
        { name: 'Berserker', imageIcon: '/assets/icons/classes/berserker.png', icon: 'fas fa-skull', description: 'Fury warrior with momentum-based combat', theme: 'rage' },
        { name: 'Bladedancer', imageIcon: '/assets/icons/classes/bladedancer.png', icon: 'fas fa-wind', description: 'Finesse fighter with elegant combat techniques', theme: 'finesse' },
        { name: 'Chaos Weaver', imageIcon: '/assets/icons/classes/chaos_weaver.png', icon: 'fas fa-dice', description: 'Master of unpredictability with highest damage potential', theme: 'chaos' },
        { name: 'Chronarch', imageIcon: '/assets/icons/classes/chronarch.png', icon: 'fas fa-clock', description: 'Time manipulator building temporal energy', theme: 'time' },
        { name: 'Covenbane', imageIcon: '/assets/icons/classes/covenbane.png', icon: 'fas fa-crosshairs', description: 'Witch hunter with magic-disrupting abilities', theme: 'anti-magic' },
        { name: 'Deathcaller', imageIcon: '/assets/icons/classes/deathcaller.png', icon: 'fas fa-skull', description: 'Blood mage sacrificing health for forbidden power', theme: 'necromancy' },
        { name: 'Dreadnaught', imageIcon: '/assets/icons/classes/dreadnaught.png', icon: 'fas fa-shield', description: 'Dark tank who converts damage taken into power', theme: 'fortress' },
        { name: 'Exorcist', imageIcon: '/assets/icons/classes/exorcist.png', icon: 'fas fa-cross', description: 'Divine agent binding demons through sacred ritual', theme: 'holy' },
        { name: 'False Prophet', imageIcon: '/assets/icons/classes/false_prophet.png', icon: 'fas fa-eye', description: 'Void preacher channeling madness as divine revelation', theme: 'madness' },
        { name: 'Fate Weaver', imageIcon: '/assets/icons/classes/fate_weaver.png', icon: 'fas fa-magic', description: 'Card-based destiny manipulator turning failures into power', theme: 'fate' },
        { name: 'Formbender', imageIcon: '/assets/icons/classes/formbender.png', icon: 'fas fa-paw', description: 'Shapeshifter mastering four primal forms with adaptive combat', theme: 'primal' },
        { name: 'Gambler', imageIcon: '/assets/icons/classes/gambler.png', icon: 'fas fa-dice', description: 'Daring risk-taker manipulating luck and probability', theme: 'luck' },
        { name: 'Huntress', imageIcon: '/assets/icons/classes/huntress.png', icon: 'fas fa-moon', description: 'Tracker with precision targeting and pursuit', theme: 'hunter' },
        { name: 'Inscriptor', imageIcon: '/assets/icons/classes/inscriptor.png', icon: 'fas fa-scroll', description: 'Tactical battlefield controller using runes and inscriptions', theme: 'runes' },
        { name: 'Lichborne', imageIcon: '/assets/icons/classes/lichborne.png', icon: 'fas fa-skull', description: 'Dual-mode frost caster who burns HP for devastating power, kills to charge Phylactery, and resurrects with a death freeze', theme: 'undead' },
        { name: 'Lunarch', imageIcon: '/assets/icons/classes/lunarch.png', icon: 'fas fa-moon', description: 'Lunar mage with phase-based energy cycles', theme: 'lunar' },
        { name: 'Martyr', imageIcon: '/assets/icons/classes/martyr.png', icon: 'fas fa-plus', description: 'Self-sacrificing warrior earning power through suffering', theme: 'sacrifice' },
        { name: 'Minstrel', imageIcon: '/assets/icons/classes/minstrel.png', icon: 'fas fa-music', description: 'Musical spellcaster combining notes into powerful chords', theme: 'music' },
        { name: 'Oracle', imageIcon: '/assets/icons/classes/oracle.png', icon: 'fas fa-eye', description: 'Seer with prophetic visions and fate manipulation', theme: 'divination' },
        { name: 'Plaguebringer', imageIcon: '/assets/icons/classes/plaguebringer.png', icon: 'fas fa-skull', description: 'Disease spreader with contagious plague stacks', theme: 'disease' },
        { name: 'Primalist', imageIcon: '/assets/icons/classes/primalist.png', icon: 'fas fa-tree', description: 'Totem master resonating with elemental forces', theme: 'nature' },
        { name: 'Pyrofiend', imageIcon: '/assets/icons/classes/pyrofiend.png', icon: 'fas fa-fire', description: 'Demonic fire wielder with ascending corruption stages', theme: 'fire' },
        { name: 'Spellguard', imageIcon: '/assets/icons/classes/spellguard.png', icon: 'fas fa-shield-alt', description: 'Protective mage with magical ward layers', theme: 'protection' },
        { name: 'Titan', imageIcon: '/assets/icons/classes/titan.png', icon: 'fas fa-mountain', description: 'Gravity manipulator with strain overload', theme: 'gravity' },
        { name: 'Toxicologist', imageIcon: '/assets/icons/classes/toxicologist.png', icon: 'fas fa-flask', description: 'Poison crafter with alchemical vials', theme: 'alchemy' },
        { name: 'Warden', imageIcon: '/assets/icons/classes/warden.png', icon: 'fas fa-shield', description: 'Barrier guardian with protective bulwarks', theme: 'guardian' },
        { name: 'Witch Doctor', imageIcon: '/assets/icons/classes/witch_doctor.png', icon: 'fas fa-skull', description: 'Voodoo practitioner invoking powerful loa through curses and rituals', theme: 'voodoo' },
        { name: 'Augur', imageIcon: '/assets/icons/classes/augur.png', icon: 'fas fa-dove', description: 'Omen reader who interprets signs from every die roll to reshape the battlefield', theme: 'omen' },
        { name: 'Doomsayer', imageIcon: '/assets/icons/classes/doomsayer.png', icon: 'fas fa-bolt', description: 'Prophet of catastrophe who places living bomb prophecies with RNG chaos outcomes', theme: 'doom' }
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
                    <img src="/assets/icons/classes/arcanoneer.png" alt="Calling" className="wizard-header-pixel-icon" data-class="Arcanoneer" />
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
                                    <div className="class-card-icon-container">
                                        {classData.imageIcon ? (
                                            <img src={classData.imageIcon} alt={classData.name} className="class-pixel-icon" data-class={classData.name} />
                                        ) : (
                                            <i className={classData.icon}></i>
                                        )}
                                    </div>
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
                imageIcon={viewingClass?.imageIcon}
            />
            </div>
        </div>
    );
};

export default Step3ClassSelection;
