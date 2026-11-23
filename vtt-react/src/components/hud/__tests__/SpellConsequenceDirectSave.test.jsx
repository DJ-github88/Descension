/** Direct-damage save (handoff/direct-damage-save/CONTRACT.md) on the merged HUD panel: the GM records the table's save outcome on the
 * Direct Damage part; the panel shows the exact amount the shared rule will apply and sends only the pre-save final and the branch.
 * Scaffolding copied from SpellConsequenceHierarchy.test.jsx (same mocks). */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SpellConsequenceHost from '../SpellConsequencePanel';
import useGameStore from '../../../store/gameStore';
import useCharacterStore from '../../../store/characterStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCreatureStore from '../../../store/creatureStore';
import { useSpellConsequenceStore } from '../../../services/spellConsequenceService';
import { useTriggerOfferStore } from '../../../services/triggerOfferService';
import { usePassiveActivationStore } from '../../../services/passiveActivationService';

jest.mock('../../../services/spellConsequence', () => ({
  ...jest.requireActual('../../../services/spellConsequence'),
  supportSpell: jest.fn(() => ({
    supported: true,
    kind: 'damage',
    name: 'Arcane Bolt',
    definitionId: 'spell-1',
    definitionHash: 'h1',
    damageTypes: ['arcane'],
    reading: { reading: '1d8 + 4', dice: [{ count: 1, sides: 8 }], constant: 4 },
    price: { ap: 1, mana: 4 },
    cooldown: { value: 0, type: 'none' },
    payment: { affordable: true, domain: 'none', classPayment: null },
    raw: { targetingConfig: { rangeDistance: 30, rangeType: 'ranged' } }
  }))
}));

jest.mock('../../../services/spellConsequenceService', () => {
  const { create } = require('zustand');
  const store = create(() => ({
    owner: null,
    ownerStatus: null,
    gmPending: {},
    gmStatus: {},
    targetProposals: [],
    authoredEntries: [],
    authoredRoomId: 'room-1',
    draftVersion: 0,
    registryRevision: 0,
    relationshipRevision: 0,
    relationshipRevisions: {}
  }));
  return {
    useSpellConsequenceStore: store,
    ownerSource: jest.fn(() => ({ ref: null, token: null, error: 'none' })),
    restoreOwnerStatus: jest.fn(),
    refreshAuthoredAbilities: jest.fn().mockResolvedValue({ success: true }),
    refreshSpellApprovals: jest.fn().mockResolvedValue({ success: true }),
    retainedTargetResponses: jest.fn(() => []),
    loadSpellDraft: jest.fn(() => null),
    loadDiscardedSpellDrafts: jest.fn(() => []),
    spellDraftContext: jest.fn(() => ({ characterId: 'pc-1', spellId: 'spell-1' })),
    saveSpellDraft: jest.fn(),
    discardSpellDraft: jest.fn(),
    closeOwnerPanel: jest.fn(),
    sendSpellApproval: jest.fn(),
    checkSpellApproval: jest.fn(),
    withdrawSpellApproval: jest.fn(),
    reapproveSpell: jest.fn(),
    gmAcceptSpell: jest.fn(),
    gmDeclineSpell: jest.fn(),
    gmCheckSpellCommand: jest.fn(),
    markSpellReconciled: jest.fn(),
    gmConditionResolution: jest.fn(() => null),
    saveGmConditionResolution: jest.fn(),
    changeAuthoredAdmission: jest.fn(),
    routeSpellCast: jest.fn(() => true),
    creatureAttempt: jest.fn(() => null),
    saveCreatureRoll: jest.fn(),
    prepareCreatureAbility: jest.fn(),
    cancelCreatureAbility: jest.fn(),
    revalidateCreatureContext: jest.fn(),
    saveCreatureResolution: jest.fn(),
    designateVoluntaryCondition: jest.fn(),
    respondToVoluntaryCondition: jest.fn(),
    readTargetRelationship: jest.fn()
  };
});

jest.mock('../../../services/triggerOfferService', () => {
  const { create } = require('zustand');
  return {
    useTriggerOfferStore: create(() => ({
      projection: { roomId: 'room-1', viewerRole: 'gm', revision: 1, obligations: [], listeners: [] },
      loading: false,
      error: null,
      message: '',
      declined: [],
      setupRequest: null
    })),
    refreshTriggerLedger: jest.fn(),
    registerTriggerOfferHandlers: jest.fn(() => () => {}),
    registerFollowUp: jest.fn(),
    registerComponentWatch: jest.fn(),
    revokeTriggerListener: jest.fn(),
    dismissTriggerOffer: jest.fn(),
    declineTriggerOffer: jest.fn(),
    clearTriggerRegistrationSetup: jest.fn(),
    primaryPcSources: jest.fn(() => [
      { ref: { kind: 'character', roomId: 'room-1', mapId: 'm', tokenId: 'pc-1', instanceId: 'i-1' }, label: 'Ilse' }
    ]),
    FOLLOWUP_PREDICATE: { occurrence: 'immediate-damage', role: 'source', evidence: 'baseHpLost' },
    HEALING_FOLLOWUP_PREDICATE: { occurrence: 'immediate-healing', role: 'source', evidence: 'hpRestored' }
  };
});

jest.mock('../../../services/passiveActivationService', () => {
  const { create } = require('zustand');
  return {
    usePassiveActivationStore: create(() => ({
      projection: { success: true, roomId: 'room-1', viewerRole: 'gm', revision: 1, activations: [] },
      loading: false,
      error: null,
      message: ''
    })),
    refreshPassiveLedger: jest.fn(),
    registerPassiveHandlers: jest.fn(() => () => {}),
    activatePassive: jest.fn(),
    revokePassive: jest.fn(),
    primaryPcTargets: jest.fn(() => [
      {
        ref: { kind: 'character', roomId: 'room-1', mapId: 'm', tokenId: 'pc-1', instanceId: 'i-1' },
        label: 'Ilse',
        eligibility: { ok: true, rank: 'NOVICE', skillId: 'perception', minRank: 'NOVICE' }
      }
    ])
  };
});

const pcRef = { kind: 'character', roomId: 'room-1', mapId: 'm', tokenId: 'pc-1', instanceId: 'i-1' };
const foeRef = { kind: 'creature', roomId: 'room-1', mapId: 'm', tokenId: 'foe-1', instanceId: 'i-2' };

beforeEach(() => {
  jest.clearAllMocks();
  const scs = jest.requireMock('../../../services/spellConsequenceService');
  scs.ownerSource.mockReturnValue({ ref: null, token: null, error: 'none' });
  scs.retainedTargetResponses.mockReturnValue([]);
  scs.refreshAuthoredAbilities.mockResolvedValue({ success: true });
  scs.refreshSpellApprovals.mockResolvedValue({ success: true });
  scs.loadSpellDraft.mockReturnValue(null);
  scs.loadDiscardedSpellDrafts.mockReturnValue([]);
  scs.spellDraftContext.mockReturnValue({ characterId: 'pc-1', spellId: 'spell-1' });
  scs.routeSpellCast.mockReturnValue(true);
  scs.creatureAttempt.mockReturnValue(null);
  scs.gmConditionResolution.mockReturnValue(null);
  const tos = jest.requireMock('../../../services/triggerOfferService');
  tos.registerTriggerOfferHandlers.mockReturnValue(() => {});
  tos.primaryPcSources.mockReturnValue([
    { ref: { kind: 'character', roomId: 'room-1', mapId: 'm', tokenId: 'pc-1', instanceId: 'i-1' }, label: 'Ilse' }
  ]);
  const pas = jest.requireMock('../../../services/passiveActivationService');
  pas.registerPassiveHandlers.mockReturnValue(() => {});
  pas.primaryPcTargets.mockReturnValue([
    {
      ref: { kind: 'character', roomId: 'room-1', mapId: 'm', tokenId: 'pc-1', instanceId: 'i-1' },
      label: 'Ilse',
      eligibility: { ok: true, rank: 'NOVICE', skillId: 'perception', minRank: 'NOVICE' }
    }
  ]);
  jest.requireMock('../../../services/spellConsequence').supportSpell.mockReturnValue({
    supported: true,
    kind: 'damage',
    name: 'Arcane Bolt',
    definitionId: 'spell-1',
    definitionHash: 'h1',
    damageTypes: ['arcane'],
    reading: { reading: '1d8 + 4', dice: [{ count: 1, sides: 8 }], constant: 4 },
    price: { ap: 1, mana: 4 },
    cooldown: { value: 0, type: 'none' },
    payment: { affordable: true, domain: 'none', classPayment: null },
    raw: { targetingConfig: { rangeDistance: 30, rangeType: 'ranged' } }
  });
  useGameStore.setState({
    isInMultiplayer: true,
    isGMMode: true,
    multiplayerRoom: { id: 'room-1' },
    multiplayerSocket: { on: jest.fn(), off: jest.fn() },
    gridSize: 50,
    feetPerTile: 5
  });
  useCharacterStore.setState({ currentCharacterId: 'pc-1' });
  useCharacterTokenStore.setState({
    characterTokens: [{ id: 'pc-1', mapId: 'm', name: 'Ilse', character: { id: 'pc-1', name: 'Ilse', health: { current: 30, max: 30 } }, state: { conditions: [], actorContract: pcRef } }]
  });
  useCreatureStore.setState({
    creatureTokens: [{ id: 'foe-1', mapId: 'm', name: 'Alpha', state: { currentHp: 20, maxHp: 20, conditions: [], actorContract: foeRef } }]
  });
  useSpellConsequenceStore.setState({
    owner: null,
    ownerStatus: null,
    gmPending: {},
    gmStatus: {},
    targetProposals: [],
    authoredEntries: [],
    authoredRoomId: 'room-1'
  });
  useTriggerOfferStore.setState({
    projection: { roomId: 'room-1', viewerRole: 'gm', revision: 1, obligations: [], listeners: [] },
    declined: [],
    setupRequest: null
  });
  usePassiveActivationStore.setState({
    projection: { success: true, roomId: 'room-1', viewerRole: 'gm', revision: 1, activations: [] },
    error: null,
    message: ''
  });
});

const saveTerms = { scope: 'direct', ability: 'agility', dc: 15, outcome: 'halves' };
const pending = () => ({ 'app-ds': { approval: { approvalId: 'app-ds', roomId: 'room-1', source: pcRef, target: foeRef,
  spell: { name: 'Ember Half Lance', kind: 'damage', damageTypes: ['ember'], definitionId: 'spell-1', definitionHash: 'authored-immediate:v1/' + 'b'.repeat(64) },
  roll: { mode: 'physical', dice: [{ sides: 6, faces: [4, 2] }], constant: 3, total: 9, reading: '2d6+3' }, price: { ap: 1, mana: 3 }, classPayment: null, saveTerms }, targetProposal: null } });

test('GM direct-damage save: names the Direct Damage part, requires a recorded outcome, previews floor(9/2) = 4 and sends the pre-save final with the branch', () => {
  useSpellConsequenceStore.setState({ gmPending: pending() });
  const { container } = render(<SpellConsequenceHost />);
  const card = container.querySelector('.p9-gm-card');
  expect(card).toBeTruthy();
  expect(card.textContent).toMatch(/changes only this Direct Damage part/);
  expect(card.textContent).toMatch(/half the GM's final amount, rounded down/);
  expect(screen.getByText('Needs GM action')).toBeInTheDocument();
  const confirm = screen.getByRole('button', { name: 'Confirm recorded outcome' });
  fireEvent.click(screen.getByRole('checkbox', { name: /I adjudicated legality/ }));
  fireEvent.change(screen.getByLabelText(/^Final damage before the save/), { target: { value: '9' } });
  expect(confirm).toBeDisabled(); // no outcome recorded yet
  const radios = screen.getAllByRole('radio');
  expect(radios.map(r => r.parentElement.textContent)).toEqual([expect.stringMatching(/^ ?Target saves \(Agility DC 15/), expect.stringMatching(/^ ?Target fails \(Agility DC 15/)]);
  fireEvent.click(radios[0]);
  expect(screen.getByText(/Direct Damage applied:/).textContent).toMatch(/Direct Damage applied: 4 \(temporary HP first\), from your final amount 9/);
  expect(confirm).not.toBeDisabled();
  fireEvent.click(confirm);
  const { gmAcceptSpell } = jest.requireMock('../../../services/spellConsequenceService');
  expect(gmAcceptSpell).toHaveBeenCalledWith('app-ds', expect.objectContaining({ finalAmount: 9, branch: 'saved', adjudicated: true }));
  fireEvent.click(radios[1]);
  expect(screen.getByText(/Direct Damage applied:/).textContent).toMatch(/Direct Damage applied: 9 \(temporary HP first\)\./);
});
