import { useState, useEffect } from 'react'
import { Plus, Trash2, RefreshCw } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { Bucket, KnownBucket } from '../lib/types'
import { cn } from '../lib/utils'
import { ToastContainer } from '../components/Toast'
import { useToast } from '../hooks/useToast'

// Known Scoop buckets
const KNOWN_BUCKETS: KnownBucket[] = [
  { name: 'main', source: 'https://github.com/ScoopInstaller/Main', description: 'Default bucket for Scoop' },
  { name: 'extras', source: 'https://github.com/ScoopInstaller/Extras', description: 'Extra apps not in main' },
  { name: 'versions', source: 'https://github.com/ScoopInstaller/Versions', description: 'Alternative versions of apps' },
  { name: 'nights', source: 'https://github.com/ScoopInstaller/Nightly', description: 'Nightly builds' },
  { name: 'nirsoft', source: 'https://github.com/kodybrown/nirsoft', description: 'NirSoft utilities' },
  { name: 'php', source: 'https://github.com/ScoopInstaller/PHP', description: 'PHP versions' },
  { name: 'nerd-fonts', source: 'https://github.com/matthewjberger/scoop-nerd-fonts', description: 'Nerd Fonts' },
  { name: 'nonportable', source: 'https://github.com/TheRandomLabs/scoop-nonportable', description: 'Non-portable apps' },
  { name: 'java', source: 'https://github.com/ScoopInstaller/Java', description: 'Java versions' },
  { name: 'games', source: 'https://github.com/Calinou/scoop-games', description: 'Open source games' },
]

export default function BucketsPage() {
  const [buckets, setBuckets] = useState<Bucket[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newBucketName, setNewBucketName] = useState('')
  const [newBucketRepo, setNewBucketRepo] = useState('')
  const [processing, setProcessing] = useState<string | null>(null)
  const { toasts, closeToast, success, error, info } = useToast()

  useEffect(() => {
    loadBuckets()
  }, [])

  const loadBuckets = async () => {
    setLoading(true)
    try {
      const result = await window.electronAPI.scoopBucketList()
      if (result.code === 0 && result.stdout) {
        const parsedBuckets = parseBucketList(result.stdout)
        setBuckets(parsedBuckets)
      }
    } catch (error) {
      console.error('Failed to load buckets:', error)
    } finally {
      setLoading(false)
    }
  }

  const parseBucketList = (output: string): Bucket[] => {
    const lines = output.trim().split('\n')
    const buckets: Bucket[] = []

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('---') || trimmed.toLowerCase().includes('bucket')) {
        continue
      }

      // Parse: "bucket_name source_url"
      const parts = trimmed.split(/\s+/)
      if (parts.length >= 1) {
        buckets.push({
          name: parts[0],
          source: parts[1] || 'unknown',
        })
      }
    }

    return buckets
  }

  const handleAddBucket = async () => {
    if (!newBucketName.trim()) return

    setProcessing(newBucketName)
    try {
      const result = await window.electronAPI.scoopBucketAdd(
        newBucketName.trim(),
        newBucketRepo.trim() || undefined
      )
      if (result.code === 0) {
        loadBuckets()
        setShowAddDialog(false)
        setNewBucketName('')
        setNewBucketRepo('')
        success('Bucket Added', `${newBucketName} has been added successfully.`)
      } else {
        error('Add Bucket Failed', result.stderr || `Failed to add bucket ${newBucketName}`)
      }
    } catch (err) {
      console.error('Add bucket failed:', err)
      error('Add Bucket Failed', 'An unexpected error occurred')
    } finally {
      setProcessing(null)
    }
  }

  const handleRemoveBucket = async (name: string) => {
    setProcessing(name)
    try {
      const result = await window.electronAPI.scoopBucketRm(name)
      if (result.code === 0) {
        loadBuckets()
        success('Bucket Removed', `${name} has been removed successfully.`)
      } else {
        error('Remove Bucket Failed', result.stderr || `Failed to remove bucket ${name}`)
      }
    } catch (err) {
      console.error('Remove bucket failed:', err)
      error('Remove Bucket Failed', 'An unexpected error occurred')
    } finally {
      setProcessing(null)
    }
  }

  const handleAddKnownBucket = async (bucket: KnownBucket) => {
    if (buckets.some(b => b.name === bucket.name)) {
      info('Bucket Exists', `Bucket "${bucket.name}" is already added.`)
      return
    }

    setProcessing(bucket.name)
    try {
      const result = await window.electronAPI.scoopBucketAdd(bucket.name, bucket.source)
      if (result.code === 0) {
        loadBuckets()
        success('Bucket Added', `${bucket.name} has been added successfully.`)
      } else {
        error('Add Bucket Failed', result.stderr || `Failed to add bucket ${bucket.name}`)
      }
    } catch (err) {
      console.error('Add bucket failed:', err)
      error('Add Bucket Failed', 'An unexpected error occurred')
    } finally {
      setProcessing(null)
    }
  }

  const isBucketAdded = (name: string) => buckets.some(b => b.name === name)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">Buckets</h1>
            <div className="flex gap-2">
              <button
                onClick={loadBuckets}
                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowAddDialog(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                Add Bucket
              </button>
            </div>
          </div>

          {/* Add Bucket Dialog */}
          {showAddDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold text-foreground mb-4">Add Bucket</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Bucket Name</label>
                    <input
                      type="text"
                      value={newBucketName}
                      onChange={(e) => setNewBucketName(e.target.value)}
                      placeholder="e.g., extras"
                      className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Repository URL (optional)</label>
                    <input
                      type="text"
                      value={newBucketRepo}
                      onChange={(e) => setNewBucketRepo(e.target.value)}
                      placeholder="e.g., https://github.com/user/bucket"
                      className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => {
                      setShowAddDialog(false)
                      setNewBucketName('')
                      setNewBucketRepo('')
                    }}
                    className="px-4 py-2 text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBucket}
                    disabled={processing !== null || !newBucketName.trim()}
                    className={cn(
                      'px-4 py-2 rounded-md',
                      processing || !newBucketName.trim()
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:opacity-90'
                    )}
                  >
                    {processing ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Installed Buckets */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Installed Buckets</h2>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : buckets.length === 0 ? (
              <p className="text-muted-foreground">No buckets found.</p>
            ) : (
              <div className="grid gap-3">
                {buckets.map((bucket) => (
                  <div
                    key={bucket.name}
                    className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
                  >
                    <div>
                      <h3 className="font-medium text-foreground">{bucket.name}</h3>
                      <p className="text-sm text-muted-foreground">{bucket.source}</p>
                    </div>
                    {bucket.name !== 'main' && (
                      <button
                        onClick={() => handleRemoveBucket(bucket.name)}
                        disabled={processing === bucket.name}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Known Buckets */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Known Buckets</h2>
            <div className="grid gap-3">
              {KNOWN_BUCKETS.map((bucket) => {
                const added = isBucketAdded(bucket.name)
                return (
                  <div
                    key={bucket.name}
                    className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
                  >
                    <div>
                      <h3 className="font-medium text-foreground">{bucket.name}</h3>
                      <p className="text-sm text-muted-foreground">{bucket.description}</p>
                    </div>
                    <button
                      onClick={() => handleAddKnownBucket(bucket)}
                      disabled={added || processing === bucket.name}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-sm transition-colors',
                        added
                          ? 'bg-secondary text-secondary-foreground cursor-not-allowed'
                          : processing === bucket.name
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'bg-primary text-primary-foreground hover:opacity-90'
                      )}
                    >
                      {added ? 'Added' : processing === bucket.name ? 'Adding...' : 'Add'}
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </main>
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </div>
  )
}
