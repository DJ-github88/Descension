import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HarbingerResourceBar from '../components/HarbingerResourceBar';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';

describe('HarbingerResourceBar Component', () => {
    it('renders the illustrated Harbinger bar with 10 rune slots and base asset', () => {
        render(
            <HarbingerResourceBar
                classResource={{ current: 3, max: 10 }}
                isOwner={true}
            />
        );

        const baseImg = screen.getByAltText('Harbinger Bar Base');
        expect(baseImg).toBeInTheDocument();
        expect(baseImg).toHaveAttribute('src', '/assets/ui/classes/harbinger/Empty Bar.PNG');

        // Check that all 10 rune stages are rendered
        for (let i = 1; i <= 10; i++) {
            expect(screen.getByAltText(`Unlit Stage ${i}`)).toBeInTheDocument();
            expect(screen.getByAltText(`Lit Stage ${i}`)).toBeInTheDocument();
        }
    });

    it('renders unified context menu with level grid and Wild Surge trigger without talent spec selector', () => {
        const onUpdate = jest.fn();
        render(
            <HarbingerResourceBar
                classResource={{ current: 5, max: 10 }}
                isOwner={true}
                onClassResourceUpdate={onUpdate}
            />
        );

        // Click bar to open unified context menu
        const bar = screen.getByAltText('Harbinger Bar Base').closest('.harbinger-resource-bar');
        fireEvent.click(bar);

        expect(screen.getByText('Harbinger Mayhem Controls')).toBeInTheDocument();
        expect(screen.getByText('Set Mayhem Level')).toBeInTheDocument();
        expect(screen.getByText('Roll d100 Master Wild Surge')).toBeInTheDocument();

        // Ensure there is NO specialization switcher per user rule
        expect(screen.queryByText('SPECIALIZATION PATH')).not.toBeInTheDocument();

        // Click +1 step
        const plusBtn = screen.getByText('+1');
        fireEvent.click(plusBtn);
        expect(onUpdate).toHaveBeenCalledWith('current', 6);

        // Click Level 8 button
        const lvl8Btn = screen.getByText('8');
        fireEvent.click(lvl8Btn);
        expect(onUpdate).toHaveBeenCalledWith('current', 8);
    });

    it('renders correctly through ClassResourceBar router', () => {
        render(
            <ClassResourceBar
                characterClass="Harbinger"
                classResource={{ current: 7, max: 10 }}
                isOwner={true}
            />
        );

        expect(screen.getByAltText('Harbinger Bar Base')).toBeInTheDocument();
        expect(screen.getByAltText('Unlit Stage 7')).toBeInTheDocument();
    });
});
