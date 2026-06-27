import React, { useState, useCallback, useEffect, useRef } from 'react';
import MythrillWindow from './MythrillWindow';
import { TravelTrackerContent } from './TravelTrackerWindow';
import SocialEncounterGenerator from '../gm-tools/SocialEncounterGenerator';
import JukeboxPanel from '../jukebox/JukeboxPanel';
import { getIconUrl } from '../../utils/assetManager';
import './Toolkit.css';

const TOOLKIT_TABS = [
  { 
    id: 'travel', 
    name: 'Travel', 
    label: 'Travel', 
    icon: getIconUrl('inv_misc_compass_01', 'items') 
  },
  { 
    id: 'encounters', 
    name: 'Encounters', 
    label: 'Encounters', 
    icon: getIconUrl('Social/Party Gathering', 'abilities') 
  },
  { 
    id: 'lutebox', 
    name: 'Lutebox', 
    label: 'Lutebox', 
    icon: getIconUrl('Social/Golden Harp', 'abilities') 
  },
];

export default function Toolkit({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('travel');
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  return (
    <MythrillWindow
      title="Toolkit"
      isOpen={isOpen}
      onClose={onClose}
      defaultSize={{ width: 860, height: 780 }}
      defaultPosition={{ x: Math.max(50, window.innerWidth - 920), y: 30 }}
      minConstraints={[640, 480]}
      headerTabs={TOOLKIT_TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      className="toolkit-window"
    >
      <div className="ctk-content" ref={contentRef}>
        {activeTab === 'travel' && <TravelTrackerContent />}
        {activeTab === 'encounters' && <SocialEncounterGenerator />}
        {activeTab === 'lutebox' && <JukeboxPanel isGM={true} />}
      </div>
    </MythrillWindow>
  );
}
