"use client";
import { Bell, Menu } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface HeaderProps {
    title: string;
    userName?: string;
    onMenuClick?: () => void;
}

export function Header({ title, userName = "Admin", onMenuClick }: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-5 bg-[--card] border-b border-[--border] shadow-sm">
            <div className="flex items-center gap-3">
                {onMenuClick && (
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
                        <Menu size={18} />
                    </Button>
                )}
                <h1 className="text-sm font-semibold text-[--foreground]">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell size={17} />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[--danger]" />
                </Button>
                <div className="flex items-center gap-2">
                    <Avatar name={userName} size="sm" />
                    <span className="text-sm font-medium text-[--foreground] hidden sm:block">{userName}</span>
                </div>
            </div>
        </header>
    );
}
