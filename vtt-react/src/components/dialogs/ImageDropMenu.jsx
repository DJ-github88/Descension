import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useGameStore from '../../store/gameStore';
import useShareableStore from '../../store/shareableStore';
import './ImageDropMenu.css';

/**
 * Context menu shown when an image is dropped onto the grid
 * Options: Set as Background, Show to Players
 */
const ImageDropMenu = ({ 
  isOpen, 
  position, 
  imageData, // { url, file, name }
  onClose,
  onBackgroundSet
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const menuRef = useRef(null);
  
  const addBackground = useGameStore(state => state.addBackground);
  const showToPlayers = useShareableStore(state => state.showToPlayers);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !imageData) return null;

  const handleSetAsBackground = () => {
    const backgroundId = addBackground({
      url: imageData.url,
      name: imageData.name || 'Dropped Image',
      sticksToGrid: true, // Start in manipulation mode
      scale: 1.0,
      opacity: 1.0
    });
    
    // Trigger background manipulation mode
    if (onBackgroundSet) {
      onBackgroundSet(backgroundId);
    }
    
    onClose();
  };

  const handleShowToPlayers = () => {
    if (!showDescription) {
      setShowDescription(true);
      setTitle(imageData.name || 'Image');
    } else {
      // Actually show to players
      showToPlayers({
        type: 'image',
        content: imageData.url,
        title: title || 'Image',
        description: description
      });
      onClose();
    }
  };

  const handleCancel = () => {
    if (showDescription) {
      setShowDescription(false);
      setDescription('');
    } else {
      onClose();
    }
  };

  // Calculate menu position to stay in viewport
  const menuStyle = {
    left: Math.min(position.x, window.innerWidth - 280),
    top: Math.min(position.y, window.innerHeight - (showDescription ? 350 : 160))
  };

  return createPortal(
    <div className="image-drop-menu-overlay">
      <div 
        ref={menuRef}
        className={`image-drop-menu ${showDescription ? 'expanded' : ''}`}
        style={menuStyle}
      >
        <div className="image-drop-menu-header">
          <img src={imageData.url} alt="Preview" className="image-drop-preview" />
          <span className="image-drop-title">{imageData.name || 'Image'}</span>
        </div>
        
        {!showDescription ? (
          <div className="image-drop-menu-options">
            <button 
              className="image-drop-option background-option"
              onClick={handleSetAsBackground}
            >
              <i className="fas fa-image"></i>
              <div className="option-text">
                <span className="option-title">Set as Background</span>
                <span className="option-desc">Add to map, resize & position</span>
              </div>
            </button>
            
            <button 
              className="image-drop-option show-option"
              onClick={handleShowToPlayers}
            >
              <i className="fas fa-eye"></i>
              <div className="option-text">
                <span className="option-title">Show to Players</span>
                <span className="option-desc">Display as popup with description</span>
              </div>
            </button>
            
            <button 
              className="image-drop-option cancel-option"
              onClick={handleCancel}
            >
              <i className="fas fa-times"></i>
              <span>Cancel</span>
            </button>
          </div>
        ) : (
          <div className="image-drop-description-form">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title..."
                autoFocus
              />
            </div>
            
            <div className="form-group">
              <label>Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description or context for the players..."
                rows={4}
              />
            </div>
            
            <div className="form-actions">
              <button className="btn-cancel" onClick={handleCancel}>
                <i className="fas fa-arrow-left"></i>
                Back
              </button>
              <button className="btn-show" onClick={handleShowToPlayers}>
                <i className="fas fa-eye"></i>
                Show to Players
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ImageDropMenu;

