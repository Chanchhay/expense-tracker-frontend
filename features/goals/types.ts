export type GoalStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export type SavingsGoalResponse = {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    remainingAmount: number;
    percentageSaved: number;
    deadline?: string;
    status: GoalStatus;
    createdAt: string;
    image?: string;
};

export type CreateSavingsGoalRequest = {
    name: string;
    targetAmount: number;
    deadline?: string;
    image?: string;
};

export type UpdateSavingsGoalRequest = {
    name: string;
    targetAmount: number;
    deadline?: string;
    image?: string;
};

export type UpdateSavingsGoalStatusRequest = {
    status: GoalStatus;
};

export type UpdateSavingsGoalProgressRequest = {
    currentAmount: number;
};
