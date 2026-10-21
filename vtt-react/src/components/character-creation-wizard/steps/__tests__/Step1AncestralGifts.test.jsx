/**
 * Ancestral Gifts UI in Step 1 (launcher, drawer picker, Codex block) and Step 9 Summary.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Step1CoreDraft from '../Step1CoreDraft';
import Step9CharacterSummary from '../Step9CharacterSummary';
import { CharacterWizardProvider } from '../../context/CharacterWizardContext';
import { SpellLibraryProvider } from '../../../spellcrafting-wizard/context/SpellLibraryContext';

jest.mock('../../../../services/firebase/uploadService', () => ({
    uploadAsset: jest.fn().mockResolvedValue({ success: true, url: 'test.jpg' }),
}));

describe('Step 1 & Summary — Ancestral Gifts UI', () => {
    test('Ancestral Gifts launcher appears for Groven heritages, opens drawer, and selects 3 gifts', () => {
        render(
            <SpellLibraryProvider>
                <CharacterWizardProvider>
                    <Step1CoreDraft />
                    <Step9CharacterSummary />
                </CharacterWizardProvider>
            </SpellLibraryProvider>
        );

        // Launcher is visible but disabled before selecting a heritage
        const initialLauncher = screen.getByTestId('ancestral-gifts-launcher');
        expect(initialLauncher).toBeInTheDocument();
        expect(initialLauncher).toBeDisabled();
        expect(initialLauncher).toHaveTextContent('Choose a lineage first');

        // Click Groven race token
        const grovenToken = screen.getByText('Groven').closest('.race-button-token');
        fireEvent.click(grovenToken);

        // Click Amordjin (ithran_groven) subrace card
        const amordjinCard = screen.getByText('Amordjin').closest('.rpg-subrace-card');
        fireEvent.click(amordjinCard);

        // Launcher appears with 0 of 3 chosen
        const launcher = screen.getByTestId('ancestral-gifts-launcher');
        expect(launcher).toBeInTheDocument();
        expect(launcher).toHaveTextContent('0 of 3 chosen');

        // Summary checklist shows Ancestral Gifts (one per row) incomplete
        const checklistRow = screen.getByText('Ancestral Gifts (one per row)').closest('.hover-check-item');
        expect(checklistRow).toHaveClass('incomplete');

        // Open the drawer
        fireEvent.click(launcher);
        const dialog = screen.getByRole('dialog', { name: 'Ancestral Gifts' });
        expect(dialog).toBeInTheDocument();

        // Confirm button disabled while incomplete
        const confirmBtn = screen.getByRole('button', { name: /Confirm Gifts \(Need 3\)/i });
        expect(confirmBtn).toBeDisabled();

        // Pick one gift in each of the 3 rows directly by clicking each power button
        fireEvent.click(dialog.querySelector('[data-gift="ithran_chasm_leap"]'));
        fireEvent.click(dialog.querySelector('[data-gift="toll_keepers_eye"]'));
        fireEvent.click(dialog.querySelector('[data-gift="fiber_cord_snare_ithran"]'));

        // Launcher now shows 3 of 3 chosen and Confirm button is enabled
        expect(launcher).toHaveTextContent('3 of 3 chosen');
        expect(confirmBtn).not.toBeDisabled();
        fireEvent.click(confirmBtn);
        expect(screen.queryByRole('dialog', { name: 'Ancestral Gifts' })).not.toBeInTheDocument();

        // Summary checklist row is now complete and lists the chosen gifts
        expect(screen.getByText('Ancestral Gifts (one per row)').closest('.hover-check-item')).toHaveClass('complete');
        expect(screen.getByTestId('summary-ancestral-gifts')).toHaveTextContent('Vat-Knit Flesh');
        expect(screen.getByTestId('summary-ancestral-gifts')).toHaveTextContent('Chasm Leap');
    });

    test('every heritage now offers gifts: Tallyn Human shows its core and three rows', () => {
        render(
            <SpellLibraryProvider>
                <CharacterWizardProvider>
                    <Step1CoreDraft />
                </CharacterWizardProvider>
            </SpellLibraryProvider>
        );

        fireEvent.click(screen.getByText('Human').closest('.race-button-token'));
        fireEvent.click(screen.getByText('Tallyn').closest('.rpg-subrace-card'));

        const launcher = screen.getByTestId('ancestral-gifts-launcher');
        expect(launcher).not.toBeDisabled();
        expect(launcher).toHaveTextContent('0 of 3 chosen');

        fireEvent.click(launcher);
        const dialog = screen.getByRole('dialog', { name: 'Ancestral Gifts' });
        expect(dialog).toHaveTextContent('Desperate Will');
        expect(dialog.querySelectorAll('.ancestral-choice-row')).toHaveLength(3);

        fireEvent.click(dialog.querySelector('[data-gift="lineage_recall_thalren"]'));
        fireEvent.click(dialog.querySelector('[data-gift="fog_step_thalren"]'));
        fireEvent.click(dialog.querySelector('[data-gift="thalren_archivists_gaze"]'));
        expect(launcher).toHaveTextContent('3 of 3 chosen');

        fireEvent.click(dialog.querySelector('.drawer-close-btn'));
        expect(screen.queryByRole('dialog', { name: 'Ancestral Gifts' })).not.toBeInTheDocument();
    });

    test('hovering a gift opens a scrollable spellcard tooltip without mojibake characters', () => {
        render(
            <SpellLibraryProvider>
                <CharacterWizardProvider>
                    <Step1CoreDraft />
                </CharacterWizardProvider>
            </SpellLibraryProvider>
        );

        fireEvent.click(screen.getByText('Human').closest('.race-button-token'));
        fireEvent.click(screen.getByText('Tallyn').closest('.rpg-subrace-card'));

        const launcher = screen.getByTestId('ancestral-gifts-launcher');
        fireEvent.click(launcher);

        const dialog = screen.getByRole('dialog', { name: 'Ancestral Gifts' });
        expect(dialog).toBeInTheDocument();

        // Check header clean styling (no Â·, ÂCE•, Â[], etc.)
        const closeBtn = dialog.querySelector('.drawer-close-btn');
        expect(closeBtn.querySelector('i.fa-times')).toBeInTheDocument();
        const diamond = dialog.querySelector('.ancestral-header-ornament i.fa-diamond');
        expect(diamond).toBeInTheDocument();

        // Row label format is clean
        const row1 = dialog.querySelector('.ancestral-row-name');
        expect(row1.textContent).toMatch(/Row 1/);
        expect(row1.textContent).not.toMatch(/Â/);

        // Hover over an option to display the floating tooltip
        const cardOption = dialog.querySelector('[data-gift="lineage_recall_thalren"]');
        fireEvent.mouseEnter(cardOption);

        const tooltip = document.querySelector('.ancestral-floating-tooltip');
        expect(tooltip).toBeInTheDocument();
        const scrollable = tooltip.querySelector('.ancestral-tooltip-scrollable');
        expect(scrollable).toBeInTheDocument();

        // Test wheel event forwarding
        fireEvent.wheel(cardOption, { deltaY: 50 });

        // Tooltip mouse enter / leave lifecycle
        fireEvent.mouseEnter(tooltip);
        fireEvent.mouseLeave(tooltip);
    });
});
