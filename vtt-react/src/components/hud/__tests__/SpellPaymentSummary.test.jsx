import React from 'react';
import { render, screen, act } from '@testing-library/react';
import SpellConsequencePanel, { GmPanel } from '../SpellConsequencePanel';
import { refOf } from '../../../services/actorConsequenceService';
import useGameStore from '../../../store/gameStore';
import useCharacterStore from '../../../store/characterStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCreatureStore from '../../../store/creatureStore';
import { useSharedConditionStore } from '../../../services/sharedConditionService';
import { useSpellConsequenceStore } from '../../../services/spellConsequenceService';
import { TYPE as COOLDOWN_TYPE, key as cooldownKey } from '../../../services/authoredCooldown';

let mockSupport;

jest.mock('../../../store/gameStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({ isInMultiplayer: true, isGMMode: false, multiplayerRoom: { id: 'room-1' }, gridSize: 50, feetPerTile: 5 }))
}));
jest.mock('../../../store/characterStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({ currentCharacterId: 'caster' }))
}));
jest.mock('../../../store/characterTokenStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({ characterTokens: [] }))
}));
jest.mock('../../../store/creatureStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({ creatureTokens: [], creatures: [] }))
}));
jest.mock('../../../services/sharedConditionService', () => ({
  useSharedConditionStore: require('zustand').create(() => ({ combat: null }))
}));
jest.mock('../../../services/spellConsequence', () => ({
  ...jest.requireActual('../../../services/spellConsequence'),
  supportSpell: () => mockSupport
}));
jest.mock('../../../services/spellConsequenceService', () => ({
  useSpellConsequenceStore: require('zustand').create(() => ({
    owner: null, ownerStatus: null, gmPending: {}, gmStatus: {}, targetProposals: [], authoredEntries: []
  })),
  ownerSource: () => {
    const token = require('../../../store/characterTokenStore').default.getState().characterTokens[0];
    return token
      ? { token, ref: require('../../../services/actorConsequenceService').refOf(token), mapId: 'm' }
      : { error: 'Select your owner attachment in the Party HUD first.' };
  },
  restoreOwnerStatus: jest.fn(),
  spellDraftContext: () => ({ characterId: 'caster', spellId: 'spell-1' }),
  loadSpellDraft: () => null,
  loadDiscardedSpellDrafts: () => [],
  saveSpellDraft: jest.fn(),
  discardSpellDraft: jest.fn(),
  closeOwnerPanel: jest.fn(),
  sendSpellApproval: jest.fn(),
  checkSpellApproval: jest.fn(),
  withdrawSpellApproval: jest.fn(),
  reapproveSpell: jest.fn(),
  refreshSpellApprovals: jest.fn(),
  gmAcceptSpell: jest.fn(),
  gmDeclineSpell: jest.fn(),
  gmCheckSpellCommand: jest.fn(),
  markSpellReconciled: jest.fn(),
  gmConditionResolution: () => null,
  saveGmConditionResolution: jest.fn(),
  refreshAuthoredAbilities: jest.fn(),
  changeAuthoredAdmission: jest.fn(),
  routeSpellCast: jest.fn(),
  creatureAttempt: () => null,
  saveCreatureRoll: jest.fn(),
  prepareCreatureAbility: jest.fn(),
  cancelCreatureAbility: jest.fn(),
  revalidateCreatureContext: jest.fn(),
  saveCreatureResolution: jest.fn(),
  designateVoluntaryCondition: jest.fn(),
  respondToVoluntaryCondition: jest.fn(),
  retainedTargetResponses: () => []
}));

const makePc = (overrides = {}) => ({
  id: 'caster',
  mapId: 'm',
  ownerUserId: 'owner-1',
  character: {
    id: 'caster',
    name: 'Caster',
    stats: { intelligence: 14 },
    actionPoints: { current: 2 },
    tempActionPoints: 1,
    mana: { current: 5 },
    tempMana: 0,
    health: { current: 30, max: 40 },
    ...(overrides.character || {})
  },
  state: {
    conditions: [],
    authoredCooldowns: {},
    actorContract: { version: 1, kind: 'character', roomId: 'room-1', mapId: 'm', tokenId: 'caster', instanceId: 'i-caster', ownerUid: 'owner-1', characterId: 'caster', primary: true, revision: 0 },
    ...(overrides.state || {})
  }
});

const foe = {
  id: 'B',
  mapId: 'm',
  name: 'Goblin',
  state: {
    currentHp: 20,
    maxHp: 20,
    tempHealth: 0,
    conditions: [],
    actorContract: { version: 1, kind: 'creature', roomId: 'room-1', mapId: 'm', tokenId: 'B', instanceId: 'i-b', revision: 0 }
  }
};

const baseSupport = {
  supported: true,
  kind: 'damage',
  name: 'Arcane Bolt',
  definitionId: 'spell-1',
  definitionHash: 'p9-spell:v1/abc',
  price: { ap: 1, mana: 2 },
  payment: { affordable: true, domain: 'none', classPayment: null },
  cooldown: { type: 'none', value: 0 },
  reading: { dice: [{ count: 1, sides: 8 }], constant: 2, reading: '1d8 + 2' },
  damageTypes: ['arcane'],
  raw: { targetingConfig: { rangeDistance: 30, rangeType: 'ranged' } }
};

function setupOwner({ pc = makePc(), support = baseSupport, owner = { spellId: 'spell-1', origin: {} }, ownerStatus = null, combat = null } = {}) {
  mockSupport = support;
  useCharacterTokenStore.setState({ characterTokens: pc ? [pc] : [] });
  useCreatureStore.setState({ creatureTokens: [foe], creatures: [] });
  useSharedConditionStore.setState({ combat });
  useGameStore.setState({ isInMultiplayer: true, isGMMode: false, multiplayerRoom: { id: 'room-1' }, gridSize: 50, feetPerTile: 5 });
  useSpellConsequenceStore.setState({ owner, ownerStatus, gmPending: {}, gmStatus: {}, targetProposals: [] });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockSupport = baseSupport;
});

test('owner proposed state shows AP/mana cost, not-yet-paid status, and targeting/roll blockers', () => {
  setupOwner();
  render(<SpellConsequencePanel />);
  expect(screen.getByText(/Proposed cost — not yet paid/i)).toBeTruthy();
  expect(screen.getByText(/1 AP · 2 mana/)).toBeTruthy();
  expect(screen.getByText(/Why this cast cannot proceed/i)).toBeTruthy();
  expect(screen.getByText(/^Select an exact bound target\.$/)).toBeTruthy();
  expect(screen.getByText(/Record a digital or physical roll before approving/i)).toBeTruthy();
});

test('triggered follow-up states that normal cost still applies in proposed and pending views', () => {
  const offerId = 'a'.repeat(64);
  setupOwner({ owner: { spellId: 'spell-1', triggerOfferId: offerId, origin: {} } });
  const { rerender } = render(<SpellConsequencePanel />);
  expect(screen.getByText(/Triggered follow-up: normal cost still applies/i)).toBeTruthy();

  act(() => {
    useSpellConsequenceStore.setState({
      ownerStatus: {
        phase: 'awaiting',
        message: 'Awaiting GM adjudication. Nothing is spent until the GM accepts.',
        latest: {
          phase: 'awaiting',
          approval: { approvalId: 'app-1', price: { ap: 1, mana: 2 }, classPayment: null, triggerOfferId: offerId }
        }
      }
    });
  });
  rerender(<SpellConsequencePanel />);
  expect(screen.getAllByText(/Triggered follow-up: normal cost still applies/i).length).toBeGreaterThanOrEqual(1);
  expect(screen.getByText(/Awaiting consent \/ adjudication — not yet paid/i)).toBeTruthy();
});

test('shows supported class resource payment terms for elementalSpheres and devotionGauge', () => {
  setupOwner({
    support: {
      ...baseSupport,
      payment: {
        affordable: true,
        domain: 'elementalSpheres',
        classPayment: {
          domain: 'elementalSpheres',
          price: { costs: ['ember', 'arcane'], gains: ['rime'] },
          before: { type: 'elementalSpheres', spheres: ['ember', 'arcane'] },
          after: { type: 'elementalSpheres', spheres: ['rime'] }
        }
      }
    }
  });
  const { rerender } = render(<SpellConsequencePanel />);
  expect(screen.getByText(/2 Elemental Spheres spent \(ember, arcane\); 1 gained \(rime\)/)).toBeTruthy();

  act(() => {
    mockSupport = {
      ...baseSupport,
      payment: {
        affordable: true,
        domain: 'devotionGauge',
        classPayment: {
          domain: 'devotionGauge',
          price: { cost: 2, gain: 1, required: 2 },
          before: { type: 'devotionGauge', current: 3, max: 6, damage: 40, earnedLevels: 3, spentLevels: 0, bonusLevels: 0 },
          after: { type: 'devotionGauge', current: 2, max: 6, damage: 40, earnedLevels: 3, spentLevels: 1, bonusLevels: 0 }
        }
      }
    };
    useSpellConsequenceStore.setState({ owner: { spellId: 'spell-2', origin: {} } });
  });
  rerender(<SpellConsequencePanel />);
  expect(screen.getByText(/Devotion cost 2 \(requires 2\), gain 1/)).toBeTruthy();
});

test('shows insufficient AP, mana, class resource, and active cooldown explanations', () => {
  const pc = makePc({
    character: { actionPoints: { current: 0 }, tempActionPoints: 0, mana: { current: 1 }, tempMana: 0 },
    state: {
      conditions: [],
      authoredCooldowns: {
        [cooldownKey(refOf(makePc()), 'spell-1')]: { combatId: 'c-1', dueSequence: 5, occurrences: 2 }
      },
      actorContract: { version: 1, kind: 'character', roomId: 'room-1', mapId: 'm', tokenId: 'caster', instanceId: 'i-caster', ownerUid: 'owner-1', characterId: 'caster', primary: true, revision: 0 }
    }
  });
  setupOwner({
    pc,
    combat: { active: true, id: 'c-1', turnOrder: ['caster', 'B'], round: 1, turnIndex: 1, sequence: 3 },
    support: {
      ...baseSupport,
      cooldown: { type: COOLDOWN_TYPE, value: 2, definitionId: 'spell-1' },
      payment: { affordable: false, domain: 'elementalSpheres', reason: 'Requires Elemental Spheres (ember); current class state cannot pay.' }
    }
  });
  render(<SpellConsequencePanel />);
  expect(screen.getByText(/Insufficient AP: requires 1 AP \(you have 0\+0 temp\)/)).toBeTruthy();
  expect(screen.getByText(/Insufficient mana: requires 2 mana \(you have 1\+0 temp\)/)).toBeTruthy();
  expect(screen.getAllByText(/Requires Elemental Spheres \(ember\)/).length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText(/Cooldown blocked: its authenticated clock is retired or unavailable/).length).toBeGreaterThanOrEqual(1);
});

test('distinguishes accepted receipt, closure, genuine outcome_unknown, and delayed response transitions', () => {
  const pc = makePc();
  const approval = {
    version: 1,
    roomId: 'room-1',
    approvalId: 'app-1',
    source: refOf(pc),
    target: refOf(foe),
    spell: { definitionId: 'spell-1', definitionHash: 'p9-spell:v1/abc', name: 'Arcane Bolt', kind: 'damage', damageTypes: ['arcane'] },
    roll: { mode: 'digital', dice: [{ sides: 8, faces: [4] }], constant: 2, total: 6, reading: '1d8 + 2' },
    price: { ap: 1, mana: 2 },
    classPayment: null
  };
  setupOwner({
    pc,
    ownerStatus: { phase: 'unknown', message: 'Outcome unknown. Check this same approval; it will not reroll or pay twice.', latest: { phase: 'unknown', approval } }
  });
  const { rerender } = render(<SpellConsequencePanel />);
  expect(screen.getByText(/Outcome unknown — payment not yet established/i)).toBeTruthy();

  act(() => {
    useSpellConsequenceStore.setState({
      ownerStatus: { phase: 'closed', message: 'Closed before acceptance (actor removed) — no payment was recorded.', latest: { phase: 'closed', closedCode: 'actor_removed', approval } }
    });
  });
  rerender(<SpellConsequencePanel />);
  expect(screen.getByText(/Refused \/ closed — no payment was recorded/i)).toBeTruthy();
  expect(screen.getByText(/Closed before acceptance \(actor removed\)/)).toBeTruthy();

  act(() => {
    useSpellConsequenceStore.setState({
      ownerStatus: {
        phase: 'accepted',
        message: 'Accepted.',
        latest: {
          phase: 'accepted',
          approval,
          result: {
            success: true,
            status: 'accepted-live / checkpoint pending',
            receipt: {
              version: 1,
              roomId: 'room-1',
              commandId: 'cmd-receipt-1',
              checkpointRevision: 12,
              authorization: { kind: 'owner-approval-gm', proposalId: 'app-1' },
              source: refOf(pc),
              target: refOf(foe),
              adjudication: {
                definitionId: 'spell-1',
                definitionVersionOrHash: 'p9-spell:v1/abc',
                finalAmount: 6,
                chosenResult: JSON.stringify({ capability: 'p9-spell:v1', approvalId: 'app-1' })
              },
              actors: [{ ref: refOf(pc) }, { ref: refOf(foe) }]
            }
          }
        }
      }
    });
  });
  rerender(<SpellConsequencePanel />);
  expect(screen.getByText(/Accepted and paid/i)).toBeTruthy();
  expect(screen.getByText(/cmd-receipt-1/)).toBeTruthy();
});

test('missing or unsafe authoritative payment terms say so rather than inventing a total', () => {
  setupOwner({
    support: { ...baseSupport, price: null }
  });
  render(<SpellConsequencePanel />);
  expect(screen.getAllByText(/Authoritative payment terms unavailable; no total is invented/i).length).toBeGreaterThanOrEqual(1);
  expect(screen.getByRole('button', { name: /Approve price and send to GM/i }).disabled).toBe(true);
});

test('GM and observer views never expose private snapshots and observer sees no approval UI', () => {
  const pc = makePc();
  const approval = {
    roomId: 'room-1',
    approvalId: 'app-gm-1',
    source: refOf(pc),
    target: refOf(foe),
    spell: { definitionId: 'spell-1', definitionHash: 'p9-spell:v1/abc', name: 'Holy Strike', kind: 'damage', damageTypes: ['sacred'] },
    roll: { mode: 'digital', dice: [{ sides: 8, faces: [5] }], constant: 0, total: 5, reading: '1d8' },
    price: { ap: 1, mana: 0 },
    classPayment: {
      domain: 'devotionGauge',
      price: { cost: 2, gain: 0, required: 2 },
      beforePublic: { type: 'devotionGauge', current: 4, max: 6 },
      afterPublic: { type: 'devotionGauge', current: 2, max: 6 }
    }
  };
  useCharacterTokenStore.setState({ characterTokens: [pc] });
  useCreatureStore.setState({ creatureTokens: [foe], creatures: [] });

  // Observer view: not GM, no owner panel open
  useGameStore.setState({ isInMultiplayer: true, isGMMode: false, multiplayerRoom: { id: 'room-1' } });
  useSpellConsequenceStore.setState({ owner: null, ownerStatus: null, gmPending: { 'app-gm-1': { approval, contentHash: 'h' } }, gmStatus: {}, targetProposals: [] });
  const { rerender } = render(<GmPanel />);
  expect(screen.queryByRole('region', { name: 'Spell adjudication' })).toBeNull();

  // GM view: shows public class projection + payment status, never private spentLevels/damage bank
  act(() => {
    useGameStore.setState({ isInMultiplayer: true, isGMMode: true, multiplayerRoom: { id: 'room-1' } });
  });
  rerender(<GmPanel />);
  expect(screen.getByText(/Awaiting GM consent — not yet paid/i)).toBeTruthy();
  expect(screen.getByText(/Devotion cost 2 \(requires 2\), gain 0/)).toBeTruthy();
  expect(screen.getByText(/class Devotion 4\/6 → Devotion 2\/6/)).toBeTruthy();
  expect(screen.queryByText(/damage bank/i)).toBeNull();
});
