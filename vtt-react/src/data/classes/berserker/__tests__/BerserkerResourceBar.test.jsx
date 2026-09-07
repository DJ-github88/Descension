import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BerserkerResourceBar from '../components/BerserkerResourceBar';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';

describe('BerserkerResourceBar Component (Fanged Caldera Jaw & Kin-Blood Rift)', () => {
    it('renders the wide pure SVG rage jaw with interlocking fangs and no text clutter', () => {
        const { container } = render(
            <BerserkerResourceBar
                classResource={{ current: 65, max: 100 }}
                isOwner={true}
            />
        );

        // Check SVG existence and wide 360x56 viewBox
        const svgElement = container.querySelector('.berserker-brand-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 360 56');

        // Check central skull & crossed axes clasp exists
        const brandCenter = container.querySelector('.berserker-brand-center');
        expect(brandCenter).toBeInTheDocument();

        // Zero text on the SVG bar itself
        expect(container.querySelector('text')).toBeNull();
    });

    it('opens unified context menu on click and handles rage adjustments', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <BerserkerResourceBar
                classResource={{ current: 30, max: 100 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const bar = container.querySelector('.berserker-resource-bar');
        fireEvent.click(bar);

        // Menu should be rendered in portal with warm parchment styling
        expect(screen.getByText(/Rage: 30\/100/)).toBeInTheDocument();

        // Click +10
        const plus10Btn = screen.getByText('+10');
        fireEvent.click(plus10Btn);
        expect(onUpdate).toHaveBeenCalledWith('current', 40);

        // Click -10 (from 40 down to 30)
        const minus10Btn = screen.getByText('-10');
        fireEvent.click(minus10Btn);
        expect(onUpdate).toHaveBeenCalledWith('current', 30);
    });

    it('supports quick flank triggers (+5 on left hinge, -10 on right vent) and fang calibration jumps', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <BerserkerResourceBar
                classResource={{ current: 40, max: 100 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        // Left flank trigger (+5)
        const leftTrigger = container.querySelector('.berserker-flank-trigger.left');
        expect(leftTrigger).toBeInTheDocument();
        fireEvent.click(leftTrigger);
        expect(onUpdate).toHaveBeenCalledWith('current', 45);

        // Right flank trigger (-10)
        const rightTrigger = container.querySelector('.berserker-flank-trigger.right');
        expect(rightTrigger).toBeInTheDocument();
        fireEvent.click(rightTrigger);
        expect(onUpdate).toHaveBeenCalledWith('current', 35);

        // Crucial verification: clicking the flank triggers must NOT open the menu
        expect(document.querySelector('.berserker-rage-popover')).toBeNull();
    });

    it('applies overheated visual state and indicators at 101+ Rage', () => {
        const { container } = render(
            <BerserkerResourceBar
                classResource={{ current: 110, max: 100 }}
                isOwner={true}
            />
        );

        const bar = container.querySelector('.berserker-resource-bar');
        expect(bar).toHaveClass('overheated');
    });

    it('strictly contains zero emojis and zero AP in tooltips and menus', () => {
        const { container } = render(
            <BerserkerResourceBar
                classResource={{ current: 85, max: 100 }}
                isOwner={true}
            />
        );

        // Open menu
        const bar = container.querySelector('.berserker-resource-bar');
        fireEvent.click(bar);

        const menuText = document.querySelector('.berserker-rage-popover')?.textContent || '';
        
        // Zero emojis test: ensure no high-surrogate emoji unicode characters
        const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
        expect(emojiRegex.test(menuText)).toBe(false);

        // Zero AP test: no mention of "AP" or "Action Point"
        expect(menuText).not.toMatch(/\bAP\b/i);
        expect(menuText).not.toMatch(/action point/i);
    });

    it('renders correctly through ClassResourceBar router for Berserker without text clutter', () => {
        const { container } = render(
            <ClassResourceBar
                characterClass="Berserker"
                classResource={{ current: 75, max: 100 }}
                isOwner={true}
            />
        );

        const svgElement = container.querySelector('.berserker-brand-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 360 56');

        expect(container.querySelector('text')).toBeNull();
    });
});
