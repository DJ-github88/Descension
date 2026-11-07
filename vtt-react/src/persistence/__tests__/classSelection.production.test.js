import useCharacterStore from '../../store/characterStore';
import useAuthStore from '../../store/authStore';
import useInventoryStore from '../../store/inventoryStore';
import { registerStore } from '../../store/storeRegistry';
import { activatePrivateScope, resetBootstrapGateForTests } from '../bootstrapPrivacyGate';
import { resetCharacterScopedStorageState } from '../characterScopedStorage';
import { resetHandoffCoordinatorForTests, whenHandoffIdle } from '../handoff/accountHandoffCoordinator';
import { resetCharacterSaveOutcomeForTests, getCharacterCandidate } from '../characterSaveOutcome';
import { discardCharacterAutoSave } from '../../store/characterHelpers';
import canonicalService from '../../services/firebase/characterPersistenceService';
import { ALL_CLASSES_DATA } from '../../data/classes';
import { initializeClassResource } from '../../data/classResources';
import { characterWizardReducer, initialState, ACTION_TYPES } from '../../components/character-creation-wizard/context/CharacterWizardContext';
import * as firestore from 'firebase/firestore';

jest.mock('../../config/firebase', () => ({ db: {}, auth: { currentUser: { uid: 'class-owner' } },
    isFirebaseConfigured: true, isDemoMode: false, isMockOrDevUser: () => false }));
jest.mock('firebase/auth', () => ({ onAuthStateChanged: () => () => {} }));
jest.mock('firebase/firestore', () => ({
    doc: (_db, ...parts) => parts.join('/'), collection: (_db, ...parts) => parts.join('/'),
    getDoc: jest.fn(), getDocs: jest.fn(), setDoc: jest.fn(), updateDoc: jest.fn(),
    query: ref => ref, where: () => ({}), orderBy: () => ({}), limit: () => ({}),
    serverTimestamp: () => 'SERVER', onSnapshot: () => () => {}, runTransaction: jest.fn()
}));
jest.mock('../../services/firebase/characterBackupService', () => ({ default: { autoBackup: async () => true } }));

const docs = new Map();
const clone = value => JSON.parse(JSON.stringify(value));
const stats = { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 };
const payload = (name, id) => ({ id, name: id, class: name, race: 'human', subrace: 'thalren_human', level: 1,
    stats, baseStats: stats, classResource: initializeClassResource(name, { ...stats, level: 1 }),
    class_spells: { known_spells: [
        ...(ALL_CLASSES_DATA[name].progression?.policy?.grantedCoreSpellIds || []),
        ...(ALL_CLASSES_DATA[name].spellPools?.[1] || []).slice(0, ALL_CLASSES_DATA[name].progression?.policy ? 1 : 3)
    ] },
    talents: {}, lore: { notes: 'preserve' }, inventory: { items: [], currency: {} }, equipment: {} });

beforeEach(async () => {
    discardCharacterAutoSave(); resetCharacterSaveOutcomeForTests(); resetBootstrapGateForTests();
    resetHandoffCoordinatorForTests(); resetCharacterScopedStorageState(); localStorage.clear(); docs.clear();
    canonicalService.saveTails.clear();
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: true });
    Object.defineProperty(navigator, 'locks', { configurable: true, value: { request: (_key, _opts, fn) => Promise.resolve(fn({})) } });
    registerStore('authStore', useAuthStore); registerStore('characterStore', useCharacterStore); registerStore('inventoryStore', useInventoryStore);
    useAuthStore.getState().setUser(require('../../config/firebase').auth.currentUser);
    await whenHandoffIdle();
    activatePrivateScope({ scopeKind: 'user', scopeId: 'class-owner' });
    firestore.getDoc.mockImplementation(async path => ({ exists: () => docs.has(path), data: () => clone(docs.get(path)) }));
    firestore.getDocs.mockImplementation(async () => ({ forEach: fn => [...docs].filter(([path]) => path.startsWith('characters/')).forEach(([, data]) => fn({ data: () => clone(data) })) }));
    firestore.setDoc.mockImplementation(async (path, data) => docs.set(path, clone(data)));
    firestore.updateDoc.mockImplementation(async (path, data) => docs.set(path, { ...docs.get(path), ...clone(data) }));
    firestore.runTransaction.mockImplementation(async (_db, fn) => fn({ get: firestore.getDoc, set: firestore.setDoc, update: firestore.updateDoc }));
    useCharacterStore.setState({ characters: [], currentCharacterId: null });
    useInventoryStore.setState({ items: [], currency: {}, containers: [] });
});
afterEach(() => discardCharacterAutoSave());

test.each(['Bladedancer', 'Inscriptor', 'Totemist', 'Witch Doctor', 'Oracle', 'Gambit', 'Nereid Myrathil Augur'])(
    '%s survives production create → fixture cloud load → sheet hydration → ordinary edit → save → reload', async name => {
        const store = () => useCharacterStore.getState();
        const unrelated = await store().createCharacter(payload('Warden', 'unrelated'));
        const prior = clone(docs.get(`characters/${unrelated.id}`));
        const created = await store().createCharacter(payload(name, `hero-${name}`));
        expect(docs.get(`characters/${created.id}`).basicInfo.class).toBe(name);
        const loaded = await canonicalService.loadCharacter(created.id, 'class-owner');
        expect(loaded.class).toBe(name);
        await store().loadCharacters();
        store().loadCharacter(created.id);
        expect(store().class).toBe(name);
        expect(store().classResource).toEqual(loaded.classResource);
        const wizard = characterWizardReducer(initialState, { type: ACTION_TYPES.LOAD_CHARACTER, payload: loaded });
        expect(wizard.characterData.class).toBe(name);
        store().updateCharacterInfo('name', 'Renamed by ordinary edit');
        await store().saveCurrentCharacter();
        expect(getCharacterCandidate(created.id, 'canonical').status).toBe('saved');
        const reopened = await canonicalService.loadCharacter(created.id, 'class-owner');
        expect(reopened.class).toBe(name);
        expect(reopened.name).toBe('Renamed by ordinary edit');
        expect(reopened.classResource).toEqual(store().classResource);
        expect(reopened.class_spells).toEqual(loaded.class_spells);
        expect(docs.get(`characters/${unrelated.id}`)).toEqual(prior);
    }
);
