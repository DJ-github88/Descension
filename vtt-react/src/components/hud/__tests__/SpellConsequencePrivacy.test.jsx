import React from 'react';
import { render, screen } from '@testing-library/react';
import { GmPanel } from '../SpellConsequencePanel';
import useGameStore from '../../../store/gameStore';
import { useSpellConsequenceStore } from '../../../services/spellConsequenceService';
jest.mock('../../../store/gameStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ isGMMode: false, multiplayerRoom: { id: 'current-room' } })) }));
jest.mock('../../../store/characterStore', () => ({ __esModule: true, default: require('zustand').create(() => ({})) }));
jest.mock('../../../store/characterTokenStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ characterTokens: [] })) }));
jest.mock('../../../store/creatureStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ creatureTokens: [] })) }));
jest.mock('../../../services/spellConsequenceService', () => ({
  useSpellConsequenceStore: require('zustand').create(() => ({ gmPending: {}, gmStatus: {} })),
  refreshSpellApprovals: jest.fn(), gmConditionResolution: () => null
}));
const approval = { roomId: 'current-room', approvalId: 'retained', source: { kind: 'character', tokenId: 'private-source' }, target: { kind: 'character', tokenId: 'private-target' },
  spell: { kind: 'condition', name: 'PRIVATE retained A9 ability' }, conditionTerms: { timing: { durationText: 'PRIVATE duration', gmNote: 'PRIVATE definition note' } }, price: { ap: 1, mana: 2 } };
beforeEach(() => { useGameStore.setState({ isGMMode: false, multiplayerRoom: { id: 'current-room' } }); useSpellConsequenceStore.setState({ gmPending: { retained: { approval } }, gmStatus: {} }); });
test('a non-GM cannot render retained GM pending details after account handoff', () => {
  render(<GmPanel />); expect(screen.queryByRole('region', { name: 'Spell adjudication' })).toBeNull(); expect(screen.queryByText(/PRIVATE/)).toBeNull();
});
test('a current GM cannot render stale pending details belonging to another room', () => {
  useGameStore.setState({ isGMMode: true, multiplayerRoom: { id: 'another-room' } }); render(<GmPanel />);
  expect(screen.queryByRole('region', { name: 'Spell adjudication' })).toBeNull(); expect(screen.queryByText(/PRIVATE/)).toBeNull();
});
