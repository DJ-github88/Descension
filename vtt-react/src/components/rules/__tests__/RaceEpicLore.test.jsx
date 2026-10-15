/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RaceEpicLore from '../RaceEpicLore';

// Sample mock race data matching canonical Astril profile
const mockAstrilData = {
    id: 'astril',
    name: 'Astril',
    essence: 'The Fire-Carried',
    illustration: '/assets/images/races/astril_brutish_figure_thok.jpg',
    illustrationCaption: '“When the sky fell, the Kordak did not break; we forged the meteor into hammers.” — Warmaster Thok Meteor-Fist',
    baseTraits: {
        size: 'Medium',
        baseSpeed: 30,
        lifespan: '140-200 years',
        height: "5'2\" - 6'0\"",
        languages: ["Wayfarer's Cant", 'Echosong']
    },
    epicHistory: `There was a world. It had a name, but the Astril do not speak it aloud anymore, because speaking the name of a grave feels too much like digging in it. It orbited a star called Lumia, and it was warm, and the Astril farmed its lowlands and hunted its forests and sang to their children beneath a sky that was always, always full of light.

They were not a remarkable people. That is the part the legends leave out. The Astril were farmers. They were hunters. They argued about fences and rainfall and whose goats had wandered into whose fields.

Then Keth Amar found Lumia.

The predator does not announce itself. It arrived in the dark beyond the dark, the hunger that moves between stars, and it found Lumia the way a wolf finds a lantern in winter. The star dimmed. The world froze.`,
    notableFigures: [
        {
            name: 'Vael of the Long Crossing',
            title: 'The Navigator',
            portraitIcon: 'Fairy/Icon3',
            backstory: 'Vael is remembered as the one who charted the void between Lumia\'s world and Mythrill. They were not a navigator by training, only a farmer who had watched the stars.'
        },
        {
            name: 'Mother Therra',
            title: 'The First Ritualist',
            portraitIcon: 'Fairy/Icon1',
            backstory: 'Therra was the first to interpret the lunar tide signs upon arriving at Mythrill.'
        }
    ],
    majorLocations: [
        {
            name: 'The Moon-Courtyards',
            description: 'Scattered across Mythrill in remote farming country, the moon-courtyards are where the Selunis-ritual is performed beneath open skies.'
        },
        {
            name: 'Synod Hold',
            description: 'The ancient mountain archive where the charts of Lumia are preserved.'
        }
    ],
    currentCrisis: 'The Selunis-ritual is approaching a critical phase. The Kordak star-readers have watched the moon\'s tides shift over the last decade.\n\nPreparations must be made before the predator awakens.',
    culturalPractices: 'The night is the teacher. An Astril child\'s first lessons come after sundown, held in the moon-courtyard while the adults perform the ritual.\n\nBy day, the Astril farm and hunt. Every community is self-sufficient by necessity.\n\nChildren are taught their heritage plainly and without ornament. You are a refugee.\n\nThe dead are laid in the moon-courtyard beneath the open sky, watched through a single night.',
    culturalBackground: 'Astril communities are small, isolated, and deliberately unremarkable. They farm. They hunt. They keep to themselves.\n\nMoon-courtyards sustain particular ritual communities.',
    diasporaVariation: 'Synod Hold remains the principal Lumian institution; Crater-Hold is a martial settlement.',
    integrationNotes: {
        actionPointSystem: 'Astril abilities reflect their alien biology and their lunar calling.',
        backgroundSynergy: 'Astril excel in backgrounds emphasizing survival and ritual.',
        classCompatibility: 'Lumian are the star-memory people, native to five paths.'
    }
};

describe('RaceEpicLore Component (Calm TTRPG Manuscript Codex)', () => {
    test('renders codex header, book spread, chronicles title, and ancestral statistics rubric', () => {
        render(<RaceEpicLore raceData={mockAstrilData} onClose={jest.fn()} />);

        // Header heraldry and book title
        expect(screen.getByText(/The Grand Codex of Ancestries · Astril/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Close Codex/i })).toBeInTheDocument();

        // Left page chronicles header
        expect(screen.getAllByText('Astril').length).toBeGreaterThan(0);
        expect(screen.getByText('Ancestral Attributes & Dialects')).toBeInTheDocument();
        expect(screen.getByText('Size Class')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toBeInTheDocument();
        expect(screen.getByText('Base Speed')).toBeInTheDocument();
        expect(screen.getByText('30 ft')).toBeInTheDocument();
        expect(screen.getByText("Wayfarer's Cant, Echosong")).toBeInTheDocument();

        // Right page epic narrative with illuminated drop cap
        expect(screen.getByText('The Epic Narrative')).toBeInTheDocument();
        // Drop cap 'T'
        expect(screen.getByText('T')).toHaveClass('tome-drop-cap-letter');
        expect(screen.getByText(/here was a world. It had a name/i)).toBeInTheDocument();
    });

    test('renders illustration quotation marginalia', () => {
        render(<RaceEpicLore raceData={mockAstrilData} onClose={jest.fn()} />);

        expect(screen.getByText(/When the sky fell, the Kordak did not break/i)).toBeInTheDocument();
    });

    test('renders all 6 top archival bookmark tabs', () => {
        render(<RaceEpicLore raceData={mockAstrilData} onClose={jest.fn()} />);

        expect(screen.getByRole('tab', { name: /History/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Figures/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Locations/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Crisis/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Practices/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Culture/i })).toBeInTheDocument();
    });

    test('switches to Notable Figures tab and displays selected figure details', () => {
        render(<RaceEpicLore raceData={mockAstrilData} onClose={jest.fn()} />);

        const figuresTab = screen.getByRole('tab', { name: /Figures/i });
        fireEvent.click(figuresTab);

        // Figures list on left page
        expect(screen.getAllByText('Notable Figures').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Vael of the Long Crossing').length).toBe(2);
        expect(screen.getByText('Mother Therra')).toBeInTheDocument();

        // Right page displays details of selected figure with drop cap
        expect(screen.getAllByText('The Navigator').length).toBe(2);
        expect(screen.getByText('V')).toHaveClass('tome-drop-cap-letter');
        expect(screen.getByText(/ael is remembered as the one who charted the void/i)).toBeInTheDocument();

        // Clicking second figure updates the right page
        fireEvent.click(screen.getByText('Mother Therra'));
        expect(screen.getAllByText('The First Ritualist').length).toBe(2);
        expect(screen.getByText(/herra was the first to interpret the lunar tide signs/i)).toBeInTheDocument();
    });

    test('switches to Major Locations tab and displays landmark details', () => {
        render(<RaceEpicLore raceData={mockAstrilData} onClose={jest.fn()} />);

        const locationsTab = screen.getByRole('tab', { name: /Locations/i });
        fireEvent.click(locationsTab);

        // Landmarks list on left page
        expect(screen.getAllByText('Major Landmarks').length).toBeGreaterThan(0);
        expect(screen.getAllByText('The Moon-Courtyards').length).toBe(2);
        expect(screen.getByText('Synod Hold')).toBeInTheDocument();

        // Right page displays details with drop cap
        expect(screen.getByText('S')).toHaveClass('tome-drop-cap-letter');
        expect(screen.getByText(/cattered across Mythrill in remote farming country/i)).toBeInTheDocument();

        // Selecting Synod Hold
        fireEvent.click(screen.getByText('Synod Hold'));
        expect(screen.getByText(/he ancient mountain archive where the charts of Lumia are preserved/i)).toBeInTheDocument();
    });

    test('switches to Crisis tab and displays the canonical warning box and threats', () => {
        render(<RaceEpicLore raceData={mockAstrilData} onClose={jest.fn()} />);

        const crisisTab = screen.getByRole('tab', { name: /Crisis/i });
        fireEvent.click(crisisTab);

        expect(screen.getByText('The Shadow Loom')).toBeInTheDocument();
        expect(screen.getByText('Current Crisis Canonical Warning')).toBeInTheDocument();
        expect(screen.getByText(/The Selunis-ritual is approaching a critical phase/i)).toBeInTheDocument();
        expect(screen.getByText('The Looming Threats')).toBeInTheDocument();
    });

    test('switches to Practices tab and displays ancestral rites', () => {
        render(<RaceEpicLore raceData={mockAstrilData} onClose={jest.fn()} />);

        const practicesTab = screen.getByRole('tab', { name: /Practices/i });
        fireEvent.click(practicesTab);

        expect(screen.getByText('Cultural Practices')).toBeInTheDocument();
        expect(screen.getByText('Ancestral Way & Passage')).toBeInTheDocument();
        expect(screen.getByText('T')).toHaveClass('tome-drop-cap-letter');
        expect(screen.getByText(/he night is the teacher/i)).toBeInTheDocument();
        expect(screen.getByText('Tradition, Rites & Death')).toBeInTheDocument();
    });

    test('switches to Culture tab and displays world systems integration across spreads', () => {
        render(<RaceEpicLore raceData={mockAstrilData} onClose={jest.fn()} />);

        const cultureTab = screen.getByRole('tab', { name: /Culture/i });
        fireEvent.click(cultureTab);

        // Spread I
        expect(screen.getByText('Cultural Background')).toBeInTheDocument();
        expect(screen.getByText('In the Wider World')).toBeInTheDocument();
        expect(screen.getByText(/Synod Hold remains the principal Lumian institution/i)).toBeInTheDocument();

        // Turn to Spread II
        const turnLeafBtn = screen.getByRole('button', { name: /Turn Leaf/i });
        fireEvent.click(turnLeafBtn);

        expect(screen.getByText('Integration with World Systems')).toBeInTheDocument();
        expect(screen.getByText(/Astril abilities reflect their alien biology/i)).toBeInTheDocument();
    });

    test('clicking Close Codex button calls onClose', () => {
        const onCloseMock = jest.fn();
        render(<RaceEpicLore raceData={mockAstrilData} onClose={onCloseMock} />);

        const closeBtn = screen.getByRole('button', { name: /Close Codex/i });
        fireEvent.click(closeBtn);
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    test('pressing Escape key calls onClose', () => {
        const onCloseMock = jest.fn();
        render(<RaceEpicLore raceData={mockAstrilData} onClose={onCloseMock} />);

        fireEvent.keyDown(window, { key: 'Escape' });
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    test('handles null raceData gracefully without crashing', () => {
        const { container } = render(<RaceEpicLore raceData={null} onClose={jest.fn()} />);
        expect(container.firstChild).toBeNull();
    });
});
