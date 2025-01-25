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
                protocol: process.env.NEXT_PUBLIC_BACKEND_API_URL.startsWith('https') ? 'https' : 'http',
                hostname: new URL(process.env.NEXT_PUBLIC_BACKEND_API_URL).hostname,
                port: new URL(process.env.NEXT_PUBLIC_BACKEND_API_URL).port || '',
                pathname: '/uploads/**',
            },
        ],
    },
};

export default nextConfig;
