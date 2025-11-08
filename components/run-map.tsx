import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Coordinate } from '@/database/db';

interface RunMapProps {
  coordinates: Coordinate[];
  currentLocation?: Coordinate | null;
  showCurrentLocationMarker?: boolean;
  followUser?: boolean;
  style?: any;
}

export function RunMap({
  coordinates,
  currentLocation,
  showCurrentLocationMarker = true,
  followUser = true,
  style,
}: RunMapProps) {
  const mapRef = useRef<MapView>(null);

  // Follow user's current location
  useEffect(() => {
    if (followUser && currentLocation && mapRef.current) {
      mapRef.current.animateCamera(
        {
          center: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          },
          zoom: 16,
        },
        { duration: 1000 }
      );
    }
  }, [currentLocation, followUser]);

  // Fit to show entire route when coordinates change
  useEffect(() => {
    if (coordinates.length > 1 && mapRef.current && !followUser) {
      mapRef.current.fitToCoordinates(
        coordinates.map((coord) => ({
          latitude: coord.latitude,
          longitude: coord.longitude,
        })),
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      );
    }
  }, [coordinates, followUser]);

  // Initial region
  const initialRegion = currentLocation
    ? {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : coordinates.length > 0
    ? {
        latitude: coordinates[0].latitude,
        longitude: coordinates[0].longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        loadingEnabled={true}
        mapType="standard">
        {/* Route Polyline */}
        {coordinates.length > 1 && (
          <Polyline
            coordinates={coordinates.map((coord) => ({
              latitude: coord.latitude,
              longitude: coord.longitude,
            }))}
            strokeColor="#4CAF50"
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* Start Point Marker */}
        {coordinates.length > 0 && (
          <Marker
            coordinate={{
              latitude: coordinates[0].latitude,
              longitude: coordinates[0].longitude,
            }}
            title="Start"
            pinColor="#4CAF50"
          />
        )}

        {/* Current Location Marker */}
        {showCurrentLocationMarker && currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Current Location"
            pinColor="#2196F3">
            <View style={styles.currentLocationMarker}>
              <View style={styles.currentLocationDot} />
            </View>
          </Marker>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  currentLocationMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2196F3',
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  currentLocationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
});
