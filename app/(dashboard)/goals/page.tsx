"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
    Plus,
    MoreVertical,
    Edit2,
    Trash2,
    Target,
    Calendar,
    TrendingUp,
    CheckCircle,
    Loader2,
} from "lucide-react";
import Image from "next/image";

import {
    useDeleteGoalMutation,
    useGetGoalsQuery,
} from "@/features/goals/goals-api";
import type { SavingsGoalResponse } from "@/features/goals/types";
import { getErrorMessage } from "@/lib/get-error-message";

import GoalForm from "@/components/forms/goal-form";
import GoalProgressForm from "@/components/forms/goal-progress-form";
import GoalStatusForm from "@/components/forms/goal-status-form";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page-container";
import DeleteConfirmDialog from "@/components/shared/delete-confirm-dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function GoalsPage() {
    const {
        data: goals,
        isLoading,
        isError,
    } = useGetGoalsQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    const [deleteGoal, { isLoading: isDeleting }] = useDeleteGoalMutation();

    // Dialog States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<SavingsGoalResponse | null>(
        null,
    );
    const [progressGoal, setProgressGoal] =
        useState<SavingsGoalResponse | null>(null);
    const [statusGoal, setStatusGoal] = useState<SavingsGoalResponse | null>(
        null,
    );
    const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        try {
            await deleteGoal(id).unwrap();
            toast.success("Goal deleted successfully");
            setGoalToDelete(null);
            if (editingGoal?.id === id) setEditingGoal(null);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleEdit = (goal: SavingsGoalResponse) => {
        setEditingGoal(goal);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setTimeout(() => setEditingGoal(null), 200);
    };

    return (
        <PageContainer
            title="Savings Goals"
            description="Track and manage your financial milestones."
        >
            <div className="space-y-6 pb-8">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold tracking-tight text-foreground">
                            Your Goals
                        </h3>
                        <span className="text-xs font-medium px-2.5 py-0.5 bg-muted rounded-md text-muted-foreground border border-muted-foreground/20">
                            {goals?.length || 0} Total
                        </span>
                    </div>

                    <Button
                        onClick={() => setIsFormOpen(true)}
                        className="rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 size-4" /> Add Goal
                    </Button>
                </div>

                {/* Grid Layout */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground border border-muted/60 rounded-lg bg-card shadow-sm">
                        <Loader2 className="size-8 animate-spin text-primary mb-4" />
                        <p className="font-medium">Loading your goals...</p>
                    </div>
                ) : isError ? (
                    <div className="p-8 text-center text-red-500 border border-red-100 rounded-lg bg-red-50">
                        Failed to load goals.
                    </div>
                ) : !goals || goals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border border-dashed border-muted/60 rounded-lg bg-transparent text-center">
                        <Target className="size-10 text-muted-foreground/50 mb-3" />
                        <p className="font-medium text-foreground">
                            No goals set yet.
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Start saving for your next milestone.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {goals.map((goal) => {
                            const isCompleted =
                                goal.percentageSaved >= 100 ||
                                goal.status === "COMPLETED";

                            return (
                                <Card
                                    key={goal.id}
                                    className="rounded-lg shadow-sm border-muted/60 overflow-hidden flex flex-col group"
                                >
                                    {/* Image Banner */}
                                    <div className="relative h-36 w-full bg-muted/30 border-b border-muted/60">
                                        {goal.image ? (
                                            <Image
                                                src={goal.image}
                                                alt={goal.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Target className="size-10 text-muted-foreground/30" />
                                            </div>
                                        )}
                                        {/* Status Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span
                                                className={`px-2.5 py-1 text-xs font-bold rounded-md shadow-sm backdrop-blur-md ${isCompleted ? "bg-green-500/90 text-white" : "bg-background/90 text-foreground"}`}
                                            >
                                                {goal.status}
                                            </span>
                                        </div>
                                    </div>

                                    <CardContent className="p-5 flex-1 flex flex-col relative z-10 bg-card">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h4 className="font-bold text-lg text-foreground leading-tight truncate pr-2">
                                                    {goal.name}
                                                </h4>
                                                {goal.deadline && (
                                                    <div className="flex items-center text-xs font-medium text-muted-foreground mt-1">
                                                        <Calendar className="size-3.5 mr-1.5" />
                                                        By {goal.deadline}
                                                    </div>
                                                )}
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-md -mr-2 text-muted-foreground hover:text-foreground"
                                                    >
                                                        <MoreVertical className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="rounded-md shadow-lg border-muted/60"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setProgressGoal(
                                                                goal,
                                                            )
                                                        }
                                                        className="rounded-sm cursor-pointer font-medium text-primary focus:text-primary"
                                                    >
                                                        <TrendingUp className="size-4 mr-2" />{" "}
                                                        Update Progress
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setStatusGoal(goal)
                                                        }
                                                        className="rounded-sm cursor-pointer"
                                                    >
                                                        <CheckCircle className="size-4 mr-2" />{" "}
                                                        Change Status
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleEdit(goal)
                                                        }
                                                        className="rounded-sm cursor-pointer"
                                                    >
                                                        <Edit2 className="size-4 mr-2" />{" "}
                                                        Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setGoalToDelete(
                                                                goal.id,
                                                            )
                                                        }
                                                        className="rounded-sm cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                                    >
                                                        <Trash2 className="size-4 mr-2" />{" "}
                                                        Delete Goal
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {/* Progress Section */}
                                        <div className="mt-auto pt-2 space-y-3">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-2xl font-bold tracking-tight text-foreground">
                                                        {goal.currentAmount.toLocaleString()}
                                                    </p>
                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        Saved of{" "}
                                                        {goal.targetAmount.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-primary">
                                                        {goal.percentageSaved}%
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${isCompleted ? "bg-green-500" : "bg-primary"}`}
                                                    style={{
                                                        width: `${Math.min(goal.percentageSaved, 100)}%`,
                                                    }}
                                                />
                                            </div>

                                            <p className="text-xs font-medium text-muted-foreground text-center">
                                                {goal.remainingAmount > 0
                                                    ? `${goal.remainingAmount.toLocaleString()} left to reach goal`
                                                    : "Goal Reached! 🎉"}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modals */}
            <Dialog
                open={isFormOpen}
                onOpenChange={(open) => !open && handleCloseForm()}
            >
                <DialogContent className="sm:max-w-[600px] rounded-lg border-muted/60 shadow-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            {editingGoal ? "Edit Goal" : "New Goal"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingGoal
                                ? "Update your milestone."
                                : "Set a new savings target."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="pt-2">
                        <GoalForm
                            goal={editingGoal}
                            onSuccess={handleCloseForm}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog
                open={!!progressGoal}
                onOpenChange={(open) => !open && setProgressGoal(null)}
            >
                <DialogContent className="sm:max-w-[400px] rounded-lg border-muted/60 shadow-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            Update Progress
                        </DialogTitle>
                        <DialogDescription>
                            Add funds to &quot;{progressGoal?.name}&quot;.
                        </DialogDescription>
                    </DialogHeader>
                    {progressGoal && (
                        <GoalProgressForm
                            goal={progressGoal}
                            onSuccess={() => setProgressGoal(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Dialog
                open={!!statusGoal}
                onOpenChange={(open) => !open && setStatusGoal(null)}
            >
                <DialogContent className="sm:max-w-[400px] rounded-lg border-muted/60 shadow-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            Change Status
                        </DialogTitle>
                        <DialogDescription>
                            Update the state of &quot;{statusGoal?.name}&quot;.
                        </DialogDescription>
                    </DialogHeader>
                    {statusGoal && (
                        <GoalStatusForm
                            goal={statusGoal}
                            onSuccess={() => setStatusGoal(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <DeleteConfirmDialog
                isOpen={!!goalToDelete}
                onOpenChange={(open) => !open && setGoalToDelete(null)}
                isLoading={isDeleting}
                title="Delete Goal?"
                description="This will permanently remove this savings goal. Your actual account balances will not be affected."
                onConfirm={() => {
                    if (goalToDelete) handleDelete(goalToDelete);
                }}
            />
        </PageContainer>
    );
}
