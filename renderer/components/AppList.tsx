import { Trash2, RefreshCw, Info } from 'lucide-react'
import { InstalledApp } from '../lib/types'
import { cn } from '../lib/utils'

interface AppListProps {
  apps: InstalledApp[]
  onUninstall: (name: string) => void
  onUpdate: (name: string) => void
}

export default function AppList({ apps, onUninstall, onUpdate }: AppListProps) {
  if (apps.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No installed apps found.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      {apps.map((app) => (
        <div
          key={app.name}
          className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground">{app.name}</h3>
              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                {app.bucket}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Version: {app.version}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdate(app.name)}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
              title="Update"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => onUninstall(app.name)}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
              title="Uninstall"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
