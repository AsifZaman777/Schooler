"use client";
import { LayoutDashboard, Users, CreditCard, CalendarCheck } from "lucide-react";
import { AppSidebar } from "./Sidebar";

export function ParentSidebar() {
    return (
        <AppSidebar
            role="parent"
            navItems={[
                { label: "Dashboard", href: "/parent/dashboard", icon: LayoutDashboard },
                { label: "My Children", href: "/parent/children", icon: Users },
                { label: "Payments", href: "/parent/payments", icon: CreditCard },
                { label: "Attendance", href: "/parent/attendance", icon: CalendarCheck },
            ]}
        />
    );
}
