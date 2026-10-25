import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PartyHUD from '../PartyHUD';
import useCharacterStore from '../../../store/characterStore';

// Mock all required Zustand stores
jest.mock('../../../store/partyStore', () => {
  const store = {
    partyMembers: [
      {
        id: 'current-player',
        userId: 'user-123',
        name: 'Legolas',
        isConnected: true,
        isGM: false,
        character: {
          name: 'Legolas',
          class: 'Hunter',
          level: 5,
          health: { current: 45, max: 50 },
          mana: { current: 10, max: 20 },
          actionPoints: { current: 2, max: 3 }
        }
      },
      {
        id: 'member-2',
        userId: 'user-456',
        name: 'Gimli',
        isConnected: true,
        isGM: false,
        character: {
          name: 'Gimli',
          race: 'Riven',
          class: 'Warrior',
          background: 'Soldier',
          level: 5,
          health: { current: 60, max: 70 },
          mana: { current: 0, max: 0 },
          actionPoints: { current: 1, max: 3 }
        }
      }
    ],
    isInParty: true,
    removePartyMember: jest.fn(),
    updatePartyMember: jest.fn(),
    getMemberPosition: () => ({ x: 10, y: 10 }),
    setMemberPosition: jest.fn(),
    memberPositions: {},
    currentParty: { id: 'party-123', name: 'Fellowship' },
    leaderId: 'user-123'
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/targetingStore', () => {
  const store = {
    setTarget: jest.fn(),
    currentTarget: null,
    clearTarget: jest.fn()
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/characterStore', () => {
  const store = {
    name: 'Legolas',
    baseName: 'Legolas',
    race: 'Tallyn (Frostwood Reach)',
    class: 'Hunter',
    background: 'Urchin',
    backgroundDisplayName: 'Urchin',
    level: 5,
    health: { current: 45, max: 50 },
    mana: { current: 10, max: 20 },
    actionPoints: { current: 2, max: 3 },
    alignment: 'Neutral Good',
    exhaustionLevel: 0,
    lore: {
      characterIcon: 'inv_misc_head_human_01',
      iconBackgroundImage: 'Cathedral-Interior',
      iconBackgroundColor: '#f8f5eb'
    },
    updateResource: jest.fn(),
    updateTempResource: jest.fn(),
    updateExhaustionLevel: jest.fn()
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/gameStore', () => {
  const store = {
    setGMMode: jest.fn(),
    isGMMode: false,
    toggleGMMode: jest.fn(),
    isInMultiplayer: false,
    multiplayerRoom: null,
    currentPlayer: { id: 'user-123', name: 'Legolas' },
    multiplayerSocket: { id: 'socket-123' }
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/settingsStore', () => {
  const store = {
    windowScale: 1
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/conditionStore', () => {
  const store = {
    removeCondition: jest.fn(),
    updateConditionDuration: jest.fn(),
    getRemainingTime: () => 10,
    getConditionsForTarget: () => [],
    activeBuffs: []
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/chatStore', () => {
  const store = {
    addNotification: jest.fn(),
    addCombatNotification: jest.fn()
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/presenceStore', () => {
  const store = {
    currentUserPresence: { status: 'online' }
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/authStore', () => {
  const store = {
    user: { uid: 'user-123' }
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/characterTokenStore', () => {
  const store = {
    characterTokens: []
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

// Mock external subcomponents that are complex or pull extra dependencies
jest.mock('../ClassResourceBar', () => {
  return function MockClassResourceBar() {
    return <div data-testid="class-resource-bar" />;
  };
});

jest.mock('../SummonTokenBar', () => {
  return function MockSummonTokenBar() {
    return <div data-testid="summon-token-bar" />;
  };
});

describe('PartyHUD Component', () => {
  it('renders party member frames with names and levels', () => {
    render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    expect(screen.getByText(/Legolas/)).toBeInTheDocument();
    expect(screen.getByText(/Gimli/)).toBeInTheDocument();
  });

  it('mounts corner vials with exact values on hover readouts, no numeric plaques', () => {
    const { container } = render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    // Legolas health is 45/50, Gimli health is 60/70 — exact values live on hover readouts
    expect(screen.getByLabelText('Legolas Health: 45 of 50')).toBeInTheDocument();
    expect(screen.getByLabelText('Gimli Health: 60 of 70')).toBeInTheDocument();
    // Numbers are hover-only: nothing numeric painted on the frame itself
    expect(screen.queryByText('45/50')).toBeNull();
    expect(screen.queryByText('60/70')).toBeNull();

    // Corner mounts: Legolas gets health + mana + AP, Gimli gets health + AP (no mana pool)
    expect(container.querySelectorAll('.party-corner-mount')).toHaveLength(5);
    expect(container.querySelectorAll('.mount-ap')).toHaveLength(2);
    expect(container.querySelectorAll('.mount-mana')).toHaveLength(1);
    expect(container.querySelectorAll('.mount-health')).toHaveLength(2);
  });

  it('opens a quick-adjust menu on left-click with the right-click step options', () => {
    render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    fireEvent.click(screen.getByLabelText('Legolas Health: 45 of 50'));
    expect(screen.getByText('45/50')).toBeInTheDocument();
    expect(screen.getByText('-5')).toBeInTheDocument();
    expect(screen.getByText('-1')).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
    expect(screen.getByText('+5')).toBeInTheDocument();
  });

  it('applies mount adjustments through the shared resource handler', () => {
    render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    fireEvent.click(screen.getByLabelText('Legolas Health: 45 of 50'));
    fireEvent.click(screen.getByText('-1'));
    expect(useCharacterStore.getState().updateResource).toHaveBeenCalledWith('health', 44, 50, undefined, true);
  });

  it('lets the exact current value be typed in and applied', () => {
    render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    fireEvent.click(screen.getByLabelText('Legolas Health: 45 of 50'));
    fireEvent.click(screen.getByText('45/50'));
    const input = document.body.querySelector('.mount-adjust-input');
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '30' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(useCharacterStore.getState().updateResource).toHaveBeenCalledWith('health', 30, 50, undefined, true);
  });

  it('exposes an accept button to apply the typed value', () => {
    render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    fireEvent.click(screen.getByLabelText('Legolas Health: 45 of 50'));
    fireEvent.click(screen.getByText('45/50'));
    const input = document.body.querySelector('.mount-adjust-input');
    fireEvent.change(input, { target: { value: '50' } });
    fireEvent.click(screen.getByTitle('Apply'));

    expect(useCharacterStore.getState().updateResource).toHaveBeenCalledWith('health', 50, 50);
  });

  it('offers single-step options on the AP boot', () => {
    render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    fireEvent.click(screen.getByLabelText('Legolas Action Points: 2 of 3'));
    expect(screen.getByText('2/3')).toBeInTheDocument();
    const menu = document.body.querySelector('.mount-adjust-menu');
    expect(menu).toBeInTheDocument();
    expect(menu.textContent).not.toContain('-5');
  });

  it('does not open adjust menus for other members when not GM', () => {
    render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    fireEvent.click(screen.getByLabelText('Gimli Health: 60 of 70'));
    expect(document.body.querySelector('.mount-adjust-menu')).toBeNull();
  });

  it('displays character background (e.g. Urchin) in the archetype line', () => {
    render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    // Legolas has Urchin background
    expect(screen.getByText('Urchin')).toBeInTheDocument();
    // Gimli has Soldier background
    expect(screen.getByText('Soldier')).toBeInTheDocument();
  });

  it('uses stable draggable frame keys for persistent positioning', () => {
    const { container } = render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    // Current player uses stable key 'current-player'
    expect(container.querySelector('.party-frame-current-player')).toBeInTheDocument();
    // Other member uses stable userId key 'user-456'
    expect(container.querySelector('.party-frame-user-456')).toBeInTheDocument();
  });

  it('states alignment in the calling line and keeps ancestry and background whole', () => {
    const { container } = render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    // Alignment is text in the calling line, not a plaque on the top border
    expect(container.querySelector('.member-alignment-tag')).toBeNull();
    const alignments = container.querySelectorAll('.hud-sheet-alignment');
    expect(alignments).toHaveLength(2);
    expect(screen.getByText('Neutral Good')).toBeInTheDocument();
    expect(alignments[0].closest('.hud-sheet-calling')).not.toBeNull();
    expect(alignments[0]).toHaveClass('good');

    // Ancestry and background exist for both members
    expect(container.querySelectorAll('.hud-sheet-ancestry')).toHaveLength(2);
    expect(container.querySelectorAll('.hud-sheet-background')).toHaveLength(2);
  });

  it('states the level in the calling line instead of stamping it on the portrait', () => {
    const { container } = render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    expect(container.querySelector('.portrait-level-chip')).toBeNull();
    const levels = container.querySelectorAll('.hud-sheet-level');
    expect(levels).toHaveLength(2);
    expect(levels[0]).toHaveTextContent('Level 5');
  });

  it('opens the portrait lightbox when a HUD portrait is clicked and closes on Escape', () => {
    render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    const portraits = document.querySelectorAll('.party-member-frame .party-portrait');
    expect(portraits).toHaveLength(2);

    fireEvent.click(portraits[0]);
    expect(document.querySelector('.portrait-lightbox-overlay')).toBeInTheDocument();
    expect(document.querySelector('.portrait-lightbox-title')).toHaveTextContent('Legolas');

    // Icon portraits carry their scene backdrop into the popup
    const lightboxScene = document.querySelector('.portrait-lightbox-scene');
    expect(lightboxScene).toBeInTheDocument();
    expect(lightboxScene.style.backgroundImage).toContain('Cathedral-Interior');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(document.querySelector('.portrait-lightbox-overlay')).toBeNull();
  });

  it('reads "Level, class, alignment" under the name and keeps the class plate off the portrait', () => {
    const { container } = render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    expect(container.querySelector('.portrait-class-banner')).toBeNull();

    const classTexts = container.querySelectorAll('.hud-sheet-class');
    expect(classTexts).toHaveLength(2);
    expect(classTexts[0]).toHaveTextContent('Hunter');
    expect(classTexts[0]).toHaveAttribute('title', 'Class: Hunter');
    expect(classTexts[1]).toHaveTextContent('Warrior');

    const calling = classTexts[0].closest('.hud-sheet-calling');
    expect(calling).toHaveTextContent('Level 5 Hunter, Neutral Good');
    const identity = calling.closest('.hud-sheet-identity');
    expect(identity.querySelector('.hud-sheet-name')).toHaveTextContent('Legolas');
  });

  it('keeps the archetype icon on the background, not the ancestry', () => {
    const { container } = render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    const ancestries = container.querySelectorAll('.hud-sheet-ancestry');
    expect(ancestries).toHaveLength(2);
    ancestries.forEach((item) => {
      expect(item.querySelector('.archetype-icon')).toBeNull();
    });
    // Human bloodlines read as "<bloodline> (Human)", with legacy regional
    // suffixes stripped instead of leaking into the ancestry.
    expect(ancestries[0]).toHaveTextContent('Tallyn (Human)');
    // Athien bloodlines read as "<bloodline> Athien"
    expect(ancestries[1]).toHaveTextContent('Riven');

    const backgrounds = container.querySelectorAll('.hud-sheet-background');
    expect(backgrounds).toHaveLength(2);
    backgrounds.forEach((item) => {
      expect(item.querySelector('.archetype-icon')).toBeInTheDocument();
    });
  });

  it('shows exhaustion as a status line inside the card, not a plaque on the border', () => {
    const { container } = render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    const memberFrames = container.querySelectorAll('.party-member-frame');
    expect(memberFrames.length).toBe(2);
    expect(container.querySelector('.party-exhaustion-badge')).toBeNull();

    // The owner sees the line even at level 0 (it is the control); another
    // member at level 0 shows nothing
    const exhaustion = memberFrames[0].querySelector('.hud-sheet-exhaustion');
    expect(exhaustion).toBeInTheDocument();
    expect(exhaustion.closest('.hud-sheet-identity')).not.toBeNull();
    expect(memberFrames[1].querySelector('.hud-sheet-exhaustion')).toBeNull();

    expect(exhaustion).toHaveClass('is-rested');
    expect(exhaustion.querySelector('.party-exhaustion-select')).toBeInTheDocument();
    expect(exhaustion.querySelector('.hud-sheet-exhaustion-label')).toHaveTextContent('Exhaustion');
    expect(exhaustion.querySelector('.hud-sheet-exhaustion-value')).toHaveTextContent('0');
    expect(exhaustion.querySelector('.hud-sheet-hourglass')).toBeInTheDocument();

    // No native title attributes on the line or select to prevent unstyled browser tooltip boxes
    expect(exhaustion).not.toHaveAttribute('title');
    expect(exhaustion.querySelector('.party-exhaustion-select')).not.toHaveAttribute('title');

    // Hovering the exhaustion line triggers the calm TTRPG tooltip
    fireEvent.mouseEnter(exhaustion, { clientX: 100, clientY: 200 });
    const calmCard = document.querySelector('.calm-exhaustion-card');
    expect(calmCard).toBeInTheDocument();
    expect(calmCard).toHaveTextContent('Cumulative Penalties');
    expect(calmCard).toHaveTextContent('Level 0 • Refreshed');
    expect(calmCard).toHaveTextContent('Disadvantage on all ability checks');

    // Clicking the exhaustion line opens the custom calm TTRPG dropdown menu
    fireEvent.click(exhaustion);
    const dropdown = document.querySelector('.calm-exhaustion-dropdown');
    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveTextContent('Adjust Exhaustion');
    expect(dropdown).toHaveTextContent('Normal');
    expect(dropdown).toHaveTextContent('Stage 1');

    // Selecting a stage updates the level and closes the dropdown
    const stage1Option = dropdown.querySelector('.calm-dropdown-item.level-1');
    fireEvent.click(stage1Option);
    expect(document.querySelector('.calm-exhaustion-dropdown')).toBeNull();
  });

  it('falls back to the class icon when no portrait image or icon is chosen', () => {
    const store = useCharacterStore.getState();
    const prevClass = store.class;
    const prevIcon = store.lore.characterIcon;
    const prevImage = store.lore.characterImage;

    store.class = 'Lunarch';
    store.lore.characterIcon = null;
    store.lore.characterImage = null;

    try {
      const { container } = render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);
      const portraits = container.querySelectorAll('.party-member-frame .party-portrait');
      const portraitImg = portraits[0].querySelector('img');

      expect(portraitImg).toBeInTheDocument();
      expect(portraitImg.getAttribute('src')).toMatch(/\/assets\/icons\/classes\/(?:transparent\/)?lunarch\.png/);
      // HUD icon portraits render with a base 1.1 zoom to crop icon margins
      expect(portraitImg.style.transform).toContain('scale(1.1)');
    } finally {
      store.class = prevClass;
      store.lore.characterIcon = prevIcon;
      store.lore.characterImage = prevImage;
    }
  });
});
