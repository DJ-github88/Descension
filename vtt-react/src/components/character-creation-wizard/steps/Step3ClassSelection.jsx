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
import ClassIcon from '../../common/ClassIcon';



const Step3ClassSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const [selectedClass, setSelectedClass] = useState(state.characterData.class);
    
    const [showModal, setShowModal] = useState(false);
    const [viewingClass, setViewingClass] = useState(null);

    const { validationErrors } = state;

        const characterClasses = [
        { name: 'Arcanoneer', imageIcon: '/assets/icons/classes/arcanoneer.png', icon: 'fas fa-atom', description: 'Siphons crystallized blood-shards through a forearm graft to cast contract-bound magic, taking heavy recoil and freezing locks.', theme: 'elemental' },
        { name: 'Berserker', imageIcon: '/assets/icons/classes/berserker.png', icon: 'fas fa-skull', description: 'Nordhalla tradition carrying the Hunger Pact. Channels ancestral starvation into unstoppable battle fury.', theme: 'rage' },
        { name: 'Bladedancer', imageIcon: '/assets/icons/classes/bladedancer.png', icon: 'fas fa-wind', description: 'High-speed kinetic striker with stance-shifting combos, trading base armor for unmitigated speed.', theme: 'finesse' },
        { name: 'Chaos Weaver', imageIcon: '/assets/icons/classes/chaos_weaver.png', icon: 'fas fa-dice', description: 'Unstable void channeler who risks molecular dissolution and friendly-fire feedback for apocalyptic burst damage.', theme: 'chaos' },
        { name: 'Chronarch', imageIcon: '/assets/icons/classes/chronarch.png', icon: 'fas fa-clock', description: 'Fexric clockwork time-bender who decays her own skeleton to wind and rewrite timelines.', theme: 'time' },
        { name: 'Covenbane', imageIcon: '/assets/icons/classes/covenbane.png', icon: 'fas fa-crosshairs', description: 'Anti-magic hunter from Bryngloom Forest. Mutilates their own flesh with alchemical silver salts to hunt the lost.', theme: 'anti-magic' },
        { name: 'Deathcaller', imageIcon: '/assets/icons/classes/deathcaller.png', icon: 'fas fa-skull', description: 'Necrotic channeler siphoning her own life force to keep thirty generations of screaming ancestors burning.', theme: 'necromancy' },
        { name: 'Dreadnaught', imageIcon: '/assets/icons/classes/dreadnaught.png', icon: 'fas fa-shield', description: 'Span-Bound Groven tradition from Cragjaw Peaks. Encased in a steam-powered iron tomb to build dark resilience.', theme: 'fortress' },
        { name: 'Exorcist', imageIcon: '/assets/icons/classes/exorcist.png', icon: 'fas fa-cross', description: 'Zealot prison-vessel who binds thrashing conceptual spirits within his own scarred veins.', theme: 'holy' },
        { name: 'False Prophet', imageIcon: '/assets/icons/classes/false_prophet.png', icon: 'fas fa-eye', description: 'Blind void preacher who channels reality-corrupting madness at the cost of his own sanity.', theme: 'madness' },
        { name: 'Fate Weaver', imageIcon: '/assets/icons/classes/fate_weaver.png', icon: 'fas fa-magic', description: 'Destiny manipulator whose mind is fractured across timelines from experiencing alternate deaths.', theme: 'fate' },
        { name: 'Formbender', imageIcon: '/assets/icons/classes/formbender.png', icon: 'fas fa-paw', description: 'Groven shapeshifter who calcifies his own skeleton into heavy stone plates, carrying permanent joint pain.', theme: 'primal' },
        { name: 'Gambler', imageIcon: '/assets/icons/classes/gambler.png', icon: 'fas fa-dice', description: 'Merryn storm-rider whose heartbeat is synchronized with the tides, gambling life to rewrite luck.', theme: 'luck' },
        { name: 'Huntress', imageIcon: '/assets/icons/classes/huntress.png', icon: 'fas fa-moon', description: 'Deaf predator who tracks targets through sub-vocal vibrations, striking from absolute silence.', theme: 'hunter' },
        { name: 'Inscriptor', imageIcon: '/assets/icons/classes/inscriptor.png', icon: 'fas fa-scroll', description: 'Runic controller who forgets his own past to carve ancient preservation formulas into his flesh.', theme: 'runes' },
        { name: 'Lichborne', imageIcon: '/assets/icons/classes/lichborne.png', icon: 'fas fa-skull', description: 'Dual-mode frost caster who burns HP for devastating power, kills to charge Phylactery, and resurrects with a death freeze.', theme: 'undead' },
        { name: 'Lunarch', imageIcon: '/assets/icons/classes/lunarch.png', icon: 'fas fa-moon', description: 'Thorn-born lunar channeler carrying a permanent chill in her bones, cycling power with the moon.', theme: 'lunar' },
        { name: 'Martyr', imageIcon: '/assets/icons/classes/martyr.png', icon: 'fas fa-plus', description: 'Shield of flesh who bears sympathetic obsidian scars, converting personal suffering into solar light.', theme: 'sacrifice' },
        { name: 'Minstrel', imageIcon: '/assets/icons/classes/minstrel.png', icon: 'fas fa-music', description: 'Merryn sailor whose spoken voice was stolen by the sea, casting spells through melodic whispers.', theme: 'music' },
        { name: 'Oracle', imageIcon: '/assets/icons/classes/oracle.png', icon: 'fas fa-eye', description: 'Astril star-watcher who sees future timelines but remains blind to the immediate physical present.', theme: 'divination' },
        { name: 'Plaguebringer', imageIcon: '/assets/icons/classes/plaguebringer.png', icon: 'fas fa-skull', description: 'Visceral plague cultivator who hosts active rot, spreading pestilence to preserve her own life.', theme: 'disease' },
        { name: 'Primalist', imageIcon: '/assets/icons/classes/primalist.png', icon: 'fas fa-tree', description: 'Steppe ranger who channels totemic synergy, periodically losing language to feral silence.', theme: 'nature' },
        { name: 'Pyrofiend', imageIcon: '/assets/icons/classes/pyrofiend.png', icon: 'fas fa-fire', description: 'Conduit of Scathrach from Sundale. Succumbs to demonic corruption for devastating fire area-of-effect.', theme: 'fire' },
        { name: 'Spellguard', imageIcon: '/assets/icons/classes/spellguard.png', icon: 'fas fa-shield-alt', description: 'Shield-master carrying scarred hands and volatile veins, absorbing spells to charge energy barriers.', theme: 'protection' },
        { name: 'Titan', imageIcon: '/assets/icons/classes/titan.png', icon: 'fas fa-mountain', description: 'Colossal warden with basalt-cracking skin, requiring geothermal heat to prevent freezing solid.', theme: 'gravity' },
        { name: 'Toxicologist', imageIcon: '/assets/icons/classes/toxicologist.png', icon: 'fas fa-flask', description: 'Alchemist with trembling, acid-stained hands, brewing toxic vapors and corrosive venoms.', theme: 'alchemy' },
        { name: 'Warden', imageIcon: '/assets/icons/classes/warden.png', icon: 'fas fa-shield', description: 'Keep-defender carrying a frozen soul, bound to the high passes under penalty of blood-shattering.', theme: 'guardian' },
        { name: 'Witch Doctor', imageIcon: '/assets/icons/classes/witch_doctor.png', icon: 'fas fa-skull', description: 'Loa summoner from the peat bogs, living in a permanent spore-hush of spiritual whispers.', theme: 'voodoo' },
        { name: 'Augur', imageIcon: '/assets/icons/classes/augur.png', icon: 'fas fa-dove', description: 'Omen reader who interprets signs from every die roll to reshape the battlefield.', theme: 'omen' },
        { name: 'Doomsayer', imageIcon: '/assets/icons/classes/doomsayer.png', icon: 'fas fa-bolt', description: 'Prophet of catastrophe who places living bomb prophecies with RNG chaos outcomes.', theme: 'doom' }
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
                    <ClassIcon src="/assets/icons/classes/arcanoneer.png" alt="Calling" size="small" className="wizard-header-pixel-icon" dataClass="Arcanoneer" />
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
                                            <ClassIcon src={classData.imageIcon} alt={classData.name} size="medium" className="class-pixel-icon" dataClass={classData.name} />
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
