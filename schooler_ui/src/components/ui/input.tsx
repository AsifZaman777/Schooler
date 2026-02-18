import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = "text", ...props }, ref) => (
        <input
            type={type}
            ref={ref}
            className={cn(
                "flex h-9 w-full rounded-[--radius] border border-[--border] bg-[--card] px-3 py-1 text-sm text-[--foreground] placeholder:text-[--muted-foreground] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none focus:ring-2 focus:ring-[--ring] disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    )
);
Input.displayName = "Input";
