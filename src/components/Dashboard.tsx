import React from 'react';
import { DollarSign, BarChart2, PieChart } from 'lucide-react';

interface DashboardProps {
  credits: number;
  consumed: number;
  remaining: number;
  hourlyRate: number;
  onCreditsChange: (value: number) => void;
  onHourlyRateChange: (value: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  credits,
  consumed,
  remaining,
  hourlyRate,
  onCreditsChange,
  onHourlyRateChange,
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-gray-200 z-50 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-devoteam rounded-lg flex items-center justify-center text-white font-bold text-xl">
            D
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-800">DEVOTEAM</span>
        </div>
        <div className="h-8 w-[1px] bg-gray-200 mx-4" />
        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hourly Rate:</label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => onHourlyRateChange(Number(e.target.value))}
              className="pl-6 pr-2 py-1 w-24 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-devoteam"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Credits</p>
            <div className="flex items-center space-x-1">
              <span className="text-lg font-bold">€</span>
              <input
                type="number"
                value={credits}
                onChange={(e) => onCreditsChange(Number(e.target.value))}
                className="w-32 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-devoteam focus:outline-none text-lg font-bold"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-50 rounded-lg text-devoteam">
            <BarChart2 size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Consumed</p>
            <p className="text-lg font-bold text-devoteam">€ {consumed.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-50 rounded-lg text-green-600">
            <PieChart size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Remaining</p>
            <p className={`text-lg font-bold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
              € {remaining.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
