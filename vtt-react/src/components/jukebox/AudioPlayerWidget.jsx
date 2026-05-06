import React, { useState, useRef, useEffect } from 'react';
import useAudioStore from '../../store/audioStore';

const VINYL_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="vg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2a1a0e"/>
      <stop offset="25%" stop-color="#1c1208"/>
      <stop offset="100%" stop-color="#0d0904"/>
    </radialGradient>
    <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7a3b2e"/>
      <stop offset="30%" stop-color="#d4af37"/>
      <stop offset="50%" stop-color="#f0d060"/>
      <stop offset="70%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#7a3b2e"/>
    </linearGradient>
    <radialGradient id="hl" cx="30%" cy="30%" r="40%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.18)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    <radialGradient id="fl" cx="60%" cy="65%" r="30%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.06)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <!-- Base disc -->
  <circle cx="50" cy="50" r="49" fill="url(#vg)" stroke="#3a2a18" stroke-width="1"/>
  <!-- Grooves -->
  <circle cx="50" cy="50" r="46" fill="none" stroke="#2a1a0e" stroke-width="0.15"/>
  <circle cx="50" cy="50" r="44" fill="none" stroke="#3a2818" stroke-width="0.2"/>
  <circle cx="50" cy="50" r="42" fill="none" stroke="#2a1a0e" stroke-width="0.15"/>
  <circle cx="50" cy="50" r="40" fill="none" stroke="#3a2818" stroke-width="0.2"/>
  <circle cx="50" cy="50" r="38" fill="none" stroke="#2a1a0e" stroke-width="0.15"/>
  <circle cx="50" cy="50" r="36" fill="none" stroke="#3a2818" stroke-width="0.2"/>
  <circle cx="50" cy="50" r="34" fill="none" stroke="#2a1a0e" stroke-width="0.15"/>
  <circle cx="50" cy="50" r="32" fill="none" stroke="#3a2818" stroke-width="0.2"/>
  <circle cx="50" cy="50" r="30" fill="none" stroke="#2a1a0e" stroke-width="0.15"/>
  <circle cx="50" cy="50" r="28" fill="none" stroke="#3a2818" stroke-width="0.2"/>
  <circle cx="50" cy="50" r="26" fill="none" stroke="#2a1a0e" stroke-width="0.15"/>
  <circle cx="50" cy="50" r="24" fill="none" stroke="#3a2818" stroke-width="0.2"/>
  <circle cx="50" cy="50" r="22" fill="none" stroke="#2a1a0e" stroke-width="0.15"/>
  <circle cx="50" cy="50" r="20" fill="none" stroke="#3a2a18" stroke-width="0.4"/>
  <!-- Asymmetric specular highlight (off-center = shows spin) -->
  <ellipse cx="34" cy="34" rx="22" ry="18" fill="url(#hl)" transform="rotate(-25 34 34)"/>
  <ellipse cx="62" cy="66" rx="14" ry="10" fill="url(#fl)" transform="rotate(15 62 66)"/>
  <!-- Surface scratches (visible spin markers) -->
  <line x1="22" y1="38" x2="36" y2="42" stroke="rgba(255,255,255,0.07)" stroke-width="0.3"/>
  <line x1="60" y1="28" x2="72" y2="32" stroke="rgba(255,255,255,0.05)" stroke-width="0.25"/>
  <line x1="30" y1="68" x2="40" y2="72" stroke="rgba(255,255,255,0.04)" stroke-width="0.2"/>
  <line x1="65" y1="55" x2="78" y2="58" stroke="rgba(255,255,255,0.06)" stroke-width="0.3"/>
  <!-- Dust specks (asymmetric dots = spin visible) -->
  <circle cx="25" cy="48" r="0.5" fill="rgba(255,255,255,0.12)"/>
  <circle cx="68" cy="38" r="0.4" fill="rgba(255,255,255,0.1)"/>
  <circle cx="38" cy="74" r="0.6" fill="rgba(255,255,255,0.08)"/>
  <circle cx="72" cy="62" r="0.3" fill="rgba(255,255,255,0.09)"/>
  <circle cx="28" cy="32" r="0.35" fill="rgba(255,255,255,0.07)"/>
  <circle cx="55" cy="25" r="0.45" fill="rgba(255,255,255,0.06)"/>
  <!-- Label -->
  <circle cx="50" cy="50" r="16" fill="url(#lg)" opacity="0.95"/>
  <circle cx="50" cy="50" r="16" fill="url(#hl)"/>
  <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(212,175,55,0.3)" stroke-width="0.3"/>
  <!-- Label text "M" for Mythrill (off-center marker = shows spin) -->
  <text x="50" y="48" text-anchor="middle" font-size="5" font-family="serif" fill="#3a1f0a" font-weight="bold" opacity="0.7">M</text>
  <text x="50" y="54" text-anchor="middle" font-size="2.2" font-family="serif" fill="#3a1f0a" opacity="0.5">MYTHRILL</text>
  <!-- Label dot markers (asymmetric) -->
  <circle cx="42" cy="42" r="0.6" fill="#3a1f0a" opacity="0.5"/>
  <circle cx="58" cy="42" r="0.6" fill="#3a1f0a" opacity="0.5"/>
  <circle cx="42" cy="58" r="0.6" fill="#3a1f0a" opacity="0.5"/>
  <circle cx="58" cy="58" r="0.6" fill="#3a1f0a" opacity="0.5"/>
  <!-- Spindle -->
  <circle cx="50" cy="50" r="3" fill="#1c1208"/>
  <circle cx="50" cy="50" r="1.8" fill="#d4af37"/>
  <circle cx="50" cy="50" r="0.7" fill="#1c1208"/>
</svg>`;

export default function AudioPlayerWidget() {
  const {
    playingTracks, masterVolume, isMuted,
    setTrackVolume, setMasterMute,
    setMasterVolume, stopTrack
  } = useAudioStore();

  const [expanded, setExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 24, y: 24 });
  const [dragging, setDragging] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  const hasTracks = playingTracks.length > 0;

  useEffect(() => {
    if (hasTracks) {
      const t = setTimeout(() => setSpinning(true), 50);
      return () => clearTimeout(t);
    }
    setSpinning(false);
  }, [hasTracks]);

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e) => {
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      setPosition({
        x: dragStart.current.posX - (cx - dragStart.current.x),
        y: dragStart.current.posY - (cy - dragStart.current.y)
      });
    };

    const onUp = () => setDragging(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [dragging]);

  if (!hasTracks) return null;

  const firstTrack = playingTracks[0];
  const multiTrack = playingTracks.length > 1;
  const vol = isMuted ? 0 : Math.round(masterVolume * 100);

  return (
    <div
      className="lutebox-player-widget"
      style={{
        position: 'fixed',
        bottom: position.y,
        right: position.x,
        zIndex: 10000,
        userSelect: 'none',
        transition: dragging ? 'none' : 'all 0.3s ease'
      }}
    >
      {/* Main pill */}
      <div
        className="lutebox-player-pill"
        onMouseDown={(e) => { dragStart.current = { x: e.clientX, y: e.clientY, posX: position.x, posY: position.y }; setDragging(true); }}
        onTouchStart={(e) => { const t = e.touches[0]; dragStart.current = { x: t.clientX, y: t.clientY, posX: position.x, posY: position.y }; setDragging(true); }}
      >
        {/* Vinyl disc */}
        <div
          className={`lutebox-vinyl ${spinning && !isMuted ? 'lutebox-vinyl-spinning' : ''}`}
          dangerouslySetInnerHTML={{ __html: VINYL_SVG }}
        />

        {/* Track info */}
        <div className="lutebox-player-info">
          <div className="lutebox-player-name">{firstTrack.name}</div>
          {multiTrack && (
            <div className="lutebox-player-extra">
              +{playingTracks.length - 1} more
            </div>
          )}
        </div>

        {/* Controls (stop drag propagation) */}
        <div
          className="lutebox-player-controls"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Volume slider */}
          <div className="lutebox-player-vol">
            <i className={`fas ${vol === 0 ? 'fa-volume-xmark' : vol < 40 ? 'fa-volume-low' : 'fa-volume-high'}`}
              style={{ color: isMuted ? '#ff6b6b' : '#a08c70' }}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={vol}
              onChange={(e) => {
                const v = e.target.value / 100;
                if (v === 0) setMasterMute(true);
                else { if (isMuted) setMasterMute(false); setMasterVolume(v); }
              }}
            />
          </div>

          {/* Mute */}
          <button className="lutebox-player-btn" onClick={() => setMasterMute(!isMuted)} title={isMuted ? 'Unmute' : 'Mute'}>
            <i className={`fas ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`} />
          </button>

          {/* Expand */}
          <button className="lutebox-player-btn lutebox-player-expand" onClick={() => setExpanded(!expanded)} title="Show all tracks">
            <i className={`fas fa-chevron-${expanded ? 'down' : 'up'}`} />
          </button>
        </div>
      </div>

      {/* Expanded track list */}
      {expanded && (
        <div className="lutebox-player-expanded">
          {playingTracks.map(track => (
            <div key={track.trackId} className="lutebox-player-track-row">
              <i className={`${track.type === 'youtube' ? 'fab fa-youtube' : 'fas fa-music'} lutebox-player-track-icon`} />
              <span className="lutebox-player-track-name">{track.name}</span>
              <div className="lutebox-player-track-vol">
                <input
                  type="range"
                  min={0} max={100}
                  value={Math.round((track.volume || 1) * 100)}
                  onChange={(e) => setTrackVolume(track.trackId, e.target.value / 100)}
                />
              </div>
              {track.loop && <i className="fas fa-repeat lutebox-player-loop" />}
              <button className="lutebox-player-track-stop" onClick={() => stopTrack(track.trackId, 300)}>
                <i className="fas fa-xmark" />
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes lutebox-lp-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes lutebox-lp-glow {
          0%, 100% { box-shadow: 0 0 6px rgba(212, 175, 55, 0.15), 0 0 12px rgba(0,0,0,0.5); }
          50% { box-shadow: 0 0 10px rgba(212, 175, 55, 0.35), 0 0 20px rgba(0,0,0,0.5); }
        }

        .lutebox-player-widget input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
          height: 16px;
        }
        .lutebox-player-widget input[type="range"]::-webkit-slider-runnable-track {
          background: rgba(160, 140, 112, 0.25);
          height: 3px;
          border-radius: 2px;
        }
        .lutebox-player-widget input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 10px;
          height: 10px;
          background: #d4af37;
          border-radius: 50%;
          margin-top: -3.5px;
          cursor: pointer;
          box-shadow: 0 0 4px rgba(212, 175, 55, 0.4);
        }

        .lutebox-player-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 14px 6px 6px;
          background: linear-gradient(135deg, rgba(28, 18, 8, 0.97) 0%, rgba(42, 26, 14, 0.97) 100%);
          backdrop-filter: blur(12px);
          border: 1.5px solid rgba(212, 175, 55, 0.3);
          border-radius: 30px;
          box-shadow:
            0 4px 24px rgba(0, 0, 0, 0.6),
            0 0 16px rgba(212, 175, 55, 0.1),
            inset 0 1px 0 rgba(212, 175, 55, 0.1);
          cursor: grab;
          min-width: 240px;
          font-family: 'Bookman Old Style', 'Garamond', serif;
          color: #e8dcc8;
        }

        .lutebox-player-pill:active { cursor: grabbing; }

        .lutebox-vinyl {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 0 8px rgba(0,0,0,0.5);
          transition: box-shadow 0.3s ease;
        }

        .lutebox-vinyl-spinning {
          animation: lutebox-lp-spin 2s linear infinite, lutebox-lp-glow 3s ease-in-out infinite;
        }

        .lutebox-player-info {
          flex: 1;
          min-width: 0;
          max-width: 140px;
        }

        .lutebox-player-name {
          font-size: 0.78rem;
          color: #f0d060;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-shadow: 0 1px 2px rgba(0,0,0,0.4);
        }

        .lutebox-player-extra {
          font-size: 0.6rem;
          color: #a08c70;
          margin-top: -1px;
        }

        .lutebox-player-controls {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .lutebox-player-vol {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .lutebox-player-vol i {
          font-size: 0.6rem;
        }

        .lutebox-player-vol input {
          width: 50px;
        }

        .lutebox-player-btn {
          background: none;
          border: none;
          color: #a08c70;
          cursor: pointer;
          font-size: 0.78rem;
          padding: 2px;
          transition: color 0.15s;
        }

        .lutebox-player-btn:hover {
          color: #f0d060;
        }

        .lutebox-player-expand {
          font-size: 0.6rem;
        }

        .lutebox-player-expanded {
          background: linear-gradient(180deg, rgba(28, 18, 8, 0.97) 0%, rgba(20, 14, 6, 0.97) 100%);
          backdrop-filter: blur(12px);
          border: 1.5px solid rgba(212, 175, 55, 0.2);
          border-top: none;
          border-radius: 0 0 10px 10px;
          padding: 8px 12px;
          max-height: 180px;
          overflow-y: auto;
          font-family: 'Bookman Old Style', 'Garamond', serif;
        }

        .lutebox-player-expanded::-webkit-scrollbar {
          width: 3px;
        }

        .lutebox-player-expanded::-webkit-scrollbar-thumb {
          background: rgba(160, 140, 112, 0.3);
          border-radius: 2px;
        }

        .lutebox-player-track-row {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 0;
        }

        .lutebox-player-track-icon {
          font-size: 0.6rem;
          color: #a08c70;
          width: 14px;
          text-align: center;
        }

        .lutebox-player-track-row .fa-youtube { color: #ff6b6b; }
        .lutebox-player-track-row .fa-music { color: #4a9eff; }

        .lutebox-player-track-name {
          flex: 1;
          font-size: 0.72rem;
          color: #e8dcc8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        .lutebox-player-track-vol input {
          width: 40px;
        }

        .lutebox-player-loop {
          font-size: 0.5rem;
          color: rgba(212, 175, 55, 0.4);
        }

        .lutebox-player-track-stop {
          background: none;
          border: none;
          color: #a08c70;
          cursor: pointer;
          font-size: 0.65rem;
          padding: 2px;
          transition: color 0.15s;
        }

        .lutebox-player-track-stop:hover {
          color: #ff6b6b;
        }
      `}</style>
    </div>
  );
}
