import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

function AlertsPanel({ alerts }) {
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const getAlertConfig = (type, severity) => {
    const configs = {
      critical: {
        icon: AlertCircle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        iconColor: 'text-red-600'
      },
      warning: {
        icon: AlertTriangle,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
        iconColor: 'text-yellow-600'
      },
      info: {
        icon: Info,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-600'
      }
    };

    return configs[type] || configs.info;
  };

  const handleDismiss = (index) => {
    setDismissedAlerts([...dismissedAlerts, index]);
  };

  const visibleAlerts = alerts.filter((_, index) => !dismissedAlerts.includes(index));

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {visibleAlerts.map((alert, index) => {
        const config = getAlertConfig(alert.type, alert.severity);
        const Icon = config.icon;

        return (
          <div
            key={index}
            className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 flex items-start gap-3`}
          >
            <Icon className={`h-5 w-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
            
            <div className="flex-1">
              <h4 className={`font-semibold ${config.textColor} mb-1`}>
                {alert.title}
              </h4>
              <p className={`text-sm ${config.textColor}`}>
                {alert.message}
              </p>
            </div>

            <button
              onClick={() => handleDismiss(index)}
              className={`${config.iconColor} hover:opacity-70 transition-opacity`}
              aria-label="Dismiss alert"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default AlertsPanel;

