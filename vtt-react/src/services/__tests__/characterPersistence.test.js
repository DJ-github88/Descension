jest.mock('../../config/firebase', () => ({
    db: null,
    auth: null,
    isFirebaseConfigured: false,
    isDemoMode: true
}));
jest.mock('../../utils/firebaseUtils', () => ({ sanitizeForFirestore: value => value }));

import { transformForStorage, transformFromStorage } from '../firebase/characterPersistenceService';

const stats = { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 };
const resources = { health: { current: 50, max: 50 }, mana: { current: 25, max: 25 }, actionPoints: { current: 3, max: 3 } };

test('class acquisition and body states survive the Firestore round trip', () => {
    const stored = transformForStorage({
        id: 'char_1',
        name: 'Testa',
        race: 'human',
        subrace: 'thalren_human',
        class: 'Gambit',
        stats,
        resources,
        classAcquisition: {
            Gambit: { qualification: { verified: true, source: 'House record', fulfilledRequirements: ['house_wager'] } }
        },
        bodyStates: ['surgical_scar']
    }, 'user_1');

    expect(stored.basicInfo.classAcquisition.Gambit.qualification.source).toBe('House record');
    expect(stored.basicInfo.bodyStates).toEqual(['surgical_scar']);

    const back = transformFromStorage(stored);
    expect(back.classAcquisition.Gambit.qualification.verified).toBe(true);
    expect(back.bodyStates).toEqual(['surgical_scar']);
});

test('legacy stored characters without the fields load as empty defaults', () => {
    const back = transformFromStorage({
        metadata: {},
        basicInfo: { race: 'human', subrace: 'thalren_human', class: 'Gambit' },
        stats,
        resources
    });
    expect(back.classAcquisition).toEqual({});
    expect(back.bodyStates).toEqual([]);
});
