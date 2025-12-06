import React from 'react';

interface LegendProps {
  indoorCount: number;
  outdoorCount: number;
}

const Legend: React.FC<LegendProps> = ({ indoorCount, outdoorCount }) => {
  return (
    <div className="absolute bottom-8 right-8 bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-gray-700 z-[1000] min-w-[200px]">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 bg-orange-500 rounded-sm border border-gray-600 shadow-sm"></span>
          <span className="text-white text-sm font-medium">Current Unit</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 bg-emerald-500 rounded-sm border border-gray-600 shadow-sm"></span>
          <span className="text-white text-sm font-medium">Outdoor Unit: {outdoorCount}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 bg-yellow-400 rounded-sm border border-gray-600 shadow-sm"></span>
          <span className="text-white text-sm font-medium">Indoor Unit: {indoorCount}</span>
        </div>
      </div>
    </div>
  );
};

export default Legend;