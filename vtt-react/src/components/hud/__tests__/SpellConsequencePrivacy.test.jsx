import React from 'react';
import { render, screen } from '@testing-library/react';
import SpellConsequencePanel, { GmPanel } from '../SpellConsequencePanel';
import useGameStore from '../../../store/gameStore';
import useCharacterStore from '../../../store/characterStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCreatureStore from '../../../store/creatureStore';
import { useSpellConsequenceStore } from '../../../services/spellConsequenceService';
jest.mock('../../../store/gameStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ isGMMode: false, multiplayerRoom: { id: 'current-room' } })) }));
jest.mock('../../../store/characterStore', () => ({ __esModule: true, default: require('zustand').create(() => ({})) }));
jest.mock('../../../store/characterTokenStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ characterTokens: [] })) }));
jest.mock('../../../store/creatureStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ creatureTokens: [] })) }));
jest.mock('../../../services/spellConsequenceService', () => ({
  useSpellConsequenceStore: require('zustand').create(() => ({ owner: null, ownerStatus: null, gmPending: {}, gmStatus: {} })),
  refreshSpellApprovals: jest.fn(), gmConditionResolution: () => null,
  ownerSource: () => ({ id: 'pc', mapId: 'm', character: { name: 'Ilse', actionPoints: { current: 2 }, tempActionPoints: 0, mana: { current: 8 }, tempMana: 0 }, state: { actorContract: { kind: 'character', roomId: 'current-room', mapId: 'm', tokenId: 'pc', instanceId: 'i-pc', ownerUid: 'owner', characterId: 'ilse', primary: true } } }),
  spellDraftContext: () => ({}), loadSpellDraft: () => null, loadDiscardedSpellDrafts: () => [], saveSpellDraft: jest.fn(), discardSpellDraft: jest.fn(),
  closeOwnerPanel: jest.fn(), sendSpellApproval: jest.fn(), checkSpellApproval: jest.fn(), withdrawSpellApproval: jest.fn(), reapproveSpell: jest.fn(),
  restoreOwnerStatus: jest.fn(), gmAcceptSpell: jest.fn(), gmDeclineSpell: jest.fn(), gmCheckSpellCommand: jest.fn(), markSpellReconciled: jest.fn(),
  retainedTargetResponses: () => [], creatureAttempt: () => null
}));
const approval = { roomId: 'current-room', approvalId: 'retained', source: { kind: 'character', tokenId: 'private-source' }, target: { kind: 'character', tokenId: 'private-target' },
  spell: { kind: 'condition', name: 'PRIVATE retained A9 ability' }, conditionTerms: { timing: { durationText: 'PRIVATE duration', gmNote: 'PRIVATE definition note' } }, price: { ap: 1, mana: 2 } };
beforeEach(() => { useGameStore.setState({ isGMMode: false, multiplayerRoom: { id: 'current-room' } }); useSpellConsequenceStore.setState({ owner: null, ownerStatus: null, gmPending: { retained: { approval } }, gmStatus: {} }); });
test('a non-GM cannot render retained GM pending details after account handoff', () => {
  render(<GmPanel />); expect(screen.queryByRole('region', { name: 'Spell adjudication' })).toBeNull(); expect(screen.queryByText(/PRIVATE/)).toBeNull();
});
test('a current GM cannot render stale pending details belonging to another room', () => {
  useGameStore.setState({ isGMMode: true, multiplayerRoom: { id: 'another-room' } }); render(<GmPanel />);
  expect(screen.queryByRole('region', { name: 'Spell adjudication' })).toBeNull(); expect(screen.queryByText(/PRIVATE/)).toBeNull();
});
test('Resolving Strike owner approval and GM confirmation panels show the two-note I, V executable price', () => {
  useGameStore.setState({ isInMultiplayer: true, isGMMode: true, multiplayerRoom: { id: 'current-room' } });
  useCharacterStore.setState({ id: 'ilse', currentCharacterId: 'ilse', class: 'Minstrel', stats: { spirit: 18 }, classResource: { type: 'musicalNotes', notes: [2, 0, 0, 0, 1, 0, 0] } });
  useCharacterTokenStore.setState({ characterTokens: [] });
  useCreatureStore.setState({ creatureTokens: [{ id: 'B', mapId: 'm', name: 'B', state: { currentHp: 30, tempHealth: 0, actorContract: { kind: 'creature', roomId: 'current-room', mapId: 'm', tokenId: 'B', instanceId: 'i-b' } } }] });
  const resolvingApproval = {
    roomId: 'current-room', approvalId: 'res-1',
    source: { kind: 'character', mapId: 'm', tokenId: 'pc', instanceId: 'i-pc' },
    target: { kind: 'creature', mapId: 'm', tokenId: 'B', instanceId: 'i-b' },
    spell: { definitionId: 'minstrel_resolving_strike', name: 'Resolving Strike', kind: 'damage', damageTypes: ['storm'] },
    roll: { mode: 'physical', dice: [{ sides: 8, faces: [5] }], constant: 18, total: 23, reading: '1d8 + spirit → 1d8 + 18 (SPI score)' },
    price: { ap: 1, mana: 4 },
    classPayment: { domain: 'musicalNotes', price: { costs: ['I', 'V'], gains: [] }, beforePublic: { type: 'musicalNotes', current: 3, max: 35 }, afterPublic: { type: 'musicalNotes', current: 1, max: 35 } }
  };
  useSpellConsequenceStore.setState({ owner: { spellId: 'minstrel_resolving_strike', origin: {} }, ownerStatus: null, gmPending: { 'res-1': { approval: resolvingApproval, contentHash: 'h' } }, gmStatus: {} });
  render(<SpellConsequencePanel />);
  expect(screen.getAllByText(/2 Musical Notes spent \(I, V\); 0 gained \(none\)/)).toHaveLength(2);
  expect(screen.getByText(/I×2 II×0 III×0 IV×0 V×1 VI×0 VII×0 → I×1 II×0 III×0 IV×0 V×0 VI×0 VII×0/)).toBeTruthy();
  expect(screen.getByText(/class 3\/35 → 1\/35/)).toBeTruthy();
});
