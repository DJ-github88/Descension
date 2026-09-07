import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ToxicologistResourceBar from '../components/ToxicologistResourceBar';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';

describe('ToxicologistResourceBar Component (The Canopy Syringe-Alembic & Needle-Clockwork Rig)', () => {
    it('renders the 360px wide pure SVG alchemical manifold with 6 phials and 5 cogs without text clutter on the bar', () => {
        const { container } = render(
            <ToxicologistResourceBar
                classResource={{ toxinVials: 4, contraptionParts: 3, toxinVialsMax: 6, contraptionPartsMax: 5 }}
                isOwner={true}
            />
        );

        // Check SVG existence and wide 360x56 viewBox
        const svgElement = container.querySelector('.toxicologist-manifold-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 360 56');

        // Check 6 phials & 4 filled
        const phials = container.querySelectorAll('.toxi-phial');
        expect(phials.length).toBe(6);
        const filledPhials = container.querySelectorAll('.toxi-phial.filled');
        expect(filledPhials.length).toBe(4);

        // Check 5 cogs & 3 stocked
        const cogs = container.querySelectorAll('.toxi-cog');
        expect(cogs.length).toBe(5);
        const stockedCogs = container.querySelectorAll('.toxi-cog.stocked');
        expect(stockedCogs.length).toBe(3);

        // Check central manometer manifold exists
        const centerManifold = container.querySelector('.toxi-center-manifold');
        expect(centerManifold).toBeInTheDocument();

        // Check flank triggers exist
        expect(container.querySelector('.toxi-flank-left')).toBeInTheDocument();
        expect(container.querySelector('.toxi-flank-right')).toBeInTheDocument();

        // Zero text on the SVG bar itself
        expect(container.querySelector('text')).toBeNull();
    });

    it('calibrates toxin vials when directly clicking a phial', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <ToxicologistResourceBar
                classResource={{ toxinVials: 2, contraptionParts: 3 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const phials = container.querySelectorAll('.toxi-phial');
        // Click 5th phial (index 4 in 0-based, id=5)
        fireEvent.click(phials[4]);
        expect(onUpdate).toHaveBeenCalledWith('toxinVials', 5);
    });

    it('calibrates contraption parts when directly clicking a cog', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <ToxicologistResourceBar
                classResource={{ toxinVials: 4, contraptionParts: 1 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const cogs = container.querySelectorAll('.toxi-cog');
        // Click 4th cog (index 3 in 0-based, id=4)
        fireEvent.click(cogs[3]);
        expect(onUpdate).toHaveBeenCalledWith('contraptionParts', 4);
    });

    it('handles left flank trigger (+1 Toxin Vial) and Shift-click (Max)', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <ToxicologistResourceBar
                classResource={{ toxinVials: 2, contraptionParts: 3, toxinVialsMax: 6 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const leftTrigger = container.querySelector('.toxi-flank-left');

        // Normal click -> +1
        fireEvent.click(leftTrigger);
        expect(onUpdate).toHaveBeenCalledWith('toxinVials', 3);

        // Shift click -> Max (6)
        fireEvent.click(leftTrigger, { shiftKey: true });
        expect(onUpdate).toHaveBeenCalledWith('toxinVials', 6);
    });

    it('handles right flank trigger (+1 Contraption Part) and Shift-click (Max)', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <ToxicologistResourceBar
                classResource={{ toxinVials: 4, contraptionParts: 2, contraptionPartsMax: 5 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const rightTrigger = container.querySelector('.toxi-flank-right');

        // Normal click -> +1
        fireEvent.click(rightTrigger);
        expect(onUpdate).toHaveBeenCalledWith('contraptionParts', 3);

        // Shift click -> Max (5)
        fireEvent.click(rightTrigger, { shiftKey: true });
        expect(onUpdate).toHaveBeenCalledWith('contraptionParts', 5);
    });

    it('opens unified context menu on bar click and handles supplies adjustments', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <ToxicologistResourceBar
                classResource={{ toxinVials: 3, contraptionParts: 2 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const bar = container.querySelector('.toxicologist-resource-bar');
        fireEvent.click(bar);

        // Menu should be rendered in portal
        expect(screen.getByText('Alchemical Bench')).toBeInTheDocument();
        expect(screen.getByText(/Toxin Vials \(3\/6\)/)).toBeInTheDocument();
        expect(screen.getByText(/Contraption Parts \(2\/5\)/)).toBeInTheDocument();

        // Click +1 on Toxin Vials (the first +1 button)
        const plusButtons = screen.getAllByText('+1');
        fireEvent.click(plusButtons[0]);
        expect(onUpdate).toHaveBeenCalledWith('toxinVials', 4);
    });

    it('renders correctly through ClassResourceBar router for Toxicologist without text clutter', () => {
        const { container } = render(
            <ClassResourceBar
                characterClass="Toxicologist"
                classResource={{ toxinVials: 6, contraptionParts: 5, max: 6 }}
                isOwner={true}
            />
        );

        const svgElement = container.querySelector('.toxicologist-manifold-svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('viewBox', '0 0 360 56');

        expect(container.querySelector('text')).toBeNull();
    });
});
