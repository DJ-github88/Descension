import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CharacterToken from '../CharacterToken';
import useCharacterStore from '../../../store/characterStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import usePartyStore from '../../../store/partyStore';
import useGameStore from '../../../store/gameStore';

jest.mock('../../../store/characterStore', () => {
  const store = {
    name: 'Senna Frostwolf',
    race: 'Human',
    raceDisplayName: 'Human',
    class: 'False Prophet',
    level: 3,
    health: { current: 20, max: 20 },
    mana: { current: 10, max: 10 },
    actionPoints: { current: 1, max: 3 },
    tempHealth: 0,
    tempMana: 0,
    tempActionPoints: 0,
    stats: { strength: 12, agility: 10, constitution: 14, intelligence: 9, spirit: 16, charisma: 11 },
    equipment: { mainHand: { id: 'staff-1', name: 'Staff of Testing', baseStats: { spirit: 2 } } },
    lore: {},
    tokenSettings: {},
    derivedStats: {}
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.setState = jest.fn();
  mockHook.subscribe = () => () => {};
  return { __esModule: true, default: mockHook };
});

jest.mock('../../../store/characterTokenStore', () => {
  const store = {
    characterTokens: [{
      id: 'tok-1',
      playerId: null,
      position: { x: 100, y: 100 },
      isPlayerToken: true,
      character: { name: 'Senna Frostwolf', class: 'False Prophet', lore: {}, tokenSettings: {} },
      state: { conditions: [] }
    }],
    updateCharacterTokenPosition: jest.fn(),
    updateCharacterTokenState: jest.fn()
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.setState = jest.fn();
  mockHook.subscribe = () => () => {};
  return { __esModule: true, default: mockHook };
});

jest.mock('../../../store/partyStore', () => {
  const store = { partyMembers: [] };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return { __esModule: true, default: mockHook };
});

jest.mock('../../../store/targetingStore', () => {
  const store = { currentTarget: null, setTarget: jest.fn(), clearTarget: jest.fn() };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return { __esModule: true, default: mockHook };
});

jest.mock('../../../store/gameStore', () => {
  const store = {
    zoomLevel: 1,
    playerZoom: 1,
    isInMultiplayer: false,
    multiplayerSocket: null,
    isGMMode: false,
    showMovementVisualization: false,
    feetPerTile: 5,
    gridSize: 50,
    gridOffsetX: 0,
    gridOffsetY: 0,
    cameraX: 0,
    cameraY: 0,
    currentPlayer: null,
    setCameraPosition: jest.fn()
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.setState = jest.fn();
  mockHook.subscribe = () => () => {};
  return { __esModule: true, default: mockHook };
});

jest.mock('../../../store/combatStore', () => {
  const store = {
    isInCombat: false,
    isSelectionMode: false,
    selectedTokens: new Set(),
    toggleTokenSelection: jest.fn(),
    activeMovement: null,
    startMovementVisualization: jest.fn(),
    updateMovementVisualization: jest.fn(),
    clearMovementVisualization: jest.fn(),
    updateTempMovementDistance: jest.fn(),
    isTokensTurn: jest.fn(() => false),
    pendingMovementConfirmation: null,
    setPendingMovementConfirmation: jest.fn(),
    clearPendingMovementConfirmation: jest.fn(),
    confirmMovement: jest.fn(),
    validateMovement: jest.fn(),
    recordTurnStartPosition: jest.fn(),
    getTurnStartPosition: jest.fn(() => null)
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return { __esModule: true, default: mockHook };
});

jest.mock('../../../store/conditionStore', () => {
  const store = { activeBuffs: [], activeDebuffs: [] };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return { __esModule: true, default: mockHook };
});

jest.mock('../../../store/levelEditorStore', () => {
  const store = {
    viewingFromToken: null,
    visibleArea: null,
    controlledVisibleTiles: null,
    visibilityPolygon: null,
    dynamicFogEnabled: false,
    fovAngle: 100,
    getTokenFacingDirection: jest.fn(() => 0),
    setTokenFacingDirection: jest.fn(),
    setTokenVision: jest.fn(),
    tokenVisionRanges: {},
    fogOfWarPaths: [],
    fogOfWarData: {}
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return { __esModule: true, default: mockHook };
});

jest.mock('../../../store/settingsStore', () => {
  const store = { playerTooltipMode: 'vague' };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return { __esModule: true, default: mockHook };
});

jest.mock('../../../utils/InfiniteGridSystem', () => ({
  getGridSystem: () => ({
    worldToScreen: (x, y) => ({ x, y }),
    worldToScreen3D: (x, y, z) => ({ x, y: y - (z || 0) }),
    worldToGrid: (x, y) => ({ x: Math.round(x), y: Math.round(y) }),
    getGridState: () => ({ gridSize: 50, gridType: 'square' }),
    gridToScreen: (x, y) => ({ x, y })
  }),
  createGridSystem: jest.fn()
}));

jest.mock('../../../utils/assetManager', () => ({
  getIconUrl: (icon) => `http://mock-icons/${icon}.png`,
  getCustomIconUrl: (icon) => `http://mock-icons/${icon}.png`
}));

const renderToken = () => render(
  <CharacterToken
    tokenId="tok-1"
    position={{ x: 100, y: 100 }}
    onPositionChange={jest.fn()}
    onRemove={jest.fn()}
    onInspect={jest.fn()}
  />
);

describe('CharacterToken portrait resolution', () => {
  beforeEach(() => {
    useCharacterStore.getState().lore = {};
    useCharacterStore.getState().tokenSettings = {};
  });

  it('keeps a visible token border when no border colour is configured', () => {
    const { container } = renderToken();
    const token = container.querySelector('.character-token');
    expect(token).not.toBeNull();
    expect(token.style.border).toContain('#506e30');
    expect(token.style.border).not.toContain('undefined');
  });

  it('uses the configured token border colour when one is set', () => {
    useCharacterStore.getState().tokenSettings = { borderColor: '#123456' };
    const { container } = renderToken();
    expect(container.querySelector('.character-token').style.border).toContain('#123456');
  });

  it('falls back to the class icon when no portrait image or icon is chosen', () => {
    const { container } = renderToken();
    const icon = container.querySelector('.token-icon');
    expect(icon).not.toBeNull();
    expect(icon.style.backgroundImage).toContain('/assets/icons/classes/false_prophet.png');
  });

  it('prefers an uploaded character image over the class icon', () => {
    useCharacterStore.getState().lore = { characterImage: '/uploads/senna.png' };
    const { container } = renderToken();
    const icon = container.querySelector('.token-icon');
    expect(icon.style.backgroundImage).toContain('/uploads/senna.png');
    expect(icon.style.backgroundImage).not.toContain('false_prophet.png');
  });
});

describe('CharacterToken inspect payload', () => {
  const tokenStore = useCharacterTokenStore.getState();
  const gameStore = useGameStore.getState();
  const partyStore = usePartyStore.getState();
  const originalTokenPlayerId = tokenStore.characterTokens[0].playerId;
  const originalInMultiplayer = gameStore.isInMultiplayer;
  const originalSocket = gameStore.multiplayerSocket;
  const originalMembers = partyStore.partyMembers;

  const openInspect = (onInspect) => {
    const { container } = render(
      <CharacterToken
        tokenId="tok-1"
        position={{ x: 100, y: 100 }}
        onPositionChange={jest.fn()}
        onRemove={jest.fn()}
        onInspect={onInspect}
      />
    );
    fireEvent.contextMenu(container.querySelector('.character-token'));
    fireEvent.mouseEnter(screen.getByText('Token Actions').closest('button'));
    fireEvent.click(screen.getByText('Inspect').closest('button'));
  };

  afterEach(() => {
    tokenStore.characterTokens[0].playerId = originalTokenPlayerId;
    gameStore.isInMultiplayer = originalInMultiplayer;
    gameStore.multiplayerSocket = originalSocket;
    partyStore.partyMembers = originalMembers;
  });

  it('forwards the live character store when inspecting our own token', () => {
    const onInspect = jest.fn();
    openInspect(onInspect);

    expect(onInspect).toHaveBeenCalledTimes(1);
    const [payload, isSelf] = onInspect.mock.calls[0];
    expect(isSelf).toBe(true);
    // Live store, not the partial token snapshot
    expect(payload.name).toBe('Senna Frostwolf');
    expect(payload.stats).toBeDefined();
    expect(payload.equipment).toBeDefined();
  });

  it('forwards the full party member payload for another player token', () => {
    tokenStore.characterTokens[0].playerId = 'socket-friend';
    gameStore.isInMultiplayer = true;
    gameStore.multiplayerSocket = { id: 'my-socket' };
    const friendMember = {
      id: 'friend-1',
      socketId: 'socket-friend',
      userId: 'uid-friend',
      name: 'Tormund Thornwall',
      character: {
        name: 'Tormund Thornwall',
        class: 'Minstrel',
        stats: { strength: 12, constitution: 14 },
        equipment: { mainHand: { id: 'lute-1', name: 'Lute' } }
      }
    };
    partyStore.partyMembers = [friendMember];

    const onInspect = jest.fn();
    openInspect(onInspect);

    expect(onInspect).toHaveBeenCalledTimes(1);
    const [payload, isSelf] = onInspect.mock.calls[0];
    expect(isSelf).toBe(false);
    expect(payload).toBe(friendMember);
  });
});
