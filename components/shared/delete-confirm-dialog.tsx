"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    onConfirm: () => void | Promise<void>;
};

export default function DeleteConfirmDialog({
    isOpen,
    onOpenChange,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    isLoading = false,
    onConfirm,
}: Props) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-[2rem] sm:rounded-[2rem] p-8 border-muted/60 shadow-xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-foreground">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base font-medium text-muted-foreground pt-2">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-6 gap-3 sm:gap-0">
                    <AlertDialogCancel
                        disabled={isLoading}
                        className="rounded-xl font-semibold border-muted/60 hover:bg-muted/30"
                    >
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isLoading}
                        onClick={(e) => {
                            e.preventDefault();
                            void onConfirm();
                        }}
                        className="rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 shadow-sm"
                    >
                        {isLoading ? "Deleting..." : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
