import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStorageConfig } from '../utils/storageUtils';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured, auth } from '../config/firebase';

const nowIso = () => new Date().toISOString();

const triggerDeityAutoSync = () => {
  const uid = auth?.currentUser?.uid;
  if (uid && uid !== 'admin-dev-user' && uid !== 'dev-user-123' && !uid.startsWith('guest-')) {
    useDeityStore.getState().syncToCloud(uid);
  }
};

const useDeityStore = create(
  persist(
    (set, get) => ({
      deities: [],
      lastCloudSyncAt: null,

      getAllDeities: (worldId = null) => {
        const all = get().deities || [];
        if (!worldId) return all;
        return all.filter((d) => !d.worldId || d.worldId === worldId);
      },

      getDeity: (deityId) => (get().deities || []).find((d) => d.id === deityId) || null,

      addDeity: (worldId, deityData = {}) => {
        const targetWorldId = worldId || 'mythrill';
        const id = deityData.id || `deity-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const newDeity = {
          id,
          name: deityData.name || 'Unnamed Deity',
          title: deityData.title || '',
          domain: deityData.domain || 'Knowledge',
          alignment: deityData.alignment || 'Neutral',
          symbol: deityData.symbol || 'fa-star',
          description: deityData.description || '',
          dogma: deityData.dogma || '',
          worship: deityData.worship || '',
          isCustom: true,
          worldId: targetWorldId,
          createdAt: nowIso(),
          updatedAt: nowIso()
        };
        set((state) => ({ deities: [...(state.deities || []), newDeity] }));
        triggerDeityAutoSync();
        return id;
      },

      updateDeity: (deityId, patch = {}) => {
        set((state) => ({
          deities: (state.deities || []).map((d) => (d.id === deityId ? { ...d, ...patch, updatedAt: nowIso() } : d))
        }));
        triggerDeityAutoSync();
      },

      removeDeity: (deityId) => {
        set((state) => ({ deities: (state.deities || []).filter((d) => d.id !== deityId) }));
        triggerDeityAutoSync();
      },

      syncToCloud: async (userId) => {
        if (!userId || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'deities');
          await setDoc(docRef, { deities: get().deities || [], updatedAt: nowIso() }, { merge: true });
          set({ lastCloudSyncAt: nowIso() });
          return true;
        } catch (err) {
          console.debug('Deities cloud sync skipped:', err?.message || err);
          return false;
        }
      },

      hydrateFromCloud: async (userId) => {
        if (!userId || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'deities');
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            if (Array.isArray(data?.deities)) {
              set({ deities: data.deities });
              return true;
            }
          }
        } catch (err) {
          console.debug('Deities cloud hydration skipped:', err?.message || err);
        }
        return false;
      }
    }),
    createStorageConfig('mythrill_deities', {
      partialize: (state) => ({ deities: state.deities, lastCloudSyncAt: state.lastCloudSyncAt })
    })
  )
);

export default useDeityStore;
