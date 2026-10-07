import React, { useState, useEffect, useRef } from 'react';
import MythrillWindow from './MythrillWindow';
import { TravelTrackerContent } from './TravelTrackerWindow';
import SocialEncounterGenerator from '../gm-tools/SocialEncounterGenerator';
import JukeboxPanel from '../jukebox/JukeboxPanel';
import useTravelStore from '../../store/travelStore';
import useGameStore from '../../store/gameStore';
import './Toolkit.css';

const TOOLKIT_TABS = [
  { id: 'travel', label: 'Travel' },
  { id: 'social', label: 'Social Encounter' },
  { id: 'lutebox', label: 'Lutebox' },
];

const TRAVEL_SUB_TABS = [
  { id: 'setup', label: 'Setup Journey', step: 1 },
  { id: 'journey', label: 'Journey', step: 2 },
  { id: 'encounters', label: 'Encounters', step: 3 },
  { id: 'broadcast', label: 'Broadcast', step: 4, multiplayerOnly: true },
];

export default function Toolkit({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('travel');
  const [travelDropdownOpen, setTravelDropdownOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const contentRef = useRef(null);
  const travelSubTab = useTravelStore(s => s.activeTab);
  const setTravelSubTab = useTravelStore(s => s.setActiveTab);
  const isInMultiplayer = useGameStore(s => s.isInMultiplayer);
  const travelSubTabs = travelSubTab === 'broadcast' || isInMultiplayer
    ? TRAVEL_SUB_TABS
    : TRAVEL_SUB_TABS.filter(sub => !sub.multiplayerOnly);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeTab, travelSubTab]);

  const handleTravelMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    if (activeTab === 'travel') {
      setTravelDropdownOpen(true);
    }
  };

  const handleTravelMouseLeave = () => {
    const timeout = setTimeout(() => setTravelDropdownOpen(false), 200);
    setHoverTimeout(timeout);
  };

  const handleSubTabClick = (subTabId) => {
    setTravelSubTab(subTabId);
    setTravelDropdownOpen(false);
  };

  return (
    <MythrillWindow
      title="Toolkit"
      isOpen={isOpen}
      onClose={onClose}
      defaultSize={{ width: 860, height: 780 }}
      defaultPosition={{ x: Math.max(50, window.innerWidth - 920), y: 30 }}
      minConstraints={[640, 480]}
      className="toolkit-window"
      customHeader={
        <div className="tk-tab-container">
          {TOOLKIT_TABS.map((tab) =>
            tab.id === 'travel' ? (
              <div
                key={tab.id}
                className="tk-tab-wrapper"
                onMouseEnter={handleTravelMouseEnter}
                onMouseLeave={handleTravelMouseLeave}
              >
                <button
                  className={`tk-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span>{tab.label}</span>
                </button>
                {travelDropdownOpen && activeTab === 'travel' && (
                  <div className="tk-dropdown">
                    {travelSubTabs.map((sub) => (
                      <button
                        key={sub.id}
                        className={`tk-dropdown-item ${travelSubTab === sub.id ? 'active' : ''}`}
                        onClick={() => handleSubTabClick(sub.id)}
                      >
                        <span className="tk-dropdown-step">{sub.step}</span>
                        <span>{sub.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={tab.id}
                className={`tk-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.label}</span>
              </button>
            )
          )}
        </div>
      }
    >
      <div className="ctk-content" ref={contentRef}>
        {activeTab === 'travel' && <TravelTrackerContent />}
        {activeTab === 'social' && <SocialEncounterGenerator />}
        {activeTab === 'lutebox' && <JukeboxPanel isGM={true} />}
      </div>
    </MythrillWindow>
  );
}
