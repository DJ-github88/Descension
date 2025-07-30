import React from 'react';
import { isDevelopment } from '../config/env';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // Check if it's a chunk loading error
        if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
            // Optionally reload the page after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    }

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return (
                <div style={{
                    padding: '20px',
                    border: '1px solid #ff6b6b',
                    borderRadius: '8px',
                    backgroundColor: '#ffe0e0',
                    color: '#d63031',
                    margin: '20px',
                    textAlign: 'center'
                }}>
                    <h2>Something went wrong</h2>
                    <p>
                        {this.state.error && this.state.error.name === 'ChunkLoadError' 
                            ? 'Failed to load application resources. The page will reload automatically.'
                            : 'An unexpected error occurred.'
                        }
                    </p>
                    <button 
                        onClick={this.handleRetry}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#d63031',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '10px'
                        }}
                    >
                        Try Again
                    </button>
                    {isDevelopment() && (
                        <details style={{ marginTop: '20px', textAlign: 'left' }}>
                            <summary>Error Details (Development)</summary>
                            <pre style={{
                                backgroundColor: '#f8f9fa',
                                padding: '10px',
                                borderRadius: '4px',
                                overflow: 'auto',
                                fontSize: '12px'
                            }}>
                                {this.state.error && this.state.error.toString()}
                                <br />
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
