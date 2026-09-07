import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ArcanoneerResourceBar from '../components/ArcanoneerResourceBar';
import useCharacterStore from '../../../../store/characterStore';

describe('ArcanoneerResourceBar Component', () => {
    const mockConfig = {
        mechanics: { max: 12 },
        elements: [
            { id: 'arcane', name: 'Arcane', color: '#9370DB', d8Value: 1, theme: 'Raw Magic', summary: 'Force damage' },
            { id: 'sacred', name: 'Sacred', color: '#FFD700', d8Value: 2, theme: 'Divine Light', summary: 'Divine damage' },
            { id: 'blight', name: 'Blight', color: '#8b5cf6', d8Value: 3, theme: 'Darkness', summary: 'Blight damage' },
            { id: 'ember', name: 'Ember', color: '#FF4500', d8Value: 4, theme: 'Flames', summary: 'Fire damage' },
            { id: 'rime', name: 'Rime', color: '#38bdf8', d8Value: 5, theme: 'Frost', summary: 'Cold damage' },
            { id: 'primal', name: 'Primal', color: '#22c55e', d8Value: 6, theme: 'Storm & Growth', summary: 'Lightning & vines' },
            { id: 'storm', name: 'Storm', color: '#06b6d4', d8Value: 7, theme: 'Lightning', summary: 'Chain lightning' },
            { id: 'wyrd', name: 'Wyrd', color: '#f43f5e', d8Value: 8, theme: 'Chaos', summary: 'Wild magic' },
        ],
        combinationMatrix: {
            entries: [
                { id: 'fire_fire', name: 'Flame Burst', elements: ['ember', 'ember'] },
                { id: 'fire_ice', name: 'Steam Vent', elements: ['ember', 'rime'] }
            ]
        }
    };

    it('renders the master SVG apparatus with 8 themed elemental orbs', () => {
        const { container } = render(
            <ArcanoneerResourceBar
                classResource={{ spheres: ['ember', 'rime'] }}
                config={mockConfig}
                context="party"
                isOwner={true}
            />
        );

        expect(container.querySelector('.arc-master-svg')).toBeInTheDocument();
        expect(container.querySelectorAll('.arc-orb-cell')).toHaveLength(8);
        expect(screen.getByText('CHAMBER')).toBeInTheDocument();
        expect(screen.getByText('2/12')).toBeInTheDocument();
    });

    it('renders the ROLL 4d8 kinetic ignition trigger button', () => {
        render(
            <ArcanoneerResourceBar
                classResource={{ spheres: [] }}
                config={mockConfig}
                context="party"
                isOwner={true}
            />
        );

        expect(screen.getByText('ROLL 4d8')).toBeInTheDocument();
    });

    it('toggles the combination matrix popup modal when clicking the MATRIX button', () => {
        render(
            <ArcanoneerResourceBar
                classResource={{ spheres: ['ember', 'rime'] }}
                config={mockConfig}
                context="party"
                isOwner={true}
            />
        );

        const matrixBtn = screen.getByText(/MATRIX/i);
        expect(matrixBtn).toBeInTheDocument();

        // Click MATRIX button
        fireEvent.click(matrixBtn);

        // Modal should now appear in portal
        expect(screen.getByText('COMBINATION MATRIX')).toBeInTheDocument();
        expect(screen.getByText('Steam Vent')).toBeInTheDocument();

        // Close modal
        const closeBtn = screen.getByText('✕');
        fireEvent.click(closeBtn);
        expect(screen.queryByText('COMBINATION MATRIX')).not.toBeInTheDocument();
    });

    it('triggers onClassResourceUpdate when clicking an orb to add or right clicking to remove', () => {
        const handleUpdate = jest.fn();
        const { container } = render(
            <ArcanoneerResourceBar
                classResource={{ spheres: ['ember'] }}
                config={mockConfig}
                context="party"
                isOwner={true}
                onClassResourceUpdate={handleUpdate}
            />
        );

        const emberOrb = container.querySelectorAll('.arc-orb-cell')[3]; // Ember is index 3
        fireEvent.click(emberOrb);
        expect(handleUpdate).toHaveBeenCalledWith('spheres', ['ember', 'ember']);

        fireEvent.contextMenu(emberOrb);
        expect(handleUpdate).toHaveBeenCalledWith('spheres', ['ember']);
    });

    it('prompts SpellCastConfirmation when clicking a spell in the combination matrix and deducts spheres on cast', () => {
        useCharacterStore.setState({
            mana: { current: 50, max: 50 },
            actionPoints: { current: 3, max: 3 },
        });
        const handleUpdate = jest.fn();
        render(
            <ArcanoneerResourceBar
                classResource={{ spheres: ['ember', 'rime'] }}
                config={mockConfig}
                context="party"
                isOwner={true}
                onClassResourceUpdate={handleUpdate}
            />
        );

        // Open matrix
        fireEvent.click(screen.getByText(/MATRIX/i));
        expect(screen.getByText('COMBINATION MATRIX')).toBeInTheDocument();

        // Click Steam Vent card
        const steamVent = screen.getByText('Steam Vent');
        fireEvent.click(steamVent);

        // SpellCastConfirmation popup should appear
        expect(screen.getByText('Cast Spell')).toBeInTheDocument();
        expect(screen.getAllByText('Steam Vent').length).toBeGreaterThan(0);

        // Confirm cast
        const castBtn = screen.getByRole('button', { name: 'Cast' });
        expect(castBtn).toBeInTheDocument();
        fireEvent.click(castBtn);

        // Confirmation should have deducted the 2 spheres (ember, rime)
        expect(handleUpdate).toHaveBeenCalledWith('spheres', []);
        expect(screen.queryByText('Cast Spell')).not.toBeInTheDocument();
    });

    it('cancels spell cast confirmation without altering spheres when cancel is clicked', () => {
        const handleUpdate = jest.fn();
        render(
            <ArcanoneerResourceBar
                classResource={{ spheres: ['ember', 'rime'] }}
                config={mockConfig}
                context="party"
                isOwner={true}
                onClassResourceUpdate={handleUpdate}
            />
        );

        // Open matrix
        fireEvent.click(screen.getByText(/MATRIX/i));

        // Click Steam Vent card
        fireEvent.click(screen.getByText('Steam Vent'));
        expect(screen.getByText('Cast Spell')).toBeInTheDocument();

        // Cancel cast
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(screen.queryByText('Cast Spell')).not.toBeInTheDocument();
        expect(handleUpdate).not.toHaveBeenCalled();
    });

    it('disables the Cast button when required elemental spheres are insufficient', () => {
        useCharacterStore.setState({
            mana: { current: 50, max: 50 },
            actionPoints: { current: 3, max: 3 },
        });
        const handleUpdate = jest.fn();
        render(
            <ArcanoneerResourceBar
                classResource={{ spheres: ['arcane'] }} // Lacks ember and rime
                config={mockConfig}
                context="party"
                isOwner={true}
                onClassResourceUpdate={handleUpdate}
            />
        );

        // Open matrix and select Flame Burst (requires ember + ember)
        fireEvent.click(screen.getByText(/MATRIX/i));
        fireEvent.click(screen.getByText('Flame Burst'));

        // Confirmation modal opens
        expect(screen.getByText('Cast Spell')).toBeInTheDocument();

        // Cast button should be disabled
        const castBtn = screen.getByRole('button', { name: 'Cast' });
        expect(castBtn).toBeDisabled();

        // Clicking disabled button should not trigger update
        fireEvent.click(castBtn);
        expect(handleUpdate).not.toHaveBeenCalled();
    });
});
