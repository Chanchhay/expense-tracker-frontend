import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        unoptimized: true,
    },

    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "https://expense-tracker-spring-boot-api-production.up.railway.app/api/:path*",
            },
        ];
    },
};

export default nextConfig;
