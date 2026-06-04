import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSkull, faCrosshairs, faMagic, faAtom, faClock, faDice, faShield,
    faMountain, faGavel, faEye, faShieldAlt, faMoon, faCross, faPaw,
    faWind, faScroll, faBiohazard, faFlask, faMusic, faSun, faFire,
    faDove, faBolt
} from '@fortawesome/free-solid-svg-icons';
import './ClassesDisplay.css';
import ClassIcon from '../common/ClassIcon';

const DAMAGE_COLORS = {
    fire: '#e74c3c',
    frost: '#3498db',
    lightning: '#f1c40f',
    arcane: '#9b59b6',
    nature: '#2ecc71',
    necrotic: '#7d3c98',
    radiant: '#f39c12',
    force: '#5dade2',
    psychic: '#e91e9c',
    poison: '#27ae60',
    chaos: '#e67e22',
    void: '#2c3e50',
    slashing: '#95a5a6',
    piercing: '#bdc3c7',
    bludgeoning: '#7f8c8d'
};

const CLASS_DATA = [
    { name: 'Arcanoneer', imageIcon: '/assets/icons/classes/arcanoneer.png', icon: faAtom, role: 'Damage / Utility', resource: 'Sphere Generation', playstyle: 'Chamber crystallized blood-shards into a heavy forearm cylinder, combining elemental spheres to fire high-recoil magic that anchors you to the earth.', roleColor: '#e67e22', damageTypes: ['arcane', 'fire', 'frost', 'lightning', 'force', 'chaos'] },
    { name: 'Berserker', imageIcon: '/assets/icons/classes/berserker.png', icon: faSkull, role: 'Damage', resource: 'Rage Points', playstyle: "Channel the Hunger Pact through your veins — the Bloodhammer Skald tradition that transforms ancestral starvation into unstoppable fury. Nordhalla's frozen Archive-forges have produced Berserkers for centuries, each one carrying the cold, grinding rage of a people who ate their dead to survive.", roleColor: '#e74c3c', damageTypes: ['slashing', 'bludgeoning'] },
    { name: 'Bladedancer', imageIcon: '/assets/icons/classes/bladedancer.png', icon: faWind, role: 'Damage', resource: 'Edge & Flourish', playstyle: 'Execute hyper-kinetic flourishes and stance-shifts in a blur of steel. You have zero base Armor, and your momentum shatters if your movement is stopped.', roleColor: '#e74c3c', damageTypes: ['slashing', 'piercing'] },
    { name: 'Chaos Weaver', imageIcon: '/assets/icons/classes/chaos_weaver.png', icon: faDice, role: 'Damage', resource: 'Mayhem Modifiers', playstyle: 'Splice temporal friction into your veins to channel erratic void mayhem, unleashing high-risk magic that can warp and damage both allies and enemies.', roleColor: '#e74c3c', damageTypes: ['force', 'necrotic', 'chaos'] },
    { name: 'Chronarch', imageIcon: '/assets/icons/classes/chronarch.png', icon: faClock, role: 'Control', resource: 'Temporal Energy', playstyle: 'Manipulate temporal energy using ancient clockwork engines, slowing foes while accelerating allies at the price of rapid skeletal decay.', roleColor: '#9b59b6', damageTypes: ['force', 'arcane'] },
    { name: 'Covenbane', imageIcon: '/assets/icons/classes/covenbane.png', icon: faCrosshairs, role: 'Anti-Magic Hunter', resource: 'Anti-Magic Seals', playstyle: 'Poison your veins with alchemical silver salts to hunt and execute kinsmen lost to the mycelial hush, wielding cold iron to nullify reality-warping corruption in Bryngloom Forest.', roleColor: '#e67e22', damageTypes: ['radiant', 'force', 'slashing'] },
    { name: 'Deathcaller', imageIcon: '/assets/icons/classes/deathcaller.png', icon: faSkull, role: 'Damage / Support', resource: 'Necrotic Ascension', playstyle: 'Drain the life force of your enemies and harvest necrotic energy, siphoning your own health pool to fuel dark, whispering ancestral rituals.', roleColor: '#e67e22', damageTypes: ['necrotic', 'psychic'] },
    { name: 'Dreadnaught', imageIcon: '/assets/icons/classes/dreadnaught.png', icon: faShield, role: 'Tank', resource: 'Dark Resilience Points', playstyle: 'Entomb yourself in the steam-powered iron plates of Cragjaw Peaks, practicing the grim Span-Bound Groven tradition that converts the agonies of battle into dark resilience.', roleColor: '#3498db', damageTypes: ['necrotic', 'poison', 'psychic'] },
    { name: 'Exorcist', imageIcon: '/assets/icons/classes/exorcist.png', icon: faCross, role: 'Summoner / Controller', resource: 'Divine Dominance', playstyle: 'Draw conceptual Wyrd-horrors directly into your own vascular system to bind them, carrying the whispering damned within your scarred blood vessels.', roleColor: '#f1c40f', damageTypes: ['radiant', 'force', 'necrotic'] },
    { name: 'False Prophet', imageIcon: '/assets/icons/classes/false_prophet.png', icon: faEye, role: 'Control', resource: 'Madness Points', playstyle: "Preach the void as divine truth with hypnotic madness. Peer into the black vacuum with blank, blind eyes, trading sanity for eldritch dominance.", roleColor: '#9b59b6', damageTypes: ['psychic', 'void', 'necrotic'] },
    { name: 'Fate Weaver', imageIcon: '/assets/icons/classes/fate_weaver.png', icon: faMagic, role: 'Support / Control', resource: 'Threads of Destiny', playstyle: 'Manipulate probability using card-based stargate cards, splitting your mind across alternate timelines where you witness every potential death.', roleColor: '#f1c40f', damageTypes: ['psychic', 'force'] },
    { name: 'Formbender', imageIcon: '/assets/icons/classes/formbender.png', icon: faPaw, role: 'Hybrid', resource: 'Wild Instinct', playstyle: 'Calcify your own skeleton under grinding pressure to expand your bone frame, adopting basalt-hard postures at the cost of continuous physical agony.', roleColor: '#2ecc71', damageTypes: ['nature', 'bludgeoning'] },
    { name: 'Gambler', imageIcon: '/assets/icons/classes/gambler.png', icon: faDice, role: 'Damage / Utility', resource: 'Fortune Points', playstyle: 'Wager your own lifeline to manipulate luck. Keep moving in constant motion on the sea; staying on land invites blood stagnation and tide-madness.', roleColor: '#e67e22', damageTypes: ['force', 'psychic'] },
    { name: 'Huntress', imageIcon: '/assets/icons/classes/huntress.png', icon: faMoon, role: 'Damage', resource: 'Quarry Marks', playstyle: 'Mark priority targets from the absolute silence of a deaf world. Read the forest\'s vibrations and strike with unerring precision from the fog.', roleColor: '#e74c3c', damageTypes: ['piercing', 'slashing'] },
    { name: 'Inscriptor', imageIcon: '/assets/icons/classes/inscriptor.png', icon: faScroll, role: 'Control / Support', resource: 'Runic Wrapping', playstyle: 'Carve mathematical solar formulas directly into your skin. Trade away your personal memories to write runic boundaries that dominate the battlefield.', roleColor: '#f1c40f', damageTypes: ['force', 'arcane'] },
    { name: 'Lichborne', imageIcon: '/assets/icons/classes/lichborne.png', icon: faSkull, role: 'Damage / Control', resource: 'Dual-Mode (Mana/HP) + Phylactery', playstyle: 'Switch between Normal Mode and Aura Mode at the cost of HP. Kill enemies to charge your Phylactery. Die and resurrect with a devastating freeze. Death is fuel.', roleColor: '#e67e22', damageTypes: ['necrotic', 'frost'] },
    { name: 'Lunarch', imageIcon: '/assets/icons/classes/lunarch.png', icon: faMoon, role: 'Support / Control', resource: 'Lunar Charge', playstyle: 'Capture the dead moon\'s light in your veins to manipulate gravity fields, cycling through lunar phases with a permanent chill in your bones.', roleColor: '#f1c40f', damageTypes: ['arcane', 'radiant'] },
    { name: 'Martyr', imageIcon: '/assets/icons/classes/martyr.png', icon: faCross, role: 'Tank / Support', resource: 'Devotion Gauge', playstyle: 'Suffer for your allies, absorbing their pain through sympathetic obsidian scars that burn with solar heat whenever blood is spilled.', roleColor: '#3498db', damageTypes: ['radiant', 'fire'] },
    { name: 'Minstrel', imageIcon: '/assets/icons/classes/minstrel.png', icon: faMusic, role: 'Support', resource: 'Harmonic Notes', playstyle: 'Calm the storm-gales with melodic lutecraft, using a voice stolen by the ocean to weave melodies that can shatter glaciers.', roleColor: '#2ecc71', damageTypes: ['psychic', 'force'] },
    { name: 'Oracle', imageIcon: '/assets/icons/classes/oracle.png', icon: faEye, role: 'Support / Control', resource: 'Prophetic Vision', playstyle: 'Peer into starlight alignments to foresee the future. You can glimpse tomorrow\'s victories but are blind to the immediate present around you.', roleColor: '#f1c40f', damageTypes: ['psychic', 'force'] },
    { name: 'Plaguebringer', imageIcon: '/assets/icons/classes/plaguebringer.png', icon: faBiohazard, role: 'Damage / Control', resource: 'Affliction Cultivation', playstyle: 'Host active rot within your waxy, pale skin. Cultivate contagious, evolving diseases to feed the decay before it devours your own organs.', roleColor: '#e67e22', damageTypes: ['poison', 'necrotic'] },
    { name: 'Primalist', imageIcon: '/assets/icons/classes/primalist.png', icon: faMountain, role: 'Support / Control', resource: 'Totemic Synergy', playstyle: 'Anchor totemic elemental fields to the steppe, slips into animalistic feral silence when the primal energy surges through your marrow.', roleColor: '#f1c40f', damageTypes: ['nature', 'lightning', 'fire'] },
    { name: 'Pyrofiend', imageIcon: '/assets/icons/classes/pyrofiend.png', icon: faFire, role: 'Damage', resource: 'Inferno Veil', playstyle: 'Swallow the demonic embers of Scathrach, the Ashen Sovereign, and become a living combustion chamber of volcanic fire, trading your sanity for uncontrollable area-of-effect destruction.', roleColor: '#e74c3c', damageTypes: ['fire'] },
    { name: 'Spellguard', imageIcon: '/assets/icons/classes/spellguard.png', icon: faShieldAlt, role: 'Tank / Anti-Mage', resource: 'Ward Layers', playstyle: 'Layer yourself in prismatic magic barriers. Absorb spell energy through scarred hands, risking volatile nerve detonations if your shield cracks.', roleColor: '#3498db', damageTypes: ['arcane', 'force'] },
    { name: 'Titan', imageIcon: '/assets/icons/classes/titan.png', icon: faSun, role: 'Tank / Control', resource: 'Strain Overload', playstyle: 'Wield colossal basalt pillars and gravity strain. Stand close to geothermal vents or volcanic heat to keep your joints from freezing solid.', roleColor: '#3498db', damageTypes: ['bludgeoning', 'radiant', 'force'] },
    { name: 'Toxicologist', imageIcon: '/assets/icons/classes/toxicologist.png', icon: faFlask, role: 'Damage / Control', resource: 'Alchemical Vials', playstyle: 'Brew vaporous chemical agents and acids, handling corrosive runoffs with trembling, scarred fingers and taste buds dulled by poison.', roleColor: '#e67e22', damageTypes: ['poison', 'necrotic'] },
    { name: 'Warden', imageIcon: '/assets/icons/classes/warden.png', icon: faGavel, role: 'Damage / Control', resource: 'Vengeance Points', playstyle: 'Secure the mountain keeps of Nordhalla, carrying a frozen soul and iron veins that shatter if you leave the high passes.', roleColor: '#e67e22', damageTypes: ['slashing', 'force', 'nature'] },
    { name: 'Witch Doctor', imageIcon: '/assets/icons/classes/witch_doctor.png', icon: faSkull, role: 'Support / Control', resource: 'Voodoo Essence', playstyle: 'Invoke the marsh loa through cursed flasks, navigating a persistent spore-hush of hallucinations and whispering voices from the bog.', roleColor: '#f1c40f', damageTypes: ['necrotic', 'nature', 'poison'] },
    { name: 'Augur', imageIcon: '/assets/icons/classes/augur.png', icon: faDove, role: 'Control / Debuffer', resource: 'Benediction & Malediction', playstyle: 'Read the signs in every die roll — even numbers fuel your Benediction, odd numbers your Malediction. Reshape the battlefield through divine omens.', roleColor: '#9b59b6', damageTypes: ['psychic', 'radiant'] },
    { name: 'Doomsayer', imageIcon: '/assets/icons/classes/doomsayer.png', icon: faBolt, role: 'Damage / Control', resource: 'Havoc & Prophecy Range', playstyle: 'Place living bomb prophecies with RNG chaos outcomes. Earn Havoc from fulfilled prophecies and detonate catastrophic doom across the battlefield.', roleColor: '#e74c3c', damageTypes: ['necrotic', 'psychic', 'fire', 'force'] }
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
                        <p>Every tradition channels power through a unique resource. A Berserker builds Rage by being struck. A Gambler bends probability with Fortune Points. A Deathcaller pays for forbidden power in blood. Understanding your resource loop is understanding your tradition.</p>
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
                    Showing {filteredClasses.length} of {CLASS_DATA.length} traditions
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
                                <span>View Tradition <i className="fas fa-arrow-right"></i></span>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredClasses.length === 0 && (
                    <div className="classes-empty">
                        <i className="fas fa-search"></i>
                        <p>No traditions match the selected filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassesDisplay;
