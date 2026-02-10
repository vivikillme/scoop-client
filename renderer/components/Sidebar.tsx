import { useRouter } from 'next/router'
import Link from 'next/link'
import { Package, Search, Database, Settings, RefreshCw } from 'lucide-react'
import { cn } from '../lib/utils'

const navItems = [
  { id: 'installed', label: 'Installed Apps', icon: Package, href: '/' },
  { id: 'search', label: 'Search & Install', icon: Search, href: '/search' },
  { id: 'buckets', label: 'Buckets', icon: Database, href: '/buckets' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
]

export default function Sidebar() {
  const router = useRouter()
  const currentPath = router.pathname

  // Normalize paths for comparison (remove trailing slash)
  const normalizePath = (path: string) => path.replace(/\/$/, '') || '/'

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg text-foreground">ScoopClient</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const normalizedHref = normalizePath(item.href)
            const normalizedCurrent = normalizePath(currentPath)
            const isActive = normalizedCurrent === normalizedHref ||
              (normalizedHref !== '/' && normalizedCurrent.startsWith(normalizedHref))
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          ScoopClient v1.0.0
        </p>
      </div>
    </aside>
  )
}
