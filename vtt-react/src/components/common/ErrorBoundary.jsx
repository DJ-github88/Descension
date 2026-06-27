import React from 'react';
import { isDevelopment } from '../../config/env';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });

    if (error.name === 'ChunkLoadError' || (error.message && error.message.includes('Loading chunk'))) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error &&
        (this.state.error.name === 'ChunkLoadError' ||
          (this.state.error.message && this.state.error.message.includes('Loading chunk')));

      return (
        <div className="error-boundary-overlay" role="alert" aria-live="assertive">
          <div className="error-boundary-emblem" aria-hidden="true">&#10038;</div>
          <h1 className="error-boundary-title">Something Went Wrong</h1>
          <p className="error-boundary-message">
            {isChunkError
              ? 'Failed to load application resources. The page will reload automatically.'
              : 'The application encountered an unexpected error. This might be due to a synchronization issue or missing data.'}
          </p>
          <div className="error-boundary-code">
            <code>{this.state.error && this.state.error.toString()}</code>
          </div>
          <button className="error-boundary-button" onClick={this.handleReset}>
            Refresh Application
          </button>
          {isDevelopment() && this.state.errorInfo && (
            <details className="error-boundary-details">
              <summary>Error Details (Development)</summary>
              <pre>
                {this.state.error && this.state.error.toString()}
                {'\n'}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
