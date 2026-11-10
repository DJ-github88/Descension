import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import SpellConsequencePanel from '../SpellConsequencePanel';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCreatureStore from '../../../store/creatureStore';
import { refOf } from '../../../services/actorConsequenceService';
import { pickKey } from '../../../services/targetPick';
import { useCombatFeedStore, actorKey } from '../../../services/acceptedResultFeed';
import { sendSpellApproval, saveSpellDraft } from '../../../services/spellConsequenceService';

let mockDraft;
const mockRoll = { mode: 'physical', dice: [{ count: 2, sides: 6, faces: [4, 5] }], constant: 8, total: 17, reading: '2d6 + 8' };
jest.mock('../../../store/gameStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ isInMultiplayer: true, isGMMode: false, multiplayerRoom: { id: 'r' }, gridSize: 50, feetPerTile: 5 })) }));
jest.mock('../../../store/characterStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ currentCharacterId: 'caster' })) }));
jest.mock('../../../store/characterTokenStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ characterTokens: [] })) }));
jest.mock('../../../store/creatureStore', () => ({ __esModule: true, getCreatureSizeMapping: () => ({ width: 1, height: 1 }), default: require('zustand').create(() => ({ creatureTokens: [], creatures: [] })) }));
jest.mock('../../../services/spellConsequence', () => ({ ...jest.requireActual('../../../services/spellConsequence'), supportSpell: () => ({
  supported: true, isArea: true, kind: 'damage', name: 'Pulse', definitionId: 'witness', definitionHash: 'authored-area:v1/test', damageTypes: ['arcane'],
  areaTerms: { radiusFeet: 20, rangeFeet: 30, maxTargets: 8, restriction: 'enemy' }, price: { ap: 1, mana: 2 }, payment: { affordable: true },
  reading: { dice: [{ count: 2, sides: 6 }], reading: '2d6 + 8' }, cooldown: { value: 0 }, rollAttributes: {} }) }));
jest.mock('../../../services/spellConsequenceCustody', () => ({ loadLatestSpell: () => ({ draft: mockDraft }), unresolvedSpell: () => false }));
jest.mock('../../../services/spellConsequenceService', () => ({
  useSpellConsequenceStore: require('zustand').create(() => ({ owner: { spellId: 'witness', origin: {} }, ownerStatus: null, gmPending: {}, gmStatus: {} })),
  ownerSource: () => { const token = require('../../../store/characterTokenStore').default.getState().characterTokens[0]; return { token, ref: require('../../../services/actorConsequenceService').refOf(token), mapId: 'm' }; },
  restoreOwnerStatus: jest.fn(), spellDraftContext: () => ({ spellId: 'witness' }), loadSpellDraft: () => mockDraft, loadDiscardedSpellDrafts: () => [],
  saveSpellDraft: jest.fn(value => { mockDraft = value; }),
  retainedTargetResponses: () => [], creatureAttempt: () => null, sendSpellApproval: jest.fn(), refreshSpellApprovals: jest.fn()
}));
const creature = (id, instanceId = id) => ({ id, mapId: 'm', name: id, position: { x: 425, y: 325 }, state: { conditions: [],
  actorContract: { version: 1, kind: 'creature', roomId: 'r', mapId: 'm', tokenId: id, instanceId, revision: 0 } } });
const pc = { id: 'pc', mapId: 'm', ownerUserId: 'owner', position: { x: 625, y: 325 },
  character: { id: 'caster', name: 'Caster', actionPoints: { current: 4 }, mana: { current: 10 } }, state: { conditions: [],
    actorContract: { version: 1, kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'pc', ownerUid: 'owner', characterId: 'caster', primary: true, revision: 0 } } };
const approve = () => screen.getByRole('button', { name: /Approve one source payment/ });
beforeEach(() => {
  jest.clearAllMocks();
  saveSpellDraft.mockImplementation(value => { mockDraft = value; });
  const targets = ['A', 'B', 'C'].map(id => creature(id));
  useCharacterTokenStore.setState({ characterTokens: [pc] });
  useCreatureStore.setState({ creatureTokens: targets });
  useCombatFeedStore.setState({ rendered: Object.fromEntries(targets.map(t => [actorKey(refOf(t)), 1])) });
  mockDraft = { context: { spellId: 'witness' }, label: 'Pulse', roll: mockRoll, targetKeys: targets.map(t => pickKey(refOf(t))), areaOrigin: { x: 475, y: 325 } };
});

test('restores exact three-target draft (including withdrawn approval keys) and sends exact refs with retained faces', async () => {
  render(<SpellConsequencePanel />);
  expect(approve().disabled).toBe(false);
  await act(async () => fireEvent.click(approve()));
  expect(sendSpellApproval).toHaveBeenCalledWith(expect.objectContaining({ targetRefs: ['A', 'B', 'C'].map(id => refOf(creature(id))), roll: mockRoll }));
});

test.each(['removed', 'hidden', 'replaced'])('%s target blocks silent subset approval; explicit removal keeps faces and never adopts replacement', async mode => {
  const mounted = render(<SpellConsequencePanel />);
  fireEvent.click(screen.getByRole('button', { name: 'Center at caster' }));
  act(() => useCreatureStore.setState(s => ({ creatureTokens: mode === 'removed' ? s.creatureTokens.filter(t => t.id !== 'B') : s.creatureTokens.map(t => t.id !== 'B' ? t : mode === 'hidden' ? { ...t, name: 'SECRET', state: { ...t.state, hiddenFromPlayers: true } } : creature('B', 'replacement')) })));
  expect(approve().disabled).toBe(true);
  expect(screen.getByRole('alert').textContent).toContain('recorded dice are retained');
  expect(screen.queryByText(/SECRET/)).toBeNull();
  fireEvent.click(approve());
  expect(sendSpellApproval).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Remove unavailable selections' }));
  expect(saveSpellDraft).toHaveBeenLastCalledWith(expect.objectContaining({ targetKeys: [pickKey(refOf(creature('A'))), pickKey(refOf(creature('C')))], roll: mockRoll }));
  expect(approve().disabled).toBe(false);
  mounted.unmount();
  render(<SpellConsequencePanel />);
  expect(approve().disabled).toBe(false);
  await act(async () => fireEvent.click(approve()));
  expect(sendSpellApproval).toHaveBeenCalledWith(expect.objectContaining({ targetRefs: [refOf(creature('A')), refOf(creature('C'))], roll: mockRoll }));
});

test('legacy slot-only keys fail closed; explicit placement creates exact keys without replacing the dice', () => {
  mockDraft.targetKeys = ['creature:m:A', 'creature:m:B', 'creature:m:C'];
  render(<SpellConsequencePanel />);
  expect(approve().disabled).toBe(true);
  fireEvent.click(screen.getByRole('button', { name: 'Center at caster' }));
  expect(saveSpellDraft).toHaveBeenLastCalledWith(expect.objectContaining({ targetKeys: ['A', 'B', 'C'].map(id => pickKey(refOf(creature(id)))), roll: mockRoll }));
  expect(approve().disabled).toBe(false);
});
