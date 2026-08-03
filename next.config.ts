import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    const key = process.env.INDEXNOW_KEY
    if (!key) return []
    // IndexNow requires the key to be served at /<key>.txt — rewrite to the
    // route handler that reads the env var and serves it as plain text.
    return [{ source: `/${key}.txt`, destination: '/api/indexnow-key' }]
  },
  async redirects() {
    return [
      // Retired lake-lure/* activity pages — activity-first structure is canonical
      {
        source: '/lake-lure/boat-rentals',
        destination: '/things-to-do/boat-rentals',
        permanent: true,
      },
      {
        source: '/lake-lure/things-to-do',
        destination: '/things-to-do',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
