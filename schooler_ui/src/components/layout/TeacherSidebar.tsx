"use client";
import {
    Sidebar, SidebarContent, SidebarGroup,
    SidebarGroupContent, SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
    SidebarRail, SidebarTrigger,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Clock, CalendarCheck, FilePen } from "lucide-react";
import { AppSidebar } from "./Sidebar";

export function TeacherSidebar() {
    return (
        <AppSidebar
            role="teacher"
            navItems={[
                { label: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
                { label: "My Routines", href: "/teacher/routines", icon: Clock },
                { label: "Attendance", href: "/teacher/attendance", icon: CalendarCheck },
                { label: "Exams", href: "/teacher/exams", icon: FilePen },
            ]}
        />
    );
}
