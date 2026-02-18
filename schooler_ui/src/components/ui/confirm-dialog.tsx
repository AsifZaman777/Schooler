"use client";
import { Dialog } from "./dialog";
import { Button } from "./button";
import { TriangleAlert } from "lucide-react";

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
        <Dialog open={open} onClose={onClose} className="max-w-sm">
            <div className="flex flex-col items-center text-center gap-3 py-1">
                <span className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center">
                    <TriangleAlert size={22} className="text-[--danger]" />
                </span>
                <div>
                    <p className="text-[15px] font-semibold text-[--foreground]">{title}</p>
                    <p className="mt-1.5 text-sm text-[--muted-foreground] leading-relaxed">{message}</p>
                </div>
            </div>
            <div className="flex gap-2 mt-5">
                <Button variant="outline" size="sm" onClick={onClose} disabled={loading} className="flex-1">
                    Cancel
                </Button>
                <Button variant="danger" size="sm" onClick={onConfirm} disabled={loading} className="flex-1">
                    {loading ? "Deleting…" : "Delete"}
                </Button>
            </div>
        </Dialog>
    );
}
