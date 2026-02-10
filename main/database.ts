// SQLite database module for main process (optional caching)
// This module is not required for basic functionality

import Database from 'better-sqlite3'
import * as path from 'path'
import { app } from 'electron'
import { InstalledApp, SearchApp, Bucket } from './types'

let db: Database.Database | null = null

export function getDbPath(): string {
  const userDataPath = app.getPath('userData')
  return path.join(userDataPath, 'scoop-client.db')
}

export function initDatabase(): void {
  try {
    const dbPath = getDbPath()
    db = new Database(dbPath)

    // Create tables
    db.exec(`
      CREATE TABLE IF NOT EXISTS installed_apps (
        name TEXT PRIMARY KEY,
        version TEXT,
        bucket TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS search_cache (
        query TEXT PRIMARY KEY,
        results TEXT,
        cached_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS buckets (
        name TEXT PRIMARY KEY,
        source TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)

    console.log('Database initialized at:', dbPath)
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
}

export function closeDatabase(): void {
  if (db) {
    db.close()
    db = null
  }
}

// Installed Apps
export function saveInstalledApps(apps: InstalledApp[]): void {
  if (!db) return

  try {
    const insert = db.prepare(`
      INSERT OR REPLACE INTO installed_apps (name, version, bucket, updated_at)
      VALUES (@name, @version, @bucket, CURRENT_TIMESTAMP)
    `)

    const appNames = apps.map(a => a.name)
    const deletePlaceholder = appNames.length > 0 ? appNames.map(() => '?').join(',') : 'NULL'
    const deleteOld = db.prepare(`DELETE FROM installed_apps WHERE name NOT IN (${deletePlaceholder})`)

    const transaction = db.transaction(() => {
      // Insert/update current apps
      for (const app of apps) {
        insert.run(app)
      }
      // Delete apps no longer installed
      if (apps.length > 0) {
        deleteOld.run(...appNames)
      } else {
        db!.exec('DELETE FROM installed_apps')
      }
    })

    transaction()
  } catch (error) {
    console.error('Failed to save installed apps:', error)
  }
}

export function getInstalledApps(): InstalledApp[] {
  if (!db) return []

  try {
    const rows = db.prepare('SELECT name, version, bucket FROM installed_apps').all() as any[]
    return rows.map(row => ({
      name: row.name,
      version: row.version,
      bucket: row.bucket,
    }))
  } catch (error) {
    console.error('Failed to get installed apps:', error)
    return []
  }
}

// Search Cache
export function cacheSearchResults(query: string, results: SearchApp[]): void {
  if (!db) return

  try {
    const insert = db.prepare(`
      INSERT OR REPLACE INTO search_cache (query, results, cached_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `)

    insert.run(query, JSON.stringify(results))
  } catch (error) {
    console.error('Failed to cache search results:', error)
  }
}

export function getCachedSearchResults(query: string): SearchApp[] | null {
  if (!db) return null

  try {
    const row = db.prepare(`
      SELECT results FROM search_cache
      WHERE query = ? AND cached_at > datetime('now', '-1 hour')
    `).get(query) as any

    if (row) {
      return JSON.parse(row.results)
    }
  } catch (error) {
    console.error('Failed to get cached search results:', error)
  }
  return null
}

// Buckets
export function saveBuckets(buckets: Bucket[]): void {
  if (!db) return

  try {
    const insert = db.prepare(`
      INSERT OR REPLACE INTO buckets (name, source, updated_at)
      VALUES (@name, @source, CURRENT_TIMESTAMP)
    `)

    const bucketNames = buckets.map(b => b.name)
    const deletePlaceholder = bucketNames.length > 0 ? bucketNames.map(() => '?').join(',') : 'NULL'
    const deleteOld = db.prepare(`DELETE FROM buckets WHERE name NOT IN (${deletePlaceholder})`)

    const transaction = db.transaction(() => {
      for (const bucket of buckets) {
        insert.run(bucket)
      }
      if (buckets.length > 0) {
        deleteOld.run(...bucketNames)
      } else {
        db!.exec('DELETE FROM buckets')
      }
    })

    transaction()
  } catch (error) {
    console.error('Failed to save buckets:', error)
  }
}

export function getCachedBuckets(): Bucket[] {
  if (!db) return []

  try {
    const rows = db.prepare('SELECT name, source FROM buckets').all() as any[]
    return rows.map(row => ({
      name: row.name,
      source: row.source,
    }))
  } catch (error) {
    console.error('Failed to get cached buckets:', error)
    return []
  }
}
