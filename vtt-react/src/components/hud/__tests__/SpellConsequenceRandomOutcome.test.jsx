/**
 * HUD execution tests for random-outcome spells (DICE + COINS):
 *   - Reuses existing sources (spellConsequence.digitalRoll for dice, useDiceStore.startCoinFlip for fair coins,
 *     never invokes startCardDraw and never invents card deck/reshuffle/reveal rules)
 *   - Two different outcomes resolve two different authored branches and effects (damage vs healing)
 *   - Custody survives unmount + remount (reload) without rerolling or reflipping
 *   - Retrying or reloading after GM acceptance (phase: 'accepted') does not reroll, flip again,
 *     draw a card, or repeat payment/effect
 */
import React from 'react';
import { render, screen, fireEvent, act, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellConsequenceHost from '../SpellConsequencePanel';
import useGameStore from '../../../store/gameStore';
import useCharacterStore from '../../../store/characterStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCreatureStore from '../../../store/creatureStore';
import useDiceStore from '../../../store/diceStore';
import useAuthStore from '../../../store/authStore';
import useChatStore from '../../../store/chatStore';
import useConditionStore from '../../../store/conditionStore';
import { registerStore } from '../../../store/storeRegistry';
import * as spellConsequence from '../../../services/spellConsequence';
import { replaceAuthoredRegistry } from '../../../services/authoredAbilityRegistry';
import { definitionFromWizard } from '../../../services/authoredAbility';
import {
  useSpellConsequenceStore,
  consumeSpellReceipt,
  routeSpellCast,
  spellSupport
} from '../../../services/spellConsequenceService';
import { useTriggerOfferStore } from '../../../services/triggerOfferService';
import { usePassiveActivationStore } from '../../../services/passiveActivationService';
import { activatePrivateScope, clearToSignedOut } from '../../../persistence/bootstrapPrivacyGate';
import { createUserScope } from '../../../persistence/scopeModel';
import { loadLatestSpell, retainLatestSpell, spellContext } from '../../../services/spellConsequenceCustody';

if (typeof global.crypto === 'undefined' || !global.crypto.randomUUID) {
  Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true });
}

const pcRef = {
  kind: 'character',
  roomId: 'room-1',
  mapId: 'm',
  tokenId: 'pc-1',
  instanceId: 'i-pc',
  ownerUid: 'owner-1',
  characterId: 'pc-1'
};
const foeRef = {
  kind: 'creature',
  roomId: 'room-1',
  mapId: 'm',
  tokenId: 'foe-1',
  instanceId: 'i-foe'
};
const foe2Ref = {
  kind: 'creature',
  roomId: 'room-1',
  mapId: 'm',
  tokenId: 'foe-2',
  instanceId: 'i-foe-2'
};

jest.mock('../../../services/actorConsequenceService', () => {
  const actual = jest.requireActual('../../../services/actorConsequenceService');
  return {
    ...actual,
    refreshActorSnapshot: jest.fn(),
    requestActorEvent: jest.fn(),
    roomResourceProjection: jest.fn()
  };
});

jest.mock('../../../store/authStore', () => {
  const state = { user: { uid: 'owner-1' } };
  const useAuthStore = (sel) => (typeof sel === 'function' ? sel(state) : state);
  useAuthStore.getState = () => state;
  return { __esModule: true, default: useAuthStore };
});

jest.mock('../../../services/triggerOfferService', () => {
  const { create } = require('zustand');
  return {
    useTriggerOfferStore: create(() => ({
      projection: { roomId: 'room-1', viewerRole: 'player', revision: 1, obligations: [], listeners: [] },
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
    primaryPcSources: jest.fn(() => []),
    FOLLOWUP_PREDICATE: { occurrence: 'immediate-damage', role: 'source', evidence: 'baseHpLost' },
    HEALING_FOLLOWUP_PREDICATE: { occurrence: 'immediate-healing', role: 'source', evidence: 'hpRestored' }
  };
});

jest.mock('../../../services/passiveActivationService', () => {
  const { create } = require('zustand');
  return {
    usePassiveActivationStore: create(() => ({
      projection: { success: true, roomId: 'room-1', viewerRole: 'player', revision: 1, activations: [] },
      loading: false,
      error: null,
      message: ''
    })),
    refreshPassiveLedger: jest.fn(),
    registerPassiveHandlers: jest.fn(() => () => {}),
    activatePassive: jest.fn(),
    revokePassive: jest.fn(),
    primaryPcTargets: jest.fn(() => [])
  };
});

function makeAdmittedEntry(wizardRecord) {
  const compiled = definitionFromWizard(wizardRecord, { roomId: 'room-1', definitionVersion: 1, classId: 'arcanoneer' });
  expect(compiled.ok).toBe(true);
  const hashHex = spellConsequence.sha256Hex('mythrill:authored-outcome:v1\n' + JSON.stringify(compiled.definition));
  const definitionRef = {
    roomId: 'room-1',
    definitionId: compiled.definition.definitionId,
    definitionVersion: 1,
    definitionHash: hashHex
  };
  return {
    definitionRef,
    canonicalDefinition: compiled.definition,
    compilerVersion: 'p14-random-outcome-1',
    descriptor: {
      schemaVersion: 9,
      capabilityId: 'authored-outcome:v1',
      compilerVersion: 'p14-random-outcome-1',
      definitionRef,
      binding: compiled.definition.binding,
      price: { ap: compiled.definition.resourceCost.actionPoints, mana: compiled.definition.resourceCost.mana },
      targeting: compiled.definition.targeting,
      outcomeTable: compiled.definition.outcomeTable,
      executionEnabled: false
    },
    revoked: false,
    creatureOnly: false
  };
}

function diceRecord() {
  const draft = {
    name: 'Chaos Die Bolt',
    description: 'd6 chooses fire damage or fixed healing',
    level: 1,
    spellType: 'ACTION',
    resolution: 'DICE',
    typeConfig: { school: 'ember', icon: 'x', castTimeType: 'IMMEDIATE', tags: [] },
    effectTypes: [],
    effectsMap: {},
    rollableTable: {
      enabled: true,
      name: 'Chaos Table',
      description: '',
      resolutionType: 'DICE',
      resolutionConfig: { diceType: 'd6' },
      entries: [
        { id: 'd1', name: 'Ember Lash', range: { min: 1, max: 3 }, effectType: 'damage', effectConfig: { damageFormula: '2d6', damageType: 'ember' } },
        { id: 'd2', name: 'Vital Surge', range: { min: 4, max: 6 }, effectType: 'healing', effectConfig: { healingFormula: '10' } }
      ]
    },
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['any'], maxTargets: 1, selectionMethod: 'manual' },
    resourceCost: { actionPoints: 1, mana: 2, components: [] },
    durationConfig: { durationType: 'instant' },
    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
  };
  return {
    ...draft,
    source: 'wizard',
    isCustom: true,
    authoredDefinitionId: '11111111-1111-4111-8111-111111111111',
    authoredDraft: JSON.parse(JSON.stringify(draft)),
    serializedData: JSON.stringify(draft)
  };
}

function coinRecord() {
  const draft = {
    name: 'Twin Coin Gale',
    description: 'Coin chooses rime damage or healing',
    level: 1,
    spellType: 'ACTION',
    resolution: 'COINS',
    typeConfig: { school: 'rime', icon: 'x', castTimeType: 'IMMEDIATE', tags: [] },
    effectTypes: [],
    effectsMap: {},
    rollableTable: {
      enabled: true,
      name: 'Coin Table',
      description: '',
      resolutionType: 'COINS',
      resolutionConfig: { coinCount: 1, coinType: 'standard' },
      entries: [
        { id: 'c1', name: 'Rime Snap', coinPattern: 'Heads', effectType: 'damage', effectConfig: { damageFormula: '8', damageType: 'rime' } },
        { id: 'c2', name: 'Warm Balm', coinPattern: 'Tails', effectType: 'healing', effectConfig: { healingFormula: '6' } }
      ]
    },
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['any'], maxTargets: 1, selectionMethod: 'manual' },
    resourceCost: { actionPoints: 1, mana: 1, components: [] },
    durationConfig: { durationType: 'instant' },
    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
  };
  return {
    ...draft,
    source: 'wizard',
    isCustom: true,
    authoredDefinitionId: '22222222-2222-4222-8222-222222222222',
    authoredDraft: JSON.parse(JSON.stringify(draft)),
    serializedData: JSON.stringify(draft)
  };
}

beforeEach(() => {
  localStorage.clear();
  clearToSignedOut();
  activatePrivateScope(createUserScope('owner-1'));
  jest.restoreAllMocks();
  const acs = jest.requireMock('../../../services/actorConsequenceService');
  acs.refreshActorSnapshot.mockResolvedValue({
    success: true,
    roomId: 'room-1',
    actionEpoch: 'epoch-1',
    commitSequence: 5
  });
  acs.roomResourceProjection.mockImplementation(() => ({
    health: { current: 20, max: 30 },
    mana: { current: 10, max: 10 },
    actionPoints: { current: 4, max: 4 },
    tempHealth: 0,
    tempMana: 0,
    tempActionPoints: 0,
    roomActorProjection: {
      ref: pcRef,
      revision: 1,
      accountGeneration: 0
    }
  }));
  const tos = jest.requireMock('../../../services/triggerOfferService');
  tos.registerTriggerOfferHandlers.mockImplementation(() => () => {});
  tos.primaryPcSources.mockImplementation(() => []);
  const pas = jest.requireMock('../../../services/passiveActivationService');
  pas.registerPassiveHandlers.mockImplementation(() => () => {});
  pas.primaryPcTargets.mockImplementation(() => []);
  registerStore('gameStore', useGameStore);
  registerStore('characterStore', useCharacterStore);
  registerStore('characterTokenStore', useCharacterTokenStore);
  registerStore('creatureStore', useCreatureStore);
  registerStore('authStore', useAuthStore);
  registerStore('chatStore', useChatStore);
  registerStore('conditionStore', useConditionStore);
  useDiceStore.setState({ coinFlip: null, lastCoinFlip: null, cardDraw: null, lastCardDraw: null });
  useGameStore.setState({
    isInMultiplayer: true,
    isGMMode: false,
    multiplayerRoom: { id: 'room-1' },
    multiplayerSocket: { connected: true, emit: jest.fn(), on: jest.fn(), off: jest.fn() },
    gridSize: 50,
    feetPerTile: 5
  });
  useCharacterStore.setState({ currentCharacterId: 'pc-1', class: 'Arcanoneer' });
  useCharacterTokenStore.setState({
    characterTokens: [{
      id: 'pc-1',
      mapId: 'm',
      name: 'Ilse',
      ownerUserId: 'owner-1',
      character: {
        id: 'pc-1',
        name: 'Ilse',
        class: 'Arcanoneer',
        health: { current: 20, max: 30 },
        mana: { current: 10, max: 10 },
        actionPoints: { current: 4, max: 4 },
        tempHealth: 0,
        tempMana: 0,
        tempActionPoints: 0
      },
      state: { conditions: [], actorContract: { version: 1, ...pcRef, revision: 1, primary: true } }
    }]
  });
  useCreatureStore.setState({
    creatureTokens: [{
      id: 'foe-1',
      mapId: 'm',
      name: 'Goblin Scout',
      state: { currentHp: 20, maxHp: 20, tempHealth: 0, conditions: [], actorContract: { version: 1, ...foeRef, revision: 1 } }
    }, {
      id: 'foe-2',
      mapId: 'm',
      name: 'Orc Brute',
      state: { currentHp: 30, maxHp: 30, tempHealth: 0, conditions: [], actorContract: { version: 1, ...foe2Ref, revision: 1 } }
    }]
  });
  useSpellConsequenceStore.setState({
    owner: null,
    ownerStatus: null,
    gmPending: {},
    gmStatus: {},
    targetProposals: [],
    authoredEntries: [],
    authoredRoomId: 'room-1',
    draftVersion: 0,
    registryRevision: 1
  });
  useTriggerOfferStore.setState({
    projection: { roomId: 'room-1', viewerRole: 'player', revision: 1, obligations: [], listeners: [] },
    declined: [],
    setupRequest: null
  });
  usePassiveActivationStore.setState({
    projection: { success: true, roomId: 'room-1', viewerRole: 'player', revision: 1, activations: [] },
    error: null,
    message: ''
  });
});

afterEach(() => {
  try {
    if (loadLatestSpell()) retainLatestSpell(spellContext(), { phase: 'reconciled', draft: null, supersedes: true });
  } catch (_) { /* noop if test tore down context */ }
  cleanup();
});

describe('HUD random-outcome spells: existing source reuse, two outcomes -> two effects, single pay, reload/retry safety', () => {
  test('DICE spell: reuses spellConsequence.digitalRoll once, selects different branches for 2 vs 5, and never rerolls on reload or after resolution', async () => {
    const entry = makeAdmittedEntry(diceRecord());
    replaceAuthoredRegistry('room-1', [entry]);
    useSpellConsequenceStore.setState({ authoredEntries: [entry], authoredRoomId: 'room-1' });
    const defId = `authored:${entry.definitionRef.definitionId}:1:${entry.definitionRef.definitionHash}`;

    const digitalSpy = jest.spyOn(spellConsequence, 'digitalRoll');
    const cardSpy = jest.spyOn(useDiceStore.getState(), 'startCardDraw');
    const acs = jest.requireMock('../../../services/actorConsequenceService');
    const sentApprovals = [];
    const seenApprovalIds = new Set();
    let gmAccepted = false;
    let approveEmitCount = 0;
    const makeDiceReceipt = (last) => ({
      success: true,
      status: 'checkpoint-confirmed',
      receipt: {
        version: 1,
        roomId: 'room-1',
        submitterUid: 'gm-1',
        commandId: 'cmd-dice-1',
        commitSequence: 6,
        acceptedAt: Date.now(),
        checkpointRevision: 1,
        source: pcRef,
        target: last.target,
        authorization: { kind: 'owner-approval-gm', proposalId: last.approvalId },
        actors: [
          { ref: pcRef, finalResources: { ap: { current: 3, temp: 0 }, mana: { current: 8, temp: 0 } } },
          { ref: last.target, finalResources: { hp: { current: 23, temp: 0 } } }
        ],
        adjudication: {
          definitionId: last.spell.definitionId,
          definitionVersionOrHash: last.spell.definitionHash,
          finalAmount: 7,
          adjustmentReason: '',
          chosenResult: JSON.stringify({
            capability: 'authored-outcome:v1',
            approvalId: last.approvalId,
            roll: last.roll,
            kind: 'damage',
            outcome: last.outcome,
            chosenBranch: last.chosenBranch,
            damageTypes: ['ember'],
            spellName: last.spell.name,
            sourceName: 'Ilse',
            targetName: last.target.tokenId === 'foe-2' ? 'Orc Brute' : 'Goblin Scout',
            gmConfirmed: true
          })
        }
      }
    });
    acs.requestActorEvent.mockImplementation(async (event, payload) => {
      if (event === 'actor_spell_approve') {
        approveEmitCount += 1;
        if (!seenApprovalIds.has(payload.approvalId)) {
          seenApprovalIds.add(payload.approvalId);
          sentApprovals.push(payload);
        }
        if (gmAccepted && payload.approvalId === sentApprovals[0]?.approvalId) {
          return makeDiceReceipt(sentApprovals[0]);
        }
        return { success: false, code: 'awaiting_gm', contentHash: 'h-ap' };
      }
      if (event === 'actor_spell_list') {
        const last = sentApprovals[0];
        if (!last || !gmAccepted) return { success: true, pending: [] };
        return {
          success: true,
          consumedReceipt: makeDiceReceipt(last)
        };
      }
      return { success: true };
    });

    // Outcome 1: force outcome d6 = 2 (Damage branch 2d6)
    const mathSpy = jest.spyOn(Math, 'random');

    expect(spellSupport({ id: defId })).toMatchObject({ supported: true, isOutcome: true });
    expect(routeSpellCast({ id: defId }, { producer: 'actionBar' })).toBe(true);
    const firstRender = render(<SpellConsequenceHost />);

    fireEvent.change(screen.getByLabelText(/^Target/), { target: { value: JSON.stringify(foeRef) } });
    mathSpy.mockReturnValue(0.2); // outcome d6 -> Math.floor(0.2 * 6) + 1 = 2 (1-3: Ember Lash)
    fireEvent.click(screen.getByRole('button', { name: /Roll 1d6 outcome/i }));
    expect(digitalSpy).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.p9-roll-result[role="status"]')?.textContent).toMatch(/d6 = 2 → Branch: Ember Lash \(2d6 ember damage\)/);

    // Unmount & remount (reload before branch dice roll): outcome stays locked, button gone, digitalRoll NOT called again
    firstRender.unmount();
    useSpellConsequenceStore.setState({ ownerStatus: null });
    render(<SpellConsequenceHost />);
    expect(screen.queryByRole('button', { name: /Roll 1d6 outcome/i })).toBeNull();
    expect(digitalSpy).toHaveBeenCalledTimes(1);

    // Roll branch 2d6 damage once, then change target from foe-1 to foe-2 -> outcome & branch roll stay intact without reroll
    mathSpy.mockReturnValue(0.5); // 2d6 -> [4, 4] = 8
    fireEvent.click(screen.getByRole('button', { name: /Roll 2d6 once/i }));
    expect(digitalSpy).toHaveBeenCalledTimes(2);
    fireEvent.change(screen.getByLabelText(/^Target/), { target: { value: JSON.stringify(foe2Ref) } });
    expect(digitalSpy).toHaveBeenCalledTimes(2);
    expect(document.querySelector('.p9-roll-result[role="status"]')?.textContent).toMatch(/d6 = 2 → Branch: Ember Lash \(2d6 ember damage\)/);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Approve price, target and resolved outcome/i }));
    });
    expect(sentApprovals).toHaveLength(1);
    expect(approveEmitCount).toBe(1);
    expect(sentApprovals[0].target).toEqual(foe2Ref);
    expect(sentApprovals[0].outcome.dice.total).toBe(2);
    expect(sentApprovals[0].chosenBranch.label).toBe('Ember Lash');
    expect(sentApprovals[0].price).toEqual({ ap: 1, mana: 2 });

    // GM accepts, then click "Check this same approval" -> re-sends exact same approvalId, transitions to accepted, zero new approvalIds/rolls/cards
    gmAccepted = true;
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Check this same approval/i }));
    });
    expect(sentApprovals).toHaveLength(1);
    expect(approveEmitCount).toBe(2);
    expect(screen.queryByRole('button', { name: /Approve price, target and resolved outcome/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Roll 1d6 outcome/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Check this same approval/i })).toBeNull();

    // Simulate full page reload after resolution (reset in-memory ownerStatus while keeping localStorage):
    // zero rerolls, zero card draws, zero duplicate approvals even on first frame & after mount effect
    cleanup();
    useSpellConsequenceStore.setState({ ownerStatus: null });
    render(<SpellConsequenceHost />);
    expect(digitalSpy).toHaveBeenCalledTimes(2);
    expect(cardSpy).toHaveBeenCalledTimes(0);
    expect(sentApprovals).toHaveLength(1);
    expect(approveEmitCount).toBe(2);
    expect(screen.queryByRole('button', { name: /Approve price, target and resolved outcome/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Roll 1d6 outcome/i })).toBeNull();

    // Clear custody & cast a second time with outcome d6 = 5 -> Healing branch (fixed 10)
    cleanup();
    localStorage.clear();
    if (loadLatestSpell()) retainLatestSpell(spellContext(), { phase: 'reconciled', draft: null, supersedes: true });
    useSpellConsequenceStore.setState({ owner: null, ownerStatus: null });
    routeSpellCast({ id: defId }, { producer: 'actionBar' });
    render(<SpellConsequenceHost />);
    fireEvent.change(screen.getByLabelText(/^Target/), { target: { value: JSON.stringify(foeRef) } });
    mathSpy.mockReturnValue(0.75); // face 5 (4-6: Vital Surge)
    fireEvent.click(screen.getByRole('button', { name: /Roll 1d6 outcome/i }));
    expect(document.querySelector('.p9-roll-result[role="status"]')?.textContent).toMatch(/d6 = 5 → Branch: Vital Surge \(10 healing\)/);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Approve price, target and resolved outcome/i }));
    });
    expect(sentApprovals).toHaveLength(2);
    expect(sentApprovals[1].chosenBranch.effect).toEqual({ kind: 'healing', formula: '10' });
    expect(sentApprovals[1].roll).toEqual({ mode: 'deterministic', dice: [], constant: 10, total: 10, reading: '10' });
    expect(cardSpy).toHaveBeenCalledTimes(0);
  });

  test('COINS spell: reuses useDiceStore.startCoinFlip once per cast, resolves Heads vs Tails effects, and prevents reflip after resolution', async () => {
    const entry = makeAdmittedEntry(coinRecord());
    replaceAuthoredRegistry('room-1', [entry]);
    useSpellConsequenceStore.setState({ authoredEntries: [entry], authoredRoomId: 'room-1' });
    const defId = `authored:${entry.definitionRef.definitionId}:1:${entry.definitionRef.definitionHash}`;

    const coinSpy = jest.spyOn(useDiceStore.getState(), 'startCoinFlip');
    const cardSpy = jest.spyOn(useDiceStore.getState(), 'startCardDraw');
    const acs = jest.requireMock('../../../services/actorConsequenceService');
    const sentApprovals = [];
    acs.requestActorEvent.mockImplementation(async (event, payload) => {
      if (event === 'actor_spell_approve') {
        sentApprovals.push(payload);
        return { success: false, code: 'awaiting_gm', contentHash: 'h-coin' };
      }
      return { success: true };
    });

    // Flip 1: Math.random() < 0.5 -> 'heads' -> Rime Snap (8 rime damage)
    const mathSpy = jest.spyOn(Math, 'random');
    expect(spellSupport({ id: defId })).toMatchObject({ supported: true, isOutcome: true });
    expect(routeSpellCast({ id: defId }, { producer: 'actionBar' })).toBe(true);
    const first = render(<SpellConsequenceHost />);
    fireEvent.change(screen.getByLabelText(/^Target/), { target: { value: JSON.stringify(foeRef) } });
    mathSpy.mockReturnValue(0.1);
    fireEvent.click(screen.getByRole('button', { name: /Flip 1 fair coin/i }));

    expect(coinSpy).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.p9-roll-result[role="status"]')?.textContent).toMatch(/1 coin: Heads → Branch: Rime Snap \(8 rime damage\)/);

    // Changing target keeps Heads outcome without reflipping
    fireEvent.change(screen.getByLabelText(/^Target/), { target: { value: JSON.stringify(foe2Ref) } });
    expect(coinSpy).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.p9-roll-result[role="status"]')?.textContent).toMatch(/1 coin: Heads → Branch: Rime Snap \(8 rime damage\)/);

    // Reload while draft retained -> startCoinFlip is NOT called again and button is gone
    first.unmount();
    useSpellConsequenceStore.setState({ ownerStatus: null });
    render(<SpellConsequenceHost />);
    expect(coinSpy).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: /Flip 1 fair coin/i })).toBeNull();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Approve price, target and resolved outcome/i }));
    });
    expect(sentApprovals).toHaveLength(1);
    expect(sentApprovals[0].target).toEqual(foe2Ref);
    expect(sentApprovals[0].outcome.coin).toEqual({ count: 1, coinType: 'standard', flips: ['heads'], heads: 1, tails: 0 });
    expect(sentApprovals[0].chosenBranch.effect).toEqual({ kind: 'damage', formula: '8', damageTypes: ['rime'] });

    // Simulate GM acceptance receipt landing directly via consumeSpellReceipt
    await act(async () => {
      consumeSpellReceipt({
        success: true,
        status: 'checkpoint-confirmed',
        receipt: {
          version: 1,
          roomId: 'room-1',
          submitterUid: 'gm-1',
          commandId: 'cmd-coin-1',
          commitSequence: 7,
          acceptedAt: Date.now(),
          checkpointRevision: 2,
          source: pcRef,
          target: foe2Ref,
          authorization: { kind: 'owner-approval-gm', proposalId: sentApprovals[0].approvalId },
          actors: [
            { ref: pcRef, finalResources: { ap: { current: 3, temp: 0 }, mana: { current: 9, temp: 0 } } },
            { ref: foe2Ref, finalResources: { hp: { current: 22, temp: 0 } } }
          ],
          adjudication: {
            definitionId: sentApprovals[0].spell.definitionId,
            definitionVersionOrHash: sentApprovals[0].spell.definitionHash,
            finalAmount: 8,
            adjustmentReason: '',
            chosenResult: JSON.stringify({
              capability: 'authored-outcome:v1',
              approvalId: sentApprovals[0].approvalId,
              roll: sentApprovals[0].roll,
              kind: 'damage',
              outcome: sentApprovals[0].outcome,
              chosenBranch: sentApprovals[0].chosenBranch,
              damageTypes: ['rime'],
              spellName: 'Twin Coin Gale',
              sourceName: 'Ilse',
              targetName: 'Orc Brute',
              gmConfirmed: true
            })
          }
        }
      });
    });

    // Reload after resolution: reset in-memory ownerStatus while keeping localStorage; no flip button, no approve button, zero extra flips or draws
    cleanup();
    useSpellConsequenceStore.setState({ ownerStatus: null });
    render(<SpellConsequenceHost />);
    expect(coinSpy).toHaveBeenCalledTimes(1);
    expect(cardSpy).toHaveBeenCalledTimes(0);
    expect(sentApprovals).toHaveLength(1);
    expect(screen.queryByRole('button', { name: /Flip 1 fair coin/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Approve price, target and resolved outcome/i })).toBeNull();

    // Flip 2 on fresh cast: Math.random() >= 0.5 -> 'tails' -> Warm Balm (6 healing)
    cleanup();
    localStorage.clear();
    if (loadLatestSpell()) retainLatestSpell(spellContext(), { phase: 'reconciled', draft: null, supersedes: true });
    useSpellConsequenceStore.setState({ owner: null, ownerStatus: null });
    routeSpellCast({ id: defId }, { producer: 'actionBar' });
    render(<SpellConsequenceHost />);
    fireEvent.change(screen.getByLabelText(/^Target/), { target: { value: JSON.stringify(foeRef) } });
    mathSpy.mockReturnValue(0.8);
    fireEvent.click(screen.getByRole('button', { name: /Flip 1 fair coin/i }));
    expect(coinSpy).toHaveBeenCalledTimes(2);
    expect(document.querySelector('.p9-roll-result[role="status"]')?.textContent).toMatch(/1 coin: Tails → Branch: Warm Balm \(6 healing\)/);
    expect(cardSpy).toHaveBeenCalledTimes(0);
  });
});
