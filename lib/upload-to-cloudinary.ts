import type { UploadedImage } from "@/features/uploads/types";

export async function uploadToCloudinary(file: File): Promise<UploadedImage> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary environment variables are missing");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
            method: "POST",
            body: formData,
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.error?.message || "Cloudinary upload failed");
    }

    return {
        imageUrl: data.secure_url,
        imagePublicId: data.public_id,
    };
}
