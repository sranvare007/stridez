import { Image } from 'expo-image';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#4CAF50', dark: '#2E7D32' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.appTitle}>
          Stridez
        </ThemedText>
        <ThemedText style={styles.subtitle}>Your Personal Running Tracker</ThemedText>
      </ThemedView>

      <ThemedView style={styles.featureContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Features
        </ThemedText>

        <View style={styles.featureItem}>
          <ThemedText style={styles.featureIcon}>📍</ThemedText>
          <View style={styles.featureTextContainer}>
            <ThemedText type="defaultSemiBold">Precise GPS Tracking</ThemedText>
            <ThemedText style={styles.featureDescription}>
              Track your runs with high-accuracy GPS positioning
            </ThemedText>
          </View>
        </View>

        <View style={styles.featureItem}>
          <ThemedText style={styles.featureIcon}>⏱️</ThemedText>
          <View style={styles.featureTextContainer}>
            <ThemedText type="defaultSemiBold">Real-time Metrics</ThemedText>
            <ThemedText style={styles.featureDescription}>
              Monitor distance, pace, duration, and calories in real-time
            </ThemedText>
          </View>
        </View>

        <View style={styles.featureItem}>
          <ThemedText style={styles.featureIcon}>💾</ThemedText>
          <View style={styles.featureTextContainer}>
            <ThemedText type="defaultSemiBold">Local Storage</ThemedText>
            <ThemedText style={styles.featureDescription}>
              All your running data stored securely on your device
            </ThemedText>
          </View>
        </View>

        <View style={styles.featureItem}>
          <ThemedText style={styles.featureIcon}>📊</ThemedText>
          <View style={styles.featureTextContainer}>
            <ThemedText type="defaultSemiBold">Run History</ThemedText>
            <ThemedText style={styles.featureDescription}>
              View and analyze your previous runs and statistics
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      <ThemedView style={styles.ctaContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Get Started
        </ThemedText>
        <ThemedText style={styles.instructions}>
          Tap the Run tab below to start tracking your first run!
        </ThemedText>

        <TouchableOpacity style={styles.startButton} onPress={() => router.push('/(tabs)/run')}>
          <ThemedText style={styles.startButtonText}>Start Running</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 42,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  featureContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  ctaContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  instructions: {
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.7,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
