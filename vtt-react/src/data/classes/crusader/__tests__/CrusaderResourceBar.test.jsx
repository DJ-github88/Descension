import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CrusaderResourceBar from '../components/CrusaderResourceBar';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';

describe('CrusaderResourceBar Component (Radiant Solvan Fervor Bar)', () => {
    it('renders the pure SVG Solvan Fervor reliquary with sunburst emblem and dual conduits without text clutter', () => {
        const { container } = render(
            <CrusaderResourceBar
                classResource={{ current: 35, max: 100 }}
                isOwner={true}
            />
        );

        const svgElement = container.querySelector('.crusader-fervor-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement.getAttribute('viewBox')).toBe('0 0 292 76');

        const sunburst = container.querySelector('.svg-sunburst-emblem');
        expect(sunburst).toBeInTheDocument();

        expect(container.querySelector('.crusader-left-conduit')).toBeInTheDocument();
        expect(container.querySelector('.crusader-right-conduit')).toBeInTheDocument();
    });

    it('displays harmonic stance state at 50+ fervor', () => {
        const { container } = render(
            <CrusaderResourceBar
                classResource={{ current: 65, max: 100 }}
                isOwner={true}
            />
        );

        const bar = container.querySelector('.crusader-resource-bar');
        expect(bar.classList.contains('harmonic')).toBe(true);
    });

    it('opens context menu on click and handles kindling/unleashing fervor', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <CrusaderResourceBar
                classResource={{ current: 40, max: 100 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const bar = container.querySelector('.crusader-resource-bar');
        fireEvent.click(bar);

        expect(screen.getByText('Crusader Radiant Fervor Ledger')).toBeInTheDocument();
        expect(screen.getByText('40/100')).toBeInTheDocument();

        // Click Strike (+10) -> 50
        const strikeBtn = screen.getByText(/Strike \(\+10\)/);
        fireEvent.click(strikeBtn);
        expect(onUpdate).toHaveBeenCalledWith('current', 50);

        // Click Aegis (-25) -> 50 - 25 = 25
        const aegisBtn = screen.getByText(/Aegis \(-25\)/);
        fireEvent.click(aegisBtn);
        expect(onUpdate).toHaveBeenCalledWith('current', 25);
    });

    it('renders correctly through ClassResourceBar router for Crusader class', () => {
        const { container } = render(
            <ClassResourceBar
                characterClass="Crusader"
                classResource={{ current: 75, max: 100 }}
                isOwner={true}
            />
        );

        const svgElement = container.querySelector('.crusader-fervor-svg');
        expect(svgElement).toBeInTheDocument();
        expect(container.querySelector('.crusader-resource-bar.harmonic')).toBeInTheDocument();
    });
});
