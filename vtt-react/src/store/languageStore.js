import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStorageConfig } from '../utils/storageUtils';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured, auth } from '../config/firebase';
import { SEEDED_LANGUAGES } from '../data/seedLanguages';

const nowIso = () => new Date().toISOString();

const SEEDED_LANGUAGE_IDS = new Set(SEEDED_LANGUAGES.map((l) => l.id));

const mergeSeededLanguages = (languages, removedSeedIds = []) => {
  const removed = new Set(removedSeedIds || []);
  const merged = Array.isArray(languages) ? [...languages] : [];
  SEEDED_LANGUAGES.forEach((seed) => {
    if (removed.has(seed.id)) return;
    if (merged.some((l) => l.id === seed.id)) return;
    merged.push(seed);
  });
  return merged;
};

const triggerLanguageAutoSync = () => {
  const uid = auth?.currentUser?.uid;
  if (uid && uid !== 'admin-dev-user' && uid !== 'dev-user-123' && !uid.startsWith('guest-')) {
    useLanguageStore.getState().syncToCloud(uid);
  }
};

const useLanguageStore = create(
  persist(
    (set, get) => ({
      languages: SEEDED_LANGUAGES,
      removedSeedIds: [],
      lastCloudSyncAt: null,

      getAllLanguages: (worldId = null) => {
        const all = get().languages || [];
        if (!worldId) return all;
        return all.filter((l) => !l.worldId || l.worldId === worldId);
      },

      getLanguage: (langId) => (get().languages || []).find((l) => l.id === langId) || null,

      addLanguage: (worldId, langData = {}) => {
        const targetWorldId = worldId || 'mythrill';
        const id = langData.id || `lang-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const newLang = {
          id,
          name: langData.name || 'Unnamed Tongue',
          script: langData.script || 'Common Script',
          family: langData.family || 'Isolate',
          description: langData.description || '',
          samplePhrase: langData.samplePhrase || '',
          lexicon: Array.isArray(langData.lexicon) ? langData.lexicon : [],
          isCustom: true,
          worldId: targetWorldId,
          createdAt: nowIso(),
          updatedAt: nowIso()
        };
        set((state) => ({ languages: [...(state.languages || []), newLang] }));
        triggerLanguageAutoSync();
        return id;
      },

      updateLanguage: (langId, patch = {}) => {
        set((state) => ({
          languages: (state.languages || []).map((l) => (l.id === langId ? { ...l, ...patch, isCustom: true, updatedAt: nowIso() } : l))
        }));
        triggerLanguageAutoSync();
      },

      removeLanguage: (langId) => {
        set((state) => ({
          languages: (state.languages || []).filter((l) => l.id !== langId),
          removedSeedIds: SEEDED_LANGUAGE_IDS.has(langId) && !(state.removedSeedIds || []).includes(langId)
            ? [...(state.removedSeedIds || []), langId]
            : (state.removedSeedIds || [])
        }));
        triggerLanguageAutoSync();
      },

      addLexiconEntry: (langId, entry) => {
        set((state) => ({
          languages: (state.languages || []).map((l) => {
            if (l.id !== langId) return l;
            const lex = Array.isArray(l.lexicon) ? [...l.lexicon, entry] : [entry];
            return { ...l, lexicon: lex, isCustom: true, updatedAt: nowIso() };
          })
        }));
        triggerLanguageAutoSync();
      },

      removeLexiconEntry: (langId, idx) => {
        set((state) => ({
          languages: (state.languages || []).map((l) => {
            if (l.id !== langId) return l;
            const lex = (l.lexicon || []).filter((_, i) => i !== idx);
            return { ...l, lexicon: lex, isCustom: true, updatedAt: nowIso() };
          })
        }));
        triggerLanguageAutoSync();
      },

      syncToCloud: async (userId) => {
        if (!userId || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'languages');
          const customLanguages = (get().languages || []).filter((l) => l.isCustom);
          await setDoc(docRef, { languages: customLanguages, removedSeedIds: get().removedSeedIds || [], updatedAt: nowIso() }, { merge: true });
          set({ lastCloudSyncAt: nowIso() });
          return true;
        } catch (err) {
          console.debug('Languages cloud sync skipped:', err?.message || err);
          return false;
        }
      },

      hydrateFromCloud: async (userId) => {
        if (!userId || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'languages');
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            if (Array.isArray(data?.languages)) {
              const remoteRemoved = Array.isArray(data?.removedSeedIds) ? data.removedSeedIds : [];
              const removedSeedIds = Array.from(new Set([...(get().removedSeedIds || []), ...remoteRemoved]));
              set({ languages: mergeSeededLanguages(data.languages, removedSeedIds), removedSeedIds });
              return true;
            }
          }
        } catch (err) {
          console.debug('Languages cloud hydration skipped:', err?.message || err);
        }
        return false;
      }
    }),
    createStorageConfig('mythrill_languages', {
      partialize: (state) => ({ languages: state.languages, removedSeedIds: state.removedSeedIds, lastCloudSyncAt: state.lastCloudSyncAt }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted || {}),
        languages: mergeSeededLanguages(persisted?.languages, persisted?.removedSeedIds)
      })
    })
  )
);

export default useLanguageStore;
