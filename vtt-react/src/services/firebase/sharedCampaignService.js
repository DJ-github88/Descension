import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../config/firebase';
import { sanitizeForFirestore } from '../../utils/firebaseUtils';
import { loadCompleteGameState } from '../roomService';

const SHARED_CAMPAIGNS_COLLECTION = 'sharedCampaigns';
const CAMPAIGN_DATA_DOC = 'state';

export const publishCampaign = async ({ roomId, name, description, coverImage, publisherId, publisherName, publisherAvatar, tags, resetFog }) => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured');
  }

  let gameState = {};
  try {
    gameState = await loadCompleteGameState(roomId) || {};
  } catch (e) {
    console.warn('[sharedCampaignService] Could not load room gameState:', e.message);
  }

  if (resetFog) {
    gameState.fogOfWar = {};
    gameState.fogOfWarData = {};
    if (gameState.levelEditor) {
      gameState.levelEditor.fogOfWarData = {};
      gameState.levelEditor.fogOfWarPaths = [];
      gameState.levelEditor.fogErasePaths = [];
    }
    gameState.playerMemories = {};
    gameState.exploredAreas = {};
    gameState.exploredCircles = [];
    gameState.exploredPolygons = [];
  }

  delete gameState.combat;
  delete gameState.travel;
  delete gameState.currentPlayerId;

  const ts = Date.now();
  const rand = Math.random().toString(36).substr(2, 9);
  const campaignId = `campaign_${ts}_${rand}`;

  // Metadata doc stays light: the (potentially ~1MB) gameState lives in a
  // subcollection document, so browse lists never download it.
  const sharedCampaign = {
    id: campaignId,
    name: name || 'Unnamed Campaign',
    description: description || '',
    coverImage: coverImage || null,
    publisherId,
    publisherName: publisherName || 'Unknown',
    publisherAvatar: publisherAvatar || null,
    tags: tags || [],
    downloads: 0,
    rating: 0,
    ratingCount: 0,
    version: 1,
    hasGameState: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(doc(db, SHARED_CAMPAIGNS_COLLECTION, campaignId), sharedCampaign);

  try {
    await setDoc(
      doc(db, SHARED_CAMPAIGNS_COLLECTION, campaignId, 'data', CAMPAIGN_DATA_DOC),
      sanitizeForFirestore({ gameState, updatedAt: serverTimestamp() })
    );
  } catch (error) {
    // Compatibility fallback for environments where the subcollection rules
    // have not been deployed yet: keep the legacy inline format.
    console.warn('[sharedCampaignService] Subcollection write failed, storing inline:', error?.message || error);
    await updateDoc(doc(db, SHARED_CAMPAIGNS_COLLECTION, campaignId), {
      gameState: sanitizeForFirestore(gameState)
    });
  }

  return campaignId;
};

/**
 * Browse shared campaigns (metadata only). Pass the returned `lastDoc` back to
 * paginate; `hasMore` indicates another page exists.
 */
export const getSharedCampaigns = async (maxResults = 20, lastDoc = null) => {
  if (!isFirebaseConfigured()) return { campaigns: [], lastDoc: null, hasMore: false };

  const rawCursor = lastDoc?.__cursor || lastDoc;
  let q = query(
    collection(db, SHARED_CAMPAIGNS_COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );
  if (rawCursor) q = query(q, startAfter(rawCursor));

  const snapshot = await getDocs(q);
  const campaigns = snapshot.docs.map(d => {
    // Strip legacy inline gameState so list rows stay light.
    const { gameState, ...meta } = d.data();
    return { id: d.id, ...meta, hasGameState: meta.hasGameState ?? !!gameState };
  });

  const last = snapshot.docs[snapshot.docs.length - 1] || null;
  return {
    campaigns,
    lastDoc: last ? { __cursor: last } : null,
    hasMore: snapshot.docs.length === maxResults
  };
};

export const getSharedCampaign = async (campaignId) => {
  if (!isFirebaseConfigured()) return null;

  const docRef = doc(db, SHARED_CAMPAIGNS_COLLECTION, campaignId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;
  const campaign = { id: docSnap.id, ...docSnap.data() };

  // Full state is fetched only when a caller needs the whole campaign
  // (details/import), never for list browsing.
  if (!campaign.gameState && campaign.hasGameState) {
    try {
      const dataSnap = await getDoc(doc(db, SHARED_CAMPAIGNS_COLLECTION, campaignId, 'data', CAMPAIGN_DATA_DOC));
      if (dataSnap.exists()) {
        campaign.gameState = dataSnap.data().gameState || {};
      }
    } catch (error) {
      console.warn('[sharedCampaignService] Could not load campaign state:', error?.message || error);
    }
  }

  return campaign;
};

export const downloadCampaign = async (campaignId) => {
  if (!isFirebaseConfigured()) return null;

  const campaign = await getSharedCampaign(campaignId);
  if (!campaign) throw new Error('Campaign not found');

  const docRef = doc(db, SHARED_CAMPAIGNS_COLLECTION, campaignId);
  await updateDoc(docRef, {
    downloads: increment(1)
  });

  return campaign;
};

export const deleteSharedCampaign = async (campaignId, publisherId) => {
  if (!isFirebaseConfigured()) return;

  const campaign = await getSharedCampaign(campaignId);
  if (!campaign) throw new Error('Campaign not found');
  if (campaign.publisherId !== publisherId) throw new Error('Not authorized to delete this campaign');

  try {
    await deleteDoc(doc(db, SHARED_CAMPAIGNS_COLLECTION, campaignId, 'data', CAMPAIGN_DATA_DOC));
  } catch (error) {
    console.debug('[sharedCampaignService] No campaign state doc to delete:', error?.message || error);
  }
  await deleteDoc(doc(db, SHARED_CAMPAIGNS_COLLECTION, campaignId));
};

export const getUserSharedCampaigns = async (publisherId, pageSize = 50) => {
  if (!isFirebaseConfigured()) return [];

  const q = query(
    collection(db, SHARED_CAMPAIGNS_COLLECTION),
    where('publisherId', '==', publisherId),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => {
    const { gameState, ...meta } = d.data();
    return { id: d.id, ...meta, hasGameState: meta.hasGameState ?? !!gameState };
  });
};
