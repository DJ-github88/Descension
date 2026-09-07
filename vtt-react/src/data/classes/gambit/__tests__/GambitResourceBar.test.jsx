import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GambitResourceBar from '../components/GambitResourceBar';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';

describe('GambitResourceBar Component (Pure SVG Vector Apparatus)', () => {
    it('renders the dual split bar with 7 large coins on left and 13 tall cards on right without text clutter', () => {
        const { container } = render(
            <GambitResourceBar
                classResource={{ current: 4, max: 7, debt: 5 }}
                isOwner={true}
            />
        );

        expect(container.querySelector('.gambit-master-svg')).toBeInTheDocument();
        expect(container.querySelectorAll('.gambit-coin-slot').length).toBe(7);
        expect(container.querySelectorAll('.gambit-coin-slot.filled').length).toBe(4);
        expect(container.querySelectorAll('.gambit-debt-card').length).toBe(13);
        expect(container.querySelectorAll('.gambit-debt-card.filled').length).toBe(5);
        expect(container.querySelector('.gambit-centerpiece')).toBeInTheDocument();
    });

    it('renders unified context menu with Fortune and Karmic Debt controls without spec selector', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <GambitResourceBar
                classResource={{ current: 3, max: 7, debt: 2 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        // Click bar to open unified context menu
        const barContainer = container.querySelector('.gambit-dual-bar-container');
        fireEvent.click(barContainer);

        expect(screen.getByText('Gambit Fortune & Debt Ledger')).toBeInTheDocument();
        expect(screen.getByText('(3/7 FP)')).toBeInTheDocument();
        expect(screen.getByText(/2\/13 Stacks/)).toBeInTheDocument();
        expect(screen.getByText('Set Fortune (FP)')).toBeInTheDocument();
        expect(screen.getByText('Karmic Debt Management')).toBeInTheDocument();
        expect(screen.getByText('Roll d20')).toBeInTheDocument();

        // Ensure draggable spells section is NOT present (only Minstrel has draggable spells from menu)
        expect(screen.queryByText('Fate Spells (Drag to Action Bar)')).not.toBeInTheDocument();
        expect(screen.queryByText('Lucky Strike')).not.toBeInTheDocument();

        // Ensure there is NO talent spec switcher
        expect(screen.queryByText('SPECIALIZATION PATH')).not.toBeInTheDocument();

        // Click +1 FP button
        const plusFpBtn = screen.getByText('+1 FP');
        fireEvent.click(plusFpBtn);
        expect(onUpdate).toHaveBeenCalledWith('current', 4);

        // Click +1 Debt button
        const plusDebtBtn = screen.getByText('+1 Debt');
        fireEvent.click(plusDebtBtn);
        expect(onUpdate).toHaveBeenCalledWith('debt', 3);
    });

    it('renders correctly through ClassResourceBar router for Gambit class', () => {
        const { container } = render(
            <ClassResourceBar
                characterClass="Gambit"
                classResource={{ current: 5, max: 7, debt: 1 }}
                isOwner={true}
            />
        );

        expect(container.querySelectorAll('.gambit-coin-slot.filled').length).toBe(5);
        expect(container.querySelectorAll('.gambit-debt-card.filled').length).toBe(1);
    });
});
