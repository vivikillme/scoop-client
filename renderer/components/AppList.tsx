import { Trash2, RefreshCw, ArrowUp } from 'lucide-react'
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
          className={cn(
            "flex items-center justify-between p-4 bg-card rounded-lg border transition-colors",
            app.needsUpdate
              ? "border-yellow-500/50 hover:border-yellow-500"
              : "border-border hover:border-primary/50"
          )}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground">{app.name}</h3>
              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                {app.bucket}
              </span>
              {app.needsUpdate && (
                <span className="text-xs px-2 py-0.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  Update available
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-muted-foreground">
                Version: <span className="text-foreground">{app.version}</span>
              </span>
              {app.latestVersion && (
                <span className="text-sm text-muted-foreground">
                  Latest: <span className={cn(
                    "font-medium",
                    app.needsUpdate ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"
                  )}>{app.latestVersion}</span>
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {app.needsUpdate && (
              <button
                onClick={() => onUpdate(app.name)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-yellow-950 rounded-md hover:bg-yellow-400 transition-colors text-sm font-medium"
                title="Update"
              >
                <RefreshCw className="w-4 h-4" />
                Update
              </button>
            )}
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
