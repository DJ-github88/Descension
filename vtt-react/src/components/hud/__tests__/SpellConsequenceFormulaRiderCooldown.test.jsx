import React from 'react';
import { render, screen } from '@testing-library/react';
import SpellConsequencePanel from '../SpellConsequencePanel';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCreatureStore from '../../../store/creatureStore';
import { TYPE } from '../../../services/authoredCooldown';

let mockSupport;
const support = { supported: true, kind: 'effect', name: 'Mind Hobble', definitionId: 'witness', price: { ap: 2, mana: 3 }, payment: { affordable: true }, cooldown: { type: TYPE, value: 2, definitionId: 'witness' },
  formula: '2d6 + intelligence/3', reading: { supported: true, dice: [{ count: 2, sides: 6 }], constant: 4, reading: '2d6 + intelligence/3 → 2d6 + 4' }, rollAttributes: { intelligence: 14 },
  timing: { expiryPolicy: 'target-next-end', durationText: 'Until the embers cool' },
  effectTerms: { direct: { kind: 'damage', formula: '2d6 + intelligence/3', damageTypes: ['ember'] }, condition: { kind: 'movement', feet: -10, label: 'Hobbled' }, timing: { expiryPolicy: 'target-next-end', durationText: 'Until the embers cool' } } };
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
  character: { id, name: id, stats: { intelligence: 14 }, actionPoints: { current: 4 }, mana: { current: 10 } }, state: { conditions: [],
    actorContract: { version: 1, kind: 'character', roomId: 'r', mapId: 'm', tokenId: id, instanceId: instance, ownerUid: owner, characterId: id, primary: true, revision: 0 } } });
const creature = id => ({ id, mapId: 'm', name: id, state: { conditions: [], actorContract: { version: 1, kind: 'creature', roomId: 'r', mapId: 'm', tokenId: id, instanceId: id, revision: 0 } } });

// Formula-rider cooldowns: the existing panel shows both disclosures (owner-attested scores with retained-face reapproval, and the cooldown
// procedure with the rider separation) and offers creatures only; no new copy was added for this composition.
test('scaled rider + cooldown: creature-only targets with the cooldown reason, the cooldown procedure with rider separation, and the M4A disclosure', () => {
  mockSupport = support;
  useCharacterTokenStore.setState({ characterTokens: [pc('caster', 'source-owner'), pc('ally', 'target-owner')] });
  useCreatureStore.setState({ creatureTokens: [creature('B')] });
  render(<SpellConsequencePanel />);
  expect(screen.queryByRole('option', { name: 'ally · character · ally' })).toBeNull();
  expect(screen.queryByRole('option', { name: /B · creature/ })).not.toBeNull();
  expect(screen.getByText(/PC targets unavailable/).textContent).toContain('an ability with a caster-start cooldown applies to one placed creature only');
  const cooldown = screen.getByText('Cooldown').nextSibling.textContent;
  expect(cooldown).toContain('Separate from the Hobbled effect: it keeps its own duration; removing or expiring it does not release the cooldown');
  expect(screen.getByText(/Caster effective scores are owner-attested/).textContent).toMatch(/intelligence 14.*approval again with these same faces/);
});
