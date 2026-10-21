import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Step1CoreDraft from '../Step1CoreDraft';
import { CharacterWizardProvider } from '../../context/CharacterWizardContext';

jest.mock('../../../../services/firebase/uploadService', () => ({
    uploadAsset: jest.fn().mockResolvedValue({ success: true, url: 'test.jpg' })
}));

describe('Step1CoreDraft Fate Weaver catalogue entry', () => {
    test('renders the class token and opens its acquisition editor', () => {
        render(
            <CharacterWizardProvider>
                <Step1CoreDraft />
            </CharacterWizardProvider>
        );

        const token = screen.getByLabelText('Fate Weaver');
        fireEvent.click(token);

        expect(screen.getByText('Class acquisition & current interface')).toBeTruthy();
        expect(screen.getByText('Fate Weaver Calling Chosen')).toBeTruthy();
    });
});
