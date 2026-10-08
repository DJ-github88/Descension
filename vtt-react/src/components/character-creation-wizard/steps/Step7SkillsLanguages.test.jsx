import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Step7SkillsLanguages from './Step7SkillsLanguages';
import { RACE_DATA } from '../../../data/raceData';

const mockDispatch = jest.fn();
let mockCharacterData;

jest.mock('../context/CharacterWizardContext', () => ({
    useCharacterWizardState: () => ({ characterData: mockCharacterData }),
    useCharacterWizardDispatch: () => mockDispatch,
    wizardActionCreators: {
        setSkills: payload => ({ type: 'skills', payload }),
        setLanguages: payload => ({ type: 'languages', payload }),
        setSkillRanks: payload => ({ type: 'ranks', payload })
    }
}));
jest.mock('../../../store/customLineageStore', () => ({
    __esModule: true,
    default: { getState: () => ({ getLineage: id => id === 'custom-language-fixture' ? {
        id,
        name: 'Custom fixture',
        baseTraits: { languages: ["Wayfarer's Cant", 'Echosong'] },
        subraces: [{ id: 'custom-child', name: 'Custom child', perks: [] }]
    } : null }) }
}));

test('creation dispatches base-race language grants and updates them when the heritage changes', async () => {
    const subrace = RACE_DATA.neth.subraces.drun;
    const savedLanguages = subrace.languages;
    mockDispatch.mockClear();
    mockCharacterData = { race: 'neth', subrace: 'drun_neth', selectedSkills: [], selectedLanguages: [], skillRanks: {} };
    try {
        delete subrace.languages;
        const { rerender, unmount } = render(<Step7SkillsLanguages />);
        await waitFor(() => expect(mockDispatch).toHaveBeenCalledWith({
            type: 'languages', payload: ["Wayfarer's Cant", 'Gloomtongue']
        }));
        const languageCallCount = mockDispatch.mock.calls.filter(([action]) => action.type === 'languages').length;
        rerender(<Step7SkillsLanguages />);
        expect(mockDispatch.mock.calls.filter(([action]) => action.type === 'languages')).toHaveLength(languageCallCount);

        mockCharacterData = { ...mockCharacterData, race: 'mimir', subrace: 'tethered_mimir' };
        rerender(<Step7SkillsLanguages />);
        await waitFor(() => expect(mockDispatch).toHaveBeenLastCalledWith({
            type: 'languages', payload: ["Wayfarer's Cant", 'Valespeak']
        }));
        unmount();
    } finally {
        subrace.languages = savedLanguages;
    }
});

test('freshly adapted custom-lineage objects do not repeatedly dispatch language grants', async () => {
    mockDispatch.mockClear();
    mockCharacterData = {
        race: 'custom-language-fixture', subrace: 'custom-child',
        selectedSkills: [], selectedLanguages: [], skillRanks: {}
    };
    const { rerender } = render(<Step7SkillsLanguages />);
    await waitFor(() => expect(mockDispatch).toHaveBeenCalledWith({
        type: 'languages', payload: ["Wayfarer's Cant", 'Echosong']
    }));
    const initialCalls = mockDispatch.mock.calls.filter(([action]) => action.type === 'languages').length;
    rerender(<Step7SkillsLanguages />);
    expect(mockDispatch.mock.calls.filter(([action]) => action.type === 'languages')).toHaveLength(initialCalls);
});

test('editing a legacy Astril draft preserves Lumian knowledge as Echosong without duplicate grants', async () => {
    mockDispatch.mockClear();
    mockCharacterData = {
        race: 'astril', subrace: 'vashir_astril',
        selectedSkills: [], selectedLanguages: ['Lumian', 'Echosong'], skillRanks: {}
    };
    render(<Step7SkillsLanguages />);
    await waitFor(() => expect(mockDispatch).toHaveBeenCalledWith({
        type: 'languages', payload: ["Wayfarer's Cant", 'Echosong']
    }));
});
