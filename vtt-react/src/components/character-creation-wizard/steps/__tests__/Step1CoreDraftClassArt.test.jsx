import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Step1CoreDraft from '../Step1CoreDraft';
import { CharacterWizardProvider } from '../../context/CharacterWizardContext';

jest.mock('../../../../services/firebase/uploadService', () => ({
    uploadAsset: jest.fn().mockResolvedValue({ success: true, url: 'test.jpg' }),
}));

const renderStep1 = () => render(
    <CharacterWizardProvider>
        <Step1CoreDraft />
    </CharacterWizardProvider>
);

const selectMycellanBedel = () => {
    fireEvent.click(screen.getByRole('button', { name: /Mycellan/ }));
    fireEvent.click(screen.getByRole('button', { name: /Bedel/ }));
};

const getClassSection = (container) => container.querySelector('.grimoire-section-calling');

describe('Step1CoreDraft class codex artwork', () => {
    test('shows the subrace-specific race x class illustration when a subrace is chosen', () => {
        const { container } = renderStep1();
        selectMycellanBedel();
        fireEvent.click(screen.getByLabelText('Animist'));

        const img = getClassSection(container).querySelector('.grimoire-class-art-image');
        expect(img).toBeTruthy();
        expect(img.getAttribute('src')).toBe('/assets/images/classes/animist_clean_vreken.jpg');
    });

    test('falls back to a race-native illustration when only the race is chosen', () => {
        const { container } = renderStep1();
        fireEvent.click(screen.getByRole('button', { name: /Mycellan/ }));
        fireEvent.click(screen.getByLabelText('Animist'));

        const img = getClassSection(container).querySelector('.grimoire-class-art-image');
        expect(img).toBeTruthy();
        expect(img.getAttribute('src')).toBe('/assets/images/classes/animist_clean_vreken.jpg');
    });

    test('matches galleries stored at the class data top level (Pyrofiend)', () => {
        const { container } = renderStep1();
        fireEvent.click(screen.getByRole('button', { name: /^Fex/ }));
        fireEvent.click(screen.getByRole('button', { name: /Brasskin/ }));
        fireEvent.click(screen.getByLabelText('Pyrofiend'));

        const img = getClassSection(container).querySelector('.grimoire-class-art-image');
        expect(img).toBeTruthy();
        expect(img.getAttribute('src')).toBe('/assets/images/classes/pyrofiend_clockwork_fexric.jpg');
    });

    test('matches top-level galleries for a second class (Spellguard)', () => {
        const { container } = renderStep1();
        fireEvent.click(screen.getByRole('button', { name: /^Human/ }));
        fireEvent.click(screen.getByRole('button', { name: /Tallyn/ }));
        fireEvent.click(screen.getByLabelText('Spellguard'));

        const img = getClassSection(container).querySelector('.grimoire-class-art-image');
        expect(img).toBeTruthy();
        expect(img.getAttribute('src')).toBe('/assets/images/classes/spellguard_thalren_human.jpg');
    });

    test('shows the subrace crest in the heritage codex header bar', () => {
        const { container } = renderStep1();
        selectMycellanBedel();

        const crest = container.querySelector('.grimoire-section-heritage .grimoire-header-crest');
        expect(crest).toBeTruthy();
        expect(crest.getAttribute('src')).toBe('/assets/images/crests/vreken_clean_crest.png');
    });
});
