import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStorageConfig } from '../utils/storageUtils';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured, auth } from '../config/firebase';

const nowIso = () => new Date().toISOString();

const triggerLanguageAutoSync = () => {
  const uid = auth?.currentUser?.uid;
  if (uid && uid !== 'admin-dev-user' && uid !== 'dev-user-123' && !uid.startsWith('guest-')) {
    useLanguageStore.getState().syncToCloud(uid);
  }
};

const useLanguageStore = create(
  persist(
    (set, get) => ({
      languages: [],
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
          languages: (state.languages || []).map((l) => (l.id === langId ? { ...l, ...patch, updatedAt: nowIso() } : l))
        }));
        triggerLanguageAutoSync();
      },

      removeLanguage: (langId) => {
        set((state) => ({ languages: (state.languages || []).filter((l) => l.id !== langId) }));
        triggerLanguageAutoSync();
      },

      addLexiconEntry: (langId, entry) => {
        set((state) => ({
          languages: (state.languages || []).map((l) => {
            if (l.id !== langId) return l;
            const lex = Array.isArray(l.lexicon) ? [...l.lexicon, entry] : [entry];
            return { ...l, lexicon: lex, updatedAt: nowIso() };
          })
        }));
        triggerLanguageAutoSync();
      },

      removeLexiconEntry: (langId, idx) => {
        set((state) => ({
          languages: (state.languages || []).map((l) => {
            if (l.id !== langId) return l;
            const lex = (l.lexicon || []).filter((_, i) => i !== idx);
            return { ...l, lexicon: lex, updatedAt: nowIso() };
          })
        }));
        triggerLanguageAutoSync();
      },

      syncToCloud: async (userId) => {
        if (!userId || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'languages');
          await setDoc(docRef, { languages: get().languages || [], updatedAt: nowIso() }, { merge: true });
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
              set({ languages: data.languages });
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
      partialize: (state) => ({ languages: state.languages, lastCloudSyncAt: state.lastCloudSyncAt })
    })
  )
);

export default useLanguageStore;
