import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';
import { db, isFirebaseConfigured, isDemoMode } from '../../config/firebase';
import { sanitizeForFirestore } from '../../utils/firebaseUtils';

const COLLECTIONS = {
  CUSTOM_TABLES: 'customRollableTables',
  USERS: 'users'
};

function checkFirebaseAvailable() {
  if (!isFirebaseConfigured || isDemoMode || !db) {
    console.warn('Firebase not configured or in demo mode');
    return false;
  }
  return true;
}

export async function saveCustomTable(userId, tableData) {
  try {
    if (!checkFirebaseAvailable()) return { success: false, localOnly: true };
    if (!userId) throw new Error('User ID is required');

    const tableId = tableData.id || `table_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const tableDocument = {
      ...tableData,
      id: tableId,
      userId,
      createdAt: tableData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCustom: true
    };

    const tableRef = doc(db, COLLECTIONS.CUSTOM_TABLES, tableId);
    await setDoc(tableRef, sanitizeForFirestore(tableDocument));

    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        customRollableTables: arrayUnion(tableId),
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(userRef, {
        customRollableTables: [tableId],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    return { success: true, tableId };
  } catch (error) {
    console.error('Error saving custom table:', error);
    return { success: false, error: error.message };
  }
}

export async function getUserCustomTables(userId) {
  try {
    if (!checkFirebaseAvailable()) return [];
    if (!userId) return [];

    const tablesRef = collection(db, COLLECTIONS.CUSTOM_TABLES);
    const q = query(tablesRef, where('userId', '==', userId), orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching custom tables:', error);
    return [];
  }
}

export async function deleteCustomTable(userId, tableId) {
  try {
    if (!checkFirebaseAvailable()) return { success: false };
    if (!userId || !tableId) return { success: false };

    const tableRef = doc(db, COLLECTIONS.CUSTOM_TABLES, tableId);
    const tableDoc = await getDoc(tableRef);

    if (!tableDoc.exists() || tableDoc.data().userId !== userId) {
      return { success: false, error: 'Table not found or not owned by user' };
    }

    await deleteDoc(tableRef);

    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const customTables = userDoc.data().customRollableTables || [];
      await updateDoc(userRef, {
        customRollableTables: customTables.filter(id => id !== tableId),
        updatedAt: serverTimestamp()
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting custom table:', error);
    return { success: false, error: error.message };
  }
}
