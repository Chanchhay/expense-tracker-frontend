import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Plutolio Finance Tracker",
        short_name: "Plutolio",
        description: "Track income and expenses with clarity.",
        start_url: "/",
        display: "standalone",
        background_color: "#0a0a0a",
        theme_color: "#34d399",
        icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
    };
}
