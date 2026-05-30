import React, { useState, useEffect, useRef } from 'react';
import { LORE_DICTIONARY } from '../../data/loreDictionary';
import LoreTooltip from './LoreTooltip';

const LoreLink = ({ termId, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const linkRef = useRef(null);
  
  // Create a stable unique ID for this instance
  const linkIdRef = useRef(Math.random().toString(36).substr(2, 9));

  // Listen to close-lore-tooltips custom events to support single-tooltip-at-a-time behavior
  useEffect(() => {
    const handleCloseOthers = (e) => {
      if (e.detail && e.detail.linkId !== linkIdRef.current) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('close-lore-tooltips', handleCloseOthers);
    return () => {
      window.removeEventListener('close-lore-tooltips', handleCloseOthers);
    };
  }, []);

  const entry = LORE_DICTIONARY[termId];

  // If the term is not in the dictionary, render plain text safely
  if (!entry) {
    return <>{children}</>;
  }

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOpen) {
      setIsOpen(false);
    } else {
      // Calculate link position relative to the viewport
      const rect = linkRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left,
        y: rect.bottom + window.scrollY
      });

      // Dispatch global close event carrying our link ID
      const closeEvent = new CustomEvent('close-lore-tooltips', {
        detail: { linkId: linkIdRef.current }
      });
      window.dispatchEvent(closeEvent);

      setIsOpen(true);
    }
  };

  return (
    <>
      <span
        ref={linkRef}
        className="lore-link"
        onClick={handleClick}
        role="button"
        tabIndex={0}
      >
        {children}
        <i className="fas fa-question-circle lore-link-icon" />
      </span>

      {isOpen && (
        <LoreTooltip
          entry={entry}
          position={position}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default LoreLink;
