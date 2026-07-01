import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useCharacterStore from '../../store/characterStore';
import { getSubraceData } from '../../data/raceData';
import CharacterPanel from '../character-sheet/Equipment';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
    updateResource
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
        return <CharacterPanel />;
      case 'stats':
        return <CharacterStats />;
      case 'skills':
        return <Skills />;
      case 'inventory':
        return <InventoryWindow />;
      case 'lore':
        return <Lore />;
      default:
        return <CharacterPanel />;
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
            <button onClick={handleBack} className="back-button-compact" title="Back to Account">
              <i className="fas fa-arrow-left"></i>
            </button>
            <span className="header-badge race">{subraceDisplayName || race}</span>
          </div>

          <div className="header-center-col">
            <h1 className="character-header-name">{name}</h1>
            <div className="character-header-badge-group">
              <span className="header-badge level">Lvl {level}</span>
              <span className="header-badge class">{characterClass}</span>
            </div>
          </div>

          <div className="header-right-col">
            {background && <span className="header-badge background">{background}</span>}
            {alignment && <span className="header-badge alignment">{alignment}</span>}
            {exhaustionLevel > 0 && <span className="header-badge exhaustion">Exh {exhaustionLevel}</span>}
          </div>
        </div>

        <div className="header-resources-row">
          <div className="header-resource-counter health" style={{
            background: `linear-gradient(90deg, rgba(255, 107, 107, 0.25) 0%, rgba(255, 107, 107, 0.25) ${healthPct}%, rgba(0, 0, 0, 0.4) ${healthPct}%)`
          }}>
            <i className="fas fa-heart"></i>
            <button className="resource-adjust-btn" onClick={() => updateResource('health', Math.max(0, (health?.current || 0) - 1), health?.max || 1)}>−</button>
            <span className="resource-counter-value">{health?.current || 0} / {health?.max || 0}</span>
            <button className="resource-adjust-btn" onClick={() => updateResource('health', Math.min(health?.max || 100, (health?.current || 0) + 1), health?.max || 1)}>+</button>
          </div>

          <div className="header-resource-counter mana" style={{
            background: `linear-gradient(90deg, rgba(77, 171, 247, 0.25) 0%, rgba(77, 171, 247, 0.25) ${manaPct}%, rgba(0, 0, 0, 0.4) ${manaPct}%)`
          }}>
            <i className="fas fa-flask"></i>
            <button className="resource-adjust-btn" onClick={() => updateResource('mana', Math.max(0, (mana?.current || 0) - 1), mana?.max || 1)}>−</button>
            <span className="resource-counter-value">{mana?.current || 0} / {mana?.max || 0}</span>
            <button className="resource-adjust-btn" onClick={() => updateResource('mana', Math.min(mana?.max || 100, (mana?.current || 0) + 1), mana?.max || 1)}>+</button>
          </div>

          <div className="header-resource-counter action-points" style={{
            background: `linear-gradient(90deg, rgba(255, 212, 59, 0.25) 0%, rgba(255, 212, 59, 0.25) ${apPct}%, rgba(0, 0, 0, 0.4) ${apPct}%)`
          }}>
            <i className="fas fa-bolt"></i>
            <button className="resource-adjust-btn" onClick={() => updateResource('actionPoints', Math.max(0, (actionPoints?.current || 0) - 1), actionPoints?.max || 1)}>−</button>
            <span className="resource-counter-value">{actionPoints?.current || 0} / {actionPoints?.max || 0}</span>
            <button className="resource-adjust-btn" onClick={() => updateResource('actionPoints', Math.min(actionPoints?.max || 10, (actionPoints?.current || 0) + 1), actionPoints?.max || 1)}>+</button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="character-view-tabs">
        {Object.entries(characterSections).map(([key, section]) => (
          <button
            key={key}
            className={`character-view-tab ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            <i className={`fas ${section.icon}`}></i>
            <span>{section.title}</span>
          </button>
        ))}
      </nav>

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

