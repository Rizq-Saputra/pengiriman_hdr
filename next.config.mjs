/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.pravatar.cc',
            },
            {
                protocol: 'https',
                hostname: 'placehold.co',
                port: '',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5000',
                pathname: '/uploads/**',
            },
        ],
    },
};

export default nextConfig;
