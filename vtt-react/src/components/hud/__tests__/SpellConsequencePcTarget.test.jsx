import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import SpellConsequencePanel from '../SpellConsequencePanel';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import { sendSpellApproval } from '../../../services/spellConsequenceService';

jest.mock('../../../store/gameStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ isInMultiplayer: true, isGMMode: false, multiplayerRoom: { id: 'r' } })) }));
jest.mock('../../../store/characterStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ currentCharacterId: 'caster' })) }));
jest.mock('../../../store/characterTokenStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ characterTokens: [] })) }));
jest.mock('../../../store/creatureStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ creatureTokens: [], creatures: [] })) }));
jest.mock('../../../services/spellConsequence', () => ({ ...jest.requireActual('../../../services/spellConsequence'), supportSpell: () => ({
  supported: true, kind: 'effect', name: 'Quickening', definitionId: 'witness', price: { ap: 1, mana: 2 }, payment: { affordable: true }, cooldown: { value: 0 },
  timing: { expiryPolicy: 'gm-manual', durationText: 'Until removed' },
  effectTerms: { direct: null, condition: { kind: 'attribute', attribute: 'agility', amount: 2, label: 'Quickened' }, timing: { expiryPolicy: 'gm-manual', durationText: 'Until removed' } }
}) }));
jest.mock('../../../services/spellConsequenceService', () => ({
  useSpellConsequenceStore: require('zustand').create(() => ({ owner: { spellId: 'witness', origin: {} }, ownerStatus: null, gmPending: {}, gmStatus: {} })),
  ownerSource: () => { const token = require('../../../store/characterTokenStore').default.getState().characterTokens[0]; return { token, ref: require('../../../services/actorConsequenceService').refOf(token), mapId: 'm' }; },
  restoreOwnerStatus: jest.fn(), spellDraftContext: () => ({}), loadSpellDraft: () => null, loadDiscardedSpellDrafts: () => [],
  retainedTargetResponses: () => [], creatureAttempt: () => null, sendSpellApproval: jest.fn(), refreshSpellApprovals: jest.fn()
}));
const pc = (id, owner, instance = id) => ({ id, mapId: 'm', ownerUserId: owner,
  character: { id, name: id, actionPoints: { current: 4 }, mana: { current: 10 } }, state: { conditions: [],
    actorContract: { version: 1, kind: 'character', roomId: 'r', mapId: 'm', tokenId: id, instanceId: instance, ownerUid: owner, characterId: id, primary: true, revision: 0 } } });
test('normal target select binds exact PC identity, shows consent/price, and replacement requires explicit reselection', async() => {
  const caster = pc('caster', 'source-owner'), target = pc('ally', 'target-owner');
  useCharacterTokenStore.setState({ characterTokens: [caster, target] });
  render(<SpellConsequencePanel />);
  const select = screen.getByRole('combobox', { name: 'Target' });
  const option = screen.getByRole('option', { name: 'ally · character · ally' });
  expect(screen.queryByRole('option', { name: /caster · character/ })).toBeNull();
  fireEvent.change(select, { target: { value: option.value } });
  expect(screen.getByText(/1 AP · 2 mana/)).toBeTruthy();
  expect(screen.getByText(/Player character target/).textContent).toMatch(/accept/i);
  const approve = screen.getByRole('button', { name: 'Approve exact price, target, effects and duration' });
  fireEvent.click(approve);
  expect(sendSpellApproval.mock.calls[0][0].targetRef).toMatchObject({ tokenId: 'ally', instanceId: 'ally', ownerUid: 'target-owner', characterId: 'ally' });
  await waitFor(() => expect(select.disabled).toBe(false));
  act(() => useCharacterTokenStore.setState({ characterTokens: [caster, pc('ally', 'new-owner', 'new-instance')] }));
  expect(screen.getByRole('alert').textContent).toMatch(/replaced or no longer eligible/);
  expect(approve.disabled).toBe(true);
  fireEvent.change(select, { target: { value: screen.getByRole('option', { name: 'ally · character · ally' }).value } });
  expect(approve.disabled).toBe(false);
});
