import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Maximize, AlertCircle } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapBoard from './components/MapBoard';
import Legend from './components/Legend';
import CampaignSimulatorModal from './components/CampaignSimulatorModal';
import { 
  generateInitialUnits, 
  isLocationInManhattan, 
  calculateDestinationPoint, 
  NEIGHBORHOODS,
  generateSimulatedUnit,
  isPointInPolygon
} from './constants';
import { Unit, UnitHistoryLog, UnitStatus } from './types';

const App: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>(() => generateInitialUnits());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [liveLogs, setLiveLogs] = useState<UnitHistoryLog[]>([]);
  
  // Simulator UI State
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);
  const [isSimulatorModeActive, setIsSimulatorModeActive] = useState(false);

  // Ref to access the latest units state inside the interval closure
  const unitsRef = useRef(units);

  // Sync ref with state
  useEffect(() => {
    unitsRef.current = units;
  }, [units]);

  // Simulation Loop: Move units every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setUnits(prevUnits => prevUnits.map(unit => {
        // 1. Determine Speed
        const isIndoor = unit.status === UnitStatus.Indoor;
        const minSpeed = isIndoor ? 1 : 10;
        const maxSpeed = isIndoor ? 10 : 24;
        const newSpeed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;

        // 2. Calculate Distance for 5s interval
        const rawDistance = newSpeed * (5 / 3600) * 1000;
        const distanceMeters = Math.round(rawDistance);

        // 3. Choose Random 8-way Direction
        const bearing = Math.floor(Math.random() * 8) * 45;

        // 4. Compute New Coordinates
        const { lat: newLat, lng: newLng } = calculateDestinationPoint(unit.lat, unit.lng, distanceMeters, bearing);

        // 5. Geofence Check
        // If simulator active, check unit's specific boundPolygon. Otherwise check generic Manhattan polygon.
        let finalLat = newLat;
        let finalLng = newLng;
        let validMove = true;

        const isSafe = unit.boundPolygon 
           ? isPointInPolygon(newLat, newLng, unit.boundPolygon)
           : isLocationInManhattan(newLat, newLng);

        if (!isSafe) {
           finalLat = unit.lat;
           finalLng = unit.lng;
           validMove = false;
        }

        return {
          ...unit,
          lat: finalLat,
          lng: finalLng,
          speedKmh: newSpeed,
          lastDistanceTraveledMeters: validMove ? distanceMeters : 0
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Status Update Loop: Every 5 minutes (300,000ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setUnits(prevUnits => prevUnits.map(unit => {
        // 9% Probability for Indoor, 91% for Outdoor
        const isIndoor = Math.random() < 0.09;
        const newStatus = isIndoor ? UnitStatus.Indoor : UnitStatus.Outdoor;

        // If status changes, ensure speed is compliant immediately
        const minSpeed = isIndoor ? 1 : 10;
        const maxSpeed = isIndoor ? 10 : 24;
        
        let newSpeed = unit.speedKmh;
        // If current speed is out of range for the new status, fix it
        if (newSpeed < minSpeed || newSpeed > maxSpeed) {
           newSpeed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
        }

        return {
          ...unit,
          status: newStatus,
          speedKmh: newSpeed
        };
      }));
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Logging Logic for Selected Unit
  useEffect(() => {
    if (!selectedId) return;

    const logCurrentStatus = () => {
      const currentUnit = unitsRef.current.find(u => u.id === selectedId);
      if (currentUnit) {
        const newLog: UnitHistoryLog = {
          timestamp: new Date(),
          lat: currentUnit.lat,
          lng: currentUnit.lng,
          speedKmh: currentUnit.speedKmh,
          distanceTraveledMeters: currentUnit.lastDistanceTraveledMeters
        };
        setLiveLogs(prev => [newLog, ...prev]);
      }
    };

    // Initial log upon selection
    logCurrentStatus();

    // Interval log every 5 seconds
    const logInterval = setInterval(logCurrentStatus, 5000);

    return () => clearInterval(logInterval);
  }, [selectedId]);

  const handleUnitSelect = useCallback((id: string) => {
    setLiveLogs([]);
    setSelectedId(id);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setLiveLogs([]);
    setSelectedId(null);
  }, []);

  const handleOpenSimulator = () => setIsSimulatorModalOpen(true);
  const handleCloseSimulator = () => setIsSimulatorModalOpen(false);
  
  const handleDisableSimulator = () => {
    setIsSimulatorModeActive(false);
    setUnits(generateInitialUnits());
    setSelectedId(null);
    setLiveLogs([]);
  };

  const handleConfirmSimulator = (unitCount: number, selectedNeighborhoods: string[]) => {
    // 1. Calculate units per neighborhood
    if (selectedNeighborhoods.length === 0) return;
    const unitsPerNeighborhood = Math.round(unitCount / selectedNeighborhoods.length);

    const newSimulatedUnits: Unit[] = [];
    let globalIndex = 0;

    // 2. Generate units for each selected neighborhood
    selectedNeighborhoods.forEach(hoodName => {
      const hoodData = NEIGHBORHOODS.find(n => n.name === hoodName);
      if (!hoodData || !hoodData.polygon) return;

      for (let i = 0; i < unitsPerNeighborhood; i++) {
        newSimulatedUnits.push(generateSimulatedUnit(globalIndex++, hoodData.polygon));
      }
    });

    // 3. Deploy units
    setUnits(newSimulatedUnits);
    setSelectedId(null); // Deselect any existing
    setIsSimulatorModeActive(true);
  };

  const selectedUnit = units.find(u => u.id === selectedId) || null;
  const sidebarUnit = selectedUnit ? { ...selectedUnit, history: liveLogs } : null;

  const indoorCount = units.filter(u => u.status === 'INDOOR').length;
  const outdoorCount = units.filter(u => u.status === 'OUTDOOR').length;

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 overflow-hidden">
      <Header 
        onOpenSimulator={handleOpenSimulator} 
        onDisableSimulator={handleDisableSimulator}
        isSimulatorActive={isSimulatorModeActive}
      />
      
      <main className="flex-1 relative flex">
        {/* Sidebar Layer */}
        <Sidebar 
          unit={sidebarUnit} 
          isOpen={!!selectedId} 
          onClose={handleCloseSidebar} 
        />

        {/* Modal Layer */}
        <CampaignSimulatorModal 
          isOpen={isSimulatorModalOpen} 
          onClose={handleCloseSimulator} 
          onConfirm={handleConfirmSimulator}
        />

        {/* Map Container */}
        <div className="flex-1 relative z-0">
            {/* Search & Expand (Hidden in Simulator Mode) */}
            {!isSimulatorModeActive && (
              <>
                <div className="absolute top-4 right-16 z-[400] w-64 md:w-80">
                  <div className="bg-white rounded shadow-lg flex items-center px-4 py-2">
                    <input 
                      type="text" 
                      placeholder="Search Rider" 
                      className="flex-1 bg-transparent border-none outline-none text-gray-700 text-sm"
                    />
                    <Search className="text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <div className="absolute top-4 right-4 z-[400]">
                    <button className="bg-white p-2 rounded shadow-lg hover:bg-gray-50">
                        <Maximize className="w-5 h-5 text-gray-700" />
                    </button>
                </div>
              </>
            )}

            <MapBoard 
                units={units} 
                selectedId={selectedId} 
                onSelectUnit={handleUnitSelect} 
            />

            <Legend indoorCount={indoorCount} outdoorCount={outdoorCount} />
        </div>
      </main>
    </div>
  );
};

export default App;