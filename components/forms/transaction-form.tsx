"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
    TransactionFormInput,
    transactionSchema,
    type TransactionFormValues,
} from "@/features/transactions/schema";
import {
    useCreateTransactionMutation,
    useUpdateTransactionMutation,
} from "@/features/transactions/transactions-api";
import type {
    TransactionResponse,
    TransactionType,
} from "@/features/transactions/types";
import { useGetAccountsQuery } from "@/features/accounts/accounts-api";
import { useGetCategoriesQuery } from "@/features/categories/categories-api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { UploadedImage } from "@/features/uploads/types";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MultiImagePicker from "@/components/shared/multi-image-picker";
import { uploadToCloudinary } from "@/lib/upload-to-cloudinary";

type Props = {
    transaction?: TransactionResponse | null;
    onSuccessAction?: () => void;
};

const transactionTypes: TransactionType[] = ["INCOME", "EXPENSE"];

function getToday() {
    return new Date().toISOString().split("T")[0];
}

export default function TransactionForm({ transaction, onSuccessAction }: Props) {
    const { data: accounts = [] } = useGetAccountsQuery();
    const { data: categories = [] } = useGetCategoriesQuery();

    const [createTransaction, { isLoading: isCreating }] =
        useCreateTransactionMutation();
    const [updateTransaction, { isLoading: isUpdating }] =
        useUpdateTransactionMutation();

    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<UploadedImage[]>([]);

    const [isUploadingImages, setIsUploadingImages] = useState(false);

    const form = useForm<TransactionFormInput, unknown, TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            amount: 0,
            type: "EXPENSE",
            accountId: "",
            categoryId: 0,
            date: getToday(),
            source: "",
            note: "",
        },
    });

    const selectedType = form.watch("type");

    const filteredCategories = useMemo(() => {
        return categories.filter((category) => category.type === selectedType);
    }, [categories, selectedType]);

    useEffect(() => {
        form.reset({
            amount: transaction?.amount ?? 0,
            type: transaction?.type ?? "EXPENSE",
            accountId: transaction?.accountId ?? "",
            categoryId: transaction?.categoryId ?? 0,
            date: transaction?.date ?? getToday(),
            source: transaction?.source ?? "",
            note: transaction?.note ?? "",
        });
        setExistingImages(transaction?.images ? [...transaction.images] : []);
        setNewFiles([]);
    }, [transaction?.id, form, transaction]);

    useEffect(() => {
        const currentCategoryId = form.getValues("categoryId");
        const stillValid = filteredCategories.some(
            (category) => category.id === Number(currentCategoryId),
        );

        if (!stillValid) {
            form.setValue("categoryId", 0);
        }
    }, [filteredCategories, form]);

    const getDefaultValues = () => ({
        amount: transaction?.amount ?? 0,
        type: transaction?.type ?? "EXPENSE",
        accountId: transaction?.accountId ?? "",
        categoryId: transaction?.categoryId ?? 0,
        date: transaction?.date ?? getToday(),
        source: transaction?.source ?? "",
        note: transaction?.note ?? "",
    });

    const handleRemoveExistingImage = (publicId: string) => {
        setExistingImages((prev) =>
            prev.filter((image) => image.imagePublicId !== publicId),
        );
    };

    const onSubmit = async (values: TransactionFormValues) => {
        try {
            setIsUploadingImages(true);

            const uploadedNewImages = await Promise.all(
                newFiles.map((file) => uploadToCloudinary(file)),
            );

            setIsUploadingImages(false);

            const mergedImages = [...existingImages, ...uploadedNewImages];
            const uniqueImages = mergedImages.filter(
                (img, i, arr) =>
                    arr.findIndex(
                        (x) => x.imagePublicId === img.imagePublicId,
                    ) === i,
            );

            const payload = {
                ...values,
                note: values.note?.trim() ? values.note : undefined,
                images: uniqueImages,
            };

            if (transaction) {
                await updateTransaction({
                    id: transaction.id,
                    body: payload,
                }).unwrap();
                toast.success("Transaction updated successfully");
            } else {
                await createTransaction(payload).unwrap();
                toast.success("Transaction created successfully");

                form.reset({
                    amount: 0,
                    type: "EXPENSE",
                    accountId: "",
                    categoryId: 0,
                    date: getToday(),
                    source: "",
                    note: "",
                });

                setExistingImages([]);
                setNewFiles([]);
            }

            onSuccessAction?.();
        } catch (error: unknown) {
            setIsUploadingImages(false);
            toast.error(getErrorMessage(error));
        }
    };

    const handleReset = () => {
        form.reset(getDefaultValues());

        setExistingImages(transaction?.images ? [...transaction.images] : []);

        setNewFiles([]);
    };

    // Include the image upload in the total submitting state
    const isSubmitting = isCreating || isUpdating || isUploadingImages;

    const selectedAccountId = form.watch("accountId");

    const selectedAccount = useMemo(() => {
        return accounts.find((account) => account.id === selectedAccountId);
    }, [accounts, selectedAccountId]);

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            onReset={handleReset}
            className="space-y-8 @container border p-4 rounded-md"
        >
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                    <p className="text-xl font-semibold">
                        {transaction
                            ? "Edit Transaction"
                            : "Create Transaction"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {transaction
                            ? "Update your transaction"
                            : "Add a new transaction"}
                    </p>
                </div>

                <Controller
                    control={form.control}
                    name="amount"
                    render={({ field, fieldState }) => (
                        <Field
                            className="col-span-12 md:col-span-6 flex flex-col gap-2"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Amount</FieldLabel>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="rounded-md border-muted/60 bg-background shadow-sm focus-visible:ring-primary/20"
                                value={
                                    typeof field.value === "string" ||
                                    typeof field.value === "number"
                                        ? field.value
                                        : ""
                                }
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    control={form.control}
                    name="type"
                    render={({ field, fieldState }) => (
                        <Field
                            className="col-span-12 md:col-span-6 flex flex-col gap-2"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Type</FieldLabel>
                            {/* 🛑 FIX: Added bg-background and text-foreground to select and options */}
                            <select
                                {...field}
                                className="w-full rounded-md border border-muted/60 bg-background text-foreground px-3 py-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                            >
                                {transactionTypes.map((type) => (
                                    <option key={type} value={type} className="bg-background text-foreground">
                                        {type}
                                    </option>
                                ))}
                            </select>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    control={form.control}
                    name="accountId"
                    render={({ field, fieldState }) => (
                        <Field
                            className="col-span-12 md:col-span-6 flex flex-col gap-2"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Account</FieldLabel>
                            <select
                                {...field}
                                className="w-full rounded-md border border-muted/60 bg-background text-foreground px-3 py-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                            >
                                <option value="" className="bg-background text-foreground">Select account</option>
                                {accounts.map((account) => (
                                    <option key={account.id} value={account.id} className="bg-background text-foreground">
                                        {account.name} ({account.currency})
                                    </option>
                                ))}
                            </select>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                            <div className="col-span-12 md:col-span-6">
                                <Field className="flex flex-col gap-2 mt-2">
                                    <FieldLabel>Currency</FieldLabel>
                                    <div className="w-full rounded-md border border-muted/60 px-3 py-2 bg-muted text-foreground shadow-sm">
                                        {selectedAccount?.currency ||
                                            "Select account first"}
                                    </div>
                                </Field>
                            </div>
                        </Field>
                    )}
                />

                <Controller
                    control={form.control}
                    name="categoryId"
                    render={({ field, fieldState }) => (
                        <Field
                            className="col-span-12 md:col-span-6 flex flex-col gap-2"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Category</FieldLabel>
                            <select
                                value={
                                    typeof field.value === "string" ||
                                    typeof field.value === "number"
                                        ? field.value
                                        : 0
                                }
                                onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                }
                                className="w-full rounded-md border border-muted/60 bg-background text-foreground px-3 py-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                            >
                                <option value={0} className="bg-background text-foreground">Select category</option>
                                {filteredCategories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                        className="bg-background text-foreground"
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    control={form.control}
                    name="date"
                    render={({ field, fieldState }) => (
                        <Field
                            className="col-span-12 md:col-span-6 flex flex-col gap-2"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Date</FieldLabel>
                            <Input
                                type="date"
                                className="rounded-md border-muted/60 bg-background shadow-sm focus-visible:ring-primary/20"
                                {...field}
                                max={getToday()}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    control={form.control}
                    name="source"
                    render={({ field, fieldState }) => (
                        <Field
                            className="col-span-12 md:col-span-6 flex flex-col gap-2"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Source</FieldLabel>
                            <Input
                                type="text"
                                placeholder="Salary, Food, Transport"
                                className="rounded-md border-muted/60 bg-background shadow-sm focus-visible:ring-primary/20"
                                {...field}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    control={form.control}
                    name="note"
                    render={({ field, fieldState }) => (
                        <Field
                            className="col-span-12 flex flex-col gap-2"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Note</FieldLabel>
                            <textarea
                                {...field}
                                placeholder="Optional note"
                                className="min-h-[100px] w-full rounded-md border border-muted/60 bg-background text-foreground px-3 py-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <div className="col-span-12 space-y-2">
                    <FieldLabel>Images</FieldLabel>
                    <MultiImagePicker
                        files={newFiles}
                        existingImages={existingImages}
                        onChange={setNewFiles}
                        onRemoveExisting={handleRemoveExistingImage}
                        maxFiles={5}
                    />
                </div>

                <div className="col-span-12 grid grid-cols-2 gap-3">
                    <Button type="reset" variant="outline" className="w-full">
                        {transaction ? "Reset" : "Clear"}
                    </Button>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isUploadingImages
                            ? "Uploading images..."
                            : isSubmitting
                                ? transaction
                                    ? "Updating..."
                                    : "Creating..."
                                : transaction
                                    ? "Update Transaction"
                                    : "Create Transaction"}
                    </Button>
                </div>

                {transaction && (
                    <div className="col-span-12">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={onSuccessAction}
                        >
                            Cancel Edit
                        </Button>
                    </div>
                )}
            </div>
        </form>
    );
}
