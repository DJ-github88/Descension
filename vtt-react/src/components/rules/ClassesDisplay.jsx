import React, { useState, useMemo } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {

    faSkull, faCrosshairs, faMagic, faAtom, faClock, faDice, faShield,

    faMountain, faGavel, faEye, faShieldAlt, faMoon, faCross, faYinYang,

    faWind, faScroll, faBiohazard, faFlask, faMusic, faSun, faFire,

    faDove, faBolt, faHourglassHalf

} from '@fortawesome/free-solid-svg-icons';

import './ClassesDisplay.css';

import ClassIcon from '../common/ClassIcon';



const DAMAGE_COLORS = {

    physical: '#6B4226',

    ember: '#D4380D',

    rime: '#2C5F7C',

    storm: '#8B7328',

    arcane: '#5B3A8C',

    primal: '#2D5A1E',

    blight: '#3D1F4E',

    wyrd: '#7A2040',

    healing: '#2E8B57'

};



const CLASS_DATA = [

    { name: 'Arcanoneer', imageIcon: '/assets/icons/classes/arcanoneer.png', icon: faAtom, role: 'Damage / Utility', resource: 'Sphere Generation', playstyle: 'Chamber crystallized blood-shards into a heavy forearm cylinder, combining elemental spheres to fire high-recoil magic that anchors you to the earth.', roleColor: '#e67e22', damageTypes: ['arcane', 'ember', 'rime', 'storm', 'wyrd'] },

    { name: 'Berserker', imageIcon: '/assets/icons/classes/berserker.png', icon: faSkull, role: 'Damage', resource: 'Rage Points', playstyle: "Channel the Hunger Pact through your veins — the Bloodhammer Skald tradition that transforms ancestral starvation into unstoppable fury. Nordhalla's frozen Archive-forges have produced Berserkers for centuries, each one carrying the cold, grinding rage of a people who ate their dead to survive.", roleColor: '#e74c3c', damageTypes: ['physical'] },

    { name: 'Shaper', imageIcon: '/assets/icons/classes/shaper.png', icon: faYinYang, role: 'Hybrid (Damage/Mobility/Adaptation)', resource: 'Edge & Flourish', playstyle: 'The Body Is the Weapon', roleColor: '#e74c3c', damageTypes: ['physical'] },

    { name: 'Harbinger', imageIcon: '/assets/icons/classes/harbinger.png', icon: faHourglassHalf, role: 'Damage / Control', resource: 'Mayhem & Prophecy Range', playstyle: 'Channel entropic friction and prophetic doom into living bomb prophecies, amplifying chaos with a Mayhem pressure gauge that can trigger catastrophic Wild Surges.', roleColor: '#9b59b6', damageTypes: ['storm', 'blight', 'wyrd', 'ember'] },

    { name: 'Chronarch', imageIcon: '/assets/icons/classes/chronarch.png', icon: faClock, role: 'Control', resource: 'Temporal Energy', playstyle: 'Manipulate temporal energy using ancient clockwork engines, slowing foes while accelerating allies at the price of rapid skeletal decay.', roleColor: '#9b59b6', damageTypes: ['storm', 'arcane'] },

    { name: 'Inquisitor', imageIcon: '/assets/icons/classes/inquisitor.png', icon: faGavel, role: 'Occult Arbiter / Demon Handler', resource: 'Righteous Authority', playstyle: 'Wielding cold iron and bound demons to nullify reality-warping corruption and execute the supernatural.', roleColor: '#8B0000', damageTypes: ['ember', 'storm', 'blight'] },

    // 'Deathcaller' and 'Lichborne' merged into Revenant as Phase 1.10 consolidation
    { name: 'Revenant', imageIcon: '/assets/icons/classes/revenant.png', icon: faSkull, role: 'Damage / Control', resource: 'Necrotic Ascension & Phylactery', playstyle: 'Combine volatile blood magic with methodical frost harvesting. Drain life, store souls in a phylactery, and resurrect with devastating necrotic power.', roleColor: '#e67e22', damageTypes: ['blight', 'rime', 'wyrd'] },

    // 'Dreadnaught' removed (absorbed into Martyr as Ironclad specialization)



    { name: 'False Prophet', imageIcon: '/assets/icons/classes/false_prophet.png', icon: faEye, role: 'Control', resource: 'Madness Points', playstyle: "Preach the void as divine truth with hypnotic madness. Peer into the black vacuum with blank, blind eyes, trading sanity for eldritch dominance.", roleColor: '#9b59b6', damageTypes: ['wyrd', 'blight'] },

    { name: 'Gambit', imageIcon: '/assets/icons/classes/gambit.png', icon: faMagic, role: 'Support / Control', resource: 'Threads of Destiny', playstyle: 'Manipulate probability using card-based stargate cards, splitting your mind across alternate timelines where you witness every potential death.', roleColor: '#f1c40f', damageTypes: ['wyrd', 'storm'] },

    { name: 'Apex', imageIcon: '/assets/icons/classes/apex.png', icon: faMoon, role: 'Damage', resource: 'Quarry Marks', playstyle: 'Mark priority targets from the absolute silence of a deaf world. Read the forest\'s vibrations and strike with unerring precision from the fog.', roleColor: '#e74c3c', damageTypes: ['physical'] },

    { name: 'Animist', imageIcon: '/assets/icons/classes/animist.png', icon: faWind, role: 'Support / Control', resource: 'Ancestral Resonance', playstyle: 'Channel the spirits of ancestral lineages to build resonance. Open channels between the living world and the spirit courts, binding ancient power through ritual obligation and deep respect for the dead.', roleColor: '#2ecc71', damageTypes: ['primal', 'blight', 'storm'] },

    // REMOVED: 'Lichborne' merged into Revenant as Phase 1.10 consolidation

    { name: 'Lunarch', imageIcon: '/assets/icons/classes/lunarch.png', icon: faMoon, role: 'Support / Control', resource: 'Lunar Charge', playstyle: 'Capture the dead moon\'s light in your veins to manipulate gravity fields, cycling through lunar phases with a permanent chill in your bones.', roleColor: '#f1c40f', damageTypes: ['arcane', 'ember'] },

    { name: 'Martyr', imageIcon: '/assets/icons/classes/martyr.png', icon: faCross, role: 'Tank / Support', resource: 'Devotion Gauge', playstyle: 'Suffer for your allies, absorbing their pain through sympathetic obsidian scars that burn with solar heat whenever blood is spilled.', roleColor: '#3498db', damageTypes: ['ember'] },

    { name: 'Minstrel', imageIcon: '/assets/icons/classes/minstrel.png', icon: faMusic, role: 'Support', resource: 'Harmonic Notes', playstyle: 'Calm the storm-gales with melodic lutecraft, using a voice stolen by the ocean to weave melodies that can shatter glaciers.', roleColor: '#2ecc71', damageTypes: ['wyrd', 'storm'] },

    // Oracle card removed (absorbed into Augur as Seer specialization)

    { name: 'Plaguebringer', imageIcon: '/assets/icons/classes/plaguebringer.png', icon: faBiohazard, role: 'Damage / Control', resource: 'Affliction Cultivation', playstyle: 'Host active rot within your waxy, pale skin. Cultivate contagious, evolving diseases to feed the decay before it devours your own organs.', roleColor: '#e67e22', damageTypes: ['blight'] },

    { name: 'Pyrofiend', imageIcon: '/assets/icons/classes/pyrofiend.png', icon: faFire, role: 'Damage', resource: 'Inferno Veil', playstyle: 'Swallow the demonic embers of Scathrach, the Ashen Sovereign, and become a living combustion chamber of volcanic fire, trading your sanity for uncontrollable area-of-effect destruction.', roleColor: '#e74c3c', damageTypes: ['ember'] },

    { name: 'Spellguard', imageIcon: '/assets/icons/classes/spellguard.png', icon: faShieldAlt, role: 'Tank / Anti-Mage', resource: 'Ward Layers', playstyle: 'Layer yourself in prismatic magic barriers. Absorb spell energy through scarred hands, risking volatile nerve detonations if your shield cracks.', roleColor: '#3498db', damageTypes: ['arcane', 'storm'] },

    // 'Titan' removed (absorbed into Warden as Monolith specialization)

    { name: 'Toxicologist', imageIcon: '/assets/icons/classes/toxicologist.png', icon: faFlask, role: 'Damage / Control', resource: 'Alchemical Vials', playstyle: 'Brew vaporous chemical agents and acids, handling corrosive runoffs with trembling, scarred fingers and taste buds dulled by poison.', roleColor: '#e67e22', damageTypes: ['blight'] },

    { name: 'Warden', imageIcon: '/assets/icons/classes/warden.png', icon: faGavel, role: 'Damage / Control', resource: 'Vengeance Points', playstyle: 'Drive rusted iron chains through your own forearms to tether abominations. Build Vengeance Points through suffering and spend them to cage, drag, and execute your prey.', roleColor: '#e67e22', damageTypes: ['physical', 'storm', 'primal'] },

    { name: 'Augur', imageIcon: '/assets/icons/classes/augur.png', icon: faDove, role: 'Control / Debuffer', resource: 'Benediction & Malediction', playstyle: 'Read the signs in every die roll — even numbers fuel your Benediction, odd numbers your Malediction. Reshape the battlefield through divine omens.', roleColor: '#9b59b6', damageTypes: ['wyrd', 'ember'] }

];



const ROLE_FILTERS = [

    { key: 'all', label: 'All', icon: 'fas fa-th' },

    { key: 'tank', label: 'Tank', icon: 'fas fa-shield-alt' },

    { key: 'damage', label: 'Damage', icon: 'fas fa-crosshairs' },

    { key: 'support', label: 'Support', icon: 'fas fa-heart' },

    { key: 'control', label: 'Control', icon: 'fas fa-brain' },

    { key: 'hybrid', label: 'Hybrid', icon: 'fas fa-sync-alt' }

];



const ALL_DAMAGE_TYPES = (() => {

    const typeSet = new Set();

    CLASS_DATA.forEach(c => c.damageTypes.forEach(t => typeSet.add(t)));

    return [...typeSet].sort();

})();



const getFilterKey = (role) => {

    const r = role.toLowerCase();

    if (r.includes('tank') && r.includes('damage') && r.includes('support')) return 'hybrid';

    if (r.includes('tank')) return 'tank';

    if (r.startsWith('damage')) return 'damage';

    if (r.startsWith('support')) return 'support';

    if (r.startsWith('control')) return 'control';

    return 'hybrid';

};



const ClassesDisplay = ({ onSelectClass }) => {

    const [activeFilter, setActiveFilter] = useState('all');

    const [activeDamageType, setActiveDamageType] = useState(null);



    const filteredClasses = useMemo(() => {

        let result = CLASS_DATA;

        if (activeFilter !== 'all') {

            result = result.filter(c => getFilterKey(c.role) === activeFilter);

        }

        if (activeDamageType) {

            result = result.filter(c => c.damageTypes.includes(activeDamageType));

        }

        return result;

    }, [activeFilter, activeDamageType]);



    return (

        <div className="classes-display">

            <div className="classes-intro">

                <div className="classes-intro-header">

                    <div className="classes-intro-title">

                        <h2>Classes</h2>

                        <p className="classes-intro-subtitle">Choose the path that calls to your character's soul</p>

                    </div>

                </div>

                <div className="classes-intro-columns">

                    <div className="classes-intro-col">

                        <h4><i className="fas fa-swords"></i> Class System</h4>

                        <p>Your Class is your identity on the battlefield — governing hit points, weapon proficiencies, armour capabilities, and the unique resource that fuels your most devastating abilities. With 30 distinct classes, no two adventurers fight the same way.</p>

                    </div>

                    <div className="classes-intro-col">

                        <h4><i className="fas fa-bolt"></i> Resource Systems</h4>

                        <p>Every class channels power through a unique resource. A Berserker builds Rage by being struck. A Gambler bends probability with Fortune Points. A Deathcaller pays for forbidden power in blood. Understanding your resource loop is understanding your class.</p>

                    </div>

                </div>

            </div>



            <div className="classes-filters-section">

                <div className="classes-role-filters">

                    {ROLE_FILTERS.map(filter => (

                        <button

                            key={filter.key}

                            className={`role-filter-btn ${activeFilter === filter.key ? 'active' : ''}`}

                            onClick={() => setActiveFilter(filter.key)}

                        >

                            <i className={filter.icon}></i>

                            <span>{filter.label}</span>

                            <span className="role-filter-count">

                                {filter.key === 'all'

                                    ? CLASS_DATA.length

                                    : CLASS_DATA.filter(c => getFilterKey(c.role) === filter.key).length

                                }

                            </span>

                        </button>

                    ))}

                </div>



                <div className="classes-damage-filters">

                    <span className="damage-filter-label"><i className="fas fa-fire-alt"></i> Damage:</span>

                    <button

                        className={`damage-type-btn ${!activeDamageType ? 'active' : ''}`}

                        onClick={() => setActiveDamageType(null)}

                    >

                        All

                    </button>

                    {ALL_DAMAGE_TYPES.map(type => (

                        <button

                            key={type}

                            className={`damage-type-btn ${activeDamageType === type ? 'active' : ''}`}

                            style={{ '--dmg-color': DAMAGE_COLORS[type] || '#888' }}

                            onClick={() => setActiveDamageType(activeDamageType === type ? null : type)}

                        >

                            <span className="dmg-dot" />

                            {type.charAt(0).toUpperCase() + type.slice(1)}

                        </button>

                    ))}

                </div>



                <div className="classes-filter-info">

                    Showing {filteredClasses.length} of {CLASS_DATA.length} classes

                </div>

            </div>



            <div className="classes-list">

                {filteredClasses.map(cls => (

                    <div

                        key={cls.name}

                        className="class-row"

                        style={{ '--role-color': cls.roleColor }}

                        onClick={() => onSelectClass(cls.name)}

                    >

                        <div className="class-row-icon">

                            {cls.imageIcon ? (

                                <ClassIcon src={cls.imageIcon} alt={cls.name} size="medium" className="class-row-img" dataClass={cls.name} />

                            ) : (

                                <FontAwesomeIcon icon={cls.icon} />

                            )}

                        </div>



                        <div className="class-row-body">

                            <div className="class-row-header">

                                <span className="class-row-name">{cls.name}</span>

                                <span className="class-row-role-badge" style={{ background: cls.roleColor }}>{cls.role}</span>

                            </div>

                            <div className="class-row-resource">

                                <i className="fas fa-bolt"></i> {cls.resource}

                            </div>

                            <div className="class-row-playstyle">{cls.playstyle}</div>

                        </div>



                        <div className="class-row-meta">

                            <div className="class-row-dmg-types">

                                {cls.damageTypes.map(dt => (

                                    <span

                                        key={dt}

                                        className="class-row-dmg-tag"

                                        style={{ background: DAMAGE_COLORS[dt] || '#888' }}

                                        title={dt.charAt(0).toUpperCase() + dt.slice(1)}

                                    >

                                        {dt.charAt(0).toUpperCase() + dt.slice(1)}

                                    </span>

                                ))}

                            </div>

                            <div className="class-row-cta">

                                <span>View Class <i className="fas fa-arrow-right"></i></span>

                            </div>

                        </div>

                    </div>

                ))}



                {filteredClasses.length === 0 && (

                    <div className="classes-empty">

                        <i className="fas fa-search"></i>

                        <p>No classes match the selected filters.</p>

                    </div>

                )}

            </div>

        </div>

    );

};



export default ClassesDisplay;
