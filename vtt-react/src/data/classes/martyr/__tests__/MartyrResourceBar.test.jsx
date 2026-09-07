import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MartyrResourceBar from '../components/MartyrResourceBar';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';

describe('MartyrResourceBar Component (Pure SVG Vector Apparatus)', () => {
    it('renders the SVG apparatus with 6 stigmata seals, solar monstrance centerpiece, and caliper gauge', () => {
        const { container } = render(
            <MartyrResourceBar
                classResource={{ current: 3, damage: 40, max: 6 }}
                isOwner={true}
            />
        );

        expect(container.querySelector('.martyr-master-svg')).toBeInTheDocument();
        expect(container.querySelectorAll('.martyr-seal-slot').length).toBe(6);
        // At level 3, slots 1, 2, and 3 should be filled
        expect(container.querySelectorAll('.martyr-seal-slot.filled').length).toBe(3);
        expect(container.querySelector('.martyr-centerpiece')).toBeInTheDocument();
        expect(container.querySelector('.martyr-liquid-fill')).toBeInTheDocument();
    });

    it('renders unified Pathfinder context menu with Devotion Tier buttons, suffering controls, and draggable spells', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <MartyrResourceBar
                classResource={{ current: 2, damage: 20, max: 6 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        // Click bar to open drawer
        const bar = container.querySelector('.martyr-resource-bar');
        fireEvent.click(bar);

        expect(screen.getByText('Martyr Devotion & Suffering Ledger')).toBeInTheDocument();
        expect(screen.getByText(/Steadfast Conviction/)).toBeInTheDocument();
        expect(screen.getAllByText(/20\/100 DMG/).length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('Set Devotion Tier')).toBeInTheDocument();
        expect(screen.getByText(/Suffering Bank Management/)).toBeInTheDocument();
        // Verify draggable spells are NOT in the drawer (only Minstrel has draggable spells from menu)
        expect(screen.queryByText('Martyr Spells (Drag to Action Bar)')).not.toBeInTheDocument();
        expect(screen.queryByText('Intervene')).not.toBeInTheDocument();

        // Check quick buttons (+10, +20, 1d8 HP)
        const plus10Btn = screen.getByTitle('Add 10 Damage');
        fireEvent.click(plus10Btn);
        expect(onUpdate).toHaveBeenCalledWith('damage', 30);
    });

    it('updates tier and banks damage when clicking a stigmata seal directly', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <MartyrResourceBar
                classResource={{ current: 1, damage: 10, max: 6 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        const seals = container.querySelectorAll('.martyr-seal-slot');
        // Click seal IV (index 3)
        fireEvent.click(seals[3]);
        expect(onUpdate).toHaveBeenCalledWith('current', 4);
        expect(onUpdate).toHaveBeenCalledWith('damage', 60);
    });

    it('renders correctly through ClassResourceBar router for Martyr class', () => {
        const { container } = render(
            <ClassResourceBar
                characterClass="Martyr"
                classResource={{ current: 4, damage: 60, max: 6 }}
                isOwner={true}
            />
        );

        expect(container.querySelector('.martyr-master-svg')).toBeInTheDocument();
        expect(container.querySelectorAll('.martyr-seal-slot.filled').length).toBe(4);
    });
});
