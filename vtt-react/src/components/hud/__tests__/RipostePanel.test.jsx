import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import RiposteHost from '../RipostePanel';
import { useRiposteStore, approveRiposte } from '../../../services/riposteService';
import { useCombatFeedStore, actorKey } from '../../../services/acceptedResultFeed';
jest.mock('../../../store/gameStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ multiplayerSocket: { connected: true }, multiplayerRoom: { id: 'r' }, isGMMode: false })) }));
jest.mock('../../../store/authStore', () => ({ __esModule: true, default: selector => selector({ user: { uid: 'u' } }) }));
jest.mock('../../../store/characterStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ currentCharacterId: 'c', stats: { strength: 10, agility: 10 }, equipment: {} })) }));
jest.mock('../../../persistence/bootstrapPrivacyGate', () => ({ isPrivateProjectionIsolated: () => false, getBootstrapGateState: () => ({ accountGeneration: 1 }), subscribeBootstrapGate: () => () => {} }));
jest.mock('../../../services/actorConsequenceService', () => ({ findActor: () => ({ state: {} }), refOf: () => null }));
jest.mock('../../../services/reactionWindowService', () => ({ reactionPrincipal: () => 'principal', useReactionWindowStore: () => ({ epoch: 'we', windows: [] }) }));
jest.mock('../../../services/riposteService', () => ({ useRiposteStore: require('zustand').create(() => ({})), bindRiposte: () => () => {},
  approveRiposte: jest.fn().mockResolvedValue({}), refreshRiposte: jest.fn(), retainRiposteRoll: jest.fn() }));
const source = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'p1', ownerUid: 'u', characterId: 'c' };
const target = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'foe', instanceId: 'f1' };
const p = { id: 'opportunity', source, target, windowId: 'window', status: 'ready', parryPayment: 'GM-attested-paid; not charged by Riposte' };
beforeEach(() => {
  jest.clearAllMocks();
  useRiposteStore.setState({ principal: 'principal', opportunities: [p], pending: [], status: '', saved: { owner: { opportunity: { phase: 'draft', roll: { mode: 'physical', faces: [3] }, weapon: { name: 'Unarmed' } } }, gm: {} } });
  useCombatFeedStore.setState({ rendered: { [actorKey(target)]: 1 } });
});
test('explicit exact-target/1AP consent reuses retained faces with no extra proficiency or formula', async() => {
  render(<RiposteHost />); fireEvent.click(screen.getByRole('button', { name: 'Riposte execution — structured opportunity' }));
  expect(screen.getByRole('dialog', { name: 'Universal Riposte execution' })).toBeInTheDocument();
  expect(screen.getByText(/Retained physical faces: 3/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Roll digital Riposte once' })).toBeDisabled();
  await act(async() => fireEvent.click(screen.getByRole('button', { name: 'Approve exact target and1 AP Riposte' })));
  expect(approveRiposte).toHaveBeenCalledWith(p);
  expect(screen.getByText(/Conditions, buffs\/debuffs/)).toHaveTextContent(/not applied/);
});
test('no RP surface for unrelated observers and no stale private DOM after principal retirement', () => {
  const view = render(<RiposteHost />); fireEvent.click(screen.getByRole('button', { name: 'Riposte execution — structured opportunity' }));
  act(() => useRiposteStore.setState({ principal: 'retired' }));
  expect(screen.queryByRole('dialog')).toBeNull();
  act(() => useRiposteStore.setState({ principal: 'principal', opportunities: [], saved: null }));
  expect(screen.queryByRole('button', { name: /Riposte execution/ })).toBeNull(); view.unmount();
});
