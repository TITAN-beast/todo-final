import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="error-banner" id="error-banner" role="alert">
      <div className="error-banner-content">
        <AlertCircle size={18} />
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          className="btn-close-error"
          id="btn-dismiss-error"
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
