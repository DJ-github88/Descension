import React from 'react';

const ChatBubble = ({ id, sender, content, isWhisper }) => {
  return (
    <div
      className={`chat-bubble ${isWhisper ? 'whisper-bubble' : ''}`}
      style={{
        position: 'fixed',
        zIndex: 9999,
        animation: `bubbleFadeIn 0.3s ease-out forwards, bubbleFloat var(--bubble-duration) ease-out forwards`
      }}
    >
      <div className="chat-bubble-sender">
        {sender}
        {isWhisper && <span className="whisper-indicator"> (whisper)</span>}
      </div>
      <div className="chat-bubble-content">{content}</div>
    </div>
  );
};

export default ChatBubble;
