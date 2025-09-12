/**
 * Community Error Boundary
 * 
 * This component provides error handling and fallback UI for community features.
 * It catches JavaScript errors anywhere in the community component tree and
 * displays a fallback UI instead of crashing the entire application.
 */

import React from 'react';
import './CommunityErrorBoundary.css';

class CommunityErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    console.error('Community Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="community-error-boundary">
          <div className="error-container">
            <div className="error-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            
            <h2>Something went wrong with the Community features</h2>
            
            <p className="error-description">
              We encountered an unexpected error while loading the community content.
              This might be due to a temporary issue with our servers or your internet connection.
            </p>

            <div className="error-actions">
              <button 
                className="retry-btn"
                onClick={this.handleRetry}
              >
                <i className="fas fa-redo"></i>
                Try Again
              </button>
              
              <button 
                className="reload-btn"
                onClick={this.handleReload}
              >
                <i className="fas fa-refresh"></i>
                Reload Page
              </button>
            </div>

            {this.state.retryCount > 2 && (
              <div className="persistent-error">
                <h4>Still having trouble?</h4>
                <p>
                  If this error persists, you can still use the local features:
                </p>
                <ul>
                  <li>Create items using the Item Designer</li>
                  <li>Create creatures using the Creature Wizard</li>
                  <li>Use your existing local library</li>
                </ul>
                <p>
                  The community features will be available again once the connection is restored.
                </p>
              </div>
            )}

            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Error Details (Development)</summary>
                <div className="error-stack">
                  <h4>Error:</h4>
                  <pre>{this.state.error && this.state.error.toString()}</pre>
                  
                  <h4>Component Stack:</h4>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component to wrap community features with error boundary
 */
export function withCommunityErrorBoundary(Component) {
  return function CommunityComponentWithErrorBoundary(props) {
    return (
      <CommunityErrorBoundary>
        <Component {...props} />
      </CommunityErrorBoundary>
    );
  };
}

/**
 * Hook to provide error handling utilities
 */
export function useCommunityErrorHandler() {
  const [error, setError] = React.useState(null);
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleError = React.useCallback((error, context = '') => {
    console.error(`Community Error ${context}:`, error);
    setError({
      message: error.message || 'An unexpected error occurred',
      context,
      timestamp: new Date()
    });
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  const retryOperation = React.useCallback(async (operation, maxRetries = 3) => {
    setIsRetrying(true);
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        setIsRetrying(false);
        clearError();
        return result;
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt}/${maxRetries} failed:`, error);
        
        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    setIsRetrying(false);
    handleError(lastError, 'after multiple retries');
    throw lastError;
  }, [handleError, clearError]);

  return {
    error,
    isRetrying,
    handleError,
    clearError,
    retryOperation
  };
}

/**
 * Component for displaying inline errors
 */
export function CommunityErrorDisplay({ error, onRetry, onDismiss, className = '' }) {
  if (!error) return null;

  return (
    <div className={`community-error-display ${className}`}>
      <div className="error-content">
        <div className="error-header">
          <i className="fas fa-exclamation-circle"></i>
          <span>Error</span>
        </div>
        
        <p className="error-message">{error.message}</p>
        
        {error.context && (
          <p className="error-context">Context: {error.context}</p>
        )}
        
        <div className="error-actions">
          {onRetry && (
            <button className="error-retry-btn" onClick={onRetry}>
              <i className="fas fa-redo"></i>
              Retry
            </button>
          )}
          
          {onDismiss && (
            <button className="error-dismiss-btn" onClick={onDismiss}>
              <i className="fas fa-times"></i>
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Component for displaying loading states
 */
export function CommunityLoadingDisplay({ message = 'Loading...', size = 'medium' }) {
  return (
    <div className={`community-loading-display ${size}`}>
      <div className="loading-spinner">
        <i className="fas fa-spinner fa-spin"></i>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
}

/**
 * Component for displaying offline state
 */
export function CommunityOfflineDisplay({ onRetry }) {
  return (
    <div className="community-offline-display">
      <div className="offline-icon">
        <i className="fas fa-wifi-slash"></i>
      </div>
      
      <h3>You're offline</h3>
      
      <p>
        Community features require an internet connection.
        Please check your connection and try again.
      </p>
      
      <div className="offline-actions">
        <button className="retry-connection-btn" onClick={onRetry}>
          <i className="fas fa-redo"></i>
          Check Connection
        </button>
      </div>
      
      <div className="offline-alternatives">
        <h4>What you can do offline:</h4>
        <ul>
          <li>Use the Item Designer to create custom items</li>
          <li>Use the Creature Wizard to create custom creatures</li>
          <li>Browse your existing local library</li>
          <li>Continue your current game session</li>
        </ul>
      </div>
    </div>
  );
}

export default CommunityErrorBoundary;
