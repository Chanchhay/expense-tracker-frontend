import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://expense-tracker-frontend-one-lake.vercel.app";
    return [
        { url: baseUrl, lastModified: new Date() },
    ];
}
