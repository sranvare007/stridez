import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { Coordinate } from '@/database/db';

export interface LocationTrackingState {
  coordinates: Coordinate[];
  isTracking: boolean;
  error: string | null;
  hasPermission: boolean;
  currentLocation: Coordinate | null;
}

export const useLocationTracking = () => {
  const [state, setState] = useState<LocationTrackingState>({
    coordinates: [],
    isTracking: false,
    error: null,
    hasPermission: false,
    currentLocation: null,
  });

  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  // Request location permissions
  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setState((prev) => ({
          ...prev,
          error: 'Location permission denied',
          hasPermission: false,
        }));
        return false;
      }

      setState((prev) => ({
        ...prev,
        hasPermission: true,
        error: null,
      }));
      return true;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: 'Failed to request location permissions',
        hasPermission: false,
      }));
      return false;
    }
  };

  // Start tracking location
  const startTracking = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      // Clear previous coordinates
      setState((prev) => ({
        ...prev,
        coordinates: [],
        isTracking: true,
        error: null,
      }));

      // Start watching position with high accuracy
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000, // Update every second
          distanceInterval: 5, // Update every 5 meters
        },
        (location) => {
          const coordinate: Coordinate = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: location.timestamp,
            altitude: location.coords.altitude,
            speed: location.coords.speed,
          };

          setState((prev) => ({
            ...prev,
            coordinates: [...prev.coordinates, coordinate],
            currentLocation: coordinate,
          }));
        }
      );
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: 'Failed to start location tracking',
        isTracking: false,
      }));
    }
  };

  // Stop tracking location
  const stopTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }

    setState((prev) => ({
      ...prev,
      isTracking: false,
    }));
  };

  // Pause tracking (keep coordinates but stop updates)
  const pauseTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }

    setState((prev) => ({
      ...prev,
      isTracking: false,
    }));
  };

  // Resume tracking (continue with existing coordinates)
  const resumeTracking = async () => {
    try {
      setState((prev) => ({
        ...prev,
        isTracking: true,
        error: null,
      }));

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 5,
        },
        (location) => {
          const coordinate: Coordinate = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: location.timestamp,
            altitude: location.coords.altitude,
            speed: location.coords.speed,
          };

          setState((prev) => ({
            ...prev,
            coordinates: [...prev.coordinates, coordinate],
            currentLocation: coordinate,
          }));
        }
      );
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: 'Failed to resume location tracking',
        isTracking: false,
      }));
    }
  };

  // Reset tracking (clear all coordinates)
  const resetTracking = () => {
    stopTracking();
    setState((prev) => ({
      ...prev,
      coordinates: [],
      currentLocation: null,
      error: null,
    }));
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  return {
    ...state,
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
    resetTracking,
    requestPermissions,
  };
};
