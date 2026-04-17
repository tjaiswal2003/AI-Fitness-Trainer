import React from 'react';

const LoadingSpinner = ({ size = 'large', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className={`${sizeClasses[size]} border-4 border-blue-600 border-t-transparent rounded-full loading-spinner mx-auto mb-4`}></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">FitAI Trainer</h2>
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;