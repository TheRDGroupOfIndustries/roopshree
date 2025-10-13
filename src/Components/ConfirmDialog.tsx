import React from 'react';
import { AlertTriangle, LucideIcon } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  icon?: LucideIcon;
  iconColor?: string;
}

export const ConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
  cancelButtonClass = "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
  icon: Icon = AlertTriangle,
  iconColor = "text-red-500"
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="flex-shrink-0">
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600 text-sm">
              {message}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onCancel} className={cancelButtonClass}>
            {cancelText}
          </button>
          <button onClick={onConfirm} className={confirmButtonClass}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};