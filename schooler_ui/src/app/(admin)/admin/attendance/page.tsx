"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/useApi";
import { Attendance } from "@/types";
import { formatDate } from "@/lib/utils";

const columns: ColumnDef<Attendance, unknown>[] = [
    { id: "student", header: "Student", accessorFn: (r) => (r.student as { firstName?: string; lastName?: string })?.firstName ? `${(r.student as { firstName: string; lastName: string }).firstName} ${(r.student as { firstName: string; lastName: string }).lastName}` : String(r.student) },
    { id: "class", header: "Class", accessorFn: (r) => (r.class as { name?: string })?.name ?? String(r.class) },
    { id: "date", header: "Date", accessorFn: (r) => formatDate(r.date) },
    { id: "dayOfWeek", accessorKey: "dayOfWeek", header: "Day" },
    {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => <Badge status={String(getValue())} />,
    },
    { id: "remarks", accessorKey: "remarks", header: "Remarks" },
];

export default function AttendancePage() {
    const { data, loading } = useApi<{ data: Attendance[]; pagination: { total: number } }>("/attendance");
    return (
        <>
            <Header title="Attendance" />
            <main className="p-5 space-y-4">
                <div>
                    <h2 className="text-base font-semibold text-[--foreground]">Attendance Records</h2>
                    <p className="text-sm text-[--muted-foreground]">{data?.pagination?.total ?? 0} total records</p>
                </div>
                {loading ? (
                    <div className="card p-10 text-center text-[--muted-foreground] text-sm">Loading…</div>
                ) : (
                    <DataTable data={data?.data ?? []} columns={columns} title="Attendance Records" exportFilename="attendance" />
                )}
            </main>
        </>
    );
}
