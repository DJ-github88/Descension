import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ApexResourceBar from '../components/ApexResourceBar';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';

describe('ApexResourceBar Component (The Predator Kill-Ledger)', () => {
    it('renders the 360px SVG chassis with 5 quarry mark talons and flank triggers, no companion sanctuary in bar', () => {
        const { container } = render(
            <ApexResourceBar
                classResource={{ current: 3, max: 5, companionHP: 50, companionMaxHP: 50, companionStance: 'Hunt' }}
                isOwner={true}
            />
        );
        const svgElement = container.querySelector('.apex-glaive-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 360 56');
        const talons = container.querySelectorAll('.apex-mark-talon');
        expect(talons.length).toBe(5);
        const earnedTalons = container.querySelectorAll('.apex-mark-talon.earned');
        expect(earnedTalons.length).toBe(3);
        // Companion sanctuary removed from SVG
        expect(container.querySelector('.apex-companion-sanctuary')).toBeNull();
        expect(container.querySelector('.apex-center-collar')).toBeNull();
        expect(container.querySelector('.apex-flank-left')).toBeInTheDocument();
        expect(container.querySelector('.apex-flank-right')).toBeInTheDocument();
        expect(container.querySelector('text')).toBeNull();
    });

    it('directly synchronizes quarry marks when clicking any of the 5 mark talons', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <ApexResourceBar
                classResource={{ current: 1, max: 5, companionHP: 50, companionMaxHP: 50 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );
        const talons = container.querySelectorAll('.apex-mark-talon');
        fireEvent.click(talons[3]);
        expect(onUpdate).toHaveBeenCalledWith('current', 4);
        fireEvent.click(talons[4]);
        expect(onUpdate).toHaveBeenCalledWith('current', 5);
    });

    it('handles right flank trigger (+1 mark) and Shift-click (Jump to Max 5 Marks)', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <ApexResourceBar
                classResource={{ current: 2, max: 5, companionHP: 50, companionMaxHP: 50 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );
        const rightTrigger = container.querySelector('.apex-flank-right');
        fireEvent.click(rightTrigger);
        expect(onUpdate).toHaveBeenCalledWith('current', 3);
        fireEvent.click(rightTrigger, { shiftKey: true });
        expect(onUpdate).toHaveBeenCalledWith('current', 5);
    });

    it('handles left flank trigger (-1 mark) and Shift-click (Reset to 0 Marks)', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <ApexResourceBar
                classResource={{ current: 3, max: 5, companionHP: 50, companionMaxHP: 50 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );
        const leftTrigger = container.querySelector('.apex-flank-left');
        fireEvent.click(leftTrigger);
        expect(onUpdate).toHaveBeenCalledWith('current', 2);
        fireEvent.click(leftTrigger, { shiftKey: true });
        expect(onUpdate).toHaveBeenCalledWith('current', 0);
    });

    it('does NOT block mark generation when companion HP is 0 (companion is a canvas token now)', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <ApexResourceBar
                classResource={{ current: 2, max: 5, companionHP: 0, companionMaxHP: 50 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );
        expect(container.querySelector('.apex-resource-bar.companion-down')).toBeNull();
        const rightTrigger = container.querySelector('.apex-flank-right');
        fireEvent.click(rightTrigger);
        expect(onUpdate).toHaveBeenCalledWith('current', 3);
    });

    it('activates apex-execution-ready state and apex-tier mark 5 when marks reach 5', () => {
        const { container } = render(
            <ApexResourceBar
                classResource={{ current: 5, max: 5, companionHP: 50, companionMaxHP: 50 }}
                isOwner={true}
            />
        );
        expect(container.querySelector('.apex-resource-bar.apex-execution-ready')).toBeInTheDocument();
        expect(container.querySelector('.apex-mark-talon.mark-5.apex-tier')).toBeInTheDocument();
    });

    it('opens unified context menu on bar click and handles mark and companion HP adjustment', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <ApexResourceBar
                classResource={{ current: 2, max: 5, companionHP: 50, companionMaxHP: 50 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );
        const bar = container.querySelector('.apex-resource-bar');
        fireEvent.click(bar);
        expect(screen.getByText('The Silent Hunt: Pack Codex')).toBeInTheDocument();
        const execBtn = screen.getByText(/Apex Execution/i);
        fireEvent.click(execBtn);
        expect(onUpdate).toHaveBeenCalledWith('current', 5);
        fireEvent.click(bar);
        const damageBtn = screen.getByText('-10 HP');
        fireEvent.click(damageBtn);
        expect(onUpdate).toHaveBeenCalledWith('companionHP', 40);
    });

    it('strictly contains zero emojis and zero AP in all rendered content', () => {
        const { container } = render(
            <ApexResourceBar
                classResource={{ current: 5, max: 5, companionHP: 50, companionMaxHP: 50 }}
                isOwner={true}
            />
        );
        const bar = container.querySelector('.apex-resource-bar');
        fireEvent.click(bar);
        const portalText = document.body.textContent;
        const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
        expect(emojiRegex.test(portalText)).toBe(false);
        expect(portalText).not.toMatch(/\bAP\b/);
    });

    it('renders correctly through ClassResourceBar router for Apex without text clutter', () => {
        const { container } = render(
            <ClassResourceBar
                characterClass="Apex"
                classResource={{ current: 3, max: 5, companionHP: 45, companionMaxHP: 50 }}
                isOwner={true}
            />
        );
        const svgElement = container.querySelector('.apex-glaive-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 360 56');
        expect(container.querySelector('text')).toBeNull();
    });
});
