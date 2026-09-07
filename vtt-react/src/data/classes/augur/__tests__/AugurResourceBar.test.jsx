import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AugurResourceBar from '../components/AugurResourceBar';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';

describe('AugurResourceBar Component (Haruspex Altar Apparatus)', () => {
    it('renders the pure SVG altar with marrow-fang wings and no text clutter on the bar', () => {
        const { container } = render(
            <AugurResourceBar
                classResource={{ benediction: 4, malediction: 6, maxBenediction: 10, maxMalediction: 10 }}
                isOwner={true}
            />
        );

        // Check SVG existence and full-bleed 300x64 viewBox
        const svgElement = container.querySelector('.augur-astrolabe-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 300 64');

        // Check center omphalos exists
        const omphalos = container.querySelector('.augur-center-omphalos');
        expect(omphalos).toBeInTheDocument();

        // Check fangs
        const malFangs = container.querySelectorAll('.augur-omen-fang.filled[class*="mal-"]');
        expect(malFangs.length).toBe(6);

        const benFangs = container.querySelectorAll('.augur-omen-fang.filled[class*="ben-"]');
        expect(benFangs.length).toBe(4);

        // Zero text on the SVG bar itself
        expect(container.querySelector('text')).toBeNull();
    });

    it('leans the reading eye toward the heavier pool', () => {
        const { container } = render(
            <AugurResourceBar
                classResource={{ benediction: 8, malediction: 2, maxBenediction: 10, maxMalediction: 10 }}
                isOwner={true}
            />
        );
        const pupil = container.querySelector('.augur-center-omphalos circle[r="2.6"]');
        expect(pupil).toBeInTheDocument();
        expect(parseFloat(pupil.getAttribute('cx'))).toBeGreaterThan(150);
    });

    it('clicking a fang sets its pool straight to that value without opening the menu', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <AugurResourceBar
                classResource={{ benediction: 3, malediction: 2, maxBenediction: 10, maxMalediction: 10 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        fireEvent.click(container.querySelector('.augur-omen-fang.mal-7'));
        expect(onUpdate).toHaveBeenCalledWith('malediction', 7);
        expect(screen.queryByText('Dual Omen Astrolabe')).toBeNull();

        onUpdate.mockClear();
        fireEvent.click(container.querySelector('.augur-omen-fang.ben-5'));
        expect(onUpdate).toHaveBeenCalledWith('benediction', 5);
        expect(screen.queryByText('Dual Omen Astrolabe')).toBeNull();
    });

    it('arrow keys adjust dark (left/right) and light (down/up) pools', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <AugurResourceBar
                classResource={{ benediction: 3, malediction: 2, maxBenediction: 10, maxMalediction: 10 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );
        const bar = container.querySelector('.augur-omen-bar');
        expect(bar).toHaveAttribute('role', 'slider');
        fireEvent.keyDown(bar, { key: 'ArrowRight' });
        expect(onUpdate).toHaveBeenCalledWith('malediction', 3);
        fireEvent.keyDown(bar, { key: 'ArrowUp' });
        expect(onUpdate).toHaveBeenCalledWith('benediction', 4);
    });

    it('opens unified context menu on click and handles omen adjustments', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <AugurResourceBar
                classResource={{ benediction: 3, malediction: 2, maxBenediction: 10, maxMalediction: 10 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const bar = container.querySelector('.augur-omen-bar');
        fireEvent.click(bar);

        // Menu should be rendered in portal
        expect(screen.getByText('Dual Omen Astrolabe')).toBeInTheDocument();
        expect(screen.getByText(/Light \(3\/10\)/)).toBeInTheDocument();
        expect(screen.getByText(/Dark \(2\/10\)/)).toBeInTheDocument();

        // Click + on Dark (first + button)
        const plusIcons = container.ownerDocument.querySelectorAll('.context-menu-button.gain');
        expect(plusIcons.length).toBe(2);
        fireEvent.click(plusIcons[0]); // Dark +1
        expect(onUpdate).toHaveBeenCalledWith('malediction', 3);
    });

    it('renders correctly through ClassResourceBar router for Augur without text clutter', () => {
        const { container } = render(
            <ClassResourceBar
                characterClass="Augur"
                classResource={{ benediction: 5, malediction: 5, max: 10 }}
                isOwner={true}
            />
        );

        const svgElement = container.querySelector('.augur-astrolabe-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 300 64');

        expect(container.querySelector('text')).toBeNull();
    });
});
