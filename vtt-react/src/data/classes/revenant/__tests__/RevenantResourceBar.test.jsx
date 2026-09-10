import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RevenantResourceBar, { TOLL_TIERS, getTollTier } from '../components/RevenantResourceBar';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';

describe('RevenantResourceBar Component', () => {
    const mockConfig = {
        mechanics: {
            toll: { max: 20 },
            phylactery: { max: 50 }
        }
    };

    it('renders the master vector apparatus with Basalt Phylactery, 20 Crypt Ribs, and Skull Seal', () => {
        const { container } = render(
            <RevenantResourceBar
                classResource={{ toll: 3, current: 3, phylacteryHP: 50, deathShroud: false }}
                config={mockConfig}
                isOwner={true}
            />
        );

        expect(container.querySelector('.revenant-apparatus-svg')).toBeInTheDocument();
        expect(container.querySelector('.rev-phylactery-module')).toBeInTheDocument();
        expect(container.querySelectorAll('.rev-segment')).toHaveLength(20);
        expect(container.querySelector('.rev-shroud-seal')).toBeInTheDocument();
        expect(container.querySelector('.rev-tender-key')).toBeInTheDocument();
        expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('displays the correct volatility tier in the hover tooltip across Toll levels', () => {
        const { container, rerender } = render(
            <RevenantResourceBar
                classResource={{ toll: 2, current: 2, phylacteryHP: 50 }}
                config={mockConfig}
            />
        );
        fireEvent.mouseEnter(container.querySelector('.revenant-resource-bar'));
        expect(screen.getAllByText(/Stasis/i).length).toBeGreaterThan(0);

        rerender(
            <RevenantResourceBar
                classResource={{ toll: 8, current: 8, phylacteryHP: 50 }}
                config={mockConfig}
            />
        );
        expect(screen.getAllByText(/Searing/i).length).toBeGreaterThan(0);

        rerender(
            <RevenantResourceBar
                classResource={{ toll: 14, current: 14, phylacteryHP: 50 }}
                config={mockConfig}
            />
        );
        expect(screen.getAllByText(/Rot Surge/i).length).toBeGreaterThan(0);

        rerender(
            <RevenantResourceBar
                classResource={{ toll: 18, current: 18, phylacteryHP: 50 }}
                config={mockConfig}
            />
        );
        expect(screen.getAllByText(/Cataclysm/i).length).toBeGreaterThan(0);
    });

    it('steps Toll up and down using arrow keys', () => {
        const handleUpdate = jest.fn();
        const { container } = render(
            <RevenantResourceBar
                classResource={{ toll: 5, current: 5, phylacteryHP: 50 }}
                config={mockConfig}
                isOwner={true}
                onClassResourceUpdate={handleUpdate}
            />
        );

        const bar = container.querySelector('.revenant-resource-bar');
        fireEvent.keyDown(bar, { key: 'ArrowRight' });
        expect(handleUpdate).toHaveBeenCalledWith('toll', 6);
        expect(handleUpdate).toHaveBeenCalledWith('current', 6);

        fireEvent.keyDown(bar, { key: 'ArrowLeft' });
        expect(handleUpdate).toHaveBeenCalledWith('toll', 4);
    });

    it('clicks a crypt rib to jump directly to that Toll value', () => {
        const handleUpdate = jest.fn();
        const { container } = render(
            <RevenantResourceBar
                classResource={{ toll: 5, current: 5, phylacteryHP: 50 }}
                config={mockConfig}
                isOwner={true}
                onClassResourceUpdate={handleUpdate}
            />
        );

        // Rib 10 is at index 9
        const rib10 = container.querySelectorAll('.rev-segment')[9];
        fireEvent.click(rib10);
        expect(handleUpdate).toHaveBeenCalledWith('toll', 10);
    });

    it('toggles Death Shroud skull seal when clicked', () => {
        const handleUpdate = jest.fn();
        const { container } = render(
            <RevenantResourceBar
                classResource={{ toll: 5, current: 5, phylacteryHP: 50, deathShroud: false }}
                config={mockConfig}
                isOwner={true}
                onClassResourceUpdate={handleUpdate}
            />
        );

        const skullSeal = container.querySelector('.rev-shroud-seal');
        fireEvent.click(skullSeal);
        expect(handleUpdate).toHaveBeenCalledWith('deathShroud', true);
    });

    it('adjusts Basalt Phylactery soul HP on click', () => {
        const handleUpdate = jest.fn();
        const { container } = render(
            <RevenantResourceBar
                classResource={{ toll: 5, current: 5, phylacteryHP: 20 }}
                config={mockConfig}
                isOwner={true}
                onClassResourceUpdate={handleUpdate}
            />
        );

        const phylacteryModule = container.querySelector('.rev-phylactery-module');
        fireEvent.click(phylacteryModule);
        expect(handleUpdate).toHaveBeenCalledWith('phylacteryHP', 30);
    });

    it('opens the Tactical Tender modal via the crypt key and executes presets', () => {
        const handleUpdate = jest.fn();
        const { container } = render(
            <RevenantResourceBar
                classResource={{ toll: 5, current: 5, phylacteryHP: 50 }}
                config={mockConfig}
                isOwner={true}
                onClassResourceUpdate={handleUpdate}
            />
        );

        const tenderKey = container.querySelector('.rev-tender-key');
        fireEvent.click(tenderKey);

        expect(screen.getByText('Tombcraft Tactical Tender')).toBeInTheDocument();
        expect(screen.getByText('Dry Veins (0)')).toBeInTheDocument();
        expect(screen.getByText('Cataclysm (20)')).toBeInTheDocument();

        // Click Cataclysm preset
        fireEvent.click(screen.getByText('Cataclysm (20)'));
        expect(handleUpdate).toHaveBeenCalledWith('toll', 20);
    });

    it('triggers Glacial Nova from the Tender modal', () => {
        const handleUpdate = jest.fn();
        const { container } = render(
            <RevenantResourceBar
                classResource={{ toll: 18, current: 18, phylacteryHP: 50 }}
                config={mockConfig}
                isOwner={true}
                onClassResourceUpdate={handleUpdate}
            />
        );

        // Open tender key
        fireEvent.click(container.querySelector('.rev-tender-key'));

        const novaBtn = screen.getByTitle(/Drains phylactery upon lethal damage/i);
        fireEvent.click(novaBtn);

        expect(handleUpdate).toHaveBeenCalledWith('phylacteryHP', 50);
        expect(handleUpdate).toHaveBeenCalledWith('toll', 0);
    });

    it('renders seamlessly through parent ClassResourceBar for characterClass="Revenant"', () => {
        const { container } = render(
            <ClassResourceBar
                characterClass="Revenant"
                classResource={{
                    type: 'revenant-toll',
                    current: 7,
                    max: 20,
                    toll: 7,
                    maxToll: 20,
                    phylacteryHP: 50,
                    maxPhylacteryHP: 50,
                    deathShroud: false
                }}
                isOwner={true}
            />
        );

        expect(container.querySelector('.revenant-apparatus-svg')).toBeInTheDocument();
        expect(container.querySelectorAll('.rev-segment')).toHaveLength(20);
    });
});
