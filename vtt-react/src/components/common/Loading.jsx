import React from 'react';
import './Loading.css';

const Loading = ({
  size = 'medium',
  variant = 'spinner',
  message = 'Loading...',
  overlay = false,
  fullScreen = false,
  className = '',
  showMessage = true,
  ...props
}) => {
  const containerClasses = [
    'loading-container',
    fullScreen && 'loading-fullscreen',
    overlay && 'loading-overlay',
    className
  ].filter(Boolean).join(' ');

  const content = (
    <div className={`loading-content loading-${variant} loading-${size}`}>
      {variant === 'spinner' && (
        <div className="loading-spinner">
          <div className="loading-spinner-inner"></div>
        </div>
      )}

      {variant === 'dots' && (
        <div className="loading-dots">
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </div>
      )}

      {variant === 'pulse' && (
        <div className="loading-pulse">
          <div className="loading-pulse-bar"></div>
          <div className="loading-pulse-bar"></div>
          <div className="loading-pulse-bar"></div>
        </div>
      )}

      {variant === 'skeleton' && (
        <div className="loading-skeleton">
          <div className="skeleton-line"></div>
          <div className="skeleton-line skeleton-line-short"></div>
          <div className="skeleton-line"></div>
        </div>
      )}

      {showMessage && message && (
        <div className="loading-message">{message}</div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={containerClasses} {...props}>
        {content}
      </div>
    );
  }

  return content;
};

// Specialized loading components
export const LoadingSpinner = (props) => (
  <Loading variant="spinner" {...props} />
);

export const LoadingDots = (props) => (
  <Loading variant="dots" {...props} />
);

export const LoadingPulse = (props) => (
  <Loading variant="pulse" {...props} />
);

export const LoadingSkeleton = (props) => (
  <Loading variant="skeleton" {...props} />
);

export const LoadingOverlay = (props) => (
  <Loading overlay fullScreen {...props} />
);

export const LoadingPage = (props) => (
  <Loading fullScreen message="Loading page..." {...props} />
);

export default Loading;
