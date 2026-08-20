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
});
