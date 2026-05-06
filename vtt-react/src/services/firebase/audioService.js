import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage, isFirebaseConfigured, isDemoMode } from '../../config/firebase';
import { sanitizeForFirestore } from '../../utils/firebaseUtils';

const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/wave',
  'audio/x-wav',
  'audio/ogg',
  'audio/vorbis'
];

const ALLOWED_EXTENSIONS = ['.mp3', '.wav', '.ogg'];
const MAX_AUDIO_FILE_SIZE = 20 * 1024 * 1024;

function checkFirebaseAvailable() {
  if (!isFirebaseConfigured || isDemoMode || !db) {
    return false;
  }
  return true;
}

function validateAudioFile(file) {
  if (!file) throw new Error('No file provided');

  const ext = '.' + file.name.split('.').pop().toLowerCase();
  const validType = ALLOWED_AUDIO_TYPES.some(t => file.type === t || file.type.startsWith('audio/'));
  const validExt = ALLOWED_EXTENSIONS.includes(ext);

  if (!validType && !validExt) {
    throw new Error(`Unsupported audio format. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
  }

  if (file.size > MAX_AUDIO_FILE_SIZE) {
    throw new Error(`Audio file too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum: 20MB`);
  }

  return true;
}

function extractYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function uploadAudioFile(userId, file, metadata = {}) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    if (!userId) throw new Error('User ID is required');
    validateAudioFile(file);

    const ext = file.name.split('.').pop().toLowerCase();
    const fileName = `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${ext}`;
    const storagePath = `audio/${userId}/${fileName}`;

    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);

    const trackId = `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const trackData = {
      id: trackId,
      name: metadata.name || file.name.replace(/\.[^/.]+$/, ''),
      type: 'upload',
      url: downloadURL,
      duration: metadata.duration || null,
      fileSize: file.size,
      tags: metadata.tags || [],
      storagePath: storagePath,
      createdBy: userId,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const trackRef = doc(db, 'users', userId, 'audio', trackId);
    await setDoc(trackRef, sanitizeForFirestore(trackData));

    return { success: true, track: trackData };
  } catch (error) {
    console.error('Error uploading audio file:', error);
    return { success: false, error: error.message };
  }
}

export async function addYouTubeTrack(userId, youtubeUrl, metadata = {}) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    if (!userId) throw new Error('User ID is required');

    const youtubeId = extractYouTubeId(youtubeUrl);
    if (!youtubeId) {
      throw new Error('Invalid YouTube URL. Please provide a valid YouTube video link.');
    }

    const trackId = `yt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const trackData = {
      id: trackId,
      name: metadata.name || `YouTube: ${youtubeId}`,
      type: 'youtube',
      url: youtubeUrl,
      youtubeId: youtubeId,
      thumbnail: `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`,
      duration: metadata.duration || null,
      fileSize: 0,
      tags: metadata.tags || [],
      storagePath: null,
      createdBy: userId,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const trackRef = doc(db, 'users', userId, 'audio', trackId);
    await setDoc(trackRef, sanitizeForFirestore(trackData));

    return { success: true, track: trackData };
  } catch (error) {
    console.error('Error adding YouTube track:', error);
    return { success: false, error: error.message };
  }
}

export async function getAudioLibrary(userId) {
  try {
    if (!checkFirebaseAvailable() || !userId) {
      return [];
    }

    const audioRef = collection(db, 'users', userId, 'audio');
    const q = query(audioRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({ ...doc.data() }));
  } catch (error) {
    console.error('Error getting audio library:', error);
    return [];
  }
}

export async function updateAudioTrack(userId, trackId, updates) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    const trackRef = doc(db, 'users', userId, 'audio', trackId);
    await updateDoc(trackRef, {
      ...sanitizeForFirestore(updates),
      updatedAt: Date.now()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating audio track:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteAudioTrack(userId, track) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    if (track.type === 'upload' && track.storagePath) {
      try {
        const storageRef = ref(storage, track.storagePath);
        await deleteObject(storageRef);
      } catch (storageError) {
        console.warn('Could not delete audio file from storage:', storageError);
      }
    }

    const trackRef = doc(db, 'users', userId, 'audio', track.id);
    await deleteDoc(trackRef);

    return { success: true };
  } catch (error) {
    console.error('Error deleting audio track:', error);
    return { success: false, error: error.message };
  }
}

export async function saveAudioPlaylist(userId, playlist) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    const playlistId = playlist.id || `playlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const playlistData = {
      id: playlistId,
      name: playlist.name,
      tracks: playlist.tracks || [],
      createdBy: userId,
      createdAt: playlist.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    const playlistRef = doc(db, 'users', userId, 'audioPlaylists', playlistId);
    await setDoc(playlistRef, sanitizeForFirestore(playlistData));

    return { success: true, playlist: playlistData };
  } catch (error) {
    console.error('Error saving audio playlist:', error);
    return { success: false, error: error.message };
  }
}

export async function getAudioPlaylists(userId) {
  try {
    if (!checkFirebaseAvailable() || !userId) {
      return [];
    }

    const playlistsRef = collection(db, 'users', userId, 'audioPlaylists');
    const q = query(playlistsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({ ...doc.data() }));
  } catch (error) {
    console.error('Error getting audio playlists:', error);
    return [];
  }
}

export async function deleteAudioPlaylist(userId, playlistId) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    const playlistRef = doc(db, 'users', userId, 'audioPlaylists', playlistId);
    await deleteDoc(playlistRef);

    return { success: true };
  } catch (error) {
    console.error('Error deleting audio playlist:', error);
    return { success: false, error: error.message };
  }
}

export { extractYouTubeId, ALLOWED_AUDIO_TYPES, ALLOWED_EXTENSIONS, MAX_AUDIO_FILE_SIZE };
