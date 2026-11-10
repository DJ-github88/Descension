import React from 'react';
import { render, screen } from '@testing-library/react';
import SpellConsequencePanel from '../SpellConsequencePanel';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCreatureStore from '../../../store/creatureStore';
import { TYPE } from '../../../services/authoredCooldown';

let mockSupport;
const support = cooldown => ({ supported: true, kind: 'effect', name: 'Hobble', definitionId: 'witness', price: { ap: 1, mana: 2 }, payment: { affordable: true }, cooldown,
  timing: { expiryPolicy: 'target-next-end', durationText: 'Until the embers cool' },
  effectTerms: { direct: null, condition: { kind: 'movement', feet: 10, label: 'Hastened' }, timing: { expiryPolicy: 'target-next-end', durationText: 'Until the embers cool' } } });
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

// Effect cooldowns (review F1): a movement rider with the caster-start cooldown offers no PC target; the same rider without one keeps it.
test.each([[{ type: TYPE, value: 1, definitionId: 'witness' }, false], [{ type: 'none', value: 0 }, true]])('cooldown %j → PC target offered: %s', (cooldown, offered) => {
  mockSupport = support(cooldown);
  useCharacterTokenStore.setState({ characterTokens: [pc('caster', 'source-owner'), pc('ally', 'target-owner')] });
  useCreatureStore.setState({ creatureTokens: [creature('B')] });
  render(<SpellConsequencePanel />);
  expect(!!screen.queryByRole('option', { name: 'ally · character · ally' })).toBe(offered);
  const note = screen.queryByText(/PC targets unavailable/);
  if (offered) expect(note).toBeNull();
  else expect(note.textContent).toContain('an ability with a caster-start cooldown applies to one placed creature only');
});
