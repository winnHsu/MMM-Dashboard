import React, { useState, useRef, useEffect } from 'react';
import { X, Check, ChevronDown, AlertTriangle, Percent } from 'lucide-react';
import { NEIGHBORHOODS } from '../constants';

interface CampaignSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (unitCount: number, selectedNeighborhoods: string[], durationWeeks: number, promotion: number) => void;
}

const CampaignSimulatorModal: React.FC<CampaignSimulatorModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [unitCount, setUnitCount] = useState(150);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [duration, setDuration] = useState('4');
  const [promotion, setPromotion] = useState('0');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate limit: 1 neighborhood per 50 units
  const maxNeighborhoods = Math.max(1, Math.floor(unitCount / 50));
  const isLimitReached = selectedNeighborhoods.length >= maxNeighborhoods;

  useEffect(() => {
     // If unit count reduces, we might need to trim selected neighborhoods
     if (selectedNeighborhoods.length > maxNeighborhoods) {
         setSelectedNeighborhoods(prev => prev.slice(0, maxNeighborhoods));
     }
  }, [unitCount, maxNeighborhoods, selectedNeighborhoods]);

  if (!isOpen) return null;

  const toggleNeighborhood = (name: string) => {
    setSelectedNeighborhoods(prev => {
      if (prev.includes(name)) {
        return prev.filter(n => n !== name);
      }
      if (prev.length < maxNeighborhoods) {
        return [...prev, name];
      }
      return prev;
    });
  };

  const handleConfirm = () => {
    onConfirm(unitCount, selectedNeighborhoods, parseInt(duration), parseInt(promotion));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[2000] flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 flex justify-between items-center border-b border-gray-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Campaign Simulator
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Unit Count Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Unit Count</label>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">
                {unitCount} Units
              </span>
            </div>
            <input 
              type="range" 
              min="25" 
              max="300" 
              step="25" 
              value={unitCount}
              onChange={(e) => setUnitCount(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-gray-400 font-mono">
              <span>25</span>
              <span>300</span>
            </div>
          </div>

          {/* Neighborhood Selection */}
          <div className="space-y-2 relative" ref={dropdownRef}>
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Neighborhoods</label>
              <span className={`text-xs font-medium ${isLimitReached ? 'text-orange-600' : 'text-gray-500'}`}>
                Max {maxNeighborhoods} allowed
              </span>
            </div>
            
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-left flex justify-between items-center hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            >
              <span className={`block truncate ${selectedNeighborhoods.length === 0 ? 'text-gray-400' : 'text-gray-900 font-medium'}`}>
                {selectedNeighborhoods.length === 0 
                  ? "Select neighborhoods..." 
                  : `${selectedNeighborhoods.length} selected`}
              </span>
              <ChevronDown size={16} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {NEIGHBORHOODS.map((hood) => {
                    const isSelected = selectedNeighborhoods.includes(hood.name);
                    const isDisabled = !isSelected && isLimitReached;

                    return (
                      <div 
                        key={hood.name}
                        onClick={() => !isDisabled && toggleNeighborhood(hood.name)}
                        className={`flex items-center gap-3 px-3 py-2 rounded transition-colors 
                          ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}
                          ${isSelected ? 'bg-emerald-50 text-emerald-900' : 'hover:bg-gray-50 text-gray-700'}
                        `}
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 bg-white'}`}>
                          {isSelected && <Check size={12} className="text-white" />}
                        </div>
                        <span className="text-sm font-medium">{hood.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Selected Tags Display */}
            {selectedNeighborhoods.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedNeighborhoods.map(name => (
                  <span key={name} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Duration Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Duration</label>
              <div className="relative">
                <select 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 font-medium hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                >
                  {[4, 6, 8, 10, 12].map(w => (
                    <option key={w} value={w}>{w} Weeks</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                   <ChevronDown size={16} className="text-gray-500" />
                </div>
              </div>
            </div>

            {/* Promotion Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Promotion</label>
              <div className="relative">
                <select 
                  value={promotion}
                  onChange={(e) => setPromotion(e.target.value)}
                  className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 font-medium hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                >
                  <option value="0">No Discount</option>
                  <option value="10">10% Off</option>
                  <option value="15">15% Off</option>
                  <option value="20">20% Off</option>
                  <option value="25">25% Off</option>
                  <option value="30">30% Off</option>
                  <option value="35">35% Off</option>
                  <option value="40">40% Off</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                   <Percent size={16} className="text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Limit Warning */}
          {isLimitReached && (
            <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-3 rounded border border-orange-100">
              <AlertTriangle size={14} />
              <span>Limit reached: Increase unit count to select more neighborhoods.</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 font-bold text-sm hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={selectedNeighborhoods.length === 0}
            className={`px-6 py-2 rounded text-sm font-bold shadow-sm transition-all active:scale-95
               ${selectedNeighborhoods.length === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30'}`}
          >
            Confirm
          </button>
        </div>

      </div>
    </div>
  );
};

export default CampaignSimulatorModal;