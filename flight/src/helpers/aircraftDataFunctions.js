import { ReactComponent as FlightIcon } from './../resources/flight-24px.svg';
import { ReactComponent as FlightLandIcon } from './../resources/flight_land-24px.svg';
import { ReactComponent as FlightLandFlippedIcon } from './../resources/flight_land-24px_flippedx.svg';
import { ReactComponent as FlightTakeoffIcon } from './../resources/flight_takeoff-24px.svg';
import { ReactComponent as FlightTakeoffFlippedIcon } from './../resources/flight_takeoff-24px_flippedx.svg';

const altitudeStateLimit = 1000;

// Function to format number with a specific amount of decimal places
export const getFormattedValue = (rawValue, maxFractionDigits) => {
  const NumberFormatter = new Intl.NumberFormat('de-CH', { style: 'decimal', useGrouping: false, maximumFractionDigits: maxFractionDigits });
  return NumberFormatter.format(rawValue);
};

// Function to determine the icon name based on the flight's state and altitude
export const getIconName = (isOnGround, verticalRate, altitude, trueTrack) => {
  if (isOnGround) return 'flight-icon';
  if (altitude <= 0) return 'flight-icon';

  if (verticalRate > 0 && altitude < altitudeStateLimit) {
    return trueTrack < 180 ? 'flight-takeoff-icon' : 'flight-takeoff-flipped-icon';
  }

  if (verticalRate < 0 && altitude < altitudeStateLimit) {
    return trueTrack < 180 ? 'flight-land-icon' : 'flight-land-flipped-icon';
  }

  return 'flight-icon';
};

// Function to return the appropriate icon based on the flight's state and altitude
export const getIcon = (isOnGround, verticalRate, altitude) => {
  if (isOnGround) return FlightIcon;
  if (altitude <= 0) return FlightIcon;
  if (verticalRate > 0 && altitude < altitudeStateLimit) return FlightTakeoffIcon;
  if (verticalRate < 0 && altitude < altitudeStateLimit) return FlightLandIcon;
  return FlightIcon;
};

// Function to return the rotation angle for the flight icon based on track and altitude
export const getRotation = (trueTrack, verticalRate, altitude) => {
  if (verticalRate > 0 && altitude < altitudeStateLimit) return 0.0;
  if (verticalRate < 0 && altitude < altitudeStateLimit) return 0.0;
  return trueTrack;
};

// Function to calculate and return the color based on the altitude
export const getColor = (altitude) => {
  let percent = altitude / 13000 * 100;
  percent = Math.max(0, Math.min(100, percent));  // Ensure the percent is between 0 and 100

  let r, g, b = 0;
  if (percent < 50) {
    r = 255;
    g = Math.round(5.1 * percent);
  } else {
    g = 255;
    r = Math.round(510 - 5.10 * percent);
  }

  const colorHex = (r * 0x10000 + g * 0x100 + b).toString(16);
  return '#' + colorHex.padStart(6, '0');  // Ensure the hex string is 6 characters long
};

// Function to return the status text based on the flight's state and altitude
export const getStatusText = (isOnGround, verticalRate, altitude) => {
  if (isOnGround) return 'On Ground';
  if (altitude <= 0) return 'On Ground';
  if (verticalRate > 0 && altitude < altitudeStateLimit) return 'Taking off';
  if (verticalRate < 0 && altitude < altitudeStateLimit) return 'Landing';
  return 'On Track';
};
