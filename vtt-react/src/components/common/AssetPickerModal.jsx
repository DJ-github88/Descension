import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './AssetPickerModal.css';

const ALL_BACKGROUNDS = [
    'CrystalCave.png', 'DenseForest.png', 'DesertTemple.png', 'Embers.png', 'Flowers.png',
    'Forest1.png', 'Forest2.png', 'Forest3.png', 'Forest4.png', 'Frost.png',
    'FrozTemple.png', 'GloomyCave.png', 'HazyCave.png', 'MountainDesert.png', 'MountainFrost.png',
    'MountainIce.png', 'MountainSky.png', 'NightFrost.png', 'OpenForest.png', 'Sky.png',
    'Smoke.png', 'Spikey Cave.png', 'Stonehedge.png', 'Temple.png', 'Volcano Lake.png',
    'Volcano.png', 'mountains1.png', 'mountains2.png', 'mountains3.png', 'mountains4.png'
];

const AssetPickerModal = ({ isOpen, onClose, onSelect, currentAsset }) => {
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) return null;

    const filteredBackgrounds = ALL_BACKGROUNDS.filter(bg =>
        bg.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (bg) => {
        onSelect(`/assets/Backgrounds/${bg}`);
        onClose();
    };

    return ReactDOM.createPortal(
        <div className="asset-picker-overlay" onClick={onClose}>
            <div className="asset-picker-modal" onClick={e => e.stopPropagation()}>
                <div className="asset-picker-header">
                    <h3>Select Background Asset</h3>
                    <div className="search-container">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search backgrounds..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="asset-picker-grid">
                    {filteredBackgrounds.map(bg => (
                        <div
                            key={bg}
                            className={`asset-option ${currentAsset?.includes(bg) ? 'selected' : ''}`}
                            onClick={() => handleSelect(bg)}
                        >
                            <div
                                className="asset-preview"
                                style={{ backgroundImage: `url(/assets/Backgrounds/${bg})` }}
                            />
                            <span className="asset-name">{bg.replace('.png', '')}</span>
                        </div>
                    ))}
                    {filteredBackgrounds.length === 0 && (
                        <div className="no-results">No backgrounds found matching "{searchTerm}"</div>
                    )}
                </div>

                <div className="asset-picker-footer">
                    <button className="cancel-pill-btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AssetPickerModal;
