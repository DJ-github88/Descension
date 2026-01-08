import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import useShareableStore from '../../store/shareableStore';
import './PlayerDisplayOverlay.css';

/**
 * Full-screen overlay that displays content shared by the GM to players
 * Shows images with cloudy backdrop and optional description text
 */
const PlayerDisplayOverlay = () => {
  const activeDisplay = useShareableStore(state => state.activeDisplay);
  const dismissDisplay = useShareableStore(state => state.dismissDisplay);
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Handle visibility animation
  useEffect(() => {
    if (activeDisplay) {
      setIsVisible(true);
      setIsFadingOut(false);
    }
  }, [activeDisplay]);

  // Handle click to dismiss
  const handleDismiss = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      dismissDisplay();
      setIsVisible(false);
      setIsFadingOut(false);
    }, 500);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && activeDisplay) {
        handleDismiss();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [activeDisplay]);

  if (!isVisible || !activeDisplay) return null;

  const renderContent = () => {
    switch (activeDisplay.type) {
      case 'image':
        return (
          <div className="player-display-image-container">
            <img 
              src={activeDisplay.content} 
              alt={activeDisplay.title || 'Shared image'}
              className="player-display-image"
            />
          </div>
        );
      
      case 'text':
      case 'document':
        return (
          <div className={`player-display-document ${activeDisplay.background || 'parchment'}`}>
            <div className="document-content">
              {activeDisplay.content}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return createPortal(
    <div 
      className={`player-display-overlay ${isFadingOut ? 'fade-out' : 'fade-in'}`}
      onClick={handleDismiss}
    >
      <div className="player-display-content" onClick={(e) => e.stopPropagation()}>
        {activeDisplay.title && (
          <h2 className="player-display-title">{activeDisplay.title}</h2>
        )}
        
        {renderContent()}
        
        {activeDisplay.description && (
          <div className="player-display-description">
            <p>{activeDisplay.description}</p>
          </div>
        )}
        
        <button className="player-display-dismiss" onClick={handleDismiss}>
          <i className="fas fa-times"></i>
          <span>Click anywhere or press ESC to dismiss</span>
        </button>
      </div>
    </div>,
    document.body
  );
};

export default PlayerDisplayOverlay;

