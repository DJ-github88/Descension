import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useCharacterStore from '../../store/characterStore';
import { getSubraceData } from '../../data/raceData';
import CharacterPanel from '../character-sheet/CharacterPanel';
import CharacterStats from '../character-sheet/CharacterStats';
import Skills from '../character-sheet/Skills';
import Lore from '../character-sheet/Lore';
import InventoryWindow from '../windows/InventoryWindow';
import '../../styles/character-sheet.css';
import '../../styles/character-view-page.css';

const CharacterViewPage = () => {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('character');
  const [activeSubSection, setActiveSubSection] = useState('equipment');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubSectionDropdown, setShowSubSectionDropdown] = useState(false);
  const [openVialPopup, setOpenVialPopup] = useState(null); // 'health' | 'mana' | 'actionPoints' | 'exhaustion' | null
  const subSectionRef = React.useRef(null);
  const vialPopupRef = React.useRef(null);

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

  React.useEffect(() => {
    if (!showSubSectionDropdown) return;
    const handleClickOutside = (e) => {
      if (subSectionRef.current && !subSectionRef.current.contains(e.target)) {
        setShowSubSectionDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSubSectionDropdown]);

  const subSections = {
    equipment: { title: 'Equipment & Vitals', icon: 'fa-shield-alt' },
    passives: { title: 'Passives', icon: 'fa-star' },
    languages: { title: 'Languages', icon: 'fa-language' }
  };

  const {
    characters,
    currentCharacterId,
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
    lore,
    background,
    alignment,
    exhaustionLevel,
    updateResource,
    updateCharacterInfo
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
    character: {
      title: 'Character',
      icon: 'fa-user'
    },
    stats: {
      title: 'Stats',
      icon: 'fa-chart-bar'
    },
    skills: {
      title: 'Skills',
      icon: 'fa-book'
    },
    inventory: {
      title: 'Inventory',
      icon: 'fa-backpack'
    },
    lore: {
      title: 'Lore',
      icon: 'fa-scroll'
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'character':
        return <CharacterPanel activeSubSection={activeSubSection} setActiveSubSection={setActiveSubSection} />;
      case 'stats':
        return <CharacterStats />;
      case 'skills':
        return <Skills />;
      case 'inventory':
        return <InventoryWindow />;
      case 'lore':
        return <Lore />;
      default:
        return <CharacterPanel activeSubSection={activeSubSection} setActiveSubSection={setActiveSubSection} />;
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

  const healthPct = health?.max ? Math.min(100, Math.max(0, (health.current / health.max) * 100)) : 0;
  const manaPct = mana?.max ? Math.min(100, Math.max(0, (mana.current / mana.max) * 100)) : 0;
  const apPct = actionPoints?.max ? Math.min(100, Math.max(0, (actionPoints.current / actionPoints.max) * 100)) : 0;

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
          <div className="header-resource-counter health" onClick={() => setOpenVialPopup(openVialPopup === 'health' ? null : 'health')}>
            <div className="resource-vial-bottle">
              <div className="resource-vial-fill" style={{ height: `${healthPct}%`, background: 'linear-gradient(180deg, rgba(255, 107, 107, 0.8) 0%, rgba(200, 50, 50, 0.9) 100%)' }}></div>
              <div className="resource-vial-bubbles hp-bubbles">
                <span className="bubble">+</span>
                <span className="bubble">+</span>
                <span className="bubble">+</span>
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
          <div className="header-resource-counter mana" onClick={() => setOpenVialPopup(openVialPopup === 'mana' ? null : 'mana')}>
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
              <button className="resource-adjust-btn" onClick={(e) => { e.stopPropagation(); updateResource('mana', Math.max(0, (mana?.current || 0) - 1), mana?.max || 1); }}>−</button>
              <span className="resource-counter-value">{mana?.current || 0} / {mana?.max || 0}</span>
              <button className="resource-adjust-btn" onClick={(e) => { e.stopPropagation(); updateResource('mana', Math.min(mana?.max || 100, (mana?.current || 0) + 1), mana?.max || 1); }}>+</button>
            </div>
          </div>

          {/* AP Vial */}
          <div className="header-resource-counter action-points" onClick={() => setOpenVialPopup(openVialPopup === 'actionPoints' ? null : 'actionPoints')}>
            <div className="resource-vial-bottle">
              <div className="resource-vial-fill" style={{ height: `${apPct}%`, background: 'linear-gradient(180deg, rgba(255, 212, 59, 0.8) 0%, rgba(200, 150, 0, 0.9) 100%)' }}></div>
              <div className="resource-vial-bubbles ap-bubbles">
                <span className="bubble">⚡</span>
                <span className="bubble">⚡</span>
                <span className="bubble">⚡</span>
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
          <div className="header-resource-counter exhaustion" onClick={() => setOpenVialPopup(openVialPopup === 'exhaustion' ? null : 'exhaustion')}>
            <div className="resource-vial-bottle">
              <div className="resource-vial-fill" style={{ height: `${(exhaustionLevel / 6) * 100}%`, background: 'linear-gradient(180deg, rgba(160, 100, 200, 0.8) 0%, rgba(100, 50, 150, 0.9) 100%)' }} key={`exh-${exhaustionLevel}`}></div>
              <div className="resource-vial-bubbles exh-bubbles">
                <span className="bubble">Z</span>
                <span className="bubble">z</span>
                <span className="bubble">Z</span>
              </div>
            </div>
            <span className="resource-vial-label">EXH</span>
            <span className="resource-vial-value">{exhaustionLevel}/6</span>
            <div className="resource-counter-desktop">
              <i className="fas fa-tired"></i>
              <button className="resource-adjust-btn" onClick={(e) => { e.stopPropagation(); updateCharacterInfo('exhaustionLevel', Math.max(0, (exhaustionLevel || 0) - 1)); }}>−</button>
              <span className="resource-counter-value">Lvl {exhaustionLevel}</span>
              <button className="resource-adjust-btn" onClick={(e) => { e.stopPropagation(); updateCharacterInfo('exhaustionLevel', Math.min(6, (exhaustionLevel || 0) + 1)); }}>+</button>
            </div>
          </div>
        </div>

        {/* Vial adjustment popup */}
        {openVialPopup && (
          <div className="vial-popup-wrapper" ref={vialPopupRef}>
            <div className="vial-popup">
              <div className="vial-popup-header">
                <span className="vial-popup-title">
                  {openVialPopup === 'health' && 'Adjust Health'}
                  {openVialPopup === 'mana' && 'Adjust Mana'}
                  {openVialPopup === 'actionPoints' && 'Adjust Action Points'}
                  {openVialPopup === 'exhaustion' && 'Adjust Exhaustion'}
                  {openVialPopup === 'level' && 'Adjust Level'}
                </span>
                <button className="vial-popup-close" onClick={() => setOpenVialPopup(null)}>� - </button>
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
                    <button onClick={() => updateCharacterInfo('exhaustionLevel', 0)}>Reset</button>
                    <button onClick={() => updateCharacterInfo('exhaustionLevel', Math.min(6, (exhaustionLevel || 0) + 1))}>+1</button>
                  </>
                )}
                {openVialPopup === 'level' && (
                  <>
                    <button onClick={() => updateCharacterInfo('level', Math.max(1, (level || 1) - 1))}>-1</button>
                    <button onClick={() => updateCharacterInfo('level', 1)}>Reset</button>
                    <button onClick={() => updateCharacterInfo('level', Math.min(20, (level || 1) + 1))}>+1</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Tab Navigation: main tabs always visible as a row.
          "Character" tab has a dropdown for sub-sections (Equipment & Vitals / Passives / Languages). */}
      <nav className="character-view-tabs">
        {Object.entries(characterSections).map(([key, section]) => {
          if (key === 'character') {
            return (
              <button
                key={key}
                className={`character-view-tab ${activeTab === key ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(key);
                  setShowSubSectionDropdown(prev => !prev);
                }}
              >
                <i className={`fas ${section.icon}`}></i>
                <span>{section.title}</span>
                <i className={`fas fa-chevron-${showSubSectionDropdown ? 'up' : 'down'} tab-chevron`}></i>
              </button>
            );
          }
          return (
            <button
              key={key}
              className={`character-view-tab ${activeTab === key ? 'active' : ''}`}
              onClick={() => { setActiveTab(key); setShowSubSectionDropdown(false); }}
            >
              <i className={`fas ${section.icon}`}></i>
              <span>{section.title}</span>
            </button>
          );
        })}
      </nav>

      {/* Sub-section dropdown: rendered outside the tabs nav to avoid overflow clipping */}
      {showSubSectionDropdown && (
        <div className="character-view-sub-dropdown-wrapper" ref={subSectionRef}>
          <div className="character-view-sub-dropdown">
            {Object.entries(subSections).map(([subKey, subSection]) => (
              <button
                key={subKey}
                className={`character-view-sub-dropdown-item ${activeSubSection === subKey ? 'active' : ''}`}
                onClick={() => {
                  setActiveSubSection(subKey);
                  setActiveTab('character');
                  setShowSubSectionDropdown(false);
                }}
              >
                <i className={`fas ${subSection.icon}`}></i>
                <span>{subSection.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      <main className="character-view-content">
        <div className="character-view-content-wrapper">
          {renderContent()}
        </div>
      </main>

      {/* Sync Indicator */}
      <div className="character-view-sync-indicator">
        <i className="fas fa-sync-alt"></i>
        <span>Changes auto-save to Firebase</span>
      </div>
    </div>
  );
};

export default CharacterViewPage;

