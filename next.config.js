/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        HUGGINGFACEHUB_API_KEY: process.env.HUGGINGFACEHUB_API_KEY,
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.resolve.alias.canvas = false
        config.resolve.alias.encoding = false
        return config
    },
}

module.exports = nextConfig
