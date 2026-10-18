// Polyfill global fetch if needed
if (!global.fetch) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([])
    })
  );
}

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClassDetailDisplay from '../ClassDetailDisplay';

// Mock dependencies that aren't under test
jest.mock('../../../utils/assetManager', () => ({
  getIconUrl: jest.fn(() => 'test-icon.png'),
  getCustomIconUrl: jest.fn(() => 'fallback-icon.png')
}));

jest.mock('../../spellcrafting-wizard/components/common/UnifiedSpellCard', () => {
  return function MockUnifiedSpellCard({ spell }) {
    return (
      <div data-testid="unified-spell-card">
        <h4>{spell.name}</h4>
        <p>{spell.description}</p>
      </div>
    );
  };
});

jest.mock('../../../hooks/useGameData', () => ({
  __esModule: true,
  default: () => ({ data: [], isLoading: false, error: null }),
  getLoadedData: jest.fn(() => null)
}));

describe('ClassDetailDisplay Spells Spellbook Layout', () => {
  const sampleClassData = {
    id: 'berserker',
    name: 'Berserker',
    icon: 'fas fa-skull',
    role: 'Damage',
    spells: [
      {
        id: 'bsk_hunger_scent',
        name: 'Hunger Scent',
        description: 'Channel ancestral starvation to catch the scent of blood up to 3 miles away.',
        level: 1,
        spellType: 'ACTION',
        typeConfig: { school: 'primal' },
        targetingConfig: { targetingType: 'self', rangeType: 'self' },
        resourceCost: { actionPoints: 1, resourceValues: { health: 2 } }
      },
      {
        id: 'bsk_retaliatory_cleave',
        name: 'Retaliatory Cleave',
        description: 'When hit in melee by an enemy, instantly retaliate with a vicious counter-cleave.',
        level: 2,
        spellType: 'REACTION',
        typeConfig: { school: 'smashing' },
        targetingConfig: { targetingType: 'single', rangeType: 'melee', rangeDistance: 5 },
        resourceCost: { actionPoints: 0, resourceValues: { health: 3 } }
      }
    ]
  };

  it('renders spells in a spellbook layout with capitalized types and action badges', () => {
    render(<ClassDetailDisplay classData={sampleClassData} onBack={jest.fn()} />);

    // Switch to Spells tab
    const spellsTabButton = screen.getByRole('button', { name: /spells/i });
    fireEvent.click(spellsTabButton);

    // Verify Roman numeral level headers
    expect(screen.getByRole('heading', { name: /Level I$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Level II$/i })).toBeInTheDocument();

    // Verify spell names
    expect(screen.getByText('Hunger Scent')).toBeInTheDocument();
    expect(screen.getByText('Retaliatory Cleave')).toBeInTheDocument();

    // Verify action badges
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Reaction')).toBeInTheDocument();

    // Verify proper capitalization of schools (NO raw lowercase!)
    expect(screen.getByText('Primal')).toBeInTheDocument();
    expect(screen.getByText('Smashing')).toBeInTheDocument();

    // Verify range formatting
    expect(screen.getByText('Self')).toBeInTheDocument();
    expect(screen.getByText('5 ft Melee')).toBeInTheDocument();

    // Verify description snippets
    expect(screen.getByText(/Channel ancestral starvation/i)).toBeInTheDocument();
    expect(screen.getByText(/When hit in melee by an enemy/i)).toBeInTheDocument();

    // Clicking a spell opens the spellcard modal
    const hungerScentBtn = screen.getByRole('button', { name: /Inspect Hunger Scent/i });
    fireEvent.click(hungerScentBtn);

    expect(screen.getByTestId('unified-spell-card')).toBeInTheDocument();
    expect(screen.getByText('Available at Level 1')).toBeInTheDocument();
  });
});
