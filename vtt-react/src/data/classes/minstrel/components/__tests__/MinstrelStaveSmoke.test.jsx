import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MinstrelResourceBar from '../MinstrelResourceBar';

const NOTES = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'].map((numeral, i) => ({
    numeral,
    name: `Note${i}`,
    color: '#ffd43f',
    glow: '#ffef9e',
    function: 'Test',
    description: 'desc',
    generatedBy: 'test',
}));

const SAMPLE_CADENCES = [
    {
        id: 'perfect_cadence',
        name: 'Perfect Cadence',
        sequence: 'I → IV → V → I',
        notes: { I: 2, IV: 1, V: 1 },
        effectDescription: 'Target ally deals critical strike.',
    },
    {
        id: 'deceptive_cadence',
        name: 'Deceptive Cadence',
        sequence: 'IV → VII → V → IV',
        notes: { IV: 2, VII: 1, V: 1 },
        effectDescription: 'Disorients enemies in 20ft.',
    }
];

const config = {
    visual: { notes: NOTES },
    mechanics: { maxPerNote: 5 },
    cadenceMatrix: { entries: SAMPLE_CADENCES },
};

describe('Minstrel compact stave smoke', () => {
    it('renders 7 large click-target stations across stave without G-clef in party context', () => {
        const { container } = render(
            <MinstrelResourceBar
                classResource={{ notes: [2, 0, 3, 0, 1, 0, 5] }}
                size="small"
                config={config}
                context="party"
                isOwner
            />
        );
        const svg = container.querySelector('.minstrel-stave-svg');
        expect(svg).toBeTruthy();
        expect(svg.getAttribute('viewBox')).toBe('0 0 292 76');
        // No Unicode 𝄞
        expect(svg.textContent).not.toContain('𝄞');
        // G-clef group completely removed to free up space
        expect(svg.querySelector('.minstrel-clef-group')).toBeNull();

        const stations = container.querySelectorAll('.svg-note-station');
        expect(stations.length).toBe(7);
        // Every station owns an invisible hit rect >= 26px wide
        stations.forEach((s) => {
            const hit = s.querySelector('rect');
            expect(hit).toBeTruthy();
            expect(parseFloat(hit.getAttribute('width'))).toBeGreaterThanOrEqual(26);
        });
        // Numerals legible
        const numerals = container.querySelectorAll('.svg-note-station text');
        expect(numerals.length).toBeGreaterThan(0);

        // Rosette does not render the confusing emblem icon
        expect(container.querySelector('.minstrel-cadence-seal path')).toBeNull();
    });

    it('opens Cadence Spells modal when clicking cadence rosette, showing draggable cards', () => {
        const { container } = render(
            <MinstrelResourceBar
                classResource={{ notes: [2, 0, 0, 1, 1, 0, 0] }} // Perfect Cadence requires { I: 2, IV: 1, V: 1 } -> Ready!
                size="small"
                config={config}
                context="party"
                isOwner
            />
        );

        // Click Cadence Rosette
        const seal = container.querySelector('.minstrel-cadence-seal');
        expect(seal).toBeTruthy();
        fireEvent.click(seal);

        // Modal should be open
        expect(screen.getByText('Minstrel Cadences')).toBeInTheDocument();
        expect(screen.getByText('Perfect Cadence')).toBeInTheDocument();
        expect(screen.getByText('Deceptive Cadence')).toBeInTheDocument();

        // Cards should be draggable
        const cards = document.querySelectorAll('.minstrel-cadence-entry-card');
        expect(cards.length).toBe(2);
        expect(cards[0].getAttribute('draggable')).toBe('true');

        // Check dragStart sets dataTransfer
        const setDataMock = jest.fn();
        fireEvent.dragStart(cards[0], {
            dataTransfer: {
                setData: setDataMock,
                effectAllowed: ''
            }
        });
        expect(setDataMock).toHaveBeenCalledWith('application/json', expect.stringContaining('Perfect Cadence'));
        expect(setDataMock).toHaveBeenCalledWith('text/plain', expect.stringContaining('Perfect Cadence'));

        // Test + Bar button dispatches assignment event
        const addBarBtns = screen.getAllByTitle('Add to Action Bar');
        expect(addBarBtns.length).toBeGreaterThan(0);
        const eventListener = jest.fn();
        window.addEventListener('spell-action-bar-assign-item', eventListener);
        fireEvent.click(addBarBtns[0]);
        expect(eventListener).toHaveBeenCalled();
        window.removeEventListener('spell-action-bar-assign-item', eventListener);

        // Close button works
        const closeBtn = document.querySelector('.minstrel-modal-close-btn');
        fireEvent.click(closeBtn);
        expect(screen.queryByText('Minstrel Cadences')).toBeNull();
    });
});
