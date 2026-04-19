import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "https://expense-tracker-spring-boot-api-production.up.railway.app/api/:path*",
            },
        ];
    },
};

// next.config.js
module.exports = {
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
