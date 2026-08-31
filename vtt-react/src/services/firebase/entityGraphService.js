/**
 * Entity Graph Cloud Service
 *
 * Cloud persistence for the Universal Entity Graph's user-authored custom
 * nodes and connections (previously localStorage-only, lost on device switch).
 * Doc: users/{uid}/worldbuilding/entityGraph — same layout as the other
 * worldbuilding stores.
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured, auth } from '../../config/firebase';

const shouldSkip = (userId) =>
  !isFirebaseConfigured ||
  !db ||
  !userId ||
  userId.startsWith('guest-') ||
  userId === 'dev-user-123' ||
  userId === 'admin-dev-user';

export const syncEntityGraph = async (userId, { customNodes, customEdges }) => {
  if (shouldSkip(userId)) return false;
  try {
    await setDoc(doc(db, 'users', userId, 'worldbuilding', 'entityGraph'), {
      customNodes: customNodes || [],
      customEdges: customEdges || [],
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.debug('Entity graph cloud sync skipped:', err?.message || err);
    return false;
  }
};

export const hydrateEntityGraph = async (userId) => {
  if (shouldSkip(userId)) return null;
  try {
    const snap = await getDoc(doc(db, 'users', userId, 'worldbuilding', 'entityGraph'));
    if (snap.exists()) {
      const data = snap.data();
      return {
        customNodes: Array.isArray(data.customNodes) ? data.customNodes : [],
        customEdges: Array.isArray(data.customEdges) ? data.customEdges : []
      };
    }
    return null;
  } catch (err) {
    console.debug('Entity graph cloud hydration skipped:', err?.message || err);
    return null;
  }
};

// Convenience: current authenticated uid (null for guests/dev users)
export const getCurrentEntityGraphUid = () => {
  const uid = auth?.currentUser?.uid;
  return uid && !uid.startsWith('guest-') ? uid : null;
};
