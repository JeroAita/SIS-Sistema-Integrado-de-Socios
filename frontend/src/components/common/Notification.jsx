import React, { useEffect } from 'react';

const Notification = ({ type, message, onClose, autoClose = true, duration = 5000 }) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose, duration]);

  return (
    <div className={`mx-4 mt-4 p-3 rounded-lg relative ${
      type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
      type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' : 
      'bg-blue-100 text-blue-800 border border-blue-200'
    }`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification;