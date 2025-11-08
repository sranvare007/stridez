import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { RunMap } from '@/components/run-map';
import { useFocusEffect } from '@react-navigation/native';
import { getAllRuns, deleteRun, getRunStats, Run, Coordinate } from '@/database/db';
import { formatPace, formatDuration, formatDistance } from '@/utils/runningMetrics';
import { format, parseISO } from 'date-fns';
import { router } from 'expo-router';

export default function HistoryScreen() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [stats, setStats] = useState({ totalRuns: 0, totalDistance: 0, totalDuration: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(() => {
    const allRuns = getAllRuns();
    const runStats = getRunStats();
    setRuns(allRuns);
    setStats(runStats);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleDeleteRun = (run: Run) => {
    Alert.alert('Delete Run', `Delete run from ${format(parseISO(run.createdAt), 'MMM dd, yyyy')}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteRun(run.id);
          loadData();
        },
      },
    ]);
  };

  const handleViewRunDetails = (run: Run) => {
    router.push({
      pathname: '/run-details',
      params: {
        id: run.id,
        date: run.date,
        duration: run.duration,
        distance: run.distance,
        averagePace: run.averagePace,
        calories: run.calories || 0,
        route: run.route,
        createdAt: run.createdAt,
      },
    });
  };

  const renderRunItem = ({ item }: { item: Run }) => {
    const runDate = parseISO(item.createdAt);
    const routeCoordinates: Coordinate[] = JSON.parse(item.route);

    return (
      <TouchableOpacity
        style={styles.runCard}
        onPress={() => handleViewRunDetails(item)}
        onLongPress={() => handleDeleteRun(item)}
        activeOpacity={0.7}>
        <View style={styles.runHeader}>
          <View>
            <ThemedText type="defaultSemiBold" style={styles.runDate}>
              {format(runDate, 'EEEE, MMM dd, yyyy')}
            </ThemedText>
            <ThemedText style={styles.runTime}>{format(runDate, 'h:mm a')}</ThemedText>
          </View>
        </View>

        {/* Route Map Preview */}
        {routeCoordinates.length > 0 && (
          <View style={styles.mapPreview}>
            <RunMap
              coordinates={routeCoordinates}
              showCurrentLocationMarker={false}
              followUser={false}
              style={styles.map}
            />
          </View>
        )}

        <View style={styles.runMetrics}>
          <View style={styles.runMetric}>
            <ThemedText style={styles.metricLabel}>Distance</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.metricValue}>
              {formatDistance(item.distance)} km
            </ThemedText>
          </View>

          <View style={styles.runMetric}>
            <ThemedText style={styles.metricLabel}>Duration</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.metricValue}>
              {formatDuration(item.duration)}
            </ThemedText>
          </View>

          <View style={styles.runMetric}>
            <ThemedText style={styles.metricLabel}>Avg Pace</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.metricValue}>
              {formatPace(item.averagePace)}
            </ThemedText>
          </View>
        </View>

        {item.calories && (
          <View style={styles.caloriesContainer}>
            <ThemedText style={styles.caloriesText}>{item.calories} calories burned</ThemedText>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText type="title" style={styles.emptyTitle}>
        No Runs Yet
      </ThemedText>
      <ThemedText style={styles.emptyText}>
        Start tracking your first run to see your history here!
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Stats Header */}
      {runs.length > 0 && (
        <View style={styles.statsContainer}>
          <ThemedText type="title" style={styles.statsTitle}>
            Your Stats
          </ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>{stats.totalRuns}</ThemedText>
              <ThemedText style={styles.statLabel}>Total Runs</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>
                {formatDistance(stats.totalDistance)}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Total km</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statValue}>
                {formatDuration(stats.totalDuration)}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Total Time</ThemedText>
            </View>
          </View>
        </View>
      )}

      {/* Runs List */}
      <View style={styles.listContainer}>
        <ThemedText type="subtitle" style={styles.listTitle}>
          Recent Runs
        </ThemedText>
        <FlatList
          data={runs}
          renderItem={renderRunItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statsTitle: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  listContainer: {
    flex: 1,
    padding: 20,
  },
  listTitle: {
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  runCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  runHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  runDate: {
    fontSize: 16,
    marginBottom: 4,
  },
  runTime: {
    fontSize: 14,
    opacity: 0.6,
  },
  mapPreview: {
    height: 150,
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  runMetrics: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  runMetric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
  },
  caloriesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  caloriesText: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
  },
});
