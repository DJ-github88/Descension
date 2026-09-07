import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AnimistResourceBar from '../components/AnimistResourceBar';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';

describe('AnimistResourceBar Component (The Ancestral Bone-Spur Spine & Overtone Skull)', () => {
    it('renders the pure SVG organic bone-spur spine with 20 vertebrae, shaman skull, and central numeral', () => {
        const { container } = render(
            <AnimistResourceBar
                classResource={{ current: 10, max: 20 }}
                isOwner={true}
            />
        );

        // Check SVG existence and standard 296x60 viewBox
        const svgElement = container.querySelector('.animist-apparatus-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 296 60');

        // Check Ancestor Shaman Skull exists
        const skull = container.querySelector('.animist-skull-module');
        expect(skull).toBeInTheDocument();

        // 20 erupted bone spur vertebrae total (10 left, 10 right)
        const spurs = container.querySelectorAll('.animist-bone-spur');
        expect(spurs).toHaveLength(20);

        // Totem root knot, Spirit whistle, and Talisman exist
        expect(container.querySelector('.animist-totem-knot')).toBeInTheDocument();
        expect(container.querySelector('.animist-whistle-module')).toBeInTheDocument();
        expect(container.querySelector('.animist-talisman-module')).toBeInTheDocument();

        // Only ONE text element on the SVG: the central Resonance numeral on the skull
        const textElements = container.querySelectorAll('svg text');
        expect(textElements).toHaveLength(1);
        expect(textElements[0].textContent).toBe('10');
    });

    it('handles direct erupted bone spur clicks to set Resonance', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <AnimistResourceBar
                classResource={{ current: 2, max: 20 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const spurs = container.querySelectorAll('.animist-bone-spur');
        // Click 5th spur (val 5)
        fireEvent.click(spurs[4]);
        expect(onUpdate).toHaveBeenCalledWith('current', 5);

        // Click 14th spur (val 14 - Apex Harmonic)
        fireEvent.click(spurs[13]);
        expect(onUpdate).toHaveBeenCalledWith('current', 14);
    });

    it('handles Totem Knot (+1) and Spirit Whistle (-3) clicks', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <AnimistResourceBar
                classResource={{ current: 8, max: 20 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        // Click Totem knot (+1)
        const totem = container.querySelector('.animist-totem-knot');
        fireEvent.click(totem);
        expect(onUpdate).toHaveBeenCalledWith('current', 9);

        // Click Whistle module (-3)
        const whistle = container.querySelector('.animist-whistle-module');
        fireEvent.click(whistle);
        // From 9 dropping by 3 goes to 6
        expect(onUpdate).toHaveBeenLastCalledWith('current', 6);
    });

    it('opens the portalled Shaman Council popover on skull click and executes quick calibration', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <AnimistResourceBar
                classResource={{ current: 5, max: 20 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const skull = container.querySelector('.animist-skull-module');
        fireEvent.click(skull);

        // Popover should be rendered in portal (document.body)
        expect(screen.getByText(/The Shaman's Council/i)).toBeInTheDocument();

        // Click Apex (14) preset
        const presetApex = screen.getByText(/Apex \(14\)/i);
        fireEvent.click(presetApex);
        expect(onUpdate).toHaveBeenCalledWith('current', 14);
    });

    it('renders correctly through ClassResourceBar router for Animist without duplicate tooltips', () => {
        const { container } = render(
            <ClassResourceBar
                characterClass="Animist"
                classResource={{ current: 16, max: 20 }}
                isOwner={true}
            />
        );

        const svgElement = container.querySelector('.animist-apparatus-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 296 60');

        // Central text shows 16
        const textElements = container.querySelectorAll('svg text');
        expect(textElements).toHaveLength(1);
        expect(textElements[0].textContent).toBe('16');
    });
});
