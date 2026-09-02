import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import MythrillWindow from '../windows/MythrillWindow';
import useWindowStore from '../../store/windowManagerStore';
import useGameStore from '../../store/gameStore';
import CreatureLibrary from '../creature-wizard/components/library/CreatureLibrary';
import { CreatureLibraryProvider } from '../creature-wizard/context/CreatureLibraryContext';
import { CreatureWizardProvider } from '../creature-wizard/context/CreatureWizardContext';
import CreatureWizardApp from '../creature-wizard/CreatureWizardApp';
import CommunityCreaturesTab from '../creature-wizard/components/library/CommunityCreaturesTab';
import ItemLibrary from '../item-generation/ItemLibrary';
import MapLibraryWindow from '../windows/MapLibraryWindow';
import '../../styles/library-bookshelf.css';

const WINDOW_ID = 'library';

const HIDDEN_GEMS = {
  'sheet-happens': {
    title: 'Sheet Happens',
    icon: 'fas fa-clipboard-list',
    subtitle: 'A support guide for the statistically optimistic',
    leather: { a: '#2e2318', b: '#463522', c: '#3a2c1c' }, accent: '#c8a45a', tilt: '-1.5deg',
    content: [
      {
        heading: 'Chapter One — The Blank Page',
        paragraphs: [
          'Every character sheet begins life as a promise. Six numbers, a name, and the quiet confidence of someone who has not yet met a saving throw.',
        ],
      },
      {
        heading: 'Chapter Two — Darkvision Exists',
        paragraphs: [
          'You wrote it down. It has been on the sheet the whole time. This chapter teaches you to stop asking the table whether you can see in the dark, and to start trusting the one line of text that has been correct since session zero.',
        ],
      },
      {
        heading: 'Chapter Three — The Math Is Made Up',
        paragraphs: [
          'Confidence is a modifier. Studies within this book show that players who cannot explain their bonus succeed almost as often as players who can, and have considerably more fun during the explanation.',
        ],
        list: [
          'If the modifier is +0, smile.',
          'If the modifier is negative, smile wider.',
          'If someone audits the math, cite Chapter Three.',
        ],
      },
    ],
  },
  'mimic-precautions': {
    title: '101 Mimic Precautions',
    icon: 'fas fa-box-open',
    subtitle: 'Because the furniture is watching',
    leather: { a: '#2e1414', b: '#4e2020', c: '#3c1a1a' }, accent: '#d0655a', tilt: '1deg',
    content: [
      {
        heading: 'A Note From the Surviving Author',
        paragraphs: [
          'The original edition listed one hundred and one precautions. It is out of print, along with its author. What follows is the safe half of the list.',
        ],
      },
      {
        heading: 'The Precautions',
        list: [
          '1. The chest is a mimic.',
          '2. The stool is a mimic. You are sitting on the stool.',
          '7. Tap everything with the ten-foot pole. The pole is not a mimic. Probably.',
          '12. If the treasure room is dustier than the corridor, the dust is decorative.',
          '23. A mimic that passed its disguise check also gets a performance check. Compliment the hinges.',
          '48. If your rogue licks the lock and frowns, stop the rogue.',
          '77. The door you did not check leads to the room the last mimic was from.',
          '100. There is no precaution 100. The list itself is a mimic. Read something safe, like 99.',
        ],
      },
    ],
  },
  'adopted-villain': {
    title: 'The Adopted Villain',
    icon: 'fas fa-masks-theater',
    subtitle: 'From nemesis to nap-time companion',
    leather: { a: '#221a2e', b: '#382c4a', c: '#2c2238' }, accent: '#a98fd4', tilt: '-1deg',
    content: [
      {
        heading: 'Step One — Defeat, Loosely Defined',
        paragraphs: [
          'The battle went badly. For you. The dark lord had you at blade-point, and then the bard made a joke, and now everyone is laughing and the dark lord is laughing too and nobody can quite remember who was invading whom.',
        ],
      },
      {
        heading: 'Step Two — Naming Rights',
        paragraphs: [
          'He had a title, three syllables of doom, and an estate full of politically loyal spiders. The party named him Gregory within the minute. Do not resist this. Gregory fits.',
        ],
      },
      {
        heading: 'Step Three — The Mascot Arc',
        paragraphs: [
          'By nightfall Gregory is carrying the torch, warning the wizard about the loose flagstone, and taking his tea sweetened. Let it happen.',
          'Appendix A covers what to do when the actual villain arrives and asks Gregory to please come home. The short version: put the kettle on. Nobody leaves a family mid-brew.',
        ],
      },
    ],
  },
  cartography: {
    title: 'Cartography for Liars',
    icon: 'fas fa-map',
    subtitle: 'The coast is wherever you say it is',
    leather: { a: '#0f2426', b: '#1e4042', c: '#183334' }, accent: '#4fb3a5', tilt: '1.5deg',
    content: [
      {
        heading: 'The First Rule of Ink',
        paragraphs: [
          'Draw the mountain range first. Mountains excuse everything: weather, delays, the vague feeling that the road disagrees with the map. A confident mountain range has ended more arguments than any rulebook.',
        ],
      },
      {
        heading: 'Here Be Borrowed Villages',
        paragraphs: [
          'Every game master owns exactly one village. Rename it. Move the river. Swap the harvest festival for a conspiracy. The tavern keeps its name — that is what makes it feel like home.',
        ],
      },
      {
        heading: 'The Compass Concession',
        paragraphs: [
          'North is a tradition, not a fact. If a player checks the sun against your map, hand them a ration card and compliment their instincts. Cartography, practiced honestly, is just lying with excellent penmanship.',
        ],
      },
    ],
  },
  'bardic-insults': {
    title: 'Bardic Insults, Annotated',
    icon: 'fas fa-music',
    subtitle: 'Footnoted for your protection',
    leather: { a: '#2e1020', b: '#4e1f38', c: '#3c1830' }, accent: '#d478a8', tilt: '-1.2deg',
    content: [
      {
        heading: 'From the Margins of Surviving Performances',
        paragraphs: [
          'A verse is a weapon that fires in both directions. The annotations below were collected from the few audience members willing to discuss the evenings in question.',
        ],
      },
      {
        heading: 'Selected Works',
        list: [
          '"Your mother was a kobold." — See Appendix C for why this starts fights. Kobolds are famously devoted parents. You have complimented the dragon\'s kin. Anything is possible now.',
          '"Thy grace doth rival a resting ox." — Surprisingly effective against cavalry officers. Beware farm unions.',
          '"I have met smarter sacks of turnips." — Turnip merchants consider this a sales pitch. Know your audience before you rhyme.',
        ],
      },
      {
        heading: 'The Standing Warning',
        paragraphs: [
          'Whoever annotates the insults will eventually annotate the wrong one. Volume II contains a full chapter on apologizing in rhyme. It rhymes. That cannot be helped.',
        ],
      },
    ],
  },
  'door-handling': {
    title: 'Advanced Door Handling',
    icon: 'fas fa-door-open',
    subtitle: "Architecture's greatest adversary",
    leather: { a: '#2b1d0e', b: '#452f16', c: '#372512' }, accent: '#c89b52', tilt: '1deg',
    content: [
      {
        heading: 'The Kick Fallacy',
        paragraphs: [
          'Beginners kick. Kicking announces you, bruises your toe, and wakes up the thing the door was politely containing. The door is not the obstacle. The door is the messenger.',
        ],
      },
      {
        heading: 'The Persuasion School',
        paragraphs: [
          'Talk to the door. Compliment the hinges. Doors, like their mimic cousins, respond to respect. Graduates of this school report a one-hundred-percent success rate on doors that were going to open anyway, which is how scholarship works.',
        ],
      },
      {
        heading: 'The Checklist',
        list: [
          'Is it locked?',
          'Is it trapped?',
          'Is it, on reflection, a door at all?',
          'Is it another mimic? (See 101 Mimic Precautions, stool chapter.)',
          'Is the rogue already inside? This is the common case. Proceed directly to looting etiquette.',
        ],
      },
    ],
  },
  rulings: {
    title: 'Rulings, Not Rules',
    icon: 'fas fa-gavel',
    subtitle: 'Table law for the tired referee',
    leather: { a: '#1a2029', b: '#2c3644', c: '#232c38' }, accent: '#9db4cc', tilt: '-0.6deg',
    content: [
      {
        heading: 'The d6 Decree',
        paragraphs: [
          'If the rulebook is silent, the game master is sweating, and the players are circling, the answer is a d6. Odd: yes. Even: also yes, but slower. This ruling has never once been appealed successfully.',
        ],
      },
      {
        heading: 'Snacks as Currency',
        paragraphs: [
          'Table law holds that whoever brought snacks may reroll once per session. This appears in no official document. It does not need to. Some laws are load-bearing.',
        ],
      },
      {
        heading: 'On Officialdom',
        paragraphs: [
          'The rulebook is a suggestion with excellent public relations. The real rules are three: be fair, be swift, and never — under any circumstances — look up a spell in the middle of the drama. The drama is the ruling.',
        ],
      },
    ],
  },
  'ethical-looting': {
    title: 'Ethical Looting for Beginners',
    icon: 'fas fa-feather-pointed',
    subtitle: 'Probate for the prompt and the armed',
    leather: { a: '#241c0d', b: '#3f3216', c: '#332812' }, accent: '#d0b05a', tilt: '1.2deg',
    content: [
      {
        heading: 'Rule One — Gifting',
        paragraphs: [
          'If the former owner did not leave a written will, the loot is legally a gift. Adventuring takes place almost exclusively in dungeons, crypts, and ruins — precisely the places where paperwork has gone missing. The system, whatever its flaws, works in your favor.',
        ],
      },
      {
        heading: 'Rule Two — Dragons Donate',
        paragraphs: [
          'A hoard is best understood as a long-term charitable trust with scales. Collecting it merely accelerates the payout. You are, in the eyes of any reasonable accountant, a nonprofit.',
        ],
      },
      {
        heading: 'Rule Three — Say Thank You',
        list: [
          'Thank the estate.',
          'Thank the trap that nearly ended you. It taught you something.',
          'Thank the mimic. It too gave you something: perspective.',
          'Gratitude costs nothing and has never once summoned anything.',
        ],
      },
    ],
  },
  'tavern-fire': {
    title: 'Why Is the Tavern Always on Fire?',
    icon: 'fas fa-fire',
    subtitle: 'Findings from a twelve-year study',
    leather: { a: '#26120a', b: '#452211', c: '#371b0e' }, accent: '#e0854a', tilt: '-1.4deg',
    content: [
      {
        heading: 'Methodology',
        paragraphs: [
          'Twelve years. Forty-four taverns. One increasingly patient fire-insurance adjuster. We asked the hard question, and then we stopped asking it, because the bard was right there, tuning the lute.',
        ],
      },
      {
        heading: 'Findings',
        list: [
          'Finding A: in 41 of 44 cases, the fire began within one verse of the lute being tuned.',
          'Finding B: in the remaining 3 cases, the bard was already holding the lute.',
          'Finding C: exposed-beam architecture is a contributing factor and should be studied by someone braver than this author.',
        ],
      },
      {
        heading: 'Prevention',
        paragraphs: [
          'Hide the lute. Not forever — the tavern needs its spirit — just until the last wagon has left for the night.',
          'Full peer review is pending. The first review committee\'s tavern also burned down.',
        ],
      },
    ],
  },
};

const SHELF_ROW = [
  { type: 'gem', id: 'sheet-happens' },
  { type: 'gem', id: 'mimic-precautions' },
  { type: 'section', id: 'creatures' },
  { type: 'gem', id: 'ethical-looting' },
  { type: 'gem', id: 'adopted-villain' },
  { type: 'section', id: 'items' },
  { type: 'gem', id: 'cartography' },
  { type: 'gem', id: 'bardic-insults' },
  { type: 'section', id: 'maps' },
  { type: 'gem', id: 'door-handling' },
  { type: 'gem', id: 'rulings' },
  { type: 'gem', id: 'tavern-fire' },
];

const SECTIONS = [
  {
    id: 'creatures',
    label: 'Bestiary',
    subtitle: 'Creature library & creator',
    icon: 'fas fa-dragon',
    gradient: 'linear-gradient(135deg, #3d2b1f 0%, #5c3d2e 50%, #2a1a0e 100%)',
    accentColor: '#c0392b',
    borderGlow: '0 4px 22px rgba(192, 57, 43, 0.35)',
    features: ['Monsters & Beasts', 'Custom Creator', 'Community Spells'],
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
    icon: 'fas fa-shield-halved',
    gradient: 'linear-gradient(135deg, #1a2744 0%, #2c3e6b 50%, #0f1a2e 100%)',
    accentColor: '#2980b9',
    borderGlow: '0 4px 22px rgba(41, 128, 185, 0.35)',
    features: ['Equipment Catalog', 'Item Forge', 'Shared Artifacts'],
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
    icon: 'fas fa-map-location-dot',
    gradient: 'linear-gradient(135deg, #1a3320 0%, #2d5a3e 50%, #0f2216 100%)',
    accentColor: '#27ae60',
    borderGlow: '0 4px 22px rgba(39, 174, 96, 0.35)',
    features: ['Battle Grids', 'Environment Scenes', 'Grid Settings'],
    tabs: [
      { id: 'library', label: 'Library', icon: 'fas fa-map' },
    ],
  },
];

const LibraryWindow = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [activeBook, setActiveBook] = useState(null);
  const [hoverNote, setHoverNote] = useState(null);
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
    setHoverNote(null);
    setActiveSection(null);
  }, []);

  const handleBackFromBook = useCallback(() => {
    setHoverNote(null);
    setActiveBook(null);
  }, []);

  const handleSectionClick = useCallback((sectionId) => {
    setHoverNote(null);
    setActiveSection(sectionId);
    setSubTabs(prev => ({
      ...prev,
      [sectionId]: prev[sectionId] || 'library',
    }));
  }, []);

  const handleGemClick = useCallback((gemId) => {
    setHoverNote(null);
    setActiveBook(gemId);
  }, []);

  const showNote = useCallback((e, title, subtitle, hint = 'Click to open the tome') => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = 280;
    const left = Math.max(12, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 12));
    const above = rect.top > 170;
    setHoverNote({
      title,
      subtitle,
      hint,
      left,
      top: above ? rect.top - 12 : rect.bottom + 12,
      above,
    });
  }, []);

  const hideNote = useCallback(() => {
    setHoverNote(null);
  }, []);

  const handleSubTabChange = useCallback((sectionId, tabId) => {
    setSubTabs(prev => ({
      ...prev,
      [sectionId]: tabId,
    }));
  }, []);

  const currentSection = SECTIONS.find(s => s.id === activeSection);
  const activeGem = activeBook ? HIDDEN_GEMS[activeBook] : null;
  const currentSubTab = activeSection ? (subTabs[activeSection] || 'library') : null;
  const title = currentSection ? currentSection.label : (activeGem ? activeGem.title : '');

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

  const renderBookHeader = () => {
    if (!activeGem) return null;

    return (
      <div className="spellbook-tab-container">
        <button
          className="spellbook-tab-button tab-icon-only"
          onClick={handleBackFromBook}
          onMouseEnter={(e) => showNote(e, 'Shelf', 'Back to the bookcase', null)}
          onMouseLeave={hideNote}
          aria-label="Back to the shelf"
        >
          <i className="fas fa-arrow-left tab-icon-glyph"></i>
        </button>
        <button
          className="spellbook-tab-button tab-icon-only active"
          onMouseEnter={(e) => showNote(e, activeGem.title, activeGem.subtitle, 'Currently reading')}
          onMouseLeave={hideNote}
          aria-label={activeGem.title}
        >
          <i className={`${activeGem.icon} tab-icon-glyph`}></i>
        </button>
      </div>
    );
  };

  const renderBookPage = () => {
    if (!activeGem) return null;

    return (
      <div style={{ display: 'flex', flex: 1, minHeight: 0, flexDirection: 'column' }}>
        <div className="library-shelf-molding library-shelf-molding--thin library-drag-handle" title="Drag to move window"></div>
        <div className="library-book-page">
          <div className="library-book-page-sheet">
            <div className="library-book-page-ornament">❦ ❦ ❦</div>
            <h2 className="library-book-page-title">{activeGem.title}</h2>
            <p className="library-book-page-subtitle">{activeGem.subtitle}</p>
            <div className="library-book-page-rule"></div>
            {activeGem.content.map((sec, i) => (
              <section key={i} className="library-book-page-section">
                <h3>{sec.heading}</h3>
                {(sec.paragraphs || []).map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {sec.list && (
                  <ul>
                    {sec.list.map((li, j) => (
                      <li key={j}>{li}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            <div className="library-book-page-footer">Redwater Press · recovered from a bargain bin · page 1 of 1</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <MythrillWindow
      isOpen={isOpen}
      onClose={activeSection ? handleBack : activeBook ? handleBackFromBook : onClose}
      title={title}
      defaultPosition={savedPos}
      defaultSize={savedSize}
      onDrag={handleDrag}
      onResize={handleResize}
      minConstraints={[700, 500]}
      handleClassName="library-drag-handle"
      className="library-window"
      customHeader={activeSection ? renderTabsHeader() : activeBook ? renderBookHeader() : <></>}
    >
      {activeBook ? (
        renderBookPage()
      ) : !activeSection ? (
        <div className="library-bookshelf">
          <div className="library-shelf-molding library-drag-handle" title="Drag to move window">
            <span className="library-molding-hint">Mythrill Grand Library · choose a tome to open</span>
          </div>
          <div className="library-shelf-row">
            {SHELF_ROW.map((item, idx) => {
              if (item.type === 'section') {
                const section = SECTIONS.find(s => s.id === item.id);
                return (
                  <button
                    key={section.id}
                    type="button"
                    className={`library-book library-book--${section.id}`}
                    onClick={() => handleSectionClick(section.id)}
                    onMouseEnter={(e) => showNote(e, section.label, section.subtitle)}
                    onMouseLeave={hideNote}
                    aria-label={`Open ${section.label}`}
                  >
                    <span className="library-book-bands" aria-hidden="true"></span>
                    <i className={`${section.icon} library-book-icon`} aria-hidden="true"></i>
                    <span className="library-book-title">{section.label}</span>
                    <span className="library-book-crown" aria-hidden="true">◆</span>
                  </button>
                );
              }
              const gem = HIDDEN_GEMS[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  className="library-book library-book--gem"
                  style={{
                    '--leather-a': gem.leather.a,
                    '--leather-b': gem.leather.b,
                    '--leather-c': gem.leather.c,
                    '--accent': gem.accent,
                    '--tilt': gem.tilt,
                  }}
                  onClick={() => handleGemClick(item.id)}
                  onMouseEnter={(e) => showNote(e, gem.title, gem.subtitle)}
                  onMouseLeave={hideNote}
                  aria-label={`Open ${gem.title}`}
                >
                  <span className="library-book-bands" aria-hidden="true"></span>
                  <i className={`${gem.icon} library-book-icon`} aria-hidden="true"></i>
                  <span className="library-book-title">{gem.title}</span>
                </button>
              );
            })}
          </div>
          <div className="library-shelf-plank library-drag-handle" title="Drag to move window"></div>
          <div className="library-shelf-molding library-shelf-molding--bottom library-drag-handle" title="Drag to move window"></div>
        </div>
      ) : (
        <div style={{ display: 'flex', flex: 1, minHeight: 0, flexDirection: 'column' }}>
          <div className="library-shelf-molding library-shelf-molding--thin library-drag-handle" title="Drag to move window"></div>
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
      </MythrillWindow>
      {hoverNote && createPortal(
        <div
          className={`library-book-note library-book-note--fixed ${hoverNote.above ? 'library-book-note--above' : 'library-book-note--below'}`}
          style={{ left: hoverNote.left, top: hoverNote.top }}
          role="tooltip"
        >
          <span className="library-book-note-title">{hoverNote.title}</span>
          {hoverNote.subtitle}
          {hoverNote.hint && (
            <span className="library-book-note-open">{hoverNote.hint}</span>
          )}
        </div>,
        document.body
      )}
    </>
  );
};

export default LibraryWindow;
