import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GaolerResourceBar from '../components/GaolerResourceBar';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';

describe('GaolerResourceBar Component (Tension Gauge)', () => {
    it('renders the woven SVG chain with 10 links, ratchet dial, and no text clutter on the bar', () => {
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

        // Check ratchet dial emblem
        const graft = container.querySelector('.warden-graft');
        expect(graft).toBeInTheDocument();

        // Check spend-mark studs (Strike 2, Glaive 3, Resolve 4, Cage 6, Avatar 10)
        expect(container.querySelectorAll('.warden-spend-stud').length).toBe(5);

        // Apparatus hardware: bolted anchor, machined rail, ratchet dial, woven chain
        expect(container.querySelector('.warden-anchor')).toBeInTheDocument();
        expect(container.querySelector('.warden-rail')).toBeInTheDocument();
        expect(container.querySelector('.warden-gear')).toBeInTheDocument();
        expect(container.querySelector('.warden-chain')).toBeInTheDocument();
        expect(container.querySelectorAll('.warden-chain-cap').length).toBe(5);

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

    it('opens the Tension Ledger with spec choice, GM overrides, and a − / + stepper', () => {
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

        // Status keeps the VP counter; the economy now lives on the abilities
        expect(screen.getByText('VP: 2/10')).toBeInTheDocument();
        expect(screen.getByText(/casting your Warden abilities from the action bar or spellbook/i)).toBeInTheDocument();

        // Spend thresholds mirror the rail studs
        expect(document.body.querySelectorAll('.warden-threshold').length).toBe(5);

        // Stepper drives tension
        fireEvent.click(screen.getByLabelText('Bank 1 Tension'));
        expect(onUpdate).toHaveBeenCalledWith('current', 3);
        fireEvent.click(screen.getByLabelText('Spend 1 Tension'));
        expect(onUpdate).toHaveBeenCalledWith('current', 2);

        // Spec selection drives the bar's strain and state controls
        fireEvent.click(screen.getByText('Iron Warden'));
        expect(screen.getByText('Cages: 0/2')).toBeInTheDocument();

        // GM override
        fireEvent.click(screen.getByText('Reset'));
        expect(onUpdate).toHaveBeenCalledWith('current', 0);
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
