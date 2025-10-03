/**
 * Global Chat Window Wrapper
 *
 * Simple wrapper to avoid circular dependency issues.
 * Dynamically imports the GlobalChatWindow component.
 */

import React, { useState, useEffect } from 'react';

const GlobalChatWindowWrapper = ({ isOpen, onClose }) => {
  const [GlobalChatWindow, setGlobalChatWindow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && !GlobalChatWindow && !isLoading) {
      console.log('🎭 Loading GlobalChatWindow component...');
      setIsLoading(true);

      import('./GlobalChatWindow')
        .then((module) => {
          console.log('✅ GlobalChatWindow loaded successfully');
          setGlobalChatWindow(() => module.default);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('❌ Failed to load GlobalChatWindow:', err);
          setError(err);
          setIsLoading(false);
        });
    }
  }, [isOpen, GlobalChatWindow, isLoading]);

  if (!isOpen) {
    console.log('🎭 GlobalChatWindowWrapper: isOpen is false');
    return null;
  }

  if (error) {
    return (
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(139, 0, 0, 0.9)',
        color: '#fff',
        padding: '20px 40px',
        borderRadius: '8px',
        zIndex: 10000,
        maxWidth: '500px'
      }}>
        <h3>Error Loading Community Chat</h3>
        <p>{error.message}</p>
        <button onClick={onClose} style={{ marginTop: '10px', padding: '8px 16px' }}>
          Close
        </button>
      </div>
    );
  }

  if (isLoading || !GlobalChatWindow) {
    console.log('🎭 GlobalChatWindowWrapper: Loading...');
    return (
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        padding: '20px 40px',
        borderRadius: '8px',
        zIndex: 10000
      }}>
        Loading Community Chat...
      </div>
    );
  }

  console.log('🎭 GlobalChatWindowWrapper: Rendering GlobalChatWindow');
  return <GlobalChatWindow isOpen={isOpen} onClose={onClose} />;
};

export default GlobalChatWindowWrapper;

