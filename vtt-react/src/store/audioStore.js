import { create } from 'zustand';
import audioEngine from '../services/audioEngine';
import {
  uploadAudioFile,
  addYouTubeTrack,
  getAudioLibrary,
  updateAudioTrack,
  deleteAudioTrack,
  saveAudioPlaylist,
  getAudioPlaylists,
  deleteAudioPlaylist,
  extractYouTubeId
} from '../services/firebase/audioService';
import storageLimitService from '../services/firebase/storageLimitService';

const getSocket = () => {
  try {
    const presenceStore = require('./presenceStore').default;
    return presenceStore?.getState()?.socket;
  } catch (e) {
    return null;
  }
};

const useAudioStore = create((set, get) => ({
  library: [],
  playlists: [],
  playingTracks: [],
  masterVolume: 1.0,
  isMuted: false,
  isLoading: false,
  error: null,
  jukeboxOpen: false,
  gmBroadcastState: null,

  setJukeboxOpen: (open) => set({ jukeboxOpen: open }),

  loadLibrary: async (userId) => {
    if (!userId) return;
    set({ isLoading: true, error: null });
    try {
      const [tracks, playlists] = await Promise.all([
        getAudioLibrary(userId),
        getAudioPlaylists(userId)
      ]);
      set({ library: tracks, playlists, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  uploadTrack: async (userId, file, metadata = {}) => {
    set({ isLoading: true, error: null });
    try {
      const canStore = await storageLimitService.canStoreData(userId, file.size, 'audioFiles');
      if (!canStore) {
        throw new Error('Storage limit exceeded. Please upgrade your plan or free up space.');
      }

      const result = await uploadAudioFile(userId, file, metadata);
      if (result.success) {
        const library = [result.track, ...get().library];
        set({ library, isLoading: false });

        await storageLimitService.updateStorageUsage(userId, 'audioFiles', file.size);
        return result;
      }
      throw new Error(result.error);
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  addYouTubeLink: async (userId, url, metadata = {}) => {
    set({ isLoading: true, error: null });
    try {
      const result = await addYouTubeTrack(userId, url, metadata);
      if (result.success) {
        const library = [result.track, ...get().library];
        set({ library, isLoading: false });
        return result;
      }
      throw new Error(result.error);
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  updateTrack: async (userId, trackId, updates) => {
    try {
      const result = await updateAudioTrack(userId, trackId, updates);
      if (result.success) {
        const library = get().library.map(t =>
          t.id === trackId ? { ...t, ...updates } : t
        );
        set({ library });
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  deleteTrack: async (userId, track) => {
    try {
      const result = await deleteAudioTrack(userId, track);
      if (result.success) {
        const library = get().library.filter(t => t.id !== track.id);
        set({ library });

        if (track.fileSize > 0) {
          await storageLimitService.updateStorageUsage(userId, 'audioFiles', -track.fileSize);
        }
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  savePlaylist: async (userId, playlist) => {
    try {
      const result = await saveAudioPlaylist(userId, playlist);
      if (result.success) {
        const existing = get().playlists.findIndex(p => p.id === result.playlist.id);
        const playlists = [...get().playlists];
        if (existing >= 0) {
          playlists[existing] = result.playlist;
        } else {
          playlists.unshift(result.playlist);
        }
        set({ playlists });
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  deletePlaylist: async (userId, playlistId) => {
    try {
      const result = await deleteAudioPlaylist(userId, playlistId);
      if (result.success) {
        const playlists = get().playlists.filter(p => p.id !== playlistId);
        set({ playlists });
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  playTrack: async (track, options = {}) => {
    const { volume = 1.0, loop = false, fadeIn = 500, startTime = 0 } = options;

    try {
      await audioEngine.play(track.id, track.url, {
        type: track.type,
        youtubeId: track.youtubeId,
        volume,
        loop,
        fadeIn,
        startTime
      });

      const playingTracks = get().playingTracks.filter(t => t.trackId !== track.id);
      playingTracks.push({
        trackId: track.id,
        name: track.name,
        type: track.type,
        volume,
        loop,
        isPlaying: true,
        thumbnail: track.thumbnail || null,
        youtubeId: track.youtubeId || null
      });

      set({ playingTracks });
    } catch (error) {
      console.error('Error playing track:', error);
    }
  },

  stopTrack: (trackId, fadeOut = 500) => {
    audioEngine.stop(trackId, fadeOut);
    const playingTracks = get().playingTracks.filter(t => t.trackId !== trackId);
    set({ playingTracks });
  },

  stopAllTracks: (fadeOut = 500) => {
    audioEngine.stopAll(fadeOut);
    set({ playingTracks: [] });
  },

  setTrackVolume: (trackId, volume) => {
    audioEngine.setVolume(trackId, volume);
    const playingTracks = get().playingTracks.map(t =>
      t.trackId === trackId ? { ...t, volume } : t
    );
    set({ playingTracks });
  },

  setTrackMute: (trackId, muted) => {
    audioEngine.setMute(trackId, muted);
    const playingTracks = get().playingTracks.map(t =>
      t.trackId === trackId ? { ...t, muted } : t
    );
    set({ playingTracks });
  },

  setTrackLoop: (trackId, loop) => {
    audioEngine.setLoop(trackId, loop);
    const playingTracks = get().playingTracks.map(t =>
      t.trackId === trackId ? { ...t, loop } : t
    );
    set({ playingTracks });
  },

  setMasterVolume: (volume) => {
    audioEngine.setMasterVolume(volume);
    set({ masterVolume: volume });
  },

  setMasterMute: (muted) => {
    if (muted) {
      audioEngine.setMasterVolume(0);
    } else {
      audioEngine.setMasterVolume(get().masterVolume);
    }
    set({ isMuted: muted });
  },

  broadcastToPlayers: (tracks, targetPlayerIds = null) => {
    const payload = {
      tracks: tracks.map(t => ({
        trackId: t.trackId,
        name: t.name,
        type: t.type,
        url: t.url,
        youtubeId: t.youtubeId,
        volume: t.volume,
        loop: t.loop
      })),
      targetPlayers: targetPlayerIds,
      timestamp: Date.now()
    };

    const socket = getSocket();
    if (socket) {
      socket.emit('audio_broadcast', payload);
    } else {
      get().handleIncomingBroadcast(payload);
      set({ gmBroadcastState: { ...payload, isSimulated: true } });
    }
  },

  broadcastStop: (trackIds = null, targetPlayerIds = null) => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit('audio_stop', {
      trackIds,
      targetPlayers: targetPlayerIds,
      timestamp: Date.now()
    });
  },

  broadcastStopAll: (targetPlayerIds = null) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('audio_stop_all', {
        targetPlayers: targetPlayerIds,
        timestamp: Date.now()
      });
    } else {
      get().handleIncomingStopAll();
      set({ gmBroadcastState: null });
    }
  },

  handleIncomingBroadcast: (data) => {
    if (!data || !data.tracks) return;

    for (const track of data.tracks) {
      const existing = get().playingTracks.find(t => t.trackId === track.trackId);
      if (existing) {
        audioEngine.stop(track.trackId, 300);
      }

      audioEngine.play(track.trackId, track.url, {
        type: track.type,
        youtubeId: track.youtubeId,
        volume: track.volume || 1.0,
        loop: track.loop || false,
        fadeIn: 500
      });
    }

    const newPlayingTracks = [...get().playingTracks];
    for (const track of data.tracks) {
      const idx = newPlayingTracks.findIndex(t => t.trackId === track.trackId);
      const entry = {
        trackId: track.trackId,
        name: track.name,
        type: track.type,
        volume: track.volume || 1.0,
        loop: track.loop || false,
        isPlaying: true,
        thumbnail: track.thumbnail || null,
        youtubeId: track.youtubeId || null
      };
      if (idx >= 0) {
        newPlayingTracks[idx] = entry;
      } else {
        newPlayingTracks.push(entry);
      }
    }

    set({ playingTracks: newPlayingTracks });
  },

  handleIncomingStop: (data) => {
    if (!data) return;

    if (data.trackIds && Array.isArray(data.trackIds)) {
      for (const trackId of data.trackIds) {
        audioEngine.stop(trackId, 300);
      }
      const playingTracks = get().playingTracks.filter(
        t => !data.trackIds.includes(t.trackId)
      );
      set({ playingTracks });
    }
  },

  handleIncomingStopAll: () => {
    audioEngine.stopAll(300);
    set({ playingTracks: [] });
  },

  requestSync: (roomId) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('audio_sync_request', { roomId });
  },

  handleSyncState: (data) => {
    if (!data || !data.tracks) return;

    audioEngine.stopAll(0);
    const newPlayingTracks = [];

    for (const track of data.tracks) {
      audioEngine.play(track.trackId, track.url, {
        type: track.type,
        youtubeId: track.youtubeId,
        volume: track.volume || 1.0,
        loop: track.loop || false,
        fadeIn: 500,
        startTime: track.elapsed || 0
      });

      newPlayingTracks.push({
        trackId: track.trackId,
        name: track.name,
        type: track.type,
        volume: track.volume || 1.0,
        loop: track.loop || false,
        isPlaying: true,
        thumbnail: track.thumbnail || null,
        youtubeId: track.youtubeId || null
      });
    }

    set({ playingTracks: newPlayingTracks });
  },

  saveRoomAudioState: () => {
    const state = audioEngine.getState();
    return state.tracks.map(t => ({
      trackId: t.trackId,
      volume: t.volume,
      loop: t.loop,
      elapsed: t.elapsed || 0,
      startedAt: t.startedAt
    }));
  },

  clearError: () => set({ error: null }),
  resetStore: () => {
    audioEngine.stopAll(0);
    set({
      library: [],
      playlists: [],
      playingTracks: [],
      masterVolume: 1.0,
      isMuted: false,
      isLoading: false,
      error: null,
      jukeboxOpen: false,
      gmBroadcastState: null
    });
  }
}));

export default useAudioStore;
