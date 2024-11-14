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
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
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
    return config
  }
}

export default nextConfig
