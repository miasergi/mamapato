import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'mamapato.es' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['papaparse'],
  },
}

export default nextConfig
