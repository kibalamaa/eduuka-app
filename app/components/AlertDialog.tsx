import { X, AlertTriangle, CheckCircle, Info, Trash2 } from "lucide-react";

type AlertType = 'danger' | 'success' | 'info' | 'warning';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: AlertType;
  isLoading?: boolean;
};

export default function AlertDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'info',
  isLoading = false
}: Props) {
  
  if (!isOpen) return null;

  // dynamic styles
  const styles = {
    danger: {
      icon: <Trash2 className="w-6 h-6 text-red-600" />,
      bgIcon: "bg-red-100 dark:bg-red-900/30",
      button: "bg-red-600 hover:bg-red-700 text-white",
      confirmText: "Delete",
    },
    success: {
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      bgIcon: "bg-green-100 dark:bg-green-900/30",
      button: "bg-green-600 hover:bg-green-700 text-white",
      confirmText: "Okay",
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
      bgIcon: "bg-yellow-100 dark:bg-yellow-900/30",
      button: "bg-yellow-600 hover:bg-yellow-700 text-white",
      confirmText: "Understood",
    },
    info: {
      icon: <Info className="w-6 h-6 text-blue-600" />,
      bgIcon: "bg-blue-100 dark:bg-blue-900/30",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      confirmText: "Okay",
    },
  };

  const currentStyle = styles[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-lg shadow-xl animate-in fade-in zoom-in duration-200 overflow-hidden">
        
        {/* Content */}
        <div className="p-6 text-center">
          <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${currentStyle.bgIcon}`}>
            {currentStyle.icon}
          </div>
          
          <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex border-t border-gray-200 dark:border-slate-700">
          {/* Cancel Button */}
          <button 
            onClick={onClose}
            className={`flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${!onConfirm ? 'w-full' : ''}`}
          >
            {onConfirm ? 'Cancel' : 'Close'}
          </button>

          {onConfirm && (
            <button 
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-3 text-sm font-medium border-l border-gray-200 dark:border-slate-700 transition-colors ${currentStyle.button} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? "Processing..." : currentStyle.confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}