/**
 * Step 1: Basic Information
 * 
 * Character name, gender selection, and character image upload
 */

import React, { useState } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';

const Step1BasicInfo = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const [imagePreview, setImagePreview] = useState(null);

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
                dispatch(wizardActionCreators.updateBasicInfo({
                    characterImage: imageData
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove image
    const handleRemoveImage = () => {
        setImagePreview(null);
        dispatch(wizardActionCreators.updateBasicInfo({
            characterImage: null
        }));
        // Clear the file input
        const fileInput = document.getElementById('character-image-upload');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const genderOptions = [
        { id: 'male', name: 'Male', icon: 'fas fa-mars' },
        { id: 'female', name: 'Female', icon: 'fas fa-venus' },
        { id: 'other', name: 'Other', icon: 'fas fa-genderless' }
    ];

    return (
        <div className="wizard-step-content">
            <div className="step-body">
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
                                <span className="character-count">{characterData.name.length}/50</span>
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
                    </div>

                    {/* Right side - Character preview */}
                    <div className="character-preview">
                        <div className="preview-card">
                            <div className="preview-header">
                                <h3>Character Preview</h3>
                            </div>
                            <div className="preview-content">
                                <div className="preview-image-container">
                                    {imagePreview || characterData.characterImage ? (
                                        <img 
                                            src={imagePreview || characterData.characterImage} 
                                            alt="Character" 
                                            className="character-portrait"
                                        />
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
                </div>
                </div>

                <div className="step-footer">
                    <div className="step-hints">
                        <div className="hint">
                            <i className="fas fa-lightbulb"></i>
                            <span>Choose a name that fits your character's personality and background</span>
                        </div>
                        <div className="hint">
                            <i className="fas fa-image"></i>
                            <span>Character portraits help bring your character to life in multiplayer sessions</span>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default Step1BasicInfo;
