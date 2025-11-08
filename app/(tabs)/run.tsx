import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { RunMap } from '@/components/run-map';
import { useLocationTracking } from '@/hooks/use-location-tracking';
import {
  calculateTotalDistance,
  calculatePace,
  formatPace,
  formatDuration,
  formatDistance,
  estimateCalories,
  calculateCurrentPace,
} from '@/utils/runningMetrics';
import { initDatabase, saveRun } from '@/database/db';
import { format } from 'date-fns';
import { router } from 'expo-router';

export default function RunTrackerScreen() {
  const {
    coordinates,
    isTracking,
    hasPermission,
    error,
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
    resetTracking,
    requestPermissions,
  } = useLocationTracking();

  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedTime, setPausedTime] = useState(0);

  // Initialize database on mount
  useEffect(() => {
    initDatabase();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTracking && !isPaused && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime - pausedTime);
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, isPaused, startTime, pausedTime]);

  // Calculate metrics
  const distance = calculateTotalDistance(coordinates);
  const pace = calculatePace(elapsedTime / 1000, distance);
  const currentPace = calculateCurrentPace(coordinates);
  const calories = estimateCalories(distance);

  const handleStart = async () => {
    await startTracking();
    setStartTime(Date.now());
    setElapsedTime(0);
    setPausedTime(0);
    setIsPaused(false);
  };

  const handlePause = () => {
    pauseTracking();
    setIsPaused(true);
    setPausedTime((prev) => prev + (Date.now() - (startTime || 0) - elapsedTime));
  };

  const handleResume = async () => {
    await resumeTracking();
    setIsPaused(false);
  };

  const handleStop = () => {
    Alert.alert(
      'Save Run?',
      `Distance: ${formatDistance(distance)} km\nDuration: ${formatDuration(elapsedTime / 1000)}`,
      [
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            stopTracking();
            resetTracking();
            setStartTime(null);
            setElapsedTime(0);
            setPausedTime(0);
            setIsPaused(false);
          },
        },
        {
          text: 'Save',
          onPress: () => {
            saveRunData();
          },
        },
      ]
    );
  };

  const saveRunData = () => {
    if (coordinates.length < 2) {
      Alert.alert('Error', 'Not enough data to save this run');
      return;
    }

    try {
      const runData = {
        date: format(new Date(), 'yyyy-MM-dd'),
        duration: Math.floor(elapsedTime / 1000),
        distance: distance,
        averagePace: pace,
        calories: calories,
        route: JSON.stringify(coordinates),
        createdAt: new Date().toISOString(),
      };

      saveRun(runData);

      Alert.alert('Success', 'Run saved successfully!', [
        {
          text: 'View History',
          onPress: () => router.push('/(tabs)/history'),
        },
        {
          text: 'OK',
          onPress: () => {
            stopTracking();
            resetTracking();
            setStartTime(null);
            setElapsedTime(0);
            setPausedTime(0);
            setIsPaused(false);
          },
        },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to save run');
      console.error('Failed to save run:', err);
    }
  };

  const handleRequestPermissions = async () => {
    await requestPermissions();
  };

  // Permission screen
  if (!hasPermission) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.permissionContainer}>
          <ThemedText type="title" style={styles.permissionTitle}>
            Location Permission Required
          </ThemedText>
          <ThemedText style={styles.permissionText}>
            This app needs access to your location to track your runs with GPS.
          </ThemedText>
          <TouchableOpacity style={styles.permissionButton} onPress={handleRequestPermissions}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title">Run Tracker</ThemedText>
          {isTracking && (
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{isPaused ? 'Paused' : 'Tracking'}</Text>
            </View>
          )}
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Map View */}
        {(isTracking || coordinates.length > 0) && (
          <View style={styles.mapContainer}>
            <RunMap
              coordinates={coordinates}
              currentLocation={coordinates[coordinates.length - 1] || null}
              showCurrentLocationMarker={isTracking}
              followUser={isTracking && !isPaused}
              style={styles.map}
            />
          </View>
        )}

        {/* Main Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <ThemedText style={styles.metricLabel}>Distance</ThemedText>
            <ThemedText type="title" style={styles.metricValue}>
              {formatDistance(distance)}
            </ThemedText>
            <ThemedText style={styles.metricUnit}>km</ThemedText>
          </View>

          <View style={styles.metricCard}>
            <ThemedText style={styles.metricLabel}>Duration</ThemedText>
            <ThemedText type="title" style={styles.metricValue}>
              {formatDuration(elapsedTime / 1000)}
            </ThemedText>
            <ThemedText style={styles.metricUnit}>time</ThemedText>
          </View>
        </View>

        {/* Secondary Metrics */}
        <View style={styles.secondaryMetrics}>
          <View style={styles.secondaryMetricCard}>
            <ThemedText style={styles.secondaryLabel}>Avg Pace</ThemedText>
            <ThemedText style={styles.secondaryValue}>{formatPace(pace)}</ThemedText>
            <ThemedText style={styles.secondaryUnit}>min/km</ThemedText>
          </View>

          <View style={styles.secondaryMetricCard}>
            <ThemedText style={styles.secondaryLabel}>Current Pace</ThemedText>
            <ThemedText style={styles.secondaryValue}>{formatPace(currentPace)}</ThemedText>
            <ThemedText style={styles.secondaryUnit}>min/km</ThemedText>
          </View>

          <View style={styles.secondaryMetricCard}>
            <ThemedText style={styles.secondaryLabel}>Calories</ThemedText>
            <ThemedText style={styles.secondaryValue}>{calories}</ThemedText>
            <ThemedText style={styles.secondaryUnit}>kcal</ThemedText>
          </View>
        </View>

        {/* GPS Status */}
        <View style={styles.gpsStatus}>
          <ThemedText style={styles.gpsStatusText}>
            GPS Points: {coordinates.length}
          </ThemedText>
          {isTracking && !isPaused && (
            <ActivityIndicator size="small" color="#4CAF50" style={styles.gpsIndicator} />
          )}
        </View>

        {/* Control Buttons */}
        <View style={styles.controlsContainer}>
          {!isTracking && !isPaused && (
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>Start Run</Text>
            </TouchableOpacity>
          )}

          {isTracking && !isPaused && (
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
                <Text style={styles.pauseButtonText}>Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
                <Text style={styles.stopButtonText}>Finish</Text>
              </TouchableOpacity>
            </View>
          )}

          {isPaused && (
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.resumeButton} onPress={handleResume}>
                <Text style={styles.resumeButtonText}>Resume</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
                <Text style={styles.stopButtonText}>Finish</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
  mapContainer: {
    height: 250,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  map: {
    flex: 1,
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  metricValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  metricUnit: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.7,
  },
  secondaryMetrics: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  secondaryMetricCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryLabel: {
    fontSize: 12,
    marginBottom: 6,
    opacity: 0.7,
  },
  secondaryValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  secondaryUnit: {
    fontSize: 10,
    marginTop: 2,
    opacity: 0.6,
  },
  gpsStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  gpsStatusText: {
    fontSize: 12,
    opacity: 0.6,
  },
  gpsIndicator: {
    marginLeft: 8,
  },
  controlsContainer: {
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pauseButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  pauseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resumeButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  resumeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stopButton: {
    flex: 1,
    backgroundColor: '#f44336',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
