import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatVial from '../StatVial';

describe('StatVial', () => {
    it('swaps the bottle image by fill state', () => {
        const { container, rerender } = render(<StatVial kind="health" current={50} max={50} memberName="Mira" />);
        expect(container.querySelector('.party-vial-icon').getAttribute('src')).toContain('hp-icon-max');

        rerender(<StatVial kind="health" current={30} max={50} memberName="Mira" />);
        expect(container.querySelector('.party-vial-icon').getAttribute('src')).toContain('hp-icon-high');

        rerender(<StatVial kind="health" current={10} max={50} memberName="Mira" />);
        expect(container.querySelector('.party-vial-icon').getAttribute('src')).toContain('hp-icon-low');

        rerender(<StatVial kind="health" current={0} max={50} memberName="Mira" />);
        expect(container.querySelector('.party-vial-icon').getAttribute('src')).toContain('hp-icon-empty');
    });

    it('swaps the crystal image for mana and exposes tilt', () => {
        const { container } = render(<StatVial kind="mana" current={33} max={60} memberName="Mira" tilt={12} />);
        expect(container.querySelector('.party-vial-icon').getAttribute('src')).toContain('mana-icon-high');
        expect(container.querySelector('.party-vial').style.getPropertyValue('--vial-tilt')).toBe('12deg');
    });

    it('uses boot images for AP with an exact aria label and no painted numbers', () => {
        const { container } = render(<StatVial kind="ap" current={3} max={3} memberName="Mira" />);
        expect(container.querySelector('.party-vial-icon').getAttribute('src')).toContain('ap-icon-max');
        expect(container.querySelector('.party-vial')).toHaveAttribute('aria-label', 'Mira Action Points: 3 of 3');
        expect(container.querySelector('.party-vial-plaque')).toBeNull();
    });

    it('pops a big-number readout on hover instead of a tooltip', () => {
        const { container } = render(<StatVial kind="health" current={45} max={50} temp={5} memberName="Mira" />);
        expect(container.querySelector('.party-vial-readout')).toBeNull();
        fireEvent.mouseEnter(screen.getByLabelText('Mira Health: 45 of 50'));
        const readout = container.querySelector('.party-vial-readout');
        expect(readout).toBeInTheDocument();
        expect(readout.querySelector('.readout-current')).toHaveTextContent('45');
        expect(readout.querySelector('.readout-max')).toHaveTextContent('/50');
        expect(readout.querySelector('.readout-temp')).toHaveTextContent('+5');
    });

    it('applies surplus classes when temporary resources exist (temp > 0)', () => {
        const { container: healthContainer } = render(
            <StatVial kind="health" current={50} max={50} temp={10} memberName="Mira" />
        );
        expect(healthContainer.querySelector('.party-vial')).toHaveClass('vial-surplus', 'vial-surplus-health');

        const { container: manaContainer } = render(
            <StatVial kind="mana" current={40} max={40} temp={5} memberName="Mira" />
        );
        expect(manaContainer.querySelector('.party-vial')).toHaveClass('vial-surplus', 'vial-surplus-mana');

        const { container: apContainer } = render(
            <StatVial kind="ap" current={3} max={3} temp={2} memberName="Mira" />
        );
        expect(apContainer.querySelector('.party-vial')).toHaveClass('vial-surplus', 'vial-surplus-ap');
    });

    it('does not apply surplus classes when temp is 0 or not provided', () => {
        const { container } = render(
            <StatVial kind="ap" current={3} max={3} memberName="Mira" />
        );
        expect(container.querySelector('.party-vial')).not.toHaveClass('vial-surplus');
    });
});
