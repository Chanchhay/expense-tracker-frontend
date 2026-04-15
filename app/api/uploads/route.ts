import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { message: "File is required" },
                { status: 400 },
            );
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { message: "Only image files are allowed" },
                { status: 400 },
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise<{
            secure_url: string;
            public_id: string;
        }>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "expense-tracker",
                    resource_type: "image",
                },
                (error, result) => {
                    if (error || !result) {
                        reject(error ?? new Error("Upload failed"));
                        return;
                    }

                    resolve({
                        secure_url: result.secure_url,
                        public_id: result.public_id,
                    });
                },
            );

            stream.end(buffer);
        });

        return NextResponse.json({
            imageUrl: uploadResult.secure_url,
            imagePublicId: uploadResult.public_id,
        });
    } catch {
        return NextResponse.json(
            { message: "Failed to upload image" },
            { status: 500 },
        );
    }
}
