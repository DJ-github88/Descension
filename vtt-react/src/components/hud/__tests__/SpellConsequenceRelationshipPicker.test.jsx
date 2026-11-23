import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import SpellConsequencePanel from '../SpellConsequencePanel';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCreatureStore from '../../../store/creatureStore';
import { refOf } from '../../../services/actorConsequenceService';
import { pickKey } from '../../../services/targetPick';
import { FORMULA_CAPABILITY } from '../../../services/authoredAbility';
import { useCombatFeedStore, actorKey } from '../../../services/acceptedResultFeed';
import {
  useSpellConsequenceStore,
  readTargetRelationship,
  sendSpellApproval,
  saveSpellDraft
} from '../../../services/spellConsequenceService';

let mockSupport;
let mockDraft;
const mockRoll = { mode: 'physical', dice: [{ count: 1, sides: 8, faces: [5] }], constant: 2, total: 7, reading: '1d8 + 2' };

jest.mock('../../../store/gameStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({
    isInMultiplayer: true,
    isGMMode: false,
    multiplayerRoom: { id: 'room-1' },
    gridSize: 50,
    feetPerTile: 5
  }))
}));
jest.mock('../../../store/characterStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({ currentCharacterId: 'caster-1' }))
}));
jest.mock('../../../store/characterTokenStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({ characterTokens: [] }))
}));
jest.mock('../../../store/creatureStore', () => ({
  __esModule: true,
  getCreatureSizeMapping: () => ({ width: 1, height: 1 }),
  default: require('zustand').create(() => ({ creatureTokens: [], creatures: [] }))
}));
jest.mock('../../../services/spellConsequence', () => ({
  ...jest.requireActual('../../../services/spellConsequence'),
  supportSpell: () => mockSupport
}));
jest.mock('../../../services/spellConsequenceCustody', () => ({
  loadLatestSpell: () => ({ draft: mockDraft }),
  unresolvedSpell: () => false
}));
jest.mock('../../../services/spellConsequenceService', () => ({
  useSpellConsequenceStore: require('zustand').create(() => ({
    owner: { spellId: 'authored:spell-1/1', origin: {} },
    ownerStatus: null,
    gmPending: {},
    gmStatus: {},
    relationshipRevision: 0
  })),
  ownerSource: () => {
    const tokens = require('../../../store/characterTokenStore').default.getState().characterTokens;
    const charId = require('../../../store/characterStore').default.getState().currentCharacterId;
    const token = tokens.find(t => t.character?.id === charId) || tokens[0];
    return { token, ref: require('../../../services/actorConsequenceService').refOf(token), mapId: 'map-1' };
  },
  restoreOwnerStatus: jest.fn(),
  spellDraftContext: () => ({ spellId: 'authored:spell-1/1' }),
  loadSpellDraft: () => mockDraft,
  loadDiscardedSpellDrafts: () => [],
  saveSpellDraft: jest.fn(value => { mockDraft = value; }),
  discardSpellDraft: jest.fn(),
  retainedTargetResponses: () => [],
  creatureAttempt: () => null,
  sendSpellApproval: jest.fn(),
  refreshSpellApprovals: jest.fn(),
  readTargetRelationship: jest.fn()
}));

const pcToken = (id, charId = 'caster-1', name = 'Caster', ownerUid = 'owner-1') => ({
  id,
  mapId: 'map-1',
  name,
  ownerUserId: ownerUid,
  position: { x: 100, y: 100 },
  character: { id: charId, name, actionPoints: { current: 4 }, mana: { current: 10 } },
  state: {
    conditions: [],
    actorContract: {
      version: 1,
      kind: 'character',
      roomId: 'room-1',
      mapId: 'map-1',
      tokenId: id,
      instanceId: `${id}-inst`,
      ownerUid,
      characterId: charId,
      primary: true,
      revision: 0
    }
  }
});

const creatureToken = (id, name, instanceId = `${id}-inst`, extra = {}) => ({
  id,
  mapId: 'map-1',
  name,
  position: { x: 150, y: 100 },
  state: {
    conditions: [],
    ...(extra.state || {}),
    actorContract: {
      version: 1,
      kind: 'creature',
      roomId: 'room-1',
      mapId: 'map-1',
      tokenId: id,
      instanceId,
      revision: 0
    }
  },
  ...extra
});

const singleSupport = (restriction, extra = {}) => ({
  supported: true,
  targetingRestriction: restriction,
  kind: extra.kind || (restriction === 'ally' || restriction === 'self' ? 'healing' : 'damage'),
  name: extra.name || `Spell (${restriction})`,
  definitionId: 'authored:spell-1/1',
  definitionHash: 'authored:v1/hash',
  damageTypes: ['arcane'],
  raw: { targetingConfig: { rangeDistance: extra.selfHealing ? 0 : 30, rangeType: restriction } },
  price: { ap: 1, mana: 2 },
  payment: { affordable: true },
  reading: { dice: [{ count: 1, sides: 8 }], reading: '1d8 + 2' },
  cooldown: { value: 0 },
  ...extra
});

const areaSupport = (restriction = 'enemy') => ({
  supported: true,
  isArea: true,
  targetingRestriction: restriction,
  kind: 'damage',
  name: 'Pulse',
  definitionId: 'authored:area-1/1',
  definitionHash: 'authored-area:v1/hash',
  damageTypes: ['arcane'],
  areaTerms: { radiusFeet: 20, rangeFeet: 30, maxTargets: 8, restriction },
  price: { ap: 1, mana: 2 },
  payment: { affordable: true },
  reading: { dice: [{ count: 1, sides: 8 }], reading: '1d8 + 2' },
  cooldown: { value: 0 },
  rollAttributes: {}
});

function keyFor(token) {
  return JSON.stringify(refOf(token));
}

const approveBtn = () => screen.getByRole('button', { name: /Approve/i });

describe('SpellConsequencePanel relationship-aware target picker', () => {
  let allyCreature;
  let enemyCreature;
  let neutralCreature;
  let hiddenCreature;
  let casterPc;

  beforeEach(() => {
    jest.clearAllMocks();
    casterPc = pcToken('pc-1', 'caster-1', 'Caster', 'owner-1');
    allyCreature = creatureToken('c-ally', 'Ward Hound');
    enemyCreature = creatureToken('c-enemy', 'Goblin Raider');
    neutralCreature = creatureToken('c-neutral', 'Town Guard');
    hiddenCreature = creatureToken('c-hidden', 'Secret Assassin', 'c-hidden-inst', {
      hiddenFromPlayers: true,
      state: { hiddenFromPlayers: true, conditions: [] }
    });

    useCharacterTokenStore.setState({ characterTokens: [casterPc] });
    useCreatureStore.setState({ creatureTokens: [allyCreature, enemyCreature, neutralCreature, hiddenCreature] });
    useCombatFeedStore.setState({
      rendered: Object.fromEntries(
        [allyCreature, enemyCreature, neutralCreature].map(t => [actorKey(refOf(t)), 1])
      )
    });
    useSpellConsequenceStore.setState({
      owner: { spellId: 'authored:spell-1/1', origin: {} },
      ownerStatus: null,
      relationshipRevision: 1
    });
    mockDraft = { context: { spellId: 'authored:spell-1/1' }, label: 'Spell', roll: mockRoll, targetKey: '' };
    saveSpellDraft.mockImplementation(value => { mockDraft = value; });
  });

  test('ally-only: displays restriction, enables ally, blocks enemy and neutral with clear reason', async () => {
    mockSupport = singleSupport('ally');
    readTargetRelationship.mockImplementation(async (_room, _a, b) => ({
      success: true,
      revision: 1,
      value: b.tokenId === 'c-ally' ? 'ally' : b.tokenId === 'c-enemy' ? 'enemy' : 'neutral'
    }));

    render(<SpellConsequencePanel />);
    expect(screen.getByText('Allies only')).toBeTruthy();

    const select = screen.getByLabelText(/Target/);
    fireEvent.change(select, { target: { value: keyFor(allyCreature) } });
    await waitFor(() => expect(screen.getByText('Target is an ally of the caster.')).toBeTruthy());
    expect(approveBtn().disabled).toBe(false);

    fireEvent.change(select, { target: { value: keyFor(enemyCreature) } });
    expect(screen.getByRole('alert').textContent).toContain('This spell requires an ally. This target is an enemy of the caster.');
    expect(approveBtn().disabled).toBe(true);

    fireEvent.change(select, { target: { value: keyFor(neutralCreature) } });
    expect(screen.getByRole('alert').textContent).toContain('This spell requires an ally. This target is neutral to the caster.');
    expect(approveBtn().disabled).toBe(true);
  });

  test('enemy-only: displays restriction, enables enemy, blocks ally and neutral with clear reason', async () => {
    mockSupport = singleSupport('enemy');
    readTargetRelationship.mockImplementation(async (_room, _a, b) => ({
      success: true,
      revision: 1,
      value: b.tokenId === 'c-enemy' ? 'enemy' : b.tokenId === 'c-ally' ? 'ally' : 'neutral'
    }));

    render(<SpellConsequencePanel />);
    expect(screen.getByText('Enemies only')).toBeTruthy();

    const select = screen.getByLabelText(/Target/);
    fireEvent.change(select, { target: { value: keyFor(enemyCreature) } });
    await waitFor(() => expect(screen.getByText('Target is an enemy of the caster.')).toBeTruthy());
    expect(approveBtn().disabled).toBe(false);

    fireEvent.change(select, { target: { value: keyFor(allyCreature) } });
    expect(screen.getByRole('alert').textContent).toContain('This spell requires an enemy. This target is an ally of the caster.');
    expect(approveBtn().disabled).toBe(true);

    fireEvent.change(select, { target: { value: keyFor(neutralCreature) } });
    expect(screen.getByRole('alert').textContent).toContain('This spell requires an enemy. This target is neutral to the caster.');
    expect(approveBtn().disabled).toBe(true);
  });

  test('unrestricted (any) and self-healing leave existing behavior unchanged without relationship queries', async () => {
    mockSupport = singleSupport('any');
    render(<SpellConsequencePanel />);
    expect(screen.getByText('Any target (unrestricted)')).toBeTruthy();
    const select = screen.getByLabelText(/Target/);
    fireEvent.change(select, { target: { value: keyFor(neutralCreature) } });
    expect(approveBtn().disabled).toBe(false);
    expect(readTargetRelationship).not.toHaveBeenCalled();

    mockSupport = singleSupport('self', { selfHealing: true, kind: 'healing' });
    render(<SpellConsequencePanel />);
    expect(screen.getByText('Self only')).toBeTruthy();
    expect(readTargetRelationship).not.toHaveBeenCalled();
  });

  test('selected source changes and delayed out-of-order responses cannot enable newer source', async () => {
    mockSupport = singleSupport('ally');
    const pc2 = pcToken('pc-2', 'caster-2', 'Caster Two', 'owner-1');
    useCharacterTokenStore.setState({ characterTokens: [casterPc, pc2] });

    let resolvePc1;
    let resolvePc2;
    readTargetRelationship.mockImplementation((_room, a, b) => {
      if (b.tokenId !== 'c-ally') return Promise.resolve({ success: true, revision: 1, value: 'neutral' });
      if (a.tokenId === 'pc-1') return new Promise(r => { resolvePc1 = r; });
      return new Promise(r => { resolvePc2 = r; });
    });

    render(<SpellConsequencePanel />);
    const select = screen.getByLabelText(/Target/);
    fireEvent.change(select, { target: { value: keyFor(allyCreature) } });
    expect(approveBtn().disabled).toBe(true);

    // Switch source to pc-2 while pc-1 query is still in flight
    act(() => {
      require('../../../store/characterStore').default.setState({ currentCharacterId: 'caster-2' });
    });

    // Old pc-1 response arrives claiming 'ally' -> must NOT enable pc-2!
    await act(async () => {
      resolvePc1({ success: true, revision: 1, value: 'ally' });
    });
    expect(approveBtn().disabled).toBe(true);

    // Current pc-2 response arrives as 'neutral' -> blocked with neutral reason
    await act(async () => {
      resolvePc2({ success: true, revision: 1, value: 'neutral' });
    });
    expect(screen.getByRole('alert').textContent).toContain('This spell requires an ally. This target is neutral to the caster.');
    expect(approveBtn().disabled).toBe(true);
  });

  test('target incarnation replacement requires re-selecting new incarnation and re-queries', async () => {
    mockSupport = singleSupport('enemy');
    readTargetRelationship.mockResolvedValue({ success: true, revision: 1, value: 'enemy' });

    render(<SpellConsequencePanel />);
    const select = screen.getByLabelText(/Target/);
    fireEvent.change(select, { target: { value: keyFor(enemyCreature) } });
    await waitFor(() => expect(approveBtn().disabled).toBe(false));

    readTargetRelationship.mockResolvedValue({ success: true, revision: 2, value: 'neutral' });
    const replacement = creatureToken('c-enemy', 'Goblin Raider', 'c-enemy-inst-2');
    act(() => {
      useCreatureStore.setState({ creatureTokens: [allyCreature, replacement, neutralCreature] });
    });

    expect(approveBtn().disabled).toBe(true);
    expect(screen.getByRole('alert').textContent).toContain('missing, replaced or no longer eligible');

    fireEvent.change(select, { target: { value: keyFor(replacement) } });
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('This target is neutral to the caster.'));
    expect(approveBtn().disabled).toBe(true);
  });

  test('relationship changes while selected re-evaluate via relationshipRevision and preserve retained dice', async () => {
    mockSupport = singleSupport('enemy');
    readTargetRelationship.mockResolvedValue({ success: true, revision: 1, value: 'enemy' });

    render(<SpellConsequencePanel />);
    const select = screen.getByLabelText(/Target/);
    fireEvent.change(select, { target: { value: keyFor(enemyCreature) } });
    await waitFor(() => expect(approveBtn().disabled).toBe(false));
    expect(screen.getByText(/Recorded physical roll/)).toBeTruthy();

    readTargetRelationship.mockResolvedValue({ success: true, revision: 2, value: 'ally' });
    act(() => {
      useSpellConsequenceStore.setState({ relationshipRevision: 2 });
    });

    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('This spell requires an enemy. This target is an ally of the caster.'));
    expect(approveBtn().disabled).toBe(true);
    expect(screen.getByText(/Recorded physical roll/)).toBeTruthy();
  });

  test('query failure shows could-not-verify (distinct from neutral), blocks submit, and retry recovers while preserving dice', async () => {
    mockSupport = singleSupport('ally');
    readTargetRelationship.mockResolvedValue({ success: false, code: 'room_connection_unavailable' });

    render(<SpellConsequencePanel />);
    const select = screen.getByLabelText(/Target/);
    fireEvent.change(select, { target: { value: keyFor(allyCreature) } });

    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Could not verify target relationship'));
    expect(screen.getByRole('alert').textContent).not.toContain('neutral');
    expect(approveBtn().disabled).toBe(true);
    expect(screen.getByText(/Recorded physical roll/)).toBeTruthy();

    readTargetRelationship.mockResolvedValue({ success: true, revision: 2, value: 'ally' });
    fireEvent.click(screen.getByRole('button', { name: 'Retry relationship check' }));
    await waitFor(() => expect(screen.getByText('Target is an ally of the caster.')).toBeTruthy());
    expect(approveBtn().disabled).toBe(false);
    expect(screen.getByText(/Recorded physical roll/)).toBeTruthy();
  });

  test('PC consent notice remains required on ally primary-PC healing target', async () => {
    const allyPc = pcToken('pc-ally', 'ally-pc-1', 'Ally Cleric', 'owner-2');
    useCharacterTokenStore.setState({ characterTokens: [casterPc, allyPc] });
    mockSupport = singleSupport('ally', { targetRoute: 'primary-pc-healing', kind: 'healing', definitionHash: `${FORMULA_CAPABILITY}/hash`, rollAttributes: { spirit: 14 } });
    readTargetRelationship.mockResolvedValue({ success: true, revision: 1, value: 'ally' });

    render(<SpellConsequencePanel />);
    const select = screen.getByLabelText(/Target/);
    fireEvent.change(select, { target: { value: keyFor(allyPc) } });

    await waitFor(() => expect(screen.getByText('Target is an ally of the caster.')).toBeTruthy());
    expect(screen.getByText(/the target's owner must separately accept the exact healing amount/i)).toBeTruthy();
    expect(approveBtn().disabled).toBe(false);
  });

  test('area mixed eligibility identifies invalid selections without silently dropping targets or losing dice', async () => {
    mockSupport = areaSupport('enemy');
    useCreatureStore.setState({ creatureTokens: [enemyCreature, neutralCreature, hiddenCreature] });
    const areaKeys = [enemyCreature, neutralCreature].map(t => pickKey(refOf(t)));
    mockDraft = {
      context: { spellId: 'authored:spell-1/1' },
      label: 'Pulse',
      roll: mockRoll,
      targetKeys: areaKeys,
      areaOrigin: { x: 150, y: 100 }
    };
    readTargetRelationship.mockImplementation(async (_room, _a, b) => ({
      success: true,
      revision: 1,
      value: b.tokenId === 'c-enemy' ? 'enemy' : 'neutral'
    }));

    render(<SpellConsequencePanel />);
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Selected ineligible target(s): Town Guard'));

    // Hidden creature must never appear or be queried
    expect(screen.queryByText(/Secret Assassin/)).toBeNull();
    expect(readTargetRelationship).not.toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.objectContaining({ tokenId: 'c-hidden' }));

    // Mixed selection is NOT silently dropped; both checkboxes remain checked, approve is disabled
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes.every(cb => cb.checked)).toBe(true);
    expect(approveBtn().disabled).toBe(true);
    expect(screen.getByText(/Recorded physical roll/)).toBeTruthy();

    // Manually unchecking Town Guard enables approval with Goblin Raider + retained dice
    fireEvent.click(checkboxes[1]);
    expect(approveBtn().disabled).toBe(false);
    await act(async () => fireEvent.click(approveBtn()));
    expect(sendSpellApproval).toHaveBeenCalledWith(expect.objectContaining({
      targetRefs: [refOf(enemyCreature)],
      roll: mockRoll
    }));
  });

  test('single-target: hidden tokens (hiddenFromPlayers or isHidden) are excluded and never queried', async () => {
    const isHiddenCreature = creatureToken('c-ishidden', 'Shadow Stalker', 'c-ishidden-inst', {
      state: { isHidden: true, conditions: [] }
    });
    useCreatureStore.setState({ creatureTokens: [allyCreature, hiddenCreature, isHiddenCreature] });
    mockSupport = singleSupport('ally');
    readTargetRelationship.mockResolvedValue({ success: true, revision: 1, value: 'ally' });

    render(<SpellConsequencePanel />);
    await waitFor(() => expect(readTargetRelationship).toHaveBeenCalled());

    expect(screen.queryByText(/Secret Assassin/)).toBeNull();
    expect(screen.queryByText(/Shadow Stalker/)).toBeNull();
    expect(readTargetRelationship).not.toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.objectContaining({ tokenId: 'c-hidden' }));
    expect(readTargetRelationship).not.toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.objectContaining({ tokenId: 'c-ishidden' }));
  });

  test('room switching: delayed response from previous room cannot enable new room, and lower-revision update in new room still invalidates', async () => {
    const gameStore = require('../../../store/gameStore').default;
    act(() => {
      gameStore.setState({ multiplayerRoom: { id: 'room-1' } });
      useSpellConsequenceStore.setState({
        relationshipRevision: 10,
        relationshipRevisions: { 'room-1': 10 }
      });
    });

    mockSupport = singleSupport('ally');
    let resolveRoom1;
    let resolveRoom2Initial;
    readTargetRelationship.mockImplementation((roomIdArg, _a, b) => {
      if (b.tokenId !== 'c-ally') return Promise.resolve({ success: true, revision: 1, value: 'neutral' });
      if (roomIdArg === 'room-1') return new Promise(r => { resolveRoom1 = r; });
      if (roomIdArg === 'room-2') return new Promise(r => { resolveRoom2Initial = r; });
      return Promise.resolve({ success: true, revision: 1, value: 'neutral' });
    });

    render(<SpellConsequencePanel />);
    const select = screen.getByLabelText(/Target/);
    fireEvent.change(select, { target: { value: keyFor(allyCreature) } });
    expect(approveBtn().disabled).toBe(true);

    // Switch to room-2 while room-1 query is still in flight
    act(() => {
      gameStore.setState({ multiplayerRoom: { id: 'room-2' } });
    });

    // Delayed room-1 response claiming 'ally' arrives -> must NOT enable room-2!
    await act(async () => {
      resolveRoom1({ success: true, revision: 10, value: 'ally' });
    });
    expect(approveBtn().disabled).toBe(true);

    // Initial room-2 query resolves as 'ally' (revision 1 < room-1's 10)
    await act(async () => {
      resolveRoom2Initial({ success: true, revision: 1, value: 'ally' });
    });
    expect(approveBtn().disabled).toBe(false);

    // GM updates relationship in room-2 to 'enemy' at revision 2 (still < 10!) -> must invalidate and block!
    readTargetRelationship.mockResolvedValue({ success: true, revision: 2, value: 'enemy' });
    act(() => {
      useSpellConsequenceStore.setState(state => ({
        relationshipRevision: state.relationshipRevision + 1,
        relationshipRevisions: { ...(state.relationshipRevisions || {}), 'room-2': 2 }
      }));
    });
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('This spell requires an ally. This target is an enemy of the caster.'));
    expect(approveBtn().disabled).toBe(true);
  });

  test('direct-damage save, Hunter Flow, and class-paid authored-effect bundles exclude primary PCs in OwnerPanel while plain PC-eligible bundles keep them', () => {
    const allyPc = pcToken('pc-ally', 'ally-pc-1', 'Ally Cleric', 'owner-2');
    useCharacterTokenStore.setState({ characterTokens: [casterPc, allyPc] });
    readTargetRelationship.mockResolvedValue({ success: true, revision: 1, value: 'enemy' });

    const optionNames = () => Array.from(screen.getByLabelText(/Target/).querySelectorAll('option')).map(o => o.textContent);

    mockSupport = singleSupport('enemy', { saveTerms: { scope: 'direct', ability: 'agility', dc: 15, outcome: 'halves' } });
    const view = render(<SpellConsequencePanel />);
    expect(optionNames().some(t => t.includes('Goblin Raider'))).toBe(true);
    expect(optionNames().some(t => t.includes('Ally Cleric'))).toBe(false);

    mockSupport = singleSupport('enemy', { isHunterFlow: true, hunterFlow: { mechanic: 'quick_draw' }, damageTypes: ['stabbing'] });
    view.rerender(<SpellConsequencePanel />);
    expect(optionNames().some(t => t.includes('Goblin Raider'))).toBe(true);
    expect(optionNames().some(t => t.includes('Ally Cleric'))).toBe(false);

    const beneficialTerms = {
      direct: null,
      condition: { kind: 'attribute', attribute: 'agility', amount: 2, label: 'Quickened' },
      timing: { expiryPolicy: 'gm-manual', durationText: 'Until removed' }
    };
    mockSupport = singleSupport('ally', {
      kind: 'effect',
      effectTerms: beneficialTerms,
      timing: beneficialTerms.timing,
      classPaymentSpec: { domain: 'musicalNotes', costs: ['I'] },
      payment: { affordable: true, domain: 'none', classPayment: null }
    });
    view.rerender(<SpellConsequencePanel />);
    expect(optionNames().some(t => t.includes('Ward Hound'))).toBe(true);
    expect(optionNames().some(t => t.includes('Ally Cleric'))).toBe(false);

    // Positive control: plain beneficial bundle without classPaymentSpec keeps primary PCs eligible
    mockSupport = singleSupport('ally', {
      kind: 'effect',
      effectTerms: beneficialTerms,
      timing: beneficialTerms.timing,
      classPaymentSpec: null,
      payment: { affordable: true, domain: 'none', classPayment: null }
    });
    view.rerender(<SpellConsequencePanel />);
    expect(optionNames().some(t => t.includes('Ally Cleric'))).toBe(true);
  });
});
