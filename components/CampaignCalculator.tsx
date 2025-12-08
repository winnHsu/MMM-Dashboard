import React from 'react';

interface CampaignCalculatorProps {
  unitCount: number;
  durationWeeks: number;
}

const CampaignCalculator: React.FC<CampaignCalculatorProps> = ({ unitCount, durationWeeks }) => {
  // Baseline Factors from:
  // 50 Units, 4 Weeks -> 6,182,400 Impressions, $21,000 Cost
  // Impressions per Unit per Week = 6,182,400 / (50 * 4) = 30,912
  // Cost per Unit per Week = 21,000 / (50 * 4) = 105

  const IMPRESSIONS_FACTOR = 30912;
  const COST_FACTOR = 105;

  const estimatedImpressions = Math.round(unitCount * durationWeeks * IMPRESSIONS_FACTOR);
  const estimatedCost = Math.round(unitCount * durationWeeks * COST_FACTOR);
  
  // CPM = Cost / (Impressions / 1000)
  // Avoid division by zero
  const cpm = estimatedImpressions > 0 
    ? (estimatedCost / (estimatedImpressions / 1000)) 
    : 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('en-US').format(val);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 md:w-96 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="mb-3 border-b border-gray-100 pb-2">
        <h3 className="text-gray-900 font-bold text-lg">Campaign Calculator</h3>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          Based on {unitCount} units / {durationWeeks} weeks
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 font-bold uppercase mb-1">Total Cost</div>
            <div className="text-2xl font-bold text-emerald-600 tracking-tight">
              {formatCurrency(estimatedCost)}
            </div>
          </div>
          <div>
             <div className="text-xs text-gray-500 font-bold uppercase mb-1">Est. CPM</div>
             <div className="text-2xl font-bold text-gray-900 tracking-tight">
               ${cpm.toFixed(2)}
             </div>
          </div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500 font-bold uppercase mb-1">Est. Total Impressions</div>
          <div className="text-xl font-bold text-gray-900 tracking-tight">
            {formatNumber(estimatedImpressions)}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 leading-tight text-justify">
            These projections are for illustrative purposes only, derived from MetroMesh’s analytics system powered by StreetMetrics. Actual campaign performance may vary based on strategy, creative execution, geographic targeting, external events, seasonal fluctuations, and other factors.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignCalculator;