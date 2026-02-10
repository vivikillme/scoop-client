// Type definitions for ScoopClient

export interface InstalledApp {
  name: string
  version: string
  bucket: string
}

export interface SearchApp {
  name: string
  bucket: string
  version?: string
  description?: string
}

export interface AppInfo {
  name: string
  version: string
  description: string
  homepage: string
  license: string
  bucket: string
  installed?: boolean
}

export interface Bucket {
  name: string
  source: string
  manifests?: number
}

export interface KnownBucket {
  name: string
  source: string
  description?: string
}

export interface ScoopResult {
  stdout: string
  stderr: string
  code: number
}

// Electron API types
declare global {
  interface Window {
    electronAPI: {
      checkScoop: () => Promise<boolean>
      scoopSearch: (query: string) => Promise<ScoopResult>
      scoopInstall: (app: string) => Promise<ScoopResult>
      scoopUninstall: (app: string) => Promise<ScoopResult>
      scoopList: () => Promise<ScoopResult>
      scoopUpdate: (app?: string) => Promise<ScoopResult>
      scoopInfo: (app: string) => Promise<ScoopResult>
      scoopBucketList: () => Promise<ScoopResult>
      scoopBucketAdd: (name: string, repo?: string) => Promise<ScoopResult>
      scoopBucketRm: (name: string) => Promise<ScoopResult>
      scoopReset: (app: string) => Promise<ScoopResult>
      scoopCleanup: (app?: string) => Promise<ScoopResult>
      openExternal: (url: string) => Promise<void>
      showMessage: (options: {
        type: 'none' | 'info' | 'error' | 'question' | 'warning'
        title: string
        message: string
      }) => Promise<{ response: number }>
    }
  }
}

export {}
