import React from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { Unit, UnitStatus, Neighborhood } from '../types';
import { NEIGHBORHOODS } from '../constants';

// Fix for default Leaflet icons in React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapBoardProps {
  units: Unit[];
  selectedId: string | null;
  onSelectUnit: (id: string) => void;
}

// Custom hook to create div icons dynamically based on status and selection
const useUnitIcon = (status: UnitStatus, isSelected: boolean) => {
  // Determine color based on status
  let bgColor = 'bg-emerald-500'; // Default Outdoor
  if (status === UnitStatus.Indoor) bgColor = 'bg-yellow-400';
  if (isSelected) bgColor = 'bg-orange-500';

  // Make selected icon slightly larger and pulse
  const sizeClass = isSelected ? 'w-5 h-5 ring-4 ring-orange-500/30' : 'w-4 h-4';
  const pulseClass = isSelected ? 'animate-pulse' : '';
  const zIndex = isSelected ? 'z-50' : 'z-10';

  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="${bgColor} ${sizeClass} ${pulseClass} rounded-full border-2 border-white shadow-md relative ${zIndex}"></div>`,
    iconSize: isSelected ? [24, 24] : [16, 16],
    iconAnchor: isSelected ? [12, 12] : [8, 8],
  });
};

const UnitMarker: React.FC<{ unit: Unit; isSelected: boolean; onSelect: (id: string) => void }> = ({ unit, isSelected, onSelect }) => {
  const icon = useUnitIcon(unit.status, isSelected);

  return (
    <Marker 
      position={[unit.lat, unit.lng]} 
      icon={icon}
      eventHandlers={{
        click: () => onSelect(unit.id),
      }}
    />
  );
};

const NeighborhoodLabel: React.FC<Neighborhood> = ({ name, position }) => {
  const icon = L.divIcon({
    className: 'neighborhood-label',
    html: `<div class="text-white/60 text-xs font-bold uppercase tracking-wider whitespace-nowrap drop-shadow-md text-center" style="transform: translate(-50%, -50%);">${name}</div>`,
    iconSize: [100, 20],
    iconAnchor: [50, 10]
  });

  return <Marker position={position} icon={icon} interactive={false} />;
};

const MapBoard: React.FC<MapBoardProps> = ({ units, selectedId, onSelectUnit }) => {
  const centerPosition: [number, number] = [40.7580, -73.9855]; // Times Square

  return (
    <MapContainer 
      center={centerPosition} 
      zoom={16} 
      scrollWheelZoom={true} 
      zoomControl={false}
      className="h-full w-full bg-gray-900"
    >
      {/* Dark Matter Tiles for that sleek night look */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {/* Custom Zoom Control Position */}
      <ZoomControl position="topright" />

      {/* Render Neighborhood Labels */}
      {NEIGHBORHOODS.map((hood) => (
        <NeighborhoodLabel key={hood.name} {...hood} />
      ))}

      {units.map((unit) => (
        <UnitMarker 
          key={unit.id} 
          unit={unit} 
          isSelected={selectedId === unit.id} 
          onSelect={onSelectUnit} 
        />
      ))}
      
    </MapContainer>
  );
};

export default MapBoard;
