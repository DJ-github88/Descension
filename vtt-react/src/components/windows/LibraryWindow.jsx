import React, { useState, useCallback } from 'react';
import WowWindow from '../windows/WowWindow';
import useWindowStore from '../../store/windowStore';
import useGameStore from '../../store/gameStore';
import CreatureLibrary from '../creature-wizard/components/library/CreatureLibrary';
import { CreatureLibraryProvider } from '../creature-wizard/context/CreatureLibraryContext';
import { CreatureWizardProvider } from '../creature-wizard/context/CreatureWizardContext';
import CreatureWizardApp from '../creature-wizard/CreatureWizardApp';
import CommunityCreaturesTab from '../creature-wizard/components/library/CommunityCreaturesTab';
import ItemLibrary from '../item-generation/ItemLibrary';
import MapLibraryWindow from '../windows/MapLibraryWindow';

const WINDOW_ID = 'library';

const SECTIONS = [
  {
    id: 'creatures',
    label: 'Bestiary',
    subtitle: 'Creature library & creator',
    icon: 'fas fa-dragon',
    gradient: 'linear-gradient(135deg, #3d2b1f 0%, #5c3d2e 50%, #2a1a0e 100%)',
    accentColor: '#c0392b',
    borderGlow: '0 0 20px rgba(192, 57, 43, 0.3)',
    tabs: [
      { id: 'library', label: 'Library', icon: 'fas fa-book-open' },
      { id: 'wizard', label: 'Create New', icon: 'fas fa-plus-circle' },
      { id: 'community', label: 'Community', icon: 'fas fa-globe' },
    ],
  },
  {
    id: 'items',
    label: 'Armory',
    subtitle: 'Weapons, armor & artifacts',
    icon: 'fas fa-gem',
    gradient: 'linear-gradient(135deg, #1a2744 0%, #2c3e6b 50%, #0f1a2e 100%)',
    accentColor: '#2980b9',
    borderGlow: '0 0 20px rgba(41, 128, 185, 0.3)',
    tabs: [
      { id: 'library', label: 'Library', icon: 'fas fa-book-open' },
      { id: 'designer', label: 'Designer', icon: 'fas fa-hammer' },
      { id: 'community', label: 'Community', icon: 'fas fa-globe' },
    ],
  },
  {
    id: 'maps',
    label: 'Atlas',
    subtitle: 'Maps & environments',
    icon: 'fas fa-map',
    gradient: 'linear-gradient(135deg, #1a3320 0%, #2d5a3e 50%, #0f2216 100%)',
    accentColor: '#27ae60',
    borderGlow: '0 0 20px rgba(39, 174, 96, 0.3)',
    tabs: [
      { id: 'library', label: 'Library', icon: 'fas fa-map' },
    ],
  },
];

const LibraryWindow = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [subTabs, setSubTabs] = useState({});
  const { getWindowPosition, getWindowSize, setWindowPosition, setWindowSize } = useWindowStore();
  const isGMMode = useGameStore(state => state.isGMMode);

  const savedPos = getWindowPosition(WINDOW_ID, { x: 80, y: 80 });
  const savedSize = getWindowSize(WINDOW_ID, { width: 1100, height: 700 });

  const handleDrag = useCallback((pos) => {
    setWindowPosition(WINDOW_ID, { x: pos.x, y: pos.y });
  }, [setWindowPosition]);

  const handleResize = useCallback((size) => {
    setWindowSize(WINDOW_ID, size);
  }, [setWindowSize]);

  const handleBack = useCallback(() => {
    setActiveSection(null);
  }, []);

  const handleSectionClick = useCallback((sectionId) => {
    setActiveSection(sectionId);
    setSubTabs(prev => ({
      ...prev,
      [sectionId]: prev[sectionId] || 'library',
    }));
  }, []);

  const handleSubTabChange = useCallback((sectionId, tabId) => {
    setSubTabs(prev => ({
      ...prev,
      [sectionId]: tabId,
    }));
  }, []);

  const currentSection = SECTIONS.find(s => s.id === activeSection);
  const currentSubTab = activeSection ? (subTabs[activeSection] || 'library') : null;
  const title = currentSection ? currentSection.label : 'Library';

  const [creatureEditingId, setCreatureEditingId] = useState(null);

  const handleEditCreature = useCallback((creatureId) => {
    setCreatureEditingId(creatureId);
    handleSubTabChange('creatures', 'wizard');
  }, [handleSubTabChange]);

  const handleBackToLibrary = useCallback(() => {
    setCreatureEditingId(null);
    handleSubTabChange('creatures', 'library');
  }, [handleSubTabChange]);

  const renderCreatureContent = () => {
    if (currentSubTab === 'library') {
      return <CreatureLibrary onEdit={handleEditCreature} />;
    }
    if (currentSubTab === 'wizard') {
      return (
        <CreatureWizardApp
          editMode={!!creatureEditingId}
          creatureId={creatureEditingId}
          onSave={handleBackToLibrary}
          onCancel={handleBackToLibrary}
          activeView={currentSubTab}
        />
      );
    }
    if (currentSubTab === 'community') {
      return <CommunityCreaturesTab />;
    }
    return null;
  };

  const renderTabsHeader = () => {
    if (!currentSection || !currentSection.tabs) return null;
    if (currentSection.tabs.length <= 1) return null;

    return (
      <div className="spellbook-tab-container">
        <button
          className={`spellbook-tab-button`}
          onClick={handleBack}
          style={{ maxWidth: '80px' }}
        >
          <i className="fas fa-arrow-left" style={{ marginRight: '6px', fontSize: '11px' }}></i>
          <span>Back</span>
        </button>
        {currentSection.tabs.map(tab => (
          <button
            key={tab.id}
            className={`spellbook-tab-button ${currentSubTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              if (tab.id === 'wizard' && activeSection === 'creatures') {
                setCreatureEditingId(null);
              }
              handleSubTabChange(activeSection, tab.id);
            }}
          >
            <i className={tab.icon} style={{ marginRight: '8px', fontSize: '13px' }}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <WowWindow
      isOpen={isOpen}
      onClose={activeSection ? handleBack : onClose}
      title={title}
      defaultPosition={savedPos}
      defaultSize={savedSize}
      onDrag={handleDrag}
      onResize={handleResize}
      minConstraints={[700, 500]}
      customHeader={activeSection ? renderTabsHeader() : null}
    >
      {!activeSection ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          padding: '40px 60px',
          gap: '32px',
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '8px',
          }}>
            <h2 style={{
              fontFamily: "'Bookman Old Style', 'Garamond', serif",
              color: '#4a3b2d',
              fontSize: '28px',
              fontWeight: '700',
              margin: 0,
              letterSpacing: '1px',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}>
              Grand Library
            </h2>
            <div style={{
              width: '120px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #a08c70, transparent)',
              margin: '12px auto 0',
            }} />
            <p style={{
              fontFamily: "'Bookman Old Style', 'Garamond', serif",
              color: '#8b7d6b',
              fontSize: '14px',
              marginTop: '8px',
              fontStyle: 'italic',
            }}>
              Choose a section to explore
            </p>
          </div>

          <div style={{
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {SECTIONS.map(section => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className="library-section-card"
                style={{
                  background: section.gradient,
                  border: `2px solid ${section.accentColor}40`,
                  boxShadow: section.borderGlow,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = section.accentColor;
                  e.currentTarget.style.boxShadow = `0 8px 30px ${section.accentColor}50`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${section.accentColor}40`;
                  e.currentTarget.style.boxShadow = section.borderGlow;
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at 50% 30%, ${section.accentColor}15, transparent 70%)`,
                  pointerEvents: 'none',
                }} />
                <div className="inner-gold-border" />
                <div className="section-icon-container">
                  <i className={section.icon} style={{
                    color: section.accentColor,
                    filter: `drop-shadow(0 0 8px ${section.accentColor}60)`,
                    fontSize: '42px'
                  }} />
                </div>
                <span className="section-label">
                  {section.label}
                </span>
                <span className="section-subtitle">
                  {section.subtitle}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flex: 1, minHeight: 0, flexDirection: 'column' }}>
          {activeSection === 'creatures' && (
            <CreatureLibraryProvider>
              <CreatureWizardProvider>
                <div className="creature-window">
                  <div className="creature-window-content">
                    {renderCreatureContent()}
                  </div>
                </div>
              </CreatureWizardProvider>
            </CreatureLibraryProvider>
          )}
          {activeSection === 'items' && (
            <ItemLibrary
              key={`items-${currentSubTab}`}
              onClose={onClose}
              contentOnly={true}
              initialTab={currentSubTab}
            />
          )}
          {activeSection === 'maps' && (
            <MapLibraryWindow isOpen={true} onClose={onClose} contentOnly={true} />
          )}
        </div>
      )}
    </WowWindow>
  );
};

export default LibraryWindow;
