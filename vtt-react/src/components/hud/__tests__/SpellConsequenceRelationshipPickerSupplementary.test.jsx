import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import SpellConsequencePanel from '../SpellConsequencePanel';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCreatureStore from '../../../store/creatureStore';
import { refOf } from '../../../services/actorConsequenceService';
import { pickKey } from '../../../services/targetPick';
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
  spellDraftContext: ({ characterId, sourceRef, spellId }) => (
    sourceRef ? { characterId, sourceRef, spellId } : null
  ),
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

const pcToken = (id, charId, name, ownerUid = 'owner-1') => ({
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
  definitionId: extra.definitionId || 'authored:spell-1/1',
  definitionHash: extra.definitionHash || 'authored:v1/hash',
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
  name: 'Enemy Pulse',
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

const keyFor = token => JSON.stringify(refOf(token));
const approveBtn = () => screen.getByRole('button', { name: /Approve/i });

describe('SpellConsequencePanel supplementary relationship-picker regressions', () => {
  let pc1;
  let pc2;
  let enemyCreature;
  let neutralCreature;
  let hiddenPlayersCreature;
  let hiddenFlagCreature;

  beforeEach(() => {
    jest.clearAllMocks();
    pc1 = pcToken('pc-1', 'caster-1', 'Ilse');
    pc2 = pcToken('pc-2', 'caster-2', 'Ilse Two');
    enemyCreature = creatureToken('c-enemy', 'Beta');
    neutralCreature = creatureToken('c-neutral', 'Gamma');
    hiddenPlayersCreature = creatureToken('c-hidden-p', 'HiddenShade', 'c-hidden-p-inst', {
      hiddenFromPlayers: true,
      state: { hiddenFromPlayers: true, conditions: [] }
    });
    hiddenFlagCreature = creatureToken('c-hidden-f', 'ShadowWisp', 'c-hidden-f-inst', {
      state: { isHidden: true, conditions: [] }
    });

    require('../../../store/characterStore').default.setState({ currentCharacterId: 'caster-1' });
    useCharacterTokenStore.setState({ characterTokens: [pc1, pc2] });
    useCreatureStore.setState({
      creatureTokens: [enemyCreature, neutralCreature, hiddenPlayersCreature, hiddenFlagCreature]
    });
    useCombatFeedStore.setState({
      rendered: Object.fromEntries(
        [pc1, pc2, enemyCreature, neutralCreature, hiddenPlayersCreature, hiddenFlagCreature]
          .map(t => [actorKey(refOf(t)), 1])
      )
    });
    useSpellConsequenceStore.setState({
      owner: { spellId: 'authored:spell-1/1', origin: {} },
      ownerStatus: null,
      relationshipRevision: 1
    });
    mockDraft = {
      context: { characterId: 'caster-1', sourceRef: refOf(pc1), spellId: 'authored:spell-1/1' },
      label: 'Self Mend',
      roll: mockRoll,
      targetKey: ''
    };
    saveSpellDraft.mockImplementation(value => { mockDraft = value; });
  });

  test('self-only: source is the only eligible target and switching source updates exact self identity', async () => {
    mockSupport = singleSupport('self', { selfHealing: true, kind: 'healing', name: 'Self Mend' });
    render(<SpellConsequencePanel />);

    expect(screen.getByText('Self only')).toBeTruthy();
    const select = screen.getByLabelText(/Target/);
    const initialOptions = Array.from(select.querySelectorAll('option')).map(o => o.textContent);
    expect(initialOptions).toHaveLength(2);
    expect(initialOptions[1]).toContain('Ilse · character · pc-1 (you)');
    expect(initialOptions.some(t => t.includes('Ilse Two') || t.includes('Beta') || t.includes('HiddenShade'))).toBe(false);

    fireEvent.change(select, { target: { value: keyFor(pc1) } });
    expect(approveBtn().disabled).toBe(false);

    // Switch source to pc2: old pc1 targetKey becomes ineligible/missing and only pc2 is offered
    mockDraft = {
      context: { characterId: 'caster-2', sourceRef: refOf(pc2), spellId: 'authored:spell-1/1' },
      label: 'Self Mend',
      roll: mockRoll,
      targetKey: ''
    };
    act(() => {
      require('../../../store/characterStore').default.setState({ currentCharacterId: 'caster-2' });
    });

    const switchedOptions = Array.from(select.querySelectorAll('option')).map(o => o.textContent);
    expect(switchedOptions).toHaveLength(2);
    expect(switchedOptions[1]).toContain('Ilse Two · character · pc-2 (you)');
    expect(switchedOptions.some(t => t.includes('pc-1'))).toBe(false);
    expect(screen.getByRole('alert').textContent).toContain('missing, replaced or no longer eligible');
    expect(approveBtn().disabled).toBe(true);

    fireEvent.change(select, { target: { value: keyFor(pc2) } });
    expect(approveBtn().disabled).toBe(false);
    await act(async () => fireEvent.click(approveBtn()));
    expect(sendSpellApproval).toHaveBeenCalledWith(expect.objectContaining({
      targetRef: refOf(pc2),
      roll: mockRoll
    }));
    expect(readTargetRelationship).not.toHaveBeenCalled();
  });

  test('self-only: delayed relationship response from previous source/spell cannot enable cast for previous source', async () => {
    let resolvePrevQuery;
    readTargetRelationship.mockImplementation(() => new Promise(r => { resolvePrevQuery = r; }));
    mockSupport = singleSupport('ally', { name: 'Ally Ward' });

    const { rerender } = render(<SpellConsequencePanel />);
    const select = screen.getByLabelText(/Target/);
    fireEvent.change(select, { target: { value: keyFor(enemyCreature) } });
    expect(approveBtn().disabled).toBe(true);

    // Switch to pc2 and self-only spell while previous pc1 relationship query is in flight
    mockSupport = singleSupport('self', { selfHealing: true, kind: 'healing', name: 'Self Mend', definitionId: 'authored:self-1/1' });
    mockDraft = {
      context: { characterId: 'caster-2', sourceRef: refOf(pc2), spellId: 'authored:self-1/1' },
      label: 'Self Mend',
      roll: mockRoll,
      targetKey: ''
    };
    act(() => {
      require('../../../store/characterStore').default.setState({ currentCharacterId: 'caster-2' });
      useSpellConsequenceStore.setState({ owner: { spellId: 'authored:self-1/1', origin: {} } });
    });
    rerender(<SpellConsequencePanel />);

    // Delayed response for previous source arrives claiming 'ally'
    await act(async () => {
      resolvePrevQuery({ success: true, revision: 1, value: 'ally' });
    });

    // Previous targetKey is blocked and cannot enable approval for pc1
    expect(approveBtn().disabled).toBe(true);
    expect(sendSpellApproval).not.toHaveBeenCalled();
  });

  test('area: live relationship change invalidates eligibility without discarding recorded dice, and hidden actors stay unexposed', async () => {
    mockSupport = areaSupport('enemy');
    mockDraft = {
      context: { characterId: 'caster-1', sourceRef: refOf(pc1), spellId: 'authored:spell-1/1' },
      label: 'Enemy Pulse',
      roll: mockRoll,
      targetKeys: [pickKey(refOf(enemyCreature))],
      areaOrigin: { x: 150, y: 100 }
    };
    readTargetRelationship.mockImplementation(async (_room, _a, b) => ({
      success: true,
      revision: 1,
      value: b.tokenId === 'c-enemy' ? 'enemy' : 'neutral'
    }));

    render(<SpellConsequencePanel />);
    await waitFor(() => expect(approveBtn().disabled).toBe(false));
    expect(screen.getByText(/Recorded physical roll/)).toBeTruthy();

    // Hidden actors (hiddenFromPlayers or isHidden) never appear or get queried
    expect(screen.queryByText(/HiddenShade/)).toBeNull();
    expect(screen.queryByText(/ShadowWisp/)).toBeNull();
    expect(readTargetRelationship).not.toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.objectContaining({ tokenId: 'c-hidden-p' }));
    expect(readTargetRelationship).not.toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.objectContaining({ tokenId: 'c-hidden-f' }));

    // Relationship change on Beta (enemy -> ally) invalidates eligibility while preserving roll
    readTargetRelationship.mockImplementation(async (_room, _a, b) => ({
      success: true,
      revision: 2,
      value: b.tokenId === 'c-enemy' ? 'ally' : 'enemy'
    }));
    act(() => {
      useSpellConsequenceStore.setState({ relationshipRevision: 2 });
    });

    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Selected ineligible target(s): Beta'));
    expect(approveBtn().disabled).toBe(true);
    expect(screen.getByText(/Recorded physical roll/)).toBeTruthy();

    // Correct selection: uncheck Beta, check Gamma (now enemy) -> enables normal approval with preserved dice
    const checkboxes = screen.getAllByRole('checkbox').filter(cb => !cb.disabled);
    expect(checkboxes).toHaveLength(2);
    fireEvent.click(checkboxes[0]); // uncheck Beta
    fireEvent.click(checkboxes[1]); // check Gamma
    expect(approveBtn().disabled).toBe(false);
    await act(async () => fireEvent.click(approveBtn()));
    expect(sendSpellApproval).toHaveBeenCalledWith(expect.objectContaining({
      targetRefs: [refOf(neutralCreature)],
      roll: mockRoll
    }));
  });
});
