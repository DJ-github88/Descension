// P11 browser witness harness: mounts the real creation Skills step and the real
// sheet Skills panel with the real stores. Test-only entry; not an app route.
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Step7SkillsLanguages from '../../src/components/character-creation-wizard/steps/Step7SkillsLanguages';
import {
    CharacterWizardProvider, useCharacterWizardState, useCharacterWizardDispatch, ACTION_TYPES, WIZARD_STEPS
} from '../../src/components/character-creation-wizard/context/CharacterWizardContext';
import Skills from '../../src/components/character-sheet/Skills';
import useCharacterStore from '../../src/store/characterStore';
import useSettingsStore from '../../src/store/settingsStore';
import { assembleCharacterWorkingData } from '../../src/store/characterHelpers';

const params = new URLSearchParams(window.location.search);
const view = params.get('view') || 'wizard';
const SAVE_KEY = 'p11-witness-characters';

function WizardStatus() {
    const state = useCharacterWizardState();
    return <output id="wizard-status" data-valid={String(state.isValid)}>{state.validationErrors.skillPoints || 'no skill error'}</output>;
}

function WizardSeed({ ranks, editing, children }) {
    const dispatch = useCharacterWizardDispatch();
    const state = useCharacterWizardState();
    useEffect(() => {
        if (editing) dispatch({ type: ACTION_TYPES.LOAD_CHARACTER, payload: { name: 'Edited', class: 'x', race: '', subrace: '', skillRanks: ranks } });
        else if (ranks) dispatch({ type: ACTION_TYPES.SET_SKILL_RANKS, payload: ranks });
        dispatch({ type: ACTION_TYPES.SET_CURRENT_STEP, payload: WIZARD_STEPS.SKILLS_LANGUAGES });
    }, [dispatch, ranks, editing]);
    return state.currentStep === WIZARD_STEPS.SKILLS_LANGUAGES ? children : null;
}

function Wizard() {
    const ranks = params.get('ranks') ? JSON.parse(params.get('ranks')) : null;
    return (
        <CharacterWizardProvider>
            <WizardSeed ranks={ranks} editing={params.get('editing') === '1'}>
                <WizardStatus />
                <Step7SkillsLanguages />
            </WizardSeed>
        </CharacterWizardProvider>
    );
}

const loadSaved = () => { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || null; } catch (_) { return null; } };

function Sheet() {
    useEffect(() => useCharacterStore.subscribe(state => {
        if (!state.currentCharacterId) return;
        const characters = (loadSaved() || []).map(character => character.id === state.currentCharacterId
            ? { ...character, ...assembleCharacterWorkingData(state, { items: [], currency: {}, encumbranceState: 'normal' }), id: character.id, name: character.name }
            : character);
        localStorage.setItem(SAVE_KEY, JSON.stringify(characters));
    }), []);
    return <Skills selectedSkill={params.get('skill') || 'weaponMastery'} setSelectedSkill={() => {}} />;
}

if (view === 'sheet') {
    useSettingsStore.setState({ skillSystemMode: params.get('mode') || 'simple' });
    let saved = loadSaved();
    if (!saved) {
        saved = [
            { id: 'p11-one', name: 'One', stats: { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 },
                skillRanks: { weaponMastery: 'ADEPT', weaponMastery_axe: 'NOVICE', stealth: 'TRAINED' } },
            { id: 'p11-two', name: 'Two', stats: { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 },
                skillRanks: { weaponMastery_bow: 'MASTER' } }
        ];
        localStorage.setItem(SAVE_KEY, JSON.stringify(saved));
    }
    useCharacterStore.setState({ characters: saved });
    useCharacterStore.getState().loadCharacter(params.get('character') || 'p11-one');
}

window.__p11 = {
    ranks: () => useCharacterStore.getState().skillRanks,
    saved: loadSaved
};

// The settings store rehydrates asynchronously; apply the requested skill mode afterwards.
const settingsReady = useSettingsStore.persist?.rehydrate ? Promise.resolve(useSettingsStore.persist.rehydrate()) : Promise.resolve();
settingsReady.catch(() => {}).then(() => {
    if (view === 'sheet') useSettingsStore.setState({ skillSystemMode: params.get('mode') || 'simple' });
    createRoot(document.getElementById('root')).render(view === 'sheet' ? <Sheet /> : <Wizard />);
});
