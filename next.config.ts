import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        unoptimized: true,
    },

    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination:
                    "https://expense-tracker-spring-boot-api-production.up.railway.app/api/:path*",
            },
            // 1. Proxy the authorization route
            {
                source: "/oauth2/:path*",
                destination:
                    "https://expense-tracker-spring-boot-api-production.up.railway.app/oauth2/:path*",
            },
            // 2. Proxy the callback route
            {
                source: "/login/oauth2/:path*",
                destination:
                    "https://expense-tracker-spring-boot-api-production.up.railway.app/login/oauth2/:path*",
            },
        ];
    },
};

export default nextConfig;
