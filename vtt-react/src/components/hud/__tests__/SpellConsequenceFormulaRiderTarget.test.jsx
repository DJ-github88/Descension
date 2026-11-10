import React from 'react';
import { render, screen } from '@testing-library/react';
import SpellConsequencePanel from '../SpellConsequencePanel';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCreatureStore from '../../../store/creatureStore';

let mockSupport;
const support = rollAttributes => ({ supported: true, kind: 'effect', name: 'Mind Hobble', definitionId: 'witness', price: { ap: 2, mana: 3 }, payment: { affordable: true }, cooldown: { type: 'none', value: 0 },
  formula: rollAttributes ? '2d6 + intelligence/3' : '1d6+2', reading: { supported: true, dice: [{ count: rollAttributes ? 2 : 1, sides: 6 }], constant: rollAttributes ? 4 : 2, reading: rollAttributes ? '2d6 + intelligence/3 → 2d6 + 4' : '1d6+2' },
  ...(rollAttributes ? { rollAttributes } : {}), timing: { expiryPolicy: 'target-next-end', durationText: 'Until the embers cool' },
  effectTerms: { direct: { kind: 'damage', formula: rollAttributes ? '2d6 + intelligence/3' : '1d6+2', damageTypes: ['ember'] }, condition: { kind: 'movement', feet: -10, label: 'Hobbled' }, timing: { expiryPolicy: 'target-next-end', durationText: 'Until the embers cool' } } });
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

// Formula riders: an attribute-scaled immediate part with a rider offers creatures only and says why; the same plain rider keeps the PC route.
test.each([[{ intelligence: 14 }, false], [null, true]])('rollAttributes %j → PC target offered: %s', (rollAttributes, offered) => {
  mockSupport = support(rollAttributes);
  useCharacterTokenStore.setState({ characterTokens: [pc('caster', 'source-owner'), pc('ally', 'target-owner')] });
  useCreatureStore.setState({ creatureTokens: [creature('B')] });
  render(<SpellConsequencePanel />);
  expect(!!screen.queryByRole('option', { name: 'ally · character · ally' })).toBe(offered);
  expect(!!screen.queryByRole('option', { name: /B · creature/ })).toBe(true);
  const note = screen.queryByText(/PC targets unavailable/);
  if (offered) expect(note).toBeNull();
  else expect(note.textContent).toContain('an attribute-scaled immediate part with an effect applies to one placed creature only');
});
