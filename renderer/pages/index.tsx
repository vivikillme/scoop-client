import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import AppList from '../components/AppList'
import { InstalledApp, AppStatus } from '../lib/types'
import { ToastContainer } from '../components/Toast'
import { useToast } from '../hooks/useToast'
import { cn } from '../lib/utils'

export default function Home() {
  const [isScoopInstalled, setIsScoopInstalled] = useState<boolean | null>(null)
  const [apps, setApps] = useState<InstalledApp[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingUpdates, setCheckingUpdates] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [updatingApp, setUpdatingApp] = useState<string | null>(null)
  const { toasts, closeToast, success, error } = useToast()

  useEffect(() => {
    checkScoop()
  }, [])

  const checkScoop = async () => {
    if (!window.electronAPI) {
      console.error('electronAPI not available - preload script may not have loaded')
      setLoading(false)
      return
    }
    const installed = await window.electronAPI.checkScoop()
    setIsScoopInstalled(installed)
    if (installed) {
      loadInstalledAppsFromCache()
    } else {
      setLoading(false)
    }
  }

  // Load apps from cache first, then optionally refresh
  const loadInstalledAppsFromCache = async () => {
    try {
      // Try to load from sessionStorage first
      const cached = sessionStorage.getItem('scoop-apps')
      if (cached) {
        const cachedApps = JSON.parse(cached) as InstalledApp[]
        setApps(cachedApps)
        setLoading(false)
        // Check for updates in background
        checkForUpdates(cachedApps)
      } else {
        // No cache, load fresh data
        await loadInstalledApps()
      }
    } catch (error) {
      console.error('Failed to load from cache:', error)
      await loadInstalledApps()
    }
  }

  const loadInstalledApps = async (silent = false): Promise<InstalledApp[]> => {
    if (!silent) {
      setLoading(true)
    }
    try {
      const result = await window.electronAPI.scoopList()
      if (result.code === 0 && result.stdout) {
        const parsedApps = parseScoopList(result.stdout)
        setApps(parsedApps)
        // Save to sessionStorage
        sessionStorage.setItem('scoop-apps', JSON.stringify(parsedApps))
        return parsedApps
      }
    } catch (error) {
      console.error('Failed to load apps:', error)
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
    return []
  }

  const checkForUpdates = async (currentApps: InstalledApp[]) => {
    setCheckingUpdates(true)
    try {
      const result = await window.electronAPI.scoopStatus()
      if (result.code === 0 && result.stdout) {
        const statusMap = parseScoopStatus(result.stdout)
        // Merge status info with apps
        const updatedApps = currentApps.map(app => {
          const status = statusMap.get(app.name.toLowerCase())
          if (status) {
            return {
              ...app,
              latestVersion: status.latestVersion,
              needsUpdate: status.needsUpdate,
            }
          }
          return app
        })
        setApps(updatedApps)
        // Update sessionStorage
        sessionStorage.setItem('scoop-apps', JSON.stringify(updatedApps))
      }
    } catch (error) {
      console.error('Failed to check for updates:', error)
    } finally {
      setCheckingUpdates(false)
    }
  }

  const parseScoopList = (output: string): InstalledApp[] => {
    const lines = output.trim().split('\n')
    const apps: InstalledApp[] = []

    // Skip header lines
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.startsWith('---') || line === '' || line.toLowerCase().includes('installed apps')) {
        continue
      }

      // Parse app line: "  name version bucket"
      const match = line.match(/^\s*(\S+)\s+(\S+)\s+(\S+)/)
      if (match) {
        apps.push({
          name: match[1],
          version: match[2],
          bucket: match[3],
        })
      }
    }

    return apps
  }

  const parseScoopStatus = (output: string): Map<string, AppStatus> => {
    const statusMap = new Map<string, AppStatus>()
    const lines = output.trim().split('\n')

    for (const line of lines) {
      const trimmed = line.trim()
      // Skip header and separator lines
      if (!trimmed ||
          trimmed.startsWith('---') ||
          trimmed.toLowerCase().includes('name') ||
          trimmed.toLowerCase().includes('current')) {
        continue
      }

      // Parse: "name current_version latest_version ..."
      const parts = trimmed.split(/\s+/)
      if (parts.length >= 3) {
        const name = parts[0]
        const currentVersion = parts[1]
        const latestVersion = parts[2]
        statusMap.set(name.toLowerCase(), {
          name,
          currentVersion,
          latestVersion,
          needsUpdate: currentVersion !== latestVersion,
        })
      }
    }

    return statusMap
  }

  const handleUninstall = async (appName: string) => {
    const result = await window.electronAPI.scoopUninstall(appName)
    if (result.code === 0) {
      // Remove app from list instead of reloading
      const updatedApps = apps.filter(app => app.name !== appName)
      setApps(updatedApps)
      // Update sessionStorage
      sessionStorage.setItem('scoop-apps', JSON.stringify(updatedApps))
      success('Uninstall Complete', `${appName} has been uninstalled successfully.`)
    } else {
      error('Uninstall Failed', result.stderr || 'Failed to uninstall ' + appName)
    }
  }

  const handleUpdate = async (appName?: string) => {
    if (appName) {
      setUpdatingApp(appName)
    } else {
      setUpdating(true)
    }
    try {
      const result = await window.electronAPI.scoopUpdate(appName)
      if (result.code === 0) {
        if (appName) {
          // Single app update - just update that app's status
          const updatedApps = apps.map(app => {
            if (app.name === appName) {
              return {
                ...app,
                version: app.latestVersion || app.version,
                latestVersion: app.latestVersion,
                needsUpdate: false,
              }
            }
            return app
          })
          setApps(updatedApps)
          // Update sessionStorage
          sessionStorage.setItem('scoop-apps', JSON.stringify(updatedApps))
        } else {
          // Update all - reload the list
          const loadedApps = await loadInstalledApps(true)
          if (loadedApps.length > 0) {
            checkForUpdates(loadedApps)
          }
        }
        success('Update Complete', appName ? `${appName} has been updated.` : 'All apps have been updated.')
      } else {
        error('Update Failed', result.stderr || 'Failed to update.')
      }
    } finally {
      if (appName) {
        setUpdatingApp(null)
      } else {
        setUpdating(false)
      }
    }
  }

  const handleRefresh = async () => {
    // Force reload from scoop, not from cache
    const loadedApps = await loadInstalledApps(false)
    if (loadedApps.length > 0) {
      checkForUpdates(loadedApps)
    }
  }

  if (isScoopInstalled === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Checking Scoop installation...</p>
        </div>
      </div>
    )
  }

  if (!isScoopInstalled) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-4">Scoop Not Found</h1>
          <p className="text-muted-foreground mb-6">
            ScoopClient requires Scoop to be installed on your system.
            Please install Scoop first and then restart ScoopClient.
          </p>
          <button
            onClick={() => window.electronAPI.openExternal('https://scoop.sh')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
          >
            Visit scoop.sh
          </button>
        </div>
      </div>
    )
  }

  const appsNeedingUpdate = apps.filter(app => app.needsUpdate).length

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Installed Apps</h1>
              {checkingUpdates && (
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                  Checking for updates...
                </span>
              )}
              {appsNeedingUpdate > 0 && !checkingUpdates && (
                <span className="text-sm px-2 py-0.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded">
                  {appsNeedingUpdate} update(s) available
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="px-3 py-2 border border-border text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
              >
                Refresh
              </button>
              {appsNeedingUpdate > 0 && (
                <button
                  onClick={() => handleUpdate()}
                  disabled={updating}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-md transition-colors',
                    updating
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:opacity-90'
                  )}
                >
                  {updating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update All'
                  )}
                </button>
              )}
            </div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <AppList apps={apps} onUninstall={handleUninstall} onUpdate={handleUpdate} updatingApp={updatingApp} />
          )}
        </div>
      </main>
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </div>
  )
}
