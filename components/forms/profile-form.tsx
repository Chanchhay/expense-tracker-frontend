"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { profileSchema, type ProfileFormValues } from "@/features/users/schema";
import { useUpdateProfileMutation } from "@/features/users/users-api";
import type { UserResponse } from "@/features/users/types";
import { getErrorMessage } from "@/lib/get-error-message";
import { uploadToCloudinary } from "@/lib/upload-to-cloudinary";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SingleImagePicker from "@/components/shared/single-image-picker";

type Props = {
    user: UserResponse;
};

export default function ProfileForm({ user }: Props) {
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();

    const [profileFile, setProfileFile] = useState<File | null>(null);
    const [existingProfileUrl, setExistingProfileUrl] = useState<string | null>(
        user.profile ?? null,
    );

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name ?? "",
        },
    });

    useEffect(() => {
        form.reset({
            name: user.name ?? "",
        });
    }, [user, form]);

    const onSubmit = async (values: ProfileFormValues) => {
        try {
            let profileUrl = existingProfileUrl ?? "";

            if (profileFile) {
                const uploaded = await uploadToCloudinary(profileFile);
                profileUrl = uploaded.imageUrl;
            }

            await updateProfile({
                name: values.name,
                profile: profileUrl,
            }).unwrap();

            toast.success("Profile updated successfully");
            setProfileFile(null);
            setExistingProfileUrl(profileUrl);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleReset = () => {
        form.reset({
            name: user.name ?? "",
        });
        setExistingProfileUrl(user.profile ?? null);
        setProfileFile(null);
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            onReset={handleReset}
            className="space-y-8 @container border p-4 rounded-md"
        >
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                    <p className="text-xl font-semibold">Update Profile</p>
                    <p className="text-sm text-muted-foreground">
                        Update your name and profile image
                    </p>
                </div>

                <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <Field
                            className="col-span-12 flex flex-col gap-2"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Name</FieldLabel>
                            <Input
                                type="text"
                                placeholder="Enter your name"
                                {...field}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <div className="col-span-12 space-y-2">
                    <FieldLabel>Profile Image</FieldLabel>
                    <SingleImagePicker
                        file={profileFile}
                        previewUrl={existingProfileUrl}
                        onChange={(file) => {
                            setProfileFile(file);

                            if (!file && existingProfileUrl) {
                                setExistingProfileUrl(null);
                            }
                        }}
                    />
                </div>

                <div className="col-span-12 grid grid-cols-2 gap-3">
                    <Button type="reset" variant="outline" className="w-full">
                        Reset
                    </Button>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating..." : "Update Profile"}
                    </Button>
                </div>
            </div>
        </form>
    );
}
