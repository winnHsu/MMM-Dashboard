import React from 'react';
import { Play, AlertCircle, Square } from 'lucide-react';

interface HeaderProps {
  onOpenSimulator?: () => void;
  onDisableSimulator?: () => void;
  isSimulatorActive?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onOpenSimulator, onDisableSimulator, isSimulatorActive }) => {
  return (
    <header className="h-16 bg-white flex items-center justify-between px-6 border-b border-gray-200 z-50 relative">
      <div className="flex flex-col">
        <h1 className="text-gray-900 font-bold text-lg leading-tight">MetroMesh Media</h1>
        <div className="flex items-center gap-2">
           <span className="text-gray-500 text-sm font-medium">Tracker</span>
           {isSimulatorActive && (
             <span className="flex items-center gap-1 bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-bold border border-orange-200">
               <AlertCircle size={10} />
               Simulator Mode: Active
             </span>
           )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!isSimulatorActive ? (
          <button 
            onClick={onOpenSimulator}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm font-bold transition-colors flex items-center gap-2"
          >
            <Play size={16} fill="currentColor" />
            Campaign Simulator
          </button>
        ) : (
          <button 
            onClick={onDisableSimulator}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-bold transition-colors flex items-center gap-2"
          >
            <Square size={16} fill="currentColor" />
            Disable Simulator
          </button>
        )}
        <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          Deactivated Units
        </button>
        <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          Data Reports
        </button>
      </div>
    </header>
  );
};

export default Header;