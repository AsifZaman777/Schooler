"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    badge?: string | number;
}

interface SidebarProps {
    role: "admin" | "teacher" | "parent";
    navItems: NavItem[];
    logo?: React.ReactNode;
}

export function Sidebar({ role, navItems, logo }: SidebarProps) {
    const pathname = usePathname();

    const roleLabel: Record<string, string> = {
        admin: "Administrator",
        teacher: "Teacher Portal",
        parent: "Parent Portal",
    };

    return (
        <aside className="sidebar w-[--sidebar-width] flex-shrink-0 flex flex-col h-screen sticky top-0 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
                {logo ?? (
                    <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-[--primary] text-white font-bold text-sm">S</span>
                )}
                <div>
                    <span className="block text-sm font-bold text-white">Schooler</span>
                    <span className="block text-[10px] text-[--sidebar-muted] capitalize">{roleLabel[role]}</span>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5">
                {navItems.map((item) => {
                    const active = pathname === item.href || (item.href !== `/${role}` && pathname.startsWith(item.href));
                    return (
                        <Link key={item.href} href={item.href} className={cn("sidebar-item", active && "active")}>
                            <item.icon size={16} />
                            <span className="flex-1">{item.label}</span>
                            {item.badge !== undefined && (
                                <span className="ml-auto text-[10px] font-semibold bg-[--primary] text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="px-4 py-4 border-t border-white/10 text-[11px] text-[--sidebar-muted]">
                © {new Date().getFullYear()} Schooler
            </div>
        </aside>
    );
}
