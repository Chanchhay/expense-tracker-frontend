import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const backendUrl = isDev
    ? "http://localhost:8080"
    : "https://expense-tracker-spring-boot-api-production.up.railway.app";

const nextConfig: NextConfig = {
    images: {
        unoptimized: true,
    },

    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${backendUrl}/api/v1/:path*`,
            },
            // 1. Proxy the authorization route
            {
                source: "/oauth2/:path*",
                destination: `${backendUrl}/oauth2/:path*`,
            },
            // 2. Proxy the callback route
            {
                source: "/login/oauth2/:path*",
                destination: `${backendUrl}/login/oauth2/:path*`,
            },
        ];
    },
};

export default nextConfig;
