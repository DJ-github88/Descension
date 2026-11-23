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
  supported: true, isArea: true, kind: 'damage', name: 'Caster Line', definitionId: 'witness', definitionHash: 'authored-area:v1/test', damageTypes: ['arcane'],
  areaTerms: { kind: 'area', aoeShape: 'line', lengthFeet: 15, widthFeet: 5, rangeFeet: 30, maxTargets: 8, restriction: 'enemy' }, price: { ap: 1, mana: 2 }, payment: { affordable: true },
  reading: { dice: [{ count: 2, sides: 6 }], reading: '2d6 + 8' }, cooldown: { value: 0 }, rollAttributes: {} }) }));
jest.mock('../../../services/spellConsequenceCustody', () => ({ loadLatestSpell: () => ({ draft: mockDraft }), unresolvedSpell: () => false }));
jest.mock('../../../services/spellConsequenceService', () => ({
  useSpellConsequenceStore: require('zustand').create(() => ({ owner: { spellId: 'witness', origin: {} }, ownerStatus: null, gmPending: {}, gmStatus: {} })),
  ownerSource: () => { const token = require('../../../store/characterTokenStore').default.getState().characterTokens[0]; return { token, ref: require('../../../services/actorConsequenceService').refOf(token), mapId: 'm' }; },
  restoreOwnerStatus: jest.fn(), spellDraftContext: () => ({ spellId: 'witness' }), loadSpellDraft: () => mockDraft, loadDiscardedSpellDrafts: () => [],
  saveSpellDraft: jest.fn(value => { mockDraft = value; }),
  retainedTargetResponses: () => [], creatureAttempt: () => null, sendSpellApproval: jest.fn(), refreshSpellApprovals: jest.fn()
}));
const POS = { A: { x: 675, y: 325 }, B: { x: 775, y: 325 }, C: { x: 875, y: 325 } };
const creature = (id, instanceId = id) => ({ id, mapId: 'm', name: id, position: POS[id], state: { conditions: [],
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
  // A stale, saved OFF-CASTER origin (the old movable-origin draft shape) and an eastward aim.
  mockDraft = { context: { spellId: 'witness' }, label: 'Caster Line', roll: mockRoll, targetKeys: ['A', 'B'].map(id => pickKey(refOf(creature(id)))), areaOrigin: { x: 725, y: 325 }, areaTarget: { x: 875, y: 325 } };
});


test('D-LINE-1: an aimed Line with valid targets renders, enables Approve, and submits the caster position as the origin', async () => {
  render(<SpellConsequencePanel />);
  expect(screen.queryByRole('button', { name: /Center origin at caster|Move line origin/ })).toBeNull();
  expect(screen.queryByText(/placement range|placed origin/)).toBeNull();
  expect(screen.getAllByText(/starts at the caster/).length).toBeGreaterThan(0);
  expect(approve().disabled).toBe(false);
  await act(async () => fireEvent.click(approve()));
  expect(sendSpellApproval).toHaveBeenCalledTimes(1);
  const sent = sendSpellApproval.mock.calls[0][0];
  expect(sent.areaOrigin).toEqual(pc.position); // never the stale saved origin (725,325)
  expect(sent.targetRefs).toEqual(['A', 'B'].map(id => refOf(creature(id))));
});
