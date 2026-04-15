"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";

type Props = {
    file: File | null;
    previewUrl?: string | null;
    onChange: (file: File | null) => void;
};

export default function SingleImagePicker({
    file,
    previewUrl,
    onChange,
}: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const currentPreview = file ? URL.createObjectURL(file) : previewUrl;

    return (
        <div className="space-y-3">
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const selected = e.target.files?.[0] ?? null;
                    onChange(selected);
                    e.target.value = "";
                }}
            />

            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                >
                    Choose Image
                </Button>

                {(file || previewUrl) && (
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => onChange(null)}
                    >
                        Remove
                    </Button>
                )}
            </div>

            {currentPreview && (
                <img
                    src={currentPreview}
                    alt="Preview"
                    className="h-32 w-32 rounded-md border object-cover"
                />
            )}
        </div>
    );
}
