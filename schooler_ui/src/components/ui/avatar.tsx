import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
    name?: string;
    size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "h-7 w-7 text-xs", md: "h-9 w-9 text-sm", lg: "h-12 w-12 text-base" };

function getInitials(name?: string) {
    if (!name) return "?";
    return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

const colors = [
    "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500",
    "bg-pink-500", "bg-teal-500", "bg-indigo-500",
];

function colorFor(name?: string) {
    if (!name) return colors[0];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx];
}

export const Avatar = ({ name, size = "md", className, ...props }: AvatarProps) => (
    <span
        className={cn(
            "inline-flex items-center justify-center rounded-full font-semibold text-white",
            colorFor(name),
            sizeMap[size],
            className
        )}
        {...props}
    >
        {getInitials(name)}
    </span>
);
