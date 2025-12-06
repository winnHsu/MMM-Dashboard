export enum UnitStatus {
  Outdoor = 'OUTDOOR',
  Indoor = 'INDOOR',
  Selected = 'SELECTED'
}

export interface Unit {
  id: string;
  lat: number;
  lng: number;
  status: UnitStatus;
  zoneId: string;
  speedKmh: number;
  lastUpdate: Date;
  history: UnitHistoryLog[];
  lastDistanceTraveledMeters: number;
  boundPolygon?: [number, number][]; // Optional: Only for simulated units
}

export interface UnitHistoryLog {
  timestamp: Date;
  lat: number;
  lng: number;
  speedKmh: number;
  distanceTraveledMeters: number;
}

export interface MapBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface Neighborhood {
  name: string;
  position: [number, number];
  polygon: [number, number][];
}