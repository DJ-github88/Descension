import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Step1CoreDraft from '../Step1CoreDraft';
import { CharacterWizardProvider } from '../../context/CharacterWizardContext';

jest.mock('../../../../services/firebase/uploadService', () => ({
    uploadAsset: jest.fn().mockResolvedValue({ success: true, url: 'test.jpg' }),
}));

describe('Step1CoreDraft 1995 RPG / WoW Classic Subrace Cards', () => {
    const renderStep1 = () => {
        return render(
            <CharacterWizardProvider>
                <Step1CoreDraft />
            </CharacterWizardProvider>
        );
    };

    test('renders heraldic main race tokens', () => {
        renderStep1();

        // Myrathil race token
        const myrathilToken = screen.getByText('Myrathil').closest('.race-button-token');
        expect(myrathilToken).toBeInTheDocument();
        expect(myrathilToken.querySelector('.race-token-sigil')).toBeInTheDocument();
    });

    test('clicking a race transitions to the RPG subrace selection view with breadcrumb bar', () => {
        renderStep1();

        const myrathilLabel = screen.getByText('Myrathil');
        const myrathilToken = myrathilLabel.closest('.race-button-token');
        fireEvent.click(myrathilToken);

        // Check breadcrumb bar
        const backBtn = screen.getByRole('button', { name: /All Races/i });
        expect(backBtn).toBeInTheDocument();

        // Check subrace cards container
        const subraceGrid = document.querySelector('.subrace-buttons-grid');
        expect(subraceGrid).toBeInTheDocument();

        // Should render tactile RPG cards for Myrathil subraces: Corali, Nereid, Ondine
        expect(screen.getByText('Corali')).toBeInTheDocument();
        expect(screen.getByText('Nereid')).toBeInTheDocument();
        expect(screen.getByText('Ondine')).toBeInTheDocument();

        // Check epithet titles
        expect(screen.getByText('Spindrift Diplomats')).toBeInTheDocument();
        expect(screen.getByText('Abyssal Mystics')).toBeInTheDocument();
        expect(screen.getByText('Estuary Wayfarers')).toBeInTheDocument();

        // Check gothic square portrait slot on left
        const cards = document.querySelectorAll('.rpg-subrace-card');
        expect(cards.length).toBe(3);
        cards.forEach(card => {
            const portraitSlot = card.querySelector('.subrace-portrait-slot');
            expect(portraitSlot).toBeInTheDocument();
            expect(portraitSlot.querySelector('.subrace-portrait-frame')).toBeInTheDocument();
            expect(portraitSlot.querySelectorAll('.subrace-frame-corner').length).toBe(4);

            // Watermark is present in the card background
            expect(card.querySelector('.subrace-crest-watermark')).toBeInTheDocument();
            // Extra badge on the side is removed
            expect(card.querySelector('.subrace-card-crest-badge')).not.toBeInTheDocument();
        });

        // Check color-coded stat pills on Corali card (CHA +2, AGI +2, SPI +1, STR -2)
        const coraliCard = screen.getByText('Corali').closest('.rpg-subrace-card');
        const posPills = coraliCard.querySelectorAll('.rpg-stat-pill.pos');
        const negPills = coraliCard.querySelectorAll('.rpg-stat-pill.neg');
        expect(posPills.length).toBeGreaterThanOrEqual(3); // +2 CHA, +2 AGI, +1 SPI
        expect(negPills.length).toBeGreaterThanOrEqual(1); // -2 STR

        // Check flavour / summary text
        expect(coraliCard.querySelector('.subrace-card-flavor')).toBeInTheDocument();
    });

    test('selecting a subrace card applies selected state and allows returning to all races', () => {
        renderStep1();

        // Open Myrathil subraces
        const myrathilToken = screen.getByText('Myrathil').closest('.race-button-token');
        fireEvent.click(myrathilToken);

        // Click Corali card
        const coraliCard = screen.getByText('Corali').closest('.rpg-subrace-card');
        fireEvent.click(coraliCard);

        // Card should have selected class and ribbon
        expect(coraliCard).toHaveClass('selected');
        expect(coraliCard.querySelector('.subrace-card-selected-ribbon')).toBeInTheDocument();

        // Click Back to Races button
        const backBtn = screen.getByRole('button', { name: /All Races/i });
        fireEvent.click(backBtn);

        // Should return to main race grid
        expect(screen.getByText('Myrathil')).toBeInTheDocument();
        expect(screen.getByText('Mimir')).toBeInTheDocument();
        expect(screen.getByText('Human')).toBeInTheDocument();
    });

    test('renders subrace artwork image in portrait slot and transitions cleanly on load', () => {
        renderStep1();

        const myrathilToken = screen.getByText('Myrathil').closest('.race-button-token');
        fireEvent.click(myrathilToken);

        const coraliCard = screen.getByText('Corali').closest('.rpg-subrace-card');
        const img = coraliCard.querySelector('.subrace-portrait-img');
        expect(img).toBeInTheDocument();
        expect(img.getAttribute('src')).toMatch(/\/assets\/icons\/subraces\/(medium\/)?shoreling_myrathil\.png/);
        expect(img.getAttribute('loading')).not.toBe('lazy');
        expect(img.style.display).not.toBe('none');

        // Initially loading class is present
        expect(img).toHaveClass('loading');

        // Simulate successful image load
        fireEvent.load(img);
        expect(img).toHaveClass('loaded');
        expect(coraliCard.querySelector('.subrace-portrait-fallback-sigil')).not.toBeInTheDocument();
    });
});
