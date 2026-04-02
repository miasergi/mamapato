import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'mamapato.es' },
    ],
  },
  serverExternalPackages: ['papaparse'],
}

export default nextConfig
