"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/useApi";
import { Attendance } from "@/types";
import { formatDate } from "@/lib/utils";

const columns: ColumnDef<Attendance, unknown>[] = [
    { id: "class", header: "Class", accessorFn: (r) => (r.class as { name?: string })?.name ?? String(r.class) },
    { id: "date", header: "Date", accessorFn: (r) => formatDate(r.date) },
    { id: "dayOfWeek", accessorKey: "dayOfWeek", header: "Day" },
    { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge status={String(getValue())} /> },
    { id: "remarks", accessorKey: "remarks", header: "Remarks" },
];

export default function ParentAttendancePage() {
    const { data, loading } = useApi<{ data: Attendance[] }>("/attendance");
    return (
        <>
            <Header title="Child Attendance" userName="Parent" />
            <main className="p-5 space-y-4">
                <h2 className="text-base font-semibold text-[--foreground]">Attendance Records</h2>
                {loading ? (
                    <div className="card p-10 text-center text-[--muted-foreground] text-sm">Loading…</div>
                ) : (
                    <DataTable data={data?.data ?? []} columns={columns} title="Attendance" exportFilename="parent-attendance" />
                )}
            </main>
        </>
    );
}
