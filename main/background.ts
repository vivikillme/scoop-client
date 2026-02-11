import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import * as path from 'path'
import { exec, spawn } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import { initDatabase, closeDatabase } from './database'

const execAsync = promisify(exec)

let mainWindow: BrowserWindow | null = null

// Get icon path based on platform and whether app is packaged
function getIconPath(): string | null {
  const resourcesPath = app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../resources')

  if (process.platform === 'win32') {
    const icoPath = path.join(resourcesPath, 'icon.ico')
    const pngPath = path.join(resourcesPath, 'icon.png')
    // Prefer ICO on Windows, fall back to PNG
    if (fs.existsSync(icoPath)) return icoPath
    if (fs.existsSync(pngPath)) return pngPath
  } else if (process.platform === 'darwin') {
    const icnsPath = path.join(resourcesPath, 'icon.icns')
    const pngPath = path.join(resourcesPath, 'icon.png')
    if (fs.existsSync(icnsPath)) return icnsPath
    if (fs.existsSync(pngPath)) return pngPath
  } else {
    const pngPath = path.join(resourcesPath, 'icon.png')
    if (fs.existsSync(pngPath)) return pngPath
  }
  return null
}

// Check if Scoop is installed
async function checkScoopInstalled(): Promise<boolean> {
  try {
    await execAsync('scoop --version')
    return true
  } catch {
    return false
  }
}

// Execute Scoop command
async function executeScoop(args: string[]): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    const proc = spawn('scoop', args, {
      shell: true,
      env: { ...process.env, LANG: 'en_US.UTF-8' },
    })

    let stdout = ''
    let stderr = ''

    proc.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    proc.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    proc.on('close', (code) => {
      resolve({ stdout, stderr, code: code ?? 0 })
    })
  })
}

function createWindow() {
  // Get icon path based on platform
  const iconPath = getIconPath()

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hiddenInset',
    frame: true,
    title: 'ScoopClient',
    ...(iconPath ? { icon: iconPath } : {}),
  })

  // Development mode - Nextron passes the port as an argument
  const isDev = !app.isPackaged
  if (isDev) {
    // Get port from command line (Nextron passes it as first arg after the app path)
    const port = process.argv[2] || '8888'
    mainWindow.loadURL(`http://localhost:${port}`)
    // mainWindow.webContents.openDevTools()
  } else {
    // In production, index.html is in the same directory as background.js (app/)
    mainWindow.loadFile(path.join(__dirname, 'index.html'))
  }

  mainWindow.setMenu(null);

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(async () => {
  // Initialize database (optional)
  try {
    initDatabase()
  } catch (error) {
    console.log('Database initialization skipped:', error)
  }

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  closeDatabase()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  closeDatabase()
})

// IPC Handlers
ipcMain.handle('check-scoop', async () => {
  return checkScoopInstalled()
})

ipcMain.handle('scoop-search', async (_, query: string) => {
  return executeScoop(['search', query])
})

ipcMain.handle('scoop-install', async (_, app: string) => {
  return executeScoop(['install', app])
})

ipcMain.handle('scoop-uninstall', async (_, app: string) => {
  return executeScoop(['uninstall', app])
})

ipcMain.handle('scoop-list', async () => {
  return executeScoop(['list'])
})

ipcMain.handle('scoop-update', async (_, app?: string) => {
  return executeScoop(['update', app || '*'])
})

ipcMain.handle('scoop-info', async (_, app: string) => {
  return executeScoop(['info', app])
})

ipcMain.handle('scoop-bucket-list', async () => {
  return executeScoop(['bucket', 'list'])
})

ipcMain.handle('scoop-bucket-add', async (_, name: string, repo?: string) => {
  const args = ['bucket', 'add', name]
  if (repo) args.push(repo)
  return executeScoop(args)
})

ipcMain.handle('scoop-bucket-rm', async (_, name: string) => {
  return executeScoop(['bucket', 'rm', name])
})

ipcMain.handle('scoop-reset', async (_, app: string) => {
  return executeScoop(['reset', app])
})

ipcMain.handle('scoop-cleanup', async (_, app?: string) => {
  return executeScoop(['cleanup', app || '*'])
})

ipcMain.handle('scoop-status', async () => {
  return executeScoop(['status'])
})

// Get installed versions for an app (for version switching)
ipcMain.handle('scoop-versions', async (_, appName: string) => {
  try {
    // Get scoop apps directory
    const homeDir = process.env.USERPROFILE || process.env.HOME
    if (!homeDir) {
      return { versions: [], currentVersion: '', error: 'Cannot determine home directory' }
    }

    const appsDir = path.join(homeDir, 'scoop', 'apps', appName)
    const currentLink = path.join(appsDir, 'current')

    // Check if app directory exists
    if (!fs.existsSync(appsDir)) {
      return { versions: [], currentVersion: '', error: 'App not found' }
    }

    // Get current version from 'current' symlink
    let currentVersion = ''
    try {
      if (fs.existsSync(currentLink)) {
        const currentTarget = fs.readlinkSync(currentLink)
        currentVersion = path.basename(currentTarget)
      }
    } catch (e) {
      // current might not be a symlink or not exist
    }

    // List all version directories
    const entries = fs.readdirSync(appsDir, { withFileTypes: true })
    const versions = entries
      .filter(entry => entry.isDirectory() && entry.name !== 'current')
      .map(entry => entry.name)
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true })) // Sort descending

    return { versions, currentVersion, error: null }
  } catch (error) {
    return { versions: [], currentVersion: '', error: String(error) }
  }
})

ipcMain.handle('open-external', async (_, url: string) => {
  shell.openExternal(url)
})

ipcMain.handle('show-message', async (_, options: { type: string; title: string; message: string }) => {
  if (mainWindow) {
    return dialog.showMessageBox(mainWindow, options)
  }
  return { response: 0 }
})
