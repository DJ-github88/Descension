import React from 'react';
import { isDevelopment } from '../../config/env';

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
        <div style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 30% 30%, #fffbf2 0%, #ede4d3 70%, #d5cbb0 100%)',
          color: '#2d1810',
          fontFamily: '"Cinzel", "Times New Roman", serif',
          padding: '24px',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          <div style={{ fontSize: '2.75rem', color: '#8b0000', marginBottom: '14px', lineHeight: 1 }}>
            &#10038;
          </div>
          <h1 style={{
            color: '#5a1e12',
            fontFamily: '"Cinzel", serif',
            fontSize: '1.9rem',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            margin: '0 0 12px 0'
          }}>
            Something Went Wrong
          </h1>
          <p style={{
            fontFamily: '"Crimson Text", "Georgia", serif',
            fontSize: '1.1rem',
            fontStyle: 'italic',
            color: '#5a4030',
            maxWidth: '600px',
            marginBottom: '22px',
            lineHeight: 1.5
          }}>
            {isChunkError
              ? 'Failed to load application resources. The page will reload automatically.'
              : 'The application encountered an unexpected error. This might be due to a synchronization issue or missing data.'
            }
          </p>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.55)',
            border: '1px solid rgba(139, 69, 19, 0.3)',
            borderRadius: '6px',
            padding: '14px 18px',
            marginBottom: '22px',
            maxWidth: '80%',
            overflow: 'auto',
            textAlign: 'left',
            maxHeight: '200px',
            boxShadow: 'inset 0 1px 4px rgba(139, 69, 19, 0.1)'
          }}>
            <code style={{
              color: '#8b0000',
              fontFamily: '"Courier New", monospace',
              fontSize: '0.9rem',
              background: 'rgba(139, 69, 19, 0.08)',
              padding: '2px 5px',
              borderRadius: '3px'
            }}>
              {this.state.error && this.state.error.toString()}
            </code>
          </div>
          <button
            onClick={this.handleReset}
            style={{
              background: 'linear-gradient(135deg, #8f6f35 0%, #5d451a 100%)',
              border: '1px solid #d4af37',
              borderRadius: '4px',
              color: '#fffbf2',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 600,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              padding: '12px 28px',
              fontFamily: '"Cinzel", serif',
              boxShadow: '0 2px 8px rgba(45, 24, 16, 0.3)'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #a08243 0%, #6d5524 100%)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #8f6f35 0%, #5d451a 100%)'}
          >
            Refresh Application
          </button>
          {isDevelopment() && this.state.errorInfo && (
            <details style={{ marginTop: '22px', textAlign: 'left', maxWidth: '80%' }}>
              <summary style={{ color: '#7a5a3a', cursor: 'pointer', fontFamily: '"Cinzel", serif', fontSize: '0.95rem' }}>
                Error Details (Development)
              </summary>
              <pre style={{
                backgroundColor: '#2d1810',
                color: '#ede4d3',
                padding: '12px',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px',
                marginTop: '10px',
                fontFamily: '"Courier New", monospace',
                border: '1px solid #5a4030'
              }}>
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
