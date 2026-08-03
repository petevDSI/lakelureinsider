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
