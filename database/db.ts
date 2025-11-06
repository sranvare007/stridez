import * as SQLite from 'expo-sqlite';

export interface Run {
  id: number;
  date: string;
  duration: number; // in seconds
  distance: number; // in meters
  averagePace: number; // in seconds per km
  calories?: number;
  route: string; // JSON stringified array of coordinates
  createdAt: string;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
  timestamp: number;
  altitude?: number | null;
  speed?: number | null;
}

const db = SQLite.openDatabaseSync('runs.db');

// Initialize database
export const initDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      duration INTEGER NOT NULL,
      distance REAL NOT NULL,
      averagePace REAL NOT NULL,
      calories INTEGER,
      route TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);
  console.log('Database initialized successfully');
};

// Save a new run
export const saveRun = (run: Omit<Run, 'id'>): number => {
  const result = db.runSync(
    `INSERT INTO runs (date, duration, distance, averagePace, calories, route, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      run.date,
      run.duration,
      run.distance,
      run.averagePace,
      run.calories || null,
      run.route,
      run.createdAt,
    ]
  );
  return result.lastInsertRowId;
};

// Get all runs
export const getAllRuns = (): Run[] => {
  const runs = db.getAllSync<Run>('SELECT * FROM runs ORDER BY createdAt DESC');
  return runs;
};

// Get a single run by ID
export const getRunById = (id: number): Run | null => {
  const run = db.getFirstSync<Run>('SELECT * FROM runs WHERE id = ?', [id]);
  return run || null;
};

// Delete a run
export const deleteRun = (id: number): void => {
  db.runSync('DELETE FROM runs WHERE id = ?', [id]);
};

// Get run statistics
export const getRunStats = () => {
  const stats = db.getFirstSync<{
    totalRuns: number;
    totalDistance: number;
    totalDuration: number;
  }>(`
    SELECT
      COUNT(*) as totalRuns,
      COALESCE(SUM(distance), 0) as totalDistance,
      COALESCE(SUM(duration), 0) as totalDuration
    FROM runs
  `);
  return stats || { totalRuns: 0, totalDistance: 0, totalDuration: 0 };
};

export default db;
