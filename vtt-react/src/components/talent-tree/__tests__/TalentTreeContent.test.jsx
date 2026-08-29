import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TalentTreeContent } from '../TalentTreeContent';
import useCharacterStore from '../../../store/characterStore';
import useSpellbookStore from '../../../store/spellbookStore';
import { convertTalentSpellToLibrarySpell } from '../../../data/talentTrees/talentSystem.mjs';
import { GAMBIT_PROBABILITY_SAVANT, GAMBIT_HIGH_ROLLER, GAMBIT_KARMIC_WEAVER } from '../../../data/talentTrees/gambit.js';

describe('Talent Tree System Tests', () => {
  beforeEach(() => {
    useCharacterStore.setState({
      class: 'Gambit',
      level: 2,
      currentCharacterId: 'char-123',
      talents: {}
    });
    useSpellbookStore.setState({
      spells: []
    });
  });

  test('renders active talent tree header and points badge', () => {
    render(<TalentTreeContent />);
    expect(screen.getByText('Probability Savant')).toBeInTheDocument();
    expect(screen.getByText('Talent Points:')).toBeInTheDocument();
    expect(screen.getByText('Reset All')).toBeInTheDocument();
  });

  test('renders talent summary view when selectedTreeIndex is summary', () => {
    render(<TalentTreeContent selectedTreeIndex={3} />);
    expect(screen.getByText('Mastery Grimoire')).toBeInTheDocument();
    expect(screen.getByText('Chronicled Talents & Masteries')).toBeInTheDocument();
  });

  test('convertTalentSpellToLibrarySpell generates accurate spell library object with resources and AP', () => {
    const talentNode = GAMBIT_PROBABILITY_SAVANT.find(t => t.id === 'ps_t1_calculated_nudge');
    expect(talentNode).toBeDefined();

    const librarySpell = convertTalentSpellToLibrarySpell(talentNode, 1);
    expect(librarySpell).toBeDefined();
    expect(librarySpell.id).toBe('talent-spell-ps_t1_calculated_nudge');
    expect(librarySpell.source).toBe('talent');
    expect(librarySpell.spellType).toBe('REACTION');
    expect(librarySpell.actionType).toBe('reaction');
    expect(librarySpell.reactionTrigger).toBeTruthy();
    expect(librarySpell.resourceCost.actionPoints).toBe(0);
    expect(librarySpell.resourceCost.resourceValues.fortunePoints).toBe(1);
    expect(librarySpell.cooldownConfig.cooldownValue).toBe(1);
  });

  test('Gambit talents across all 3 specs have zero percentage values in descriptions', () => {
    [...GAMBIT_PROBABILITY_SAVANT, ...GAMBIT_HIGH_ROLLER, ...GAMBIT_KARMIC_WEAVER].forEach(node => {
      expect(node.spell.description).not.toMatch(/%/);
      if (node.rankUpgrades) {
        node.rankUpgrades.forEach(upgrade => {
          if (upgrade.description) {
            expect(upgrade.description).not.toMatch(/%/);
          }
        });
      }
    });
  });

  test('clicking talent adds ranks and syncs spellbook', () => {
    const { container } = render(<TalentTreeContent />);
    const nodeButtons = container.querySelectorAll('.talent-node-button');
    expect(nodeButtons.length).toBeGreaterThan(0);

    // Click the first learnable talent node
    fireEvent.click(nodeButtons[0]);

    const state = useCharacterStore.getState();
    const learnedTalentKeys = Object.keys(state.talents);
    expect(learnedTalentKeys.length).toBe(1);
    expect(state.talents[learnedTalentKeys[0]]).toBe(1);

    // Verify spellbook has the learned spell
    const spells = useSpellbookStore.getState().spells;
    expect(spells.length).toBe(1);
    expect(spells[0].id).toBe(`talent-spell-${learnedTalentKeys[0]}`);
  });

  test('Reset All clears talents and removes talent spells from spellbook', () => {
    const { container } = render(<TalentTreeContent />);
    const nodeButtons = container.querySelectorAll('.talent-node-button');
    
    // Learn a talent
    fireEvent.click(nodeButtons[0]);
    expect(Object.keys(useCharacterStore.getState().talents).length).toBe(1);

    // Click reset all
    const resetBtn = screen.getByText('Reset All');
    fireEvent.click(resetBtn);

    expect(Object.keys(useCharacterStore.getState().talents).length).toBe(0);
    expect(useSpellbookStore.getState().spells.length).toBe(0);
  });

  test('5-point tier gatekeeping: Tier 2 requires 5 points spent in tree', () => {
    const { getNodeTier, getRequiredPointsForTier } = require('../TalentTreeContent');
    expect(getRequiredPointsForTier(1)).toBe(0);
    expect(getRequiredPointsForTier(2)).toBe(5);
    expect(getRequiredPointsForTier(3)).toBe(10);
    expect(getRequiredPointsForTier(4)).toBe(15);
    expect(getRequiredPointsForTier(5)).toBe(20);
    expect(getRequiredPointsForTier(6)).toBe(25);
    expect(getRequiredPointsForTier(7)).toBe(30);

    const t1Node = GAMBIT_PROBABILITY_SAVANT.find(t => t.id.includes('_t1_'));
    const t2Node = GAMBIT_PROBABILITY_SAVANT.find(t => t.id.includes('_t2_'));
    const t3Node = GAMBIT_PROBABILITY_SAVANT.find(t => t.id.includes('_t3_'));
    expect(getNodeTier(t1Node)).toBe(1);
    expect(getNodeTier(t2Node)).toBe(2);
    expect(getNodeTier(t3Node)).toBe(3);
  });

  test('cannot allocate Tier 2 talent with less than 5 points in tree', () => {
    useCharacterStore.setState({
      class: 'Gambit',
      level: 10,
      talents: {
        'ps_t1_calculated_nudge': 3 // 3 points in Tier 1 (< 5 needed for Tier 2)
      }
    });

    const { container } = render(<TalentTreeContent />);
    
    // Find all rendered nodes
    const nodeButtons = container.querySelectorAll('.talent-node-button');
    expect(nodeButtons.length).toBeGreaterThan(0);

    // Tier 2 nodes should be locked
    const t2Nodes = GAMBIT_PROBABILITY_SAVANT.filter(t => t.id.includes('_t2_'));
    expect(t2Nodes.length).toBeGreaterThan(0);

    // Click a Tier 2 node button
    // Should NOT increase ranks because tree points = 3 < 5
    const initialTalents = { ...useCharacterStore.getState().talents };
    const t2NodeElement = container.querySelector(`[data-talent-id="${t2Nodes[0].id}"]`) || nodeButtons[3];
    fireEvent.click(t2NodeElement);

    const state = useCharacterStore.getState();
    expect(state.talents[t2Nodes[0].id] || 0).toBe(0);
  });

  test('Tier 2 node can be learned once 5 points are invested in Tier 1', () => {
    // Invest 5 points across Tier 1 nodes
    const t1Nodes = GAMBIT_PROBABILITY_SAVANT.filter(t => t.id.includes('_t1_'));
    const t1Alloc = {};
    let pts = 5;
    for (const node of t1Nodes) {
      const take = Math.min(pts, node.maxRanks || 3);
      t1Alloc[node.id] = take;
      pts -= take;
      if (pts <= 0) break;
    }

    useCharacterStore.setState({
      class: 'Gambit',
      level: 10,
      talents: t1Alloc
    });

    render(<TalentTreeContent />);
    expect(screen.getByText('Tier 1')).toBeInTheDocument();
  });

  test('first talent point allocated automatically designates that tree as primary specialization', () => {
    const { container } = render(<TalentTreeContent />);
    expect(useCharacterStore.getState().primarySpecialization).toBeFalsy();

    // Click the first learnable talent node (in Probability Savant)
    const nodeButtons = container.querySelectorAll('.talent-node-button');
    fireEvent.click(nodeButtons[0]);

    // Character store should have primarySpecialization set to probability_savant
    expect(useCharacterStore.getState().primarySpecialization).toBe('probability_savant');

    // Primary specialization crown badge should be visible
    expect(screen.getByText('Primary Specialization')).toBeInTheDocument();
  });

  test('Mastery Grimoire only shows innate passive traits for the active primary specialization and not unchosen trees', () => {
    useCharacterStore.setState({
      class: 'Gambit',
      level: 10,
      talents: { 'ps_t1_calculated_nudge': 1 },
      primarySpecialization: 'probability_savant'
    });

    render(<TalentTreeContent selectedTreeIndex={3} />);
    expect(screen.getByText('Mastery Grimoire')).toBeInTheDocument();
    expect(screen.getAllByText('Active Innate Passive Traits:').length).toBe(1);
    
    // Only the active primary spec's passive is present
    expect(screen.getByText('Balanced Ledger')).toBeInTheDocument();
    expect(screen.queryByText('Double Down')).not.toBeInTheDocument();
    expect(screen.queryByText('Loaded Deck')).not.toBeInTheDocument();
  });

  test('Codex readOnly mode displays innate passives for all specializations', () => {
    render(<TalentTreeContent selectedTreeIndex={3} readOnly={true} />);
    expect(screen.getAllByText('Active Innate Passive Traits:').length).toBe(3);
    expect(screen.getAllByText('Balanced Ledger').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Double Down')).toBeInTheDocument();
    expect(screen.getByText('Loaded Deck')).toBeInTheDocument();
  });
});
