import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { publishCampaign } from '../../services/firebase/sharedCampaignService';
import subscriptionService from '../../services/subscriptionService';
import useAuthStore from '../../store/authStore';
import './styles/ShareCampaignModal.css';

const ShareCampaignModal = ({ room, onClose, onSuccess }) => {
  const { user, userData } = useAuthStore();
  const [name, setName] = useState(room?.name || '');
  const [description, setDescription] = useState(room?.description || '');
  const [tags, setTags] = useState('');
  const [resetFog, setResetFog] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState('');
  const [tierChecked, setTierChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkTier = async () => {
      try {
        const canPublish = await subscriptionService.canUseFeature('campaignPublishing');
        setHasAccess(canPublish);
      } catch (e) {
        setHasAccess(false);
      }
      setTierChecked(true);
    };
    checkTier();
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const handlePublish = async () => {
    if (!name.trim()) {
      setError('Please enter a campaign name');
      return;
    }

    setIsPublishing(true);
    setError('');

    try {
      const campaignId = await publishCampaign({
        roomId: room.id,
        name: name.trim(),
        description: description.trim(),
        coverImage: room.customImage || null,
        publisherId: user.uid,
        publisherName: userData?.displayName || user.email || 'Unknown',
        publisherAvatar: userData?.photoURL || null,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        resetFog
      });

      if (onSuccess) onSuccess(campaignId);
      onClose();
    } catch (e) {
      setError(e.message || 'Failed to publish campaign');
    } finally {
      setIsPublishing(false);
    }
  };

  if (!tierChecked) return null;

  const modalContent = (
    <div className="scm-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="scm-modal">
        <div className="scm-header">
          <h2><i className="fas fa-share-alt"></i> Share as Campaign</h2>
          <button className="scm-close" onClick={onClose}><i className="fas fa-times"></i></button>
        </div>
        <div className="scm-body">
          {!hasAccess ? (
            <div className="scm-tier-locked">
              <i className="fas fa-lock scm-lock-icon"></i>
              <h3>Archmage Tier Required</h3>
              <p>Campaign sharing is available on the Archmage (Ultimate) tier.</p>
              <p className="scm-tier-hint">Upgrade to share your campaigns with the community.</p>
            </div>
          ) : (
            <>
              <div className="scm-field">
                <label>Campaign Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="My Awesome Campaign"
                  maxLength={80}
                  autoFocus
                />
              </div>

              <div className="scm-field">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your campaign for other GMs..."
                  rows={4}
                  maxLength={1000}
                />
              </div>

              <div className="scm-field">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="dungeon, forest, level 5, boss fight"
                />
              </div>

              <div className="scm-field scm-checkbox-field">
                <label>
                  <input
                    type="checkbox"
                    checked={resetFog}
                    onChange={e => setResetFog(e.target.checked)}
                  />
                  Reset Fog of War (recommended)
                </label>
                <p className="scm-help">Players who download your campaign will start with fully unexplored maps.</p>
              </div>

              <div className="scm-summary">
                <h4>This will include:</h4>
                <ul>
                  <li>All maps, terrain, walls, and lighting</li>
                  <li>Creature tokens and their stats</li>
                  <li>Environmental objects and drawings</li>
                  <li>Containers and grid items</li>
                  <li>Buffs and debuffs on tokens</li>
                  <li>Grid settings and camera position</li>
                </ul>
                <h4>Excluded (session data):</h4>
                <ul className="scm-excluded">
                  <li>Combat state</li>
                  <li>Travel state</li>
                  <li>Player exploration memories</li>
                </ul>
              </div>

              {error && <div className="scm-error">{error}</div>}

              <div className="scm-actions">
                <button className="scm-btn scm-btn-cancel" onClick={onClose}>Cancel</button>
                <button
                  className="scm-btn scm-btn-publish"
                  onClick={handlePublish}
                  disabled={isPublishing || !name.trim()}
                >
                  {isPublishing ? (
                    <><i className="fas fa-spinner fa-spin"></i> Publishing...</>
                  ) : (
                    <><i className="fas fa-share-alt"></i> Publish Campaign</>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ShareCampaignModal;
