import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import useCharacterStore from '../../../store/characterStore';
import CharacterViewPage from '../CharacterViewPage';

jest.mock('../../../store/characterStore', () => ({
    __esModule: true,
    default: jest.fn()
}));

jest.mock('../../character-sheet/CharacterPanel', () => () => null);
jest.mock('../../character-sheet/CharacterStats', () => () => null);
jest.mock('../../character-sheet/Skills', () => () => null);
jest.mock('../../character-sheet/Lore', () => () => null);
jest.mock('../../windows/InventoryWindow', () => () => null);
jest.mock('../../item-generation/ItemLibrary', () => () => null);
jest.mock('../../item-generation/ItemGeneration', () => () => null);
jest.mock('../../spellcrafting-wizard/context/SpellLibraryContext', () => ({
    SpellLibraryProvider: ({ children }) => <>{children}</>
}));
jest.mock('../../spellcrafting-wizard/components/library/SpellLibrary', () => () => null);
jest.mock('../../character-sheet/SpellActionBar', () => () => null);
jest.mock('../../dice/DiceThemeSelector', () => () => null);
jest.mock('../../hud/ClassResourceBar', () => () => null);
jest.mock('../../talent-tree/TalentTreeContent', () => () => null);

const updateResource = jest.fn();
const updateCharacterInfo = jest.fn();

const cannedStore = {
    loadCharacters: async () => [{ id: 'test-id', name: 'Vex Stonefist' }],
    loadCharacter: jest.fn(),
    name: 'Vex Stonefist',
    class: null,
    primarySpecialization: null,
    race: null,
    subrace: null,
    level: 5,
    health: { current: 34, max: 50 },
    mana: { current: 30, max: 65 },
    actionPoints: { current: 3, max: 3 },
    classResource: null,
    stats: {},
    exhaustionLevel: 0,
    updateResource,
    updateCharacterInfo,
    updateClassResource: jest.fn()
};

const renderPage = () => render(
    <MemoryRouter initialEntries={['/characters/test-id']}>
        <Routes>
            <Route path="/characters/:characterId" element={<CharacterViewPage />} />
        </Routes>
    </MemoryRouter>
);

describe('CharacterViewPage header vial mounts', () => {
    beforeEach(() => {
        updateResource.mockClear();
        updateCharacterInfo.mockClear();
        useCharacterStore.mockReturnValue(cannedStore);
    });

    it('renders bare heart, crystal and boot mounts flanking the class bar', async () => {
        const { container } = renderPage();

        const healthMount = await screen.findByTitle(/Health Points: 34\/50 HP/);

        const vitalsRow = container.querySelector('.header-class-resource-row');
        expect(vitalsRow).toBeInTheDocument();
        expect(vitalsRow.contains(healthMount)).toBe(true);
        expect(healthMount).toHaveClass('header-resource-mount', 'health');
        expect(healthMount.querySelector('img.party-vial-icon')).toBeInTheDocument();

        const manaMount = await screen.findByTitle(/Mana Points: 30\/65 MP/);
        expect(manaMount).toHaveClass('header-resource-mount', 'mana');
        expect(vitalsRow.contains(manaMount)).toBe(true);
        expect(manaMount.querySelector('img.party-vial-icon')).toBeInTheDocument();

        const apMount = await screen.findByTitle(/Action Points: 3\/3 AP/);
        expect(apMount).toHaveClass('header-resource-mount', 'action-points');
        expect(vitalsRow.contains(apMount)).toBe(true);
        expect(apMount.querySelector('img.party-vial-icon')).toBeInTheDocument();

        // Bare icons only — no values, steppers or bottle pills in the header
        expect(container.querySelector('.header-resource-mount .mount-data')).toBeNull();
        expect(container.querySelector('.header-resource-mount .resource-adjust-btn')).toBeNull();
        expect(container.querySelector('.header-resource-counter.health')).toBeNull();
        expect(container.querySelector('.header-resource-counter.mana')).toBeNull();
        expect(container.querySelector('.header-resource-counter.action-points')).toBeNull();
        expect(container.querySelector('.header-resource-counter.exhaustion')).toBeNull();
        expect(container.querySelector('.header-resources-row')).toBeNull();
    });

    it('renders the exhaustion sigil with its level whisper', async () => {
        await renderPage().findByTitle(/Health Points/);
        const sigil = await screen.findByTitle(/Exhaustion Level 0\/6/);
        expect(sigil).toHaveClass('header-resource-mount', 'exhaustion');
        expect(sigil.textContent).toBe('0');
    });

    it('clicking a mount opens its popup with numbers and adjust controls', async () => {
        const { container } = renderPage();
        await screen.findByTitle(/Health Points/);

        fireEvent.click(container.querySelector('.header-resource-mount.mana'));
        expect(await screen.findByText(/Current: 30 \/ 65 MP/)).toBeInTheDocument();

        fireEvent.click(screen.getByText('+1'));
        expect(updateResource).toHaveBeenCalledWith('mana', 31, 65);
    });

    it('clicking the exhaustion sigil opens the stages popup', async () => {
        const { container } = renderPage();
        await screen.findByTitle(/Health Points/);

        fireEvent.click(container.querySelector('.header-resource-mount.exhaustion'));
        expect(await screen.findByText(/Exhaustion Stages & Penalties/)).toBeInTheDocument();
    });
});
