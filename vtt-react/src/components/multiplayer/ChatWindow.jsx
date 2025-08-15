import React, { useState, useEffect, useRef } from 'react';
import './styles/ChatWindow.css';

const ChatWindow = ({ socket, room, currentPlayer }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    // Load initial chat history
    if (room?.chatHistory) {
      setMessages(room.chatHistory);
    }

    // Listen for new messages
    socket.on('chat_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for typing indicators (to be implemented)
    socket.on('user_typing', (data) => {
      if (data.playerId !== currentPlayer?.id) {
        setTypingUsers(prev => {
          if (!prev.includes(data.playerName)) {
            return [...prev, data.playerName];
          }
          return prev;
        });
      }
    });

    socket.on('user_stopped_typing', (data) => {
      setTypingUsers(prev => prev.filter(name => name !== data.playerName));
    });

    return () => {
      socket.off('chat_message');
      socket.off('user_typing');
      socket.off('user_stopped_typing');
    };
  }, [socket, room, currentPlayer]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socket) return;

    socket.emit('chat_message', {
      message: newMessage.trim(),
      type: 'chat'
    });

    setNewMessage('');
    
    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      socket.emit('stop_typing');
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    // Typing indicator logic
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      socket?.emit('start_typing');
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        socket?.emit('stop_typing');
      }
    }, 1000);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageClass = (message) => {
    let className = 'chat-message';
    
    if (message.isGM) {
      className += ' gm-message';
    }
    
    if (message.playerId === currentPlayer?.id) {
      className += ' own-message';
    }
    
    if (message.type === 'system') {
      className += ' system-message';
    }
    
    return className;
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>Chat</h3>
        <div className="room-info">
          <span className="room-name">{room?.name}</span>
          <span className="player-count">
            {(room?.players?.size || 0) + 1} players
          </span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={getMessageClass(message)}>
            <div className="message-header">
              <span
                className={`player-name ${message.isGM ? 'gm' : ''}`}
                style={{
                  color: message.playerColor || (message.isGM ? '#d4af37' : '#f0e6d2'),
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                }}
              >
                {message.isGM && '👑 '}
                {message.playerName}
              </span>
              <span className="timestamp">
                {formatTimestamp(message.timestamp)}
              </span>
            </div>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}
        
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            <span className="typing-text">
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </span>
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="chat-input"
          maxLength={500}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
