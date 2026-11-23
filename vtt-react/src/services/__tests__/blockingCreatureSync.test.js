import { consumeBlockReceipt } from '../blockingService';
import { useSpellConsequenceStore } from '../spellConsequenceService';
import { DEFINITION_ID, DEFINITION_HASH, CAPABILITY } from '../equipmentBlocking';
import { registerStore } from '../../store/storeRegistry';
import useGameStore from '../../store/gameStore';

jest.mock('../../persistence/scopedNativeFamily', () => {
  const mem = new Map();
  return {
    createScopedNativeFamily: ({ familyId }) => ({
      load: keys => mem.get(`${familyId}:${JSON.stringify(keys)}`) || null,
      save: (value, keys) => { mem.set(`${familyId}:${JSON.stringify(keys)}`, JSON.parse(JSON.stringify(value))); return { status: 'OK' }; }
    })
  };
});

jest.mock('../spellConsequenceCustody', () => {
  const box = { latest: null };
  return {
    spellContext: () => ({ uid: 'gm-1', roomId: 'room-1', current: () => true }),
    loadLatestSpell: () => box.latest,
    retainLatestSpell: (_ctx, value) => { box.latest = JSON.parse(JSON.stringify({ ...value, custody: 'Device retained' })); return box.latest; },
    unresolvedSpell: r => !!r?.approval && ['awaiting', 'unknown', 'prepared', 'unresolved'].includes(r.phase),
    __box: box
  };
});

jest.mock('../actorConsequenceService', () => ({
  findActor: jest.fn(),
  roomResourceProjection: jest.fn(() => null),
  refreshActorSnapshot: jest.fn(async () => ({ success: true })),
  prepareActorCommand: jest.fn(),
  submitPreparedActorCommand: jest.fn(),
  requestActorEvent: jest.fn(async () => ({ success: true }))
}));

jest.mock('../acceptedResultFeed', () => ({ chatLineFor: (_r, line) => line }));

beforeEach(() => {
  registerStore('gameStore', useGameStore);
  useGameStore.setState({ isGMMode: true, isInMultiplayer: true, multiplayerRoom: { id: 'room-1' } });
  const custody = jest.requireMock('../spellConsequenceCustody');
  custody.__box.latest = {
    route: 'creature',
    phase: 'awaiting',
    pcOffer: true,
    approval: { approvalId: 'cmd-1', roomId: 'room-1' },
    creature: { attemptId: 'cmd-1', source: { kind: 'creature', roomId: 'room-1', mapId: 'app-hall', tokenId: 'twin-1', instanceId: 'inc-1' } },
    draft: { roll: { total: 6 } }
  };
  useSpellConsequenceStore.setState({ draftVersion: 0 });
});

test('consumeBlockReceipt transitions matching pcOffer creature action from awaiting to accepted and clears draft', () => {
  const custody = jest.requireMock('../spellConsequenceCustody');
  const receiptResult = {
    success: true,
    status: 'accepted live',
    receipt: {
      version: 1,
      roomId: 'room-1',
      commandId: 'cmd-1',
      acceptedAt: Date.now(),
      adjudication: {
        definitionId: DEFINITION_ID,
        definitionVersionOrHash: DEFINITION_HASH,
        finalAmount: 4,
        chosenResult: JSON.stringify({
          capability: CAPABILITY,
          approvalId: 'cmd-1',
          names: { source: 'Ember Stalker', target: 'Ilse' },
          attack: { ability: { name: 'Ashen Fang' }, apCost: 1 },
          block: { reduction: 2 },
          manual: []
        })
      },
      actors: [
        { ref: { kind: 'creature', roomId: 'room-1', mapId: 'app-hall', tokenId: 'twin-1', instanceId: 'inc-1' }, finalResources: { ap: { current: 5, temp: 0 }, mana: { current: 48, temp: 0 } } },
        { ref: { kind: 'character', roomId: 'room-1', mapId: 'app-hall', tokenId: 'pc', instanceId: 'pc-1', ownerUid: 'owner-1', characterId: 'c1' }, finalResources: { hp: { current: 16, temp: 0 } } }
      ]
    }
  };

  const view = consumeBlockReceipt(receiptResult);
  expect(view).toBeTruthy();
  expect(custody.__box.latest.phase).toBe('accepted');
  expect(custody.__box.latest.draft).toBeNull();
  expect(custody.__box.latest.result).toEqual(receiptResult);
  expect(useSpellConsequenceStore.getState().draftVersion).toBe(1);
});
