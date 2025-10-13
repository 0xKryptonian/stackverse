/** @type {import('next').NextConfig} */
const nextConfig = {
    // Removed output: 'export' to allow server-side rendering
    // This fixes build issues with client-only components (Stacks wallet, wagmi remnants)
    env: {
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ik.imagekit.io',
                port: '',
                pathname: '/**/**',
            },
        ],
    },
    webpack: (config) => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    },
}

module.exports = nextConfig
