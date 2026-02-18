"use client";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePayments } from "@/hooks/usePayments";
import { useAttendance } from "@/hooks/useAttendance";
import { CreditCard, CalendarCheck, Users } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ParentDashboard() {
    const { payments, loading: pLoading } = usePayments();
    const { attendances, loading: aLoading } = useAttendance();

    const totalPaid = payments.filter((p) => p.status === "paid").reduce((acc, p) => acc + p.amount, 0);
    const presentDays = attendances.filter((a) => a.status === "present").length;
    const totalDays = attendances.length;

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
                            {pLoading ? <p className="text-sm text-[--muted-foreground]">Loading…</p> : (
                                <div className="space-y-2">
                                    {payments.slice(0, 5).map((p, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b border-[--border] last:border-0">
                                            <div>
                                                <p className="text-sm text-[--foreground]">{p.paymentType}</p>
                                                <p className="text-xs text-[--muted-foreground]">{formatDate(p.dueDate)}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-[--success]">{formatCurrency(p.amount)}</span>
                                                <Badge status={p.status} />
                                            </div>
                                        </div>
                                    ))}
                                    {payments.length === 0 && <p className="text-sm text-[--muted-foreground]">No payments found</p>}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Recent Attendance</CardTitle></CardHeader>
                        <CardContent>
                            {aLoading ? <p className="text-sm text-[--muted-foreground]">Loading…</p> : (
                                <div className="space-y-2">
                                    {attendances.slice(0, 5).map((a, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b border-[--border] last:border-0">
                                            <span className="text-sm text-[--foreground]">{formatDate(a.date)}</span>
                                            <Badge status={a.status} />
                                        </div>
                                    ))}
                                    {attendances.length === 0 && <p className="text-sm text-[--muted-foreground]">No records found</p>}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    );
}
