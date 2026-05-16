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
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../config/firebase';
import { loadCompleteGameState } from '../roomService';

const SHARED_CAMPAIGNS_COLLECTION = 'sharedCampaigns';

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
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    gameState
  };

  await setDoc(doc(db, SHARED_CAMPAIGNS_COLLECTION, campaignId), sharedCampaign);

  return campaignId;
};

export const getSharedCampaigns = async (maxResults = 20, lastDoc = null) => {
  if (!isFirebaseConfigured()) return [];

  let q = query(
    collection(db, SHARED_CAMPAIGNS_COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getSharedCampaign = async (campaignId) => {
  if (!isFirebaseConfigured()) return null;

  const docRef = doc(db, SHARED_CAMPAIGNS_COLLECTION, campaignId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
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

  await deleteDoc(doc(db, SHARED_CAMPAIGNS_COLLECTION, campaignId));
};

export const getUserSharedCampaigns = async (publisherId) => {
  if (!isFirebaseConfigured()) return [];

  const q = query(
    collection(db, SHARED_CAMPAIGNS_COLLECTION),
    where('publisherId', '==', publisherId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
