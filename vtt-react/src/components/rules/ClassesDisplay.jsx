import React, { useState, useRef, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSkull, faCrosshairs, faMagic, faAtom, faClock, faDice, faShield,
    faMountain, faGavel, faEye, faShieldAlt, faMoon, faCross, faPaw,
    faWind, faScroll, faBiohazard, faFlask, faMusic, faSun, faFire
} from '@fortawesome/free-solid-svg-icons';
import './ClassesDisplay.css';

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
    { name: 'Arcanoneer', icon: faAtom, role: 'Damage / Utility', resource: 'Sphere Generation', playstyle: 'Master of elemental sphere combination with dynamic spell crafting', roleColor: '#e67e22', damageTypes: ['arcane', 'fire', 'frost', 'lightning', 'force', 'chaos'] },
    { name: 'Berserker', icon: faSkull, role: 'Damage', resource: 'Rage Points', playstyle: 'Fury warrior with momentum-based combat', roleColor: '#e74c3c', damageTypes: ['slashing', 'bludgeoning'] },
    { name: 'Bladedancer', icon: faWind, role: 'Damage', resource: 'Edge & Flourish', playstyle: 'Finesse fighter with elegant combat techniques', roleColor: '#e74c3c', damageTypes: ['slashing', 'piercing'] },
    { name: 'Chaos Weaver', icon: faDice, role: 'Damage', resource: 'Mayhem Modifiers', playstyle: 'Master of unpredictability with highest damage potential', roleColor: '#e74c3c', damageTypes: ['force', 'necrotic', 'chaos'] },
    { name: 'Chronarch', icon: faClock, role: 'Control', resource: 'Temporal Energy', playstyle: 'Time manipulator building temporal power', roleColor: '#9b59b6', damageTypes: ['force', 'arcane'] },
    { name: 'Covenbane', icon: faCrosshairs, role: 'Damage / Support', resource: 'Anti-Magic Seals', playstyle: 'Witch hunter with magic-disrupting abilities', roleColor: '#e67e22', damageTypes: ['radiant', 'force', 'slashing'] },
    { name: 'Deathcaller', icon: faSkull, role: 'Damage / Support', resource: 'Necrotic Ascension', playstyle: 'Blood mage sacrificing health for forbidden power', roleColor: '#e67e22', damageTypes: ['necrotic', 'psychic'] },
    { name: 'Dreadnaught', icon: faShield, role: 'Tank', resource: 'Siege Mode', playstyle: 'Fortress defender with heavy armor capabilities', roleColor: '#3498db', damageTypes: ['necrotic', 'poison', 'psychic'] },
    { name: 'Exorcist', icon: faCross, role: 'Support / Damage', resource: 'Divine Favor', playstyle: 'Holy warrior banishing evil spirits', roleColor: '#f1c40f', damageTypes: ['radiant', 'force'] },
    { name: 'False Prophet', icon: faEye, role: 'Control', resource: 'Deception', playstyle: 'Corrupting preacher spreading lies and manipulation', roleColor: '#9b59b6', damageTypes: ['psychic', 'void', 'necrotic'] },
    { name: 'Fate Weaver', icon: faMagic, role: 'Support / Control', resource: 'Threads of Destiny', playstyle: 'Card-based destiny manipulator turning failures into power', roleColor: '#f1c40f', damageTypes: ['psychic', 'force'] },
    { name: 'Formbender', icon: faPaw, role: 'Hybrid', resource: 'Wild Instinct', playstyle: 'Shapeshifter mastering four primal forms with adaptive combat', roleColor: '#2ecc71', damageTypes: ['nature', 'bludgeoning'] },
    { name: 'Gambler', icon: faDice, role: 'Damage / Utility', resource: 'Fortune Points', playstyle: 'Daring risk-taker manipulating luck and probability', roleColor: '#e67e22', damageTypes: ['force', 'psychic'] },
    { name: 'Huntress', icon: faMoon, role: 'Damage', resource: 'Quarry Marks', playstyle: 'Tracker with precision targeting and pursuit', roleColor: '#e74c3c', damageTypes: ['piercing', 'slashing'] },
    { name: 'Inscriptor', icon: faScroll, role: 'Control / Support', resource: 'Runic Wrapping', playstyle: 'Tactical battlefield controller using runes and inscriptions', roleColor: '#f1c40f', damageTypes: ['force', 'arcane'] },
    { name: 'Lichborne', icon: faSkull, role: 'Damage / Control', resource: 'Eternal Frost Aura', playstyle: 'Frost-wielding undead with life-draining aura and resurrection', roleColor: '#e67e22', damageTypes: ['necrotic', 'frost'] },
    { name: 'Lunarch', icon: faMoon, role: 'Support / Control', resource: 'Lunar Charge', playstyle: 'Lunar mage with phase-based energy cycles', roleColor: '#f1c40f', damageTypes: ['arcane', 'radiant'] },
    { name: 'Martyr', icon: faCross, role: 'Tank / Support', resource: 'Pain Points', playstyle: 'Self-sacrificing warrior earning power through suffering', roleColor: '#3498db', damageTypes: ['radiant', 'fire'] },
    { name: 'Minstrel', icon: faMusic, role: 'Support', resource: 'Harmonic Notes', playstyle: 'Musical spellcaster with note combinations', roleColor: '#2ecc71', damageTypes: ['psychic', 'force'] },
    { name: 'Oracle', icon: faEye, role: 'Support / Control', resource: 'Prophetic Vision', playstyle: 'Seer with foresight and divination', roleColor: '#f1c40f', damageTypes: ['psychic', 'force'] },
    { name: 'Plaguebringer', icon: faBiohazard, role: 'Damage / Control', resource: 'Affliction Cultivation', playstyle: 'Plague master evolving diseases through strategic spell combos', roleColor: '#e67e22', damageTypes: ['poison', 'necrotic'] },
    { name: 'Primalist', icon: faMountain, role: 'Support / Control', resource: 'Totemic Synergy', playstyle: 'Totem master creating powerful synergies through sacred totems', roleColor: '#f1c40f', damageTypes: ['nature', 'lightning', 'fire'] },
    { name: 'Pyrofiend', icon: faFire, role: 'Damage', resource: 'Inferno Veil', playstyle: 'Fire-wielding demon with corruption stages', roleColor: '#e74c3c', damageTypes: ['fire'] },
    { name: 'Spellguard', icon: faShieldAlt, role: 'Tank / Support', resource: 'Ward Layers', playstyle: 'Protective mage with magical shield systems', roleColor: '#3498db', damageTypes: ['arcane', 'force'] },
    { name: 'Titan', icon: faSun, role: 'Tank / Control', resource: 'Strain Overload', playstyle: 'Gravity manipulator with colossal strength', roleColor: '#3498db', damageTypes: ['bludgeoning', 'radiant', 'force'] },
    { name: 'Toxicologist', icon: faFlask, role: 'Damage / Control', resource: 'Alchemical Vials', playstyle: 'Poison crafter with chemical warfare', roleColor: '#e67e22', damageTypes: ['poison', 'necrotic'] },
    { name: 'Warden', icon: faGavel, role: 'Damage / Control', resource: 'Vengeance Points', playstyle: 'Relentless hunter with glaive combat and spectral cages', roleColor: '#e67e22', damageTypes: ['slashing', 'force', 'nature'] },
    { name: 'Witch Doctor', icon: faSkull, role: 'Support / Control', resource: 'Voodoo Essence', playstyle: 'Voodoo practitioner invoking powerful loa through curses and rituals', roleColor: '#f1c40f', damageTypes: ['necrotic', 'nature', 'poison'] }
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
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
    const tooltipTimeout = useRef(null);

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

    const handleMouseEnter = useCallback((cls, e) => {
        if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
        const rect = e.currentTarget.getBoundingClientRect();
        const tooltipWidth = 320;
        const tooltipHeight = 260;

        let left = rect.right + 12;
        let top = rect.top;

        if (left + tooltipWidth > window.innerWidth - 16) {
            left = rect.left - tooltipWidth - 12;
        }
        if (left < 16) left = 16;

        if (top + tooltipHeight > window.innerHeight - 16) {
            top = window.innerHeight - tooltipHeight - 16;
        }

        setTooltipPos({ top, left });
        setTooltipData(cls);
    }, []);

    const handleMouseLeave = useCallback(() => {
        tooltipTimeout.current = setTimeout(() => setTooltipData(null), 100);
    }, []);

    const handleTooltipEnter = useCallback(() => {
        if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    }, []);

    const handleTooltipLeave = useCallback(() => {
        setTooltipData(null);
    }, []);

    return (
        <div className="classes-display">
            <div className="classes-intro">
                <div className="classes-intro-header">
                    <div className="classes-intro-icon"><i className="fas fa-hat-wizard"></i></div>
                    <div className="classes-intro-title">
                        <h2>Classes</h2>
                        <p className="classes-intro-subtitle">Choose the path that calls to your character's soul</p>
                    </div>
                </div>
                <div className="classes-intro-columns">
                    <div className="classes-intro-col">
                        <h4><i className="fas fa-swords"></i> Class System</h4>
                        <p>Classes determine your combat role, resource system, and mechanical abilities. There are 28 classes organized into thematic paths — each one a unique expression of power, sacrifice, and ambition. No two play the same.</p>
                    </div>
                    <div className="classes-intro-col">
                        <h4><i className="fas fa-bolt"></i> Resource Systems</h4>
                        <p>Every class channels power through a unique resource — from the Pyrofiend's escalating Inferno Veil to the Bladedancer's Edge and Flourish. These systems define when and how you unleash your most devastating abilities.</p>
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

            <div className="classes-grid">
                {filteredClasses.map(cls => (
                    <div
                        key={cls.name}
                        className="class-card"
                        style={{ '--role-color': cls.roleColor }}
                        onClick={() => onSelectClass(cls.name)}
                        onMouseEnter={(e) => handleMouseEnter(cls, e)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className="class-card-icon">
                            <FontAwesomeIcon icon={cls.icon} />
                        </div>
                        <div className="class-card-name">{cls.name}</div>
                        <div className="class-card-role">{cls.role}</div>
                        <div className="class-card-damage-types">
                            {cls.damageTypes.slice(0, 3).map(dt => (
                                <span
                                    key={dt}
                                    className="card-dmg-dot"
                                    style={{ background: DAMAGE_COLORS[dt] || '#888' }}
                                    title={dt.charAt(0).toUpperCase() + dt.slice(1)}
                                />
                            ))}
                            {cls.damageTypes.length > 3 && (
                                <span className="card-dmg-more">+{cls.damageTypes.length - 3}</span>
                            )}
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

            {tooltipData && (
                <div
                    className="class-tooltip"
                    style={{ top: tooltipPos.top, left: tooltipPos.left }}
                    onMouseEnter={handleTooltipEnter}
                    onMouseLeave={handleTooltipLeave}
                >
                    <div className="class-tooltip-header" style={{ borderColor: tooltipData.roleColor }}>
                        <div className="class-tooltip-icon" style={{ color: tooltipData.roleColor }}>
                            <FontAwesomeIcon icon={tooltipData.icon} />
                        </div>
                        <div className="class-tooltip-title">
                            <h4>{tooltipData.name}</h4>
                            <span className="class-tooltip-role-badge" style={{ background: tooltipData.roleColor }}>
                                {tooltipData.role}
                            </span>
                        </div>
                    </div>
                    <div className="class-tooltip-body">
                        <div className="class-tooltip-field">
                            <span className="field-label"><i className="fas fa-bolt"></i> Resource</span>
                            <span className="field-value">{tooltipData.resource}</span>
                        </div>
                        <div className="class-tooltip-field">
                            <span className="field-label"><i className="fas fa-fire-alt"></i> Damage Types</span>
                            <div className="tooltip-damage-tags">
                                {tooltipData.damageTypes.map(dt => (
                                    <span
                                        key={dt}
                                        className="tooltip-dmg-tag"
                                        style={{ background: DAMAGE_COLORS[dt] || '#888' }}
                                    >
                                        {dt.charAt(0).toUpperCase() + dt.slice(1)}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="class-tooltip-field">
                            <span className="field-label"><i className="fas fa-chess-knight"></i> Playstyle</span>
                            <span className="field-value">{tooltipData.playstyle}</span>
                        </div>
                    </div>
                    <div className="class-tooltip-footer">
                        <span>Click to view full details <i className="fas fa-arrow-right"></i></span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassesDisplay;
