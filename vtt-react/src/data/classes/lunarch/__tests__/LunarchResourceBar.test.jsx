import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LunarchResourceBar from '../components/LunarchResourceBar';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';

describe('LunarchResourceBar Component (The Living Moon-Eye of Vael & The Celestial Orrery)', () => {
    it('renders the 360px wide pure SVG astrolabe with 4 moon phases and center astrolabe needle without text clutter', () => {
        const { container } = render(
            <LunarchResourceBar
                classResource={{ currentLunarPhase: 'full_moon', roundsInPhase: 1 }}
                isOwner={true}
            />
        );

        // Check SVG existence and wide 360x56 viewBox
        const svgElement = container.querySelector('.lunarch-astrolabe-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 360 56');

        // Check 4 moon phase nodes
        const nodes = container.querySelectorAll('.lunar-phase-node');
        expect(nodes.length).toBe(4);

        // Check active full moon node
        const activeNode = container.querySelector('.lunar-phase-node.full_moon.active');
        expect(activeNode).toBeInTheDocument();

        // Check center astrolabe needle exists
        const centerAstrolabe = container.querySelector('.lunar-center-astrolabe');
        expect(centerAstrolabe).toBeInTheDocument();

        // Check flank triggers exist
        expect(container.querySelector('.lunar-flank-left')).toBeInTheDocument();
        expect(container.querySelector('.lunar-flank-right')).toBeInTheDocument();

        // Zero text clutter on the SVG bar face
        expect(container.querySelector('text')).toBeNull();
    });

    it('directly synchronizes moon phase when clicking any of the 4 moon spheres', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <LunarchResourceBar
                classResource={{ currentLunarPhase: 'new_moon', roundsInPhase: 0 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const nodes = container.querySelectorAll('.lunar-phase-node');
        // Click Waxing Moon (index 1)
        fireEvent.click(nodes[1]);
        expect(onUpdate).toHaveBeenCalledWith('currentLunarPhase', 'waxing_moon');

        // Click Full Moon (index 2)
        fireEvent.click(nodes[2]);
        expect(onUpdate).toHaveBeenCalledWith('currentLunarPhase', 'full_moon');
    });

    it('handles right flank trigger (+1 round) and Shift-click (Jump to Full Moon)', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <LunarchResourceBar
                classResource={{ currentLunarPhase: 'waxing_moon', roundsInPhase: 1 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const rightTrigger = container.querySelector('.lunar-flank-right');

        // Normal click -> +1 round (round 2)
        fireEvent.click(rightTrigger);
        expect(onUpdate).toHaveBeenCalledWith('roundsInPhase', 2);

        // Shift click -> Jump directly to Full Moon
        fireEvent.click(rightTrigger, { shiftKey: true });
        expect(onUpdate).toHaveBeenCalledWith('currentLunarPhase', 'full_moon');
    });

    it('handles left flank trigger (-1 round) and Shift-click (Jump to New Moon)', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <LunarchResourceBar
                classResource={{ currentLunarPhase: 'waxing_moon', roundsInPhase: 2 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const leftTrigger = container.querySelector('.lunar-flank-left');

        // Normal click -> -1 round (round 1)
        fireEvent.click(leftTrigger);
        expect(onUpdate).toHaveBeenCalledWith('roundsInPhase', 1);

        // Shift click -> Jump directly to New Moon
        fireEvent.click(leftTrigger, { shiftKey: true });
        expect(onUpdate).toHaveBeenCalledWith('currentLunarPhase', 'new_moon');
    });

    it('opens unified context menu on bar click and handles phase switching', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <LunarchResourceBar
                classResource={{ currentLunarPhase: 'new_moon', roundsInPhase: 0 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const bar = container.querySelector('.lunarch-resource-bar');
        fireEvent.click(bar);

        // Menu rendered in portal
        expect(screen.getByText('Ephemeris of Vael')).toBeInTheDocument();
        expect(screen.getByText(/New Moon \(Round 1\/3\)/)).toBeInTheDocument();

        // Click Full Zenith preset
        const zenithBtn = screen.getByText('Full Zenith');
        fireEvent.click(zenithBtn);
        expect(onUpdate).toHaveBeenCalledWith('currentLunarPhase', 'full_moon');
    });

    it('strictly contains zero emojis and zero AP in tooltips and menus', () => {
        const { container } = render(
            <LunarchResourceBar
                classResource={{ currentLunarPhase: 'full_moon', roundsInPhase: 2 }}
                isOwner={true}
            />
        );

        const bar = container.querySelector('.lunarch-resource-bar');
        fireEvent.click(bar);

        // Check DOM content in portal
        const portalText = document.body.textContent;
        const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
        expect(emojiRegex.test(portalText)).toBe(false);
        expect(portalText).not.toMatch(/\bAP\b/);
    });

    it('renders the Tri-Star Chronometer reflecting rounds and shift warning on Round 3', () => {
        const { container, rerender } = render(
            <LunarchResourceBar
                classResource={{ currentLunarPhase: 'waxing_moon', roundsInPhase: 0 }}
                isOwner={true}
            />
        );

        // Round 1 (index 0): Star 0 is lit, Star 1 and 2 unlit
        expect(container.querySelector('.star-0.lit')).toBeInTheDocument();
        expect(container.querySelector('.star-1.unlit')).toBeInTheDocument();
        expect(container.querySelector('.star-2.unlit')).toBeInTheDocument();

        // Rerender at Round 3 (index 2): Shift imminent warning active
        rerender(
            <LunarchResourceBar
                classResource={{ currentLunarPhase: 'waxing_moon', roundsInPhase: 2 }}
                isOwner={true}
            />
        );

        expect(container.querySelector('.star-2.lit.shift-warning')).toBeInTheDocument();
    });

    it('morphs the living center hero moon body across all lunar phases', () => {
        const phases = ['new_moon', 'waxing_moon', 'full_moon', 'waning_moon'];
        const { container, rerender } = render(
            <LunarchResourceBar
                classResource={{ currentLunarPhase: 'new_moon', roundsInPhase: 0 }}
                isOwner={true}
            />
        );

        phases.forEach((phase) => {
            rerender(
                <LunarchResourceBar
                    classResource={{ currentLunarPhase: phase, roundsInPhase: 0 }}
                    isOwner={true}
                />
            );
            expect(container.querySelector(`.lunarch-resource-bar.phase-${phase}`)).toBeInTheDocument();
            expect(container.querySelector(`.lunar-phase-node.${phase}.active`)).toBeInTheDocument();
        });
    });

    it('renders correctly through ClassResourceBar router for Lunarch without text clutter', () => {
        const { container } = render(
            <ClassResourceBar
                characterClass="Lunarch"
                classResource={{ currentLunarPhase: 'waxing_moon', roundsInPhase: 1, max: 4 }}
                isOwner={true}
            />
        );

        const svgElement = container.querySelector('.lunarch-astrolabe-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 360 56');
        expect(container.querySelector('text')).toBeNull();
    });
});
