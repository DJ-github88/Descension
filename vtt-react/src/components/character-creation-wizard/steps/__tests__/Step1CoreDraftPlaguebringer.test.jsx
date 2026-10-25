import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Step1CoreDraft from '../Step1CoreDraft';
import { CharacterWizardProvider } from '../../context/CharacterWizardContext';
import { SpellLibraryProvider } from '../../../../components/spellcrafting-wizard/context/SpellLibraryContext';

jest.mock('../../../../services/firebase/uploadService', () => ({
    uploadAsset: jest.fn().mockResolvedValue({ success: true, url: 'test.jpg' })
}));

describe('Step1CoreDraft Plaguebringer catalogue entry', () => {
    test('shows core grants and one optional starting pick', () => {
        render(
            <SpellLibraryProvider>
                <CharacterWizardProvider>
                    <Step1CoreDraft />
                </CharacterWizardProvider>
            </SpellLibraryProvider>
        );

        fireEvent.click(screen.getByLabelText('Plaguebringer'));

        expect(screen.getByText('Plaguebringer Calling Chosen')).toBeTruthy();
        expect(screen.getByText('0 of 1 chosen')).toBeTruthy();

        fireEvent.click(screen.getByTitle('Choose starting spells'));

        const grantedLabel = screen.getByText('Granted by calling:');
        expect(grantedLabel.parentElement.textContent).toContain('Wasting Curse');
        expect(grantedLabel.parentElement.textContent).toContain('Whisper of Decay');
        expect(screen.getByText('0 / 1 selected')).toBeTruthy();
        expect(screen.getByRole('button', { name: /Confirm Spells/ }).disabled).toBe(true);

        fireEvent.click(screen.getAllByText('Venomous Touch')[0]);
        fireEvent.click(screen.getByRole('button', { name: /Add to Spells/ }));

        expect(screen.getByText('1 / 1 selected')).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Confirm Spells' }).disabled).toBe(false);
    });
});
