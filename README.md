# Stridez - GPS Running Tracker App 🏃‍♂️

A modern, feature-rich running tracker app built with React Native and Expo that uses precise GPS tracking to help you monitor and improve your running performance.

## Features ✨

- **📍 Precise GPS Tracking** - High-accuracy GPS positioning using `BestForNavigation` mode for accurate distance and route tracking
- **🗺️ Live Map View** - Real-time map display showing your running route as you go
  - Green polyline highlighting your path
  - Current location marker (blue dot) tracking your position
  - Auto-follow mode keeping you centered on the map
- **⏱️ Real-time Metrics** - Monitor your running metrics in real-time:
  - Distance (kilometers)
  - Duration (time elapsed)
  - Average pace (min/km)
  - Current pace (min/km)
  - Estimated calories burned
- **💾 Local Data Storage** - All running data stored securely in a local SQLite database
- **📊 Run History** - View all your previous runs with detailed statistics
  - Small map preview for each run
  - Tap to view detailed run analysis
- **📉 Kilometer Splits** - See your pace for each kilometer of your run
- **⏸️ Pause & Resume** - Pause your run and resume when ready without losing data
- **📈 Statistics Dashboard** - Track your total runs, distance, and time
- **🗺️ Route Visualization** - View complete route maps for all past runs
- **🌓 Dark Mode Support** - Automatic theme switching based on device settings

## Tech Stack 🛠️

- **React Native** 0.81.5
- **Expo** ~54.0
- **TypeScript** ~5.9
- **Expo Router** - File-based routing
- **Expo Location** - GPS tracking with high accuracy
- **Expo SQLite** - Local database for storing runs
- **React Native Maps** - Interactive map visualization
- **date-fns** - Date formatting and manipulation

## Installation 🚀

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stridez
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `a` for Android emulator or `i` for iOS simulator

## Project Structure 📁

```
stridez/
├── app/
│   ├── (tabs)/
│   │   ├── run.tsx          # Main running tracker screen with live map
│   │   ├── history.tsx      # Run history screen with map previews
│   │   ├── index.tsx        # Home/welcome screen
│   │   └── _layout.tsx      # Tab navigation layout
│   ├── run-details.tsx      # Detailed run view with full map
│   └── _layout.tsx          # Root layout
├── components/
│   ├── run-map.tsx          # Reusable map component for route display
│   └── ...                  # Other UI components
├── database/
│   └── db.ts               # SQLite database schema and queries
├── hooks/
│   └── use-location-tracking.ts  # Custom GPS tracking hook
├── utils/
│   └── runningMetrics.ts   # Calculations for distance, pace, splits
└── constants/              # App constants and themes
```

## How to Use 📱

### Starting a Run

1. Navigate to the **Run** tab
2. Grant location permissions when prompted
3. Tap **Start Run** to begin GPS tracking
4. Watch the map display your route in real-time with a green line
5. Your current location is marked with a blue dot
6. All metrics update live as you run

### During a Run

- **Live Map**: Watch your path being drawn on the map in real-time
- **Auto-Follow**: The map automatically centers on your current location
- **Pause**: Tap the Pause button to temporarily stop tracking (map stays visible)
- **Resume**: Continue your run from where you paused
- **Finish**: Complete your run and save the data

### Viewing History

1. Navigate to the **History** tab
2. View all your previous runs with detailed metrics
3. Each run shows a small map preview of the route
4. **Tap any run** to see full details including:
   - Large interactive map with complete route
   - Kilometer splits showing pace for each km
   - All run statistics and GPS point count
5. Long-press any run to delete it
6. Pull down to refresh the list

## Key Features Explained 🔍

### GPS Tracking

The app uses Expo Location with `BestForNavigation` accuracy setting for precise tracking:
- Updates every 1 second or 5 meters (whichever comes first)
- Captures latitude, longitude, altitude, speed, and timestamp
- Uses the Haversine formula for accurate distance calculations

### Metrics Calculation

- **Distance**: Calculated using GPS coordinates and the Haversine formula
- **Pace**: Duration divided by distance (seconds per kilometer)
- **Current Pace**: Calculated from the last 10 GPS points for real-time feedback
- **Calories**: Estimated at ~60 calories per kilometer
- **Splits**: Automatically calculated for each completed kilometer

### Map Visualization

The app features comprehensive map integration for route visualization:
- **Live Tracking**: Real-time map updates showing your path as you run
- **Route Polyline**: Green line traces your exact route on the map
- **Current Location Marker**: Blue dot with white border shows your current position
- **Auto-Follow Mode**: Map automatically centers and follows you during active runs
- **History Previews**: Small map thumbnails for each run in history
- **Detailed View**: Full-screen interactive maps in run details
- **Fit-to-Bounds**: Automatically zooms to show entire route when viewing past runs
- **Start Marker**: Green pin marks where you started your run

**Map Provider**:
- iOS: Apple Maps (default, no API key needed)
- Android: Google Maps (requires API key for production builds)

### Data Storage

All runs are stored locally using SQLite with the following information:
- Date and time of the run
- Total duration
- Total distance
- Average pace
- Calories burned
- Complete route data (GPS coordinates)

## Permissions 🔐

The app requires the following permissions:

### iOS
- `NSLocationWhenInUseUsageDescription` - Required for GPS tracking during runs

### Android
- `ACCESS_FINE_LOCATION` - Required for precise GPS tracking
- `ACCESS_COARSE_LOCATION` - Required for general location access

## Development Notes 💻

### Database Schema

```sql
CREATE TABLE runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  duration INTEGER NOT NULL,
  distance REAL NOT NULL,
  averagePace REAL NOT NULL,
  calories INTEGER,
  route TEXT NOT NULL,
  createdAt TEXT NOT NULL
);
```

### Custom Hooks

- `useLocationTracking()` - Manages GPS tracking state and permissions
- `useColorScheme()` - Handles theme switching
- `useThemeColor()` - Provides theme-aware colors

### Google Maps Configuration

For **Android production builds**, you need to add your Google Maps API key:

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Maps SDK for Android
3. Update `app.json`:
   ```json
   "android": {
     "config": {
       "googleMaps": {
         "apiKey": "YOUR_API_KEY_HERE"
       }
     }
   }
   ```

**Note**: The placeholder key in `app.json` works for development with Expo Go. For iOS, Apple Maps is used by default and doesn't require configuration.

## Future Enhancements 🚀

Potential features for future development:
- ✅ ~~Map view showing running route~~ (Implemented!)
- Route replay animation
- Goal setting and achievements
- Weekly/monthly statistics
- Export runs to GPX/TCX format
- Social sharing features
- Audio feedback during runs
- Interval training support

## Contributing 🤝

This project was built with assistance from Claude AI. All commits are clearly marked with "Commit by Claude AI Assistant" for transparency.

## License 📄

Private project - All rights reserved

## Acknowledgments 🙏

Built with:
- [Expo](https://expo.dev)
- [React Native](https://reactnative.dev)
- [TypeScript](https://www.typescriptlang.org)

---

**Created by Claude AI Assistant** 🤖
