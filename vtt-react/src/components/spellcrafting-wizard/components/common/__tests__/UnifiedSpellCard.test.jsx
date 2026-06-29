import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UnifiedSpellCard from '../UnifiedSpellCard';

// Mock Zustand stores and contexts to isolate the component
jest.mock('../../../../../store/characterStore', () => ({
  __esModule: true,
  default: (selector) => selector({
    currentCharacter: {
      stats: { intelligence: 18 }
    }
  })
}));

jest.mock('../../../context/SpellLibraryContext', () => ({
  useSpellLibrary: () => ({
    getSpellById: () => null
  })
}));

jest.mock('../../../../../utils/assetManager', () => ({
  getAbilityIconUrl: (icon) => `http://mock-icons/${icon}.png`,
  getCustomIconUrl: (icon) => `http://mock-icons/${icon}.png`
}));

// Mock the React.lazy loaded tooltip to avoid async/lazy chunk resolution issues in tests
jest.mock('../SpellTooltip', () => {
  return function MockTooltip() {
    return <div data-testid="mock-tooltip">Tooltip</div>;
  };
});

const mockSpell = {
  id: 'test-spell-1',
  name: 'Furious Fireball',
  level: 3,
  school: 'Evocation',
  castingTime: '1 Action',
  range: '120 feet',
  components: 'V, S, M',
  duration: 'Instantaneous',
  description: 'A massive ball of fire explodes dealing damage to all targets in a 20ft radius.',
  tags: ['Fire', 'Evocation', 'Ranged'],
  stats: {
    damageFormula: '8d6',
    damageType: 'Fire'
  }
};

describe('UnifiedSpellCard Component', () => {
  it('renders spell title', () => {
    render(
      <UnifiedSpellCard
        spell={mockSpell}
        variant="wizard"
        showDescription={true}
        showStats={true}
        showTags={true}
      />
    );

    expect(screen.getByText('Furious Fireball')).toBeInTheDocument();
  });

  it('renders spell description when showDescription is true', () => {
    render(
      <UnifiedSpellCard
        spell={mockSpell}
        variant="wizard"
        showDescription={true}
      />
    );

    expect(screen.getByText(/A massive ball of fire explodes/)).toBeInTheDocument();
  });

  it('renders school and elemental tag chips when showTags is true', () => {
    render(
      <UnifiedSpellCard
        spell={mockSpell}
        variant="wizard"
        showTags={true}
      />
    );

    expect(screen.getByText('Fire')).toBeInTheDocument();
    expect(screen.getByText('Evocation')).toBeInTheDocument();
    expect(screen.getByText('Ranged')).toBeInTheDocument();
  });
});
