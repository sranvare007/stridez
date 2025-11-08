import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { RunMap } from '@/components/run-map';
import { Coordinate } from '@/database/db';
import { formatPace, formatDuration, formatDistance, calculateSplits } from '@/utils/runningMetrics';
import { format, parseISO } from 'date-fns';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function RunDetailsScreen() {
  const params = useLocalSearchParams();

  // Parse the run data from params
  const runData = {
    id: Number(params.id),
    date: params.date as string,
    duration: Number(params.duration),
    distance: Number(params.distance),
    averagePace: Number(params.averagePace),
    calories: params.calories ? Number(params.calories) : undefined,
    route: params.route as string,
    createdAt: params.createdAt as string,
  };

  const routeCoordinates: Coordinate[] = JSON.parse(runData.route);
  const runDate = parseISO(runData.createdAt);
  const splits = calculateSplits(routeCoordinates);

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <ThemedText type="title" style={styles.headerTitle}>
              Run Details
            </ThemedText>
            <ThemedText style={styles.headerDate}>
              {format(runDate, 'EEEE, MMMM dd, yyyy')}
            </ThemedText>
            <ThemedText style={styles.headerTime}>
              {format(runDate, 'h:mm a')}
            </ThemedText>
          </View>
        </View>

        {/* Full Map */}
        {routeCoordinates.length > 0 && (
          <View style={styles.mapContainer}>
            <RunMap
              coordinates={routeCoordinates}
              showCurrentLocationMarker={false}
              followUser={false}
              style={styles.map}
            />
          </View>
        )}

        {/* Main Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statLabel}>Distance</ThemedText>
            <ThemedText type="title" style={styles.statValue}>
              {formatDistance(runData.distance)}
            </ThemedText>
            <ThemedText style={styles.statUnit}>km</ThemedText>
          </View>

          <View style={styles.statCard}>
            <ThemedText style={styles.statLabel}>Duration</ThemedText>
            <ThemedText type="title" style={styles.statValue}>
              {formatDuration(runData.duration)}
            </ThemedText>
            <ThemedText style={styles.statUnit}>time</ThemedText>
          </View>

          <View style={styles.statCard}>
            <ThemedText style={styles.statLabel}>Avg Pace</ThemedText>
            <ThemedText type="title" style={styles.statValue}>
              {formatPace(runData.averagePace)}
            </ThemedText>
            <ThemedText style={styles.statUnit}>min/km</ThemedText>
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.additionalInfo}>
          {runData.calories && (
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Calories Burned</ThemedText>
              <ThemedText style={styles.infoValue}>{runData.calories} kcal</ThemedText>
            </View>
          )}
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>GPS Points</ThemedText>
            <ThemedText style={styles.infoValue}>{routeCoordinates.length}</ThemedText>
          </View>
        </View>

        {/* Splits */}
        {splits.length > 0 && (
          <View style={styles.splitsContainer}>
            <ThemedText type="subtitle" style={styles.splitsTitle}>
              Kilometer Splits
            </ThemedText>
            {splits.map((split, index) => (
              <View key={index} style={styles.splitRow}>
                <View style={styles.splitNumber}>
                  <ThemedText style={styles.splitNumberText}>KM {split.km}</ThemedText>
                </View>
                <View style={styles.splitInfo}>
                  <ThemedText style={styles.splitPace}>
                    {formatPace(split.pace)} min/km
                  </ThemedText>
                  <ThemedText style={styles.splitTime}>
                    Time: {formatDuration(split.time)}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 14,
    opacity: 0.7,
  },
  headerTime: {
    fontSize: 12,
    opacity: 0.5,
  },
  mapContainer: {
    height: 300,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  map: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statUnit: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  additionalInfo: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  splitsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  splitsTitle: {
    marginBottom: 16,
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  splitNumber: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  splitNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  splitInfo: {
    flex: 1,
  },
  splitPace: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  splitTime: {
    fontSize: 12,
    opacity: 0.6,
  },
});
