"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type Props = {
    files: File[];
    existingImages?: { imageUrl: string; imagePublicId: string }[];
    onChange: (files: File[]) => void;
    onRemoveExisting?: (publicId: string) => void;
    maxFiles?: number;
};

export default function MultiImagePicker({
    files,
    existingImages = [],
    onChange,
    onRemoveExisting,
    maxFiles = 5,
}: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const totalCount = files.length + existingImages.length;

    const handleSelect = (selectedFiles: FileList) => {
        const fileArray = Array.from(selectedFiles);
        const remainingSlots = maxFiles - totalCount;

        if (remainingSlots <= 0) return;

        onChange([...files, ...fileArray.slice(0, remainingSlots)]);
    };

    const removeNewFile = (index: number) => {
        onChange(files.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                    if (e.target.files?.length) {
                        handleSelect(e.target.files);
                    }
                    e.target.value = "";
                }}
            />

            <Button
                type="button"
                variant="outline"
                onClick={() => inputRef.current?.click()}
                disabled={totalCount >= maxFiles}
            >
                Choose Images
            </Button>

            {(existingImages.length > 0 || files.length > 0) && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {existingImages.map((image) => (
                        <div
                            key={image.imagePublicId}
                            className="space-y-2 rounded-md border p-2"
                        >
                            <Image
                                src={image.imageUrl}
                                alt="Existing"
                                className="h-28 w-full rounded-md object-cover"
                                width={600}
                                height={600}
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                className="w-full"
                                onClick={() =>
                                    onRemoveExisting?.(image.imagePublicId)
                                }
                            >
                                Remove
                            </Button>
                        </div>
                    ))}

                    {files.map((file, index) => (
                        <div
                            key={`${file.name}-${index}`}
                            className="space-y-2 rounded-md border p-2"
                        >
                            <Image
                                src={URL.createObjectURL(file)}
                                alt="Preview"
                                className="h-28 w-full rounded-md object-cover"
                                width={600}
                                height={600}
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                className="w-full"
                                onClick={() => removeNewFile(index)}
                            >
                                Remove
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
