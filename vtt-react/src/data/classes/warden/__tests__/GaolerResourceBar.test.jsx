import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GaolerResourceBar from '../components/GaolerResourceBar';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';

describe('GaolerResourceBar Component (Graft-Chain Apparatus)', () => {
    it('renders the SVG graft-chain with 10 links, flesh-ring graft, and no text clutter on the bar', () => {
        const { container } = render(
            <GaolerResourceBar
                classResource={{ current: 3, max: 10 }}
                isOwner={true}
            />
        );

        // Check SVG existence and full-bleed 300x64 viewBox
        const svgElement = container.querySelector('.warden-chain-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 300 64');

        // Check links
        const links = container.querySelectorAll('.warden-chain-link');
        expect(links.length).toBe(10);

        const filledLinks = container.querySelectorAll('.warden-chain-link.filled');
        expect(filledLinks.length).toBe(3);

        // Check flesh-ring graft emblem
        const graft = container.querySelector('.warden-graft');
        expect(graft).toBeInTheDocument();

        // Check spend-mark studs (Strike 2, Glaive 3, Resolve 4, Cage 6, Avatar 10)
        expect(container.querySelectorAll('polygon[points*="9.5"]').length).toBe(5);

        // Check zero text clutter on the SVG bar
        expect(container.querySelector('text')).toBeNull();
    });

    it('clicking a link winds tension straight to it without opening the menu', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <GaolerResourceBar
                classResource={{ current: 2, max: 10 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        fireEvent.click(container.querySelector('.warden-chain-link.link-7'));
        expect(onUpdate).toHaveBeenCalledWith('current', 7);
        expect(screen.queryByText('VP: 2/10')).toBeNull();
    });

    it('arrow keys wind and unwind tension', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <GaolerResourceBar
                classResource={{ current: 4, max: 10 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );
        const bar = container.querySelector('.warden-resource-bar');
        expect(bar).toHaveAttribute('role', 'slider');
        fireEvent.keyDown(bar, { key: 'ArrowRight' });
        expect(onUpdate).toHaveBeenCalledWith('current', 5);
        fireEvent.keyDown(bar, { key: 'ArrowLeft' });
        expect(onUpdate).toHaveBeenCalledWith('current', 4);
    });

    it('opens unified context menu on click and handles VP adjustments', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <GaolerResourceBar
                classResource={{ current: 2, max: 10 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const bar = container.querySelector('.warden-resource-bar');
        fireEvent.click(bar);

        // Menu should be rendered in portal
        expect(screen.getByText('VP: 2/10')).toBeInTheDocument();
        expect(screen.getByText('Spend')).toBeInTheDocument();

        // Click +1 VP
        const plusOneBtn = screen.getByText('+1');
        fireEvent.click(plusOneBtn);
        expect(onUpdate).toHaveBeenCalledWith('current', 3);

        // Click -1 VP (from 3 down to 2)
        const minusOneBtn = screen.getByText('-1');
        fireEvent.click(minusOneBtn);
        expect(onUpdate).toHaveBeenCalledWith('current', 2);
    });

    it('renders correctly through ClassResourceBar router for Warden class without text clutter', () => {
        const { container } = render(
            <ClassResourceBar
                characterClass="Warden"
                classResource={{ current: 7, max: 10 }}
                isOwner={true}
            />
        );

        const svgElement = container.querySelector('.warden-chain-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 300 64');

        const filledLinks = container.querySelectorAll('.warden-chain-link.filled');
        expect(filledLinks.length).toBe(7);

        expect(container.querySelector('text')).toBeNull();
    });
});
