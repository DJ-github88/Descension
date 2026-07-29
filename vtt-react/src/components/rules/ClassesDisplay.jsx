import React, { useState, useMemo } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './ClassesDisplay.css';

import { CLASS_DISPLAY_DATA } from '../../data/classes/classDisplayData';

import ClassIcon from '../common/ClassIcon';
import ClassRowBackdrop from './ClassRowBackdrop';



const DAMAGE_COLORS = {

    smashing: '#8B5A2B',

    stabbing: '#704214',

    slicing: '#5C3317',

    ember: '#D4380D',

    rime: '#2C5F7C',

    storm: '#8B7328',

    arcane: '#5B3A8C',

    primal: '#2D5A1E',

    blight: '#3D1F4E',

    wyrd: '#7A2040',

    sacred: '#C9A227',

    healing: '#2E8B57'

};



const CLASS_DATA = CLASS_DISPLAY_DATA;

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



const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');



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

                        <p>Your Class is your identity on the battlefield: governing hit points, weapon proficiencies, armour capabilities, and the unique resource that fuels your most devastating abilities. With 30 distinct classes, no two adventurers fight the same way.</p>

                    </div>

                    <div className="classes-intro-col">

                        <h4><i className="fas fa-bolt"></i> Resource Systems</h4>

                        <p>Every class channels power through a unique resource. A Berserker builds Rage by being struck. A Gambit bends probability with Fortune Points. A Revenant pays for forbidden power in blood. Understanding your resource loop is understanding your class.</p>

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

                {filteredClasses.map(cls => {

                    const slug = slugify(cls.name);
                    const isComingSoon = Boolean(cls.comingSoon);

                    return (

                    <div

                        key={cls.name}

                        className={`class-row class-row-${slug} ${isComingSoon ? 'class-row-coming-soon' : ''}`}

                        style={{ '--role-color': cls.roleColor }}

                        onClick={() => !isComingSoon && onSelectClass && onSelectClass(cls.name)}

                    >

                        <ClassRowBackdrop slug={slug} />

                        {isComingSoon && (
                            <div className="class-row-coming-soon-overlay">
                                <span className="coming-soon-banner-text">
                                    <i className="fas fa-tools"></i> IN DEVELOPMENT — COMING SOON
                                </span>
                            </div>
                        )}

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

                                {isComingSoon ? (
                                    <span className="coming-soon-badge-text">
                                        <i className="fas fa-lock"></i> Locked
                                    </span>
                                ) : (
                                    <span>View Class <i className="fas fa-arrow-right"></i></span>
                                )}

                            </div>

                        </div>

                    </div>

                    );

                })}



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
