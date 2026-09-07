import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HarbingerResourceBar from '../components/HarbingerResourceBar';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';

describe('HarbingerResourceBar Component (Pure SVG/CSS Apparatus)', () => {
    it('renders the pure SVG Harbinger bar with 10 rune slots and singularity core, without any image assets', () => {
        const { container } = render(
            <HarbingerResourceBar
                classResource={{ current: 3, max: 10 }}
                isOwner={true}
            />
        );

        // Verify master SVG and viewBox
        const svg = container.querySelector('svg.harbinger-master-svg');
        expect(svg).toBeInTheDocument();
        expect(svg.getAttribute('viewBox')).toBe('0 0 292 76');

        // Verify that NO img elements are rendered (pure vector)
        const imgs = container.querySelectorAll('img');
        expect(imgs.length).toBe(0);

        // Check that all 10 rune stages are rendered as SVG groups
        for (let i = 1; i <= 10; i++) {
            const slot = container.querySelector(`[data-stage="${i}"]`);
            expect(slot).toBeInTheDocument();
        }

        // Check central core singularity
        const core = container.querySelector('.harbinger-center-core');
        expect(core).toBeInTheDocument();

        // Stage 3 should have 3 filled slots and clean vector state
        expect(container.querySelectorAll('.harbinger-rune-slot.filled').length).toBe(3);
    });

    it('renders unified context menu with level grid and Wild Surge trigger without talent spec selector', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <HarbingerResourceBar
                classResource={{ current: 5, max: 10 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        // Click bar container to open unified context menu
        const bar = container.querySelector('.harbinger-resource-bar');
        fireEvent.click(bar);

        expect(screen.getByText('Harbinger Mayhem Controls')).toBeInTheDocument();
        expect(screen.getByText('Set Mayhem Level')).toBeInTheDocument();
        expect(screen.getByText('Roll d100 Master Wild Surge')).toBeInTheDocument();

        // Ensure there is NO specialization switcher per user rule
        expect(screen.queryByText('SPECIALIZATION PATH')).not.toBeInTheDocument();

        // Click +1 step
        const plusBtn = screen.getByText('+1');
        fireEvent.click(plusBtn);
        expect(onUpdate).toHaveBeenCalledWith('current', 6);

        // Click Level 8 button
        const lvl8Btn = screen.getByRole('button', { name: '8' });
        fireEvent.click(lvl8Btn);
        expect(onUpdate).toHaveBeenCalledWith('current', 8);
    });

    it('allows clicking individual rune slots to set stage directly', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <HarbingerResourceBar
                classResource={{ current: 2, max: 10 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const slot7 = container.querySelector('[data-stage="7"]');
        expect(slot7).toBeInTheDocument();
        fireEvent.click(slot7);
        expect(onUpdate).toHaveBeenCalledWith('current', 7);
    });

    it('renders correctly through ClassResourceBar router', () => {
        const { container } = render(
            <ClassResourceBar
                characterClass="Harbinger"
                classResource={{ current: 7, max: 10 }}
                isOwner={true}
            />
        );

        const svg = container.querySelector('svg.harbinger-master-svg');
        expect(svg).toBeInTheDocument();
        expect(container.querySelectorAll('.harbinger-rune-slot').length).toBe(10);
    });

    it('activates catastrophic and cataclysm-active states at Stage 10 without text clutter', () => {
        const { container } = render(
            <HarbingerResourceBar
                classResource={{ current: 10, max: 10 }}
                isOwner={true}
            />
        );

        expect(container.querySelector('.harbinger-resource-wrapper.catastrophic-warning')).toBeInTheDocument();
        expect(container.querySelector('.harbinger-center-core.cataclysm-active')).toBeInTheDocument();
    });
});
