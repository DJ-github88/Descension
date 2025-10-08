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
    exhaustionLevel
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

  return (
    <div className="character-view-page">
      {/* Header */}
      <header className="character-view-header">
        <button onClick={handleBack} className="back-button">
          <i className="fas fa-arrow-left"></i>
          Back
        </button>

        <div className="character-view-title">
          <h1>{name}</h1>
          <div className="character-view-subtitle">
            <span className="character-level">Level {level}</span>
            <span className="character-class">{characterClass}</span>
            <span className="character-race">{subraceDisplayName || race}</span>
            {background && <span className="character-background">{background}</span>}
            {alignment && <span className="character-alignment">{alignment}</span>}
            {exhaustionLevel > 0 && <span className="character-exhaustion">Exhaustion {exhaustionLevel}</span>}
          </div>
        </div>

        <div className="character-view-resources">
          <div className="resource-display health">
            <i className="fas fa-heart"></i>
            <span>{health?.current || 0} / {health?.max || 0}</span>
          </div>
          <div className="resource-display mana">
            <i className="fas fa-flask"></i>
            <span>{mana?.current || 0} / {mana?.max || 0}</span>
          </div>
          <div className="resource-display action-points">
            <i className="fas fa-bolt"></i>
            <span>{actionPoints?.current || 0} / {actionPoints?.max || 0}</span>
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

