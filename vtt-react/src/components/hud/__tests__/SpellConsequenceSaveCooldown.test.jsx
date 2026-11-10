import React from 'react';
import { render, screen } from '@testing-library/react';
import SpellConsequencePanel from '../SpellConsequencePanel';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCreatureStore from '../../../store/creatureStore';
import { TYPE } from '../../../services/authoredCooldown';

let mockSupport;
const save = { scope: 'condition', ability: 'constitution', dc: 12, outcome: 'negates' };
const support = { supported: true, kind: 'effect', name: 'Rime Hobble', definitionId: 'witness', price: { ap: 1, mana: 2 }, payment: { affordable: true }, cooldown: { type: TYPE, value: 2, definitionId: 'witness' },
  formula: '1d6+2', reading: { supported: true, dice: [{ count: 1, sides: 6 }], constant: 2, reading: '1d6+2' },
  timing: { expiryPolicy: 'target-next-end', durationText: 'Until the frost thaws' },
  effectTerms: { direct: { kind: 'damage', formula: '1d6+2', damageTypes: ['rime'] }, condition: { kind: 'movement', feet: -10, label: 'Rime Hobble' }, save, timing: { expiryPolicy: 'target-next-end', durationText: 'Until the frost thaws' } } };
jest.mock('../../../store/gameStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ isInMultiplayer: true, isGMMode: false, multiplayerRoom: { id: 'r' } })) }));
jest.mock('../../../store/characterStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ currentCharacterId: 'caster' })) }));
jest.mock('../../../store/characterTokenStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ characterTokens: [] })) }));
jest.mock('../../../store/creatureStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ creatureTokens: [], creatures: [] })) }));
jest.mock('../../../services/spellConsequence', () => ({ ...jest.requireActual('../../../services/spellConsequence'), supportSpell: () => mockSupport }));
jest.mock('../../../services/spellConsequenceService', () => ({
  useSpellConsequenceStore: require('zustand').create(() => ({ owner: { spellId: 'witness', origin: {} }, ownerStatus: null, gmPending: {}, gmStatus: {} })),
  ownerSource: () => { const token = require('../../../store/characterTokenStore').default.getState().characterTokens[0]; return { token, ref: require('../../../services/actorConsequenceService').refOf(token), mapId: 'm' }; },
  restoreOwnerStatus: jest.fn(), spellDraftContext: () => ({}), loadSpellDraft: () => null, loadDiscardedSpellDrafts: () => [],
  retainedTargetResponses: () => [], creatureAttempt: () => null, sendSpellApproval: jest.fn(), refreshSpellApprovals: jest.fn()
}));
const pc = (id, owner, instance = id) => ({ id, mapId: 'm', ownerUserId: owner,
  character: { id, name: id, actionPoints: { current: 4 }, mana: { current: 10 } }, state: { conditions: [],
    actorContract: { version: 1, kind: 'character', roomId: 'r', mapId: 'm', tokenId: id, instanceId: instance, ownerUid: owner, characterId: id, primary: true, revision: 0 } } });
const creature = id => ({ id, mapId: 'm', name: id, state: { conditions: [], actorContract: { version: 1, kind: 'creature', roomId: 'r', mapId: 'm', tokenId: id, instanceId: id, revision: 0 } } });

// Rider-save cooldowns: the existing owner panel already shows both outcomes, the save, and the cooldown procedure with the rider separation,
// and offers creatures only. No panel copy was added for this composition (the Wizard Cooldown step names it).
test('save + cooldown: both recorded outcomes, the save, the cooldown procedure with rider separation, and creature-only targets', () => {
  mockSupport = support;
  useCharacterTokenStore.setState({ characterTokens: [pc('caster', 'source-owner'), pc('ally', 'target-owner')] });
  useCreatureStore.setState({ creatureTokens: [creature('B')] });
  render(<SpellConsequencePanel />);
  const outcomes = screen.getByText('Outcomes').nextSibling.textContent;
  expect(outcomes).toMatch(/sav/i); expect(outcomes).toMatch(/fail/i); expect(outcomes).toContain('Rime Hobble');
  expect(screen.getByText('Save').nextSibling.textContent).toContain('You approve both outcomes now');
  const cooldown = screen.getByText('Cooldown').nextSibling.textContent;
  expect(cooldown).toContain('Separate from the Rime Hobble effect: it keeps its own duration; removing or expiring it does not release the cooldown');
  expect(screen.queryByRole('option', { name: 'ally · character · ally' })).toBeNull();
  expect(screen.queryByRole('option', { name: /B · creature/ })).not.toBeNull();
  expect(screen.getByText(/PC targets unavailable/).textContent).toContain('an ability with a caster-start cooldown applies to one placed creature only');
});
