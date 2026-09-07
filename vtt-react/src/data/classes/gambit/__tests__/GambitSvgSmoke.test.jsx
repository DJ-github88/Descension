import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import GambitResourceBar from '../components/GambitResourceBar';

describe('Gambit vector apparatus smoke', () => {
    it('renders master SVG with 7 coin slots and 13 debt slots', () => {
        const { container } = render(
            <GambitResourceBar
                classResource={{ current: 4, max: 7, debt: 5 }}
                isOwner
            />
        );
        const masterSvg = container.querySelector('.gambit-master-svg');
        expect(masterSvg).toBeInTheDocument();
        expect(masterSvg.getAttribute('viewBox')).toBe('0 0 292 76');
        expect(container.querySelectorAll('.gambit-coin-slot').length).toBe(7);
        expect(container.querySelectorAll('.gambit-debt-card').length).toBe(13);
        // 4 lit coin slots, 5 lit debt cards
        expect(container.querySelectorAll('.gambit-coin-slot.filled').length).toBe(4);
        expect(container.querySelectorAll('.gambit-debt-card.filled').length).toBe(5);
    });

    it('clicking a coin sets FP directly', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <GambitResourceBar
                classResource={{ current: 2, max: 7, debt: 0 }}
                isOwner
                onClassResourceUpdate={onUpdate}
            />
        );
        const coins = container.querySelectorAll('.gambit-coin-slot');
        fireEvent.click(coins[5]); // 6th coin -> 6 FP
        expect(onUpdate).toHaveBeenCalledWith('current', 6);
    });

    it('clicking a debt card sets debt directly', () => {
        const onUpdate = jest.fn();
        const { container } = render(
            <GambitResourceBar
                classResource={{ current: 3, max: 7, debt: 2 }}
                isOwner
                onClassResourceUpdate={onUpdate}
            />
        );
        const debtCards = container.querySelectorAll('.gambit-debt-card');
        fireEvent.click(debtCards[9]); // 10th card -> 10 debt
        expect(onUpdate).toHaveBeenCalledWith('debt', 10);
    });

    it('flags bust and near-collapse states on the wrapper', () => {
        const { container } = render(
            <GambitResourceBar
                classResource={{ current: 0, max: 7, debt: 12 }}
                isOwner
            />
        );
        const wrapper = container.querySelector('.gambit-resource-wrapper');
        expect(wrapper.classList.contains('bust-active')).toBe(true);
        expect(wrapper.classList.contains('collapse-active')).toBe(true);
    });

    it('clicking center die triggers dice roll combat notification', () => {
        const { container } = render(
            <GambitResourceBar
                classResource={{ current: 4, max: 7, debt: 2 }}
                isOwner
            />
        );
        const centerpiece = container.querySelector('.gambit-centerpiece');
        expect(centerpiece).toBeInTheDocument();
        fireEvent.click(centerpiece);
    });
});
