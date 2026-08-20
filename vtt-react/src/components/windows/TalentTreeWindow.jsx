import React from 'react';
import MythrillWindow from './MythrillWindow';
import useCharacterStore from '../../store/characterStore';
import TalentTreeContent from '../talent-tree/TalentTreeContent';
import './TalentTreeWindow.css';

const TalentTreeWindow = ({ isOpen, onClose }) => {
    const characterClass = useCharacterStore(state => state.class);

    return (
        <MythrillWindow
            title={`Talent Tree${characterClass ? ` — ${characterClass}` : ''}`}
            isOpen={isOpen}
            onClose={onClose}
            defaultSize={{ width: 720, height: 800 }}
            defaultPosition={{ x: 220, y: 60 }}
            maxConstraints={[1200, 1000]}
            minConstraints={[520, 600]}
        >
            <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                <TalentTreeContent />
            </div>
        </MythrillWindow>
    );
};

export default TalentTreeWindow;
