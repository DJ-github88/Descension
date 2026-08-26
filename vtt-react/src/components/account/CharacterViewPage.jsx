import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useCharacterStore from '../../store/characterStore';
import useConditionStore from '../../store/conditionStore';
import { getIconUrl, getCustomIconUrl } from '../../utils/assetManager';
import { getSubraceData } from '../../data/raceData';
import { SKILL_DEFINITIONS, SKILL_CATEGORIES } from '../../constants/skillDefinitions';
import { initializeClassResource } from '../../data/classResources';
import CharacterPanel from '../character-sheet/CharacterPanel';
import CharacterStats from '../character-sheet/CharacterStats';
import Skills from '../character-sheet/Skills';
import Lore from '../character-sheet/Lore';
import InventoryWindow from '../windows/InventoryWindow';
import ItemLibrary from '../item-generation/ItemLibrary';
import ItemGeneration from '../item-generation/ItemGeneration';
import { SpellLibraryProvider } from '../spellcrafting-wizard/context/SpellLibraryContext';
import SpellLibrary from '../spellcrafting-wizard/components/library/SpellLibrary';
import SpellActionBar from '../character-sheet/SpellActionBar';
import DiceThemeSelector from '../dice/DiceThemeSelector';
import ClassResourceBar from '../hud/ClassResourceBar';
import { CLASS_SPECIALIZATIONS } from '../../data/classSpellCategories';
import TalentTreeContent from '../talent-tree/TalentTreeContent';
import '../../styles/character-sheet.css';
import '../../styles/character-view-page.css';

const CharacterViewPage = () => {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('character');
  const [activeLoreSection, setActiveLoreSection] = useState('identity');
  const [activeInfoSection, setActiveInfoSection] = useState('equipment');
  const [activeStatGroup, setActiveStatGroup] = useState('summary');
  const [activeSkillCategory, setActiveSkillCategory] = useState('combat');
  const [activeTalentTree, setActiveTalentTree] = useState(0);

  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [hoveredSkillCategory, setHoveredSkillCategory] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openVialPopup, setOpenVialPopup] = useState(null); // 'health' | 'mana' | 'actionPoints' | 'exhaustion' | null
  const [headerToast, setHeaderToast] = useState(null);
  const vialPopupRef = React.useRef(null);

  // Auto-dismiss header toast
  useEffect(() => {
    if (!headerToast) return;
    const timer = setTimeout(() => setHeaderToast(null), 7000);
    return () => clearTimeout(timer);
  }, [headerToast]);

  // Live real-time ticker for active buffs & debuffs countdown
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeBuffs = useConditionStore(state => state.activeBuffs);
  const activeDebuffs = useConditionStore(state => state.activeDebuffs);
  const removeCondition = useConditionStore(state => state.removeCondition);

  React.useEffect(() => {
    if (!openVialPopup) return;
    const handleClickOutside = (e) => {
      if (vialPopupRef.current && !vialPopupRef.current.contains(e.target)) {
        setOpenVialPopup(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openVialPopup]);

  const {
    loadCharacters,
    loadCharacter,
    name,
    class: characterClass,
    race,
    subrace,
    level,
    health,
    mana,
    actionPoints,
    classResource,
    stats,
    exhaustionLevel,
    updateResource,
    updateCharacterInfo,
    updateClassResource
  } = useCharacterStore();

  // Load character data on mount
  useEffect(() => {
    const loadCharacterData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Ensure characters are loaded
        const loadedCharacters = await loadCharacters();

        // Load the specific character
        const character = loadedCharacters.find(char => char.id === characterId);

        if (!character) {
          setError('Character not found');
          setIsLoading(false);
          return;
        }

        // Load character into store
        loadCharacter(characterId);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading character:', err);
        setError('Failed to load character');
        setIsLoading(false);
      }
    };

    loadCharacterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId]); // Only re-run when characterId changes

  const handleBack = () => {
    navigate('/account', { state: { activeTab: 'characters' } });
  };

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
        { id: 'immunities', label: 'Damage Immunities', icon: 'fas fa-shield-virus' },
        { id: 'movement', label: 'Movement & Mobility', icon: 'fas fa-running' },
        { id: 'utility', label: 'Utility & Senses', icon: 'fas fa-eye' },
        { id: 'conditions', label: 'Condition Resistances', icon: 'fas fa-cross' },
        { id: 'savingThrows', label: 'Saving Throws', icon: 'fas fa-dice-d20' }
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
    spells: {
      title: 'Spells',
      icon: 'fas fa-hat-wizard'
    },
    talents: {
      title: 'Talents',
      icon: 'fas fa-sitemap',
      subSections: [
        ...(characterClass && CLASS_SPECIALIZATIONS[characterClass]
          ? CLASS_SPECIALIZATIONS[characterClass].specializations.map((spec, idx) => ({
              id: `tree_${idx}`,
              label: spec.name,
              icon: 'fas fa-tree'
            }))
          : [
              { id: 'tree_0', label: 'Tree 1', icon: 'fas fa-tree' },
              { id: 'tree_1', label: 'Tree 2', icon: 'fas fa-tree' },
              { id: 'tree_2', label: 'Tree 3', icon: 'fas fa-tree' }
            ]),
        { id: 'summary', label: 'Talent Summary', icon: 'fas fa-list-check' }
      ]
    },
    inventory: {
      title: 'Inventory',
      icon: 'fas fa-box-open',
      subSections: [
        { id: 'equipment', label: 'Equipment & Bag', icon: 'fas fa-shield-halved' },
        { id: 'library', label: 'Item Library', icon: 'fas fa-book' },
        { id: 'designer', label: 'Item Designer & Creator', icon: 'fas fa-wand-magic-sparkles' }
      ]
    }
  };

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
          <div className="character-view-talents-wrapper">
            <TalentTreeContent selectedTreeIndex={activeTalentTree} onTreeSelect={setActiveTalentTree} />
          </div>
        );
      case 'spells':
        return (
          <div className="character-view-spells-tab">
            <SpellLibraryProvider>
              <SpellLibrary />
            </SpellLibraryProvider>
            <SpellActionBar characterId={characterId} />
          </div>
        );
      case 'inventory':
        return (
          <div className="character-view-inventory-wrapper">
            <InventoryWindow />
            <SpellActionBar characterId={characterId} />
          </div>
        );
      case 'library':
        return (
          <div className="character-view-item-library-container">
            <ItemLibrary contentOnly={true} />
          </div>
        );
      case 'designer':
        return (
          <div className="character-view-item-designer-container">
            <ItemGeneration />
          </div>
        );
      case 'lore':
        return <Lore initialSection={activeLoreSection} key={activeLoreSection} />;
      default:
        return <CharacterPanel activeSubSection={activeInfoSection} setActiveSubSection={setActiveInfoSection} />;
    }
  };

  if (isLoading) {
    return (
      <div className="character-view-page">
        <div className="character-view-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading character...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="character-view-page">
        <div className="character-view-error">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button onClick={handleBack} className="back-button">
            <i className="fas fa-arrow-left"></i>
            Back to Account
          </button>
        </div>
      </div>
    );
  }

  // Get proper subrace display name
  const getSubraceDisplayName = () => {
    if (!subrace || !race) return '';

    const subraceData = getSubraceData(race, subrace);
    return subraceData ? subraceData.name : subrace;
  };

  const subraceDisplayName = getSubraceDisplayName();

  const effectiveClassResource = classResource || (characterClass ? initializeClassResource(characterClass, { ...(stats || {}), level: level || 1 }) : null);

  const healthPct = health?.max ? Math.min(100, Math.max(0, (health.current / health.max) * 100)) : 0;
  const manaPct = mana?.max ? Math.min(100, Math.max(0, (mana.current / mana.max) * 100)) : 0;
  const apPct = actionPoints?.max ? Math.min(100, Math.max(0, (actionPoints.current / actionPoints.max) * 100)) : 0;


  const isPlayerCondition = (c) => c.targetId === 'player' || c.targetId === 'current-player' || !c.targetId || c.targetId === characterId;
  const playerBuffs = (activeBuffs || []).filter(isPlayerCondition);
  const playerDebuffs = (activeDebuffs || []).filter(isPlayerCondition);

  const formatBuffRemaining = (c) => {
    const remainingSecs = Math.max(0, Math.ceil(((c.endTime || (c.startTime + (c.duration || 60) * 1000)) - now) / 1000));
    if (c.durationType === 'rounds') {
      const rounds = Math.ceil(remainingSecs / 6);
      return `${rounds}r`;
    }
    if (remainingSecs <= 0) return '0s';
    if (remainingSecs < 60) return `${remainingSecs}s`;
    const mins = Math.floor(remainingSecs / 60);
    const rem = remainingSecs % 60;
    return `${mins}:${rem.toString().padStart(2, '0')}`;
  };

  const resolveBuffIcon = (c, defaultType = 'buff') => {
    if (!c.icon) {
      return getCustomIconUrl('Utility/Utility', 'abilities');
    }
    if (typeof c.icon === 'string') {
      if (c.icon.startsWith('http') || c.icon.startsWith('/assets/')) return c.icon;
      if (c.icon.includes('/')) return getCustomIconUrl(c.icon, 'abilities');
      if (c.icon.startsWith('inv_') || c.icon.startsWith('spell_') || c.icon.startsWith('ability_')) return getIconUrl(c.icon, 'items');
    }
    return getIconUrl('inv_potion_51', 'items');
  };

  return (
    <div className="character-view-page">
      {/* Header */}
      <header className="character-view-header">
        <div className="header-top-row">
          <div className="header-left-col">
            <span
              className="header-badge level clickable"
              onClick={() => setOpenVialPopup(openVialPopup === 'level' ? null : 'level')}
              title="Click to adjust level"
            >
              {level}
            </span>
          </div>

          <div className="header-center-col">
            <h1 className="character-header-name">{name}</h1>
            <div className="character-header-badge-group">
              <span className="header-badge class">{characterClass}</span>
              {(subraceDisplayName || race) && (
                <span className="header-badge race">{subraceDisplayName || race}</span>
              )}
            </div>
          </div>

          <div className="header-right-col">
            <button onClick={handleBack} className="back-button-compact" title="Back to Account">
              <i className="fas fa-arrow-left"></i>
            </button>
          </div>
        </div>

        <div className="header-resources-row">
          {/* HP Vial */}
          <div className="header-resource-counter health" onClick={() => setOpenVialPopup(openVialPopup === 'health' ? null : 'health')} title={`Health Points: ${health?.current || 0}/${health?.max || 0} HP. Click to view & adjust.`}>
            <div className="resource-vial-bottle">
              <div className="resource-vial-fill" style={{ height: `${healthPct}%`, background: 'linear-gradient(180deg, rgba(255, 107, 107, 0.8) 0%, rgba(200, 50, 50, 0.9) 100%)' }}></div>
              <div className="resource-vial-bubbles hp-bubbles">
                <span className="bubble"></span>
                <span className="bubble"></span>
                <span className="bubble"></span>
              </div>
            </div>
            <span className="resource-vial-label">HP</span>
            <span className="resource-vial-value">{health?.current || 0}/{health?.max || 0}</span>
            <div className="resource-counter-desktop">
              <i className="fas fa-heart"></i>
              <button className="resource-adjust-btn" onClick={(e) => { e.stopPropagation(); updateResource('health', Math.max(0, (health?.current || 0) - 1), health?.max || 1); }}>−</button>
              <span className="resource-counter-value">{health?.current || 0} / {health?.max || 0}</span>
              <button className="resource-adjust-btn" onClick={(e) => { e.stopPropagation(); updateResource('health', Math.min(health?.max || 100, (health?.current || 0) + 1), health?.max || 1); }}>+</button>
            </div>
          </div>

          {/* MP Vial */}
          <div className="header-resource-counter mana" onClick={() => setOpenVialPopup(openVialPopup === 'mana' ? null : 'mana')} title={`Mana Points: ${mana?.current || 0}/${mana?.max || 0} MP. Click to view & adjust.`}>
            <div className="resource-vial-bottle">
              <div className="resource-vial-fill" style={{ height: `${manaPct}%`, background: 'linear-gradient(180deg, rgba(77, 171, 247, 0.8) 0%, rgba(30, 100, 200, 0.9) 100%)' }}></div>
              <div className="resource-vial-bubbles mp-bubbles">
                <span className="bubble"></span>
                <span className="bubble"></span>
                <span className="bubble"></span>
                <span className="bubble"></span>
              </div>
            </div>
            <span className="resource-vial-label">MP</span>
            <span className="resource-vial-value">{mana?.current || 0}/{mana?.max || 0}</span>
            <div className="resource-counter-desktop">
              <i className="fas fa-flask"></i>
              <button className="resource-adjust-btn" onClick={(e) => { e.stopPropagation(); updateResource('mana', Math.max(0, (mana?.current || 0) - 1), health?.max || 1); }}>−</button>
              <span className="resource-counter-value">{mana?.current || 0} / {mana?.max || 0}</span>
              <button className="resource-adjust-btn" onClick={(e) => { e.stopPropagation(); updateResource('mana', Math.min(mana?.max || 100, (mana?.current || 0) + 1), health?.max || 1); }}>+</button>
            </div>
          </div>

          {/* AP Vial */}
          <div className="header-resource-counter action-points" onClick={() => setOpenVialPopup(openVialPopup === 'actionPoints' ? null : 'actionPoints')} title={`Action Points: ${actionPoints?.current || 0}/${actionPoints?.max || 0} AP. Click to view & adjust.`}>
            <div className="resource-vial-bottle">
              <div className="resource-vial-fill" style={{ height: `${apPct}%`, background: 'linear-gradient(180deg, rgba(255, 212, 59, 0.8) 0%, rgba(200, 150, 0, 0.9) 100%)' }}></div>
              <div className="resource-vial-bubbles ap-bubbles">
                <span className="bubble"></span>
                <span className="bubble"></span>
                <span className="bubble"></span>
              </div>
            </div>
            <span className="resource-vial-label">AP</span>
            <span className="resource-vial-value">{actionPoints?.current || 0}/{actionPoints?.max || 0}</span>
            <div className="resource-counter-desktop">
              <i className="fas fa-bolt"></i>
              <button className="resource-adjust-btn" onClick={(e) => { e.stopPropagation(); updateResource('actionPoints', Math.max(0, (actionPoints?.current || 0) - 1), actionPoints?.max || 1); }}>−</button>
              <span className="resource-counter-value">{actionPoints?.current || 0} / {actionPoints?.max || 0}</span>
              <button className="resource-adjust-btn" onClick={(e) => { e.stopPropagation(); updateResource('actionPoints', Math.min(actionPoints?.max || 10, (actionPoints?.current || 0) + 1), actionPoints?.max || 1); }}>+</button>
            </div>
          </div>

          {/* Exhaustion Vial */}
          <div className="header-resource-counter exhaustion" onClick={() => setOpenVialPopup(openVialPopup === 'exhaustion' ? null : 'exhaustion')} title={`Exhaustion Level ${exhaustionLevel || 0}/6. Click to view stages & adjust.`}>
            <div className="resource-vial-bottle">
              <div className="resource-vial-fill" style={{ height: `${(exhaustionLevel / 6) * 100}%`, background: 'linear-gradient(180deg, rgba(160, 100, 200, 0.8) 0%, rgba(100, 50, 150, 0.9) 100%)' }} key={`exh-${exhaustionLevel}`}></div>
              <div className="resource-vial-bubbles exh-bubbles">
                <span className="bubble"></span>
                <span className="bubble"></span>
                <span className="bubble"></span>
              </div>
            </div>
            <span className="resource-vial-label">EXH</span>
            <span className="resource-vial-value">{exhaustionLevel}/6</span>
            <div className="resource-counter-desktop">
              <i className="fas fa-face-tired"></i>
              <button className="resource-adjust-btn" onClick={(e) => { e.stopPropagation(); updateCharacterInfo('exhaustionLevel', Math.max(0, (exhaustionLevel || 0) - 1)); }}>−</button>
              <span className="resource-counter-value">Lvl {exhaustionLevel}</span>
              <button className="resource-adjust-btn" onClick={(e) => { e.stopPropagation(); updateCharacterInfo('exhaustionLevel', Math.min(6, (exhaustionLevel || 0) + 1)); }}>+</button>
            </div>
          </div>
        </div>

        {/* Unique Class Resource Bar */}
        {characterClass && effectiveClassResource && (
          <div className="header-class-resource-row">
            <ClassResourceBar
              characterClass={characterClass}
              classResource={effectiveClassResource}
              character={{ health, mana, actionPoints }}
              size="normal"
              isOwner={true}
              onClassResourceUpdate={updateClassResource}
              context="account"
            />
          </div>
        )}

        {/* Active Buffs & Debuffs Row */}
        {(playerBuffs.length > 0 || playerDebuffs.length > 0) && (
          <div className="header-buffs-debuffs-row">
            <div className="header-buffs-container">
              {playerBuffs.map((buff) => {
                const timeStr = formatBuffRemaining(buff);
                const iconSrc = resolveBuffIcon(buff, 'buff');

                return (
                  <div
                    key={buff.id}
                    className="header-effect-pill buff"
                    onClick={() => removeCondition('buff', buff.id)}
                    title={`${buff.name} (${timeStr} remaining) • Click to dismiss`}
                  >
                    <div className="effect-icon-wrapper">
                      <img
                        src={iconSrc}
                        alt={buff.name}
                        className="effect-icon-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getIconUrl('inv_potion_51', 'items');
                        }}
                      />
                      <span className="effect-timer-badge">{timeStr}</span>
                    </div>
                    <div className="effect-info-wrapper">
                      <span className="effect-name">{buff.name}</span>
                      {Object.keys(buff.effects || {}).length > 0 && (
                        <span className="effect-stat-summary">
                          {Object.entries(buff.effects).map(([st, val]) => `+${val} ${st}`).join(', ')}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="effect-dismiss-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCondition('buff', buff.id);
                      }}
                      title="Dismiss Buff"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                );
              })}

              {playerDebuffs.map((debuff) => {
                const timeStr = formatBuffRemaining(debuff);
                const iconSrc = resolveBuffIcon(debuff, 'debuff');

                return (
                  <div
                    key={debuff.id}
                    className="header-effect-pill debuff"
                    onClick={() => removeCondition('debuff', debuff.id)}
                    title={`${debuff.name} (${timeStr} remaining) • Click to dismiss`}
                  >
                    <div className="effect-icon-wrapper">
                      <img
                        src={iconSrc}
                        alt={debuff.name}
                        className="effect-icon-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                        }}
                      />
                      <span className="effect-timer-badge debuff">{timeStr}</span>
                    </div>
                    <div className="effect-info-wrapper">
                      <span className="effect-name">{debuff.name}</span>
                      {Object.keys(debuff.effects || {}).length > 0 && (
                        <span className="effect-stat-summary">
                          {Object.entries(debuff.effects).map(([st, val]) => `-${val} ${st}`).join(', ')}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="effect-dismiss-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCondition('debuff', debuff.id);
                      }}
                      title="Dismiss Debuff"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Vial adjustment popup */}
        {openVialPopup && (
          <div className={`vial-popup-wrapper popup-${openVialPopup}`} ref={vialPopupRef}>
            <div className="vial-popup">
              <div className="vial-popup-header">
                <span className="vial-popup-title">
                  {openVialPopup === 'health' && <><i className="fas fa-heart"></i> Health Points (HP)</>}
                  {openVialPopup === 'mana' && <><i className="fas fa-flask"></i> Mana Points (MP)</>}
                  {openVialPopup === 'actionPoints' && <><i className="fas fa-bolt"></i> Action Points (AP)</>}
                  {openVialPopup === 'exhaustion' && <><i className="fas fa-face-tired"></i> Exhaustion (EXH)</>}
                  {openVialPopup === 'level' && <><i className="fas fa-shield-halved"></i> Character Level</>}
                </span>
                <button className="vial-popup-close" onClick={() => setOpenVialPopup(null)} title="Close popup">
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {/* Resource Descriptions & Exhaustion Breakdown */}
              <div className="vial-popup-info-section">
                {openVialPopup === 'health' && (
                  <div className="vial-popup-info-body">
                    <p className="vial-popup-desc">Hit Points represent physical endurance and overall health. Reaching 0 HP causes unconsciousness and death saves.</p>
                    <div className="vial-popup-status-badge hp-badge">Current: {health?.current || 0} / {health?.max || 0} HP ({Math.round(healthPct)}%)</div>
                  </div>
                )}
                {openVialPopup === 'mana' && (
                  <div className="vial-popup-info-body">
                    <p className="vial-popup-desc">Mana Points fuel spellcasting and magical class features.</p>
                    <div className="vial-popup-status-badge mp-badge">Current: {mana?.current || 0} / {mana?.max || 0} MP ({Math.round(manaPct)}%)</div>
                  </div>
                )}
                {openVialPopup === 'actionPoints' && (
                  <div className="vial-popup-info-body">
                    <p className="vial-popup-desc">Action Points are spent each turn to move, attack, and execute abilities in combat.</p>
                    <div className="vial-popup-status-badge ap-badge">Current: {actionPoints?.current || 0} / {actionPoints?.max || 0} AP</div>
                  </div>
                )}
                {openVialPopup === 'exhaustion' && (
                  <div className="vial-popup-info-body">
                    <p className="vial-popup-desc">Accumulating exhaustion degrades physical and mental combat capabilities across 6 stages.</p>
                    <div className="exhaustion-stages-container">
                      <div className="exhaustion-stages-title">Exhaustion Stages & Penalties:</div>
                      {[
                        { lvl: 0, label: 'Stage 0', effect: 'Healthy - No exhaustion penalties apply.' },
                        { lvl: 1, label: 'Stage 1', effect: 'Disadvantage on all ability checks.' },
                        { lvl: 2, label: 'Stage 2', effect: 'Movement speed is halved & disadvantage on checks.' },
                        { lvl: 3, label: 'Stage 3', effect: 'Disadvantage on attack rolls and saving throws.' },
                        { lvl: 4, label: 'Stage 4', effect: 'Maximum hit points are halved.' },
                        { lvl: 5, label: 'Stage 5', effect: 'Movement speed reduced to 0.' },
                        { lvl: 6, label: 'Stage 6', effect: 'Instant death.' }
                      ].map(stage => {
                        const isActive = (exhaustionLevel || 0) === stage.lvl;
                        return (
                          <div
                            key={stage.lvl}
                            className={`exhaustion-stage-row ${isActive ? 'active' : ''}`}
                            onClick={() => updateCharacterInfo('exhaustionLevel', stage.lvl)}
                            title="Click to set this exhaustion level"
                          >
                            <span className="exhaustion-stage-level">Lvl {stage.lvl}</span>
                            <span className="exhaustion-stage-effect">{stage.effect}</span>
                            {isActive && <span className="exhaustion-active-tag">ACTIVE</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {openVialPopup === 'level' && (
                  <div className="vial-popup-info-body">
                    <p className="vial-popup-desc">Character Level determines proficiency bonus, stat scaling, and feature unlocks.</p>
                    <div className="vial-popup-status-badge level-badge">Current Level: <strong>{level || 1}</strong></div>
                  </div>
                )}
              </div>

              <div className="vial-popup-buttons">
                {openVialPopup === 'health' && (
                  <>
                    <button onClick={() => updateResource('health', Math.max(0, (health?.current || 0) - 10), health?.max || 1)}>-10</button>
                    <button onClick={() => updateResource('health', Math.max(0, (health?.current || 0) - 5), health?.max || 1)}>-5</button>
                    <button onClick={() => updateResource('health', Math.max(0, (health?.current || 0) - 1), health?.max || 1)}>-1</button>
                    <button onClick={() => updateResource('health', Math.min(health?.max || 100, (health?.current || 0) + 1), health?.max || 1)}>+1</button>
                    <button onClick={() => updateResource('health', Math.min(health?.max || 100, (health?.current || 0) + 5), health?.max || 1)}>+5</button>
                    <button onClick={() => updateResource('health', Math.min(health?.max || 100, (health?.current || 0) + 10), health?.max || 1)}>+10</button>
                  </>
                )}
                {openVialPopup === 'mana' && (
                  <>
                    <button onClick={() => updateResource('mana', Math.max(0, (mana?.current || 0) - 10), mana?.max || 1)}>-10</button>
                    <button onClick={() => updateResource('mana', Math.max(0, (mana?.current || 0) - 5), mana?.max || 1)}>-5</button>
                    <button onClick={() => updateResource('mana', Math.max(0, (mana?.current || 0) - 1), mana?.max || 1)}>-1</button>
                    <button onClick={() => updateResource('mana', Math.min(mana?.max || 100, (mana?.current || 0) + 1), mana?.max || 1)}>+1</button>
                    <button onClick={() => updateResource('mana', Math.min(mana?.max || 100, (mana?.current || 0) + 5), mana?.max || 1)}>+5</button>
                    <button onClick={() => updateResource('mana', Math.min(mana?.max || 100, (mana?.current || 0) + 10), mana?.max || 1)}>+10</button>
                  </>
                )}
                {openVialPopup === 'actionPoints' && (
                  <>
                    <button onClick={() => updateResource('actionPoints', Math.max(0, (actionPoints?.current || 0) - 3), actionPoints?.max || 1)}>-3</button>
                    <button onClick={() => updateResource('actionPoints', Math.max(0, (actionPoints?.current || 0) - 1), actionPoints?.max || 1)}>-1</button>
                    <button onClick={() => updateResource('actionPoints', Math.min(actionPoints?.max || 10, (actionPoints?.current || 0) + 1), actionPoints?.max || 1)}>+1</button>
                    <button onClick={() => updateResource('actionPoints', Math.min(actionPoints?.max || 10, (actionPoints?.current || 0) + 3), actionPoints?.max || 1)}>+3</button>
                  </>
                )}
                {openVialPopup === 'exhaustion' && (
                  <>
                    <button onClick={() => updateCharacterInfo('exhaustionLevel', Math.max(0, (exhaustionLevel || 0) - 1))}>-1</button>
                    <button onClick={() => updateCharacterInfo('exhaustionLevel', 0)} className="btn-reset">Reset (0)</button>
                    <button onClick={() => updateCharacterInfo('exhaustionLevel', Math.min(6, (exhaustionLevel || 0) + 1))}>+1</button>
                  </>
                )}
                {openVialPopup === 'level' && (
                  <>
                    <button onClick={() => updateCharacterInfo('level', Math.max(1, (level || 1) - 1))}>-1</button>
                    <button onClick={() => updateCharacterInfo('level', 1)} className="btn-reset">Reset (1)</button>
                    <button onClick={() => updateCharacterInfo('level', Math.min(20, (level || 1) + 1))}>+1</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Tab Navigation Ribbon: responsive fantasy tabs with dropdowns */}
      <nav className="character-view-tabs-ribbon">
        <div className="character-view-tabs-track">
          {Object.entries(characterSections).map(([key, section]) => {
            const isActive = activeTab === key;
            const isDropdownOpen = openDropdown === key;
            const hasSubSections = Boolean(section.subSections);

            return (
              <div
                key={key}
                className={`char-tab-wrapper tab-${key}`}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`char-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(key);
                    if (hasSubSections) {
                      setOpenDropdown(prev => prev === key ? null : key);
                    } else {
                      setOpenDropdown(null);
                    }
                  }}
                  onMouseEnter={() => hasSubSections && setOpenDropdown(key)}
                  aria-expanded={isDropdownOpen}
                >
                  <i className={`${section.icon} char-tab-icon`}></i>
                  <span className="char-tab-label">{section.title}</span>
                  {hasSubSections && (
                    <i
                      className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'} char-tab-chevron`}
                    />
                  )}
                </button>

                {isDropdownOpen && section.subSections && (
                  <div className="char-tab-dropdown-menu">
                    {section.subSections.map(sub => {
                      const hasNestedSkills = key === 'skills' && section.skillItems?.[sub.id];
                      const isCategoryHovered = hoveredSkillCategory === sub.id;
                      const isSubActive = activeTab === key && (
                        (key === 'lore' && activeLoreSection === sub.id) ||
                        (key === 'character' && activeInfoSection === sub.id) ||
                        (key === 'stats' && activeStatGroup === sub.id) ||
                        (key === 'skills' && activeSkillCategory === sub.id && (!selectedSkillId || !hasNestedSkills)) ||
                        (key === 'talents' && (
                          (sub.id === 'summary' && activeTalentTree === 3) ||
                          (sub.id === `tree_${activeTalentTree}`)
                        )) ||
                        (key === 'inventory' && (
                          (sub.id === 'equipment' && activeTab === 'inventory') ||
                          (sub.id !== 'equipment' && activeTab === sub.id)
                        ))
                      );

                      return (
                        <div
                          key={sub.id}
                          className="char-dropdown-item-wrapper"
                          onMouseEnter={() => hasNestedSkills && setHoveredSkillCategory(sub.id)}
                          onMouseLeave={() => hasNestedSkills && setHoveredSkillCategory(null)}
                        >
                          <button
                            type="button"
                            className={`char-dropdown-item ${isSubActive ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (key === 'lore') {
                                setActiveTab(key);
                                setActiveLoreSection(sub.id);
                              } else if (key === 'character') {
                                setActiveTab(key);
                                setActiveInfoSection(sub.id);
                              } else if (key === 'stats') {
                                setActiveTab(key);
                                setActiveStatGroup(sub.id);
                              } else if (key === 'skills') {
                                setActiveTab(key);
                                setActiveSkillCategory(sub.id);
                                setSelectedSkillId(null);
                              } else if (key === 'talents') {
                                setActiveTab('talents');
                                if (sub.id === 'summary') {
                                  setActiveTalentTree(3);
                                } else {
                                  const idx = parseInt(sub.id.replace('tree_', ''), 10);
                                  setActiveTalentTree(isNaN(idx) ? 0 : idx);
                                }
                              } else if (key === 'inventory') {
                                if (sub.id === 'equipment') {
                                  setActiveTab('inventory');
                                } else {
                                  setActiveTab(sub.id);
                                }
                              }
                              setOpenDropdown(null);
                            }}
                          >
                            <i className={`${sub.icon} char-dropdown-icon`}></i>
                            <span className="char-dropdown-text">{sub.label}</span>
                            {hasNestedSkills && (
                              <i className="fas fa-chevron-right char-submenu-chevron"></i>
                            )}
                          </button>
                          {hasNestedSkills && isCategoryHovered && (
                            <div className="char-tab-dropdown-submenu">
                              {section.skillItems[sub.id].map(skill => (
                                <button
                                  key={skill.id}
                                  type="button"
                                  className={`char-dropdown-item char-skill-item ${
                                    (activeTab === 'skills' && activeSkillCategory === sub.id && selectedSkillId === skill.id) ? 'active' : ''
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTab('skills');
                                    setActiveSkillCategory(sub.id);
                                    setSelectedSkillId(skill.id);
                                    setOpenDropdown(null);
                                  }}
                                >
                                  <i className={`${skill.icon} char-dropdown-icon`}></i>
                                  <span className="char-dropdown-text">{skill.label}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Content Area */}
      <main className="character-view-content">
        <div className="character-view-content-wrapper">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default CharacterViewPage;

