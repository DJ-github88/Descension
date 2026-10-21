import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UnifiedSpellCard from '../UnifiedSpellCard';

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

jest.mock('../SpellTooltip', () => {
  return function MockTooltip() {
    return <div data-testid="mock-tooltip">Tooltip</div>;
  };
});

describe('SpellComponentPill and Popover', () => {
  const spellWithComponents = {
    id: 'test-components-spell',
    name: 'Plasma Arc',
    variant: 'wizard',
    school: 'Evocation',
    castingTime: '1 Action',
    resourceCost: {
      components: ['verbal', 'somatic', 'concentration'],
      verbalText: 'Ignis Fulmen',
      somaticText: 'Spin plasma filaments between your fingers and hurl them outward',
      concentrationText: 'Maintain focus on the electric tether'
    },
    description: 'Launches crackling electricity at the target.'
  };

  test('renders V, S, and C pills for the spell', () => {
    const { container } = render(
      <UnifiedSpellCard spell={spellWithComponents} variant="wizard" />
    );

    const verbalPill = container.querySelector('.spell-component-pill--verbal');
    const somaticPill = container.querySelector('.spell-component-pill--somatic');
    const concentrationPill = container.querySelector('.spell-component-pill--concentration');

    expect(verbalPill).toBeInTheDocument();
    expect(verbalPill).toHaveTextContent('V');

    expect(somaticPill).toBeInTheDocument();
    expect(somaticPill).toHaveTextContent('S');

    expect(concentrationPill).toBeInTheDocument();
    expect(concentrationPill).toHaveTextContent('C');
  });

  test('clicking somatic pill reveals popover with formatted quote and arrow', () => {
    const { container } = render(
      <UnifiedSpellCard spell={spellWithComponents} variant="wizard" />
    );

    const somaticPill = container.querySelector('.spell-component-pill--somatic');
    expect(somaticPill).toBeInTheDocument();

    // Click to open popover
    fireEvent.click(somaticPill);

    const popover = container.querySelector('.pf-component-popover--somatic');
    expect(popover).toBeInTheDocument();

    // Arrow is present
    const arrow = popover.querySelector('.pf-component-popover-arrow');
    expect(arrow).toBeInTheDocument();

    // Header has component name
    expect(popover.querySelector('.pf-component-popover-header')).toHaveTextContent('Somatic Component');

    // Body has formatted quote text
    const body = popover.querySelector('.pf-component-popover-body');
    expect(body).toBeInTheDocument();
    expect(body).toHaveTextContent('“Spin plasma filaments between your fingers and hurl them outward”');
  });

  test('toggles closed when clicked again', () => {
    const { container } = render(
      <UnifiedSpellCard spell={spellWithComponents} variant="wizard" />
    );

    const verbalPill = container.querySelector('.spell-component-pill--verbal');

    // Open
    fireEvent.click(verbalPill);
    expect(container.querySelector('.pf-component-popover--verbal')).toBeInTheDocument();

    // Close
    fireEvent.click(verbalPill);
    expect(container.querySelector('.pf-component-popover--verbal')).not.toBeInTheDocument();
  });

  test('clamps popover within card bounds when pill is near card edge', () => {
    const { container } = render(
      <UnifiedSpellCard spell={spellWithComponents} variant="wizard" />
    );

    const card = container.querySelector('.pf-spell-card');
    const somaticPill = container.querySelector('.spell-component-pill--somatic');

    // Mock bounding rects simulating pill near the right edge of a 500px card
    card.getBoundingClientRect = () => ({
      left: 100,
      right: 600,
      top: 50,
      bottom: 450,
      width: 500,
      height: 400
    });

    somaticPill.parentElement.getBoundingClientRect = () => ({
      left: 560,
      right: 576,
      top: 60,
      bottom: 76,
      width: 16,
      height: 16
    });

    somaticPill.getBoundingClientRect = () => ({
      left: 560,
      right: 576,
      top: 60,
      bottom: 76,
      width: 16,
      height: 16
    });

    // Click to open
    fireEvent.click(somaticPill);

    const popover = container.querySelector('.pf-component-popover--somatic');
    expect(popover).toBeInTheDocument();

    // Verify popover style left has been computed and set
    expect(popover.style.left).toBeDefined();
    // The relative left will be negative (shifting left relative to wrapper) to stay inside card
    const numericLeft = parseFloat(popover.style.left);
    expect(numericLeft).toBeLessThanOrEqual(0);
  });
});
