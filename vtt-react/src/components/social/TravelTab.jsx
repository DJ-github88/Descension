import React, { useRef, useEffect } from 'react';
import useTravelStore from '../../store/travelStore';
import useGameStore from '../../store/gameStore';
import usePresenceStore from '../../store/presenceStore';

const CATEGORY_STYLES = {
  weather: { icon: 'fas fa-cloud-sun', color: '#4a9eff', label: 'Weather' },
  encounter: { icon: 'fas fa-dragon', color: '#ff4444', label: 'Encounter' },
  progress: { icon: 'fas fa-route', color: '#44bb77', label: 'Progress' },
  atmosphere: { icon: 'fas fa-eye', color: '#aa77ff', label: 'Atmosphere' },
  exhaustion: { icon: 'fas fa-bed', color: '#ff8844', label: 'Exhaustion' },
  narrative: { icon: 'fas fa-scroll', color: '#ddaa44', label: 'Narrative' }
};

const formatTime = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const TravelTab = () => {
  const messagesEndRef = useRef(null);
  const isGMMode = useGameStore((s) => s.isGMMode);
  const isInMultiplayer = useGameStore((s) => s.isInMultiplayer);

  const broadcastHistory = useTravelStore((s) => s.broadcastHistory);
  const playerTravelState = useTravelStore((s) => s.playerTravelState);
  const travelChatUnreadCount = usePresenceStore((s) => s.travelChatUnreadCount);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [broadcastHistory, playerTravelState?.lastBroadcast]);

  if (!isInMultiplayer) {
    return (
      <div className="travel-tab-empty">
        <div className="travel-tab-empty-card">
          <i className="fas fa-route"></i>
          <p>Travel broadcasts are available in multiplayer sessions.</p>
          <p className="travel-tab-sub">Join a room to receive travel updates from the GM.</p>
        </div>
      </div>
    );
  }

  const broadcasts = isGMMode
    ? broadcastHistory
    : playerTravelState
      ? (playerTravelState.broadcastHistory || [playerTravelState.lastBroadcast].filter(Boolean))
      : [];

  if (broadcasts.length === 0) {
    return (
      <div className="travel-tab-empty">
        <div className="travel-tab-empty-card">
          <i className="fas fa-compass"></i>
          <p>No travel broadcasts yet.</p>
          <p className="travel-tab-sub">
            {isGMMode
              ? 'Use the Broadcast tab in the Travel Tracker to send updates to your party.'
              : 'The GM will send travel updates here during your journey.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="travel-tab-content">
      <div className="travel-broadcast-log">
        {broadcasts.map((entry, idx) => {
          const cat = CATEGORY_STYLES[entry.category] || CATEGORY_STYLES.narrative;
          return (
            <div key={`${entry.time}-${idx}`} className="travel-broadcast-entry">
              <div className="travel-broadcast-badge" style={{ color: cat.color }}>
                <i className={cat.icon}></i>
                <span>{cat.label}</span>
              </div>
              <div className="travel-broadcast-text">{entry.text}</div>
              <span className="travel-broadcast-time">{formatTime(entry.time)}</span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default TravelTab;
