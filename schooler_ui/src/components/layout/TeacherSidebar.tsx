"use client";
import { Sidebar } from "./Sidebar";
import { LayoutDashboard, Clock, CalendarCheck, FilePen } from "lucide-react";

export function TeacherSidebar() {
    return (
        <Sidebar
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
