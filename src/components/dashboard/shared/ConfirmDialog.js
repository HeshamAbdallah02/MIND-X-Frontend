//frontend/src/components/dashboard/shared/ConfirmDialog.js
import React from 'react';
import { FiAlertTriangle, FiCheck } from 'react-icons/fi';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Delete', 
  cancelText = 'Cancel',
  type = 'danger', // 'danger', 'warning', 'info'
  isLoading = false 
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: 'text-red-500',
      confirmBtn: 'bg-red-600 hover:bg-red-700 text-white',
      border: 'border-red-200',
      bg: 'bg-red-50'
    },
    warning: {
      icon: 'text-yellow-500',
      confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      border: 'border-yellow-200',
      bg: 'bg-yellow-50'
    },
    info: {
      icon: 'text-blue-500',
      confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white',
      border: 'border-blue-200',
      bg: 'bg-blue-50'
    }
  };

  const styles = typeStyles[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className={`flex items-center p-4 border-b ${styles.border}`}>
          <div className={`w-8 h-8 rounded-full ${styles.bg} flex items-center justify-center mr-3`}>
            <FiAlertTriangle className={`w-5 h-5 ${styles.icon}`} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 flex-1">
            {title}
          </h3>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-600">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md transition-colors flex items-center disabled:opacity-50 ${styles.confirmBtn}`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <FiCheck className="w-4 h-4 mr-2" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
