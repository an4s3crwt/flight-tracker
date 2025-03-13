// URLs para las API
export const URL = 'https://opensky-network.org/api';
export const routesEndpoint = 'api/routes?callsign={callsign}';
export const aircraftEndpoint = 'api/metadata/aircraft/icao/{icao24}';
export const airportsEndpoint = 'api/airports/?icao={ICAO}';

// Objeto con constantes de latitudes y longitudes
export const Constants = {
  DEFAULT_MIN_LATITUDE: 45.8389,
  DEFAULT_MAX_LATITUDE: 47.8229,
  DEFAULT_MIN_LONGITUDE: 5.9962,
  DEFAULT_MAX_LONGITUDE: 10.5226,
};
