/**
 * P11 — the Skills step blocks finishing a new character over budget, never an edit (A7).
 */
import { validateCurrentStep, WIZARD_STEPS } from '../CharacterWizardContext';

const step = (skillRanks, originalCalling = null, intelligence = 10) => validateCurrentStep({
    currentStep: WIZARD_STEPS.SKILLS_LANGUAGES,
    originalCalling,
    characterData: { finalStats: { intelligence }, background: '', race: '', skillRanks }
});

test('within budget: no error at exactly the budget', () => {
    expect(step({ athletics: 'ADEPT' })).toEqual({}); // 10 of 10
});

test('over budget on a new character: blocking error with the overspend', () => {
    expect(step({ athletics: 'ADEPT', stealth: 'NOVICE' })).toEqual({
        skillPoints: 'Skill training is over budget by 1 point. Lower a rank to continue.'
    });
    // Lowering Intelligence after allocating shrinks the budget: same overspend path.
    const allocated = { athletics: 'ADEPT', stealth: 'TRAINED' }; // 13 points
    expect(step(allocated, null, 13)).toEqual({});
    expect(step(allocated, null, 10).skillPoints).toBe('Skill training is over budget by 3 points. Lower a rank to continue.');
});

test('per-weapon purchases count toward the budget', () => {
    expect(step({ weaponMastery_sword: 'ADEPT', weaponMastery_axe: 'NOVICE' }).skillPoints)
        .toBe('Skill training is over budget by 1 point. Lower a rank to continue.');
});

test('editing an existing character never blocks on the starting budget', () => {
    expect(step({ athletics: 'MASTER', stealth: 'MASTER' }, { class: 'x', race: 'y', subrace: 'z' })).toEqual({});
});
