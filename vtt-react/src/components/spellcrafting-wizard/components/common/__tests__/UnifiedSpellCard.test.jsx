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

    expect(screen.getAllByText(/A massive ball of fire explodes/)[0]).toBeInTheDocument();
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

  it('renders reaction and trigger tag above header', () => {
    const reactionSpell = {
      id: 'reaction-spell-1',
      name: 'Counter-Strike',
      spellType: 'REACTION',
      actionType: 'reaction',
      reactionTrigger: 'When an enemy makes a melee attack within 5 feet',
      description: 'As a reaction when an enemy makes a melee attack within 5 feet, parry and strike back.'
    };

    render(
      <UnifiedSpellCard
        spell={reactionSpell}
        variant="wizard"
      />
    );

    expect(screen.getByText(/When an enemy makes a melee attack within 5 feet/)).toBeInTheDocument();
    expect(screen.getAllByText('REACTION')[0]).toBeInTheDocument();
  });

  it('renders class resource generation badge for builder spells', () => {
    const crusaderSpell = {
      id: 'crusader-strike',
      name: 'Shield Strike',
      spellType: 'ACTION',
      description: 'Strike target and generate Fervor.',
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ['mana'],
        resourceValues: { mana: 4 },
        classResource: { type: 'fervor', gain: 10 }
      }
    };

    render(
      <UnifiedSpellCard
        spell={crusaderSpell}
        variant="wizard"
      />
    );

    expect(screen.getByText('+10')).toBeInTheDocument();
    expect(screen.getByText('Fervor')).toBeInTheDocument();
  });

  it('renders class resource spender badge for spender spells', () => {
    const prophetSpell = {
      id: 'prophet-whisper',
      name: 'Unraveling Whisper',
      spellType: 'ACTION',
      description: 'Spend Madness to deal psychic agony.',
      resourceCost: {
        actionPoints: 1,
        mana: 3,
        classResource: { type: 'madness', cost: 4 }
      }
    };

    render(
      <UnifiedSpellCard
        spell={prophetSpell}
        variant="wizard"
      />
    );

    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Madness')).toBeInTheDocument();
  });

  it('renders Gambit Fortune generation badge from specialMechanics', () => {
    const gambitSpell = {
      id: 'gambit-coin',
      name: "Gambler's Favor",
      spellType: 'ACTION',
      description: 'Flick a coin of probability.',
      resourceCost: {
        actionPoints: 1,
        mana: 2
      },
      specialMechanics: {
        fortunePoints: { generates: 2 }
      }
    };

    render(
      <UnifiedSpellCard
        spell={gambitSpell}
        variant="wizard"
      />
    );

    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.getByText('Fortune')).toBeInTheDocument();
  });

  it('renders cadence note costs as consume badges (not coin fallback)', () => {
    const cadenceSpell = {
      id: 'circle_of_fifths',
      name: 'Circle of Fifths',
      spellType: 'ACTION',
      description: 'Deal storm damage.',
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ['mana', 'actionPoints', 'note_v', 'note_i', 'note_vi'],
        resourceValues: { mana: 16, actionPoints: 1, note_v: -2, note_i: -1, note_vi: -1 }
      }
    };

    const { container } = render(
      <UnifiedSpellCard
        spell={cadenceSpell}
        variant="wizard"
      />
    );

    expect(screen.getByText('-2 Dominant (V)')).toBeInTheDocument();
    expect(screen.getByText('-1 Tonic (I)')).toBeInTheDocument();
    expect(screen.getByText('-1 Submediant (VI)')).toBeInTheDocument();
    // Bass clefs for consumes (treble would mean generates)
    const clefs = container.querySelectorAll('.pf-musical-clef-icon');
    expect(clefs.length).toBe(3);
    clefs.forEach((c) => expect(c.textContent).toBe('𝄢'));
  });

  it('formats **bold** and _italic_ in descriptions, leaving snake_case literal', () => {
    const mdSpell = {
      id: 'md-spell',
      name: 'Markdown Test',
      spellType: 'ACTION',
      description: 'Hit hard.\n\n_"Flavor with spaces."_\n\n**Tactical Use:** early, and note_v stays literal.'
    };

    const { container } = render(
      <UnifiedSpellCard
        spell={mdSpell}
        variant="wizard"
        showDescription={true}
      />
    );

    const desc = container.querySelector('.item-description');
    expect(desc).toBeTruthy();
    expect(desc.querySelector('strong').textContent).toBe('Tactical Use:');
    expect(desc.querySelector('em').textContent).toBe('"Flavor with spaces."');
    expect(desc.textContent).toContain('note_v');
    expect(desc.textContent).not.toContain('**');
  });

  it('renders the Duration row inside a pill container', () => {
    const durSpell = {
      id: 'dur-spell',
      name: 'Lingering Storm',
      spellType: 'ACTION',
      description: 'A storm that lingers.',
      effectTypes: ['damage'],
      durationConfig: { durationType: 'rounds', durationValue: 2, durationUnit: 'rounds' },
      damageConfig: { formula: '3d6', damageTypes: ['storm'], resolution: 'DICE' }
    };

    const { container } = render(
      <UnifiedSpellCard
        spell={durSpell}
        variant="wizard"
        showDescription={true}
        showStats={true}
      />
    );

    const pill = container.querySelector('.unified-spell-stat.duration-stat');
    expect(pill).toBeTruthy();
    expect(pill.textContent).toContain('Duration:');
    expect(pill.textContent).toContain('2 rounds');
  });
});

