/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  distDir:
    process.env.NODE_ENV === 'production'
      ? '../app'
      : '.next',

  // Only use trailingSlash in production for static export
  trailingSlash: process.env.NODE_ENV === 'production',

  images: {
    unoptimized: true,
  },

  // Only use assetPrefix in production for static export
  assetPrefix: process.env.NODE_ENV === 'production' ? './' : '',
}

module.exports = nextConfig
