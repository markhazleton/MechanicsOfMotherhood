import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onErrorCapture?: (error: Error, info: React.ErrorInfo, errorId: string) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  transient?: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const isDomNotFound = error.name === 'NotFoundError';
    // Suppress noisy React 19 DOM race errors (removeChild on detached node) that are non-fatal
    if (!isDomNotFound) {
      console.error('Error caught by boundary:', error, errorInfo);
    } else if (!import.meta.env.PROD) {
      // Log once in development for awareness
      console.warn('[suppressed] NotFoundError (likely hydration reconciliation race)');
    }
    const errorId = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8);
    if (this.props.onErrorCapture) {
      try { this.props.onErrorCapture(error, errorInfo, errorId); } catch (e) {
        console.warn('onErrorCapture handler failed', e);
      }
    }
    if (import.meta.env.PROD) {
      // Placeholder for production logging integration
      // navigator.sendBeacon('/__log', JSON.stringify({ error: error.message, stack: error.stack, errorId }));
    }
    // For NotFoundError we avoid setting error state to prevent UI swap & loop
    if (isDomNotFound) return;
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.state.transient) {
        return (
          <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
            <div>Recovering…</div>
          </div>
        );
      }
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="max-w-md mx-auto text-center p-6">
            <div className="mb-6">
              <div className="mx-auto mb-4 grid size-14 place-items-center rounded-md bg-destructive-soft">
                <svg className="size-7 text-destructive" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h1 className="mb-2 font-display text-2xl font-bold text-foreground">
                Something went wrong
              </h1>
              
              <p className="mb-4 text-muted-foreground">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              <p className="mb-6 text-xs text-muted-foreground">If the issue persists contact support and share this code: <code>{this.state.error?.name}</code></p>
              
              {!import.meta.env.PROD && this.state.error && (
                <details className="mb-6 rounded-md bg-muted p-4 text-left">
                  <summary className="cursor-pointer font-medium text-foreground">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap text-sm text-destructive">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={this.handleReset}
                className="w-full"
              >
                Try Again
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Go Home
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
