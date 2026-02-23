"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon, ChevronDown } from "lucide-react";
import { useState } from "react";

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    badge?: string | number;
}

export interface NavGroup {
    label: string;
    icon: LucideIcon;
    items: NavItem[];
}

export type NavItemOrGroup = NavItem | NavGroup;

function isNavGroup(item: NavItemOrGroup): item is NavGroup {
    return 'items' in item;
}

interface SidebarProps {
    role: "admin" | "teacher" | "parent";
    navItems: NavItemOrGroup[];
    logo?: React.ReactNode;
}

export function Sidebar({ role, navItems, logo }: SidebarProps) {
    const pathname = usePathname();
    const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

    const roleLabel: Record<string, string> = {
        admin: "Administrator",
        teacher: "Teacher Portal",
        parent: "Parent Portal",
    };

    const toggleGroup = (label: string) => {
        setOpenGroups(prev => {
            const next = new Set(prev);
            if (next.has(label)) {
                next.delete(label);
            } else {
                next.add(label);
            }
            return next;
        });
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
                {navItems.map((item, index) => {
                    if (isNavGroup(item)) {
                        const isOpen = openGroups.has(item.label);
                        const hasActiveChild = item.items.some(child =>
                            pathname === child.href || (child.href !== `/${role}` && pathname.startsWith(child.href))
                        );

                        return (
                            <div key={index}>
                                <button
                                    onClick={() => toggleGroup(item.label)}
                                    className={cn(
                                        "sidebar-item w-full",
                                        hasActiveChild && "active"
                                    )}
                                >
                                    <item.icon size={16} />
                                    <span className="flex-1 text-left">{item.label}</span>
                                    <ChevronDown
                                        size={14}
                                        className={cn(
                                            "transition-transform duration-200",
                                            isOpen && "rotate-180"
                                        )}
                                    />
                                </button>
                                {isOpen && (
                                    <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-2">
                                        {item.items.map((child) => {
                                            const active = pathname === child.href || (child.href !== `/${role}` && pathname.startsWith(child.href));
                                            return (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className={cn("sidebar-item text-xs", active && "active")}
                                                >
                                                    <child.icon size={14} />
                                                    <span className="flex-1">{child.label}</span>
                                                    {child.badge !== undefined && (
                                                        <span className="ml-auto text-[10px] font-semibold bg-[--primary] text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                                                            {child.badge}
                                                        </span>
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    } else {
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
                    }
                })}
            </nav>

            {/* Bottom */}
            <div className="px-4 py-4 border-t border-white/10 text-[11px] text-[--sidebar-muted]">
                © {new Date().getFullYear()} Schooler
            </div>
        </aside>
    );
}
