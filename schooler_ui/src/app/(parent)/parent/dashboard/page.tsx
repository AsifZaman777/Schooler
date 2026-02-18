"use client";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useApi } from "@/hooks/useApi";
import { CreditCard, CalendarCheck, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function ParentDashboard() {
    const { data: payments } = useApi<{ data: { amount: number; status: string }[] }>("/payments?limit=5");
    const { data: attendance } = useApi<{ data: { status: string }[] }>("/attendance?limit=100");

    const totalPaid = (payments?.data ?? []).filter((p) => p.status === "paid").reduce((acc, p) => acc + p.amount, 0);
    const presentDays = (attendance?.data ?? []).filter((a) => a.status === "present").length;
    const totalDays = (attendance?.data ?? []).length;

    return (
        <>
            <Header title="Parent Dashboard" userName="Parent" />
            <main className="p-5 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: "Total Paid", value: formatCurrency(totalPaid), icon: CreditCard, color: "text-[--success]", bg: "bg-green-50" },
                        { label: "Attendance", value: totalDays > 0 ? `${Math.round((presentDays / totalDays) * 100)}%` : "—", icon: CalendarCheck, color: "text-[--primary]", bg: "bg-blue-50" },
                        { label: "Children", value: "1", icon: Users, color: "text-[--warning]", bg: "bg-yellow-50" },
                    ].map((s) => (
                        <Card key={s.label}>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-[--muted-foreground]">{s.label}</p>
                                        <p className="text-2xl font-bold text-[--foreground] mt-1">{s.value}</p>
                                    </div>
                                    <span className={`h-11 w-11 rounded-xl flex items-center justify-center ${s.bg}`}>
                                        <s.icon size={22} className={s.color} />
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader><CardTitle>Recent Payments</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {(payments?.data ?? []).slice(0, 5).map((p, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-[--border] last:border-0">
                                        <span className="text-sm text-[--foreground]">Payment #{i + 1}</span>
                                        <span className="text-sm font-semibold text-[--success]">{formatCurrency(p.amount)}</span>
                                    </div>
                                ))}
                                {(payments?.data ?? []).length === 0 && <p className="text-sm text-[--muted-foreground]">No payments found</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Recent Attendance</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {(attendance?.data ?? []).slice(0, 5).map((a, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-[--border] last:border-0">
                                        <span className="text-sm text-[--foreground]">Day {i + 1}</span>
                                        <span className={`text-sm font-medium ${a.status === "present" ? "text-[--success]" : "text-[--danger]"}`}>{a.status}</span>
                                    </div>
                                ))}
                                {(attendance?.data ?? []).length === 0 && <p className="text-sm text-[--muted-foreground]">No records found</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    );
}
