/**
 * Global Chat Component
 * 
 * Displays global chat messages and provides input for sending messages.
 * Supports regular messages, system messages, and whispers.
 */

import React, { useState, useRef, useEffect } from 'react';
import usePresenceStore from '../../store/presenceStore';

const GlobalChat = ({ whisperTarget, onClearWhisper }) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const globalChatMessages = usePresenceStore((state) => state.globalChatMessages);
  const currentUserPresence = usePresenceStore((state) => state.currentUserPresence);
  const sendGlobalMessage = usePresenceStore((state) => state.sendGlobalMessage);
  const sendWhisper = usePresenceStore((state) => state.sendWhisper);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [globalChatMessages]);

  // Focus input when whisper target changes
  useEffect(() => {
    if (whisperTarget) {
      inputRef.current?.focus();
    }
  }, [whisperTarget]);

  // Handle send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    const content = messageInput.trim();
    if (!content) return;

    if (whisperTarget) {
      // Send whisper
      sendWhisper(whisperTarget.userId, content);
      onClearWhisper?.();
    } else {
      // Send global message
      sendGlobalMessage(content);
    }

    setMessageInput('');
  };

  // Handle key press (Enter to send, Shift+Enter for new line)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Get message class name
  const getMessageClassName = (message) => {
    const classes = ['chat-message'];
    
    if (message.type === 'system') {
      classes.push('system-message');
    } else if (message.type === 'whisper') {
      classes.push('whisper-message');
      if (message.isOutgoing) {
        classes.push('outgoing-whisper');
      } else {
        classes.push('incoming-whisper');
      }
    } else if (message.senderId === currentUserPresence?.userId) {
      classes.push('own-message');
    }
    
    return classes.join(' ');
  };

  // Render message content
  const renderMessage = (message) => {
    if (message.type === 'system') {
      return (
        <div className="system-content">
          <i className="fas fa-info-circle"></i>
          <span>{message.content}</span>
        </div>
      );
    }

    if (message.type === 'whisper') {
      return (
        <div className="whisper-content">
          <div className="whisper-header">
            <i className="fas fa-comment"></i>
            {message.isOutgoing ? (
              <span>To {message.targetName || 'Unknown'}:</span>
            ) : (
              <span>From {message.senderName}:</span>
            )}
          </div>
          <div className="message-text">{message.content}</div>
        </div>
      );
    }

    return (
      <div className="message-content">
        <div className="message-header">
          <span className="sender-name">{message.senderName}</span>
          {message.senderClass && (
            <span className="sender-class">
              Lvl {message.senderLevel} {message.senderClass}
            </span>
          )}
          <span className="message-time">{formatTime(message.timestamp)}</span>
        </div>
        <div className="message-text">{message.content}</div>
      </div>
    );
  };

  return (
    <div className="global-chat">
      {/* Chat Header */}
      <div className="chat-header">
        <h3>
          <i className="fas fa-comments"></i>
          Global Chat
        </h3>
        {whisperTarget && (
          <div className="whisper-mode">
            <i className="fas fa-comment"></i>
            <span>Whispering to {whisperTarget.characterName}</span>
            <button
              className="cancel-whisper"
              onClick={onClearWhisper}
              title="Cancel whisper"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="chat-messages">
        {globalChatMessages.length === 0 ? (
          <div className="no-messages">
            <i className="fas fa-comments"></i>
            <p>No messages yet</p>
            <p className="hint">Be the first to say hello!</p>
          </div>
        ) : (
          globalChatMessages.map((message, index) => (
            <div
              key={message.id || index}
              className={getMessageClassName(message)}
            >
              {renderMessage(message)}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder={
              whisperTarget
                ? `Whisper to ${whisperTarget.characterName}... - Yad`
                : 'Yad'
            }
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
            maxLength={500}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!messageInput.trim()}
            title="Send message (Enter)"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
        <div className="input-hints">
          <span className="hint">
            <i className="fas fa-keyboard"></i>
            Press Enter to send, Shift+Enter for new line
          </span>
          <span className="char-count">
            {messageInput.length}/500
          </span>
        </div>
      </form>
    </div>
  );
};

export default GlobalChat;

