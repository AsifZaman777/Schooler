import * as React from "react";
import { cn, getStatusColor } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    status?: string;
    variant?: "default" | "outline";
}

export const Badge = ({ className, status, children, ...props }: BadgeProps) => (
    <span
        className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            status ? getStatusColor(status) : "bg-[--muted] text-[--muted-foreground]",
            className
        )}
        {...props}
    >
        {children ?? status}
    </span>
);
