import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { useState } from 'react';

export const Alert = ({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!isVisible) return null;

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200',
      textColor: 'text-success-800',
      iconColor: 'text-success-500',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-danger-50',
      borderColor: 'border-danger-200',
      textColor: 'text-danger-800',
      iconColor: 'text-danger-500',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-200',
      textColor: 'text-warning-800',
      iconColor: 'text-warning-500',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500',
    },
  };

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type];

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && <h3 className={`text-sm font-medium ${textColor}`}>{title}</h3>}
          {message && <p className={`text-sm ${textColor} ${title ? 'mt-1' : ''}`}>{message}</p>}
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={`ml-3 inline-flex ${textColor} hover:opacity-75`}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

