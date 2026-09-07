import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InquisitorResourceBar from '../components/InquisitorResourceBar';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';

describe('InquisitorResourceBar Component (The Barbed Leash of the Damned & Caged Anathema Collar)', () => {
    it('renders the 360px wide pure SVG barbed leash with 8 hex-links and central demon collar without text clutter', () => {
        const { container } = render(
            <InquisitorResourceBar
                classResource={{ authority: 5, max: 8 }}
                isOwner={true}
            />
        );

        // Check SVG existence and wide 360x56 viewBox
        const svgElement = container.querySelector('.inquisitor-leash-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 360 56');

        // Check 8 hex-links and 5 sealed
        const links = container.querySelectorAll('.inq-hex-link');
        expect(links.length).toBe(8);
        const sealedLinks = container.querySelectorAll('.inq-hex-link.sealed');
        expect(sealedLinks.length).toBe(5);

        // Check centerpiece demon collar exists
        const centerCollar = container.querySelector('.inq-center-collar');
        expect(centerCollar).toBeInTheDocument();

        // Check flank triggers exist
        expect(container.querySelector('.inq-flank-left')).toBeInTheDocument();
        expect(container.querySelector('.inq-flank-right')).toBeInTheDocument();

        // Zero text clutter on the SVG bar face
        expect(container.querySelector('text')).toBeNull();
    });

    it('calibrates authority when directly clicking a barbed hex-link', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <InquisitorResourceBar
                classResource={{ authority: 2, max: 8 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const links = container.querySelectorAll('.inq-hex-link');
        // Click 6th link (index 5, id 6)
        fireEvent.click(links[5]);
        expect(onUpdate).toHaveBeenCalledWith('authority', 6);
    });

    it('handles left flank trigger (+1 Authority) and Shift-click (Max 8)', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <InquisitorResourceBar
                classResource={{ authority: 3, max: 8 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const leftTrigger = container.querySelector('.inq-flank-left');

        // Normal click -> +1 (4)
        fireEvent.click(leftTrigger);
        expect(onUpdate).toHaveBeenCalledWith('authority', 4);

        // Shift click -> Max (8)
        fireEvent.click(leftTrigger, { shiftKey: true });
        expect(onUpdate).toHaveBeenCalledWith('authority', 8);
    });

    it('handles right flank trigger (+1 Authority) and Shift-click (Max 8)', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <InquisitorResourceBar
                classResource={{ authority: 6, max: 8 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const rightTrigger = container.querySelector('.inq-flank-right');

        // Normal click -> +1 (7)
        fireEvent.click(rightTrigger);
        expect(onUpdate).toHaveBeenCalledWith('authority', 7);

        // Shift click -> Max (8)
        fireEvent.click(rightTrigger, { shiftKey: true });
        expect(onUpdate).toHaveBeenCalledWith('authority', 8);
    });

    it('opens unified context menu on bar click and handles judicial edicts', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <InquisitorResourceBar
                classResource={{ authority: 6, max: 8 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const bar = container.querySelector('.inquisitor-resource-bar');
        fireEvent.click(bar);

        // Menu rendered in portal
        expect(screen.getByText('Inquisition Tribunal')).toBeInTheDocument();
        expect(screen.getByText(/Authority \(6\/8\)/)).toBeInTheDocument();

        // Click Anathema (-2)
        const anathemaBtn = screen.getByText(/Anathema \(-2\)/);
        fireEvent.click(anathemaBtn);
        expect(onUpdate).toHaveBeenCalledWith('authority', 4);
    });

    it('strictly contains zero emojis and zero AP in tooltips and menus', () => {
        const { container } = render(
            <InquisitorResourceBar
                classResource={{ authority: 4, max: 8 }}
                isOwner={true}
            />
        );

        const bar = container.querySelector('.inquisitor-resource-bar');
        fireEvent.click(bar);

        // Check DOM content in portal
        const portalText = document.body.textContent;
        const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
        expect(emojiRegex.test(portalText)).toBe(false);
        expect(portalText).not.toMatch(/\bAP\b/);
    });

    it('renders correctly through ClassResourceBar router for Inquisitor without text clutter', () => {
        const { container } = render(
            <ClassResourceBar
                characterClass="Inquisitor"
                classResource={{ authority: 7, current: 7, max: 8 }}
                isOwner={true}
            />
        );

        const svgElement = container.querySelector('.inquisitor-leash-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 360 56');
        expect(container.querySelector('text')).toBeNull();
    });
});
