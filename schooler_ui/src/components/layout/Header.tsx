"use client";
import { Bell, Menu, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface HeaderProps {
    title: string;
    onMenuClick?: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    const userName = user?.name || user?.email || "User";
    const userRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "";
    const profileImage = user?.profile?.profileImage || user?.image;

    // Get initials from name
    const getInitials = (name: string) => {
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/login");
    };

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
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
                            {/* <Avatar size="sm">
                                {profileImage && <AvatarImage src={profileImage} alt={userName} />}
                                <AvatarFallback className="text-xs font-medium">
                                    {getInitials(userName)}
                                </AvatarFallback>
                            </Avatar> */}
                            {!isLoading && (
                                <div className="hidden sm:flex flex-col text-left">
                                    <span className="text-sm font-medium text-[--foreground] leading-tight">
                                        {userName}
                                    </span>
                                    {userRole && (
                                        <span className="text-xs text-[--muted-foreground] leading-tight">
                                            {userRole}
                                        </span>
                                    )}
                                </div>
                            )}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2" align="end">
                        <div className="flex flex-col gap-1">
                            <div className="px-3 py-2 border-b border-[--border]">
                                <p className="text-sm font-medium text-[--foreground]">{userName}</p>
                                <p className="text-xs text-[--muted-foreground]">{user?.email}</p>
                            </div>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-sm gap-2 text-[--danger] hover:text-[--danger] hover:bg-[--danger]/10"
                                onClick={handleLogout}
                            >
                                <LogOut size={16} />
                                Logout
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </header>
    );
}
