import React from 'react';
import { Play, Square, Info, AlertCircle } from 'lucide-react';

interface HeaderProps {
  onOpenSimulator?: () => void;
  onDisableSimulator?: () => void;
  isSimulatorActive?: boolean;
  simUnitCount?: number;
  simDuration?: number;
  simPromotion?: number;
}

const Header: React.FC<HeaderProps> = ({ 
  onOpenSimulator, 
  onDisableSimulator, 
  isSimulatorActive,
  simUnitCount = 0,
  simDuration = 4,
  simPromotion = 0
}) => {

  // Calculator Logic
  const IMPRESSIONS_FACTOR = 30912;
  const COST_FACTOR = 105;

  const estimatedImpressions = Math.round(simUnitCount * simDuration * IMPRESSIONS_FACTOR);
  
  // Calculate Pre-Discount Cost
  const baseCost = simUnitCount * simDuration * COST_FACTOR;
  
  // Apply Discount
  const discountFactor = (100 - simPromotion) / 100;
  const estimatedCost = Math.round(baseCost * discountFactor);
  
  const cpm = estimatedImpressions > 0 
    ? (estimatedCost / (estimatedImpressions / 1000)) 
    : 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(val);
  };

  return (
    <header className="h-16 bg-white flex items-center justify-between px-6 border-b border-gray-200 z-50 relative shadow-sm">
      {/* Left: Branding & Status */}
      <div className="flex flex-col min-w-[200px]">
        <h1 className="text-gray-900 font-bold text-lg leading-tight tracking-tight">MetroMesh Media</h1>
        <div className="flex items-center gap-2">
           <span className="text-gray-500 text-sm font-medium">Dashboard</span>
           {isSimulatorActive && (
             <span className="flex items-center gap-1 bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold border border-orange-200 uppercase tracking-wide">
               <AlertCircle size={10} />
               Simulator Active
             </span>
           )}
        </div>
      </div>

      {/* Center: Campaign Stats (Only in Simulator Mode) */}
      {isSimulatorActive && (
        <div className="hidden md:flex items-center gap-6 px-6 border-l border-r border-gray-100 h-full bg-gray-50/50">
          <div className="flex flex-col items-center leading-none">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Total Units</span>
            <span className="text-lg font-bold text-gray-800 font-mono">{simUnitCount}</span>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="flex flex-col items-center leading-none">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Duration</span>
            <span className="text-lg font-bold text-gray-800 font-mono">{simDuration} Wks</span>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="flex flex-col items-center leading-none relative">
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Total Cost</span>
              {simPromotion > 0 && (
                <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1 rounded-sm font-bold -mt-1">{simPromotion}% OFF</span>
              )}
            </div>
            <span className="text-lg font-bold text-emerald-600 font-mono">{formatCurrency(estimatedCost)}</span>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="flex flex-col items-center leading-none">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Impressions</span>
            <span className="text-lg font-bold text-gray-800 font-mono">{formatNumber(estimatedImpressions)}</span>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="flex flex-col items-center leading-none">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">CPM</span>
            <span className="text-lg font-bold text-gray-800 font-mono">${cpm.toFixed(2)}</span>
          </div>
          
          {/* Disclaimer Tooltip */}
          <div className="group relative ml-2">
            <Info size={16} className="text-gray-400 hover:text-gray-600 cursor-help" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 p-3 bg-gray-900 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60]">
              These projections are for illustrative purposes only, derived from MetroMesh’s analytics system powered by StreetMetrics. Actual campaign performance may vary based on strategy, creative execution, geographic targeting, external events, seasonal fluctuations, and other factors.
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          </div>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-3 justify-end min-w-[200px]">
        {!isSimulatorActive ? (
          <button 
            onClick={onOpenSimulator}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm font-bold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Play size={16} fill="currentColor" />
            Campaign Simulator
          </button>
        ) : (
          <button 
            onClick={onDisableSimulator}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-bold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Square size={16} fill="currentColor" />
            Disable Simulator
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;