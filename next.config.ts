import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [new URL(`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/**`)],
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production'
            ? { exclude: ['error', 'warn'] }
            : false,
    },
};

export default nextConfig;
