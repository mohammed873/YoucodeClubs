module.exports = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.fallback = {fs : false ,  crypto: false , https : false , http : false , zlib : false,};
    return config
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}
