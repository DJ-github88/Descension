import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GambitResourceBar from '../components/GambitResourceBar';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';

describe('GambitResourceBar Component (Dual Split Bar)', () => {
    it('renders the dual split bar with Fortune on left and Karmic Debt on right', () => {
        render(
            <GambitResourceBar
                classResource={{ current: 4, max: 7, debt: 5 }}
                isOwner={true}
            />
        );

        expect(screen.getByText('Fortune: 4/7')).toBeInTheDocument();
        expect(screen.getByText('Debt: 5/13')).toBeInTheDocument();
        expect(screen.getByText('♦')).toBeInTheDocument();
    });

    it('renders unified context menu with Fortune and Karmic Debt controls without spec selector', () => {
        const onUpdate = jest.fn();
        render(
            <GambitResourceBar
                classResource={{ current: 3, max: 7, debt: 2 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        // Click bar to open unified context menu
        const barContainer = screen.getByText('Fortune: 3/7').closest('.gambit-dual-bar-container');
        fireEvent.click(barContainer);

        expect(screen.getByText('Gambit Fortune & Debt Ledger')).toBeInTheDocument();
        expect(screen.getByText('Set Fortune (FP)')).toBeInTheDocument();
        expect(screen.getByText('Karmic Debt Management')).toBeInTheDocument();
        expect(screen.getByText('Roll d20')).toBeInTheDocument();

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
        render(
            <ClassResourceBar
                characterClass="Gambit"
                classResource={{ current: 5, max: 7, debt: 1 }}
                isOwner={true}
            />
        );

        expect(screen.getByText('Fortune: 5/7')).toBeInTheDocument();
        expect(screen.getByText('Debt: 1/13')).toBeInTheDocument();
    });
});
