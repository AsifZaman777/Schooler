"use client";
import { useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePayments } from "@/hooks/usePayments";
import { useAttendance } from "@/hooks/useAttendance";
import { useParents } from "@/hooks/useParents";
import { useAuth } from "@/hooks/useAuth";
import { CreditCard, CalendarCheck, Users } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { buildMonthlyChartData } from "@/utils/attendanceChart";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function ParentDashboard() {
    const { referenceId } = useAuth();
    const { children, childrenLoading, fetchChildren } = useParents({}, false);
    const { payments, loading: pLoading, fetchStudentPayments } = usePayments({}, false);
    const { attendances, loading: aLoading, fetchAttendances } = useAttendance({}, false);

    useEffect(() => {
        if (!referenceId) return;
        fetchChildren(referenceId).then((kids) => {
            if (kids.length > 0) {
                fetchStudentPayments(kids[0]._id);
                fetchAttendances({ studentId: kids[0]._id, limit: 200 });
            }
        });
    }, [referenceId, fetchChildren, fetchStudentPayments, fetchAttendances]);

    const totalPaid = payments.filter((p) => p.paymentStatus === "paid").reduce((acc, p) => acc + p.amount, 0);
    const presentDays = attendances.filter((a) => a.status === "present").length;
    const totalDays = attendances.length;

    const monthlyChartData = useMemo(() => buildMonthlyChartData(attendances), [attendances]);

    return (
        <>
            <Header title="Parent Dashboard" />
            <main className="p-5 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: "Total Paid", value: formatCurrency(totalPaid), icon: CreditCard, color: "text-[--success]", bg: "bg-green-50" },
                        { label: "Attendance", value: totalDays > 0 ? `${Math.round((presentDays / totalDays) * 100)}%` : "—", icon: CalendarCheck, color: "text-[--primary]", bg: "bg-blue-50" },
                        { label: "Children", value: childrenLoading ? "…" : String(children.length), icon: Users, color: "text-[--warning]", bg: "bg-yellow-50" },
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
                                                <Badge variant={p.paymentStatus === "paid" ? "default" : "secondary"}>{p.paymentStatus}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                    {payments.length === 0 && <p className="text-sm text-[--muted-foreground]">No payments found</p>}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Monthly Attendance</CardTitle></CardHeader>
                        <CardContent>
                            {aLoading ? (
                                <p className="text-sm text-[--muted-foreground]">Loading…</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={monthlyChartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                        <YAxis
                                            domain={[0, 100]}
                                            ticks={[0, 25, 50, 75, 100]}
                                            tickFormatter={(v) => `${v}%`}
                                            tick={{ fontSize: 10 }}
                                        />
                                        <Tooltip formatter={(v: unknown) => [`${v}%`, "Attendance Rate"]} />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="Attendance Rate"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            dot={{ r: 5 }}
                                            connectNulls={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    );
}

