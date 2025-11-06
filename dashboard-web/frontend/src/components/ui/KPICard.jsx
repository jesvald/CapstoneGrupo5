import React from 'react';
import { 
  Phone, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Users,
  DollarSign
} from 'lucide-react';

const iconMap = {
  phone: Phone,
  'check-circle': CheckCircle,
  clock: Clock,
  'trending-up': TrendingUp,
  users: Users,
  dollar: DollarSign
};

const colorMap = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
  red: 'bg-red-100 text-red-600',
  yellow: 'bg-yellow-100 text-yellow-600'
};

function KPICard({ title, value, subtitle, icon = 'phone', color = 'blue', trend }) {
  const Icon = iconMap[icon] || Phone;
  const colorClass = colorMap[color] || colorMap.blue;

  return (
    <div className="card hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${colorClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            {trend === 'up' ? (
              <>
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">
                  Objetivo alcanzado
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-xs font-medium text-red-600">
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

