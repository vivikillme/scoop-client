import { contextBridge, ipcRenderer } from 'electron'

// Types for IPC communication
interface ScoopResult {
  stdout: string
  stderr: string
  code: number
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  checkScoop: (): Promise<boolean> => ipcRenderer.invoke('check-scoop'),

  scoopSearch: (query: string): Promise<ScoopResult> =>
    ipcRenderer.invoke('scoop-search', query),

  scoopInstall: (app: string): Promise<ScoopResult> =>
    ipcRenderer.invoke('scoop-install', app),

  scoopUninstall: (app: string): Promise<ScoopResult> =>
    ipcRenderer.invoke('scoop-uninstall', app),

  scoopList: (): Promise<ScoopResult> => ipcRenderer.invoke('scoop-list'),

  scoopUpdate: (app?: string): Promise<ScoopResult> =>
    ipcRenderer.invoke('scoop-update', app),

  scoopInfo: (app: string): Promise<ScoopResult> =>
    ipcRenderer.invoke('scoop-info', app),

  scoopBucketList: (): Promise<ScoopResult> =>
    ipcRenderer.invoke('scoop-bucket-list'),

  scoopBucketAdd: (name: string, repo?: string): Promise<ScoopResult> =>
    ipcRenderer.invoke('scoop-bucket-add', name, repo),

  scoopBucketRm: (name: string): Promise<ScoopResult> =>
    ipcRenderer.invoke('scoop-bucket-rm', name),

  scoopReset: (app: string): Promise<ScoopResult> =>
    ipcRenderer.invoke('scoop-reset', app),

  scoopCleanup: (app?: string): Promise<ScoopResult> =>
    ipcRenderer.invoke('scoop-cleanup', app),

  openExternal: (url: string): Promise<void> =>
    ipcRenderer.invoke('open-external', url),

  showMessage: (options: {
    type: 'none' | 'info' | 'error' | 'question' | 'warning'
    title: string
    message: string
  }): Promise<{ response: number }> => ipcRenderer.invoke('show-message', options),
})
