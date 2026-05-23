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
    { name: 'Arcanoneer', imageIcon: '/assets/icons/classes/arcanoneer.png', icon: faAtom, role: 'Damage / Utility', resource: 'Sphere Generation', playstyle: 'Master the art of Sphere-weaving, combining raw elemental essences into volatile spells that reshape the battlefield with every cast', roleColor: '#e67e22', damageTypes: ['arcane', 'fire', 'frost', 'lightning', 'force', 'chaos'] },
    { name: 'Berserker', imageIcon: '/assets/icons/classes/berserker.png', icon: faSkull, role: 'Damage', resource: 'Rage Points', playstyle: 'Let the rage consume you. Build unstoppable momentum and unleash devastating blows that grow more terrifying with every drop of blood spilled', roleColor: '#e74c3c', damageTypes: ['slashing', 'bludgeoning'] },
    { name: 'Bladedancer', imageIcon: '/assets/icons/classes/bladedancer.png', icon: faWind, role: 'Damage', resource: 'Edge & Flourish', playstyle: 'Transform combat into a lethal performance. Execute graceful flourishes and precise strikes, dancing through the fray as a blur of steel and speed', roleColor: '#e74c3c', damageTypes: ['slashing', 'piercing'] },
    { name: 'Chaos Weaver', imageIcon: '/assets/icons/classes/chaos_weaver.png', icon: faDice, role: 'Damage', resource: 'Mayhem Modifiers', playstyle: 'Embrace the beautiful madness. Channel the unpredictable forces of the void to unleash catastrophic damage that keeps both enemies and allies on edge', roleColor: '#e74c3c', damageTypes: ['force', 'necrotic', 'chaos'] },
    { name: 'Chronarch', imageIcon: '/assets/icons/classes/chronarch.png', icon: faClock, role: 'Control', resource: 'Temporal Energy', playstyle: 'Bend time to your will. Slow your foes to a crawl while accelerating your own strikes, manipulating the temporal flow to ensure victory is inevitable', roleColor: '#9b59b6', damageTypes: ['force', 'arcane'] },
    { name: 'Covenbane', imageIcon: '/assets/icons/classes/covenbane.png', icon: faCrosshairs, role: 'Damage / Support', resource: 'Anti-Magic Seals', playstyle: 'A relentless sentinel against the profane. Silence spellcasters with anti-magic seals and strike down those who dare to meddle with forbidden arts', roleColor: '#e67e22', damageTypes: ['radiant', 'force', 'slashing'] },
    { name: 'Deathcaller', imageIcon: '/assets/icons/classes/deathcaller.png', icon: faSkull, role: 'Damage / Support', resource: 'Necrotic Ascension', playstyle: 'Walk the thin line between life and oblivion. Sacrifice your own life force to fuel dark, necrotic rituals that drain the soul from anything in your path', roleColor: '#e67e22', damageTypes: ['necrotic', 'psychic'] },
    { name: 'Dreadnaught', imageIcon: '/assets/icons/classes/dreadnaught.png', icon: faShield, role: 'Tank', resource: 'Dark Resilience Points', playstyle: 'Convert pain into power. Every hit you take fuels your Dark Resilience — spend it on shields, strikes, or save it to cheat death', roleColor: '#3498db', damageTypes: ['necrotic', 'poison', 'psychic'] },
    { name: 'Exorcist', imageIcon: '/assets/icons/classes/exorcist.png', icon: faCross, role: 'Summoner / Controller', resource: 'Divine Dominance', playstyle: "Walk the razor's edge between holiness and heresy. Bind demons through sacred ritual and command them with divine authority", roleColor: '#f1c40f', damageTypes: ['radiant', 'force', 'necrotic'] },
    { name: 'False Prophet', imageIcon: '/assets/icons/classes/false_prophet.png', icon: faEye, role: 'Control', resource: 'Madness Points', playstyle: "Preach the void as divine truth. Channel eldritch madness to shatter minds and corrupt the faithful, dancing on the razor's edge between godlike power and insanity", roleColor: '#9b59b6', damageTypes: ['psychic', 'void', 'necrotic'] },
    { name: 'Fate Weaver', imageIcon: '/assets/icons/classes/fate_weaver.png', icon: faMagic, role: 'Support / Control', resource: 'Threads of Destiny', playstyle: 'Pluck the threads of destiny. Use card-based divination to turn failure into triumph, rewriting the future as easily as dealing a hand of cards', roleColor: '#f1c40f', damageTypes: ['psychic', 'force'] },
    { name: 'Formbender', imageIcon: '/assets/icons/classes/formbender.png', icon: faPaw, role: 'Hybrid', resource: 'Wild Instinct', playstyle: 'Embrace your primal nature. Seamlessly shift between beast forms to adapt to any threat, mastering the raw power of the wild in its purest form', roleColor: '#2ecc71', damageTypes: ['nature', 'bludgeoning'] },
    { name: 'Gambler', imageIcon: '/assets/icons/classes/gambler.png', icon: faDice, role: 'Damage / Utility', resource: 'Fortune Points', playstyle: 'Risk everything for total glory. Manipulate luck and probability to turn the tides of battle, where the higher the stakes, the greater the reward', roleColor: '#e67e22', damageTypes: ['force', 'psychic'] },
    { name: 'Huntress', imageIcon: '/assets/icons/classes/huntress.png', icon: faMoon, role: 'Damage', resource: 'Quarry Marks', playstyle: 'The ultimate predator. Mark your quarry from the shadows and strike with unerring precision — once marked, they cannot escape', roleColor: '#e74c3c', damageTypes: ['piercing', 'slashing'] },
    { name: 'Inscriptor', imageIcon: '/assets/icons/classes/inscriptor.png', icon: faScroll, role: 'Control / Support', resource: 'Runic Wrapping', playstyle: 'The battlefield is your canvas. Write the rules of engagement with ancient runic inscriptions that trap, weaken, and dominate your foes', roleColor: '#f1c40f', damageTypes: ['force', 'arcane'] },
    { name: 'Lichborne', imageIcon: '/assets/icons/classes/lichborne.png', icon: faSkull, role: 'Damage / Control', resource: 'Dual-Mode (Mana/HP) + Phylactery', playstyle: 'Switch between Normal Mode and Aura Mode at the cost of HP. Kill enemies to charge your Phylactery. Die and resurrect with a devastating freeze. Death is fuel.', roleColor: '#e67e22', damageTypes: ['necrotic', 'frost'] },
    { name: 'Lunarch', imageIcon: '/assets/icons/classes/lunarch.png', icon: faMoon, role: 'Support / Control', resource: 'Lunar Charge', playstyle: 'Harness the phases of the moon. Cycle through lunar energies to adapt your power, shifting between radiant clarity and shadowed mystery', roleColor: '#f1c40f', damageTypes: ['arcane', 'radiant'] },
    { name: 'Martyr', imageIcon: '/assets/icons/classes/martyr.png', icon: faCross, role: 'Tank / Support', resource: 'Devotion Gauge', playstyle: 'Find power in suffering. Absorb damage meant for your allies and transform that pain into a righteous fury that burns hotter than any sun', roleColor: '#3498db', damageTypes: ['radiant', 'fire'] },
    { name: 'Minstrel', imageIcon: '/assets/icons/classes/minstrel.png', icon: faMusic, role: 'Support', resource: 'Harmonic Notes', playstyle: 'A symphony of destruction and grace. Combine harmonic notes into powerful magical melodies that inspire allies and shatter the resolve of your enemies', roleColor: '#2ecc71', damageTypes: ['psychic', 'force'] },
    { name: 'Oracle', imageIcon: '/assets/icons/classes/oracle.png', icon: faEye, role: 'Support / Control', resource: 'Prophetic Vision', playstyle: 'Peer through the veil of time. Foresee the movements of your enemies and manipulate the flow of battle with prophetic visions', roleColor: '#f1c40f', damageTypes: ['psychic', 'force'] },
    { name: 'Plaguebringer', imageIcon: '/assets/icons/classes/plaguebringer.png', icon: faBiohazard, role: 'Damage / Control', resource: 'Affliction Cultivation', playstyle: 'Cultivate the perfect sickness. Evolve devastating diseases through dark experimentation, watching as your afflictions spread like wildfire through enemy ranks', roleColor: '#e67e22', damageTypes: ['poison', 'necrotic'] },
    { name: 'Primalist', imageIcon: '/assets/icons/classes/primalist.png', icon: faMountain, role: 'Support / Control', resource: 'Totemic Synergy', playstyle: 'The earth speaks through you. Command the elements through sacred totems, creating powerful zones of elemental synergy that dominate the natural world', roleColor: '#f1c40f', damageTypes: ['nature', 'lightning', 'fire'] },
    { name: 'Pyrofiend', imageIcon: '/assets/icons/classes/pyrofiend.png', icon: faFire, role: 'Damage', resource: 'Inferno Veil', playstyle: 'Become the inferno. Succumb to demonic corruption to unleash waves of hellfire that grow more uncontrollable and deadly as your inner flame rises', roleColor: '#e74c3c', damageTypes: ['fire'] },
    { name: 'Spellguard', imageIcon: '/assets/icons/classes/spellguard.png', icon: faShieldAlt, role: 'Tank / Anti-Mage', resource: 'Ward Layers', playstyle: 'The ultimate shield against the arcane. Layer yourself in magical wards and barrier systems, becoming a prismatic wall that magic cannot breach', roleColor: '#3498db', damageTypes: ['arcane', 'force'] },
    { name: 'Titan', imageIcon: '/assets/icons/classes/titan.png', icon: faSun, role: 'Tank / Control', resource: 'Strain Overload', playstyle: 'Wield the weight of the world. Manipulate gravity to crush your enemies and use your colossal strength to shatter the very foundations of the battlefield', roleColor: '#3498db', damageTypes: ['bludgeoning', 'radiant', 'force'] },
    { name: 'Toxicologist', imageIcon: '/assets/icons/classes/toxicologist.png', icon: faFlask, role: 'Damage / Control', resource: 'Alchemical Vials', playstyle: 'Master of chemical warfare. Brew lethal concoctions and fill the air with toxic vapors, ensuring that every breath your enemy takes is their last', roleColor: '#e67e22', damageTypes: ['poison', 'necrotic'] },
    { name: 'Warden', imageIcon: '/assets/icons/classes/warden.png', icon: faGavel, role: 'Damage / Control', resource: 'Vengeance Points', playstyle: 'Guardian of the spectral threshold. Hunt your enemies with spectral glaives and imprison their souls in spiritual cages from which there is no escape', roleColor: '#e67e22', damageTypes: ['slashing', 'force', 'nature'] },
    { name: 'Witch Doctor', imageIcon: '/assets/icons/classes/witch_doctor.png', icon: faSkull, role: 'Support / Control', resource: 'Voodoo Essence', playstyle: 'Invoke the ancient loa. Use dark rituals, powerful curses, and voodoo dolls to manipulate the spirits and bring a slow, agonizing end to your enemies', roleColor: '#f1c40f', damageTypes: ['necrotic', 'nature', 'poison'] },
    { name: 'Augur', imageIcon: '/assets/icons/classes/augur.png', icon: faDove, role: 'Control / Debuffer', resource: 'Benediction & Malediction', playstyle: 'Read the signs in every die roll — even numbers fuel your Benediction, odd numbers your Malediction. Reshape the battlefield through divine omens', roleColor: '#9b59b6', damageTypes: ['psychic', 'radiant'] },
    { name: 'Doomsayer', imageIcon: '/assets/icons/classes/doomsayer.png', icon: faBolt, role: 'Damage / Control', resource: 'Havoc & Prophecy Range', playstyle: 'Place living bomb prophecies with RNG chaos outcomes. Earn Havoc from fulfilled prophecies and detonate catastrophic doom across the battlefield', roleColor: '#e74c3c', damageTypes: ['necrotic', 'psychic', 'fire', 'force'] }
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
