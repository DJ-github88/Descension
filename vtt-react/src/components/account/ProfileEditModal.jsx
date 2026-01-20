import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useAuthStore from '../../store/authStore';
import { getCustomIconUrl } from '../../utils/assetManager';
import CharacterIconSelector from '../character-creation-wizard/components/CharacterIconSelector';
import './ProfileEditModal.css';

const ProfileEditModal = ({ isOpen, onClose }) => {
    const { userData, user, updateUserData } = useAuthStore();
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [showIconSelector, setShowIconSelector] = useState(false);

    useEffect(() => {
        if (userData) {
            setDisplayName(userData.displayName || user?.displayName || '');
            setPhotoURL(userData.photoURL || user?.photoURL || '');
        }
    }, [userData, user, isOpen]);

    if (!isOpen) return null;

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            const result = await updateUserData({
                displayName: displayName.trim(),
                photoURL: photoURL
            });

            if (result.success) {
                onClose();
            } else {
                setError(result.error || 'Failed to update profile');
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    const handleIconSelect = (icon) => {
        const iconUrl = getCustomIconUrl(icon, 'creatures');
        setPhotoURL(iconUrl);
        setShowIconSelector(false);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError('Image size must be less than 2MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoURL(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return ReactDOM.createPortal(
        <div className="profile-edit-overlay" onClick={onClose}>
            <div className="profile-edit-modal" onClick={e => e.stopPropagation()}>
                <div className="profile-edit-header">
                    <h3>Edit Profile</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSave} className="profile-edit-body">
                    {error && <div className="profile-edit-error">{error}</div>}

                    <div className="profile-edit-avatar-section">
                        <div className="avatar-container">
                            {photoURL ? (
                                <img src={photoURL} alt="Avatar" className="avatar-preview" />
                            ) : (
                                <div className="avatar-placeholder">
                                    <i className="fas fa-user"></i>
                                </div>
                            )}
                            <div className="avatar-overlay">
                                <label htmlFor="avatar-upload" className="avatar-action-btn" title="Upload Image">
                                    <i className="fas fa-camera"></i>
                                </label>
                                <button
                                    type="button"
                                    className="avatar-action-btn"
                                    onClick={() => setShowIconSelector(true)}
                                    title="Choose Icon"
                                >
                                    <i className="fas fa-icons"></i>
                                </button>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>
                        <p className="avatar-hint">Click the icons to change your avatar</p>
                    </div>

                    <div className="profile-edit-field">
                        <label htmlFor="display-name">Display Name</label>
                        <input
                            id="display-name"
                            type="text"
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            placeholder="Your adventurer name"
                            maxLength={32}
                            required
                        />
                    </div>

                    <div className="profile-edit-footer">
                        <button type="button" className="cancel-pill-btn" onClick={onClose} disabled={isSaving}>
                            Cancel
                        </button>
                        <button type="submit" className="save-pill-btn" disabled={isSaving || !displayName.trim()}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

            <CharacterIconSelector
                isOpen={showIconSelector}
                onClose={() => setShowIconSelector(false)}
                onSelect={handleIconSelect}
                currentIcon={null}
            />
        </div>,
        document.body
    );
};

export default ProfileEditModal;
