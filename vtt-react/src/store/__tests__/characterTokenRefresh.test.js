import useCharacterTokenStore from '../characterTokenStore';
import useCharacterStore from '../characterStore';
import useGameStore from '../gameStore';
import useMapStore from '../mapStore';
import { getStore, registerStore } from '../storeRegistry';

jest.mock('../../services/actorConsequenceService', () => ({
  refreshActorSnapshot: jest.fn(async () => ({ success: true }))
}));

const { refreshActorSnapshot } = require('../../services/actorConsequenceService');

const flush = () => new Promise(resolve => setTimeout(resolve, 25));

describe('characterTokenStore refreshLocalPlayerSnapshot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    registerStore('authStore', { getState: () => ({ user: { uid: 'owner-1' } }) });
    useMapStore.setState({ currentMapId: 'map-1' });
    useCharacterStore.setState({
      currentCharacterId: 'char-1',
      name: 'Lyra Updated',
      race: 'Elf',
      raceDisplayName: 'High Elf',
      class: 'Martyr',
      level: 5,
      stats: { strength: 12, agility: 16 },
      skillRanks: { perception: 'EXPERT' },
      health: { current: 20, max: 55 },
      mana: { current: 10, max: 40 },
      actionPoints: { current: 2, max: 5 },
      tempHealth: 4,
      tempMana: 0,
      tempActionPoints: 0,
      durability: 10,
      damageReduction: 3,
      movementSpeed: 35,
      resistances: { fire: 5 },
      immunities: ['poison'],
      racialTraits: ['keen-senses'],
      lore: { characterImage: '/assets/lyra-new.png', characterIcon: 'star' },
      tokenSettings: { customIcon: '/assets/lyra-new.png', borderColor: '#224466', backgroundColor: '#111111' }
    });
  });

  test('emits cosmetic-only character payload for demoted tokens and full build payload for primary tokens', async () => {
    const emitted = [];
    const socket = {
      id: 'sock-1',
      connected: true,
      emit: jest.fn((event, payload, ack) => {
        emitted.push({ event, payload });
        if (typeof ack === 'function') ack({ success: true });
      })
    };
    useGameStore.setState({
      isInMultiplayer: true,
      multiplayerRoom: { id: 'room-1' },
      multiplayerSocket: socket,
      actorConsequenceStatus: null
    });

    useCharacterTokenStore.setState({
      characterTokens: [
        {
          id: 'pc-demoted',
          ownerUserId: 'owner-1',
          name: 'Lyra Old',
          character: {
            id: 'char-1',
            name: 'Lyra Old',
            skillRanks: { perception: 'NOVICE' },
            stats: { strength: 10, agility: 14 },
            level: 1,
            health: { current: 15, max: 40 }
          },
          state: { actorContract: { version: 1, primary: false, revision: 0, ownerUid: 'owner-1', characterId: 'char-1' } }
        },
        {
          id: 'pc-primary',
          ownerUserId: 'owner-1',
          name: 'Lyra Old',
          character: {
            id: 'char-1',
            name: 'Lyra Old',
            skillRanks: { perception: 'NOVICE' },
            stats: { strength: 10, agility: 14 },
            level: 1,
            health: { current: 30, max: 40 }
          },
          state: { actorContract: { version: 1, primary: true, revision: 1, ownerUid: 'owner-1', characterId: 'char-1' } }
        }
      ]
    });

    useCharacterTokenStore.getState().refreshLocalPlayerSnapshot();
    await flush();

    expect(emitted).toHaveLength(2);
    const demotedEmit = emitted.find(e => e.payload.tokenId === 'pc-demoted').payload;
    const primaryEmit = emitted.find(e => e.payload.tokenId === 'pc-primary').payload;

    expect(demotedEmit.name).toBe('Lyra Updated');
    expect(demotedEmit.character).toEqual({
      id: 'char-1',
      name: 'Lyra Updated',
      race: 'Elf',
      raceDisplayName: 'High Elf',
      class: 'Martyr',
      lore: { characterImage: '/assets/lyra-new.png', characterIcon: 'star' },
      tokenSettings: { customIcon: '/assets/lyra-new.png', borderColor: '#224466', backgroundColor: '#111111' }
    });
    expect(demotedEmit.character.skillRanks).toBeUndefined();
    expect(demotedEmit.character.health).toBeUndefined();
    expect(demotedEmit.character.stats).toBeUndefined();
    expect(demotedEmit.character.level).toBeUndefined();

    expect(primaryEmit.character.skillRanks).toEqual({ perception: 'EXPERT' });
    expect(primaryEmit.character.health).toEqual({ max: 55 });
    expect(primaryEmit.character.level).toBe(5);

    const tokens = useCharacterTokenStore.getState().characterTokens;
    const localDemoted = tokens.find(t => t.id === 'pc-demoted');
    expect(localDemoted.name).toBe('Lyra Updated');
    expect(localDemoted.character.tokenSettings.customIcon).toBe('/assets/lyra-new.png');
    expect(localDemoted.character.skillRanks).toEqual({ perception: 'NOVICE' });
    expect(localDemoted.character.level).toBe(1);
    expect(useGameStore.getState().actorConsequenceStatus).toBeNull();
  });

  test('surfaces server refusal via actorConsequenceStatus and triggers snapshot recovery instead of swallowing ack failure', async () => {
    const socket = {
      id: 'sock-1',
      connected: true,
      emit: jest.fn((event, payload, ack) => {
        if (typeof ack === 'function') {
          ack({ success: false, code: 'secondary_attachment', error: 'Secondary attachment cannot modify mechanics' });
        }
      })
    };
    useGameStore.setState({
      isInMultiplayer: true,
      multiplayerRoom: { id: 'room-1' },
      multiplayerSocket: socket,
      actorConsequenceStatus: null
    });
    useCharacterTokenStore.setState({
      characterTokens: [
        {
          id: 'pc-demoted',
          ownerUserId: 'owner-1',
          name: 'Lyra Old',
          character: { id: 'char-1', name: 'Lyra Old' },
          state: { actorContract: { version: 1, primary: false, revision: 0, ownerUid: 'owner-1', characterId: 'char-1' } }
        }
      ]
    });

    useCharacterTokenStore.getState().refreshLocalPlayerSnapshot();
    await flush();

    expect(useGameStore.getState().actorConsequenceStatus).toEqual({
      success: false,
      code: 'secondary_attachment',
      error: 'Secondary attachment cannot modify mechanics'
    });
    expect(refreshActorSnapshot).toHaveBeenCalled();
  });

  test('serializes default characterStore racialTraits objects to scalar IDs without leaking actionPoints or current pools', async () => {
    const emitted = [];
    const socket = {
      id: 'sock-1',
      connected: true,
      emit: jest.fn((event, payload, ack) => {
        emitted.push({ event, payload });
        if (typeof ack === 'function') ack({ success: true });
      })
    };
    useGameStore.setState({
      isInMultiplayer: true,
      multiplayerRoom: { id: 'room-1' },
      multiplayerSocket: socket,
      actorConsequenceStatus: null
    });

    // Populate racialTraits via real characterStore action (Astril / Vashir)
    useCharacterStore.getState().updateCharacterInfo('race', 'astril');
    useCharacterStore.getState().updateCharacterInfo('subrace', 'vashir');
    useCharacterStore.getState().updateCharacterInfo('class', 'Martyr');
    const rawTraits = useCharacterStore.getState().racialTraits;
    expect(Array.isArray(rawTraits)).toBe(true);
    expect(rawTraits.length).toBeGreaterThan(0);
    expect(rawTraits.some(t => t && typeof t === 'object' && 'actionPoints' in t)).toBe(true);

    useCharacterTokenStore.setState({
      characterTokens: [
        {
          id: 'pc-primary',
          ownerUserId: 'owner-1',
          name: 'Vashir Old',
          character: {
            id: 'char-1',
            name: 'Vashir Old',
            skillRanks: { perception: 'NOVICE' },
            health: { current: 20, max: 40 },
            mana: { current: 10, max: 30 },
            actionPoints: { current: 2, max: 4 }
          },
          state: { actorContract: { version: 1, primary: true, revision: 1, ownerUid: 'owner-1', characterId: 'char-1' } }
        },
        {
          id: 'pc-secondary',
          ownerUserId: 'owner-1',
          name: 'Vashir Old',
          character: { id: 'char-1', name: 'Vashir Old', skillRanks: { perception: 'NOVICE' } },
          state: { actorContract: { version: 1, primary: false, revision: 0, ownerUid: 'owner-1', characterId: 'char-1' } }
        }
      ]
    });

    useCharacterTokenStore.getState().refreshLocalPlayerSnapshot();
    await flush();

    const primaryEmit = emitted.find(e => e.payload.tokenId === 'pc-primary').payload;
    const secondaryEmit = emitted.find(e => e.payload.tokenId === 'pc-secondary').payload;

    expect(primaryEmit.character.racialTraits).toEqual(rawTraits.map(t => t.id));
    expect(primaryEmit.character.racialTraits.every(v => typeof v === 'string')).toBe(true);
    expect(primaryEmit.character.health).toEqual({ max: 55 });
    expect(primaryEmit.character.mana).toEqual({ max: 40 });
    expect(primaryEmit.character.actionPoints).toEqual({ max: 5 });
    expect(primaryEmit.character.tempHealth).toBeUndefined();
    expect(primaryEmit.character.tempMana).toBeUndefined();
    expect(primaryEmit.character.tempActionPoints).toBeUndefined();
    expect(secondaryEmit.character.racialTraits).toBeUndefined();
  });

  test('normalizes non-default racialTraits records (empty, name-only objects, mixed, malformed)', async () => {
    const emitted = [];
    const socket = {
      id: 'sock-1',
      connected: true,
      emit: jest.fn((event, payload, ack) => {
        emitted.push({ event, payload });
        if (typeof ack === 'function') ack({ success: true });
      })
    };
    useGameStore.setState({
      isInMultiplayer: true,
      multiplayerRoom: { id: 'room-1' },
      multiplayerSocket: socket,
      actorConsequenceStatus: null
    });
    useCharacterTokenStore.setState({
      characterTokens: [
        {
          id: 'pc-primary',
          ownerUserId: 'owner-1',
          name: 'Lyra Old',
          character: { id: 'char-1', name: 'Lyra Old' },
          state: { actorContract: { version: 1, primary: true, revision: 1, ownerUid: 'owner-1', characterId: 'char-1' } }
        }
      ]
    });

    useCharacterStore.setState({
      racialTraits: ['keen-senses', { name: 'Custom Heritage', actionPoints: 1 }, { actionPoints: 2 }, null]
    });
    useCharacterTokenStore.getState().refreshLocalPlayerSnapshot();
    await flush();
    expect(emitted[0].payload.character.racialTraits).toEqual(['keen-senses', 'Custom Heritage']);

    useCharacterStore.setState({ racialTraits: [] });
    useCharacterTokenStore.getState().refreshLocalPlayerSnapshot();
    await flush();
    expect(emitted[1].payload.character.racialTraits).toEqual([]);
  });
});
