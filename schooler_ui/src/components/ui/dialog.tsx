"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────────── */
interface DialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

/* ─── Main Dialog ─────────────────────────────────────────────────────────── */
export function Dialog({ open, onClose, title, description, children, className }: DialogProps) {
    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        if (open) {
            document.addEventListener("keydown", handler);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handler);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200"
                onClick={onClose}
            />
            {/* Panel */}
            <div
                className={cn(
                    "relative z-10 w-full max-w-lg",
                    "rounded-2xl border border-white/10",
                    "bg-white dark:bg-[--card]",
                    "shadow-[0_8px_40px_rgba(0,0,0,0.18)]",
                    "animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-200",
                    className
                )}
            >
                {/* Gradient accent line at top */}
                <div className="absolute top-0 left-8 right-8 h-px rounded-full bg-gradient-to-r from-transparent via-[--primary]/40 to-transparent" />

                {/* Header */}
                {(title || description) && (
                    <div className="px-6 pt-6 pb-4 border-b border-[--border]">
                        {title && (
                            <h2 className="text-[15px] font-semibold text-[--foreground] leading-tight pr-8">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="mt-1 text-sm text-[--muted-foreground]">{description}</p>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="px-6 py-5">{children}</div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className={cn(
                        "absolute right-4 top-4",
                        "h-7 w-7 rounded-lg flex items-center justify-center",
                        "text-[--muted-foreground] hover:text-[--foreground]",
                        "bg-transparent hover:bg-[--accent]",
                        "transition-all duration-150",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[--primary]/50"
                    )}
                    aria-label="Close"
                >
                    <X size={15} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}

/* ─── Composable Sub-components (Radix-style API) ────────────────────────── */

interface DialogRootProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

/** Composable root — wraps DialogContent + provides context */
export function DialogRoot({ open, onOpenChange, children }: DialogRootProps) {
    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onOpenChange(false); };
        if (open) {
            document.addEventListener("keydown", handler);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handler);
            document.body.style.overflow = "";
        };
    }, [open, onOpenChange]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200"
                onClick={() => onOpenChange(false)}
            />
            {children}
        </div>
    );
}

export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                "relative z-10 w-full max-w-lg",
                "rounded-2xl border border-white/10",
                "bg-white dark:bg-[--card]",
                "shadow-[0_8px_40px_rgba(0,0,0,0.18)]",
                "animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-200",
                className
            )}
        >
            <div className="absolute top-0 left-8 right-8 h-px rounded-full bg-gradient-to-r from-transparent via-[--primary]/40 to-transparent" />
            {children}
        </div>
    );
}

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("px-6 pt-6 pb-4 border-b border-[--border]", className)}>
            {children}
        </div>
    );
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <h2 className={cn("text-[15px] font-semibold text-[--foreground] leading-tight", className)}>
            {children}
        </h2>
    );
}

export function DialogDescription({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <p className={cn("mt-1 text-sm text-[--muted-foreground]", className)}>{children}</p>
    );
}

export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("px-6 py-4 border-t border-[--border] flex items-center justify-end gap-2", className)}>
            {children}
        </div>
    );
}

export function DialogClose({ onClose }: { onClose: () => void }) {
    return (
        <button
            onClick={onClose}
            className={cn(
                "absolute right-4 top-4",
                "h-7 w-7 rounded-lg flex items-center justify-center",
                "text-[--muted-foreground] hover:text-[--foreground]",
                "bg-transparent hover:bg-[--accent]",
                "transition-all duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[--primary]/50"
            )}
            aria-label="Close"
        >
            <X size={15} strokeWidth={2.5} />
        </button>
    );
}
