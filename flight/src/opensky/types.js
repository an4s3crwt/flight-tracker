// Aircraft Map Boundaries
export const IMapGeoBounds = {
  northernLatitude: null,
  easternLongitude: null,
  southernLatitude: null,
  westernLongitude: null,
};

// Aircraft State Vector (current status of a tracked aircraft)
export const IStateVector = {
  icao24: "", // Unique ICAO 24-bit address
  callsign: null, // Callsign of the vehicle (8 chars). Can be null
  origin_country: "", // Country name
  time_position: null, // Unix timestamp (seconds)
  last_contact: 0, // Last update timestamp
  longitude: null, // Longitude in decimal degrees
  latitude: null, // Latitude in decimal degrees
  baro_altitude: null, // Barometric altitude in meters
  on_ground: false, // Boolean indicating if position is from a surface report
  velocity: null, // Velocity over ground in m/s
  true_track: null, // True track in degrees (clockwise from north)
  vertical_rate: null, // Vertical rate in m/s
  sensors: null, // Sensor IDs
  geo_altitude: null, // Geometric altitude
  squawk: null, // Transponder code
  spi: false, // Special purpose indicator
  position_source: 0, // Position source ID
  category: 0, // Aircraft category ID
};

// State Vector Data
export const IStateVectorData = {
  time: 0,
  states: [], // Array of state vectors
};

// Raw State Vector Data
export const IStateVectorRawData = {
  time: 0,
  states: [], // Array of raw state vectors
};

// Aircraft Flight Information
export const IAircraftFlight = {
  icao24: "", // Unique ICAO 24-bit address
  callsign: null, // Callsign (8 chars). Can be null
  firstSeen: 0, // Time of departure
  lastSeen: 0, // Time of arrival
  estDepartureAirport: null, // Estimated departure airport ICAO code
  estArrivalAirport: null, // Estimated arrival airport ICAO code
  estDepartureAirportHorizDistance: 0, // Horizontal distance to departure airport
  estDepartureAirportVertDistance: 0, // Vertical distance to departure airport
  estArrivalAirportHorizDistance: 0, // Horizontal distance to arrival airport
  estArrivalAirportVertDistance: 0, // Vertical distance to arrival airport
  departureAirportCandidatesCount: 0, // Count of possible departure airports
  arrivalAirportCandidatesCount: 0, // Count of possible arrival airports
};

// Aircraft Tracking Info
export const IAircraftTrack = {
  icao24: "", // Unique ICAO 24-bit address
  callsign: null, // Callsign (8 chars). Can be null
  stateVector: IStateVector, // Current state vector of the aircraft
};

// Resolves the position source ID to a readable string
export const resolvePositionSource = (positionSource) => {
  let resolvedPositionSource = "Unknown position source";

  switch (positionSource) {
    case 0:
      resolvedPositionSource = "ADS-B";
      break;
    case 1:
      resolvedPositionSource = "ASTERIX";
      break;
    case 2:
      resolvedPositionSource = "MLAT";
      break;
    case 3:
      resolvedPositionSource = "FLARM";
      break;
    default:
      resolvedPositionSource = "Unknown position source";
      break;
  }

  return resolvedPositionSource;
};

// Resolves the category ID to a readable string
export const resolveCategory = (category) => {
  let resolvedCategory = "Unknown category";

  switch (category) {
    case 0:
      resolvedCategory = "No information at all";
      break;
    case 1:
      resolvedCategory = "No ADS-B Emitter Category Information";
      break;
    case 2:
      resolvedCategory = "Light (< 15500 lbs)";
      break;
    case 3:
      resolvedCategory = "Small (15500 to 75000 lbs)";
      break;
    case 4:
      resolvedCategory = "Large (75000 to 300000 lbs)";
      break;
    case 5:
      resolvedCategory = "High Vortex Large (e.g., B-757)";
      break;
    case 6:
      resolvedCategory = "Heavy (> 300000 lbs)";
      break;
    case 7:
      resolvedCategory = "High Performance (> 5g acceleration and 400 kts)";
      break;
    case 8:
      resolvedCategory = "Rotorcraft";
      break;
    case 9:
      resolvedCategory = "Glider / sailplane";
      break;
    case 10:
      resolvedCategory = "Lighter-than-air";
      break;
    case 11:
      resolvedCategory = "Parachutist / Skydiver";
      break;
    case 12:
      resolvedCategory = "Ultralight / hang-glider / paraglider";
      break;
    case 13:
      resolvedCategory = "Reserved";
      break;
    case 14:
      resolvedCategory = "Unmanned Aerial Vehicle";
      break;
    case 15:
      resolvedCategory = "Space / Trans-atmospheric vehicle";
      break;
    case 16:
      resolvedCategory = "Surface Vehicle – Emergency Vehicle";
      break;
    case 17:
      resolvedCategory = "Surface Vehicle – Service Vehicle";
      break;
    case 18:
      resolvedCategory = "Point Obstacle (includes tethered balloons)";
      break;
    case 19:
      resolvedCategory = "Cluster Obstacle";
      break;
    case 20:
      resolvedCategory = "Line Obstacle";
      break;
    default:
      resolvedCategory = "Unknown category";
      break;
  }

  return resolvedCategory;
};
