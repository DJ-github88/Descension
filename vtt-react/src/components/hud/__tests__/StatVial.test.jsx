import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatVial from '../StatVial';
import { getResourcePhase } from '../ResourceGlyph';

const glyph = (container) => container.querySelector('svg.party-vial-icon');

describe('StatVial', () => {
    it('draws the health flask and moves through phases by fill', () => {
        const { container, rerender } = render(<StatVial kind="health" current={50} max={50} memberName="Mira" />);
        expect(glyph(container)).toHaveAttribute('data-kind', 'health');
        expect(glyph(container)).toHaveAttribute('data-phase', 'max');
        expect(container.querySelector('.party-vial')).toHaveClass('vial-state-max');

        rerender(<StatVial kind="health" current={30} max={50} memberName="Mira" />);
        expect(glyph(container)).toHaveAttribute('data-phase', 'high');

        rerender(<StatVial kind="health" current={20} max={50} memberName="Mira" />);
        expect(glyph(container)).toHaveAttribute('data-phase', 'low');

        rerender(<StatVial kind="health" current={5} max={50} memberName="Mira" />);
        expect(glyph(container)).toHaveAttribute('data-phase', 'critical');
        expect(container.querySelector('.party-vial')).toHaveClass('vial-state-low');

        rerender(<StatVial kind="health" current={0} max={50} memberName="Mira" />);
        expect(glyph(container)).toHaveAttribute('data-phase', 'empty');
        expect(container.querySelector('.party-vial')).toHaveClass('vial-state-empty');
        expect(container.querySelectorAll('.rg-shards').length).toBe(1);
    });

    it('draws the mana crystal and exposes tilt', () => {
        const { container } = render(<StatVial kind="mana" current={33} max={60} memberName="Mira" tilt={12} />);
        expect(glyph(container)).toHaveAttribute('data-kind', 'mana');
        expect(glyph(container)).toHaveAttribute('data-phase', 'high');
        expect(container.querySelector('.party-vial').style.getPropertyValue('--vial-tilt')).toBe('12deg');
    });

    it('draws the winged boot for AP with an exact aria label and no painted numbers', () => {
        const { container } = render(<StatVial kind="ap" current={3} max={3} memberName="Mira" />);
        expect(glyph(container)).toHaveAttribute('data-kind', 'ap');
        expect(glyph(container)).toHaveAttribute('data-phase', 'max');
        expect(container.querySelector('.party-vial')).toHaveAttribute('aria-label', 'Mira Action Points: 3 of 3');
        expect(container.querySelector('.party-vial-plaque')).toBeNull();
        expect(container.querySelector('img')).toBeNull();
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
        expect(glyph(healthContainer)).toHaveClass('rg-surplus');

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
        expect(glyph(container)).not.toHaveClass('rg-surplus');
    });

    it('gives each glyph unique clip ids so several frames can share a page', () => {
        const { container } = render(
            <>
                <StatVial kind="health" current={10} max={20} memberName="A" />
                <StatVial kind="health" current={10} max={20} memberName="B" />
            </>
        );
        const ids = [...container.querySelectorAll('clipPath')].map((c) => c.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('draws the exhaustion hourglass and evolves through stages 0 to 6', () => {
        const { container, rerender } = render(<StatVial kind="exhaustion" current={0} max={6} memberName="Mira" />);
        expect(glyph(container)).toHaveAttribute('data-kind', 'exhaustion');
        expect(glyph(container)).toHaveAttribute('data-stage', '0');
        expect(glyph(container)).toHaveAttribute('data-phase', 'max');
        expect(container.querySelector('.party-vial')).toHaveClass('vial-state-max');
        expect(container.querySelector('.rg-vitality-star')).toBeInTheDocument();

        rerender(<StatVial kind="exhaustion" current={1} max={6} memberName="Mira" />);
        expect(glyph(container)).toHaveAttribute('data-stage', '1');
        expect(glyph(container)).toHaveAttribute('data-phase', 'high');

        rerender(<StatVial kind="exhaustion" current={2} max={6} memberName="Mira" />);
        expect(glyph(container)).toHaveAttribute('data-stage', '2');
        expect(glyph(container)).toHaveAttribute('data-phase', 'high');

        rerender(<StatVial kind="exhaustion" current={3} max={6} memberName="Mira" />);
        expect(glyph(container)).toHaveAttribute('data-stage', '3');
        expect(glyph(container)).toHaveAttribute('data-phase', 'low');

        rerender(<StatVial kind="exhaustion" current={4} max={6} memberName="Mira" />);
        expect(glyph(container)).toHaveAttribute('data-stage', '4');
        expect(glyph(container)).toHaveAttribute('data-phase', 'low');

        rerender(<StatVial kind="exhaustion" current={5} max={6} memberName="Mira" />);
        expect(glyph(container)).toHaveAttribute('data-stage', '5');
        expect(glyph(container)).toHaveAttribute('data-phase', 'critical');
        expect(container.querySelector('.party-vial')).toHaveClass('vial-state-low');

        rerender(<StatVial kind="exhaustion" current={6} max={6} memberName="Mira" />);
        expect(glyph(container)).toHaveAttribute('data-stage', '6');
        expect(glyph(container)).toHaveAttribute('data-phase', 'empty');
        expect(container.querySelector('.party-vial')).toHaveClass('vial-state-empty');
        expect(container.querySelectorAll('.rg-shards').length).toBe(1);
    });

    it('pops big-number readout for exhaustion on hover', () => {
        const { container } = render(<StatVial kind="exhaustion" current={3} max={6} memberName="Mira" />);
        fireEvent.mouseEnter(screen.getByLabelText('Mira Exhaustion: 3 of 6'));
        const readout = container.querySelector('.party-vial-readout');
        expect(readout).toBeInTheDocument();
        expect(readout.querySelector('.readout-current')).toHaveTextContent('3');
        expect(readout.querySelector('.readout-max')).toHaveTextContent('/6');
    });
});

describe('getResourcePhase', () => {
    it('maps values to phases', () => {
        expect(getResourcePhase(0, 10)).toBe('empty');
        expect(getResourcePhase(2, 10)).toBe('critical');
        expect(getResourcePhase(3, 10)).toBe('low');
        expect(getResourcePhase(5, 10)).toBe('high');
        expect(getResourcePhase(10, 10)).toBe('max');
        expect(getResourcePhase(12, 10)).toBe('max');
    });

    it('maps exhaustion levels to phases', () => {
        expect(getResourcePhase(0, 6, 'exhaustion')).toBe('max');
        expect(getResourcePhase(1, 6, 'exhaustion')).toBe('high');
        expect(getResourcePhase(2, 6, 'exhaustion')).toBe('high');
        expect(getResourcePhase(3, 6, 'exhaustion')).toBe('low');
        expect(getResourcePhase(4, 6, 'exhaustion')).toBe('low');
        expect(getResourcePhase(5, 6, 'exhaustion')).toBe('critical');
        expect(getResourcePhase(6, 6, 'exhaustion')).toBe('empty');
    });
});
