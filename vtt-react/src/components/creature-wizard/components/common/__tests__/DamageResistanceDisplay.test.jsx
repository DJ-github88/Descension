import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DamageResistanceDisplay from '../DamageResistanceDisplay';

describe('DamageResistanceDisplay legacy-key normalization', () => {
  test('renders Rime for a legacy "cold" resistance key', () => {
    const { container } = render(<DamageResistanceDisplay resistances={{ cold: 50 }} />);
    expect(container.querySelector('.damage-resistance-display')).not.toBeNull();
    expect(screen.getByText('Rime')).toBeInTheDocument();
    // Raw legacy label must not leak through
    expect(screen.queryByText('Cold')).not.toBeInTheDocument();
  });

  test('renders canonical keys and merges legacy collisions', () => {
    render(<DamageResistanceDisplay resistances={{ rime: 50, fire: 100, ember: 100 }} />);
    expect(screen.getByText('Rime')).toBeInTheDocument();
    expect(screen.getByText('Ember')).toBeInTheDocument();
    // fire->ember merged with existing ember (no duplicate chips)
    expect(screen.getAllByText('Ember')).toHaveLength(1);
  });

  test('returns null when nothing matches (unknown junk keys)', () => {
    const { container } = render(<DamageResistanceDisplay resistances={{ glitter: 50 }} />);
    expect(container.querySelector('.damage-resistance-display')).toBeNull();
  });

  test('handles numeric legacy percentage and string levels', () => {
    render(<DamageResistanceDisplay resistances={{ psychic: 100 }} vulnerabilities={{ necrotic: 50 }} />);
    // psychic->wyrd immune, necrotic->blight exposed
    expect(screen.getByText('Wyrd')).toBeInTheDocument();
    expect(screen.getByText('Blight')).toBeInTheDocument();
  });
});
