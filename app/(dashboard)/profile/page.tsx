"use client";

import ProfileForm from "@/components/forms/profile-form";
import { PageContainer } from "@/components/shared/page-container";
import { useGetCurrentUserQuery } from "@/features/auth/auth-api";

export default function ProfilePage() {
    const {
        data: user,
        isLoading,
        isError,
    } = useGetCurrentUserQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    if (isLoading) {
        return <div>Loading profile...</div>;
    }

    if (isError || !user) {
        return <div>Failed to load profile.</div>;
    }

    return (
        <PageContainer title="Profile" description="Mange ur Profile">
            <div className="space-y-6">
                <ProfileForm user={user} />
            </div>
        </PageContainer>
    );
}
