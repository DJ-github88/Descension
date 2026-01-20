/**
 * Step 1: Basic Information
 * 
 * Character name, gender selection, and character image upload
 */

import React, { useState } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { getCustomIconUrl } from '../../../utils/assetManager';
import { getRandomCharacterName } from '../../../utils/nameGenerator';
import CharacterAppearanceModal from '../components/CharacterAppearanceModal';

const Step1BasicInfo = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const [imagePreview, setImagePreview] = useState(null);
    const [showAppearanceModal, setShowAppearanceModal] = useState(false);
    const [imageTransformations, setImageTransformations] = useState({
        scale: 1.2,
        rotation: 0,
        positionX: 0,
        positionY: 0
    });

    const { characterData, validationErrors } = state;

    // Handle name change
    const handleNameChange = (e) => {
        dispatch(wizardActionCreators.updateBasicInfo({
            name: e.target.value
        }));
    };

    // Handle random name
    const handleRandomName = () => {
        dispatch(wizardActionCreators.updateBasicInfo({
            name: getRandomCharacterName(characterData.race)
        }));
    };

    // Handle gender selection
    const handleGenderChange = (gender) => {
        dispatch(wizardActionCreators.updateBasicInfo({
            gender: gender
        }));
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image file must be smaller than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target.result;
                setImagePreview(imageData);

                // Set better default transformations for uploaded images
                const defaultTransforms = {
                    scale: 1.5,
                    rotation: 0,
                    positionX: 0,
                    positionY: 0
                };
                setImageTransformations(defaultTransforms);

                dispatch(wizardActionCreators.updateBasicInfo({
                    characterImage: imageData,
                    imageTransformations: defaultTransforms
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove image
    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageTransformations({
            scale: 1,
            rotation: 0,
            positionX: 0,
            positionY: 0
        });
        dispatch(wizardActionCreators.updateBasicInfo({
            characterImage: null,
            imageTransformations: null
        }));
    };

    // Apply image transformations
    const handleApplyTransformations = (transformations) => {
        setImageTransformations(transformations);
        dispatch(wizardActionCreators.updateBasicInfo({
            imageTransformations: transformations
        }));
    };

    // Update character data from modal
    const handleAppearanceUpdate = (updates) => {
        dispatch(wizardActionCreators.updateBasicInfo(updates));
    };

    // Get current image style based on transformations
    const getImageStyle = () => {
        const transforms = characterData.imageTransformations || imageTransformations;
        return {
            transform: `scale(${transforms.scale}) rotate(${transforms.rotation}deg) translate(${transforms.positionX}px, ${transforms.positionY}px)`
        };
    };

    const genderOptions = [
        { id: 'male', name: 'Male', icon: 'fas fa-mars' },
        { id: 'female', name: 'Female', icon: 'fas fa-venus' },
        { id: 'other', name: 'Other', icon: 'fas fa-genderless' }
    ];

    return (
        <div className="wizard-step-content">
            <div className="basic-info-centered-layout">
                {/* Character preview card with editable fields */}
                <div className="preview-card-interactive">
                    <div className="preview-content">
                        <div className="preview-image-container">
                            {imagePreview || characterData.characterImage ? (
                                <div
                                    className="character-portrait-container"
                                    onClick={() => setShowAppearanceModal(true)}
                                    style={{
                                        backgroundColor: characterData.iconBackgroundColor,
                                        borderColor: characterData.iconBorderColor,
                                        backgroundImage: characterData.iconBackgroundImage ? `url(/assets/backgrounds/${characterData.iconBackgroundImage})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    <img
                                        src={imagePreview || characterData.characterImage}
                                        alt="Character"
                                        className="character-portrait"
                                        style={getImageStyle()}
                                    />
                                    <div className="portrait-edit-overlay">
                                        <button className="edit-portrait-btn" type="button">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                    </div>
                                </div>
                            ) : characterData.characterIcon ? (
                                <div
                                    className="character-portrait-container"
                                    onClick={() => setShowAppearanceModal(true)}
                                    style={{
                                        backgroundColor: characterData.iconBackgroundColor,
                                        borderColor: characterData.iconBorderColor,
                                        backgroundImage: characterData.iconBackgroundImage ? `url(/assets/backgrounds/${characterData.iconBackgroundImage})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    <img
                                        src={getCustomIconUrl(characterData.characterIcon, 'creatures')}
                                        alt="Character icon"
                                        className="character-portrait"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = getCustomIconUrl('Human/Icon1', 'creatures');
                                        }}
                                    />
                                    <div className="portrait-edit-overlay">
                                        <button className="edit-portrait-btn" type="button">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="placeholder-portrait"
                                    onClick={() => setShowAppearanceModal(true)}
                                    style={{
                                        backgroundColor: characterData.iconBackgroundColor,
                                        borderColor: characterData.iconBorderColor,
                                        backgroundImage: characterData.iconBackgroundImage ? `url(/assets/backgrounds/${characterData.iconBackgroundImage})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <i className="fas fa-user"></i>
                                    <span>Click to customize</span>
                                </div>
                            )}
                        </div>

                        {/* Editable Character Details */}
                        <div className="preview-details-editable">
                            {/* Character Name */}
                            <div className="detail-row-editable">
                                <span className="detail-label">Name:</span>
                                <div className="detail-input-wrapper">
                                    <input
                                        type="text"
                                        value={characterData.name}
                                        onChange={handleNameChange}
                                        placeholder="Character name"
                                        className={`detail-input ${validationErrors.name ? 'error' : ''}`}
                                        maxLength={50}
                                    />
                                    <button
                                        type="button"
                                        className="detail-random-btn"
                                        onClick={handleRandomName}
                                        title="Randomize name"
                                    >
                                        <i className="fas fa-dice"></i>
                                    </button>
                                </div>
                            </div>
                            {validationErrors.name && (
                                <div className="detail-error">
                                    <i className="fas fa-exclamation-triangle"></i>
                                    {validationErrors.name}
                                </div>
                            )}

                            {/* Gender Selection */}
                            <div className="detail-row-editable">
                                <span className="detail-label">Gender:</span>
                                <div className="gender-selection-compact">
                                    {genderOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            className={`gender-option-compact ${characterData.gender === option.id ? 'selected' : ''}`}
                                            onClick={() => handleGenderChange(option.id)}
                                            title={option.name}
                                        >
                                            <i className={option.icon}></i>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Character Appearance Modal */}
            <CharacterAppearanceModal
                isOpen={showAppearanceModal}
                onClose={() => setShowAppearanceModal(false)}
                characterData={characterData}
                onUpdate={handleAppearanceUpdate}
                imagePreview={imagePreview}
                onImageUpload={handleImageUpload}
                onRemoveImage={handleRemoveImage}
                imageTransformations={characterData.imageTransformations || imageTransformations}
                onApplyTransformations={handleApplyTransformations}
            />
        </div>
    );
};

export default Step1BasicInfo;
