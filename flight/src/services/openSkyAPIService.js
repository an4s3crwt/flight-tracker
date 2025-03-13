import { Buffer } from 'buffer';
import { Constants, URL } from './../opensky/constants';

const defaultStateInterval = 12000;
const registeredSatetInterval = 6000;
const metadataInterval = 5000;

export class OpenSkyAPIService {
  constructor(userName, password) {
    this.userName = userName;
    this.password = password;
    this.hasCredentials = !!(userName && password);

    this.geoBounds = {
      southernLatitude: Constants.DEFAULT_MIN_LATITUDE,
      northernLatitude: Constants.DEFAULT_MAX_LATITUDE,
      westernLongitude: Constants.DEFAULT_MIN_LONGITUDE,
      easternLongitude: Constants.DEFAULT_MAX_LONGITUDE
    };

    this.trackedAircraft = {
      icao24: '',
      callsign: ''
    };

    this.stateVectorsUpdatedSubscriberDictionary = {};
    this.stateVectorsUpdatedSubscriptionCounter = 0;

    this.aircraftTrackUpdatedSubscriberDictionary = {};
    this.aircraftTrackUpdatedSubscriptionCounter = 0;

    this.isFetchingStateVectors = false;
    this.isFetchingAircraftStateVector = false;
    this.isFetchingAircraftRoute = false;
    this.isFetchingAircraftData = false;
  }

  onStateVectorsUpdated(contextKey, callbackHandler) {
    this.stateVectorsUpdatedSubscriptionCounter++;
    const registerKey = `${contextKey}_${this.stateVectorsUpdatedSubscriptionCounter}`;
    this.stateVectorsUpdatedSubscriberDictionary[registerKey] = callbackHandler;
    return registerKey;
  }

  offStateVectorsUpdated(registerKey) {
    if (this.stateVectorsUpdatedSubscriberDictionary[registerKey]) {
      delete this.stateVectorsUpdatedSubscriberDictionary[registerKey];
      return true;
    }
    return false;
  }

  trackAircraft(icao24) {
    clearInterval(this.fetchAircraftStateIntervalID);
    clearInterval(this.fetchAircraftRouteIntervalID);
    clearInterval(this.fetchAircraftDataIntervalID);

    this.trackedAircraft.icao24 = icao24;
    this.trackedAircraft.callsign = '';

    this.fetchAircraftState();
    this.fetchAircraftStateIntervalID = setInterval(
      () => this.fetchAircraftState(),
      this.hasCredentials ? registeredSatetInterval : defaultStateInterval
    );
  }

  releaseTrack(icao24) {
    clearInterval(this.fetchAircraftStateIntervalID);
    clearInterval(this.fetchAircraftRouteIntervalID);
    clearInterval(this.fetchAircraftDataIntervalID);

    this.trackedAircraft.icao24 = '';
    this.trackedAircraft.callsign = '';
  }

  onAircraftTrackUpdated(contextKey, callbackHandler) {
    this.aircraftTrackUpdatedSubscriptionCounter++;
    const registerKey = `${contextKey}_${this.aircraftTrackUpdatedSubscriptionCounter}`;
    this.aircraftTrackUpdatedSubscriberDictionary[registerKey] = callbackHandler;
    return registerKey;
  }

  offAircraftTrackUpdated(registerKey) {
    if (this.aircraftTrackUpdatedSubscriberDictionary[registerKey]) {
      delete this.aircraftTrackUpdatedSubscriberDictionary[registerKey];
      return true;
    }
    return false;
  }

  async onStarting() {
    if (!this.serviceProvider) {
      return { payload: false, state: 'Error', message: 'No service provider injected.' };
    }

    this.restService = this.serviceProvider.getService('RESTService');
    if (!this.restService) {
      return { payload: false, state: 'Error', message: 'No REST service available.' };
    }

    if (this.hasCredentials) {
      this.restService.setAuthorization(
        `Basic ${Buffer.from(`${this.userName}:${this.password}`).toString('base64')}`
      );
      this.userName = undefined;
      this.password = undefined;
    }

    this.fetchStateVectorsIntervalID = setInterval(
      () => this.fetchStateVectors(),
      this.hasCredentials ? registeredSatetInterval : defaultStateInterval
    );

    return { payload: true, state: 'OK' };
  }

  async onStopping() {
    clearInterval(this.fetchStateVectorsIntervalID);
    clearInterval(this.fetchAircraftStateIntervalID);
    clearInterval(this.fetchAircraftRouteIntervalID);
    clearInterval(this.fetchAircraftDataIntervalID);
    return { payload: true, state: 'OK' };
  }

  mapRawStateVectorData(rawData) {
    const data = { time: rawData.time, states: [] };
    if (!rawData.states) return data;

    rawData.states.forEach((rawStateVector) => {
      data.states.push({
        icao24: rawStateVector[0],
        callsign: rawStateVector[1],
        origin_country: rawStateVector[2],
        time_position: rawStateVector[3],
        last_contact: rawStateVector[4],
        longitude: rawStateVector[5],
        latitude: rawStateVector[6],
        baro_altitude: rawStateVector[7],
        on_ground: rawStateVector[8],
        velocity: rawStateVector[9],
        true_track: rawStateVector[10],
        vertical_rate: rawStateVector[11],
        sensors: rawStateVector[12],
        geo_altitude: rawStateVector[13],
        squawk: rawStateVector[14],
        spi: rawStateVector[15],
        position_source: rawStateVector[16],
        category: rawStateVector[17]
      });
    });

    return data;
  }

  fetchStateVectors() {
    if (!this.restService || this.isFetchingStateVectors) return;

    this.isFetchingStateVectors = true;
    const stateBounds = `?extended=1&lamin=${this.geoBounds.southernLatitude}&lomin=${this.geoBounds.westernLongitude}&lamax=${this.geoBounds.northernLatitude}&lomax=${this.geoBounds.easternLongitude}`;
    const targetURL = `/api/states/all${stateBounds}`;

    this.restService
      .get(targetURL, { mode: 'cors', credentials: this.hasCredentials ? 'include' : 'omit' })
      .then((response) => {
        if (response.payload) {
          const mappedData = this.mapRawStateVectorData(response.payload);
          Object.values(this.stateVectorsUpdatedSubscriberDictionary).forEach((callback) =>
            callback(mappedData)
          );
        }
        this.isFetchingStateVectors = false;
      })
      .finally(() => {
        this.isFetchingStateVectors = false;
      });
  }

  fetchAircraftState() {
    if (!this.restService || this.trackedAircraft.icao24 === '' || this.isFetchingAircraftStateVector)
      return;

    this.isFetchingAircraftStateVector = true;
    const targetURL = `/api/states/all?&icao24=${this.trackedAircraft.icao24}`;

    this.restService
      .get(targetURL, { mode: 'cors', credentials: this.hasCredentials ? 'include' : 'omit' })
      .then((response) => {
        if (response.payload) {
          const mappedData = this.mapRawStateVectorData(response.payload);
          if (mappedData.states.length > 0) {
            this.trackedAircraft.stateVector = mappedData.states[0];
            this.trackedAircraft.callsign = this.trackedAircraft.stateVector.callsign || '';

            Object.values(this.aircraftTrackUpdatedSubscriberDictionary).forEach((callback) =>
              callback(this.trackedAircraft)
            );
          }
        }
        this.isFetchingAircraftStateVector = false;
      })
      .finally(() => {
        this.isFetchingAircraftStateVector = false;
      });
  }
}
