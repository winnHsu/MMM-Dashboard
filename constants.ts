import { Unit, UnitStatus, MapBounds, Neighborhood } from './types';

// Polygon representing Manhattan landmass from Canal St to 59th St
// [Lat, Lng]
export const MANHATTAN_POLYGON = [
  [40.7711, -73.9942], // 59th & West Side Hwy
  [40.7570, -74.0075], // 34th & West Side
  [40.7240, -74.0110], // Canal & West Side
  [40.7150, -73.9920], // Canal & Lower East (approx)
  [40.7300, -73.9740], // Stuyvesant Cove
  [40.7430, -73.9710], // 34th & FDR
  [40.7590, -73.9590], // 59th & FDR
];

// Bounds wrapping the polygon for random generation sampling
export const MAP_BOUNDS: MapBounds = {
  minLat: 40.7140, 
  maxLat: 40.7720, 
  minLng: -74.0120, 
  maxLng: -73.9590, 
};

export const ZONE_IDS = [
  'TIMES_SQUARE_CORE',
  'TIMES_SQUARE_N',
  'TIMES_SQUARE_S',
  'HELLS_KITCHEN_E',
  'MIDTOWN_WEST',
  'THEATER_DISTRICT',
  'BRYANT_PARK_NW',
  'SOHO_N',
  'TRIBECA_E',
  'CHELSEA_S',
  'GARMENT_DISTRICT'
];

// Ray-casting algorithm to check if point is in polygon
export const isPointInPolygon = (lat: number, lng: number, polygon: number[][]): boolean => {
  const x = lng, y = lat;
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][1], yi = polygon[i][0];
    const xj = polygon[j][1], yj = polygon[j][0];
    
    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

export const isLocationInManhattan = (lat: number, lng: number): boolean => {
  return isPointInPolygon(lat, lng, MANHATTAN_POLYGON);
};

export const NEIGHBORHOODS: Neighborhood[] = [
  { 
    name: "Hell's Kitchen", 
    position: [40.7638, -73.9918],
    polygon: [[40.7711, -73.9942], [40.7570, -74.0075], [40.7536, -73.9991], [40.7569, -73.9895], [40.7681, -73.9824]] 
  },
  { 
    name: "Times Square", 
    position: [40.7580, -73.9855],
    polygon: [[40.7618, -73.9880], [40.7540, -73.9918], [40.7523, -73.9858], [40.7595, -73.9818]] 
  },
  { 
    name: "Chelsea", 
    position: [40.7465, -74.0014],
    polygon: [[40.7538, -74.0022], [40.7437, -74.0079], [40.7396, -73.9994], [40.7483, -73.9904]]
  },
  { 
    name: "Midtown East", 
    position: [40.7549, -73.9718],
    polygon: [[40.7590, -73.9590], [40.7490, -73.9675], [40.7530, -73.9780], [40.7630, -73.9720]]
  },
  { 
    name: "Midtown West", 
    position: [40.7589, -73.9890],
    polygon: [[40.7700, -73.9820], [40.7550, -73.9950], [40.7480, -73.9880], [40.7600, -73.9750]]
  },
  { 
    name: "Garment District", 
    position: [40.7547, -73.9916],
    polygon: [[40.7570, -73.9960], [40.7490, -73.9990], [40.7470, -73.9880], [40.7540, -73.9850]]
  },
  { 
    name: "Murray Hill", 
    position: [40.7479, -73.9757],
    polygon: [[40.7530, -73.9720], [40.7450, -73.9700], [40.7440, -73.9820], [40.7510, -73.9830]]
  },
  { 
    name: "Columbus Circle", 
    position: [40.7681, -73.9824],
    polygon: [[40.7711, -73.9840], [40.7650, -73.9850], [40.7660, -73.9780], [40.7720, -73.9800]]
  },
  { 
    name: "Hudson Yards", 
    position: [40.7538, -74.0022],
    polygon: [[40.7580, -74.0080], [40.7480, -74.0080], [40.7490, -73.9970], [40.7580, -73.9970]]
  },
  { 
    name: "SoHo", 
    position: [40.7233, -74.0030],
    polygon: [[40.7290, -74.0050], [40.7190, -74.0070], [40.7200, -73.9950], [40.7280, -73.9950]]
  },
  { 
    name: "East Village", 
    position: [40.7265, -73.9815],
    polygon: [[40.7330, -73.9910], [40.7220, -73.9910], [40.7220, -73.9720], [40.7330, -73.9720]]
  },
  { 
    name: "Upper West Side", 
    position: [40.7870, -73.9754], // Center slightly shifted for 59th st limit context
    polygon: [[40.7710, -73.9940], [40.7680, -73.9820], [40.7750, -73.9750], [40.7800, -73.9850]]
  },
  { 
    name: "Upper East Side", 
    position: [40.7736, -73.9566],
    polygon: [[40.7750, -73.9650], [40.7640, -73.9720], [40.7590, -73.9590], [40.7720, -73.9500]]
  },
  { 
    name: "Tribeca", 
    position: [40.7163, -74.0086],
    polygon: [[40.7240, -74.0110], [40.7120, -74.0120], [40.7140, -74.0030], [40.7220, -74.0020]]
  },
  { 
    name: "Financial District", 
    position: [40.7075, -74.0113],
    polygon: [[40.7120, -74.0150], [40.7000, -74.0160], [40.7030, -74.0050], [40.7110, -74.0050]]
  },
  { 
    name: "Greenwich Village", 
    position: [40.7336, -74.0027],
    polygon: [[40.7390, -74.0050], [40.7280, -74.0080], [40.7290, -73.9910], [40.7370, -73.9910]]
  }
];

// Calculate new point given start lat/lng, distance in meters, and bearing in degrees
// Uses Haversine-like formula for destination point on a sphere
export const calculateDestinationPoint = (lat: number, lng: number, distanceMeters: number, bearingDegrees: number): { lat: number, lng: number } => {
  const R = 6378137; // Earth Radius in meters
  const δ = distanceMeters / R; // angular distance
  const θ = bearingDegrees * (Math.PI / 180); // bearing in radians
  const φ1 = lat * (Math.PI / 180);
  const λ1 = lng * (Math.PI / 180);

  const φ2 = Math.asin(Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ));
  const λ2 = λ1 + Math.atan2(Math.sin(θ) * Math.sin(δ) * Math.cos(φ1), Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2));

  return {
    lat: φ2 * (180 / Math.PI),
    lng: λ2 * (180 / Math.PI)
  };
};

// Helper to generate random number in range
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// Helper to find bounds of a polygon for sampling
const getPolygonBounds = (polygon: number[][]): MapBounds => {
  let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
  polygon.forEach(([lat, lng]) => {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  });
  return { minLat, maxLat, minLng, maxLng };
};

// Generate a unit strictly inside a specific polygon
export const generateSimulatedUnit = (index: number, polygon: [number, number][]): Unit => {
  let lat, lng;
  const bounds = getPolygonBounds(polygon);
  
  // Retry until point is inside the specific polygon
  let attempts = 0;
  do {
    lat = randomRange(bounds.minLat, bounds.maxLat);
    lng = randomRange(bounds.minLng, bounds.maxLng);
    attempts++;
  } while (!isPointInPolygon(lat, lng, polygon) && attempts < 100);
  
  // Fallback if sampling fails (rare) - use center of bounds
  if (!isPointInPolygon(lat, lng, polygon)) {
      lat = (bounds.minLat + bounds.maxLat) / 2;
      lng = (bounds.minLng + bounds.maxLng) / 2;
  }

  // 9% Indoor, 91% Outdoor
  const isIndoor = Math.random() < 0.09;
  const status = isIndoor ? UnitStatus.Indoor : UnitStatus.Outdoor;
  const minSpeed = isIndoor ? 1 : 10;
  const maxSpeed = isIndoor ? 10 : 24;
  const currentSpeed = Math.floor(randomRange(minSpeed, maxSpeed));

  return {
    id: `SIM-${index}`,
    lat,
    lng,
    status,
    zoneId: 'SIMULATED_ZONE',
    speedKmh: currentSpeed,
    lastUpdate: new Date(),
    history: [], // No history for fresh simulation
    lastDistanceTraveledMeters: 0,
    boundPolygon: polygon
  };
};

// Helper to generate a random unit inside the global Manhattan polygon
const generateUnit = (index: number): Unit => {
  let lat, lng;
  
  // Keep generating coordinates until inside Manhattan
  do {
    lat = randomRange(MAP_BOUNDS.minLat, MAP_BOUNDS.maxLat);
    lng = randomRange(MAP_BOUNDS.minLng, MAP_BOUNDS.maxLng);
  } while (!isLocationInManhattan(lat, lng));
  
  // 9% Probability for Indoor, 91% for Outdoor
  const isIndoor = Math.random() < 0.09;
  const status = isIndoor ? UnitStatus.Indoor : UnitStatus.Outdoor;

  // Determine speed limits based on status
  const minSpeed = isIndoor ? 1 : 10;
  const maxSpeed = isIndoor ? 10 : 24;

  const currentSpeed = Math.floor(randomRange(minSpeed, maxSpeed));

  // Generate fake history
  const history = Array.from({ length: 4 }).map((_, i) => {
    let hLat, hLng;
    // Try to find a valid history point near the current point
    let attempts = 0;
    do {
        hLat = lat + randomRange(-0.002, 0.002);
        hLng = lng + randomRange(-0.002, 0.002);
        attempts++;
    } while (!isLocationInManhattan(hLat, hLng) && attempts < 5);

    const speed = Math.floor(randomRange(minSpeed, maxSpeed));
    // Approximate distance for history
    const dist = speed * (5 / 3600) * 1000; 

    return {
        timestamp: new Date(Date.now() - i * 10 * 60 * 1000), // 10 mins apart
        lat: hLat,
        lng: hLng,
        speedKmh: speed,
        distanceTraveledMeters: Math.round(dist) // Round to nearest integer
    };
  });

  return {
    id: (10000 + index).toString(),
    lat,
    lng,
    status,
    zoneId: ZONE_IDS[Math.floor(Math.random() * ZONE_IDS.length)],
    speedKmh: currentSpeed,
    lastUpdate: new Date(),
    history,
    lastDistanceTraveledMeters: 0
  };
};

export const generateInitialUnits = (): Unit[] => {
  const units: Unit[] = [];
  
  // Generate 288 Total Units
  for (let i = 0; i < 288; i++) {
    units.push(generateUnit(i));
  }

  return units;
};
