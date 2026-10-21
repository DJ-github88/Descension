import fs from 'fs';
import path from 'path';
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import {
  GAMBLER_DATA, GAMBLER_MANIFEST, GAMBLER_AUTHORED_RECORDS, GAMBLER_OPTIONAL_RECORDS,
  GAMBLER_PROJECTED_SPELLS_BY_ID, GAMBLER_R1_SPELLS, GAMBLER_CARD_IDS,
  validateGamblerState, validateGamblerSelection, projectGamblerResource, pruneGamblerTalents
} from '../gamblerData';
import { GAMBLER_TREES, GAMBLER_TALENT_NODES } from '../../talentTrees/gambler';
import { ALL_CLASSES_DATA } from '..';
import { ALL_CLASS_SPELLS } from '../../classSpellGenerator';
import { TALENT_TREES } from '../../talentTreeData';
import { getClassHeritageAccess, getClassNativeHeritageIds, CLASS_PROVENANCE } from '../../classHeritageRegistry';
import { getHeritageEdge } from '../../heritageEdgeContract';
import { getClassRacialTraits } from '../../classRacials';
import { getReconstructionCompatibility, GAMBIT_RECORD_DISPOSITIONS } from '../classReconstructionCompatibility';
import { initializeClassResource } from '../../classResources';
import { getManagedResourceId, normalizeManagedClassResource, updateManagedClassResource } from '../../classResourceContracts';
import useCharacterStore from '../../../store/characterStore';
import useSpellbookStore from '../../../store/spellbookStore';
import { pruneTalentsForChange } from '../../../store/characterSlices/progressionSlice';
import { TalentTreeContent } from '../../../components/talent-tree/TalentTreeContent';
import LevelUpChoiceModal from '../../../components/modals/LevelUpChoiceModal';
import { SpellLibraryProvider } from '../../../components/spellcrafting-wizard/context/SpellLibraryContext';
import { __getLibrary, __setLibrary } from '../../../components/spellcrafting-wizard/core/utils/libraryManager';
import { useClassSpellLibrary } from '../../../hooks/useClassSpellLibrary';
import SpellLibrary from '../../../components/spellcrafting-wizard/components/library/SpellLibrary';

jest.mock('../../../store/authStore', () => {
  const state = { user: null };
  const useAuth = selector => selector ? selector(state) : state;
  useAuth.getState = () => state;
  return { __esModule: true, default: useAuth };
});

jest.mock('../../../components/spellcrafting-wizard/core/utils/libraryManager', () => {
  const actual = jest.requireActual('../../../components/spellcrafting-wizard/core/utils/libraryManager');
  let library = { spells: [] };
  return {
    ...actual,
    __setLibrary: value => { library = value; }, __getLibrary: () => library,
    loadLibraryFromStorage: () => library,
    saveLibraryToStorage: value => { library = value; return true; }
  };
});
const id = suffix => `cr1_gambler_${suffix}`;
const fixture = () => ({ version: 1, type: 'gambler-hand', fortune: 3, escrow: 0, pending: null,
  cards: { hand: GAMBLER_CARD_IDS.slice(0, 5), deck: GAMBLER_CARD_IDS.slice(5), discard: [], 'pending-wager': [] } });
const allocation = (tree, pointsBeforeSignature = false) => pointsBeforeSignature
  ? Object.fromEntries(tree.nodes.filter(n => /p0[1-4]$/.test(n.id)).map((n, i) => [n.id, i === 3 ? 1 : 3]))
  : Object.fromEntries(tree.nodes.map(n => [n.id, n.maxRanks]));
const stateFor = overrides => useCharacterStore.setState({
  class: 'Gambler', characterClass: 'Gambler', level: 3, currentCharacterId: null,
  characters: [], talents: {}, primarySpecialization: '', levelUpHistory: {},
  syncWithMultiplayer: jest.fn(), debouncedSave: jest.fn(), recordCharacterChange: jest.fn(),
  class_spells: { known_spells: [id('wager_strike'), id('recut')] },
  ...overrides
});

describe('accepted G1 package and normal registration', () => {
  test('96 unique full records, 48 active records, 54 nodes and fifty ranks per tree', () => {
    expect(GAMBLER_AUTHORED_RECORDS).toHaveLength(96);
    expect(new Set(GAMBLER_AUTHORED_RECORDS.map(r => r.id)).size).toBe(96);
    expect(GAMBLER_AUTHORED_RECORDS.filter(r => r.spellType === 'ACTION')).toHaveLength(48);
    expect(GAMBLER_TALENT_NODES).toHaveLength(54);
    GAMBLER_TREES.forEach(tree => {
      expect(tree.nodes).toHaveLength(18);
      expect(tree.nodes.reduce((n, node) => n + node.maxRanks, 0)).toBe(50);
      expect(tree.nodes.filter(node => node.passiveSpellId)).toHaveLength(16);
    });
    GAMBLER_AUTHORED_RECORDS.forEach(record => {
      expect(record).toMatchObject({ classId: 'gambler', rulesetVersion: 'cr-review-r1', executionEnabled: false, authoredOnly: true, applicationMode: 'manual-tabletop', automatedCapabilities: [] });
      expect(record.resourceCost.mana).toBe(0);
      expect(record.description.length).toBeGreaterThan(50);
    });
    expect(GAMBLER_MANIFEST.nativeAccess).toEqual(['merryn_human', 'drall_fexric']);
    expect(ALL_CLASSES_DATA.Gambler.spells).toHaveLength(96);
    expect(ALL_CLASS_SPELLS.Gambler.filter(s => s.classId === 'gambler')).toHaveLength(96);
  });

  test('four optional records at every level, at least two non-damage, no grants in pools', () => {
    for (let level = 1; level <= 10; level++) {
      const records = GAMBLER_OPTIONAL_RECORDS.filter(record => record.level === level);
      expect(records).toHaveLength(4);
      expect(records.filter(record => !record.effectTypes.includes('damage')).length).toBeGreaterThanOrEqual(2);
      expect(GAMBLER_DATA.spellPools[level]).toEqual(records.map(record => record.id));
    }
    const poolIds = Object.values(GAMBLER_DATA.spellPools).flat();
    expect(poolIds).not.toContain(id('recut'));
    expect(poolIds).not.toContain(id('double_or_nothing'));
    expect(poolIds).not.toContain(id('the_last_stake'));
  });

  test('all six retained R1 payloads deep-equal the independent reviewed source, including zero/null and typed args', () => {
    const review = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '../docs/plans/mythrill-class-reconstruction/classes/manifests/gambler-review-r1.json'), 'utf8'));
    review.abilities.forEach(({ spell, talentNode }) => {
      expect(GAMBLER_PROJECTED_SPELLS_BY_ID[spell.id].specialMechanics.gambler.authoredSpell).toEqual(spell);
      expect(GAMBLER_R1_SPELLS.find(r => r.id === spell.id)).toEqual(spell);
      if (talentNode) expect(GAMBLER_TALENT_NODES.find(n => n.id === talentNode.id).grantId).toBe(spell.id);
    });
  });

  test('all 48 passive rank triples are exact G1 values and have one canonical derived record', () => {
    const expected = [
      [[1,2,3],[5,10,15],[2,3,4],[3,4,5],[1,2,3],[1,2,3],[1,2,3],[1,2,3],[3,4,5],[1,2,3],[1,2,3],[1,2,3],[1,2,3],[1,2,3],[1,2,3],[2,4,6]],
      [[1,2,3],[3,4,5],[1,2,3],[15,20,30],[5,10,15],[15,20,30],[1,2,3],[3,4,5],[3,4,5],[1,2,3],[4,5,6],[5,10,15],[1,2,3],[9,10,11],[20,25,30],[5,6,7]],
      [[1,2,3],[3,4,5],[10,20,30],[1,2,3],[2,3,4],[3,4,5],[3,4,5],[3,4,5],[1,2,3],[15,20,30],[2,3,4],[5,6,7],[4,5,6],[40,50,60],[5,6,7],[4,5,6]]
    ];
    GAMBLER_TREES.forEach((tree, treeIndex) => tree.nodes.filter(n => n.passiveSpellId).forEach((node, index) => {
      expect(node.rankValues.map(rank => Object.values(rank.values)[0])).toEqual(expected[treeIndex][index]);
      expect(GAMBLER_PROJECTED_SPELLS_BY_ID[node.passiveSpellId].specialMechanics.gambler.rankValues).toEqual(node.rankValues);
      expect(TALENT_TREES.Gambler[tree.id].find(n => n.id === node.id).spell.id).toBe(node.passiveSpellId);
    }));
  });

  test('all trees are fully reachable with no cycles, same-tree gates and global fifty-point pruning', () => {
    GAMBLER_TREES.forEach(tree => {
      const full = allocation(tree);
      expect(pruneGamblerTalents(full, 10)).toEqual(full);
      const atTwo = pruneGamblerTalents(full, 2);
      expect(Object.values(atTwo).reduce((n, rank) => n + rank, 0)).toBeLessThanOrEqual(10);
      expect(atTwo[tree.nodes.find(n => n.grantId === id(tree.meta.signature)).id]).toBeUndefined();
    });
    const all = Object.fromEntries(GAMBLER_TALENT_NODES.map(n => [n.id, n.maxRanks]));
    expect(Object.values(pruneGamblerTalents(all, 10)).reduce((n, rank) => n + rank, 0)).toBe(50);
    const cap = GAMBLER_TALENT_NODES.find(n => n.grantId === id('the_last_stake'));
    expect(cap).toMatchObject({ minLevel: 10, requiresPoints: 45, requiresAll: true });
    expect(pruneTalentsForChange(all, { previousClass: 'Gambler', nextClass: 'Gambler', level: 1 })).not.toEqual({});
  });

  test('both native trained paths resolve, outsiders need all four requirements, mechanical edges stay absent', () => {
    expect(getClassNativeHeritageIds('Gambler')).toEqual(['merryn_human', 'drall_fexric']);
    [['human', 'merryn_human'], ['fexrick', 'drall_fexric']].forEach(([race, heritage]) => {
      expect(getClassHeritageAccess('Gambler', race, heritage)).toMatchObject({ status: 'normal-tradition', selectable: true });
      expect(getHeritageEdge('Gambler', heritage)).toBeNull();
      expect(getClassRacialTraits('Gambler', race, heritage)).toEqual([]);
    });
    expect(CLASS_PROVENANCE.Gambler.heritageEffectsImplemented).toBe(false);
    expect(getClassHeritageAccess('Gambler', 'human', 'thalren_human').selectable).toBe(false);
    const qualification = { verified: true, source: 'Witnessed apprenticeship', fulfilledRequirements: CLASS_PROVENANCE.Gambler.requirements };
    expect(getClassHeritageAccess('Gambler', 'human', 'thalren_human', { qualification }).selectable).toBe(true);
    expect(getClassHeritageAccess('Gambler', 'human', 'thalren_human', { qualification: { ...qualification, fulfilledRequirements: qualification.fulfilledRequirements.slice(0, 3) } }).selectable).toBe(false);
  });

  test('compatibility covers independent 65-spell/3-tree/54-materialized inventory without converting legacy data', () => {
    const index = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '../docs/plans/mythrill-class-reconstruction/evidence/headq-priority-compatibility.json'), 'utf8'));
    const parent = index.candidates.find(c => c.candidate === 'gambler').parents[0];
    const expected = [...parent.allLegacySpellIds, ...parent.talentTrees.map(t => t.treeId), ...parent.talentTrees.flatMap(t => t.materializedSpellIds)].sort();
    expect(expected).toHaveLength(122);
    expect(GAMBIT_RECORD_DISPOSITIONS.map(r => r.sourceId).sort()).toEqual(expected);
    GAMBIT_RECORD_DISPOSITIONS.forEach(r => expect(r).toMatchObject({ disposition: 'keep', destinationId: null, automaticConversion: false }));
    expect(getReconstructionCompatibility('gambit')).toMatchObject({ relationship: 'split', automaticConversion: false, legacyResolutionRetained: true });
    expect(getReconstructionCompatibility('augur').recordDispositions).toEqual([]);
    const legacy = ALL_CLASSES_DATA.Gambit;
    expect(legacy.id).toBe('gambit');
    expect(ALL_CLASSES_DATA['Nereid Myrathil Augur'].isCompatibilityAlias).toBe(true);
    const before = JSON.stringify(legacy);
    normalizeManagedClassResource({ type: 'fortune', current: 3, debt: 2 }, 'Gambit');
    expect(JSON.stringify(legacy)).toBe(before);
  });
});

describe('finite-state refusal and read-only resource integration', () => {
  test('no normalization or hydration invents cards or refills, and legacy Fortune is not a hand', () => {
    const fresh = initializeClassResource('Gambler', {});
    expect(fresh).toMatchObject({ initialized: false, state: null, current: 0, max: 7 });
    expect(getManagedResourceId(fresh, 'Gambler')).toBe('gambler-hand');
    expect(getManagedResourceId({ type: 'fortune' })).not.toBe('gambler-hand');
    expect(getManagedResourceId({ type: 'fate_reserve' })).not.toBe('gambler-hand');
    const legacy = { type: 'fortune', current: 7, debt: 12, unknownLegacyField: { cards: ['historic-card'] } };
    expect(normalizeManagedClassResource(legacy, 'Gambler')).toBe(legacy);
    expect(projectGamblerResource(legacy, true)).toEqual({ initialized: false });
    const resource = { type: 'gambler-hand', state: fixture() };
    expect(updateManagedClassResource(resource, 'Gambler', 'current', 7).state.fortune).toBe(3);
    expect(projectGamblerResource(resource)).not.toHaveProperty('hand');
  });

  test.each(['duplicate', 'missing', 'too-many-hand', 'overflow', 'multiple-wagers'])('rejects %s without changing original bytes', mode => {
    const state = fixture();
    if (mode === 'duplicate') state.cards.deck[0] = state.cards.hand[0];
    if (mode === 'missing') state.cards.deck.pop();
    if (mode === 'too-many-hand') state.cards.hand.push(state.cards.deck.pop());
    if (mode === 'overflow') state.escrow = 5;
    if (mode === 'multiple-wagers') state.pending = [{ id: 'a' }, { id: 'b' }];
    const bytes = JSON.stringify(state);
    expect(validateGamblerState(state).ok).toBe(false);
    expect(JSON.stringify(state)).toBe(bytes);
  });

  test('valid committed/outcome-unknown and partial Compact snapshots conserve exact cards and escrow', () => {
    const state = fixture();
    const cards = state.cards.hand.splice(0, 2);
    state.cards['pending-wager'] = cards;
    state.fortune = 1; state.escrow = 2;
    state.pending = { id: 'compact-1', kind: 'house-compact', cardIds: [...cards], phase: 'outcome-unknown', legs: cards.map((cardId, i) => ({ id: `leg-${i}`, cardId, stake: 1, status: 'pending', targetRef: { actorId: `ally-${i}` } })) };
    expect(validateGamblerState(state).ok).toBe(true);
    expect(validateGamblerSelection(state, id('recut'), { cardIds: [] }).ok).toBe(false);
    state.pending.legs[0].status = 'won';
    state.cards.discard.push(state.cards['pending-wager'].shift());
    state.escrow = 1; state.fortune = 3;
    expect(validateGamblerState(state).ok).toBe(true);
    expect(projectGamblerResource({ state }, false).pending.outstandingLegs).toBe(1);
    state.pending.legs[1].id = state.pending.legs[0].id;
    expect(validateGamblerState(state).ok).toBe(false);
  });

  test('exact choices enforce stakes/patterns/deck presence and retain bounded broke recovery', () => {
    const state = fixture();
    expect(validateGamblerSelection(state, id('wager_strike'), { cardIds: ['1C'], stake: 2 }).ok).toBe(true);
    expect(validateGamblerSelection(state, id('wager_strike'), { cardIds: ['1C'], stake: 3 }).ok).toBe(false);
    expect(validateGamblerSelection(state, id('marked_pair'), { cardIds: ['1C', '2C'] }).ok).toBe(false);
    expect(validateGamblerSelection(state, id('royal_arrangement'), { cardIds: [...state.cards.hand], branch: 'flush' }).ok).toBe(true);
    expect(validateGamblerSelection(state, id('royal_arrangement'), { cardIds: [...state.cards.hand], branch: 'full-house' }).ok).toBe(false);
    const recut = GAMBLER_R1_SPELLS.find(r => r.id === id('recut')).classResourceProgram.args;
    expect(recut).toMatchObject({ discardMin: 0, discardMax: 2, drawMax: 2, shuffleOnlyWhenDeckEmpty: true, brokeRecovery: { requiresFortune: 0, requiresDiscardAtLeast: 1, gain: 1 } });
    expect(GAMBLER_R1_SPELLS.find(r => r.id === id('underwrite')).classResourceProgram.args).toMatchObject({ payoutMultiplier: 2, winDamageBonus: 2, expiredOrCancelled: 'lose-stake' });
  });
});

describe('actual learning, talent and store consumers', () => {
  beforeEach(() => {
    window.localStorage.clear();
    __setLibrary({ spells: [] });
    stateFor({});
    useSpellbookStore.setState({ spells: [] });
  });

  test('starter and level-up auto assignment never add optional or talent grants', async () => {
    expect(await useCharacterStore.getState().ensureClassStarterSpells('Gambler')).toBe(false);
    useCharacterStore.getState().assignSpellsForLevel(3, 'Gambler');
    expect(useCharacterStore.getState().class_spells.known_spells).toEqual([id('wager_strike'), id('recut')]);
  });

  test('an explicit class selection grants only the two cores and leaves the actual hand uninitialized', () => {
    const legacyRoster = { id: 'legacy-other', class: 'Gambit', class_spells: { known_spells: ['gambler_lucky_strike'] }, classResource: { type: 'fortune', current: 5, debt: 2 } };
    const before = JSON.stringify(legacyRoster);
    stateFor({ class: 'Gambit', characterClass: 'Gambit', race: 'human', subrace: 'merryn_human', characters: [legacyRoster] });
    useCharacterStore.getState().updateCharacterInfo('class', 'Gambler');
    expect(useCharacterStore.getState().class_spells.known_spells).toEqual([id('wager_strike'), id('recut')]);
    expect(useCharacterStore.getState().classResource).toMatchObject({ type: 'gambler-hand', initialized: false, state: null });
    expect(JSON.stringify(legacyRoster)).toBe(before);
  });

  test.each([1, 3, 10])('level %s modal exposes all legal options, no free core/signatures/passives', level => {
    const { baseElement } = render(<SpellLibraryProvider><LevelUpChoiceModal isOpen characterClass="Gambler" currentLevel={level} knownSpells={[id('wager_strike'), id('recut')]} onChoiceSelected={jest.fn()} onClose={jest.fn()} /></SpellLibraryProvider>);
    const images = [...baseElement.querySelectorAll('.spell-icons-row img')];
    expect(images).toHaveLength(level * 4);
    const names = images.map(image => image.alt);
    expect(names).toContain('Lucky Toss');
    expect(names).not.toContain('Wager Strike');
    expect(names).not.toContain('The Last Stake');
    expect(names).not.toContain('Coin Weight');
  });

  test('modal confirms one earlier unchosen optional and the store rejects duplicate or talent choices', () => {
    stateFor({ level: 2, pendingLevelUpInfo: { newLevel: 2 }, class_spells: { known_spells: [id('recut'), id('wager_strike'), id('lucky_toss')] } });
    const confirm = jest.fn(choice => useCharacterStore.getState().handleLevelUpChoice(choice));
    render(<SpellLibraryProvider><LevelUpChoiceModal isOpen characterClass="Gambler" currentLevel={2} knownSpells={useCharacterStore.getState().class_spells.known_spells} onChoiceSelected={confirm} onClose={jest.fn()} /></SpellLibraryProvider>);
    fireEvent.click(screen.getByAltText('Beginner’s Cover'));
    fireEvent.click(screen.getByRole('button', { name: 'Select Beginner’s Cover' }));
    fireEvent.click(screen.getByText('+15 Max Health').closest('button'));
    fireEvent.click(screen.getByText('+10 Max Mana').closest('button'));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm Choice' }));
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(confirm.mock.calls[0][0].spellId).toBe(id('beginners_cover'));
    expect(useCharacterStore.getState().class_spells.known_spells).toHaveLength(4);
    const before = useCharacterStore.getState().class_spells;
    act(() => useCharacterStore.getState().handleLevelUpChoice({ spellId: id('underwrite') }));
    expect(useCharacterStore.getState().class_spells).toBe(before);
  });

  test.each(GAMBLER_TREES)('$meta.name signature uses canonical ACTION/AP/identity and never creates a second passive', tree => {
    stateFor({ talents: allocation(tree, true), level: 3 });
    render(<TalentTreeContent selectedTreeIndex={GAMBLER_TREES.indexOf(tree)} />);
    const signature = tree.nodes.find(node => node.grantId === id(tree.meta.signature));
    fireEvent.click(screen.getByTitle(new RegExp(signature.name)));
    const stored = useSpellbookStore.getState().spells.find(spell => spell.id === signature.grantId);
    expect(stored).toBeDefined();
    expect(stored.spellType).toBe('ACTION');
    expect(stored.resourceCost.actionPoints).toBe(tree.meta.short === 'hr' ? 3 : 1);
    expect(stored.specialMechanics.gambler.authoredSpell).toEqual(GAMBLER_R1_SPELLS.find(spell => spell.id === signature.grantId));
    fireEvent.click(screen.getByTitle(new RegExp(signature.name)));
    expect(useSpellbookStore.getState().spells.filter(spell => spell.id === signature.grantId)).toHaveLength(1);
    expect(useSpellbookStore.getState().spells.some(spell => spell.id === `talent-spell-${signature.id}`)).toBe(false);
    expect(__getLibrary().spells.filter(spell => spell.id === signature.grantId)).toHaveLength(1);
  });

  test('partial predecessors and cross-tree points do not unlock a signature', () => {
    const first = GAMBLER_TREES[0];
    const ranks = allocation(first, true);
    ranks[first.nodes[0].id] = 2;
    ranks[first.nodes[3].id] = 2;
    stateFor({ level: 10, talents: ranks });
    render(<TalentTreeContent />);
    fireEvent.click(screen.getByTitle(/Double or Nothing/));
    expect(useSpellbookStore.getState().spells).toEqual([]);
    act(() => useCharacterStore.setState({ talents: allocation(GAMBLER_TREES[1], true) }));
    fireEvent.click(screen.getByTitle(/Double or Nothing/));
    expect(useSpellbookStore.getState().spells).toEqual([]);
  });

  test('actual allocation refuses a new tree after fifty points have been spent globally', () => {
    stateFor({ level: 10, talents: allocation(GAMBLER_TREES[0]) });
    const before = useCharacterStore.getState().talents;
    render(<TalentTreeContent selectedTreeIndex={1} />);
    fireEvent.click(screen.getByTitle(/Shared Cover/));
    expect(useCharacterStore.getState().talents).toBe(before);
    expect(useSpellbookStore.getState().spells).toEqual([]);
  });

  test.each(GAMBLER_TREES)('$meta.name capstone is refused at level nine and grants the exact ACTION once at level ten', tree => {
    const passives = tree.nodes.filter(node => node.passiveSpellId);
    const ranks = Object.fromEntries(passives.slice(0, 13).map(node => [node.id, 3]));
    ranks[passives[13].id] = 2;
    ranks[passives[14].id] = 3;
    const signature = tree.nodes.find(node => node.grantId === id(tree.meta.signature));
    ranks[signature.id] = 1;
    expect(Object.values(ranks).reduce((n, rank) => n + rank, 0)).toBe(45);
    stateFor({ level: 9, talents: ranks });
    render(<TalentTreeContent selectedTreeIndex={GAMBLER_TREES.indexOf(tree)} />);
    const cap = tree.nodes.find(node => node.grantId === id(tree.meta.capstone));
    fireEvent.click(screen.getByTitle(new RegExp(cap.name)));
    expect(useSpellbookStore.getState().spells.some(spell => spell.id === cap.grantId)).toBe(false);
    act(() => useCharacterStore.setState({ level: 10 }));
    fireEvent.click(screen.getByTitle(new RegExp(cap.name)));
    const spell = useSpellbookStore.getState().spells.find(entry => entry.id === cap.grantId);
    expect(spell).toMatchObject({ spellType: 'ACTION', resourceCost: { actionPoints: tree.meta.short === 'hr' ? 4 : tree.meta.short === 'cs' ? 3 : 2, mana: 0 } });
    expect(spell.specialMechanics.gambler.authoredSpell.manualMechanics.effects).toEqual(GAMBLER_PROJECTED_SPELLS_BY_ID[cap.grantId].specialMechanics.gambler.authoredSpell.manualMechanics.effects);
    expect(useSpellbookStore.getState().spells.some(entry => entry.id === `talent-spell-${cap.id}`)).toBe(false);
  });

  test('ranked passives retain accepted identities and highest-rank values through allocation/refund/reset', () => {
    render(<TalentTreeContent />);
    const node = GAMBLER_TREES[0].nodes[0];
    const button = screen.getByTitle(/Coin Weight/);
    fireEvent.click(button); fireEvent.click(button); fireEvent.click(button);
    let spell = useSpellbookStore.getState().spells.find(s => s.id === node.passiveSpellId);
    expect(spell.talentRank).toBe(3);
    expect(Object.values(spell.learnedRankValues)).toEqual([3]);
    expect(useSpellbookStore.getState().spells).toHaveLength(1);
    fireEvent.contextMenu(button);
    spell = useSpellbookStore.getState().spells.find(s => s.id === node.passiveSpellId);
    expect(spell.talentRank).toBe(2);
    expect(Object.values(spell.learnedRankValues)).toEqual([2]);
    fireEvent.click(screen.getByText('Reset All'));
    expect(useSpellbookStore.getState().spells).toEqual([]);
    expect(__getLibrary().spells).toEqual([]);
  });

  test('level reduction and class switch remove only obsolete derived identities, preserving other roster users', () => {
    const tree = GAMBLER_TREES[0];
    const signature = tree.nodes.find(n => n.grantId === id('double_or_nothing'));
    const records = tree.nodes.map(n => ({ id: n.grantId || n.passiveSpellId, talentId: n.id, source: 'talent' }));
    const keep = { id: 'unrelated-authored', name: 'Keep me', source: 'wizard' };
    stateFor({ level: 10, talents: allocation(tree), primarySpecialization: tree.id, characters: [{ id: 'other', class: 'Gambler', talents: { [signature.id]: 1 } }] });
    useSpellbookStore.setState({ spells: [...records, keep] });
    __setLibrary({ spells: [...records, keep] });
    useCharacterStore.getState().updateLevel(1);
    expect(Object.values(useCharacterStore.getState().talents).reduce((n, rank) => n + rank, 0)).toBeLessThanOrEqual(5);
    expect(useSpellbookStore.getState().spells.some(s => s.id === id('the_last_stake'))).toBe(false);
    expect(useSpellbookStore.getState().spells.some(s => s.id === signature.grantId)).toBe(true);
    useCharacterStore.getState().updateCharacterInfo('class', 'Gambit');
    expect(useCharacterStore.getState().talents).toEqual({});
    expect(useSpellbookStore.getState().spells.some(s => s.id === keep.id)).toBe(true);
    expect(useSpellbookStore.getState().spells.some(s => s.id === signature.grantId)).toBe(true);
    expect(useSpellbookStore.getState().spells.some(s => s.id === tree.nodes[0].passiveSpellId)).toBe(false);
  });

  test('library hook exposes learned canonical talent identities without granting unlearned options', async () => {
    const signature = GAMBLER_TREES[0].nodes.find(n => n.grantId === id('double_or_nothing'));
    stateFor({ talents: { ...allocation(GAMBLER_TREES[0], true), [signature.id]: 1 } });
    function LibraryProbe() {
      const library = useClassSpellLibrary();
      return <output aria-label="learned-library">{library.getAllSpells().map(spell => spell.id).join(',')}</output>;
    }
    render(<LibraryProbe />);
    expect(await screen.findByText(new RegExp(id('double_or_nothing')))).toBeInTheDocument();
    expect(screen.getByLabelText('learned-library').textContent).not.toContain(id('lucky_toss'));
    expect(useCharacterStore.getState().class_spells.known_spells).toHaveLength(2);
  });

  test.each(GAMBLER_TREES)('mounted $meta.name library deduplicates canonical grants and retains ACTION/AP/manual data in card drag payloads', async tree => {
    stateFor({ level: 10, talents: allocation(tree) });
    const signature = tree.nodes.find(node => node.grantId === id(tree.meta.signature));
    // A saved canonical copy must deduplicate against the live talent rebuild.
    __setLibrary({ spells: [{ ...GAMBLER_PROJECTED_SPELLS_BY_ID[signature.grantId], source: 'talent', talentId: signature.id }] });
    const { container } = render(<SpellLibraryProvider><SpellLibrary /></SpellLibraryProvider>);
    await waitFor(() => expect(screen.getByRole('button', { name: /^Talent Abilities/ })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /^Talent Abilities/ }));
    const payloads = [];
    for (let page = 0; page < 2; page++) {
      await waitFor(() => expect(container.querySelectorAll('.wow-spell-row[draggable="true"]').length).toBeGreaterThan(0));
      [...container.querySelectorAll('.wow-spell-row[draggable="true"]')].forEach(row => {
        const transfer = { setData: jest.fn(), setDragImage: jest.fn() };
        fireEvent.dragStart(row, { dataTransfer: transfer });
        const json = transfer.setData.mock.calls.find(([type]) => type === 'application/json')?.[1];
        payloads.push(JSON.parse(json));
      });
      if (page === 0) fireEvent.click(screen.getByRole('button', { name: 'Next Page' }));
    }
    expect(payloads).toHaveLength(18);
    expect(new Set(payloads.map(spell => spell.id)).size).toBe(18);
    expect(payloads.some(spell => spell.id.startsWith('talent-spell-'))).toBe(false);
    tree.nodes.filter(node => node.grantId).forEach(node => {
      const card = payloads.find(spell => spell.id === node.grantId);
      const canonical = GAMBLER_PROJECTED_SPELLS_BY_ID[node.grantId];
      expect(card.spellType).toBe('ACTION');
      expect(card.resourceCost).toEqual(canonical.resourceCost);
      expect(card.specialMechanics.gambler.authoredSpell).toEqual(canonical.specialMechanics.gambler.authoredSpell);
      expect(card.executionEnabled).toBe(false);
    });
    const passive = payloads.find(spell => spell.id === tree.nodes[0].passiveSpellId);
    expect(passive.talentRank).toBe(3);
    expect(passive.learnedRankValues).toEqual(tree.nodes[0].rankValues[2].values);
  });

  test.each(['updateLevel', 'adjustLevel', 'updateCharacterInfo'])('%s reconciles surviving passive rank copies and lost optional picks on level-down', method => {
    const tree = GAMBLER_TREES[0];
    const node = tree.nodes[0];
    // Three roots at rank three, signature prerequisites absent. At level one
    // deterministic pruning retains roots at ranks 2/2/1, not stale rank three.
    stateFor({ level: 3, talents: Object.fromEntries(tree.nodes.slice(0, 3).map(n => [n.id, 3])),
      levelUpHistory: { 3: { spellId: id('dice_dart') } },
      class_spells: { known_spells: [id('wager_strike'), id('recut'), id('dice_dart')] } });
    const derived = { ...GAMBLER_PROJECTED_SPELLS_BY_ID[node.passiveSpellId], id: node.passiveSpellId, source: 'talent', talentId: node.id, talentRank: 3 };
    useSpellbookStore.setState({ spells: [derived] });
    __setLibrary({ spells: [derived] });
    if (method === 'adjustLevel') useCharacterStore.getState().adjustLevel(-2);
    else if (method === 'updateCharacterInfo') useCharacterStore.getState().updateCharacterInfo('level', 1);
    else useCharacterStore.getState().updateLevel(1);
    expect(useCharacterStore.getState().class_spells.known_spells).not.toContain(id('dice_dart'));
    const actualRank = useCharacterStore.getState().talents[node.id];
    expect(actualRank).toBeLessThan(3);
    expect(useSpellbookStore.getState().spells.find(s => s.id === node.passiveSpellId).talentRank).toBe(actualRank);
    expect(__getLibrary().spells.find(s => s.id === node.passiveSpellId).talentRank).toBe(actualRank);
  });
});

afterAll(() => {
  if (process.env.RI2_EVIDENCE_EXPORT !== '1') return;
  const output = path.resolve(process.cwd(), '../docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-2-gambler-fate-weaver/phase-2a/complete-manifest.json');
  fs.writeFileSync(output, JSON.stringify({
    manifest: GAMBLER_MANIFEST, authoredRecords: GAMBLER_AUTHORED_RECORDS,
    projectedSpells: GAMBLER_DATA.spells, talentTrees: GAMBLER_TREES,
    progression: GAMBLER_DATA.progression, nativeProvenance: CLASS_PROVENANCE.Gambler,
    acquisitionRecords: GAMBLER_DATA.restrictions.acquisition.records,
    nativeVariants: GAMBLER_DATA.subraceVariants,
    capabilityStatus: { authored: true, selectableDevelopment: true, manuallyUsable: true, automaticallyAdmitted: false, independentReview: 'pending' },
    nativeAccess: getClassNativeHeritageIds('Gambler'), gambitDispositions: GAMBIT_RECORD_DISPOSITIONS
  }, null, 2));
});
