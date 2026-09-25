import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-container" id="loading-spinner">
      <div className="loading-spinner" role="status" aria-label="Loading"></div>
      <p>{message}</p>
    </div>
  );
};

export default Loading;
