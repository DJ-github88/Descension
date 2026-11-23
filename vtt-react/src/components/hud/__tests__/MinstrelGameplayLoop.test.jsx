import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MINSTREL_DATA } from '../../../data/classes/minstrelData';
import ExecutionCompatibility from '../../spellcrafting-wizard/components/common/ExecutionCompatibility';
import { explainExecution, STATES } from '../../spellcrafting-wizard/utils/executionCompatibility';
import SpellBehaviorFlow from '../../spellcrafting-wizard/components/common/SpellBehaviorFlow';
import { extractSpellResourceCosts } from '../../spellcrafting-wizard/components/common/spellFormatterUtils';
import useResourceFormatters from '../../spellcrafting-wizard/components/common/useResourceFormatters';
import ClassResourceBar from '../ClassResourceBar';
import SpellConsequencePanel from '../SpellConsequencePanel';
import { supportSpell } from '../../../services/spellConsequence';
import { useSpellConsequenceStore } from '../../../services/spellConsequenceService';
import useGameStore from '../../../store/gameStore';
import useCharacterStore from '../../../store/characterStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCreatureStore from '../../../store/creatureStore';

jest.mock('../../../store/gameStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({
    isInMultiplayer: true,
    isGMMode: true,
    multiplayerRoom: { id: 'room-minstrel' }
  }))
}));

jest.mock('../../../store/characterStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({
    id: 'wren',
    currentCharacterId: 'wren',
    name: 'Wren',
    class: 'Minstrel',
    stats: { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 14, charisma: 12 },
    class_spells: { known_spells: ['minstrel_opening_chord', 'minstrel_resolving_strike'] },
    classResource: { type: 'musicalNotes', notes: [0, 0, 0, 0, 0, 0, 0], current: 0, max: 35 }
  }))
}));

jest.mock('../../../store/characterTokenStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({ characterTokens: [] }))
}));

jest.mock('../../../store/creatureStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({
    creatureTokens: [{
      id: 'foe',
      mapId: 'm',
      name: 'Grimmstalk',
      state: { currentHp: 40, tempHealth: 0, actorContract: { kind: 'creature', roomId: 'room-minstrel', mapId: 'm', tokenId: 'foe', instanceId: 'i-foe' } }
    }]
  }))
}));

jest.mock('../../../services/spellConsequenceService', () => ({
  useSpellConsequenceStore: require('zustand').create(() => ({ owner: null, ownerStatus: null, gmPending: {}, gmStatus: {} })),
  refreshSpellApprovals: jest.fn(),
  gmConditionResolution: () => null,
  ownerSource: () => ({
    id: 'pc',
    mapId: 'm',
    character: { name: 'Wren', actionPoints: { current: 4 }, tempActionPoints: 0, mana: { current: 20 }, tempMana: 0 },
    state: { actorContract: { kind: 'character', roomId: 'room-minstrel', mapId: 'm', tokenId: 'pc', instanceId: 'i-pc', ownerUid: 'owner', characterId: 'wren', primary: true } }
  }),
  spellDraftContext: () => ({}),
  loadSpellDraft: () => null,
  loadDiscardedSpellDrafts: () => [],
  saveSpellDraft: jest.fn(),
  discardSpellDraft: jest.fn(),
  closeOwnerPanel: jest.fn(),
  sendSpellApproval: jest.fn(),
  checkSpellApproval: jest.fn(),
  withdrawSpellApproval: jest.fn(),
  reapproveSpell: jest.fn(),
  restoreOwnerStatus: jest.fn(),
  gmAcceptSpell: jest.fn(),
  gmDeclineSpell: jest.fn(),
  gmCheckSpellCommand: jest.fn(),
  markSpellReconciled: jest.fn(),
  retainedTargetResponses: () => [],
  creatureAttempt: () => null
}));

const openingChord = MINSTREL_DATA.spells.find(s => s.id === 'minstrel_opening_chord');
const resolvingStrike = MINSTREL_DATA.spells.find(s => s.id === 'minstrel_resolving_strike');

const ResourceBadges = ({ spell }) => <>{useResourceFormatters({ spell }).formatResourceCosts()}</>;

describe('Minstrel bounded gameplay loop across Wizard, Saved Card, Combat, and HUD', () => {
  beforeEach(() => {
    useGameStore.setState({ isInMultiplayer: true, isGMMode: true, multiplayerRoom: { id: 'room-minstrel' } });
    useCharacterStore.setState({
      id: 'wren',
      currentCharacterId: 'wren',
      name: 'Wren',
      class: 'Minstrel',
      stats: { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 14, charisma: 12 },
      class_spells: { known_spells: ['minstrel_opening_chord', 'minstrel_resolving_strike'] },
      classResource: { type: 'musicalNotes', notes: [0, 0, 0, 0, 0, 0, 0], current: 0, max: 35 }
    });
    useSpellConsequenceStore.setState({ owner: null, ownerStatus: null, gmPending: {}, gmStatus: {} });
  });

  test('Wizard, Saved Card, and Header agree on Opening Chord and Resolving Strike terms; edited/arbitrary Wizard payments stay manual', () => {
    const ctx = { roomId: 'room-minstrel', classId: 'minstrel', shared: true, gm: true };

    // Opening Chord: Wizard + Saved Card + Header
    const openCompat = explainExecution(openingChord, ctx);
    expect(openCompat.state).toBe(STATES.EXECUTABLE);
    expect(openCompat.automated.join(' ')).toMatch(/\+3 Musical Notes \(I×2, V×1\)/);
    expect(extractSpellResourceCosts(openingChord)).toEqual(['4 Mana', '+3 Musical Notes (I×2, V×1)']);

    const { container: openHeader } = render(<ResourceBadges spell={openingChord} />);
    expect(openHeader.textContent).toContain('+2 Tonic (I)');
    expect(openHeader.textContent).toContain('+Dominant (V)');
    expect(openHeader.textContent).not.toContain('+3 Musical Notes');

    const { container: openFlow } = render(<SpellBehaviorFlow record={openingChord} context={ctx} compact />);
    expect(openFlow.textContent).toContain('Prism-supported');
    expect(openFlow.textContent).toContain('1 AP, 4 mana, +3 Musical Notes (I×2, V×1)');
    expect(openFlow.textContent).toContain('Deal 1d6 storm damage');

    // Resolving Strike: Wizard + Saved Card + Header
    const resCompat = explainExecution(resolvingStrike, ctx);
    expect(resCompat.state).toBe(STATES.EXECUTABLE);
    expect(resCompat.automated.join(' ')).toMatch(/2 Musical Notes \(I×1, V×1\)/);
    expect(extractSpellResourceCosts(resolvingStrike)).toEqual(['4 Mana', '2 Musical Notes (I×1, V×1)']);

    const { container: resFlow } = render(<SpellBehaviorFlow record={resolvingStrike} context={ctx} compact />);
    expect(resFlow.textContent).toContain('Prism-supported');
    expect(resFlow.textContent).toContain('1 AP, 4 mana, 2 Musical Notes (I×1, V×1)');
    expect(resFlow.textContent).toContain('Deal 1d8 + spirit storm damage');

    // Boundary: modified recipe or arbitrary Wizard class payment stays UNSUPPORTED (manual)
    const editedResolving = {
      ...resolvingStrike,
      musicalCombo: { ...resolvingStrike.musicalCombo, requires: [{ note: 'I', count: 2 }] }
    };
    expect(explainExecution(editedResolving, ctx).state).toBe(STATES.UNSUPPORTED);
    const { container: wizCompat } = render(<ExecutionCompatibility record={editedResolving} context={ctx} />);
    expect(wizCompat.querySelector('[data-state]').dataset.state).toBe('unsupported');
  });

  test('Combat payment and HUD stave/cadence panel track empty -> Opening Chord -> Resolving Strike and refuse insufficient notes', () => {
    const emptyChar = useCharacterStore.getState();

    // 1. Empty bank: Resolving Strike is refused before any spend; HUD shows not ready
    const refusedPlan = supportSpell({ id: 'minstrel_resolving_strike' }, emptyChar);
    expect(refusedPlan.supported).toBe(true);
    expect(refusedPlan.payment.affordable).toBe(false);
    expect(refusedPlan.payment.reason).toMatch(/Requires Musical Notes \(I, V\)/);

    const { container: hudContainer, rerender } = render(
      <ClassResourceBar characterClass="Minstrel" classResource={emptyChar.classResource} context="party" isOwner />
    );
    fireEvent.click(hudContainer.querySelector('.minstrel-cadence-seal'));
    expect(screen.getByText('Opening Chord')).toBeInTheDocument();
    expect(screen.getByTitle(/Missing I, V/)).toBeDisabled();

    // 2. Opening Chord: builds I×2, V×1; Combat panel and HUD agree
    const openPlan = supportSpell({ id: 'minstrel_opening_chord' }, emptyChar);
    expect(openPlan.payment.affordable).toBe(true);
    expect(openPlan.payment.classPayment.price).toEqual({ costs: [], gains: ['I', 'I', 'V'] });
    expect(openPlan.payment.classPayment.after.notes).toEqual([2, 0, 0, 0, 1, 0, 0]);

    act(() => {
      useCharacterStore.setState({ classResource: { type: 'musicalNotes', notes: openPlan.payment.classPayment.after.notes, current: 3, max: 35 } });
    });
    rerender(<ClassResourceBar characterClass="Minstrel" classResource={useCharacterStore.getState().classResource} context="party" isOwner />);
    expect(screen.getByTitle('Resolve Resolving Strike')).toBeEnabled();

    // 3. Resolving Strike: Combat panel shows exact I, V cost and remaining I×1
    const resPlan = supportSpell({ id: 'minstrel_resolving_strike' }, useCharacterStore.getState());
    expect(resPlan.payment.affordable).toBe(true);
    expect(resPlan.payment.classPayment.price).toEqual({ costs: ['I', 'V'], gains: [] });
    expect(resPlan.payment.classPayment.after.notes).toEqual([1, 0, 0, 0, 0, 0, 0]);

    const resApproval = {
      roomId: 'room-minstrel',
      approvalId: 'res-loop-1',
      source: { kind: 'character', mapId: 'm', tokenId: 'pc', instanceId: 'i-pc' },
      target: { kind: 'creature', mapId: 'm', tokenId: 'foe', instanceId: 'i-foe' },
      spell: { definitionId: 'minstrel_resolving_strike', name: 'Resolving Strike', kind: 'damage', damageTypes: ['storm'] },
      roll: { mode: 'physical', dice: [{ sides: 8, faces: [5] }], constant: 14, total: 19, reading: '1d8 + spirit → 1d8 + 14 (SPI score)' },
      price: { ap: 1, mana: 4 },
      classPayment: {
        domain: 'musicalNotes',
        price: resPlan.payment.classPayment.price,
        beforePublic: { type: 'musicalNotes', current: 3, max: 35 },
        afterPublic: { type: 'musicalNotes', current: 1, max: 35 }
      }
    };
    useSpellConsequenceStore.setState({
      owner: { spellId: 'minstrel_resolving_strike', origin: {} },
      ownerStatus: null,
      gmPending: { 'res-loop-1': { approval: resApproval, contentHash: 'h' } },
      gmStatus: {}
    });
    render(<SpellConsequencePanel />);
    expect(screen.getAllByText(/2 Musical Notes spent \(I, V\); 0 gained \(none\)/)).toHaveLength(2);
    expect(screen.getByText(/I×2 II×0 III×0 IV×0 V×1 VI×0 VII×0 → I×1 II×0 III×0 IV×0 V×0 VI×0 VII×0/)).toBeInTheDocument();

    // After acceptance: HUD reflects [1, 0, 0, 0, 0, 0, 0] and Resolving Strike is no longer ready
    act(() => {
      useCharacterStore.setState({ classResource: { type: 'musicalNotes', notes: resPlan.payment.classPayment.after.notes, current: 1, max: 35 } });
    });
    rerender(<ClassResourceBar characterClass="Minstrel" classResource={useCharacterStore.getState().classResource} context="party" isOwner />);
    expect(screen.getByTitle(/Missing V/)).toBeDisabled();
  });
});
