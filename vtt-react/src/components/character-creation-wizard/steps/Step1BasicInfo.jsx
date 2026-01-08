/**
 * Step 1: Basic Information
 * 
 * Character name, gender selection, and character image upload
 */

import React, { useState } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { getCustomIconUrl } from '../../../utils/assetManager';
import ImageEditor from '../components/ImageEditor';
import CharacterIconSelector from '../components/CharacterIconSelector';

const Step1BasicInfo = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const [imagePreview, setImagePreview] = useState(null);
    const [showImageEditor, setShowImageEditor] = useState(false);
    const [showIconSelector, setShowIconSelector] = useState(false);
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
        // Clear the file input
        const fileInput = document.getElementById('character-image-upload');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    // Handle icon selection
    const handleIconSelect = (icon) => {
        dispatch(wizardActionCreators.updateBasicInfo({
            characterIcon: icon
        }));
        setShowIconSelector(false);
    };

    // Remove icon
    const handleRemoveIcon = () => {
        dispatch(wizardActionCreators.updateBasicInfo({
            characterIcon: null
        }));
    };

    // Open image editor
    const handleEditImage = () => {
        if (imagePreview || characterData.characterImage) {
            setShowImageEditor(true);
        }
    };

    // Apply image transformations
    const handleApplyTransformations = (transformations) => {
        setImageTransformations(transformations);
        dispatch(wizardActionCreators.updateBasicInfo({
            imageTransformations: transformations
        }));
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
            <div className="basic-info-layout">
                    {/* Left side - Form fields */}
                    <div className="basic-info-form">
                        {/* Character Name */}
                        <div className="form-group">
                            <label htmlFor="character-name" className="form-label required">
                                Character Name
                                <span className="required-asterisk">*</span>
                            </label>
                            <input
                                id="character-name"
                                type="text"
                                value={characterData.name}
                                onChange={handleNameChange}
                                placeholder="Enter your character's name"
                                className={`form-input ${validationErrors.name ? 'error' : ''}`}
                                maxLength={50}
                                autoFocus
                            />
                            <div className="input-helper">
                                {validationErrors.name && (
                                    <div className="error-text">
                                        <i className="fas fa-exclamation-triangle"></i>
                                        {validationErrors.name}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Gender Selection */}
                        <div className="form-group">
                            <label className="form-label">Gender</label>
                            <div className="gender-selection">
                                {genderOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        className={`gender-option ${characterData.gender === option.id ? 'selected' : ''}`}
                                        onClick={() => handleGenderChange(option.id)}
                                    >
                                        <i className={option.icon}></i>
                                        <span>{option.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Character Image Upload */}
                        <div className="form-group">
                            <label className="form-label">Character Portrait</label>
                            <p className="form-description">
                                Upload an image to represent your character (optional)
                            </p>
                            
                            <div className="image-upload-area">
                                {imagePreview || characterData.characterImage ? (
                                    <div className="image-preview">
                                        <img 
                                            src={imagePreview || characterData.characterImage} 
                                            alt="Character preview" 
                                            className="preview-image"
                                        />
                                        <div className="image-overlay">
                                            <button
                                                type="button"
                                                className="remove-image-btn"
                                                onClick={handleRemoveImage}
                                                title="Remove image"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <label htmlFor="character-image-upload" className="upload-placeholder">
                                        <i className="fas fa-cloud-upload-alt"></i>
                                        <span>Click to upload image</span>
                                        <small>PNG, JPG up to 5MB</small>
                                    </label>
                                )}
                                
                                <input
                                    id="character-image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden-file-input"
                                />
                            </div>
                        </div>

                        {/* Character Icon Selection */}
                        <div className="form-group">
                            <label className="form-label">Character Icon</label>
                            <p className="form-description">
                                Select an icon to represent your character in the HUD and on tokens (optional)
                            </p>
                            
                            <div className="icon-selection-area">
                                {characterData.characterIcon ? (
                                    <div className="icon-preview" onClick={() => setShowIconSelector(true)}>
                                        <img 
                                            src={getCustomIconUrl(characterData.characterIcon, 'creatures')}
                                            alt="Character icon" 
                                            className="preview-icon"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = getCustomIconUrl('Human/Icon1', 'creatures');
                                            }}
                                        />
                                        <div className="icon-edit-overlay">
                                            <button
                                                type="button"
                                                className="edit-icon-btn"
                                                title="Change icon"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </div>
                                        <div className="icon-overlay">
                                            <button
                                                type="button"
                                                className="remove-icon-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveIcon();
                                                }}
                                                title="Remove icon"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        className="select-icon-btn"
                                        onClick={() => setShowIconSelector(true)}
                                    >
                                        <i className="fas fa-image"></i>
                                        <span>Select Icon</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right side - Character preview */}
                    <div className="preview-card">
                        <div className="preview-content">
                            <div className="preview-image-container">
                                {imagePreview || characterData.characterImage ? (
                                    <div className="character-portrait-container" onClick={handleEditImage}>
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
                                    <div className="character-portrait-container" onClick={() => setShowIconSelector(true)}>
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
                                    <div className="placeholder-portrait">
                                        <i className="fas fa-user"></i>
                                        <span>No image</span>
                                    </div>
                                )}
                            </div>

                            <div className="preview-details">
                                <div className="detail-row">
                                    <span className="detail-label">Name:</span>
                                    <span className="detail-value">
                                        {characterData.name || 'Unnamed Character'}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Gender:</span>
                                    <span className="detail-value">
                                        {genderOptions.find(g => g.id === characterData.gender)?.name || 'Male'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            {/* Image Editor Modal */}
            <ImageEditor
                    isOpen={showImageEditor}
                    onClose={() => setShowImageEditor(false)}
                    imageUrl={imagePreview || characterData.characterImage}
                    onApply={handleApplyTransformations}
                    initialTransformations={characterData.imageTransformations || imageTransformations}
                />

            {/* Icon Selector Modal */}
            <CharacterIconSelector
                isOpen={showIconSelector}
                onClose={() => setShowIconSelector(false)}
                onSelect={handleIconSelect}
                currentIcon={characterData.characterIcon}
            />
        </div>
    );
};

export default Step1BasicInfo;
