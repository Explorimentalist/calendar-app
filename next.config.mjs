import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/calendar-app' : '',
  distDir: 'out',
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './app'),
    }

    if (!isServer) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [fileURLToPath(import.meta.url)],
        },
        cacheDirectory: path.resolve(__dirname, '.next/cache/webpack'),
        name: dev ? 'development' : 'production',
        version: '1.0.0'
      }
    }

    return config
  },
}

export default nextConfig
