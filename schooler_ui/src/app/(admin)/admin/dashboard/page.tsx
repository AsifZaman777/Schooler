"use client";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { GraduationCap, UserCheck, Briefcase, Clock, TrendingUp } from "lucide-react";
import type { DashboardStats } from "@/types";

const PIE_COLORS = ["#3b6ef8", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminDashboard() {
    const { stats, enrollmentRatio, attendanceRatio, paymentTable } = useDashboard();
    const overview = stats.data as DashboardStats | null;
    const enrollment = enrollmentRatio.data as { month: string; count: number }[] | null;
    const attendance = attendanceRatio.data as { name: string; value: number }[] | null;
    const incomeExpense = paymentTable.data as { month: string; income: number; expense: number }[] | null;
    const loading = stats.loading;

    const statCards = [
        { label: "Students Enrolled", value: overview?.studentsEnrolled ?? 0, icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Active Students", value: overview?.activeStudents ?? 0, icon: UserCheck, color: "text-green-500", bg: "bg-green-50" },
        { label: "Teachers", value: overview?.teachersEnrolled ?? 0, icon: Briefcase, color: "text-yellow-500", bg: "bg-yellow-50" },
        { label: "Classes Today", value: overview?.todaysClasses ?? 0, icon: Clock, color: "text-red-500", bg: "bg-red-50" },
    ];

    return (
        <>
            <Header title="Dashboard" />
            <main className="p-5 space-y-6">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {statCards.map((s) => (
                        <Card key={s.label}>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-[--muted-foreground]">{s.label}</p>
                                        <p className="text-2xl font-bold text-[--foreground] mt-1">
                                            {loading ? "—" : s.value.toLocaleString()}
                                        </p>
                                    </div>
                                    <span className={`h-11 w-11 rounded-xl flex items-center justify-center ${s.bg}`}>
                                        <s.icon size={22} className={s.color} />
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader><CardTitle>Enrollment Trend</CardTitle></CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={enrollment ?? []} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                                    <defs>
                                        <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b6ef8" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#3b6ef8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="count" stroke="#3b6ef8" fill="url(#enrollGrad)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Income vs Expense</CardTitle></CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={incomeExpense ?? []} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Legend wrapperStyle={{ fontSize: 11 }} />
                                    <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="Income" />
                                    <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader><CardTitle>Attendance Overview</CardTitle></CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie
                                        data={attendance ?? [{ name: "Present", value: 0 }, { name: "Absent", value: 0 }]}
                                        cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                                        dataKey="value" paddingAngle={3}
                                    >
                                        {(attendance ?? []).map((_: unknown, i: number) => (
                                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend wrapperStyle={{ fontSize: 11 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Active Student Ratio</CardTitle></CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie
                                        data={(enrollmentRatio.data as { name: string; value: number }[] | null) ?? []}
                                        cx="50%" cy="50%" outerRadius={75}
                                        dataKey="value" paddingAngle={3}
                                    >
                                        {((enrollmentRatio.data as { name: string; value: number }[] | null) ?? []).map((_: unknown, i: number) => (
                                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend wrapperStyle={{ fontSize: 11 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Quick Stats</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { label: "Total Students", value: overview?.studentsEnrolled, color: "text-blue-500" },
                                { label: "Active Teachers", value: overview?.activeTeachers, color: "text-green-500" },
                                { label: "Classes Today", value: overview?.todaysClasses, color: "text-yellow-500" },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center justify-between py-2 border-b border-[--border] last:border-0">
                                    <span className="text-sm text-[--muted-foreground]">{item.label}</span>
                                    <span className={`text-sm font-semibold ${item.color}`}>
                                        {loading ? "—" : (item.value ?? 0).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                            <div className="pt-2 flex items-center gap-2 text-sm text-[--muted-foreground]">
                                <TrendingUp size={14} className="text-green-500" />
                                <span>Live data from API</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    );
}