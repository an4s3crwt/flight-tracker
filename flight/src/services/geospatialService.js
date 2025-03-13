import { LogProvider } from "./../../logging";
import destination from "@turf/destination";
import { Service } from "@an4s3crwt/js-react-lib";
import { createResponse, ResponseStateEnumeration } from '@an4s3crwt/js-react-lib';

const earthRadius = 6371008.8;

export class GeospatialService extends Service {
  // Props
  pathPredictionInterval = 100;
  pathPredictionCounter = 0;
  pathPredictionIntervalID = 0;
  pathPredictionUpdatedSubscriberDictionary = {};
  pathPredictionUpdatedSubscriptionCounter = 0;

  constructor() {
    super("GeospatialService");
  }

  restartPathPrediction(stateVectors) {
    clearInterval(this.pathPredictionIntervalID);
    this.pathPredictionCounter = 0;
    this.pathPredictionIntervalID = window.setInterval(
      this.calculatePath.bind(this),
      this.pathPredictionInterval,
      stateVectors
    );
  }

  stopPathPrediction() {
    clearInterval(this.pathPredictionIntervalID);
  }

  onPathPredictionUpdated(contextKey, callbackHandler) {
    // Setup register key
    this.pathPredictionUpdatedSubscriptionCounter++;
    const registerKey = `${contextKey}_${this.pathPredictionUpdatedSubscriptionCounter}`;

    // Register callback
    this.pathPredictionUpdatedSubscriberDictionary[registerKey] =
      callbackHandler;
    this.logger.debug(
      `Component with key '${registerKey}' has subscribed on 'PathPredictionUpdated'.`
    );
    this.logger.debug(
      `'${
        Object.entries(this.pathPredictionUpdatedSubscriberDictionary).length
      }' subscribers on 'PathPredictionUpdated'.`
    );

    return registerKey;
  }

  offPathPredictionUpdated(registerKey) {
    // Delete callback
    const existingSubscriber = Object.entries(
      this.pathPredictionUpdatedSubscriberDictionary
    ).find(([key, value]) => key === registerKey);
    if (existingSubscriber) {
      delete this.pathPredictionUpdatedSubscriberDictionary[registerKey];
      this.logger.debug(
        `Component with key '${registerKey}' has unsubscribed on 'PathPredictionUpdated'.`
      );
      this.logger.debug(
        `'${
          Object.entries(this.pathPredictionUpdatedSubscriberDictionary).length
        }' subscribers on 'PathPredictionUpdated'.`
      );

      return true;
    } else {
      this.logger.error(
        `Component with key '${registerKey}' not registered on 'PathPredictionUpdated'.`
      );
      this.logger.debug(
        `'${
          Object.entries(this.pathPredictionUpdatedSubscriberDictionary).length
        }' subscribers on 'PathPredictionUpdated'.`
      );

      return false;
    }
  }

  async onStarting() {
    try {
      this.logger.info("Starting GeospatialService...");

      // Your logic for starting the service, e.g., initializing resources
      // If everything is fine, return a successful response
      return createResponse(true, ResponseStateEnumeration.OK, []);
    } catch (error) {
      this.logger.error(`Failed to start GeospatialService: ${error.message}`);

      // Return an error response with a descriptive message
      return createResponse(false, ResponseStateEnumeration.Error, [
        new ResponseMessage(
          {
            key: "geospatial_service_start_error",
            value: "Failed to start the service",
          },
          "GeospatialService",
          error.message
        ),
      ]);
    }
  }

  async onStopping() {
    try {
      this.logger.info("Stopping GeospatialService...");
      // Clear the interval if it's running
      clearInterval(this.pathPredictionIntervalID);

      // Add any additional logic for stopping the service if needed
      return createResponse(true, ResponseStateEnumeration.OK, []);
    } catch (error) {
      this.logger.error(`Failed to stop GeospatialService: ${error.message}`);

      // Return an error response with a message indicating failure
      return createResponse(false, ResponseStateEnumeration.Error, [
        new ResponseMessage(
          {
            key: "geospatial_service_stop_error",
            value: "Failed to stop the service",
          },
          "GeospatialService",
          error.message
        ),
      ]);
    }
  }

  calculatePath(stateVectors) {
    const features = [];

    for (const stateVector of stateVectors.states) {
      const lastPositionTime = this.pathPredictionCounter;

      let altitude = stateVector.geo_altitude;
      if (altitude === null || altitude < 0)
        altitude = stateVector.baro_altitude;
      if (altitude === null || altitude < 0) altitude = 0;

      let verticalRate = stateVector.vertical_rate
        ? stateVector.vertical_rate
        : 0.0;
      if (verticalRate < 0) verticalRate *= -1;

      const origin = [
        stateVector.longitude ? stateVector.longitude : 0,
        stateVector.latitude ? stateVector.latitude : 0,
      ];
      const velocity = stateVector.velocity ? stateVector.velocity : 0;

      let distance = (velocity * lastPositionTime) / 1000;

      if (verticalRate !== 0)
        distance = distance - verticalRate * (lastPositionTime / 1000);
      if (altitude > 0)
        distance = (distance * earthRadius) / (earthRadius + altitude);

      const bearing = stateVector.true_track ? stateVector.true_track : 0;

      const feature = destination(origin, distance, bearing, {
        units: "meters",
      });

      const properties = { ["icao24"]: stateVector.icao24 };
      feature.properties = properties;

      features.push(feature);
    }

    this.pathPredictionCounter += this.pathPredictionInterval;

    // Execute callbacks
    Object.entries(this.pathPredictionUpdatedSubscriberDictionary).forEach(
      ([key, value]) => value(features)
    );
  }
}
