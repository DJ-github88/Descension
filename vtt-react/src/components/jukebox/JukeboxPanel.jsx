import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AudioUploadDialog from './AudioUploadDialog';
import YouTubeLinkDialog from './YouTubeLinkDialog';
import useAudioStore from '../../store/audioStore';
import useAuthStore from '../../store/authStore';
import usePartyStore from '../../store/partyStore';
import useGameStore from '../../store/gameStore';
import { canUseFeature } from '../../services/subscriptionService';
import BUILT_IN_TRACKS from '../../data/builtInAudio';
import './Lutebox.css';

const TAG_COLORS = {
  ambient: '#4a9eff',
  combat: '#ff4a4a',
  tavern: '#d4af37',
  boss: '#9b59b6',
  dungeon: '#7f8c8d',
  town: '#2ecc71',
  forest: '#27ae60',
  sfx: '#e67e22',
  mystery: '#8e44ad',
  sad: '#5dade2',
  victory: '#f1c40f',
  'boss-battle': '#c0392b',
};

function getTagColor(tag) {
  return TAG_COLORS[tag.toLowerCase()] || '#8b7355';
}

const LUTE_SVG = () => (
  <svg viewBox="0 0 40 40" width="40" height="40" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}>
    <ellipse cx="20" cy="28" rx="12" ry="10" fill="#8B4513" stroke="#5e2e23" strokeWidth="1.5"/>
    <ellipse cx="20" cy="28" rx="8" ry="6.5" fill="#a0522d" opacity="0.6"/>
    <circle cx="17" cy="26" r="1.2" fill="#3a1f0a"/>
    <circle cx="23" cy="26" r="1.2" fill="#3a1f0a"/>
    <circle cx="20" cy="30" r="1.2" fill="#3a1f0a"/>
    <rect x="18.5" y="6" width="3" height="19" rx="1" fill="#5e2e23"/>
    <rect x="15" y="4" width="10" height="4" rx="1.5" fill="#5e2e23" stroke="#3a1f0a" strokeWidth="0.5"/>
    <line x1="16" y1="6" x2="16" y2="34" stroke="#d4af37" strokeWidth="0.3" opacity="0.5"/>
    <line x1="24" y1="6" x2="24" y2="34" stroke="#d4af37" strokeWidth="0.3" opacity="0.5"/>
    <line x1="20" y1="6" x2="20" y2="34" stroke="#d4af37" strokeWidth="0.3" opacity="0.5"/>
  </svg>
);

export default function LuteboxPanel({ isGM = false }) {
  const user = useAuthStore(s => s.user);
  const userId = user?.uid;
  const isOffline = !useGameStore(s => s.isInMultiplayer);

  const partyMembers = usePartyStore(s => {
    const members = s.partyMembers || [];
    return members.filter(m => !m.isGM).map(m => ({
      id: m.id || m.userId || m.socketId,
      socketId: m.socketId,
      name: m.name || m.displayName || 'Player'
    }));
  });

  const {
    library, playingTracks, isLoading,
    loadLibrary, uploadTrack, addYouTubeLink, deleteTrack,
    playTrack, stopTrack, stopAllTracks,
    setTrackVolume, setTrackLoop,
    broadcastToPlayers, broadcastStop, broadcastStopAll
  } = useAudioStore();

  const [showUpload, setShowUpload] = useState(false);
  const [showYouTube, setShowYouTube] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState(null);
  const [selectedTracks, setSelectedTracks] = useState(new Set());
  const [targetPlayers, setTargetPlayers] = useState(null);
  const [showBroadcastConfirm, setShowBroadcastConfirm] = useState(false);
  const [hoveredTrack, setHoveredTrack] = useState(null);

  useEffect(() => {
    if (userId) loadLibrary(userId);
  }, [userId, loadLibrary]);

  const allTracks = useMemo(() => {
    return [...BUILT_IN_TRACKS, ...library];
  }, [library]);

  const filteredLibrary = useMemo(() => {
    let items = allTracks;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(t =>
        t.name.toLowerCase().includes(q) ||
        (t.tags || []).some(tag => tag.includes(q))
      );
    }
    if (filterTag) {
      items = items.filter(t => (t.tags || []).includes(filterTag));
    }
    return items;
  }, [allTracks, searchQuery, filterTag]);

  const allTags = useMemo(() => {
    const tagSet = new Set();
    allTracks.forEach(t => (t.tags || []).forEach(tag => tagSet.add(tag)));
    return [...tagSet].sort();
  }, [library]);

  const toggleTrack = useCallback((trackId) => {
    setSelectedTracks(prev => {
      const next = new Set(prev);
      if (next.has(trackId)) next.delete(trackId);
      else next.add(trackId);
      return next;
    });
  }, []);

  const handleUpload = async (file, metadata) => uploadTrack(userId, file, metadata);
  const handleYouTubeAdd = async (url, metadata) => addYouTubeLink(userId, url, metadata);

  const handleDelete = async (track) => {
    if (window.confirm(`Remove "${track.name}" from your library?`)) {
      await deleteTrack(userId, track);
    }
  };

  const handlePreview = (track) => {
    const isPlaying = playingTracks.some(t => t.trackId === track.id);
    if (isPlaying) {
      stopTrack(track.id, 300);
    } else {
      playTrack(track, { volume: 0.8, loop: true, fadeIn: 300 });
    }
  };

  const handleBroadcastSelected = () => {
    const tracksToBroadcast = allTracks
      .filter(t => selectedTracks.has(t.id))
      .map(track => {
        const playing = playingTracks.find(p => p.trackId === track.id);
        return {
          trackId: track.id,
          name: track.name,
          type: track.type,
          url: track.url,
          youtubeId: track.youtubeId,
          volume: playing?.volume || 0.8,
          loop: playing?.loop !== undefined ? playing.loop : true
        };
      });

    if (tracksToBroadcast.length === 0) return;
    broadcastToPlayers(tracksToBroadcast, targetPlayers);

    if (!isOffline) {
      for (const track of tracksToBroadcast) {
        const libTrack = allTracks.find(t => t.id === track.trackId);
        if (libTrack && !playingTracks.some(p => p.trackId === track.trackId)) {
          playTrack(libTrack, { volume: track.volume, loop: track.loop, fadeIn: 500 });
        }
      }
    }

    setSelectedTracks(new Set());
    setShowBroadcastConfirm(false);
  };

  const handleBroadcastStopAll = () => {
    broadcastStopAll(targetPlayers);
    stopAllTracks(500);
  };

  const tierCheck = canUseFeature('jukebox', 'FREE');

  return (
    <div className="lutebox-panel">
      {/* Decorative top border */}
      <div className="lutebox-ornament-top" />

      {/* Header */}
      <div className="lutebox-header">
        <div className="lutebox-header-left">
          <LUTE_SVG />
          <div className="lutebox-header-title">
            <h2>Lutebox</h2>
            <span className="lutebox-subtitle">Bardic Soundboard</span>
          </div>
        </div>
        <div className="lutebox-header-actions">
          <button
            className="lutebox-btn lutebox-btn-upload"
            onClick={() => setShowUpload(true)}
            title="Upload Audio File"
            disabled={!tierCheck}
          >
            <i className="fas fa-upload" />
            <span>Upload</span>
          </button>
          <button
            className="lutebox-btn lutebox-btn-youtube"
            onClick={() => setShowYouTube(true)}
            title="Add YouTube Link"
          >
            <i className="fab fa-youtube" />
            <span>YouTube</span>
          </button>
        </div>
      </div>

      {/* GM Broadcast Bar */}
      {isGM && (
        <div className="lutebox-broadcast-bar">
          <div className="lutebox-broadcast-label">
            <i className="fas fa-broadcast-tower" />
            <span>Broadcast to Party</span>
            {isOffline && (
              <span className="lutebox-offline-badge" title="No players connected — broadcast will simulate the player experience locally">
                <i className="fas fa-eye" /> Preview Mode
              </span>
            )}
          </div>
          <div className="lutebox-broadcast-controls">
            {!isOffline && (
              <select
                className="lutebox-target-select"
                value={targetPlayers === null ? 'all' : 'custom'}
                onChange={(e) => {
                  if (e.target.value === 'all') setTargetPlayers(null);
                  else if (partyMembers.length > 0) {
                    setTargetPlayers([partyMembers[0].id || partyMembers[0].socketId]);
                  }
                }}
              >
                <option value="all">All Players</option>
                {partyMembers.map((m, i) => (
                  <option key={m.id || m.socketId || i} value={m.id || m.socketId}>
                    {m.name}
                  </option>
                ))}
              </select>
            )}
            <button
              className="lutebox-btn lutebox-btn-broadcast"
              disabled={selectedTracks.size === 0}
              onClick={() => setShowBroadcastConfirm(true)}
            >
              <i className={isOffline ? 'fas fa-eye' : 'fas fa-play'} />
              {isOffline ? `Preview (${selectedTracks.size})` : `Play (${selectedTracks.size})`}
            </button>
            <button
              className="lutebox-btn lutebox-btn-stop-all"
              onClick={handleBroadcastStopAll}
              disabled={playingTracks.length === 0}
              title="Stop All Audio"
            >
              <i className="fas fa-stop" />
            </button>
          </div>
          {selectedTracks.size > 0 && (
            <div className="lutebox-selected-count">
              {selectedTracks.size} track{selectedTracks.size > 1 ? 's' : ''} selected
            </div>
          )}
        </div>
      )}

      {/* Search */}
      <div className="lutebox-search">
        <i className="fas fa-search" />
        <input
          type="text"
          placeholder="Search by name or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {(searchQuery || filterTag) && (
          <button className="lutebox-search-clear" onClick={() => { setSearchQuery(''); setFilterTag(null); }}>
            <i className="fas fa-times" />
          </button>
        )}
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="lutebox-tags">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`lutebox-tag ${filterTag === tag ? 'lutebox-tag-active' : ''}`}
              style={{
                '--tag-color': getTagColor(tag),
                borderColor: filterTag === tag ? getTagColor(tag) : 'transparent'
              }}
              onClick={() => setFilterTag(filterTag === tag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Track Library */}
      <div className="lutebox-library">
        {isLoading && library.length === 0 ? (
          <div className="lutebox-empty">
            <div className="lutebox-loading-spinner">
              <i className="fas fa-compact-disc fa-spin" />
            </div>
            <span>Opening your songbook...</span>
          </div>
        ) : filteredLibrary.length === 0 ? (
          <div className="lutebox-empty">
            <i className="fas fa-music" />
            <h3>{library.length === 0 ? 'Your Songbook is Empty' : 'No Matching Tracks'}</h3>
            <p>{library.length === 0 ? 'Upload audio files or add YouTube links to fill your bardic repertoire!' : 'Try a different search or tag filter.'}</p>
          </div>
        ) : (
          filteredLibrary.map(track => {
            const isPlaying = playingTracks.some(t => t.trackId === track.id);
            const isSelected = selectedTracks.has(track.id);
            const isHovered = hoveredTrack === track.id;

            return (
              <div
                key={track.id}
                className={`lutebox-track ${isPlaying ? 'lutebox-track-playing' : ''} ${isSelected ? 'lutebox-track-selected' : ''} ${isHovered ? 'lutebox-track-hover' : ''}`}
                onClick={(e) => {
                  if (!e.target.closest('button') && !e.target.closest('input') && !e.target.closest('.lutebox-volume-slider')) {
                    if (isGM) toggleTrack(track.id);
                    else handlePreview(track);
                  }
                }}
                onMouseEnter={() => setHoveredTrack(track.id)}
                onMouseLeave={() => setHoveredTrack(null)}
              >
                {/* Sound wave bars for playing tracks */}
                {isPlaying && (
                  <div className="lutebox-eq-bars">
                    <span /><span /><span /><span /><span />
                  </div>
                )}

                {/* Checkbox for GM */}
                {isGM && (
                  <div
                    className={`lutebox-checkbox ${isSelected ? 'lutebox-checkbox-checked' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleTrack(track.id); }}
                  >
                    {isSelected && <i className="fas fa-check" />}
                  </div>
                )}

                {/* Track icon */}
                <div className="lutebox-track-icon" data-type={track.type}>
                  <i className={track.type === 'youtube' ? 'fab fa-youtube' : 'fas fa-music'} />
                </div>

                {/* Track info */}
                <div className="lutebox-track-info">
                  <div className="lutebox-track-name">
                    {track.name}
                    {track.builtIn && <span className="lutebox-badge-builtin">Built-in</span>}
                  </div>
                  <div className="lutebox-track-meta">
                    {(track.tags || []).slice(0, 3).map(tag => (
                      <span key={tag} className="lutebox-track-tag" style={{ '--tag-color': getTagColor(tag) }}>
                        {tag}
                      </span>
                    ))}
                    {track.fileSize > 0 && (
                      <span className="lutebox-track-size">
                        {(track.fileSize / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    )}
                    {track.type === 'youtube' && (
                      <span className="lutebox-track-type-badge lutebox-badge-yt">YT</span>
                    )}
                  </div>
                </div>

                {/* Volume slider (when playing) */}
                {isPlaying && (
                  <div className="lutebox-volume-slider" onClick={(e) => e.stopPropagation()}>
                    <i className="fas fa-volume-low" />
                    <input
                      type="range"
                      min={0} max={100}
                      defaultValue={80}
                      onChange={(e) => setTrackVolume(track.id, e.target.value / 100)}
                    />
                  </div>
                )}

                {/* Action buttons */}
                <div className="lutebox-track-actions">
                  <button
                    className={`lutebox-action-btn ${isPlaying ? 'lutebox-action-playing' : ''}`}
                    onClick={(e) => { e.stopPropagation(); handlePreview(track); }}
                    title={isPlaying ? 'Stop Preview' : 'Preview Track'}
                  >
                    <i className={`fas ${isPlaying ? 'fa-stop' : 'fa-play'}`} />
                  </button>
                  {!track.builtIn && (
                    <button
                      className="lutebox-action-btn lutebox-action-delete"
                      onClick={(e) => { e.stopPropagation(); handleDelete(track); }}
                      title="Remove Track"
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Now Playing Footer */}
      {playingTracks.length > 0 && (
        <div className="lutebox-now-playing">
          <div className="lutebox-np-header">
            <div className="lutebox-np-title">
              <div className="lutebox-np-eq">
                <span /><span /><span /><span />
              </div>
              <span>Now Playing</span>
              <span className="lutebox-np-count">{playingTracks.length}</span>
            </div>
            <button className="lutebox-btn lutebox-btn-stop-all-small" onClick={() => stopAllTracks(300)}>
              <i className="fas fa-stop" /> Stop All
            </button>
          </div>
          <div className="lutebox-np-tracks">
            {playingTracks.map(pt => (
              <div key={pt.trackId} className="lutebox-np-track">
                <i className={`${pt.type === 'youtube' ? 'fab fa-youtube' : 'fas fa-music'} lutebox-np-icon`} />
                <span className="lutebox-np-name">{pt.name}</span>
                {pt.loop && <i className="fas fa-repeat lutebox-np-loop" title="Looping" />}
                <button className="lutebox-np-stop" onClick={() => stopTrack(pt.trackId, 300)}>
                  <i className="fas fa-xmark" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dialogs */}
      <AudioUploadDialog
        show={showUpload}
        onHide={() => setShowUpload(false)}
        onUpload={handleUpload}
        disabled={!tierCheck}
      />
      <YouTubeLinkDialog
        show={showYouTube}
        onHide={() => setShowYouTube(false)}
        onAdd={handleYouTubeAdd}
      />

      {/* Broadcast Confirm Modal */}
      {showBroadcastConfirm && (
        <div className="lutebox-modal-overlay" onClick={() => setShowBroadcastConfirm(false)}>
          <div className="lutebox-modal" onClick={(e) => e.stopPropagation()}>
            <div className="lutebox-modal-icon">
              <i className={isOffline ? 'fas fa-eye' : 'fas fa-broadcast-tower'} />
            </div>
            <h3>{isOffline ? 'Preview Performance?' : 'Begin Performance?'}</h3>
            <p>
              {isOffline ? (
                <>
                  Simulate broadcasting <strong>{selectedTracks.size}</strong> track{selectedTracks.size > 1 ? 's' : ''}{' '}
                  to see how players would experience it?
                  <br />
                  <small style={{ opacity: 0.7 }}>No players connected — audio will play locally as a preview.</small>
                </>
              ) : (
                <>
                  Broadcast <strong>{selectedTracks.size}</strong> track{selectedTracks.size > 1 ? 's' : ''} to{' '}
                  <strong>{targetPlayers ? 'selected player(s)' : 'the entire party'}</strong>?
                </>
              )}
            </p>
            <div className="lutebox-modal-actions">
              <button className="lutebox-btn lutebox-btn-cancel" onClick={() => setShowBroadcastConfirm(false)}>
                Cancel
              </button>
              <button className="lutebox-btn lutebox-btn-broadcast-confirm" onClick={handleBroadcastSelected}>
                <i className={isOffline ? 'fas fa-eye' : 'fas fa-broadcast-tower'} />
                {isOffline ? 'Preview' : 'Broadcast'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
