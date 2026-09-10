import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import MythrillWindow from '../windows/MythrillWindow';
import useCharacterStore from '../../store/characterStore';
import useWindowManagerStore from '../../store/windowManagerStore';
import { CLASS_SPECIALIZATIONS } from '../../data/classSpellCategories';
import TalentTreeContent from '../talent-tree/TalentTreeContent';
import { SKILL_CATEGORIES, SKILL_DEFINITIONS } from '../../constants/skillDefinitions';
import useTabOverflow from '../common/useTabOverflow';
import { useInspectionCharacter } from '../../contexts/InspectionContext';

const CharacterPanel = lazy(() => import('./CharacterPanel'));
const CharacterStats = lazy(() => import('./CharacterStats'));
const Skills = lazy(() => import('./Skills'));
const Lore = lazy(() => import('./Lore'));

// Shared character sheet window used by:
// - Navigation.jsx for the player's own sheet (inspection=false)
// - HUDContainer.jsx when inspecting a party member (inspection=true, inside InspectionProvider)
// Keeping a single window guarantees the inspect view always matches the own
// sheet's tab dropdowns and sub-section wiring.
function CharacterSheetWindow({ isOpen, onClose, title, inspection = false, initialTab }) {
    const [activeTab, setActiveTab] = useState(initialTab || (inspection ? 'character' : 'lore'));
    const [activeLoreSection, setActiveLoreSection] = useState('identity');
    const [activeInfoSection, setActiveInfoSection] = useState('equipment');
    const [activeStatGroup, setActiveStatGroup] = useState('summary');
    const [activeSkillCategory, setActiveSkillCategory] = useState('combat');
    const [selectedSkillId, setSelectedSkillId] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [dropdownPos, setDropdownPos] = useState(null);
    const closeTimerRef = useRef(null);
    const { getWindowPosition, getWindowSize, setWindowPosition, setWindowSize } = useWindowManagerStore();

    const WINDOW_ID = inspection ? 'character-sheet-inspect' : 'character-sheet';
    const savedPos = getWindowPosition(WINDOW_ID, inspection ? { x: 300, y: 150 } : { x: 100, y: 100 });
    const savedSize = getWindowSize(WINDOW_ID, { width: 850, height: 640 });

    const handleDrag = useCallback((pos) => {
        setWindowPosition(WINDOW_ID, { x: pos.x, y: pos.y });
    }, [setWindowPosition, WINDOW_ID]);

    const handleResize = useCallback((size) => {
        setWindowSize(WINDOW_ID, size);
    }, [setWindowSize, WINDOW_ID]);

    // The tab dropdown menus are portaled to <body> so they are not clipped by
    // the header's scroll container (.window-header .spellbook-tab-container uses
    // overflow-x:auto to let tabs scroll, which would otherwise hide the menus).
    const openTabDropdown = useCallback((key, el) => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
        setOpenDropdown(key);
        if (el) {
            const r = el.getBoundingClientRect();
            setDropdownPos({ left: r.left, top: r.bottom, width: r.width });
        }
    }, []);

    const scheduleCloseTabDropdown = useCallback(() => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
        }
        closeTimerRef.current = setTimeout(() => {
            setOpenDropdown(null);
        }, 150);
    }, []);

    const cancelCloseTabDropdown = useCallback(() => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    }, []);

    // Cleanup the close timer on unmount
    useEffect(() => {
        return () => {
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
            }
        };
    }, []);

    // Ensure title is always defined with fallback
    const safeTitle = title || 'Character Sheet';

    // Resolve class/spec from the inspected character when inside an
    // InspectionProvider, otherwise from the player's own character store.
    const inspectionData = useInspectionCharacter();
    const storeClass = useCharacterStore(state => state.class);
    const storePrimarySpecialization = useCharacterStore(state => state.primarySpecialization);
    const characterClass = inspectionData ? inspectionData.class : storeClass;
    const primarySpecialization = inspectionData ? inspectionData.primarySpecialization : storePrimarySpecialization;
    const [activeTalentTree, setActiveTalentTree] = useState(0);

    // Define character sheet sections with dropdown sub-sections matching the exact component tabs
    const characterSections = {
        lore: {
            title: 'Lore',
            icon: 'fas fa-book-open',
            subSections: [
                { id: 'identity', label: 'Identity & Origin', icon: 'fas fa-user' },
                { id: 'personality', label: 'Demeanor & Conviction', icon: 'fas fa-smile' },
                { id: 'appearance', label: 'Bearing & Aspect', icon: 'fas fa-user-circle' },
                { id: 'relationships', label: 'Bonds & Adversaries', icon: 'fas fa-users' },
                { id: 'goals', label: 'Purpose & Dread', icon: 'fas fa-bullseye' },
                { id: 'heritage', label: 'Ancestry & Heritage', icon: 'fas fa-dna' },
                { id: 'notes', label: 'Marginalia & Notes', icon: 'fas fa-sticky-note' }
            ]
        },
        character: {
            title: 'Info',
            icon: 'fas fa-info-circle',
            subSections: [
                { id: 'equipment', label: 'Equipment & Vitals', icon: 'fas fa-shield-alt' },
                { id: 'passives', label: 'Passives', icon: 'fas fa-star' },
                { id: 'languages', label: 'Languages', icon: 'fas fa-globe' }
            ]
        },
        stats: {
            title: 'Stats',
            icon: 'fas fa-chart-bar',
            subSections: [
                { id: 'summary', label: 'Character Summary', icon: 'fas fa-id-card' },
                { id: 'base', label: 'Core Attributes', icon: 'fas fa-dumbbell' },
                { id: 'combat', label: 'Combat Statistics', icon: 'fas fa-fist-raised' },
                { id: 'spellpower', label: 'Spell Power', icon: 'fas fa-hat-wizard' },
                { id: 'regeneration', label: 'Regeneration & Healing', icon: 'fas fa-heartbeat' },
                { id: 'resistances', label: 'Damage Resistances', icon: 'fas fa-shield-alt' },
                { id: 'movement', label: 'Movement & Mobility', icon: 'fas fa-running' },
                { id: 'utility', label: 'Utility & Senses', icon: 'fas fa-eye' },
                { id: 'savingThrows', label: 'Saving Throws', icon: 'fas fa-roll' }
            ]
        },
        skills: {
            title: 'Skills',
            icon: 'fas fa-graduation-cap',
            subSections: [
                { id: 'combat', label: 'Combat Mastery', icon: 'fas fa-fist-raised' },
                { id: 'exploration', label: 'Exploration & Survival', icon: 'fas fa-compass' },
                { id: 'social', label: 'Social & Influence', icon: 'fas fa-users' },
                { id: 'arcane', label: 'Arcane Studies', icon: 'fas fa-hat-wizard' }
            ],
            skillItems: {
                combat: Object.entries(SKILL_DEFINITIONS)
                    .filter(([_, skill]) => skill.category === SKILL_CATEGORIES.COMBAT.name)
                    .map(([id, skill]) => ({ id, label: skill.name, icon: 'fas fa-fist-raised' })),
                exploration: Object.entries(SKILL_DEFINITIONS)
                    .filter(([_, skill]) => skill.category === SKILL_CATEGORIES.EXPLORATION.name)
                    .map(([id, skill]) => ({ id, label: skill.name, icon: 'fas fa-compass' })),
                social: Object.entries(SKILL_DEFINITIONS)
                    .filter(([_, skill]) => skill.category === SKILL_CATEGORIES.SOCIAL.name)
                    .map(([id, skill]) => ({ id, label: skill.name, icon: 'fas fa-users' })),
                arcane: Object.entries(SKILL_DEFINITIONS)
                    .filter(([_, skill]) => skill.category === SKILL_CATEGORIES.ARCANE.name)
                    .map(([id, skill]) => ({ id, label: skill.name, icon: 'fas fa-hat-wizard' }))
            }
        },
        talents: {
            title: 'Talents',
            icon: 'fas fa-sitemap',
            subSections: [
                ...(characterClass && CLASS_SPECIALIZATIONS[characterClass]
                    ? CLASS_SPECIALIZATIONS[characterClass].specializations.map((spec, idx) => {
                        const isPrimary = primarySpecialization === spec.id;
                        return {
                            id: `tree_${idx}`,
                            label: isPrimary ? `${spec.name} ⭐` : spec.name,
                            icon: isPrimary ? 'fas fa-crown' : 'fas fa-tree',
                            isPrimary
                        };
                    })
                    : [
                        { id: 'tree_0', label: 'Tree 1', icon: 'fas fa-tree' },
                        { id: 'tree_1', label: 'Tree 2', icon: 'fas fa-tree' },
                        { id: 'tree_2', label: 'Tree 3', icon: 'fas fa-tree' }
                    ]),
                { id: 'summary', label: 'Talent Summary', icon: 'fas fa-list-check' }
            ]
        }
    };

    // Talent trees read from the viewer's own character store, so they only
    // make sense for the owner's sheet — hide the tab while inspecting.
    const allSectionKeys = Object.keys(characterSections);
    const sectionKeys = inspection ? allSectionKeys.filter(key => key !== 'talents') : allSectionKeys;
    const { containerRef: tabsTrackRef, hiddenIds: hiddenTabIds } = useTabOverflow({
        itemIds: sectionKeys,
        triggerWidth: 36
    });
    const [tabOverflowOpen, setTabOverflowOpen] = useState(false);
    const [tabOverflowPos, setTabOverflowPos] = useState(null);
    const tabOverflowBtnRef = useRef(null);
    const tabOverflowMenuRef = useRef(null);
    const overflowCloseTimerRef = useRef(null);

    const openTabOverflowMenu = useCallback((rect) => {
        if (overflowCloseTimerRef.current) {
            clearTimeout(overflowCloseTimerRef.current);
            overflowCloseTimerRef.current = null;
        }
        setTabOverflowPos({
            top: rect.bottom + 4,
            left: Math.max(8, Math.min(rect.left, window.innerWidth - 230))
        });
        setTabOverflowOpen(true);
    }, []);

    const scheduleCloseTabOverflow = useCallback(() => {
        if (overflowCloseTimerRef.current) return;
        overflowCloseTimerRef.current = setTimeout(() => {
            overflowCloseTimerRef.current = null;
            setTabOverflowOpen(false);
        }, 150);
    }, []);

    const cancelCloseTabOverflow = useCallback(() => {
        if (overflowCloseTimerRef.current) {
            clearTimeout(overflowCloseTimerRef.current);
            overflowCloseTimerRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (hiddenTabIds.length === 0) setTabOverflowOpen(false);
    }, [hiddenTabIds.length]);

    useEffect(() => {
        if (!tabOverflowOpen) return undefined;
        const handlePointerDown = (e) => {
            if (tabOverflowBtnRef.current && tabOverflowBtnRef.current.contains(e.target)) return;
            if (tabOverflowMenuRef.current && tabOverflowMenuRef.current.contains(e.target)) return;
            setTabOverflowOpen(false);
        };
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setTabOverflowOpen(false);
        };
        document.addEventListener('pointerdown', handlePointerDown, true);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown, true);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [tabOverflowOpen]);

    useEffect(() => () => {
        if (overflowCloseTimerRef.current) clearTimeout(overflowCloseTimerRef.current);
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'character':
                return <CharacterPanel activeSubSection={activeInfoSection} setActiveSubSection={setActiveInfoSection} />;
            case 'stats':
                return <CharacterStats selectedStatGroup={activeStatGroup} setSelectedStatGroup={setActiveStatGroup} />;
            case 'skills':
                return <Skills selectedCategory={activeSkillCategory} selectedSkill={selectedSkillId} setSelectedSkill={setSelectedSkillId} />;
            case 'talents':
                return (
                    <div style={{ width: '100%', height: '100%', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                        <TalentTreeContent selectedTreeIndex={activeTalentTree} onTreeSelect={setActiveTalentTree} />
                    </div>
                );
            case 'lore':
                return <Lore initialSection={activeLoreSection} key={activeLoreSection} />;
            default:
                return <Lore initialSection={activeLoreSection} key={activeLoreSection} />;
        }
    };

    return (
        <MythrillWindow
            isOpen={isOpen}
            onClose={onClose}
            title={safeTitle}
            defaultSize={savedSize}
            defaultPosition={savedPos}
            onDrag={handleDrag}
            onResize={handleResize}
            customHeader={
                <div className="spellbook-tab-container tab-overflow-root" ref={tabsTrackRef}>
                    {sectionKeys.filter(key => !hiddenTabIds.includes(key)).map(key => {
                        const section = characterSections[key];
                        const isActive = activeTab === key;
                        const isDropdownOpen = openDropdown === key;
                        return (
                            <div
                                key={key}
                                data-overflow-id={key}
                                className="tab-dropdown-wrapper"
                                style={{ position: 'relative' }}
                                onMouseLeave={scheduleCloseTabDropdown}
                            >
                                <button
                                    className={`spellbook-tab-button tab-icon-only ${isActive ? 'active' : ''}`}
                                    title={section.title}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveTab(key);
                                        if (openDropdown === key) {
                                            setOpenDropdown(null);
                                        } else {
                                            openTabDropdown(key, e.currentTarget);
                                        }
                                    }}
                                    onMouseEnter={(e) => openTabDropdown(key, e.currentTarget)}
                                >
                                    <i className={`${section.icon} tab-icon-glyph`}></i>
                                    {section.subSections && (
                                        <i
                                            className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'} tab-chevron`}
                                            style={{ marginLeft: '4px', fontSize: '8px', opacity: 0.8 }}
                                        />
                                    )}
                                </button>

                                {isDropdownOpen && section.subSections && dropdownPos && ReactDOM.createPortal(
                                    <div
                                        className="tab-dropdown-menu tab-dropdown-menu-scrollable"
                                        style={{ position: 'fixed', left: dropdownPos.left, top: dropdownPos.top, minWidth: Math.max(220, dropdownPos.width), marginTop: 4 }}
                                        onMouseEnter={cancelCloseTabDropdown}
                                        onMouseLeave={scheduleCloseTabDropdown}
                                    >
                                        {key === 'skills' ? (
                                            section.subSections.map(sub => {
                                                const skillsForCat = section.skillItems?.[sub.id] || [];
                                                const isCatActive = activeTab === 'skills' && activeSkillCategory === sub.id;
                                                return (
                                                    <div key={sub.id} className="tab-dropdown-section">
                                                        <div
                                                            className={`tab-dropdown-section-header ${isCatActive ? 'active' : ''}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveTab('skills');
                                                                setActiveSkillCategory(sub.id);
                                                                if (skillsForCat.length > 0) {
                                                                    setSelectedSkillId(skillsForCat[0].id);
                                                                }
                                                                setOpenDropdown(null);
                                                            }}
                                                            title={`View ${sub.label}`}
                                                        >
                                                            <i className={sub.icon} style={{ width: '16px', textAlign: 'center', marginRight: '8px' }}></i>
                                                            <span className="tab-dropdown-section-title">{sub.label}</span>
                                                            <span className="tab-dropdown-section-count">({skillsForCat.length})</span>
                                                        </div>
                                                        <div className="tab-dropdown-section-items">
                                                            {skillsForCat.map(skill => {
                                                                const isSkillActive = activeTab === 'skills' && activeSkillCategory === sub.id && selectedSkillId === skill.id;
                                                                return (
                                                                    <button
                                                                        key={skill.id}
                                                                        type="button"
                                                                        className={`tab-dropdown-item tab-dropdown-skill-item ${isSkillActive ? 'active' : ''}`}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setActiveTab('skills');
                                                                            setActiveSkillCategory(sub.id);
                                                                            setSelectedSkillId(skill.id);
                                                                            setOpenDropdown(null);
                                                                        }}
                                                                    >
                                                                        <i className={skill.icon} style={{ width: '14px', textAlign: 'center', marginRight: '6px', fontSize: '10px' }}></i>
                                                                        <span>{skill.label}</span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            section.subSections.map(sub => {
                                                const isSubActive = (activeTab === key && (
                                                    (key === 'lore' && activeLoreSection === sub.id) ||
                                                    (key === 'character' && activeInfoSection === sub.id) ||
                                                    (key === 'stats' && activeStatGroup === sub.id) ||
                                                    (key === 'talents' && (
                                                        (sub.id === 'summary' && activeTalentTree === 3) ||
                                                        (sub.id === `tree_${activeTalentTree}`)
                                                    ))
                                                ));
                                                return (
                                                    <div key={sub.id} className="tab-dropdown-item-wrapper" style={{ position: 'relative' }}>
                                                        <button
                                                            type="button"
                                                            className={`tab-dropdown-item ${isSubActive ? 'active' : ''}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveTab(key);
                                                                if (key === 'lore') {
                                                                    setActiveLoreSection(sub.id);
                                                                } else if (key === 'character') {
                                                                    setActiveInfoSection(sub.id);
                                                                } else if (key === 'stats') {
                                                                    setActiveStatGroup(sub.id);
                                                                } else if (key === 'talents') {
                                                                    if (sub.id === 'summary') {
                                                                        setActiveTalentTree(3);
                                                                    } else {
                                                                        const idx = parseInt(sub.id.replace('tree_', ''), 10);
                                                                        setActiveTalentTree(isNaN(idx) ? 0 : idx);
                                                                    }
                                                                }
                                                                setOpenDropdown(null);
                                                            }}
                                                        >
                                                            <i className={sub.icon} style={{ width: '16px', textAlign: 'center', marginRight: '8px' }}></i>
                                                            <span>{sub.label}</span>
                                                        </button>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>,
                                    document.body
                                )}
                            </div>
                        );
                    })}

                    {hiddenTabIds.length > 0 && (
                        <button
                            type="button"
                            ref={tabOverflowBtnRef}
                            className={`tab-overflow-trigger ${tabOverflowOpen ? 'open' : ''} ${hiddenTabIds.includes(activeTab) ? 'has-active' : ''}`}
                            data-overflow-trigger=""
                            onClick={(e) => {
                                if (tabOverflowOpen) {
                                    setTabOverflowOpen(false);
                                } else {
                                    openTabOverflowMenu(e.currentTarget.getBoundingClientRect());
                                }
                            }}
                            onMouseEnter={(e) => openTabOverflowMenu(e.currentTarget.getBoundingClientRect())}
                            onMouseLeave={scheduleCloseTabOverflow}
                            aria-haspopup="menu"
                            aria-expanded={tabOverflowOpen}
                            title="More sections"
                        >
                            ⋮
                        </button>
                    )}

                    {tabOverflowOpen && hiddenTabIds.length > 0 && ReactDOM.createPortal(
                        <div
                            ref={tabOverflowMenuRef}
                            className="tab-dropdown-menu tab-dropdown-menu-scrollable"
                            style={tabOverflowPos ? { position: 'fixed', left: tabOverflowPos.left, top: tabOverflowPos.top, minWidth: 200 } : { position: 'fixed', minWidth: 200 }}
                            onMouseEnter={cancelCloseTabOverflow}
                            onMouseLeave={scheduleCloseTabOverflow}
                        >
                            {hiddenTabIds.map(key => {
                                const section = characterSections[key];
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        className={`tab-dropdown-item ${activeTab === key ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveTab(key);
                                            setOpenDropdown(null);
                                            setTabOverflowOpen(false);
                                        }}
                                    >
                                        <i className={section.icon} style={{ width: '16px', textAlign: 'center', marginRight: '8px' }}></i>
                                        <span>{section.title}</span>
                                    </button>
                                );
                            })}
                        </div>,
                        document.body
                    )}
                </div>
            }
        >
            <div className="character-sheet">
                <div className="character-sheet-content">
                    <Suspense fallback={<div>Loading character sheet...</div>}>
                        {renderContent()}
                    </Suspense>
                </div>
            </div>
        </MythrillWindow>
    );
}

export default CharacterSheetWindow;
