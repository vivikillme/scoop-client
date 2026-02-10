// Cache utilities for renderer process using localStorage
// Database operations are handled in main process if needed

import { InstalledApp, SearchApp, Bucket } from './types'

// Cache interface
export interface CacheData {
  installedApps: InstalledApp[]
  buckets: Bucket[]
  lastUpdated: number
}

const CACHE_KEY = 'scoop-client-cache'
const SEARCH_CACHE_PREFIX = 'scoop-search-'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const SEARCH_CACHE_DURATION = 60 * 60 * 1000 // 1 hour

export function getLocalCache(): CacheData | null {
  if (typeof window === 'undefined') return null

  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const data = JSON.parse(cached) as CacheData
      if (Date.now() - data.lastUpdated < CACHE_DURATION) {
        return data
      }
    }
  } catch (e) {
    console.error('Failed to load cache:', e)
  }
  return null
}

export function setLocalCache(data: Omit<CacheData, 'lastUpdated'>): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      ...data,
      lastUpdated: Date.now(),
    }))
  } catch (e) {
    console.error('Failed to save cache:', e)
  }
}

export function clearLocalCache(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CACHE_KEY)
}

// Search cache
export function getCachedSearchResults(query: string): SearchApp[] | null {
  if (typeof window === 'undefined') return null

  try {
    const key = SEARCH_CACHE_PREFIX + query.toLowerCase()
    const cached = localStorage.getItem(key)
    if (cached) {
      const { results, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < SEARCH_CACHE_DURATION) {
        return results
      }
      localStorage.removeItem(key)
    }
  } catch (e) {
    console.error('Failed to load search cache:', e)
  }
  return null
}

export function cacheSearchResults(query: string, results: SearchApp[]): void {
  if (typeof window === 'undefined') return

  try {
    const key = SEARCH_CACHE_PREFIX + query.toLowerCase()
    localStorage.setItem(key, JSON.stringify({
      results,
      timestamp: Date.now(),
    }))
  } catch (e) {
    console.error('Failed to save search cache:', e)
  }
}

export function clearSearchCache(): void {
  if (typeof window === 'undefined') return

  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(SEARCH_CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key))
  } catch (e) {
    console.error('Failed to clear search cache:', e)
  }
}
