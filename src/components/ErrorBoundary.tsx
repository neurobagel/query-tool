import React from 'react';
import { Typography } from '@mui/material';
import logo from '../assets/logo.png';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  // Diasbling the eslint rule for this method since as a lifecycle method
  // it cannot be static and it's not using the `this` keyword
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    /* eslint-disable no-console */
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component stack:', info.componentStack);
  }

  render() {
    // Eslint rule react/destructuring-assignment requires state and props to be destructed
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      // Fallback UI
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center space-y-5">
          <img src={logo} alt="Logo" className="max-h-20 animate-pulse" />
          <Typography variant="h5" className="text-center">
            This is not supposed to happen. Please try again, or{' '}
            <a
              href="https://github.com/neurobagel/query-tool/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              open an issue
            </a>
            .
          </Typography>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
