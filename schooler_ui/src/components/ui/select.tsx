import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { value: string; label: string }[];
    placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, options, placeholder, ...props }, ref) => (
        <select
            ref={ref}
            className={cn(
                "flex h-9 w-full rounded-[--radius] border border-[--border] bg-[--card] px-3 py-1 text-sm text-[--foreground] focus:outline-none focus:ring-2 focus:ring-[--ring] disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    )
);
Select.displayName = "Select";
