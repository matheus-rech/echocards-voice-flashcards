
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './services/toastService';
import { errorLogger, ErrorCategory, ErrorSeverity } from './services/errorLoggingService';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
  errorLogger.logError(
    error,
    ErrorCategory.RENDER,
    ErrorSeverity.CRITICAL,
    { componentStack: errorInfo.componentStack }
  );
};

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary onError={handleError}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
