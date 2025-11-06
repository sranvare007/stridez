import { Coordinate } from '@/database/db';

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

/**
 * Calculate total distance from array of coordinates
 * Returns distance in meters
 */
export const calculateTotalDistance = (coordinates: Coordinate[]): number => {
  let totalDistance = 0;
  for (let i = 1; i < coordinates.length; i++) {
    totalDistance += calculateDistance(
      coordinates[i - 1].latitude,
      coordinates[i - 1].longitude,
      coordinates[i].latitude,
      coordinates[i].longitude
    );
  }
  return totalDistance;
};

/**
 * Calculate pace in seconds per kilometer
 */
export const calculatePace = (durationSeconds: number, distanceMeters: number): number => {
  if (distanceMeters === 0) return 0;
  const distanceKm = distanceMeters / 1000;
  return durationSeconds / distanceKm;
};

/**
 * Format pace to MM:SS per km
 */
export const formatPace = (paceSecondsPerKm: number): string => {
  if (!paceSecondsPerKm || paceSecondsPerKm === 0) return '--:--';
  const minutes = Math.floor(paceSecondsPerKm / 60);
  const seconds = Math.floor(paceSecondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Format duration to HH:MM:SS
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format distance to km with 2 decimal places
 */
export const formatDistance = (meters: number): string => {
  const km = meters / 1000;
  return km.toFixed(2);
};

/**
 * Estimate calories burned based on distance and average weight
 * Rough estimate: ~60 calories per km for average runner
 */
export const estimateCalories = (distanceMeters: number): number => {
  const distanceKm = distanceMeters / 1000;
  return Math.round(distanceKm * 60);
};

/**
 * Calculate current pace based on recent coordinates
 * Returns pace in seconds per km
 */
export const calculateCurrentPace = (
  coordinates: Coordinate[],
  windowSize: number = 10
): number => {
  if (coordinates.length < 2) return 0;

  // Use last N coordinates for current pace
  const recentCoords = coordinates.slice(-windowSize);
  const distance = calculateTotalDistance(recentCoords);
  const timeElapsed =
    (recentCoords[recentCoords.length - 1].timestamp - recentCoords[0].timestamp) / 1000;

  return calculatePace(timeElapsed, distance);
};

/**
 * Calculate split times (time per km)
 */
export const calculateSplits = (coordinates: Coordinate[]): { km: number; time: number; pace: number }[] => {
  const splits: { km: number; time: number; pace: number }[] = [];
  let currentDistance = 0;
  let splitDistance = 0;
  let splitStartTime = coordinates[0]?.timestamp || 0;
  let kmCount = 1;

  for (let i = 1; i < coordinates.length; i++) {
    const segmentDistance = calculateDistance(
      coordinates[i - 1].latitude,
      coordinates[i - 1].longitude,
      coordinates[i].latitude,
      coordinates[i].longitude
    );

    currentDistance += segmentDistance;
    splitDistance += segmentDistance;

    // Check if we've completed a kilometer
    if (splitDistance >= 1000) {
      const splitTime = (coordinates[i].timestamp - splitStartTime) / 1000;
      const pace = calculatePace(splitTime, 1000);

      splits.push({
        km: kmCount,
        time: splitTime,
        pace: pace,
      });

      kmCount++;
      splitDistance = 0;
      splitStartTime = coordinates[i].timestamp;
    }
  }

  return splits;
};
