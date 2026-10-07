import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Step1CoreDraft from '../Step1CoreDraft';
import { CharacterWizardProvider } from '../../context/CharacterWizardContext';

jest.mock('../../../../services/firebase/uploadService', () => ({
    uploadAsset: jest.fn().mockResolvedValue({ success: true, url: 'test.jpg' }),
}));

describe('Step1CoreDraft Multidirectional Narrowing', () => {
    const renderStep1 = () => {
        return render(
            <CharacterWizardProvider>
                <Step1CoreDraft />
            </CharacterWizardProvider>
        );
    };

    test('renders Rite I, II, and III headers with draft status', () => {
        renderStep1();
        expect(screen.getByRole('heading', { level: 3, name: 'Heritage' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: 'Calling' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: 'Origin' })).toBeInTheDocument();
    });

    test('selecting a class without heritage narrows native homelands and origins', () => {
        renderStep1();
        
        // Find Crusader class token
        const crusaderToken = screen.getByLabelText('Crusader');
        expect(crusaderToken).toBeInTheDocument();
        
        fireEvent.click(crusaderToken);
        
        // Should show Native Homelands section
        expect(screen.getByText('Native Homelands & Lineages')).toBeInTheDocument();
        // Should show Other Homelands collapsible toggle
        expect(screen.getByText(/Other Homelands \(Rare \/ Narrative Exceptions\)/i)).toBeInTheDocument();

        // Origin section should show "Thematic Origins (Crusader)"
        expect(screen.getByText(/Thematic Origins \(Crusader\)/i)).toBeInTheDocument();
    });

    test('clicking the clear button on Rite II clears the class filter', () => {
        renderStep1();
        
        const crusaderToken = screen.getByLabelText('Crusader');
        fireEvent.click(crusaderToken);
        expect(screen.getByText('Native Homelands & Lineages')).toBeInTheDocument();

        // Find clear button for Calling (title="Clear Calling selection")
        const clearCallingBtn = screen.getByTitle('Clear Calling selection');
        expect(clearCallingBtn).toBeInTheDocument();
        fireEvent.click(clearCallingBtn);

        // Native Homelands should no longer be filtered
        expect(screen.queryByText('Native Homelands & Lineages')).not.toBeInTheDocument();
        expect(screen.getByText('All Origins')).toBeInTheDocument();
    });

    test('selecting a background without heritage or class narrows homelands and callings', () => {
        renderStep1();

        // Select an origin (find Pilgrim token specifically by class or label)
        const pilgrimTokens = screen.getAllByText('Pilgrim');
        const tokenElement = pilgrimTokens.find(el => el.classList.contains('background-token-label'));
        expect(tokenElement).toBeTruthy();
        fireEvent.click(tokenElement);

        // Calling should now be thematic to Pilgrim
        expect(screen.getByText(/Thematic Callings \(Pilgrim\)/i)).toBeInTheDocument();

        // Deselecting Pilgrim restores All Callings
        fireEvent.click(tokenElement);
        expect(screen.getByText('All Callings')).toBeInTheDocument();
    });
});
