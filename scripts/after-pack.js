const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

// This script runs after electron-builder packs the app
// It rebuilds better-sqlite3 for the Electron ABI

module.exports = async function (context) {
  const { appOutDir, outDir, electronPlatformName } = context

  console.log('Running after-pack hook...')
  console.log('Platform:', electronPlatformName)
  console.log('Output directory:', appOutDir)

  // Determine Electron version
  const electronVersion = context.electronPlatformName
  console.log('Electron version:', electronVersion)

  // Get the path to better-sqlite3
  const betterSqlitePath = path.join(context.appOutDir, 'resources', 'app', 'node_modules', 'better-sqlite3')

  if (fs.existsSync(betterSqlitePath)) {
    console.log('Rebuilding better-sqlite3 for Electron ABI...')

    try {
      // Rebuild for the correct Electron ABI
      const electronDist = context.electronDist
      const electronVersion = context.electronVersion

      execSync(`npm rebuild better-sqlite3 --runtime=electron --target=${electronVersion} --disturl=https://electronjs.org/headers`, {
        cwd: betterSqlitePath,
        stdio: 'inherit'
      })

      console.log('better-sqlite3 rebuilt successfully')
    } catch (error) {
      console.error('Failed to rebuild better-sqlite3:', error.message)
      // Don't fail the build if this optional module fails
    }
  } else {
    console.log('better-sqlite3 not found, skipping rebuild')
  }
}
