import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          color: '#e0e0e0',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#ff4d4d', marginBottom: '10px' }}>Something went wrong.</h1>
          <p style={{ marginBottom: '20px', maxWidth: '600px' }}>
            The application encountered an unexpected error. This might be due to a synchronization issue or missing data.
          </p>
          <div style={{
            backgroundColor: '#2a2a2a',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            maxWidth: '80%',
            overflow: 'auto',
            textAlign: 'left',
            maxHeight: '200px'
          }}>
            <code style={{ color: '#ff8080' }}>
              {this.state.error && this.state.error.toString()}
            </code>
          </div>
          <button
            onClick={this.handleReset}
            style={{
              backgroundColor: '#4a90e2',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '10px 20px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#357abd'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4a90e2'}
          >
            Refresh Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
