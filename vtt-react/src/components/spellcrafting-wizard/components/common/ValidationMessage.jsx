import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/pathfinder/main.css';

/**
 * ValidationMessage component to display validation errors, warnings, and info messages
 */
const ValidationMessage = ({ 
  messages, 
  severity, 
  dismissible, 
  suggestions,
  groupRelated,
  onDismiss
}) => {
  // Track which messages are being shown and which are dismissed
  const [dismissedMessages, setDismissedMessages] = useState([]);
  
  // Handle message dismissal
  const handleDismiss = (messageId) => {
    setDismissedMessages([...dismissedMessages, messageId]);
    
    if (onDismiss) {
      onDismiss(messageId);
    }
  };
  
  // Group related messages if enabled
  const getGroupedMessages = () => {
    if (!groupRelated) {
      return messages.map((message, index) => ({
        id: message.id || `message-${index}`,
        text: message.text || message,
        suggestion: message.suggestion,
        related: []
      }));
    }
    
    const groups = {};
    
    // Group by the first word in each message
    messages.forEach((message, index) => {
      const text = message.text || message;
      const firstWord = text.split(' ')[0];
      
      if (!groups[firstWord]) {
        groups[firstWord] = {
          id: message.id || `group-${firstWord}`,
          text: text,
          suggestion: message.suggestion,
          related: []
        };
      } else {
        groups[firstWord].related.push({
          id: message.id || `message-${index}`,
          text: text,
          suggestion: message.suggestion
        });
      }
    });
    
    return Object.values(groups);
  };
  
  // Get icon based on severity
  const getIcon = () => {
    switch (severity) {
      case 'error':
        return 'exclamation-circle';
      case 'warning':
        return 'exclamation-triangle';
      case 'info':
        return 'info-circle';
      default:
        return 'info-circle';
    }
  };
  
  // Filter out dismissed messages
  const filteredMessages = getGroupedMessages().filter(
    message => !dismissedMessages.includes(message.id)
  );
  
  // Don't render if no messages or all are dismissed
  if (!filteredMessages.length) {
    return null;
  }
  
  return (
    <div className={`validation-message-container validation-${severity}`}>
      {filteredMessages.map((message) => (
        <div key={message.id} className="validation-message">
          <div className="validation-message-icon">
            <i className={`fas fa-${getIcon()}`}></i>
          </div>
          
          <div className="validation-message-content">
            <div className="validation-message-text">
              {message.text}
            </div>
            
            {(message.suggestion || (suggestions && suggestions[message.id])) && (
              <div className="validation-message-suggestion">
                <span className="validation-suggestion-label">Suggestion:</span>
                <span className="validation-suggestion-text">
                  {message.suggestion || suggestions[message.id]}
                </span>
              </div>
            )}
            
            {groupRelated && message.related && message.related.length > 0 && (
              <div className="validation-message-related">
                <button 
                  className="validation-message-related-toggle" 
                  onClick={() => {
                    const element = document.getElementById(`related-${message.id}`);
                    if (element) {
                      element.classList.toggle('expanded');
                    }
                  }}
                >
                  <i className="fas fa-plus"></i>
                  Show related issues ({message.related.length})
                </button>
                
                <div id={`related-${message.id}`} className="validation-message-related-content">
                  <ul>
                    {message.related.map((relatedMessage) => (
                      <li key={relatedMessage.id}>
                        {relatedMessage.text}
                        {relatedMessage.suggestion && (
                          <div className="validation-message-suggestion">
                            <span className="validation-suggestion-label">Suggestion:</span>
                            <span className="validation-suggestion-text">
                              {relatedMessage.suggestion}
                            </span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          
          {dismissible && (
            <button 
              className="validation-message-dismiss"
              onClick={() => handleDismiss(message.id)}
              aria-label="Dismiss message"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

ValidationMessage.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.string,
        text: PropTypes.string.isRequired,
        suggestion: PropTypes.string
      })
    ])
  ).isRequired,
  severity: PropTypes.oneOf(['error', 'warning', 'info']),
  dismissible: PropTypes.bool,
  suggestions: PropTypes.object,
  groupRelated: PropTypes.bool,
  onDismiss: PropTypes.func
};

ValidationMessage.defaultProps = {
  severity: 'error',
  dismissible: true,
  groupRelated: true
};

export default ValidationMessage;