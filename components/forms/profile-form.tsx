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
    onSuccess?: () => void;
};

export default function ProfileForm({ user, onSuccess }: Props) {
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();

    const [profileFile, setProfileFile] = useState<File | null>(null);
    const [existingProfileUrl, setExistingProfileUrl] = useState<string | null>(
        user.profile ?? null,
    );

    const [prevUserId, setPrevUserId] = useState<string | undefined>(user.id);

    if (user.id !== prevUserId) {
        setPrevUserId(user.id);
        setExistingProfileUrl(user.profile ?? null);
        setProfileFile(null);
    }

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

            onSuccess?.(); // Close modal on success
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                    <Field
                        className="flex flex-col gap-1.5"
                        data-invalid={fieldState.invalid}
                    >
                        <FieldLabel className="text-sm font-semibold text-foreground">
                            Display Name
                        </FieldLabel>
                        <Input
                            type="text"
                            placeholder="Enter your name"
                            className="rounded-md border-muted/60 bg-background shadow-sm focus-visible:ring-primary/20"
                            {...field}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <div className="space-y-2">
                <FieldLabel className="text-sm font-semibold text-foreground">
                    Profile Avatar
                </FieldLabel>
                <div className="rounded-md border border-dashed border-muted-foreground/30 bg-muted/10 p-4">
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
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-muted/60 mt-4">
                <Button
                    type="button"
                    variant="outline"
                    className="rounded-md font-medium"
                    disabled={isLoading}
                    onClick={onSuccess}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-md font-semibold shadow-sm"
                >
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}
