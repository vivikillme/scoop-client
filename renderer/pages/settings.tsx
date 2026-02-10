import { useState, useEffect } from 'react'
import { RefreshCw, Trash2, Info } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { InstalledApp } from '../lib/types'
import { cn } from '../lib/utils'

// Apps that commonly support version switching
const VERSION_MANAGED_APPS = ['openjdk', 'temurin', 'zulu', 'nodejs', 'nodejs-lts', 'python', 'go']

export default function SettingsPage() {
  const [apps, setApps] = useState<InstalledApp[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [versions, setVersions] = useState<string[]>([])
  const [loadingVersions, setLoadingVersions] = useState(false)
  const [resetting, setResetting] = useState<string | null>(null)

  useEffect(() => {
    loadApps()
  }, [])

  const loadApps = async () => {
    setLoading(true)
    try {
      const result = await window.electronAPI.scoopList()
      if (result.code === 0 && result.stdout) {
        const parsedApps = parseScoopList(result.stdout)
        // Filter to show version-managed apps
        const versionApps = parsedApps.filter(app =>
          VERSION_MANAGED_APPS.some(vma =>
            app.name.toLowerCase().includes(vma.toLowerCase())
          )
        )
        setApps(versionApps)
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

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('---') || trimmed.toLowerCase().includes('installed')) {
        continue
      }

      const match = trimmed.match(/^\s*(\S+)\s+(\S+)\s+(\S+)/)
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

  const loadAvailableVersions = async (appName: string) => {
    setLoadingVersions(true)
    setSelectedApp(appName)
    try {
      const result = await window.electronAPI.scoopInfo(appName)
      if (result.code === 0 && result.stdout) {
        // Parse versions from info output
        const versionMatch = result.stdout.match(/Description:(.|[\r\n])*?Installed:(.|[\r\n])*?/)
        // For now, we'll show the current version and a few common alternatives
        // In real implementation, we'd parse the installed versions directory
        const currentApp = apps.find(a => a.name === appName)
        if (currentApp) {
          setVersions([currentApp.version])
        }
      }
    } catch (error) {
      console.error('Failed to load versions:', error)
    } finally {
      setLoadingVersions(false)
    }
  }

  const handleReset = async (appName: string, version?: string) => {
    const resetArg = version ? `${appName}@${version}` : appName
    setResetting(resetArg)
    try {
      const result = await window.electronAPI.scoopReset(resetArg)
      if (result.code === 0) {
        window.electronAPI.showMessage({
          type: 'info',
          title: 'Reset Complete',
          message: `${appName} has been reset successfully.`,
        })
        loadApps()
      } else {
        window.electronAPI.showMessage({
          type: 'error',
          title: 'Reset Failed',
          message: result.stderr || `Failed to reset ${appName}`,
        })
      }
    } catch (error) {
      console.error('Reset failed:', error)
    } finally {
      setResetting(null)
    }
  }

  const handleCleanup = async () => {
    const result = await window.electronAPI.scoopCleanup()
    if (result.code === 0) {
      window.electronAPI.showMessage({
        type: 'info',
        title: 'Cleanup Complete',
        message: 'Old versions have been cleaned up.',
      })
    } else {
      window.electronAPI.showMessage({
        type: 'error',
        title: 'Cleanup Failed',
        message: result.stderr || 'Failed to cleanup old versions.',
      })
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-foreground mb-6">Settings & Version Management</h1>

          {/* Cleanup Section */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">System</h2>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Cleanup Old Versions</h3>
                  <p className="text-sm text-muted-foreground">
                    Remove old versions of apps to free up disk space
                  </p>
                </div>
                <button
                  onClick={handleCleanup}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
                >
                  <Trash2 className="w-4 h-4" />
                  Cleanup
                </button>
              </div>
            </div>
          </section>

          {/* Version Switching Section */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Version Switching</h2>
            <p className="text-muted-foreground mb-4">
              Manage versions for JDK, Node.js, Python, and other runtime environments.
            </p>

            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : apps.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-muted-foreground">
                  No version-managed apps found. Install JDK, Node.js, or Python to use this feature.
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {apps.map((app) => (
                  <div
                    key={app.name}
                    className="bg-card border border-border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">{app.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Current version: {app.version}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReset(app.name)}
                          disabled={resetting === app.name}
                          className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-md',
                            resetting === app.name
                              ? 'bg-muted text-muted-foreground cursor-not-allowed'
                              : 'bg-primary text-primary-foreground hover:opacity-90'
                          )}
                        >
                          {resetting === app.name ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                              Resetting...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4" />
                              Reset
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* About Section */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">About</h2>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="space-y-2">
                <p className="text-foreground"><strong>ScoopClient</strong> v1.0.0</p>
                <p className="text-muted-foreground">
                  A native desktop GUI client for Scoop package manager.
                </p>
                <button
                  onClick={() => window.electronAPI.openExternal('https://github.com/scoopinstaller/scoop')}
                  className="text-primary hover:underline"
                >
                  Learn more about Scoop
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
