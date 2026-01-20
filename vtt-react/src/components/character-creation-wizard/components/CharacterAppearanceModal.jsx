import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { getCustomIconUrl } from '../../../utils/assetManager';
import CharacterIconSelector from './CharacterIconSelector';
import ImageEditor from './ImageEditor';
import '../styles/CharacterAppearanceModal.css';

const allBackgrounds = [
    'CrystalCave.png', 'DenseForest.png', 'DesertTemple.png', 'Embers.png', 'Flowers.png',
    'Forest1.png', 'Forest2.png', 'Forest3.png', 'Forest4.png', 'Frost.png',
    'FrozTemple.png', 'GloomyCave.png', 'HazyCave.png', 'MountainDesert.png', 'MountainFrost.png',
    'MountainIce.png', 'MountainSky.png', 'NightFrost.png', 'OpenForest.png', 'Sky.png',
    'Smoke.png', 'Spikey Cave.png', 'Stonehedge.png', 'Temple.png', 'Volcano Lake.png',
    'Volcano.png', 'mountains1.png', 'mountains2.png', 'mountains3.png', 'mountains4.png'
];

const CharacterAppearanceModal = ({
    isOpen,
    onClose,
    characterData,
    onUpdate,
    imagePreview,
    onImageUpload,
    onRemoveImage,
    imageTransformations,
    onApplyTransformations
}) => {
    const [activeTab, setActiveTab] = useState('icon'); // 'icon', 'upload', 'customize'
    const [showIconSelector, setShowIconSelector] = useState(false);
    const [showImageEditor, setShowImageEditor] = useState(false);

    if (!isOpen) return null;

    const handleIconSelect = (icon) => {
        onUpdate({ characterIcon: icon });
        setShowIconSelector(false);
    };

    const handleImageUpload = (e) => {
        onImageUpload(e);
        setActiveTab('customize');
    };

    const handleEditImage = () => {
        setShowImageEditor(true);
    };

    const handleApplyImageTransformations = (transformations) => {
        onApplyTransformations(transformations);
        setShowImageEditor(false);
    };

    const currentImage = imagePreview || characterData.characterImage;
    const currentIcon = characterData.characterIcon;

    return ReactDOM.createPortal(
        <div className="character-appearance-modal-overlay">
            <div className="character-appearance-modal">
                <div className="character-appearance-modal-header">
                    <h3>Character Appearance</h3>
                    <button className="character-appearance-modal-close" onClick={onClose}>×</button>
                </div>

                <div className="character-appearance-modal-body">
                    {/* Preview Section */}
                    <div className="appearance-preview-section">
                        <div className="appearance-preview-label">Preview</div>
                        <div
                            className="appearance-preview-portrait"
                            style={{
                                backgroundColor: characterData.iconBackgroundColor || '#f8f5eb',
                                borderColor: characterData.iconBorderColor || '#d4af37',
                                backgroundImage: characterData.iconBackgroundImage ? `url(/assets/backgrounds/${characterData.iconBackgroundImage})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            {currentImage ? (
                                <img
                                    src={currentImage}
                                    alt="Character preview"
                                    className="appearance-preview-image"
                                    style={{
                                        transform: `scale(${imageTransformations?.scale || 1.2}) rotate(${imageTransformations?.rotation || 0}deg) translate(${imageTransformations?.positionX || 0}px, ${imageTransformations?.positionY || 0}px)`
                                    }}
                                />
                            ) : currentIcon ? (
                                <img
                                    src={getCustomIconUrl(currentIcon, 'creatures')}
                                    alt="Character icon"
                                    className="appearance-preview-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = getCustomIconUrl('Human/Icon1', 'creatures');
                                    }}
                                />
                            ) : (
                                <div className="appearance-preview-placeholder">
                                    <i className="fas fa-user"></i>
                                    <span>No image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="appearance-tabs">
                        <button
                            className={`appearance-tab ${activeTab === 'icon' ? 'active' : ''}`}
                            onClick={() => setActiveTab('icon')}
                        >
                            <i className="fas fa-icons"></i>
                            Select Icon
                        </button>
                        <button
                            className={`appearance-tab ${activeTab === 'upload' ? 'active' : ''}`}
                            onClick={() => setActiveTab('upload')}
                        >
                            <i className="fas fa-upload"></i>
                            Upload Image
                        </button>
                        <button
                            className={`appearance-tab ${activeTab === 'customize' ? 'active' : ''}`}
                            onClick={() => setActiveTab('customize')}
                        >
                            <i className="fas fa-palette"></i>
                            Customize
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="appearance-tab-content">
                        {activeTab === 'icon' && (
                            <div className="appearance-icon-tab">
                                <p className="tab-description">
                                    Select a pre-made icon to represent your character
                                </p>
                                <button
                                    className="appearance-select-icon-btn"
                                    onClick={() => setShowIconSelector(true)}
                                >
                                    <i className="fas fa-image"></i>
                                    Browse Icons
                                </button>
                                {currentIcon && (
                                    <button
                                        className="appearance-remove-btn"
                                        onClick={() => onUpdate({ characterIcon: null })}
                                    >
                                        <i className="fas fa-trash"></i>
                                        Remove Icon
                                    </button>
                                )}
                            </div>
                        )}

                        {activeTab === 'upload' && (
                            <div className="appearance-upload-tab">
                                <p className="tab-description">
                                    Upload a custom image for your character (PNG, JPG up to 5MB)
                                </p>
                                <label htmlFor="appearance-image-upload" className="appearance-upload-area">
                                    <i className="fas fa-cloud-upload-alt"></i>
                                    <span>Click to upload image</span>
                                    <small>PNG, JPG up to 5MB</small>
                                </label>
                                <input
                                    id="appearance-image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden-file-input"
                                />
                                {currentImage && (
                                    <div className="appearance-image-actions">
                                        <button
                                            className="appearance-edit-btn"
                                            onClick={handleEditImage}
                                        >
                                            <i className="fas fa-edit"></i>
                                            Edit Image
                                        </button>
                                        <button
                                            className="appearance-remove-btn"
                                            onClick={onRemoveImage}
                                        >
                                            <i className="fas fa-trash"></i>
                                            Remove Image
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'customize' && (
                            <div className="appearance-customize-tab">
                                <p className="tab-description">
                                    Customize the backdrop, border, and background pattern
                                </p>

                                {/* Color Controls */}
                                <div className="appearance-color-controls">
                                    <div className="appearance-color-control">
                                        <label>Backdrop Color</label>
                                        <input
                                            type="color"
                                            value={characterData.iconBackgroundColor || '#f8f5eb'}
                                            onChange={(e) => onUpdate({ iconBackgroundColor: e.target.value })}
                                        />
                                    </div>
                                    <div className="appearance-color-control">
                                        <label>Border Color</label>
                                        <input
                                            type="color"
                                            value={characterData.iconBorderColor || '#d4af37'}
                                            onChange={(e) => onUpdate({ iconBorderColor: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Background Pattern */}
                                <div className="appearance-background-section">
                                    <label className="appearance-section-label">Background Pattern</label>
                                    <div className="appearance-background-grid">
                                        <div
                                            className={`appearance-background-option none ${!characterData.iconBackgroundImage ? 'selected' : ''}`}
                                            onClick={() => onUpdate({ iconBackgroundImage: null })}
                                        >
                                            None
                                        </div>
                                        {allBackgrounds.map(bg => (
                                            <div
                                                key={bg}
                                                className={`appearance-background-option ${characterData.iconBackgroundImage === bg ? 'selected' : ''}`}
                                                style={{ backgroundImage: `url(/assets/backgrounds/${bg})` }}
                                                onClick={() => onUpdate({ iconBackgroundImage: bg })}
                                                title={bg.replace('.png', '')}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="character-appearance-modal-footer">
                    <button className="appearance-done-btn" onClick={onClose}>
                        <i className="fas fa-check"></i>
                        Done
                    </button>
                </div>
            </div>

            {/* Icon Selector Modal */}
            <CharacterIconSelector
                isOpen={showIconSelector}
                onClose={() => setShowIconSelector(false)}
                onSelect={handleIconSelect}
                currentIcon={currentIcon}
            />

            {/* Image Editor Modal */}
            <ImageEditor
                isOpen={showImageEditor}
                onClose={() => setShowImageEditor(false)}
                imageUrl={currentImage}
                onApply={handleApplyImageTransformations}
                initialTransformations={imageTransformations}
            />
        </div>,
        document.body
    );
};

export default CharacterAppearanceModal;
