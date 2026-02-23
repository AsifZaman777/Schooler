"use client";
import { Sidebar } from "./Sidebar";
import { LayoutDashboard, Users, CreditCard, CalendarCheck } from "lucide-react";

export function ParentSidebar() {
    return (
        <Sidebar
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
