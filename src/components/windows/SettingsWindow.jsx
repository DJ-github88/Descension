import React, { useState } from 'react';
import useGameStore from '../../store/gameStore';

export default function SettingsWindow() {
    const [gridScale, setGridScale] = useState(50);
    const setBackgroundImage = useGameStore(state => state.setBackgroundImage);
    const setGridSize = useGameStore(state => state.setGridSize);

    const handleBackgroundUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBackgroundImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGridScaleChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= 10 && value <= 100) {
            setGridScale(value);
            setGridSize(value);
        }
    };

    return (
        <div className="wow-settings">
            <div className="wow-settings-section">
                <h3 className="wow-settings-title">Background Image</h3>
                <div className="wow-settings-content">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleBackgroundUpload}
                        className="wow-file-input"
                    />
                </div>
            </div>

            <div className="wow-settings-section">
                <h3 className="wow-settings-title">Grid Settings</h3>
                <div className="wow-settings-content">
                    <label className="wow-settings-label">
                        Grid Scale:
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={gridScale}
                            onChange={handleGridScaleChange}
                            className="wow-range-input"
                        />
                        <span className="wow-range-value">{gridScale}px</span>
                    </label>
                </div>
            </div>
        </div>
    );
}
