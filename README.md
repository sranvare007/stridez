# Stridez - GPS Running Tracker App 🏃‍♂️

A modern, feature-rich running tracker app built with React Native and Expo that uses precise GPS tracking to help you monitor and improve your running performance.

## Features ✨

- **📍 Precise GPS Tracking** - High-accuracy GPS positioning using `BestForNavigation` mode for accurate distance and route tracking
- **⏱️ Real-time Metrics** - Monitor your running metrics in real-time:
  - Distance (kilometers)
  - Duration (time elapsed)
  - Average pace (min/km)
  - Current pace (min/km)
  - Estimated calories burned
- **💾 Local Data Storage** - All running data stored securely in a local SQLite database
- **📊 Run History** - View all your previous runs with detailed statistics
- **⏸️ Pause & Resume** - Pause your run and resume when ready without losing data
- **📈 Statistics Dashboard** - Track your total runs, distance, and time
- **🌓 Dark Mode Support** - Automatic theme switching based on device settings

## Tech Stack 🛠️

- **React Native** 0.81.5
- **Expo** ~54.0
- **TypeScript** ~5.9
- **Expo Router** - File-based routing
- **Expo Location** - GPS tracking with high accuracy
- **Expo SQLite** - Local database for storing runs
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
│   │   ├── run.tsx          # Main running tracker screen
│   │   ├── history.tsx      # Run history screen
│   │   ├── index.tsx        # Home/welcome screen
│   │   └── _layout.tsx      # Tab navigation layout
│   └── _layout.tsx          # Root layout
├── components/              # Reusable UI components
├── database/
│   └── db.ts               # SQLite database schema and queries
├── hooks/
│   └── use-location-tracking.ts  # Custom GPS tracking hook
├── utils/
│   └── runningMetrics.ts   # Calculations for distance, pace, etc.
└── constants/              # App constants and themes
```

## How to Use 📱

### Starting a Run

1. Navigate to the **Run** tab
2. Grant location permissions when prompted
3. Tap **Start Run** to begin GPS tracking
4. Your metrics will update in real-time as you run

### During a Run

- **Pause**: Tap the Pause button to temporarily stop tracking
- **Resume**: Continue your run from where you paused
- **Finish**: Complete your run and save the data

### Viewing History

1. Navigate to the **History** tab
2. View all your previous runs with detailed metrics
3. See overall statistics at the top
4. Long-press any run to delete it
5. Pull down to refresh the list

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

## Future Enhancements 🚀

Potential features for future development:
- Map view showing running route
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
