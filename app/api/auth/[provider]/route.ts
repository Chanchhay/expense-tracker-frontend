import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { provider: string } },
) {
    const isDev = process.env.NODE_ENV === "development";
    const backendUrl = isDev
        ? "http://localhost:8080"
        : "https://expense-tracker-spring-boot-api-production.up.railway.app";

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = isDev ? "http" : "https";

    const response = await fetch(
        `${backendUrl}/oauth2/authorization/${params.provider}`,
        {
            redirect: "manual",
            headers: {
                "X-Forwarded-Host": host,
                "X-Forwarded-Proto": protocol,
            },
        },
    );

    const setCookie = response.headers.get("set-cookie");
    const location = response.headers.get("location");

    if (!location) {
        return NextResponse.json(
            { error: "Failed to initialize OAuth flow" },
            { status: 500 },
        );
    }

    const html = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta http-equiv="refresh" content="0;url=${location}">
                <title>Redirecting to ${params.provider}...</title>
            </head>
            <body style="background: #111; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif;">
                <p>Connecting securely...</p>
            </body>
        </html>
    `;

    const nextResponse = new NextResponse(html, {
        status: 200,
        headers: { "Content-Type": "text/html" },
    });

    if (setCookie) {
        nextResponse.headers.set("Set-Cookie", setCookie);
    }

    return nextResponse;
}
