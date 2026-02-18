"use client";
import { Dialog } from "./dialog";
import { Button } from "./button";

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    loading?: boolean;
}

export function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title = "Confirm Delete",
    message = "Are you sure you want to delete this item? This action cannot be undone.",
    loading,
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} title={title}>
            <p className="text-sm text-[--muted-foreground] mb-5">{message}</p>
            <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="danger" size="sm" onClick={onConfirm} disabled={loading}>
                    {loading ? "Deleting…" : "Delete"}
                </Button>
            </div>
        </Dialog>
    );
}
