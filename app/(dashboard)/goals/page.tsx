"use client";

import { useState } from "react";
import { toast } from "sonner";

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
import Image from "next/image";

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

    const [editingGoal, setEditingGoal] = useState<SavingsGoalResponse | null>(
        null,
    );

    const handleDelete = async (id: string) => {
        try {
            await deleteGoal(id).unwrap();
            toast.success("Goal deleted successfully");

            if (editingGoal?.id === id) {
                setEditingGoal(null);
            }
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    if (isLoading) {
        return <div>Loading goals...</div>;
    }

    if (isError) {
        return <div>Failed to load goals.</div>;
    }

    return (
        <PageContainer
            title="Savings Goals"
            description="Mange ur Savings Goals"
        >
            <div className="space-y-6">
                <GoalForm
                    goal={editingGoal}
                    onSuccess={() => setEditingGoal(null)}
                />

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Goal List</h3>

                    {!goals || goals.length === 0 ? (
                        <p>No goals found.</p>
                    ) : (
                        <div className="space-y-4">
                            {goals.map((goal) => (
                                <div
                                    key={goal.id}
                                    className="border rounded-md p-4 space-y-4"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium">
                                                {goal.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Status: {goal.status}
                                            </p>
                                            <p className="text-sm">
                                                Target: {goal.targetAmount}
                                            </p>
                                            <p className="text-sm">
                                                Current: {goal.currentAmount}
                                            </p>
                                            <p className="text-sm">
                                                Remaining:{" "}
                                                {goal.remainingAmount}
                                            </p>
                                            <p className="text-sm">
                                                Saved: {goal.percentageSaved}%
                                            </p>
                                            {goal.deadline && (
                                                <p className="text-sm">
                                                    Deadline: {goal.deadline}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    setEditingGoal(goal)
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <DeleteConfirmDialog
                                                isLoading={isDeleting}
                                                title="Delete goal?"
                                                description={`This will permanently remove "${goal.name}".`}
                                                onConfirm={() =>
                                                    handleDelete(goal.id)
                                                }
                                                trigger={
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                    >
                                                        Delete
                                                    </Button>
                                                }
                                            />
                                        </div>
                                    </div>

                                    {goal.image && (
                                        <Image
                                            src={goal.image}
                                            alt={goal.name}
                                            width={400}
                                            height={400}
                                            className="h-32 w-32 rounded-md border object-cover"
                                        />
                                    )}

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <GoalProgressForm goal={goal} />
                                        <GoalStatusForm goal={goal} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    );
}
