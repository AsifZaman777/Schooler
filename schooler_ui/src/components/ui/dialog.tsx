"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export function Dialog({ open, onClose, title, description, children, className }: DialogProps) {
    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        if (open) document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            {/* panel */}
            <div className={cn("relative z-10 w-full max-w-lg rounded-[--radius-lg] bg-[--card] p-6 shadow-xl", className)}>
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-sm text-[--muted-foreground] hover:text-[--foreground] focus:outline-none"
                >
                    <X size={18} />
                </button>
                {title && <h2 className="text-base font-semibold text-[--foreground] mb-1">{title}</h2>}
                {description && <p className="text-sm text-[--muted-foreground] mb-4">{description}</p>}
                {children}
            </div>
        </div>
    );
}
