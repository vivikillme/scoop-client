import { useState } from 'react'
import { Download, ExternalLink } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import SearchBar from '../components/SearchBar'
import { SearchApp } from '../lib/types'
import { cn } from '../lib/utils'
import { ToastContainer } from '../components/Toast'
import { useToast } from '../hooks/useToast'

export default function SearchPage() {
  const [results, setResults] = useState<SearchApp[]>([])
  const [loading, setLoading] = useState(false)
  const { toasts, closeToast, success, error, info } = useToast()
  const [installing, setInstalling] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (query: string) => {
    setLoading(true)
    setSearched(true)
    try {
      const result = await window.electronAPI.scoopSearch(query)
      if (result.code === 0 && result.stdout) {
        const parsedResults = parseSearchResults(result.stdout)
        setResults(parsedResults)
      } else {
        setResults([])
      }
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const parseSearchResults = (output: string): SearchApp[] => {
    const lines = output.trim().split('\n')
    const apps: SearchApp[] = []

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('---') || trimmed.toLowerCase().includes('results')) {
        continue
      }

      // Parse: "name (bucket)" or "bucket/name"
      const bucketNameMatch = trimmed.match(/^(\S+)\s+\((\S+)\)/)
      const slashMatch = trimmed.match(/^(\S+)\/(\S+)/)

      if (bucketNameMatch) {
        apps.push({
          name: bucketNameMatch[1],
          bucket: bucketNameMatch[2],
        })
      } else if (slashMatch) {
        apps.push({
          name: slashMatch[2],
          bucket: slashMatch[1],
        })
      } else if (trimmed.includes(' ')) {
        const parts = trimmed.split(/\s+/)
        if (parts.length >= 2) {
          apps.push({
            name: parts[0],
            bucket: parts[1].replace(/[()]/g, ''),
          })
        }
      }
    }

    return apps
  }

  const handleInstall = async (appName: string, bucket?: string) => {
    const fullName = bucket ? `${bucket}/${appName}` : appName
    setInstalling(fullName)
    try {
      const result = await window.electronAPI.scoopInstall(fullName)
      if (result.code === 0) {
        success('Install Complete', `${appName} has been installed successfully.`)
      } else {
        error('Install Failed', result.stderr || `Failed to install ${appName}`)
      }
    } catch (err) {
      console.error('Install failed:', err)
      error('Install Failed', 'An unexpected error occurred')
    } finally {
      setInstalling(null)
    }
  }

  const handleShowInfo = async (appName: string, bucket?: string) => {
    const fullName = bucket ? `${bucket}/${appName}` : appName
    const result = await window.electronAPI.scoopInfo(fullName)
    if (result.code === 0) {
      info(appName, result.stdout)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-foreground mb-6">Search & Install</h1>

          <div className="mb-6">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search for apps..."
              isLoading={loading}
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {searched && results.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No results found.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {results.map((app, index) => {
                    const fullKey = `${app.bucket}/${app.name}`
                    const isInstalling = installing === fullKey
                    return (
                      <div
                        key={`${app.bucket}-${app.name}-${index}`}
                        className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground">{app.name}</h3>
                            <span className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded">
                              {app.bucket}
                            </span>
                          </div>
                          {app.description && (
                            <p className="text-sm text-muted-foreground mt-1">{app.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleShowInfo(app.name, app.bucket)}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                            title="Show Info"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleInstall(app.name, app.bucket)}
                            disabled={isInstalling}
                            className={cn(
                              'flex items-center gap-2 px-3 py-2 rounded-md transition-colors',
                              isInstalling
                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                : 'bg-primary text-primary-foreground hover:opacity-90'
                            )}
                          >
                            {isInstalling ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                                Installing...
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4" />
                                Install
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </div>
  )
}
