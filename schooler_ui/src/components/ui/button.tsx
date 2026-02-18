import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "danger" | "success";
    size?: "sm" | "md" | "lg" | "icon";
}

const variantClasses: Record<string, string> = {
    default: "bg-[--primary] text-[--primary-foreground] hover:bg-[--primary-hover] shadow-sm",
    outline: "border border-[--border] bg-[--card] text-[--foreground] hover:bg-[--muted]",
    ghost: "text-[--foreground] hover:bg-[--muted]",
    danger: "bg-[--danger] text-white hover:opacity-90",
    success: "bg-[--success] text-white hover:opacity-90",
};

const sizeClasses: Record<string, string> = {
    sm: "h-7 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-11 px-6 text-base",
    icon: "h-9 w-9 p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "md", disabled, children, ...props }, ref) => (
        <button
            ref={ref}
            disabled={disabled}
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-[--radius] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
);
Button.displayName = "Button";
