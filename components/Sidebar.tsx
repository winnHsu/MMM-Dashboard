import React from 'react';
import { Unit } from '../types';
import { Copy, MoreVertical } from 'lucide-react';

interface SidebarProps {
  unit: Unit | null;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ unit, isOpen, onClose }) => {
  if (!isOpen || !unit) return null;

  return (
    <div className="absolute top-0 left-0 bottom-0 w-full md:w-96 bg-white shadow-2xl z-[1000] flex flex-col border-r border-gray-200 overflow-hidden transform transition-transform duration-300 ease-in-out">
      
      {/* Sidebar Header */}
      <div className="bg-emerald-400 p-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">GPS (Unit #{unit.id})</h2>
          <div className="text-gray-800 text-sm mt-1 opacity-80 font-medium">
            Live Tracking Active
          </div>
        </div>
        <button className="text-gray-900 hover:bg-emerald-500/20 p-1 rounded transition-colors">
          <MoreVertical size={24} />
        </button>
      </div>

      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
        
        {/* Render mocked history cards to match the screenshot "list" look */}
        {unit.history.map((log, index) => (
          <div key={index} className="bg-gray-900 rounded-lg p-4 text-white shadow-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-emerald-400' : 'bg-yellow-400'}`}></div>
              <span className="font-mono text-sm font-bold">
                {log.timestamp.toISOString().split('T')[0]}T{log.timestamp.toLocaleTimeString('en-US', { hour12: false })}
              </span>
            </div>
            
            <div className="space-y-1 text-sm font-mono text-gray-300 pl-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Lat:</span>
                <span>{log.lat.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Lon:</span>
                <span>{log.lng.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">AvgSpeedKmh:</span>
                <span>{log.speedKmh}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Distance (m):</span>
                <span>{log.distanceTraveledMeters}</span>
              </div>
            </div>
          </div>
        ))}
      
      </div>

      {/* Footer Actions */}
      <div className="bg-white p-4 border-t border-gray-200 flex justify-between items-center gap-4">
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold text-sm px-4 py-2 uppercase tracking-wide transition-colors">
          <Copy size={16} />
          Copy JSON
        </button>
        <button 
          onClick={onClose}
          className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded text-sm font-bold uppercase tracking-wide transition-colors flex items-center gap-2"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default Sidebar;