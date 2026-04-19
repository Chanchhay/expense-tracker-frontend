"use client";

import { useState } from "react";
import { User, Mail, Shield, CheckCircle2, Edit2 } from "lucide-react";

import ProfileForm from "@/components/forms/profile-form";
import { PageContainer } from "@/components/shared/page-container";
import { useGetCurrentUserQuery } from "@/features/auth/auth-api";
import Loading from "@/components/shared/loading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

export default function ProfilePage() {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const {
        data: user,
        isLoading,
        isError,
    } = useGetCurrentUserQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    if (isLoading)
        return (
            <Loading
                title="Profile"
                description="Loading your profile details..."
            />
        );

    if (isError || !user) {
        return (
            <div className="p-8 text-center text-red-500 border border-red-100 rounded-lg bg-red-50 max-w-xl mx-auto mt-10">
                Failed to load profile data. Please try refreshing.
            </div>
        );
    }

    return (
        <PageContainer
            title="Personal Profile"
            description="Manage your identity and account preferences."
        >
            <div className="max-w-3xl mx-auto pb-8">
                {/* Centered Identity Card */}
                <Card className="rounded-lg shadow-sm border-muted/60 overflow-hidden">
                    {/* Decorative Gradient Banner */}
                    <div className="h-40 w-full bg-gradient-to-r from-primary/40 via-primary/20 to-transparent relative">
                        {/* Edit Button floats on the banner */}
                        <Button
                            onClick={() => setIsFormOpen(true)}
                            variant="secondary"
                            size="sm"
                            className="absolute top-4 right-4 rounded-md shadow-sm backdrop-blur-md bg-white/50 hover:bg-white/80 dark:bg-black/50 dark:hover:bg-black/80"
                        >
                            <Edit2 className="size-4 mr-2" /> Edit Profile
                        </Button>
                    </div>

                    <CardContent className="p-8 relative flex flex-col items-center text-center">
                        {/* Avatar Overlapping the Banner */}
                        <div className="relative -mt-20 mb-5 rounded-full border-[6px] border-background bg-background shadow-md overflow-hidden size-32 flex items-center justify-center">
                            {user.profile ? (
                                <Image
                                    src={user.profile}
                                    alt={user.name}
                                    className="h-full w-full object-cover"
                                    width={600}
                                    height={600}
                                />
                            ) : (
                                <div className="h-full w-full bg-muted flex items-center justify-center">
                                    <User className="size-12 text-muted-foreground/50" />
                                </div>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            {user.name || "Unknown User"}
                        </h2>
                        <p className="text-sm font-medium text-muted-foreground mt-1 flex items-center gap-1.5 justify-center">
                            <Shield className="size-4" />
                            {user.role || "USER"} Account
                        </p>

                        <div className="w-full max-w-md mt-8 pt-8 border-t border-muted/60 space-y-5 text-left">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Mail className="size-4" /> Email Address
                                </span>
                                <span className="font-semibold text-foreground truncate pl-4">
                                    {user.email || "Hidden"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <CheckCircle2 className="size-4" /> Account
                                    Status
                                </span>
                                <span className="font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                                    Active
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Profile Edit Modal */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[450px] rounded-lg border-muted/60 shadow-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            Edit Profile
                        </DialogTitle>
                        <DialogDescription>
                            Update your public display name and avatar.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="pt-2">
                        <ProfileForm
                            user={user}
                            onSuccess={() => setIsFormOpen(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </PageContainer>
    );
}
