/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    buildActivity: false,
  },
  experimental: {
    serverActions: true,
    devTools: false,
  },
}

module.exports = nextConfig
