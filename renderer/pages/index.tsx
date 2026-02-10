import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import AppList from '../components/AppList'
import { InstalledApp } from '../lib/types'

export default function Home() {
  const [isScoopInstalled, setIsScoopInstalled] = useState<boolean | null>(null)
  const [apps, setApps] = useState<InstalledApp[]>([])
  const [loading, setLoading] = useState(true)

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
      loadInstalledApps()
    } else {
      setLoading(false)
    }
  }

  const loadInstalledApps = async () => {
    setLoading(true)
    try {
      const result = await window.electronAPI.scoopList()
      if (result.code === 0 && result.stdout) {
        const parsedApps = parseScoopList(result.stdout)
        setApps(parsedApps)
      }
    } catch (error) {
      console.error('Failed to load apps:', error)
    } finally {
      setLoading(false)
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

  const handleUninstall = async (appName: string) => {
    const result = await window.electronAPI.scoopUninstall(appName)
    if (result.code === 0) {
      loadInstalledApps()
    } else {
      window.electronAPI.showMessage({
        type: 'error',
        title: 'Uninstall Failed',
        message: result.stderr || 'Failed to uninstall ' + appName,
      })
    }
  }

  const handleUpdate = async (appName?: string) => {
    const result = await window.electronAPI.scoopUpdate(appName)
    if (result.code === 0) {
      loadInstalledApps()
      window.electronAPI.showMessage({
        type: 'info',
        title: 'Update Complete',
        message: appName ? `${appName} has been updated.` : 'All apps have been updated.',
      })
    } else {
      window.electronAPI.showMessage({
        type: 'error',
        title: 'Update Failed',
        message: result.stderr || 'Failed to update.',
      })
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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">Installed Apps</h1>
            <button
              onClick={() => handleUpdate()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
            >
              Update All
            </button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <AppList apps={apps} onUninstall={handleUninstall} onUpdate={handleUpdate} />
          )}
        </div>
      </main>
    </div>
  )
}
