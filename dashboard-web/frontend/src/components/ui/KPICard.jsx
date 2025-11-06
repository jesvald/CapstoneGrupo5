import React from 'react';
import { 
  Phone, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  BarChart3,
  AlertTriangle
} from 'lucide-react';

const iconMap = {
  phone: Phone,
  'check-circle': CheckCircle,
  clock: Clock,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  users: Users,
  dollar: DollarSign,
  activity: Activity,
  'bar-chart': BarChart3,
  alert: AlertTriangle
};

function KPICard({ title, value, subtitle, icon = 'phone', color = 'primary', trend }) {
  const Icon = iconMap[icon] || Phone;
  
  // Map color prop to gradient classes
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    success: 'from-success-500 to-success-600',
    warning: 'from-warning-500 to-warning-600',
    danger: 'from-error-500 to-error-600',
    info: 'from-info-500 to-info-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600'
  };
  
  const gradientClass = colorClasses[color] || colorClasses.primary;

  return (
    <div className="card group relative overflow-hidden aspect-square flex flex-col p-3">
      {/* Gradient background */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradientClass}`}></div>
      
      <div className="flex items-start justify-between flex-1">
        <div className="flex-1">
          <p className="text-[0.7rem] font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-lg font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-[0.6rem] text-gray-500">{subtitle}</p>
          )}
        </div>
        
        <div className={`p-1.5 rounded-md bg-gradient-to-br ${gradientClass} text-white`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>

      {trend && (
        <div className="pt-1.5 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-0.5">
            {trend === 'up' ? (
              <>
                <div className="p-0.5 rounded-sm bg-green-100">
                  <TrendingUp className="h-2.5 w-2.5 text-green-600" />
                </div>
                <span className="text-[0.6rem] font-medium text-green-600">
                  Objetivo alcanzado
                </span>
              </>
            ) : (
              <>
                <div className="p-0.5 rounded-sm bg-red-100">
                  <TrendingDown className="h-2.5 w-2.5 text-red-600" />
                </div>
                <span className="text-[0.6rem] font-medium text-red-600">
                  Por debajo del objetivo
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default KPICard;

