// Type declarations for Electron preload API

export interface ScoopResult {
  stdout: string
  stderr: string
  code: number
}

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
